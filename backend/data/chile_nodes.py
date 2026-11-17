"""
VOLTIA Energy OS - Canonical Substation & Nodal Database (Chile SEN)
National Electric System (Sistema Eléctrico Nacional de Chile - Coordinador Eléctrico Nacional)
"""

from typing import Dict, List, Any
import numpy as np

# Canonical Nodes in Chile SEN with operational, geographical and price telemetry
SEN_NODES: Dict[str, Dict[str, Any]] = {
    "cardones_500": {
        "id": "cardones_500",
        "name": "Cardones 500 kV",
        "substation": "S/E Cardones",
        "voltage_kv": 500,
        "zone": "Norte Chico",
        "region": "Atacama (III Región)",
        "lat": -27.3912,
        "lon": -70.3621,
        "avg_price_mwh": 41.2,
        "zero_price_hours_yearly": 1940,
        "curtailment_index_pct": 21.4,
        "transmission_capacity_mw": 1700,
        "congestion_risk": "Crítica",
        "typical_spread_usd": 94.5,
        "primary_driver": "Congestión troncal Cardones-Polpaico y masivo vertimiento solar fotovoltaico",
        "hourly_profiles_24h": {
            "summer": [48, 42, 38, 36, 35, 38, 42, 35, 8, 0, 0, 0, 0, 0, 0, 0, 4, 25, 75, 115, 138, 122, 92, 65],
            "autumn": [52, 45, 40, 38, 38, 40, 48, 42, 12, 0, 0, 0, 0, 0, 0, 2, 18, 55, 98, 128, 142, 118, 85, 62],
            "winter": [55, 48, 44, 42, 40, 44, 52, 48, 22, 5, 0, 0, 0, 0, 2, 15, 38, 72, 110, 135, 145, 125, 90, 68],
            "spring": [44, 38, 35, 32, 30, 34, 38, 28, 4, 0, 0, 0, 0, 0, 0, 0, 0, 18, 68, 108, 132, 114, 82, 55],
        }
    },
    "diego_almagro_220": {
        "id": "diego_almagro_220",
        "name": "Diego de Almagro 220 kV",
        "substation": "S/E Diego de Almagro",
        "voltage_kv": 220,
        "zone": "Norte Chico",
        "region": "Atacama (III Región)",
        "lat": -26.3882,
        "lon": -70.0453,
        "avg_price_mwh": 37.8,
        "zero_price_hours_yearly": 2120,
        "curtailment_index_pct": 24.8,
        "transmission_capacity_mw": 850,
        "congestion_risk": "Crítica",
        "typical_spread_usd": 98.2,
        "primary_driver": "Alta densidad de parques solares en Atacama y saturación de subtransmisión local",
        "hourly_profiles_24h": {
            "summer": [45, 38, 35, 32, 30, 35, 38, 28, 5, 0, 0, 0, 0, 0, 0, 0, 2, 20, 70, 112, 136, 120, 88, 60],
            "autumn": [48, 42, 38, 35, 35, 38, 42, 35, 8, 0, 0, 0, 0, 0, 0, 0, 12, 48, 92, 122, 138, 114, 80, 58],
            "winter": [52, 45, 40, 38, 38, 40, 46, 40, 15, 2, 0, 0, 0, 0, 0, 10, 30, 65, 105, 130, 140, 120, 85, 62],
            "spring": [40, 34, 30, 28, 28, 30, 32, 22, 0, 0, 0, 0, 0, 0, 0, 0, 0, 15, 62, 105, 130, 110, 78, 50],
        }
    },
    "crucero_220": {
        "id": "crucero_220",
        "name": "Crucero 220 kV",
        "substation": "S/E Crucero",
        "voltage_kv": 220,
        "zone": "Norte Grande",
        "region": "Antofagasta (II Región)",
        "lat": -22.2411,
        "lon": -69.1234,
        "avg_price_mwh": 46.5,
        "zero_price_hours_yearly": 1580,
        "curtailment_index_pct": 17.2,
        "transmission_capacity_mw": 1200,
        "congestion_risk": "Alta",
        "typical_spread_usd": 86.4,
        "primary_driver": "Intersección de generación solar desértica y gigantescos consumos mineros de cobre",
        "hourly_profiles_24h": {
            "summer": [50, 44, 40, 38, 38, 42, 45, 38, 12, 2, 0, 0, 0, 0, 0, 2, 8, 32, 82, 118, 134, 118, 90, 68],
            "autumn": [54, 48, 42, 40, 40, 44, 48, 42, 18, 5, 0, 0, 0, 0, 2, 8, 22, 58, 96, 124, 138, 120, 92, 72],
            "winter": [58, 52, 46, 44, 42, 45, 52, 48, 28, 12, 4, 2, 2, 2, 6, 18, 40, 75, 112, 132, 142, 126, 96, 76],
            "spring": [46, 40, 36, 34, 32, 36, 40, 30, 8, 0, 0, 0, 0, 0, 0, 0, 4, 24, 75, 112, 128, 112, 84, 60],
        }
    },
    "encuentro_220": {
        "id": "encuentro_220",
        "name": "Encuentro 220 kV",
        "substation": "S/E Encuentro",
        "voltage_kv": 220,
        "zone": "Norte Grande",
        "region": "Antofagasta (II Región)",
        "lat": -21.8904,
        "lon": -69.4502,
        "avg_price_mwh": 44.9,
        "zero_price_hours_yearly": 1640,
        "curtailment_index_pct": 18.0,
        "transmission_capacity_mw": 1100,
        "congestion_risk": "Alta",
        "typical_spread_usd": 87.8,
        "primary_driver": "Nodo troncal del Norte Grande con inyecciones solares e interconexión minera",
        "hourly_profiles_24h": {
            "summer": [48, 42, 38, 36, 36, 40, 44, 36, 10, 0, 0, 0, 0, 0, 0, 0, 6, 28, 80, 116, 132, 116, 88, 66],
            "autumn": [52, 46, 40, 38, 38, 42, 46, 40, 16, 4, 0, 0, 0, 0, 0, 6, 20, 54, 94, 122, 136, 118, 90, 70],
            "winter": [56, 50, 44, 42, 40, 44, 50, 45, 25, 10, 2, 0, 0, 0, 4, 16, 36, 72, 108, 130, 140, 124, 94, 74],
            "spring": [44, 38, 34, 32, 30, 34, 38, 28, 6, 0, 0, 0, 0, 0, 0, 0, 2, 22, 72, 110, 126, 110, 82, 58],
        }
    },
    "pan_azucar_220": {
        "id": "pan_azucar_220",
        "name": "Pan de Azúcar 220 kV",
        "substation": "S/E Pan de Azúcar",
        "voltage_kv": 220,
        "zone": "Norte Chico",
        "region": "Coquimbo (IV Región)",
        "lat": -29.9814,
        "lon": -71.2483,
        "avg_price_mwh": 52.3,
        "zero_price_hours_yearly": 1150,
        "curtailment_index_pct": 14.6,
        "transmission_capacity_mw": 900,
        "congestion_risk": "Moderada",
        "typical_spread_usd": 78.5,
        "primary_driver": "Confluencia de generación eólica costera y enlace intermedio hacia la zona central",
        "hourly_profiles_24h": {
            "summer": [56, 50, 45, 42, 40, 44, 48, 42, 20, 8, 4, 2, 2, 4, 6, 10, 20, 42, 88, 122, 135, 120, 95, 72],
            "autumn": [58, 52, 48, 45, 44, 46, 52, 48, 26, 14, 8, 6, 6, 8, 12, 20, 34, 62, 98, 126, 138, 122, 98, 76],
            "winter": [62, 56, 52, 50, 48, 50, 56, 52, 35, 22, 16, 14, 14, 16, 22, 32, 48, 78, 112, 134, 142, 128, 102, 82],
            "spring": [52, 46, 42, 38, 36, 40, 44, 36, 16, 5, 2, 0, 0, 2, 4, 8, 16, 36, 82, 118, 130, 115, 90, 68],
        }
    },
    "polpaico_500": {
        "id": "polpaico_500",
        "name": "Polpaico 500 kV",
        "substation": "S/E Polpaico",
        "voltage_kv": 500,
        "zone": "Centro",
        "region": "Metropolitana (RM)",
        "lat": -33.1672,
        "lon": -70.8931,
        "avg_price_mwh": 64.8,
        "zero_price_hours_yearly": 480,
        "curtailment_index_pct": 5.8,
        "transmission_capacity_mw": 2000,
        "congestion_risk": "Moderada",
        "typical_spread_usd": 74.2,
        "primary_driver": "Extremo receptor sur de la línea troncal 500 kV Cardones-Polpaico y abastecimiento de Santiago",
        "hourly_profiles_24h": {
            "summer": [65, 58, 52, 48, 46, 50, 56, 52, 38, 26, 20, 18, 18, 22, 26, 32, 44, 66, 105, 135, 142, 128, 102, 80],
            "autumn": [68, 62, 56, 52, 50, 54, 62, 58, 44, 34, 28, 26, 26, 30, 36, 45, 60, 82, 115, 138, 145, 132, 108, 86],
            "winter": [74, 68, 64, 60, 58, 62, 70, 66, 54, 45, 40, 38, 38, 42, 48, 60, 78, 102, 128, 146, 154, 140, 118, 94],
            "spring": [60, 54, 48, 44, 42, 46, 52, 46, 32, 20, 15, 12, 14, 16, 20, 26, 38, 58, 98, 130, 138, 122, 96, 75],
        }
    },
    "alto_jahuel_500": {
        "id": "alto_jahuel_500",
        "name": "Alto Jahuel 500 kV",
        "substation": "S/E Alto Jahuel",
        "voltage_kv": 500,
        "zone": "Centro",
        "region": "Metropolitana (RM)",
        "lat": -33.6891,
        "lon": -70.6694,
        "avg_price_mwh": 68.4,
        "zero_price_hours_yearly": 320,
        "curtailment_index_pct": 3.9,
        "transmission_capacity_mw": 2200,
        "congestion_risk": "Baja",
        "typical_spread_usd": 71.8,
        "primary_driver": "Centro de gravedad del consumo residencial e industrial del Gran Santiago",
        "hourly_profiles_24h": {
            "summer": [68, 62, 56, 52, 50, 54, 60, 56, 42, 30, 24, 22, 22, 26, 30, 36, 48, 72, 110, 138, 145, 130, 106, 84],
            "autumn": [72, 65, 60, 56, 54, 58, 66, 62, 48, 38, 32, 30, 30, 34, 40, 50, 65, 88, 120, 142, 148, 135, 112, 90],
            "winter": [78, 72, 66, 62, 60, 65, 74, 70, 58, 50, 44, 42, 42, 46, 54, 66, 84, 108, 132, 150, 158, 144, 122, 98],
            "spring": [64, 58, 52, 48, 46, 50, 56, 50, 36, 24, 18, 16, 18, 20, 24, 30, 42, 64, 102, 132, 140, 125, 100, 78],
        }
    },
    "quillota_220": {
        "id": "quillota_220",
        "name": "Quillota 220 kV",
        "substation": "S/E Quillota",
        "voltage_kv": 220,
        "zone": "Centro",
        "region": "Valparaíso (V Región)",
        "lat": -32.8803,
        "lon": -71.2471,
        "avg_price_mwh": 65.2,
        "zero_price_hours_yearly": 410,
        "curtailment_index_pct": 4.8,
        "transmission_capacity_mw": 1400,
        "congestion_risk": "Moderada",
        "typical_spread_usd": 73.0,
        "primary_driver": "Complejo termoeléctrico (ciclo combinado GNL San Isidro / Nehuenco) y polos industriales",
        "hourly_profiles_24h": {
            "summer": [66, 60, 54, 50, 48, 52, 58, 54, 40, 28, 22, 20, 20, 24, 28, 34, 46, 70, 108, 136, 144, 129, 104, 82],
            "autumn": [70, 64, 58, 54, 52, 56, 64, 60, 46, 36, 30, 28, 28, 32, 38, 48, 62, 85, 118, 140, 146, 133, 110, 88],
            "winter": [76, 70, 65, 61, 59, 64, 72, 68, 56, 48, 42, 40, 40, 44, 52, 64, 82, 105, 130, 148, 156, 142, 120, 96],
            "spring": [62, 56, 50, 46, 44, 48, 54, 48, 34, 22, 16, 14, 16, 18, 22, 28, 40, 62, 100, 131, 139, 124, 98, 76],
        }
    },
    "charrua_500": {
        "id": "charrua_500",
        "name": "Charrúa 500 kV",
        "substation": "S/E Charrúa",
        "voltage_kv": 500,
        "zone": "Sur",
        "region": "Biobío (VIII Región)",
        "lat": -37.0314,
        "lon": -72.2982,
        "avg_price_mwh": 58.7,
        "zero_price_hours_yearly": 550,
        "curtailment_index_pct": 8.2,
        "transmission_capacity_mw": 2400,
        "congestion_risk": "Moderada",
        "typical_spread_usd": 68.5,
        "primary_driver": "Nodo neurálgico del sur: gran generación hidroeléctrica del Laja/Biobío y complejos eólicos",
        "hourly_profiles_24h": {
            "summer": [60, 54, 48, 45, 42, 46, 52, 48, 36, 28, 24, 22, 22, 25, 30, 36, 45, 62, 95, 124, 132, 120, 96, 75],
            "autumn": [64, 58, 52, 48, 46, 50, 58, 54, 42, 35, 30, 28, 28, 32, 38, 46, 58, 78, 108, 130, 136, 124, 102, 80],
            "winter": [70, 65, 60, 56, 54, 58, 66, 62, 50, 44, 40, 38, 38, 42, 48, 58, 74, 98, 122, 140, 146, 134, 112, 88],
            "spring": [55, 48, 44, 40, 38, 42, 48, 42, 28, 18, 14, 12, 14, 16, 20, 26, 36, 55, 88, 118, 125, 112, 88, 68],
        }
    },
    "puerto_montt_220": {
        "id": "puerto_montt_220",
        "name": "Puerto Montt 220 kV",
        "substation": "S/E Puerto Montt",
        "voltage_kv": 220,
        "zone": "Sur",
        "region": "Los Lagos (X Región)",
        "lat": -41.4421,
        "lon": -72.9514,
        "avg_price_mwh": 61.5,
        "zero_price_hours_yearly": 420,
        "curtailment_index_pct": 6.5,
        "transmission_capacity_mw": 800,
        "congestion_risk": "Moderada",
        "typical_spread_usd": 65.4,
        "primary_driver": "Extremo sur del SEN continental, demanda salmonera/acuícola y congestión en corredor Charrúa-Temuco",
        "hourly_profiles_24h": {
            "summer": [62, 56, 50, 46, 44, 48, 54, 50, 38, 30, 26, 24, 24, 28, 32, 38, 48, 65, 98, 126, 134, 122, 98, 78],
            "autumn": [66, 60, 54, 50, 48, 52, 60, 56, 44, 38, 34, 32, 32, 35, 40, 48, 60, 80, 110, 132, 138, 126, 104, 82],
            "winter": [72, 68, 62, 58, 56, 60, 68, 65, 54, 48, 44, 42, 42, 46, 52, 62, 78, 102, 126, 142, 148, 136, 114, 92],
            "spring": [58, 52, 46, 42, 40, 44, 50, 45, 32, 22, 18, 16, 18, 20, 24, 30, 40, 60, 92, 120, 128, 115, 92, 72],
        }
    }
}


