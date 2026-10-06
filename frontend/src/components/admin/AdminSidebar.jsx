import React from 'react';
import { LayoutDashboard, Package, Users, Sparkles, FolderTree } from 'lucide-react';

export default function AdminSidebar({ activeSection, onSelectSection }) {
  const sections = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'products', label: 'Products & Stock', icon: Package },
    { id: 'categories', label: 'Categories', icon: FolderTree },
    { id: 'users', label: 'Customers', icon: Users },
    { id: 'vto', label: 'AI Try-On Logs', icon: Sparkles },
  ];

  return (
    <div className="glass rounded-3xl p-4 sm:p-6 space-y-2">
      <div className="pb-4 border-b border-ivory-300/40 mb-2 px-2">
        <p className="text-[10px] uppercase tracking-widest font-bold text-charcoal-400">Admin Control</p>
        <h3 className="font-display text-lg font-bold text-charcoal-700">Management</h3>
      </div>
      {sections.map((sec) => {
        const Icon = sec.icon;
        const isActive = activeSection === sec.id;
        return (
          <button
            key={sec.id}
            onClick={() => onSelectSection(sec.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-semibold tracking-wide transition-all ${
              isActive
                ? 'bg-charcoal-600 text-white shadow-sm'
                : 'text-charcoal-500 hover:bg-white/60 hover:text-charcoal-700'
            }`}
          >
            <Icon size={16} />
            <span>{sec.label}</span>
          </button>
        );
      })}
    </div>
  );
}
