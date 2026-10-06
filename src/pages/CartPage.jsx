import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ShoppingBag, ArrowRight, ShieldCheck } from 'lucide-react';
import Button from '../components/ui/Button';
import { formatPrice } from '../utils/formatPrice';
import { useCart } from '../context/CartContext';

export default function CartPage() {
  const { cartItems, cartTotal, updateQuantity, removeFromCart, clearCart, loading } = useCart();
  const navigate = useNavigate();

  const shipping = cartTotal >= 2000 || cartTotal === 0 ? 0 : 99;
  const finalTotal = cartTotal + shipping;

  if (cartItems.length === 0 && !loading) {
    return (
      <div className="max-w-md mx-auto py-20 px-4 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-champagne-100 text-champagne-500 flex items-center justify-center mx-auto">
          <ShoppingBag size={28} />
        </div>
        <h2 className="font-display text-2xl font-bold text-charcoal-700">Your shopping bag is empty</h2>
        <p className="text-xs text-charcoal-400">
          Explore our latest arrivals and experience our virtual try-on studio.
        </p>
        <Link to="/shop">
          <Button variant="primary" size="md">
            <span>Explore Collection</span>
            <ArrowRight size={16} />
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <span className="text-xs font-bold uppercase tracking-widest text-champagne-500">Review Items</span>
        <h1 className="section-heading text-3xl font-bold">Shopping Bag</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Items List */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => (
            <div key={item._id} className="glass rounded-3xl p-4 sm:p-6 flex gap-4 sm:gap-6 items-center">
              <img
                src={item.image}
                alt={item.name}
                className="w-20 sm:w-24 aspect-[3/4] object-cover rounded-2xl bg-ivory-200"
              />

              <div className="flex-1 space-y-1">
                <h3 className="font-display text-base font-semibold text-charcoal-700">{item.name}</h3>
                <p className="text-xs text-charcoal-400">
                  Size: <span className="font-semibold text-charcoal-600">{item.size || 'M'}</span> | Color: <span className="font-semibold text-charcoal-600">{item.color || 'Standard'}</span>
                </p>
                <p className="font-bold text-charcoal-700 text-sm sm:text-base pt-1">
                  {formatPrice(item.price)}
                </p>

                {/* Quantity Controls */}
                <div className="flex items-center gap-3 pt-2">
                  <div className="flex items-center border border-ivory-300 rounded-xl overflow-hidden glass">
                    <button
                      onClick={() => updateQuantity(item._id, Math.max(1, item.quantity - 1))}
                      className="px-2.5 py-1 text-xs hover:bg-white/60 text-charcoal-600 font-bold"
                    >
                      -
                    </button>
                    <span className="px-3 text-xs font-semibold text-charcoal-700">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item._id, item.quantity + 1)}
                      className="px-2.5 py-1 text-xs hover:bg-white/60 text-charcoal-600 font-bold"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={() => removeFromCart(item._id)}
                    className="p-1.5 rounded-lg text-charcoal-400 hover:text-burgundy-500 hover:bg-rose-50 transition-colors"
                    title="Remove item"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}

          <div className="flex justify-between items-center pt-2">
            <Link to="/shop" className="text-xs text-charcoal-500 hover:text-champagne-500 font-semibold">
              ← Continue Shopping
            </Link>
            <button
              onClick={clearCart}
              className="text-xs text-burgundy-500 hover:text-burgundy-600 font-medium"
            >
              Clear Bag
            </button>
          </div>
        </div>

        {/* Order Summary */}
        <div className="glass rounded-3xl p-6 sm:p-8 space-y-6">
          <h3 className="font-display text-lg font-bold text-charcoal-700 border-b border-ivory-300/40 pb-3">
            Order Summary
          </h3>

          <div className="space-y-3 text-xs text-charcoal-500">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-bold text-charcoal-700">{formatPrice(cartTotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Estimated Delivery</span>
              <span>{shipping === 0 ? <span className="text-emerald-600 font-bold">Free</span> : formatPrice(shipping)}</span>
            </div>
            {shipping > 0 && (
              <p className="text-[11px] text-champagne-600 bg-champagne-100 p-2 rounded-xl">
                Add {formatPrice(2000 - cartTotal)} more for free express shipping.
              </p>
            )}
            <div className="border-t border-ivory-300/40 pt-3 flex justify-between text-sm font-bold text-charcoal-800">
              <span>Total Amount</span>
              <span>{formatPrice(finalTotal)}</span>
            </div>
          </div>

          <Button
            variant="primary"
            size="lg"
            onClick={() => navigate('/checkout')}
            className="w-full justify-center"
          >
            <span>Proceed to Checkout</span>
            <ArrowRight size={16} />
          </Button>

          <div className="flex items-center justify-center gap-2 text-[11px] text-charcoal-400">
            <ShieldCheck size={14} className="text-champagne-500" />
            <span>Encrypted Razorpay Checkout</span>
          </div>
        </div>
      </div>
    </div>
  );
}
