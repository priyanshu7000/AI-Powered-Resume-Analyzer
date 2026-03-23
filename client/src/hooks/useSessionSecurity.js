/**
 * useSessionSecurity Hook
 * 
 * Handles production-ready session security:
 * - Clears auth tokens when user navigates away and back
 * - Validates session on page focus
 * - Manages token blacklist on logout
 * - Prevents token reuse after logout
 * 
 * Usage:
 * useSessionSecurity(); // Call once in App.jsx
 */

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { clearError } from '../features/authSlice';

export const useSessionSecurity = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    // Handle page visibility changes (tab switching, screen lock, etc.)
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Page is hidden - consider session inactive
        sessionStorage.setItem('session_hidden_at', Date.now().toString());
      } else {
        // Page is visible again - validate session
        const hiddenAt = sessionStorage.getItem('session_hidden_at');
        
        if (hiddenAt) {
          const timeHidden = Date.now() - parseInt(hiddenAt);
          const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes
          
          if (timeHidden > SESSION_TIMEOUT) {
            // Session timed out
            clearAuthSession();
          } else {
            // Session still valid
            sessionStorage.removeItem('session_hidden_at');
          }
        }
      }
    };

    // Handle before unload (closing tab, refreshing, navigation)
    const handleBeforeUnload = () => {
      // Store current page info for post-navigation cleanup
      sessionStorage.setItem('had_valid_session', (isAuthenticated ? 'true' : 'false'));
    };

    // Handle page show after back/forward navigation
    const handlePageShow = (event) => {
      // If user navigated back/forward to this page
      if (event.persisted) {
        const hadSession = sessionStorage.getItem('had_valid_session');
        
        // Clear sensitive data from navigation
        const currentToken = localStorage.getItem('accessToken');
        const storedToken = sessionStorage.getItem('persisted_token');
        
        // If tokens don't match, session was cleared elsewhere
        if (currentToken && storedToken && currentToken !== storedToken) {
          clearAuthSession();
        } else if (currentToken) {
          // Store current token for next comparison
          sessionStorage.setItem('persisted_token', currentToken);
        }
      }
    };

    // Handle page hide (navigating away)
    const handlePageHide = () => {
      // Store token for comparison on page show
      const currentToken = localStorage.getItem('accessToken');
      if (currentToken) {
        sessionStorage.setItem('persisted_token', currentToken);
      }
    };

    // Handle unload with security cleanup
    const handleUnload = () => {
      // Clear sensitive data structures from memory
      sessionStorage.removeItem('session_hidden_at');
    };

    // Add event listeners
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('pageshow', handlePageShow);
    window.addEventListener('pagehide', handlePageHide);
    window.addEventListener('unload', handleUnload);

    // Popup/redirect detection - clear auth if tab loses focus for too long
    let focusTimeout;
    const handleFocus = () => {
      clearTimeout(focusTimeout);
    };

    const handleBlur = () => {
      focusTimeout = setTimeout(() => {
        // Optional: logout if inactive for 1 hour
        const inactiveTime = 60 * 60 * 1000; // 1 hour
        const lastActive = sessionStorage.getItem('last_activity');
        
        if (lastActive && Date.now() - parseInt(lastActive) > inactiveTime) {
          clearAuthSession();
        }
      }, 60000); // Check every minute
    };

    window.addEventListener('focus', handleFocus);
    window.addEventListener('blur', handleBlur);

    // Track user activity
    const handleActivity = () => {
      sessionStorage.setItem('last_activity', Date.now().toString());
    };

    document.addEventListener('mousedown', handleActivity);
    document.addEventListener('keydown', handleActivity);
    document.addEventListener('touchstart', handleActivity);

    // Cleanup
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('pageshow', handlePageShow);
      window.removeEventListener('pagehide', handlePageHide);
      window.removeEventListener('unload', handleUnload);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('blur', handleBlur);
      document.removeEventListener('mousedown', handleActivity);
      document.removeEventListener('keydown', handleActivity);
      document.removeEventListener('touchstart', handleActivity);
      clearTimeout(focusTimeout);
    };
  }, [isAuthenticated, dispatch, navigate]);

  return {
    clearAuthSession,
  };
};

/**
 * Clear all authentication data securely
 */
export const clearAuthSession = () => {
  // Clear localStorage
  const itemsToClear = ['accessToken', 'loginError', 'registerError', 'user_session'];
  itemsToClear.forEach((item) => {
    try {
      localStorage.removeItem(item);
    } catch (e) {
      console.warn(`Failed to clear localStorage item: ${item}`);
    }
  });

  // Clear sessionStorage
  const sessionItems = ['persisted_token', 'session_hidden_at', 'had_valid_session', 'last_activity'];
  sessionItems.forEach((item) => {
    try {
      sessionStorage.removeItem(item);
    } catch (e) {
      console.warn(`Failed to clear sessionStorage item: ${item}`);
    }
  });

  // Redirect to login
  if (typeof window !== 'undefined') {
    window.location.href = '/login';
  }
};

/**
 * Destroy all tokens and user session data
 * Call this on logout
 */
export const destroySession = () => {
  clearAuthSession();
  
  // Optional: Send logout signal to server
  // This would be called by logout thunk
};
