import { NextApiRequest, NextApiResponse } from 'next';

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
    // This is the actual Next.js API to revalidate paths
    await res.revalidate(path as string);
    
    return res.json({
      success: true,
      revalidated: true,
      path,
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