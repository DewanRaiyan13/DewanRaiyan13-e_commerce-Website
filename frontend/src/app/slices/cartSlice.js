import { createSlice } from '@reduxjs/toolkit';
import toast from 'react-hot-toast';

const loadCart = () => {
  try {
    const saved = localStorage.getItem('doneshop_cart');
    return saved ? JSON.parse(saved) : [];
  } catch { return []; }
};

const saveCart = (items) => {
  localStorage.setItem('doneshop_cart', JSON.stringify(items));
};

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: loadCart(),
    isOpen: false,
  },
  reducers: {
    addToCart: (state, action) => {
      const { product, quantity = 1, variant } = action.payload;
      const key = `${product._id}-${variant?.size || ''}-${variant?.color || ''}`;
      const existing = state.items.find((i) => i.key === key);

      if (existing) {
        existing.quantity += quantity;
        toast.success('Cart updated!');
      } else {
        state.items.push({
          key,
          product: {
            _id: product._id,
            name: product.name,
            slug: product.slug,
            price: product.price,
            images: product.images,
            stock: product.stock,
          },
          quantity,
          variant: variant || null,
        });
        toast.success(`${product.name} added to cart! 🛒`);
      }
      saveCart(state.items);
      state.isOpen = true;
    },

    removeFromCart: (state, action) => {
      state.items = state.items.filter((i) => i.key !== action.payload);
      saveCart(state.items);
    },

    updateQuantity: (state, action) => {
      const { key, quantity } = action.payload;
      const item = state.items.find((i) => i.key === key);
      if (item) {
        if (quantity <= 0) {
          state.items = state.items.filter((i) => i.key !== key);
        } else {
          item.quantity = Math.min(quantity, item.product.stock);
        }
      }
      saveCart(state.items);
    },

    clearCart: (state) => {
      state.items = [];
      localStorage.removeItem('doneshop_cart');
    },

    toggleCart: (state) => { state.isOpen = !state.isOpen; },
    openCart: (state) => { state.isOpen = true; },
    closeCart: (state) => { state.isOpen = false; },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart, toggleCart, openCart, closeCart } = cartSlice.actions;

// Selectors
export const selectCartItems = (state) => state.cart.items;
export const selectCartCount = (state) => state.cart.items.reduce((acc, i) => acc + i.quantity, 0);
export const selectCartTotal = (state) =>
  state.cart.items.reduce((acc, i) => acc + i.product.price * i.quantity, 0);
export const selectCartOpen = (state) => state.cart.isOpen;

export default cartSlice.reducer;
