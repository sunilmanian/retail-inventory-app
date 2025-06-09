import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../app/axios';

export const fetchProducts = createAsyncThunk('products/fetch', async () => {
  const res = await api.get('/products');
  return res.data;
});

export const createProduct = createAsyncThunk(
  'products/create',
  async (product: { name: string; quantity: number; price: number }) => {
    const res = await api.post('/products', product);
    return res.data;
  }
);

export const updateProduct = createAsyncThunk(
  'products/update',
  async (product: { id: number; name: string; quantity: number; price: number }) => {
    const res = await api.put(`/products/${product.id}`, product);
    return res.data;
  }
);

export const deleteProduct = createAsyncThunk(
  'products/delete',
  async (id: number) => {
    await api.delete(`/products/${id}`);
    return id;
  }
);

interface Product {
  id: number;
  name: string;
  quantity: number;
  price: number;
}

interface ProductState {
  products: Product[];
  loading: boolean;
}

const initialState: ProductState = {
  products: [],
  loading: false,
};

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.products.push(action.payload);
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.products = state.products.map((p) =>
        p.id === action.payload.id ? action.payload : p
        );
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.products = state.products.filter((p) => p.id !== action.payload);
      });


  },
});

export default productSlice.reducer;
