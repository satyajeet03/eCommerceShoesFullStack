// src/redux/slices/shoesSlice.ts
import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface Shoe {
  _id: string;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
}

interface ShoesState {
  shoes: Shoe[];
  loading: boolean;
  error: string | null;
}

const initialState: ShoesState = {
  shoes: [],
  loading: false,
  error: null,
};

export const fetchShoes = createAsyncThunk('shoes/fetchShoes', async () => {
  const response = await axios.get('/api/shoes');
  return response.data;
});

const shoesSlice = createSlice({
  name: 'shoes',
  initialState,
  reducers: {
    // Add synchronous actions here if needed
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchShoes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchShoes.fulfilled, (state, action: PayloadAction<Shoe[]>) => {
        state.loading = false;
        state.shoes = action.payload;
      })
      .addCase(fetchShoes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch shoes';
      });
  },
});

export default shoesSlice.reducer;
