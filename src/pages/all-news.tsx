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
import { TextField, InputAdornment, Button } from '@mui/material'; // Import components for search
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

    useEffect(() => {
        const loadNews = async () => {
            await loadNewsData(locale || 'en'); // Fetch data based on the current locale
            setNews(dataNews);
            setFilteredNews(dataNews);
        };

        loadNews();
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

        // Simulate API call delay (replace this with your actual API call)
        setTimeout(() => {
            setLoading(false); // Hide loader
            router.push(`/news/${slug}`, undefined, { locale: locale }); // Navigate to the news detail page with current locale
        }, 2000); // 2 seconds delay
    };

    // Handle search input change
    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    // Clear search
    const clearSearch = () => {
        setSearchTerm('');
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

                        {/* Search Section */}
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
                                    // sx={{ minWidth: 100 }}
                                >
                                    {locale === 'ar' ? 'مسح' : 'Clear'}
                                </Button>
                            )}
                        </Box>

                        {/* Loader */}
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
                        {filteredNews.length === 0 && (
                            <Box sx={{ textAlign: 'center', py: 8 }}>
                                <Typography variant="h5" color="text.secondary">
                                    {locale === 'ar' ? 'لا توجد نتائج مطابقة لبحثك' : 'No results matching your search'}
                                </Typography>
                            </Box>
                        )}

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
    };
};

export default AllNews;