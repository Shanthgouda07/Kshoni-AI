// ============================================================
// BHOO-MITRA AI — Borehole & Seam Data
// Synthetic data mimicking Jharia/Talcher coalfield structures
// ============================================================

const BOREHOLES = [
  // BCCL - Jharia Block-A boreholes
  { id: 'BH-JA-001', blockId: 'BK-001', code: 'JA-001', lat: 23.7912, lng: 86.4215, depth_m: 285, drilled_date: '2024-03-15', subsidiary: 'BCCL' },
  { id: 'BH-JA-002', blockId: 'BK-001', code: 'JA-002', lat: 23.7934, lng: 86.4278, depth_m: 312, drilled_date: '2024-04-22', subsidiary: 'BCCL' },
  { id: 'BH-JA-003', blockId: 'BK-001', code: 'JA-003', lat: 23.7889, lng: 86.4341, depth_m: 268, drilled_date: '2024-05-10', subsidiary: 'BCCL' },
  { id: 'BH-JA-004', blockId: 'BK-001', code: 'JA-004', lat: 23.7967, lng: 86.4189, depth_m: 295, drilled_date: '2024-06-03', subsidiary: 'BCCL' },
  { id: 'BH-JA-005', blockId: 'BK-001', code: 'JA-005', lat: 23.7945, lng: 86.4356, depth_m: 278, drilled_date: '2024-07-18', subsidiary: 'BCCL' },
  
  // CCL - Karanpura OC-I boreholes
  { id: 'BH-KP-001', blockId: 'BK-003', code: 'KP-001', lat: 23.6712, lng: 85.4321, depth_m: 195, drilled_date: '2024-01-08', subsidiary: 'CCL' },
  { id: 'BH-KP-002', blockId: 'BK-003', code: 'KP-002', lat: 23.6745, lng: 85.4398, depth_m: 210, drilled_date: '2024-02-14', subsidiary: 'CCL' },
  { id: 'BH-KP-003', blockId: 'BK-003', code: 'KP-003', lat: 23.6689, lng: 85.4456, depth_m: 188, drilled_date: '2024-03-20', subsidiary: 'CCL' },
  { id: 'BH-KP-004', blockId: 'BK-003', code: 'KP-004', lat: 23.6778, lng: 85.4267, depth_m: 225, drilled_date: '2024-04-05', subsidiary: 'CCL' },
  
  // MCL - Talcher Block-III boreholes
  { id: 'BH-TC-001', blockId: 'BK-005', code: 'TC-001', lat: 20.9456, lng: 85.2134, depth_m: 342, drilled_date: '2023-11-12', subsidiary: 'MCL' },
  { id: 'BH-TC-002', blockId: 'BK-005', code: 'TC-002', lat: 20.9489, lng: 85.2198, depth_m: 356, drilled_date: '2023-12-20', subsidiary: 'MCL' },
  { id: 'BH-TC-003', blockId: 'BK-005', code: 'TC-003', lat: 20.9512, lng: 85.2267, depth_m: 328, drilled_date: '2024-01-15', subsidiary: 'MCL' },
  { id: 'BH-TC-004', blockId: 'BK-005', code: 'TC-004', lat: 20.9434, lng: 85.2312, depth_m: 365, drilled_date: '2024-02-28', subsidiary: 'MCL' },
  { id: 'BH-TC-005', blockId: 'BK-005', code: 'TC-005', lat: 20.9478, lng: 85.2089, depth_m: 338, drilled_date: '2024-04-10', subsidiary: 'MCL' },
  { id: 'BH-TC-006', blockId: 'BK-005', code: 'TC-006', lat: 20.9523, lng: 85.2156, depth_m: 348, drilled_date: '2024-05-22', subsidiary: 'MCL' },
  
  // SECL - Korba East boreholes
  { id: 'BH-KB-001', blockId: 'BK-007', code: 'KB-001', lat: 22.3456, lng: 82.6812, depth_m: 245, drilled_date: '2024-02-05', subsidiary: 'SECL' },
  { id: 'BH-KB-002', blockId: 'BK-007', code: 'KB-002', lat: 22.3489, lng: 82.6878, depth_m: 258, drilled_date: '2024-03-12', subsidiary: 'SECL' },
  { id: 'BH-KB-003', blockId: 'BK-007', code: 'KB-003', lat: 22.3512, lng: 82.6934, depth_m: 232, drilled_date: '2024-04-18', subsidiary: 'SECL' },
  
  // NCL - Singrauli boreholes
  { id: 'BH-SG-001', blockId: 'BK-009', code: 'SG-001', lat: 24.0812, lng: 82.6545, depth_m: 178, drilled_date: '2024-01-22', subsidiary: 'NCL' },
  { id: 'BH-SG-002', blockId: 'BK-009', code: 'SG-002', lat: 24.0845, lng: 82.6612, depth_m: 192, drilled_date: '2024-03-08', subsidiary: 'NCL' },
  { id: 'BH-SG-003', blockId: 'BK-009', code: 'SG-003', lat: 24.0878, lng: 82.6678, depth_m: 185, drilled_date: '2024-04-25', subsidiary: 'NCL' }
];

