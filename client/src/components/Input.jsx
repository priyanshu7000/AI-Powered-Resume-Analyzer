import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Eye, EyeOff } from 'lucide-react';

const Input = React.forwardRef(({
  label,
  error,
  type = 'text',
  className = '',
  showPasswordToggle = false,
  ...props
}, ref) => {
  const { theme } = useSelector((state) => state.ui);
  const isDark = theme === 'dark';
  const [showPassword, setShowPassword] = useState(false);

  const inputType = showPasswordToggle && type === 'password' ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className="w-full">
      {label && (
        <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
          {label}
        </label>
      )}
      <div className="relative">
        <input
          ref={ref}
          type={inputType}
          className={`w-full px-3 py-2 border rounded-lg transition focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            isDark
              ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-500'
              : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
          } ${error ? (isDark ? 'border-red-600' : 'border-red-400') : ''} ${
            showPasswordToggle && type === 'password' ? 'pr-10' : ''
          } ${className}`}
          {...props}
        />
        {showPasswordToggle && type === 'password' && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className={`absolute right-3 top-1/2 transform -translate-y-1/2 transition ${
              isDark ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        )}
      </div>
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
