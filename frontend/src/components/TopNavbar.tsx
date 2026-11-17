import React, { useState } from 'react';
import { Zap, Download, RefreshCw, FileText, ChevronDown, Check, Globe, ShieldCheck } from 'lucide-react';

interface TopNavbarProps {
  onReplayGenesis: () => void;
  onOpenReportModal: () => void;
  onOpenDocModal: () => void;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({
  onReplayGenesis,
  onOpenReportModal,
  onOpenDocModal,
}) => {
  const [selectedMarket, setSelectedMarket] = useState('chile');
  const [marketMenuOpen, setMarketMenuOpen] = useState(false);

  const markets = [
    { id: 'chile', name: 'Chile SEN (SIC/SING Interconnected)', active: true, tag: 'LIVE_DATA' },
    { id: 'mexico', name: 'Mexico (CENACE / MEM)', active: false, tag: 'COMING_Q1_2027' },
    { id: 'colombia', name: 'Colombia (XM / SIN)', active: false, tag: 'COMING_Q2_2027' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full apple-glass hairline-b backdrop-blur-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand section */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-white/10 to-white/[0.02] border border-white/15 flex items-center justify-center shadow-sm">
            <Zap className="w-4 h-4 text-[#00e5ff] stroke-[2]" />
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm tracking-tight text-white">
                VOLTIA <span className="text-gray-500 font-normal font-mono">//</span> ENERGY OS
              </span>
              <span className="hidden sm:inline-block text-[10px] font-mono tracking-wider uppercase px-2 py-0.5 rounded border border-white/10 bg-white/[0.03] text-gray-400">
                SEN_CHILE // MKT_INTELLIGENCE
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] font-mono text-gray-500">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]" />
              <span>CEN SYNC: ACTIVE // OCT-NOV 2026 AUDITED</span>
            </div>
          </div>
        </div>

        {/* Market Selector Dropdown */}
        <div className="relative hidden md:block">
          <button
            onClick={() => setMarketMenuOpen(!marketMenuOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] text-xs font-mono text-gray-300 transition-colors"
          >
            <Globe className="w-3.5 h-3.5 text-[#00e5ff]" />
            <span>Chile SEN (Interconnected)</span>
            <ChevronDown className="w-3 h-3 text-gray-500" />
          </button>

          {marketMenuOpen && (
            <div className="absolute left-0 mt-2 w-72 rounded-xl apple-glass shadow-2xl p-2 border border-white/15 text-xs z-50">
              <div className="px-2 py-1 text-[10px] font-mono text-gray-500 uppercase tracking-wider">
                Select Power Market
              </div>
              {markets.map((m) => (
                <button
                  key={m.id}
                  disabled={!m.active}
                  onClick={() => {
                    setSelectedMarket(m.id);
                    setMarketMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between p-2 rounded-lg text-left transition-colors ${
                    m.active
                      ? selectedMarket === m.id
                        ? 'bg-white/10 text-white font-medium'
                        : 'text-gray-300 hover:bg-white/5'
                      : 'opacity-40 cursor-not-allowed text-gray-600'
                  }`}
                >
                  <div className="flex flex-col">
                    <span className="text-xs">{m.name}</span>
                    <span className="text-[9px] font-mono text-gray-500">{m.tag}</span>
                  </div>
                  {selectedMarket === m.id && (
                    <Check className="w-3.5 h-3.5 text-[#00e5ff]" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Quick actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Documentation Modal */}
          <button
            onClick={onOpenDocModal}
            className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 text-xs text-gray-300 hover:text-white hover:bg-white/5 transition-colors font-mono"
          >
            <FileText className="w-3.5 h-3.5 text-gray-400" />
            <span>Documentation</span>
          </button>

          {/* Replay Genesis FX */}
          <button
            onClick={onReplayGenesis}
            title="Replay Genesis FX sequence"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 bg-white/[0.02] text-xs text-gray-400 hover:text-[#00e5ff] hover:border-[#00e5ff]/40 hover:bg-[#00e5ff]/5 transition-all font-mono"
          >
            <RefreshCw className="w-3 h-3 text-[#00e5ff]" />
            <span className="hidden sm:inline">Genesis FX</span>
          </button>

          {/* Institutional PDF Export */}
          <button
            onClick={onOpenReportModal}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-white text-black font-medium text-xs tracking-tight hover:bg-[#00e5ff] transition-all shadow-sm"
          >
            <Download className="w-3.5 h-3.5 stroke-[2]" />
            <span>Export Institutional PDF</span>
          </button>
        </div>

      </div>
    </header>
  );
};
