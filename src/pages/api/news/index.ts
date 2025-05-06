import { NextApiRequest, NextApiResponse } from 'next';
import type { News } from '@/interfaces/News';
import { fetchNewsFromGitHub, processNewsDataByLocale } from '@/utils/githubApi';

// Define the structure of our API response
interface NewsApiResponse {
  success: boolean;
  data?: News[];
  count?: number;
  error?: string;
}

// Cache settings
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour
let cachedNewsData: { locale: string, data: News[] } | null = null;
let lastFetchTime = 0;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<NewsApiResponse>
) {
  // Set CORS headers for public API
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Cache-Control', 'public, max-age=3600, stale-while-revalidate=7200');

  try {
    // Only allow GET requests
    if (req.method !== 'GET') {
      return res.status(405).json({ success: false, error: 'Method not allowed' });
    }

    // Force refresh parameter - if ?refresh=true, bypass cache
    const forceRefresh = req.query.refresh === 'true';
    
    // Get locale from query parameters (default to English if not provided)
    const locale = req.query.locale as string || 'en';
    
    // Check if we have cached data for this locale
    const now = Date.now();
    const cacheValid = !forceRefresh && lastFetchTime > 0 && (now - lastFetchTime) < CACHE_DURATION && 
                      cachedNewsData && cachedNewsData.locale === locale;
    
    // Use cached data if available and valid
    if (cacheValid && cachedNewsData) {
      console.log('Using cached news data');
      return res.status(200).json({ 
        success: true, 
        data: cachedNewsData.data,
        count: cachedNewsData.data.length 
      });
    }
    
    console.log('Fetching fresh news data');
    
    // Fetch all news items
    const newsItems = await fetchNewsFromGitHub();
    
    // Process news data based on locale
    const processedNewsData = processNewsDataByLocale(newsItems, locale);
    
    // Sort by date (newest first)
    processedNewsData.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateB.getTime() - dateA.getTime();
    });
    
    // Update cache
    cachedNewsData = {
      locale,
      data: processedNewsData
    };
    lastFetchTime = now;
    
    return res.status(200).json({ 
      success: true, 
      data: processedNewsData,
      count: processedNewsData.length 
    });
  } catch (error: any) {
    console.error('API Error:', error);
    
    // If we have cached data and there's an error, use the cached data as fallback
    if (cachedNewsData) {
      return res.status(200).json({ 
        success: true, 
        data: cachedNewsData.data,
        count: cachedNewsData.data.length 
      });
    }
    
    return res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch news data' 
    });
  }
} 