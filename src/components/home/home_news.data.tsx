import type { News } from '@/interfaces/News';

// Global cache for news data
export let dataNews: Array<News> = [];
let lastLoadedLocale: string = '';
let lastFetchTime: number = 0;
const CACHE_DURATION = 3600000; // 1 hour in milliseconds

// This function will be called to load the data
export async function loadNewsData(locale: string): Promise<News[]> {
    try {
        const now = Date.now();
        const cacheValid = lastFetchTime > 0 && (now - lastFetchTime) < CACHE_DURATION;
        
        // Use cached data if available and valid, and locale matches or we have data
        if (cacheValid && (locale === lastLoadedLocale || dataNews.length > 0)) {
            console.log(`Using cached news data for locale: ${locale}, items: ${dataNews.length}`);
            
            // If locale changed but we have cached data, process it for the new locale
            if (locale !== lastLoadedLocale && dataNews.length > 0) {
                console.log(`Processing cached data for new locale: ${locale}`);
                processLocaleData(locale);
                lastLoadedLocale = locale;
            }
            
            return dataNews;
        }
        
        console.log(`Fetching fresh news data for locale: ${locale}`);
        
        // Get the base URL for the API
        const protocol = typeof window !== 'undefined' ? window.location.protocol : 'http:';
        const host = typeof window !== 'undefined' ? window.location.host : 'localhost:3000';
        const baseUrl = `${protocol}//${host}`;
        
        // Use our API endpoint with locale
        const response = await fetch(`${baseUrl}/api/news?locale=${locale}`, {
            cache: 'no-cache' // Ensure we get fresh data when needed
        });
        
        if (!response.ok) {
            throw new Error(`Failed to fetch news data: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (!data.success || !data.data) {
            throw new Error('Invalid API response format');
        }
        
        // Update the shared data variable with the API response
        dataNews = data.data;
        
        lastLoadedLocale = locale;
        lastFetchTime = now;
        console.log(`News data loaded successfully for locale: ${locale}, items: ${dataNews.length}`);
        
        return dataNews;
    } catch (error) {
        console.error('Error loading news data:', error);
        
        // Fallback to direct GitHub fetch if API fails
        return fallbackToDirectFetch(locale);
    }
}

// Fallback function to fetch directly from GitHub if API fails
async function fallbackToDirectFetch(locale: string): Promise<News[]> {
    try {
        console.log('Falling back to direct GitHub fetch');
        
        const response = await fetch('https://raw.githubusercontent.com/RamezHany/igcc-test4/main/news.json', {
            cache: 'no-cache'
        });
        
        if (!response.ok) {
            throw new Error(`Failed to fetch news data: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Process the data based on locale
        dataNews = processNewsData(data.news, locale);
        
        lastLoadedLocale = locale;
        lastFetchTime = Date.now();
        console.log(`Fallback fetch successful, items: ${dataNews.length}`);
        
        return dataNews;
    } catch (error) {
        console.error('Fallback fetch failed:', error);
        return [];
    }
}

// Helper function to process news data based on locale
function processNewsData(newsData: any[], locale: string): News[] {
    return newsData.map((item: any) => {
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

// Process existing data for a new locale
function processLocaleData(locale: string): void {
    dataNews = processNewsData(dataNews, locale);
}

// Initial load of data (optional, can be removed if not needed)
if (typeof window !== 'undefined') {
    loadNewsData('en'); // Default to English
}
