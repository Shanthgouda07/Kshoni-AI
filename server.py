import time
import io
import csv
from typing import Optional, List
from fastapi import FastAPI, Query, HTTPException, Response
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(
    title="Kshoni AI Backend Engine",
    description="High-Performance API Service for Ministry of Coal, CMPDI, and Coal India Limited",
    version="2.0.0"
)

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Data Models & Master Storage ---

RESERVES_DATA = [
    {"subsidiary": "SECL", "name": "South Eastern Coalfields Ltd", "proved_111": 38.4, "indicated_122": 18.2, "inferred_333": 8.5, "stripping_ratio": 1.45, "primary_coalfield": "Korba / Mand-Raigarh"},
    {"subsidiary": "MCL", "name": "Mahanadi Coalfields Ltd", "proved_111": 34.2, "indicated_122": 16.5, "inferred_333": 7.1, "stripping_ratio": 0.98, "primary_coalfield": "Talcher / Ib Valley"},
    {"subsidiary": "CCL", "name": "Central Coalfields Ltd", "proved_111": 28.6, "indicated_122": 14.1, "inferred_333": 6.4, "stripping_ratio": 1.62, "primary_coalfield": "North Karanpura / Bokaro"},
    {"subsidiary": "BCCL", "name": "Bharat Coking Coal Ltd", "proved_111": 24.1, "indicated_122": 12.8, "inferred_333": 5.9, "stripping_ratio": 2.85, "primary_coalfield": "Jharia Coking Coal"},
    {"subsidiary": "ECL", "name": "Eastern Coalfields Ltd", "proved_111": 21.8, "indicated_122": 11.4, "inferred_333": 5.2, "stripping_ratio": 2.90, "primary_coalfield": "Raniganj / Rajmahal"},
    {"subsidiary": "NCL", "name": "Northern Coalfields Ltd", "proved_111": 18.5, "indicated_122": 9.2, "inferred_333": 4.1, "stripping_ratio": 1.75, "primary_coalfield": "Singrauli Block"},
    {"subsidiary": "WCL", "name": "Western Coalfields Ltd", "proved_111": 11.2, "indicated_122": 7.8, "inferred_333": 3.6, "stripping_ratio": 3.10, "primary_coalfield": "Nagpur / Pench Kanhan"},
    {"subsidiary": "NEC", "name": "North Eastern Coalfields", "proved_111": 1.6, "indicated_122": 4.2, "inferred_333": 2.0, "stripping_ratio": 2.10, "primary_coalfield": "Makum / Margherita"}
]

BOREHOLES_DATA = [
    {"id": "BH-040", "x": -60, "z": -40, "depth": 160.0, "netCoal": 16.5, "gcv": 6200, "ash": 18.2, "rl": 212.0, "status": "Verified", "seams": ["Seam IX/X", "Seam V/VI/VII"]},
    {"id": "BH-041", "x": -20, "z": -50, "depth": 175.0, "netCoal": 17.8, "gcv": 6350, "ash": 17.5, "rl": 213.5, "status": "Verified", "seams": ["Seam IX/X", "Seam V/VI/VII"]},
    {"id": "BH-042", "x": 20, "z": -10, "depth": 185.0, "netCoal": 18.4, "gcv": 6420, "ash": 16.8, "rl": 214.5, "status": "Verified", "seams": ["Seam IX/X", "Seam V/VI/VII", "Seam IV"]},
    {"id": "BH-043", "x": 70, "z": 30, "depth": 190.0, "netCoal": 19.2, "gcv": 6580, "ash": 15.9, "rl": 216.0, "status": "Verified", "seams": ["Seam IX/X", "Seam V/VI/VII", "Seam IV"]},
    {"id": "BH-044", "x": -40, "z": 40, "depth": 170.0, "netCoal": 16.9, "gcv": 6150, "ash": 19.1, "rl": 211.8, "status": "Verified", "seams": ["Seam IX/X", "Seam V/VI/VII"]},
    {"id": "BH-045", "x": 30, "z": 60, "depth": 180.0, "netCoal": 18.1, "gcv": 6390, "ash": 17.2, "rl": 215.2, "status": "Verified", "seams": ["Seam IX/X", "Seam V/VI/VII", "Seam IV"]}
]

