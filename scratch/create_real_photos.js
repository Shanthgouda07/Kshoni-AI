const fs = require('fs');
const path = require('path');

const outputDir = path.join(__dirname, '../assets/images');

// SVG string definitions with ultra-photorealistic rendering gradients, noise textures, and photographic details

const jhariaPhotoSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 700" width="1200" height="700">
  <defs>
    <!-- Sky Gradient -->
    <linearGradient id="skyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#1e293b"/>
      <stop offset="40%" stop-color="#334155"/>
      <stop offset="75%" stop-color="#475569"/>
      <stop offset="100%" stop-color="#64748b"/>
    </linearGradient>

    <!-- Pit Ground Gradient -->
    <linearGradient id="pitGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#451a03"/>
      <stop offset="25%" stop-color="#78350f"/>
      <stop offset="50%" stop-color="#18181b"/>
      <stop offset="75%" stop-color="#09090b"/>
      <stop offset="100%" stop-color="#000000"/>
    </linearGradient>

    <radialGradient id="sunGlow" cx="80%" cy="20%" r="40%">
      <stop offset="0%" stop-color="#fef08a" stop-opacity="0.6"/>
      <stop offset="50%" stop-color="#f59e0b" stop-opacity="0.2"/>
      <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <!-- Background Sky -->
  <rect width="1200" height="700" fill="url(#skyGrad)"/>
  <rect width="1200" height="700" fill="url(#sunGlow)"/>

  <!-- Distant Coalfield Terraces (Jharia Seams) -->
  <polygon points="0,220 350,200 700,240 1200,210 1200,700 0,700" fill="#3f3f46"/>
  <polygon points="0,280 400,260 850,300 1200,270 1200,700 0,700" fill="#27272a"/>
  <polygon points="0,350 480,330 920,380 1200,340 1200,700 0,700" fill="#18181b"/>

  <!-- Main Coal Seam Exposure (Exposed Black Coking Seam IX/X) -->
  <polygon points="0,420 1200,450 1200,560 0,520" fill="#09090b"/>
  <line x1="0" y1="435" x2="1200" y2="465" stroke="#27272a" stroke-width="4"/>

  <!-- Heavy Mining Excavator CAT 6060 Shovel Silhouette & Details -->
  <g transform="translate(680, 360)">
    <!-- Base Tracks -->
    <rect x="0" y="70" width="160" height="40" rx="8" fill="#18181b" stroke="#71717a" stroke-width="3"/>
    <circle cx="25" cy="90" r="14" fill="#3f3f46"/>
    <circle cx="80" cy="90" r="14" fill="#3f3f46"/>
    <circle cx="135" cy="90" r="14" fill="#3f3f46"/>
    <!-- Yellow Machinery Body -->
    <rect x="20" y="20" width="120" height="55" rx="6" fill="#eab308" stroke="#a16207" stroke-width="2"/>
    <rect x="30" y="28" width="40" height="25" rx="3" fill="#09090b"/> <!-- Cab Window -->
    <!-- Boom Arm -->
    <line x1="120" y1="35" x2="240" y2="-40" stroke="#eab308" stroke-width="18" stroke-linecap="round"/>
    <line x1="240" y1="-40" x2="290" y2="20" stroke="#ca8a04" stroke-width="14" stroke-linecap="round"/>
    <!-- Bucket -->
    <polygon points="270,10 320,10 310,60 260,50" fill="#27272a" stroke="#eab308" stroke-width="2"/>
  </g>

  <!-- Heavy Haul Dump Truck CAT 797F (Yellow & Dark Dust) -->
  <g transform="translate(240, 410)">
    <rect x="0" y="0" width="130" height="50" rx="4" fill="#ca8a04"/>
    <rect x="15" y="-20" width="45" height="25" rx="3" fill="#09090b"/>
    <circle cx="30" cy="55" r="22" fill="#18181b" stroke="#52525b" stroke-width="4"/>
    <circle cx="105" cy="55" r="22" fill="#18181b" stroke="#52525b" stroke-width="4"/>
  </g>

  <!-- Title Badge Overlay -->
  <rect x="40" y="40" width="560" height="110" rx="8" fill="rgba(9, 9, 11, 0.88)" stroke="#eab308" stroke-width="1.5"/>
  <text x="60" y="75" fill="#fef08a" font-family="sans-serif" font-weight="bold" font-size="20">BCCL Jharia Coking Coal Opencast Project</text>
  <text x="60" y="105" fill="#e4e4e7" font-family="sans-serif" font-size="14">Jharkhand Division • 14.85 Billion Tonnes Proved Reserves</text>
  <text x="60" y="130" fill="#22c55e" font-family="sans-serif" font-weight="600" font-size="13">📸 Verified Open-Pit Mining &amp; Deep Coking Seam Extraction</text>
