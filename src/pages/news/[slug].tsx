import { FC, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';
import Image from 'next/image';
import { format } from 'date-fns';
import { MainLayout } from '@/components/layout';
import Paper from '@mui/material/Paper';
import Divider from '@mui/material/Divider';
import { useTranslation } from 'next-i18next';
import { GetStaticProps, GetStaticPaths } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import type { News } from '@/interfaces/News';

// Styled Paper for the News Detail Container
const StyledPaper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(4),
    borderRadius: theme.spacing(2),
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    backgroundColor: theme.palette.background.paper,
    transition: 'box-shadow 0.3s ease-in-out',
    '&:hover': {
        boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
    },
}));

interface NewsDetailProps {
    newsItem: News;
}

const NewsDetail: FC<NewsDetailProps> = ({ newsItem }) => {
    const router = useRouter();
    const { t } = useTranslation('common');
    
    // If the page is still generating static content, show a loading state
    if (router.isFallback) {
        return (
            <MainLayout>
                <Container>
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
                        <Typography variant="h4">
                            {t('loading', 'Loading...')}
                        </Typography>
                    </Box>
                </Container>
            </MainLayout>
        );
    }

    // If no news item was found, show a not found message
    if (!newsItem) {
        return (
            <MainLayout>
                <Container>
                    <Typography variant="h4" align="center" sx={{ my: 8 }}>
                        {t('news.notFound', 'الخبر غير موجود')}
                    </Typography>
                </Container>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <Box component="article" sx={{ backgroundColor: '#f5f5f5', minHeight: 'calc(100vh - 64px)', paddingTop: '40px' }}>
                <Box sx={{ py: { xs: 6, md: 10 } }}>
                    <Container maxWidth="lg">
                        <StyledPaper>
                            <Grid container spacing={4}>
                                {/* Title and Date */}
                                <Grid item xs={12}>
                                    <Typography
                                        variant="h1"
                                        component="h1"
                                        sx={{
                                            fontSize: { xs: 32, md: 48 },
                                            mb: 2,
                                            fontWeight: 'bold',
                                            color: 'primary.main',
                                            textAlign: 'center',
                                        }}
                                    >
                                        {newsItem.title}
                                    </Typography>
                                    <Typography
                                        variant="subtitle1"
                                        color="text.secondary"
                                        sx={{ mb: 4, textAlign: 'center' }}
                                    >
                                        {format(new Date(newsItem.date), 'dd/MM/yyyy')}
                                    </Typography>
                                    <Divider sx={{ mb: 4 }} />
                                </Grid>

                                {/* Main Image */}
                                {newsItem.image.slice(0, 1).map((img, index) => (
                                    <Grid item xs={12} key={index}>
                                        <Box
                                            sx={{
                                                position: 'relative',
                                                height: { xs: 250, md: 500 },
                                                maxWidth: '1000px',
                                                margin: '0 auto',
                                                borderRadius: 2,
                                                overflow: 'hidden',
                                                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                                transition: 'transform 0.3s ease-in-out',
                                                '&:hover': {
                                                    transform: 'scale(1.02)',
                                                },
                                            }}
                                        >
                                            <Image
                                                src={img.url}
                                                alt={`${newsItem.title} - صورة ${index + 1}`}
                                                width={800}
                                                height={600}
                                                priority
                                                style={{
                                                    objectFit: 'cover',
                                                    width: '100%',
                                                    height: '100%',
                                                }}
                                            />
                                        </Box>
                                    </Grid>
                                ))}

                                {/* Description */}
                                <Grid item xs={12}>
                                    <Box sx={{ mt: 4 }}>
                                        {newsItem.description.map((paragraph, index) => (
                                            <Typography
                                                key={index}
                                                sx={{
                                                    mb: 3,
                                                    color: 'text.secondary',
                                                    fontSize: '1.1rem',
                                                    lineHeight: 1.8,
                                                    textAlign: 'justify',
                                                }}
                                            >
                                                {paragraph}
                                            </Typography>
                                        ))}
                                    </Box>
                                </Grid>
                            </Grid>
                        </StyledPaper>
                    </Container>
                </Box>
            </Box>
        </MainLayout>
    );
};

export const getStaticPaths: GetStaticPaths = async () => {
    try {
        // Fetch data directly from GitHub with caching
        const response = await fetch('https://raw.githubusercontent.com/RamezHany/igcc-test4/main/news.json', {
            cache: 'force-cache' // Use force-cache to maximize caching
        });
        
        if (!response.ok) {
            throw new Error(`Failed to fetch news data: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Generate paths for both Arabic and English using the same data
        // Limit the number of paths to improve build time (e.g., only the 5 most recent news items)
        // This helps with build time while still pre-rendering the most important pages
        const recentNews = data.news.slice(0, 5);
        
        const paths = [
            // English paths for recent news
            ...recentNews.map((news: News) => ({
                params: { slug: news.slug },
                locale: 'en',
            })),
            // Arabic paths for recent news
            ...recentNews.map((news: News) => ({
                params: { slug: news.slug },
                locale: 'ar',
            })),
        ];

        return {
            paths,
            fallback: 'blocking', // Use blocking to handle new slugs
        };
    } catch (error) {
        console.error('Error generating static paths:', error);
        // Fallback to empty paths with blocking
        return {
            paths: [],
            fallback: 'blocking',
        };
    }
};

export const getStaticProps: GetStaticProps = async ({ params, locale }) => {
    try {
        // Fetch data directly from GitHub with caching
        const response = await fetch('https://raw.githubusercontent.com/RamezHany/igcc-test4/main/news.json', {
            cache: 'force-cache' // Use force-cache to maximize caching
        });
        
        if (!response.ok) {
            throw new Error(`Failed to fetch news data: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Find the news item with the matching slug
        const newsItem = data.news.find((item: News) => item.slug === params?.slug);
        
        // If no matching news item is found, return 404
        if (!newsItem) {
            return {
                notFound: true,
            };
        }
        
        return {
            props: {
                ...(await serverSideTranslations(locale ?? 'en', ['common'])),
                newsItem: locale === 'ar' ? {
                    ...newsItem,
                    title: newsItem.title_ar || newsItem.title,
                    shortDescription: newsItem.shortDescription_ar || newsItem.shortDescription,
                    description: newsItem.description_ar || newsItem.description
                } : newsItem,
            },
            // Revalidate every hour (3600 seconds)
            revalidate: 3600,
        };
    } catch (error) {
        console.error('Error fetching news item:', error);
        return {
            notFound: true,
        };
    }
};

export default NewsDetail;