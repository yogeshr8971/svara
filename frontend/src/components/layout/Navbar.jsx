import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Heart, User, Menu, X, Sparkles, ChevronDown, Shield, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useCredits } from '../../context/CreditContext';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const { user, logout, isAdmin } = useAuth();
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();
  const { credits } = useCredits();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/shop' },
    { name: 'Try On', path: '/playground' },
    { name: 'Wardrobe', path: '/wardrobe' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled ? 'py-3' : 'py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav
          className={`relative flex items-center justify-between px-6 py-3.5 rounded-full transition-all duration-300 ${
            scrolled
              ? 'glass-strong shadow-glass'
              : 'glass bg-white/40 border-white/30 backdrop-blur-md'
          }`}
        >
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <span className="font-display text-2xl font-bold tracking-widest text-charcoal-700 group-hover:text-champagne-500 transition-colors">
              SVARA
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                className={({ isActive }) =>
                  `text-sm tracking-wider font-medium transition-colors hover:text-champagne-500 ${
                    isActive ? 'text-champagne-500 font-semibold' : 'text-charcoal-500'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-4">
            {/* Credits Badge */}
            {user && (
              <Link
                to="/credits"
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-champagne-100/80 border border-champagne-300 text-charcoal-600 text-xs font-medium hover:bg-champagne-200 transition-colors shadow-sm"
              >
                <Sparkles size={14} className="text-champagne-500 fill-champagne-400" />
                <span>{credits} Credits</span>
              </Link>
            )}

            {/* Wishlist */}
            <Link
              to="/wishlist"
              className="relative p-2 text-charcoal-500 hover:text-charcoal-700 transition-colors rounded-full hover:bg-white/50"
              aria-label="Wishlist"
            >
              <Heart size={20} />
              {wishlistCount > 0 && (
                <span className="absolute top-0 right-0 bg-rose-400 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link
              to="/cart"
              className="relative p-2 text-charcoal-500 hover:text-charcoal-700 transition-colors rounded-full hover:bg-white/50"
              aria-label="Cart"
            >
              <ShoppingBag size={20} />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 bg-charcoal-600 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* User Profile / Menu */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-1 p-1.5 rounded-full hover:bg-white/50 transition-colors border border-transparent hover:border-ivory-300"
                >
                  <div className="w-8 h-8 rounded-full bg-champagne-300 text-charcoal-700 flex items-center justify-center font-semibold text-xs overflow-hidden">
                    {user.profileImage ? (
                      <img src={user.profileImage} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                      user.name?.charAt(0).toUpperCase() || 'U'
                    )}
                  </div>
                  <ChevronDown size={14} className="text-charcoal-400 hidden sm:block" />
                </button>

                <AnimatePresence>
                  {profileDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-3 w-52 glass-strong rounded-2xl p-2 shadow-xl border border-white/60 z-50 text-sm"
                    >
                      <div className="px-3 py-2 border-b border-ivory-300/40">
                        <p className="font-semibold text-charcoal-700 truncate">{user.name}</p>
                        <p className="text-xs text-charcoal-400 truncate">{user.email}</p>
                      </div>
                      <div className="py-1">
                        <Link
                          to="/profile"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="block px-3 py-2 rounded-xl text-charcoal-600 hover:bg-ivory-200/70 transition-colors"
                        >
                          My Profile
                        </Link>
                        <Link
                          to="/orders"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="block px-3 py-2 rounded-xl text-charcoal-600 hover:bg-ivory-200/70 transition-colors"
                        >
                          Orders
                        </Link>
                        <Link
                          to="/credits"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="block px-3 py-2 rounded-xl text-charcoal-600 hover:bg-ivory-200/70 transition-colors"
                        >
                          Buy Credits
                        </Link>
                        {isAdmin && (
                          <Link
                            to="/admin"
                            onClick={() => setProfileDropdownOpen(false)}
                            className="flex items-center gap-2 px-3 py-2 rounded-xl text-burgundy-500 font-medium hover:bg-rose-50 transition-colors"
                          >
                            <Shield size={14} />
                            <span>Admin Portal</span>
                          </Link>
                        )}
                      </div>
                      <div className="pt-1 border-t border-ivory-300/40">
                        <button
                          onClick={() => {
                            setProfileDropdownOpen(false);
                            logout();
                            navigate('/');
                          }}
                          className="w-full text-left flex items-center gap-2 px-3 py-2 rounded-xl text-burgundy-600 hover:bg-rose-50 transition-colors"
                        >
                          <LogOut size={14} />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                to="/login"
                className="inline-flex items-center gap-1 px-4 py-2 rounded-full bg-charcoal-600 text-white text-xs tracking-wider uppercase font-medium hover:bg-charcoal-700 transition-colors shadow-sm"
              >
                Sign In
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-charcoal-600 hover:text-charcoal-800"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden glass-strong mx-4 mt-2 rounded-3xl p-6 shadow-xl border border-white/60"
          >
            <div className="flex flex-col gap-4 text-center">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-lg font-medium text-charcoal-600 hover:text-champagne-500 py-2 border-b border-ivory-200/40"
                >
                  {link.name}
                </Link>
              ))}
              {user && (
                <div className="pt-2 flex justify-center">
                  <Link
                    to="/credits"
                    onClick={() => setMobileMenuOpen(false)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-champagne-100 border border-champagne-300 text-charcoal-600 text-sm font-medium"
                  >
                    <Sparkles size={16} className="text-champagne-500 fill-champagne-400" />
                    <span>{credits} AI Credits</span>
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
