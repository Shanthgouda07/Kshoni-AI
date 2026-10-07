const fs = require('fs');
const path = require('path');

const outputDir = path.join(__dirname, '../assets/images');

// Slide 5: CMPDI Geological Core Laboratory (Real Photo Style)
const realCoreLabSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 700" width="1200" height="700">
  <defs>
    <!-- Realistic Laboratory Lighting -->
    <linearGradient id="labBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0f172a"/>
      <stop offset="40%" stop-color="#1e293b"/>
      <stop offset="80%" stop-color="#334155"/>
      <stop offset="100%" stop-color="#0f172a"/>
    </linearGradient>

    <radialGradient id="fluorescentGlow" cx="50%" cy="10%" r="70%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.25"/>
      <stop offset="60%" stop-color="#38bdf8" stop-opacity="0.05"/>
      <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
    </radialGradient>

    <linearGradient id="woodTray" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#78350f"/>
      <stop offset="50%" stop-color="#451a03"/>
      <stop offset="100%" stop-color="#270e02"/>
    </linearGradient>
  </defs>

  <!-- Background Lab Room -->
  <rect width="1200" height="700" fill="url(#labBg)"/>
  <rect width="1200" height="700" fill="url(#fluorescentGlow)"/>

  <!-- Fluorescent Overhead Ceiling Lights -->
  <rect x="200" y="20" width="800" height="15" fill="#fef08a" opacity="0.8" rx="4"/>
  <line x1="200" y1="28" x2="1000" y2="28" stroke="#ffffff" stroke-width="4"/>

  <!-- Laboratory Storage Racks & Core Sample Wooden Trays -->
  <g transform="translate(100, 160)">
    <!-- Shelf 1 -->
    <rect x="0" y="0" width="1000" height="120" fill="url(#woodTray)" stroke="#92400e" stroke-width="4" rx="6"/>
    <!-- Core Cylinders (Grey Shale, Dark Coal, Sandstone, Basalt) -->
    <rect x="20" y="20" width="960" height="22" rx="11" fill="#18181b" stroke="#3f3f46" stroke-width="2"/>
    <rect x="20" y="50" width="960" height="22" rx="11" fill="#71717a" stroke="#a1a1aa" stroke-width="2"/>
    <rect x="20" y="80" width="960" height="22" rx="11" fill="#09090b" stroke="#27272a" stroke-width="2"/>
    <!-- Depth Interval Labels on Trays -->
    <rect x="30" y="22" width="120" height="18" fill="#fef08a" rx="2"/>
    <text x="35" y="35" font-family="sans-serif" font-size="10" font-weight="bold" fill="#000">BH-402: 120.5m-124m</text>

    <!-- Shelf 2 -->
    <g transform="translate(0, 150)">
      <rect x="0" y="0" width="1000" height="120" fill="url(#woodTray)" stroke="#92400e" stroke-width="4" rx="6"/>
      <rect x="20" y="20" width="960" height="22" rx="11" fill="#09090b" stroke="#27272a" stroke-width="2"/>
      <rect x="20" y="50" width="960" height="22" rx="11" fill="#3f3f46" stroke="#71717a" stroke-width="2"/>
      <rect x="20" y="80" width="960" height="22" rx="11" fill="#18181b" stroke="#3f3f46" stroke-width="2"/>
      <rect x="30" y="22" width="120" height="18" fill="#fef08a" rx="2"/>
      <text x="35" y="35" font-family="sans-serif" font-size="10" font-weight="bold" fill="#000">BH-402: 124m-128m</text>
    </g>

    <!-- Shelf 3 -->
    <g transform="translate(0, 300)">
      <rect x="0" y="0" width="1000" height="120" fill="url(#woodTray)" stroke="#92400e" stroke-width="4" rx="6"/>
      <rect x="20" y="20" width="960" height="22" rx="11" fill="#71717a" stroke="#a1a1aa" stroke-width="2"/>
      <rect x="20" y="50" width="960" height="22" rx="11" fill="#09090b" stroke="#27272a" stroke-width="2"/>
      <rect x="20" y="80" width="960" height="22" rx="11" fill="#18181b" stroke="#3f3f46" stroke-width="2"/>
    </g>
  </g>

  <!-- Geologist Silhouette Holding Lens & Digital Caliper -->
  <g transform="translate(820, 240)">
    <!-- White Lab Coat & Safety Vest -->
    <path d="M0,180 Q60,110 120,180 L120,380 L0,380 Z" fill="#f8fafc"/>
    <path d="M20,180 L50,180 L50,380 L20,380 Z" fill="#ea580c"/> <!-- High Viz Strip -->
    <!-- Yellow Safety Hardhat -->
    <path d="M30,110 Q60,70 90,110 Z" fill="#eab308" stroke="#ca8a04" stroke-width="3"/>
    <rect x="20" y="108" width="80" height="10" rx="3" fill="#eab308"/>
  </g>

  <!-- Title Banner Overlay -->
  <rect x="40" y="40" width="610" height="110" rx="8" fill="rgba(15, 23, 42, 0.92)" stroke="#10b981" stroke-width="1.5"/>
  <text x="60" y="75" fill="#10b981" font-family="sans-serif" font-weight="bold" font-size="20">CMPDI Geological Core Sample Repository</text>
  <text x="60" y="105" fill="#e2e8f0" font-family="sans-serif" font-size="14">Central Core Laboratory • CMPDI HQ Ranchi, Jharkhand</text>
  <text x="60" y="130" fill="#38bdf8" font-family="sans-serif" font-weight="600" font-size="13">📸 Verified Geological Core Inspection &amp; Strata Analysis</text>
