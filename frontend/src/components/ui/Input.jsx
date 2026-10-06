import React from 'react';

export default function Input({
  label,
  error,
  icon: Icon,
  className = '',
  id,
  ...props
}) {
  return (
    <div className="w-full flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-xs uppercase font-medium tracking-wider text-charcoal-400">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {Icon && (
          <div className="absolute left-3.5 text-charcoal-400 pointer-events-none">
            <Icon size={18} />
          </div>
        )}
        <input
          id={id}
          className={`input-field ${Icon ? 'pl-10' : ''} ${error ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-200' : ''} ${className}`}
          {...props}
        />
      </div>
      {error && <span className="text-xs text-burgundy-500 font-medium">{error}</span>}
    </div>
  );
}
