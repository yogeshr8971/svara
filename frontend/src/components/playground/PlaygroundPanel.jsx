import React, { useState } from 'react';
import { Sparkles, ArrowRight, AlertCircle, ShoppingBag, Heart, X, Download, RotateCcw, Check, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../ui/Button';
import { formatPrice } from '../../utils/formatPrice';
import { AI_DISCLAIMER, VTO_CREDIT_COST } from '../../utils/constants';
import { useCredits } from '../../context/CreditContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import * as vtoService from '../../services/vtoService';
import toast from 'react-hot-toast';

export default function PlaygroundPanel({
  avatar,
  selectedProducts = [],
  onNeedAvatar,
  onNeedCredits,
  onRemoveProduct,
  onSavedToWardrobe,
}) {
  const { credits, refreshCredits } = useCredits();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const [generating, setGenerating] = useState(false);
  const [generationResult, setGenerationResult] = useState(null);
  const [statusText, setStatusText] = useState('');

  const totalCost = selectedProducts.length * VTO_CREDIT_COST;
  const resultImageUrl = generationResult?.resultImageUrl;
  const hasGeneratedImage = Boolean(resultImageUrl);

  const handleGenerate = async () => {
    if (!avatar) {
      onNeedAvatar?.();
      return;
    }
    if (selectedProducts.length === 0) {
      toast.error('Please select at least one product from your staging rack to try on.');
      return;
    }
    if (credits < totalCost) {
      onNeedCredits?.();
      return;
    }

    const toastId = toast.loading(`Styling ${selectedProducts.length} piece(s) onto your silhouette...`);
    try {
      setGenerating(true);
      setGenerationResult(null);
      setStatusText('Reserving AI credits...');
      await new Promise((r) => setTimeout(r, 300));
      setStatusText(`Tailoring ${selectedProducts.length} outfit(s) to your body...`);

      const productIds = selectedProducts.map((p) => p._id);
      const response = await vtoService.generateTryOn(productIds);

      const gen = response.generation;
      setGenerationResult(gen);
      await refreshCredits();

      if (gen?.resultImageUrl) {
        toast.success('Your virtual try-on look is ready and saved to your wardrobe!', { id: toastId });
      } else {
        toast.success(response.message || 'Style analysis complete!', { id: toastId });
      }

      onSavedToWardrobe?.(response.wardrobeId);
    } catch (err) {
      const message = !err.response
        ? 'Could not reach the virtual try-on service. Please check your connection and backend.'
        : err.response.status >= 500
          ? 'Virtual try-on encountered an issue. Any unused credits were refunded.'
          : err.response.data?.message || 'Failed to complete try-on. Please try again.';
      toast.error(message, { id: toastId });
    } finally {
      setGenerating(false);
      setStatusText('');
    }
  };

  const handleDownload = async () => {
    if (!resultImageUrl) return;
    try {
      const res = await fetch(resultImageUrl);
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `svara-tryon-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success('Image downloaded successfully!');
    } catch {
      window.open(resultImageUrl, '_blank');
    }
  };

  return (
    <div className="glass rounded-3xl p-6 md:p-8 space-y-8">
      {/* Studio Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-ivory-300/40 pb-5">
        <div>
          <h2 className="font-display text-2xl font-bold text-charcoal-700">Virtual Try-On Studio</h2>
          <p className="text-xs text-charcoal-400 mt-1">
            Select one or multiple designer garments to drape onto your silhouette simultaneously
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-charcoal-400">Available Credits:</span>
          <span className="px-3 py-1 bg-champagne-200 text-charcoal-700 font-bold text-xs rounded-full border border-champagne-300">
            {credits}
          </span>
        </div>
      </div>

      {/* Selected Products Strip */}
      {selectedProducts.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-semibold text-charcoal-500 tracking-wider">
              Selected Garments ({selectedProducts.length})
            </span>
            <span className="text-[11px] text-charcoal-400">
              {totalCost} Credit{totalCost !== 1 ? 's' : ''} total
            </span>
          </div>

          <div className="flex gap-3 overflow-x-auto pb-2">
            {selectedProducts.map((p) => (
              <div
                key={p._id}
                className="relative w-24 aspect-[3/4] rounded-2xl overflow-hidden border-2 border-champagne-300 shrink-0 group bg-ivory-100 shadow-sm"
              >
                <img
                  src={p.tryOnImage?.url || p.images?.[0]?.url}
                  alt={p.name}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => onRemoveProduct?.(p._id)}
                  className="absolute top-1.5 right-1.5 p-1 rounded-full bg-charcoal-800/80 text-white hover:bg-rose-600 transition-colors shadow-sm"
                  title={`Remove ${p.name} from try-on selection`}
                >
                  <X size={12} />
                </button>
                <div className="absolute inset-x-0 bottom-0 bg-charcoal-900/70 backdrop-blur-sm p-1">
                  <p className="text-[10px] text-white truncate text-center font-medium">{p.name}</p>
                  <p className="text-[9px] text-champagne-300 text-center font-bold">{formatPrice(p.price)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Split: Silhouette vs Result/Preview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        {/* Silhouette Slot */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-semibold text-charcoal-500 tracking-wider">
              Your Silhouette
            </span>
          </div>

          <div className="relative aspect-[3/4] rounded-3xl bg-white/40 border border-white/60 overflow-hidden flex items-center justify-center shadow-glass-sm">
            {avatar?.imageUrl ? (
              <img
                src={avatar.imageUrl}
                alt="Active Silhouette"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="p-6 text-center space-y-3">
                <div className="w-16 h-16 rounded-full bg-champagne-100 text-champagne-500 flex items-center justify-center mx-auto">
                  <Sparkles size={28} />
                </div>
                <p className="font-display text-sm text-charcoal-600 font-semibold">No Active Silhouette</p>
                <p className="text-xs text-charcoal-400 max-w-xs">
                  Upload a full-body standing photo to preview outfits accurately
                </p>
                <Button variant="primary" size="sm" onClick={onNeedAvatar}>
                  Upload Avatar
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Result Preview Slot */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-semibold text-charcoal-500 tracking-wider">
              {hasGeneratedImage ? 'AI Try-On Result' : 'Try-On Preview'}
            </span>
            {hasGeneratedImage && (
              <span className="text-[10px] font-semibold text-champagne-700 bg-champagne-100 px-2.5 py-0.5 rounded-full border border-champagne-300">
                Saved to Wardrobe
              </span>
            )}
          </div>

          <div className="relative aspect-[3/4] rounded-3xl bg-white/40 border border-white/60 overflow-hidden flex items-center justify-center shadow-glass-sm group">
            {hasGeneratedImage ? (
              <>
                <img
                  src={resultImageUrl}
                  alt="AI Virtual Try-On Result"
                  className="w-full h-full object-cover"
                />
                {/* Floating overlay actions */}
                <div className="absolute inset-x-3 bottom-3 flex items-center gap-2 opacity-90 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={handleDownload}
                    className="flex-1 glass-strong py-2.5 px-3 rounded-2xl text-xs font-semibold text-charcoal-800 hover:bg-white transition-all flex items-center justify-center gap-1.5 shadow-md"
                  >
                    <Download size={14} className="text-champagne-600" />
                    <span>Download Look</span>
                  </button>
                  <Link
                    to="/wardrobe"
                    className="glass-strong py-2.5 px-3 rounded-2xl text-xs font-semibold text-charcoal-800 hover:bg-white transition-all flex items-center justify-center gap-1.5 shadow-md"
                    title="View in Wardrobe"
                  >
                    <ExternalLink size={14} className="text-champagne-600" />
                    <span>Wardrobe</span>
                  </Link>
                </div>
              </>
            ) : selectedProducts.length > 0 ? (
              <div className="p-6 text-center space-y-3">
                <div className="w-16 h-16 rounded-full bg-champagne-100 text-champagne-500 flex items-center justify-center mx-auto animate-pulse">
                  <Sparkles size={28} />
                </div>
                <h4 className="font-display text-base font-bold text-charcoal-700">
                  {selectedProducts.length} Piece{selectedProducts.length !== 1 ? 's' : ''} Staged
                </h4>
                <p className="text-xs text-charcoal-400 max-w-xs leading-relaxed">
                  Click the button below to generate your updated avatar wearing this complete outfit.
                </p>
              </div>
            ) : (
              <div className="p-6 text-center space-y-2 text-xs text-charcoal-400">
                <p className="font-medium text-charcoal-500">Staging rack empty</p>
                <p>Select products from the rack above or catalog to try on</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Action Trigger */}
      <div className="flex flex-col items-center gap-3 pt-4 border-t border-ivory-300/40">
        <Button
          variant="primary"
          size="lg"
          onClick={handleGenerate}
          loading={generating}
          disabled={!avatar || selectedProducts.length === 0}
          className="w-full sm:w-auto min-w-[300px] shadow-elegant justify-center py-3.5"
        >
          <Sparkles size={18} className="text-champagne-300" />
          <span>
            Generate Try-On ({totalCost} Credit{totalCost !== 1 ? 's' : ''})
          </span>
        </Button>
        {statusText && (
          <p className="text-xs font-medium text-champagne-600 animate-pulse tracking-wide">
            {statusText}
          </p>
        )}
      </div>

      {/* Tried-On Outfits Quick Purchase Row */}
      {hasGeneratedImage && selectedProducts.length > 0 && (
        <div className="pt-6 border-t border-ivory-300/40 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-display text-lg font-bold text-charcoal-700">Outfits in this Look</h4>
              <p className="text-xs text-charcoal-400">Add tried-on pieces directly to your cart or wishlist</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {selectedProducts.map((p) => (
              <div
                key={p._id}
                className="flex items-center gap-3 p-3 rounded-2xl bg-white/50 border border-white/60 shadow-sm"
              >
                <img
                  src={p.images?.[0]?.url || p.tryOnImage?.url}
                  alt={p.name}
                  className="w-12 h-16 rounded-xl object-cover"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-display text-xs font-semibold text-charcoal-700 truncate">{p.name}</p>
                  <p className="text-xs font-bold text-charcoal-600 mt-0.5">{formatPrice(p.price)}</p>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => addToCart(p._id, 'M', 'Standard', 1)}
                    className="p-2 rounded-xl bg-charcoal-700 text-white hover:bg-charcoal-800 transition-colors"
                    title="Add to Cart"
                  >
                    <ShoppingBag size={14} />
                  </button>
                  <button
                    onClick={() => toggleWishlist(p._id)}
                    className="p-2 rounded-xl glass hover:bg-white transition-colors"
                    title="Wishlist"
                  >
                    <Heart
                      size={14}
                      className={isInWishlist(p._id) ? 'fill-rose-500 text-rose-500' : 'text-charcoal-500'}
                    />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AI Disclaimer */}
      {hasGeneratedImage && (
        <div className="p-4 rounded-2xl bg-white/40 border border-white/60 flex items-start gap-3 text-xs text-charcoal-400">
          <AlertCircle size={18} className="shrink-0 mt-0.5 text-champagne-500" />
          <p className="leading-relaxed">{AI_DISCLAIMER}</p>
        </div>
      )}
    </div>
  );
}