</svg>`;

// Slide 6: First Mile Connectivity Silo & Eco-Park (Real Photo Style)
const realRailSiloSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 700" width="1200" height="700">
  <defs>
    <linearGradient id="skyEco" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#0284c7"/>
      <stop offset="50%" stop-color="#38bdf8"/>
      <stop offset="100%" stop-color="#bae6fd"/>
    </linearGradient>

    <linearGradient id="siloMetal" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#334155"/>
      <stop offset="30%" stop-color="#64748b"/>
      <stop offset="70%" stop-color="#94a3b8"/>
      <stop offset="100%" stop-color="#334155"/>
    </linearGradient>
  </defs>

  <rect width="1200" height="700" fill="url(#skyEco)"/>

  <!-- Reclaimed Green Eco-Park Hills & Forest Trees -->
  <path d="M0,450 Q350,380 700,460 Q1050,520 1200,440 L1200,700 L0,700 Z" fill="#15803d"/>
  <path d="M0,520 Q450,470 900,530 L1200,500 L1200,700 L0,700 Z" fill="#166534"/>

  <!-- Forest Canopy Trees -->
  <circle cx="150" cy="460" r="40" fill="#14532d"/>
  <circle cx="220" cy="440" r="50" fill="#166534"/>
  <circle cx="300" cy="470" r="45" fill="#15803d"/>
  <circle cx="420" cy="450" r="55" fill="#166534"/>

  <!-- Rapid Rail Loading Silo Tower (Concrete & Steel Structure) -->
  <g transform="translate(750, 160)">
    <rect x="0" y="0" width="220" height="380" rx="12" fill="url(#siloMetal)" stroke="#0f172a" stroke-width="3"/>
    <!-- Silo Hoppers -->
    <polygon points="0,380 110,470 220,380" fill="#1e293b" stroke="#0f172a" stroke-width="3"/>
    <!-- Indian Railways Freight Train Wagons under Silo -->
    <rect x="-40" y="440" width="300" height="65" rx="4" fill="#b45309" stroke="#000" stroke-width="3"/>
    <text x="50" y="480" font-family="sans-serif" font-weight="bold" font-size="16" fill="#fef08a">INDIAN RAILWAYS COAL BOXN</text>
    <circle cx="-10" cy="515" r="14" fill="#18181b"/>
    <circle cx="50" cy="515" r="14" fill="#18181b"/>
    <circle cx="170" cy="515" r="14" fill="#18181b"/>
    <circle cx="230" cy="515" r="14" fill="#18181b"/>
  </g>

  <!-- Long Overhead Pipe Conveyor Bridge (Overland Conveyor) -->
  <line x1="0" y1="360" x2="750" y2="240" stroke="#f59e0b" stroke-width="32" stroke-linecap="round"/>
  <line x1="0" y1="360" x2="750" y2="240" stroke="#1e293b" stroke-width="16" stroke-linecap="round"/>
  <line x1="0" y1="360" x2="750" y2="240" stroke="#ffffff" stroke-width="2" stroke-dasharray="20 10"/>

  <!-- Title Banner Overlay -->
  <rect x="40" y="40" width="630" height="110" rx="8" fill="rgba(9, 9, 11, 0.88)" stroke="#10b981" stroke-width="1.5"/>
  <text x="60" y="75" fill="#10b981" font-family="sans-serif" font-weight="bold" font-size="20">First Mile Connectivity (FMC) &amp; Rapid Rail Silo</text>
  <text x="60" y="105" fill="#e4e4e7" font-family="sans-serif" font-size="14">Automated Closed Overland Conveyor &amp; Reclaimed Eco-Park</text>
  <text x="60" y="130" fill="#f59e0b" font-family="sans-serif" font-weight="600" font-size="13">📸 85% Reduction in Road Dust • Net-Zero Sustainable Mining</text>
</svg>`;

fs.writeFileSync(path.join(outputDir, 'real_core_lab.svg'), realCoreLabSvg);
fs.writeFileSync(path.join(outputDir, 'real_rail_silo.svg'), realRailSiloSvg);

console.log('Real photo SVGs for last 2 slides generated successfully!');
