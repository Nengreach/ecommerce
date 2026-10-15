import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../api/client';
import {
  CheckCircle2,
  Package,
  Truck,
  ArrowRight,
  Receipt,
  MapPin,
  Calendar,
} from 'lucide-react';

export default function OrderSuccessPage() {
  const { orderNumber } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOrder() {
      try {
        setLoading(true);
        const res = await api.orders.getByNumber(orderNumber);
        setOrder(res.data);
      } catch (err) {
        console.error('Failed to load order:', err);
      } finally {
        setLoading(false);
      }
    }
    loadOrder();
  }, [orderNumber]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center">
        <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm text-slate-500 font-semibold">Retrieving order confirmation...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-800">Order Not Found</h2>
        <p className="text-sm text-slate-500">We could not find an order with identifier {orderNumber}.</p>
        <Link to="/" className="inline-block px-6 py-3 rounded-2xl bg-indigo-600 text-white font-bold text-sm">
          Return Home
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 space-y-10">
      {/* Celebration Header */}
      <div className="text-center space-y-3">
        <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/10">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <span className="text-xs font-bold uppercase tracking-widest text-emerald-600">
          Order Successfully Placed
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Thank you, {order.customer_name.split(' ')[0]}!
        </h1>
        <p className="text-sm text-slate-600 max-w-md mx-auto">
          We’ve received your order and our fulfillment team is preparing it for shipment. A confirmation has been sent to <span className="font-semibold text-slate-900">{order.customer_email}</span>.
        </p>
      </div>

      {/* Order Summary Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <span className="text-xs text-slate-600 uppercase font-bold tracking-wider">Order Reference</span>
            <p className="text-xl font-black text-indigo-600 font-mono mt-0.5">{order.order_number}</p>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 capitalize">
              <Package className="w-3.5 h-3.5" />
              {order.status}
            </span>
            <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 capitalize">
              Paid ({order.payment_method?.toUpperCase()})
            </span>
          </div>
        </div>

        {/* Shipping info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-600">
          <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-slate-50">
            <MapPin className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-slate-900 block">Delivery Address:</span>
              <span>{order.shipping_address}</span>
            </div>
          </div>
          <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-slate-50">
            <Truck className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-slate-900 block">Shipping Method:</span>
              <span>Standard Express (2-4 Business Days)</span>
            </div>
          </div>
        </div>

        {/* Purchased Items */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
            Items Ordered ({order.items?.length || 0})
          </h3>

          <div className="divide-y divide-slate-100">
            {order.items?.map((item) => (
              <div key={item.id} className="py-3 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={item.product_image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=80'}
                    alt=""
                    className="w-12 h-12 rounded-xl object-cover border border-slate-100 shrink-0"
                  />
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-slate-900 truncate">{item.product_name}</h4>
                    <p className="text-[11px] text-slate-600">
                      Qty: {item.quantity} × ${parseFloat(item.unit_price).toFixed(2)}
                    </p>
                  </div>
                </div>
                <span className="text-xs font-black text-slate-900 shrink-0">
                  ${parseFloat(item.subtotal).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing breakdown */}
        <div className="pt-4 border-t border-slate-100 space-y-2 text-xs">
          <div className="flex justify-between text-slate-600">
            <span>Subtotal</span>
            <span className="font-bold text-slate-900">${parseFloat(order.subtotal).toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-slate-600">
            <span>Sales Tax</span>
            <span className="font-bold text-slate-900">${parseFloat(order.tax_amount).toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-slate-600">
            <span>Delivery Fee</span>
            <span className="font-bold text-slate-900">
              {parseFloat(order.shipping_fee) === 0 ? 'FREE' : `$${parseFloat(order.shipping_fee).toFixed(2)}`}
            </span>
          </div>
          <div className="pt-2 border-t border-slate-100 flex justify-between text-sm items-baseline">
            <span className="font-bold text-slate-900">Total Paid</span>
            <span className="text-xl font-black text-indigo-600">${parseFloat(order.total_amount).toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Action links */}
      <div className="flex flex-wrap items-center justify-center gap-4">
        <Link
          to="/shop"
          className="px-7 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 transition-all flex items-center gap-2"
        >
          <span>Continue Shopping</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
        <Link
          to="/orders"
          className="px-7 py-3.5 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm border border-slate-200 transition-all"
        >
          View All Orders
        </Link>
      </div>
    </div>
  );
}
