import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { applyTheme } from './theme/themeConfig';

// Components
import Navbar from './components/Navbar';
import ToastContainer from './components/ToastContainer';
import LoaderContainer from './components/LoaderContainer';
import ConfirmationModalContainer from './components/ConfirmationModalContainer';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import UploadResume from './pages/UploadResume';
import ResumeDetails from './pages/ResumeDetails';
import JobMatcher from './pages/JobMatcher';
import JobMatchDetails from './pages/JobMatchDetails';

// Hooks
import { useAuth } from './hooks/useAuth';
import { useSessionSecurity } from './hooks/useSessionSecurity';

/**
 * SessionSecurityWrapper
 * Wraps app with session security monitoring
 */
const SessionSecurityWrapper = ({ children }) => {
  useSessionSecurity();
  return children;
};

// Protected Route
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <div className="text-center p-8">Loading...</div>;
  return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
  const dispatch = useDispatch();
  const { theme } = useSelector((state) => state.ui);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  return (
    <Router>
      <SessionSecurityWrapper>
        <ToastContainer />
        <LoaderContainer />
        <ConfirmationModalContainer />
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/upload"
            element={
              <ProtectedRoute>
                <UploadResume />
              </ProtectedRoute>
            }
          />
          <Route
            path="/resume/:id"
            element={
              <ProtectedRoute>
                <ResumeDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/matcher"
            element={
              <ProtectedRoute>
                <JobMatcher />
              </ProtectedRoute>
            }
          />
          <Route
            path="/match/:id"
            element={
              <ProtectedRoute>
                <JobMatchDetails />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </SessionSecurityWrapper>
    </Router>
  );
}

export default App;
