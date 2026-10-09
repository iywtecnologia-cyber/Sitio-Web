import React, { useState } from 'react';
import { AlertTriangle, CheckCircle2, Minus, Plus, RefreshCw, ShoppingCart } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  minStock: number;
}

// Productos y precios de ejemplo para la demo.
const INITIAL_PRODUCTS: Product[] = [
  { id: 'p1', name: 'Yerba 1 kg', price: 4800, stock: 12, minStock: 4 },
  { id: 'p2', name: 'Gaseosa 2,25 L', price: 3200, stock: 6, minStock: 4 },
  { id: 'p3', name: 'Alfajor triple', price: 1500, stock: 25, minStock: 8 },
  { id: 'p4', name: 'Leche entera 1 L', price: 1900, stock: 5, minStock: 4 },
  { id: 'p5', name: 'Pan lactal', price: 2900, stock: 9, minStock: 3 },
  { id: 'p6', name: 'Galletitas dulces', price: 1700, stock: 14, minStock: 5 },
];

const money = (n: number) => `$${n.toLocaleString('es-AR')}`;

export const DemoPuntoDeVenta: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [cart, setCart] = useState<Record<string, number>>({});
  const [lastSale, setLastSale] = useState<{ total: number; lowStock: string[] } | null>(null);

  const stockLeft = (p: Product) => p.stock - (cart[p.id] ?? 0);

  const change = (p: Product, delta: number) => {
    setLastSale(null);
    setCart((prev) => {
      const qty = (prev[p.id] ?? 0) + delta;
      if (qty < 0 || qty > p.stock) return prev;
      const next = { ...prev, [p.id]: qty };
      if (qty === 0) delete next[p.id];
      return next;
    });
  };

  const items = products.filter((p) => cart[p.id]);
  const total = items.reduce((acc, p) => acc + p.price * cart[p.id], 0);

  const checkout = () => {
    if (!items.length) return;
    const updated = products.map((p) => ({ ...p, stock: p.stock - (cart[p.id] ?? 0) }));
    const lowStock = updated.filter((p) => p.stock <= p.minStock && cart[p.id]).map((p) => `${p.name} (quedan ${p.stock})`);
    setProducts(updated);
    setCart({});
    setLastSale({ total, lowStock });
  };

  const reset = () => {
    setProducts(INITIAL_PRODUCTS);
    setCart({});
    setLastSale(null);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-3">
        {products.map((p) => {
          const left = stockLeft(p);
          const low = left <= p.minStock;
          return (
            <div key={p.id} className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between gap-3">
              <div className="flex items-start justify-between gap-2">
                <div className="text-sm font-semibold text-white">{p.name}</div>
                <div className="text-sm font-bold text-cyan-300 font-mono tabular-nums">{money(p.price)}</div>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className={`text-xs font-mono ${left === 0 ? 'text-rose-400' : low ? 'text-amber-400' : 'text-emerald-400'}`}>
                  {left === 0 ? 'Sin stock' : `Stock: ${left}`}
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => change(p, -1)}
                    disabled={!cart[p.id]}
                    aria-label={`Quitar ${p.name}`}
                    className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center justify-center disabled:opacity-30"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-6 text-center font-mono font-bold text-white tabular-nums">{cart[p.id] ?? 0}</span>
                  <button
                    onClick={() => change(p, 1)}
                    disabled={left === 0}
                    aria-label={`Agregar ${p.name}`}
                    className="w-9 h-9 rounded-lg bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-200 border border-cyan-500/40 flex items-center justify-center disabled:opacity-30"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="lg:col-span-5 rounded-2xl bg-slate-950/80 border border-slate-800 p-5 sm:p-6 flex flex-col">
        <div className="flex items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <span className="flex items-center gap-2 text-white font-semibold">
            <ShoppingCart className="w-4 h-4 text-cyan-400" />
            Venta actual
          </span>
          <button
            onClick={reset}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs text-slate-300 hover:text-white bg-slate-900 border border-slate-700 rounded-lg transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Reiniciar
          </button>
        </div>

        <div className="flex-1 py-3 space-y-2 min-h-[120px]">
          {items.length === 0 && !lastSale && (
            <p className="text-sm text-slate-400 py-6 text-center">Tocá "+" en los productos para armar una venta.</p>
          )}
          {items.map((p) => (
            <div key={p.id} className="flex justify-between text-sm text-slate-200">
              <span>{cart[p.id]} × {p.name}</span>
              <span className="font-mono tabular-nums">{money(p.price * cart[p.id])}</span>
            </div>
          ))}

          {lastSale && (
            <div className="space-y-2" role="status">
              <div className="flex items-center gap-2 text-emerald-300 text-sm font-semibold">
                <CheckCircle2 className="w-4 h-4" />
                Venta de {money(lastSale.total)} registrada. El stock se actualizó solo.
              </div>
              {lastSale.lowStock.length > 0 && (
                <div className="flex items-start gap-2 text-amber-300 text-sm rounded-lg bg-amber-500/10 border border-amber-500/30 p-2.5">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>Aviso de reposición: {lastSale.lowStock.join(', ')}.</span>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="pt-3 border-t border-slate-800">
          <div className="flex justify-between text-white font-bold mb-3">
            <span>Total</span>
            <span className="text-cyan-300 font-mono tabular-nums">{money(total)}</span>
          </div>
          <button
            onClick={checkout}
            disabled={!items.length}
            className="w-full py-3 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-sm transition-colors disabled:opacity-40 disabled:pointer-events-none"
          >
            Cobrar
          </button>
          <p className="mt-2 text-[11px] text-slate-500 text-center">Productos y precios de ejemplo.</p>
        </div>
      </div>
    </div>
  );
};
