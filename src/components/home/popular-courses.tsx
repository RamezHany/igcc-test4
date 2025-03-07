    import React, { FC, useState } from 'react';
    import Box from '@mui/material/Box';
    import Grid from '@mui/material/Grid';
    import Slider, { Settings } from 'react-slick';
    import Container from '@mui/material/Container';
    import Typography from '@mui/material/Typography';
    import { useTheme, styled } from '@mui/material/styles';
    import { IconButton, useMediaQuery, Modal, TextField, Button, CircularProgress } from '@mui/material';
    import CheckCircleIcon from '@mui/icons-material/CheckCircle';
    import IconArrowBack from '@mui/icons-material/ArrowBack';
    import IconArrowForward from '@mui/icons-material/ArrowForward';
    import useCourseData from './popular-course.data'; // Import the custom hook
    import { CourseCardItem } from '@/components/course';
    import { Course } from '@/interfaces/course';
    import { useTranslation } from 'next-i18next';
    import { useRouter } from 'next/router';

    interface SliderArrowArrow {
        onClick?: () => void;
        type: 'next' | 'prev';
        className?: 'string';
    }

    interface FormData {
        name: string;
        email: string;
        phone: string;
        company: string;
        courseName: string;
    }

    const SliderArrow: FC<SliderArrowArrow> = (props) => {
        const { onClick, type, className } = props;
        const { t } = useTranslation('common');
        const { locale } = useRouter();
        const isRtl = locale === 'ar';

        // Determine the arrow direction based on the type and RTL setting
        const arrowIcon =
            type === 'next' ? (
                <IconArrowForward sx={{ fontSize: 22 }} />
            ) : (
                <IconArrowBack sx={{ fontSize: 22 }} />
            );

        return (
            <IconButton
                sx={{
                    backgroundColor: 'background.paper',
                    color: 'primary.main',
                    '&:hover': { backgroundColor: 'primary.main', color: 'primary.contrastText' },
                    bottom: { xs: '-70px !important', md: '-28px !important' },
                    left: 'unset !important',
                    right: type === 'prev' ? (isRtl ? '0 !important' : '60px !important') : (isRtl ? '60px !important' : '0 !important'),
                    zIndex: 10,
                    boxShadow: 1,
                }}
                disableRipple
                color="inherit"
                onClick={onClick}
                className={className}
            >
                {arrowIcon}
            </IconButton>
        );
    };

    const StyledDots = styled('ul')(({ theme }) => ({
        '&.slick-dots': {
            position: 'absolute',
            left: 0,
            bottom: -20,
            paddingLeft: theme.spacing(1),
            textAlign: 'left',
            '& li': {
                marginRight: theme.spacing(2),
                '&.slick-active>div': {
                    backgroundColor: theme.palette.primary.main,
                },
            },
        },
    }));

    const HomePopularCourse: FC = () => {
        const { breakpoints } = useTheme();
        const matchMobileView = useMediaQuery(breakpoints.down('md'));
        const [open, setOpen] = useState(false); // State to control modal visibility
        const [selectedCourse, setSelectedCourse] = useState<Course | null>(null); // State to store the selected course object
        const [formData, setFormData] = useState<FormData>({
            name: '',
            email: '',
            phone: '',
            company: '',
            courseName: '',
        });
        const [isLoading, setIsLoading] = useState(false);
        const [showSuccess, setShowSuccess] = useState(false);
        const { t } = useTranslation('common');
        const { locale } = useRouter();
        const isRtl = locale === 'ar';

        // Use the custom hook to fetch data
        const { data } = useCourseData();

        // Handle modal open
        const handleOpen = (course: Course) => {
            setSelectedCourse(course);
            setFormData((prev) => ({ ...prev, courseName: course.title }));
            setOpen(true);
        };

        // Handle modal close
        const handleClose = () => {
            setOpen(false);
            setSelectedCourse(null);
            setShowSuccess(false);
            setFormData({
                name: '',
                email: '',
                phone: '',
                company: '',
                courseName: '',
            });
        };

        // Handle form input change
        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const { name, value } = e.target;
            setFormData((prev) => ({ ...prev, [name]: value }));
        };

        // Handle form submission
        const handleSubmit = async (e: React.FormEvent) => {
            e.preventDefault();
            setIsLoading(true);

            try {
                const GOOGLE_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzslKJcRQYEKEKR8IN1pnjFQWvVI-3eAZ5dPhYtuUTzKbtW4n8SDjVqsk9qlfTice2N/exec';

                const url = new URL(GOOGLE_APPS_SCRIPT_URL);
                url.searchParams.append('formType', 'program');
                Object.keys(formData).forEach(key =>
                    url.searchParams.append(key, formData[key as keyof typeof formData])
                );

                await fetch(url.toString(), {
                    method: 'GET',
                    mode: 'no-cors',
                });

                setShowSuccess(true);
                setTimeout(() => {
                    handleClose();
                }, 3000); // Close after 3 seconds
            } catch (error) {
                console.error('Error submitting form:', error);
                alert(t('form.errorSubmitting'));
            } finally {
                setIsLoading(false);
            }
        };

        const sliderConfig: Settings = {
            infinite: true,
            autoplay: true,
            speed: 300,
            slidesToShow: matchMobileView ? 1 : 3,
            slidesToScroll: 1,
            prevArrow: <SliderArrow type="prev" />,
            nextArrow: <SliderArrow type="next" />,
            dots: true,
            appendDots: (dots) => <StyledDots>{dots}</StyledDots>,
            customPaging: () => (
                <Box sx={{ height: 8, width: 30, backgroundColor: 'divider', display: 'inline-block', borderRadius: 4 }} />
            ),
        };

        return (
            <Box
                id="popular-course"
                sx={{
                    pt: {
                        xs: 6,
                        md: 8,
                    },
                    pb: 14,
                    backgroundColor: 'background.default',
                }}
            >
                <Container maxWidth="lg">
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={12}>
                            <Box
                                sx={{
                                    height: '100%',
                                    width: { xs: '100%', md: '100%' },
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: { xs: 'center', md: 'center' },
                                }}
                            >
                                <Typography
                                    sx={{
                                        color: 'black',
                                        mb: 2,
                                        lineHeight: 1.6,
                                        ml: { xs: 0 },
                                        textAlign: isRtl ? 'left' : 'left',
                                        direction: isRtl ? 'rtl' : 'ltr',
                                        fontSize: '2.25rem', // Increase font size (adjust as needed)
                                    }}
                                >
                                    {t('programDes.program13')}
                                </Typography>
                            </Box>
                        </Grid>

                        {/*this is the cards part */}
                        <Grid item xs={12} md={12}>
                            <Slider {...sliderConfig}>
                                {data.map((item) => (
                                    <Box key={String(item.id)} onClick={() => handleOpen(item)}>
                                        <CourseCardItem item={item} />
                                    </Box>
                                ))}
                            </Slider>
                        </Grid>

                    </Grid>
                </Container>

                {/* Modal for the form */}
                <Modal open={open} onClose={handleClose}>
                    <Box
                        sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: { xs: '90%', md: '800px' },
                            bgcolor: 'background.paper',
                            boxShadow: 24,
                            p: 4,
                            borderRadius: 2,
                            outline: 'none',
                            display: 'flex',
                            flexDirection: { xs: 'column', md: 'row' },
                        }}
                    >
                        {showSuccess ? (
                            <Box sx={{
                                width: '100%',
                                textAlign: 'center',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: 2,
                                direction: isRtl ? 'rtl' : 'ltr'
                            }}>
                                <CheckCircleIcon color="success" sx={{ fontSize: 60 }} />
                                <Typography variant="h5" sx={{
                                    color: 'success.main',
                                    textAlign: 'center',
                                    width: '100%'
                                }}>
                                    {t('successMessage')}
                                </Typography>
                                <Typography sx={{
                                    textAlign: 'center',
                                    width: '100%'
                                }}>
                                    {t('successDescription')}
                                </Typography>
                            </Box>
                        ) : (
                            <>
                                {/* Left Half - Course Details */}
                                <Box
                                    sx={{
                                        flex: 1,
                                        pr: { md: 2 },
                                        borderRight: { md: '1px solid', borderColor: 'divider' },
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'center',
                                        mb: { xs: 3, md: 0 }
                                    }}
                                >
                                    <Typography variant="h5" sx={{
                                        mb: 2,
                                        textAlign: isRtl ? 'right' : 'left',
                                        direction: isRtl ? 'rtl' : 'ltr'
                                    }}>
                                        {selectedCourse?.title}
                                    </Typography>
                                    <Typography variant="body1" sx={{
                                        color: 'text.secondary',
                                        textAlign: isRtl ? 'right' : 'left',
                                        direction: isRtl ? 'rtl' : 'ltr'
                                    }}>
                                        {selectedCourse?.description}
                                    </Typography>
                                </Box>

                                {/* Right Half - Form */}
                                <Box sx={{ flex: 1, pl: { md: 2 } }}>
                                    <Typography variant="h6" sx={{
                                        mb: 3,
                                        textAlign: 'center',
                                        direction: isRtl ? 'rtl' : 'ltr'
                                    }}>
                                        {t('form.enrollIn')} {selectedCourse?.title}
                                    </Typography>
                                    <form onSubmit={handleSubmit} style={{ direction: isRtl ? 'rtl' : 'ltr' }}>
                                        <TextField
                                            fullWidth
                                            label={t('form.name')}
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                            sx={{ mb: 2 }}
                                            InputLabelProps={{
                                                sx: { textAlign: isRtl ? 'left' : 'left', width: '100%' }
                                            }}
                                            inputProps={{
                                                style: { textAlign: isRtl ? 'right' : 'left' }
                                            }}
                                        />
                                        <TextField
                                            fullWidth
                                            label={t('form.email')}
                                            name="email"
                                            type="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                            sx={{ mb: 2 }}
                                            InputLabelProps={{
                                                sx: { textAlign: isRtl ? 'left' : 'left', width: '100%' }
                                            }}
                                            inputProps={{
                                                style: { textAlign: isRtl ? 'right' : 'left' }
                                            }}
                                        />
                                        <TextField
                                            fullWidth
                                            label={t('form.phone')}
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            required
                                            sx={{ mb: 2 }}
                                            InputLabelProps={{
                                                sx: { textAlign: isRtl ? 'left' : 'left', width: '100%' }
                                            }}
                                            inputProps={{
                                                style: { textAlign: isRtl ? 'right' : 'left' }
                                            }}
                                        />
                                        <TextField
                                            fullWidth
                                            label={t('form.company')}
                                            name="company"
                                            value={formData.company}
                                            onChange={handleChange}
                                            sx={{ mb: 3 }}
                                            InputLabelProps={{
                                                sx: { textAlign: isRtl ? 'left' : 'left', width: '100%' }
                                            }}
                                            inputProps={{
                                                style: { textAlign: isRtl ? 'right' : 'left' }
                                            }}
                                        />
                                        <Button
                                            type="submit"
                                            variant="contained"
                                            fullWidth
                                            disabled={isLoading}
                                            sx={{
                                                direction: isRtl ? 'rtl' : 'ltr'
                                            }}
                                        >
                                            {isLoading ? <CircularProgress size={24} /> : t('buttons.submit')}
                                        </Button>
                                    </form>
                                </Box>
                            </>
                        )}
                    </Box>
                </Modal>
            </Box>
        );
    };

    export default HomePopularCourse;