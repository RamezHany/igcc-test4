import React, { FC, useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import Link from 'next/link';
import MuiLink from '@mui/material/Link';
import Image from 'next/image';
import Button from '@mui/material/Button';
import { format } from 'date-fns';
import { Paper } from '@mui/material';
import type { News } from '@/interfaces/News';
import { loadNewsData, dataNews } from './home_news.data'; // Import loadNewsData and dataNews

const HomeNews: FC = () => {
    const theme = useTheme();
    const { t } = useTranslation('common');
    const router = useRouter();
    const { locale } = router;
    const [news, setNews] = useState<News[]>([]);

    useEffect(() => {
        const loadNews = async () => {
            // Pass the current locale to loadNewsData
            await loadNewsData(locale || 'en');
            const filteredNews = dataNews
                .filter((item) => ['1', '2', '3'].includes(item.id))
                .sort((a, b) => parseInt(a.id) - parseInt(b.id));
            setNews(filteredNews);
        };

        loadNews();
    }, [locale]); // Re-run effect when locale changes

    return (
        <Box
            id="news"
            sx={{
                pt: {
                    xs: 6,
                    md: 8,
                },
                pb: {
                    xs: 8,
                    md: 12,
                },
                backgroundColor: '#f5f5f5',
            }}
        >
            <Container maxWidth="lg">
                <Box
                    sx={{
                        mb: {
                            xs: 6,
                            md: 8,
                        },
                        textAlign: 'center',
                    }}
                >
                    <Typography variant="h1" sx={{ mb: 1, fontSize: { xs: 32, md: 48 }, fontWeight: 'bold' }}>
                        {t('news.title', 'آخر الأخبار')}
                    </Typography>
                </Box>

                <Grid container spacing={4}>
                    {news.map((item) => (
                        <Grid item xs={12} md={4} key={item.id}>
                            <Link href={`/news/${item.slug}`} passHref>
                                <MuiLink
                                    component="a"
                                    underline="none"
                                    sx={{
                                        display: 'block',
                                        cursor: 'pointer',
                                    }}
                                >
                                    <Paper
                                        sx={{
                                            p: 2,
                                            borderRadius: 2,
                                            transition: 'transform 0.3s ease-in-out',
                                            '&:hover': {
                                                transform: 'translateY(-4px)',
                                            },
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                position: 'relative',
                                                height: 200,
                                                borderRadius: 2,
                                                overflow: 'hidden',
                                                mb: 2,
                                            }}
                                        >
                                            <Image
                                                src={item.image[0].url}
                                                alt={item.title}
                                                width={400}
                                                height={300}
                                                priority
                                                style={{
                                                    objectFit: 'cover',
                                                    width: '100%',
                                                    height: '100%',
                                                }}
                                            />
                                        </Box>
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
                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                            {format(new Date(item.date), 'dd/MM/yyyy')}
                                        </Typography>
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
                                            }}
                                        >
                                            {item.description[0]}
                                        </Typography>
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
                                    </Paper>
                                </MuiLink>
                            </Link>
                        </Grid>
                    ))}
                </Grid>

                <Box sx={{ textAlign: 'center', mt: 6 }}>
                    <Link href="/all-news" passHref>
                        <Button
                            component="a"
                            variant="contained"
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
                            {t('buttons.viewAllNews', 'عرض جميع الأخبار')}
                        </Button>
                    </Link>
                </Box>
            </Container>
        </Box>
    );
};

export default HomeNews;