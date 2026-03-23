import React from 'react';
import { useSelector } from 'react-redux';

const Card = ({ children, className = '' }) => {
  const { theme } = useSelector((state) => state.ui);
  const isDark = theme === 'dark';

  return (
    <div
      className={`${
        isDark
          ? 'bg-gray-800 border-gray-700 text-gray-100'
          : 'bg-white border-gray-200 text-gray-900'
      } border rounded-lg shadow-sm hover:shadow-md transition ${className}`}
    >
      {children}
    </div>
  );
};

export default Card;
