import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box, CircularProgress } from '@mui/material';
import theme from './theme';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';

// Lazy load components for better performance
const Home = lazy(() => import('./components/Home'));
const Login = lazy(() => import('./components/Login'));
const Register = lazy(() => import('./components/Register'));
const AdminDashboard = lazy(() => import('./components/AdminDashboard'));
const StudentDashboard = lazy(() => import('./components/StudentDashboard'));
const ShareExperience = lazy(() => import('./components/ShareExperience'));
const Experiences = lazy(() => import('./components/Experiences'));
const ExperienceDetails = lazy(() => import('./components/ExperienceDetails'));

// Loading component
const LoadingFallback = () => (
  <Box
    sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      backgroundColor: '#f5f5f5'
    }}
  >
    <CircularProgress />
  </Box>
);

// Layout component with Navbar
const Layout = ({ children }) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Suspense fallback={<LoadingFallback />}>{children}</Suspense>;
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <Navbar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          ml: '240px', // Width of the Navbar
          minHeight: '100vh',
          backgroundColor: '#f5f5f5'
        }}
      >
        <Suspense fallback={<LoadingFallback />}>{children}</Suspense>
      </Box>
    </Box>
  );
};

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Admin Route component
const AdminRoute = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  
  if (!isAuthenticated || user?.role !== 'admin') {
    return <Navigate to="/student-dashboard" replace />;
  }

  return children;
};

// Student Route component
const StudentRoute = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  
  if (!isAuthenticated || user?.role !== 'student') {
    return <Navigate to="/admin-dashboard" replace />;
  }

  return children;
};

// Approved Student Route component
const ApprovedStudentRoute = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  
  if (!isAuthenticated || !user?.isApproved) {
    return <Navigate to="/student-dashboard" replace />;
  }

  return children;
};

// Public Route component (redirects to home if already authenticated)
const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  return (
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Layout>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route
                path="/login"
                element={
                  <PublicRoute>
                    <Login />
                  </PublicRoute>
                }
              />
              <Route
                path="/register"
                element={
                  <PublicRoute>
                    <Register />
                  </PublicRoute>
                }
              />
              
              {/* Admin Routes */}
              <Route
                path="/admin-dashboard"
                element={
                  <AdminRoute>
                    <AdminDashboard />
                  </AdminRoute>
                }
              />

              {/* Student Routes */}
              <Route
                path="/student-dashboard"
                element={
                  <StudentRoute>
                    <StudentDashboard />
                  </StudentRoute>
                }
              />

              {/* Experience Routes */}
              <Route
                path="/experiences"
                element={
                  <ProtectedRoute>
                    <Experiences />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/share-experience"
                element={
                  <ApprovedStudentRoute>
                    <ShareExperience />
                  </ApprovedStudentRoute>
                }
              />

              <Route
                path="/experience/:id"
                element={
                  <ProtectedRoute>
                    <ExperienceDetails />
                  </ProtectedRoute>
                }
              />

              {/* Redirect any other routes to home */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Layout>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
