import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axios from '../../api/axiosInstance';

const tokenKey = 'token';

export const login = createAsyncThunk('auth/login', async (credentials, thunkAPI) => {
  try {
    const res = await axios.post('/auth/login', credentials);
    sessionStorage.setItem(tokenKey, res.data.token);
    return res.data.user;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || 'Login failed');
  }
});

export const register = createAsyncThunk('auth/register', async (userData, thunkAPI) => {
  try {
    const res = await axios.post('/auth/register', userData);
    sessionStorage.setItem(tokenKey, res.data.token);
    return res.data.user;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || 'Registration failed');
  }
});

const authSlice = createSlice({
    name: 'auth',
    initialState: {
      user: null,
      loading: false,
      error: null
    },
    reducers: {
      logout: (state) => {
        sessionStorage.removeItem(tokenKey);
        state.user = null;
      }
    },
    extraReducers: (builder) => {
      builder
        .addCase(login.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(login.fulfilled, (state, action) => {
          state.loading = false;
          state.user = action.payload;
        })
        .addCase(login.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        })
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
    }
  });
  
  export const { logout } = authSlice.actions;
  export default authSlice.reducer;