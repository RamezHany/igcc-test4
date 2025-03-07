import React, { useState, useEffect, ReactNode } from 'react';
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";

interface LoadingSpinnerProps {
    children: ReactNode;
    minimumLoadingTime?: number; // Minimum time to show spinner in ms
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
                                                           children,
                                                           minimumLoadingTime = 2000 // Keep your original 5 second timer
                                                       }) => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check if user has already seen the spinner in this session
        let hasSeenSpinner = false;

        try {
            hasSeenSpinner = sessionStorage.getItem('hasSeenSpinner') === 'true';
        } catch (error) {
            console.error('Error accessing sessionStorage:', error);
        }

        if (!hasSeenSpinner) {
            // First time in this session - show spinner for specified time
            console.log('Showing spinner for first time visitor');
            const timer = setTimeout(() => {
                console.log('Timer completed, hiding spinner');
                setLoading(false);

                try {
                    // Store that user has seen the spinner in this session
                    sessionStorage.setItem('hasSeenSpinner', 'true');
                } catch (error) {
                    console.error('Error setting sessionStorage:', error);
                }

                // After spinner disappears, check if we need to scroll to a section
                handleSectionScroll();
            }, minimumLoadingTime);

            return () => clearTimeout(timer);
        } else {
            // User has already seen spinner in this session - don't show it
            console.log('Returning visitor, skipping spinner');
            setLoading(false);

            // Immediately check if we need to scroll to a section
            setTimeout(handleSectionScroll, 100);
        }
    }, [minimumLoadingTime]);

    const handleSectionScroll = () => {
        // Check if there's a hash in the URL
        if (typeof window !== 'undefined') {
            const hash = window.location.hash;
            if (hash) {
                // Remove the # character
                const sectionId = hash.substring(1);

                // Find the element with that ID
                const element = document.getElementById(sectionId);

                // If found, scroll to it
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                }
            }
        }
    };

    if (loading) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100vh', // Full viewport height
                    backgroundColor: 'background.paper', // Match your website's background
                }}
            >
                <CircularProgress color="primary" /> {/* Spinner */}
            </Box>
        );
    }

    return <>{children}</>;
};

export default LoadingSpinner;