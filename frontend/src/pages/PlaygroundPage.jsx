import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { Sparkles, Trash2, Plus, ArrowRight, CheckCircle2 } from 'lucide-react';
import PlaygroundPanel from '../components/playground/PlaygroundPanel';
import AvatarUploader from '../components/avatar/AvatarUploader';
import Modal from '../components/ui/Modal';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';
import * as playgroundService from '../services/playgroundService';
import * as avatarService from '../services/avatarService';
import * as productService from '../services/productService';
import toast from 'react-hot-toast';

export default function PlaygroundPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [avatar, setAvatar] = useState(null);
  const [playgroundProducts, setPlaygroundProducts] = useState([]);
  const [selectedForTryOn, setSelectedForTryOn] = useState([]);
  const [loading, setLoading] = useState(true);
  const [avatarModalOpen, setAvatarModalOpen] = useState(false);

  useEffect(() => {
    const initWorkspace = async () => {
      try {
        setLoading(true);
        const [avatarRes, pgRes] = await Promise.all([
          avatarService.getAvatar(),
          playgroundService.getPlayground(),
        ]);
        setAvatar(avatarRes.avatar);

        const pList = pgRes.playground?.selectedProducts?.map((item) => item.productId).filter(Boolean) || [];
        setPlaygroundProducts(pList);

        // Check query param productId — auto-add and auto-select
        const queryProductId = searchParams.get('productId');
        if (queryProductId) {
          const directProd = await productService.getProduct(queryProductId);
          if (directProd.product) {
            if (!pList.some((p) => p._id === directProd.product._id)) {
              setPlaygroundProducts([directProd.product, ...pList]);
            }
            setSelectedForTryOn([directProd.product]);
          }
        }
      } catch (err) {
        console.error('Error loading playground workspace:', err);
      } finally {
        setLoading(false);
      }
    };
    initWorkspace();
  }, [searchParams]);

  const toggleProductSelection = (product) => {
    setSelectedForTryOn((prev) => {
      const exists = prev.some((p) => p._id === product._id);
      return exists ? prev.filter((p) => p._id !== product._id) : [...prev, product];
    });
  };

  const handleRemoveFromTryOn = (productId) => {
    setSelectedForTryOn((prev) => prev.filter((p) => p._id !== productId));
  };

  const handleRemoveProduct = async (productId) => {
    try {
      await playgroundService.removeProduct(productId);
      const updated = playgroundProducts.filter((p) => p._id !== productId);
      setPlaygroundProducts(updated);
      setSelectedForTryOn((prev) => prev.filter((p) => p._id !== productId));
    } catch (err) {
      console.error('Failed to remove item from playground:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <Spinner size="lg" />
        <p className="mt-4 text-xs tracking-widest text-charcoal-400 uppercase">Preparing Studio...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Studio Header */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-champagne-500">Virtual Atelier</span>
          <h1 className="section-heading text-3xl font-bold">Try-On Playground</h1>
        </div>
        <Link to="/wardrobe" className="text-xs uppercase font-semibold text-charcoal-500 hover:text-champagne-500 flex items-center gap-1.5 glass px-4 py-2 rounded-xl transition-all">
          <Sparkles size={14} className="text-champagne-500" />
          <span>My Wardrobe Archive</span>
          <ArrowRight size={14} />
        </Link>
      </div>

      {/* Staging Rack */}
      <div className="glass rounded-3xl p-4 sm:p-6 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs uppercase font-semibold text-charcoal-400 tracking-wider">
            Staging Rack ({playgroundProducts.length} Items) · {selectedForTryOn.length} selected for try-on
          </span>
          <Link to="/shop" className="text-xs text-champagne-500 hover:text-champagne-600 font-semibold flex items-center gap-1">
            <Plus size={14} />
            <span>Add More Looks</span>
          </Link>
        </div>

        {playgroundProducts.length === 0 ? (
          <div className="text-center py-6 text-xs text-charcoal-400">
            <span>Your staging rack is empty. Browse the </span>
            <Link to="/shop" className="text-champagne-500 underline font-medium">shop</Link>
            <span> and click "Add to Playground".</span>
          </div>
        ) : (
          <>
            <p className="text-[11px] text-charcoal-400">
              Click any item below to select or deselect it for your try-on session
            </p>
            <div className="flex gap-4 overflow-x-auto pb-2">
              {playgroundProducts.map((p) => {
                const isSelected = selectedForTryOn.some((s) => s._id === p._id);
                return (
                  <div
                    key={p._id}
                    onClick={() => toggleProductSelection(p)}
                    className={`relative w-24 aspect-[3/4] rounded-2xl overflow-hidden border-2 cursor-pointer transition-all shrink-0 group ${
                      isSelected
                        ? 'border-champagne-500 scale-95 shadow-md ring-2 ring-champagne-300'
                        : 'border-transparent opacity-80 hover:opacity-100 hover:border-champagne-200'
                    }`}
                  >
                    <img
                      src={p.images?.[0]?.url || p.tryOnImage?.url}
                      alt={p.name}
                      className="w-full h-full object-cover"
                    />
                    {isSelected && (
                      <div className="absolute top-1.5 left-1.5 p-0.5 rounded-full bg-champagne-500 text-white shadow-sm">
                        <CheckCircle2 size={14} />
                      </div>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveProduct(p._id);
                      }}
                      className="absolute top-1.5 right-1.5 p-1 rounded-full bg-charcoal-800/70 text-white opacity-0 group-hover:opacity-100 hover:bg-rose-600 transition-all shadow-sm"
                      title="Remove from Staging Rack"
                    >
                      <Trash2 size={12} />
                    </button>
                    <div className="absolute inset-x-0 bottom-0 bg-charcoal-900/60 p-1">
                      <p className="text-[10px] text-white truncate text-center font-medium">{p.name}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* Main Interactive Try-On Panel */}
      <PlaygroundPanel
        avatar={avatar}
        selectedProducts={selectedForTryOn}
        onNeedAvatar={() => setAvatarModalOpen(true)}
        onNeedCredits={() => navigate('/credits')}
        onRemoveProduct={handleRemoveFromTryOn}
        onSavedToWardrobe={() => {}}
      />

      {/* Modal for Avatar Upload */}
      <Modal
        isOpen={avatarModalOpen}
        onClose={() => setAvatarModalOpen(false)}
        title="Setup Your Silhouette"
        maxWidth="max-w-2xl"
      >
        <AvatarUploader
          currentAvatar={avatar}
          onAvatarUploaded={(newAv) => {
            setAvatar(newAv);
            setAvatarModalOpen(false);
          }}
        />
      </Modal>
    </div>
  );
}
