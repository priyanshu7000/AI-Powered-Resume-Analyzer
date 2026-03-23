/**
 * useToast Hook
 * Global toast notification management
 * Provides convenience methods for showing different toast types
 * 
 * @hook
 * @example
 * const toast = useToast();
 * toast.showSuccess('Operation completed');
 * toast.showError('An error occurred');
 */
const useToast = () => {
  const showSuccess = (message, duration = 4000) => {
    if (window.__toastManager) {
      return window.__toastManager.showSuccess(message, duration);
    }
    console.warn('ToastContainer not mounted');
  };

  const showError = (message, duration = 5000) => {
    if (window.__toastManager) {
      return window.__toastManager.showError(message, duration);
    }
    console.warn('ToastContainer not mounted');
  };

  const showInfo = (message, duration = 4000) => {
    if (window.__toastManager) {
      return window.__toastManager.showInfo(message, duration);
    }
    console.warn('ToastContainer not mounted');
  };

  const showWarning = (message, duration = 4000) => {
    if (window.__toastManager) {
      return window.__toastManager.showWarning(message, duration);
    }
    console.warn('ToastContainer not mounted');
  };

  const showLoading = (message = 'Loading...', duration = 0) => {
    return showInfo(message, duration);
  };

  return {
    showSuccess,
    showError,
    showInfo,
    showWarning,
    showLoading,
  };
};

export { useToast };
export default useToast;
