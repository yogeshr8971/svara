import React from 'react';
import { Heart, Trash2, Download, ExternalLink, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatDate } from '../../utils/formatDate';
import { formatPrice } from '../../utils/formatPrice';

export default function WardrobeCard({ item, onToggleFavorite, onDelete }) {
  const handleDownload = async () => {
    try {
      const response = await fetch(item.generatedImageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `svara-look-${item._id}.jpg`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch {
      window.open(item.generatedImageUrl, '_blank');
    }
  };

  return (
    <div className="product-card group flex flex-col justify-between">
      <div className="relative aspect-[3/4] overflow-hidden bg-ivory-200">
        {item.generatedImageUrl ? (
          <img
            src={item.generatedImageUrl}
            alt={item.productSnapshot?.name || 'Generated Outfit'}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          />
        ) : (
          <div className="h-full p-5 bg-white/50 flex flex-col justify-end gap-3">
            <Sparkles size={22} className="text-champagne-500" />
            <p className="font-display text-lg font-bold text-charcoal-700">
              {item.styleData?.styleTitle || 'AI Style Analysis'}
            </p>
            <p className="text-xs leading-relaxed text-charcoal-500 line-clamp-4">
              {item.styleData?.styleDescription || item.styleDescription || 'Your personalized style analysis is ready.'}
            </p>
          </div>
        )}

        {/* Favorite Icon */}
        <button
          onClick={() => onToggleFavorite?.(item._id)}
          className="absolute top-3 right-3 p-2 rounded-full glass bg-white/70 hover:bg-white transition-colors text-charcoal-600 shadow-sm z-10"
        >
          <Heart
            size={16}
            className={`transition-colors ${item.favorite ? 'fill-rose-500 text-rose-500' : 'text-charcoal-500'}`}
          />
        </button>

        {/* Hover Action Bar */}
        <div className="absolute inset-x-3 bottom-3 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
          {item.generatedImageUrl && (
            <button
              onClick={handleDownload}
              className="flex-1 glass-strong py-2 px-2.5 rounded-xl text-xs font-semibold text-charcoal-700 hover:bg-champagne-100 transition-all flex items-center justify-center gap-1 shadow-sm"
            >
              <Download size={13} />
              <span>Download</span>
            </button>
          )}
          <button
            onClick={() => onDelete?.(item._id)}
            className="p-2 rounded-xl glass-strong text-burgundy-500 hover:bg-rose-50 transition-colors"
            title="Delete from Wardrobe"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      <div className="p-4 flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <h4 className="font-display text-sm font-semibold text-charcoal-700 truncate">
            {item.productSnapshot?.name || item.productId?.name || 'Curated Look'}
          </h4>
          {item.productSnapshot?.price && (
            <span className="text-xs font-bold text-charcoal-600">
              {formatPrice(item.productSnapshot.price)}
            </span>
          )}
        </div>
        <div className="flex items-center justify-between text-[11px] text-charcoal-400 mt-1">
          <span>{formatDate(item.createdAt)}</span>
          {item.productId && (
            <Link
              to={`/product/${item.productId.slug || item.productId._id}`}
              className="hover:text-champagne-500 flex items-center gap-0.5"
            >
              <span>View Product</span>
              <ExternalLink size={11} />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
