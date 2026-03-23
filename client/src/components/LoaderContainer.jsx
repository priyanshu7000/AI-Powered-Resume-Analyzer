import React, { useState, useCallback } from 'react';
import Spinner from './Spinner';

/**
 * Loader Container Component
 * Manages global loading state with spinner display
 * Works with useLoader hook for application-wide loader management
 * 
 * @component
 * @example
 * <LoaderContainer />
 */
const LoaderContainer = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [config, setConfig] = useState({
    message: 'Loading...',
    variant: 'primary',
    transparent: false,
  });

  const showSpinner = useCallback((message = 'Loading...', variant = 'primary', transparent = false) => {
    setConfig({ message, variant, transparent });
    setIsVisible(true);
  }, []);

  const hideSpinner = useCallback(() => {
    setIsVisible(false);
  }, []);

  // Store methods in window for global access
  React.useEffect(() => {
    window.__loaderManager = {
      showSpinner,
      hideSpinner,
    };
  }, [showSpinner, hideSpinner]);

  if (!isVisible) return null;

  return (
    <Spinner
      size="lg"
      variant={config.variant}
      mode="fullscreen"
      text={config.message}
      transparent={config.transparent}
    />
  );
};

export default LoaderContainer;
