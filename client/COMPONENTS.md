# Toast & Loader Components

Professional, production-ready notification and loading components with clean, minimal design.

## Components

### Toast Component
Individual toast notification element with auto-dismiss and smooth animations.

**Import:**
```javascript
import Toast from './components/Toast';
```

**Props:**
- `message` (string): Toast content
- `type` (string): 'success' | 'error' | 'info' | 'warning' (default: 'info')
- `duration` (number): Auto-dismiss time in ms (default: 4000, set 0 to disable)
- `onClose` (function): Callback when toast closes
- `position` (string): 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center'
- `icon` (boolean): Show type icon (default: true)
- `dismissible` (boolean): Show close button (default: true)

**Example:**
```jsx
<Toast 
  message="Operation successful" 
  type="success" 
  onClose={() => setShowToast(false)} 
/>
```

---

### ToastContainer Component
Container that manages multiple toasts globally. Mount once in your App component.

**Import:**
```javascript
import ToastContainer from './components/ToastContainer';
```

**Usage:**
```jsx
// In App.jsx
function App() {
  return (
    <Router>
      <ToastContainer />
      {/* Rest of app */}
    </Router>
  );
}
```

---

### useToast Hook
Global hook for showing toast notifications anywhere in your app.

**Import:**
```javascript
import { useToast } from './hooks/useToast';
```

**Methods:**
- `showSuccess(message, duration?)`: Display success toast
- `showError(message, duration?)`: Display error toast
- `showInfo(message, duration?)`: Display info toast
- `showWarning(message, duration?)`: Display warning toast
- `showLoading(message?, duration?)`: Display loading toast

**Example:**
```javascript
const toast = useToast();

// In event handlers
const handleSubmit = async () => {
  try {
    await submitForm();
    toast.showSuccess('Form submitted successfully');
  } catch (error) {
    toast.showError('Failed to submit form');
  }
};
```

---

### Spinner Component
Lightweight loading spinner with multiple variants and modes.

**Import:**
```javascript
import Spinner from './components/Spinner';
```

**Props:**
- `size` (string): 'sm' | 'md' | 'lg' | 'xl' (default: 'md')
- `variant` (string): 'primary' | 'success' | 'error' | 'dark' (default: 'primary')
- `mode` (string): 'inline' | 'fullscreen' (default: 'inline')
- `text` (string): Loading message text
- `transparent` (boolean): Transparent overlay in fullscreen mode

**Example - Inline Spinner:**
```jsx
<Spinner size="lg" variant="primary" text="Loading data..." />
```

**Example - Fullscreen Spinner:**
```jsx
<Spinner 
  size="lg" 
  variant="primary" 
  mode="fullscreen" 
  text="Processing..." 
/>
```

---

### LoaderContainer Component
Container that manages global loader state. Mount once in your App component.

**Import:**
```javascript
import LoaderContainer from './components/LoaderContainer';
```

**Usage:**
```jsx
// In App.jsx
function App() {
  return (
    <Router>
      <ToastContainer />
      <LoaderContainer />
      {/* Rest of app */}
    </Router>
  );
}
```

---

### useLoader Hook
Global hook for showing/hiding fullscreen loaders.

**Import:**
```javascript
import { useLoader } from './hooks/useLoader';
```

**Methods:**
- `showSpinner(message?, variant?, transparent?)`: Show fullscreen spinner
- `hideSpinner()`: Hide fullscreen spinner
- `show(message?)`: Shorthand for showSpinner
- `hide()`: Shorthand for hideSpinner

**Example:**
```javascript
const loader = useLoader();

const handleFileUpload = async (file) => {
  loader.showSpinner('Processing file...');
  try {
    await uploadFile(file);
    loader.hideSpinner();
    toast.showSuccess('File uploaded successfully');
  } catch (error) {
    loader.hideSpinner();
    toast.showError('Upload failed');
  }
};
```

---

## Design Features

- **Professional Aesthetic**: Clean, minimal design suitable for corporate applications
- **Dark/Light Mode**: Automatic theme support based on Redux store
- **Accessibility**: ARIA labels, keyboard support, semantic HTML
- **Performance**: Optimized animations, no unnecessary re-renders
- **Responsive**: Works seamlessly on all screen sizes
- **Type Safety**: Well-documented with JSDoc comments

## Styling

All components use Tailwind CSS classes and support both light and dark modes:

- **Success**: Green badges (#22c55e / #4ade80)
- **Error**: Red badges (#ef4444 / #f87171)
- **Info**: Blue badges (#3b82f6 / #60a5fa)
- **Warning**: Amber badges (#f59e0b / #fbbf24)

## Migration from react-hot-toast

The new Toast components are drop-in replacements for react-hot-toast:

**Old:**
```javascript
import toast from 'react-hot-toast';
toast.success('Success');
```

**New:**
```javascript
const toast = useToast();
toast.showSuccess('Success');
```

All existing `useToast` calls throughout the app will automatically use the new custom components.

---

## Best Practices

1. **Always mount ToastContainer and LoaderContainer in App.jsx** - They must be at the root level
2. **Use hooks from anywhere** - `useToast()` and `useLoader()` work in any component
3. **Keep messages concise** - Maximum 2-3 lines of text
4. **Use appropriate types** - success for positive actions, error for failures, warning for cautions
5. **Consider UX** - Don't show multiple toasts simultaneously if possible
6. **Handle errors gracefully** - Always show error toasts on API failures

---

## Browser Support

Works in all modern browsers with Tailwind CSS support:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
