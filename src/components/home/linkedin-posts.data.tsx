import type { LinkedinPost } from '@/interfaces/LinkedinPost'

// Global cache for LinkedIn posts data
let linkedinPosts: Array<LinkedinPost> = [];
let lastFetchTime: number = 0;
const CACHE_DURATION = 3600000; // 1 hour in milliseconds

// This function will be called to load the data
export async function loadLinkedinPostsData(): Promise<LinkedinPost[]> {
    try {
        const now = Date.now();
        const cacheValid = lastFetchTime > 0 && (now - lastFetchTime) < CACHE_DURATION;
        
        // Use cached data if available and valid
        if (cacheValid && linkedinPosts.length > 0) {
            console.log(`Using cached LinkedIn posts data, items: ${linkedinPosts.length}`);
            return linkedinPosts;
        }
        
        console.log('Fetching fresh LinkedIn posts data');
        
        const response = await fetch('https://raw.githubusercontent.com/RamezHany/IGCCe-tr/refs/heads/main/linkedin-posts.json', {
            cache: 'no-cache' // Ensure we get fresh data when needed
        });
        
        if (!response.ok) {
            throw new Error(`Failed to fetch LinkedIn posts data: ${response.status}`);
        }
        
        const data = await response.json();
        linkedinPosts = data.linkedinPosts;
        lastFetchTime = now;
        
        console.log(`LinkedIn posts data loaded successfully, items: ${linkedinPosts.length}`);
        return linkedinPosts;
    } catch (error) {
        console.error('Error loading LinkedIn posts data:', error);
        return [];
    }
}

// Initial load of data
if (typeof window !== 'undefined') {
    loadLinkedinPostsData();
}

// Export the data
export { linkedinPosts };
