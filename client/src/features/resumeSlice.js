import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';

export const uploadResume = createAsyncThunk('resume/upload', async (file, { rejectWithValue }) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/resume/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.resume;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Upload failed');
  }
});

export const analyzeResume = createAsyncThunk('resume/analyze', async (resumeId, { rejectWithValue }) => {
  const maxRetries = 3;
  let lastError = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`[Analysis] Attempt ${attempt}/${maxRetries} for resume ${resumeId}`);
      
      // Use extended timeout for analysis (up to 120 seconds)
      // Analysis can take 15-30+ seconds with AI APIs
      const response = await api.post(`/resume/analyze/${resumeId}`, {}, {
        timeout: 120000, // 120 seconds - AI analysis needs this much time
      });
      
      console.log('[Analysis] ✓ Success on attempt', attempt);
      return response.data.resume;
    } catch (error) {
      lastError = error;
      const isTimeoutError = error.code === 'ECONNABORTED' || error.message.includes('timeout');
      const isNetworkError = !error.response; // No response from server
      const isServerError = error.response?.status >= 500;
      const isClientError = error.response?.status >= 400 && error.response?.status < 500;

      console.error(`[Analysis] Attempt ${attempt} failed:`, {
        isTimeout: isTimeoutError,
        isNetwork: isNetworkError,
        status: error.response?.status,
        message: error.message,
      });

      // Don't retry on client errors (400-499) like 404, 401
      if (isClientError) {
        console.log('[Analysis] ✗ Client error - not retrying');
        const errorMsg = error.response?.data?.message || error.message;
        return rejectWithValue(`Analysis failed: ${errorMsg}`);
      }

      // For timeout/network/server errors, retry if we have attempts left
      if (attempt < maxRetries) {
        const waitTime = Math.pow(2, attempt - 1) * 2000; // Exponential backoff: 2s, 4s, 8s
        console.log(`[Analysis] Retrying in ${waitTime}ms...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
        continue;
      }
    }
  }

  // All retries exhausted
  const errorMessage = lastError?.response?.data?.message || 
                       lastError?.message || 
                       'Analysis failed after multiple attempts';
  
  console.error('[Analysis] ✗ All retries failed:', errorMessage);
  return rejectWithValue(errorMessage);
});

export const getResumes = createAsyncThunk('resume/getAll', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get('/resume');
    return response.data.resumes;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch resumes');
  }
});

export const getResume = createAsyncThunk('resume/getOne', async (resumeId, { rejectWithValue }) => {
  try {
    const response = await api.get(`/resume/${resumeId}`);
    return response.data.resume;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch resume');
  }
});

export const deleteResume = createAsyncThunk('resume/delete', async (resumeId, { rejectWithValue }) => {
  try {
    await api.delete(`/resume/${resumeId}`);
    return resumeId;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Delete failed');
  }
});

const initialState = {
  resumes: [],
  currentResume: null,
  loading: false,
  error: null,
};

const resumeSlice = createSlice({
  name: 'resume',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Upload
    builder
      .addCase(uploadResume.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadResume.fulfilled, (state, action) => {
        state.loading = false;
        state.resumes.unshift(action.payload);
      })
      .addCase(uploadResume.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Analyze
    builder
      .addCase(analyzeResume.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(analyzeResume.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        if (action.payload) {
          state.currentResume = action.payload;
          const index = state.resumes.findIndex((r) => r._id === action.payload._id);
          if (index !== -1) {
            state.resumes[index] = action.payload;
          } else {
            state.resumes.unshift(action.payload);
          }
        }
      })
      .addCase(analyzeResume.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.currentResume = null;
      });

    // Get All
    builder
      .addCase(getResumes.pending, (state) => {
        state.loading = true;
      })
      .addCase(getResumes.fulfilled, (state, action) => {
        state.loading = false;
        state.resumes = action.payload;
      })
      .addCase(getResumes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Get One
    builder
      .addCase(getResume.pending, (state) => {
        state.loading = true;
      })
      .addCase(getResume.fulfilled, (state, action) => {
        state.loading = false;
        state.currentResume = action.payload;
      })
      .addCase(getResume.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Delete
    builder
      .addCase(deleteResume.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteResume.fulfilled, (state, action) => {
        state.loading = false;
        state.resumes = state.resumes.filter((r) => r._id !== action.payload);
      })
      .addCase(deleteResume.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = resumeSlice.actions;
export default resumeSlice.reducer;
