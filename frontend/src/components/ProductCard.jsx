import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Star, ShoppingBag, Check } from 'lucide-react';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);

  const price = parseFloat(product.price);
  const comparePrice = product.compare_at_price ? parseFloat(product.compare_at_price) : null;
  const discountPercent = comparePrice && comparePrice > price
    ? Math.round(((comparePrice - price) / comparePrice) * 100)
    : null;

  const handleAdd = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      setAdding(true);
      await addToCart(product.id, 1, product.name);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } catch (err) {
      console.error(err);
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="group relative bg-white rounded-3xl border border-slate-200/80 hover:border-slate-300 hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300 flex flex-col overflow-hidden">
      {/* Thumbnail Area */}
      <Link to={`/products/${product.slug}`} className="relative aspect-square overflow-hidden bg-slate-100 block">
        <img
          src={product.image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80'}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {discountPercent && (
            <span className="bg-rose-500 text-white text-[11px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm">
              -{discountPercent}%
            </span>
          )}
          {product.is_featured && !discountPercent && (
            <span className="bg-indigo-600 text-white text-[11px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm">
              Featured
            </span>
          )}
        </div>

        {/* Quick Add overlay button on mobile/desktop */}
        <button
          onClick={handleAdd}
          disabled={adding}
          className={`absolute bottom-3 right-3 p-3 rounded-2xl shadow-lg transition-all duration-200 flex items-center justify-center ${
            added
              ? 'bg-emerald-600 text-white'
              : 'bg-white/95 text-slate-800 hover:bg-indigo-600 hover:text-white backdrop-blur-sm'
          }`}
          title="Add to cart"
        >
          {added ? (
            <Check className="w-5 h-5 text-white" />
          ) : (
            <ShoppingBag className="w-5 h-5" />
          )}
        </button>
      </Link>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between gap-3">
        <div>
          {/* Category */}
          {product.category && (
            <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 mb-1.5 block">
              {product.category.name}
            </span>
          )}

          {/* Title */}
          <Link to={`/products/${product.slug}`}>
            <h3 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-2 text-base leading-snug">
              {product.name}
            </h3>
          </Link>
        </div>

        {/* Rating and Reviews */}
        <div className="flex items-center gap-1.5 text-xs text-slate-600">
          <div className="flex items-center text-amber-400">
            <Star className="w-4 h-4 fill-amber-400" />
          </div>
          <span className="font-bold text-slate-800">{parseFloat(product.rating || 5).toFixed(1)}</span>
          <span className="text-slate-600">({product.review_count || 0})</span>
        </div>

        {/* Pricing */}
        <div className="flex items-baseline gap-2 pt-1 border-t border-slate-100">
          <span className="text-lg font-black text-slate-900">
            ${price.toFixed(2)}
          </span>
          {comparePrice && comparePrice > price && (
            <span className="text-sm font-semibold text-slate-600 line-through">
              ${comparePrice.toFixed(2)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
