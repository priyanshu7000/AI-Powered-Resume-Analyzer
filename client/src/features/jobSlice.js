import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';

export const matchJob = createAsyncThunk('job/match', async (data, { rejectWithValue }) => {
  try {
    const response = await api.post('/ai/match', data);
    return response.data.jobMatch;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Job matching failed');
  }
});

export const getJobMatches = createAsyncThunk('job/getAll', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get('/ai/matches');
    return response.data.matches;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch matches');
  }
});

export const getJobMatch = createAsyncThunk('job/getOne', async (jobMatchId, { rejectWithValue }) => {
  try {
    const response = await api.get(`/ai/matches/${jobMatchId}`);
    return response.data.match;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch match');
  }
});

export const deleteJobMatch = createAsyncThunk('job/delete', async (jobMatchId, { rejectWithValue }) => {
  try {
    await api.delete(`/ai/matches/${jobMatchId}`);
    return jobMatchId;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Delete failed');
  }
});

const initialState = {
  matches: [],
  currentMatch: null,
  loading: false,
  error: null,
};

const jobSlice = createSlice({
  name: 'job',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Match Job
    builder
      .addCase(matchJob.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(matchJob.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        
        // Update current match and add to array
        if (action.payload) {
          state.currentMatch = action.payload;
          state.matches.unshift(action.payload);
        }
      })
      .addCase(matchJob.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.currentMatch = null;
      });

    // Get All
    builder
      .addCase(getJobMatches.pending, (state) => {
        state.loading = true;
      })
      .addCase(getJobMatches.fulfilled, (state, action) => {
        state.loading = false;
        state.matches = action.payload;
      })
      .addCase(getJobMatches.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Get One
    builder
      .addCase(getJobMatch.pending, (state) => {
        state.loading = true;
      })
      .addCase(getJobMatch.fulfilled, (state, action) => {
        state.loading = false;
        state.currentMatch = action.payload;
      })
      .addCase(getJobMatch.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Delete
    builder
      .addCase(deleteJobMatch.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteJobMatch.fulfilled, (state, action) => {
        state.loading = false;
        state.matches = state.matches.filter((m) => m._id !== action.payload);
      })
      .addCase(deleteJobMatch.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = jobSlice.actions;
export default jobSlice.reducer;
