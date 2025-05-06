import React, { FC, useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import { useTheme } from '@mui/material/styles'
import { linkedinPosts, loadLinkedinPostsData } from './linkedin-posts.data'
import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Button from '@mui/material/Button'
import { Paper, Modal, IconButton } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import LinkedInIcon from '@mui/icons-material/LinkedIn'
import type { LinkedinPost } from '@/interfaces/LinkedinPost'

const LinkedinPosts: FC = () => {
  const theme = useTheme()
  const { t } = useTranslation('common')
  const router = useRouter()
  const { locale } = router
  const [posts, setPosts] = useState<LinkedinPost[]>([])
  const [openModal, setOpenModal] = useState(false)
  const [selectedPost, setSelectedPost] = useState<LinkedinPost | null>(null)

  useEffect(() => {
    const loadPosts = async () => {
      await loadLinkedinPostsData();
      const filteredPosts = linkedinPosts
        .filter(item => ['1', '2', '3'].includes(item.id))
        .sort((a, b) => parseInt(a.id) - parseInt(b.id));
      setPosts(filteredPosts);
    };
    
    loadPosts();
  }, []);

  const handleOpenModal = (post: LinkedinPost) => {
    setSelectedPost(post);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false)
    // Limpiar el post seleccionado después de un breve retraso
    setTimeout(() => {
      setSelectedPost(null)
    }, 300) // Esperar a que termine la animación de cierre
  };

  return (
    <Box
      id="linkedin-posts"
      sx={{
        pt: {
          xs: 6,
          md: 8,
        },
        pb: {
          xs: 8,
          md: 12,
        },
        backgroundColor: theme.palette.background.default,
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            mb: {
              xs: 6,
              md: 8,
            },
            textAlign: 'center',
          }}
        >
          <Typography variant="h1" sx={{ mb: 1, fontSize: { xs: 32, md: 48 }, fontWeight: 'bold' }}>
            {locale === 'ar' ? t('linkedinPosts.title', 'منشورات لينكد إن') : t('linkedinPosts.title', 'LinkedIn Posts')}
          </Typography>
          <Typography variant="h5" sx={{ mb: 2, color: 'text.secondary' }}>
            {locale === 'ar' 
              ? t('linkedinPosts.subtitle', 'تابعنا على لينكد إن للاطلاع على أحدث الأخبار والرؤى') 
              : t('linkedinPosts.subtitle', 'Follow us on LinkedIn for the latest news and insights')}
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {posts.map((post) => (
            <Grid item xs={12} md={4} key={post.id}>
              <Paper
                sx={{
                  p: 3,
                  borderRadius: 2,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.3s ease-in-out',
                  cursor: 'pointer',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
                  },
                }}
                onClick={() => handleOpenModal(post)}
              >
                {/* Eliminando el logo y texto de LinkedIn */}
                
                <Typography
                  variant="h6"
                  sx={{
                    mb: 2,
                    color: 'text.primary',
                    fontWeight: 'bold',
                  }}
                >
                  {locale === 'ar' ? post.title_ar : post.title}
                </Typography>
                
                {/* Preview of LinkedIn embed */}
                <Box 
                  sx={{ 
                    mb: 2,
                    flexGrow: 1,
                    height: 150,
                    overflow: 'hidden',
                    position: 'relative',
                    borderRadius: 1,
                    border: '1px solid #e0e0e0',
                  }}
                >
                  <iframe
                    src={post.embedUrl}
                    height="150"
                    width="100%"
                    frameBorder="0"
                    title={post.title}
                    style={{ 
                      pointerEvents: 'none',
                    }}
                  ></iframe>
                </Box>
                
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent triggering the parent onClick
                    handleOpenModal(post);
                  }}
                  startIcon={<LinkedInIcon />}
                  sx={{ alignSelf: 'flex-start', mt: 'auto' }}
                >
                  {locale === 'ar' ? t('buttons.viewPost', 'عرض المنشور') : t('buttons.viewPost', 'View Post')}
                </Button>
              </Paper>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ textAlign: 'center', mt: 6 }}>
          <Link href="/all-linkedin-posts" passHref>
            <Button
              component="a"
              variant="contained"
              color="primary"
              size="large"
              sx={{
                px: 4,
                py: 1.5,
                fontSize: '1.1rem',
                textTransform: 'none',
                borderRadius: 2,
                backgroundColor: '#56bb76', // Default background color
                  '&:hover': {
                      backgroundColor: '#56bb76', // Same as default to remove hover effect
                  },
              }}
            >
              {locale === 'ar' 
                ? t('buttons.viewAllPosts', 'عرض جميع المنشورات') 
                : t('buttons.viewAllPosts', 'View All Posts')}
            </Button>
          </Link>
        </Box>
      </Container>

      {/* LinkedIn Post Modal */}
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="linkedin-post-modal"
        aria-describedby="view-linkedin-post-embed"
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Box
          sx={{
            position: 'relative',
            width: { xs: '95%', sm: '85%', md: '75%' },
            maxWidth: 900,
            maxHeight: '90vh',
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: 24,
            p: { xs: 2, sm: 3, md: 4 },
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <IconButton
            aria-label="close"
            onClick={handleCloseModal}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: 'grey.500',
              zIndex: 2,
            }}
          >
            <CloseIcon />
          </IconButton>
          
          <Typography variant="h5" component="h2" sx={{ mb: 3, pr: 4 }}>
            {selectedPost && (locale === 'ar' ? selectedPost.title_ar : selectedPost.title)}
          </Typography>
          
          {selectedPost && (
            <Box sx={{ 
              flexGrow: 1,
              width: '100%', 
              overflow: 'hidden',
              borderRadius: 1,
              border: '1px solid rgba(0,0,0,0.1)',
            }}>
              <iframe
                src={selectedPost.embedUrl}
                style={{
                  width: '100%',
                  height: '550px',
                  border: 'none',
                }}
                frameBorder="0"
                allowFullScreen
                title={selectedPost.title}
              ></iframe>
            </Box>
          )}
        </Box>
      </Modal>
    </Box>
  )
}

export default LinkedinPosts
