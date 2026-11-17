"""
VOLTIA Energy OS - Energy Transition Long-Term Scenarios (2025-2040)
Aurora Energy Research style modeling for the Chilean National Electric System (SEN).
"""

from typing import Dict, List, Any
import numpy as np

SCENARIOS: Dict[str, Dict[str, Any]] = {
    "S1_BASE_CEN": {
        "id": "S1_BASE_CEN",
        "name": "S1: Caso Base Coordinador Eléctrico Nacional (CEN)",
        "short_name": "Caso Base CEN",
        "color": "#3B82F6",  # Blue
        "description": "Trayectoria oficial del Plan de Expansión de la Transmisión y Generación del CEN. Retiro paulatino del carbón hacia 2040, incorporación ordenada de 3.5 GW BESS a 2030 y entrada de Kimal-Lo Aguirre a finales de 2029.",
        "assumptions": {
            "coal_phaseout_year": 2040,
            "bess_additions_2030_gw": 3.8,
            "bess_additions_2040_gw": 9.2,
            "hydro_condition": "Hidrología Media Histórica (P50)",
            "kimal_lo_aguirre_cod": 2029,
            "carbon_tax_usd_ton": 5.0,
            "fuel_price_trend": "Estable conforme a cotizaciones Brent y Henry Hub futuro",
        },
        "metrics_by_year": {
            2025: {"avg_cmg": 62.4, "solar_valley_cmg": 4.2, "peak_cmg": 118.5, "spread_usd": 114.3, "curtailment_twh": 3.4, "curtailment_pct": 16.5, "bess_gw": 1.2},
            2026: {"avg_cmg": 60.1, "solar_valley_cmg": 2.8, "peak_cmg": 122.0, "spread_usd": 119.2, "curtailment_twh": 4.1, "curtailment_pct": 18.2, "bess_gw": 1.9},
            2027: {"avg_cmg": 58.5, "solar_valley_cmg": 1.5, "peak_cmg": 125.4, "spread_usd": 123.9, "curtailment_twh": 4.9, "curtailment_pct": 19.8, "bess_gw": 2.7},
            2028: {"avg_cmg": 56.8, "solar_valley_cmg": 0.8, "peak_cmg": 128.0, "spread_usd": 127.2, "curtailment_twh": 5.6, "curtailment_pct": 21.0, "bess_gw": 3.5},
            2029: {"avg_cmg": 54.2, "solar_valley_cmg": 8.5, "peak_cmg": 115.0, "spread_usd": 106.5, "curtailment_twh": 3.2, "curtailment_pct": 11.4, "bess_gw": 4.2}, # Kimal enters
            2030: {"avg_cmg": 52.0, "solar_valley_cmg": 12.0, "peak_cmg": 108.0, "spread_usd": 96.0, "curtailment_twh": 2.5, "curtailment_pct": 8.5, "bess_gw": 4.8},
            2032: {"avg_cmg": 49.5, "solar_valley_cmg": 14.5, "peak_cmg": 102.0, "spread_usd": 87.5, "curtailment_twh": 2.1, "curtailment_pct": 6.8, "bess_gw": 5.9},
            2035: {"avg_cmg": 46.8, "solar_valley_cmg": 16.2, "peak_cmg": 96.5, "spread_usd": 80.3, "curtailment_twh": 1.8, "curtailment_pct": 5.2, "bess_gw": 7.4},
            2040: {"avg_cmg": 44.0, "solar_valley_cmg": 18.0, "peak_cmg": 90.0, "spread_usd": 72.0, "curtailment_twh": 1.4, "curtailment_pct": 3.8, "bess_gw": 9.2},
        }
    },
    "S2_HIGH_RE_FAST_EXIT": {
        "id": "S2_HIGH_RE_FAST_EXIT",
        "name": "S2: Alta Penetración Renovable & Retiro Acelerado de Carbón",
        "short_name": "Retiro Acelerado & Spreads Altos",
        "color": "#10B981",  # Emerald Green
        "description": "Retiro total del parque a carbón adelantado a 2030 por mandatos ambientales y descarbonización voluntaria. Crecimiento explosivo de solar/eólico. Spreads extremos hasta 2030 debido a horas punta abastecidas por diésel y GNL abierto.",
        "assumptions": {
            "coal_phaseout_year": 2030,
            "bess_additions_2030_gw": 5.4,
            "bess_additions_2040_gw": 13.5,
            "hydro_condition": "Hidrología Media Histórica (P50)",
            "kimal_lo_aguirre_cod": 2029,
            "carbon_tax_usd_ton": 15.0, # Raised green tax
            "fuel_price_trend": "Mayor volatilidad de GNL importado",
        },
        "metrics_by_year": {
            2025: {"avg_cmg": 66.8, "solar_valley_cmg": 2.5, "peak_cmg": 134.0, "spread_usd": 131.5, "curtailment_twh": 3.9, "curtailment_pct": 18.2, "bess_gw": 1.4},
            2026: {"avg_cmg": 68.2, "solar_valley_cmg": 1.2, "peak_cmg": 142.5, "spread_usd": 141.3, "curtailment_twh": 5.2, "curtailment_pct": 21.5, "bess_gw": 2.4},
            2027: {"avg_cmg": 70.5, "solar_valley_cmg": 0.4, "peak_cmg": 152.0, "spread_usd": 151.6, "curtailment_twh": 6.8, "curtailment_pct": 25.0, "bess_gw": 3.6},
            2028: {"avg_cmg": 72.0, "solar_valley_cmg": 0.0, "peak_cmg": 160.0, "spread_usd": 160.0, "curtailment_twh": 7.9, "curtailment_pct": 27.4, "bess_gw": 4.6},
            2029: {"avg_cmg": 62.5, "solar_valley_cmg": 6.8, "peak_cmg": 136.0, "spread_usd": 129.2, "curtailment_twh": 4.5, "curtailment_pct": 14.5, "bess_gw": 5.8},
            2030: {"avg_cmg": 58.0, "solar_valley_cmg": 10.5, "peak_cmg": 124.0, "spread_usd": 113.5, "curtailment_twh": 3.8, "curtailment_pct": 11.2, "bess_gw": 7.0},
            2032: {"avg_cmg": 53.4, "solar_valley_cmg": 12.8, "peak_cmg": 112.0, "spread_usd": 99.2, "curtailment_twh": 3.0, "curtailment_pct": 8.4, "bess_gw": 8.8},
            2035: {"avg_cmg": 48.2, "solar_valley_cmg": 15.0, "peak_cmg": 104.0, "spread_usd": 89.0, "curtailment_twh": 2.4, "curtailment_pct": 6.2, "bess_gw": 11.0},
            2040: {"avg_cmg": 45.0, "solar_valley_cmg": 17.5, "peak_cmg": 94.0, "spread_usd": 76.5, "curtailment_twh": 1.7, "curtailment_pct": 4.1, "bess_gw": 13.5},
        }
    },
    "S3_DRY_HYDRO_STRESS": {
        "id": "S3_DRY_HYDRO_STRESS",
        "name": "S3: Estrés Hidrológico (Sequía Prolongada P90)",
        "short_name": "Estrés Hidrológico",
        "color": "#EF4444",  # Crimson Red
        "description": "Escenario de sequía crítica multianual en cuencas de los ríos Laja, Maule, Biobío y Rapel. Reducción severa de generación hidroeléctrica de embalse y pasada. Precios nocturnos disparados por uso intensivo de centrales a petróleo diésel y carbón forzado.",
        "assumptions": {
            "coal_phaseout_year": 2038,
            "bess_additions_2030_gw": 4.5,
            "bess_additions_2040_gw": 10.5,
            "hydro_condition": "Condición Muy Seca (P90 / Sequía extrema)",
            "kimal_lo_aguirre_cod": 2029,
            "carbon_tax_usd_ton": 5.0,
            "fuel_price_trend": "Mayor despacho forzado de turbinas diésel de respaldo",
        },
        "metrics_by_year": {
            2025: {"avg_cmg": 78.4, "solar_valley_cmg": 8.5, "peak_cmg": 165.0, "spread_usd": 156.5, "curtailment_twh": 2.8, "curtailment_pct": 13.5, "bess_gw": 1.2},
            2026: {"avg_cmg": 82.0, "solar_valley_cmg": 6.4, "peak_cmg": 174.0, "spread_usd": 167.6, "curtailment_twh": 3.4, "curtailment_pct": 14.8, "bess_gw": 2.0},
            2027: {"avg_cmg": 85.2, "solar_valley_cmg": 4.8, "peak_cmg": 182.5, "spread_usd": 177.7, "curtailment_twh": 4.1, "curtailment_pct": 16.2, "bess_gw": 2.9},
            2028: {"avg_cmg": 87.0, "solar_valley_cmg": 3.5, "peak_cmg": 188.0, "spread_usd": 184.5, "curtailment_twh": 4.8, "curtailment_pct": 17.5, "bess_gw": 3.8},
            2029: {"avg_cmg": 74.5, "solar_valley_cmg": 12.0, "peak_cmg": 160.0, "spread_usd": 148.0, "curtailment_twh": 2.7, "curtailment_pct": 9.4, "bess_gw": 4.8},
            2030: {"avg_cmg": 70.0, "solar_valley_cmg": 15.0, "peak_cmg": 148.0, "spread_usd": 133.0, "curtailment_twh": 2.2, "curtailment_pct": 7.5, "bess_gw": 5.6},
            2032: {"avg_cmg": 64.0, "solar_valley_cmg": 17.2, "peak_cmg": 136.0, "spread_usd": 118.8, "curtailment_twh": 1.9, "curtailment_pct": 6.0, "bess_gw": 6.8},
            2035: {"avg_cmg": 58.5, "solar_valley_cmg": 19.0, "peak_cmg": 122.0, "spread_usd": 103.0, "curtailment_twh": 1.6, "curtailment_pct": 4.8, "bess_gw": 8.4},
            2040: {"avg_cmg": 52.0, "solar_valley_cmg": 21.0, "peak_cmg": 108.0, "spread_usd": 87.0, "curtailment_twh": 1.3, "curtailment_pct": 3.6, "bess_gw": 10.5},
        }
    },
    "S4_KIMAL_LO_AGUIRRE_CONVERGENCE": {
        "id": "S4_KIMAL_LO_AGUIRRE_CONVERGENCE",
        "name": "S4: Interconexión Kimal-Lo Aguirre 2029 & Descongestión",
        "short_name": "Kimal-Lo Aguirre Descongestión",
        "color": "#8B5CF6",  # Purple
        "description": "Entrada puntual y optimizada de la megalínea HVDC Kimal-Lo Aguirre (+/- 600 kV, 3000 MW, 1344 km) en diciembre 2028 / enero 2029. Evacuación masiva de excedentes solares del desierto de Atacama hacia Santiago, colapso de precios cero en el norte y reducción de spreads.",
        "assumptions": {
            "coal_phaseout_year": 2035,
            "bess_additions_2030_gw": 4.2,
            "bess_additions_2040_gw": 10.0,
            "hydro_condition": "Hidrología Media Histórica (P50)",
            "kimal_lo_aguirre_cod": 2028, # Early delivery
            "carbon_tax_usd_ton": 8.0,
            "fuel_price_trend": "Eficiencia máxima en transporte troncal y despacho económico unificado",
        },
        "metrics_by_year": {
            2025: {"avg_cmg": 62.0, "solar_valley_cmg": 4.0, "peak_cmg": 118.0, "spread_usd": 114.0, "curtailment_twh": 3.4, "curtailment_pct": 16.5, "bess_gw": 1.2},
            2026: {"avg_cmg": 59.8, "solar_valley_cmg": 2.5, "peak_cmg": 121.0, "spread_usd": 118.5, "curtailment_twh": 4.0, "curtailment_pct": 18.0, "bess_gw": 1.9},
            2027: {"avg_cmg": 58.0, "solar_valley_cmg": 1.2, "peak_cmg": 124.0, "spread_usd": 122.8, "curtailment_twh": 4.8, "curtailment_pct": 19.5, "bess_gw": 2.7},
            2028: {"avg_cmg": 53.0, "solar_valley_cmg": 10.5, "peak_cmg": 110.0, "spread_usd": 99.5, "curtailment_twh": 2.8, "curtailment_pct": 9.8, "bess_gw": 3.6},
            2029: {"avg_cmg": 48.5, "solar_valley_cmg": 16.0, "peak_cmg": 98.0, "spread_usd": 82.0, "curtailment_twh": 1.8, "curtailment_pct": 6.2, "bess_gw": 4.4},
            2030: {"avg_cmg": 46.0, "solar_valley_cmg": 18.5, "peak_cmg": 92.0, "spread_usd": 73.5, "curtailment_twh": 1.4, "curtailment_pct": 4.8, "bess_gw": 5.2},
            2032: {"avg_cmg": 43.5, "solar_valley_cmg": 20.0, "peak_cmg": 86.0, "spread_usd": 66.0, "curtailment_twh": 1.1, "curtailment_pct": 3.7, "bess_gw": 6.5},
            2035: {"avg_cmg": 41.0, "solar_valley_cmg": 21.5, "peak_cmg": 82.0, "spread_usd": 60.5, "curtailment_twh": 0.9, "curtailment_pct": 2.9, "bess_gw": 8.0},
            2040: {"avg_cmg": 39.0, "solar_valley_cmg": 23.0, "peak_cmg": 78.0, "spread_usd": 55.0, "curtailment_twh": 0.7, "curtailment_pct": 2.2, "bess_gw": 10.0},
        }
    }
}


