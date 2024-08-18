// src/redux/thunks/authThunks.ts
import { createAsyncThunk } from '@reduxjs/toolkit';
import { AppDispatch, RootState } from '../store';
import { userLogin, setToken, loadUserFromToken } from '../slices/authSlices';

export const loginAndLoadUser = createAsyncThunk<void, { email: string; password: string }, { dispatch: AppDispatch; state: RootState }>(
  'auth/loginAndLoadUser',
  async ({ email, password }, { dispatch, getState }) => {
    // Dispatch the user login action and get the token
    const userToken = await dispatch(userLogin({ email, password }));
    
    if (userToken.payload) {
      // Set token in the store
      await dispatch(setToken(userToken.payload));
      
      // Access the token from the store
      const token = getState().auth.token;
      
      // If the token is available, load the user from the token
      if (token) {
        await dispatch(loadUserFromToken());
      }
    }
  }
);
