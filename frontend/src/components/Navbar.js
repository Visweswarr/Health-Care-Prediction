import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Box,
  Avatar,
  Chip
} from '@mui/material';
import {
  Menu as MenuIcon,
  LocalHospital as HospitalIcon,
  Person as PersonIcon,
  Dashboard as DashboardIcon,
  Logout as LogoutIcon,
  Brightness4 as Brightness4Icon,
  Brightness7 as Brightness7Icon,
  ListItemIcon
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useThemeMode } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const { mode, toggleMode } = useThemeMode();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    handleClose();
  };

  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'Disease Prediction', path: '/disease-prediction', protected: true },
    { label: 'Insurance Calculator', path: '/insurance-calculator', protected: true },
    { label: 'Dashboard', path: '/dashboard', protected: true },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <AppBar position="sticky" elevation={2}>
      <Toolbar>
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2 }}
        >
          <HospitalIcon />
        </IconButton>
        
        <Typography variant="h6" component="div" sx={{ flexGrow: 0, mr: 4 }}>
          Healthcare Aid
        </Typography>

        <Box sx={{ flexGrow: 1, display: 'flex', gap: 2 }}>
          {navItems.map((item) => {
            if (item.protected && !user) return null;
            return (
              <Button
                key={item.path}
                color="inherit"
                onClick={() => navigate(item.path)}
                sx={{
                  backgroundColor: isActive(item.path) ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  },
                }}
              >
                {item.label}
              </Button>
            );
          })}
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <IconButton 
                        color="inherit" 
                        onClick={toggleMode}
                        sx={{
                          background: 'rgba(255, 255, 255, 0.1)',
                          backdropFilter: 'blur(20px)',
                          WebkitBackdropFilter: 'blur(20px)',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          borderRadius: '12px',
                          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                          '&:hover': {
                            background: 'rgba(255, 255, 255, 0.2)',
                            transform: 'scale(1.05)',
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                          }
                        }}
                      >
                        {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
                      </IconButton>
          {user ? (
            <>
                                        <Chip
                            icon={<PersonIcon />}
                            label={`${user.name}`}
                            variant="outlined"
                            sx={{ 
                              color: 'white', 
                              borderColor: 'rgba(255, 255, 255, 0.4)',
                              background: 'rgba(255, 255, 255, 0.1)',
                              backdropFilter: 'blur(20px)',
                              WebkitBackdropFilter: 'blur(20px)',
                              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                              '&:hover': {
                                background: 'rgba(255, 255, 255, 0.2)',
                                borderColor: 'rgba(255, 255, 255, 0.6)',
                                transform: 'scale(1.05)',
                              }
                            }}
                          />
                                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleMenu}
                            color="inherit"
                            sx={{
                              background: 'rgba(255, 255, 255, 0.1)',
                              backdropFilter: 'blur(20px)',
                              WebkitBackdropFilter: 'blur(20px)',
                              border: '1px solid rgba(255, 255, 255, 0.2)',
                              borderRadius: '12px',
                              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                              '&:hover': {
                                background: 'rgba(255, 255, 255, 0.2)',
                                transform: 'scale(1.05)',
                                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                              }
                            }}
                          >
                            <Avatar sx={{ 
                              width: 32, 
                              height: 32, 
                              background: 'linear-gradient(135deg, #007AFF 0%, #5E9CEF 100%)',
                              fontWeight: 600
                            }}>
                              {user.name?.charAt(0).toUpperCase()}
                            </Avatar>
                          </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={() => { navigate('/profile'); handleClose(); }}>
                  <PersonIcon sx={{ mr: 1 }} />
                  Profile
                </MenuItem>
                <MenuItem onClick={() => { navigate('/dashboard'); handleClose(); }}>
                  <DashboardIcon sx={{ mr: 1 }} />
                  Dashboard
                </MenuItem>
                <MenuItem onClick={handleLogout}>
                  <LogoutIcon sx={{ mr: 1 }} />
                  Logout
                </MenuItem>
              </Menu>
            </>
          ) : (
            <>
              <Button
                color="inherit"
                onClick={() => navigate('/login')}
                sx={{
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  '&:hover': {
                    border: '1px solid rgba(255, 255, 255, 0.5)',
                  },
                }}
              >
                Login
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => navigate('/register')}
                sx={{
                  '&:hover': {
                    backgroundColor: 'secondary.dark',
                  },
                }}
              >
                Register
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar; 