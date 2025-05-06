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
    
    // Construct the raw content URL
    const githubRawUrl = `https://raw.githubusercontent.com/${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}/${GITHUB_BRANCH}/${NEWS_FILE_PATH}`;
    
    // Fetch the news JSON file
    const response = await fetch(githubRawUrl, {
      headers: {
        'Cache-Control': 'no-cache'
      }
    });
    
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
  } catch (error) {
    console.error('Error fetching news from GitHub:', error);
    throw error;
  }
}

/**
 * Fetches a specific news item by slug from GitHub
 * @param slug The slug of the news item to fetch
 * @returns Promise resolving to a news item or null if not found
 */
export async function fetchNewsBySlug(slug: string): Promise<News | null> {
  try {
    // Fetch all news items
    const newsItems = await fetchNewsFromGitHub();
    
    // Find the news item with the matching slug
    const newsItem = newsItems.find(item => item.slug === slug);
    
    return newsItem || null;
  } catch (error) {
    console.error(`Error fetching news item with slug ${slug}:`, error);
    throw error;
  }
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