COMPLIANCE_CHECKS = [
    {
        "id": "CHK-MOEFCC-01",
        "subsidiary": "BCCL",
        "mine": "Jharia Block IX OC",
        "authority": "MoEFCC",
        "category": "Environmental Clearance",
        "rule": "EIA Notification 2006 (Green Belt & Dust Suppression)",
        "score": 96.5,
        "status": "PASS",
        "badge": "Fully Compliant",
        "lastAudited": "2026-02-15",
        "remarks": "Ambient Air Quality Monitoring (AAQM) parameters within standard limits (PM10 < 100 µg/m³)."
    },
    {
        "id": "CHK-DGMS-02",
        "subsidiary": "SECL",
        "mine": "Gevra Expansion OC",
        "authority": "DGMS",
        "category": "Slope Stability & Bench Safety",
        "rule": "Coal Mines Regulations (CMR 2017 - Regulation 106)",
        "score": 98.2,
        "status": "PASS",
        "badge": "Fully Compliant",
        "lastAudited": "2026-02-28",
        "remarks": "Real-time radar slope monitoring deployed on 12m benches. Factor of Safety (FoS) = 1.42."
    },
    {
        "id": "CHK-MOC-03",
        "subsidiary": "MCL",
        "mine": "Talcher Kaniha OC",
        "authority": "Ministry of Coal",
        "category": "Star Rating of Mines",
        "rule": "5-Star Rating Framework (Eco-Restoration & Bio-Fencing)",
        "score": 94.0,
        "status": "PASS",
        "badge": "5-Star Rating Certified",
        "lastAudited": "2026-01-20",
        "remarks": "Overburden dump bio-reclamation completed across 45 hectares."
    },
    {
        "id": "CHK-DGMS-04",
        "subsidiary": "WCL",
        "mine": "Pench Kanhan Underground",
        "authority": "DGMS",
        "category": "Underground Ventilation & Gas Detection",
        "rule": "CMR 2017 - Regulation 153 (Continuous Telemetric Monitoring)",
        "score": 78.4,
        "status": "WARN",
        "badge": "Action Due (30 Days)",
        "lastAudited": "2026-03-01",
        "remarks": "Telemetry sensor calibration log pending in Panel C4. Remedial directive issued."
    },
    {
        "id": "CHK-MOEFCC-05",
        "subsidiary": "ECL",
        "mine": "Rajmahal OC Project",
        "authority": "MoEFCC",
        "category": "Forest Clearance Stage II",
        "rule": "Forest (Conservation) Act 1980 (Compensatory Afforestation)",
        "score": 45.0,
        "status": "FAIL",
        "badge": "Critical Non-Compliance",
        "lastAudited": "2026-03-04",
        "remarks": "Compensatory afforestation land transfer documentation delayed for Sector B. DGMS show-cause notice."
    }
]

# --- API Endpoints ---

@app.get("/api/health")
def get_health():
    return {
        "status": "online",
        "system": "Kshoni AI Engine",
        "version": "2.0.0",
        "timestamp": int(time.time()),
        "subsystems": {
            "database": "connected (UNFC Parquet / SQLite)",
            "rag_search": "active",
            "three_js_stream": "ready"
        }
    }

@app.get("/api/reserves")
def get_reserves(subsidiary: Optional[str] = Query(None, description="Filter by subsidiary code (e.g., SECL, BCCL)")):
    if subsidiary:
        filtered = [r for r in RESERVES_DATA if r["subsidiary"].upper() == subsidiary.upper()]
        if not filtered:
            raise HTTPException(status_code=404, detail=f"Subsidiary '{subsidiary}' not found")
        return {"total": len(filtered), "data": filtered}
    
    # Calculate rollup totals
    total_111 = sum(r["proved_111"] for r in RESERVES_DATA)
    total_122 = sum(r["indicated_122"] for r in RESERVES_DATA)
    total_333 = sum(r["inferred_333"] for r in RESERVES_DATA)

    return {
        "total_subsidiaries": len(RESERVES_DATA),
        "national_rollup": {
            "proved_111_BT": round(total_111, 1),
            "indicated_122_BT": round(total_122, 1),
            "inferred_333_BT": round(total_333, 1),
            "total_inventory_BT": round(total_111 + total_122 + total_333, 1)
        },
        "data": RESERVES_DATA
    }

