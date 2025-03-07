import React, { useState, useEffect } from 'react';
import { NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import { styled } from '@mui/material/styles';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { NextPageWithLayout } from '@/interfaces/layout';
import { MainLayout } from '@/components/layout';

// Styled components
const StyledContainer = styled(Container)(({ theme }) => ({
  paddingTop: theme.spacing(12),
  paddingBottom: theme.spacing(8),
}));

const HeroSection = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(to right, #283A5F, #1976d2)',
  color: theme.palette.common.white,
  padding: theme.spacing(8, 0),
  marginBottom: theme.spacing(6),
  borderRadius: theme.shape.borderRadius,
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
}));

const FormContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: theme.shape.borderRadius,
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
}));

const IntroCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
  borderRadius: theme.shape.borderRadius,
  overflow: 'hidden',
}));

interface ConfigData {
  vimeoLink: string;
  doctorImage: string;
  summitImage: string;
}

const SummitPage: NextPageWithLayout = () => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const { locale, pathname } = router;
  const isRtl = locale === 'ar';

  // Config state
  const [config, setConfig] = useState<ConfigData>({ 
    vimeoLink: '', 
    doctorImage: '', 
    summitImage: 'summit.jpg' 
  });

  // State to control previous summit details visibility
  const [showPreviousSummitDetails, setShowPreviousSummitDetails] = useState(false);

  useEffect(() => {
    // Fetch config data
    fetch('https://raw.githubusercontent.com/RamezHany/IGCCe-tr/refs/heads/main/config.json')
      .then(response => response.json())
      .then(data => setConfig(data))
      .catch(error => console.error('Error loading config:', error));
  }, []);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    organization: '',
    position: '',
    phone: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    setError(false);

    try {
      // Direct Google Apps Script web app URL - replace with your actual deployed script URL
      const scriptURL = 'https://script.google.com/macros/s/AKfycbzslKJcRQYEKEKR8IN1pnjFQWvVI-3eAZ5dPhYtuUTzKbtW4n8SDjVqsk9qlfTice2N/exec';
      
      // Create form data for submission
      const formDataToSubmit = new URLSearchParams();
      formDataToSubmit.append('formType', 'summit'); // Specify that this is a summit form
      formDataToSubmit.append('name', formData.name);
      formDataToSubmit.append('email', formData.email);
      formDataToSubmit.append('phone', formData.phone || '');
      formDataToSubmit.append('organization', formData.organization || '');
      formDataToSubmit.append('position', formData.position || '');
      formDataToSubmit.append('message', formData.message || '');
      
      // Send data to Google Sheets
      const response = await fetch(scriptURL, {
        method: 'POST',
        mode: 'no-cors', // This is important for CORS issues
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formDataToSubmit.toString(),
      });
      
      // Since no-cors mode doesn't return readable response, we assume success if no error is thrown
      setSuccess(true);
      setFormData({
        name: '',
        email: '',
        organization: '',
        position: '',
        phone: '',
        message: '',
      });
    } catch (err) {
      console.error('Error submitting form:', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>{t('summit.title')} | {t('title')}</title>
        <meta name="description" content={t('summit.subtitle')} />
      </Head>

      <StyledContainer maxWidth="lg" sx={{pt:15}}>
        <HeroSection >
          <Container>
            <Box sx={{ textAlign: 'center', mb: 5  }}>
              <Typography variant="h3" component="h1" gutterBottom>
                {t('summit.title')}
              </Typography>
              <Typography variant="h6">
                {t('summit.subtitle')}
              </Typography>
              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center', gap: 2 }}>
                <Typography variant="body1">
                  <strong>{t('summit.date')}</strong>
                </Typography>
                <Typography variant="body1">|</Typography>
                <Typography variant="body1">
                  <strong>{t('summit.location')}</strong>
                </Typography>
              </Box>
            </Box>
          </Container>
        </HeroSection>

        {/* Previous Summit Section with Toggle Button */}
        <Box sx={{ mb: 8, textAlign: 'center' }}>
          <Typography variant="h4" component="h2" gutterBottom sx={{ mb: 2, textAlign: 'center' }}>
            {isRtl ? 'الملتقى السابق' : 'Previous Summit'}
          </Typography>
          
          <Paper sx={{ p: 4, borderRadius: 2, boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)', mb: 4 }}>
            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <Typography variant="h5" gutterBottom sx={{ textAlign: isRtl ? 'right' : 'left' }}>
                    {isRtl ? 'الملتقى العربي الأول للحوكمة والتنمية المستدامة' : 'First Arab Governance and Sustainable Development Summit'}
                  </Typography>
                  <Typography variant="body1" paragraph sx={{ textAlign: isRtl ? 'right' : 'left', direction: isRtl ? 'rtl' : 'ltr' }}>
                    {isRtl 
                      ? 'تم عقد الملتقى العربي الأول للحوكمة والتنمية المستدامة في مايو 2023 بمشاركة أكثر من 200 خبير ومتخصص من مختلف الدول العربية.'
                      : 'The First Arab Governance and Sustainable Development Summit was held in May 2023 with the participation of more than 200 experts and specialists from various Arab countries.'}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2, mt: 2, justifyContent: isRtl ? 'flex-end' : 'flex-start' }}>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                      {isRtl ? 'التاريخ: مايو 2023' : 'Date: May 2023'}
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                      {isRtl ? 'المكان: القاهرة، مصر' : 'Location: Cairo, Egypt'}
                    </Typography>
                  </Box>
                  
                  <Button 
                    variant="contained" 
                    color="primary" 
                    sx={{ mt: 3, alignSelf: isRtl ? 'flex-end' : 'flex-start' }}
                    onClick={() => setShowPreviousSummitDetails(!showPreviousSummitDetails)}
                  >
                    {isRtl 
                      ? showPreviousSummitDetails ? 'إخفاء التفاصيل' : 'تفاصيل الملتقى السابق' 
                      : showPreviousSummitDetails ? 'Hide Details' : 'Previous Summit Details'
                    }
                  </Button>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box 
                  component="img"
                  src="summit.jpg"
                  alt={isRtl ? 'صورة من الملتقى السابق' : 'Image from previous summit'}
                  sx={{ 
                    width: '100%', 
                    height: 300, 
                    objectFit: 'cover', 
                    borderRadius: 2,
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                  }}
                />
              </Grid>
            </Grid>
          </Paper>
          
          {/* Collapsible Previous Summit Details */}
          {showPreviousSummitDetails && (
            <Box sx={{ mt: 4, animation: 'fadeIn 0.5s ease-in-out' }}>
              {/* Additional Details about the Previous Summit */}
              <Typography variant="body1" paragraph sx={{ mb: 4, px: 2, textAlign: isRtl ? 'right' : 'left', direction: isRtl ? 'rtl' : 'ltr' }}>
                {isRtl 
                  ? 'ناقش الملتقى التحديات والفرص في مجال الحوكمة والتنمية المستدامة في المنطقة العربية، وقدم توصيات هامة لتعزيز الممارسات المؤسسية. كان الملتقى فرصة استثنائية لتبادل الخبرات والمعرفة بين المشاركين من مختلف الدول العربية.'
                  : 'The summit discussed challenges and opportunities in governance and sustainable development in the Arab region, and presented important recommendations to enhance institutional practices. It was an exceptional opportunity for exchanging expertise and knowledge among participants from various Arab countries.'}
              </Typography>
              
              {/* Key Achievements */}
              <Typography variant="h5" gutterBottom sx={{ mt: 6, mb: 3, textAlign: isRtl ? 'right' : 'left' }}>
                {isRtl ? 'أبرز إنجازات الملتقى السابق' : 'Key Achievements of Previous Summit'}
              </Typography>
              
              <Grid container spacing={3}>
                {/* Achievement 1 */}
                <Grid item xs={12} md={4}>
                  <Card sx={{ height: '100%', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)' }}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom sx={{ textAlign: isRtl ? 'right' : 'left' }}>
                        {isRtl ? 'تبادل الخبرات' : 'Knowledge Exchange'}
                      </Typography>
                      <Typography variant="body2" sx={{ textAlign: isRtl ? 'right' : 'left', direction: isRtl ? 'rtl' : 'ltr' }}>
                        {isRtl 
                          ? 'تبادل الخبرات والمعرفة بين المشاركين من مختلف الدول العربية، مما أثرى النقاشات وساهم في تطوير رؤى مشتركة.'
                          : 'Exchange of expertise and knowledge among participants from various Arab countries, enriching discussions and contributing to the development of shared visions.'}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                
                {/* Achievement 2 */}
                <Grid item xs={12} md={4}>
                  <Card sx={{ height: '100%', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)' }}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom sx={{ textAlign: isRtl ? 'right' : 'left' }}>
                        {isRtl ? 'توصيات عملية' : 'Practical Recommendations'}
                      </Typography>
                      <Typography variant="body2" sx={{ textAlign: isRtl ? 'right' : 'left', direction: isRtl ? 'rtl' : 'ltr' }}>
                        {isRtl 
                          ? 'تقديم توصيات عملية لتعزيز الحوكمة في المؤسسات العربية، مع التركيز على الشفافية والمساءلة وتطبيق أفضل الممارسات العالمية.'
                          : 'Providing practical recommendations to enhance governance in Arab institutions, focusing on transparency, accountability, and the application of global best practices.'}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                
                {/* Achievement 3 */}
                <Grid item xs={12} md={4}>
                  <Card sx={{ height: '100%', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)' }}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom sx={{ textAlign: isRtl ? 'right' : 'left' }}>
                        {isRtl ? 'شراكات استراتيجية' : 'Strategic Partnerships'}
                      </Typography>
                      <Typography variant="body2" sx={{ textAlign: isRtl ? 'right' : 'left', direction: isRtl ? 'rtl' : 'ltr' }}>
                        {isRtl 
                          ? 'بناء شراكات استراتيجية بين المؤسسات المشاركة، مما يعزز التعاون المستقبلي في مجالات الحوكمة والتنمية المستدامة.'
                          : 'Building strategic partnerships between participating institutions, enhancing future cooperation in the fields of governance and sustainable development.'}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
              
              {/* Gallery Section */}
              <Typography variant="h5" gutterBottom sx={{ mt: 6, mb: 3, textAlign: isRtl ? 'right' : 'left' }}>
                {isRtl ? 'معرض الصور' : 'Photo Gallery'}
              </Typography>
              
              <Grid container spacing={2}>
                {[
                  'summit.jpg',
                  'summit2.jpg',
                  'summit3.jpg',
                  'summit4.jpg'
                ].map((image, index) => (
                  <Grid item xs={6} md={3} key={index}>
                    <Box
                      component="img"
                      src={image}
                      alt={`Summit photo ${index + 1}`}
                      sx={{ 
                        width: '100%', 
                        height: 180, 
                        objectFit: 'cover', 
                        borderRadius: 2,
                        transition: 'transform 0.3s ease',
                        cursor: 'pointer',
                        '&:hover': {
                          transform: 'scale(1.03)',
                          boxShadow: '0 6px 20px rgba(0, 0, 0, 0.15)'
                        }
                      }}
                    />
                  </Grid>
                ))}
              </Grid>

              {/* Speakers and Participants Section */}
              <Typography variant="h5" gutterBottom sx={{ mt: 6, mb: 3, textAlign: isRtl ? 'right' : 'left' }}>
                {isRtl ? 'المتحدثون والمشاركون' : 'Speakers and Participants'}
              </Typography>

              <Grid container spacing={3}>
                {/* Opening Session Speakers */}
                <Grid item xs={12}>
                  <Paper sx={{ p: 3, mb: 3 }}>
                    <Typography variant="h6" gutterBottom sx={{ color: 'primary.main', textAlign: isRtl ? 'right' : 'left' }}>
                      {isRtl ? 'المتحدثون في الجلسة الافتتاحية' : 'Opening Session Speakers'}
                    </Typography>
                    <ul style={{ 
                      listStyleType: 'none', 
                      padding: 0,
                      textAlign: isRtl ? 'right' : 'left', 
                      direction: isRtl ? 'rtl' : 'ltr' 
                    }}>
                      <li style={{ marginBottom: '8px' }}>• {isRtl ? 'الدكتورة نورهان حسن – رئيس مجلس إدارة المركز الدولي لاستشارات الحوكمة' : 'Dr. Nourhan Hassan – Chairman of the International Center for Governance Consulting'}</li>
                      <li style={{ marginBottom: '8px' }}>• {isRtl ? 'المهندس روحى العربى - رجل الاعمال و رئيس مجلس امناء مؤسسة الجمهورية الجديدة للتنمية' : 'Eng. Rowhi El-Araby - Chairman of the Board of Trustees of the New Republic Foundation for Development'}</li>
                      <li style={{ marginBottom: '8px' }}>• {isRtl ? 'اللواء ممدوح النمر – الأمين العام لمحافظة الإسكندرية' : 'Major General Mamdouh El-Nimr – Secretary General of Alexandria Governorate'}</li>
                    </ul>
                  </Paper>
                </Grid>

                {/* First Session */}
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 3, height: '100%' }}>
                    <Typography variant="h6" gutterBottom sx={{ color: 'primary.main', textAlign: isRtl ? 'right' : 'left' }}>
                      {isRtl ? 'الجلسة الأولى' : 'First Session'}
                    </Typography>
                    <Typography variant="subtitle2" gutterBottom sx={{ color: 'text.secondary', textAlign: isRtl ? 'right' : 'left' }}>
                      {isRtl ? 'إدارة: د. إبراهيم الشبيني' : 'Moderated by: Dr. Ibrahim El-Shebini'}
                    </Typography>
                    <ul style={{ 
                      listStyleType: 'none', 
                      padding: 0,
                      textAlign: isRtl ? 'right' : 'left', 
                      direction: isRtl ? 'rtl' : 'ltr' 
                    }}>
                      <li style={{ marginBottom: '8px' }}>• {isRtl ? 'د. السيد الصيفي – أستاذ التمويل والاستثمار' : 'Dr. El-Sayed El-Seify – Professor of Finance and Investment'}</li>
                      <li style={{ marginBottom: '8px' }}>• {isRtl ? 'د. ماجد عبد العظيم – أستاذ الاقتصاد' : 'Dr. Maged Abdel-Azim – Professor of Economics'}</li>
                      <li style={{ marginBottom: '8px' }}>• {isRtl ? 'د. نورهان حسن – مستشار دولي معتمد' : 'Dr. Nourhan Hassan – Certified International Consultant'}</li>
                      <li style={{ marginBottom: '8px' }}>• {isRtl ? 'د. رامي فتح الله – شريك ومدير مكتب فتح الله' : 'Dr. Rami Fathalla – Partner and Manager at Fathalla Office'}</li>
                    </ul>
                  </Paper>
                </Grid>

                {/* Second Session */}
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 3, height: '100%' }}>
                    <Typography variant="h6" gutterBottom sx={{ color: 'primary.main', textAlign: isRtl ? 'right' : 'left' }}>
                      {isRtl ? 'الجلسة الثانية' : 'Second Session'}
                    </Typography>
                    <Typography variant="subtitle2" gutterBottom sx={{ color: 'text.secondary', textAlign: isRtl ? 'right' : 'left' }}>
                      {isRtl ? 'إدارة: د. رانيا المالكي' : 'Moderated by: Dr. Rania El-Malki'}
                    </Typography>
                    <ul style={{ 
                      listStyleType: 'none', 
                      padding: 0,
                      textAlign: isRtl ? 'right' : 'left', 
                      direction: isRtl ? 'rtl' : 'ltr' 
                    }}>
                      <li style={{ marginBottom: '8px' }}>• {isRtl ? 'المستشار أحمد الزيات – مستشار في الحوكمة' : 'Counselor Ahmed El-Zayat – Governance Consultant'}</li>
                      <li style={{ marginBottom: '8px' }}>• {isRtl ? 'د. ناصر حسن – خبير مصرفي' : 'Dr. Nasser Hassan – Banking Expert'}</li>
                      <li style={{ marginBottom: '8px' }}>• {isRtl ? 'م. محمد صلاح – مدير عام الطاقة والجودة' : 'Eng. Mohamed Salah – General Manager of Energy and Quality'}</li>
                    </ul>
                  </Paper>
                </Grid>

                {/* Distinguished Attendees */}
                <Grid item xs={12}>
                  <Paper sx={{ p: 3 }}>
                    <Typography variant="h6" gutterBottom sx={{ color: 'primary.main', textAlign: isRtl ? 'right' : 'left' }}>
                      {isRtl ? 'الحضور المميز' : 'Distinguished Attendees'}
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <ul style={{ 
                          listStyleType: 'none', 
                          padding: 0,
                          textAlign: isRtl ? 'right' : 'left', 
                          direction: isRtl ? 'rtl' : 'ltr' 
                        }}>
                          <li style={{ marginBottom: '8px' }}>• {isRtl ? 'أ. رزق الطرابيشي – نقيب الصحفيين' : 'Mr. Rizk El-Tarabishi – Head of Journalists Syndicate'}</li>
                          <li style={{ marginBottom: '8px' }}>• {isRtl ? 'د. محمد أنسي – نقيب الصيادلة' : 'Dr. Mohamed Onsi – Head of Pharmacists Syndicate'}</li>
                          <li style={{ marginBottom: '8px' }}>• {isRtl ? 'أ. محمود طلحة – شركة تراي مي فارما' : 'Mr. Mahmoud Talha – Try Me Pharma Company'}</li>
                          <li style={{ marginBottom: '8px' }}>• {isRtl ? 'أ. أسامة أبو المجد – رئيس هيئة الاستثمار بالإسكندرية' : 'Mr. Osama Abul-Magd – Head of Alexandria Investment Authority'}</li>
                        </ul>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <ul style={{ 
                          listStyleType: 'none', 
                          padding: 0,
                          textAlign: isRtl ? 'right' : 'left', 
                          direction: isRtl ? 'rtl' : 'ltr' 
                        }}>
                          <li style={{ marginBottom: '8px' }}>• {isRtl ? 'أ. مجدي عبد العزيز – الأمين العام للجنة الممول والضريبة' : 'Mr. Magdy Abdel-Aziz – Secretary General of Tax Committee'}</li>
                          <li style={{ marginBottom: '8px' }}>• {isRtl ? 'د. علاء الغرباوي – وكيل كلية الأعمال' : 'Dr. Alaa El-Gharbawy – Vice Dean of Business College'}</li>
                          <li style={{ marginBottom: '8px' }}>• {isRtl ? 'أ. مهاب – وكيل كلية التربية الرياضية' : 'Mr. Mohab – Vice Dean of Physical Education College'}</li>
                          <li style={{ marginBottom: '8px' }}>• {isRtl ? 'أ. أحمد معطي – خبير الأسواق المالية' : 'Mr. Ahmed Moaty – Financial Markets Expert'}</li>
                        </ul>
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>
              </Grid>
            </Box>
          )}
        </Box>

        <Grid container spacing={6} sx={{ mb: 8 }}>
          <Grid item xs={12} md={6}>
            <IntroCard>
              <CardMedia
                component="img"
                height="300"
                image={config.summitImage}
                alt={t('summit.title')}
                sx={{ objectFit: 'cover' }}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h5" component="h2" gutterBottom sx={{ textAlign: isRtl ? 'right' : 'left' }}>
                  {t('summit.title')}
                </Typography>
                <Typography 
                  variant="body1" 
                  paragraph 
                  sx={{ 
                    textAlign: isRtl ? 'right' : 'left',
                    direction: isRtl ? 'rtl' : 'ltr'
                  }}
                >
                  {t('summit.introduction')}
                </Typography>
              </CardContent>
            </IntroCard>
          </Grid>

          <Grid item xs={12} md={6}>
            <FormContainer>
              <Typography variant="h5" component="h2" gutterBottom sx={{ textAlign: isRtl ? 'right' : 'left' }}>
                {t('summit.registerTitle')}
              </Typography>

              {success && (
                <Alert severity="success" sx={{ mb: 3 }}>
                  {t('summit.formSuccess')}
                </Alert>
              )}

              {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                  {t('summit.formError')}
                </Alert>
              )}

              <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      label={t('summit.formName')}
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      dir={isRtl ? 'rtl' : 'ltr'}
                      InputProps={{
                        sx: { textAlign: isRtl ? 'right' : 'left' }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      label={t('summit.formEmail')}
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      dir="ltr"
                      InputProps={{
                        sx: { textAlign: 'left' }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label={t('summit.formOrganization')}
                      name="organization"
                      value={formData.organization}
                      onChange={handleChange}
                      dir={isRtl ? 'rtl' : 'ltr'}
                      InputProps={{
                        sx: { textAlign: isRtl ? 'right' : 'left' }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label={t('summit.formPosition')}
                      name="position"
                      value={formData.position}
                      onChange={handleChange}
                      dir={isRtl ? 'rtl' : 'ltr'}
                      InputProps={{
                        sx: { textAlign: isRtl ? 'right' : 'left' }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label={t('summit.formPhone')}
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      dir="ltr"
                      InputProps={{
                        sx: { textAlign: 'left' }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      multiline
                      rows={4}
                      label={t('summit.formMessage')}
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      dir={isRtl ? 'rtl' : 'ltr'}
                      InputProps={{
                        sx: { textAlign: isRtl ? 'right' : 'left' }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      fullWidth
                      size="large"
                      disabled={loading}
                      sx={{ py: 1.5 }}
                    >
                      {loading ? (
                        <CircularProgress size={24} color="inherit" />
                      ) : (
                        t('summit.formSubmit')
                      )}
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </FormContainer>
          </Grid>
        </Grid>
      </StyledContainer>
    </>
  );
};

// Add the getLayout function to use the MainLayout
SummitPage.getLayout = (page) => (
  <MainLayout 
    seo={{
      title: 'Governance and Sustainable Development Summit',
      description: 'Join us for the Arab Governance and Sustainable Development Summit'
    }}
  >
    {page}
  </MainLayout>
);

export const getStaticProps = async ({ locale }: { locale: string }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? 'en', ['common'])),
    },
  };
};

export default SummitPage;
