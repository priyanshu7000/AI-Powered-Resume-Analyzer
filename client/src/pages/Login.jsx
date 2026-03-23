import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../features/authSlice';
import Input from '../components/Input';
import Button from '../components/Button';
import { useToast } from '../hooks/useToast';
import { validateEmail } from '../utils/helpers';
import { ERROR_MESSAGES } from '../constants/errorMessages';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.auth);
  const { showError, showSuccess } = useToast();
  const { theme } = useSelector((state) => state.ui);
  const isDark = theme === 'dark';

  // Check for stored error from previous attempt and initialize activity tracker
  useEffect(() => {
    // Initialize session tracking
    sessionStorage.setItem('last_activity', Date.now().toString());

    const storedError = localStorage.getItem('loginError');
    if (storedError) {
      showError(storedError);
      localStorage.removeItem('loginError');
    }

    // Track user activity
    const handleActivity = () => {
      sessionStorage.setItem('last_activity', Date.now().toString());
    };

    document.addEventListener('mousedown', handleActivity);
    document.addEventListener('keydown', handleActivity);

    return () => {
      document.removeEventListener('mousedown', handleActivity);
      document.removeEventListener('keydown', handleActivity);
    };
  }, [showError]);

  const validate = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = ERROR_MESSAGES.AUTH.EMAIL_REQUIRED;
    } else if (!validateEmail(formData.email)) {
      newErrors.email = ERROR_MESSAGES.AUTH.EMAIL_INVALID;
    }
    
    if (!formData.password) {
      newErrors.password = ERROR_MESSAGES.AUTH.PASSWORD_REQUIRED;
    }
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const result = await dispatch(login(formData));
      
      // Check if login failed
      if (result?.type?.includes('rejected')) {
        // Use the error message from the thunk
        const errorMsg = result?.payload || ERROR_MESSAGES.AUTH.LOGIN_FAILED;
        showError(errorMsg);
        // Also store in localStorage as fallback for page reloads
        localStorage.setItem('loginError', errorMsg);
      } else {
        // Clear any stored error
        localStorage.removeItem('loginError');
        showSuccess('Logged in successfully!');
        
        // Clear form and navigate
        setFormData({ email: '', password: '' });
        navigate('/dashboard');
      }
    } catch (error) {
      showError(ERROR_MESSAGES.UNKNOWN.UNEXPECTED_ERROR);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear field error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center py-12 px-4 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className={`max-w-md w-full ${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-8`}>
        <h2 className={`text-2xl font-bold mb-6 text-center ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Login
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email"
            type="email"
            placeholder="your@email.com"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            error={errors.email}
          />

          <Input
            label="Password"
            type="password"
            placeholder="Enter your password"
            showPasswordToggle={true}
            value={formData.password}
            onChange={(e) => handleInputChange('password', e.target.value)}
            error={errors.password}
          />

          <Button type="submit" variant="primary" size="lg" className="w-full mt-6" loading={loading}>
            Login
          </Button>
        </form>

        <p className={`text-center mt-6 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          Don't have an account?{' '}
          <Link to="/register" className="text-blue-600 hover:underline font-medium">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
