import { ScenarioPoint } from '../types/energy';

export const SCENARIO_DATA: ScenarioPoint[] = [
  {
    year: 2025,
    baseCasePrice: 72.4,
    coalPhaseoutPrice: 78.5,
    extremeDroughtPrice: 94.0,
    kimalCommissioningPrice: 72.4,
    curtailmentTwh: 3.82,
    bessInstalledGw: 1.45
  },
  {
    year: 2026,
    baseCasePrice: 68.2,
    coalPhaseoutPrice: 76.1,
    extremeDroughtPrice: 96.8,
    kimalCommissioningPrice: 68.2,
    curtailmentTwh: 4.41,
    bessInstalledGw: 2.85
  },
  {
    year: 2027,
    baseCasePrice: 64.9,
    coalPhaseoutPrice: 74.3,
    extremeDroughtPrice: 92.5,
    kimalCommissioningPrice: 64.9,
    curtailmentTwh: 4.95,
    bessInstalledGw: 4.10
  },
  {
    year: 2028,
    baseCasePrice: 61.5,
    coalPhaseoutPrice: 72.8,
    extremeDroughtPrice: 88.0,
    kimalCommissioningPrice: 61.5,
    curtailmentTwh: 5.20,
    bessInstalledGw: 5.60
  },
  {
    year: 2029,
    baseCasePrice: 58.0,
    coalPhaseoutPrice: 69.5,
    extremeDroughtPrice: 84.2,
    kimalCommissioningPrice: 48.2, // Kimal-Lo Aguirre HVDC comes online! Sharp drop
    curtailmentTwh: 2.15,          // Massive curtailment reduction
    bessInstalledGw: 7.20
  },
  {
    year: 2030,
    baseCasePrice: 55.4,
    coalPhaseoutPrice: 66.0,
    extremeDroughtPrice: 81.6,
    kimalCommissioningPrice: 44.8,
    curtailmentTwh: 1.45,
    bessInstalledGw: 8.92
  },
  {
    year: 2032,
    baseCasePrice: 52.8,
    coalPhaseoutPrice: 62.1,
    extremeDroughtPrice: 77.4,
    kimalCommissioningPrice: 42.1,
    curtailmentTwh: 1.10,
    bessInstalledGw: 11.40
  },
  {
    year: 2035,
    baseCasePrice: 49.6,
    coalPhaseoutPrice: 57.5,
    extremeDroughtPrice: 72.0,
    kimalCommissioningPrice: 39.5,
    curtailmentTwh: 0.85,
    bessInstalledGw: 14.80
  },
  {
    year: 2040,
    baseCasePrice: 45.2,
    coalPhaseoutPrice: 51.0,
    extremeDroughtPrice: 65.4,
    kimalCommissioningPrice: 36.8,
    curtailmentTwh: 0.52,
    bessInstalledGw: 18.50
  }
];

export const SCENARIO_DESCRIPTIONS = {
  baseCase: {
    title: 'Base Case (CEN Expansion 2025-2040)',
    badge: 'BASELINE',
    color: '#00e5ff',
    desc: 'Official Coordinator plan with planned retirement schedules, standard hydrology, and progressive transmission reinforcements.'
  },
  coalPhaseout: {
    title: 'Accelerated Coal Phaseout (2030 Zero-Coal)',
    badge: 'POLICY_PRESSURE',
    color: '#f59e0b',
    desc: 'Immediate shutdown of Tocopilla, Mejillones, and Ventanas units by 2030. Escalates evening peak prices due to higher LNG reliance.'
  },
  extremeDrought: {
    title: 'Extreme Drought (La Niña Dry Spell)',
    badge: 'CLIMATE_STRESS',
    color: '#f43f5e',
    desc: 'Severe dry hydrology in Central-South basins (Maule, Laja, Ralco). Depresses hydro generation by 42%, creating structural price floor.'
  },
  kimalCommissioning: {
    title: 'Kimal-Lo Aguirre HVDC (2029 Online)',
    badge: 'GRID_INFLECTION',
    color: '#10b981',
    desc: '3,000 MW bipolar ±600 kV HVDC link enters commercial service in 2029, evacuating Atacama solar directly to Santiago and slashing daytime curtailment by 58%.'
  }
};
