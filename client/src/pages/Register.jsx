import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../features/authSlice';
import Input from '../components/Input';
import Button from '../components/Button';
import { useToast } from '../hooks/useToast';
import { validateEmail, validatePassword } from '../utils/helpers';
import { ERROR_MESSAGES } from '../constants/errorMessages';

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
    
    if (!formData.name) {
      newErrors.name = ERROR_MESSAGES.AUTH.NAME_REQUIRED;
    }
    
    if (!formData.email) {
      newErrors.email = ERROR_MESSAGES.AUTH.EMAIL_REQUIRED;
    } else if (!validateEmail(formData.email)) {
      newErrors.email = ERROR_MESSAGES.AUTH.EMAIL_INVALID;
    }
    
    if (!formData.password) {
      newErrors.password = ERROR_MESSAGES.AUTH.PASSWORD_REQUIRED;
    } else if (!validatePassword(formData.password)) {
      newErrors.password = ERROR_MESSAGES.AUTH.PASSWORD_TOO_SHORT;
    }
    
    if (formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = ERROR_MESSAGES.AUTH.PASSWORDS_DONT_MATCH;
    } else if (!formData.confirmPassword && formData.password) {
      newErrors.confirmPassword = ERROR_MESSAGES.AUTH.PASSWORD_REQUIRED;
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
      const result = await dispatch(register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      }));

      if (result.type === register.fulfilled.type) {
        showSuccess('Registration successful! Please login.');
        setFormData({ name: '', email: '', password: '', confirmPassword: '' });
        navigate('/login');
      } else if (result.type === register.rejected.type) {
        const errorMsg = result.payload || ERROR_MESSAGES.AUTH.REGISTRATION_FAILED;
        showError(errorMsg);
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
          Create Account
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Full Name"
            type="text"
            placeholder="John Doe"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            error={errors.name}
          />

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
            placeholder="At least 6 characters"
            showPasswordToggle={true}
            value={formData.password}
            onChange={(e) => handleInputChange('password', e.target.value)}
            error={errors.password}
          />

          <Input
            label="Confirm Password"
            type="password"
            placeholder="Confirm your password"
            showPasswordToggle={true}
            value={formData.confirmPassword}
            onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
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
