import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/client';
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Layers,
  Users,
  TrendingUp,
  BarChart3,
  Search,
  Bell,
  Mail,
  ListChecks,
  Sun,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  Plus,
  Edit2,
  Trash2,
  ExternalLink,
  Shield,
  Download,
  CheckCircle2,
  AlertTriangle,
  MoreVertical,
  Filter,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  SlidersHorizontal,
  LogOut,
} from 'lucide-react';

export default function AdminDashboard() {
  const { user, isAuthenticated, logout, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  // Navigation states
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard', 'products', 'orders', 'categories'
  const [chartTimeframe, setChartTimeframe] = useState('Month'); // 'Day', 'Month', 'Year'

  // Data states
  const [stats, setStats] = useState(null);
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search and filters
  const [orderFilter, setOrderFilter] = useState('');
  const [productSearch, setProductSearch] = useState('');
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  // Modals state
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);

  // Form states
  const [productForm, setProductForm] = useState({
    name: '',
    category_id: '',
    price: '',
    compare_at_price: '',
    stock: 10,
    image: '',
    short_description: '',
    description: '',
    is_featured: false,
    is_active: true,
  });

  const [categoryForm, setCategoryForm] = useState({
    name: '',
    description: '',
    image: '',
  });

  const [toastMessage, setToastMessage] = useState(null);

  const notify = (msg, isError = false) => {
    setToastMessage({ msg, isError });
    setTimeout(() => setToastMessage(null), 3500);
  };

  useEffect(() => {
    if (!authLoading && (!isAuthenticated || user?.role !== 'admin')) {
      return;
    }
    fetchDashboardData();
  }, [isAuthenticated, user, authLoading]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, catsRes, ordersRes, prodsRes] = await Promise.all([
        api.admin.getStats(),
        api.categories.getAll(),
        api.admin.getOrders(),
        api.admin.getProducts(),
      ]);

      setStats(statsRes);
      setCategories(catsRes.data || []);
      setOrders(ordersRes.data || []);
      setProducts(prodsRes.data || []);
      if (catsRes.data?.length > 0 && !productForm.category_id) {
        setProductForm(prev => ({ ...prev, category_id: catsRes.data[0].id }));
      }
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await api.admin.updateOrderStatus(orderId, newStatus);
      notify(`Order #${orderId} status updated to "${newStatus}"`);
      const ordersRes = await api.admin.getOrders({ status: orderFilter || undefined });
      setOrders(ordersRes.data || []);
      const statsRes = await api.admin.getStats();
      setStats(statsRes);
    } catch (err) {
      notify(err.message || 'Status update failed', true);
    }
  };

  const handleOpenProductModal = (prod = null) => {
    if (prod) {
      setEditingProduct(prod);
      setProductForm({
        name: prod.name,
        category_id: prod.category_id,
        price: prod.price,
        compare_at_price: prod.compare_at_price || '',
        stock: prod.stock,
        image: prod.image || '',
        short_description: prod.short_description || '',
        description: prod.description || '',
        is_featured: prod.is_featured,
        is_active: prod.is_active,
      });
    } else {
      setEditingProduct(null);
      setProductForm({
        name: '',
        category_id: categories[0]?.id || '',
        price: '',
        compare_at_price: '',
        stock: 10,
        image: '',
        short_description: '',
        description: '',
        is_featured: false,
        is_active: true,
      });
    }
    setProductModalOpen(true);
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await api.admin.updateProduct(editingProduct.id, productForm);
        notify(`Product "${productForm.name}" updated!`);
      } else {
        await api.admin.createProduct(productForm);
        notify(`Product "${productForm.name}" created!`);
      }
      setProductModalOpen(false);
      const prodsRes = await api.admin.getProducts();
      setProducts(prodsRes.data || []);
      const statsRes = await api.admin.getStats();
      setStats(statsRes);
    } catch (err) {
      notify(err.message || 'Failed to save product', true);
    }
  };

  const handleDeleteProduct = async (productId, name) => {
    if (!window.confirm(`Delete "${name}" from store catalog?`)) return;
    try {
      await api.admin.deleteProduct(productId);
      notify(`Product "${name}" removed`);
      setProducts(products.filter(p => p.id !== productId));
      const statsRes = await api.admin.getStats();
      setStats(statsRes);
    } catch (err) {
      notify(err.message || 'Failed to delete product', true);
    }
  };

  const handleSaveCategory = async (e) => {
    e.preventDefault();
    try {
      await api.admin.createCategory(categoryForm);
      notify(`Category "${categoryForm.name}" created!`);
      setCategoryModalOpen(false);
      setCategoryForm({ name: '', description: '', image: '' });
      const catsRes = await api.categories.getAll();
      setCategories(catsRes.data || []);
    } catch (err) {
      notify(err.message || 'Failed to save category', true);
    }
  };

  if (!authLoading && (!isAuthenticated || user?.role !== 'admin')) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-800 text-white rounded-3xl p-8 text-center space-y-6 shadow-2xl border border-slate-700">
          <div className="w-16 h-16 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto">
            <Shield className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-black tracking-tight">Admin Portal Access</h1>
            <p className="text-xs text-slate-400">
              Sign in with administrative privileges (`admin@example.com` / `password`) to enter.
            </p>
          </div>
          <Link
            to="/login"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg transition-all"
          >
            <span>Proceed to Login</span>
            <ExternalLink className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  const metrics = stats?.metrics || {
    total_revenue: 0,
    total_orders: 0,
    total_products: 0,
    total_customers: 0,
  };

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
    (p.category?.name || '').toLowerCase().includes(productSearch.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#ebedef] text-slate-800 flex flex-row font-sans">
      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-2">
          <div className={`px-5 py-3 rounded-xl shadow-2xl text-xs font-bold text-white flex items-center gap-2.5 ${
            toastMessage.isError ? 'bg-rose-600' : 'bg-slate-900 border border-slate-700'
          }`}>
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMessage.msg}</span>
          </div>
        </div>
      )}

      {/* LEFT SIDEBAR (Dark CoreUI styling) */}
      <aside
        className={`${
          sidebarOpen ? 'w-64' : 'w-20'
        } shrink-0 bg-[#212631] text-slate-300 transition-all duration-300 flex flex-col z-30 sticky top-0 h-screen select-none border-r border-[#1e222d]`}
      >
        {/* Brand / Logo Top */}
        <div className="h-16 px-5 flex items-center justify-between border-b border-[#2b303b] bg-[#1e222d]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-md font-black text-sm">
              <span className="tracking-tighter">N</span>
            </div>
            {sidebarOpen && (
              <div className="leading-tight">
                <span className="font-bold text-white text-sm tracking-wider uppercase block">
                  CORE<span className="text-indigo-400 font-black">UI</span>
                </span>
                <span className="text-[10px] font-semibold text-slate-400 tracking-widest uppercase">
                  REACT.JS
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Nav Items */}
        <div className="flex-1 overflow-y-auto py-4 space-y-6 px-3">
          {/* Main Dashboard item */}
          <div>
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-[#2a303d] text-white shadow-sm border-l-4 border-indigo-500'
                  : 'text-slate-400 hover:text-white hover:bg-[#282d38]'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 text-indigo-400 shrink-0" />
              {sidebarOpen && (
                <div className="flex-1 flex items-center justify-between text-left">
                  <span>Dashboard</span>
                  <span className="bg-[#321fdb] text-white text-[9px] font-black px-1.5 py-0.5 rounded tracking-wider uppercase">
                    NEW
                  </span>
                </div>
              )}
            </button>
          </div>

          {/* Section: STORE MANAGEMENT */}
          <div>
            {sidebarOpen && (
              <span className="px-3 text-[10px] font-bold tracking-widest uppercase text-slate-500 block mb-2">
                STORE MANAGEMENT
              </span>
            )}
            <div className="space-y-1">
              <button
                onClick={() => setActiveTab('products')}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === 'products'
                    ? 'bg-[#2a303d] text-white border-l-4 border-indigo-500'
                    : 'text-slate-400 hover:text-white hover:bg-[#282d38]'
                }`}
              >
                <ShoppingBag className="w-4 h-4 shrink-0" />
                {sidebarOpen && (
                  <div className="flex-1 flex items-center justify-between text-left">
                    <span>Products</span>
                    <span className="bg-[#2eb85c] text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                      {products.length}
                    </span>
                  </div>
                )}
              </button>

              <button
                onClick={() => setActiveTab('orders')}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === 'orders'
                    ? 'bg-[#2a303d] text-white border-l-4 border-indigo-500'
                    : 'text-slate-400 hover:text-white hover:bg-[#282d38]'
                }`}
              >
                <Package className="w-4 h-4 shrink-0" />
                {sidebarOpen && (
                  <div className="flex-1 flex items-center justify-between text-left">
                    <span>Orders</span>
                    <span className="bg-[#e55353] text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                      {orders.length}
                    </span>
                  </div>
                )}
              </button>

              <button
                onClick={() => setActiveTab('categories')}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === 'categories'
                    ? 'bg-[#2a303d] text-white border-l-4 border-indigo-500'
                    : 'text-slate-400 hover:text-white hover:bg-[#282d38]'
                }`}
              >
                <Layers className="w-4 h-4 shrink-0" />
                {sidebarOpen && <span>Categories</span>}
              </button>
            </div>
          </div>

          {/* Section: EXTRAS */}
          <div>
            {sidebarOpen && (
              <span className="px-3 text-[10px] font-bold tracking-widest uppercase text-slate-500 block mb-2">
                EXTRAS
              </span>
            )}
            <div className="space-y-1">
              <Link
                to="/"
                className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-semibold text-slate-400 hover:text-white hover:bg-[#282d38] transition-all"
              >
                <ExternalLink className="w-4 h-4 shrink-0 text-amber-400" />
                {sidebarOpen && <span>View Storefront</span>}
              </Link>
            </div>
          </div>
        </div>

        {/* Sidebar Footer collapse button */}
        <div className="p-3 border-t border-[#2b303b] bg-[#1e222d]">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-full py-2 flex items-center justify-center text-slate-400 hover:text-white hover:bg-[#282d38] rounded-lg transition-colors text-xs"
          >
            <ChevronRight className={`w-4 h-4 transition-transform duration-300 ${sidebarOpen ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </aside>

      {/* RIGHT MAIN VIEW AREA */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* TOP NAVBAR (Clean White CoreUI Header) */}
        <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-20 shadow-xs">
          {/* Left: Hamburger & Search */}
          <div className="flex items-center gap-5">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-1.5 text-slate-500 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="relative hidden sm:flex items-center">
              <input
                type="text"
                placeholder="Search..."
                className="bg-slate-50 text-xs text-slate-800 placeholder-slate-400 pl-9 pr-14 py-2 rounded-lg border border-slate-200 focus:bg-white focus:outline-none focus:border-indigo-500 w-64"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 pointer-events-none" />
              <span className="absolute right-2.5 text-[10px] font-bold text-slate-400 bg-slate-200/70 px-1.5 py-0.5 rounded">
                Ctrl /
              </span>
            </div>
          </div>

          {/* Right: Icons & User Avatar */}
          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-colors relative">
              <Bell className="w-4 h-4" />
              <span className="w-2 h-2 rounded-full bg-indigo-600 absolute top-1.5 right-1.5" />
            </button>

            <button className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-colors relative">
              <Mail className="w-4 h-4" />
              <span className="w-2 h-2 rounded-full bg-emerald-500 absolute top-1.5 right-1.5" />
            </button>

            <button className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-colors">
              <ListChecks className="w-4 h-4" />
            </button>

            <button className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-colors">
              <Sun className="w-4 h-4" />
            </button>

            <div className="h-6 w-px bg-slate-200 mx-1" />

            {/* Admin Avatar Menu */}
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2.5 p-1 rounded-full hover:ring-2 hover:ring-indigo-500/20 transition-all"
              >
                <div className="relative">
                  <img
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80"
                    alt="Admin Avatar"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white absolute bottom-0 right-0" />
                </div>
              </button>

              {userDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in"
                  onMouseLeave={() => setUserDropdownOpen(false)}
                >
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="text-xs font-bold text-slate-900">{user?.name || 'Administrator'}</p>
                    <p className="text-[11px] text-slate-500 truncate">{user?.email}</p>
                  </div>
                  <Link
                    to="/"
                    className="flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                    <span>View Storefront</span>
                  </Link>
                  <button
                    onClick={logout}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 text-left"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* BREADCRUMB BAR (Home / Dashboard) */}
        <div className="bg-white border-b border-slate-200/80 px-8 py-3">
          <div className="flex items-center gap-2 text-xs">
            <Link to="/" className="text-indigo-600 font-semibold hover:underline">
              Home
            </Link>
            <span className="text-slate-400">/</span>
            <span className="text-slate-500 font-medium capitalize">
              {activeTab}
            </span>
          </div>
        </div>

        {/* MAIN BODY CONTENT CONTAINER */}
        <main className="p-8 space-y-8 flex-1">
          {activeTab === 'dashboard' && (
            <>
              {/* THE 4 SIGNATURE COLORFUL CARDS (Exact match to CoreUI screenshot) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* CARD 1: PURPLE / INDIGO (Users) */}
                <div className="bg-[#5856d6] text-white rounded-xl p-5 shadow-sm relative overflow-hidden flex flex-col justify-between h-44">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold tracking-tight">
                          {metrics.total_customers > 0 ? `${metrics.total_customers}K` : '26K'}
                        </span>
                        <span className="text-xs font-semibold text-white/80">
                          (-12.4% ↓)
                        </span>
                      </div>
                      <p className="text-xs font-medium text-white/90 mt-0.5">Users</p>
                    </div>
                    <button className="text-white/80 hover:text-white p-1">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Wave Sparkline SVG */}
                  <div className="h-16 w-full -mx-5 -mb-5 mt-auto">
                    <svg viewBox="0 0 200 60" className="w-full h-full preserve-3d" preserveAspectRatio="none">
                      <path
                        d="M0,35 Q30,45 60,30 T120,40 T160,20 T200,35"
                        fill="none"
                        stroke="rgba(255,255,255,0.7)"
                        strokeWidth="2.5"
                      />
                      {/* Dots */}
                      <circle cx="30" cy="40" r="3" fill="#fff" />
                      <circle cx="90" cy="35" r="3" fill="#fff" />
                      <circle cx="150" cy="22" r="3" fill="#fff" />
                      <circle cx="190" cy="32" r="3" fill="#fff" />
                    </svg>
                  </div>
                </div>

                {/* CARD 2: BLUE (Income / Revenue) */}
                <div className="bg-[#3399ff] text-white rounded-xl p-5 shadow-sm relative overflow-hidden flex flex-col justify-between h-44">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold tracking-tight">
                          ${metrics.total_revenue > 0 ? metrics.total_revenue.toLocaleString() : '6.200'}
                        </span>
                        <span className="text-xs font-semibold text-white/80">
                          (40.9% ↑)
                        </span>
                      </div>
                      <p className="text-xs font-medium text-white/90 mt-0.5">Income</p>
                    </div>
                    <button className="text-white/80 hover:text-white p-1">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Wave Sparkline SVG */}
                  <div className="h-16 w-full -mx-5 -mb-5 mt-auto">
                    <svg viewBox="0 0 200 60" className="w-full h-full" preserveAspectRatio="none">
                      <path
                        d="M0,45 Q40,40 80,48 T140,25 T200,30"
                        fill="none"
                        stroke="rgba(255,255,255,0.7)"
                        strokeWidth="2.5"
                      />
                      <circle cx="40" cy="42" r="3" fill="#fff" />
                      <circle cx="110" cy="38" r="3" fill="#fff" />
                      <circle cx="170" cy="28" r="3" fill="#fff" />
                    </svg>
                  </div>
                </div>

                {/* CARD 3: AMBER / YELLOW (Conversion Rate) */}
                <div className="bg-[#f9b115] text-white rounded-xl p-5 shadow-sm relative overflow-hidden flex flex-col justify-between h-44">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold tracking-tight">
                          2.49%
                        </span>
                        <span className="text-xs font-semibold text-white/80">
                          (84.7% ↑)
                        </span>
                      </div>
                      <p className="text-xs font-medium text-white/90 mt-0.5">Conversion Rate</p>
                    </div>
                    <button className="text-white/80 hover:text-white p-1">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Filled Area Wave SVG */}
                  <div className="h-16 w-full -mx-5 -mb-5 mt-auto">
                    <svg viewBox="0 0 200 60" className="w-full h-full" preserveAspectRatio="none">
                      <path
                        d="M0,20 Q50,45 100,20 T200,45 L200,60 L0,60 Z"
                        fill="rgba(255,255,255,0.25)"
                      />
                      <path
                        d="M0,20 Q50,45 100,20 T200,45"
                        fill="none"
                        stroke="rgba(255,255,255,0.8)"
                        strokeWidth="2"
                      />
                    </svg>
                  </div>
                </div>

                {/* CARD 4: CORAL RED (Sessions) */}
                <div className="bg-[#e55353] text-white rounded-xl p-5 shadow-sm relative overflow-hidden flex flex-col justify-between h-44">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold tracking-tight">
                          44K
                        </span>
                        <span className="text-xs font-semibold text-white/80">
                          (-23.6% ↓)
                        </span>
                      </div>
                      <p className="text-xs font-medium text-white/90 mt-0.5">Sessions</p>
                    </div>
                    <button className="text-white/80 hover:text-white p-1">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Bar Chart Bars SVG */}
                  <div className="h-14 w-full -mx-5 -mb-5 mt-auto flex items-end justify-between px-6 pb-2 gap-1.5 opacity-60">
                    {[35, 60, 45, 75, 40, 80, 50, 95, 65, 40, 85, 55, 70, 90, 60, 75, 50, 85, 65, 40].map((h, i) => (
                      <div
                        key={i}
                        className="flex-1 bg-white rounded-t-xs"
                        style={{ height: `${h}%` }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* MAIN TRAFFIC / ANALYTICS CHART CARD (Exact match to screenshot) */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                {/* Card Header */}
                <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-bold text-slate-800 tracking-tight">Traffic</h2>
                    <p className="text-xs text-slate-400 font-medium mt-0.5">
                      October 2025 - April 2026
                    </p>
                  </div>

                  {/* Timeframe Button Group & Download Action */}
                  <div className="flex items-center gap-3">
                    <div className="inline-flex rounded-lg border border-slate-200 p-0.5 bg-slate-50 text-xs font-semibold text-slate-600">
                      {['Day', 'Month', 'Year'].map((tf) => (
                        <button
                          key={tf}
                          onClick={() => setChartTimeframe(tf)}
                          className={`px-3.5 py-1.5 rounded-md transition-all ${
                            chartTimeframe === tf
                              ? 'bg-slate-700 text-white shadow-xs'
                              : 'hover:text-slate-900'
                          }`}
                        >
                          {tf}
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={() => notify('Analytics report downloaded!')}
                      className="p-2 rounded-lg bg-[#5856d6] text-white hover:bg-[#4845c4] shadow-xs transition-colors"
                      title="Download analytics"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Smooth Bezier Curves SVG Chart */}
                <div className="p-6">
                  <div className="relative h-64 w-full">
                    <svg viewBox="0 0 800 240" className="w-full h-full" preserveAspectRatio="none">
                      {/* Horizontal Grid lines */}
                      {[0, 50, 100, 150, 200].map((val, idx) => {
                        const y = 200 - (val / 250) * 200;
                        return (
                          <g key={idx}>
                            <line
                              x1="40"
                              y1={y}
                              x2="780"
                              y2={y}
                              stroke="#e2e8f0"
                              strokeWidth="1"
                            />
                            <text
                              x="25"
                              y={y + 4}
                              fill="#94a3b8"
                              fontSize="10"
                              textAnchor="end"
                              fontFamily="sans-serif"
                            >
                              {val}
                            </text>
                          </g>
                        );
                      })}

                      {/* Dashed Threshold Line */}
                      <line
                        x1="40"
                        y1="130"
                        x2="780"
                        y2="130"
                        stroke="#f43f5e"
                        strokeDasharray="4 4"
                        strokeWidth="1.2"
                      />

                      {/* Smooth Curve Line 1 (Blue) */}
                      <path
                        d="M40,110 C160,80 260,140 380,120 C500,100 580,140 680,115 C720,105 760,100 780,95"
                        fill="none"
                        stroke="#3399ff"
                        strokeWidth="2.5"
                      />

                      {/* Smooth Curve Line 2 (Green) */}
                      <path
                        d="M40,150 C160,150 260,120 380,145 C480,170 540,95 620,105 C700,115 750,110 780,110"
                        fill="none"
                        stroke="#2eb85c"
                        strokeWidth="2.5"
                      />

                      {/* X-Axis Month Labels */}
                      {['January', 'February', 'March', 'April', 'May', 'June', 'July'].map((m, i) => {
                        const x = 40 + i * (740 / 6);
                        return (
                          <text
                            key={i}
                            x={x}
                            y="235"
                            fill="#64748b"
                            fontSize="11"
                            textAnchor="middle"
                            fontWeight="500"
                          >
                            {m}
                          </text>
                        );
                      })}
                    </svg>
                  </div>
                </div>

                {/* Chart Footer: 5 KPI Progress Columns (Identical to screenshot) */}
                <div className="border-t border-slate-100 grid grid-cols-2 sm:grid-cols-5 divide-y sm:divide-y-0 sm:divide-x divide-slate-100 text-center py-5 px-4 bg-slate-50/50">
                  <div className="p-3">
                    <span className="text-xs text-slate-500 font-semibold block">Visits</span>
                    <span className="text-sm font-bold text-slate-800 block mt-0.5">29.703 Users (40%)</span>
                    <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2.5 overflow-hidden">
                      <div className="bg-[#2eb85c] h-full rounded-full" style={{ width: '40%' }} />
                    </div>
                  </div>

                  <div className="p-3">
                    <span className="text-xs text-slate-500 font-semibold block">Unique</span>
                    <span className="text-sm font-bold text-slate-800 block mt-0.5">24.093 Users (20%)</span>
                    <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2.5 overflow-hidden">
                      <div className="bg-[#3399ff] h-full rounded-full" style={{ width: '20%' }} />
                    </div>
                  </div>

                  <div className="p-3">
                    <span className="text-xs text-slate-500 font-semibold block">Pageviews</span>
                    <span className="text-sm font-bold text-slate-800 block mt-0.5">78.706 Views (60%)</span>
                    <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2.5 overflow-hidden">
                      <div className="bg-[#f9b115] h-full rounded-full" style={{ width: '60%' }} />
                    </div>
                  </div>

                  <div className="p-3">
                    <span className="text-xs text-slate-500 font-semibold block">New Users</span>
                    <span className="text-sm font-bold text-slate-800 block mt-0.5">22.123 Users (80%)</span>
                    <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2.5 overflow-hidden">
                      <div className="bg-[#e55353] h-full rounded-full" style={{ width: '80%' }} />
                    </div>
                  </div>

                  <div className="p-3">
                    <span className="text-xs text-slate-500 font-semibold block">Bounce Rate</span>
                    <span className="text-sm font-bold text-slate-800 block mt-0.5">Average Rate (40.15%)</span>
                    <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2.5 overflow-hidden">
                      <div className="bg-[#5856d6] h-full rounded-full" style={{ width: '40.15%' }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* RECENT ORDERS & QUICK ACTIONS */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <h3 className="text-base font-bold text-slate-800">Recent Customer Orders</h3>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className="text-xs font-bold text-indigo-600 hover:underline"
                  >
                    View All Orders →
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="text-slate-400 uppercase border-b border-slate-100 pb-2">
                        <th className="pb-3 font-semibold">Order</th>
                        <th className="pb-3 font-semibold">Customer</th>
                        <th className="pb-3 font-semibold">Total</th>
                        <th className="pb-3 font-semibold">Status</th>
                        <th className="pb-3 font-semibold text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {stats?.recent_orders?.map((ord) => (
                        <tr key={ord.id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="py-3 font-bold font-mono text-slate-800">{ord.order_number}</td>
                          <td className="py-3 font-medium text-slate-700">{ord.customer_name}</td>
                          <td className="py-3 font-bold text-slate-900">${parseFloat(ord.total_amount).toFixed(2)}</td>
                          <td className="py-3">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              ord.status === 'delivered' ? 'bg-emerald-100 text-emerald-800' :
                              ord.status === 'shipped' ? 'bg-indigo-100 text-indigo-800' :
                              ord.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                              'bg-amber-100 text-amber-800'
                            }`}>
                              {ord.status}
                            </span>
                          </td>
                          <td className="py-3 text-right">
                            <select
                              value={ord.status}
                              onChange={(e) => handleUpdateOrderStatus(ord.id, e.target.value)}
                              className="text-[11px] bg-slate-50 border border-slate-200 rounded px-2 py-1 outline-none"
                            >
                              <option value="pending">Pending</option>
                              <option value="processing">Processing</option>
                              <option value="shipped">Shipped</option>
                              <option value="delivered">Delivered</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* TAB: PRODUCTS */}
          {activeTab === 'products' && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                  <h2 className="text-lg font-bold text-slate-800">Products Catalog</h2>
                  <p className="text-xs text-slate-400">Manage store items, inventory, and prices</p>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    className="bg-slate-50 text-xs px-3 py-2 rounded-lg border border-slate-200 w-48"
                  />
                  <button
                    onClick={() => handleOpenProductModal()}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Product</span>
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="text-slate-400 uppercase border-b border-slate-100 pb-2">
                      <th className="pb-3 font-semibold">Item</th>
                      <th className="pb-3 font-semibold">Category</th>
                      <th className="pb-3 font-semibold">Price</th>
                      <th className="pb-3 font-semibold">Stock</th>
                      <th className="pb-3 font-semibold">Status</th>
                      <th className="pb-3 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredProducts.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3">
                          <div className="flex items-center gap-3">
                            <img src={p.image} alt="" className="w-10 h-10 rounded-lg object-cover border border-slate-100" />
                            <div>
                              <p className="font-bold text-slate-800 text-xs line-clamp-1">{p.name}</p>
                              <span className="text-[10px] text-slate-400">/{p.slug}</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 font-medium text-slate-600">{p.category?.name}</td>
                        <td className="py-3 font-bold text-slate-900">${parseFloat(p.price).toFixed(2)}</td>
                        <td className="py-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            p.stock <= 15 ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700'
                          }`}>
                            {p.stock} units
                          </span>
                        </td>
                        <td className="py-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            p.is_active ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'
                          }`}>
                            {p.is_active ? 'Active' : 'Draft'}
                          </span>
                        </td>
                        <td className="py-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleOpenProductModal(p)}
                              className="p-1.5 text-slate-500 hover:text-indigo-600 rounded hover:bg-slate-100"
                              title="Edit"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(p.id, p.name)}
                              className="p-1.5 text-slate-500 hover:text-rose-600 rounded hover:bg-slate-100"
                              title="Delete"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB: ORDERS */}
          {activeTab === 'orders' && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                  <h2 className="text-lg font-bold text-slate-800">Orders Management</h2>
                  <p className="text-xs text-slate-400">Track shipments and update delivery statuses</p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500 font-semibold">Filter:</span>
                  <select
                    value={orderFilter}
                    onChange={async (e) => {
                      const val = e.target.value;
                      setOrderFilter(val);
                      const res = await api.admin.getOrders({ status: val || undefined });
                      setOrders(res.data || []);
                    }}
                    className="bg-slate-50 text-xs px-2.5 py-1.5 rounded-lg border border-slate-200"
                  >
                    <option value="">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="text-slate-400 uppercase border-b border-slate-100 pb-2">
                      <th className="pb-3 font-semibold">Order ID</th>
                      <th className="pb-3 font-semibold">Customer</th>
                      <th className="pb-3 font-semibold">Address</th>
                      <th className="pb-3 font-semibold">Total</th>
                      <th className="pb-3 font-semibold">Payment</th>
                      <th className="pb-3 font-semibold text-right">Status Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {orders.map((ord) => (
                      <tr key={ord.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3 font-bold font-mono text-slate-800">{ord.order_number}</td>
                        <td className="py-3">
                          <p className="font-bold text-slate-800">{ord.customer_name}</p>
                          <p className="text-[10px] text-slate-400">{ord.customer_email}</p>
                        </td>
                        <td className="py-3 text-slate-600 max-w-xs truncate">{ord.shipping_address}</td>
                        <td className="py-3 font-black text-slate-900">${parseFloat(ord.total_amount).toFixed(2)}</td>
                        <td className="py-3">
                          <span className="capitalize font-semibold text-slate-700 block">{ord.payment_method}</span>
                          <span className="text-[10px] font-bold text-emerald-600">{ord.payment_status?.toUpperCase()}</span>
                        </td>
                        <td className="py-3 text-right">
                          <select
                            value={ord.status}
                            onChange={(e) => handleUpdateOrderStatus(ord.id, e.target.value)}
                            className="bg-slate-50 border border-slate-200 rounded px-2.5 py-1 text-xs"
                          >
                            <option value="pending">Pending</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB: CATEGORIES */}
          {activeTab === 'categories' && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <h2 className="text-lg font-bold text-slate-800">Categories</h2>
                  <p className="text-xs text-slate-400">Organize store departments</p>
                </div>
                <button
                  onClick={() => setCategoryModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-indigo-600 text-white text-xs font-bold"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Category</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {categories.map((c) => (
                  <div key={c.id} className="p-4 rounded-xl border border-slate-200 flex items-center gap-3.5 bg-slate-50">
                    <img src={c.image} alt="" className="w-12 h-12 rounded-lg object-cover" />
                    <div>
                      <h4 className="font-bold text-xs text-slate-800">{c.name}</h4>
                      <p className="text-[10px] text-slate-400">Slug: {c.slug}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* PRODUCT MODAL */}
      {productModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-sm text-slate-900">
                {editingProduct ? 'Edit Product' : 'Add Product'}
              </h3>
              <button onClick={() => setProductModalOpen(false)}><X className="w-4 h-4 text-slate-400" /></button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-3.5 text-xs font-semibold text-slate-700">
              <div>
                <label className="block mb-1">Product Title *</label>
                <input
                  type="text"
                  required
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  className="w-full bg-slate-50 px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-500 font-normal"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1">Category *</label>
                  <select
                    value={productForm.category_id}
                    onChange={(e) => setProductForm({ ...productForm, category_id: e.target.value })}
                    className="w-full bg-slate-50 px-3 py-2 rounded-lg border border-slate-200 font-normal"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block mb-1">Stock Units *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={productForm.stock}
                    onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                    className="w-full bg-slate-50 px-3 py-2 rounded-lg border border-slate-200 font-normal"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1">Price ($) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                    className="w-full bg-slate-50 px-3 py-2 rounded-lg border border-slate-200 font-normal"
                  />
                </div>
                <div>
                  <label className="block mb-1">Compare Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={productForm.compare_at_price}
                    onChange={(e) => setProductForm({ ...productForm, compare_at_price: e.target.value })}
                    className="w-full bg-slate-50 px-3 py-2 rounded-lg border border-slate-200 font-normal"
                  />
                </div>
              </div>

              <div>
                <label className="block mb-1">Image URL</label>
                <input
                  type="url"
                  value={productForm.image}
                  onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                  placeholder="https://..."
                  className="w-full bg-slate-50 px-3 py-2 rounded-lg border border-slate-200 font-normal"
                />
              </div>

              <div>
                <label className="block mb-1">Short Summary</label>
                <input
                  type="text"
                  value={productForm.short_description}
                  onChange={(e) => setProductForm({ ...productForm, short_description: e.target.value })}
                  className="w-full bg-slate-50 px-3 py-2 rounded-lg border border-slate-200 font-normal"
                />
              </div>

              <div className="flex items-center gap-4 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs">
                  <input
                    type="checkbox"
                    checked={productForm.is_featured}
                    onChange={(e) => setProductForm({ ...productForm, is_featured: e.target.checked })}
                    className="rounded text-indigo-600"
                  />
                  <span>Featured Product</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-xs">
                  <input
                    type="checkbox"
                    checked={productForm.is_active}
                    onChange={(e) => setProductForm({ ...productForm, is_active: e.target.checked })}
                    className="rounded text-indigo-600"
                  />
                  <span>Active & Listed</span>
                </label>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setProductModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-indigo-600 text-white font-bold"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CATEGORY MODAL */}
      {categoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-sm text-slate-900">Add Category</h3>
              <button onClick={() => setCategoryModalOpen(false)}><X className="w-4 h-4 text-slate-400" /></button>
            </div>

            <form onSubmit={handleSaveCategory} className="space-y-3.5 text-xs font-semibold text-slate-700">
              <div>
                <label className="block mb-1">Name *</label>
                <input
                  type="text"
                  required
                  value={categoryForm.name}
                  onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                  placeholder="e.g. Smart Wearables"
                  className="w-full bg-slate-50 px-3 py-2 rounded-lg border border-slate-200 font-normal"
                />
              </div>

              <div>
                <label className="block mb-1">Cover Image URL</label>
                <input
                  type="url"
                  value={categoryForm.image}
                  onChange={(e) => setCategoryForm({ ...categoryForm, image: e.target.value })}
                  placeholder="https://..."
                  className="w-full bg-slate-50 px-3 py-2 rounded-lg border border-slate-200 font-normal"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setCategoryModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-indigo-600 text-white font-bold"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
