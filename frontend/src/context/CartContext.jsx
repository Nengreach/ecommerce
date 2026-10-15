import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../api/client';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cart, setCart] = useState({
    cart_id: null,
    items: [],
    total_items: 0,
    subtotal: 0,
    tax: 0,
    shipping: 0,
    total: 0,
  });
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  const fetchCart = useCallback(async () => {
    try {
      setLoading(true);
      const data = await api.cart.get();
      setCart(data);
    } catch (err) {
      console.error('Failed to load cart:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = async (productId, quantity = 1, productName = '') => {
    try {
      const data = await api.cart.addItem(productId, quantity);
      setCart(data);
      showToast(productName ? `Added "${productName}" to your bag!` : 'Item added to bag!');
      return data;
    } catch (err) {
      showToast(err.message || 'Failed to add item', 'error');
      throw err;
    }
  };

  const updateQuantity = async (itemId, quantity) => {
    try {
      const data = await api.cart.updateQuantity(itemId, quantity);
      setCart(data);
      return data;
    } catch (err) {
      showToast(err.message || 'Failed to update quantity', 'error');
      throw err;
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      const data = await api.cart.removeItem(itemId);
      setCart(data);
      showToast('Item removed from cart');
      return data;
    } catch (err) {
      showToast(err.message || 'Failed to remove item', 'error');
      throw err;
    }
  };

  const clearCart = async () => {
    try {
      const data = await api.cart.clear();
      setCart(data);
    } catch (err) {
      console.error('Failed to clear cart:', err);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        items: cart.items || [],
        totalItems: cart.total_items || 0,
        subtotal: cart.subtotal || 0,
        tax: cart.tax || 0,
        shipping: cart.shipping || 0,
        total: cart.total || 0,
        loading,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        refreshCart: fetchCart,
        toast,
        showToast,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
