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
  try {
    const response = await api.post(`/resume/analyze/${resumeId}`);
    return response.data.resume;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Analysis failed');
  }
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
