import React, { useState, useCallback } from 'react';
import ConfirmationModal from './ConfirmationModal';

/**
 * Confirmation Modal Container
 * Manages global confirmation modal state
 * Works with useConfirmation hook
 * 
 * @component
 */
const ConfirmationModalContainer = () => {
  const [state, setState] = useState({
    isOpen: false,
    type: 'delete',
    title: '',
    message: '',
    confirmText: '',
    cancelText: 'Cancel',
    isLoading: false,
    onConfirm: null,
    onCancel: null,
  });

  const show = useCallback((config) => {
    setState(prev => ({
      ...prev,
      isOpen: true,
      type: config.type || 'delete',
      title: config.title || '',
      message: config.message || '',
      confirmText: config.confirmText || '',
      cancelText: config.cancelText || 'Cancel',
      onConfirm: config.onConfirm || null,
      onCancel: config.onCancel || null,
    }));
  }, []);

  const hide = useCallback(() => {
    setState(prev => ({ ...prev, isOpen: false }));
  }, []);

  const setLoading = useCallback((loading) => {
    setState(prev => ({ ...prev, isLoading: loading }));
  }, []);

  const handleConfirm = async () => {
    if (state.onConfirm) {
      try {
        setLoading(true);
        await state.onConfirm();
        hide();
      } catch (error) {
        console.error('Confirmation action failed:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleCancel = () => {
    if (state.onCancel) {
      state.onCancel();
    }
    hide();
  };

  // Store methods in window for global access
  React.useEffect(() => {
    window.__confirmationModal = {
      show,
      hide,
      setLoading,
    };
  }, [show, hide, setLoading]);

  return (
    <ConfirmationModal
      isOpen={state.isOpen}
      type={state.type}
      title={state.title}
      message={state.message}
      confirmText={state.confirmText}
      cancelText={state.cancelText}
      isLoading={state.isLoading}
      onConfirm={handleConfirm}
      onCancel={handleCancel}
    />
  );
};

export default ConfirmationModalContainer;
