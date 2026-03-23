/**
 * useLoader Hook
 * Global loading state management
 * Provides convenience methods for showing/hiding loaders
 * 
 * @hook
 * @example
 * const loader = useLoader();
 * loader.showSpinner('Loading...');
 * loader.hideSpinner();
 */
const useLoader = () => {
  const showSpinner = (message = 'Loading...', variant = 'primary', transparent = false) => {
    if (window.__loaderManager) {
      return window.__loaderManager.showSpinner(message, variant, transparent);
    }
    console.warn('LoaderContainer not mounted');
  };

  const hideSpinner = () => {
    if (window.__loaderManager) {
      return window.__loaderManager.hideSpinner();
    }
    console.warn('LoaderContainer not mounted');
  };

  const show = (message = 'Loading...') => {
    return showSpinner(message);
  };

  const hide = () => {
    return hideSpinner();
  };

  return {
    showSpinner,
    hideSpinner,
    show,
    hide,
  };
};

export { useLoader };
export default useLoader;
