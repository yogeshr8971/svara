import React, { useState, useEffect } from 'react';
import { User, Sparkles, Package, Heart, LogOut } from 'lucide-react';
import Button from '../components/ui/Button';
import AvatarUploader from '../components/avatar/AvatarUploader';
import { useAuth } from '../context/AuthContext';
import { useCredits } from '../context/CreditContext';
import * as avatarService from '../services/avatarService';
import * as orderService from '../services/orderService';
import { formatDate } from '../utils/formatDate';
import { formatPrice } from '../utils/formatPrice';
import { ORDER_STATUSES } from '../utils/constants';

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const { credits } = useCredits();

  const [activeTab, setActiveTab] = useState('avatar');
  const [avatar, setAvatar] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  useEffect(() => {
    const fetchAvatar = async () => {
      try {
        const res = await avatarService.getAvatar();
        setAvatar(res.avatar);
      } catch (err) {
        console.error('Error fetching avatar:', err);
      }
    };
    fetchAvatar();
  }, []);

  useEffect(() => {
    if (activeTab === 'orders') {
      const fetchUserOrders = async () => {
        try {
          setLoadingOrders(true);
          const res = await orderService.getOrders();
          setOrders(res.orders || []);
        } catch (err) {
          console.error('Error fetching orders:', err);
        } finally {
          setLoadingOrders(false);
        }
      };
      fetchUserOrders();
    }
  }, [activeTab]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Profile Overview Card */}
      <div className="glass rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-champagne-300 text-charcoal-800 font-display text-2xl font-bold flex items-center justify-center">
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold text-charcoal-700">{user?.name}</h1>
            <p className="text-xs text-charcoal-400">{user?.email}</p>
            <span className="inline-block mt-1 text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full bg-champagne-100 text-champagne-600 border border-champagne-200">
              {user?.role === 'admin' ? 'SVARA Administrator' : 'Fashion Member'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <span className="text-xs text-charcoal-400 block">AI Credit Balance</span>
            <span className="font-display text-2xl font-bold text-champagne-500">{credits} Credits</span>
          </div>
          <Button variant="outline" size="sm" onClick={logout}>
            <LogOut size={14} />
            <span>Sign Out</span>
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-3 border-b border-ivory-300/40 pb-3 overflow-x-auto">
        {[
          { id: 'avatar', label: 'AI Silhouette / Avatar', icon: Sparkles },
          { id: 'orders', label: 'Order History', icon: Package },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-semibold tracking-wide transition-all ${
                isActive
                  ? 'bg-charcoal-600 text-white shadow-sm'
                  : 'glass text-charcoal-600 hover:bg-white/80'
              }`}
            >
              <Icon size={14} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Contents */}
      {activeTab === 'avatar' && (
        <AvatarUploader
          currentAvatar={avatar}
          onAvatarUploaded={(newAv) => setAvatar(newAv)}
        />
      )}

      {activeTab === 'orders' && (
        <div className="space-y-4">
          {loadingOrders ? (
            <p className="text-xs text-charcoal-400 text-center py-10">Retrieving order history...</p>
          ) : orders.length === 0 ? (
            <div className="glass rounded-3xl p-12 text-center max-w-md mx-auto space-y-2">
              <p className="font-display text-lg text-charcoal-600">No orders placed yet</p>
              <p className="text-xs text-charcoal-400">Explore our catalog and find pieces that speak to you.</p>
            </div>
          ) : (
            orders.map((ord) => (
              <div key={ord._id} className="glass rounded-3xl p-6 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-ivory-300/40 pb-3 text-xs">
                  <div>
                    <span className="font-semibold text-charcoal-700">Order #{ord.orderNumber}</span>
                    <span className="text-charcoal-400 ml-3">{formatDate(ord.createdAt)}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${ORDER_STATUSES[ord.orderStatus]?.color || 'bg-ivory-200'}`}>
                      {ORDER_STATUSES[ord.orderStatus]?.label || ord.orderStatus}
                    </span>
                    <span className="font-bold text-charcoal-700">{formatPrice(ord.totalAmount)}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {ord.items?.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <img src={item.image} alt={item.name} className="w-14 h-18 object-cover rounded-xl bg-ivory-200" />
                      <div className="truncate text-xs">
                        <p className="font-semibold text-charcoal-700 truncate">{item.name}</p>
                        <p className="text-charcoal-400">Qty: {item.quantity} | Size: {item.size}</p>
                        <p className="font-medium text-charcoal-600">{formatPrice(item.price)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