// Seam intersection data for each borehole
const SEAM_INTERSECTIONS = [
  // JA-001 seams (Jharia - multiple seams typical)
  { id: 'SI-001', boreholeId: 'BH-JA-001', seamName: 'Seam-I', topDepth: 42.5, bottomDepth: 45.8, thickness_m: 3.3, ash_pct: 18.2, moisture_pct: 5.1, gcv_kcal_kg: 5820, sulphur_pct: 0.42 },
  { id: 'SI-002', boreholeId: 'BH-JA-001', seamName: 'Seam-II', topDepth: 78.3, bottomDepth: 84.1, thickness_m: 5.8, ash_pct: 22.5, moisture_pct: 4.8, gcv_kcal_kg: 5340, sulphur_pct: 0.38 },
  { id: 'SI-003', boreholeId: 'BH-JA-001', seamName: 'Seam-III', topDepth: 125.6, bottomDepth: 133.2, thickness_m: 7.6, ash_pct: 19.8, moisture_pct: 5.5, gcv_kcal_kg: 5650, sulphur_pct: 0.45 },
  { id: 'SI-004', boreholeId: 'BH-JA-001', seamName: 'Seam-IV', topDepth: 198.4, bottomDepth: 202.9, thickness_m: 4.5, ash_pct: 25.3, moisture_pct: 4.2, gcv_kcal_kg: 4980, sulphur_pct: 0.51 },
  { id: 'SI-005', boreholeId: 'BH-JA-001', seamName: 'Seam-V', topDepth: 252.1, bottomDepth: 258.7, thickness_m: 6.6, ash_pct: 21.1, moisture_pct: 4.6, gcv_kcal_kg: 5420, sulphur_pct: 0.39 },
  
  // JA-002 seams
  { id: 'SI-006', boreholeId: 'BH-JA-002', seamName: 'Seam-I', topDepth: 45.2, bottomDepth: 48.1, thickness_m: 2.9, ash_pct: 17.8, moisture_pct: 5.3, gcv_kcal_kg: 5890, sulphur_pct: 0.40 },
  { id: 'SI-007', boreholeId: 'BH-JA-002', seamName: 'Seam-II', topDepth: 82.7, bottomDepth: 89.3, thickness_m: 6.6, ash_pct: 23.1, moisture_pct: 4.5, gcv_kcal_kg: 5280, sulphur_pct: 0.36 },
  { id: 'SI-008', boreholeId: 'BH-JA-002', seamName: 'Seam-III', topDepth: 132.4, bottomDepth: 141.8, thickness_m: 9.4, ash_pct: 20.5, moisture_pct: 5.2, gcv_kcal_kg: 5580, sulphur_pct: 0.44 },
  { id: 'SI-009', boreholeId: 'BH-JA-002', seamName: 'Seam-IV', topDepth: 205.8, bottomDepth: 210.6, thickness_m: 4.8, ash_pct: 26.2, moisture_pct: 4.0, gcv_kcal_kg: 4850, sulphur_pct: 0.53 },
  { id: 'SI-010', boreholeId: 'BH-JA-002', seamName: 'Seam-V', topDepth: 260.3, bottomDepth: 267.9, thickness_m: 7.6, ash_pct: 22.4, moisture_pct: 4.4, gcv_kcal_kg: 5310, sulphur_pct: 0.41 },

  // JA-003 seams
  { id: 'SI-011', boreholeId: 'BH-JA-003', seamName: 'Seam-I', topDepth: 40.8, bottomDepth: 44.5, thickness_m: 3.7, ash_pct: 16.9, moisture_pct: 5.4, gcv_kcal_kg: 5950, sulphur_pct: 0.38 },
  { id: 'SI-012', boreholeId: 'BH-JA-003', seamName: 'Seam-II', topDepth: 75.2, bottomDepth: 80.6, thickness_m: 5.4, ash_pct: 21.8, moisture_pct: 4.9, gcv_kcal_kg: 5410, sulphur_pct: 0.35 },
  { id: 'SI-013', boreholeId: 'BH-JA-003', seamName: 'Seam-III', topDepth: 118.9, bottomDepth: 128.3, thickness_m: 9.4, ash_pct: 19.2, moisture_pct: 5.6, gcv_kcal_kg: 5720, sulphur_pct: 0.47 },

  // TC-001 seams (Talcher - thick seams typical)
  { id: 'SI-014', boreholeId: 'BH-TC-001', seamName: 'Lajkura Seam', topDepth: 56.3, bottomDepth: 62.8, thickness_m: 6.5, ash_pct: 28.4, moisture_pct: 8.2, gcv_kcal_kg: 4120, sulphur_pct: 0.25 },
  { id: 'SI-015', boreholeId: 'BH-TC-001', seamName: 'Ib Seam', topDepth: 98.7, bottomDepth: 110.2, thickness_m: 11.5, ash_pct: 32.1, moisture_pct: 9.1, gcv_kcal_kg: 3680, sulphur_pct: 0.22 },
  { id: 'SI-016', boreholeId: 'BH-TC-001', seamName: 'Parkhani Seam', topDepth: 165.4, bottomDepth: 178.9, thickness_m: 13.5, ash_pct: 30.5, moisture_pct: 8.8, gcv_kcal_kg: 3890, sulphur_pct: 0.28 },
  { id: 'SI-017', boreholeId: 'BH-TC-001', seamName: 'Rampur Seam', topDepth: 234.8, bottomDepth: 245.3, thickness_m: 10.5, ash_pct: 35.2, moisture_pct: 7.5, gcv_kcal_kg: 3450, sulphur_pct: 0.31 },
  { id: 'SI-018', boreholeId: 'BH-TC-001', seamName: 'Talcher Seam', topDepth: 298.5, bottomDepth: 312.8, thickness_m: 14.3, ash_pct: 33.8, moisture_pct: 8.5, gcv_kcal_kg: 3560, sulphur_pct: 0.26 },

  // TC-002 seams
  { id: 'SI-019', boreholeId: 'BH-TC-002', seamName: 'Lajkura Seam', topDepth: 58.1, bottomDepth: 65.3, thickness_m: 7.2, ash_pct: 27.9, moisture_pct: 8.5, gcv_kcal_kg: 4180, sulphur_pct: 0.24 },
  { id: 'SI-020', boreholeId: 'BH-TC-002', seamName: 'Ib Seam', topDepth: 102.4, bottomDepth: 114.8, thickness_m: 12.4, ash_pct: 31.5, moisture_pct: 9.3, gcv_kcal_kg: 3720, sulphur_pct: 0.21 },
  { id: 'SI-021', boreholeId: 'BH-TC-002', seamName: 'Parkhani Seam', topDepth: 170.2, bottomDepth: 184.5, thickness_m: 14.3, ash_pct: 29.8, moisture_pct: 8.6, gcv_kcal_kg: 3950, sulphur_pct: 0.27 },

  // KB-001 seams (Korba)
  { id: 'SI-022', boreholeId: 'BH-KB-001', seamName: 'Top Seam', topDepth: 35.2, bottomDepth: 39.8, thickness_m: 4.6, ash_pct: 24.5, moisture_pct: 7.2, gcv_kcal_kg: 4560, sulphur_pct: 0.32 },
  { id: 'SI-023', boreholeId: 'BH-KB-001', seamName: 'Middle Seam', topDepth: 88.4, bottomDepth: 96.2, thickness_m: 7.8, ash_pct: 26.8, moisture_pct: 6.8, gcv_kcal_kg: 4280, sulphur_pct: 0.35 },
  { id: 'SI-024', boreholeId: 'BH-KB-001', seamName: 'Bottom Seam', topDepth: 168.5, bottomDepth: 180.3, thickness_m: 11.8, ash_pct: 29.4, moisture_pct: 7.5, gcv_kcal_kg: 3980, sulphur_pct: 0.29 },

  // SG-001 seams (Singrauli)
  { id: 'SI-025', boreholeId: 'BH-SG-001', seamName: 'Purewa Seam', topDepth: 28.5, bottomDepth: 42.8, thickness_m: 14.3, ash_pct: 35.6, moisture_pct: 6.2, gcv_kcal_kg: 3380, sulphur_pct: 0.28 },
  { id: 'SI-026', boreholeId: 'BH-SG-001', seamName: 'Turra Seam', topDepth: 72.3, bottomDepth: 95.6, thickness_m: 23.3, ash_pct: 38.2, moisture_pct: 5.8, gcv_kcal_kg: 3120, sulphur_pct: 0.34 },
  { id: 'SI-027', boreholeId: 'BH-SG-001', seamName: 'Jhingurdah Seam', topDepth: 128.4, bottomDepth: 148.2, thickness_m: 19.8, ash_pct: 36.5, moisture_pct: 6.5, gcv_kcal_kg: 3280, sulphur_pct: 0.31 }
];

