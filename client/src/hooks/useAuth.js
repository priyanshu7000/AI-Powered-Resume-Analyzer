import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getMe, logout } from '../features/authSlice';

/**
 * useAuth Hook
 * Provides authentication state and logout functionality
 * Automatically fetches user profile on mount if token exists
 */
export const useAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated, loading, error } = useSelector((state) => state.auth);

  // Fetch user profile on mount if authenticated
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token && !user) {
      dispatch(getMe());
    }
  }, [dispatch, user]);

  /**
   * Properly logout user
   * - Dispatches logout thunk to clear server session
   * - Clears localStorage and sessionStorage
   * - NavigationError to login page
   */
  const handleLogout = async () => {
    try {
      await dispatch(logout());
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      // Even if logout fails, clear local session for security
      localStorage.removeItem('accessToken');
      navigate('/login');
    }
  };

  return {
    user,
    isAuthenticated,
    loading,
    error,
    logout: handleLogout,
  };
};
