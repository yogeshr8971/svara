import React from 'react';

export default function Badge({ children, variant = 'champagne', className = '' }) {
  const variants = {
    champagne: 'bg-champagne-200 text-charcoal-600 border border-champagne-300/50',
    rose: 'bg-rose-100 text-rose-500 border border-rose-200',
    burgundy: 'bg-burgundy-100 text-burgundy-600 border border-burgundy-200',
    dark: 'bg-charcoal-600 text-white',
    outline: 'border border-charcoal-300 text-charcoal-500',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium tracking-wide ${variants[variant] || variants.champagne} ${className}`}>
      {children}
    </span>
  );
}
