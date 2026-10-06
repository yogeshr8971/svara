import React from 'react';
import { Sparkles, Check } from 'lucide-react';
import Button from '../ui/Button';
import { formatPriceFromPaise } from '../../utils/formatPrice';

export default function CreditPackageCard({ pkg, onSelect, loading }) {
  return (
    <div
      className={`relative glass rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 hover:shadow-glass-lg hover:-translate-y-1 ${
        pkg.popular ? 'border-2 border-champagne-400 bg-white/70' : 'border border-white/50'
      }`}
    >
      {pkg.popular && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-champagne-400 text-charcoal-800 text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-full shadow-sm">
          Most Popular
        </span>
      )}

      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display text-xl font-bold text-charcoal-700">{pkg.name}</h3>
          <div className="p-2.5 rounded-full bg-champagne-100 text-champagne-500">
            <Sparkles size={20} />
          </div>
        </div>

        <div className="mb-6">
          <span className="font-display text-4xl font-extrabold text-charcoal-700">
            {formatPriceFromPaise(pkg.priceInPaise)}
          </span>
          <span className="text-xs text-charcoal-400 block mt-1">One-time purchase</span>
        </div>

        <ul className="space-y-3 mb-8 text-xs text-charcoal-500">
          <li className="flex items-center gap-2">
            <Check size={14} className="text-champagne-500 shrink-0" />
            <span className="font-bold text-charcoal-700">{pkg.credits} AI Virtual Try-Ons</span>
          </li>
          <li className="flex items-center gap-2">
            <Check size={14} className="text-champagne-500 shrink-0" />
            <span>Permanent Wardrobe Storage</span>
          </li>
          <li className="flex items-center gap-2">
            <Check size={14} className="text-champagne-500 shrink-0" />
            <span>High-Resolution Previews</span>
          </li>
        </ul>
      </div>

      <Button
        variant={pkg.popular ? 'primary' : 'outline'}
        onClick={() => onSelect(pkg)}
        loading={loading}
        className="w-full justify-center"
      >
        Get {pkg.credits} Credits
      </Button>
    </div>
  );
}
