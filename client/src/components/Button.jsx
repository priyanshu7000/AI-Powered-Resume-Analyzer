import React from 'react';
import { useSelector } from 'react-redux';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  className = '',
  ...props
}) => {
  const { theme } = useSelector((state) => state.ui);
  const isDark = theme === 'dark';

  const baseStyles = 'font-medium rounded-lg transition flex items-center justify-center gap-2';

  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-400',
    secondary: isDark ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-200 text-gray-900 hover:bg-gray-300',
    danger: 'bg-red-600 text-white hover:bg-red-700 disabled:bg-red-400',
    outline: isDark ? 'border border-gray-600 text-white hover:bg-gray-800' : 'border border-gray-300 text-gray-900 hover:bg-gray-50',
  };

  const sizes = {
    sm: 'px-3 py-1 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <span className="animate-spin">⏳</span>}
      {children}
    </button>
  );
};

export default Button;
