import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getProducts } from 'api/products';
import axios, { AxiosError } from 'axios';
import { IProduct } from 'interfaces/ProductInterface';
import { BASE_URL } from 'main';
import toast from 'react-hot-toast';
import { BRANDS, CATEGORIES } from 'utils/constants';

interface ICatalogState {
  products: IProduct[];
  brands: string[];
  categories: string[];
  totalItems: number;
  isLoading: boolean;
  isError: boolean;
}

const initialState: ICatalogState = {
  products: [] as IProduct[],
  brands: [] as string[],
  categories: [] as string[],
  totalItems: 0,
  isLoading: false,
  isError: false,
};

export const getCatalogProducts = createAsyncThunk(
  'catalog/getProducts',
  async ({
    filter,
    sort,
    pagination,
  }: {
    filter: Record<string, string[]>;
    sort: Record<string, string>;
    pagination: Record<string, number>;
  }) => {
    try {
      const response = await getProducts(filter, sort, pagination);
      return response.data;
    } catch (err) {
      const error = err as AxiosError;
      toast.error(error.message || 'Failed to fetch products');
      throw new Error(error.message);
    }
  }
);

export const getProduct = createAsyncThunk(
  'catalog/getProduct',
  async (id: string) => {
    try {
      const product = await axios.get(`${BASE_URL}products/${id}`);
      return product.data;
    } catch (err) {
      const error = err as AxiosError;
      throw new Error(error.message);
    }
  }
);

export const catalogSlice = createSlice({
  name: 'catalog',
  initialState,
  reducers: {
    setShop: (state, { payload }) => ({ ...state, shop: payload }),
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCatalogProducts.fulfilled, (state, action) => {
        state.products = action.payload.products;
        // const brandList = [
        //   ...new Set(
        //     action.payload.products.map((item: IProduct) => item.brand)
        //   ),
        // ].sort() as string[];
        // const categoryList = [
        //   ...new Set(
        //     action.payload.products.map((item: IProduct) => item.category)
        //   ),
        // ].sort() as string[];
        state.brands = BRANDS;
        state.categories = CATEGORIES;
        state.totalItems = action.payload.totalItems;
        state.isLoading = false;
      })
      .addCase(getProduct.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(getCatalogProducts.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(getProduct.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(getCatalogProducts.rejected, (state, action) => {
        state.isError = true;
        state.isLoading = false;
        console.error(action.error.message);
      })
      .addCase(getProduct.rejected, (state, action) => {
        state.isError = true;
        state.isLoading = false;
        console.error(action.error.message);
      });
  },
});

export const { setShop } = catalogSlice.actions;

export default catalogSlice.reducer;
