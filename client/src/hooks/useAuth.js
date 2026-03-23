import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getMe } from '../features/authSlice';

export const useAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated, loading } = useSelector((state) => state.auth);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token && !user) {
      dispatch(getMe());
    }
  }, [dispatch, user]);

  const logout = () => {
    localStorage.removeItem('accessToken');
    navigate('/login');
  };

  return { user, isAuthenticated, loading, logout };
};
