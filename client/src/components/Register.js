import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
} from '@mui/material';

const Register = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    college: '',
    role: 'student', // Default role is student
    adminCode: '', // For admin registration validation
  });
  const [error, setError] = useState('');
  const [showAdminCode, setShowAdminCode] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Show/hide admin code field based on role selection
    if (name === 'role') {
      setShowAdminCode(value === 'admin');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Validate admin registration
      if (formData.role === 'admin' && formData.adminCode !== 'admin123') {
        setError('Invalid admin code');
        return;
      }

      // Remove adminCode from the data sent to server
      const { adminCode, ...dataToSend } = formData;
      
      await axios.post('http://localhost:5000/api/auth/register', dataToSend);
      
      // Show success message and navigate to login
      alert('Registration successful! Please login to continue.');
      navigate('/login');
    } catch (error) {
      setError(error.response?.data?.message || 'An error occurred');
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper elevation={3} sx={{ p: 4, mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography component="h1" variant="h5">
          Register
        </Typography>
        {error && (
          <Alert severity="error" sx={{ mt: 2, width: '100%' }}>
            {error}
          </Alert>
        )}
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={formData.email}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="new-password"
            value={formData.password}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="college"
            label="College Name"
            id="college"
            value={formData.college}
            onChange={handleChange}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel id="role-label">Role</InputLabel>
            <Select
              labelId="role-label"
              id="role"
              name="role"
              value={formData.role}
              label="Role"
              onChange={handleChange}
            >
              <MenuItem value="student">Student</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
            </Select>
          </FormControl>
          
          {showAdminCode && (
            <TextField
              margin="normal"
              required
              fullWidth
              name="adminCode"
              label="Admin Code"
              type="password"
              id="adminCode"
              value={formData.adminCode}
              onChange={handleChange}
            />
          )}
          
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Register
          </Button>
          <Typography variant="body2" align="center">
            Already have an account?{' '}
            <Link to="/login" style={{ textDecoration: 'none' }}>
              Login here
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default Register; 