import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../features/authSlice';
import Input from '../components/Input';
import Button from '../components/Button';
import { useToast } from '../hooks/useToast';
import { validateEmail, validatePassword } from '../utils/helpers';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.auth);
  const { showError, showSuccess } = useToast();
  const { theme } = useSelector((state) => state.ui);
  const isDark = theme === 'dark';

  const validate = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!validateEmail(formData.email)) newErrors.email = 'Invalid email';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (!validatePassword(formData.password)) newErrors.password = 'Password must be at least 6 characters';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const result = await dispatch(register({
      name: formData.name,
      email: formData.email,
      password: formData.password,
    }));

    if (result.type === register.fulfilled.type) {
      showSuccess('Registration successful! Please login.');
      navigate('/login');
    } else {
      showError(result.payload || 'Registration failed');
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center py-12 px-4 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className={`max-w-md w-full ${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-8`}>
        <h2 className={`text-2xl font-bold mb-6 text-center ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Create Account
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Full Name"
            type="text"
            placeholder="John Doe"
            value={formData.name}
            onChange={(e) => {
              setFormData({ ...formData, name: e.target.value });
              setErrors({ ...errors, name: '' });
            }}
            error={errors.name}
          />

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
            placeholder="At least 6 characters"
            value={formData.password}
            onChange={(e) => {
              setFormData({ ...formData, password: e.target.value });
              setErrors({ ...errors, password: '' });
            }}
            error={errors.password}
          />

          <Input
            label="Confirm Password"
            type="password"
            placeholder="Confirm your password"
            value={formData.confirmPassword}
            onChange={(e) => {
              setFormData({ ...formData, confirmPassword: e.target.value });
              setErrors({ ...errors, confirmPassword: '' });
            }}
            error={errors.confirmPassword}
          />

          <Button type="submit" variant="primary" size="lg" className="w-full mt-6" loading={loading}>
            Register
          </Button>
        </form>

        <p className={`text-center mt-6 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 hover:underline font-medium">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
