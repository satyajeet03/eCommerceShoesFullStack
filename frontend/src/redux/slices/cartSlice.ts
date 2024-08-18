import { createSlice,createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'; 
import axios from 'axios';

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
const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    
    addToCart(state, action: PayloadAction<CartItem>) {
        if (!Array.isArray(state.products)) {
            state.products = []; // Initialize as an empty array if undefined
          }
          
      const product = action.payload;
      const existingProduct = state.products.find(p => p._id === product._id);

      if (existingProduct) {
         // Update quantity if product already exists in the cart
         existingProduct.quantity += product.quantity;
      } else 
      {
        state.products.push(product);
        // state.products.push({ ...product, quantity: 1 });
      }
    },
    removeFromCart(state, action: PayloadAction<string>) {
      const productId = action.payload;
      state.products = state.products.filter(product => product._id !== productId);
    },
    updateQuantity(state, action: PayloadAction<{ _id: string; quantity: number }>) {
        const item = state.products.find(item => item._id === action.payload._id);
        if (item) {
          item.quantity += action.payload.quantity;
          if (item.quantity <= 0) {
            state.products = state.products.filter(i => i._id !== action.payload._id);
          }
        }
      },   
    clearCart(state) {
      state.products = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        console.log('Action Payload:', action.payload); 
        state.products = action.payload;
        state.loading = false;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        console.log('Fetch Cart Rejected:', action.payload);
        state.error = action.payload as string;
        state.loading = false;
      });
  },
});

export const { addToCart, removeFromCart,updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
