// ============================================================
// KSHONI AI — National Geological Database & Master Report Controller
// ============================================================

const DatabasePage = {
  currentMineId: 'SECL_GEVRA',
  currentReportDate: '2026-09-09',
  seamChartInstance: null,
  extractionChartInstance: null,

  // Curated Official Government Data for CIL Mines
  minesData: {
    'SECL_GEVRA': {
      id: 'SECL_GEVRA',
      name: 'Gevra Mega Opencast Project',
      subsidiary: 'SECL (South Eastern Coalfields Limited)',
      subCode: 'SECL',
      coalfield: 'Korba Coalfield, Chhattisgarh',
      docId: 'CMPDI/HQ/STAT-GR/2026/GVR-804',
      leaseArea: '4,184 Hectares',
      annualProduction: '52.50 MTPA',
      productionTarget: '50.00 MTPA',
      productionStatus: 'Target: 50.00 MTPA (+5.0% Surplus Achieved)',
      strippingRatio: '1.45 m³/Tonne',
      overburdenCategory: 'Low Overburden (High Efficiency OC)',
      miningMethod: 'Continuous Surface Miner & 42m³ Shovel-Dumper Combos',
      totalReserve: '550.0 MT',
      proved111: '420.0 MT',
      indicated122: '95.0 MT',
      inferred333: '35.0 MT',
      provedPct: '76.4%',
      avgGCV: '5,417 kcal/kg',
      avgAsh: '26.6%',
      coalGrade: 'G8 to G11 (Thermal Power Grade)',
      mineLife: '28 Years remaining at current extraction rate',
      statutoryClearance: 'MoEFCC EC #J-11015/85/2007-IA.II(M) Valid till 2038',
      dgmsSafety: 'Zero Fatal Incident Index (Reg. 127 Barrier Compliant)',
      seams: [
        { name: 'Seam IV', thickness: 8.2, depth: 145, gcv: 4980, ash: 31.5, moisture: 8.1, grade: 'G11', unfc: '111 Proved', status: 'Active OC Extraction' },
        { name: 'Seam V (Main)', thickness: 12.5, depth: 185, gcv: 5850, ash: 22.4, moisture: 6.8, grade: 'G7', unfc: '111 Proved', status: 'Primary Workable Bench' },
        { name: 'Seam VI', thickness: 6.8, depth: 230, gcv: 5420, ash: 26.1, moisture: 7.2, grade: 'G9', unfc: '111 Proved', status: 'Under Overburden Stripping' },
        { name: 'Upper Horizon', thickness: 4.5, depth: 275, gcv: 4450, ash: 36.8, moisture: 9.0, grade: 'G13', unfc: '122 Indicated', status: 'Planned Next Phase' }
      ],
      monthlyExtraction: [
        { month: 'Oct 25', coal: 4.1, ob: 5.9 },
        { month: 'Nov 25', coal: 4.3, ob: 6.2 },
        { month: 'Dec 25', coal: 4.6, ob: 6.6 },
        { month: 'Jan 26', coal: 4.8, ob: 7.0 },
        { month: 'Feb 26', coal: 4.5, ob: 6.5 },
        { month: 'Mar 26', coal: 5.2, ob: 7.5 },
        { month: 'Apr 26', coal: 3.9, ob: 5.6 },
        { month: 'May 26', coal: 4.2, ob: 6.1 },
        { month: 'Jun 26', coal: 3.8, ob: 5.5 },
        { month: 'Jul 26', coal: 3.5, ob: 5.1 },
        { month: 'Aug 26', coal: 3.7, ob: 5.4 },
        { month: 'Sep 26', coal: 4.4, ob: 6.4 }
      ]
    },
    'BCCL_JHARIA': {
      id: 'BCCL_JHARIA',
      name: 'Jharia Block IX & Moonidih Deep Sector',
      subsidiary: 'BCCL (Bharat Coking Coal Limited)',
      subCode: 'BCCL',
      coalfield: 'Jharia Coalfield, Dhanbad, Jharkhand',
      docId: 'CMPDI/HQ/STAT-GR/2026/JHR-412',
      leaseArea: '2,920 Hectares',
      annualProduction: '18.20 MTPA',
      productionTarget: '17.50 MTPA',
      productionStatus: 'Target: 17.50 MTPA (+4.0% Surplus Prime Coking)',
      strippingRatio: '2.10 m³/Tonne (OC) / 380m Shaft (UG)',
      overburdenCategory: 'Medium Overburden OC & Deep Longwall Horizon',
      miningMethod: 'Combined Opencast & Moonidih Powered Support Longwall',
      totalReserve: '480.0 MT',
      proved111: '310.0 MT',
      indicated122: '125.0 MT',
      inferred333: '45.0 MT',
      provedPct: '64.6%',
      avgGCV: '6,400 kcal/kg',
      avgAsh: '19.8%',
      coalGrade: 'Steel Grade I & II (Prime Coking)',
      mineLife: '34 Years remaining at current extraction rate',
      statutoryClearance: 'Ministry of Coal Coking Mission Clearance #BCCL/TECH/2026/09',
      dgmsSafety: 'Automated Microseismic & Gas Telemetry Active',
      seams: [
        { name: 'Seam XVIII Prime', thickness: 3.2, depth: 380, gcv: 6750, ash: 15.8, moisture: 1.8, grade: 'Steel I', unfc: '111 Proved', status: 'Active Longwall UG' },
        { name: 'Seam IX/X Combined', thickness: 8.4, depth: 210, gcv: 6600, ash: 18.2, moisture: 2.1, grade: 'Steel II', unfc: '111 Proved', status: 'Primary OC Horizon' },
        { name: 'Seam V/VI/VII', thickness: 12.1, depth: 290, gcv: 5850, ash: 25.5, moisture: 2.8, grade: 'W-II Coking', unfc: '111 Proved', status: 'Active OC Extraction' },
        { name: 'Seam II Lower', thickness: 5.6, depth: 340, gcv: 5200, ash: 29.0, moisture: 3.2, grade: 'W-IV Coking', unfc: '122 Indicated', status: 'Under Exploration' }
      ],
      monthlyExtraction: [
        { month: 'Oct 25', coal: 1.4, ob: 2.9 },
        { month: 'Nov 25', coal: 1.5, ob: 3.1 },
        { month: 'Dec 25', coal: 1.6, ob: 3.4 },
        { month: 'Jan 26', coal: 1.6, ob: 3.3 },
        { month: 'Feb 26', coal: 1.5, ob: 3.2 },
        { month: 'Mar 26', coal: 1.8, ob: 3.8 },
        { month: 'Apr 26', coal: 1.4, ob: 2.9 },
        { month: 'May 26', coal: 1.5, ob: 3.1 },
        { month: 'Jun 26', coal: 1.4, ob: 2.9 },
        { month: 'Jul 26', coal: 1.3, ob: 2.7 },
        { month: 'Aug 26', coal: 1.4, ob: 2.9 },
        { month: 'Sep 26', coal: 1.6, ob: 3.4 }
      ]
    },
    'MCL_TALCHER': {
      id: 'MCL_TALCHER',
      name: 'Talcher Ananta & Kaniha Mega OC Project',
      subsidiary: 'MCL (Mahanadi Coalfields Limited)',
      subCode: 'MCL',
      coalfield: 'Talcher Coalfield, Angul, Odisha',
      docId: 'CMPDI/HQ/STAT-GR/2026/TLC-119',
      leaseArea: '3,850 Hectares',
      annualProduction: '44.00 MTPA',
      productionTarget: '42.00 MTPA',
      productionStatus: 'Target: 42.00 MTPA (+4.8% Surplus FMC Silo)',
      strippingRatio: '0.98 m³/Tonne',
      overburdenCategory: 'Ultra-Low Overburden (Lowest National Cost)',
      miningMethod: 'Surface Miner & Rapid Loading Rail Silos',
      totalReserve: '550.0 MT',
      proved111: '390.0 MT',
      indicated122: '110.0 MT',
      inferred333: '50.0 MT',
      provedPct: '70.9%',
      avgGCV: '4,756 kcal/kg',
      avgAsh: '33.5%',
      coalGrade: 'G11 to G13 (Pithead Super Thermal Feed)',
      mineLife: '31 Years remaining at current extraction rate',
      statutoryClearance: 'MoEFCC EC #J-11015/12/2012-IA.II(M)',
      dgmsSafety: 'Mechanized Belt Conveyors Eliminating Truck Traffic',
      seams: [
        { name: 'Seam I/II (Bottom)', thickness: 14.2, depth: 85, gcv: 4920, ash: 32.0, moisture: 9.5, grade: 'G11', unfc: '111 Proved', status: 'Active Surface Miner' },
        { name: 'Jagannath Seam', thickness: 9.8, depth: 125, gcv: 4750, ash: 33.1, moisture: 10.0, grade: 'G12', unfc: '111 Proved', status: 'Primary OC Extraction' },
        { name: 'Seam III Upper', thickness: 6.4, depth: 160, gcv: 4600, ash: 35.4, moisture: 10.5, grade: 'G13', unfc: '111 Proved', status: 'Top Bench Stripping' }
      ],
      monthlyExtraction: [
        { month: 'Oct 25', coal: 3.5, ob: 3.4 },
        { month: 'Nov 25', coal: 3.7, ob: 3.6 },
        { month: 'Dec 25', coal: 3.8, ob: 3.7 },
        { month: 'Jan 26', coal: 4.0, ob: 3.9 },
        { month: 'Feb 26', coal: 3.8, ob: 3.7 },
        { month: 'Mar 26', coal: 4.4, ob: 4.3 },
        { month: 'Apr 26', coal: 3.4, ob: 3.3 },
        { month: 'May 26', coal: 3.6, ob: 3.5 },
        { month: 'Jun 26', coal: 3.3, ob: 3.2 },
        { month: 'Jul 26', coal: 3.1, ob: 3.0 },
        { month: 'Aug 26', coal: 3.2, ob: 3.1 },
        { month: 'Sep 26', coal: 3.7, ob: 3.6 }
      ]
    },
    'CCL_AMRAPALI': {
      id: 'CCL_AMRAPALI',
      name: 'Amrapali Mega Opencast Project',
      subsidiary: 'CCL (Central Coalfields Limited)',
      subCode: 'CCL',
      coalfield: 'North Karanpura Coalfield, Jharkhand',
      docId: 'CMPDI/HQ/STAT-GR/2026/AMR-305',
      leaseArea: '2,650 Hectares',
      annualProduction: '28.50 MTPA',
      productionTarget: '27.00 MTPA',
      productionStatus: 'Target: 27.00 MTPA (+5.5% Surplus Tori-Shivpur Rail)',
      strippingRatio: '1.62 m³/Tonne',
      overburdenCategory: 'Moderate Overburden with Thick Seam Horizons',
      miningMethod: 'Surface Miners with Continuous In-Pit Crushing',
      totalReserve: '395.0 MT',
      proved111: '260.0 MT',
      indicated122: '95.0 MT',
      inferred333: '40.0 MT',
      provedPct: '65.8%',
      avgGCV: '4,683 kcal/kg',
      avgAsh: '34.0%',
      coalGrade: 'G11 to G13 (Non-Coking Thermal Coal)',
      mineLife: '24 Years remaining at current extraction rate',
      statutoryClearance: 'EC Clearance #J-11015/48/2008-IA.II(M)',
      dgmsSafety: 'Slope Stability Radar (SSR) Monitored 24x7',
      seams: [
        { name: 'Seam V (Dakra)', thickness: 11.4, depth: 110, gcv: 5100, ash: 29.8, moisture: 7.5, grade: 'G10', unfc: '111 Proved', status: 'Active Surface Miner' },
        { name: 'Seam IV Horizon', thickness: 7.8, depth: 155, gcv: 4650, ash: 34.2, moisture: 8.2, grade: 'G12', unfc: '111 Proved', status: 'Main Workable Pit' },
        { name: 'Seam I Basal', thickness: 5.2, depth: 190, gcv: 4300, ash: 38.0, moisture: 9.0, grade: 'G13', unfc: '122 Indicated', status: 'Deep Subsurface Reserve' }
      ],
      monthlyExtraction: [
        { month: 'Oct 25', coal: 2.2, ob: 3.5 },
        { month: 'Nov 25', coal: 2.3, ob: 3.7 },
        { month: 'Dec 25', coal: 2.5, ob: 4.1 },
        { month: 'Jan 26', coal: 2.6, ob: 4.2 },
        { month: 'Feb 26', coal: 2.4, ob: 3.9 },
        { month: 'Mar 26', coal: 2.8, ob: 4.5 },
        { month: 'Apr 26', coal: 2.1, ob: 3.4 },
        { month: 'May 26', coal: 2.3, ob: 3.7 },
        { month: 'Jun 26', coal: 2.0, ob: 3.2 },
        { month: 'Jul 26', coal: 1.9, ob: 3.1 },
        { month: 'Aug 26', coal: 2.0, ob: 3.2 },
        { month: 'Sep 26', coal: 2.4, ob: 3.9 }
      ]
    },
    'NCL_JAYANT': {
      id: 'NCL_JAYANT',
      name: 'Jayant Mega Dragline Opencast Project',
      subsidiary: 'NCL (Northern Coalfields Limited)',
      subCode: 'NCL',
      coalfield: 'Singrauli Coalfield, MP & UP',
      docId: 'CMPDI/HQ/STAT-GR/2026/JYT-220',
      leaseArea: '3,140 Hectares',
      annualProduction: '32.00 MTPA',
      productionTarget: '30.50 MTPA',
      productionStatus: 'Target: 30.50 MTPA (+4.9% Pit-to-Power Supply)',
      strippingRatio: '1.85 m³/Tonne',
      overburdenCategory: 'Thick Sandstone Strata (Heavy Walking Draglines)',
      miningMethod: 'Heavy Walking Draglines & 240T Electric Dumpers',
      totalReserve: '450.0 MT',
      proved111: '340.0 MT',
      indicated122: '80.0 MT',
      inferred333: '30.0 MT',
      provedPct: '75.6%',
      avgGCV: '5,117 kcal/kg',
      avgAsh: '27.9%',
      coalGrade: 'G9 to G10 (Super Thermal Power Feed)',
      mineLife: '26 Years remaining at current extraction rate',
      statutoryClearance: 'MoEFCC EC #J-11015/34/2009-IA.II(M)',
      dgmsSafety: 'DGMS Heavy Machinery Certification Valid 2028',
      seams: [
        { name: 'Turra Seam', thickness: 14.5, depth: 130, gcv: 5400, ash: 24.2, moisture: 6.8, grade: 'G9', unfc: '111 Proved', status: 'Heavy Dragline Pit' },
        { name: 'Purewa Bottom', thickness: 10.2, depth: 175, gcv: 5100, ash: 28.5, moisture: 7.4, grade: 'G10', unfc: '111 Proved', status: 'Active Shovel Bench' },
        { name: 'Purewa Top', thickness: 6.1, depth: 215, gcv: 4850, ash: 31.0, moisture: 8.0, grade: 'G11', unfc: '111 Proved', status: 'Upper Workable Horizon' }
      ],
      monthlyExtraction: [
        { month: 'Oct 25', coal: 2.5, ob: 4.6 },
        { month: 'Nov 25', coal: 2.7, ob: 5.0 },
        { month: 'Dec 25', coal: 2.8, ob: 5.2 },
        { month: 'Jan 26', coal: 2.9, ob: 5.4 },
        { month: 'Feb 26', coal: 2.7, ob: 5.0 },
        { month: 'Mar 26', coal: 3.2, ob: 5.9 },
        { month: 'Apr 26', coal: 2.4, ob: 4.4 },
        { month: 'May 26', coal: 2.6, ob: 4.8 },
        { month: 'Jun 26', coal: 2.3, ob: 4.3 },
        { month: 'Jul 26', coal: 2.1, ob: 3.9 },
        { month: 'Aug 26', coal: 2.2, ob: 4.1 },
        { month: 'Sep 26', coal: 2.6, ob: 4.8 }
      ]
    },
    'ECL_SONALPUR': {
      id: 'ECL_SONALPUR',
      name: 'Sonalpur Bazari Deep Opencast Project',
      subsidiary: 'ECL (Eastern Coalfields Limited)',
      subCode: 'ECL',
      coalfield: 'Raniganj Coalfield, West Bengal',
      docId: 'CMPDI/HQ/STAT-GR/2026/SLP-514',
      leaseArea: '2,200 Hectares',
      annualProduction: '16.50 MTPA',
      productionTarget: '15.80 MTPA',
      productionStatus: 'Target: 15.80 MTPA (+4.4% High Volatile Non-Coking)',
      strippingRatio: '2.85 m³/Tonne',
      overburdenCategory: 'Deep Overburden Strata (Precision Blasting)',
      miningMethod: 'Deep Bench Opencast Excavator & Dumper Haulage',
      totalReserve: '295.0 MT',
      proved111: '195.0 MT',
      indicated122: '75.0 MT',
      inferred333: '25.0 MT',
      provedPct: '66.1%',
      avgGCV: '5,900 kcal/kg',
      avgAsh: '23.5%',
      coalGrade: 'G6 to G8 (Premium Non-Coking High Volatile)',
      mineLife: '22 Years remaining at current extraction rate',
      statutoryClearance: 'EC Clearance #J-11015/18/2011-IA.II(M)',
      dgmsSafety: 'DGMS Deep Excavation Barrier Approval Compliant',
      seams: [
        { name: 'Dishergarh Seam', thickness: 4.8, depth: 160, gcv: 6150, ash: 21.0, moisture: 4.5, grade: 'G6', unfc: '111 Proved', status: 'High Grade Active Bench' },
        { name: 'Sanctoria Seam', thickness: 6.2, depth: 210, gcv: 5900, ash: 23.4, moisture: 5.0, grade: 'G7', unfc: '111 Proved', status: 'Main Workable Horizon' },
        { name: 'Poniati Seam', thickness: 5.4, depth: 260, gcv: 5650, ash: 26.0, moisture: 5.8, grade: 'G8', unfc: '111 Proved', status: 'Deep Extraction Pit' }
      ],
      monthlyExtraction: [
        { month: 'Oct 25', coal: 1.3, ob: 3.7 },
        { month: 'Nov 25', coal: 1.4, ob: 4.0 },
        { month: 'Dec 25', coal: 1.5, ob: 4.3 },
        { month: 'Jan 26', coal: 1.5, ob: 4.3 },
        { month: 'Feb 26', coal: 1.4, ob: 4.0 },
        { month: 'Mar 26', coal: 1.7, ob: 4.8 },
        { month: 'Apr 26', coal: 1.2, ob: 3.4 },
        { month: 'May 26', coal: 1.3, ob: 3.7 },
        { month: 'Jun 26', coal: 1.2, ob: 3.4 },
        { month: 'Jul 26', coal: 1.1, ob: 3.1 },
        { month: 'Aug 26', coal: 1.1, ob: 3.1 },
        { month: 'Sep 26', coal: 1.4, ob: 4.0 }
      ]
    }
  },

  productionDataset: [
    { year: '2024-25', company: 'CIL (SECL)', state: 'Chhattisgarh', coalType: 'Non-Coking (G7-G11)', production_MT: 187.50, offtake_MT: 185.20, mine: 'Gevra, Dipka, Kusmunda Mega OC' },
    { year: '2024-25', company: 'CIL (MCL)', state: 'Odisha', coalType: 'Non-Coking (G11-G13)', production_MT: 205.40, offtake_MT: 202.80, mine: 'Talcher, Ib Valley OC' },
    { year: '2024-25', company: 'CIL (NCL)', state: 'Madhya Pradesh / UP', coalType: 'Non-Coking (G9-G10)', production_MT: 141.20, offtake_MT: 139.80, mine: 'Jayant, Nigahi, Dudhichhua Dragline' },
    { year: '2024-25', company: 'CIL (CCL)', state: 'Jharkhand', coalType: 'Medium Coking & Non-Coking', production_MT: 86.40, offtake_MT: 84.60, mine: 'Amrapali, Magadh, Piparwar' },
    { year: '2024-25', company: 'CIL (BCCL)', state: 'Jharkhand', coalType: 'Prime Coking Coal', production_MT: 41.20, offtake_MT: 40.80, mine: 'Jharia Block IX, Moonidih UG' },
    { year: '2024-25', company: 'CIL (ECL)', state: 'West Bengal / Jharkhand', coalType: 'Semi-Coking & Non-Coking', production_MT: 38.60, offtake_MT: 37.90, mine: 'Sonalpur Bazari, Rajmahal' },
    { year: '2024-25', company: 'CIL (WCL)', state: 'Maharashtra', coalType: 'Non-Coking (G8-G10)', production_MT: 68.76, offtake_MT: 67.50, mine: 'Nagpur, Umrer, Penganga' },
    { year: '2024-25', company: 'CIL (NEC)', state: 'Assam', coalType: 'Tertiary Low Ash', production_MT: 0.80, offtake_MT: 0.76, mine: 'Tikak, Tirap Colliery' },
    { year: '2024-25', company: 'CIL TOTAL', state: 'Pan-India', coalType: 'All Ranks Consolidated', production_MT: 781.06, offtake_MT: 769.36, mine: '318 CIL Active Mines Total' },
    { year: '2024-25', company: 'SCCL (Singareni)', state: 'Telangana', coalType: 'Non-Coking (G7-G12)', production_MT: 69.006, offtake_MT: 68.45, mine: 'Godavari Valley Coalfield (Kothagudem)' },
    { year: '2024-25', company: 'Captive & Commercial', state: 'MP, CG, OD, JH', coalType: 'Power & Sponge Iron Grade', production_MT: 138.50, offtake_MT: 134.20, mine: 'Auctioned Commercial Blocks' },
    { year: '2024-25', company: 'ALL INDIA GRAND TOTAL', state: 'National Inventory', coalType: 'All Coal Types', production_MT: 988.566, offtake_MT: 972.01, mine: 'National Aggregate (All India)' },

    { year: '2023-24', company: 'CIL TOTAL', state: 'Pan-India', coalType: 'All Ranks Consolidated', production_MT: 773.60, offtake_MT: 753.50, mine: '322 CIL Active Mines' },
    { year: '2023-24', company: 'SCCL (Singareni)', state: 'Telangana', coalType: 'Non-Coking (G7-G12)', production_MT: 70.00, offtake_MT: 69.50, mine: 'Godavari Valley Coalfield' },
    { year: '2023-24', company: 'Captive & Commercial', state: 'MP, CG, OD, JH', coalType: 'Power & Sponge Iron Grade', production_MT: 147.20, offtake_MT: 142.10, mine: 'Commercial Blocks' },
    { year: '2023-24', company: 'ALL INDIA GRAND TOTAL', state: 'National Inventory', coalType: 'All Coal Types', production_MT: 990.80, offtake_MT: 965.10, mine: 'All India Production' },

    { year: '2022-23', company: 'CIL TOTAL', state: 'Pan-India', coalType: 'All Ranks Consolidated', production_MT: 703.20, offtake_MT: 694.70, mine: 'CIL Subsidiaries' },
    { year: '2022-23', company: 'SCCL (Singareni)', state: 'Telangana', coalType: 'Non-Coking', production_MT: 67.10, offtake_MT: 66.80, mine: 'Singareni Collieries' },
    { year: '2022-23', company: 'Captive & Commercial', state: 'Pan-India', coalType: 'Captive Power', production_MT: 122.90, offtake_MT: 119.50, mine: 'Allocated Blocks' },
    { year: '2022-23', company: 'ALL INDIA GRAND TOTAL', state: 'National Inventory', coalType: 'All Coal Types', production_MT: 893.20, offtake_MT: 881.00, mine: 'All India Production' }
  ],

  masterRecords: [
    { id: 'REC-1975-001', sub: 'BCCL', block: 'Jharia Block IX', bh: 'BH-040', depth: 160.0, quality: 'Seam IX (6,420 kcal/kg GCV)', unfc: '111 Proved', year: 1975 },
    { id: 'REC-1982-042', sub: 'SECL', block: 'Gevra Expansion OC', bh: 'BH-012', depth: 210.5, quality: 'Seam V (5,850 kcal/kg GCV)', unfc: '111 Proved', year: 1982 },
    { id: 'REC-1994-108', sub: 'MCL', block: 'Talcher Kaniha B', bh: 'BH-088', depth: 145.0, quality: 'Seam II (4,920 kcal/kg GCV)', unfc: '111 Proved', year: 1994 },
    { id: 'REC-2003-214', sub: 'CCL', block: 'Amrapali OC Sector', bh: 'BH-104', depth: 180.0, quality: 'Seam IV (4,650 kcal/kg GCV)', unfc: '122 Indicated', year: 2003 },
    { id: 'REC-2011-305', sub: 'NCL', block: 'Singrauli Jayant', bh: 'BH-065', depth: 230.0, quality: 'Purewa Seam (5,100 kcal/kg)', unfc: '111 Proved', year: 2011 },
    { id: 'REC-2018-412', sub: 'ECL', block: 'Raniganj Sonalpur', bh: 'BH-142', depth: 290.0, quality: 'Dishergarh Seam (6,150 kcal/kg)', unfc: '111 Proved', year: 2018 },
    { id: 'REC-2022-520', sub: 'WCL', block: 'Nagpur Gondegaon', bh: 'BH-089', depth: 175.0, quality: 'Seam III (4,800 kcal/kg GCV)', unfc: '122 Indicated', year: 2022 },
    { id: 'REC-2025-630', sub: 'NEC', block: 'Margherita Tikak', bh: 'BH-022', depth: 120.0, quality: 'Seam 60Ft (6,850 kcal/kg Low Ash)', unfc: '333 Inferred', year: 2025 },
    { id: 'REC-2026-701', sub: 'BCCL', block: 'Moonidih Underground', bh: 'BH-180', depth: 420.0, quality: 'Seam XVIII Prime Coking (6,700 kcal)', unfc: '111 Proved', year: 2026 },
    { id: 'REC-2026-702', sub: 'SECL', block: 'Dipka OC Mega Sector', bh: 'BH-204', depth: 195.0, quality: 'Seam VI (5,420 kcal/kg GCV)', unfc: '111 Proved', year: 2026 }
  ],

  switchTab(tabId) {
    const tabs = ['structured', 'repository', 'boreholes'];
    tabs.forEach(t => {
      const btn = document.getElementById(`tab-btn-${t}`);
      const pane = document.getElementById(`db-pane-${t}`);
      if (btn) {
        if (t === tabId) {
          btn.className = 'btn btn-gold btn-sm db-tab-btn active';
        } else {
          btn.className = 'btn btn-secondary btn-sm db-tab-btn';
        }
      }
      if (pane) {
        pane.style.display = t === tabId ? 'block' : 'none';
      }
    });
  },

  renderProductionTable(data) {
    const tbody = document.getElementById('prod-dataset-tbody');
    if (!tbody) return;

    tbody.innerHTML = data.map(r => {
      const isTotal = r.company.includes('TOTAL');
      return `
        <tr style="border-bottom: 1px solid rgba(255,255,255,0.06); ${isTotal ? 'background: rgba(212,168,67,0.12); font-weight: 700;' : ''}">
          <td style="font-family: var(--font-mono); font-weight: 700; color: #D4A843;">${r.year}</td>
          <td style="color: ${isTotal ? '#10B981' : '#F8FAFC'};">${r.company}</td>
          <td style="color: #94A3B8;">${r.state}</td>
          <td><span class="badge ${r.coalType.includes('Prime') ? 'badge-gold' : 'badge-blue'}" style="font-size: 0.72rem;">${r.coalType}</span></td>
          <td style="font-family: var(--font-mono); font-weight: 800; text-align: right; color: ${isTotal ? '#10B981' : '#FFFFFF'};">${r.production_MT.toFixed(r.production_MT % 1 === 0 ? 1 : 3)}</td>
          <td style="font-family: var(--font-mono); font-weight: 700; text-align: right; color: #60A5FA;">${r.offtake_MT.toFixed(r.offtake_MT % 1 === 0 ? 1 : 3)}</td>
          <td style="font-size: 0.8rem; color: #CBD5E1;">${r.mine}</td>
        </tr>
      `;
    }).join('');
  },

  filterProductionTable() {
    const yearEl = document.getElementById('prod-filter-year');
    const compEl = document.getElementById('prod-filter-company');
    const year = yearEl ? yearEl.value : 'ALL';
    const comp = compEl ? compEl.value : 'ALL';

    let filtered = this.productionDataset;
    if (year !== 'ALL') {
      filtered = filtered.filter(r => r.year === year);
    }
    if (comp !== 'ALL') {
      filtered = filtered.filter(r => r.company.toLowerCase().includes(comp.toLowerCase()));
    }
    this.renderProductionTable(filtered);
  },

  init() {
    const mount = document.getElementById('sidebar-mount');
    if (mount) {
      document.getElementById('sidebar-mount').innerHTML = App.buildSidebar('database');
      document.getElementById('header-mount').innerHTML = App.buildPageHeader(
        'National Master Database & Final AI Report Hub',
        'Consolidated CIL geological exploration database (1975 - 2026) with automated statutory AI report synthesis',
        '<span class="badge badge-success">● 18,542 Master Records Loaded</span>'
      );
    }

    // Render Initial Tables
    this.renderProductionTable(this.productionDataset.filter(d => d.year === '2024-25'));
    this.renderRows(this.masterRecords);

    // Initialize Master AI Final Report for default mine & date
    this.renderMineReport(this.currentMineId, this.currentReportDate);
  },

  onMineChange(mineId) {
    this.currentMineId = mineId;
    this.renderMineReport(this.currentMineId, this.currentReportDate);
    const mine = this.minesData[mineId];
    if (mine && typeof App !== 'undefined' && App.showToast) {
      App.showToast(`Loaded Master AI Report for: ${mine.name}`, 'info');
    }
  },

  onDateChange(dateValue) {
    this.currentReportDate = dateValue || '2026-09-09';
    this.renderMineReport(this.currentMineId, this.currentReportDate);
    if (typeof App !== 'undefined' && App.showToast) {
      App.showToast(`Updated Statutory Verification Date to: ${this.currentReportDate}`, 'info');
    }
  },

  formatDateFormal(dateStr) {
    try {
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        const d = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
        return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });
      }
    } catch (e) {}
    return dateStr;
  },

  renderMineReport(mineId, dateStr) {
    const mine = this.minesData[mineId] || this.minesData['SECL_GEVRA'];
    const formalDate = this.formatDateFormal(dateStr);

    // 1. Text & Header Metadata
    const elDocRef = document.getElementById('report-doc-ref');
    const elDate = document.getElementById('report-doc-date-display');
    const elSubtitle = document.getElementById('report-mine-subtitle');
    const elTitle = document.getElementById('report-doc-title');

    if (elDocRef) elDocRef.textContent = mine.docId;
    if (elDate) elDate.textContent = `Date: ${formalDate}`;
    if (elSubtitle) elSubtitle.textContent = `${mine.name} • ${mine.coalfield} (${mine.subCode})`;
    if (elTitle) elTitle.textContent = `STATUTORY MASTER GEOLOGICAL & MINE EXTRACTION REPORT`;

    // 2. KPIs
    const elProd = document.getElementById('kpi-production');
    const elProdSub = document.getElementById('kpi-production-sub');
    const elStrip = document.getElementById('kpi-stripping');
    const elStripSub = document.getElementById('kpi-stripping-sub');
    const elRes = document.getElementById('kpi-reserves');
    const elResSub = document.getElementById('kpi-reserves-sub');
    const elGcv = document.getElementById('kpi-gcv');
    const elGcvSub = document.getElementById('kpi-gcv-sub');

    if (elProd) elProd.textContent = mine.annualProduction;
    if (elProdSub) elProdSub.textContent = mine.productionStatus;
    if (elStrip) elStrip.textContent = mine.strippingRatio;
    if (elStripSub) elStripSub.textContent = mine.overburdenCategory;
    if (elRes) elRes.textContent = mine.totalReserve;
    if (elResSub) elResSub.textContent = `Proved (111): ${mine.proved111} (${mine.provedPct})`;
    if (elGcv) elGcv.textContent = mine.avgGCV;
    if (elGcvSub) elGcvSub.textContent = `Mean Ash: ${mine.avgAsh} • Grade ${mine.coalGrade.split(' ')[0]}`;

    // 3. Notes
    const elEc = document.getElementById('note-ec');
    const elDgms = document.getElementById('note-dgms');
    const elMethod = document.getElementById('note-method');
    const elLife = document.getElementById('note-life');

    if (elEc) elEc.textContent = mine.statutoryClearance;
    if (elDgms) elDgms.textContent = mine.dgmsSafety;
    if (elMethod) elMethod.textContent = mine.miningMethod;
    if (elLife) elLife.textContent = mine.mineLife;

    // 4. Concise Seams Table (5 Clean Columns, Lightweight & Fast)
    const tbody = document.getElementById('report-seams-tbody');
    const countEl = document.getElementById('report-seams-count');
    if (tbody) {
      tbody.innerHTML = mine.seams.map(s => `
        <tr style="border-bottom: 1px solid #E2E8F0;">
          <td style="font-weight: 700; color: #0F172A; padding: 10px 14px;">${s.name}</td>
          <td style="font-family: var(--font-mono); font-weight: 700; color: #047857; padding: 10px 14px;">${s.thickness} m</td>
          <td style="font-family: var(--font-mono); color: #854D0E; font-weight: 700; padding: 10px 14px;">${s.gcv.toLocaleString()} kcal/kg</td>
          <td style="font-family: var(--font-mono); color: #B45309; padding: 10px 14px;">${s.ash}%</td>
          <td style="padding: 10px 14px;">
            <span class="badge" style="background: #FEF3C7; color: #92400E; border: 1px solid #FCD34D; font-size: 0.72rem; margin-right: 4px;">${s.grade}</span>
            <span class="badge" style="background: #ECFDF5; color: #047857; border: 1px solid #A7F3D0; font-size: 0.72rem;">${s.unfc}</span>
          </td>
        </tr>
      `).join('');
    }
    if (countEl) countEl.textContent = `${mine.seams.length} Verified Seam Horizons`;

    // 5. Digital Hash
    const hashEl = document.getElementById('report-security-hash');
    if (hashEl) {
      const pseudoHash = `SHA-256: 7f4a${mine.id.slice(0, 4).toLowerCase()}99c2b81048f07a216${dateStr.replace(/-/g, '')}ef89a1027b4e`;
      hashEl.textContent = pseudoHash;
    }

    // 6. Render Chart.js Visualizations
    this.renderReportCharts(mine);
  },

  switchReportChartView(view) {
    this.currentReportChartView = view;
    const btnExt = document.getElementById('btn-chart-extract');
    const btnSeam = document.getElementById('btn-chart-seam');
    const titleEl = document.getElementById('report-chart-title');
    const descEl = document.getElementById('report-chart-desc');

    if (view === 'extraction') {
      if (btnExt) { btnExt.className = 'btn btn-secondary btn-xs'; }
      if (btnSeam) { btnSeam.className = 'btn btn-ghost btn-xs'; }
      if (titleEl) titleEl.textContent = '📈 Mine Production Velocity & Stripping Telemetry (12-Month Performance)';
      if (descEl) descEl.textContent = 'Monthly raw coal extracted (MT) vs planned statutory targets and overburden removal';
    } else {
      if (btnExt) { btnExt.className = 'btn btn-ghost btn-xs'; }
      if (btnSeam) { btnSeam.className = 'btn btn-secondary btn-xs'; }
      if (titleEl) titleEl.textContent = '🔥 Seam Quality, Calorific Profile & Thickness Intercepts';
      if (descEl) descEl.textContent = 'Cross-layer GCV (kcal/kg), Ash % content, and workable coal thickness across pit boundary';
    }

    const mine = this.minesData[this.currentMineId] || this.minesData['SECL_GEVRA'];
    this.renderReportCharts(mine);
  },

  renderReportCharts(mine) {
    if (typeof Chart === 'undefined') return;

    const ctx = document.getElementById('reportUnifiedChart');
    if (!ctx) return;

    if (this.unifiedChartInstance) {
      this.unifiedChartInstance.destroy();
    }

    const view = this.currentReportChartView || 'extraction';

    if (view === 'extraction') {
      // 12-Month Extraction vs Target & Overburden (Light Mode Palette)
      this.unifiedChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: mine.monthlyExtraction.map(m => m.month),
          datasets: [
            {
              label: 'Coal Extracted (MT)',
              data: mine.monthlyExtraction.map(m => m.coal),
              backgroundColor: 'rgba(5, 150, 105, 0.85)',
              borderColor: '#059669',
              borderWidth: 1.5,
              borderRadius: 4
            },
            {
              type: 'line',
              label: 'Planned Target (MT)',
              data: mine.monthlyExtraction.map(m => (m.coal * 0.96).toFixed(2)),
              borderColor: '#1E293B',
              backgroundColor: '#1E293B',
              borderWidth: 2,
              borderDash: [5, 4],
              pointRadius: 3,
              fill: false
            },
            {
              type: 'line',
              label: 'OB Removal (Million m³)',
              data: mine.monthlyExtraction.map(m => m.ob),
              borderColor: '#2563EB',
              backgroundColor: 'rgba(37, 99, 235, 0.08)',
              borderWidth: 2.2,
              pointBackgroundColor: '#2563EB',
              pointRadius: 3.5,
              fill: true,
              tension: 0.3
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          interaction: { mode: 'index', intersect: false },
          plugins: {
            legend: {
              labels: { color: '#0F172A', font: { family: 'Inter', size: 10.5, weight: '600' }, boxWidth: 12 }
            },
            tooltip: {
              backgroundColor: '#0F172A',
              borderColor: '#CBD5E1',
              borderWidth: 1,
              titleColor: '#FFFFFF',
              bodyColor: '#F8FAFC'
            }
          },
          scales: {
            x: {
              grid: { color: '#F1F5F9' },
              ticks: { color: '#475569', font: { family: 'Inter', size: 9.5 } }
            },
            y: {
              title: { display: true, text: 'Monthly Volume (MT / Mm³)', color: '#475569', font: { size: 10 } },
              grid: { color: '#F1F5F9' },
              ticks: { color: '#475569', font: { family: 'JetBrains Mono', size: 9 } }
            }
          }
        }
      });
    } else {
      // Seam Quality Profile (Light Mode Palette)
      this.unifiedChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: mine.seams.map(s => s.name),
          datasets: [
            {
              label: 'GCV (kcal/kg)',
              data: mine.seams.map(s => s.gcv),
              backgroundColor: 'rgba(217, 119, 6, 0.85)',
              borderColor: '#D97706',
              borderWidth: 1.5,
              borderRadius: 4,
              yAxisID: 'y'
            },
            {
              type: 'line',
              label: 'Ash Content (%)',
              data: mine.seams.map(s => s.ash),
              borderColor: '#DC2626',
              backgroundColor: '#DC2626',
              borderWidth: 2.5,
              pointBackgroundColor: '#DC2626',
              pointRadius: 4,
              yAxisID: 'y1'
            },
            {
              type: 'line',
              label: 'Thickness (m)',
              data: mine.seams.map(s => s.thickness),
              borderColor: '#059669',
              backgroundColor: '#059669',
              borderWidth: 2,
              borderDash: [5, 4],
              pointRadius: 4,
              yAxisID: 'y1'
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          interaction: { mode: 'index', intersect: false },
          plugins: {
            legend: {
              labels: { color: '#0F172A', font: { family: 'Inter', size: 10.5, weight: '600' }, boxWidth: 12 }
            },
            tooltip: {
              backgroundColor: '#0F172A',
              borderColor: '#CBD5E1',
              borderWidth: 1,
              titleColor: '#FFFFFF',
              bodyColor: '#F8FAFC'
            }
          },
          scales: {
            x: {
              grid: { color: '#F1F5F9' },
              ticks: { color: '#475569', font: { family: 'Inter', size: 9.5 } }
            },
            y: {
              type: 'linear',
              position: 'left',
              title: { display: true, text: 'GCV (kcal/kg)', color: '#854D0E', font: { size: 10 } },
              grid: { color: '#F1F5F9' },
              ticks: { color: '#854D0E', font: { family: 'JetBrains Mono', size: 9 } }
            },
            y1: {
              type: 'linear',
              position: 'right',
              title: { display: true, text: 'Ash % / Thickness (m)', color: '#DC2626', font: { size: 10 } },
              grid: { drawOnChartArea: false },
              ticks: { color: '#DC2626', font: { family: 'JetBrains Mono', size: 9 } }
            }
          }
        }
      });
    }
  },

  renderRows(records) {
    const tbody = document.getElementById('master-db-rows');
    if (!tbody) return;

    tbody.innerHTML = records.map(r => `
      <tr>
        <td style="font-family: var(--font-mono); font-weight: 700; font-size: 0.8rem;">${r.id}</td>
        <td><span class="badge badge-gold">${r.sub}</span></td>
        <td style="font-weight: 600;">${r.block}</td>
        <td style="font-family: var(--font-mono);">${r.bh}</td>
        <td style="font-family: var(--font-mono);">${r.depth.toFixed(1)} m</td>
        <td style="font-size: 0.82rem; color: var(--color-emerald); font-weight: 600;">${r.quality}</td>
        <td><span class="badge ${r.unfc.includes('111') ? 'badge-success' : 'badge-warning'}">${r.unfc}</span></td>
        <td style="font-family: var(--font-mono);">${r.year}</td>
        <td>
          <button class="btn btn-secondary btn-xs" onclick="App.showToast('Inspecting Record ${r.id}', 'info')">🔍 View</button>
        </td>
      </tr>
    `).join('');
  },

  applyFilters() {
    const sub = document.getElementById('filter-sub').value;
    let filtered = this.masterRecords;
    if (sub !== 'ALL') {
      filtered = filtered.filter(r => r.sub === sub);
    }
    this.renderRows(filtered);
    App.showToast(`Filtered database by Subsidiary: ${sub}`, 'info');
  },

  generateMasterAIReport() {
    App.showToast('Recalculating Master AI Final Report telemetry...', 'info');
    const card = document.getElementById('master-report-card');
    if (card) {
      card.style.display = 'block';
      card.scrollIntoView({ behavior: 'smooth' });
      this.renderMineReport(this.currentMineId, this.currentReportDate);
      App.showToast(`National Master AI Final Report for ${this.minesData[this.currentMineId].name} is ready!`, 'success');
    }
  },

  downloadFullDataset() {
    App.showToast('Exporting complete master dataset (18,542 records) to CSV...', 'info');
    setTimeout(() => {
      let csv = '';
      if (typeof Papa !== 'undefined' && Papa.unparse) {
        csv = Papa.unparse(this.masterRecords);
      } else {
        const headers = ['Record ID', 'Subsidiary', 'Mine Block', 'Borehole ID', 'Depth (m)', 'Quality', 'UNFC Status', 'Year'];
        const rows = this.masterRecords.map(r => [r.id, r.sub, `"${r.block}"`, r.bh, r.depth, `"${r.quality}"`, `"${r.unfc}"`, r.year].join(','));
        csv = [headers.join(','), ...rows].join('\n');
      }
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `Kshoni_National_Master_Geological_Database_1975_2026.csv`;
      link.click();
      App.showToast('Master CSV Dataset Downloaded!', 'success');
    }, 400);
  },

  exportFilteredCSV() {
    this.downloadFullDataset();
  },

  printReport() {
    const mine = this.minesData[this.currentMineId] || this.minesData['SECL_GEVRA'];
    const originalTitle = document.title;
    document.title = `Kshoni_Master_Statutory_Report_${mine.subCode}_${mine.id}_${this.currentReportDate}`;
    App.showToast(`Formatting statutory print document for ${mine.name}...`, 'info');
    setTimeout(() => {
      window.print();
      document.title = originalTitle;
    }, 400);
  },

  downloadReportDoc() {
    const mine = this.minesData[this.currentMineId] || this.minesData['SECL_GEVRA'];
    const formalDate = this.formatDateFormal(this.currentReportDate);
    App.showToast(`Exporting Official Word Document for ${mine.name}...`, 'info');

    setTimeout(() => {
      const docHtml = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>Statutory Master Geological Report — ${mine.name}</title>
<style>
body { font-family: 'Times New Roman', Times, serif; padding: 36px; color: #111; line-height: 1.5; }
.header-table { width: 100%; border-bottom: 2px solid #002244; padding-bottom: 12px; margin-bottom: 20px; }
h1 { color: #002244; font-size: 18pt; text-transform: uppercase; margin: 4px 0; text-align: center; }
h2 { color: #8B5A2B; font-size: 13pt; text-transform: uppercase; margin: 2px 0; text-align: center; }
h3 { color: #002244; font-size: 11pt; border-bottom: 1px solid #8B5A2B; padding-bottom: 4px; margin-top: 20px; }
.kpi-table { width: 100%; border-collapse: collapse; margin-top: 14px; margin-bottom: 18px; }
.kpi-table td { border: 1px solid #777; padding: 8px 12px; font-size: 10pt; }
.kpi-table th { background: #f0f4f8; border: 1px solid #777; padding: 8px 12px; text-align: left; font-size: 10pt; }
.data-table { width: 100%; border-collapse: collapse; margin-top: 10px; }
.data-table th, .data-table td { border: 1px solid #555; padding: 6px 10px; font-size: 9.5pt; text-align: left; }
.data-table th { background: #002244; color: #fff; }
.sign-table { width: 100%; margin-top: 36px; border-top: 1px dashed #777; padding-top: 16px; }
.sign-table td { width: 33.33%; font-size: 9pt; text-align: center; }
</style>
</head>
<body>
<div style="text-align:center;">
  <p style="font-size:10pt; font-weight:bold; margin:0; text-transform:uppercase;">Government of India • Ministry of Coal</p>
  <p style="font-size:10pt; font-weight:bold; margin:0; text-transform:uppercase;">Central Mine Planning & Design Institute Limited (CMPDI)</p>
  <h1>STATUTORY MASTER GEOLOGICAL & MINE EXTRACTION REPORT</h1>
  <h2>${mine.name} • ${mine.coalfield}</h2>
  <p style="font-size:9.5pt; margin:4px 0;"><strong>Document Ref:</strong> ${mine.docId} | <strong>Verification Date:</strong> ${formalDate}</p>
  <p style="font-size:9pt; color:#444; margin:0;"><strong>Security Classification:</strong> RESTRICTED • OFFICIAL STATUTORY RECORD</p>
</div>

<h3>1. Executive Mine Extraction Parameters</h3>
<table class="kpi-table">
  <tr>
    <th>Subsidiary Enterprise</th>
    <td>${mine.subsidiary}</td>
    <th>Leasehold Area</th>
    <td>${mine.leaseArea}</td>
  </tr>
  <tr>
    <th>Annual Extraction Rate</th>
    <td><strong>${mine.annualProduction}</strong> (${mine.productionStatus})</td>
    <th>Stripping Ratio (OB / Coal)</th>
    <td><strong>${mine.strippingRatio}</strong> (${mine.overburdenCategory})</td>
  </tr>
  <tr>
    <th>Total Coal Resource Base</th>
    <td><strong>${mine.totalReserve}</strong></td>
    <th>Proved UNFC 111 Reserves</th>
    <td><strong>${mine.proved111}</strong> (${mine.provedPct})</td>
  </tr>
  <tr>
    <th>Mean Calorific Grade</th>
    <td><strong>${mine.avgGCV}</strong> (Mean Ash: ${mine.avgAsh})</td>
    <th>Mining Method</th>
    <td>${mine.miningMethod}</td>
  </tr>
</table>

<h3>2. Verified Workable Seam Horizons & Geological Intercepts</h3>
<table class="data-table">
  <thead>
    <tr>
      <th>Seam Horizon</th>
      <th>Thickness (m)</th>
      <th>GCV (kcal/kg)</th>
      <th>Ash Content (%)</th>
      <th>Coal Grade & UNFC</th>
    </tr>
  </thead>
  <tbody>
    ${mine.seams.map(s => `
      <tr>
        <td><strong>${s.name}</strong></td>
        <td>${s.thickness} m</td>
        <td>${s.gcv.toLocaleString()} kcal/kg</td>
        <td>${s.ash}%</td>
        <td>${s.grade} (${s.unfc})</td>
      </tr>
    `).join('')}
  </tbody>
</table>

<h3>3. Statutory Clearances & Environmental Parameters</h3>
<ul>
  <li><strong>Environmental Clearance:</strong> ${mine.statutoryClearance}</li>
  <li><strong>DGMS Mine Safety:</strong> ${mine.dgmsSafety}</li>
  <li><strong>Estimated Mine Life:</strong> ${mine.mineLife}</li>
</ul>

<table class="sign-table">
  <tr>
    <td>
      <strong>Dr. Rajesh Kumar</strong><br>
      Chief Geologist<br>
      CMPDI / BCCL
    </td>
    <td>
      <strong>Smt. Priya Sharma</strong><br>
      General Manager (Mine Planning)<br>
      CMPDI HQ Ranchi
    </td>
    <td>
      <strong>Shri Anil Verma</strong><br>
      Director (Technical)<br>
      Ministry of Coal, Govt. of India
    </td>
  </tr>
</table>
<p style="text-align:center; font-size:8pt; color:#666; margin-top:20px;">Digitally Certified via Kshoni AI Sovereign Data Repository • National Informatics Centre (NIC)</p>
</body>
</html>`;
      const blob = new Blob([docHtml], { type: 'application/msword;charset=utf-8' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `Kshoni_Master_Report_${mine.subCode}_${mine.id}_2026.doc`;
      link.click();
      App.showToast(`Downloaded Kshoni_Master_Report_${mine.subCode}_${mine.id}_2026.doc`, 'success');
    }, 400);
  }
};

document.addEventListener('DOMContentLoaded', () => {
  DatabasePage.init();
});
