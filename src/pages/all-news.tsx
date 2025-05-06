import { FC, useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';
import Image from 'next/image';
import { dataNews, loadNewsData } from '@/components/home/home_news.data';
import { format } from 'date-fns';
import { MainLayout } from '@/components/layout';
import Paper from '@mui/material/Paper';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import MuiLink from '@mui/material/Link';
import { useRouter } from 'next/router';
import { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import type { News } from '@/interfaces/News';
import CircularProgress from '@mui/material/CircularProgress'; // Import CircularProgress for the loader
import { TextField, InputAdornment, Button, Alert } from '@mui/material'; // Import components for search and Alert
import SearchIcon from '@mui/icons-material/Search'; // Import search icon

// Styled Paper for Cards
const StyledPaper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(3),
    borderRadius: theme.spacing(2),
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    backgroundColor: theme.palette.background.paper,
    transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
    },
}));

const AllNews: FC = () => {
    const { t } = useTranslation('common');
    const router = useRouter();
    const { locale } = router;
    const [news, setNews] = useState<News[]>([]);
    const [filteredNews, setFilteredNews] = useState<News[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false); // State for loader
    const [loadingData, setLoadingData] = useState(true); // State for initial data loading
    const [newArticlesAvailable, setNewArticlesAvailable] = useState(false); // State for new articles notification

    // Extract fetchNewsFromApi as a named function
    const fetchNewsFromApi = async (forceRefresh = false) => {
        try {
            setLoadingData(true);
            setNewArticlesAvailable(false);
            
            // تجربة استخدام API أولاً
            try {
                // Get the base URL for the API
                const protocol = window.location.protocol;
                const host = window.location.host;
                const baseUrl = `${protocol}//${host}`;
                
                // Force refresh when requested or first loading
                const refreshParam = forceRefresh ? "true" : "true";
                
                // Call our API endpoint to get all news with refresh parameter
                const response = await fetch(`${baseUrl}/api/news?locale=${locale || 'en'}&refresh=${refreshParam}`);
                
                if (response.ok) {
                    const data = await response.json();
                    
                    if (data.success && data.data) {
                        setNews(data.data);
                        setFilteredNews(data.data);
                        console.log(`Loaded ${data.data.length} news items from API`);
                        
                        // تحقق مما إذا كان هناك مقالات جديدة ليست في القائمة السابقة
                        // هذا فقط للعرض، لا يؤثر على الوظائف
                        try {
                            await fetch(`${baseUrl}/api/rebuild-status?registerSlug=${locale || 'en'}_news_list`);
                        } catch (e) {
                            // تجاهل الأخطاء هنا
                        }
                        
                        return; // نجحنا في استخدام API
                    }
                }
                
                // إذا وصلنا إلى هنا، فإن API لم يعمل
                throw new Error('API failed, falling back to direct load');
            } catch (apiError) {
                console.warn('Error using API, falling back to direct load:', apiError);
                // استخدام loadNewsData كاحتياطي
                await loadNewsData(locale || 'en');
                setNews(dataNews);
                setFilteredNews(dataNews);
            }
        } catch (error) {
            console.error('Failed to load news:', error);
        } finally {
            setLoadingData(false);
        }
    };

    useEffect(() => {
        fetchNewsFromApi();
    }, [locale]);

    // Filter news based on search term
    useEffect(() => {
        if (searchTerm === '') {
            setFilteredNews(news);
        } else {
            const filtered = news.filter(item => {
                return (
                    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    (item.shortDescription && item.shortDescription.toLowerCase().includes(searchTerm.toLowerCase())) ||
                    (item.description && item.description[0] && item.description[0].toLowerCase().includes(searchTerm.toLowerCase()))
                );
            });
            setFilteredNews(filtered);
        }
    }, [searchTerm, news]);

    const handleReadMoreClick = (slug: string) => {
        setLoading(true); // Show loader

        // استخدام router.push للانتقال إلى صفحة المقال مع الحفاظ على الإعدادات اللغوية
        // وإرسال إشارة أنه سيتم استخدام API للحصول على بيانات المقال
        router.push(
            {
                pathname: `/news/${slug}`,
                query: { fromApi: 'true' } // إضافة معلمة للإشارة إلى استخدام API
            },
            `/news/${slug}`, // المسار الظاهري للمستخدم (بدون معلمات query)
            { locale: locale }
        )
        .then(() => {
            // إخفاء المؤشر بعد الانتقال أو بعد 500 مللي ثانية (أيهما أسبق)
            setTimeout(() => setLoading(false), 500);
        })
        .catch((error) => {
            console.error('Navigation error:', error);
            setLoading(false);
        });
    };

    // Handle search input change
    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    // Clear search
    const clearSearch = () => {
        setSearchTerm('');
    };

    // Force reload news data
    const reloadNews = () => {
        setLoadingData(true);
        fetchNewsFromApi(true); // Pass true to force refresh
    };

    return (
        <MainLayout>
            <Box sx={{ backgroundColor: '#f5f5f5', minHeight: 'calc(100vh - 64px)', paddingTop: '40px' }}>
                <Box sx={{ py: { xs: 6, md: 10 } }}>
                    <Container maxWidth="lg">
                        <Typography
                            variant="h1"
                            component="h1"
                            align="center"
                            sx={{
                                fontSize: { xs: 32, md: 48 },
                                mb: 6,
                                fontWeight: 'bold',
                                color: 'primary.main',
                            }}
                        >
                            {t('news.allNews', 'جميع الأخبار')}
                        </Typography>

                        {/* Check for new build availability */}
                        {loadingData && (
                            <Box sx={{ mb: 4 }}>
                                <Alert 
                                    severity="info" 
                                    sx={{ 
                                        borderRadius: 2,
                                        display: 'flex',
                                        alignItems: 'center',
                                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                                    }}
                                >
                                    <Typography variant="body1" sx={{ flexGrow: 1 }}>
                                        {locale === 'ar' 
                                            ? 'جاري تحميل الأخبار...' 
                                            : 'Loading news...'}
                                    </Typography>
                                </Alert>
                            </Box>
                        )}

                        {/* Search and Controls Section */}
                        <Box 
                            sx={{ 
                                mb: 6, 
                                display: 'flex', 
                                alignItems: 'center',
                                gap: 2,
                                p: 3,
                                borderRadius: 2,
                                backgroundColor: 'background.paper',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                                flexWrap: { xs: 'wrap', md: 'nowrap' }
                            }}
                        >
                            <TextField
                                fullWidth
                                variant="outlined"
                                placeholder={locale === 'ar' ? 'البحث في الأخبار...' : 'Search news...'}
                                value={searchTerm}
                                onChange={handleSearchChange}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon color="primary" />
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{ flexGrow: 1 }}
                            />
                            
                            {searchTerm && (
                                <Button 
                                    variant="outlined" 
                                    color="primary" 
                                    onClick={clearSearch}
                                >
                                    {locale === 'ar' ? 'مسح' : 'Clear'}
                                </Button>
                            )}
                            
                            <Button 
                                variant="contained" 
                                color="primary" 
                                onClick={reloadNews}
                                disabled={loadingData}
                            >
                                {locale === 'ar' ? 'تحديث' : 'Refresh'}
                            </Button>
                        </Box>

                        {/* Initial Data Loading */}
                        {loadingData && (
                            <Box sx={{ textAlign: 'center', py: 8 }}>
                                <CircularProgress color="primary" size={40} sx={{ mb: 2 }} />
                                <Typography variant="h6" color="text.secondary">
                                    {locale === 'ar' ? 'جاري تحميل الأخبار...' : 'Loading news...'}
                                </Typography>
                            </Box>
                        )}

                        {/* Loader for navigation */}
                        {loading && (
                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    position: 'fixed',
                                    top: 0,
                                    left: 0,
                                    width: '100%',
                                    height: '100%',
                                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                                    zIndex: 9999,
                                }}
                            >
                                <CircularProgress color="primary" size={60} />
                            </Box>
                        )}

                        {/* No results message */}
                        {!loadingData && filteredNews.length === 0 && (
                            <Box sx={{ textAlign: 'center', py: 8 }}>
                                <Typography variant="h5" color="text.secondary">
                                    {locale === 'ar' ? 'لا توجد نتائج مطابقة لبحثك' : 'No results matching your search'}
                                </Typography>
                            </Box>
                        )}

                        {!loadingData && (
                        <Grid container spacing={4}>
                            {filteredNews.map((item) => (
                                <Grid item xs={12} sm={6} md={4} lg={4} key={item.id}>
                                    <Link href={`/news/${item.slug}`} passHref locale={locale}>
                                        <MuiLink
                                            component="a"
                                            underline="none"
                                            sx={{
                                                display: 'block',
                                                cursor: 'pointer',
                                                height: '100%',
                                            }}
                                            onClick={(e: { preventDefault: () => void; }) => {
                                                e.preventDefault(); // Prevent default link behavior
                                                handleReadMoreClick(item.slug); // Handle click with loader
                                            }}
                                        >
                                            <StyledPaper>
                                                {/* Image */}
                                                <Box
                                                    sx={{
                                                        borderRadius: 2,
                                                        overflow: 'hidden',
                                                        mb: 3,
                                                    }}
                                                >
                                                    <Image
                                                        src={item.image[0].url}
                                                        alt={item.title}
                                                        width={400}
                                                        height={300}
                                                        priority={parseInt(item.id) <= 3}
                                                        style={{
                                                            objectFit: 'cover',
                                                            width: '100%',
                                                            height: '100%',
                                                        }}
                                                    />
                                                </Box>

                                                {/* Title */}
                                                <Typography
                                                    variant="h6"
                                                    sx={{
                                                        mb: 1,
                                                        color: 'text.primary',
                                                        fontWeight: 'bold',
                                                        minHeight: 56,
                                                        display: '-webkit-box',
                                                        WebkitLineClamp: 2,
                                                        WebkitBoxOrient: 'vertical',
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                    }}
                                                >
                                                    {item.title}
                                                </Typography>

                                                {/* Date */}
                                                <Typography
                                                    variant="body2"
                                                    color="text.secondary"
                                                    sx={{ mb: 2 }}
                                                >
                                                    {format(new Date(item.date), 'dd/MM/yyyy')}
                                                </Typography>

                                                {/* Description */}
                                                <Typography
                                                    variant="body1"
                                                    color="text.secondary"
                                                    sx={{
                                                        display: '-webkit-box',
                                                        WebkitLineClamp: 3,
                                                        WebkitBoxOrient: 'vertical',
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                        mb: 2,
                                                        flexGrow: 1, // Allow description to take remaining space
                                                    }}
                                                >
                                                    {item.description[0]}
                                                </Typography>

                                                {/* Read More */}
                                                <Typography
                                                    color="primary"
                                                    sx={{
                                                        fontWeight: 'medium',
                                                        '&:hover': {
                                                            textDecoration: 'underline',
                                                        },
                                                    }}
                                                >
                                                    {t('buttons.readMore', 'اقرأ المزيد')}
                                                </Typography>
                                            </StyledPaper>
                                        </MuiLink>
                                    </Link>
                                </Grid>
                            ))}
                        </Grid>
                        )}
                    </Container>
                </Box>
            </Box>
        </MainLayout>
    );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
    return {
        props: {
            ...(await serverSideTranslations(locale || 'ar', ['common'])),
        },
        revalidate: 60 // إعادة التحقق كل 60 ثانية
    };
};

export default AllNews;