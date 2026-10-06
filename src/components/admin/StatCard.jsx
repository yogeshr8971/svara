import React from 'react';

export default function StatCard({ title, value, icon: Icon, change }) {
  return (
    <div className="glass rounded-3xl p-6 flex items-center justify-between">
      <div>
        <p className="text-xs uppercase tracking-wider font-semibold text-charcoal-400 mb-1">{title}</p>
        <p className="font-display text-2xl sm:text-3xl font-bold text-charcoal-700">{value}</p>
        {change && <p className="text-[11px] text-emerald-600 font-medium mt-1">{change}</p>}
      </div>
      {Icon && (
        <div className="p-4 rounded-2xl bg-champagne-100/70 text-champagne-500">
          <Icon size={24} />
        </div>
      )}
    </div>
  );
}
