import { NextApiRequest, NextApiResponse } from 'next';
import type { News } from '@/interfaces/News';
import { fetchNewsBySlug, processNewsItemByLocale } from '@/utils/githubApi';

// Define the structure of our API response
interface NewsApiResponse {
  success: boolean;
  data?: News;
  error?: string;
}

// Set timeout for API operations
const API_TIMEOUT = 8000; // 8 seconds

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<NewsApiResponse>
) {
  // Start timeout timer
  const timeoutPromise = new Promise<void>((_, reject) => {
    setTimeout(() => reject(new Error('API Timeout')), API_TIMEOUT);
  });

  try {
    // Only allow GET requests
    if (req.method !== 'GET') {
      return res.status(405).json({ success: false, error: 'Method not allowed' });
    }

    // Get slug from the URL
    const { slug } = req.query;
    
    if (!slug || Array.isArray(slug)) {
      return res.status(400).json({ success: false, error: 'Invalid slug parameter' });
    }

    // Race between the actual fetch and the timeout
    const fetchPromise = (async () => {
      // Fetch news item by slug
      const newsItem = await fetchNewsBySlug(slug);
      
      // If no matching news item is found, return 404
      if (!newsItem) {
        return res.status(404).json({ success: false, error: 'News item not found' });
      }
      
      // Get locale from query parameters (default to English if not provided)
      const locale = req.query.locale as string || 'en';
      
      // Process news item based on locale
      const processedNewsItem = processNewsItemByLocale(newsItem, locale);

      return res.status(200).json({ success: true, data: processedNewsItem });
    })();

    // Wait for either fetch completion or timeout
    await Promise.race([fetchPromise, timeoutPromise]);
    
  } catch (error: any) {
    console.error('API Error:', error);
    
    // Check if this was a timeout error
    if (error.message === 'API Timeout') {
      return res.status(503).json({ 
        success: false, 
        error: 'The request took too long to process. Please try again.' 
      });
    }
    
    return res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch news data' 
    });
  }
} 