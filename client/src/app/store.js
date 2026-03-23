import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/authSlice';
import resumeReducer from '../features/resumeSlice';
import jobReducer from '../features/jobSlice';
import uiReducer from '../features/uiSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    resume: resumeReducer,
    job: jobReducer,
    ui: uiReducer,
  },
});

export default store;