def get_all_nodes() -> List[Dict[str, Any]]:
    """Returns a list of all canonical SEN nodes with summary metrics."""
    return list(SEN_NODES.values())


def get_node_by_id(node_id: str) -> Dict[str, Any]:
    """Retrieve node details by ID with fallback to Cardones 500kV."""
    return SEN_NODES.get(node_id, SEN_NODES["cardones_500"])


def generate_8760_hourly_profile(node_id: str, seed: int = 42) -> np.ndarray:
    """
    Generates a full 8760-hour annual price series (USD/MWh) based on seasonal 24-hour profiles
    plus realistic stochastic day-to-day weather and market fluctuations.
    Days: 365 days x 24h = 8760h.
    - Summer: Jan 1 - Mar 20 (Days 1 - 79) + Dec 21 - Dec 31 (Days 355 - 365)
    - Autumn: Mar 21 - Jun 20 (Days 80 - 171)
    - Winter: Jun 21 - Sep 20 (Days 172 - 263)
    - Spring: Sep 21 - Dec 20 (Days 264 - 354)
    """
    rng = np.random.default_rng(seed)
    node = get_node_by_id(node_id)
    profiles = node["hourly_profiles_24h"]
    
    hourly_prices = np.zeros(8760, dtype=np.float64)
    
    for day in range(365):
        if day < 79 or day >= 354:
            season = "summer"
        elif 79 <= day < 171:
            season = "autumn"
        elif 171 <= day < 263:
            season = "winter"
        else:
            season = "spring"
            
        base_curve = np.array(profiles[season], dtype=np.float64)
        
        # Add day-to-day volatility: weekend discount & random renewable fluctuation
        is_weekend = (day % 7) in [5, 6]
        day_factor = 0.92 if is_weekend else 1.0
        
        # Stochastic thermal fuel/weather shock (-10% to +15%)
        weather_shock = rng.normal(1.0, 0.08)
        
        # Hourly noise (-$3 to +$4/MWh)
        hour_noise = rng.normal(0.0, 2.5, size=24)
        
        daily_prices = (base_curve * day_factor * weather_shock) + hour_noise
        
        # In northern nodes, solar hours (10:00 - 16:00) frequently hit 0
        if node["zone"] in ["Norte Chico", "Norte Grande"]:
            solar_mask = np.zeros(24, dtype=bool)
            solar_mask[10:16] = True
            # Probabilistic zero-price assignment based on curtailment index
            if rng.random() < (node["curtailment_index_pct"] / 100.0 * 3.5):
                daily_prices[solar_mask] = np.maximum(0.0, daily_prices[solar_mask] * 0.15 - 2.0)
                
        # Ensure prices are not negative (SEN market rules enforce 0 $/MWh floor for normal marginal costs)
        daily_prices = np.maximum(0.0, daily_prices)
        
        start_idx = day * 24
        hourly_prices[start_idx : start_idx + 24] = daily_prices
        
    return hourly_prices