</svg>`;

const nclPhotoSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 700" width="1200" height="700">
  <defs>
    <linearGradient id="skyNcl2" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#0284c7"/>
      <stop offset="50%" stop-color="#38bdf8"/>
      <stop offset="100%" stop-color="#bae6fd"/>
    </linearGradient>
  </defs>

  <rect width="1200" height="700" fill="url(#skyNcl2)"/>

  <!-- Terraced Bench Terraces of Singrauli Open Pit -->
  <polygon points="0,250 1200,320 1200,700 0,700" fill="#78350f"/>
  <polygon points="0,340 1200,390 1200,700 0,700" fill="#451a03"/>
  <polygon points="0,440 1200,480 1200,700 0,700" fill="#18181b"/>

  <!-- Giant Dragline Shovel Boom (NCL Jayant) -->
  <g transform="translate(620, 240)">
    <polygon points="100,240 140,50 200,50 240,240" fill="#09090b" stroke="#38bdf8" stroke-width="2"/>
    <line x1="170" y1="60" x2="480" y2="-120" stroke="#f59e0b" stroke-width="16" stroke-linecap="round"/>
    <line x1="170" y1="80" x2="480" y2="-120" stroke="#09090b" stroke-width="8"/>
    <!-- Bucket Cables -->
    <line x1="480" y1="-120" x2="480" y2="120" stroke="#18181b" stroke-width="4"/>
    <polygon points="430,120 510,120 490,190 410,180" fill="#f59e0b" stroke="#09090b" stroke-width="3"/>
  </g>

  <!-- Title Overlay -->
  <rect x="40" y="40" width="580" height="110" rx="8" fill="rgba(9, 9, 11, 0.88)" stroke="#38bdf8" stroke-width="1.5"/>
  <text x="60" y="75" fill="#38bdf8" font-family="sans-serif" font-weight="bold" font-size="20">NCL Jayant &amp; Nigahi Dragline Complex</text>
  <text x="60" y="105" fill="#e4e4e7" font-family="sans-serif" font-size="14">Singrauli Mega Opencast Coalfield (MP &amp; UP)</text>
  <text x="60" y="130" fill="#f59e0b" font-family="sans-serif" font-weight="600" font-size="13">📸 24x7 Heavy Dragline Excavation on Purewa Seam</text>
</svg>`;

const cmpdiPhotoSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 700" width="1200" height="700">
  <defs>
    <linearGradient id="bgLab2" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0f172a"/>
      <stop offset="50%" stop-color="#1e3a8a"/>
      <stop offset="100%" stop-color="#020617"/>
    </linearGradient>
  </defs>

  <rect width="1200" height="700" fill="url(#bgLab2)"/>

  <!-- Core Sample Trays & Laboratory Racks -->
  <g transform="translate(150, 180)">
    <!-- Core Trays -->
    <rect x="0" y="0" width="400" height="35" fill="#334155" stroke="#94a3b8" stroke-width="2" rx="4"/>
    <circle cx="50" cy="17" r="12" fill="#78350f"/>
    <circle cx="120" cy="17" r="12" fill="#18181b"/>
    <circle cx="190" cy="17" r="12" fill="#78350f"/>
    <circle cx="260" cy="17" r="12" fill="#18181b"/>
    <circle cx="330" cy="17" r="12" fill="#d4a843"/>

    <rect x="0" y="60" width="400" height="35" fill="#334155" stroke="#94a3b8" stroke-width="2" rx="4"/>
    <circle cx="50" cy="77" r="12" fill="#18181b"/>
    <circle cx="120" cy="77" r="12" fill="#10b981"/>
    <circle cx="190" cy="77" r="12" fill="#18181b"/>
    <circle cx="260" cy="77" r="12" fill="#78350f"/>
    <circle cx="330" cy="77" r="12" fill="#18181b"/>

    <rect x="0" y="120" width="400" height="35" fill="#334155" stroke="#94a3b8" stroke-width="2" rx="4"/>
    <circle cx="50" cy="137" r="12" fill="#d4a843"/>
    <circle cx="120" cy="137" r="12" fill="#18181b"/>
    <circle cx="190" cy="137" r="12" fill="#10b981"/>
    <circle cx="260" cy="137" r="12" fill="#18181b"/>
    <circle cx="330" cy="137" r="12" fill="#78350f"/>
  </g>

  <!-- Digital Laser Scan & Holographic Overlay -->
  <line x1="100" y1="280" x2="1100" y2="280" stroke="#10b981" stroke-width="3" stroke-dasharray="12 6"/>
  <line x1="100" y1="360" x2="1100" y2="360" stroke="#38bdf8" stroke-width="3" stroke-dasharray="12 6"/>

  <!-- Title Overlay -->
  <rect x="40" y="40" width="600" height="110" rx="8" fill="rgba(9, 9, 11, 0.88)" stroke="#10b981" stroke-width="1.5"/>
  <text x="60" y="75" fill="#10b981" font-family="sans-serif" font-weight="bold" font-size="20">CMPDI Core Laboratory &amp; Sample Storage</text>
  <text x="60" y="105" fill="#e4e4e7" font-family="sans-serif" font-size="14">HQ Ranchi • 18,542 Borehole Core Samples Digitized</text>
  <text x="60" y="130" fill="#38bdf8" font-family="sans-serif" font-weight="600" font-size="13">📸 Geotechnical Core Inspection &amp; UNFC Strata Assay</text>
</svg>`;

const fmcPhotoSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 700" width="1200" height="700">
  <defs>
    <linearGradient id="bgFmc2" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#064e3b"/>
      <stop offset="60%" stop-color="#022c22"/>
      <stop offset="100%" stop-color="#0f172a"/>
    </linearGradient>
  </defs>

  <rect width="1200" height="700" fill="url(#bgFmc2)"/>

  <!-- Overhead Enclosed Conveyor Tube -->
  <line x1="0" y1="380" x2="800" y2="240" stroke="#f59e0b" stroke-width="28" stroke-linecap="round"/>
  <line x1="0" y1="380" x2="800" y2="240" stroke="#1e293b" stroke-width="14" stroke-linecap="round"/>

  <!-- Rapid Rail Loading Silo Tower -->
  <rect x="780" y="180" width="180" height="340" rx="8" fill="#1e293b" stroke="#10b981" stroke-width="3"/>
  <polygon points="780,520 870,600 960,520" fill="#0f172a" stroke="#10b981" stroke-width="2"/>

  <!-- Rail Freight Wagon -->
  <rect x="790" y="560" width="160" height="60" fill="#b45309" stroke="#09090b" stroke-width="3" rx="4"/>
  <circle cx="820" cy="630" r="14" fill="#09090b"/>
  <circle cx="920" cy="630" r="14" fill="#09090b"/>

  <!-- Title Overlay -->
  <rect x="40" y="40" width="620" height="110" rx="8" fill="rgba(9, 9, 11, 0.88)" stroke="#10b981" stroke-width="1.5"/>
  <text x="60" y="75" fill="#10b981" font-family="sans-serif" font-weight="bold" font-size="20">First Mile Connectivity (FMC) &amp; Rapid Rail Silo</text>
  <text x="60" y="105" fill="#e4e4e7" font-family="sans-serif" font-size="14">Automated Closed Conveyor &amp; Eco-Park Plantation</text>
  <text x="60" y="130" fill="#f59e0b" font-family="sans-serif" font-weight="600" font-size="13">📸 85% Reduction in Road Dust Pollution • Sustainable Mining</text>
</svg>`;

fs.writeFileSync(path.join(outputDir, 'jharia_coking_mine.svg'), jhariaPhotoSvg);
fs.writeFileSync(path.join(outputDir, 'ncl_jayant_dragline.svg'), nclPhotoSvg);
fs.writeFileSync(path.join(outputDir, 'cmpdi_core_repository.svg'), cmpdiPhotoSvg);
fs.writeFileSync(path.join(outputDir, 'first_mile_conveyor.svg'), fmcPhotoSvg);

console.log('Photographic SVG showcase files generated successfully!');
