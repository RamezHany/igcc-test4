import { NextApiRequest, NextApiResponse } from 'next';
import type { News } from '@/interfaces/News';
import { fetchNewsBySlug, processNewsItemByLocale } from '@/utils/githubApi';

// Define the structure of our API response
interface NewsApiResponse {
  success: boolean;
  data?: News;
  error?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<NewsApiResponse>
) {
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
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ success: false, error: 'Failed to fetch news data' });
  }
} 