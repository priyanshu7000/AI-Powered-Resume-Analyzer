import React, { useState } from 'react';
import { useConfirmation } from '../hooks/useConfirmation';
import { useToast } from '../hooks/useToast';
import Button from './Button';

/**
 * Confirmation Modal Usage Examples
 * 
 * This component demonstrates all use cases:
 * - Delete confirmation
 * - Logout confirmation
 * - Custom confirmations
 * 
 * Delete this file after reviewing
 */
const ConfirmationModalExample = () => {
  const confirmation = useConfirmation();
  const toast = useToast();
  const [isDeleting, setIsDeleting] = useState(false);

  // Example 1: Delete confirmation
  const handleDeleteClick = () => {
    confirmation.delete({
      title: 'Delete Resume?',
      message: 'This action cannot be undone. Your resume data will be permanently deleted.',
      confirmText: 'Delete Resume',
      onConfirm: async () => {
        try {
          setIsDeleting(true);
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          toast.showSuccess('Resume deleted successfully');
          console.log('Resume deleted');
        } catch (error) {
          toast.showError('Failed to delete resume');
        } finally {
          setIsDeleting(false);
        }
      },
      onCancel: () => {
        console.log('Delete cancelled');
      },
    });
  };

  // Example 2: Logout confirmation
  const handleLogoutClick = () => {
    confirmation.logout({
      onConfirm: async () => {
        try {
          // Simulate logout
          await new Promise(resolve => setTimeout(resolve, 1000));
          toast.showSuccess('Logged out successfully');
          console.log('User logged out');
          // Navigate to login page here
        } catch (error) {
          toast.showError('Failed to logout');
        }
      },
      onCancel: () => {
        console.log('Logout cancelled');
      },
    });
  };

  // Example 3: Custom confirmation
  const handleCustomConfirmation = () => {
    confirmation.confirm({
      type: 'delete',
      title: 'Clear All Data?',
      message: 'This will clear all your saved preferences and data. This action is irreversible.',
      confirmText: 'Clear All',
      onConfirm: async () => {
        try {
          await new Promise(resolve => setTimeout(resolve, 1000));
          toast.showSuccess('All data cleared');
          console.log('Data cleared');
        } catch (error) {
          toast.showError('Failed to clear data');
        }
      },
    });
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Confirmation Modal Examples</h1>

      <div className="space-y-4">
        {/* Delete */}
        <div className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-800">
          <h2 className="font-semibold mb-2">Delete Confirmation</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Shows a red delete confirmation with trash icon
          </p>
          <Button
            variant="danger"
            onClick={handleDeleteClick}
          >
            Delete Resume
          </Button>
        </div>

        {/* Logout */}
        <div className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-800">
          <h2 className="font-semibold mb-2">Logout Confirmation</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Shows an amber logout confirmation with logout icon
          </p>
          <Button
            variant="warning"
            onClick={handleLogoutClick}
          >
            Logout
          </Button>
        </div>

        {/* Custom */}
        <div className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-800">
          <h2 className="font-semibold mb-2">Custom Confirmation</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Custom title, message, and confirm text
          </p>
          <Button
            variant="danger"
            onClick={handleCustomConfirmation}
          >
            Clear All Data
          </Button>
        </div>
      </div>

      {/* Documentation */}
      <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
        <h2 className="font-semibold mb-3">How to Use</h2>
        <pre className="text-sm overflow-x-auto bg-white dark:bg-gray-800 p-3 rounded border">
{`const confirmation = useConfirmation();

// Delete confirmation
confirmation.delete({
  title: 'Delete Resume?',
  message: 'This cannot be undone.',
  onConfirm: async () => {
    await deleteResume();
  },
  onCancel: () => console.log('Cancelled'),
});

// Logout confirmation
confirmation.logout({
  onConfirm: async () => {
    await logout();
  },
});

// Custom confirmation
confirmation.confirm({
  type: 'delete',
  title: 'Custom Title',
  message: 'Custom message',
  confirmText: 'Confirm',
  onConfirm: async () => { /* ... */ },
})`}
        </pre>
      </div>
    </div>
  );
};

export default ConfirmationModalExample;
