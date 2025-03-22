import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  Chip,
  IconButton,
  Breadcrumbs,
  Link,
  Card,
  CardContent,
  Divider,
  styled,
  CircularProgress,
} from '@mui/material';
import {
  Work as WorkIcon,
  School as SchoolIcon,
  AttachMoney as MoneyIcon,
  QuestionAnswer as QuestionIcon,
  Assignment as AssignmentIcon,
  NavigateBefore as BackIcon,
} from '@mui/icons-material';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import axios from 'axios';

const StyledContainer = styled(Container)(({ theme }) => ({
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(4),
  minHeight: 'calc(100vh - 64px)',
  background: 'linear-gradient(to right bottom, #ffffff, #f5f5f5)',
}));

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[4],
  },
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  marginBottom: theme.spacing(2),
  color: theme.palette.primary.main,
}));

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
    <StyledContainer>
      {/* Breadcrumb Navigation */}
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

      <Grid container spacing={3}>
        {/* Left Column */}
        <Grid item xs={12} md={4}>
          <StyledCard>
            <CardContent>
              <SectionTitle variant="h6">
                <WorkIcon />
                Company Details
              </SectionTitle>
              <Typography variant="h5" gutterBottom>
                {experience.companyName}
              </Typography>
              <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                {experience.jobTitle}
              </Typography>
              <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Chip
                  icon={<MoneyIcon />}
                  label={`₹${experience.salary.toLocaleString()}/year`}
                  color="success"
                />
                <Chip
                  icon={<SchoolIcon />}
                  label={`Joined ${experience.yearOfJoining}`}
                  color="primary"
                />
              </Box>
            </CardContent>
          </StyledCard>
        </Grid>

        {/* Right Column */}
        <Grid item xs={12} md={8}>
          <Grid container spacing={3}>
            {/* Job Description */}
            <Grid item xs={12}>
              <StyledCard>
                <CardContent>
                  <SectionTitle variant="h6">
                    <AssignmentIcon />
                    Job Description
                  </SectionTitle>
                  <Typography variant="body1" paragraph>
                    {experience.description}
                  </Typography>
                </CardContent>
              </StyledCard>
            </Grid>

            {/* Interview Questions */}
            <Grid item xs={12}>
              <StyledCard>
                <CardContent>
                  <SectionTitle variant="h6">
                    <QuestionIcon />
                    Interview Questions
                  </SectionTitle>
                  
                  <Typography variant="subtitle1" color="primary" gutterBottom>
                    Technical Questions
                  </Typography>
                  {experience.questions.technical.map((question, index) => (
                    <Box key={index} sx={{ mb: 2 }}>
                      <Typography variant="body1">
                        {index + 1}. {question}
                      </Typography>
                    </Box>
                  ))}

                  <Divider sx={{ my: 3 }} />

                  <Typography variant="subtitle1" color="primary" gutterBottom>
                    Non-Technical Questions
                  </Typography>
                  {experience.questions.nonTechnical.map((question, index) => (
                    <Box key={index} sx={{ mb: 2 }}>
                      <Typography variant="body1">
                        {index + 1}. {question}
                      </Typography>
                    </Box>
                  ))}
                </CardContent>
              </StyledCard>
            </Grid>

            {/* Interview Rounds */}
            <Grid item xs={12}>
              <StyledCard>
                <CardContent>
                  <SectionTitle variant="h6">
                    <AssignmentIcon />
                    Interview Rounds
                  </SectionTitle>
                  {experience.rounds.map((round, index) => (
                    <Box key={index} sx={{ mb: 3 }}>
                      <Typography variant="subtitle1" color="primary" gutterBottom>
                        Round {round.roundNumber}
                      </Typography>
                      <Typography variant="body1" paragraph>
                        {round.description}
                      </Typography>
                      <Typography variant="subtitle2" gutterBottom>
                        Key Points:
                      </Typography>
                      {round.keyPoints.map((point, pointIndex) => (
                        <Typography
                          key={pointIndex}
                          variant="body2"
                          sx={{ ml: 2, mb: 1 }}
                        >
                          • {point}
                        </Typography>
                      ))}
                    </Box>
                  ))}
                </CardContent>
              </StyledCard>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </StyledContainer>
  );
};

export default ExperienceDetails; 