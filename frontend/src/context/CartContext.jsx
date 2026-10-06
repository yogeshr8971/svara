import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import * as cartService from '../services/cartService';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const CartContext = createContext();

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchCart = useCallback(async () => {
    if (!user) { setCartItems([]); return; }
    try {
      setLoading(true);
      const data = await cartService.getCart();
      setCartItems(data.cart?.items || []);
    } catch {} finally { setLoading(false); }
  }, [user]);

  useEffect(() => { fetchCart(); }, [fetchCart]);

  const addToCart = async (productId, size, color, quantity = 1) => {
    try {
      const data = await cartService.addToCart({ productId, size, color, quantity });
      setCartItems(data.cart.items);
      toast.success('Added to cart');
    } catch (e) { toast.error(e.response?.data?.message || 'Failed to add to cart'); }
  };

  const updateQuantity = async (itemId, quantity) => {
    try {
      const data = await cartService.updateItem(itemId, quantity);
      setCartItems(data.cart.items);
    } catch (e) { toast.error(e.response?.data?.message || 'Failed to update cart'); }
  };

  const removeFromCart = async (itemId) => {
    try {
      const data = await cartService.removeItem(itemId);
      setCartItems(data.cart.items);
      toast.success('Removed from cart');
    } catch (e) { toast.error('Failed to remove item'); }
  };

  const clearCart = async () => {
    try { await cartService.clearCart(); setCartItems([]); } catch {}
  };

  const cartCount = cartItems.reduce((acc, i) => acc + i.quantity, 0);
  const cartTotal = cartItems.reduce((acc, i) => acc + i.price * i.quantity, 0);

  return (
    <CartContext.Provider value={{ cartItems, cartCount, cartTotal, loading, addToCart, updateQuantity, removeFromCart, clearCart, refreshCart: fetchCart }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
