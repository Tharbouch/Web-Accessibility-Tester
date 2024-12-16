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
      const response = await axiosInstance({url:"/user/loggedIn",method:"GET"})
      if (response.status === 200) {
        return response.data.info; // Return user data
      } else {
        throw new Error('User not logged in');
      }
    } catch (error: any) {
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
