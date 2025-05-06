import React, { FC } from 'react';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import { SocialLink } from '@/interfaces/social-link';

export const socialLinks: SocialLink[] = [
    {
        name: 'Linkedin',
        link: 'https://www.linkedin.com/in/dr-nourhan-hassan-igcc-international-center-for-governance-consulting-021a4b149?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app',
        icon: 'linkedin_black.png',
    },
    {
        name: 'Facebook', // Corrected the name from 'YouTube' to 'Facebook'
        link: 'https://www.facebook.com/share/1F2cb9mmVq/',
        icon: 'facebook-_black.png',
    },
    {
        name: 'X',
        link: ' https://x.com/NourhanMHassan1?t=kTdF6w9Mj0YyrRWSu6gAAw&s=08',
        icon: 'twitter.png',
    },
    {
        name: 'insta',
        link: 'https://www.instagram.com/nourhan142022?igsh=MTdqbWhiMXAwbWM4OQ==',
        icon: 'instagram_black.png',
    }
];

interface SocialLinkItemProps {
    item: SocialLink;
}

const SocialLinkItem: FC<SocialLinkItemProps> = ({ item }) => (
    <Box
        component="li"
        sx={{
            display: 'inline-block',
            color: 'primary.contrastText',
            mr: 0.5,
        }}
    >
        <Link
            target="_blank"
            sx={{
                lineHeight: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 36,
                height: 36,
                borderRadius: '50%',
                color: 'inherit',
                '&:hover': {
                    backgroundColor: 'secondary.main',
                },
                '& img': {
                    fill: 'currentColor',
                    width: 22,
                    height: 'auto',
                },
            }}
            href={item.link}
        >
            {/* eslint-disable-next-line */}
            <img src={item.icon} alt={item.name + ' icon'} />
        </Link>
    </Box>
);

// Default SocialLinks Component
const SocialLinks: FC = () => {
    return (
        <Box sx={{ ml: -1, textAlign: { xs: 'center', md: 'left'} , paddingRight: '50px' }}>
            <Box
                component="ul"
                sx={{
                    m: 0,
                    p: 0,
                    lineHeight: 0,
                    borderRadius: 3,
                    listStyle: 'none',
                }}
            >
                {socialLinks.map((item) => (
                    <SocialLinkItem key={item.name} item={item} />
                ))}
            </Box>
        </Box>
    );
};

export default SocialLinks;