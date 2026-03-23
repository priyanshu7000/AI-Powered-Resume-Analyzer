import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../features/authSlice';
import Input from '../components/Input';
import Button from '../components/Button';
import { useToast } from '../hooks/useToast';
import { validateEmail } from '../utils/helpers';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.auth);
  const { showError, showSuccess } = useToast();
  const { theme } = useSelector((state) => state.ui);
  const isDark = theme === 'dark';

  const validate = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!validateEmail(formData.email)) newErrors.email = 'Invalid email';
    if (!formData.password) newErrors.password = 'Password is required';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const result = await dispatch(login(formData));
    if (result.type === login.fulfilled.type) {
      showSuccess('Logged in successfully!');
      navigate('/dashboard');
    } else {
      showError(result.payload || 'Login failed');
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
            onChange={(e) => {
              setFormData({ ...formData, email: e.target.value });
              setErrors({ ...errors, email: '' });
            }}
            error={errors.email}
          />

          <Input
            label="Password"
            type="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={(e) => {
              setFormData({ ...formData, password: e.target.value });
              setErrors({ ...errors, password: '' });
            }}
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
