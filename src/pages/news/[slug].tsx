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
import { fetchNewsFromGitHub, fetchNewsBySlug, processNewsItemByLocale } from '@/utils/githubApi';
import CircularProgress from '@mui/material/CircularProgress';

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
    newsItem?: News;
    isFromApi?: boolean;
}

const NewsDetail: FC<NewsDetailProps> = ({ newsItem: initialNewsItem, isFromApi }) => {
    const router = useRouter();
    const { t } = useTranslation('common');
    const [newsItem, setNewsItem] = useState<News | null>(initialNewsItem || null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    
    // Handle fallback rendering
    if (router.isFallback) {
        return (
            <MainLayout>
                <Container>
                    <Box sx={{ 
                        display: 'flex', 
                        flexDirection: 'column',
                        justifyContent: 'center', 
                        alignItems: 'center', 
                        height: '50vh' 
                    }}>
                        <CircularProgress color="primary" size={60} sx={{ mb: 2 }} />
                        <Typography variant="h4">
                            جاري التحميل...
                        </Typography>
                    </Box>
                </Container>
            </MainLayout>
        );
    }
    
    // Fetch news item from API when slug changes or on initial load
    useEffect(() => {
        const fetchNewsFromApi = async () => {
            // تحقق مما إذا كنا بحاجة إلى تحميل البيانات من API
            // سيتم التحميل في حالتين:
            // 1. إذا كانت isFromApi=true في props (من getStaticProps)
            // 2. إذا كانت معلمة fromApi=true في URL (من الصفحات الأخرى)
            const shouldFetchFromApi = isFromApi || router.query.fromApi === 'true';
            
            // إذا كان لدينا بالفعل عنصر الأخبار من SSG/SSR ولا نحتاج إلى التحميل من API، فتخطي
            if ((initialNewsItem && !shouldFetchFromApi) || loading || !router.isReady) return;
            
            const { slug, locale } = router.query;
            if (!slug) return;
            
            try {
                setLoading(true);
                setError(null);
                
                // Get the base URL for the API
                const protocol = window.location.protocol;
                const host = window.location.host;
                const baseUrl = `${protocol}//${host}`;
                
                // Add timeout to avoid client-side hanging
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 8000);
                
                // Call our API endpoint to get news by slug
                const response = await fetch(
                    `${baseUrl}/api/news/${slug}?locale=${locale || 'en'}`,
                    { signal: controller.signal }
                );
                
                clearTimeout(timeoutId);
                
                if (!response.ok) {
                    if (response.status === 404) {
                        router.push('/404');
                        return;
                    }
                    throw new Error(`Failed to fetch news: ${response.status}`);
                }
                
                const result = await response.json();
                
                if (!result.success || !result.data) {
                    throw new Error('Invalid API response format');
                }
                
                setNewsItem(result.data);
            } catch (err: any) {
                console.error('Error fetching news item from API:', err);
                if (err.name === 'AbortError') {
                    setError('تجاوز الوقت المسموح لتحميل البيانات. يرجى المحاولة مرة أخرى.');
                } else {
                    setError('حدث خطأ أثناء تحميل الخبر');
                }
            } finally {
                setLoading(false);
            }
        };
        
        fetchNewsFromApi();
    }, [router.query.slug, router.query.locale, router.query.fromApi, initialNewsItem, isFromApi, loading, router.isReady, t, router]);

    // If error occurred during API fetch
    if (error) {
        return (
            <MainLayout>
                <Container>
                    <Typography variant="h4" align="center" sx={{ my: 8, color: 'error.main' }}>
                        {error}
                    </Typography>
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
        // Use our utility function to fetch the news data
        const newsData = await fetchNewsFromGitHub();
        
        // Generate paths for both Arabic and English using the same data
        // Limit the number of paths to improve build time (e.g., only the 5 most recent news items)
        // This helps with build time while still pre-rendering the most important pages
        const recentNews = newsData.slice(0, 5);
        
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
            fallback: true, // Change to true instead of blocking to avoid timeout
        };
    } catch (error) {
        console.error('Error generating static paths:', error);
        // Fallback to empty paths with fallback true to avoid timeout
        return {
            paths: [],
            fallback: true,
        };
    }
};

export const getStaticProps: GetStaticProps = async ({ params, locale }) => {
    try {
        if (!params?.slug || Array.isArray(params.slug)) {
            return { notFound: true };
        }
        
        const slug = params.slug.toString();
        
        // Use a timeout to prevent long running operations
        const timeoutPromise = new Promise<{ notFound: boolean }>((_, reject) => {
            setTimeout(() => reject(new Error('Fetch timeout')), 5000);
        });
        
        // Race between the actual fetch and the timeout
        const result = await Promise.race([
            (async () => {
                // Use our utility function to get the news item by slug
                const newsItem = await fetchNewsBySlug(slug);
                
                // If no matching news item is found, return 404
                if (!newsItem) {
                    return { notFound: true };
                }
                
                // Process the news item based on locale
                const processedNewsItem = processNewsItemByLocale(newsItem, locale?.toString() || 'en');
                
                return {
                    props: {
                        ...(await serverSideTranslations(locale ?? 'en', ['common'])),
                        newsItem: processedNewsItem,
                        isFromApi: false,
                    },
                    // Revalidate every hour (3600 seconds)
                    revalidate: 3600,
                };
            })(),
            timeoutPromise
        ]).catch(() => {
            // If timeout or error, return minimal props and let client-side handle it
            return {
                props: {
                    ...({}), // Empty placeholder for serverSideTranslations
                    isFromApi: true,
                },
                revalidate: 60,
            };
        });
        
        return result;
    } catch (error) {
        console.error('Error fetching news item:', error);
        // Instead of 404, return minimal props and let client-side fetching happen
        return {
            props: {
                isFromApi: true,
            },
            // Revalidate more frequently in case of errors
            revalidate: 60,
        };
    }
};

export default NewsDetail;