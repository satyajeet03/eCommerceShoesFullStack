import { createSlice,createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'; 
import axios from 'axios';
import {  addToCartApi, updateQuantity } from '../../services/authServices';

export interface CartItem {
  _id: string;
  name: string;
  price: number;
  quantity: number;
}

interface CartState {
  products: CartItem[];
  loading: boolean;
  error: string | null;

}
const initialState: CartState = {
    products: [],
    loading: false,
    error: null,
  };
  
  interface ProductToAdd {
    productId: string;
    quantity: number;
  }
  
  // Define the payload type expected by the API
  interface AddToCartPayload {
    items: ProductToAdd[];
  }
// Thunk to fetch cart data
// export const fetchCart = createAsyncThunk('cart/fetchCart', async (token: string, _, thunkAPI) => {
//     try {
//       const response = await fetchUserCart();
//       return response.products;
//     } catch (error:any) {
//       return thunkAPI.rejectWithValue(error.response?.data || 'Failed to fetch cart');
//     }
//   });
export const fetchCart = createAsyncThunk(
    'cart/fetchCart',
    async (token: string, { rejectWithValue }) => {
      try {
        const response = await axios.get('/api/cart', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(response)
        const filteredData = response.data
        .filter((item: any) => item.productId !== null)
        .map((item: any) => ({
          _id: item.productId._id,
          name: item.productId.name,
          price: item.productId.price,
          quantity: item.quantity,
          imageUrl: item.productId.imageUrl,
        }));

      return filteredData;
      } catch (error:any) {
        return rejectWithValue(error.response.data);
      }
    }
  );

  // Thunk to add items to the cart

  // export const addToCartData = createAsyncThunk(
  //   'cart/addToCartData',
  //   async (products: ProductToAdd[], { rejectWithValue }) => {
  //     try {
  //       const payload: AddToCartPayload = {
  //         items: products,
  //       };
  //        await addToCartApi(payload);
  //       const token = localStorage.getItem('token'); // Adjust based on where you store your token
  //       if (token) {
  //         const updatedCart = await fetchCart(token);
  //         return updatedCart;
  //       } else {
  //         throw new Error('Token not found');
  //       }
  //     } catch (error: any) {
  //       return rejectWithValue(error.message);
  //     }
  //   }
  // );
  export const addToCartData = createAsyncThunk(
    'cart/addToCartData',
    async (products: ProductToAdd[], { rejectWithValue, dispatch }) => {
      try {
        const payload: AddToCartPayload = {
          items: products,
        };
        await addToCartApi(payload);
  
        // Fetch updated cart data after adding items
        const token = localStorage.getItem('token'); // Adjust based on where you store your token
        if (token) {
          // Fetch cart data and return
          const updatedCart = await dispatch(fetchCart(token)).unwrap();
          return updatedCart;
        } else {
          throw new Error('Token not found');
        }
      } catch (error: any) {
        return rejectWithValue(error.message);
      }
    }
  );
  
  // export const updateQuantityData = createAsyncThunk(
  //   'cart/updateQuantityData',
  //   async (payload: { productId: string; quantity: number}, { rejectWithValue }) => {
  //     try {
  //       const data = await updateQuantity(payload.productId, payload.quantity);
  //       return data;
  //     } catch (error: any) {
  //       return rejectWithValue(error.message);
  //     }
  //   }
  // );

  export const updateQuantityData = createAsyncThunk(
    'cart/updateQuantityData',
    async (payload: { productId: string; quantity: number }, { rejectWithValue, dispatch }) => {
      try {
        // Optimistically update the state
        dispatch(updateQuantityInState(payload));
  
        // Call the API
        await updateQuantity(payload.productId, payload.quantity);
  
        // Fetch the updated cart
        const token = localStorage.getItem('token');
        if (token) {
          const updatedCart = await dispatch(fetchCart(token)).unwrap();
          return updatedCart;
        } else {
          throw new Error('Token not found');
        }
      } catch (error: any) {
        // Revert the state if the API call fails
        dispatch(revertQuantityUpdate(payload));
        return rejectWithValue(error.message);
      }
    }
  );
  
  
  const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
      removeFromCart(state, action: PayloadAction<string>) {
        const productId = action.payload;
        state.products = state.products.filter(product => product._id !== productId);
      },
      clearCart(state) {
        state.products = [];
      },
      updateQuantityInState(state, action: PayloadAction<{ productId: string; quantity: number }>) {
        const item = state.products.find(product => product._id === action.payload.productId);
        if (item) {
          item.quantity += action.payload.quantity;
          if (item.quantity <= 0) {
            state.products = state.products.filter(product => product._id !== action.payload.productId);
          }
        }
      },
      revertQuantityUpdate(state, action: PayloadAction<{ productId: string; quantity: number }>) {
        const item = state.products.find(product => product._id === action.payload.productId);
        if (item) {
          item.quantity -= action.payload.quantity; // Revert to previous quantity
          if (item.quantity <= 0) {
            state.products = state.products.filter(product => product._id !== action.payload.productId);
          }
        }
      },
    },
    extraReducers: (builder) => {
      builder
        .addCase(fetchCart.pending, (state) => {
          state.loading = true;
        })
        .addCase(fetchCart.fulfilled, (state, action) => {
          state.products = action.payload;
          state.loading = false;
        })
        .addCase(fetchCart.rejected, (state, action) => {
          state.error = action.payload as string;
          state.loading = false;
        })
        .addCase(addToCartData.pending, (state) => {
          state.loading = true;
        })
        .addCase(addToCartData.fulfilled, (state, action) => {
          state.products = action.payload; // Updated cart after adding items
          state.loading = false;
        })
        .addCase(addToCartData.rejected, (state, action) => {
          state.error = action.payload as string;
          state.loading = false;
        })
        .addCase(updateQuantityData.pending, (state) => {
          state.loading = true;
        })
        .addCase(updateQuantityData.fulfilled, (state, action) => {
          state.products = action.payload; // Updated cart after updating quantity
          state.loading = false;
        })
        .addCase(updateQuantityData.rejected, (state, action) => {
          state.error = action.payload as string;
          state.loading = false;
        });
    },
  });
  
  export const { removeFromCart, clearCart ,updateQuantityInState, revertQuantityUpdate } = cartSlice.actions;
  export default cartSlice.reducer;
  
 
