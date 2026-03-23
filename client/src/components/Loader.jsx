import React from 'react';
import { useSelector } from 'react-redux';

const SkeletonLoader = ({ count = 1, height = 'h-10' }) => {
  const { theme } = useSelector((state) => state.ui);
  const isDark = theme === 'dark';

  return (
    <div className="space-y-3">
      {[...Array(count)].map((_, i) => (
        <div
          key={i}
          className={`${height} ${
            isDark ? 'bg-gray-700' : 'bg-gray-200'
          } rounded animate-pulse`}
        />
      ))}
    </div>
  );
};

export default SkeletonLoader;
