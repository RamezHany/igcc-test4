import React from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import Image from 'next/image';
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";

// Using program images for partners from external JSON

interface Partner {
    id: string;
    name: string;
    logo: string;
}

const StyledSection = styled(Box)(({ theme }) => ({
    padding: theme.spacing(4, 0),
    backgroundColor: theme.palette.background.default,
    borderTop: `1px solid ${theme.palette.divider}`,
    borderBottom: `1px solid ${theme.palette.divider}`,
    [theme.breakpoints.up('md')]: {
        padding: theme.spacing(6, 0),
    }
}));

const CarouselContainer = styled(Box)(({ theme }) => ({
    overflow: 'hidden',
    position: 'relative',
    width: '100%',
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(3, 1),
    borderRadius: theme.spacing(2),
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    [theme.breakpoints.up('sm')]: {
        padding: theme.spacing(4, 2),
    }
}));

// Create two different styled components for LTR and RTL
const CarouselTrackLTR = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(4),
    animation: 'scrollLTR 60s linear infinite',
    width: 'fit-content',
    '&:hover': {
        animationPlayState: 'paused',
    },
    '@keyframes scrollLTR': {
        '0%': { transform: 'translateX(0)' },
        '100%': { transform: 'translateX(calc(-50%))' }
    },
    [theme.breakpoints.up('sm')]: {
        gap: theme.spacing(5),
    }
}));

const CarouselTrackRTL = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(4),
    animation: 'scrollRTL 60s linear infinite',
    width: 'fit-content',
    '&:hover': {
        animationPlayState: 'paused',
    },
    '@keyframes scrollRTL': {
        '0%': { transform: 'translateX(0)' },
        '100%': { transform: 'translateX(calc(50%))' }
    },
    [theme.breakpoints.up('sm')]: {
        gap: theme.spacing(5),
    }
}));

const PartnerLogo = styled(Box)(({ theme }) => ({
    flex: '0 0 auto',
    width: 80,
    height: 80,
    position: 'relative',
    borderRadius: '50%',
    overflow: 'hidden',
    backgroundColor: theme.palette.background.paper,
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    transition: 'all 0.3s ease',
    '&:hover': {
        transform: 'scale(1.05)',
        boxShadow: '0 6px 20px rgba(0,0,0,0.15)',
    },
    [theme.breakpoints.up('sm')]: {
        width: 100,
        height: 100,
    },
    [theme.breakpoints.up('md')]: {
        width: 120,
        height: 120,
    }
}));

const PartnersCarousel: React.FC = () => {
    const [partners, setPartners] = React.useState<Partner[]>([]);
    const [loading, setLoading] = React.useState(true);
    const { t } = useTranslation('common')
    const { locale } = useRouter()
    const isRtl = locale === 'ar'

    React.useEffect(() => {
        fetch("https://raw.githubusercontent.com/RamezHany/IGCCe-tr/main/partners.json")
            .then((response) => response.json())
            .then((data) => {
                setPartners(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching partners:", error);
                setLoading(false);
            });
    }, []);

    const duplicatedPartners = [...partners, ...partners];

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <StyledSection>
            <Container maxWidth="lg">
                <Typography
                    component="h2"
                    variant="h3"
                    align="center"
                    sx={{
                        mb: { xs: 3, sm: 4, md: 6 },
                        fontWeight: 700,
                        color: '#283A5F',
                        fontSize: { xs: 24, sm: 28, md: 36 },
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                    }}
                >
                    {t('home.OurPartners')}
                </Typography>

                <CarouselContainer>
                    <Box sx={{
                        overflow: 'hidden',
                        position: 'relative',
                        width: '100%'
                    }}>
                        {isRtl ? (
                            <CarouselTrackRTL>
                                {duplicatedPartners.map((partner, index) => (
                                    <PartnerLogo key={`${partner.id}-${index}`}>
                                        <Box
                                            component="div"
                                            sx={{
                                                position: 'relative',
                                                width: '100%',
                                                height: '100%',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                            }}
                                        >
                                            <Image
                                                src={partner.logo}
                                                alt={partner.name}
                                                width={120}
                                                height={120}
                                                style={{
                                                    objectFit: 'contain',
                                                    borderRadius: '50%',
                                                    width: '90%',
                                                    height: '90%'
                                                }}
                                                priority={index < 8}
                                            />
                                        </Box>
                                    </PartnerLogo>
                                ))}
                            </CarouselTrackRTL>
                        ) : (
                            <CarouselTrackLTR>
                                {duplicatedPartners.map((partner, index) => (
                                    <PartnerLogo key={`${partner.id}-${index}`}>
                                        <Box
                                            component="div"
                                            sx={{
                                                position: 'relative',
                                                width: '100%',
                                                height: '100%',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                            }}
                                        >
                                            <Image
                                                src={partner.logo}
                                                alt={partner.name}
                                                width={120}
                                                height={120}
                                                style={{
                                                    objectFit: 'contain',
                                                    borderRadius: '50%',
                                                    width: '90%',
                                                    height: '90%'
                                                }}
                                                priority={index < 8}
                                            />
                                        </Box>
                                    </PartnerLogo>
                                ))}
                            </CarouselTrackLTR>
                        )}
                    </Box>
                </CarouselContainer>
            </Container>
        </StyledSection>
    );
};

export default PartnersCarousel;