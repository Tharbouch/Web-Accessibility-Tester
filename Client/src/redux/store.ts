import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import reportReducer from './slices/reportSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    reports: reportReducer,
  },
});

export type stateType = ReturnType<typeof store.getState>;
export default store;
