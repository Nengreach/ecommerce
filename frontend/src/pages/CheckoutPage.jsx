import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/client';
import {
  ShieldCheck,
  CreditCard,
  Banknote,
  Lock,
  ChevronLeft,
  Truck,
  CheckCircle2,
} from 'lucide-react';

export default function CheckoutPage() {
  const { cart, items, subtotal, tax, shipping, total, refreshCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    customer_name: user?.name || '',
    customer_email: user?.email || '',
    customer_phone: user?.phone || '',
    shipping_address: user?.address || '',
    city: user?.city || '',
    payment_method: 'card',
    notes: '',
  });

  const [cardDetails, setCardDetails] = useState({
    number: '•••• •••• •••• 4242',
    expiry: '12/28',
    cvv: '123',
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  if (items.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-800">Your bag is empty</h2>
        <p className="text-sm text-slate-500">Please add items to your cart before proceeding to checkout.</p>
        <Link to="/shop" className="inline-block px-6 py-3 rounded-2xl bg-indigo-600 text-white font-bold text-sm">
          Return to Shop
        </Link>
      </div>
    );
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!formData.customer_name || !formData.customer_email || !formData.shipping_address) {
      setError('Please fill in all required shipping and contact details.');
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        customer_name: formData.customer_name,
        customer_email: formData.customer_email,
        customer_phone: formData.customer_phone,
        shipping_address: `${formData.shipping_address}, ${formData.city}`,
        payment_method: formData.payment_method,
        notes: formData.notes,
        cart_id: cart.cart_id,
      };

      const res = await api.orders.create(payload);
      await refreshCart();
      navigate(`/orders/${res.data.order_number}`);
    } catch (err) {
      console.error('Checkout error:', err);
      setError(err.message || 'Payment processing failed. Please check your information and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Back button */}
      <div>
        <Link to="/cart" className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-indigo-600 transition-colors">
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Shopping Bag</span>
        </Link>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-2">
          Secure Checkout
        </h1>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-sm font-semibold">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Form Inputs (Left) */}
        <div className="lg:col-span-7 space-y-8">
          {/* Customer & Shipping Details */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 space-y-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-indigo-600 text-white text-xs flex items-center justify-center font-black">
                1
              </span>
              <span>Contact & Delivery Address</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="customer_name"
                  required
                  value={formData.customer_name}
                  onChange={handleChange}
                  placeholder="Jane Smith"
                  className="w-full bg-slate-50 text-sm text-slate-900 px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="customer_email"
                  required
                  value={formData.customer_email}
                  onChange={handleChange}
                  placeholder="jane@example.com"
                  className="w-full bg-slate-50 text-sm text-slate-900 px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="customer_phone"
                  value={formData.customer_phone}
                  onChange={handleChange}
                  placeholder="+1 (555) 019-2831"
                  className="w-full bg-slate-50 text-sm text-slate-900 px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Street Address *
                </label>
                <input
                  type="text"
                  name="shipping_address"
                  required
                  value={formData.shipping_address}
                  onChange={handleChange}
                  placeholder="123 Innovation Boulevard, Suite 400"
                  className="w-full bg-slate-50 text-sm text-slate-900 px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  City & State / Region
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="San Francisco, CA"
                  className="w-full bg-slate-50 text-sm text-slate-900 px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Delivery Notes (Optional)
                </label>
                <textarea
                  name="notes"
                  rows={2}
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Gate code, porch instructions, etc."
                  className="w-full bg-slate-50 text-sm text-slate-900 px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all"
                />
              </div>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 space-y-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-indigo-600 text-white text-xs flex items-center justify-center font-black">
                2
              </span>
              <span>Payment Method</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <label
                className={`p-4 rounded-2xl border-2 cursor-pointer flex flex-col items-center gap-2 text-center transition-all ${
                  formData.payment_method === 'card'
                    ? 'border-indigo-600 bg-indigo-50/40 text-indigo-950 font-bold'
                    : 'border-slate-200 hover:border-slate-300 text-slate-700'
                }`}
              >
                <input
                  type="radio"
                  name="payment_method"
                  value="card"
                  checked={formData.payment_method === 'card'}
                  onChange={handleChange}
                  className="sr-only"
                />
                <CreditCard className="w-6 h-6 text-indigo-600" />
                <span className="text-xs">Credit / Debit Card</span>
              </label>

              <label
                className={`p-4 rounded-2xl border-2 cursor-pointer flex flex-col items-center gap-2 text-center transition-all ${
                  formData.payment_method === 'cod'
                    ? 'border-indigo-600 bg-indigo-50/40 text-indigo-950 font-bold'
                    : 'border-slate-200 hover:border-slate-300 text-slate-700'
                }`}
              >
                <input
                  type="radio"
                  name="payment_method"
                  value="cod"
                  checked={formData.payment_method === 'cod'}
                  onChange={handleChange}
                  className="sr-only"
                />
                <Banknote className="w-6 h-6 text-emerald-600" />
                <span className="text-xs">Cash on Delivery</span>
              </label>

              <label
                className={`p-4 rounded-2xl border-2 cursor-pointer flex flex-col items-center gap-2 text-center transition-all ${
                  formData.payment_method === 'paypal'
                    ? 'border-indigo-600 bg-indigo-50/40 text-indigo-950 font-bold'
                    : 'border-slate-200 hover:border-slate-300 text-slate-700'
                }`}
              >
                <input
                  type="radio"
                  name="payment_method"
                  value="paypal"
                  checked={formData.payment_method === 'paypal'}
                  onChange={handleChange}
                  className="sr-only"
                />
                <ShieldCheck className="w-6 h-6 text-purple-600" />
                <span className="text-xs">PayPal Express</span>
              </label>
            </div>

            {/* Simulated Card Form */}
            {formData.payment_method === 'card' && (
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-2">
                  <span>Card Information (Sandbox Test Card Pre-Filled)</span>
                  <Lock className="w-3.5 h-3.5 text-slate-400" />
                </div>
                <div>
                  <input
                    type="text"
                    disabled
                    value={cardDetails.number}
                    className="w-full bg-white text-sm text-slate-800 px-3.5 py-2.5 rounded-xl border border-slate-200 font-mono"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    disabled
                    value={`Expires: ${cardDetails.expiry}`}
                    className="w-full bg-white text-xs text-slate-800 px-3.5 py-2 rounded-xl border border-slate-200 font-mono"
                  />
                  <input
                    type="text"
                    disabled
                    value={`CVC: ${cardDetails.cvv}`}
                    className="w-full bg-white text-xs text-slate-800 px-3.5 py-2 rounded-xl border border-slate-200 font-mono"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Order Review Sidebar (Right) */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 space-y-6 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900 pb-4 border-b border-slate-100">
            Items in Order ({items.length})
          </h2>

          <div className="max-h-80 overflow-y-auto space-y-4 pr-1">
            {items.map((item) => (
              <div key={item.id} className="flex items-center gap-3">
                <img
                  src={item.product?.image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=80'}
                  alt=""
                  className="w-14 h-14 rounded-xl object-cover border border-slate-100"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-slate-900 truncate">
                    {item.product?.name}
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Qty: {item.quantity} × ${parseFloat(item.price).toFixed(2)}
                  </p>
                </div>
                <span className="text-xs font-black text-slate-900">
                  ${(parseFloat(item.price) * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-slate-100 space-y-3 text-sm">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal</span>
              <span className="font-bold text-slate-900">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Sales Tax (8%)</span>
              <span className="font-bold text-slate-900">${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Shipping</span>
              <span className="font-bold text-slate-900">
                {shipping === 0 ? <span className="text-emerald-600 font-bold uppercase text-xs">FREE</span> : `$${shipping.toFixed(2)}`}
              </span>
            </div>
            <div className="pt-3 border-t border-slate-100 flex justify-between items-baseline">
              <span className="text-base font-bold text-slate-900">Total to Pay</span>
              <span className="text-2xl font-black text-indigo-600">${total.toFixed(2)}</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-400 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2"
          >
            {submitting ? (
              <span>Placing Order...</span>
            ) : (
              <>
                <Lock className="w-4 h-4" />
                <span>Place Order • ${total.toFixed(2)}</span>
              </>
            )}
          </button>

          <div className="flex items-center justify-center gap-2 text-xs text-slate-400 pt-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Encrypted 256-Bit SSL Checkout</span>
          </div>
        </div>
      </form>
    </div>
  );
}
