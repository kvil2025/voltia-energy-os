"""
VOLTIA Energy OS - Main FastAPI Backend Service
High-precision energy intelligence platform for the Chilean & Latin American power market.
"""

from typing import Dict, List, Any, Optional
from fastapi import FastAPI, Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from backend.data.chile_nodes import get_all_nodes, get_node_by_id, SEN_NODES
from backend.engine.scenarios import (
    get_all_scenarios,
    get_scenario_by_id,
    get_scenario_spread_forecast_matrix,
    SCENARIOS,
)
from backend.models.bess_optimizer import optimize_bess

app = FastAPI(
    title="VOLTIA Energy OS API",
    description="Agile, high-precision alternative to Aurora Energy Research for the Chilean & LatAm power market.",
    version="1.0.0",
)

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# --- Pydantic Request Models ---
class BessOptimizationRequest(BaseModel):
    power_mw: float = Field(50.0, description="Rated power in MW (Megawatts)", gt=0)
    energy_mwh: float = Field(200.0, description="Storage capacity in MWh (Megawatt-hours)", gt=0)
    node_id: str = Field("cardones_500", description="Chilean SEN Substation ID")
    round_trip_efficiency: float = Field(0.86, description="AC-AC Round trip efficiency (0.70 to 0.95)", ge=0.5, le=1.0)
    degradation_cost_usd_mwh: float = Field(4.0, description="Battery degradation cost per MWh throughput ($/MWh)", ge=0)
    min_soc_pct: float = Field(0.05, description="Minimum State of Charge (DoD limit)", ge=0.0, le=0.5)
    max_soc_pct: float = Field(0.95, description="Maximum State of Charge", ge=0.5, le=1.0)
    sscc_participation_pct: float = Field(0.15, description="Fraction of power committed to Ancillary Services (0.0 to 0.5)", ge=0.0, le=0.6)
    sscc_price_usd_kw_month: float = Field(1.25, description="SSCC reserve compensation ($/kW-month)", ge=0)
    ds70_capacity_price_usd_kw_month: float = Field(10.50, description="Regulated capacity price under DS 70 ($/kW-month)", ge=0)
    capex_battery_usd_kwh: float = Field(115.0, description="Battery DC block CAPEX ($/kWh)", ge=50)
    capex_pcs_usd_kw: float = Field(65.0, description="PCS / Inverter CAPEX ($/kW)", ge=20)
    capex_bop_usd_kw: float = Field(45.0, description="Balance of Plant / Substation CAPEX ($/kW)", ge=10)
    opex_fixed_usd_kw_year: float = Field(14.0, description="Fixed annual O&M ($/kW-year)", ge=0)
    discount_rate_wacc: float = Field(0.08, description="Discount rate / WACC (e.g. 0.08 for 8.0%)", ge=0.01, le=0.30)
    run_8760: bool = Field(False, description="Whether to run full 8760h optimization instead of seasonal 24h representative days")
    custom_profile: Optional[List[float]] = Field(None, description="Optional custom 24h or 8760h marginal cost curve ($/MWh)")


# --- API Routes ---

@app.get("/api/health")
def health_check() -> Dict[str, Any]:
    """Health status and service metadata."""
    return {
        "status": "online",
        "service": "VOLTIA Energy OS Engine",
        "version": "1.0.0",
        "market": "Chile SEN (Sistema Eléctrico Nacional)",
        "solver": "HiGHS LP Solver (SciPy)",
    }


@app.get("/api/nodes")
def list_nodes(zone: Optional[str] = None) -> Dict[str, Any]:
    """
    Returns canonical list of SEN substations with geographic coordinates,
    historical average prices, zero-price solar hours, and typical spreads.
    """
    nodes = get_all_nodes()
    if zone is not None and isinstance(zone, str):
        nodes = [n for n in nodes if n["zone"].lower() == zone.lower()]
    return {
        "count": len(nodes),
        "nodes": nodes,
    }


@app.get("/api/nodes/{node_id}")
def get_node_details(node_id: str) -> Dict[str, Any]:
    """Returns detailed telemetry, transmission status, and 24h profiles for a specific node."""
    if node_id not in SEN_NODES:
        raise HTTPException(status_code=404, detail=f"Node '{node_id}' not found in SEN database")
    return get_node_by_id(node_id)


@app.post("/api/bess/optimize")
def run_bess_optimizer(params: BessOptimizationRequest) -> Dict[str, Any]:
    """
    Executes high-precision linear programming dispatch for BESS with Revenue Stacking:
    - Energy Spot Arbitrage
    - DS 70 Firm Capacity Payment
    - Ancillary Services (SSCC)
    - 20-Year Bankable Proforma (CAPEX, OPEX, EBITDA, IRR 15/20y, NPV, Payback, LCOS)
    """
    try:
        results = optimize_bess(
            power_mw=params.power_mw,
            energy_mwh=params.energy_mwh,
            node_id=params.node_id,
            round_trip_eff=params.round_trip_efficiency,
            degradation_cost_usd_mwh=params.degradation_cost_usd_mwh,
            min_soc_pct=params.min_soc_pct,
            max_soc_pct=params.max_soc_pct,
            sscc_participation_pct=params.sscc_participation_pct,
            sscc_price_usd_kw_month=params.sscc_price_usd_kw_month,
            ds70_capacity_price_usd_kw_month=params.ds70_capacity_price_usd_kw_month,
            capex_battery_usd_kwh=params.capex_battery_usd_kwh,
            capex_pcs_usd_kw=params.capex_pcs_usd_kw,
            capex_bop_usd_kw=params.capex_bop_usd_kw,
            opex_fixed_usd_kw_year=params.opex_fixed_usd_kw_year,
            discount_rate_wacc=params.discount_rate_wacc,
            run_8760=params.run_8760,
            custom_profile=params.custom_profile,
        )
        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Optimization error: {str(e)}")


