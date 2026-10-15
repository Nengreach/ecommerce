import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../api/client';
import ProductCard from '../components/ProductCard';
import { Filter, SlidersHorizontal, Search, X } from 'lucide-react';

export default function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const selectedCategory = searchParams.get('category') || '';
  const searchQuery = searchParams.get('search') || '';
  const currentSort = searchParams.get('sort') || 'latest';
  const onlyFeatured = searchParams.get('featured') === 'true';

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  // Fetch categories
  useEffect(() => {
    api.categories.getAll()
      .then(res => setCategories(res.data || []))
      .catch(err => console.error(err));
  }, []);

  // Fetch products on filter change
  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true);
        const params = {
          category: selectedCategory || undefined,
          search: searchQuery || undefined,
          sort: currentSort,
          featured: onlyFeatured ? true : undefined,
          per_page: 24,
        };
        const res = await api.products.getAll(params);
        setProducts(res.data || []);
        setTotalCount(res.total || res.data?.length || 0);
      } catch (err) {
        console.error('Failed to load products:', err);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, [selectedCategory, searchQuery, currentSort, onlyFeatured]);

  const updateParam = (key, value) => {
    const nextParams = new URLSearchParams(searchParams);
    if (value) {
      nextParams.set(key, value);
    } else {
      nextParams.delete(key);
    }
    setSearchParams(nextParams);
  };

  const clearAllFilters = () => {
    setSearchParams(new URLSearchParams());
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Title & Breadcrumb */}
      <div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          {selectedCategory
            ? (categories.find(c => c.slug === selectedCategory)?.name || 'Category')
            : searchQuery
            ? `Search Results for "${searchQuery}"`
            : 'All Products'}
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          Showing {products.length} of {totalCount} premium items
        </p>
      </div>

      {/* Control bar: Categories tabs & Sort options */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2 lg:pb-0">
          <button
            onClick={() => updateParam('category', '')}
            className={`px-4 py-2 rounded-2xl text-xs font-bold shrink-0 transition-all ${
              !selectedCategory
                ? 'bg-slate-900 text-white shadow-md'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            All Products
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => updateParam('category', cat.slug)}
              className={`px-4 py-2 rounded-2xl text-xs font-bold shrink-0 transition-all ${
                selectedCategory === cat.slug
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Sort Select */}
        <div className="flex items-center gap-3 shrink-0">
          <SlidersHorizontal className="w-4 h-4 text-slate-600" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Sort By:</span>
          <select
            value={currentSort}
            onChange={(e) => updateParam('sort', e.target.value)}
            className="bg-white border border-slate-200 text-slate-800 text-xs font-semibold rounded-xl px-3 py-2 outline-none focus:border-indigo-500 cursor-pointer"
          >
            <option value="latest">Newest First</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
          </select>
        </div>
      </div>

      {/* Active Filter Chips */}
      {(selectedCategory || searchQuery || onlyFeatured) && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-bold text-slate-600">Active filters:</span>
          {selectedCategory && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-xs font-bold text-indigo-700">
              Category: {categories.find(c => c.slug === selectedCategory)?.name || selectedCategory}
              <button onClick={() => updateParam('category', '')}><X className="w-3.5 h-3.5" /></button>
            </span>
          )}
          {searchQuery && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-300 text-xs font-bold text-slate-800">
              Query: "{searchQuery}"
              <button onClick={() => updateParam('search', '')}><X className="w-3.5 h-3.5" /></button>
            </span>
          )}
          <button
            onClick={clearAllFilters}
            className="text-xs font-bold text-rose-600 hover:underline ml-2"
          >
            Clear all
          </button>
        </div>
      )}

      {/* Products Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="h-96 rounded-3xl bg-slate-200/60 animate-pulse" />
          ))}
        </div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-24 bg-white rounded-3xl border border-slate-200 p-8">
          <Search className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-800">No products found</h3>
          <p className="text-sm text-slate-600 max-w-sm mx-auto mt-1 mb-6">
            We couldn't find any items matching your selected criteria. Try adjusting your search or filters.
          </p>
          <button
            onClick={clearAllFilters}
            className="px-5 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors"
          >
            Reset All Filters
          </button>
        </div>
      )}
    </div>
  );
}
