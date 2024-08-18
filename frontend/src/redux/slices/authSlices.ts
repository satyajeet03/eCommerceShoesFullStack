// src/redux/slices/authSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { loginUser, signupUser, loginAdmin, signupAdmin, fetchUserProfile } from '../../services/authServices'; // Import service functions 
import { useNavigate } from 'react-router-dom';
import { AppDispatch, RootState } from '../store';

interface AuthState {
  isAuthenticated: boolean;
  isAdmin: boolean;
  user: any;
  loading: boolean;
  error: string | null;
  token: string | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  isAdmin: false,
  user: null,
  loading: false,
  error: null,
  token: null,
};

// Async actions
export const userLogin = createAsyncThunk(
  'auth/userLogin',
  
  async (credentials: { email: string, password: string }, { rejectWithValue }) => {
    try {
      const response = await loginUser(credentials.email, credentials.password);
     
      localStorage.setItem('token', response.token);
    
       return response; // Expect { token, user }
    } catch (error:any) {
      return rejectWithValue(error.response?.data || 'Login failed');
    }
  }
);

export const userSignup = createAsyncThunk(
  'auth/userSignup',
  async (credentials: { name: string, email: string, password: string }, { rejectWithValue }) => {
    try {
      const response = await signupUser(credentials.name, credentials.email, credentials.password);
      localStorage.setItem('token', response.token);
      return response; // Expect { token, user }
    } catch (error:any) {
      return rejectWithValue(error.response?.data || 'Signup failed');
    }
  }
);

export const adminLogin = createAsyncThunk(
  'auth/adminLogin',
  async (credentials: { email: string, password: string }, { rejectWithValue }) => {
    try {
      const response = await loginAdmin(credentials.email, credentials.password);
      return response; // Expect { token, user }
    } catch (error:any) {
      return rejectWithValue(error.response?.data || 'Login failed');
    }
  }
);

export const adminSignup = createAsyncThunk(
  'auth/adminSignup',
  async (credentials: { name: string, email: string, password: string }, { rejectWithValue }) => {
    try {
      const response = await signupAdmin(credentials.name, credentials.email, credentials.password);
      return response; // Expect { token, user }
    } catch (error:any) {
      return rejectWithValue(error.response?.data || 'Signup failed');
    }
  }
);

export const loadUserFromToken = createAsyncThunk(
  'auth/loadUserFromToken',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetchUserProfile(token!); 
      console.log('User profile loaded successfully:', response); 
      return response;// Expect user object
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to load user');
    }
  }
);

export const loginAndLoadUser = createAsyncThunk<void, { email: string; password: string }, { dispatch: AppDispatch; state: RootState }>(
  'auth/loginAndLoadUser',
  async ({ email, password }, { dispatch, getState }) => {
    const userToken = await dispatch(userLogin({ email, password }));
    
    if (userToken.payload) {
      await dispatch(setToken(userToken.payload.token));
      
      const token = getState().auth.token;
      
      if (token) {
        await dispatch(loadUserFromToken());
      }
    }
  }
);
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('token');
    },
    setToken(state, action) {
      state.token = action.payload;
      localStorage.setItem('token', action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(userLogin.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.isAdmin = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.loading = false;
      })
      .addCase(userSignup.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.isAdmin = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.loading = false;
      })
     
      .addCase(userLogin.pending, (state) => {
        state.loading = true;
      })
      .addCase(userSignup.pending, (state) => {
        state.loading = true;
      })
     
      .addCase(userLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(userSignup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(loadUserFromToken.pending, (state) => {
        state.loading = true;
      })
      .addCase(loadUserFromToken.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
      })
      .addCase(loadUserFromToken.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.token = null;
        state.error = action.payload as string;
      })
      .addCase(loginAndLoadUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(loginAndLoadUser.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(loginAndLoadUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout, setToken } = authSlice.actions;
export default authSlice.reducer;

 