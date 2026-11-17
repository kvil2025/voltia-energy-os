import { BessConfig, BessFinancialResult, HourlyDispatchStep, ChileanNode } from '../types/energy';

export function calculateBessMetrics(config: BessConfig, node: ChileanNode): BessFinancialResult {
  const energyMwh = config.powerMw * config.durationHours;
  
  // CAPEX: Turnkey LFP system ($140/kWh = $140,000/MWh) + Balance of System & Interconnection
  const storageCapex = energyMwh * (config.capexPerKwh * 1000);
  const interconnectionCapex = config.powerMw * 42000; // Substation bay, switchgear, step-up transformer
  const totalCapexUsd = storageCapex + interconnectionCapex;

  // Revenue 1: Energy Arbitrage
  // Node specific price spread multiplier based on zero-price hours and congestion
  const baselineSpreadUsd = 88.0;
  const nodalSpreadMultiplier = 0.8 + (node.arbitrageScore / 100) * 0.45;
  const effectiveSpreadUsd = baselineSpreadUsd * nodalSpreadMultiplier;
  
  // Discharged energy per year: Capacity * Cycles * 365
  const annualDischargedMwh = energyMwh * config.cyclesPerDay * 365;
  // Account for RTE: net arbitrage revenue incorporates loss on charging
  const annualArbitrageUsd = annualDischargedMwh * (effectiveSpreadUsd * (config.rtePercent / 100));

  // Revenue 2: DS 70 Capacity Payment (Potencia de Suficiencia - SEN Chile)
  // Benchmark capacity price: $8.8 USD/kW-month = $105.60 USD/kW-year
  const capacityPriceUsdKwYear = 105.60;
  // Chilean regulatory derating factor based on storage duration
  let durationFactor = 0.88;
  if (config.durationHours <= 2) durationFactor = 0.52;
  else if (config.durationHours <= 3) durationFactor = 0.72;
  else if (config.durationHours <= 4) durationFactor = 0.88;
  else if (config.durationHours <= 5) durationFactor = 0.95;
  else durationFactor = 0.99;

  const annualCapacityDs70Usd = config.powerMw * 1000 * capacityPriceUsdKwYear * durationFactor;

  // Revenue 3: SSCC (Servicios Complementarios / Frequency Reserve SEN)
  // Fast frequency response & primary spinning reserve ~$14,200 USD/MW/yr
  const ssccBenchmarkPerMwYear = 14200;
  const annualSsccUsd = config.powerMw * ssccBenchmarkPerMwYear;

  // Gross & Net Revenue
  const grossAnnualRevenueUsd = annualArbitrageUsd + annualCapacityDs70Usd + annualSsccUsd;
  
  // OPEX: ~1.65% of CAPEX for O&M, SCADA, insurance, land lease, and battery cell augmentation fund
  const annualOpexUsd = totalCapexUsd * 0.0165;
  const netAnnualEbitdaUsd = grossAnnualRevenueUsd - annualOpexUsd;

  // Simple payback
  const paybackYears = netAnnualEbitdaUsd > 0 ? Number((totalCapexUsd / netAnnualEbitdaUsd).toFixed(1)) : 99.9;

  // NPV over 20-year project life, 8.5% WACC, 1.8% annual degradation
  const wacc = config.waccPercent / 100;
  const degradationRate = 0.018;
  let npv = -totalCapexUsd;
  const cashflows: number[] = [-totalCapexUsd];

  for (let year = 1; year <= 20; year++) {
    const degradedEbitda = netAnnualEbitdaUsd * Math.pow(1 - degradationRate, year - 1);
    cashflows.push(degradedEbitda);
    npv += degradedEbitda / Math.pow(1 + wacc, year);
  }

  // IRR calculation via Newton-Raphson
  let irr = 0.12; // initial guess 12%
  for (let iter = 0; iter < 40; iter++) {
    let fValue = 0;
    let fDerivative = 0;
    for (let t = 0; t <= 20; t++) {
      const discount = Math.pow(1 + irr, t);
      fValue += cashflows[t] / discount;
      if (t > 0) {
        fDerivative -= (t * cashflows[t]) / Math.pow(1 + irr, t + 1);
      }
    }
    if (Math.abs(fDerivative) < 1e-9) break;
    const nextIrr = irr - fValue / fDerivative;
    if (Math.abs(nextIrr - irr) < 1e-6) {
      irr = nextIrr;
      break;
    }
    irr = nextIrr;
  }
  const irrPercent = Number((irr * 100).toFixed(1));

  // Levelized Cost of Storage (LCOS in USD/MWh)
  const lifetimeDischargedMwh = annualDischargedMwh * 17.2; // adjusted for degradation over 20 yrs
  const lifetimeTotalCostUsd = totalCapexUsd + (annualOpexUsd * 20);
  const levelizedCostStorageUsdMwh = Number((lifetimeTotalCostUsd / lifetimeDischargedMwh).toFixed(1));

  return {
    energyMwh,
    totalCapexUsd,
    annualOpexUsd,
    annualArbitrageUsd,
    annualCapacityDs70Usd,
    annualSsccUsd,
    grossAnnualRevenueUsd,
    netAnnualEbitdaUsd,
    irrPercent,
    npvUsd: Math.round(npv),
    paybackYears,
    levelizedCostStorageUsdMwh
  };
}

