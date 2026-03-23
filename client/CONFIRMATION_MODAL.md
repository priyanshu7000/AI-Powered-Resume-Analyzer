# Confirmation Modal

Minimal, professional confirmation modal for delete and logout actions with dark/light mode support.

## Components

### ConfirmationModal
Individual modal element displayed at center of screen with backdrop.

**Props:**
- `isOpen` (boolean): Controls modal visibility
- `type` (string): 'delete' | 'logout' (determines icon and colors)
- `title` (string): Modal title
- `message` (string): Modal message
- `confirmText` (string): Confirm button text
- `cancelText` (string): Cancel button text (default: 'Cancel')
- `isLoading` (boolean): Shows loading state on confirm button
- `onConfirm` (function): Callback when confirming
- `onCancel` (function): Callback when canceling

### ConfirmationModalContainer
Global container managing modal state. Mount once in App.jsx (already done).

---

## useConfirmation Hook

Global hook for showing confirmation modals from any component.

**Import:**
```javascript
import { useConfirmation } from './hooks/useConfirmation';
```

### Methods

#### `delete(config)`
Shows delete confirmation with red styling and trash icon.

```javascript
const confirmation = useConfirmation();

confirmation.delete({
  title: 'Delete Resume?',
  message: 'This action cannot be undone.',
  confirmText: 'Delete Resume',
  onConfirm: async () => {
    await deleteResume(id);
  },
  onCancel: () => {
    console.log('Delete cancelled');
  },
});
```

#### `logout(config)`
Shows logout confirmation with amber styling and logout icon.

```javascript
confirmation.logout({
  title: 'Confirm Logout',  // optional, has default
  message: 'You will be logged out', // optional, has default
  onConfirm: async () => {
    await logoutUser();
  },
});
```

#### `confirm(config)` / `show(config)`
Generic confirmation with custom configuration.

```javascript
confirmation.confirm({
  type: 'delete',
  title: 'Clear Cache?',
  message: 'This will clear all cached data.',
  confirmText: 'Clear',
  onConfirm: async () => {
    await clearCache();
  },
});
```

#### `hide()`
Manually close the modal.

```javascript
confirmation.hide();
```

---

## Usage Examples

### Delete with async operation

```javascript
import { useConfirmation } from '../hooks/useConfirmation';
import { useToast } from '../hooks/useToast';

function ResumeItem({ resumeId }) {
  const confirmation = useConfirmation();
  const toast = useToast();

  const handleDelete = () => {
    confirmation.delete({
      title: 'Delete Resume?',
      message: 'This resume will be permanently deleted.',
      onConfirm: async () => {
        try {
          await api.delete(`/resume/${resumeId}`);
          toast.showSuccess('Resume deleted successfully');
          // Refresh list
        } catch (error) {
          toast.showError('Failed to delete resume');
        }
      },
    });
  };

  return (
    <button onClick={handleDelete} className="text-red-600">
      Delete
    </button>
  );
}
```

### Logout in Navbar

```javascript
import { useConfirmation } from '../hooks/useConfirmation';
import { useNavigate } from 'react-router-dom';

function Navbar() {
  const confirmation = useConfirmation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    confirmation.logout({
      onConfirm: async () => {
        // Clear auth state
        dispatch(logout());
        // Clear localStorage
        localStorage.removeItem('token');
        navigate('/login');
      },
    });
  };

  return (
    <button onClick={handleLogout}>
      Logout
    </button>
  );
}
```

### Job match deletion

```javascript
import { useConfirmation } from '../hooks/useConfirmation';
import { useDispatch } from 'react-redux';
import { deleteJobMatch } from '../features/jobSlice';

function JobMatchDetails() {
  const confirmation = useConfirmation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleDelete = () => {
    confirmation.delete({
      title: 'Delete Job Match?',
      message: 'This job match analysis will be permanently deleted.',
      confirmText: 'Delete Match',
      onConfirm: async () => {
        const result = await dispatch(deleteJobMatch(id));
        if (result.type === 'job/delete/fulfilled') {
          toast.showSuccess('Job match deleted');
          navigate('/dashboard');
        }
      },
    });
  };

  return (
    <button onClick={handleDelete}>
      Delete Match
    </button>
  );
}
```

---

## Design Features

- **Minimal Design** - Clean, professional appearance
- **Dark/Light Mode** - Automatic theme support
- **Smooth Animation** - Slide-in effect from the center
- **Type-specific Styling** - Delete (red) and Logout (amber) variants
- **Backdrop Blur** - Semi-transparent backdrop with blur
- **Icon Support** - Type-appropriate icons (Trash2, LogOut)
- **Loading State** - Disabled actions during confirmation
- **Accessibility** - Proper button semantics and focus management

---

## Type Variants

### Delete
- Icon: Trash2
- Color: Red
- Button Variant: danger
- Common uses: Deleting resumes, job matches, account data

### Logout
- Icon: LogOut
- Color: Amber
- Button Variant: warning
- Common uses: Confirming logout, session termination

---

## Best Practices

1. **Always show confirmation for destructive actions** - Delete, logout, clear data
2. **Keep messages concise** - 1-2 lines explaining the consequence
3. **Use descriptive titles** - Be specific about what will happen
4. **Handle loading states** - Show feedback during async operations
5. **Provide cancel option** - Always allow users to change their mind
6. **Match button text to action** - "Delete" for delete, "Logout" for logout
7. **No nesting** - Don't open another modal from confirmation

---

## Browser Support

Works in all modern browsers:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

---

## API Reference

### Modal Container States

```javascript
window.__confirmationModal = {
  show(config),        // Show modal with config
  hide(),              // Hide modal
  setLoading(boolean), // Set loading state
};
```

### Hook Return Object

```javascript
{
  confirm(config),  // Show generic confirmation
  delete(config),   // Show delete confirmation
  logout(config),   // Show logout confirmation
  show(config),     // Alias for confirm()
  hide(),           // Hide modal
  setLoading(bool), // Set loading state
}
```