// Reserve estimates by mine block
const RESERVE_ESTIMATES = [
  { id: 'RE-001', blockId: 'BK-001', seamName: 'All Seams', category: 'Proved', tonnage_MT: 148, method: 'Kriging', confidence: 0.92, generatedBy: 'ML' },
  { id: 'RE-002', blockId: 'BK-001', seamName: 'All Seams', category: 'Indicated', tonnage_MT: 62, method: 'IDW', confidence: 0.78, generatedBy: 'ML' },
  { id: 'RE-003', blockId: 'BK-001', seamName: 'All Seams', category: 'Inferred', tonnage_MT: 35, method: 'Polygonal', confidence: 0.55, generatedBy: 'Manual' },
  { id: 'RE-004', blockId: 'BK-003', seamName: 'All Seams', category: 'Proved', tonnage_MT: 312, method: 'Kriging', confidence: 0.95, generatedBy: 'ML' },
  { id: 'RE-005', blockId: 'BK-003', seamName: 'All Seams', category: 'Indicated', tonnage_MT: 145, method: 'Kriging', confidence: 0.82, generatedBy: 'ML' },
  { id: 'RE-006', blockId: 'BK-003', seamName: 'All Seams', category: 'Inferred', tonnage_MT: 63, method: 'IDW', confidence: 0.58, generatedBy: 'ML' },
  { id: 'RE-007', blockId: 'BK-005', seamName: 'All Seams', category: 'Proved', tonnage_MT: 780, method: 'Kriging', confidence: 0.96, generatedBy: 'ML' },
  { id: 'RE-008', blockId: 'BK-005', seamName: 'All Seams', category: 'Indicated', tonnage_MT: 320, method: 'Kriging', confidence: 0.85, generatedBy: 'ML' },
  { id: 'RE-009', blockId: 'BK-005', seamName: 'All Seams', category: 'Inferred', tonnage_MT: 150, method: 'IDW', confidence: 0.62, generatedBy: 'ML' },
  { id: 'RE-010', blockId: 'BK-007', seamName: 'All Seams', category: 'Proved', tonnage_MT: 415, method: 'Kriging', confidence: 0.93, generatedBy: 'ML' },
  { id: 'RE-011', blockId: 'BK-007', seamName: 'All Seams', category: 'Indicated', tonnage_MT: 178, method: 'IDW', confidence: 0.80, generatedBy: 'ML' },
  { id: 'RE-012', blockId: 'BK-007', seamName: 'All Seams', category: 'Inferred', tonnage_MT: 87, method: 'Polygonal', confidence: 0.52, generatedBy: 'Manual' },
  { id: 'RE-013', blockId: 'BK-009', seamName: 'All Seams', category: 'Proved', tonnage_MT: 590, method: 'Kriging', confidence: 0.94, generatedBy: 'ML' },
  { id: 'RE-014', blockId: 'BK-009', seamName: 'All Seams', category: 'Indicated', tonnage_MT: 245, method: 'Kriging', confidence: 0.83, generatedBy: 'ML' },
  { id: 'RE-015', blockId: 'BK-009', seamName: 'All Seams', category: 'Inferred', tonnage_MT: 125, method: 'IDW', confidence: 0.60, generatedBy: 'ML' }
];

