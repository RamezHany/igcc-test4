import React, { FC } from 'react';
import { Box, Typography } from '@mui/material';
import Link from 'next/link'; // Import Link from next/link

interface Props {
    onClick?: () => void;
    variant?: 'primary' | 'secondary';
}

const Logo: FC<Props> = ({ onClick, variant }) => {
    return (
        <Link href="/#home" passHref>
            <Box
                component="a" // Render the Box as an anchor
                onClick={onClick}
                sx={{ cursor: 'pointer', textDecoration: 'none' }} // Add cursor: pointer and remove underline
            >
                <Typography
                    variant="h4"
                    component="h1"
                    sx={{ fontWeight: 700, '& span': { color: variant === 'primary' ? 'primary.main' : 'unset' } }}
                >
                    {/*Course<span>space</span>*/}
                    <img src="/logo-2.png" alt="logo" style={{ height: '40px', marginRight: '10px' }} />
                </Typography>
            </Box>
        </Link>
    );
};

Logo.defaultProps = {
    variant: 'primary',
};

export default Logo;