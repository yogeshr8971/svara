import React, { useState, useEffect } from 'react';
import { Sparkles, Heart, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import WardrobeCard from '../components/wardrobe/WardrobeCard';
import Spinner from '../components/ui/Spinner';
import Button from '../components/ui/Button';
import * as wardrobeService from '../services/wardrobeService';
import toast from 'react-hot-toast';

export default function WardrobePage() {
  const [wardrobeItems, setWardrobeItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterFavorites, setFilterFavorites] = useState(false);

  const fetchWardrobe = async () => {
    try {
      setLoading(true);
      const res = await wardrobeService.getWardrobe(
        filterFavorites ? { favorite: 'true' } : {}
      );
      setWardrobeItems(res.wardrobe || []);
    } catch (err) {
      toast.error('Could not load your AI wardrobe');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWardrobe();
  }, [filterFavorites]);

  const handleToggleFavorite = async (id) => {
    try {
      await wardrobeService.toggleFavorite(id);
      setWardrobeItems((prev) =>
        prev.map((item) => (item._id === id ? { ...item, favorite: !item.favorite } : item))
      );
    } catch {
      toast.error('Failed to update favorite status');
    }
  };

  const handleDeleteItem = async (id) => {
    try {
      await wardrobeService.deleteItem(id);
      setWardrobeItems((prev) => prev.filter((item) => item._id !== id));
      toast.success('Look removed from wardrobe');
    } catch {
      toast.error('Failed to delete look');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-champagne-500">Personal Archive</span>
          <h1 className="section-heading text-3xl font-bold">Your AI Wardrobe</h1>
          <p className="text-xs text-charcoal-400 mt-1">Every virtual try-on generation is automatically saved here</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setFilterFavorites(!filterFavorites)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all ${
              filterFavorites ? 'bg-rose-100 text-rose-600 border border-rose-200' : 'glass text-charcoal-600'
            }`}
          >
            <Heart size={14} className={filterFavorites ? 'fill-rose-500' : ''} />
            <span>Favorites Only</span>
          </button>
          <Link to="/playground">
            <Button variant="primary" size="sm">
              <Sparkles size={14} />
              <span>Try New Look</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="min-h-[50vh] flex flex-col items-center justify-center">
          <Spinner size="lg" />
        </div>
      ) : wardrobeItems.length === 0 ? (
        <div className="glass rounded-3xl p-16 text-center max-w-md mx-auto space-y-4">
          <div className="w-16 h-16 rounded-full bg-champagne-100 text-champagne-500 flex items-center justify-center mx-auto">
            <Sparkles size={28} />
          </div>
          <h3 className="font-display text-xl font-bold text-charcoal-700">Your wardrobe is waiting</h3>
          <p className="text-xs text-charcoal-400 leading-relaxed">
            Try on your favorite SVARA looks and they will automatically appear here with high-resolution download links.
          </p>
          <Link to="/playground">
            <Button variant="primary" size="md">
              <span>Start Trying On</span>
              <ArrowRight size={16} />
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {wardrobeItems.map((item) => (
            <WardrobeCard
              key={item._id}
              item={item}
              onToggleFavorite={handleToggleFavorite}
              onDelete={handleDeleteItem}
            />
          ))}
        </div>
      )}
    </div>
  );
}
