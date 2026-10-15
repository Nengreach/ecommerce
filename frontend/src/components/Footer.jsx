import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, ShieldCheck, Truck, RotateCcw, Headphones, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 mt-24 border-t border-slate-800">
      {/* Features Bar */}
      <div className="border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center shrink-0">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Free Express Shipping</h4>
                <p className="text-xs text-slate-400">On all orders over $100</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Secure Payments</h4>
                <p className="text-xs text-slate-400">256-bit SSL encrypted</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
                <RotateCcw className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">30-Day Easy Returns</h4>
                <p className="text-xs text-slate-400">Money back guarantee</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
                <Headphones className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">24/7 Dedicated Support</h4>
                <p className="text-xs text-slate-400">Expert care whenever needed</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
          <div className="md:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <span className="text-xl font-black tracking-tight text-white">NexStore</span>
            </Link>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              Premium consumer electronics, audio gear, and lifestyle technology designed to elevate your everyday workflow and play.
            </p>
          </div>

          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-4">Shop</h5>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/shop" className="hover:text-white transition-colors">All Products</Link></li>
              <li><Link to="/shop?category=audio-headphones" className="hover:text-white transition-colors">Audio & Headphones</Link></li>
              <li><Link to="/shop?category=computers-laptops" className="hover:text-white transition-colors">Laptops & Workstations</Link></li>
              <li><Link to="/shop?category=smartwatches-wearables" className="hover:text-white transition-colors">Smartwatches</Link></li>
              <li><Link to="/shop?featured=true" className="hover:text-white transition-colors">Featured Specials</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-4">Customer Care</h5>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/cart" className="hover:text-white transition-colors">View Cart</Link></li>
              <li><Link to="/orders" className="hover:text-white transition-colors">Order Tracking</Link></li>
              <li><span className="text-slate-400">Shipping Policies</span></li>
              <li><span className="text-slate-400">Returns & Exchanges</span></li>
            </ul>
          </div>

          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-4">Stay Connected</h5>
            <p className="text-xs text-slate-400 mb-3">Subscribe for exclusive releases and member perks.</p>
            <form onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full bg-slate-800 text-sm text-white placeholder-slate-400 px-3.5 py-2 rounded-xl border border-slate-700 focus:outline-none focus:border-indigo-500"
              />
              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs py-2.5 rounded-xl transition-all shadow-md shadow-indigo-600/30"
              >
                Join Newsletter
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-slate-800/80 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© {new Date().getFullYear()} NexStore Inc. Powered by Laravel 13 & React.</p>
          <p className="flex items-center gap-1">
            Built with modern technology for maximum performance.
          </p>
        </div>
      </div>
    </footer>
  );
}
