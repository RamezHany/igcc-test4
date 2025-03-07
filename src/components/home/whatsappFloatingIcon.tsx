import React from 'react';
import IconButton from '@mui/material/IconButton';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import Box from '@mui/material/Box';

const FloatingWhatsAppIcon = () => {
    // WhatsApp link (replace with your actual WhatsApp number)
    const whatsappLink = 'https://api.whatsapp.com/send/?phone=%2B201102311320'; // Example: https://wa.me/201234567890

    // Handle click to open WhatsApp link
    const handleClick = () => {
        window.open(whatsappLink, '_blank'); // Open in a new tab
    };

    return (
        <Box
            sx={{
                position: 'fixed', // Fixed position
                bottom: 24, // Distance from the bottom
                right: 24, // Distance from the right
                zIndex: 1000, // Ensure it's above other elements
            }}
        >
            <IconButton
                onClick={handleClick} // Redirect to WhatsApp on click
                sx={{
                    backgroundColor: '#25D366', // WhatsApp green color
                    color: 'white', // Icon color
                    '&:hover': {
                        backgroundColor: '#128C7E', // Darker green on hover
                    },
                    borderRadius: '50%', // Make it circular
                    width: 56, // Size of the button
                    height: 56,
                    boxShadow: 3, // Add a shadow
                }}
                aria-label="WhatsApp"
            >
                <WhatsAppIcon fontSize="large" /> {/* WhatsApp icon */}
            </IconButton>
        </Box>
    );
};

export default FloatingWhatsAppIcon;