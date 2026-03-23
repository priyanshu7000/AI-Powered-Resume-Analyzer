import React, { useState } from 'react';
import { useToast } from '../hooks/useToast';
import { useLoader } from '../hooks/useLoader';

/**
 * Example Component Demonstrating Toast & Loader Usage
 * 
 * This is a reference component showing several common patterns:
 * - Loading data with fullscreen spinner
 * - Displaying success/error notifications
 * - Handling async operations
 * - Error states
 * 
 * Delete this file after reviewing for reference
 */
const ComponentExample = () => {
  const toast = useToast();
  const loader = useLoader();
  const [data, setData] = useState(null);

  // Example 1: Simple operation with toast notification
  const handleSimpleAction = async () => {
    try {
      toast.showSuccess('Action completed successfully');
    } catch (error) {
      toast.showError('Something went wrong');
    }
  };

  // Example 2: Loading data with fullscreen spinner
  const handleLoadData = async () => {
    loader.show('Fetching your data...');
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      setData({ example: 'data' });
      loader.hide();
      toast.showSuccess('Data loaded successfully');
    } catch (error) {
      loader.hide();
      toast.showError('Failed to load data');
    }
  };

  // Example 3: File upload with spinner
  const handleFileUpload = async (file) => {
    loader.showSpinner('Processing file...', 'primary');
    try {
      // Simulate file processing
      await new Promise(resolve => setTimeout(resolve, 3000));
      loader.hide();
      toast.showSuccess(`${file.name} uploaded successfully`);
    } catch (error) {
      loader.hide();
      toast.showError('File upload failed');
    }
  };

  // Example 4: Different toast types
  const handleShowToasts = () => {
    toast.showSuccess('This is a success message');
    setTimeout(() => toast.showError('This is an error message'), 500);
    setTimeout(() => toast.showInfo('This is an info message'), 1000);
    setTimeout(() => toast.showWarning('This is a warning message'), 1500);
  };

  // Example 5: Long operation
  const handleLongOperation = async () => {
    loader.showSpinner('Processing large file...');
    try {
      // Simulate long operation
      const steps = ['Validating...', 'Converting...', 'Uploading...'];
      for (let step of steps) {
        loader.showSpinner(step);
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      loader.hide();
      toast.showSuccess('Operation completed successfully!');
    } catch (error) {
      loader.hide();
      toast.showError('Operation failed');
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Notification & Loading Examples</h1>

      <div className="space-y-4">
        {/* Simple Action */}
        <section className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
          <h2 className="font-semibold mb-2">Simple Action with Toast</h2>
          <button
            onClick={handleSimpleAction}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Simple Action
          </button>
        </section>

        {/* Load Data */}
        <section className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
          <h2 className="font-semibold mb-2">Load Data with Spinner</h2>
          <button
            onClick={handleLoadData}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Load Data
          </button>
          {data && <p className="mt-2 text-sm text-gray-600">Data loaded: {JSON.stringify(data)}</p>}
        </section>

        {/* File Upload */}
        <section className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
          <h2 className="font-semibold mb-2">File Upload</h2>
          <button
            onClick={() => handleFileUpload({ name: 'document.pdf' })}
            className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
          >
            Upload File
          </button>
        </section>

        {/* Show All Toast Types */}
        <section className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
          <h2 className="font-semibold mb-2">Show All Toast Types</h2>
          <button
            onClick={handleShowToasts}
            className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600"
          >
            Show All Toasts
          </button>
        </section>

        {/* Long Operation */}
        <section className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
          <h2 className="font-semibold mb-2">Long Running Operation</h2>
          <button
            onClick={handleLongOperation}
            className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
          >
            Start Long Operation
          </button>
        </section>
      </div>

      {/* Documentation */}
      <section className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
        <h2 className="font-semibold mb-2">Usage Notes</h2>
        <ul className="list-disc list-inside text-sm space-y-1 text-gray-700 dark:text-gray-300">
          <li>Always mount ToastContainer and LoaderContainer in App.jsx</li>
          <li>Use useToast() hook for notifications from any component</li>
          <li>Use useLoader() hook for fullscreen loading states</li>
          <li>Toast messages auto-dismiss after 4-5 seconds by default</li>
          <li>Loader remains visible until hideSpinner() is called</li>
          <li>Both support dark/light mode automatically</li>
        </ul>
      </section>
    </div>
  );
};

export default ComponentExample;