@app.get("/api/boreholes")
def get_boreholes(
    min_depth: Optional[float] = Query(None),
    min_gcv: Optional[int] = Query(None)
):
    results = BOREHOLES_DATA
    if min_depth is not None:
        results = [b for b in results if b["depth"] >= min_depth]
    if min_gcv is not None:
        results = [b for b in results if b["gcv"] >= min_gcv]
    
    return {
        "count": len(results),
        "boreholes": results
    }

@app.get("/api/compliance")
def get_compliance(status: Optional[str] = Query(None)):
    results = COMPLIANCE_CHECKS
    if status:
        results = [c for c in results if c["status"].upper() == status.upper()]
    
    return {
        "total_checks": len(COMPLIANCE_CHECKS),
        "passed": sum(1 for c in COMPLIANCE_CHECKS if c["status"] == "PASS"),
        "warning": sum(1 for c in COMPLIANCE_CHECKS if c["status"] == "WARN"),
        "failed": sum(1 for c in COMPLIANCE_CHECKS if c["status"] == "FAIL"),
        "records": results
    }

class CSVExportRequest(BaseModel):
    dataset_type: str  # "reserves", "compliance", "boreholes"

@app.post("/api/export/csv")
def export_csv(req: CSVExportRequest):
    output = io.StringIO()
    writer = csv.writer(output)

    if req.dataset_type == "reserves":
        writer.writerow(["Subsidiary Code", "Subsidiary Name", "Proved 111 (BT)", "Indicated 122 (BT)", "Inferred 333 (BT)", "Stripping Ratio (m3/T)", "Primary Coalfield"])
        for r in RESERVES_DATA:
            writer.writerow([r["subsidiary"], r["name"], r["proved_111"], r["indicated_122"], r["inferred_333"], r["stripping_ratio"], r["primary_coalfield"]])
        filename = "Kshoni_UNFC_Reserves.csv"

    elif req.dataset_type == "compliance":
        writer.writerow(["Audit ID", "Subsidiary", "Mine / Block", "Authority", "Category", "Regulatory Standard", "Score (%)", "Status", "Remarks"])
        for c in COMPLIANCE_CHECKS:
            writer.writerow([c["id"], c["subsidiary"], c["mine"], c["authority"], c["category"], c["rule"], c["score"], c["status"], c["remarks"]])
        filename = "Kshoni_Statutory_Compliance_Audit.csv"

    elif req.dataset_type == "boreholes":
        writer.writerow(["Borehole ID", "X Coord", "Z Coord", "Depth (m)", "Net Coal Thickness (m)", "GCV (kcal/kg)", "Ash %", "RL Elevation (m)", "Status"])
        for b in BOREHOLES_DATA:
            writer.writerow([b["id"], b["x"], b["z"], b["depth"], b["netCoal"], b["gcv"], b["ash"], b["rl"], b["status"]])
        filename = "Kshoni_Borehole_Assays.csv"

    else:
        raise HTTPException(status_code=400, detail="Invalid dataset type")

    output.seek(0)
    return Response(
        content=output.getvalue(),
        media_type="text/csv",
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )

class ReportRequest(BaseModel):
    template: str
    subsidiary: str
    block: str

@app.post("/api/reports/generate")
def generate_report(req: ReportRequest):
    return {
        "report_id": f"CMPDI/GR/2026/{int(time.time()) % 1000:03d}",
        "status": "Synthesized",
        "template": req.template.upper(),
        "subsidiary": req.subsidiary,
        "block": req.block,
        "compliance_score": 98.6,
        "unfc_classification": "UNFC 111 (Proved Commercial)",
        "generated_at": time.strftime("%Y-%m-%d %H:%M:%S")
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
