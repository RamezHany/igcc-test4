import { FC, useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import { styled, useTheme } from '@mui/material/styles';
import { linkedinPosts, loadLinkedinPostsData } from '@/components/home/linkedin-posts.data';
import { MainLayout } from '@/components/layout';
import Paper from '@mui/material/Paper';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import type { LinkedinPost } from '@/interfaces/LinkedinPost';
import { 
    Button, 
    Modal, 
    IconButton, 
    TextField, 
    InputAdornment,
    Divider,
    Chip,
    Card,
    CardContent,
    CardActions,
    Fade,
    Skeleton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import SearchIcon from '@mui/icons-material/Search';
import Link from 'next/link';
import { defaultSEO } from '@/utils/seo.config';
import { NextPageWithLayout } from '@/interfaces/layout';

const StyledCard = styled(Card)(({ theme }) => ({
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    borderRadius: theme.spacing(2),
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
    overflow: 'hidden',
    transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
    '&:hover': {
        transform: 'translateY(-8px)',
        boxShadow: '0 12px 24px rgba(0,0,0,0.15)',
    },
}));

const AllLinkedinPosts: NextPageWithLayout = () => {
    const theme = useTheme();
    const { t } = useTranslation('common');
    const router = useRouter();
    const { locale } = router;
    const [posts, setPosts] = useState<LinkedinPost[]>([]);
    const [filteredPosts, setFilteredPosts] = useState<LinkedinPost[]>([]);
    const [openModal, setOpenModal] = useState(false);
    const [selectedPost, setSelectedPost] = useState<LinkedinPost | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadPosts = async () => {
            setLoading(true);
            await loadLinkedinPostsData();
            setPosts(linkedinPosts);
            setFilteredPosts(linkedinPosts);
            setLoading(false);
        };
        
        loadPosts();
    }, []);

    useEffect(() => {
        // Filter posts based on search term
        const filtered = posts.filter(post => {
            const matchesSearch = 
                searchTerm === '' || 
                post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (post.title_ar && post.title_ar.includes(searchTerm));
            
            return matchesSearch;
        });
        
        setFilteredPosts(filtered);
    }, [searchTerm, posts]);

    const handleOpenModal = (post: LinkedinPost) => {
        setSelectedPost(post);
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        // Limpiar el post seleccionado después de un breve retraso
        setTimeout(() => {
            setSelectedPost(null);
        }, 300); // Esperar a que termine la animación de cierre
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    const clearSearch = () => {
        setSearchTerm('');
    };

    return (
        <Box
            sx={{
                pt: { xs: 10, md: 16 },
                pb: { xs: 8, md: 12 },
                backgroundColor: theme.palette.background.default,
            }}
        >
            <Container maxWidth="lg">
                <Box sx={{ mb: { xs: 6, md: 8 }, textAlign: 'center' }}>
                    <Typography 
                        variant="h1" 
                        sx={{ 
                            mb: 2, 
                            fontSize: { xs: 32, md: 48 }, 
                            fontWeight: 'bold',
                            color: theme.palette.primary.main
                        }}
                    >
                        {locale === 'ar' 
                            ? t('linkedinPosts.allPostsTitle', 'جميع منشورات لينكد إن') 
                            : t('linkedinPosts.allPostsTitle', 'All LinkedIn Posts')}
                    </Typography>
                    <Typography 
                        variant="h5" 
                        color="textSecondary" 
                        sx={{ 
                            maxWidth: 800, 
                            mx: 'auto', 
                            mb: 6 
                        }}
                    >
                        {locale === 'ar' 
                            ? t('linkedinPosts.allPostsDescription', 'استكشف جميع منشوراتنا على لينكد إن واطلع على آخر الأخبار والرؤى') 
                            : t('linkedinPosts.allPostsDescription', 'Explore all our LinkedIn posts and stay updated with the latest news and insights')}
                    </Typography>
                </Box>

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
                        placeholder={locale === 'ar' 
                            ? t('linkedinPosts.searchPlaceholder', 'البحث في المنشورات...') 
                            : t('linkedinPosts.searchPlaceholder', 'Search posts...')}
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
                            {t('buttons.clear', 'Clear')}
                        </Button>
                    )}
                </Box>

                {loading ? (
                    // Loading skeleton
                    <Grid container spacing={4}>
                        {[1, 2, 3, 4, 5, 6].map((item) => (
                            <Grid item xs={12} sm={6} md={4} key={item}>
                                <Paper sx={{ p: 3, borderRadius: 2, height: '100%' }}>
                                    <Skeleton variant="rectangular" height={40} sx={{ mb: 2 }} />
                                    <Skeleton variant="text" height={30} sx={{ mb: 1 }} />
                                    <Skeleton variant="rectangular" height={150} sx={{ mb: 2 }} />
                                    <Skeleton variant="rectangular" width={120} height={36} />
                                </Paper>
                            </Grid>
                        ))}
                    </Grid>
                ) : filteredPosts.length > 0 ? (
                    <Fade in={!loading} timeout={500}>
                        <Grid container spacing={4}>
                            {filteredPosts.map((post) => (
                                <Grid item xs={12} sm={6} md={4} key={post.id}>
                                    <StyledCard>
                                        <CardContent sx={{ flexGrow: 1, p: 3 }}>
                                            {/* Eliminando el logo y texto de LinkedIn */}
                                            
                                            <Typography
                                                variant="h6"
                                                sx={{
                                                    mb: 2,
                                                    color: 'text.primary',
                                                    fontWeight: 'bold',
                                                    height: 60,
                                                    overflow: 'hidden',
                                                    display: '-webkit-box',
                                                    WebkitLineClamp: 2,
                                                    WebkitBoxOrient: 'vertical',
                                                }}
                                            >
                                                {locale === 'ar' ? post.title_ar : post.title}
                                            </Typography>
                                            
                                            {/* Preview of LinkedIn embed */}
                                            <Box 
                                                sx={{ 
                                                    mb: 2,
                                                    height: 180,
                                                    overflow: 'hidden',
                                                    position: 'relative',
                                                    borderRadius: 1,
                                                    border: '1px solid #e0e0e0',
                                                }}
                                                onClick={() => handleOpenModal(post)}
                                            >
                                                <iframe
                                                    src={post.embedUrl}
                                                    height="180"
                                                    width="100%"
                                                    frameBorder="0"
                                                    title={post.title}
                                                    style={{ 
                                                        pointerEvents: 'none',
                                                    }}
                                                ></iframe>
                                                <Box 
                                                    sx={{ 
                                                        position: 'absolute', 
                                                        top: 0, 
                                                        left: 0, 
                                                        right: 0, 
                                                        bottom: 0, 
                                                        backgroundColor: 'rgba(0,0,0,0.03)',
                                                        cursor: 'pointer',
                                                    }} 
                                                />
                                            </Box>
                                        </CardContent>
                                        
                                        <Divider />
                                        
                                        <CardActions sx={{ p: 2 }}>
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                onClick={() => handleOpenModal(post)}
                                                startIcon={<LinkedInIcon />}
                                                fullWidth
                                            >
                                                {locale === 'ar' ? t('buttons.viewPost', 'عرض المنشور') : t('buttons.viewPost', 'View Post')}
                                            </Button>
                                        </CardActions>
                                    </StyledCard>
                                </Grid>
                            ))}
                        </Grid>
                    </Fade>
                ) : (
                    <Box sx={{ textAlign: 'center', py: 8 }}>
                        <Typography variant="h6" color="textSecondary">
                            {locale === 'ar'
                                ? t('linkedinPosts.noResults', 'لم يتم العثور على منشورات تطابق معايير البحث')
                                : t('linkedinPosts.noResults', 'No posts found matching your criteria')}
                        </Typography>
                        <Button 
                            variant="outlined" 
                            color="primary" 
                            onClick={clearSearch}
                            sx={{ mt: 2 }}
                        >
                            {locale === 'ar' ? t('buttons.clear', 'مسح') : t('buttons.clear', 'Clear')}
                        </Button>
                    </Box>
                )}

                <Box sx={{ textAlign: 'center', mt: 8 }}>
                    <Link href="/">
                        <Button
                            variant="contained"
                            color="primary"
                            size="large"
                            sx={{
                                px: 4,
                                py: 1.5,
                                fontSize: '1.1rem',
                                textTransform: 'none',
                                borderRadius: 2,
                                backgroundColor: '#56bb76', // Default background color
                                '&:hover': {
                                    backgroundColor: '#56bb76', // Same as default to remove hover effect
                                },
                            }}
                        >
                            {locale === 'ar' 
                                ? t('buttons.backToHome', 'العودة إلى الرئيسية') 
                                : t('buttons.backToHome', 'Back to Home')}
                        </Button>
                    </Link>
                </Box>
            </Container>

            {/* LinkedIn Post Modal */}
            <Modal
                open={openModal}
                onClose={handleCloseModal}
                aria-labelledby="linkedin-post-modal"
                aria-describedby="view-linkedin-post-embed"
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Box
                    sx={{
                        position: 'relative',
                        width: { xs: '95%', sm: '85%', md: '75%' },
                        maxWidth: 900,
                        maxHeight: '90vh',
                        bgcolor: 'background.paper',
                        borderRadius: 3,
                        boxShadow: 24,
                        p: { xs: 2, sm: 3, md: 4 },
                        display: 'flex',
                        flexDirection: 'column',
                    }}
                >
                    <IconButton
                        aria-label="close"
                        onClick={handleCloseModal}
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: 8,
                            color: 'grey.500',
                            zIndex: 2,
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                    
                    {selectedPost && (
                        <>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <Chip 
                                    icon={<LinkedInIcon />} 
                                    label={locale === 'ar' ? 'لينكد إن' : 'LinkedIn'} 
                                    color="primary" 
                                    size="small" 
                                />
                            </Box>
                            
                            <Typography variant="h5" component="h2" sx={{ mb: 3, pr: 5, fontWeight: 'bold' }}>
                                {locale === 'ar' ? selectedPost.title_ar : selectedPost.title}
                            </Typography>
                            
                            <Box sx={{ 
                                flexGrow: 1,
                                width: '100%', 
                                overflow: 'hidden',
                                borderRadius: 2,
                                border: '1px solid rgba(0,0,0,0.1)',
                            }}>
                                <iframe
                                    src={selectedPost.embedUrl}
                                    style={{
                                        width: '100%',
                                        height: '550px',
                                        border: 'none',
                                    }}
                                    frameBorder="0"
                                    allowFullScreen
                                    title={selectedPost.title}
                                ></iframe>
                            </Box>
                            
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    component="a"
                                    href={selectedPost.embedUrl.replace('/embed', '')}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    startIcon={<LinkedInIcon />}
                                >
                                    {locale === 'ar' ? t('linkedinPosts.viewOnLinkedin', 'عرض على لينكد إن') : t('linkedinPosts.viewOnLinkedin', 'View on LinkedIn')}
                                </Button>
                            </Box>
                        </>
                    )}
                </Box>
            </Modal>
        </Box>
    );
};

AllLinkedinPosts.getLayout = (page) => <MainLayout seo={defaultSEO}>{page}</MainLayout>;

export const getStaticProps: GetStaticProps = async ({ locale }) => {
    return {
        props: {
            ...(await serverSideTranslations(locale ?? 'en', ['common'])),
        },
    };
};

export default AllLinkedinPosts;
