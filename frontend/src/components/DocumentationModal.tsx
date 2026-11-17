import React from 'react';
import { X, BookOpen, ExternalLink, ShieldCheck, Zap } from 'lucide-react';

interface DocumentationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DocumentationModal: React.FC<DocumentationModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-[#0b0d12] border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl my-8 text-gray-200 font-sans">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-[#00e5ff]" />
            <span className="text-xs font-mono uppercase tracking-widest text-white">
              VOLTIA // SEN CHILE REGULATORY FRAMEWORK & METHODOLOGY
            </span>
          </div>
          <button
            onClick={onClose}
            aria-label="Close regulatory documentation"
            className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content sections */}
        <div className="space-y-6 mt-6 text-xs leading-relaxed text-gray-300">
          
          {/* Section 1 */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 font-mono text-[11px] text-[#00e5ff] uppercase">
              <span>[01] DECRETO SUPREMO 70 (DS 70) // POTENCIA DE SUFICIENCIA</span>
            </div>
            <p>
              Under Chilean power market regulations (Decreto Supremo Nº 70 del Ministerio de Energía), storage assets (BESS) are remunerated for their firm capacity contribution to system peak demand. The capacity payment is formulated as:
            </p>
            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 font-mono text-[11px] text-white">
              Revenue_Cap = Capacity_kW × Tariff_USD_kW_Month × Duration_Derating_Factor × 12
            </div>
            <p className="text-gray-400">
              Where the Duration Derating Factor scales from ~52% for 2-hour systems, 88% for 4-hour systems, up to 99% for 6-hour systems, creating a powerful economic incentive for 4h+ storage installations in the SEN.
            </p>
          </div>

          {/* Section 2 */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 font-mono text-[11px] text-[#eab308] uppercase">
              <span>[02] SERVICIOS COMPLEMENTARIOS (SSCC)</span>
            </div>
            <p>
              The Coordinador Eléctrico Nacional (CEN) mandates frequency regulation reserves (Control Primario de Frecuencia CPF, Control Secundario de Frecuencia CSF) and rapid voltage support. Battery systems deliver near-instantaneous (sub-100ms) inverter response, earning priority dispatch and capacity reserve fees benchmarked at $12,000 to $18,000 USD/MW/year.
            </p>
          </div>

          {/* Section 3 */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 font-mono text-[11px] text-[#10b981] uppercase">
              <span>[03] TRANSMISSION BOTTLENECKS & KIMAL-LO AGUIRRE HVDC (2029)</span>
            </div>
            <p>
              Chile’s National Electric System (SEN) features extreme geographical elongation (~3,100 km). Massive solar generation in the Atacama desert (Norte Grande and Norte Chico) routinely overwhelms the 500kV Cardones-Polpaico alternating current corridor, driving daytime marginal costs to $0.00 USD/MWh and causing over 4.4 TWh of renewable curtailment per year.
            </p>
            <p className="text-gray-400">
              The upcoming Kimal-Lo Aguirre project (bipolar ±600 kV HVDC, 3,000 MW, scheduled for 2029) will evacuate surplus energy directly to the Santiago metropolitan ring, altering nodal marginal spreads and rewarding localized southern BESS placement.
            </p>
          </div>

          {/* Section 4 */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 font-mono text-[11px] text-gray-400 uppercase">
              <span>[04] FINANCIAL MODELING METHODOLOGY</span>
            </div>
            <p>
              VOLTIA calculates Net Present Value (NPV / VAN) and Internal Rate of Return (IRR / TIR) using an unlevered 20-year cash flow profile, incorporating 1.8% annual battery capacity degradation, a 1.65% OPEX/augmentation allowance, and an 8.5% institutional WACC.
            </p>
          </div>

        </div>

        {/* Footer */}
        <div className="mt-8 pt-4 border-t border-white/10 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white text-black font-medium text-xs hover:bg-[#00e5ff] transition-colors"
          >
            Acknowledge & Close
          </button>
        </div>

      </div>
    </div>
  );
};
