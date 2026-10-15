import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/client';
import {
  Package,
  Calendar,
  ArrowRight,
  ShoppingBag,
  Clock,
  CheckCircle2,
} from 'lucide-react';

export default function OrdersPage() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOrders() {
      if (!isAuthenticated) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const res = await api.orders.getMyOrders();
        setOrders(res.data || []);
      } catch (err) {
        console.error('Failed to load orders:', err);
      } finally {
        setLoading(false);
      }
    }

    if (!authLoading) {
      loadOrders();
    }
  }, [isAuthenticated, authLoading]);

  if (!isAuthenticated && !authLoading) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <Package className="w-12 h-12 text-indigo-600 mx-auto" />
        <h2 className="text-2xl font-bold text-slate-800">Please Sign In</h2>
        <p className="text-sm text-slate-500">
          Sign in to your account to view your past orders and tracking statuses.
        </p>
        <Link
          to="/login"
          className="inline-block px-6 py-3 rounded-2xl bg-indigo-600 text-white font-bold text-sm"
        >
          Sign In Now
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-40 rounded-3xl bg-slate-200/60 animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          My Orders
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Review your previous purchases, invoices, and shipment tracking.
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4">
          <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-lg font-bold text-slate-800">No orders placed yet</h3>
          <p className="text-sm text-slate-500 max-w-sm mx-auto">
            When you complete an order, its details and live progress will show up right here.
          </p>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-indigo-600 text-white font-bold text-sm shadow-lg shadow-indigo-600/20"
          >
            <span>Start Shopping</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 space-y-5 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                    <Package className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Order ID</span>
                    <p className="text-base font-black text-slate-900 font-mono">{order.order_number}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 capitalize">
                    {order.status}
                  </span>
                  <span className="text-lg font-black text-indigo-600">
                    ${parseFloat(order.total_amount).toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Items Preview */}
              <div className="flex flex-wrap items-center gap-4">
                {order.items?.map((item) => (
                  <div key={item.id} className="flex items-center gap-2.5">
                    <img
                      src={item.product_image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=200&q=80'}
                      alt=""
                      className="w-10 h-10 rounded-lg object-cover border border-slate-100"
                    />
                    <div className="text-xs">
                      <span className="font-bold text-slate-800 line-clamp-1 max-w-[150px]">{item.product_name}</span>
                      <span className="text-slate-400">Qty: {item.quantity}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between pt-2 text-xs">
                <span className="text-slate-400 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {new Date(order.created_at).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>

                <Link
                  to={`/orders/${order.order_number}`}
                  className="font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                >
                  <span>View Full Order Details</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
