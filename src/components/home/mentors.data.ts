import type { Mentor } from '@/interfaces/mentor';
import { useMemo } from 'react';
import {useTranslation} from "next-i18next";
import {useRouter} from "next/router";

const useMentorData = () => {

  const { t } = useTranslation('common');
  const { locale } = useRouter();
  const isRtl = locale === 'ar';


  const data: Array<Mentor> = useMemo(() => [
    {
      id: 1,
      photo: '/images/mentors/christian-buehner-DItYlc26zVI-unsplash.jpg',
      name: t('ClientOpponentName.FirstName'),
      category: t('ClientOpponentJop.FirstJop'),
      description:t('ClientOpponentDescription.FirstDescription'),
      company: {
        name: t('ClientOpponentCompany.FirstCompany'),
        logo: '/images/companies/grab.png',
      },
    },
    {
      id: 2,
      photo: '/images/mentors/jonas-kakaroto-KIPqvvTOC1s-unsplash.jpg',
      name: t('ClientOpponentName.SecondName'),
      category: t('ClientOpponentJop.SecondJop'),
      description: t('ClientOpponentDescription.SecondDescription'),
      company: {
        name: t('ClientOpponentCompany.SecondCompany'),
        logo: '/images/companies/google.png',
      },
    },
    {
      id: 3,
      photo: '/images/mentors/noah-buscher-8A7fD6Y5VF8-unsplash.jpg',
      name: t('ClientOpponentName.ThirdName'),
      category: t('ClientOpponentJop.ThirdJop'),
      description: t('ClientOpponentDescription.ThirdDescription'),
      company: {
        name: t('ClientOpponentCompany.ThirdCompany'),
        logo: '/images/companies/airbnb.png',
      },
    }
  ], [t]);

  return { data, isRtl };
};

export default useMentorData;