export function generate24HourDispatchProfile(config: BessConfig, node: ChileanNode): HourlyDispatchStep[] {
  const steps: HourlyDispatchStep[] = [];
  const maxStorageMwh = config.powerMw * config.durationHours;
  let currentSoC = maxStorageMwh * 0.15; // start morning with 15% minimum reserve

  // Base marginal cost shape for the Chilean duck curve
  const basePriceCurve = [
    52, 48, 45, 42, 44, 58, 72, 85, // 00:00 - 07:00 (Night & morning ramp)
    62, 28, 6,  0,  0,  0,  12, 45, // 08:00 - 15:00 (Solar surplus & zero-price trough)
    78, 115, 158, 172, 164, 138, 92, 68 // 16:00 - 23:00 (Evening peak dispatch window)
  ];

  // Adjust price curve according to node attributes
  const nodalPriceCurve = basePriceCurve.map((price) => {
    if (price < 20) {
      // northern nodes experience prolonged zero prices
      return node.zeroPriceHoursYear > 1000 ? 0.0 : Math.max(0, price * 0.5);
    }
    return Number((price * (node.avgMarginalPrice / 70)).toFixed(1));
  });

  for (let h = 0; h < 24; h++) {
    const marginalCost = nodalPriceCurve[h];
    let solarCurtailment = 0;
    let chargeMw = 0;
    let dischargeMw = 0;

    // Solar curtailment curve peaks at solar noon
    if (h >= 10 && h <= 15) {
      solarCurtailment = Math.round(node.solarCurtailmentGwh * 0.45 * Math.sin(((h - 10) / 5) * Math.PI));
    }

    // Charging logic: 10:00 - 15:00 (Solar zero/low price window)
    if (h >= 10 && h <= 14) {
      const neededMwh = (maxStorageMwh * 0.98) - currentSoC;
      if (neededMwh > 0) {
        chargeMw = Math.min(config.powerMw, neededMwh);
        currentSoC += chargeMw * (config.rtePercent / 100);
      }
    }
    // Discharging logic: 19:00 - 22:00 (Evening peak prices)
    else if (h >= 19 && h <= 22) {
      const availableMwh = currentSoC - (maxStorageMwh * 0.08); // keep 8% floor
      if (availableMwh > 0) {
        dischargeMw = Math.min(config.powerMw, availableMwh);
        currentSoC -= dischargeMw;
      }
    }

    currentSoC = Math.max(maxStorageMwh * 0.05, Math.min(maxStorageMwh, currentSoC));

    steps.push({
      hour: h,
      solarCurtailmentMw: solarCurtailment,
      systemMarginalCost: marginalCost,
      chargePowerMw: Number(chargeMw.toFixed(1)),
      dischargePowerMw: Number(dischargeMw.toFixed(1)),
      stateOfChargeMwh: Number(currentSoC.toFixed(1)),
      stateOfChargePercent: Number(((currentSoC / maxStorageMwh) * 100).toFixed(1)),
      netGridMw: Number((dischargeMw - chargeMw).toFixed(1))
    });
  }

  return steps;
}
