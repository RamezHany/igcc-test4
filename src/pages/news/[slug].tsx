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

    // الدالة لجلب بيانات المقال من API
    const fetchNewsData = async () => {
        try {
            setLoading(true);
            setError(null);

            // جلب البيانات من API
            const protocol = window.location.protocol;
            const host = window.location.host;
            const baseUrl = `${protocol}//${host}`;
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 8000);

            try {
                const response = await fetch(
                    `${baseUrl}/api/news/${slug}?locale=${currentLocale}`,
                    { signal: controller.signal }
                );
                
                clearTimeout(timeoutId);
                
                if (!response.ok) {
                    throw new Error(`Failed to fetch: ${response.status}`);
                }
                
                const data = await response.json();
                
                if (data.success && data.data) {
                    setNewsItem(data.data);
                } else {
                    throw new Error("No data found");
                }
            } catch (fetchErr: any) {
                if (fetchErr.name === 'AbortError') {
                    throw new Error('تجاوز وقت الاتصال، يرجى المحاولة مرة أخرى');
                }
                throw fetchErr;
            }
        } catch (err: any) {
            console.error('Error fetching news:', err);
            setError(err.message || 'حدث خطأ أثناء تحميل المقال');
        } finally {
            setLoading(false);
        }
    };

    // تحميل البيانات عند تغيير السلج أو اللغة
    useEffect(() => {
        if (router.isReady) {
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
                            جاري تحميل المقال...
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
                        <Typography variant="h4" color="error.main" sx={{ mb: 4 }}>
                            {error}
                        </Typography>
                        <Button 
                            variant="contained" 
                            color="primary" 
                            onClick={fetchNewsData}
                            sx={{ mx: 2 }}
                        >
                            إعادة المحاولة
                        </Button>
                        <Button 
                            variant="outlined" 
                            color="primary" 
                            onClick={() => router.push('/all-news')}
                            sx={{ mx: 2 }}
                        >
                            العودة إلى قائمة الأخبار
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
                    <Typography variant="h4" align="center" sx={{ my: 8 }}>
                        {t('news.notFound', 'المقال غير موجود')}
                    </Typography>
                    <Box sx={{ textAlign: 'center' }}>
                        <Button 
                            variant="contained" 
                            color="primary" 
                            onClick={() => router.push('/all-news')}
                        >
                            العودة إلى قائمة الأخبار
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

// جلب المسارات الثابتة - نستخدم fallback: true ليدعم كل السلجز المحتملة
export const getStaticPaths: GetStaticPaths = async () => {
    return {
        paths: [], // لا نقوم ببناء أي صفحات مسبقًا
        fallback: true // استخدام fallback: true للسماح ببناء الصفحات عند الطلب
    };
};

// جلب خصائص الصفحة الثابتة - نرجع فقط معلومات السلج واللغة
export const getStaticProps: GetStaticProps = async ({ params, locale }) => {
    if (!params?.slug) {
        return { notFound: true };
    }

    const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug;

    try {
        // نرجع فقط الترجمات والسلج - بدون أي جلب للبيانات من جيثب
        return {
            props: {
                ...(await serverSideTranslations(locale || 'ar', ['common'])),
                slug,
                locale: locale || 'ar'
            },
            // إعادة بناء الصفحة كل ساعة كحد أقصى
            revalidate: 3600
        };
    } catch (error) {
        console.error('Error in getStaticProps:', error);
        // في حالة الخطأ، نرجع الحد الأدنى من البيانات
        return {
            props: {
                slug,
                locale: locale || 'ar'
            },
            revalidate: 60
        };
    }
};

export default NewsDetail;