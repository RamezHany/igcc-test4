import React from 'react';
import { useRouter } from 'next/router';
import { IconButton, Tooltip } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import LanguageIcon from '@mui/icons-material/Language';

const LanguageSwitcher = () => {
  const router = useRouter();
  const theme = useTheme();
  const { locale, pathname, asPath, query } = router;
  const isArabic = locale === 'ar';

  const toggleLanguage = () => {
    const newLocale = isArabic ? 'en' : 'ar';
    router.push({ pathname, query }, asPath, { locale: newLocale });
  };

  return (
    <Tooltip title={isArabic ? 'English' : 'العربية'}>
      <IconButton
        onClick={toggleLanguage}
        sx={{
          color: 'inherit',
          backgroundColor: 'transparent',
          borderRadius: '50%',
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
          },
          position: 'relative',
          '&::after': {
            content: '""',
            position: 'absolute',
            right: 0,
            bottom: 0,
            width: '14px',
            height: '14px',
            borderRadius: '50%',
            backgroundColor: theme.palette.primary.main,
            border: `2px solid ${theme.palette.background.paper}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '10px',
            fontWeight: 'bold',
            color: theme.palette.primary.contrastText,
          },
          '&::before': {
            content: isArabic ? '"ع"' : '"En"',
            position: 'absolute',
            right: 0,
            bottom: 0,
            width: '14px',
            height: '14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '10px',
            fontWeight: 'bold',
            color: theme.palette.primary.contrastText,
            zIndex: 1,
          }
        }}
      >
        <LanguageIcon />
      </IconButton>
    </Tooltip>
  );
};

export default LanguageSwitcher;
