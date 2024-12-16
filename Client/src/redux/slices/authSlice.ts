import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/axiosInstance';

interface User {
  username: string;
  fullname: string;
  userID: string;
}

interface AuthState {
  user: User | null;
  loggedIn: boolean;
  loading: boolean;
}

const initialState: AuthState = {
  user: null,
  loggedIn: false,
  loading: true,
};

// Async thunk for checking login status
export const checkLoggedIn = createAsyncThunk(
  'auth/checkLoggedIn',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance({url:'/user/loggedIn',method:'GET'})
      if (response.status === 200) {
        return response.data.info;
      } else {
        throw new Error('User not logged in');
      }
    } catch (error:any) {
      // If error indicates token expired, try refresh
      if (error.response?.status === 401 && error.response?.data?.error === 'Access token expired') {
        try {
          // Attempt to refresh
          await axiosInstance({url:'/user/refresh',method:'GET'});
          // After successful refresh, try checkLoggedIn again
          const retryResponse = await axiosInstance({url:'/user/loggedIn',method:'GET'});
          if (retryResponse.status === 200) {
            return retryResponse.data.info;
          } else {
            return rejectWithValue('User not logged in');
          }
        } catch (refreshError) {
          return rejectWithValue('Refresh token invalid, please log in again');
        }
      }

      return rejectWithValue(error.response?.data || 'Error checking login status');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login(state, action: PayloadAction<User>) {
      state.user = action.payload;
      state.loggedIn = true;
      state.loading = false;
    },
    logout(state) {
      state.user = null;
      state.loggedIn = false;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkLoggedIn.pending, (state) => {
        state.loading = true;
      })
      .addCase(checkLoggedIn.fulfilled, (state, action: PayloadAction<User>) => {
        state.user = action.payload;
        state.loggedIn = true;
        state.loading = false;
      })
      .addCase(checkLoggedIn.rejected, (state) => {
        state.user = null;
        state.loggedIn = false;
        state.loading = false;
      });
  },
});

export const { login, logout } = authSlice.actions;
export const selectAuthState = (state: { auth: AuthState }) => state.auth;
export default authSlice.reducer;
