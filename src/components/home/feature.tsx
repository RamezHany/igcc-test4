import React, { FC, useState, useEffect } from 'react'
import Image from 'next/image'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'
import SocialLinks from "@/components/home/SocilaLiks";

interface ConfigData {
  doctorImage: string;
  vimeoLink: string;
}

const HomeFeature: FC = () => {
  const { t } = useTranslation('common')
  const { locale } = useRouter()
  const isRtl = locale === 'ar'
  const [config, setConfig] = useState<ConfigData>({ doctorImage: '/images/Nourhan_m_Hassan.png', vimeoLink: '' });

  useEffect(() => {
    // Fetch config data
    fetch('https://raw.githubusercontent.com/RamezHany/IGCCe-tr/refs/heads/main/config.json')
      .then(response => response.json())
      .then(data => setConfig(data))
      .catch(error => console.error('Error loading config:', error));
  }, []);

  return (
    <Box id="feature" sx={{ xs: 10, md: 14 , backgroundColor: 'background.paper' }}>
      <Container>
        <Grid container spacing={3}>
          <Grid item xs={12} md={5}>
            <Box sx={{ position: 'relative' }}>
              <Image src={config.doctorImage} width={450} height={478} quality={97} alt="Feature img" />
            </Box>
          </Grid>
          <Grid item xs={12} md={7}>
            <Typography
              component="h2"
              sx={{
                position: 'relative',
                fontSize: { xs: 40, md: 50 },
                ml: { xs: 0 },
                mt: 2,
                mb: 3,
                lineHeight: 1,
                fontWeight: 'bold',
                textAlign: isRtl ? 'right' : 'left',
              }}
            >
              {t('home.launchCareer')}{' '}
              <Typography
                component="mark"
                sx={{
                  position: 'relative',
                  color: '#283A5F',
                  fontSize: 'inherit',
                  fontWeight: 'inherit',
                  backgroundColor: 'unset',
                }}
              >
                {t('home.withIGCC')} <br />
                <Box
                  sx={{
                    position: 'absolute',
                    top: { xs: 20, md: 28 },
                    transform: isRtl ? 'rotate(-3deg)' : 'rotate(3deg)',
                    [isRtl ? 'right' : 'left']: 2,
                    '& img': { width: { xs: 140, md: 175 }, height: 'auto' },
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/images/headline-curve.svg" alt={t('home.withIGCC')} />
                </Box>
              </Typography>
            </Typography>

            <Typography
              sx={{
                color: 'text.secondary',
                mb: 2,
                ml: { xs: 0, md: 4 },
                textAlign: isRtl ? 'left' : 'left',
                direction: isRtl ? 'rtl' : 'ltr'
              }}
            >
              {t('home.mainDescription')}
            </Typography>

            <Typography
              sx={{
                color: 'text.secondary',
                ml: { xs: 0, md: 4 },
                textAlign: isRtl ? 'left' : 'left',
                direction: isRtl ? 'rtl' : 'ltr'
              }}
            >
              {t('home.vision2030')}
            </Typography>
          {/*  the social links app  */}
              <Typography
                  sx={{
                      color: 'text.secondary',
                      ml: { xs: 0, md: 4 },
                      textAlign: isRtl ? 'left' : 'left',
                      direction: isRtl ? 'rtl' : 'ltr',
                      mt: 2
                  }}
              >
              </Typography>

              <Box
                  sx = {{
                      paddingRight : '40px'
                  }}
              >
                  <SocialLinks />
              </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}

export default HomeFeature
