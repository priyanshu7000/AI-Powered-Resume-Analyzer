import React from 'react';
import { useSelector } from 'react-redux';
import { AlertCircle, LogOut, Trash2 } from 'lucide-react';
import Button from './Button';

/**
 * Confirmation Modal Component
 * Minimal, reusable modal for delete and logout confirmations
 * 
 * @component
 * @example
 * <ConfirmationModal
 *   isOpen={true}
 *   type="delete"
 *   title="Delete Resume?"
 *   message="This action cannot be undone."
 *   onConfirm={() => handleDelete()}
 *   onCancel={() => setShowModal(false)}
 * />
 */
const ConfirmationModal = ({
  isOpen = false,
  type = 'delete', // 'delete' | 'logout'
  title,
  message,
  confirmText,
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  isLoading = false,
}) => {
  const { theme } = useSelector((state) => state.ui);
  const isDark = theme === 'dark';

  // Determine icon and colors based on type
  const config = {
    delete: {
      icon: Trash2,
      iconColor: 'text-red-500',
      buttonVariant: 'danger',
      defaultTitle: 'Confirm Delete',
      defaultMessage: 'This action cannot be undone.',
      defaultConfirmText: 'Delete',
    },
    logout: {
      icon: LogOut,
      iconColor: 'text-amber-500',
      buttonVariant: 'warning',
      defaultTitle: 'Confirm Logout',
      defaultMessage: 'You will be logged out of your account.',
      defaultConfirmText: 'Logout',
    },
  };

  const typeConfig = config[type] || config.delete;
  const IconComponent = typeConfig.icon;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div
        className={`${
          isDark ? 'bg-gray-800' : 'bg-white'
        } rounded-lg shadow-xl max-w-sm w-full animate-slideIn`}
      >
        {/* Header */}
        <div className={`flex items-center gap-3 p-6 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
          <IconComponent size={24} className={typeConfig.iconColor} />
          <h2 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {title || typeConfig.defaultTitle}
          </h2>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className={`text-sm leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            {message || typeConfig.defaultMessage}
          </p>
        </div>

        {/* Actions */}
        <div className={`flex gap-3 p-6 border-t ${isDark ? 'border-gray-700' : 'border-gray-200'} bg-opacity-50`}>
          <Button
            variant="secondary"
            size="md"
            className="flex-1"
            onClick={onCancel}
            disabled={isLoading}
          >
            {cancelText}
          </Button>
          <Button
            variant={typeConfig.buttonVariant}
            size="md"
            className="flex-1"
            onClick={onConfirm}
            loading={isLoading}
          >
            {confirmText || typeConfig.defaultConfirmText}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
