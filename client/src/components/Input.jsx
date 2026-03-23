import React from 'react';
import { useSelector } from 'react-redux';

const Input = React.forwardRef(({
  label,
  error,
  type = 'text',
  className = '',
  ...props
}, ref) => {
  const { theme } = useSelector((state) => state.ui);
  const isDark = theme === 'dark';

  return (
    <div className="w-full">
      {label && (
        <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
          {label}
        </label>
      )}
      <input
        ref={ref}
        type={type}
        className={`w-full px-3 py-2 border rounded-lg transition focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          isDark
            ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-500'
            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
        } ${error ? (isDark ? 'border-red-600' : 'border-red-400') : ''} ${className}`}
        {...props}
      />
      {error && (
        <p className={`text-sm mt-1 ${isDark ? 'text-red-400' : 'text-red-600'}`}>
          {error}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
