import React, { useMemo, useState } from 'react';
import { BessConfig, ChileanNode } from '../types/energy';
import { calculateBessMetrics, generate24HourDispatchProfile } from '../utils/bessMath';
import { CHILEAN_NODES } from '../data/chileanGridData';
import { Sliders, DollarSign, Activity, Battery, Zap, TrendingUp, Info } from 'lucide-react';

interface ChronosOptimizerProps {
  selectedNodeId: string;
  onSelectNodeId: (nodeId: string) => void;
}

export const ChronosOptimizer: React.FC<ChronosOptimizerProps> = ({
  selectedNodeId,
  onSelectNodeId,
}) => {
  // Slider state
  const [powerMw, setPowerMw] = useState<number>(20);
  const [durationHours, setDurationHours] = useState<number>(4);
  const [rtePercent, setRtePercent] = useState<number>(86.5);
  const [cyclesPerDay, setCyclesPerDay] = useState<number>(1.25);
  const [capexPerKwh, setCapexPerKwh] = useState<number>(140);
  const [hoveredHour, setHoveredHour] = useState<number | null>(null);

  // Active node lookup
  const activeNode = useMemo(() => {
    return CHILEAN_NODES.find((n) => n.id === selectedNodeId) || CHILEAN_NODES[2]; // default Cardones
  }, [selectedNodeId]);

  // BESS configuration
  const config: BessConfig = useMemo(
    () => ({
      powerMw,
      durationHours,
      substationId: activeNode.id,
      rtePercent,
      cyclesPerDay,
      capexPerKwh,
      waccPercent: 8.5,
    }),
    [powerMw, durationHours, activeNode.id, rtePercent, cyclesPerDay, capexPerKwh]
  );

  // Instant mathematical calculations
  const metrics = useMemo(() => calculateBessMetrics(config, activeNode), [config, activeNode]);
  const dispatchProfile = useMemo(
    () => generate24HourDispatchProfile(config, activeNode),
    [config, activeNode]
  );

  // Format currency helpers
  const formatUsd = (val: number) => {
    if (val >= 1_000_000) {
      return `$${(val / 1_000_000).toFixed(2)}M`;
    }
    return `$${Math.round(val).toLocaleString()} USD`;
  };

  return (
    <section className="w-full apple-glass rounded-3xl p-6 sm:p-8 hairline-border shadow-apple-card relative overflow-hidden">
      {/* Module Title Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-white/5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-[10px] tracking-widest text-[#00e5ff] uppercase px-2 py-0.5 rounded border border-[#00e5ff]/30 bg-[#00e5ff]/5">
              MODULE [A] // CHRONOS_SOLVER
            </span>
            <span className="text-xs font-mono text-gray-400">
              CO-OPTIMIZATION DISPATCH ENGINE
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tightest text-white">
            BESS Optimizer & Revenue Stacker
          </h2>
          <p className="text-xs sm:text-sm text-gray-400 font-normal mt-0.5">
            Simulate nodal arbitrage, DS 70 capacity remunerations, and frequency response margins across the Chilean grid.
          </p>
        </div>

        {/* Selected Substation Quick Switcher */}
        <div className="flex items-center gap-3 bg-white/[0.03] p-2 rounded-2xl border border-white/10">
          <div className="flex flex-col px-2">
            <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider">
              Nodal Interconnection
            </span>
            <select
              value={selectedNodeId}
              onChange={(e) => onSelectNodeId(e.target.value)}
              aria-label="Nodal Interconnection Substation"
              className="bg-transparent text-xs font-semibold text-[#00e5ff] focus:outline-none cursor-pointer pr-4"
            >
              {CHILEAN_NODES.map((n) => (
                <option key={n.id} value={n.id} className="bg-[#0b0d12] text-white">
                  {n.name} ({n.voltageKv}kV - {n.zone})
                </option>
              ))}
            </select>
          </div>
          <div className="h-8 w-px bg-white/10 hidden sm:block" />
          <div className="hidden sm:flex flex-col px-2">
            <span className="text-[10px] font-mono text-gray-400 uppercase">Spread Score</span>
            <span className="text-xs font-mono font-medium text-white">
              {activeNode.arbitrageScore} / 100
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid: Inputs (Left) and Results (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6">
        
        {/* Controls Column (5 cols) */}
        <div className="lg:col-span-5 space-y-6 bg-white/[0.02] p-5 rounded-2xl border border-white/5">
          <div className="flex items-center justify-between text-xs font-mono text-gray-400 uppercase tracking-wider pb-2 border-b border-white/5">
            <span className="flex items-center gap-2 text-white">
              <Sliders className="w-3.5 h-3.5 text-[#00e5ff]" />
              System Parameters
            </span>
            <span>DEFAULT: 20MW / 4H</span>
          </div>

          {/* Slider 1: Power MW */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-300 font-medium">Battery Nominal Power</span>
              <span className="font-mono text-[#00e5ff] font-semibold text-sm">
                {powerMw} MW
              </span>
            </div>
            <input
              type="range"
              min="5"
              max="100"
              step="5"
              value={powerMw}
              aria-label="Battery Nominal Power in Megawatts"
              onChange={(e) => setPowerMw(Number(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-[10px] font-mono text-gray-400">
              <span>5 MW</span>
              <span>50 MW</span>
              <span>100 MW</span>
            </div>
          </div>

          {/* Selector 2: Storage Duration */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-300 font-medium">Storage Duration</span>
              <span className="font-mono text-white font-semibold text-sm">
                {durationHours} Hours{' '}
                <span className="text-xs font-normal text-gray-400">
                  ({powerMw * durationHours} MWh)
                </span>
              </span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[2, 4, 5, 6].map((dur) => (
                <button
                  key={dur}
                  type="button"
                  onClick={() => setDurationHours(dur)}
                  className={`py-2 px-3 rounded-xl text-xs font-mono font-medium transition-all border ${
                    durationHours === dur
                      ? 'bg-[#00e5ff]/15 border-[#00e5ff] text-[#00e5ff] shadow-cyan-glow'
                      : 'bg-white/[0.03] border-white/10 text-gray-400 hover:text-white hover:bg-white/[0.06]'
                  }`}
                >
                  {dur} Hours
                </button>
              ))}
            </div>
          </div>

          {/* Slider 3: Round-Trip Efficiency (RTE) */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-300 font-medium">Round-Trip Efficiency (RTE)</span>
              <span className="font-mono text-[#10b981] font-semibold text-sm">
                {rtePercent.toFixed(1)}%
              </span>
            </div>
            <input
              type="range"
              min="82.0"
              max="92.0"
              step="0.5"
              value={rtePercent}
              aria-label="Round-Trip Efficiency percentage"
              onChange={(e) => setRtePercent(Number(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-[10px] font-mono text-gray-400">
              <span>82.0%</span>
              <span>86.5% (LFP Tier-1)</span>
              <span>92.0%</span>
            </div>
          </div>

          {/* Slider 4: Degradation / Daily Cycles */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-300 font-medium">Daily Dispatch Cycles</span>
              <span className="font-mono text-[#eab308] font-semibold text-sm">
                {cyclesPerDay.toFixed(2)} cycles/day
              </span>
            </div>
            <input
              type="range"
              min="1.0"
              max="2.0"
              step="0.05"
              value={cyclesPerDay}
              aria-label="Daily Dispatch Cycles"
              onChange={(e) => setCyclesPerDay(Number(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-[10px] font-mono text-gray-400">
              <span>1.0x (Peak only)</span>
              <span>1.25x (Arbitrage + SSCC)</span>
              <span>2.0x (High throughput)</span>
            </div>
          </div>

          {/* Benchmark CAPEX indicator */}
          <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs">
            <span className="text-gray-400 font-normal">Turnkey CAPEX Benchmark</span>
            <div className="flex items-center gap-2">
              <span className="font-mono text-white font-medium">$140 USD/kWh</span>
              <span className="text-[10px] font-mono text-gray-400 bg-white/5 px-2 py-0.5 rounded border border-white/10">
                2026 BENCHMARK
              </span>
            </div>
          </div>

          {/* Node detail callout */}
          <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/10 text-xs leading-relaxed space-y-1">
            <div className="flex items-center justify-between font-mono text-[10px] text-[#00e5ff]">
              <span>NODE: {activeNode.name}</span>
              <span>{activeNode.region}</span>
            </div>
            <p className="text-gray-400 text-[11px]">
              {activeNode.description}
            </p>
          </div>
        </div>

        {/* Live Financial Metrics & Revenue Stacker (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Top 4 Financial Scorecards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="apple-glass rounded-2xl p-4 border border-white/10">
              <span className="text-[10px] font-mono text-gray-400 uppercase">PROJECTED IRR</span>
              <div className="text-2xl font-bold font-mono tracking-tight text-[#00e5ff] mt-1">
                {metrics.irrPercent}%
              </div>
              <span className="text-[10px] font-mono text-gray-400">TIR 20-Year</span>
            </div>

            <div className="apple-glass rounded-2xl p-4 border border-white/10">
              <span className="text-[10px] font-mono text-gray-400 uppercase">PROJECT NPV (VAN)</span>
              <div className="text-2xl font-bold font-mono tracking-tight text-white mt-1">
                {formatUsd(metrics.npvUsd)}
              </div>
              <span className="text-[10px] font-mono text-gray-400">@ 8.5% WACC</span>
            </div>

            <div className="apple-glass rounded-2xl p-4 border border-white/10">
              <span className="text-[10px] font-mono text-gray-400 uppercase">PAYBACK PERIOD</span>
              <div className="text-2xl font-bold font-mono tracking-tight text-[#eab308] mt-1">
                {metrics.paybackYears} yrs
              </div>
              <span className="text-[10px] font-mono text-gray-400">Simple Return</span>
            </div>

            <div className="apple-glass rounded-2xl p-4 border border-white/10">
              <span className="text-[10px] font-mono text-gray-400 uppercase">TOTAL CAPEX</span>
              <div className="text-2xl font-bold font-mono tracking-tight text-gray-200 mt-1">
                {formatUsd(metrics.totalCapexUsd)}
              </div>
              <span className="text-[10px] font-mono text-gray-400">Turnkey + Interconn.</span>
            </div>
          </div>

          {/* Revenue Stacking Breakdown */}
          <div className="apple-glass rounded-2xl p-5 border border-white/10 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-white/5">
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-[#00e5ff]" />
                <span className="text-xs font-mono font-medium text-white uppercase tracking-wider">
                  Annual Revenue Stacking (SEN Chile)
                </span>
              </div>
              <span className="text-xs font-mono text-[#00e5ff] font-semibold">
                Gross: {formatUsd(metrics.grossAnnualRevenueUsd)}/yr
              </span>
            </div>

            {/* Stacked Bar Visual */}
            <div className="space-y-1.5">
              <div className="h-3 w-full bg-black/40 rounded-full overflow-hidden flex">
                <div
                  style={{
                    width: `${(metrics.annualArbitrageUsd / metrics.grossAnnualRevenueUsd) * 100}%`,
                  }}
                  className="bg-[#00e5ff] transition-all duration-300"
                  title="Spot Arbitrage"
                />
                <div
                  style={{
                    width: `${(metrics.annualCapacityDs70Usd / metrics.grossAnnualRevenueUsd) * 100}%`,
                  }}
                  className="bg-[#eab308] transition-all duration-300"
                  title="DS 70 Capacity"
                />
                <div
                  style={{
                    width: `${(metrics.annualSsccUsd / metrics.grossAnnualRevenueUsd) * 100}%`,
                  }}
                  className="bg-[#10b981] transition-all duration-300"
                  title="SSCC Frequency Reserves"
                />
              </div>
              <div className="flex justify-between text-[9px] font-mono text-gray-400 pt-0.5">
                <span>0%</span>
                <span>ANNUAL REVENUE STACK COMPOSITION</span>
                <span>100%</span>
              </div>
            </div>

            {/* The 3 Pillars List */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="w-2 h-2 rounded-full bg-[#00e5ff]" />
                  <span className="text-[11px] font-medium text-gray-300">Spot Arbitrage</span>
                </div>
                <div className="text-base font-semibold font-mono text-white">
                  {formatUsd(metrics.annualArbitrageUsd)}
                </div>
                <span className="text-[10px] font-mono text-gray-400">
                  {((metrics.annualArbitrageUsd / metrics.grossAnnualRevenueUsd) * 100).toFixed(0)}% of total
                </span>
              </div>

              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="w-2 h-2 rounded-full bg-[#eab308]" />
                  <span className="text-[11px] font-medium text-gray-300">DS 70 Capacity</span>
                </div>
                <div className="text-base font-semibold font-mono text-white">
                  {formatUsd(metrics.annualCapacityDs70Usd)}
                </div>
                <span className="text-[10px] font-mono text-gray-400">
                  {((metrics.annualCapacityDs70Usd / metrics.grossAnnualRevenueUsd) * 100).toFixed(0)}% of total
                </span>
              </div>

              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="w-2 h-2 rounded-full bg-[#10b981]" />
                  <span className="text-[11px] font-medium text-gray-300">SSCC Reserves</span>
                </div>
                <div className="text-base font-semibold font-mono text-white">
                  {formatUsd(metrics.annualSsccUsd)}
                </div>
                <span className="text-[10px] font-mono text-gray-400">
                  {((metrics.annualSsccUsd / metrics.grossAnnualRevenueUsd) * 100).toFixed(0)}% of total
                </span>
              </div>
            </div>

            {/* OPEX & Net EBITDA Row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-2 border-t border-white/5 text-xs font-mono text-gray-400 gap-2">
              <span>Annual OPEX & Cells Reserve: {formatUsd(metrics.annualOpexUsd)}/yr</span>
              <span className="text-white font-semibold">
                Net Project EBITDA: {formatUsd(metrics.netAnnualEbitdaUsd)}/yr
              </span>
            </div>
          </div>

          {/* 24-Hour Dispatch Cycle Graph */}
          <div className="apple-glass rounded-2xl p-5 border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-[#00e5ff]" />
                <span className="text-xs font-mono font-medium text-white uppercase tracking-wider">
                  24-Hour Dispatch & State-of-Charge Cycle
                </span>
              </div>
              <div className="flex items-center gap-3 text-[10px] font-mono">
                <span className="flex items-center gap-1 text-gray-400">
                  <span className="w-2.5 h-1 bg-[#00e5ff]" /> SoC Curve
                </span>
                <span className="flex items-center gap-1 text-gray-400">
                  <span className="w-2.5 h-1 bg-[#f59e0b]" /> Spot Cost ($/MWh)
                </span>
              </div>
            </div>

            {/* Interactive SVG Chart for 24 Hours */}
            <div className="h-44 w-full relative">
              <svg
                className="w-full h-full overflow-visible"
                viewBox="0 0 480 160"
                preserveAspectRatio="none"
              >
                {/* Background Grid Lines */}
                <line x1="0" y1="40" x2="480" y2="40" stroke="rgba(255,255,255,0.05)" strokeDasharray="2,2" />
                <line x1="0" y1="80" x2="480" y2="80" stroke="rgba(255,255,255,0.05)" strokeDasharray="2,2" />
                <line x1="0" y1="120" x2="480" y2="120" stroke="rgba(255,255,255,0.05)" strokeDasharray="2,2" />

                {/* Solar valley highlight area (10:00 - 15:00) */}
                <rect
                  x={(10 / 23) * 480}
                  y="10"
                  width={(5 / 23) * 480}
                  height="140"
                  fill="rgba(234, 179, 8, 0.05)"
                  stroke="rgba(234, 179, 8, 0.15)"
                  strokeWidth="0.5"
                />

                {/* Evening peak highlight area (19:00 - 23:00) */}
                <rect
                  x={(19 / 23) * 480}
                  y="10"
                  width={(4 / 23) * 480}
                  height="140"
                  fill="rgba(0, 229, 255, 0.05)"
                  stroke="rgba(0, 229, 255, 0.15)"
                  strokeWidth="0.5"
                />

                {/* Charging / Discharging Bars */}
                {dispatchProfile.map((step, idx) => {
                  const x = (idx / 23) * 460 + 10;
                  const barWidth = 10;
                  
                  // Charging bar (yellow downwards)
                  if (step.chargePowerMw > 0) {
                    const barHeight = (step.chargePowerMw / powerMw) * 45;
                    return (
                      <rect
                        key={`chg-${idx}`}
                        x={x - barWidth / 2}
                        y={145 - barHeight}
                        width={barWidth}
                        height={barHeight}
                        fill="rgba(234, 179, 8, 0.4)"
                        rx="2"
                      />
                    );
                  }
                  // Discharging bar (cyan upwards)
                  if (step.dischargePowerMw > 0) {
                    const barHeight = (step.dischargePowerMw / powerMw) * 45;
                    return (
                      <rect
                        key={`dis-${idx}`}
                        x={x - barWidth / 2}
                        y={145 - barHeight}
                        width={barWidth}
                        height={barHeight}
                        fill="rgba(0, 229, 255, 0.5)"
                        rx="2"
                      />
                    );
                  }
                  return null;
                })}

                {/* SoC Line (0 to 100%) */}
                {(() => {
                  const points = dispatchProfile
                    .map((step, idx) => {
                      const x = (idx / 23) * 460 + 10;
                      // SoC 0% is y=145, 100% is y=20
                      const y = 145 - (step.stateOfChargePercent / 100) * 125;
                      return `${x},${y}`;
                    })
                    .join(' ');
                  return (
                    <polyline
                      fill="none"
                      stroke="#00e5ff"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      points={points}
                    />
                  );
                })()}

                {/* Marginal Cost Line (0 to 200 USD/MWh) */}
                {(() => {
                  const points = dispatchProfile
                    .map((step, idx) => {
                      const x = (idx / 23) * 460 + 10;
                      // Cost 0 is y=145, 200 is y=20
                      const y = 145 - Math.min(125, (step.systemMarginalCost / 180) * 125);
                      return `${x},${y}`;
                    })
                    .join(' ');
                  return (
                    <polyline
                      fill="none"
                      stroke="#f59e0b"
                      strokeWidth="1.5"
                      strokeDasharray="4,3"
                      strokeLinecap="round"
                      points={points}
                    />
                  );
                })()}

                {/* Interactive cursor circles */}
                {dispatchProfile.map((step, idx) => {
                  const x = (idx / 23) * 460 + 10;
                  const y = 145 - (step.stateOfChargePercent / 100) * 125;
                  const isHovered = hoveredHour === step.hour;
                  return (
                    <g key={idx} onMouseEnter={() => setHoveredHour(step.hour)} onMouseLeave={() => setHoveredHour(null)}>
                      <circle
                        cx={x}
                        cy={y}
                        r={isHovered ? 5 : 2.5}
                        fill={isHovered ? '#ffffff' : '#00e5ff'}
                        className="cursor-pointer transition-all"
                      />
                      {/* invisible hover trigger rect */}
                      <rect
                        x={x - 10}
                        y={10}
                        width={20}
                        height={140}
                        fill="transparent"
                        className="cursor-pointer"
                      />
                    </g>
                  );
                })}
              </svg>

              {/* Hover Tooltip Overlay */}
              {hoveredHour !== null && (
                <div
                  className="absolute top-2 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-lg apple-glass border border-white/20 text-[10px] font-mono text-white flex items-center gap-4 pointer-events-none shadow-xl"
                >
                  <span className="text-[#00e5ff] font-semibold">{String(hoveredHour).padStart(2, '0')}:00 hrs</span>
                  <span>SoC: {dispatchProfile[hoveredHour].stateOfChargePercent}% ({dispatchProfile[hoveredHour].stateOfChargeMwh} MWh)</span>
                  <span className="text-[#f59e0b]">Price: ${dispatchProfile[hoveredHour].systemMarginalCost}/MWh</span>
                  {dispatchProfile[hoveredHour].chargePowerMw > 0 && (
                    <span className="text-[#eab308]">Charging +{dispatchProfile[hoveredHour].chargePowerMw}MW</span>
                  )}
                  {dispatchProfile[hoveredHour].dischargePowerMw > 0 && (
                    <span className="text-[#00e5ff]">Injecting -{dispatchProfile[hoveredHour].dischargePowerMw}MW</span>
                  )}
                </div>
              )}
            </div>

            {/* X-axis hours indicators */}
            <div className="flex justify-between text-[10px] font-mono text-gray-400 px-2 pt-1 border-t border-white/5">
              <span>00:00</span>
              <span>06:00</span>
              <span className="text-[#eab308] font-semibold">12:00 (Solar Charge)</span>
              <span>18:00</span>
              <span className="text-[#00e5ff] font-semibold">21:00 (Peak Inject)</span>
              <span>23:00</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
