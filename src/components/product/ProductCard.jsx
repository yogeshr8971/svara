import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, Sparkles, ShoppingBag, Wand2 } from 'lucide-react';
import { formatPrice } from '../../utils/formatPrice';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import * as playgroundService from '../../services/playgroundService';
import toast from 'react-hot-toast';

export default function ProductCard({ product }) {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const isFavorited = isInWishlist(product._id);
  const imageUrl = product.images?.[0]?.url || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800';

  const handleTryOn = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      toast('Please sign in to try this outfit', { icon: '✨' });
      navigate('/login');
      return;
    }
    navigate(`/playground?productId=${product._id}`);
  };

  const handleAddToPlayground = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      toast('Please sign in to add to your playground', { icon: '🪄' });
      navigate('/login');
      return;
    }
    try {
      await playgroundService.addProduct(product._id);
      toast.success('Added to your Try-On Playground!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add to playground');
    }
  };

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const defaultSize = product.sizes?.[0] || 'M';
    const defaultColor = product.colors?.[0]?.name || 'Standard';
    addToCart(product._id, defaultSize, defaultColor, 1);
  };

  return (
    <div className="product-card group flex flex-col justify-between">
      <Link to={`/product/${product.slug || product._id}`} className="block relative overflow-hidden bg-ivory-200 aspect-[3/4]">
        {/* Main Product Image */}
        <img
          src={imageUrl}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.compareAtPrice && product.compareAtPrice > product.price && (
            <span className="bg-burgundy-500/90 text-white text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full backdrop-blur-xs">
              Sale
            </span>
          )}
          {product.trending && (
            <span className="bg-champagne-300 text-charcoal-700 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full backdrop-blur-xs">
              Trending
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist(product._id);
          }}
          className="absolute top-3 right-3 p-2 rounded-full glass bg-white/70 hover:bg-white text-charcoal-600 transition-colors shadow-sm z-10"
          aria-label="Wishlist"
        >
          <Heart
            size={16}
            className={`transition-colors ${isFavorited ? 'fill-rose-500 text-rose-500' : 'text-charcoal-500 hover:text-rose-500'}`}
          />
        </button>

        {/* Floating Actions on Hover */}
        <div className="absolute inset-x-3 bottom-3 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
          <button
            onClick={handleTryOn}
            className="flex-1 glass-strong py-2 px-2.5 rounded-xl text-xs font-semibold text-charcoal-700 hover:bg-champagne-100 transition-all flex items-center justify-center gap-1 shadow-sm"
          >
            <Sparkles size={13} className="text-champagne-500 fill-champagne-400" />
            <span>Try On</span>
          </button>
          <button
            onClick={handleAddToPlayground}
            className="p-2 rounded-xl glass-strong text-charcoal-600 hover:bg-white transition-colors"
            title="Add to Playground"
          >
            <Wand2 size={14} />
          </button>
          <button
            onClick={handleQuickAdd}
            className="p-2 rounded-xl bg-charcoal-600 text-white hover:bg-charcoal-700 transition-colors"
            title="Quick Add to Cart"
          >
            <ShoppingBag size={14} />
          </button>
        </div>
      </Link>

      {/* Details */}
      <div className="p-4 flex flex-col gap-1">
        <Link to={`/product/${product.slug || product._id}`}>
          <h3 className="font-display text-sm font-medium text-charcoal-700 truncate hover:text-champagne-500 transition-colors">
            {product.name}
          </h3>
        </Link>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="font-semibold text-charcoal-700 text-sm">{formatPrice(product.price)}</span>
          {product.compareAtPrice && product.compareAtPrice > product.price && (
            <span className="text-xs text-charcoal-300 line-through">
              {formatPrice(product.compareAtPrice)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
