import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import storage from '../../utils/storage';

export interface ICartItem {
  id: string;
  title: string;
  image: string;
  price: number;
  quantity: number;
}

interface ICartState {
  cartItems: ICartItem[];
  totalQuantity: number;
  changed?: boolean;
  totalAmount: number;
}

const saveCarttoLS = (
  cartItems: ICartItem[],
  totalAmount: number,
  totalQuantity: number
) => {
  storage.setItem('cartItems', cartItems);
  storage.setItem('totalAmount', totalAmount);
  storage.setItem('totalQuantity', totalQuantity);
};

const initialState: ICartState = {
  cartItems: storage.getItem('cartItems') || [],
  totalQuantity: (storage.getItem('totalQuantity') as number) || 0,
  totalAmount: (storage.getItem('totalAmount') as number) || 0,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    replaceCart(state) {
      state.cartItems = [];
      state.totalAmount = 0;
      state.totalQuantity = 0;
      storage.removeItem('cartItems');
      storage.removeItem('totalAmount');
      storage.removeItem('totalQuantity');
    },
    addItemToCart(state, action: PayloadAction<ICartItem>) {
      const newItem = action.payload;
      const existingItem = state.cartItems.find(
        (item) => item.id === newItem.id
      );
      state.totalQuantity += newItem.quantity;
      // state.changed = true;
      if (!existingItem) {
        state.cartItems.push({
          id: newItem.id,
          price: newItem.price,
          quantity: newItem.quantity,
          title: newItem.title,
          image: newItem.image,
        });
      } else {
        existingItem.quantity = existingItem.quantity + newItem.quantity;
      }
      state.totalAmount = +state.cartItems
        .reduce(
          (total, item) => total + Number(item.price) * Number(item.quantity),
          0
        )
        .toFixed(2);
      saveCarttoLS(
        state.cartItems.map((item) => item),
        state.totalAmount,
        state.totalQuantity
      );
    },
    removeItemFromCart(state, action: PayloadAction<string>) {
      const id = action.payload;
      const existingItem = state.cartItems.find((item) => item.id === id);
      state.totalQuantity = state.totalQuantity - 1;
      // state.changed = true;
      if (existingItem?.quantity === 1) {
        state.cartItems = state.cartItems.filter((item) => item.id !== id);
      } else if (existingItem) {
        existingItem.quantity--;
      }
      state.totalAmount = +state.cartItems
        .reduce(
          (total, item) => total + Number(item.price) * Number(item.quantity),
          0
        )
        .toFixed(2);
      saveCarttoLS(
        state.cartItems.map((item) => item),
        state.totalAmount,
        state.totalQuantity
      );
    },
  },
});

export const { replaceCart, addItemToCart, removeItemFromCart } =
  cartSlice.actions;
export default cartSlice.reducer;
