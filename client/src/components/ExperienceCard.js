import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Chip,
  IconButton,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import {
  Work as WorkIcon,
  CalendarToday as CalendarIcon,
  Email as EmailIcon,
  AttachMoney as MoneyIcon,
  Visibility as VisibilityIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const ExperienceCard = ({ experience, onEdit }) => {
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  const canEdit = currentUser.isApproved && currentUser.id === experience.userId._id;

  const handleViewDetails = () => {
    navigate(`/experience/${experience._id}`);
  };

  return (
    <Card sx={{ mb: 3, boxShadow: 2 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          {experience.companyName}
        </Typography>

        <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
          <Chip
            icon={<WorkIcon />}
            label={experience.jobTitle}
            color="primary"
            variant="outlined"
          />
          <Chip
            label={`₹${experience.salary.toLocaleString()}/year`}
            color="success"
            variant="outlined"
          />
          <Chip
            icon={<CalendarIcon />}
            label={`Joined ${experience.yearOfJoining}`}
            color="info"
            variant="outlined"
          />
          <Chip
            icon={<EmailIcon />}
            label={`Posted by: ${experience.userId.email}`}
            color="secondary"
            variant="outlined"
            sx={{ maxWidth: 'none' }}
          />
        </Box>

        <Typography 
          variant="body1" 
          sx={{ 
            mb: 2,
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}
        >
          {experience.description}
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Button
            variant="contained"
            color="primary"
            endIcon={<VisibilityIcon />}
            onClick={handleViewDetails}
          >
            View Details
          </Button>

          {canEdit && (
            <IconButton 
              onClick={() => onEdit(experience)}
              color="primary"
              aria-label="edit"
            >
              <EditIcon />
            </IconButton>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default ExperienceCard; 