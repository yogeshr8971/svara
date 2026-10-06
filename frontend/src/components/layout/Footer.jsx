import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-charcoal-700 text-ivory-100 pt-16 pb-12 mt-20 border-t border-charcoal-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-charcoal-600">
          {/* Brand Info */}
          <div className="md:col-span-1">
            <h2 className="font-display text-2xl font-bold tracking-widest text-champagne-300 mb-3">
              SVARA
            </h2>
            <p className="text-xs uppercase tracking-widest text-charcoal-300 mb-4 font-semibold">
              Wear Your Voice
            </p>
            <p className="text-charcoal-300 text-sm leading-relaxed">
              Experience the future of personal fashion with curated women's wear and AI-powered virtual try-on.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-xs uppercase tracking-wider font-semibold text-champagne-200 mb-4">
              Explore
            </h3>
            <ul className="space-y-2 text-sm text-charcoal-300">
              <li><Link to="/shop?category=dresses" className="hover:text-champagne-300 transition-colors">Dresses</Link></li>
              <li><Link to="/shop?category=tops" className="hover:text-champagne-300 transition-colors">Tops & Blouses</Link></li>
              <li><Link to="/shop?category=ethnic-wear" className="hover:text-champagne-300 transition-colors">Ethnic Wear</Link></li>
              <li><Link to="/shop?category=coord-sets" className="hover:text-champagne-300 transition-colors">Co-ord Sets</Link></li>
              <li><Link to="/shop?category=jackets" className="hover:text-champagne-300 transition-colors">Jackets</Link></li>
            </ul>
          </div>

          {/* Experience */}
          <div>
            <h3 className="text-xs uppercase tracking-wider font-semibold text-champagne-200 mb-4">
              Technology
            </h3>
            <ul className="space-y-2 text-sm text-charcoal-300">
              <li><Link to="/playground" className="hover:text-champagne-300 transition-colors">Virtual Try-On</Link></li>
              <li><Link to="/wardrobe" className="hover:text-champagne-300 transition-colors">AI Wardrobe</Link></li>
              <li><Link to="/credits" className="hover:text-champagne-300 transition-colors">Buy AI Credits</Link></li>
              <li><Link to="/profile" className="hover:text-champagne-300 transition-colors">Avatar Management</Link></li>
            </ul>
          </div>

          {/* Trust & Guarantee */}
          <div>
            <h3 className="text-xs uppercase tracking-wider font-semibold text-champagne-200 mb-4">
              SVARA Promise
            </h3>
            <p className="text-charcoal-300 text-sm leading-relaxed mb-4">
              Crafted with luxury fabrics, ethical production, and precision fit previews.
            </p>
            <div className="text-xs text-charcoal-400 leading-relaxed border-t border-charcoal-600/50 pt-3">
              AI previews are visual styling aids. Actual fit may vary by body measurements and fabric elasticity.
            </div>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-charcoal-400 gap-4">
          <p>© {new Date().getFullYear()} SVARA Fashion India Ltd. All rights reserved.</p>
          <div className="flex gap-6">
            <span className="hover:text-charcoal-200 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-charcoal-200 cursor-pointer">Terms of Service</span>
            <span className="hover:text-charcoal-200 cursor-pointer">Shipping & Returns</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
