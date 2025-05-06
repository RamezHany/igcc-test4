# IGCC Website

This is the repository for the IGCC (International Governance Consulting Center) website.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Adding New News Articles

To add new news articles to the website:

1. Edit `news.json` in the repository to add your new article entry
2. Make sure to include all required fields (id, slug, title, title_ar, shortDescription, shortDescription_ar, description, description_ar, image, date)
3. Push your changes to the repository

### Seeing New Articles on the Live Site

After adding new articles to `news.json`, you need to:

1. Wait for the automatic rebuild (up to 60 seconds), or
2. Visit the main news page directly: [https://your-site.vercel.app/all-news?refresh=true](https://your-site.vercel.app/all-news?refresh=true)

The `refresh=true` parameter ensures the latest articles are fetched from the repository.

## Important Note About Articles

- Each article must have a unique `slug`
- Image URLs should be full paths to images (preferably hosted on GitHub or another CDN)
- The Arabic version of titles and descriptions is required for proper multilingual support 