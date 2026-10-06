import React from 'react';
import { CATEGORIES, SIZES, SORT_OPTIONS } from '../../utils/constants';

export default function ProductFilters({
  selectedCategory,
  onSelectCategory,
  selectedSize,
  onSelectSize,
  selectedSort,
  onSelectSort,
  priceRange,
  onPriceChange,
  onClearFilters,
}) {
  return (
    <div className="glass rounded-3xl p-6 space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-ivory-300/40">
        <h3 className="font-display text-lg font-semibold text-charcoal-700">Filters</h3>
        <button
          onClick={onClearFilters}
          className="text-xs text-charcoal-400 hover:text-burgundy-500 transition-colors uppercase tracking-wider font-semibold"
        >
          Reset
        </button>
      </div>

      {/* Sort By */}
      <div>
        <label className="text-xs uppercase font-semibold text-charcoal-400 tracking-wider mb-2.5 block">
          Sort By
        </label>
        <select
          value={selectedSort}
          onChange={(e) => onSelectSort(e.target.value)}
          className="input-field py-2 text-xs"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Categories */}
      <div>
        <label className="text-xs uppercase font-semibold text-charcoal-400 tracking-wider mb-2.5 block">
          Category
        </label>
        <div className="flex flex-col gap-1.5">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.slug}
              onClick={() => onSelectCategory(cat.slug)}
              className={`text-left px-3 py-1.5 rounded-xl text-xs transition-colors ${
                selectedCategory === cat.slug
                  ? 'bg-champagne-200/80 font-semibold text-charcoal-800'
                  : 'text-charcoal-500 hover:bg-white/40'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Sizes */}
      <div>
        <label className="text-xs uppercase font-semibold text-charcoal-400 tracking-wider mb-2.5 block">
          Size
        </label>
        <div className="flex flex-wrap gap-2">
          {SIZES.map((size) => (
            <button
              key={size}
              onClick={() => onSelectSize(selectedSize === size ? '' : size)}
              className={`w-9 h-9 rounded-xl text-xs font-semibold flex items-center justify-center transition-all ${
                selectedSize === size
                  ? 'bg-charcoal-600 text-white shadow-sm'
                  : 'glass text-charcoal-600 hover:bg-white/70'
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <label className="text-xs uppercase font-semibold text-charcoal-400 tracking-wider mb-2.5 block">
          Max Price: ₹{priceRange}
        </label>
        <input
          type="range"
          min="500"
          max="10000"
          step="500"
          value={priceRange}
          onChange={(e) => onPriceChange(Number(e.target.value))}
          className="w-full accent-champagne-400 bg-ivory-300 rounded-lg cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-charcoal-400 mt-1">
          <span>₹500</span>
          <span>₹10,000</span>
        </div>
      </div>
    </div>
  );
}
