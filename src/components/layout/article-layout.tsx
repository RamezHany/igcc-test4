import React, { FC, ReactNode } from 'react'
import Box from '@mui/material/Box'
import { Footer } from '@/components/footer'
import { Header } from '@/components/header'
import { defaultSEO, newsSEO } from '@/utils/seo.config'
import Head from 'next/head'
import { ArticleJsonLd, OrganizationJsonLd } from '@/components/seo/JsonLd'
import { format } from 'date-fns'

interface ArticleProps {
  children: ReactNode
  title: string
  description: string
  image: string
  date: string
  author: string
  slug: string
  modifiedDate?: string
}

const ArticleLayout: FC<ArticleProps> = ({ 
  children, 
  title, 
  description, 
  image, 
  date, 
  author, 
  slug,
  modifiedDate 
}) => {
  const formattedDate = format(new Date(date), 'yyyy-MM-dd')
  const formattedModifiedDate = modifiedDate ? format(new Date(modifiedDate), 'yyyy-MM-dd') : formattedDate
  const articleUrl = `${defaultSEO.openGraph.url}/news/${slug}`
  
  return (
    <Box component="div">
      <Head>
        <title>{title} | {defaultSEO.title}</title>
        <meta name="description" content={description} />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="article" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:site_name" content={defaultSEO.openGraph.site_name} />
        <meta property="og:url" content={articleUrl} />
        <meta property="og:image" content={image} />
        <meta property="article:published_time" content={formattedDate} />
        <meta property="article:modified_time" content={formattedModifiedDate} />
        <meta property="article:author" content={author} />
        
        {/* Twitter */}
        <meta name="twitter:card" content={defaultSEO.twitter.cardType} />
        <meta name="twitter:site" content={defaultSEO.twitter.site} />
        <meta name="twitter:creator" content={defaultSEO.twitter.handle} />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={image} />
        
        {/* Additional Meta Tags */}
        {defaultSEO.additionalMetaTags.map((tag, index) => (
          <meta key={index} name={tag.name} content={tag.content} />
        ))}
        
        {/* Canonical URL */}
        <link rel="canonical" href={articleUrl} />
        
        {/* Hreflang tags for language alternatives */}
        <link rel="alternate" href={articleUrl} hrefLang="en" />
        <link rel="alternate" href={`${defaultSEO.openGraph.url}/ar/news/${slug}`} hrefLang="ar" />
        <link rel="alternate" href={articleUrl} hrefLang="x-default" />
      </Head>
      
      {/* Structured data for SEO */}
      <OrganizationJsonLd />
      <ArticleJsonLd 
        url={articleUrl}
        title={title}
        images={[image]}
        datePublished={formattedDate}
        dateModified={formattedModifiedDate}
        authorName={author}
        description={description}
      />
      
      <Header />
      <Box component="main">{children}</Box>
      <Footer />
    </Box>
  )
}

export default ArticleLayout
