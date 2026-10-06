import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { formatPrice } from '../utils/formatPrice';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import * as orderService from '../services/orderService';
import toast from 'react-hot-toast';

export default function CheckoutPage() {
  const { cartItems, cartTotal, refreshCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const shipping = cartTotal >= 2000 ? 0 : 99;
  const totalAmount = cartTotal + shipping;

  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState({
    name: user?.name || '',
    phone: '',
    street: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India',
  });

  const handleChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!address.name || !address.phone || !address.street || !address.city || !address.pincode) {
      toast.error('Please fill in complete shipping information.');
      return;
    }

    try {
      setLoading(true);
      const isRzpReady = await loadRazorpay();
      if (!isRzpReady) {
        toast.error('Razorpay gateway failed to load. Please check internet connection.');
        return;
      }

      // 1. Create order on backend
      const res = await orderService.createOrder({ shippingAddress: address });
      const { order, razorpayOrderId, keyId, amountInPaise } = res;

      // 2. Open Razorpay modal
      const options = {
        key: keyId || 'rzp_test_placeholder',
        amount: amountInPaise,
        currency: 'INR',
        name: 'SVARA',
        description: `Order #${order.orderNumber}`,
        order_id: razorpayOrderId,
        handler: async (response) => {
          try {
            await orderService.verifyPayment(order._id, {
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            });
            toast.success('Payment verified! Your order has been placed.');
            refreshCart();
            navigate('/orders');
          } catch {
            toast.error('Payment signature mismatch. Contact support.');
          }
        },
        prefill: {
          name: address.name,
          email: user?.email,
          contact: address.phone,
        },
        theme: {
          color: '#242019',
        },
      };

      const rzpInstance = new window.Razorpay(options);
      rzpInstance.open();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <span className="text-xs font-bold uppercase tracking-widest text-champagne-500">Secure Purchase</span>
        <h1 className="section-heading text-3xl font-bold">Express Checkout</h1>
      </div>

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Shipping Form */}
        <div className="lg:col-span-2 glass rounded-3xl p-6 sm:p-8 space-y-6">
          <h3 className="font-display text-lg font-bold text-charcoal-700 border-b border-ivory-300/40 pb-3">
            Shipping Address
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Recipient Name"
              name="name"
              value={address.name}
              onChange={handleChange}
              required
            />
            <Input
              label="Contact Number"
              name="phone"
              placeholder="10-digit mobile number"
              value={address.phone}
              onChange={handleChange}
              required
            />
          </div>

          <Input
            label="Street Address & Landmark"
            name="street"
            placeholder="Flat 402, Royal Gardens, MG Road"
            value={address.street}
            onChange={handleChange}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="City"
              name="city"
              value={address.city}
              onChange={handleChange}
              required
            />
            <Input
              label="State"
              name="state"
              value={address.state}
              onChange={handleChange}
              required
            />
            <Input
              label="PIN Code"
              name="pincode"
              value={address.pincode}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* Order Review Box */}
        <div className="glass rounded-3xl p-6 sm:p-8 space-y-6">
          <h3 className="font-display text-lg font-bold text-charcoal-700 border-b border-ivory-300/40 pb-3">
            Summary ({cartItems.length} Items)
          </h3>

          <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
            {cartItems.map((item) => (
              <div key={item._id} className="flex items-center gap-3 text-xs">
                <img src={item.image} alt={item.name} className="w-12 h-14 object-cover rounded-xl bg-ivory-200" />
                <div className="flex-1 truncate">
                  <p className="font-semibold text-charcoal-700 truncate">{item.name}</p>
                  <p className="text-charcoal-400">Qty: {item.quantity} | Size: {item.size}</p>
                </div>
                <span className="font-bold text-charcoal-700">{formatPrice(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>

          <div className="border-t border-ivory-300/40 pt-3 space-y-2 text-xs text-charcoal-500">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-bold text-charcoal-700">{formatPrice(cartTotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>{shipping === 0 ? <span className="text-emerald-600 font-bold">Free</span> : formatPrice(shipping)}</span>
            </div>
            <div className="border-t border-ivory-300/40 pt-2 flex justify-between text-base font-bold text-charcoal-800">
              <span>Total Payable</span>
              <span>{formatPrice(totalAmount)}</span>
            </div>
          </div>

          <Button type="submit" variant="primary" size="lg" loading={loading} className="w-full justify-center">
            <span>Pay with Razorpay</span>
            <ArrowRight size={16} />
          </Button>

          <div className="flex items-center justify-center gap-2 text-[11px] text-charcoal-400">
            <ShieldCheck size={14} className="text-champagne-500" />
            <span>Encrypted 256-Bit Transactions</span>
          </div>
        </div>
      </form>
    </div>
  );
}
