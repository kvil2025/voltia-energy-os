export interface ChileanNode {
  id: string;
  name: string;
  voltageKv: number;
  region: string;
  lat: number;
  lon: number;
  zone: 'Norte Grande' | 'Norte Chico' | 'Centro' | 'Sur';
  avgMarginalPrice: number; // USD/MWh
  zeroPriceHoursYear: number; // hours
  transmissionCongestionIndex: number; // 0 - 100
  arbitrageScore: number; // 0 - 100
  solarCurtailmentGwh: number;
  description: string;
}

export interface BessConfig {
  powerMw: number;
  durationHours: number;
  substationId: string;
  rtePercent: number;
  cyclesPerDay: number;
  capexPerKwh: number;
  waccPercent: number;
}

export interface BessFinancialResult {
  energyMwh: number;
  totalCapexUsd: number;
  annualOpexUsd: number;
  annualArbitrageUsd: number;
  annualCapacityDs70Usd: number;
  annualSsccUsd: number;
  grossAnnualRevenueUsd: number;
  netAnnualEbitdaUsd: number;
  irrPercent: number;
  npvUsd: number;
  paybackYears: number;
  levelizedCostStorageUsdMwh: number;
}

export interface HourlyDispatchStep {
  hour: number;
  solarCurtailmentMw: number;
  systemMarginalCost: number; // USD/MWh
  chargePowerMw: number;
  dischargePowerMw: number;
  stateOfChargeMwh: number;
  stateOfChargePercent: number;
  netGridMw: number; // positive = inject, negative = withdraw
}

export interface ScenarioPoint {
  year: number;
  baseCasePrice: number;
  coalPhaseoutPrice: number;
  extremeDroughtPrice: number;
  kimalCommissioningPrice: number;
  curtailmentTwh: number;
  bessInstalledGw: number;
}
