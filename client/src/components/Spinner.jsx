import React from 'react';

/**
 * Professional Spinner Loader Component
 * Lightweight, production-ready loading indicator
 * Supports multiple variants and sizes
 * 
 * @component
 * @example
 * <Spinner size="lg" variant="primary" />
 * <Spinner mode="fullscreen" />
 */
const Spinner = ({ 
  size = 'md',
  variant = 'primary',
  mode = 'inline', // 'inline' or 'fullscreen'
  text = '',
  transparent = false,
}) => {
  // Size configurations
  const sizeMap = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  // Variant configurations
  const variantMap = {
    primary: 'border-blue-500 border-r-transparent dark:border-blue-400 dark:border-r-transparent',
    success: 'border-green-500 border-r-transparent dark:border-green-400 dark:border-r-transparent',
    error: 'border-red-500 border-r-transparent dark:border-red-400 dark:border-r-transparent',
    dark: 'border-gray-800 border-r-transparent dark:border-gray-200 dark:border-r-transparent',
  };

  const spinnerClass = `
    ${sizeMap[size]} 
    ${variantMap[variant]} 
    border-4 
    rounded-full 
    animate-spin
  `;

  const content = (
    <div className="flex flex-col items-center gap-4">
      <div className={spinnerClass} />
      {text && (
        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
          {text}
        </p>
      )}
    </div>
  );

  if (mode === 'fullscreen') {
    return (
      <div className={`
        fixed inset-0 
        ${transparent ? 'bg-transparent' : 'bg-white/50 dark:bg-gray-900/50'} 
        backdrop-blur-sm
        flex items-center justify-center 
        z-50
      `}>
        {content}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-8">
      {content}
    </div>
  );
};

export default Spinner;
