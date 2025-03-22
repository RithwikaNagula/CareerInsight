import React, { useMemo } from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Box,
  Divider,
} from '@mui/material';
import {
  Home as HomeIcon,
  Dashboard as DashboardIcon,
  Share as ShareIcon,
  ExitToApp as LogoutIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/', { replace: true });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Memoize menu items to prevent unnecessary re-renders
  const menuItems = useMemo(() => {
    if (!user) return [];
    
    const isAdmin = user.role === 'admin';
    const isApproved = user.isApproved;

    return [
      {
        text: 'Home',
        icon: <HomeIcon sx={{ color: 'white' }} />,
        onClick: () => navigate('/'),
        path: '/'
      },
      {
        text: 'Dashboard',
        icon: <DashboardIcon sx={{ color: 'white' }} />,
        onClick: () => navigate(isAdmin ? '/admin-dashboard' : '/student-dashboard'),
        path: isAdmin ? '/admin-dashboard' : '/student-dashboard'
      },
      {
        text: 'View Experiences',
        icon: <PersonIcon sx={{ color: 'white' }} />,
        onClick: () => navigate('/experiences'),
        show: !isAdmin,
        path: '/experiences'
      },
      {
        text: 'Share Experience',
        icon: <ShareIcon sx={{ color: 'white' }} />,
        onClick: () => navigate('/share-experience'),
        show: !isAdmin && isApproved,
        path: '/share-experience'
      },
    ];
  }, [navigate, user]);

  if (!user) {
    return null;
  }

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 240,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 240,
          boxSizing: 'border-box',
          background: 'linear-gradient(180deg, #1976d2 0%, #1565c0 100%)',
          color: 'white',
          borderRight: 'none',
        },
      }}
    >
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" component="div" sx={{ mb: 1 }}>
          Career Insight
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.8 }}>
          {user.email}
        </Typography>
        <Typography variant="body2" sx={{ mb: 2, opacity: 0.8 }}>
          Role: {user.role}
        </Typography>
      </Box>

      <Divider sx={{ backgroundColor: 'rgba(255,255,255,0.12)' }} />

      <List>
        {menuItems.map(
          (item, index) =>
            (item.show === undefined || item.show) && (
              <ListItem
                button
                key={index}
                onClick={item.onClick}
                sx={{
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  },
                  backgroundColor: location.pathname === item.path ? 'rgba(255, 255, 255, 0.12)' : 'transparent',
                }}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText 
                  primary={item.text}
                  primaryTypographyProps={{
                    sx: { color: 'white' }
                  }}
                />
              </ListItem>
            )
        )}
      </List>

      <Box sx={{ position: 'absolute', bottom: 0, width: '100%', pb: 2 }}>
        <Divider sx={{ backgroundColor: 'rgba(255,255,255,0.12)' }} />
        <ListItem
          button
          onClick={handleLogout}
          sx={{
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
            },
          }}
        >
          <ListItemIcon>
            <LogoutIcon sx={{ color: 'white' }} />
          </ListItemIcon>
          <ListItemText 
            primary="Logout"
            primaryTypographyProps={{
              sx: { color: 'white' }
            }}
          />
        </ListItem>
      </Box>
    </Drawer>
  );
};

export default React.memo(Navbar); 