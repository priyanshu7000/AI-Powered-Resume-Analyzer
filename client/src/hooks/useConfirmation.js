/**
 * useConfirmation Hook
 * Global confirmation modal management
 * 
 * @hook
 * @example
 * const confirmation = useConfirmation();
 * 
 * confirmation.delete({
 *   title: 'Delete Resume?',
 *   message: 'This cannot be undone.',
 *   onConfirm: async () => await deleteResume(),
 * });
 * 
 * confirmation.logout({
 *   onConfirm: async () => await logoutUser(),
 * });
 */
const useConfirmation = () => {
  const show = (config) => {
    if (window.__confirmationModal) {
      return window.__confirmationModal.show(config);
    }
    console.warn('ConfirmationModalContainer not mounted');
  };

  const hide = () => {
    if (window.__confirmationModal) {
      return window.__confirmationModal.hide();
    }
  };

  const setLoading = (loading) => {
    if (window.__confirmationModal) {
      return window.__confirmationModal.setLoading(loading);
    }
  };

  // Convenience methods for common actions
  const delete_ = (config) => {
    return show({
      type: 'delete',
      title: 'Confirm Delete',
      message: 'This action cannot be undone.',
      confirmText: 'Delete',
      ...config,
    });
  };

  const logout = (config) => {
    return show({
      type: 'logout',
      title: 'Confirm Logout',
      message: 'You will be logged out of your account.',
      confirmText: 'Logout',
      ...config,
    });
  };

  const confirm = (config) => {
    return show(config);
  };

  return {
    show,
    hide,
    setLoading,
    delete: delete_,
    logout,
    confirm,
  };
};

export { useConfirmation };
export default useConfirmation;
