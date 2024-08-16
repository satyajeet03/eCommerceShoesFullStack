// src/redux/store.ts
import { configureStore } from '@reduxjs/toolkit';
import shoesReducer from './slices/shoesSlice';
import cartReducer from './slices/cartSlice';
import authReducer from './slices/authSlices';
export const store = configureStore({
  reducer: {
    shoes: shoesReducer,
    cart: cartReducer,
    auth: authReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
