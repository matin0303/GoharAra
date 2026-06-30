import { isValidCartItem } from '@/lib/utils';
import { CartItem, CartState } from '@/types/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';




const loadCartFromStorage = (): CartItem[] => {
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
    return [];
  }
  
  try {
    const cartData = localStorage.getItem('cart');
    if (!cartData) return [];
    const parsedData = JSON.parse(cartData);
    if (!Array.isArray(parsedData)) return [];
    
    const validItems = parsedData.filter(isValidCartItem);
    
    if (validItems.length !== parsedData.length) {
      localStorage.setItem('cart', JSON.stringify(validItems));
    }
    
    return validItems;
  } catch (error) {
    console.error('Error loading cart from localStorage:', error);
    return [];
  }
};

const saveCartToStorage = (items: CartItem[]): void => {
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
    return;
  }
  
  try {
    const validItems = items.filter(isValidCartItem);
    
    if (validItems.length !== items.length) {
      console.warn('Some invalid items were filtered out before saving to storage');
    }
    
    localStorage.setItem('cart', JSON.stringify(validItems));
  } catch (error) {
    console.error('Error saving cart to localStorage:', error);
  }
};

const initialItems = loadCartFromStorage();

const initialState: CartState = {
  items: initialItems,
  totalItems: initialItems.length,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const existingItemIndex = state.items.findIndex(
        item => item.id === action.payload.id
      );

      if (existingItemIndex !== -1) {
        state.items[existingItemIndex].weight = action.payload.weight;
      } else {
        state.items.push(action.payload);
      }

      state.totalItems = state.items.length;
      
      saveCartToStorage(state.items);
    },

    removeFromCart: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
      
      state.totalItems = state.items.length;
      
      saveCartToStorage(state.items);
    },

    updateItemWeight: (state, action: PayloadAction<{ id: number; weight: number }>) => {
      const item = state.items.find(item => item.id === action.payload.id);
      if (item) {
        item.weight = action.payload.weight;
      }
      
      saveCartToStorage(state.items);
    },

    clearCart: (state) => {
      state.items = [];
      state.totalItems = 0;
      
      localStorage.removeItem('cart');
    },

    loadCart: (state) => {
      const items = loadCartFromStorage();
      state.items = items;
      state.totalItems = items.length;
    },

    setCart: (state, action: PayloadAction<CartItem[]>) => {
      state.items = action.payload;
      state.totalItems = action.payload.length;
      saveCartToStorage(action.payload);
    },
  },
});

export const { 
  addToCart, 
  removeFromCart, 
  updateItemWeight, 
  clearCart, 
  loadCart,
  setCart 
} = cartSlice.actions;

export const selectCartItems = (state: { cart: CartState }) => state.cart.items;
export const selectTotalItems = (state: { cart: CartState }) => state.cart.totalItems;
export const selectCartItemById = (id: number) => 
  (state: { cart: CartState }) => state.cart.items.find(item => item.id === id);

export default cartSlice.reducer;