import React from 'react';
import { AlertCircle } from 'lucide-react';
import { useSelector } from 'react-redux';

const ErrorBoundary = ({ error, children }) => {
  const { theme } = useSelector((state) => state.ui);
  const isDark = theme === 'dark';

  if (error) {
    return (
      <div
        className={`p-6 rounded-lg border ${
          isDark
            ? 'bg-red-900/20 border-red-700 text-red-300'
            : 'bg-red-50 border-red-200 text-red-800'
        } flex items-start gap-3`}
      >
        <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
        <div>
          <h3 className="font-semibold mb-1">Something went wrong</h3>
          <p className="text-sm">{error?.message || 'An unexpected error occurred'}</p>
        </div>
      </div>
    );
  }

  return children;
};

export default ErrorBoundary;
