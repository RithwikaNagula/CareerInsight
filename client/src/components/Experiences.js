import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  TextField,
  InputAdornment,
  CircularProgress,
  Alert,
  Pagination,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import axios from 'axios';
import ExperienceCard from './ExperienceCard';
import { useNavigate } from 'react-router-dom';

const ITEMS_PER_PAGE = 5;

const Experiences = () => {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [page, setPage] = useState(1);
  const navigate = useNavigate();
  
  // Get current user from localStorage
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    fetchExperiences();
  }, []);

  const fetchExperiences = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/experiences', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setExperiences(response.data);
      setError('');
    } catch (error) {
      console.error('Error fetching experiences:', error);
      setError('Failed to fetch experiences');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (experience) => {
    // Double check permissions before allowing edit
    if (!currentUser.isApproved || currentUser.id !== experience.userId._id) {
      setError('You do not have permission to edit this experience');
      return;
    }
    navigate('/share-experience', { state: { experience } });
  };

  const filteredExperiences = experiences
    .filter(exp => 
      exp.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exp.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exp.userId.email.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'oldest':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'salary-high':
          return b.salary - a.salary;
        case 'salary-low':
          return a.salary - b.salary;
        default:
          return 0;
      }
    });

  const pageCount = Math.ceil(filteredExperiences.length / ITEMS_PER_PAGE);
  const displayedExperiences = filteredExperiences.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Shared Experiences
      </Typography>

      {!currentUser.isApproved && (
        <Alert severity="info" sx={{ mb: 3 }}>
          Your account is pending approval. Once approved, you'll be able to share and edit your experiences.
        </Alert>
      )}

      <Box sx={{ mb: 4, display: 'flex', gap: 2 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search by company, job title, or email"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Sort By</InputLabel>
          <Select
            value={sortBy}
            label="Sort By"
            onChange={(e) => setSortBy(e.target.value)}
          >
            <MenuItem value="newest">Newest First</MenuItem>
            <MenuItem value="oldest">Oldest First</MenuItem>
            <MenuItem value="salary-high">Highest Salary</MenuItem>
            <MenuItem value="salary-low">Lowest Salary</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : displayedExperiences.length === 0 ? (
        <Alert severity="info">
          No experiences found matching your search criteria.
        </Alert>
      ) : (
        <>
          {displayedExperiences.map((experience) => (
            <ExperienceCard
              key={experience._id}
              experience={experience}
              onEdit={handleEdit}
            />
          ))}
          
          {pageCount > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination
                count={pageCount}
                page={page}
                onChange={(e, value) => setPage(value)}
                color="primary"
              />
            </Box>
          )}
        </>
      )}
    </Container>
  );
};

export default Experiences; 