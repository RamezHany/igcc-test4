import { NextApiRequest, NextApiResponse } from 'next';
import type { News } from '@/interfaces/News';
import { fetchNewsFromGitHub, processNewsDataByLocale } from '@/utils/githubApi';

// Define the structure of our API response
interface NewsApiResponse {
  success: boolean;
  data?: News[];
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

    // Get locale from query parameters (default to English if not provided)
    const locale = req.query.locale as string || 'en';

    // Fetch news data from GitHub using our utility function
    const newsData = await fetchNewsFromGitHub();
    
    // Process news data based on locale
    const processedNewsData = processNewsDataByLocale(newsData, locale);

    return res.status(200).json({ success: true, data: processedNewsData });
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ success: false, error: 'Failed to fetch news data' });
  }
} 