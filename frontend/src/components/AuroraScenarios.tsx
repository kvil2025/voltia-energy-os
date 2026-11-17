import React, { useState } from 'react';
import { SCENARIO_DATA, SCENARIO_DESCRIPTIONS } from '../data/scenarioData';
import { TrendingUp, Layers, CheckSquare, Square, Zap, Info } from 'lucide-react';

export const AuroraScenarios: React.FC = () => {
  const [activeScenarios, setActiveScenarios] = useState({
    baseCase: true,
    coalPhaseout: true,
    extremeDrought: true,
    kimalCommissioning: true,
  });

  const [hoveredYearIndex, setHoveredYearIndex] = useState<number | null>(null);

  const toggleScenario = (key: keyof typeof activeScenarios) => {
    setActiveScenarios((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const currentHoverData = hoveredYearIndex !== null ? SCENARIO_DATA[hoveredYearIndex] : SCENARIO_DATA[4]; // default 2029

  return (
    <section className="w-full apple-glass rounded-3xl p-6 sm:p-8 hairline-border shadow-apple-card relative overflow-hidden">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-white/5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-[10px] tracking-widest text-[#00e5ff] uppercase px-2 py-0.5 rounded border border-[#00e5ff]/30 bg-[#00e5ff]/5">
              MODULE [C] // AURORA_ORIGIN
            </span>
            <span className="text-xs font-mono text-gray-400">
              LONG-RANGE CAPACITY EXPANSION (2025 - 2040)
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tightest text-white">
            Long-term Scenarios 2025–2040
          </h2>
          <p className="text-xs sm:text-sm text-gray-400 font-normal mt-0.5">
            Quantitative price forward curves, curtailment abatement, and BESS buildout trajectory under regulatory and climate stress tests.
          </p>
        </div>

        {/* Legend / Scenario Toggles */}
        <div className="flex flex-wrap items-center gap-2">
          {Object.entries(SCENARIO_DESCRIPTIONS).map(([key, item]) => {
            const isEnabled = activeScenarios[key as keyof typeof activeScenarios];
            return (
              <button
                key={key}
                type="button"
                onClick={() => toggleScenario(key as keyof typeof activeScenarios)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-mono transition-all ${
                  isEnabled
                    ? 'bg-white/[0.05] border-white/20 text-white'
                    : 'bg-transparent border-white/5 text-gray-400 opacity-50'
                }`}
              >
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-[11px] font-medium">{item.badge}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Grid: Multi-curve Interactive Chart (8 cols) & Scenario Deep Dive (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6">
        
        {/* Left Column: Interactive Multi-Curve Chart (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between text-xs font-mono text-gray-400 pb-2 border-b border-white/5">
            <span>AVERAGE MARGINAL PRICE FORWARD CURVE (USD/MWh)</span>
            <span className="text-[#00e5ff]">HOVER ON YEAR POINTS FOR SPREAD COMPARISON</span>
          </div>

          {/* SVG Multi-curve Price Chart */}
          <div className="h-64 sm:h-72 w-full apple-glass rounded-2xl p-4 border border-white/10 relative">
            <svg
              className="w-full h-full overflow-visible"
              viewBox="0 0 600 220"
              preserveAspectRatio="none"
            >
              {/* Horizontal grid lines ($40, $60, $80, $100 USD/MWh) */}
              {[40, 60, 80, 100].map((price) => {
                // y = 200 - ((price - 30) / (110 - 30)) * 180
                const y = 200 - ((price - 30) / 80) * 180;
                return (
                  <g key={price}>
                    <line x1="40" y1={y} x2="590" y2={y} stroke="rgba(255,255,255,0.06)" strokeDasharray="3,3" />
                    <text x="32" y={y + 3} fill="#6b7280" fontSize="9" fontFamily="monospace" textAnchor="end">
                      ${price}
                    </text>
                  </g>
                );
              })}

              {/* Kimal-Lo Aguirre 2029 vertical inflection line */}
              {(() => {
                const x2029 = 40 + ((2029 - 2025) / (2040 - 2025)) * 540;
                return (
                  <g>
                    <line x1={x2029} y1="20" x2={x2029} y2="200" stroke="rgba(16, 185, 129, 0.4)" strokeDasharray="4,4" strokeWidth="1.5" />
                    <text x={x2029 + 6} y="32" fill="#10b981" fontSize="9" fontFamily="monospace">
                      2029: Kimal-Lo Aguirre HVDC (3,000 MW)
                    </text>
                  </g>
                );
              })()}

              {/* Render Scenario Polyline Curves */}
              {activeScenarios.extremeDrought && (() => {
                const points = SCENARIO_DATA.map((d) => {
                  const x = 40 + ((d.year - 2025) / (2040 - 2025)) * 540;
                  const y = 200 - ((d.extremeDroughtPrice - 30) / 80) * 180;
                  return `${x},${y}`;
                }).join(' ');
                return (
                  <polyline
                    fill="none"
                    stroke={SCENARIO_DESCRIPTIONS.extremeDrought.color}
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    points={points}
                  />
                );
              })()}

              {activeScenarios.coalPhaseout && (() => {
                const points = SCENARIO_DATA.map((d) => {
                  const x = 40 + ((d.year - 2025) / (2040 - 2025)) * 540;
                  const y = 200 - ((d.coalPhaseoutPrice - 30) / 80) * 180;
                  return `${x},${y}`;
                }).join(' ');
                return (
                  <polyline
                    fill="none"
                    stroke={SCENARIO_DESCRIPTIONS.coalPhaseout.color}
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    points={points}
                  />
                );
              })()}

              {activeScenarios.baseCase && (() => {
                const points = SCENARIO_DATA.map((d) => {
                  const x = 40 + ((d.year - 2025) / (2040 - 2025)) * 540;
                  const y = 200 - ((d.baseCasePrice - 30) / 80) * 180;
                  return `${x},${y}`;
                }).join(' ');
                return (
                  <polyline
                    fill="none"
                    stroke={SCENARIO_DESCRIPTIONS.baseCase.color}
                    strokeWidth="2"
                    strokeDasharray="4,2"
                    strokeLinecap="round"
                    points={points}
                  />
                );
              })()}

              {activeScenarios.kimalCommissioning && (() => {
                const points = SCENARIO_DATA.map((d) => {
                  const x = 40 + ((d.year - 2025) / (2040 - 2025)) * 540;
                  const y = 200 - ((d.kimalCommissioningPrice - 30) / 80) * 180;
                  return `${x},${y}`;
                }).join(' ');
                return (
                  <polyline
                    fill="none"
                    stroke={SCENARIO_DESCRIPTIONS.kimalCommissioning.color}
                    strokeWidth="3"
                    strokeLinecap="round"
                    points={points}
                  />
                );
              })()}

              {/* Interactive Point Markers */}
              {SCENARIO_DATA.map((d, idx) => {
                const x = 40 + ((d.year - 2025) / (2040 - 2025)) * 540;
                const isHovered = hoveredYearIndex === idx;

                return (
                  <g
                    key={d.year}
                    onMouseEnter={() => setHoveredYearIndex(idx)}
                    className="cursor-pointer"
                  >
                    {/* Invisible hover trigger strip */}
                    <rect x={x - 15} y="10" width="30" height="195" fill="transparent" />

                    {/* Year tick line on hover */}
                    {isHovered && (
                      <line x1={x} y1="20" x2={x} y2="200" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
                    )}

                    {/* Circles on lines */}
                    {activeScenarios.kimalCommissioning && (
                      <circle
                        cx={x}
                        cy={200 - ((d.kimalCommissioningPrice - 30) / 80) * 180}
                        r={isHovered ? 5 : 3}
                        fill="#10b981"
                      />
                    )}
                    {activeScenarios.baseCase && (
                      <circle
                        cx={x}
                        cy={200 - ((d.baseCasePrice - 30) / 80) * 180}
                        r={isHovered ? 5 : 3}
                        fill="#00e5ff"
                      />
                    )}
                    {activeScenarios.extremeDrought && (
                      <circle
                        cx={x}
                        cy={200 - ((d.extremeDroughtPrice - 30) / 80) * 180}
                        r={isHovered ? 5 : 3}
                        fill="#f43f5e"
                      />
                    )}
                  </g>
                );
              })}
            </svg>

            {/* X-axis Years */}
            <div className="flex justify-between text-[10px] font-mono text-gray-400 px-8 pt-2">
              {SCENARIO_DATA.map((d, idx) => (
                <button
                  key={d.year}
                  onClick={() => setHoveredYearIndex(idx)}
                  className={`hover:text-white transition-colors ${
                    hoveredYearIndex === idx ? 'text-[#00e5ff] font-bold' : ''
                  }`}
                >
                  {d.year}
                </button>
              ))}
            </div>
          </div>

          {/* Curtailment & BESS Capacity Secondary Sparkbar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="apple-glass rounded-2xl p-4 border border-white/10 space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-gray-400">CURTAILMENT EVOLUTION (TWh/yr)</span>
                <span className="text-[#f59e0b] font-semibold">
                  {currentHoverData.curtailmentTwh} TWh ({currentHoverData.year})
                </span>
              </div>
              <div className="h-2 w-full bg-black/40 rounded-full overflow-hidden">
                <div
                  style={{ width: `${(currentHoverData.curtailmentTwh / 5.5) * 100}%` }}
                  className="h-full bg-[#f59e0b] transition-all duration-300"
                />
              </div>
              <div className="text-[10px] font-mono text-gray-500">
                Peak: 5.20 TWh (2028) → Abated to 0.52 TWh post-Kimal & 18.5GW BESS
              </div>
            </div>

            <div className="apple-glass rounded-2xl p-4 border border-white/10 space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-gray-400">BESS INSTALLED FLEET (GW)</span>
                <span className="text-[#10b981] font-semibold">
                  {currentHoverData.bessInstalledGw} GW ({currentHoverData.year})
                </span>
              </div>
              <div className="h-2 w-full bg-black/40 rounded-full overflow-hidden">
                <div
                  style={{ width: `${(currentHoverData.bessInstalledGw / 20) * 100}%` }}
                  className="h-full bg-[#10b981] transition-all duration-300"
                />
              </div>
              <div className="text-[10px] font-mono text-gray-500">
                Growth: +1,175% from 1.45 GW (2025) to 18.50 GW (2040)
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Comparative Metrics & Scenario Milestones (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="apple-glass rounded-2xl p-5 border border-white/10 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-white/5">
              <span className="text-xs font-mono font-semibold text-white">
                YEAR {currentHoverData.year} SPREAD COMPARISON
              </span>
              <span className="text-[10px] font-mono text-[#00e5ff] px-2 py-0.5 rounded bg-white/5">
                ACTIVE FOCUS
              </span>
            </div>

            {/* Price values table for the hovered year */}
            <div className="space-y-2 text-xs font-mono">
              <div className="flex items-center justify-between p-2 rounded-lg bg-white/[0.02]">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#00e5ff]" />
                  <span className="text-gray-300">Base Case</span>
                </div>
                <span className="font-semibold text-white">${currentHoverData.baseCasePrice} /MWh</span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-white/[0.02]">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#f59e0b]" />
                  <span className="text-gray-300">Coal Phaseout</span>
                </div>
                <span className="font-semibold text-[#f59e0b]">${currentHoverData.coalPhaseoutPrice} /MWh</span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-white/[0.02]">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#f43f5e]" />
                  <span className="text-gray-300">Extreme Drought</span>
                </div>
                <span className="font-semibold text-[#f43f5e]">${currentHoverData.extremeDroughtPrice} /MWh</span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-white/[0.02]">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#10b981]" />
                  <span className="text-gray-300">Kimal 2029 Online</span>
                </div>
                <span className="font-semibold text-[#10b981]">${currentHoverData.kimalCommissioningPrice} /MWh</span>
              </div>
            </div>

            {/* Explanatory text */}
            <div className="pt-2 border-t border-white/5 text-[11px] text-gray-400 leading-relaxed">
              <span className="text-white font-medium">Market Takeaway:</span> In 2029, the commercial commissioning of the Kimal-Lo Aguirre ±600kV link eliminates Northern transmission clipping, causing solar noon spreads to contract by ~28% in Central nodes while expanding southern hydro integration.
            </div>
          </div>

          {/* Institutional Advisory Box */}
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono text-[#00e5ff]">
              <Zap className="w-3.5 h-3.5" />
              <span>AURORA ORIGIN METHODOLOGY</span>
            </div>
            <p className="text-[11px] text-gray-400 leading-relaxed font-normal">
              Hydrothermal co-optimization uses hourly stochastic inflows across Maule, Laja, and Ralco reservoirs calibrated against 60 historical hydrology hydrological years (1960–2020) and CEN expansion guidelines.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
};
