# VOLTIA Energy OS — Quantitative & Power Systems Backend

High-precision energy intelligence platform for the Chilean and Latin American power market, built as a modern, transparent alternative to Aurora Energy Research.

## ⚡ Core Capabilities

1. **BESS Mathematical Dispatch Optimizer (`backend/models/bess_optimizer.py`)**:
   - Linear Programming formulation solved via SciPy `HiGHS` solver.
   - Enforces SoC transition dynamics, Round-Trip Efficiency (AC-AC $\eta_{RTE} \approx 86\%$), C-rate constraints, degradation penalty per MWh throughput ($4.00/MWh), and cyclic boundary conditions.
   - Full **Revenue Stacking**:
     * **Spot Energy Arbitrage**: Daily purchase during low/zero-price solar hours and injection during peak evening hours (18:00 - 23:00).
     * **DS 70 Firm Capacity Payment (Potencia de Suficiencia)**: Complies with Chile's Supreme Decree DS 70 duration factor curve ($18\%$ for 1h, $36\%$ for 2h, $72\%$ for 4h, $88\%$ for 6h, up to $98\%$ for 8h+).
     * **Ancillary Services (SSCC)**: Fast Frequency Response & Spinning Reserve allocation.
   - **Bankable Institutional Financial Proforma**:
     * Turnkey CAPEX breakdown (Cells, PCS, BOP, EPC/Dev).
     * OPEX breakdown (Fixed O&M + Variable Insurance/Asset Management).
     * 20-Year Proforma with degradation and inflation escalation.
     * Project IRR (TIR) at 15 & 20 years, NPV (VAN), Simple & Discounted Payback, and Levelized Cost of Storage (LCOS in $/MWh).

2. **Chile Canonical Nodal & Substation Database (`backend/data/chile_nodes.py`)**:
   - Primary nodes: Cardones 500kV, Diego de Almagro 220kV, Crucero 220kV, Encuentro 220kV, Pan de Azúcar 220kV, Polpaico 500kV, Alto Jahuel 500kV, Quillota 220kV, Charrúa 500kV, Puerto Montt 220kV.
   - Coordinates, transmission limits, yearly zero-price curtailment hours, congestion levels, and seasonal 24-hour hourly marginal cost profiles (Summer, Autumn, Winter, Spring).

3. **Energy Transition Long-Term Scenarios 2025-2040 (`backend/engine/scenarios.py`)**:
   - **S1: Caso Base CEN** (Entrada progresiva de BESS + retiro gradual carbón 2040).
   - **S2: Alta Penetración Renovable & Retiro Acelerado** (Cierre carbón 2030, spreads extremos).
   - **S3: Estrés Hidrológico** (Sequía prolongada P90, precios nocturnos elevados).
   - **S4: Interconexión Kimal-Lo Aguirre 2029** (Línea HVDC 3000 MW, convergencia zonal de precios y reducción de spreads).

4. **REST API (`backend/main.py`)**:
   - `GET /api/health`
   - `GET /api/nodes`
   - `GET /api/nodes/{node_id}`
   - `POST /api/bess/optimize`
   - `GET /api/scenarios`
   - `GET /api/market/summary`

5. **Precalculated Standalone Datasets (`backend/data/precalculated/`)**:
   - `nodes.json`
   - `scenarios.json`
   - `market_summary.json`
   - `sample_bess_run.json` (4-hour 50 MW / 200 MWh system)
   - `sample_bess_2h.json` (2-hour 50 MW / 100 MWh system)
   - `sample_bess_6h.json` (6-hour 50 MW / 300 MWh system)

## 🚀 Quickstart

```bash
# Install dependencies
pip install -r backend/requirements.txt

# Start backend server
python backend/run_server.py
# Or with uvicorn directly:
uvicorn backend.main:app --reload --port 8000
```
