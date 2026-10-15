import React from 'react';
import { useCart } from '../context/CartContext';
import { CheckCircle2, AlertCircle } from 'lucide-react';

export default function Toast() {
  const { toast } = useCart();

  if (!toast) return null;

  const isError = toast.type === 'error';

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-bounce transition-all duration-300">
      <div
        className={`flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl border text-sm font-medium ${
          isError
            ? 'bg-red-50 border-red-200 text-red-800'
            : 'bg-slate-900 border-slate-800 text-white shadow-indigo-500/10'
        }`}
      >
        {isError ? (
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
        ) : (
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
        )}
        <span>{toast.message}</span>
      </div>
    </div>
  );
}
