import React, { useState } from 'react';
import { CHILEAN_NODES } from '../data/chileanGridData';
import { ChileanNode } from '../types/energy';
import { InteractiveGisMap } from './InteractiveGisMap';
import { MapPin, ArrowUpRight, Zap, Maximize2, Minimize2, Map as MapIcon, Compass } from 'lucide-react';

interface NodalHeatmapProps {
  selectedNodeId: string;
  onSelectNode: (node: ChileanNode) => void;
}

export const NodalHeatmap: React.FC<NodalHeatmapProps> = ({
  selectedNodeId,
  onSelectNode,
}) => {
  const [zoneFilter, setZoneFilter] = useState<string>('ALL');
  const [isMapExpanded, setIsMapExpanded] = useState<boolean>(false);

  const zones = ['ALL', 'Norte Grande', 'Norte Chico', 'Centro', 'Sur'];

  const filteredNodes = CHILEAN_NODES.filter((n) => {
    if (zoneFilter === 'ALL') return true;
    return n.zone === zoneFilter;
  });

  return (
    <section className="w-full apple-glass rounded-3xl p-6 sm:p-8 hairline-border shadow-apple-card relative overflow-hidden">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-white/5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-[10px] tracking-widest text-[#00e5ff] uppercase px-2 py-0.5 rounded border border-[#00e5ff]/30 bg-[#00e5ff]/5">
              MODULE [B] // TRANSMISSION_SPINE_GIS
            </span>
            <span className="text-xs font-mono text-gray-400">
              SEN 500kV / 220kV TOPOLOGY & OPENTOPO CONTOURS
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tightest text-white">
            Nodal Congestion & Curtailment Heatmap
          </h2>
          <p className="text-xs sm:text-sm text-gray-400 font-normal mt-0.5">
            Visor geoespacial profesional de subestaciones, corredores troncales y curvas de nivel topográficas en tiempo real.
          </p>
        </div>

        {/* Controls: Zone Filter & Map Size Toggle */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Zone Filter Pills */}
          <div className="flex items-center gap-1.5 p-1.5 rounded-xl bg-white/[0.03] border border-white/10 overflow-x-auto">
            {zones.map((z) => (
              <button
                key={z}
                onClick={() => setZoneFilter(z)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all whitespace-nowrap ${
                  zoneFilter === z
                    ? 'bg-white text-black font-semibold shadow-sm'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {z}
              </button>
            ))}
          </div>

          {/* Expand Map Toggle */}
          <button
            onClick={() => setIsMapExpanded(!isMapExpanded)}
            className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs font-mono text-gray-300 hover:text-white transition-all"
            title={isMapExpanded ? 'Vista Dividida (Mapa + Tabla)' : 'Expandir Mapa a Ancho Completo'}
          >
            {isMapExpanded ? (
              <>
                <Minimize2 className="w-3.5 h-3.5 text-[#00e5ff]" />
                <span>Vista Dividida</span>
              </>
            ) : (
              <>
                <Maximize2 className="w-3.5 h-3.5 text-[#00e5ff]" />
                <span>Expandir Mapa</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Grid: Interactive GIS Map & Nodal Registry */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6">
        
        {/* Interactive GIS Map Container */}
        <div className={`transition-all duration-300 ${
          isMapExpanded ? 'lg:col-span-12 min-h-[580px]' : 'lg:col-span-5 min-h-[520px]'
        }`}>
          <InteractiveGisMap
            selectedNodeId={selectedNodeId}
            onSelectNode={onSelectNode}
            zoneFilter={zoneFilter}
          />
        </div>

        {/* Tabular Data Grid */}
        <div className={`space-y-4 transition-all duration-300 ${
          isMapExpanded ? 'lg:col-span-12' : 'lg:col-span-7'
        }`}>
          <div className="flex items-center justify-between text-xs font-mono text-gray-400 pb-2 border-b border-white/5">
            <span className="flex items-center gap-1.5 text-white font-medium">
              <MapIcon className="w-3.5 h-3.5 text-[#00e5ff]" />
              REGISTRO DE BARRAS ({filteredNodes.length} SUBESTACIONES AUDITADAS)
            </span>
            <span className="text-[#00e5ff] text-[11px] hidden sm:inline">
              HAZ CLIC EN CUALQUIER FILA PARA ENFOCAR EL MAPA Y CARGAR EN CHRONOS
            </span>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-white/10 bg-white/[0.01]">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-white/[0.03] text-gray-400 border-b border-white/10 text-[10px] uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-3">Subestación / Barra</th>
                  <th className="py-3 px-3">Zona</th>
                  <th className="py-3 px-3 text-right">Costo Marg.</th>
                  <th className="py-3 px-3 text-right">Hrs Precio Cero</th>
                  <th className="py-3 px-3 text-right">Congestión</th>
                  <th className="py-3 px-3 text-right">Score BESS</th>
                  <th className="py-3 px-3 text-center">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredNodes.map((node) => {
                  const isSelected = selectedNodeId === node.id;
                  const isTopArbitrage = node.arbitrageScore >= 90;

                  return (
                    <tr
                      key={node.id}
                      onClick={() => onSelectNode(node)}
                      className={`cursor-pointer transition-colors ${
                        isSelected
                          ? 'bg-[#00e5ff]/10 text-white font-medium border-l-2 border-[#00e5ff]'
                          : 'hover:bg-white/[0.04] text-gray-300'
                      }`}
                    >
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2.5">
                          <span
                            className={`w-2.5 h-2.5 rounded-full ${
                              node.voltageKv === 500
                                ? 'bg-[#00e5ff] shadow-[0_0_8px_#00e5ff]'
                                : 'bg-gray-400'
                            }`}
                          />
                          <div>
                            <div className="font-semibold text-white flex items-center gap-1.5">
                              <span>{node.name}</span>
                              {isSelected && (
                                <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#00e5ff] text-black font-bold">
                                  ACTIVA
                                </span>
                              )}
                            </div>
                            <div className="text-[10px] text-gray-400">{node.region}</div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-3 text-[11px] text-gray-400">
                        {node.zone}
                      </td>

                      <td className="py-3 px-3 text-right font-medium">
                        ${node.avgMarginalPrice.toFixed(1)}{' '}
                        <span className="text-[10px] text-gray-500">/MWh</span>
                      </td>

                      <td className="py-3 px-3 text-right">
                        <span
                          className={`font-semibold ${
                            node.zeroPriceHoursYear > 1500
                              ? 'text-amber-400'
                              : 'text-gray-300'
                          }`}
                        >
                          {node.zeroPriceHoursYear} h
                        </span>
                      </td>

                      <td className="py-3 px-3 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <span
                            className={`text-[11px] ${
                              node.transmissionCongestionIndex > 80
                                ? 'text-rose-400 font-semibold'
                                : node.transmissionCongestionIndex > 60
                                ? 'text-amber-400'
                                : 'text-emerald-400'
                            }`}
                          >
                            {node.transmissionCongestionIndex}%
                          </span>
                          <div className="w-12 h-1.5 rounded-full bg-white/10 overflow-hidden hidden sm:block">
                            <div
                              className={`h-full rounded-full ${
                                node.transmissionCongestionIndex > 80
                                  ? 'bg-rose-500'
                                  : node.transmissionCongestionIndex > 60
                                  ? 'bg-amber-400'
                                  : 'bg-emerald-400'
                              }`}
                              style={{ width: `${node.transmissionCongestionIndex}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-3 text-right">
                        <span
                          className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                            isTopArbitrage
                              ? 'bg-emerald-400/20 text-emerald-400 border border-emerald-400/40'
                              : node.arbitrageScore >= 75
                              ? 'bg-[#00e5ff]/20 text-[#00e5ff] border border-[#00e5ff]/40'
                              : 'bg-amber-400/20 text-amber-400 border border-amber-400/40'
                          }`}
                        >
                          {node.arbitrageScore}
                        </span>
                      </td>

                      <td className="py-3 px-3 text-center">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectNode(node);
                          }}
                          className={`p-1.5 rounded-lg border transition-all ${
                            isSelected
                              ? 'bg-[#00e5ff] text-black border-[#00e5ff]'
                              : 'bg-white/5 border-white/10 text-gray-400 hover:text-white hover:bg-white/10'
                          }`}
                          title="Cargar esta subestación en el simulador BESS Chronos"
                        >
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Selected Node Mini Dossier */}
          {(() => {
            const currentSelected = CHILEAN_NODES.find((n) => n.id === selectedNodeId);
            if (!currentSelected) return null;

            return (
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-[#00e5ff]/10 border border-[#00e5ff]/30 flex items-center justify-center text-[#00e5ff]">
                    <Zap className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-white font-semibold">
                      {currentSelected.name} // {currentSelected.voltageKv} kV
                    </div>
                    <div className="text-[11px] text-gray-400">
                      {currentSelected.description}
                    </div>
                  </div>
                </div>

                <div className="text-right whitespace-nowrap">
                  <span className="text-[10px] text-gray-500 block">Vertimiento Solar Est.:</span>
                  <span className="text-sm font-semibold text-amber-400">
                    {currentSelected.solarCurtailmentGwh.toFixed(1)} GWh/año
                  </span>
                </div>
              </div>
            );
          })()}
        </div>
      </div>
    </section>
  );
};
