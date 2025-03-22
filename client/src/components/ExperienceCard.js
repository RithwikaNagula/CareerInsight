import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
  Collapse,
  Chip,
  IconButton,
  Divider,
  Avatar,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import MoneyIcon from '@mui/icons-material/Edit';
import SchoolIcon from '@mui/icons-material/Edit';
import WorkIcon from '@mui/icons-material/Edit';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import BusinessIcon from '@mui/icons-material/Business';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

const StyledCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[4],
  },
}));

const ExperienceCard = ({ experience, onEdit }) => {
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();
  
  // Get current user from localStorage
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  
  // Check if user is approved and is the owner of the experience
  const canEdit = currentUser.isApproved && 
                 currentUser.id === experience.userId._id;

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const handleViewDetails = () => {
    navigate(`/experience/${experience._id}`);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <StyledCard>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box>
            <Typography variant="h6" gutterBottom>
              {experience.companyName}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" gutterBottom>
              {experience.jobTitle}
            </Typography>
          </Box>
          <Button
            variant="contained"
            color="primary"
            onClick={handleViewDetails}
          >
            View Details
          </Button>
        </Box>

        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
          <Chip
            icon={<MoneyIcon />}
            label={`₹${experience.salary.toLocaleString()}/year`}
            color="success"
            size="small"
          />
          <Chip
            icon={<SchoolIcon />}
            label={`Joined ${experience.yearOfJoining}`}
            color="primary"
            size="small"
          />
          <Chip
            icon={<WorkIcon />}
            label={experience.userId.email}
            variant="outlined"
            size="small"
          />
        </Box>

        <Typography variant="body2" color="text.secondary" noWrap>
          {experience.description}
        </Typography>
      </CardContent>

      <CardActions disableSpacing>
        {canEdit && (
          <IconButton 
            sx={{ ml: 'auto' }}
            onClick={() => onEdit(experience)}
            aria-label="edit"
          >
            <EditIcon />
          </IconButton>
        )}
      </CardActions>

      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Job Description
          </Typography>
          <Typography paragraph color="text.secondary">
            {experience.description}
          </Typography>

          <Divider sx={{ my: 2 }} />

          <Typography variant="h6" gutterBottom>
            Technical Questions
          </Typography>
          <Box component="ul" sx={{ pl: 2 }}>
            {experience.questions.technical.map((question, index) => (
              <Typography key={index} component="li" paragraph>
                {question}
              </Typography>
            ))}
          </Box>

          <Typography variant="h6" gutterBottom>
            Non-Technical Questions
          </Typography>
          <Box component="ul" sx={{ pl: 2 }}>
            {experience.questions.nonTechnical.map((question, index) => (
              <Typography key={index} component="li" paragraph>
                {question}
              </Typography>
            ))}
          </Box>

          <Divider sx={{ my: 2 }} />

          <Typography variant="h6" gutterBottom>
            Interview Rounds
          </Typography>
          {experience.rounds.map((round, index) => (
            <Box key={index} sx={{ mb: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                Round {round.roundNumber}
              </Typography>
              <Typography paragraph color="text.secondary">
                {round.description}
              </Typography>
              <Box component="ul" sx={{ pl: 2 }}>
                {round.keyPoints.map((point, idx) => (
                  <Typography key={idx} component="li">
                    {point}
                  </Typography>
                ))}
              </Box>
            </Box>
          ))}
        </CardContent>
      </Collapse>
    </StyledCard>
  );
};

export default ExperienceCard; 