@app.get("/api/scenarios")
def list_scenarios(scenario_id: Optional[str] = None) -> Dict[str, Any]:
    """
    Returns long-term energy transition scenarios (2025-2040) style Aurora Energy Research,
    including yearly spread, curtailment, and BESS buildout forecasts.
    """
    if scenario_id is not None and isinstance(scenario_id, str):
        if scenario_id not in SCENARIOS:
            raise HTTPException(status_code=404, detail=f"Scenario '{scenario_id}' not found")
        return {"scenario": get_scenario_by_id(scenario_id)}

    return {
        "scenarios": get_all_scenarios(),
        "spread_forecast_matrix": get_scenario_spread_forecast_matrix(),
    }


@app.get("/api/market/summary")
def get_market_summary() -> Dict[str, Any]:
    """
    Returns macro executive summary of the Chilean National Electric System (SEN):
    - Real-time / YTD Curtailment metrics
    - BESS pipeline (Operating, Construction, Environmental Approval)
    - Nodal price spreads by zone
    - Critical transmission bottlenecks
    """
    nodes = get_all_nodes()
    
    # Calculate top arbitrage spread nodes
    ranked_by_spread = sorted(nodes, key=lambda x: x["typical_spread_usd"], reverse=True)
    top_nodes = [
        {
            "id": n["id"],
            "name": n["name"],
            "zone": n["zone"],
            "typical_spread_usd": n["typical_spread_usd"],
            "zero_price_hours": n["zero_price_hours_yearly"],
            "curtailment_pct": n["curtailment_index_pct"],
        }
        for n in ranked_by_spread[:5]
    ]

    # Zonal summary spreads
    zones_spread = {
        "Norte Grande": 87.1,
        "Norte Chico": 91.2,
        "Centro": 73.0,
        "Sur": 67.0,
    }

    return {
        "market": "Chile SEN (Sistema Eléctrico Nacional)",
        "curtailment_ytd": {
            "total_curtailed_twh": 3.42,
            "curtailment_rate_pct": 18.4,
            "estimated_economic_loss_usd_m": 142.5,
            "primary_technology": "Solar Fotovoltaico (91%) + Eólico (9%)",
            "historical_trend": [
                {"year": 2021, "curtailment_gwh": 760, "curtailment_pct": 5.2},
                {"year": 2022, "curtailment_gwh": 1470, "curtailment_pct": 9.1},
                {"year": 2023, "curtailment_gwh": 2250, "curtailment_pct": 13.8},
                {"year": 2024, "curtailment_gwh": 2890, "curtailment_pct": 16.5},
                {"year": 2025, "curtailment_gwh": 3420, "curtailment_pct": 18.4},
            ]
        },
        "bess_pipeline_sen": {
            "operating_mw": 1420.0,
            "operating_mwh": 5680.0,
            "under_construction_mw": 3250.0,
            "under_construction_mwh": 14200.0,
            "environmental_approval_mw": 8940.0,
            "projected_2030_mw": 6200.0,
            "average_duration_hours": 4.1,
        },
        "price_spreads_by_zone_usd": zones_spread,
        "top_bess_arbitrage_nodes": top_nodes,
        "transmission_bottlenecks": [
            {
                "corridor": "Cardones - Polpaico 500 kV",
                "length_km": 753,
                "current_flow_mw": 1680,
                "rating_mw": 1700,
                "saturation_pct": 98.8,
                "status": "Congestión Severa / Vertimiento permanente en horas de sol",
            },
            {
                "corridor": "Crucero - Encuentro 220 kV",
                "length_km": 110,
                "current_flow_mw": 980,
                "rating_mw": 1100,
                "saturation_pct": 89.1,
                "status": "Congestión Alta en horas punta minera",
            },
            {
                "corridor": "Charrúa - Ancoa 500 kV",
                "length_km": 198,
                "current_flow_mw": 1850,
                "rating_mw": 2400,
                "saturation_pct": 77.0,
                "status": "Operación Normal / Moderada",
            },
        ],
        "kimal_lo_aguirre_status": {
            "name": "Línea HVDC Kimal - Lo Aguirre (+/- 600 kV)",
            "capacity_mw": 3000,
            "length_km": 1344,
            "expected_cod": "Diciembre 2028 - Q2 2029",
            "impact_on_spreads": "Reducción estimada del 35% al 45% en spreads Norte-Centro tras su entrada en operación",
        }
    }
