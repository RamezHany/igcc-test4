import React from 'react';
import Head from 'next/head';

interface OrganizationJsonLdProps {
  url?: string;
  logo?: string;
  name?: string;
}

export const OrganizationJsonLd: React.FC<OrganizationJsonLdProps> = ({
  url = 'https://igcc-eg.com',
  logo = 'logo-2.png',
  name = 'IGCC - International Governance and Compliance Consulting',
}) => {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    url,
    logo,
    name,
    sameAs: [
      'https://www.facebook.com/igcc',
      'https://www.linkedin.com/company/igcc',
      'https://twitter.com/igcc',
    ],
  };

  return (
    <Head>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
      />
    </Head>
  );
};

interface WebsiteJsonLdProps {
  url?: string;
  name?: string;
  description?: string;
}

export const WebsiteJsonLd: React.FC<WebsiteJsonLdProps> = ({
  url = 'https://igcc-eg.com',
  name = 'IGCC - International Governance and Compliance Consulting',
  description = 'Leading provider of governance, compliance, and business sustainability training and consulting services.',
}) => {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    url,
    name,
    description,
    potentialAction: {
      '@type': 'SearchAction',
      'target': `${url}/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <Head>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
      />
    </Head>
  );
};

interface CourseJsonLdProps {
  name: string;
  description: string;
  provider?: string;
  url?: string;
  image?: string;
}

export const CourseJsonLd: React.FC<CourseJsonLdProps> = ({
  name,
  description,
  provider = 'IGCC - International Governance and Compliance Consulting',
  url = 'https://igcc-eg.com',
  image,
}) => {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name,
    description,
    provider: {
      '@type': 'Organization',
      name: provider,
      sameAs: url,
    },
    url,
    ...(image && { image }),
  };

  return (
    <Head>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
      />
    </Head>
  );
};

interface ArticleJsonLdProps {
  url: string;
  title: string;
  images: string[];
  datePublished: string;
  dateModified?: string;
  authorName: string;
  description: string;
}

export const ArticleJsonLd: React.FC<ArticleJsonLdProps> = ({
  url,
  title,
  images,
  datePublished,
  dateModified,
  authorName,
  description,
}) => {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
    headline: title,
    image: images,
    datePublished,
    dateModified: dateModified || datePublished,
    author: {
      '@type': 'Person',
      name: authorName,
    },
    publisher: {
      '@type': 'Organization',
      name: 'IGCC - International Governance and Compliance Consulting',
      logo: {
        '@type': 'ImageObject',
        url: 'https://igcc-eg.com/Logo_square_transparent_qgkz3b.svg',
      },
    },
    description,
  };

  return (
    <Head>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
      />
    </Head>
  );
};

export default {
  OrganizationJsonLd,
  WebsiteJsonLd,
  CourseJsonLd,
  ArticleJsonLd,
};
