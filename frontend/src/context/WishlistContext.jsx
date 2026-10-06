import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import * as wishlistService from '../services/wishlistService';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  const { user } = useAuth();
  const [wishlistItems, setWishlistItems] = useState([]);

  const fetchWishlist = useCallback(async () => {
    if (!user) { setWishlistItems([]); return; }
    try {
      const data = await wishlistService.getWishlist();
      setWishlistItems(data.wishlist?.products || []);
    } catch {}
  }, [user]);

  useEffect(() => { fetchWishlist(); }, [fetchWishlist]);

  const toggleWishlist = async (productId) => {
    try {
      const data = await wishlistService.toggle(productId);
      setWishlistItems(data.wishlist?.products || []);
      toast.success(data.action === 'added' ? 'Added to wishlist ♡' : 'Removed from wishlist');
    } catch (e) { toast.error(e.response?.data?.message || 'Failed to update wishlist'); }
  };

  const isInWishlist = (productId) =>
    wishlistItems.some((p) => (p._id || p) === productId || p._id?.toString() === productId);

  return (
    <WishlistContext.Provider value={{ wishlistItems, wishlistCount: wishlistItems.length, toggleWishlist, isInWishlist, refreshWishlist: fetchWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
}

export const useWishlist = () => useContext(WishlistContext);
