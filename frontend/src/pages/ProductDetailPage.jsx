import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Heart, Sparkles, ShoppingBag, Wand2, ShieldCheck, RefreshCw } from 'lucide-react';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';
import ProductCard from '../components/product/ProductCard';
import { formatPrice } from '../utils/formatPrice';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import * as productService from '../services/productService';
import * as playgroundService from '../services/playgroundService';
import toast from 'react-hot-toast';

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { user } = useAuth();

  const [product, setProduct] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        const res = await productService.getProduct(id);
        setProduct(res.product);
        setRecommendations(res.recommendations || []);
        setSelectedImage(res.product.images?.[0]?.url || '');
        setSelectedSize(res.product.sizes?.[0] || 'M');
        setSelectedColor(res.product.colors?.[0]?.name || 'Standard');
      } catch (err) {
        toast.error('Unable to load product details');
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-md mx-auto text-center py-20">
        <p className="font-display text-xl text-charcoal-700">Product not found</p>
        <Button variant="outline" className="mt-4" onClick={() => navigate('/shop')}>
          Return to Shop
        </Button>
      </div>
    );
  }

  const isFavorited = isInWishlist(product._id);

  const handleTryOn = () => {
    if (!user) {
      toast('Please sign in to try this outfit', { icon: '✨' });
      navigate('/login');
      return;
    }
    navigate(`/playground?productId=${product._id}`);
  };

  const handleAddToPlayground = async () => {
    if (!user) {
      toast('Please sign in to add to playground', { icon: '🪄' });
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16">
      {/* Product View Split */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
        {/* Left Gallery */}
        <div className="space-y-4">
          <div className="aspect-[3/4] rounded-3xl overflow-hidden glass shadow-glass-lg border border-white/60 bg-ivory-200">
            <img
              src={selectedImage}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Thumbnails */}
          {product.images?.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img.url)}
                  className={`w-20 aspect-[3/4] rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                    selectedImage === img.url ? 'border-champagne-400 scale-95' : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img.url} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Info */}
        <div className="space-y-6">
          <div>
            <span className="text-xs uppercase font-bold tracking-widest text-champagne-500">
              {product.category?.name || 'Designer Wear'}
            </span>
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-charcoal-700 mt-1">
              {product.name}
            </h1>
            <div className="flex items-center gap-3 mt-3">
              <span className="font-display text-2xl font-bold text-charcoal-800">
                {formatPrice(product.price)}
              </span>
              {product.compareAtPrice && product.compareAtPrice > product.price && (
                <span className="text-sm text-charcoal-300 line-through">
                  {formatPrice(product.compareAtPrice)}
                </span>
              )}
            </div>
          </div>

          <p className="text-xs sm:text-sm text-charcoal-500 leading-relaxed font-light">
            {product.description || product.shortDescription}
          </p>

          {/* Size Selector */}
          {product.sizes?.length > 0 && (
            <div>
              <label className="text-xs uppercase font-semibold text-charcoal-400 tracking-wider mb-2 block">
                Select Size
              </label>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(s)}
                    className={`w-10 h-10 rounded-xl text-xs font-semibold flex items-center justify-center transition-all ${
                      selectedSize === s
                        ? 'bg-charcoal-600 text-white shadow-sm'
                        : 'glass text-charcoal-600 hover:bg-white/70'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="space-y-3 pt-4 border-t border-ivory-300/40">
            <div className="flex gap-3">
              <Button
                variant="primary"
                size="lg"
                onClick={() => addToCart(product._id, selectedSize, selectedColor, 1)}
                className="flex-1"
              >
                <ShoppingBag size={18} />
                <span>Add to Cart</span>
              </Button>

              <Button
                variant="outline"
                size="lg"
                onClick={() => toggleWishlist(product._id)}
              >
                <Heart
                  size={18}
                  className={isFavorited ? 'fill-rose-500 text-rose-500' : ''}
                />
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button variant="secondary" size="md" onClick={handleTryOn} className="w-full">
                <Sparkles size={16} className="text-champagne-500 fill-champagne-400" />
                <span>AI Try On</span>
              </Button>
              <Button variant="outline" size="md" onClick={handleAddToPlayground} className="w-full">
                <Wand2 size={16} />
                <span>Add to Playground</span>
              </Button>
            </div>
          </div>

          {/* Features / Details Guarantee */}
          <div className="glass rounded-2xl p-4 grid grid-cols-2 gap-4 text-xs text-charcoal-500">
            <div className="flex items-center gap-2">
              <ShieldCheck size={16} className="text-champagne-500" />
              <span>Authentic Luxury Fabric</span>
            </div>
            <div className="flex items-center gap-2">
              <RefreshCw size={16} className="text-champagne-500" />
              <span>7-Day Easy Returns</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <section className="space-y-6 pt-8 border-t border-ivory-300/40">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-2xl font-bold text-charcoal-700">Complete The Look</h2>
            <span className="text-xs uppercase font-semibold text-charcoal-400">Stylist Picks</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {recommendations.map((rec) => (
              <ProductCard key={rec._id} product={rec} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
