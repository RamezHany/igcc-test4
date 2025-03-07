import React, { FC, useState } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import { TextareaAutosize } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Button from '@mui/material/Button';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import CircularProgress from '@mui/material/CircularProgress';

const HomeNewsLetter: FC = () => {
    const { t } = useTranslation('common');
    const { locale } = useRouter();
    const isRtl = locale === 'ar';

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        inquiryType: '',
        message: '',
    });
    const [openDialog, setOpenDialog] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const GOOGLE_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzslKJcRQYEKEKR8IN1pnjFQWvVI-3eAZ5dPhYtuUTzKbtW4n8SDjVqsk9qlfTice2N/exec';

            const url = new URL(GOOGLE_APPS_SCRIPT_URL);
            // Add formType parameter to indicate this is a contact form submission
            url.searchParams.append('formType', 'contact');
            Object.keys(formData).forEach(key =>
                url.searchParams.append(key, formData[key as keyof typeof formData])
            );

            await fetch(url.toString(), {
                method: 'GET',
                mode: 'no-cors',
            });

            setOpenDialog(true);
            setFormData({
                name: '',
                email: '',
                phone: '',
                inquiryType: '',
                message: '',
            });
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('Sorry, there was an error submitting your message. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Box id="contact-form" sx={{ backgroundColor: 'background.paper', py: { xs: 8, md: 10 } }}>
            <Container>
                <Box
                    sx={{
                        borderRadius: 10,
                        py: { xs: 4, md: 10 },
                        px: { xs: 4, md: 8 },
                        textAlign: 'center',
                    }}
                >
                    <Typography variant="h1" component="h2" sx={{ mb: 1, fontSize: { xs: 32, md: 42 } }}>
                        {t('contactUs')}
                    </Typography>
                    <Typography sx={{ mb: 6 }}>{t('getInTouch')}</Typography>

                    <Box
                        component="form"
                        onSubmit={handleSubmit}
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: 3,
                            width: { xs: '100%', md: 600 },
                            mx: 'auto',
                        }}
                    >
                        {/* Name Field */}
                        <TextField
                            fullWidth
                            label={t('form.name')}
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            InputLabelProps={{
                                sx: { textAlign: isRtl ? 'left' : 'left', width: '100%' }
                            }}
                            sx={{
                                '& .MuiInputBase-root': {
                                    direction: isRtl ? 'rtl' : 'ltr'
                                }
                            }}
                        />

                        {/* Email Field */}
                        <TextField
                            fullWidth
                            label={t('form.email')}
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            InputLabelProps={{
                                sx: { textAlign: isRtl ? 'left' : 'left', width: '100%' }
                            }}
                            sx={{
                                '& .MuiInputBase-root': {
                                    direction: isRtl ? 'rtl' : 'ltr'
                                }
                            }}
                        />

                        {/* Phone Field */}
                        <TextField
                            fullWidth
                            label={t('form.phone')}
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                            InputLabelProps={{
                                sx: { textAlign: isRtl ? 'left' : 'left', width: '100%' }
                            }}
                            sx={{
                                '& .MuiInputBase-root': {
                                    direction: isRtl ? 'rtl' : 'ltr'
                                }
                            }}
                        />

                        {/* Inquiry Type Dropdown */}
                        <FormControl fullWidth required sx={{ backgroundColor: 'background.paper', borderRadius: 3 }}>
                            <InputLabel id="inquiry-type-label">{t('form.inquiryType')}</InputLabel>
                            <Select
                                labelId="inquiry-type-label"
                                label={t('form.inquiryType')}
                                name="inquiryType"
                                value={formData.inquiryType}
                                onChange={handleChange}
                            >
                                <MenuItem value="course">{t('course')}</MenuItem>
                                <MenuItem value="mentoring">{t('mentoring')}</MenuItem>
                                <MenuItem value="governance">{t('governance')}</MenuItem>
                                <MenuItem value="support">{t('support')}</MenuItem>
                            </Select>
                        </FormControl>

                        {/* Message Textarea */}
                        <TextareaAutosize
                            aria-label="Message"
                            minRows={5}
                            placeholder={t('form.messagePlaceholder')}
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            required
                            style={{
                                width: '100%',
                                padding: '16px',
                                borderRadius: '12px',
                                border: '1px solid #ccc',
                                backgroundColor: '#fff',
                                fontFamily: 'inherit',
                                fontSize: '1rem',
                                direction: isRtl ? 'rtl' : 'ltr',
                                textAlign: isRtl ? 'right' : 'left',
                                resize: 'vertical', // Restrict resizing to vertical only
                            }}
                        />

                        {/* Submit Button */}
                        <Box sx={{ '& button': {
                                background:"#56bb76" }}}>
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                size="large"
                                disabled={isLoading}
                                sx={{
                                    // minWidth: '200px',
                                    position: 'relative',
                                    height: 54,
                                    fontSize: '16px',
                                    backgroundColor: '#56bb76', // Default background color
                                    '&:hover': {
                                        backgroundColor: '#56bb76', // Same as default to remove hover effect
                                    },
                                }}
                            >
                                {isLoading ? (
                                    <Box sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 2
                                    }}>
                                        <CircularProgress
                                            size={20}
                                            sx={{
                                                color: 'white',
                                                marginRight: 1
                                            }}
                                        />
                                        <Typography sx={{
                                            fontWeight: 'normal',
                                            fontSize: '1rem'
                                        }}>
                                            {locale === 'ar' ? 'جاري الإرسال...' : 'Sending...'}
                                        </Typography>
                                    </Box>
                                ) : (
                                    t('buttons.submit')
                                )}
                            </Button>
                        </Box>

                    </Box>
                </Box>
            </Container>

            {/* Success Dialog */}
            <Dialog
                open={openDialog}
                onClose={handleCloseDialog}
                aria-labelledby="success-dialog-title"
                maxWidth="sm"
                fullWidth
            >
                <DialogContent sx={{
                    textAlign: 'center',
                    py: 4,
                    px: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 2
                }}>
                    <CheckCircleIcon sx={{
                        fontSize: 80,
                        color: 'success.main',
                        mb: 2
                    }} />
                    <Typography variant="h5" component="h2" gutterBottom>
                        {t('successMessage')}
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                        {t('successDescription')}
                    </Typography>
                    <Button
                        onClick={handleCloseDialog}
                        variant="contained"
                        color="primary"
                        size="large"
                    >
                        {t('buttons.okay')}
                    </Button>
                </DialogContent>
            </Dialog>
        </Box>
    );
};

export default HomeNewsLetter;