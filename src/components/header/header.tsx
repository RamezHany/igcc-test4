import React, { FC, useState } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Logo } from '@/components/logo';
import { Navigation } from '@/components/navigation';
import { useTheme } from '@mui/material/styles';
import { Menu, Close } from '@mui/icons-material';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import Popover from '@mui/material/Popover';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

const Header: FC = () => {
    const [visibleMenu, setVisibleMenu] = useState<boolean>(false);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const { breakpoints } = useTheme();
    const matchMobileView = useMediaQuery(breakpoints.down('md'));
    const { locale, locales, push, pathname, asPath, query } = useRouter();
    const isRtl = locale === 'ar';

    const handleLanguageMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleLanguageMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLanguageChange = (newLocale: string) => {
        // Preserve the current page path when switching languages
        push({ pathname, query }, asPath, { locale: newLocale });
        handleLanguageMenuClose();
    };

    // Function to handle anchor link clicks
    const handleAnchorClick = (href: string) => {
        setVisibleMenu(false); // Close the mobile menu
        const targetElement = document.querySelector(href); // Find the target section
        if (targetElement) {
            targetElement.scrollIntoView({ behavior: 'smooth' }); // Smooth scroll to the section
        }
    };

    return (
        <Box
            sx={{
                backgroundColor: 'background.paper',
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                zIndex: 1100,
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            }}
        >
            <Container sx={{ py: { xs: 2, md: 3 } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexDirection: isRtl ? 'row-reverse' : 'row' }}>
                    {/* Logo */}
                    <Box sx={{ order: isRtl ? 2 : 1 }}>
                        <Logo />
                    </Box>

                    {/* Mobile View: Language Switcher and Menu Icon */}
                    <Box
                        sx={{
                            ml: 'auto',
                            display: { xs: 'inline-flex', md: 'none' },
                            order: isRtl ? 1 : 2,
                            flexDirection: isRtl ? 'row-reverse' : 'row',
                            alignItems: 'center',
                            gap: 1,
                        }}
                    >
                        {/* Language Switcher Dropdown */}
                        <Box>
                            <Button
                                onClick={handleLanguageMenuOpen}
                                sx={{
                                    textTransform: 'uppercase',
                                    color: 'text.primary',
                                    '&:hover': {
                                        backgroundColor: 'action.hover',
                                    },
                                }}
                            >
                                {locale?.toUpperCase()}
                            </Button>
                            <Popover
                                open={Boolean(anchorEl)}
                                anchorEl={anchorEl}
                                onClose={handleLanguageMenuClose}
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'center',
                                }}
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'center',
                                }}
                                sx={{
                                    '& .MuiPaper-root': { // Target the Paper component inside Popover
                                        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)', // Reduced box shadow
                                    },
                                }}
                            >
                                <MenuList>
                                    {locales?.map((lang) => (
                                        <MenuItem key={lang} onClick={() => handleLanguageChange(lang)}>
                                            <Typography variant="body1" sx={{ textTransform: 'uppercase' }}>
                                                {lang}
                                            </Typography>
                                        </MenuItem>
                                    ))}
                                </MenuList>
                            </Popover>
                        </Box>

                        {/* Menu Icon */}
                        <IconButton
                            onClick={() => setVisibleMenu(!visibleMenu)}
                            sx={{
                                ml: isRtl ? 0 : 1,
                                mr: isRtl ? 1 : 0,
                                '&:hover': {
                                    backgroundColor: 'action.hover',
                                },
                            }}
                        >
                            <Menu />
                        </IconButton>
                    </Box>

                    {/* Navigation and Desktop Language Switcher */}
                    <Box
                        sx={{
                            width: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: locale === 'ar' ? 'flex-end' : 'flex-start',// Center the content
                            flexDirection: { xs: 'column', md: 'row' },
                            transition: (theme) => theme.transitions.create(['top']),
                            ...(matchMobileView && {
                                py: 6,
                                backgroundColor: 'background.paper',
                                zIndex: 'appBar',
                                position: 'fixed',
                                height: { xs: '100vh', md: 'auto' },
                                top: visibleMenu ? 0 : '-120vh',
                                left: 0,
                                justifyContent: 'center',
                            }),
                        }}
                    >
                        {/* Magic Space */}
                        <Box />

                        {/* Navigation */}
                        <Navigation onAnchorClick={handleAnchorClick} />

                        {/* Desktop Language Switcher */}
                        <Box
                            sx={{
                                display: { xs: 'none', md: 'flex' },
                                alignItems: 'center',
                                gap: 2,
                                order: isRtl ? 2 : 2,
                                direction: 'ltr', // Force LTR layout for the language dropdown
                            }}
                        >
                            <Box>
                                <Button
                                    onClick={handleLanguageMenuOpen}
                                    sx={{
                                        textTransform: 'uppercase',
                                        color: 'text.primary',
                                        '&:hover': {
                                            backgroundColor: 'action.hover',
                                        },
                                    }}
                                >
                                    {locale?.toUpperCase()}
                                </Button>
                                <Popover
                                    open={Boolean(anchorEl)}
                                    anchorEl={anchorEl}
                                    onClose={handleLanguageMenuClose}
                                    anchorOrigin={{
                                        vertical: 'bottom',
                                        horizontal: 'center',
                                    }}
                                    transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'center',
                                    }}
                                    sx={{
                                        '& .MuiPaper-root': { // Target the Paper component inside Popover
                                            boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)', // Reduced box shadow
                                        },
                                    }}
                                >
                                    <MenuList>
                                        {locales?.map((lang) => (
                                            <MenuItem key={lang} onClick={() => handleLanguageChange(lang)}>
                                                <Typography variant="body1" sx={{ textTransform: 'uppercase' }}>
                                                    {lang}
                                                </Typography>
                                            </MenuItem>
                                        ))}
                                    </MenuList>
                                </Popover>
                            </Box>
                        </Box>

                        {/* Close Icon for Mobile Menu */}
                        {visibleMenu && matchMobileView && (
                            <IconButton
                                sx={{
                                    position: 'fixed',
                                    top: 10,
                                    [isRtl ? 'left' : 'right']: 10,
                                    '&:hover': {
                                        backgroundColor: 'action.hover',
                                    },
                                }}
                                onClick={() => setVisibleMenu(!visibleMenu)}
                            >
                                <Close />
                            </IconButton>
                        )}
                    </Box>
                </Box>
            </Container>
        </Box>
    );
};

export default Header;