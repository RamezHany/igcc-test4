import { NextApiRequest, NextApiResponse } from 'next';
import type { News } from '@/interfaces/News';
import { fetchNewsBySlug, processNewsItemByLocale } from '@/utils/githubApi';

// Define the structure of our API response
interface NewsApiResponse {
  success: boolean;
  data?: News;
  error?: string;
  message?: string;
}

// Set timeout for API operations
const API_TIMEOUT = 8000; // 8 seconds

// Memory cache for API responses
const API_CACHE: Record<string, { data: NewsApiResponse, timestamp: number }> = {};
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour

// Store a list of non-existent slugs to avoid repeated lookups
const nonExistentSlugs = new Set<string>();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<NewsApiResponse>
) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    // Get slug from the URL and clean it
    let { slug } = req.query;
    
    if (!slug || Array.isArray(slug)) {
      return res.status(400).json({ success: false, error: 'Invalid slug parameter' });
    }

    // Remove any .json extension from the slug if present
    slug = slug.replace(/\.json$/, '');
    
    // Fast return for known non-existent slugs
    if (nonExistentSlugs.has(slug)) {
      return res.status(404).json({ 
        success: false, 
        error: 'News item not found',
        message: `Article with slug "${slug}" does not exist (cached result)` 
      });
    }
    
    // Get locale from query parameters (default to English if not provided)
    const locale = req.query.locale as string || 'en';
    
    // Create a cache key based on slug and locale
    const cacheKey = `${slug}_${locale}`;
    
    // Check if we have a cached response
    const cachedResponse = API_CACHE[cacheKey];
    if (cachedResponse && (Date.now() - cachedResponse.timestamp) < CACHE_DURATION) {
      // Return cached response
      console.log(`Using cached API response for ${cacheKey}`);
      return res.status(cachedResponse.data.success ? 200 : 404).json(cachedResponse.data);
    }

    // Start timeout timer
    let isTimeout = false;
    const timeoutPromise = new Promise<void>((_, reject) => {
      setTimeout(() => {
        isTimeout = true;
        reject(new Error('API Timeout'));
      }, API_TIMEOUT);
    });

    // Race between the actual fetch and the timeout
    try {
      await Promise.race([
        (async () => {
          // Fetch news item by slug
          const newsItem = await fetchNewsBySlug(slug);
          
          // If no matching news item is found, return 404
          if (!newsItem) {
            // Add to non-existent slugs list
            nonExistentSlugs.add(slug);
            
            const response: NewsApiResponse = { 
              success: false, 
              error: 'News item not found',
              message: `No article found with slug: ${slug}`
            };
            
            // Cache the 404 response too to avoid repeated lookups
            API_CACHE[cacheKey] = {
              data: response,
              timestamp: Date.now()
            };
            
            res.status(404).json(response);
            return;
          }
          
          // Process news item based on locale
          const processedNewsItem = processNewsItemByLocale(newsItem, locale);
          
          const response: NewsApiResponse = { success: true, data: processedNewsItem };
          
          // Cache the successful response
          API_CACHE[cacheKey] = {
            data: response,
            timestamp: Date.now()
          };

          res.status(200).json(response);
        })(),
        timeoutPromise
      ]);
    } catch (innerError) {
      if (isTimeout) {
        // If we timed out, return a 503 Service Unavailable
        res.status(503).json({ 
          success: false, 
          error: 'The request took too long to process',
          message: 'API timeout occurred. This might be a temporary issue.'
        });
      } else {
        // Re-throw other errors to be caught by the outer try-catch
        throw innerError;
      }
    }
  } catch (error: any) {
    console.error('API Error:', error);
    
    return res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch news data',
      message: error.message
    });
  }
} 