// Compra del sistema: alta (pago único) + abono mensual. Mercado Pago o transferencia.
// El precio y el link de pago los arma el servidor; acá solo se muestran.
import React, { useEffect, useState } from 'react';
import { CreditCard, Landmark, Loader2, ShieldCheck } from 'lucide-react';
import { PRECIOS_BASE, linkDePago, precios as leerPrecios, type Precios, type Proyecto } from './api';
import { whatsappLink } from '../data/contact';

const pesos = (n: number) => '$' + n.toLocaleString('es-AR', { maximumFractionDigits: 0 });
const ALIAS = (import.meta.env.VITE_ALIAS_TRANSFERENCIA as string | undefined)?.trim() ?? '';

interface Props {
  nombre: string;
  resumen: string;
  estado: string; // borrador | pagado | publicado
  abono: string | null;
  /** Asegura que el proyecto esté guardado en el servidor y lo devuelve (null si no hay servidor). */
  asegurarProyecto: () => Promise<Proyecto | null>;
}

export const Comprar: React.FC<Props> = ({ nombre, resumen, estado, abono, asegurarProyecto }) => {
  const [p, setP] = useState<Precios>(PRECIOS_BASE);
  const [email, setEmail] = useState('');
  const [ocupado, setOcupado] = useState(false);
  const [aviso, setAviso] = useState('');
  const [verTransferencia, setVerTransferencia] = useState(false);
  useEffect(() => { void leerPrecios().then(setP); }, []);

  const pagado = estado !== 'borrador';
  const pagar = async (tipo: 'alta' | 'abono') => {
    setAviso('');
    if (!/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(email.trim())) {
      setAviso('Poné tu e-mail: ahí llega el comprobante.');
      return;
    }
    setOcupado(true);
    try {
      const proyecto = await asegurarProyecto();
      if (!proyecto) throw new Error('No pudimos guardar tu sistema para cobrarlo. Probá de nuevo o escribinos.');
      const { url } = await linkDePago(tipo, proyecto, email.trim());
      window.location.assign(url);
    } catch (e) {
      setAviso(e instanceof Error ? e.message : 'No se pudo iniciar el pago.');
      setOcupado(false);
    }
  };
  const mensaje = `Hola tecnoros.ar, quiero comprar el sistema que armé en la fábrica: ${resumen} Quiero pagar por transferencia: alta ${pesos(p.alta)} + abono ${pesos(p.abono)}/mes.`;

  return (
    <div className="rounded-2xl border border-emerald-500/40 bg-emerald-500/10 p-4">
      <h2 className="text-sm font-bold text-white">{pagado ? '¡Tu sistema ya está comprado!' : '¿Te sirve así? Compralo'}</h2>
      <dl className="mt-2 space-y-1 text-sm">
        <div className="flex justify-between gap-3"><dt className="text-slate-300">Alta de «{nombre}» <span className="text-slate-500">(una sola vez)</span></dt><dd className="font-bold text-white">{pesos(p.alta)}</dd></div>
        <div className="flex justify-between gap-3"><dt className="text-slate-300">Alojamiento, dominio y mantenimiento</dt><dd className="font-bold text-white whitespace-nowrap">{pesos(p.abono)} / mes</dd></div>
      </dl>
      <p className="mt-2 text-xs text-slate-400">Incluye Golondrina adentro y los cambios que pidas después, con tu aprobación.</p>

      {pagado ? (
        <div className="mt-3 text-sm text-emerald-200">
          <p className="inline-flex items-center gap-1.5"><ShieldCheck className="w-4 h-4" /> Alta paga. Lo estamos publicando y te avisamos por e-mail.</p>
          {abono === 'activo' ? (
            <p className="mt-1">Abono mensual activo.</p>
          ) : p.activo ? (
            <>
              <label className="mt-3 block text-xs text-slate-300">Tu e-mail
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value.slice(0, 200))} autoComplete="email" className="mt-1 w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm" />
              </label>
              <button type="button" onClick={() => void pagar('abono')} disabled={ocupado} className="mt-2 w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-400 text-slate-950 font-extrabold disabled:opacity-50 cursor-pointer">
                {ocupado ? <Loader2 className="w-4 h-4 animate-spin" /> : <CreditCard className="w-4 h-4" />} Activar el abono mensual
              </button>
            </>
          ) : null}
        </div>
      ) : (
        <>
          {p.activo ? (
            <>
              <label className="mt-3 block text-xs text-slate-300">Tu e-mail (para el comprobante)
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value.slice(0, 200))} autoComplete="email" placeholder="vos@tunegocio.com" className="mt-1 w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm" />
              </label>
              <button type="button" onClick={() => void pagar('alta')} disabled={ocupado} className="mt-2 w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-400 text-slate-950 font-extrabold disabled:opacity-50 cursor-pointer">
                {ocupado ? <Loader2 className="w-4 h-4 animate-spin" /> : <CreditCard className="w-4 h-4" />} Pagar con Mercado Pago
              </button>
              {p.prueba && <p className="mt-1.5 text-xs text-amber-300">Pago en modo prueba: no se cobra dinero real.</p>}
            </>
          ) : (
            <p className="mt-3 rounded-lg border border-amber-400/30 bg-amber-400/5 p-2 text-xs text-amber-200">El pago con Mercado Pago todavía no está activado en esta web. Por ahora podés comprarlo por transferencia.</p>
          )}
          <button type="button" onClick={() => setVerTransferencia((v) => !v)} aria-expanded={verTransferencia} className="mt-2 w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-xl border border-emerald-400/60 text-emerald-200 font-bold cursor-pointer">
            <Landmark className="w-4 h-4" /> Pagar por transferencia
          </button>
          {verTransferencia && (
            <div className="mt-2 rounded-xl border border-slate-700 bg-slate-950/60 p-3 text-sm text-slate-300">
              {ALIAS ? (
                <p>Transferí {pesos(p.alta)} al alias <span className="font-mono font-bold text-white select-all">{ALIAS}</span> y avisanos con el comprobante.</p>
              ) : (
                <p>Te pasamos los datos de la cuenta por WhatsApp y, cuando llega la transferencia, publicamos tu sistema.</p>
              )}
              <a href={whatsappLink(mensaje)} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex w-full items-center justify-center py-2 rounded-lg bg-cyan-400 text-slate-950 font-bold">{ALIAS ? 'Avisar el pago por WhatsApp' : 'Pedir los datos por WhatsApp'}</a>
            </div>
          )}
        </>
      )}
      {aviso && <p role="alert" className="mt-2 text-sm text-amber-300">{aviso}</p>}
    </div>
  );
};

export default Comprar;
