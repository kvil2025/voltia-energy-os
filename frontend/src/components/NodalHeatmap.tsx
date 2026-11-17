import React, { useState } from 'react';
import { CHILEAN_NODES, TRANSMISSION_LINES } from '../data/chileanGridData';
import { ChileanNode } from '../types/energy';
import { MapPin, Filter, ArrowUpRight, AlertCircle, Zap, Shield, CheckCircle } from 'lucide-react';

interface NodalHeatmapProps {
  selectedNodeId: string;
  onSelectNode: (node: ChileanNode) => void;
}

export const NodalHeatmap: React.FC<NodalHeatmapProps> = ({
  selectedNodeId,
  onSelectNode,
}) => {
  const [zoneFilter, setZoneFilter] = useState<string>('ALL');
  const [hoveredNode, setHoveredNode] = useState<ChileanNode | null>(null);

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
              MODULE [B] // TRANSMISSION_SPINE
            </span>
            <span className="text-xs font-mono text-gray-400">
              SEN 500kV / 220kV TRUNK TOPOLOGY
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tightest text-white">
            Nodal Congestion & Curtailment Heatmap
          </h2>
          <p className="text-xs sm:text-sm text-gray-400 font-normal mt-0.5">
            Geospatial nodal pricing spreads, zero-marginal cost hours, and transmission bottleneck analysis.
          </p>
        </div>

        {/* Filter Pills */}
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
      </div>

      {/* Main Grid: Interactive Geographic Vector Spine (Left) & Tabular Metric Grid (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6">
        
        {/* Geographic Vector Transmission Map (4 cols) */}
        <div className="lg:col-span-4 bg-[#090b10] rounded-2xl p-4 border border-white/10 flex flex-col items-center justify-between relative overflow-hidden">
          <div className="w-full flex items-center justify-between pb-3 border-b border-white/5 text-[11px] font-mono text-gray-400">
            <span className="flex items-center gap-1.5 text-white">
              <span className="w-2 h-2 rounded-full bg-[#00e5ff] animate-pulse" />
              CHILEAN SPINE (SEN)
            </span>
            <span>220kV / 500kV</span>
          </div>

          {/* SVG Map of Chile Spine */}
          <div className="w-full h-[460px] relative flex items-center justify-center my-2">
            <svg
              className="w-full h-full max-w-[260px]"
              viewBox="0 0 200 440"
              preserveAspectRatio="xMidYMid meet"
            >
              {/* Reference geographical coastline guide */}
              <path
                d="M 90 20 Q 85 80 80 140 T 70 240 T 65 340 T 60 420"
                fill="none"
                stroke="rgba(255,255,255,0.06)"
                strokeWidth="24"
                strokeLinecap="round"
              />

              {/* Transmission Corridor Lines */}
              {TRANSMISSION_LINES.map((line, idx) => {
                const nodeFrom = CHILEAN_NODES.find((n) => n.id === line.from);
                const nodeTo = CHILEAN_NODES.find((n) => n.id === line.to);
                if (!nodeFrom || !nodeTo) return null;

                // Map coordinates to SVG canvas (latitudes -20 to -42)
                const y1 = ((nodeFrom.lat - -20) / (-43 - -20)) * 380 + 30;
                const x1 = 80 + (nodeFrom.lon - -70) * 15;
                const y2 = ((nodeTo.lat - -20) / (-43 - -20)) * 380 + 30;
                const x2 = 80 + (nodeTo.lon - -70) * 15;

                const isCongested = line.status === 'CONGESTED' || line.status === 'SATURATED' || line.status === 'CRITICAL_CONGESTION';
                const strokeColor = isCongested ? '#f59e0b' : '#00e5ff';
                const strokeWidth = line.voltage === 500 ? 2.5 : 1.5;

                return (
                  <g key={idx}>
                    <line
                      x1={x1}
                      y1={y1}
                      x2={x2}
                      y2={y2}
                      stroke={strokeColor}
                      strokeWidth={strokeWidth}
                      strokeDasharray={isCongested ? '4,3' : undefined}
                      opacity={0.65}
                    />
                  </g>
                );
              })}

              {/* Substations (Nodes) */}
              {CHILEAN_NODES.map((node) => {
                const y = ((node.lat - -20) / (-43 - -20)) * 380 + 30;
                const x = 80 + (node.lon - -70) * 15;
                const isSelected = selectedNodeId === node.id;
                const isHovered = hoveredNode?.id === node.id;
                const isFiltered = zoneFilter === 'ALL' || node.zone === zoneFilter;

                return (
                  <g
                    key={node.id}
                    onClick={() => onSelectNode(node)}
                    onMouseEnter={() => setHoveredNode(node)}
                    onMouseLeave={() => setHoveredNode(null)}
                    className="cursor-pointer"
                    opacity={isFiltered ? 1 : 0.25}
                  >
                    {/* Outer glow ring if selected */}
                    {isSelected && (
                      <circle
                        cx={x}
                        cy={y}
                        r="11"
                        fill="none"
                        stroke="#00e5ff"
                        strokeWidth="1.5"
                        className="animate-ping"
                      />
                    )}

                    {/* Node Circle */}
                    <circle
                      cx={x}
                      cy={y}
                      r={node.voltageKv === 500 ? 5.5 : 4}
                      fill={isSelected ? '#00e5ff' : node.arbitrageScore > 85 ? '#eab308' : '#374151'}
                      stroke="#060709"
                      strokeWidth="1.5"
                    />

                    {/* Node Label */}
                    <text
                      x={x + 9}
                      y={y + 3}
                      fill={isSelected ? '#00e5ff' : isHovered ? '#ffffff' : '#9ca3af'}
                      fontSize="8"
                      fontFamily="monospace"
                      fontWeight={isSelected ? 'bold' : 'normal'}
                    >
                      {node.name.split(' ')[0]}
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Hover Tooltip in Map */}
            {hoveredNode && (
              <div className="absolute bottom-2 left-2 right-2 p-2.5 rounded-xl apple-glass border border-white/20 text-[10px] font-mono pointer-events-none">
                <div className="flex justify-between text-white font-semibold mb-0.5">
                  <span>{hoveredNode.name}</span>
                  <span className="text-[#00e5ff]">{hoveredNode.voltageKv}kV</span>
                </div>
                <div className="text-gray-400">
                  Spread Score: <span className="text-[#eab308]">{hoveredNode.arbitrageScore}/100</span> | Zero Hrs: {hoveredNode.zeroPriceHoursYear}h
                </div>
              </div>
            )}
          </div>

          {/* Legend */}
          <div className="w-full pt-3 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-gray-500">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#00e5ff]" /> 500kV Trunk
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#f59e0b]" /> Congested
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#eab308]" /> Top Arbitrage
            </span>
          </div>
        </div>

        {/* Tabular Data Grid (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between text-xs font-mono text-gray-400 pb-2 border-b border-white/5">
            <span>NODAL REGISTRY ({filteredNodes.length} SUBSTATIONS)</span>
            <span className="text-[#00e5ff]">CLICK ROW TO ARRANGE IN CHRONOS ENGINE</span>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-white/10 bg-white/[0.01]">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-white/[0.03] text-gray-400 border-b border-white/10 text-[10px] uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-3">Substation Node</th>
                  <th className="py-3 px-3">Zone</th>
                  <th className="py-3 px-3 text-right">Avg Marginal</th>
                  <th className="py-3 px-3 text-right">Zero-Price Hrs</th>
                  <th className="py-3 px-3 text-right">Congestion</th>
                  <th className="py-3 px-3 text-right">BESS Score</th>
                  <th className="py-3 px-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredNodes.map((node) => {
                  const isSelected = selectedNodeId === node.id;
                  return (
                    <tr
                      key={node.id}
                      onClick={() => onSelectNode(node)}
                      className={`cursor-pointer transition-colors ${
                        isSelected
                          ? 'bg-[#00e5ff]/10 text-white font-medium'
                          : 'hover:bg-white/[0.04] text-gray-300'
                      }`}
                    >
                      <td className="py-3.5 px-3">
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-2 h-2 rounded-full ${
                              node.voltageKv === 500 ? 'bg-[#00e5ff]' : 'bg-gray-500'
                            }`}
                          />
                          <div>
                            <div className="font-semibold text-white">{node.name}</div>
                            <div className="text-[10px] text-gray-400">{node.region}</div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-3 text-[11px] text-gray-400">
                        {node.zone}
                      </td>

                      <td className="py-3.5 px-3 text-right font-medium">
                        ${node.avgMarginalPrice.toFixed(1)} <span className="text-[9px] text-gray-400">USD</span>
                      </td>

                      <td className="py-3.5 px-3 text-right">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] ${
                            node.zeroPriceHoursYear > 1500
                              ? 'bg-[#eab308]/15 text-[#eab308] border border-[#eab308]/30'
                              : 'text-gray-400'
                          }`}
                        >
                          {node.zeroPriceHoursYear} hrs
                        </span>
                      </td>

                      <td className="py-3.5 px-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <span className="text-[11px]">{node.transmissionCongestionIndex}%</span>
                          <div className="w-12 h-1.5 bg-black/40 rounded-full overflow-hidden">
                            <div
                              style={{ width: `${node.transmissionCongestionIndex}%` }}
                              className={`h-full ${
                                node.transmissionCongestionIndex > 80
                                  ? 'bg-[#f59e0b]'
                                  : 'bg-[#00e5ff]'
                              }`}
                            />
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-3 text-right">
                        <span
                          className={`font-semibold text-sm ${
                            node.arbitrageScore >= 90
                              ? 'text-[#00e5ff]'
                              : node.arbitrageScore >= 75
                              ? 'text-[#10b981]'
                              : 'text-gray-400'
                          }`}
                        >
                          {node.arbitrageScore}
                        </span>
                        <span className="text-[9px] text-gray-400">/100</span>
                      </td>

                      <td className="py-3.5 px-3 text-center">
                        <button
                          type="button"
                          className={`px-2.5 py-1 rounded text-[10px] font-mono transition-all ${
                            isSelected
                              ? 'bg-[#00e5ff] text-black font-semibold'
                              : 'border border-white/10 text-gray-400 hover:text-white hover:border-white/30'
                          }`}
                        >
                          {isSelected ? 'LOADED' : 'SELECT'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Substation Highlight Card */}
          {filteredNodes.find((n) => n.id === selectedNodeId) && (
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-mono text-[#00e5ff] uppercase tracking-wider">
                  ACTIVE NODAL INTERCONNECTION
                </span>
                <div className="text-sm font-semibold text-white">
                  {CHILEAN_NODES.find((n) => n.id === selectedNodeId)?.name} — {CHILEAN_NODES.find((n) => n.id === selectedNodeId)?.region}
                </div>
                <p className="text-xs text-gray-400 mt-0.5">
                  {CHILEAN_NODES.find((n) => n.id === selectedNodeId)?.description}
                </p>
              </div>
              <div className="flex items-center gap-3 font-mono text-xs text-right shrink-0">
                <div>
                  <div className="text-[10px] text-gray-400">ANNUAL CURTAILMENT</div>
                  <div className="text-white font-semibold">
                    {CHILEAN_NODES.find((n) => n.id === selectedNodeId)?.solarCurtailmentGwh} GWh
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

      </div>
    </section>
  );
};
