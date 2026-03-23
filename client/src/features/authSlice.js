import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';
import { ERROR_MESSAGES, extractErrorMessage } from '../constants/errorMessages';

// Thunks
export const register = createAsyncThunk('auth/register', async (credentials, { rejectWithValue }) => {
  try {
    const response = await api.post('/auth/register', credentials);
    
    if (!response?.data?.user) {
      return rejectWithValue(ERROR_MESSAGES.AUTH.REGISTRATION_FAILED);
    }
    
    return response.data.user;
  } catch (error) {
    const status = error.response?.status;
    const errorData = error.response?.data;

    // Check for specific error cases
    if (status === 409 || errorData?.message?.toLowerCase().includes('already exists')) {
      return rejectWithValue(ERROR_MESSAGES.AUTH.USER_ALREADY_EXISTS);
    }

    if (status === 400) {
      // Bad request - could be validation error
      const message = extractErrorMessage(error);
      if (message.toLowerCase().includes('password')) {
        return rejectWithValue(ERROR_MESSAGES.AUTH.PASSWORD_TOO_SHORT);
      }
      if (message.toLowerCase().includes('email')) {
        return rejectWithValue(ERROR_MESSAGES.AUTH.EMAIL_INVALID);
      }
    }

    if (status === 429) {
      return rejectWithValue('Too many registration attempts. Please try again later.');
    }

    if (status >= 500) {
      return rejectWithValue(ERROR_MESSAGES.NETWORK.SERVER_ERROR);
    }

    // Fallback to extracted error
    const errorMessage = extractErrorMessage(error, ERROR_MESSAGES.AUTH.REGISTRATION_FAILED);
    return rejectWithValue(errorMessage);
  }
});

export const login = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    const response = await api.post('/auth/login', credentials);
    
    // Validate response structure
    if (!response?.data?.accessToken) {
      return rejectWithValue(ERROR_MESSAGES.AUTH.LOGIN_FAILED);
    }
    if (!response?.data?.user) {
      return rejectWithValue(ERROR_MESSAGES.AUTH.LOGIN_FAILED);
    }
    
    localStorage.setItem('accessToken', response.data.accessToken);
    return response.data.user;
  } catch (error) {
    // Map specific error messages
    const status = error.response?.status;
    const errorData = error.response?.data;
    const errorMsg = errorData?.message || '';

    // Check for specific error cases
    // Matches: "Wrong credentials", "Invalid credentials", "invalid token", etc.
    if (status === 401 || errorMsg.toLowerCase().includes('wrong') || errorMsg.toLowerCase().includes('invalid')) {
      return rejectWithValue(ERROR_MESSAGES.AUTH.INVALID_CREDENTIALS);
    }

    if (status === 404 || errorMsg.toLowerCase().includes('not found')) {
      return rejectWithValue(ERROR_MESSAGES.AUTH.USER_NOT_FOUND);
    }

    if (status === 429) {
      return rejectWithValue('Too many login attempts. Please try again later.');
    }

    if (status >= 500) {
      return rejectWithValue(ERROR_MESSAGES.NETWORK.SERVER_ERROR);
    }

    // Fallback to extracted error
    const errorMessage = extractErrorMessage(error, ERROR_MESSAGES.AUTH.LOGIN_FAILED);
    return rejectWithValue(errorMessage);
  }
});

export const refreshToken = createAsyncThunk('auth/refreshToken', async (_, { rejectWithValue }) => {
  try {
    const response = await api.post('/auth/refresh');
    
    if (!response?.data?.accessToken) {
      return rejectWithValue('Invalid refresh response: missing access token');
    }
    
    localStorage.setItem('accessToken', response.data.accessToken);
    return response.data.accessToken;
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message || 'Token refresh failed';
    return rejectWithValue(errorMessage);
  }
});

export const logout = createAsyncThunk('auth/logout', async (_, { rejectWithValue }) => {
  try {
    await api.post('/auth/logout');
    
    // Clear all auth data
    localStorage.removeItem('accessToken');
    localStorage.removeItem('loginError');
    localStorage.removeItem('registerError');
    sessionStorage.clear();
    
    return null;
  } catch (error) {
    // Even if logout API call fails, clear the session locally
    // This prevents user from being stuck
    localStorage.removeItem('accessToken');
    localStorage.removeItem('loginError');
    localStorage.removeItem('registerError');
    sessionStorage.clear();

    const status = error.response?.status;
    
    // If token expired, that's fine - just clear locally
    if (status === 401 || status === 403) {
      return null;
    }

    if (status >= 500) {
      // Server error but session is cleared locally - treat as success
      return null;
    }

    // Log error but don't reject - user should be logged out anyway
    const errorMessage = extractErrorMessage(error);
    console.warn('Logout error:', errorMessage);
    
    return null;
  }
});

export const getMe = createAsyncThunk('auth/getMe', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get('/auth/me');
    
    if (!response?.data?.user) {
      return rejectWithValue(ERROR_MESSAGES.AUTH.NO_TOKEN);
    }
    
    return response.data.user;
  } catch (error) {
    const status = error.response?.status;

    if (status === 401 || status === 403) {
      return rejectWithValue(ERROR_MESSAGES.AUTH.UNAUTHORIZED);
    }

    if (status >= 500) {
      return rejectWithValue(ERROR_MESSAGES.NETWORK.SERVER_ERROR);
    }

    const errorMessage = extractErrorMessage(error, ERROR_MESSAGES.AUTH.NO_TOKEN);
    return rejectWithValue(errorMessage);
  }
});

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  accessToken: localStorage.getItem('accessToken') || null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Register
    builder
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Login
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      });

    // Get Me
    builder
      .addCase(getMe.pending, (state) => {
        state.loading = true;
      })
      .addCase(getMe.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(getMe.rejected, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
      });

    // Logout
    builder
      .addCase(logout.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logout.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.accessToken = null;
        state.error = null;
      })
      .addCase(logout.rejected, (state, action) => {
        // Even on error, clear auth state for security
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.accessToken = null;
        state.error = action.payload || null;
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