def get_all_scenarios() -> List[Dict[str, Any]]:
    """Returns list of all transition scenarios."""
    return list(SCENARIOS.values())


def get_scenario_by_id(scenario_id: str) -> Dict[str, Any]:
    """Retrieve scenario details by ID with fallback to S1_BASE_CEN."""
    return SCENARIOS.get(scenario_id, SCENARIOS["S1_BASE_CEN"])


def get_scenario_spread_forecast_matrix() -> List[Dict[str, Any]]:
    """
    Returns annual spread forecast from 2025 to 2040 across all 4 scenarios
    for charting in Aurora style.
    """
    years = [2025, 2026, 2027, 2028, 2029, 2030, 2032, 2035, 2040]
    result = []
    for y in years:
        row: Dict[str, Any] = {"year": y}
        for sc_id, sc_data in SCENARIOS.items():
            metrics = sc_data["metrics_by_year"].get(y, {})
            row[f"{sc_id}_spread"] = metrics.get("spread_usd", 0)
            row[f"{sc_id}_curtailment"] = metrics.get("curtailment_pct", 0)
            row[f"{sc_id}_bess_gw"] = metrics.get("bess_gw", 0)
            row[f"{sc_id}_avg_cmg"] = metrics.get("avg_cmg", 0)
        result.append(row)
    return result
