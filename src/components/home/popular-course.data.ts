import type { Course } from '@/interfaces/course';
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { useMemo } from 'react';

const useCourseData = () => {
  const { t } = useTranslation('common');
  const { locale } = useRouter();
  const isRtl = locale === 'ar';

  const data: Array<Course> = useMemo(() => [
    {
      id: 1,
      cover: 'https://res.cloudinary.com/dduxyvs3x/image/upload/v1740772756/1_ivzgs6.jpg',
      title: t('programTitle.program1'), // Use translation here
      rating: 5,
      ratingCount: 8,
      category: '',
      description: t('programDes.program1'),
    },
    {
      id: 2,
      cover: 'https://res.cloudinary.com/dduxyvs3x/image/upload/v1740772756/2_yzaabm.jpg',
      title: t('programTitle.program2'),
      rating: 5,
      ratingCount: 15,
      category: '',
      description: t('programDes.program2'),
    },
    {
      id: 3,
      cover: 'https://res.cloudinary.com/dduxyvs3x/image/upload/v1740772757/3_qvzqhl.jpg',
      title: t('programTitle.program3'),
      rating: 4,
      ratingCount: 7,
      category: '',
      description: t('programDes.program3'),
    },
    {
      id: 4,
      cover: 'https://res.cloudinary.com/dduxyvs3x/image/upload/v1740772756/4_osgtsy.jpg',
      title: t('programTitle.program4'),
      rating: 4,
      ratingCount: 12,
      category: '',
      description: t('programDes.program4'),
    },
    {
      id: 5,
      cover: 'https://res.cloudinary.com/dduxyvs3x/image/upload/v1740772757/5_k9uzuj.jpg',
      title: t('programTitle.program5'),
      rating: 4,
      ratingCount: 32,
      category: '',
      description: t('programDes.program5'),
    },
    {
      id: 6,
      cover: 'https://res.cloudinary.com/dduxyvs3x/image/upload/v1740772756/6_busphl.png',
      title: t('programTitle.program6'),
      rating: 5,
      ratingCount: 14,
      category: '',
      description: t('programDes.program6'),
    },
    {
      id: 7,
      cover: 'https://res.cloudinary.com/dduxyvs3x/image/upload/v1740772756/7_y8rd2b.jpg',
      title: t('programTitle.program7'),
      rating: 4,
      ratingCount: 6,
      category: '',
      description: t('programDes.program7'),
    },
    {
      id: 8,
      cover: 'https://res.cloudinary.com/dduxyvs3x/image/upload/v1740772756/8_r0ti8c.webp',
      title: t('programTitle.program8'),
      rating: 4,
      ratingCount: 6,
      category: '',
      description: t('programDes.program8'),
    },
    {
      id: 9,
      cover: 'https://res.cloudinary.com/dduxyvs3x/image/upload/v1740772757/9_j6r9xn.jpg',
      title: t('programTitle.program9'),
      rating: 4,
      ratingCount: 6,
      category: '',
      description: t('programDes.program9'),
    },
    {
      id: 10,
      cover: 'https://res.cloudinary.com/dduxyvs3x/image/upload/v1740772757/10_oyvkfz.jpg',
      title: t('programTitle.program10'),
      rating: 4,
      ratingCount: 6,
      category: '',
      description: t('programDes.program10'),
    },
    {
      id: 11,
      cover: 'https://res.cloudinary.com/dduxyvs3x/image/upload/v1740772757/11_l4lsjo.jpg',
      title: t('programTitle.program11'),
      rating: 4,
      ratingCount: 6,
      category: '',
      description: t('programDes.program11'),
    },
    {
      id: 12,
      cover: 'https://res.cloudinary.com/dduxyvs3x/image/upload/v1740772757/12_jpu7cs.jpg',
      title: t('programTitle.program12'),
      rating: 4,
      ratingCount: 6,
      category: '',
      description: t('programDes.program12'),
    },
    {
      id: 13,
      cover: 'https://res.cloudinary.com/dduxyvs3x/image/upload/v1740772758/13_klmhhq.png',
      title: t('programTitle.program13'),
      rating: 4,
      ratingCount: 6,
      category: '',
      description: t('programDes.program14'),
    },
    {
      id: 14,
      cover: 'https://res.cloudinary.com/dduxyvs3x/image/upload/v1740772763/14_uvxcw5.jpg',
      title: t('programTitle.program14'),
      rating: 4,
      ratingCount: 6,
      category: '',
      description: t('programDes.program15'),
    },
    {
      id: 15,
      cover: 'https://res.cloudinary.com/dduxyvs3x/image/upload/v1740772758/15_cbvt7u.jpg',
      title: t('programTitle.program15'),
      rating: 4,
      ratingCount: 6,
      category: '',
      description: t('programDes.program16'),
    },
    {
      id: 16,
      cover: 'https://res.cloudinary.com/dduxyvs3x/image/upload/v1740772762/16_a0ys9k.jpg',
      title: t('programTitle.program16'),
      rating: 4,
      ratingCount: 6,
      category: '',
      description: t('programDes.program17'),
    },
    {
      id: 17,
      cover: 'https://res.cloudinary.com/dduxyvs3x/image/upload/v1740772762/17_nevxlt.jpg',
      title: t('programTitle.program17'),
      rating: 4,
      ratingCount: 6,
      category: '',
      description: t('programDes.program18'),
    },
    {
      id: 18,
      cover: 'https://res.cloudinary.com/dduxyvs3x/image/upload/v1740772776/18_rkk2be.jpg',
      title: t('programTitle.program18'),
      rating: 4,
      ratingCount: 6,
      category: '',
      description: t('programDes.program19'),
    },
  ], [t]);

  return { data, isRtl };
};

export default useCourseData;
