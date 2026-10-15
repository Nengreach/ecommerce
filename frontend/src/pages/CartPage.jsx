import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import {
  Trash2,
  Minus,
  Plus,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Truck,
} from 'lucide-react';

export default function CartPage() {
  const {
    items,
    totalItems,
    subtotal,
    tax,
    shipping,
    total,
    updateQuantity,
    removeFromCart,
    clearCart,
  } = useCart();

  const freeShippingThreshold = 100;
  const freeShippingRemaining = Math.max(0, freeShippingThreshold - subtotal);
  const freeShippingProgress = Math.min(100, (subtotal / freeShippingThreshold) * 100);

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto shadow-inner">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Your shopping bag is empty</h2>
          <p className="text-sm text-slate-600 max-w-sm mx-auto">
            Discover our flagship audio, titanium smartwatches, and everyday essentials to start shopping.
          </p>
        </div>
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 transition-all hover:-translate-y-0.5"
        >
          <span>Explore Products</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Header */}
      <div className="flex items-baseline justify-between border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Shopping Bag
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            {totalItems} {totalItems === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>

        <button
          onClick={clearCart}
          className="text-xs font-bold text-slate-600 hover:text-rose-600 transition-colors"
        >
          Empty Bag
        </button>
      </div>

      {/* Free Shipping Progress Indicator */}
      <div className="bg-indigo-50/70 border border-indigo-100 rounded-2xl p-4 space-y-2">
        <div className="flex items-center justify-between text-xs font-bold text-indigo-950">
          <span className="flex items-center gap-1.5">
            <Truck className="w-4 h-4 text-indigo-600" />
            {freeShippingRemaining > 0
              ? `Add $${freeShippingRemaining.toFixed(2)} more for Free Express Delivery!`
              : '🎉 You have unlocked Free Express Delivery!'}
          </span>
          <span>${subtotal.toFixed(2)} / ${freeShippingThreshold}</span>
        </div>
        <div className="w-full h-2 rounded-full bg-indigo-200/60 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-indigo-600 to-purple-600 transition-all duration-500 rounded-full"
            style={{ width: `${freeShippingProgress}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Cart Items Table */}
        <div className="lg:col-span-8 space-y-4">
          {items.map((item) => {
            const product = item.product || {};
            const unitPrice = parseFloat(item.price);
            const lineTotal = unitPrice * item.quantity;

            return (
              <div
                key={item.id}
                className="bg-white rounded-3xl border border-slate-200/80 p-4 sm:p-6 flex flex-col sm:flex-row items-center gap-5 transition-shadow hover:shadow-md"
              >
                {/* Product Thumbnail */}
                <Link
                  to={`/products/${product.slug}`}
                  className="w-24 h-24 rounded-2xl overflow-hidden bg-slate-100 shrink-0 border border-slate-100"
                >
                  <img
                    src={product.image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=80'}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </Link>

                {/* Details */}
                <div className="flex-1 min-w-0 text-center sm:text-left space-y-1">
                  {product.category && (
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">
                      {product.category.name}
                    </span>
                  )}
                  <Link to={`/products/${product.slug}`}>
                    <h3 className="font-bold text-slate-900 hover:text-indigo-600 transition-colors text-base line-clamp-1">
                      {product.name}
                    </h3>
                  </Link>
                  <p className="text-xs font-semibold text-slate-600">
                    ${unitPrice.toFixed(2)} each
                  </p>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-slate-200 rounded-xl bg-white p-0.5">
                    <button
                      onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-600 hover:bg-slate-100"
                      disabled={item.quantity <= 1}
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-8 text-center text-xs font-bold text-slate-900">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-600 hover:bg-slate-100"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Line Total */}
                  <span className="text-base font-black text-slate-900 w-20 text-right">
                    ${lineTotal.toFixed(2)}
                  </span>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="p-2 text-slate-600 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-4 bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 space-y-6 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900 pb-4 border-b border-slate-100">
            Order Summary
          </h2>

          <div className="space-y-3.5 text-sm">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal ({totalItems} items)</span>
              <span className="font-bold text-slate-900">${subtotal.toFixed(2)}</span>
            </div>

            <div className="flex justify-between text-slate-600">
              <span>Estimated Sales Tax (8%)</span>
              <span className="font-bold text-slate-900">${tax.toFixed(2)}</span>
            </div>

            <div className="flex justify-between text-slate-600">
              <span>Estimated Shipping</span>
              <span className="font-bold text-slate-900">
                {shipping === 0 ? (
                  <span className="text-emerald-600 font-bold uppercase text-xs">FREE</span>
                ) : (
                  `$${shipping.toFixed(2)}`
                )}
              </span>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-between items-baseline">
              <div>
                <span className="text-base font-bold text-slate-900 block">Total</span>
                <span className="text-xs text-slate-600">Including taxes & delivery</span>
              </div>
              <span className="text-2xl font-black text-indigo-600">
                ${total.toFixed(2)}
              </span>
            </div>
          </div>

          <Link
            to="/checkout"
            className="w-full py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 hover:shadow-indigo-600/50 transition-all flex items-center justify-center gap-2 group"
          >
            <span>Proceed to Checkout</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>

          <div className="flex items-center justify-center gap-2 text-xs text-slate-600 font-medium pt-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Guaranteed Safe & Secure Checkout</span>
          </div>
        </div>
      </div>
    </div>
  );
}
