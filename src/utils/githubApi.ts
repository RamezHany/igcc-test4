import type { News } from '@/interfaces/News';

// GitHub repository information
const GITHUB_REPO_OWNER = 'RamezHany';
const GITHUB_REPO_NAME = 'igcc-test4';
const GITHUB_BRANCH = 'main';

// News JSON file path
const NEWS_FILE_PATH = 'news.json';

// Cache settings
const CACHE_DURATION = 3600000; // 1 hour in milliseconds
let cachedNewsData: News[] | null = null;
let lastFetchTime = 0;

// Simple in-memory cache for individual news items
const newsItemCache: Record<string, {data: News, timestamp: number}> = {};

/**
 * Fetches news data from the GitHub repository
 * @returns Promise resolving to an array of news items
 */
export async function fetchNewsFromGitHub(): Promise<News[]> {
  try {
    const now = Date.now();
    const cacheValid = lastFetchTime > 0 && (now - lastFetchTime) < CACHE_DURATION;
    
    // Use cached data if available and valid
    if (cacheValid && cachedNewsData) {
      console.log('Using cached GitHub news data');
      return cachedNewsData;
    }
    
    console.log('Fetching fresh news data from GitHub');
    
    // Construct the raw content URL with fallback
    const githubRawUrl = getGithubRawUrl();
    
    // Create abort controller for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 seconds timeout
    
    // Fetch the news JSON file
    const response = await fetch(githubRawUrl, {
      headers: {
        'Cache-Control': 'no-cache'
      },
      signal: controller.signal
    });
    
    // Clear the timeout
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`GitHub API responded with status: ${response.status}`);
    }
    
    const jsonData = await response.json();
    
    // Extract news array from the JSON
    const newsData = jsonData.news || [];
    
    // Update cache
    cachedNewsData = newsData;
    lastFetchTime = now;
    
    return newsData;
  } catch (error: any) {
    console.error('Error fetching news from GitHub:', error);
    
    // If we have cached data, return it on timeout errors
    if (error.name === 'AbortError' && cachedNewsData) {
      console.warn('Fetch timeout - using cached data');
      return cachedNewsData;
    }
    
    // If nothing else works, return empty array instead of throwing
    if (error.name === 'AbortError') {
      console.warn('Fetch timeout - no cached data available');
      return [];
    }
    
    throw error;
  }
}

/**
 * Gets the GitHub raw URL for the news.json file
 * Ensures it works in both browser and Node.js environments
 */
function getGithubRawUrl(): string {
  return `https://raw.githubusercontent.com/${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}/${GITHUB_BRANCH}/${NEWS_FILE_PATH}`;
}

/**
 * Fetches a specific news item by slug from GitHub
 * @param slug The slug of the news item to fetch
 * @returns Promise resolving to a news item or null if not found
 */
export async function fetchNewsBySlug(slug: string): Promise<News | null> {
  try {
    // Create abort controller for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000); // 4 seconds timeout
    
    // Try first to get from specific cache mapping if available
    const slugCacheKey = `news_${slug}`;
    const cachedItem = getFromCache(slugCacheKey);
    if (cachedItem) {
      clearTimeout(timeoutId);
      return cachedItem;
    }
    
    // Fetch all news items
    const newsItems = await fetchNewsFromGitHub();
    
    // Find the news item with the matching slug
    const newsItem = newsItems.find(item => item.slug === slug);
    
    // Cache the result for future use if found
    if (newsItem) {
      saveToCache(slugCacheKey, newsItem);
    }
    
    // Clear the timeout
    clearTimeout(timeoutId);
    
    return newsItem || null;
  } catch (error: any) {
    console.error(`Error fetching news item with slug ${slug}:`, error);
    
    // If it's a timeout and we have cached data, try to get from cache
    if (error.name === 'AbortError') {
      console.warn(`Fetch timeout for slug ${slug} - trying cached news data`);
      
      const slugCacheKey = `news_${slug}`;
      const cachedItem = getFromCache(slugCacheKey);
      if (cachedItem) {
        return cachedItem;
      }
      
      // If we have cached news data, search through it
      if (cachedNewsData && cachedNewsData.length > 0) {
        return cachedNewsData.find(item => item.slug === slug) || null;
      }
    }
    
    return null; // Return null instead of throwing to prevent server crashes
  }
}

/**
 * Get a cached news item if valid
 */
function getFromCache(key: string): News | null {
  const cached = newsItemCache[key];
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }
  return null;
}

/**
 * Save a news item to cache
 */
function saveToCache(key: string, data: News): void {
  newsItemCache[key] = {
    data,
    timestamp: Date.now()
  };
}

/**
 * Processes news data based on the specified locale
 * @param newsData The news data to process
 * @param locale The locale to use for processing
 * @returns Processed news data
 */
export function processNewsDataByLocale(newsData: News[], locale: string): News[] {
  return newsData.map(item => {
    if (locale === 'ar') {
      return {
        ...item,
        title: item.title_ar || item.title,
        shortDescription: item.shortDescription_ar || item.shortDescription,
        description: item.description_ar || item.description
      };
    } else {
      return {
        ...item,
        // Keep English as default
      };
    }
  });
}

/**
 * Processes a single news item based on the specified locale
 * @param newsItem The news item to process
 * @param locale The locale to use for processing
 * @returns Processed news item
 */
export function processNewsItemByLocale(newsItem: News, locale: string): News {
  if (locale === 'ar') {
    return {
      ...newsItem,
      title: newsItem.title_ar || newsItem.title,
      shortDescription: newsItem.shortDescription_ar || newsItem.shortDescription,
      description: newsItem.description_ar || newsItem.description
    };
  } else {
    return {
      ...newsItem,
      // Keep English as default
    };
  }
} 