// Risk assessment data
const RISK_ASSESSMENTS = [
  { blockId: 'BK-001', riskType: 'Water Ingress', riskScore: 72, riskLevel: 'High', details: 'Shallow aquifer detected at 35m depth. Multiple old workings in vicinity.' },
  { blockId: 'BK-001', riskType: 'Gas Emission', riskScore: 85, riskLevel: 'Critical', details: 'Degree II gassiness. CH4 levels 1.2-2.8% in underground workings.' },
  { blockId: 'BK-001', riskType: 'Subsidence', riskScore: 68, riskLevel: 'High', details: 'Active fire zone detected in adjacent blocks. Subsidence cracks observed.' },
  { blockId: 'BK-003', riskType: 'Water Ingress', riskScore: 35, riskLevel: 'Low', details: 'Well-drained terrain. No significant aquifer interference.' },
  { blockId: 'BK-003', riskType: 'Gas Emission', riskScore: 22, riskLevel: 'Low', details: 'Degree I gassiness. Safe working conditions.' },
  { blockId: 'BK-005', riskType: 'Water Ingress', riskScore: 48, riskLevel: 'Medium', details: 'Seasonal water table rise during monsoon. Dewatering plan in place.' },
  { blockId: 'BK-005', riskType: 'Subsidence', riskScore: 28, riskLevel: 'Low', details: 'Stable overburden. No previous subsidence history.' },
  { blockId: 'BK-007', riskType: 'Water Ingress', riskScore: 55, riskLevel: 'Medium', details: 'Hasdeo river proximity. Seasonal flooding risk.' },
  { blockId: 'BK-007', riskType: 'Gas Emission', riskScore: 42, riskLevel: 'Medium', details: 'Moderate methane readings. Ventilation adequate.' },
  { blockId: 'BK-009', riskType: 'Water Ingress', riskScore: 30, riskLevel: 'Low', details: 'Dry zone. Minimal groundwater interference.' }
];
