// src/hooks/useAuth.ts
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';

export const useAuth = () => {
  const authState = useSelector((state: RootState) => state.auth);
  return {
    isAuthenticated: authState.isAuthenticated,
    token: authState.token, // Assumes token is stored in auth state
   // userId: authState.userId,
  };
};
