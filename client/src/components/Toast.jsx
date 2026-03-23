import React, { useEffect } from 'react';
import { Check, AlertCircle, Info, X } from 'lucide-react';

/**
 * Professional Toast Notification Component
 * Production-ready with clean, minimal design
 * 
 * @component
 * @example
 * <Toast 
 *   message="Operation successful" 
 *   type="success" 
 *   onClose={() => {}} 
 * />
 */
const Toast = ({ 
  message, 
  type = 'info',
  duration = 4000,
  onClose,
  position = 'top-right',
  icon = true,
  dismissible = true,
}) => {
  useEffect(() => {
    if (duration && duration > 0) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  // Toast styling based on type
  const baseStyles = 'flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg backdrop-blur-sm border transition-all duration-300 animate-slideIn';
  
  const typeStyles = {
    success: {
      bg: 'bg-green-50 dark:bg-green-900/30',
      border: 'border-green-200 dark:border-green-800',
      icon: Check,
      iconColor: 'text-green-600 dark:text-green-400',
      text: 'text-green-900 dark:text-green-100',
    },
    error: {
      bg: 'bg-red-50 dark:bg-red-900/30',
      border: 'border-red-200 dark:border-red-800',
      icon: AlertCircle,
      iconColor: 'text-red-600 dark:text-red-400',
      text: 'text-red-900 dark:text-red-100',
    },
    info: {
      bg: 'bg-blue-50 dark:bg-blue-900/30',
      border: 'border-blue-200 dark:border-blue-800',
      icon: Info,
      iconColor: 'text-blue-600 dark:text-blue-400',
      text: 'text-blue-900 dark:text-blue-100',
    },
    warning: {
      bg: 'bg-amber-50 dark:bg-amber-900/30',
      border: 'border-amber-200 dark:border-amber-800',
      icon: AlertCircle,
      iconColor: 'text-amber-600 dark:text-amber-400',
      text: 'text-amber-900 dark:text-amber-100',
    },
  };

  const styles = typeStyles[type] || typeStyles.info;
  const IconComponent = styles.icon;

  // Position classes
  const positionStyles = {
    'top-right': 'fixed top-4 right-4',
    'top-left': 'fixed top-4 left-4',
    'bottom-right': 'fixed bottom-4 right-4',
    'bottom-left': 'fixed bottom-4 left-4',
    'top-center': 'fixed top-4 left-1/2 transform -translate-x-1/2',
    'bottom-center': 'fixed bottom-4 left-1/2 transform -translate-x-1/2',
  };

  return (
    <div className={`${positionStyles[position]} max-w-sm z-50`}>
      <div className={`${baseStyles} ${styles.bg} ${styles.border}`}>
        {icon && (
          <IconComponent size={20} className={`flex-shrink-0 ${styles.iconColor}`} />
        )}
        <p className={`text-sm font-medium flex-1 ${styles.text}`}>
          {message}
        </p>
        {dismissible && (
          <button
            onClick={onClose}
            className={`flex-shrink-0 opacity-60 hover:opacity-100 transition-opacity ${styles.text}`}
            aria-label="Close notification"
          >
            <X size={18} />
          </button>
        )}
      </div>
    </div>
  );
};

export default Toast;
