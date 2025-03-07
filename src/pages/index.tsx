import React from 'react';
import dynamic from 'next/dynamic';
import { NextPageWithLayout } from '@/interfaces/layout';
import { MainLayout } from '@/components/layout';
import { defaultSEO } from '@/utils/seo.config';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { GetStaticProps } from 'next';

// Import the LoadingSpinner component


// Dynamic imports for all components
const DynamicHomeHero = dynamic(() => import('../components/home/hero'));
const DynamicHomeFeature = dynamic(() => import('../components/home/feature'));
const DynamicHomePopularCourse = dynamic(() => import('../components/home/popular-courses'));
const DynamicHomeTestimonial = dynamic(() => import('../components/home/testimonial'));
const DynamicHomeOurMentors = dynamic(() => import('../components/home/mentors'));
const DynamicHomeNewsLetter = dynamic(() => import('../components/home/Contact-form'));
const DynamicHomeNews = dynamic(() => import('../components/home/home_news'));
const DynamicWhatsappIcon = dynamic(() => import('../components/home/whatsappFloatingIcon'));
const DynamicPartnersCarousel = dynamic(() => import('../components/partners/partners-carousel'), {
    ssr: false
});
const DynamicLinkedinPosts = dynamic(() => import('../components/home/linkedin-posts'));

const Home: NextPageWithLayout = () => {
    return (
            <>
                <DynamicHomeHero />
                <DynamicHomePopularCourse />
                <DynamicHomeFeature />
                <DynamicHomeTestimonial />
                {/* <DynamicHomeOurMentors /> */}
                <DynamicHomeNews />
                <DynamicLinkedinPosts />
                <DynamicPartnersCarousel />
                <DynamicHomeNewsLetter />
                <DynamicWhatsappIcon/>
            </>


    );
};

Home.getLayout = (page) => <MainLayout seo={defaultSEO}>{page}</MainLayout>;

export const getStaticProps: GetStaticProps = async ({ locale }) => {
    return {
        props: {
            ...(await serverSideTranslations(locale ?? 'en', ['common'])),
        },
    };
};

export default Home;