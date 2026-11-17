import React from 'react';
import { BessConfig, BessFinancialResult, ChileanNode } from '../types/energy';
import { X, Printer, Download, ShieldCheck, FileCheck, Copy, Check } from 'lucide-react';

interface InstitutionalReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: BessConfig;
  metrics: BessFinancialResult;
  node: ChileanNode;
}

export const InstitutionalReportModal: React.FC<InstitutionalReportModalProps> = ({
  isOpen,
  onClose,
  config,
  metrics,
  node,
}) => {
  const [copied, setCopied] = React.useState(false);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleCopyJson = () => {
    const reportData = {
      project: 'VOLTIA Institutional Power Market Memorandum',
      timestamp: new Date().toISOString(),
      interconnectionSubstation: {
        name: node.name,
        voltageKv: node.voltageKv,
        region: node.region,
        congestionIndex: node.transmissionCongestionIndex,
        arbitrageScore: node.arbitrageScore,
      },
      systemParameters: {
        powerMw: config.powerMw,
        durationHours: config.durationHours,
        capacityMwh: metrics.energyMwh,
        rtePercent: config.rtePercent,
        dailyCycles: config.cyclesPerDay,
        capexPerKwhBenchmark: config.capexPerKwh,
      },
      financialMetrics: {
        totalCapexUsd: metrics.totalCapexUsd,
        annualOpexUsd: metrics.annualOpexUsd,
        grossAnnualRevenueUsd: metrics.grossAnnualRevenueUsd,
        spotArbitrageUsd: metrics.annualArbitrageUsd,
        ds70CapacityUsd: metrics.annualCapacityDs70Usd,
        ssccReservesUsd: metrics.annualSsccUsd,
        netEbitdaUsd: metrics.netAnnualEbitdaUsd,
        projectedIrrPercent: metrics.irrPercent,
        projectNpvUsd: metrics.npvUsd,
        paybackYears: metrics.paybackYears,
        lcosUsdMwh: metrics.levelizedCostStorageUsdMwh,
      },
    };

    navigator.clipboard.writeText(JSON.stringify(reportData, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatCurrency = (val: number) => {
    return `$${Math.round(val).toLocaleString()} USD`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-[#0b0d12] border border-white/15 rounded-3xl p-6 sm:p-10 shadow-2xl my-8 text-gray-200">
        
        {/* Modal Controls Bar (Hidden during print) */}
        <div className="flex items-center justify-between pb-6 border-b border-white/10 no-print">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#00e5ff]" />
            <span className="text-xs font-mono uppercase tracking-widest text-gray-400">
              INSTITUTIONAL MEMORANDUM PREVIEW
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleCopyJson}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 text-xs font-mono text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-[#10b981]" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied JSON' : 'Copy JSON'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-1.5 rounded-lg bg-white text-black font-medium text-xs hover:bg-[#00e5ff] transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save as PDF</span>
            </button>

            <button
              onClick={onClose}
              aria-label="Close institutional memorandum"
              className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* PRINTABLE MEMORANDUM CONTENT */}
        <div className="space-y-8 mt-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b border-white/10">
            <div>
              <div className="text-[10px] font-mono tracking-widest text-[#00e5ff] uppercase mb-1">
                VOLTIA ADVISORY // INSTITUTIONAL MEMORANDUM
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                BESS Investment & Revenue Stack Valuation
              </h1>
              <p className="text-xs font-mono text-gray-400 mt-1">
                SEN Chile Power Market // Substation {node.name} ({node.voltageKv}kV)
              </p>
            </div>

            <div className="sm:text-right font-mono text-[11px] text-gray-400 space-y-1">
              <div>REF: VOLTIA-SEN-2026-CHRONOS-BESS-v4</div>
              <div>DATE: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</div>
              <div>SECURITY: INSTITUTIONAL PRIVATE & CONFIDENTIAL</div>
            </div>
          </div>

          {/* Section 1: Executive Summary */}
          <div className="space-y-3">
            <h2 className="text-xs font-mono tracking-wider text-gray-400 uppercase">
              1.0 Executive Technical & Financial Configuration
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/10">
                <span className="text-[10px] text-gray-400">INSTALLED CAPACITY</span>
                <div className="text-lg font-bold text-white mt-0.5">{config.powerMw} MW / {metrics.energyMwh} MWh</div>
                <span className="text-[9px] text-gray-400">{config.durationHours}-Hour Duration</span>
              </div>

              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/10">
                <span className="text-[10px] text-gray-400">TOTAL CAPEX</span>
                <div className="text-lg font-bold text-white mt-0.5">{formatCurrency(metrics.totalCapexUsd)}</div>
                <span className="text-[9px] text-gray-400">@ ${config.capexPerKwh}/kWh benchmark</span>
              </div>

              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/10">
                <span className="text-[10px] text-gray-400">PROJECTED 20-YR IRR</span>
                <div className="text-lg font-bold text-[#00e5ff] mt-0.5">{metrics.irrPercent}%</div>
                <span className="text-[9px] text-gray-400">Unlevered Nominal</span>
              </div>

              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/10">
                <span className="text-[10px] text-gray-400">NPV (VAN @ 8.5%)</span>
                <div className="text-lg font-bold text-[#10b981] mt-0.5">{formatCurrency(metrics.npvUsd)}</div>
                <span className="text-[9px] text-gray-400">Payback: {metrics.paybackYears} yrs</span>
              </div>
            </div>
          </div>

          {/* Section 2: Revenue Stacking Breakdown */}
          <div className="space-y-3">
            <h2 className="text-xs font-mono tracking-wider text-gray-400 uppercase">
              2.0 Annualized Revenue Stack Remuneration (SEN Chile)
            </h2>
            <div className="border border-white/10 rounded-2xl overflow-hidden">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-white/[0.04] text-gray-400 text-[10px] uppercase">
                  <tr>
                    <th className="py-2.5 px-4">Remuneration Stream</th>
                    <th className="py-2.5 px-4">Regulatory Mechanism</th>
                    <th className="py-2.5 px-4 text-right">Annual Gross (USD)</th>
                    <th className="py-2.5 px-4 text-right">Share</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-gray-300">
                  <tr>
                    <td className="py-3 px-4 font-semibold text-white">Nodal Spot Arbitrage</td>
                    <td className="py-3 px-4 text-gray-400">CEN Hourly Marginal Cost Spread (10:00 vs 20:00)</td>
                    <td className="py-3 px-4 text-right text-white font-medium">{formatCurrency(metrics.annualArbitrageUsd)}</td>
                    <td className="py-3 px-4 text-right text-[#00e5ff] font-medium">
                      {((metrics.annualArbitrageUsd / metrics.grossAnnualRevenueUsd) * 100).toFixed(1)}%
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-semibold text-white">DS 70 Capacity Payment</td>
                    <td className="py-3 px-4 text-gray-400">Transferencias de Potencia de Suficiencia (CNE / CEN)</td>
                    <td className="py-3 px-4 text-right text-white font-medium">{formatCurrency(metrics.annualCapacityDs70Usd)}</td>
                    <td className="py-3 px-4 text-right text-[#eab308] font-medium">
                      {((metrics.annualCapacityDs70Usd / metrics.grossAnnualRevenueUsd) * 100).toFixed(1)}%
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-semibold text-white">SSCC Frequency Response</td>
                    <td className="py-3 px-4 text-gray-400">Control Primario y Secundario de Frecuencia (CEN)</td>
                    <td className="py-3 px-4 text-right text-white font-medium">{formatCurrency(metrics.annualSsccUsd)}</td>
                    <td className="py-3 px-4 text-right text-[#10b981] font-medium">
                      {((metrics.annualSsccUsd / metrics.grossAnnualRevenueUsd) * 100).toFixed(1)}%
                    </td>
                  </tr>
                  <tr className="bg-white/[0.02] font-semibold">
                    <td className="py-3 px-4 text-white" colSpan={2}>Gross Annual Revenue Stack</td>
                    <td className="py-3 px-4 text-right text-white">{formatCurrency(metrics.grossAnnualRevenueUsd)}/yr</td>
                    <td className="py-3 px-4 text-right text-white">100.0%</td>
                  </tr>
                  <tr className="text-gray-400">
                    <td className="py-2.5 px-4" colSpan={2}>Annual OPEX, Insurance, Land Lease & Augmentation</td>
                    <td className="py-2.5 px-4 text-right text-[#f43f5e]">({formatCurrency(metrics.annualOpexUsd)}/yr)</td>
                    <td className="py-2.5 px-4 text-right">-</td>
                  </tr>
                  <tr className="bg-white/[0.05] font-bold text-white">
                    <td className="py-3 px-4" colSpan={2}>Net Project EBITDA</td>
                    <td className="py-3 px-4 text-right text-[#00e5ff] text-sm">{formatCurrency(metrics.netAnnualEbitdaUsd)}/yr</td>
                    <td className="py-3 px-4 text-right text-[#00e5ff]">-</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 3: Risk Factors and Transmission Constraints */}
          <div className="space-y-2">
            <h2 className="text-xs font-mono tracking-wider text-gray-400 uppercase">
              3.0 Transmission Constraints & Regulatory Risks
            </h2>
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 text-xs text-gray-400 space-y-2 leading-relaxed">
              <p>
                <strong className="text-white">Cardones-Polpaico 500kV Bottleneck:</strong> The selected substation ({node.name}) experiences an annual congestion index of {node.transmissionCongestionIndex}%. While this amplifies the spot price spread in the near term, commissioning of the Kimal-Lo Aguirre HVDC line in 2029 will compress solar-noon spreads by ~28% in Central zones.
              </p>
              <p>
                <strong className="text-white">DS 70 Duration Factor Sensitivity:</strong> Remuneration under Chilean DS 70 assigns a {config.durationHours}-hour battery a capacity factor rating of {config.durationHours === 2 ? '52%' : config.durationHours === 4 ? '88%' : '96%'}. Future regulatory consultations by CNE regarding storage methodology may adjust these weights.
              </p>
            </div>
          </div>

          {/* Institutional Signature Block */}
          <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 text-[11px] font-mono text-gray-400">
            <div>
              <div className="text-white font-semibold mb-1">AUDIT & COMPLIANCE SEAL</div>
              <div>VOLTIA OS KERNEL v4.2.0 // CEN SCADA FEED ACCREDITED</div>
              <div>SANTIAGO, CHILE // POWER SECTOR ANALYTICS</div>
            </div>
            <div className="w-48 pt-2 border-t border-white/20 text-center">
              <div className="text-white font-medium">Institutional Portfolio Lead</div>
              <div className="text-[10px] text-gray-400">Quantitative Power Markets</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
