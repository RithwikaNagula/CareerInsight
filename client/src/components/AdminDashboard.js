import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Typography,
  Box,
  Alert,
  Chip,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Tabs,
  Tab,
  Snackbar,
  Card,
  CardContent,
  IconButton,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    type: '', // 'user' or 'experience'
    id: null
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: ''
  });

  useEffect(() => {
    fetchUsers();
    fetchExperiences();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/admin/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(response.data);
      setError('');
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const fetchExperiences = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/experiences', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setExperiences(response.data);
    } catch (error) {
      console.error('Error fetching experiences:', error);
      setError('Failed to fetch experiences');
    }
  };

  const handleApprove = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/admin/approve/${userId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setSnackbar({
        open: true,
        message: 'User approved successfully'
      });
      fetchUsers();
    } catch (error) {
      console.error('Error approving user:', error);
      setError('Failed to approve user');
    }
  };

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem('token');
      const { type, id } = deleteDialog;

      if (type === 'user') {
        await axios.delete(`http://localhost:5000/api/admin/delete/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchUsers();
      } else if (type === 'experience') {
        await axios.delete(`http://localhost:5000/api/experiences/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchExperiences();
      }

      setSnackbar({
        open: true,
        message: `${type === 'user' ? 'User' : 'Experience'} deleted successfully`
      });
    } catch (error) {
      console.error('Error deleting:', error);
      setError(`Failed to delete ${deleteDialog.type}`);
    } finally {
      setDeleteDialog({ open: false, type: '', id: null });
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Container>
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Admin Dashboard
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="Manage Users" />
          <Tab label="Manage Experiences" />
        </Tabs>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {tabValue === 0 && (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Email</TableCell>
                    <TableCell>Role</TableCell>
                    <TableCell>College</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user._id}>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.role}</TableCell>
                      <TableCell>{user.college}</TableCell>
                      <TableCell>
                        <Chip
                          label={user.isApproved ? 'Approved' : 'Pending'}
                          color={user.isApproved ? 'success' : 'warning'}
                        />
                      </TableCell>
                      <TableCell>
                        {!user.isApproved && (
                          <Button
                            variant="contained"
                            color="primary"
                            size="small"
                            onClick={() => handleApprove(user._id)}
                            sx={{ mr: 1 }}
                          >
                            Approve
                          </Button>
                        )}
                        <Button
                          variant="contained"
                          color="error"
                          size="small"
                          onClick={() => setDeleteDialog({
                            open: true,
                            type: 'user',
                            id: user._id
                          })}
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          {tabValue === 1 && (
            <Box sx={{ display: 'grid', gap: 2 }}>
              {experiences.map((experience) => (
                <Card key={experience._id}>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Box>
                        <Typography variant="h6" gutterBottom>
                          {experience.companyName} - {experience.jobTitle}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Shared by: {experience.userId.email}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Posted: {formatDate(experience.createdAt)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Salary: ₹{experience.salary.toLocaleString()}/year
                        </Typography>
                      </Box>
                      <IconButton
                        color="error"
                        onClick={() => setDeleteDialog({
                          open: true,
                          type: 'experience',
                          id: experience._id
                        })}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Box>
          )}
        </>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, type: '', id: null })}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this {deleteDialog.type}? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setDeleteDialog({ open: false, type: '', id: null })}
          >
            Cancel
          </Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ open: false, message: '' })}
        message={snackbar.message}
      />
    </Container>
  );
};

export default AdminDashboard; 