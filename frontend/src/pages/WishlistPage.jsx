import React from 'react';
import { Heart, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import ProductGrid from '../components/product/ProductGrid';
import Button from '../components/ui/Button';
import { useWishlist } from '../context/WishlistContext';

export default function WishlistPage() {
  const { wishlistItems } = useWishlist();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <span className="text-xs font-bold uppercase tracking-widest text-champagne-500">Curations</span>
        <h1 className="section-heading text-3xl font-bold">Your Wishlist</h1>
        <p className="text-xs text-charcoal-400 mt-1">{wishlistItems.length} saved styles</p>
      </div>

      {wishlistItems.length === 0 ? (
        <div className="glass rounded-3xl p-16 text-center max-w-md mx-auto space-y-4">
          <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mx-auto">
            <Heart size={28} />
          </div>
          <h3 className="font-display text-xl font-bold text-charcoal-700">Your wishlist is empty</h3>
          <p className="text-xs text-charcoal-400 leading-relaxed">
            Click the heart icon on any outfit while browsing to save it for later or try it on virtually.
          </p>
          <Link to="/shop">
            <Button variant="primary" size="md">
              <span>Explore Collection</span>
              <ArrowRight size={16} />
            </Button>
          </Link>
        </div>
      ) : (
        <ProductGrid products={wishlistItems} />
      )}
    </div>
  );
}
