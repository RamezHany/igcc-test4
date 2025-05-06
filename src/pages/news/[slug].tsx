import { FC, useState } from 'react';
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
import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import type { News } from '@/interfaces/News';
import { fetchNewsBySlug, processNewsItemByLocale } from '@/utils/githubApi';
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
    error?: string;
}

const NewsDetail: FC<NewsDetailProps> = ({ newsItem, error }) => {
    const router = useRouter();
    const { t } = useTranslation('common');
    const [loading, setLoading] = useState<boolean>(false);
    
    // Handle loading state while route is changing
    if (router.isFallback || loading) {
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

    // If error occurred during server-side fetching
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

// ใช้ getServerSideProps แทน getStaticProps/getStaticPaths
export const getServerSideProps: GetServerSideProps = async ({ params, locale }) => {
    try {
        // ตรวจสอบและตัวแปร slug
        if (!params?.slug || Array.isArray(params.slug)) {
            return { notFound: true };
        }
        
        const slug = params.slug.toString();
        
        // โหลดข้อมูลการแปล
        const translations = await serverSideTranslations(locale ?? 'en', ['common']);
        
        try {
            // ใช้ controller สำหรับ timeout
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000);
            
            // ดึงข้อมูลข่าวตาม slug
            const newsItem = await fetchNewsBySlug(slug);
            clearTimeout(timeoutId);
            
            // ถ้าไม่พบข้อมูล
            if (!newsItem) {
                return { notFound: true };
            }
            
            // ประมวลผลข้อมูลตามภาษา
            const processedNewsItem = processNewsItemByLocale(newsItem, locale?.toString() || 'en');
            
            // ส่งข้อมูลไปยัง component
            return {
                props: {
                    ...translations,
                    newsItem: processedNewsItem,
                }
            };
        } catch (fetchError: any) {
            console.error(`Error fetching news for slug ${slug}:`, fetchError);
            
            // ส่งข้อผิดพลาดไปยัง component
            return {
                props: {
                    ...translations,
                    error: fetchError.name === 'AbortError' 
                        ? 'تجاوز الوقت المسموح لتحميل البيانات'
                        : 'حدث خطأ أثناء تحميل البيانات'
                }
            };
        }
        
    } catch (error) {
        console.error('Server-side error:', error);
        return { notFound: true };
    }
}

export default NewsDetail;