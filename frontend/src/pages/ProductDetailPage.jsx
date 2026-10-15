import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../api/client';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';
import {
  Star,
  ShoppingBag,
  ShieldCheck,
  Truck,
  RotateCcw,
  Minus,
  Plus,
  Check,
  ChevronRight,
  ArrowLeft,
} from 'lucide-react';

export default function ProductDetailPage() {
  const { slug } = useParams();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [activeImage, setActiveImage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    async function loadProduct() {
      try {
        setLoading(true);
        const res = await api.products.getByIdOrSlug(slug);
        setProduct(res.data);
        setRelated(res.related || []);
        setActiveImage(res.data.image);
        setQuantity(1);
      } catch (err) {
        console.error('Error loading product details:', err);
      } finally {
        setLoading(false);
      }
    }
    loadProduct();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug]);

  const handleAddToCart = async () => {
    if (!product) return;
    try {
      setAdding(true);
      await addToCart(product.id, quantity, product.name);
      setAdded(true);
      setTimeout(() => setAdded(false), 2500);
    } catch (err) {
      console.error(err);
    } finally {
      setAdding(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 animate-pulse">
          <div className="aspect-square bg-slate-200/70 rounded-3xl" />
          <div className="space-y-6">
            <div className="h-8 bg-slate-200/70 rounded-xl w-3/4" />
            <div className="h-6 bg-slate-200/70 rounded-lg w-1/4" />
            <div className="h-24 bg-slate-200/70 rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <h2 className="text-2xl font-bold text-slate-800">Product Not Found</h2>
        <p className="text-sm text-slate-500 mt-2 mb-6">The item you are searching for does not exist or has been retired.</p>
        <Link to="/shop" className="px-6 py-3 rounded-2xl bg-indigo-600 text-white font-bold text-sm">
          Return to Shop
        </Link>
      </div>
    );
  }

  const price = parseFloat(product.price);
  const comparePrice = product.compare_at_price ? parseFloat(product.compare_at_price) : null;
  const allImages = [product.image, ...(product.images || []).map(img => img.image_url)].filter(Boolean);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs font-semibold text-slate-600">
        <Link to="/" className="hover:text-indigo-600">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link to="/shop" className="hover:text-indigo-600">Shop</Link>
        {product.category && (
          <>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link to={`/shop?category=${product.category.slug}`} className="hover:text-indigo-600">
              {product.category.name}
            </Link>
          </>
        )}
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-slate-900 truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Product Main Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Images Gallery */}
        <div className="lg:col-span-7 space-y-4">
          <div className="aspect-square bg-slate-100 rounded-3xl overflow-hidden border border-slate-200/80 shadow-md">
            <img
              src={activeImage || product.image}
              alt={product.name}
              className="w-full h-full object-cover object-center"
            />
          </div>

          {allImages.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {allImages.map((imgUrl, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(imgUrl)}
                  className={`w-20 h-20 rounded-2xl overflow-hidden border-2 shrink-0 transition-all ${
                    activeImage === imgUrl ? 'border-indigo-600 shadow-md' : 'border-slate-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={imgUrl} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Details & Purchase Actions */}
        <div className="lg:col-span-5 space-y-6">
          <div>
            {product.category && (
              <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 block mb-2">
                {product.category.name}
              </span>
            )}
            <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-snug">
              {product.name}
            </h1>

            {/* Rating and Stock */}
            <div className="flex items-center gap-3 mt-3">
              <div className="flex items-center gap-1 bg-amber-50 px-2.5 py-1 rounded-full text-xs font-bold text-amber-700">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{parseFloat(product.rating || 5).toFixed(1)}</span>
                <span className="text-amber-500 font-medium">({product.review_count || 0} reviews)</span>
              </div>

              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700">
                In Stock ({product.stock} units available)
              </span>
            </div>
          </div>

          {/* Pricing */}
          <div className="flex items-baseline gap-3 pt-2">
            <span className="text-3xl sm:text-4xl font-black text-slate-900">
              ${price.toFixed(2)}
            </span>
            {comparePrice && comparePrice > price && (
              <span className="text-lg font-semibold text-slate-600 line-through">
                ${comparePrice.toFixed(2)}
              </span>
            )}
          </div>

          {/* Short Description */}
          {product.short_description && (
            <p className="text-sm text-slate-600 leading-relaxed font-normal">
              {product.short_description}
            </p>
          )}

          {/* Action Row: Quantity & Add to Cart */}
          <div className="pt-4 border-t border-slate-200/80 space-y-4">
            <div className="flex items-center gap-4">
              {/* Quantity Picker */}
              <div className="flex items-center border border-slate-200 rounded-2xl bg-white p-1">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-600 hover:bg-slate-100 transition-colors"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-10 text-center font-bold text-sm text-slate-900">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-600 hover:bg-slate-100 transition-colors"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Add to Bag CTA */}
              <button
                onClick={handleAddToCart}
                disabled={adding}
                className={`flex-1 py-3.5 px-6 rounded-2xl font-bold text-sm flex items-center justify-center gap-2.5 transition-all shadow-xl ${
                  added
                    ? 'bg-emerald-600 text-white shadow-emerald-600/30'
                    : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30 hover:-translate-y-0.5'
                }`}
              >
                {added ? (
                  <>
                    <Check className="w-5 h-5 text-white" />
                    <span>Added to Bag!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-5 h-5" />
                    <span>Add to Bag • ${(price * quantity).toFixed(2)}</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Trust Guarantees */}
          <div className="grid grid-cols-3 gap-2 pt-6 border-t border-slate-100 text-center text-xs text-slate-600 font-medium">
            <div className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-slate-50">
              <Truck className="w-4 h-4 text-indigo-600" />
              <span>Fast Shipping</span>
            </div>
            <div className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-slate-50">
              <ShieldCheck className="w-4 h-4 text-indigo-600" />
              <span>2-Yr Warranty</span>
            </div>
            <div className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-slate-50">
              <RotateCcw className="w-4 h-4 text-indigo-600" />
              <span>Free 30d Returns</span>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Description */}
      <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 space-y-6">
        <h2 className="text-xl font-bold text-slate-900">About the Product</h2>
        <div className="text-sm text-slate-600 leading-relaxed space-y-4 font-normal">
          <p>{product.description || product.short_description}</p>
        </div>
      </div>

      {/* Customer Reviews Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Customer Reviews</h2>
          <span className="text-xs font-bold text-slate-600">
            {product.reviews?.length || 0} Verified Reviews
          </span>
        </div>

        {product.reviews && product.reviews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {product.reviews.map((rev) => (
              <div key={rev.id} className="bg-white rounded-3xl border border-slate-200 p-6 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-slate-600">Verified Buyer</span>
                </div>
                {rev.title && <h4 className="font-bold text-slate-900 text-sm">{rev.title}</h4>}
                <p className="text-sm text-slate-600 leading-relaxed font-normal">{rev.comment}</p>
                <p className="text-xs font-semibold text-slate-600 pt-1">— {rev.user_name || 'Customer'}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-white rounded-2xl border border-slate-200">
            <p className="text-sm text-slate-600">No customer reviews yet. Be the first to leave one!</p>
          </div>
        )}
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <div className="space-y-6 pt-6 border-t border-slate-200">
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">You Might Also Like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {related.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
