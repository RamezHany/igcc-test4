import { GetServerSideProps } from 'next'
import { format } from 'date-fns'

const SITE_URL = 'https://igcc-eg.com'

const generateSiteMap = (posts: any[], linkedinPosts: any[] = []) => {
  const today = format(new Date(), 'yyyy-MM-dd')
  
  return `<?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
     <!-- Main pages -->
     <url>
       <loc>${SITE_URL}</loc>
       <lastmod>${today}</lastmod>
       <changefreq>weekly</changefreq>
       <priority>1.0</priority>
       <xhtml:link rel="alternate" hreflang="en" href="${SITE_URL}" />
       <xhtml:link rel="alternate" hreflang="ar" href="${SITE_URL}/ar" />
     </url>
     <url>
       <loc>${SITE_URL}/all-news</loc>
       <lastmod>${today}</lastmod>
       <changefreq>weekly</changefreq>
       <priority>0.8</priority>
       <xhtml:link rel="alternate" hreflang="en" href="${SITE_URL}/all-news" />
       <xhtml:link rel="alternate" hreflang="ar" href="${SITE_URL}/ar/all-news" />
     </url>
     <url>
       <loc>${SITE_URL}/all-linkedin-posts</loc>
       <lastmod>${today}</lastmod>
       <changefreq>weekly</changefreq>
       <priority>0.8</priority>
       <xhtml:link rel="alternate" hreflang="en" href="${SITE_URL}/all-linkedin-posts" />
       <xhtml:link rel="alternate" hreflang="ar" href="${SITE_URL}/ar/all-linkedin-posts" />
     </url>
     <url>
       <loc>${SITE_URL}/summit</loc>
       <lastmod>${today}</lastmod>
       <changefreq>monthly</changefreq>
       <priority>0.9</priority>
       <xhtml:link rel="alternate" hreflang="en" href="${SITE_URL}/summit" />
       <xhtml:link rel="alternate" hreflang="ar" href="${SITE_URL}/ar/summit" />
     </url>
     
     <!-- News articles -->
     ${posts
       .map(({ slug, date }) => {
         const formattedDate = date ? format(new Date(date), 'yyyy-MM-dd') : today
         return `
       <url>
           <loc>${SITE_URL}/news/${slug}</loc>
           <lastmod>${formattedDate}</lastmod>
           <changefreq>monthly</changefreq>
           <priority>0.7</priority>
           <xhtml:link rel="alternate" hreflang="en" href="${SITE_URL}/news/${slug}" />
           <xhtml:link rel="alternate" hreflang="ar" href="${SITE_URL}/ar/news/${slug}" />
       </url>
     `
       })
       .join('')}
       
     <!-- LinkedIn posts -->
     ${linkedinPosts
       .map(({ id, date }) => {
         const formattedDate = date ? format(new Date(date), 'yyyy-MM-dd') : today
         return `
       <url>
           <loc>${SITE_URL}/linkedin-post/${id}</loc>
           <lastmod>${formattedDate}</lastmod>
           <changefreq>monthly</changefreq>
           <priority>0.6</priority>
           <xhtml:link rel="alternate" hreflang="en" href="${SITE_URL}/linkedin-post/${id}" />
           <xhtml:link rel="alternate" hreflang="ar" href="${SITE_URL}/ar/linkedin-post/${id}" />
       </url>
     `
       })
       .join('')}
   </urlset>
 `
}

function SiteMap() {
  // getServerSideProps will do the heavy lifting
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  try {
    // Fetch news data with caching
    const newsResponse = await fetch('https://raw.githubusercontent.com/RamezHany/IGCCe-tr/main/news.json', {
      cache: 'force-cache'
    });
    
    if (!newsResponse.ok) {
      throw new Error(`Failed to fetch news data: ${newsResponse.status}`);
    }
    
    const newsData = await newsResponse.json();
    
    // Fetch LinkedIn posts data with caching
    const linkedinResponse = await fetch('https://raw.githubusercontent.com/RamezHany/IGCCe-tr/main/linkedin.json', {
      cache: 'force-cache'
    }).catch(() => null);
    
    let linkedinPosts = [];
    if (linkedinResponse && linkedinResponse.ok) {
      const linkedinData = await linkedinResponse.json();
      linkedinPosts = linkedinData.posts || [];
    }
    
    // Generate sitemap with the news and LinkedIn data
    const sitemap = generateSiteMap(newsData.news || [], linkedinPosts);
    
    // Set cache control headers to improve performance
    res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=7200');
    res.setHeader('Content-Type', 'text/xml');
    res.write(sitemap);
    res.end();
    
    return {
      props: {},
    };
  } catch (error) {
    console.error('Error generating sitemap:', error);
    
    // Return a minimal sitemap in case of error
    const fallbackSitemap = generateSiteMap([]);
    
    res.setHeader('Content-Type', 'text/xml');
    res.write(fallbackSitemap);
    res.end();
    
    return {
      props: {},
    };
  }
}

export default SiteMap
