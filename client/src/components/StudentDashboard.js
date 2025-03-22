import React, { useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Button,
  Box,
  Alert,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ShareIcon from '@mui/icons-material/Share';
import WorkIcon from '@mui/icons-material/Work';
import PersonIcon from '@mui/icons-material/Person';
import { useAuth } from '../context/AuthContext';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const { user, updateUserData } = useAuth();

  useEffect(() => {
    // Refresh user data when component mounts
    updateUserData();
  }, [updateUserData]);

  const handleShareExperience = () => {
    navigate('/share-experience');
  };

  if (!user) {
    return null;
  }

  return (
    <Container>
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Student Dashboard
        </Typography>
        <Typography variant="subtitle1" color="textSecondary" gutterBottom>
          Welcome, {user.email}
        </Typography>
      </Box>

      {!user.isApproved && (
        <Alert severity="info" sx={{ mb: 4 }}>
          Your account is pending approval. Once approved, you'll be able to share experiences and contribute to the community.
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* View All Experiences - Available to all students */}
        <Grid item xs={12} md={4}>
          <Paper
            sx={{
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              height: '100%',
              bgcolor: '#f5f5f5',
            }}
          >
            <Box sx={{ mb: 2 }}>
              <PersonIcon sx={{ fontSize: 40, color: 'primary.main' }} />
            </Box>
            <Typography variant="h6" gutterBottom>
              View Experiences
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2, flexGrow: 1 }}>
              Browse through experiences shared by other students from your college.
            </Typography>
            <Button
              variant="contained"
              onClick={() => navigate('/experiences')}
              fullWidth
            >
              Browse Experiences
            </Button>
          </Paper>
        </Grid>

        {/* Share Experience - Only for approved students */}
        <Grid item xs={12} md={4}>
          <Paper
            sx={{
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              height: '100%',
              bgcolor: user.isApproved ? '#f5f5f5' : '#f5f5f5aa',
            }}
          >
            <Box sx={{ mb: 2 }}>
              <ShareIcon sx={{ fontSize: 40, color: user.isApproved ? 'primary.main' : 'grey.400' }} />
            </Box>
            <Typography variant="h6" gutterBottom color={user.isApproved ? 'textPrimary' : 'text.disabled'}>
              Share Experience
            </Typography>
            <Typography 
              variant="body2" 
              color={user.isApproved ? 'text.secondary' : 'text.disabled'}
              sx={{ mb: 2, flexGrow: 1 }}
            >
              Share your internship or job experiences with other students.
            </Typography>
            <Button
              variant="contained"
              onClick={handleShareExperience}
              fullWidth
              disabled={!user.isApproved}
            >
              Share Experience
            </Button>
          </Paper>
        </Grid>

        {/* Contribute - Only for approved students */}
        {/* <Grid item xs={12} md={4}>
          <Paper
            sx={{
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              height: '100%',
              bgcolor: user.isApproved ? '#f5f5f5' : '#f5f5f5aa',
            }}
          >
            <Box sx={{ mb: 2 }}>
              <WorkIcon sx={{ fontSize: 40, color: user.isApproved ? 'primary.main' : 'grey.400' }} />
            </Box>
            <Typography variant="h6" gutterBottom color={user.isApproved ? 'textPrimary' : 'text.disabled'}>
              Contribute
            </Typography>
            <Typography 
              variant="body2" 
              color={user.isApproved ? 'text.secondary' : 'text.disabled'}
              sx={{ mb: 2, flexGrow: 1 }}
            >
              Add new job opportunities or internship openings to help others.
            </Typography>
            <Button
              variant="contained"
              onClick={() => navigate('/contribute')}
              fullWidth
              disabled={!user.isApproved}
            >
              Contribute
            </Button>
          </Paper>
        </Grid> */}
      </Grid>
    </Container>
  );
};

export default StudentDashboard; 