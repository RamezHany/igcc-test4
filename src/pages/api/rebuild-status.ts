import { NextApiRequest, NextApiResponse } from 'next';

// Simple in-memory store for rebuild info
interface RebuildInfo {
  lastRebuild: number;
  buildCount: number;
  cachedSlugs: string[];
}

// Global rebuild info (will reset on server restart)
const rebuildInfo: RebuildInfo = {
  lastRebuild: Date.now(),
  buildCount: 0,
  cachedSlugs: []
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  // Add slug to cache if provided
  if (req.query.registerSlug && typeof req.query.registerSlug === 'string') {
    const slug = req.query.registerSlug;
    if (!rebuildInfo.cachedSlugs.includes(slug)) {
      rebuildInfo.cachedSlugs.push(slug);
    }
  }

  // Increment build count if triggered
  if (req.query.triggerRebuild === 'true') {
    rebuildInfo.lastRebuild = Date.now();
    rebuildInfo.buildCount++;
  }

  // Return current build info
  return res.status(200).json({
    success: true,
    data: {
      ...rebuildInfo,
      lastRebuildFormatted: new Date(rebuildInfo.lastRebuild).toLocaleString(),
      currentTime: Date.now(),
      currentTimeFormatted: new Date().toLocaleString(),
      uptime: process.uptime(),
      nodeEnv: process.env.NODE_ENV || 'unknown',
      nextVersion: process.env.NEXT_PUBLIC_VERSION || process.env.npm_package_version || 'unknown'
    }
  });
} 