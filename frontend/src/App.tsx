import React, { useState, useMemo } from 'react';
import { KineticIntro } from './components/KineticIntro';
import { TopNavbar } from './components/TopNavbar';
import { HeroMetricRibbon } from './components/HeroMetricRibbon';
import { ChronosOptimizer } from './components/ChronosOptimizer';
import { NodalHeatmap } from './components/NodalHeatmap';
import { AuroraScenarios } from './components/AuroraScenarios';
import { InstitutionalReportModal } from './components/InstitutionalReportModal';
import { DocumentationModal } from './components/DocumentationModal';
import { CHILEAN_NODES } from './data/chileanGridData';
import { calculateBessMetrics } from './utils/bessMath';
import { BessConfig, ChileanNode } from './types/energy';
import { Shield, Zap, Terminal, Activity } from 'lucide-react';

export const App: React.FC = () => {
  // Kinetic machine intro state
  const [showIntro, setShowIntro] = useState<boolean>(true);

  // Active substation node selection
  const [selectedNodeId, setSelectedNodeId] = useState<string>('cardones_500');

  // Modal states
  const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false);
  const [isDocModalOpen, setIsDocModalOpen] = useState<boolean>(false);

  // Synchronized active node
  const activeNode = useMemo(() => {
    return CHILEAN_NODES.find((n) => n.id === selectedNodeId) || CHILEAN_NODES[2];
  }, [selectedNodeId]);

  // Default configuration for modal export
  const activeConfig: BessConfig = useMemo(
    () => ({
      powerMw: 20,
      durationHours: 4,
      substationId: activeNode.id,
      rtePercent: 86.5,
      cyclesPerDay: 1.25,
      capexPerKwh: 140,
      waccPercent: 8.5,
    }),
    [activeNode.id]
  );

  const activeMetrics = useMemo(
    () => calculateBessMetrics(activeConfig, activeNode),
    [activeConfig, activeNode]
  );

  const handleSelectNode = (node: ChileanNode) => {
    setSelectedNodeId(node.id);
  };

  return (
    <div className="min-h-screen bg-[#060709] text-[#f3f4f6] font-sans selection:bg-[#00e5ff]/20 selection:text-[#00e5ff] relative overflow-x-hidden">
      
      {/* Kinetic Genesis Intro Overlay */}
      {showIntro && <KineticIntro onComplete={() => setShowIntro(false)} />}

      {/* Main Cockpit Layout */}
      <div className={`transition-opacity duration-700 ${showIntro ? 'opacity-0' : 'opacity-100'}`}>
        
        {/* Navigation Bar */}
        <TopNavbar
          onReplayGenesis={() => setShowIntro(true)}
          onOpenReportModal={() => setIsReportModalOpen(true)}
          onOpenDocModal={() => setIsDocModalOpen(true)}
        />

        {/* Cockpit Content Container */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
          
          {/* Header Briefing Banner */}
          <section className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2">
            <div>
              <div className="flex items-center gap-2 mb-2 font-mono text-[11px] text-[#00e5ff] tracking-wider uppercase">
                <span className="w-2 h-2 rounded-full bg-[#00e5ff] animate-pulse" />
                <span>CHILEAN ELECTRIC SYSTEM (SEN) // OCT-NOV 2026 AUDITED</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-semibold tracking-tightest text-white">
                Power Market Intelligence & BESS OS
              </h1>
              <p className="text-sm sm:text-base text-gray-400 font-normal mt-2 max-w-2xl leading-relaxed">
                Institutional dispatch co-optimization, nodal transmission congestion analytics, and 2025–2040 capacity expansion modeling.
              </p>
            </div>

            <div className="flex items-center gap-2 self-start md:self-end font-mono text-xs">
              <div className="px-3 py-1.5 rounded-xl apple-glass border border-white/10 text-gray-300 flex items-center gap-2">
                <Terminal className="w-3.5 h-3.5 text-[#00e5ff]" />
                <span>SOLVER: SCIP/IPOPT 8.1</span>
              </div>
              <div className="px-3 py-1.5 rounded-xl apple-glass border border-white/10 text-gray-300 flex items-center gap-2">
                <Activity className="w-3.5 h-3.5 text-[#10b981]" />
                <span>GRID LATENCY: 14ms</span>
              </div>
            </div>
          </section>

          {/* Hero Metric Ribbon (The 4 Pillar Indices) */}
          <HeroMetricRibbon />

          {/* Module A: BESS Optimizer & Revenue Stacker (The Chronos Engine) */}
          <ChronosOptimizer
            selectedNodeId={selectedNodeId}
            onSelectNodeId={setSelectedNodeId}
          />

          {/* Module B: Nodal Congestion & Curtailment Heatmap */}
          <NodalHeatmap
            selectedNodeId={selectedNodeId}
            onSelectNode={handleSelectNode}
          />

          {/* Module C: Long-term Scenarios 2025-2040 (The Aurora Origin Engine) */}
          <AuroraScenarios />

        </main>

        {/* Institutional Footer */}
        <footer className="w-full border-t border-white/10 py-12 mt-16 bg-[#040507]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 text-xs text-gray-500 font-mono">
            <div>
              <div className="flex items-center gap-2 text-white font-semibold mb-1">
                <Zap className="w-4 h-4 text-[#00e5ff]" />
                <span>VOLTIA // ENERGY OS</span>
              </div>
              <div>SEN CHILE INSTITUTIONAL ANALYTICS & CAPACITY VALUATION</div>
              <div className="text-[10px] text-gray-600 mt-1">
                Data sources: Coordinador Eléctrico Nacional (CEN), Comisión Nacional de Energía (CNE), SEA Chile.
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-[11px] text-gray-400">
              <button
                onClick={() => setIsDocModalOpen(true)}
                className="hover:text-white transition-colors"
              >
                Regulatory Framework
              </button>
              <button
                onClick={() => setIsReportModalOpen(true)}
                className="hover:text-white transition-colors"
              >
                Export Memorandum
              </button>
              <button
                onClick={() => setShowIntro(true)}
                className="hover:text-[#00e5ff] transition-colors"
              >
                Replay Genesis FX
              </button>
            </div>
          </div>
        </footer>

        {/* Modals */}
        <InstitutionalReportModal
          isOpen={isReportModalOpen}
          onClose={() => setIsReportModalOpen(false)}
          config={activeConfig}
          metrics={activeMetrics}
          node={activeNode}
        />

        <DocumentationModal
          isOpen={isDocModalOpen}
          onClose={() => setIsDocModalOpen(false)}
        />

      </div>
    </div>
  );
};
