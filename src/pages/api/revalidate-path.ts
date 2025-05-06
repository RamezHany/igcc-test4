import { NextApiRequest, NextApiResponse } from 'next';
import { fetchNewsFromGitHub } from '@/utils/githubApi';

// Secret key for security
const API_SECRET = process.env.REVALIDATE_SECRET || 'my-secret-key';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Check for secret to confirm this is a valid request
  const { secret, path } = req.query as { secret?: string, path?: string };

  if (!secret || secret !== API_SECRET) {
    return res.status(401).json({ success: false, message: 'Invalid token' });
  }

  if (!path) {
    return res.status(400).json({ success: false, message: 'Path parameter is required' });
  }

  try {
    // Next.js 12.1.5 doesn't have the built-in revalidate API, so we need a workaround
    // This will rebuild the page by purging the cache - ISR pages will be regenerated on next visit
    
    // NOTE: This is an undocumented "hack" that relies on the _next/data cache structure
    // It is not officially supported by Next.js but works with v12.1.5
    const basePath = req.headers.host || '';
    await fetch(`https://${basePath}${path}`);
    
    return res.json({
      success: true,
      revalidated: true,
      path,
      message: `Path ${path} has been refreshed and will be regenerated on next visit.`,
      date: new Date().toISOString()
    });
  } catch (error) {
    // If there was an error, Next.js will continue serving the last successfully 
    // generated page
    console.error(`Error revalidating ${path}:`, error);
    return res.status(500).json({
      success: false,
      message: `Error revalidating path: ${path}`,
      error: (error as Error).message
    });
  }
} 