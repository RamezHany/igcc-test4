import React, { FC } from 'react';
import Box from '@mui/material/Box';
import { Link as ScrollLink } from 'react-scroll';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { navigations } from './navigation.data';
import { useTranslation } from 'next-i18next';

interface NavigationProps {
  onAnchorClick?: (href: string) => void;
}

const Navigation: FC<NavigationProps> = ({ onAnchorClick }) => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const isHomePage = router.pathname === '/';
  const { locale } = router;

  return (
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' } }}>
        {navigations.map(({ path: destination, label }) => {
          // Skip rendering news/blog section if language is not Arabic
          if (label.toLowerCase() === 'news' && locale !== 'ar') {
            return null;
          }

          const content = (
              <>
                {t(`menu.${label.toLowerCase()}`)}
                <Box
                    sx={{
                      position: 'absolute',
                      top: 12,
                      transform: 'rotate(3deg)',
                      '& img': { width: 44, height: 'auto' },
                    }}
                >
                  {/* eslint-disable-next-line */}
                  <img src="/images/headline-curve.svg" alt="Headline curve" />
                </Box>
              </>
          );

          const commonStyles = {
            position: 'relative',
            color: 'text.disabled',
            cursor: 'pointer',
            fontWeight: 600,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            px: { xs: 0, md: 3 },
            mb: { xs: 3, md: 0 },
            fontSize: { xs: '1.2rem', md: 'inherit' },
            ...(destination === '#' && {
              color: '#283A5F',
            }),
            '& > div': { display: 'none' },
            '&.current>div': { display: 'block' },
            '&:hover': {
              color: '#283A5F',
              '&>div': {
                display: 'block',
              },
            },
          };

          // Handle special pages like summit that should navigate to their own page
          const isSpecialPage = label.toLowerCase() === 'summit';

          // Determine the correct href
          const href = isSpecialPage
              ? `/${destination}`
              : (isHomePage ? destination : (destination === '#' ? '/' : `/#${destination}`));

          // Use ScrollLink for sections on homepage, regular Link for other pages
          if (isHomePage && !isSpecialPage) {
            return (
                <Box
                    component={ScrollLink}
                    key={destination}
                    activeClass="current"
                    to={destination === '#' ? 'hero' : destination}
                    spy={true}
                    smooth={true}
                    duration={350}
                    sx={commonStyles}
                    onClick={() => {
                      if (onAnchorClick) {
                        onAnchorClick(destination === '#' ? 'hero' : destination);
                      }
                    }}
                >
                  {content}
                </Box>
            );
          } else {
            // For non-home pages, we need to ensure the hash is properly included
            return (
                <Link
                    key={destination}
                    href={href}
                    passHref
                >
                  <Box
                      component="a"
                      sx={{ ...commonStyles, textDecoration: 'none' }}
                      onClick={() => {
                        if (onAnchorClick) {
                          onAnchorClick(destination === '#' ? 'hero' : destination);
                        }
                      }}
                  >
                    {content}
                  </Box>
                </Link>
            );
          }
        })}
      </Box>
  );
};

export default Navigation;