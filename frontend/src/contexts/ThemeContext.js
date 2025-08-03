import React, { createContext, useContext, useMemo, useState } from 'react';
import { createTheme } from '@mui/material/styles';

const ThemeModeContext = createContext();
export const useThemeMode = () => useContext(ThemeModeContext);

export const ThemeModeProvider = ({ children }) => {
  const [mode, setMode] = useState('light');
  const toggleMode = () => setMode(prev => (prev === 'light' ? 'dark' : 'light'));

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: mode === 'light' ? '#007AFF' : '#0A84FF',
            light: mode === 'light' ? '#4DA3FF' : '#5E9CEF',
            dark: mode === 'light' ? '#0056CC' : '#0056CC',
            contrastText: '#FFFFFF',
          },
          secondary: {
            main: mode === 'light' ? '#FF2D92' : '#FF375F',
            light: mode === 'light' ? '#FF6B9D' : '#FF6B9D',
            dark: mode === 'light' ? '#CC1F6B' : '#CC1F6B',
            contrastText: '#FFFFFF',
          },
          background: {
            default: mode === 'light' ? '#F2F2F7' : '#000000',
            paper: mode === 'light' ? 'rgba(255, 255, 255, 0.8)' : 'rgba(28, 28, 30, 0.8)',
            glass: mode === 'light' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(44, 44, 46, 0.7)',
            glassHover: mode === 'light' ? 'rgba(255, 255, 255, 0.9)' : 'rgba(58, 58, 60, 0.9)',
          },
          text: {
            primary: mode === 'light' ? '#1C1C1E' : '#FFFFFF',
            secondary: mode === 'light' ? '#8E8E93' : '#8E8E93',
            disabled: mode === 'light' ? '#C7C7CC' : '#3A3A3C',
          },
          divider: mode === 'light' ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.1)',
        },
        typography: {
          fontFamily: '"SF Pro Display", "SF Pro Text", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          h1: {
            fontWeight: 700,
            fontSize: '2.5rem',
            letterSpacing: '-0.02em',
          },
          h2: {
            fontWeight: 600,
            fontSize: '2rem',
            letterSpacing: '-0.01em',
          },
          h3: {
            fontWeight: 600,
            fontSize: '1.5rem',
            letterSpacing: '-0.01em',
          },
          h4: {
            fontWeight: 600,
            fontSize: '1.25rem',
            letterSpacing: '-0.01em',
          },
          h5: {
            fontWeight: 600,
            fontSize: '1.125rem',
            letterSpacing: '-0.01em',
          },
          h6: {
            fontWeight: 600,
            fontSize: '1rem',
            letterSpacing: '-0.01em',
          },
          body1: {
            fontSize: '1rem',
            lineHeight: 1.5,
            letterSpacing: '-0.01em',
          },
          body2: {
            fontSize: '0.875rem',
            lineHeight: 1.4,
            letterSpacing: '-0.01em',
          },
        },
        shape: {
          borderRadius: 12,
        },
        components: {
          MuiCssBaseline: {
            styleOverrides: {
              ':root': {
                '--glass-blur': '20px',
                '--glass-border': mode === 'light' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.1)',
                '--glass-shadow': mode === 'light' 
                  ? '0 8px 32px rgba(0, 0, 0, 0.1)' 
                  : '0 8px 32px rgba(0, 0, 0, 0.3)',
                '--glass-shadow-hover': mode === 'light'
                  ? '0 12px 40px rgba(0, 0, 0, 0.15)'
                  : '0 12px 40px rgba(0, 0, 0, 0.4)',
                '--liquid-transition': 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '--liquid-press': 'all 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
              },
            },
          },
          MuiCard: {
            styleOverrides: {
              root: {
                background: mode === 'light' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(44, 44, 46, 0.7)',
                backdropFilter: 'blur(var(--glass-blur))',
                WebkitBackdropFilter: 'blur(var(--glass-blur))',
                border: `1px solid var(--glass-border)`,
                borderRadius: 16,
                boxShadow: 'var(--glass-shadow)',
                transition: 'var(--liquid-transition)',
                '&:hover': {
                  boxShadow: 'var(--glass-shadow-hover)',
                  transform: 'translateY(-2px)',
                },
              },
            },
          },
          MuiButton: {
            styleOverrides: {
              root: {
                borderRadius: 12,
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '1rem',
                padding: '12px 24px',
                transition: 'var(--liquid-transition)',
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
                '&:active::before': {
                  width: '300px',
                  height: '300px',
                },
                '&:hover': {
                  transform: 'translateY(-1px)',
                  boxShadow: '0 8px 25px rgba(0, 122, 255, 0.3)',
                },
                '&:active': {
                  transform: 'translateY(0px) scale(0.98)',
                },
              },
              contained: {
                background: 'linear-gradient(135deg, #007AFF 0%, #5E9CEF 100%)',
                boxShadow: '0 4px 15px rgba(0, 122, 255, 0.3)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #0056CC 0%, #4DA3FF 100%)',
                  boxShadow: '0 8px 25px rgba(0, 122, 255, 0.4)',
                },
              },
              outlined: {
                border: '2px solid',
                borderColor: mode === 'light' ? '#007AFF' : '#0A84FF',
                color: mode === 'light' ? '#007AFF' : '#0A84FF',
                background: 'rgba(0, 122, 255, 0.05)',
                '&:hover': {
                  background: 'rgba(0, 122, 255, 0.1)',
                  borderColor: mode === 'light' ? '#0056CC' : '#0056CC',
                },
              },
            },
          },
          MuiAppBar: {
            styleOverrides: {
              root: {
                background: mode === 'light' ? 'rgba(255, 255, 255, 0.8)' : 'rgba(28, 28, 30, 0.8)',
                backdropFilter: 'blur(var(--glass-blur))',
                WebkitBackdropFilter: 'blur(var(--glass-blur))',
                borderBottom: `1px solid var(--glass-border)`,
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
              },
            },
          },
          MuiPaper: {
            styleOverrides: {
              root: {
                background: mode === 'light' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(44, 44, 46, 0.7)',
                backdropFilter: 'blur(var(--glass-blur))',
                WebkitBackdropFilter: 'blur(var(--glass-blur))',
                border: `1px solid var(--glass-border)`,
                borderRadius: 16,
              },
            },
          },
          MuiChip: {
            styleOverrides: {
              root: {
                borderRadius: 8,
                fontWeight: 500,
                transition: 'var(--liquid-transition)',
                background: mode === 'light' ? 'rgba(255, 255, 255, 0.8)' : 'rgba(44, 44, 46, 0.8)',
                backdropFilter: 'blur(var(--glass-blur))',
                WebkitBackdropFilter: 'blur(var(--glass-blur))',
                border: `1px solid var(--glass-border)`,
                '&:hover': {
                  transform: 'scale(1.05)',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                },
              },
            },
          },
          MuiTextField: {
            styleOverrides: {
              root: {
                '& .MuiOutlinedInput-root': {
                  borderRadius: 12,
                  background: mode === 'light' ? 'rgba(255, 255, 255, 0.6)' : 'rgba(44, 44, 46, 0.6)',
                  backdropFilter: 'blur(var(--glass-blur))',
                  WebkitBackdropFilter: 'blur(var(--glass-blur))',
                  border: `1px solid var(--glass-border)`,
                  transition: 'var(--liquid-transition)',
                  '&:hover': {
                    background: mode === 'light' ? 'rgba(255, 255, 255, 0.8)' : 'rgba(44, 44, 46, 0.8)',
                    borderColor: mode === 'light' ? '#007AFF' : '#0A84FF',
                  },
                  '&.Mui-focused': {
                    background: mode === 'light' ? 'rgba(255, 255, 255, 0.9)' : 'rgba(44, 44, 46, 0.9)',
                    borderColor: mode === 'light' ? '#007AFF' : '#0A84FF',
                    boxShadow: '0 0 0 3px rgba(0, 122, 255, 0.1)',
                  },
                },
              },
            },
          },
          MuiSelect: {
            styleOverrides: {
              root: {
                borderRadius: 12,
                '& .MuiOutlinedInput-root': {
                  background: mode === 'light' ? 'rgba(255, 255, 255, 0.6)' : 'rgba(44, 44, 46, 0.6)',
                  backdropFilter: 'blur(var(--glass-blur))',
                  WebkitBackdropFilter: 'blur(var(--glass-blur))',
                  border: `1px solid var(--glass-border)`,
                },
              },
            },
          },
          MuiAccordion: {
            styleOverrides: {
              root: {
                background: mode === 'light' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(44, 44, 46, 0.7)',
                backdropFilter: 'blur(var(--glass-blur))',
                WebkitBackdropFilter: 'blur(var(--glass-blur))',
                border: `1px solid var(--glass-border)`,
                borderRadius: 12,
                boxShadow: 'var(--glass-shadow)',
                '&:before': {
                  display: 'none',
                },
              },
            },
          },
          MuiLinearProgress: {
            styleOverrides: {
              root: {
                borderRadius: 8,
                height: 8,
                background: mode === 'light' ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.1)',
              },
              bar: {
                borderRadius: 8,
                background: 'linear-gradient(90deg, #007AFF 0%, #5E9CEF 100%)',
              },
            },
          },
        },
      }),
    [mode]
  );

  return (
    <ThemeModeContext.Provider value={{ mode, toggleMode, theme }}>
      {children}
    </ThemeModeContext.Provider>
  );
};