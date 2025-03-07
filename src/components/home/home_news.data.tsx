import type { News } from '@/interfaces/News';

// Global cache for news data
let dataNews: Array<News> = [];
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
                dataNews = processNewsData(dataNews, locale);
                lastLoadedLocale = locale;
            }
            
            return dataNews;
        }
        
        console.log(`Fetching fresh news data for locale: ${locale}`);
        
        // Use direct GitHub URL since we know the structure
        const response = await fetch('https://raw.githubusercontent.com/RamezHany/IGCCe-tr/refs/heads/main/news.json', {
            cache: 'no-cache' // Ensure we get fresh data when needed
        });
        
        if (!response.ok) {
            throw new Error(`Failed to fetch news data: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Process the data based on locale
        dataNews = processNewsData(data.news, locale);
        
        lastLoadedLocale = locale;
        lastFetchTime = now;
        console.log(`News data loaded successfully for locale: ${locale}, items: ${dataNews.length}`);
        
        return dataNews;
    } catch (error) {
        console.error('Error loading news data:', error);
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

// Initial load of data (optional, can be removed if not needed)
if (typeof window !== 'undefined') {
    loadNewsData('en'); // Default to English
}

export { dataNews };