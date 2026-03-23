import React, { useState, useCallback } from 'react';
import Toast from './Toast';

/**
 * Toast Container Component
 * Manages and displays multiple toast notifications
 * Works with useToast hook for global notification management
 * 
 * @component
 * @example
 * <ToastContainer />
 */
const ToastContainer = () => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info', duration = 4000) => {
    const id = Date.now();
    const newToast = { id, message, type, duration };
    
    setToasts(prev => [...prev, newToast]);
    
    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
    
    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  // Show convenience methods
  const showSuccess = useCallback((message, duration = 4000) => 
    addToast(message, 'success', duration), [addToast]);
  
  const showError = useCallback((message, duration = 5000) => 
    addToast(message, 'error', duration), [addToast]);
  
  const showInfo = useCallback((message, duration = 4000) => 
    addToast(message, 'info', duration), [addToast]);
  
  const showWarning = useCallback((message, duration = 4000) => 
    addToast(message, 'warning', duration), [addToast]);

  // Store methods in window for global access
  React.useEffect(() => {
    const toastMethods = {
      showSuccess: (message, duration = 4000) => addToast(message, 'success', duration),
      showError: (message, duration = 5000) => addToast(message, 'error', duration),
      showInfo: (message, duration = 4000) => addToast(message, 'info', duration),
      showWarning: (message, duration = 4000) => addToast(message, 'warning', duration),
      addToast,
      removeToast,
    };
    
    window.__toastManager = toastMethods;
  }, [addToast, removeToast]);

  return (
    <>
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          duration={0} // Already handled by container
          onClose={() => removeToast(toast.id)}
          position="top-right"
        />
      ))}
    </>
  );
};

export default ToastContainer;
