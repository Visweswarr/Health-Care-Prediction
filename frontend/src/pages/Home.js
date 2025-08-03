import React from 'react';
import TiltCard from '../components/TiltCard';
import {
  Container,
  Typography,
  Button,
  Grid,
  Box,
  Paper
} from '@mui/material';
import {
  LocalHospital as HospitalIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <Box sx={{ minHeight: '100vh' }}>
      {/* Hero Section */}
      <Paper
        sx={{
          background: 'linear-gradient(135deg, #007AFF 0%, #5E9CEF 50%, #FF2D92 100%)',
          color: 'white',
          py: 8,
          mb: 6,
          position: 'relative',
          overflow: 'hidden',
          borderRadius: '24px',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at 20% 80%, rgba(255, 255, 255, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)',
            animation: 'liquidPulse 6s ease-in-out infinite alternate',
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: '200%',
            height: '200%',
            background: 'radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%)',
            transform: 'translate(-50%, -50%)',
            animation: 'liquidFloat 8s ease-in-out infinite',
          },
          '@keyframes liquidPulse': {
            '0%': { opacity: 0.6, transform: 'scale(1)' },
            '100%': { opacity: 1, transform: 'scale(1.05)' },
          },
          '@keyframes liquidFloat': {
            '0%, 100%': { transform: 'translate(-50%, -50%) rotate(0deg)' },
            '50%': { transform: 'translate(-50%, -50%) rotate(180deg)' },
          }
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
                Healthcare Aid
              </Typography>
              <Typography variant="h5" gutterBottom sx={{ mb: 3, opacity: 0.9 }}>
                Your AI-Powered Health Companion
              </Typography>
              <Typography variant="body1" sx={{ mb: 4, opacity: 0.8, fontSize: '1.1rem' }}>
                Get instant disease predictions, insurance estimates, and personalized health insights 
                powered by advanced machine learning and comprehensive medical datasets.
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                {user ? (
                  <>
                    <Button
                      variant="contained"
                      size="large"
                      onClick={() => navigate('/disease-prediction')}
                      sx={{ 
                        background: 'rgba(255, 255, 255, 0.9)',
                        backdropFilter: 'blur(20px)',
                        WebkitBackdropFilter: 'blur(20px)',
                        color: '#007AFF',
                        borderRadius: '25px',
                        px: 4,
                        py: 1.5,
                        fontSize: '1.1rem',
                        fontWeight: 600,
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1), 0 2px 8px rgba(0, 0, 0, 0.05)',
                        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                        position: 'relative',
                        overflow: 'hidden',
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          top: '50%',
                          left: '50%',
                          width: '0',
                          height: '0',
                          borderRadius: '50%',
                          background: 'rgba(0, 122, 255, 0.2)',
                          transform: 'translate(-50%, -50%)',
                          transition: 'width 0.6s, height 0.6s',
                        },
                        '&:hover': { 
                          background: 'rgba(255, 255, 255, 1)',
                          transform: 'translateY(-3px) scale(1.02)',
                          boxShadow: '0 12px 35px rgba(0, 0, 0, 0.15), 0 4px 16px rgba(0, 0, 0, 0.08)',
                          borderColor: 'rgba(255, 255, 255, 0.5)',
                        },
                        '&:active::before': {
                          width: '300px',
                          height: '300px',
                        }
                      }}
                    >
                      Start Prediction
                    </Button>
                    <Button
                      variant="outlined"
                      size="large"
                      onClick={() => navigate('/insurance-calculator')}
                      sx={{ 
                        background: 'rgba(255, 255, 255, 0.1)',
                        backdropFilter: 'blur(20px)',
                        WebkitBackdropFilter: 'blur(20px)',
                        borderColor: 'rgba(255, 255, 255, 0.4)', 
                        color: 'white',
                        borderRadius: '25px',
                        px: 4,
                        py: 1.5,
                        fontSize: '1.1rem',
                        fontWeight: 600,
                        borderWidth: '2px',
                        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                        position: 'relative',
                        overflow: 'hidden',
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          top: '50%',
                          left: '50%',
                          width: '0',
                          height: '0',
                          borderRadius: '50%',
                          background: 'rgba(255, 255, 255, 0.2)',
                          transform: 'translate(-50%, -50%)',
                          transition: 'width 0.6s, height 0.6s',
                        },
                        '&:hover': { 
                          background: 'rgba(255, 255, 255, 0.2)',
                          borderColor: 'rgba(255, 255, 255, 0.6)',
                          transform: 'translateY(-3px) scale(1.02)',
                          boxShadow: '0 12px 35px rgba(255, 255, 255, 0.15), 0 4px 16px rgba(255, 255, 255, 0.08)'
                        },
                        '&:active::before': {
                          width: '300px',
                          height: '300px',
                        }
                      }}
                    >
                      Insurance Calculator
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="contained"
                      size="large"
                      onClick={() => navigate('/register')}
                      sx={{ 
                        background: 'rgba(255, 255, 255, 0.9)',
                        backdropFilter: 'blur(20px)',
                        WebkitBackdropFilter: 'blur(20px)',
                        color: '#007AFF',
                        borderRadius: '25px',
                        px: 4,
                        py: 1.5,
                        fontSize: '1.1rem',
                        fontWeight: 600,
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1), 0 2px 8px rgba(0, 0, 0, 0.05)',
                        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                        position: 'relative',
                        overflow: 'hidden',
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          top: '50%',
                          left: '50%',
                          width: '0',
                          height: '0',
                          borderRadius: '50%',
                          background: 'rgba(0, 122, 255, 0.2)',
                          transform: 'translate(-50%, -50%)',
                          transition: 'width 0.6s, height 0.6s',
                        },
                        '&:hover': { 
                          background: 'rgba(255, 255, 255, 1)',
                          transform: 'translateY(-3px) scale(1.02)',
                          boxShadow: '0 12px 35px rgba(0, 0, 0, 0.15), 0 4px 16px rgba(0, 0, 0, 0.08)',
                          borderColor: 'rgba(255, 255, 255, 0.5)',
                        },
                        '&:active::before': {
                          width: '300px',
                          height: '300px',
                        }
                      }}
                    >
                      Get Started
                    </Button>
                    <Button
                      variant="outlined"
                      size="large"
                      onClick={() => navigate('/login')}
                      sx={{ 
                        background: 'rgba(255, 255, 255, 0.1)',
                        backdropFilter: 'blur(20px)',
                        WebkitBackdropFilter: 'blur(20px)',
                        borderColor: 'rgba(255, 255, 255, 0.4)', 
                        color: 'white',
                        borderRadius: '25px',
                        px: 4,
                        py: 1.5,
                        fontSize: '1.1rem',
                        fontWeight: 600,
                        borderWidth: '2px',
                        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                        position: 'relative',
                        overflow: 'hidden',
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          top: '50%',
                          left: '50%',
                          width: '0',
                          height: '0',
                          borderRadius: '50%',
                          background: 'rgba(255, 255, 255, 0.2)',
                          transform: 'translate(-50%, -50%)',
                          transition: 'width 0.6s, height 0.6s',
                        },
                        '&:hover': { 
                          background: 'rgba(255, 255, 255, 0.2)',
                          borderColor: 'rgba(255, 255, 255, 0.6)',
                          transform: 'translateY(-3px) scale(1.02)',
                          boxShadow: '0 12px 35px rgba(255, 255, 255, 0.15), 0 4px 16px rgba(255, 255, 255, 0.08)'
                        },
                        '&:active::before': {
                          width: '300px',
                          height: '300px',
                        }
                      }}
                    >
                      Sign In
                    </Button>
                  </>
                )}
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: 400
                }}
              >
                <HospitalIcon 
                  sx={{ 
                    fontSize: 300, 
                    opacity: 0.3,
                    animation: 'float 6s ease-in-out infinite',
                    '@keyframes float': {
                      '0%, 100%': { transform: 'translateY(0px)' },
                      '50%': { transform: 'translateY(-20px)' },
                    }
                  }} 
                />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Paper>

      {/* Call to Action Section */}
      <Container maxWidth="md" sx={{ textAlign: 'center', py: 8 }}>
        <TiltCard sx={{ p: 6, background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(20px)' }}>
          <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 'bold', mb: 3, color: 'text.primary' }}>
            Start Your Health Journey Today
          </Typography>
          <Typography variant="body1" sx={{ mb: 4, maxWidth: 600, mx: 'auto', color: 'text.secondary' }}>
            Join thousands of users who are taking control of their health with personalized insights and tools.
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate(user ? '/dashboard' : '/register')}
            sx={{ 
              py: 2, 
              px: 6,
              fontSize: '1.1rem',
              fontWeight: 600,
              borderRadius: '30px',
              background: 'linear-gradient(135deg, #007AFF 0%, #5E9CEF 100%)',
              boxShadow: '0 8px 25px rgba(0, 122, 255, 0.3)',
              transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: '50%',
                left: '50%',
                width: '0',
                height: '0',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.3)',
                transform: 'translate(-50%, -50%)',
                transition: 'width 0.6s, height 0.6s',
              },
              '&:hover': {
                transform: 'translateY(-3px) scale(1.02)',
                boxShadow: '0 12px 35px rgba(0, 122, 255, 0.4)',
                background: 'linear-gradient(135deg, #0056CC 0%, #4DA3FF 100%)',
              },
              '&:active::before': {
                width: '300px',
                height: '300px',
              }
            }}
          >
            {user ? 'Go to Dashboard' : 'Sign Up Now'}
          </Button>
        </TiltCard>
      </Container>
    </Box>
  );
};

export default Home; 