import React from 'react';
import { Card } from '@mui/material';
import Tilt from 'react-parallax-tilt';
import { useThemeMode } from '../contexts/ThemeContext';

const TiltCard = ({ children, sx, ...props }) => {
  const { mode } = useThemeMode();

  return (
    <Tilt
      tiltMaxAngleX={8}
      tiltMaxAngleY={8}
      perspective={1200}
      scale={1.02}
      transitionSpeed={1200}
      gyroscope={true}
      glareEnable={true}
      glareMaxOpacity={0.15}
      glareColor={mode === 'dark' ? '#ffffff' : '#000000'}
      glarePosition="all"
      glareBorderRadius="16px"
      style={{
        width: '100%',
        height: '100%',
        borderRadius: '16px',
        overflow: 'hidden',
      }}
    >
      <Card
        sx={{
          height: '100%',
          background: mode === 'dark' 
            ? 'rgba(44, 44, 46, 0.8)' 
            : 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          border: `1px solid ${mode === 'dark' 
            ? 'rgba(255, 255, 255, 0.12)' 
            : 'rgba(255, 255, 255, 0.25)'}`,
          boxShadow: mode === 'light' 
            ? '0 8px 32px rgba(0, 0, 0, 0.08), 0 2px 8px rgba(0, 0, 0, 0.04)' 
            : '0 8px 32px rgba(0, 0, 0, 0.4), 0 2px 8px rgba(0, 0, 0, 0.2)',
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: mode === 'dark'
              ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)'
              : 'linear-gradient(135deg, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0.1) 100%)',
            borderRadius: '16px',
            pointerEvents: 'none',
          },
          '&:hover': {
            transform: 'translateY(-4px) scale(1.01)',
            boxShadow: mode === 'light'
              ? '0 16px 48px rgba(0, 0, 0, 0.12), 0 4px 16px rgba(0, 0, 0, 0.06)'
              : '0 16px 48px rgba(0, 0, 0, 0.5), 0 4px 16px rgba(0, 0, 0, 0.3)',
            borderColor: mode === 'dark'
              ? 'rgba(255, 255, 255, 0.2)'
              : 'rgba(255, 255, 255, 0.4)',
          },
          ...sx,
        }}
        {...props}
      >
        {children}
      </Card>
    </Tilt>
  );
};

export default TiltCard;
