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
import { GetStaticPaths, GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import type { News } from '@/interfaces/News';
import CircularProgress from '@mui/material/CircularProgress';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';

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
    slug: string; 
    locale: string;
}

const NewsDetail: FC<NewsDetailProps> = ({ slug, locale: initialLocale }) => {
    const router = useRouter();
    const { t } = useTranslation('common');
    const [newsItem, setNewsItem] = useState<News | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const currentLocale = router.locale || initialLocale;
    
    // If fallback page is loading, show a loading state
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
                            {currentLocale === 'ar' ? 'جاري تحميل المقال...' : 'Loading article...'}
                        </Typography>
                    </Box>
                </Container>
            </MainLayout>
        );
    }

    // الدالة لجلب بيانات المقال من API
    const fetchNewsData = async () => {
        try {
            setLoading(true);
            setError(null);

            // جلب البيانات من API
            const baseUrl = window.location.origin;
            
            // استخدام fetch مع timeout
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 second timeout
            
            try {
                const response = await fetch(
                    `${baseUrl}/api/news/${slug}?locale=${currentLocale}`,
                    { signal: controller.signal }
                );
                
                clearTimeout(timeoutId);
                
                if (!response.ok) {
                    throw new Error(`${response.status}: ${response.statusText}`);
                }
                
                const data = await response.json();
                
                if (data.success && data.data) {
                    setNewsItem(data.data);
                } else {
                    throw new Error(data.message || "No data found");
                }
            } catch (fetchErr: any) {
                if (fetchErr.name === 'AbortError') {
                    console.error('Fetch timeout, trying again with longer timeout');
                    // Try again with longer timeout as fallback
                    try {
                        const response = await fetch(`${baseUrl}/api/news/${slug}?locale=${currentLocale}`);
                        if (!response.ok) throw new Error(`${response.status}: ${response.statusText}`);
                        const data = await response.json();
                        if (data.success && data.data) {
                            setNewsItem(data.data);
                            return;
                        }
                    } catch (retryErr) {
                        console.error('Retry also failed:', retryErr);
                    }
                    throw new Error(currentLocale === 'ar' ? 'تجاوز وقت الاتصال، يرجى المحاولة مرة أخرى' : 'Connection timeout, please try again');
                }
                throw fetchErr;
            }
        } catch (err: any) {
            console.error('Error fetching news:', err);
            setError(err.message || (currentLocale === 'ar' ? 'حدث خطأ أثناء تحميل المقال' : 'An error occurred while loading the article'));
        } finally {
            setLoading(false);
        }
    };

    // تحميل البيانات عند تغيير السلج أو اللغة
    useEffect(() => {
        if (router.isReady && slug) {
            fetchNewsData();
        }
    }, [slug, currentLocale, router.isReady]);

    // عرض حالة التحميل
    if (loading) {
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
                            {currentLocale === 'ar' ? 'جاري تحميل المقال...' : 'Loading article...'}
                        </Typography>
                    </Box>
                </Container>
            </MainLayout>
        );
    }

    // عرض رسالة الخطأ
    if (error) {
        return (
            <MainLayout>
                <Container>
                    <Box sx={{ textAlign: 'center', my: 8 }}>
                        <Alert severity="error" sx={{ mb: 4 }}>
                            <Typography variant="h6">{error}</Typography>
                        </Alert>
                        <Button 
                            variant="contained" 
                            color="primary" 
                            onClick={fetchNewsData}
                            sx={{ mx: 2 }}
                        >
                            {currentLocale === 'ar' ? 'إعادة المحاولة' : 'Retry'}
                        </Button>
                        <Button 
                            variant="outlined" 
                            color="primary" 
                            onClick={() => router.push('/all-news')}
                            sx={{ mx: 2 }}
                        >
                            {currentLocale === 'ar' ? 'العودة إلى قائمة الأخبار' : 'Back to News List'}
                        </Button>
                    </Box>
                </Container>
            </MainLayout>
        );
    }

    // عرض رسالة عدم وجود المقال
    if (!newsItem) {
        return (
            <MainLayout>
                <Container>
                    <Box sx={{ textAlign: 'center', my: 8 }}>
                        <Alert severity="warning" sx={{ mb: 4 }}>
                            <Typography variant="h6">
                                {currentLocale === 'ar' 
                                    ? 'المقال غير موجود أو لم يتم العثور عليه' 
                                    : 'Article not found or unavailable'}
                            </Typography>
                        </Alert>
                        <Button 
                            variant="contained" 
                            color="primary" 
                            onClick={() => router.push('/all-news')}
                        >
                            {currentLocale === 'ar' ? 'العودة إلى قائمة الأخبار' : 'Back to News List'}
                        </Button>
                    </Box>
                </Container>
            </MainLayout>
        );
    }

    // عرض المقال
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
                                {newsItem.image && newsItem.image.length > 0 && (
                                    <Grid item xs={12}>
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
                                                src={newsItem.image[0].url}
                                                alt={`${newsItem.title} - ${currentLocale === 'ar' ? 'صورة' : 'image'} 1`}
                                                width={newsItem.image[0].width || 800}
                                                height={newsItem.image[0].height || 600}
                                                priority
                                                style={{
                                                    objectFit: 'cover',
                                                    width: '100%',
                                                    height: '100%',
                                                }}
                                            />
                                        </Box>
                                    </Grid>
                                )}

                                {/* Description */}
                                <Grid item xs={12}>
                                    <Box sx={{ mt: 4 }}>
                                        {newsItem.description && newsItem.description.map((paragraph, index) => (
                                            <Typography
                                                key={index}
                                                sx={{
                                                    mb: 3,
                                                    color: 'text.primary',
                                                    fontSize: '1.1rem',
                                                    lineHeight: 1.8,
                                                    textAlign: currentLocale === 'ar' ? 'right' : 'left',
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

// جلب المسارات الثابتة - نستخدم fallback: true ليدعم كل السلجز المحتملة
export const getStaticPaths: GetStaticPaths = async () => {
    // تعريف بعض المسارات الشائعة مسبقًا
    const commonPaths = [
        'takkween-advanced-industries-group-grc-2024',
        'international-center-delivers-certified-compliance-officer-program-to-madayn-group-in-oman',
        'the-inaugural-international-conference-on-community-diplomacy-pioneers,-with-igcc-as-a-bronze-sponsor',
        'the-arab-forum-for-governance-and-sustainable-development-under-the-patronage-of-igcc',
        'governance-risk-and-compliance-grc-building-strong-and-sustainable-organizations',
        'ppppo'
    ];
    
    // إنشاء مسارات لكل لغة
    const paths = [
        ...commonPaths.map(slug => ({ params: { slug }, locale: 'en' })),
        ...commonPaths.map(slug => ({ params: { slug }, locale: 'ar' }))
    ];
    
    return {
        paths,
        fallback: true // استخدام fallback: true للسماح ببناء الصفحات عند الطلب
    };
};

// جلب خصائص الصفحة الثابتة - نعيد فقط معلومات السلج واللغة
export const getStaticProps: GetStaticProps = async ({ params, locale }) => {
    if (!params?.slug) {
        return { notFound: true };
    }

    const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug;

    return {
        props: {
            ...(await serverSideTranslations(locale || 'ar', ['common'])),
            slug,
            locale: locale || 'ar'
        },
        // إعادة بناء الصفحة كل ساعة كحد أقصى
        revalidate: 3600
    };
};

export default NewsDetail;