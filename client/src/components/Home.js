import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Button,
  Box,
  Grid,
  Paper,
} from '@mui/material';
import WorkIcon from '@mui/icons-material/Work';
import SchoolIcon from '@mui/icons-material/School';
import GroupIcon from '@mui/icons-material/Group';

const Home = () => {
  const navigate = useNavigate();

  return (
    <Container>
      {/* Hero Section */}
      <Box sx={{ 
        textAlign: 'center', 
        py: 8,
        background: 'linear-gradient(to right, #e3f2fd, #bbdefb)',
        borderRadius: 2,
        mt: 4
      }}>
        <Typography variant="h2" component="h1" gutterBottom>
          Career Insight
        </Typography>
        <Typography variant="h5" color="text.secondary" paragraph>
          Connect with alumni, share experiences, and discover career opportunities from your college network
        </Typography>
        <Box sx={{ mt: 4 }}>
          <Button
            variant="contained"
            size="large"
            sx={{ mr: 2 }}
            onClick={() => navigate('/login')}
          >
            Login
          </Button>
          <Button
            variant="outlined"
            size="large"
            onClick={() => navigate('/register')}
          >
            Register
          </Button>
        </Box>
      </Box>

      {/* Features Section */}
      <Grid container spacing={4} sx={{ mt: 4 }}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, textAlign: 'center', height: '100%' }}>
            <WorkIcon sx={{ fontSize: 40, color: 'primary.main', mb: 2 }} />
            <Typography variant="h5" gutterBottom>
              Job Experiences
            </Typography>
            <Typography color="text.secondary">
              Access real job experiences shared by alumni from your college
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, textAlign: 'center', height: '100%' }}>
            <SchoolIcon sx={{ fontSize: 40, color: 'primary.main', mb: 2 }} />
            <Typography variant="h5" gutterBottom>
              College Network
            </Typography>
            <Typography color="text.secondary">
              Connect with students and alumni from your college community
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, textAlign: 'center', height: '100%' }}>
            <GroupIcon sx={{ fontSize: 40, color: 'primary.main', mb: 2 }} />
            <Typography variant="h5" gutterBottom>
              Share 
            </Typography>
            <Typography color="text.secondary">
              Share your own experiences and help others in their career journey
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* How It Works Section */}
      <Box sx={{ mt: 8, mb: 6 }}>
        <Typography variant="h4" component="h2" gutterBottom textAlign="center">
          How It Works
        </Typography>
        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h6" gutterBottom>1. Register</Typography>
              <Typography color="text.secondary">
                Sign up with your college email and create your account
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h6" gutterBottom>2. Get Approved</Typography>
              <Typography color="text.secondary">
                Wait for admin approval to ensure community quality
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h6" gutterBottom>3. Start Contributing</Typography>
              <Typography color="text.secondary">
                Share your experiences and connect with others
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Home; 