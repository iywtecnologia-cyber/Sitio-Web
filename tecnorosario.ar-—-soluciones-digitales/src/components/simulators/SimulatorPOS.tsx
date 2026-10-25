import React, { useState } from 'react';
import { INITIAL_POS_PRODUCTS } from '../../data/mockData';
import { POSProduct, POSCartItem, POSTicket } from '../../types';
import { ShoppingCart, Plus, Minus, Trash2, Printer, CheckCircle, Search, RefreshCw, QrCode } from 'lucide-react';

export const SimulatorPOS: React.FC = () => {
  const [products, setProducts] = useState<POSProduct[]>(INITIAL_POS_PRODUCTS);
  const [cart, setCart] = useState<POSCartItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'Efectivo' | 'Transferencia CBU' | 'Mercado Pago QR'>('Mercado Pago QR');
  const [issuedTicket, setIssuedTicket] = useState<POSTicket | null>(null);
  const [ticketModalOpen, setTicketModalOpen] = useState(false);

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.code.includes(searchTerm) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addToCart = (product: POSProduct) => {
    if (product.stock <= 0) return;

    setProducts((prev) =>
      prev.map((p) => (p.id === product.id ? { ...p, stock: p.stock - 1 } : p))
    );

    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const updateQuantity = (productId: string, delta: number) => {
    const item = cart.find((i) => i.product.id === productId);
    if (!item) return;

    if (delta > 0) {
      const currentProd = products.find((p) => p.id === productId);
      if (!currentProd || currentProd.stock <= 0) return;

      setProducts((prev) =>
        prev.map((p) => (p.id === productId ? { ...p, stock: p.stock - 1 } : p))
      );
      setCart((prev) =>
        prev.map((i) =>
          i.product.id === productId ? { ...i, quantity: i.quantity + 1 } : i
        )
      );
    } else {
      setProducts((prev) =>
        prev.map((p) => (p.id === productId ? { ...p, stock: p.stock + 1 } : p))
      );
      if (item.quantity === 1) {
        setCart((prev) => prev.filter((i) => i.product.id !== productId));
      } else {
        setCart((prev) =>
          prev.map((i) =>
            i.product.id === productId ? { ...i, quantity: i.quantity - 1 } : i
          )
        );
      }
    }
  };

  const removeFromCart = (productId: string) => {
    const item = cart.find((i) => i.product.id === productId);
    if (!item) return;

    setProducts((prev) =>
      prev.map((p) =>
        p.id === productId ? { ...p, stock: p.stock + item.quantity } : p
      )
    );
    setCart((prev) => prev.filter((i) => i.product.id !== productId));
  };

  const resetSimulator = () => {
    setProducts(INITIAL_POS_PRODUCTS);
    setCart([]);
    setIssuedTicket(null);
    setTicketModalOpen(false);
  };

  const subtotal = cart.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );
  const vat = Math.round(subtotal * 0.21);
  const total = subtotal + vat;

  const handleCheckout = () => {
    if (cart.length === 0) return;

    const newTicket: POSTicket = {
      ticketNumber: `TK-${Math.floor(100000 + Math.random() * 900000)}`,
      date: new Date().toLocaleString('es-AR', {
        dateStyle: 'short',
        timeStyle: 'medium',
      }),
      items: [...cart],
      subtotal,
      vat,
      total,
      paymentMethod,
      cuitEmisor: '30-71829402-8 (TecnoRosario SRL)',
      caeSimulado: `74${Math.floor(100000000000 + Math.random() * 900000000000)}`,
    };

    setIssuedTicket(newTicket);
    setTicketModalOpen(true);
    setCart([]);
  };

  return (
    <div className="bg-[#0B101E] rounded-2xl border border-slate-800 p-4 sm:p-6 lg:p-8">
      {/* Simulator Banner / Explainer */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-800 gap-4">
        <div>
          <div className="text-xs font-mono text-cyan-400 font-semibold mb-1">
            SISTEMA DEMO 01 · GESTIÓN COMERCIAL & STOCK LITORAL
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-white">
            Punto de Venta Rápido con Descuento de Stock en Vivo
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Probá agregar productos al pedido: verás cómo se actualiza el stock disponible en tiempo real y cómo se emite el ticket con CAE fiscal simulado.
          </p>
        </div>

        <button
          onClick={resetSimulator}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono text-slate-400 hover:text-white bg-slate-900 border border-slate-700/80 rounded-lg hover:border-slate-600 transition-colors self-start sm:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reiniciar Demo</span>
        </button>
      </div>

      {/* Main Grid: Products Catalog on Left, Order Cart on Right */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Catalog Column */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por nombre, código de barra o rubro..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[460px] overflow-y-auto pr-1">
            {filteredProducts.map((product) => {
              const isLowStock = product.stock <= product.minStock && product.stock > 0;
              const isOutOfStock = product.stock === 0;

              return (
                <div
                  key={product.id}
                  className={`p-3.5 rounded-xl border transition-all ${
                    isOutOfStock
                      ? 'bg-slate-950/40 border-slate-900 opacity-60'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[11px] font-mono text-slate-400">
                        {product.category}
                      </span>
                      <h4 className="text-xs sm:text-sm font-semibold text-white line-clamp-1 mt-0.5">
                        {product.name}
                      </h4>
                      <span className="text-[11px] font-mono text-slate-400 block mt-0.5">
                        Cód: {product.code}
                      </span>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-800/80">
                    <div>
                      <div className="text-sm font-bold text-cyan-300 font-mono tabular-nums">
                        ${product.price.toLocaleString('es-AR')}
                      </div>
                      <div className="text-[11px] font-mono">
                        {isOutOfStock ? (
                          <span className="text-rose-400">Sin stock</span>
                        ) : isLowStock ? (
                          <span className="text-amber-400">Stock crítico: {product.stock} {product.unit}</span>
                        ) : (
                          <span className="text-emerald-400">Stock: {product.stock} {product.unit}</span>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => addToCart(product)}
                      disabled={isOutOfStock}
                      className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 hover:border-cyan-500/50 disabled:opacity-40 disabled:pointer-events-none transition-colors"
                    >
                      + Agregar
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Cart & Ticket Generator Column */}
        <div className="lg:col-span-5 bg-slate-950/80 rounded-xl border border-slate-800 p-4 sm:p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs font-mono">
              <span className="text-white font-semibold flex items-center gap-1.5">
                <ShoppingCart className="w-3.5 h-3.5 text-cyan-400" />
                ORDEN DE VENTA ({cart.reduce((a, b) => a + b.quantity, 0)} ítems)
              </span>
              <span className="text-slate-400">Pto. Venta 0004</span>
            </div>

            {/* Cart Items List */}
            <div className="mt-3 space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
              {cart.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-500">
                  El pedido está vacío. Hace clic en "+ Agregar" en los productos de la izquierda para simular una venta.
                </div>
              ) : (
                cart.map((item) => (
                  <div
                    key={item.product.id}
                    className="flex items-center justify-between gap-2 p-2 rounded-lg bg-slate-900/60 border border-slate-800/80 text-xs"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="text-white font-medium truncate">
                        {item.product.name}
                      </div>
                      <div className="text-slate-400 font-mono text-[11px]">
                        ${item.product.price.toLocaleString('es-AR')} x {item.quantity} = ${(item.product.price * item.quantity).toLocaleString('es-AR')}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => updateQuantity(item.product.id, -1)}
                        className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-5 text-center font-mono font-bold text-white">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.product.id, 1)}
                        className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="p-1 rounded text-rose-400 hover:bg-rose-500/10 ml-1"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Totals & Checkout */}
          <div className="mt-4 pt-3 border-t border-slate-800">
            {/* Payment Method Selector */}
            <div className="mb-3">
              <label className="text-[11px] font-mono text-slate-400 block mb-1.5">
                MÉTODO DE COBRO
              </label>
              <div className="grid grid-cols-3 gap-1.5 text-xs">
                {(['Mercado Pago QR', 'Transferencia CBU', 'Efectivo'] as const).map(
                  (method) => (
                    <button
                      key={method}
                      onClick={() => setPaymentMethod(method)}
                      className={`px-2 py-1.5 rounded-lg border text-center text-[11px] font-medium transition-colors ${
                        paymentMethod === method
                          ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300 font-semibold'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {method}
                    </button>
                  )
                )}
              </div>
            </div>

            {/* Calculations Breakdown */}
            <div className="space-y-1 text-xs font-mono mb-3">
              <div className="flex justify-between text-slate-400">
                <span>Subtotal Neto:</span>
                <span className="tabular-nums">${subtotal.toLocaleString('es-AR')}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>IVA (21%):</span>
                <span className="tabular-nums">${vat.toLocaleString('es-AR')}</span>
              </div>
              <div className="flex justify-between text-white font-bold text-sm pt-1 border-t border-slate-800">
                <span>Total a Cobrar:</span>
                <span className="text-cyan-400 tabular-nums">
                  ${total.toLocaleString('es-AR')}
                </span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              disabled={cart.length === 0}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-400 to-cyan-300 hover:from-cyan-300 hover:to-cyan-200 text-slate-950 font-bold text-xs sm:text-sm shadow-md shadow-cyan-500/20 disabled:opacity-40 disabled:pointer-events-none transition-all"
            >
              Finalizar Venta & Emitir Ticket Fiscal
            </button>
          </div>
        </div>

      </div>

      {/* Ticket Modal */}
      {ticketModalOpen && issuedTicket && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 text-slate-200 shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono font-semibold">
                <CheckCircle className="w-4 h-4" />
                <span>VENTA REGISTRADA CON ÉXITO</span>
              </div>
              <button
                onClick={() => setTicketModalOpen(false)}
                className="text-slate-400 hover:text-white text-xs font-mono"
              >
                ✕ Cerrar
              </button>
            </div>

            {/* Physical Receipt Simulation */}
            <div className="mt-4 bg-white text-slate-950 p-4 rounded-lg font-mono text-[11px] leading-tight printable-area shadow-inner">
              <div className="text-center pb-2 border-b border-dashed border-slate-400">
                <div className="font-extrabold text-xs">TECNOROSARIO AR S.R.L.</div>
                <div>CUIT: {issuedTicket.cuitEmisor}</div>
                <div>IVA Responsable Inscripto</div>
                <div>Pto. Vta: 0004 · Ticket Factura B</div>
                <div>Nº: {issuedTicket.ticketNumber}</div>
                <div>Fecha: {issuedTicket.date}</div>
              </div>

              <div className="py-2 border-b border-dashed border-slate-400 space-y-1">
                {issuedTicket.items.map((it, idx) => (
                  <div key={idx} className="flex justify-between">
                    <span className="truncate max-w-[200px]">
                      {it.quantity}x {it.product.name}
                    </span>
                    <span className="tabular-nums font-bold">
                      ${(it.product.price * it.quantity).toLocaleString('es-AR')}
                    </span>
                  </div>
                ))}
              </div>

              <div className="py-2 border-b border-dashed border-slate-400 space-y-1">
                <div className="flex justify-between">
                  <span>Subtotal Neto:</span>
                  <span className="tabular-nums">${issuedTicket.subtotal.toLocaleString('es-AR')}</span>
                </div>
                <div className="flex justify-between">
                  <span>IVA 21%:</span>
                  <span className="tabular-nums">${issuedTicket.vat.toLocaleString('es-AR')}</span>
                </div>
                <div className="flex justify-between font-bold text-xs pt-1">
                  <span>TOTAL FINAL:</span>
                  <span className="tabular-nums">${issuedTicket.total.toLocaleString('es-AR')}</span>
                </div>
                <div className="text-[10px] text-slate-600 mt-1">
                  Forma de pago: {issuedTicket.paymentMethod}
                </div>
              </div>

              <div className="pt-2 text-center text-[10px] text-slate-700">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <QrCode className="w-8 h-8 text-black" />
                  <div className="text-left font-mono text-[9px] leading-none">
                    <div>CAE: {issuedTicket.caeSimulado}</div>
                    <div>Vto CAE: 10 días</div>
                    <div>Comprobante Autorizado AFIP</div>
                  </div>
                </div>
                <div>¡Gracias por confiar en el comercio local!</div>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between gap-3">
              <button
                onClick={() => window.print()}
                className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white transition-colors"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Imprimir Ticket</span>
              </button>
              <button
                onClick={() => setTicketModalOpen(false)}
                className="flex-1 py-2 px-3 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs transition-colors"
              >
                Aceptar & Seguir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
