import { NextApiRequest, NextApiResponse } from 'next';
import { fetchNewsFromGitHub } from '@/utils/githubApi';

// Secret key for security (should match with the key used in requests)
const API_SECRET = process.env.REVALIDATE_SECRET || 'my-secret-key';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // Check for POST method
    if (req.method !== 'POST') {
      return res.status(405).json({ success: false, message: 'Method not allowed' });
    }

    // Check for secret to confirm this is a valid request
    const { secret } = req.body;

    if (secret !== API_SECRET) {
      return res.status(401).json({ success: false, message: 'Invalid token' });
    }

    // Fetch all news to get updated slugs
    const news = await fetchNewsFromGitHub();
    
    // Paths to revalidate
    const pathsToRevalidate = [
      '/',
      '/all-news',
      '/news',
    ];
    
    // Add all article paths in both languages
    for (const newsItem of news) {
      pathsToRevalidate.push(`/news/${newsItem.slug}`);
      // Also revalidate language-specific paths if using i18n
      pathsToRevalidate.push(`/ar/news/${newsItem.slug}`);
      pathsToRevalidate.push(`/en/news/${newsItem.slug}`);
    }
    
    console.log(`Refreshing ${pathsToRevalidate.length} paths`);
    
    // Use a simpler approach for Next.js 12.1.5
    const host = req.headers.host || '';
    
    // Revalidate all paths by simply fetching them
    const revalidationResults = await Promise.allSettled(
      pathsToRevalidate.map(async (path) => {
        try {
          // Make a request to the page to refresh the cache
          await fetch(`https://${host}${path}`);
          return { path, success: true };
        } catch (error) {
          console.error(`Error refreshing ${path}:`, error);
          return { path, success: false, error: (error as Error).message };
        }
      })
    );
    
    // Count successes and failures
    const successful = revalidationResults.filter(
      result => result.status === 'fulfilled' && (result.value as any).success
    ).length;
    
    const failed = revalidationResults.filter(
      result => result.status === 'rejected' || !(result.value as any).success
    ).length;

    return res.json({
      success: true,
      revalidated: true,
      message: `Successfully refreshed ${successful} paths. Failed: ${failed}. Pages will be regenerated on next visit.`,
      date: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error in revalidation API:', error);
    return res.status(500).json({
      success: false,
      message: 'Error revalidating paths',
      error: (error as Error).message
    });
  }
} 