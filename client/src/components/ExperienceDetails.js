import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Chip,
  IconButton,
  Breadcrumbs,
  Link,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
} from '@mui/material';
import {
  Work as WorkIcon,
  AttachMoney as MoneyIcon,
  NavigateBefore as BackIcon,
  CalendarToday as CalendarIcon,
  Email as EmailIcon,
} from '@mui/icons-material';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import axios from 'axios';

const ExperienceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [experience, setExperience] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchExperience = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(
          `http://localhost:5000/api/experiences/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setExperience(response.data);
      } catch (error) {
        console.error('Error fetching experience:', error);
        setError('Failed to load experience details');
      } finally {
        setLoading(false);
      }
    };

    fetchExperience();
  }, [id]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error || !experience) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <Typography color="error">{error || 'Experience not found'}</Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
        <IconButton
          onClick={() => navigate('/experiences')}
          sx={{ mr: 2 }}
          aria-label="back"
        >
          <BackIcon />
        </IconButton>
        <Breadcrumbs aria-label="breadcrumb">
          <Link component={RouterLink} to="/" color="inherit">
            Home
          </Link>
          <Link component={RouterLink} to="/experiences" color="inherit">
            Experiences
          </Link>
          <Typography color="text.primary">Details</Typography>
        </Breadcrumbs>
      </Box>

      <Paper elevation={2} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ color: '#000', fontWeight: 600 }}>
          {experience.companyName}
        </Typography>

        <Box sx={{ display: 'flex', gap: 1, mb: 3, flexWrap: 'wrap' }}>
          <Chip
            icon={<WorkIcon />}
            label={experience.jobTitle}
            color="primary"
            variant="outlined"
            sx={{ fontSize: '1rem' }}
          />
          <Chip
            label={`₹${experience.salary.toLocaleString()}/year`}
            color="success"
            variant="outlined"
            sx={{ fontSize: '1rem' }}
          />
          <Chip
            icon={<CalendarIcon />}
            label={`Joined ${experience.yearOfJoining}`}
            color="info"
            variant="outlined"
            sx={{ fontSize: '1rem' }}
          />
          <Chip
            icon={<EmailIcon />}
            label={`Posted by: ${experience.userId.email}`}
            color="secondary"
            variant="outlined"
            sx={{ fontSize: '1rem', maxWidth: 'none' }}
          />
        </Box>

        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" gutterBottom sx={{ color: '#000', fontWeight: 600 }}>
            Job Description
          </Typography>
          <Typography variant="body1" paragraph sx={{ color: '#000', fontSize: '1.1rem' }}>
            {experience.description}
          </Typography>
        </Box>

        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" gutterBottom sx={{ color: '#000', fontWeight: 600 }}>
            Technical Questions
          </Typography>
          <List>
            {experience.questions.technical.map((question, index) => (
              <ListItem key={index}>
                <ListItemText 
                  primary={question} 
                  sx={{ 
                    '& .MuiListItemText-primary': { 
                      color: '#000', 
                      fontSize: '1.1rem' 
                    } 
                  }}
                />
              </ListItem>
            ))}
          </List>
        </Box>

        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" gutterBottom sx={{ color: '#000', fontWeight: 600 }}>
            Non-Technical Questions
          </Typography>
          <List>
            {experience.questions.nonTechnical.map((question, index) => (
              <ListItem key={index}>
                <ListItemText 
                  primary={question}
                  sx={{ 
                    '& .MuiListItemText-primary': { 
                      color: '#000', 
                      fontSize: '1.1rem' 
                    } 
                  }}
                />
              </ListItem>
            ))}
          </List>
        </Box>

        <Box>
          <Typography variant="h5" gutterBottom sx={{ color: '#000', fontWeight: 600 }}>
            Interview Rounds
          </Typography>
          {experience.rounds.map((round, index) => (
            <Paper key={index} variant="outlined" sx={{ p: 3, mb: 2 }}>
              <Typography variant="h6" gutterBottom sx={{ color: '#000', fontWeight: 600 }}>
                Round {round.roundNumber}: {round.description}
              </Typography>
              <List>
                {round.keyPoints.map((point, idx) => (
                  <ListItem key={idx}>
                    <ListItemText 
                      primary={point}
                      sx={{ 
                        '& .MuiListItemText-primary': { 
                          color: '#000', 
                          fontSize: '1.1rem' 
                        } 
                      }}
                    />
                  </ListItem>
                ))}
              </List>
            </Paper>
          ))}
        </Box>
      </Paper>
    </Container>
  );
};

export default ExperienceDetails; 