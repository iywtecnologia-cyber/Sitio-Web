import React, { useState } from 'react';
import { INITIAL_SHIPMENTS } from '../../data/mockData';
import { LogisticsShipment } from '../../types';
import { Truck, Navigation, Thermometer, BatteryCharging, Gauge, MapPin, RefreshCw, CheckCircle2 } from 'lucide-react';

export const SimulatorLogistics: React.FC = () => {
  const [shipments, setShipments] = useState<LogisticsShipment[]>(INITIAL_SHIPMENTS);
  const [selectedId, setSelectedId] = useState<string>(INITIAL_SHIPMENTS[0].id);

  const selectedShipment = shipments.find((s) => s.id === selectedId) || shipments[0];

  const advanceShipmentRoute = () => {
    setShipments((prev) =>
      prev.map((s) => {
        if (s.id !== selectedId) return s;

        const newProgress = Math.min(100, s.progressPercentage + 15);
        let newStatus = s.status;
        let newEta = s.eta;

        if (newProgress >= 100) {
          newStatus = 'Entregado';
          newEta = 'Arribado a destino (14:35 hs)';
        } else if (newProgress >= 80) {
          newStatus = 'En Reparto Final';
          newEta = 'En 6 minutos (Maniobras de descarga)';
        } else if (newProgress >= 30) {
          newStatus = 'En Circunvalación';
          newEta = 'En 18 minutos';
        }

        return {
          ...s,
          progressPercentage: newProgress,
          status: newStatus,
          eta: newEta,
          telemetry: {
            ...s.telemetry,
            speedKmH: newProgress >= 100 ? 0 : Math.floor(45 + Math.random() * 35),
            cargoTempC: Number((s.telemetry.cargoTempC + (Math.random() * 0.4 - 0.2)).toFixed(1)),
            batteryPct: Math.max(10, s.telemetry.batteryPct - 1)
          }
        };
      })
    );
  };

  const resetShipments = () => {
    setShipments(INITIAL_SHIPMENTS);
  };

  return (
    <div className="bg-[#0B101E] rounded-2xl border border-slate-800 p-4 sm:p-6 lg:p-8">
      {/* Simulator Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-800 gap-4">
        <div>
          <div className="text-xs font-mono text-cyan-400 font-semibold mb-1">
            SISTEMA DEMO 03 · MONITOR LOGÍSTICO & TELEMETRÍA IOT GRAN ROSARIO
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-white">
            Torre de Control de Flotas, Sensores de Carga y Despacho Portuario
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Visualizá camiones en tránsito entre el Parque Industrial Alvear, Circunvalación y los muelles de San Lorenzo con telemetría en vivo.
          </p>
        </div>

        <button
          onClick={resetShipments}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono text-slate-400 hover:text-white bg-slate-900 border border-slate-700/80 rounded-lg hover:border-slate-600 transition-colors self-start sm:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Restablecer Rutas</span>
        </button>
      </div>

      {/* Main Container */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Shipment Selector Cards */}
        <div className="lg:col-span-4 space-y-3">
          <div className="text-xs font-mono text-slate-400 uppercase tracking-wider">
            Unidades en Circulación ({shipments.length})
          </div>

          {shipments.map((s) => {
            const isSelected = s.id === selectedId;
            return (
              <button
                key={s.id}
                onClick={() => setSelectedId(s.id)}
                className={`w-full text-left p-3.5 rounded-xl border transition-all ${
                  isSelected
                    ? 'bg-slate-900 border-cyan-500/80 shadow-md shadow-cyan-950/30'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-cyan-300">
                    {s.trackingCode}
                  </span>
                  <span
                    className={`text-[10px] font-mono font-medium px-2 py-0.5 rounded ${
                      s.status === 'Entregado'
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : s.status === 'En Circunvalación'
                        ? 'bg-cyan-500/20 text-cyan-300'
                        : 'bg-amber-500/20 text-amber-300'
                    }`}
                  >
                    {s.status}
                  </span>
                </div>

                <div className="mt-1.5 text-xs font-semibold text-white truncate">
                  {s.client}
                </div>

                <div className="mt-2 text-[11px] text-slate-400 font-mono truncate">
                  Destino: {s.destination}
                </div>

                {/* Mini progress bar */}
                <div className="mt-2.5 w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-cyan-400 to-violet-500 h-1.5 rounded-full transition-all duration-300"
                    style={{ width: `${s.progressPercentage}%` }}
                  />
                </div>
              </button>
            );
          })}
        </div>

        {/* Right Column: Detailed Telemetry Cockpit */}
        <div className="lg:col-span-8 bg-slate-950/90 rounded-xl border border-slate-800 p-5 sm:p-6 flex flex-col justify-between">
          <div>
            {/* Header info */}
            <div className="flex flex-wrap items-center justify-between pb-4 border-b border-slate-800 gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <Truck className="w-5 h-5 text-cyan-400" />
                  <span className="text-base sm:text-lg font-bold text-white">
                    {selectedShipment.vehicle}
                  </span>
                </div>
                <div className="text-xs text-slate-400 mt-0.5">
                  Chofer asignado: <strong>{selectedShipment.driver}</strong> · Cliente: {selectedShipment.client}
                </div>
              </div>

              <div className="text-right">
                <div className="text-xs font-mono text-slate-400">ETA Estimado</div>
                <div className="text-sm font-bold text-cyan-300 font-mono">
                  {selectedShipment.eta}
                </div>
              </div>
            </div>

            {/* Live Progress Bar with stops */}
            <div className="mt-6">
              <div className="flex justify-between text-xs font-mono text-slate-400 mb-2">
                <span>Ruta Gran Rosario</span>
                <span className="text-cyan-400 font-bold">{selectedShipment.progressPercentage}% completado</span>
              </div>
              
              <div className="w-full bg-slate-900 rounded-full h-2.5 p-0.5 border border-slate-800">
                <div
                  className="bg-gradient-to-r from-cyan-500 via-sky-400 to-violet-500 h-full rounded-full transition-all duration-500 shadow-sm shadow-cyan-500/40"
                  style={{ width: `${selectedShipment.progressPercentage}%` }}
                />
              </div>

              {/* Waypoints */}
              <div className="mt-3 grid grid-cols-3 text-[11px] font-mono text-slate-400">
                <div className="text-left">
                  <div className="text-slate-300 font-medium truncate">Origen: {selectedShipment.origin}</div>
                  <div className="text-[10px] text-slate-500">Salida verificada</div>
                </div>
                <div className="text-center">
                  <div className="text-cyan-400 font-medium">Checkpoint Actual</div>
                  <div className="text-[10px] text-slate-400">{selectedShipment.telemetry.lastCheckpoint}</div>
                </div>
                <div className="text-right">
                  <div className="text-slate-300 font-medium truncate">Destino: {selectedShipment.destination}</div>
                  <div className="text-[10px] text-slate-500">Muelle de descarga</div>
                </div>
              </div>
            </div>

            {/* Live Telemetry Gauges */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800">
                <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                  <span className="flex items-center gap-1.5 font-mono">
                    <Gauge className="w-3.5 h-3.5 text-cyan-400" />
                    Velocidad
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400">GPS Activo</span>
                </div>
                <div className="text-2xl font-extrabold text-white font-mono tabular-nums">
                  {selectedShipment.telemetry.speedKmH}{' '}
                  <span className="text-xs font-normal text-slate-400">Km/h</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800">
                <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                  <span className="flex items-center gap-1.5 font-mono">
                    <Thermometer className="w-3.5 h-3.5 text-violet-400" />
                    Temp. Carga
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400">En Rango</span>
                </div>
                <div className="text-2xl font-extrabold text-white font-mono tabular-nums">
                  {selectedShipment.telemetry.cargoTempC}{' '}
                  <span className="text-xs font-normal text-slate-400">°C</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800">
                <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                  <span className="flex items-center gap-1.5 font-mono">
                    <BatteryCharging className="w-3.5 h-3.5 text-sky-400" />
                    Batería Tracker
                  </span>
                  <span className="text-[10px] font-mono text-cyan-400">Óptimo</span>
                </div>
                <div className="text-2xl font-extrabold text-white font-mono tabular-nums">
                  {selectedShipment.telemetry.batteryPct}{' '}
                  <span className="text-xs font-normal text-slate-400">%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Trigger */}
          <div className="mt-6 pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-xs text-slate-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-cyan-400" />
              <span>Simulación con datos satelitales en vivo (Rosario - San Lorenzo).</span>
            </div>

            <button
              onClick={advanceShipmentRoute}
              disabled={selectedShipment.progressPercentage >= 100}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-cyan-300 hover:from-cyan-300 hover:to-cyan-200 text-slate-950 font-bold text-xs shadow-md shadow-cyan-500/20 disabled:opacity-40 disabled:pointer-events-none transition-all"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>Simular Avance de Ruta (+15%)</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
