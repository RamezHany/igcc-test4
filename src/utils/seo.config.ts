export const defaultSEO = {
  title: 'IGCC - International Governance and Compliance Consulting',
  description: 'Leading provider of governance, compliance, and business sustainability training and consulting services. Offering certified programs for board members, compliance officers, and business professionals.',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://igcc-eg.com/',
    site_name: 'IGCC',
    images: [
      {
        url: 'https://igcc-eg.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'IGCC - International Governance and Compliance Consulting',
      },
    ],
  },
  twitter: {
    handle: '@igcc',
    site: '@igcc',
    cardType: 'summary_large_image',
  },
  additionalMetaTags: [
    {
      name: 'keywords',
      content: 'governance, compliance, business sustainability, corporate governance, board member certification, compliance officer, risk management, family business governance, endowment governance, sports clubs governance',
    },
    {
      name: 'author',
      content: 'IGCC',
    },
  ],
};

export const courseSEO = {
  title: 'Professional Training Courses - IGCC',
  description: 'Explore our comprehensive range of professional training courses in governance, compliance, and business sustainability. Get certified and advance your career with IGCC.',
  openGraph: {
    ...defaultSEO.openGraph,
    title: 'Professional Training Courses - IGCC',
    description: 'Explore our comprehensive range of professional training courses in governance, compliance, and business sustainability. Get certified and advance your career with IGCC.',
  },
};

export const newsSEO = {
  title: 'Latest News & Updates - IGCC',
  description: 'Stay updated with the latest news, insights, and developments in governance, compliance, and business sustainability from IGCC.',
  openGraph: {
    ...defaultSEO.openGraph,
    title: 'Latest News & Updates - IGCC',
    description: 'Stay updated with the latest news, insights, and developments in governance, compliance, and business sustainability from IGCC.',
  },
};
