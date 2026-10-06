import React, { useState, useEffect } from 'react';
import { Package, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Spinner from '../components/ui/Spinner';
import Button from '../components/ui/Button';
import { formatDate } from '../utils/formatDate';
import { formatPrice } from '../utils/formatPrice';
import { ORDER_STATUSES } from '../utils/constants';
import * as orderService from '../services/orderService';

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const res = await orderService.getOrders();
        setOrders(res.orders || []);
      } catch (err) {
        console.error('Error fetching orders:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <span className="text-xs font-bold uppercase tracking-widest text-champagne-500">History</span>
        <h1 className="section-heading text-3xl font-bold">Your Orders</h1>
        <p className="text-xs text-charcoal-400 mt-1">Track doorstep delivery and order statements</p>
      </div>

      {loading ? (
        <div className="min-h-[50vh] flex flex-col items-center justify-center">
          <Spinner size="lg" />
        </div>
      ) : orders.length === 0 ? (
        <div className="glass rounded-3xl p-16 text-center max-w-md mx-auto space-y-4">
          <div className="w-16 h-16 rounded-full bg-champagne-100 text-champagne-500 flex items-center justify-center mx-auto">
            <Package size={28} />
          </div>
          <h3 className="font-display text-xl font-bold text-charcoal-700">No orders placed</h3>
          <p className="text-xs text-charcoal-400 leading-relaxed">
            Browse our latest collections and find styles that resonate with you.
          </p>
          <Link to="/shop">
            <Button variant="primary" size="md">
              <span>Start Shopping</span>
              <ArrowRight size={16} />
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order._id} className="glass rounded-3xl p-6 sm:p-8 space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-ivory-300/40 pb-4">
                <div>
                  <span className="text-xs font-bold text-charcoal-700">Order #{order.orderNumber}</span>
                  <span className="text-xs text-charcoal-400 ml-3">Placed on {formatDate(order.createdAt)}</span>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${ORDER_STATUSES[order.orderStatus]?.color || 'bg-ivory-200'}`}>
                    {ORDER_STATUSES[order.orderStatus]?.label || order.orderStatus}
                  </span>
                  <span className="font-display text-lg font-bold text-charcoal-800">
                    {formatPrice(order.totalAmount)}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {order.items?.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-4">
                    <img src={item.image} alt={item.name} className="w-16 h-20 object-cover rounded-2xl bg-ivory-200" />
                    <div className="text-xs space-y-0.5 truncate">
                      <p className="font-semibold text-charcoal-700 truncate">{item.name}</p>
                      <p className="text-charcoal-400">Qty: {item.quantity} | Size: {item.size}</p>
                      <p className="font-bold text-charcoal-600">{formatPrice(item.price)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
