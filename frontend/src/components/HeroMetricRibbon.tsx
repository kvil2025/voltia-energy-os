import React from 'react';
import { ArrowUpRight, TrendingUp, AlertTriangle, BatteryCharging, Zap } from 'lucide-react';

export const HeroMetricRibbon: React.FC = () => {
  const metrics = [
    {
      id: '01',
      label: 'SYSTEM MARGINAL SPREAD',
      value: '$118.4',
      unit: 'USD/MWh',
      subtext: 'Peak night (19:00-23:00) vs solar noon',
      badge: '+14.2% vs 2025',
      badgePositive: true,
      sparkline: [40, 55, 62, 78, 92, 105, 118.4],
      accentColor: '#00e5ff',
    },
    {
      id: '02',
      label: 'SOLAR CURTAILMENT TODAY',
      value: '18.4',
      unit: 'GWh DIVERTED',
      subtext: 'Congestion bottleneck: Cardones-Polpaico 500kV',
      badge: 'THERMAL SATURATION',
      badgePositive: false,
      sparkline: [8, 12, 14, 19, 24, 21, 18.4],
      accentColor: '#f59e0b',
    },
    {
      id: '03',
      label: 'ZERO-PRICE HOURS (2026 YTD)',
      value: '1,842',
      unit: 'HRS AT $0.00',
      subtext: '21.0% of total annual hours at zero marginal cost',
      badge: 'EXPANDING ARBITRAGE',
      badgePositive: true,
      sparkline: [350, 720, 1100, 1450, 1680, 1790, 1842],
      accentColor: '#eab308',
    },
    {
      id: '04',
      label: 'BESS IN PIPELINE (SEN)',
      value: '8,920',
      unit: 'MW IN SEA/EIA',
      subtext: '+3,410 MW under active construction / EPC',
      badge: 'CAPEX $140/kWh',
      badgePositive: true,
      sparkline: [1200, 2400, 3900, 5600, 7100, 8300, 8920],
      accentColor: '#10b981',
    },
  ];

  return (
    <section className="w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m) => (
          <div
            key={m.id}
            className="apple-glass apple-glass-hover rounded-2xl p-5 relative overflow-hidden group shadow-apple-card flex flex-col justify-between"
          >
            {/* Top metadata line */}
            <div className="flex items-center justify-between mb-3">
              <span className="font-mono text-[10px] tracking-widest text-gray-400 uppercase">
                [{m.id}] {m.label}
              </span>
              <span
                className={`text-[9px] font-mono uppercase px-2 py-0.5 rounded border ${
                  m.badgePositive
                    ? 'border-[#00e5ff]/30 text-[#00e5ff] bg-[#00e5ff]/5'
                    : 'border-[#f59e0b]/30 text-[#f59e0b] bg-[#f59e0b]/5'
                }`}
              >
                {m.badge}
              </span>
            </div>

            {/* Core Big Number */}
            <div className="my-1 flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-semibold tracking-tightest text-white">
                {m.value}
              </span>
              <span className="text-xs font-mono text-gray-400 tracking-wider uppercase">
                {m.unit}
              </span>
            </div>

            {/* Explanatory subtext */}
            <div className="text-xs text-gray-400 font-normal leading-relaxed mt-1 mb-4">
              {m.subtext}
            </div>

            {/* Micro hairline SVG sparkline */}
            <div className="pt-2 border-t border-white/5 flex items-center justify-between">
              <span className="text-[10px] font-mono text-gray-400">TREND 7-PERIOD</span>
              <div className="w-24 h-5">
                <svg className="w-full h-full overflow-visible" viewBox="0 0 100 24">
                  {(() => {
                    const min = Math.min(...m.sparkline);
                    const max = Math.max(...m.sparkline);
                    const range = max - min || 1;
                    const points = m.sparkline
                      .map((val, idx) => {
                        const x = (idx / (m.sparkline.length - 1)) * 100;
                        const y = 22 - ((val - min) / range) * 20;
                        return `${x},${y}`;
                      })
                      .join(' ');
                    return (
                      <>
                        <polyline
                          fill="none"
                          stroke={m.accentColor}
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          points={points}
                        />
                        {/* Final point indicator */}
                        {(() => {
                          const lastVal = m.sparkline[m.sparkline.length - 1];
                          const lastY = 22 - ((lastVal - min) / range) * 20;
                          return (
                            <circle
                              cx="100"
                              cy={lastY}
                              r="2.5"
                              fill={m.accentColor}
                              className="animate-pulse"
                            />
                          );
                        })()}
                      </>
                    );
                  })()}
                </svg>
              </div>
            </div>

            {/* Delicate ambient corner glow */}
            <div
              className="absolute -top-12 -right-12 w-24 h-24 rounded-full blur-2xl pointer-events-none opacity-20 group-hover:opacity-40 transition-opacity"
              style={{ backgroundColor: m.accentColor }}
            />
          </div>
        ))}
      </div>
    </section>
  );
};
