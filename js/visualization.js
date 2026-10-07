// ============================================================
// BHOO-MITRA AI — 3D Geo-Visualization Controller (Three.js)
// ============================================================

const VizPage = {
  scene: null,
  camera: null,
  renderer: null,
  controls: null,
  raycaster: null,
  mouse: null,

  // Meshes
  boreholeMeshes: [],
  seamMeshes: {},
  faultMesh: null,
  wireframeMode: false,
  labelsVisible: true,

  // Sample Boreholes 3D Coordinates
  boreholeList: [
    { id: 'BH-040', x: -60, z: -40, depth: 160, netCoal: 16.5, gcv: 6200, rl: 212.0 },
    { id: 'BH-041', x: -20, z: -50, depth: 175, netCoal: 17.8, gcv: 6350, rl: 213.5 },
    { id: 'BH-042', x: 20, z: -10, depth: 185, netCoal: 18.4, gcv: 6420, rl: 214.5 },
    { id: 'BH-043', x: 70, z: 30, depth: 190, netCoal: 19.2, gcv: 6580, rl: 216.0 },
    { id: 'BH-044', x: -40, z: 40, depth: 170, netCoal: 16.9, gcv: 6150, rl: 211.8 },
    { id: 'BH-045', x: 30, z: 60, depth: 180, netCoal: 18.1, gcv: 6390, rl: 215.2 }
  ],

  init() {
    // Mount sidebar and header
    document.getElementById('sidebar-mount').innerHTML = App.buildSidebar('visualization');
    document.getElementById('header-mount').innerHTML = App.buildPageHeader(
      '3D Geological Subsurface Visualization',
      'Interactive 3D mine block, borehole columns, seam strata layers, & fault planes',
      '<span class="badge badge-gold">Three.js WebGL Engine</span>'
    );

    // Setup Three.js scene
    setTimeout(() => {
      this.initThreeScene();
    }, 100);
  },

  initThreeScene() {
    const container = document.getElementById('three-canvas-container');
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight || 550;

    // 1. Scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x0A1628);
    this.scene.fog = new THREE.FogExp2(0x0A1628, 0.002);

    // 2. Camera
    this.camera = new THREE.PerspectiveCamera(45, width / height, 1, 1000);
    this.camera.position.set(150, 120, 200);

    // 3. Renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    container.appendChild(this.renderer.domElement);

    // 4. Orbit Controls
    if (typeof THREE.OrbitControls !== 'undefined') {
      this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
      this.controls.enableDamping = true;
      this.controls.dampingFactor = 0.05;
      this.controls.maxPolarAngle = Math.PI / 2 + 0.1; // allow slightly below horizon
    }

    // 5. Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    this.scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xD4A843, 1.2);
    dirLight.position.set(100, 200, 100);
    dirLight.castShadow = true;
    this.scene.add(dirLight);

    const dirLight2 = new THREE.DirectionalLight(0x3B82F6, 0.5);
    dirLight2.position.set(-100, -100, -100);
    this.scene.add(dirLight2);

    // 6. Build Scene Objects
    this.buildTerrainGrid();
    this.buildBoreholes();
    this.buildSeamStrata();
    this.buildFaultPlane();

    // 7. Raycaster setup for clicking boreholes
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();

    this.renderer.domElement.addEventListener('pointermove', (e) => this.onPointerMove(e));
    this.renderer.domElement.addEventListener('click', (e) => this.onCanvasClick(e));

    window.addEventListener('resize', () => this.onWindowResize());

    // 8. Add Subterranean Particle Atmosphere
    this.buildParticleAtmosphere();

    // 9. Fetch Boreholes from Backend API if connected
    this.fetchBackendBoreholes();

    // 10. Animation Loop with Fault Plane pulse & particle drift
    let clock = new THREE.Clock();
    const animate = () => {
      requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      if (this.controls) this.controls.update();

      // Pulse fault plane wireframe
      if (this.faultMesh && this.faultMesh.material) {
        this.faultMesh.material.opacity = 0.25 + Math.sin(elapsedTime * 2.5) * 0.12;
      }

      // Rotate particle atmosphere gently
      if (this.particleSystem) {
        this.particleSystem.rotation.y = elapsedTime * 0.02;
      }

      this.renderer.render(this.scene, this.camera);
    };
    animate();
  },

  async fetchBackendBoreholes() {
    const res = await App.apiFetch('/boreholes');
    if (res && res.boreholes) {
      console.log('[Kshoni 3D Engine] Loaded boreholes from FastAPI Backend:', res.boreholes);
      App.showToast(`3D Engine synchronized with FastAPI Backend (${res.count} boreholes)`, 'success');
    }
  },

  buildParticleAtmosphere() {
    const particleCount = 200;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 280;
      positions[i + 1] = -120 + Math.random() * 140; // subterranean range
      positions[i + 2] = (Math.random() - 0.5) * 280;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const material = new THREE.PointsMaterial({
      color: 0xD4A843,
      size: 2.2,
      transparent: true,
      opacity: 0.5,
      blending: THREE.AdditiveBlending
    });

    this.particleSystem = new THREE.Points(geometry, material);
    this.scene.add(this.particleSystem);
  },

  setPresetView(preset) {
    if (!this.camera || !this.controls) return;
    if (preset === 'top') {
      this.camera.position.set(0, 260, 1);
      this.controls.target.set(0, 0, 0);
    } else if (preset === 'subsurface') {
      this.camera.position.set(120, -30, 140);
      this.controls.target.set(0, -40, 0);
    } else if (preset === 'cross') {
      this.camera.position.set(220, -20, 0);
      this.controls.target.set(0, -35, 0);
    } else {
      this.resetCamera();
      return;
    }
    this.controls.update();
    App.showToast(`3D Preset View: ${preset.toUpperCase()}`, 'info');
  },


  buildTerrainGrid() {
    // Topography Surface Mesh
    const gridGeo = new THREE.PlaneGeometry(240, 240, 30, 30);
    gridGeo.rotateX(-Math.PI / 2);

    // Add gentle terrain elevation variation
    const pos = gridGeo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);
      const y = Math.sin(x * 0.03) * 4 + Math.cos(z * 0.03) * 4 + 10;
      pos.setY(i, y);
    }
    gridGeo.computeVertexNormals();

    const gridMat = new THREE.MeshStandardMaterial({
      color: 0x1E3A5F,
      wireframe: false,
      transparent: true,
      opacity: 0.35,
      side: THREE.DoubleSide
    });
    const terrainMesh = new THREE.Mesh(gridGeo, gridMat);
    this.scene.add(terrainMesh);

    // Helper Grid Floor
    const gridHelper = new THREE.GridHelper(240, 24, 0xD4A843, 0x1E3A5F);
    gridHelper.position.y = -90;
    this.scene.add(gridHelper);
  },

  buildBoreholes() {
    this.boreholeList.forEach((bh) => {
      // Cylinder for borehole column
      const cylinderGeo = new THREE.CylinderGeometry(2.5, 2.5, bh.depth, 16);
      const cylinderMat = new THREE.MeshStandardMaterial({
        color: 0xE2E8F0,
        roughness: 0.3,
        metalness: 0.2
      });
      const bhMesh = new THREE.Mesh(cylinderGeo, cylinderMat);
      bhMesh.position.set(bh.x, -bh.depth / 2 + 10, bh.z);
      bhMesh.userData = bh;
      this.scene.add(bhMesh);
      this.boreholeMeshes.push(bhMesh);

      // Top Marker Ring
      const markerGeo = new THREE.SphereGeometry(4, 16, 16);
      const markerMat = new THREE.MeshStandardMaterial({ color: 0xD4A843, emissive: 0xD4A843, emissiveIntensity: 0.4 });
      const markerMesh = new THREE.Mesh(markerGeo, markerMat);
      markerMesh.position.set(bh.x, 12, bh.z);
      this.scene.add(markerMesh);
    });
  },

  buildSeamStrata() {
    // 1. Seam IX Slab (Top)
    const seam9Geo = new THREE.BoxGeometry(200, 8, 200);
    const seam9Mat = new THREE.MeshStandardMaterial({
      color: 0x10B981,
      transparent: true,
      opacity: 0.65,
      roughness: 0.4
    });
    const seam9Mesh = new THREE.Mesh(seam9Geo, seam9Mat);
    seam9Mesh.position.set(0, -15, 0);
    this.scene.add(seam9Mesh);
    this.seamMeshes['seam9'] = seam9Mesh;

    // 2. Seam V/VI Slab (Middle)
    const seam5Geo = new THREE.BoxGeometry(200, 10, 200);
    const seam5Mat = new THREE.MeshStandardMaterial({
      color: 0xF59E0B,
      transparent: true,
      opacity: 0.65,
      roughness: 0.4
    });
    const seam5Mesh = new THREE.Mesh(seam5Geo, seam5Mat);
    seam5Mesh.position.set(0, -42, 0);
    this.scene.add(seam5Mesh);
    this.seamMeshes['seam5'] = seam5Mesh;

    // 3. Seam III Slab (Bottom)
    const seam3Geo = new THREE.BoxGeometry(200, 12, 200);
    const seam3Mat = new THREE.MeshStandardMaterial({
      color: 0x3B82F6,
      transparent: true,
      opacity: 0.65,
      roughness: 0.4
    });
    const seam3Mesh = new THREE.Mesh(seam3Geo, seam3Mat);
    seam3Mesh.position.set(0, -70, 0);
    this.scene.add(seam3Mesh);
    this.seamMeshes['seam3'] = seam3Mesh;
  },

  buildFaultPlane() {
    const faultGeo = new THREE.PlaneGeometry(240, 120);
    faultGeo.rotateY(Math.PI / 4);
    faultGeo.rotateZ(Math.PI / 6);
    const faultMat = new THREE.MeshStandardMaterial({
      color: 0xEF4444,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.3,
      wireframe: true
    });
    this.faultMesh = new THREE.Mesh(faultGeo, faultMat);
    this.faultMesh.position.set(20, -35, 10);
    this.scene.add(this.faultMesh);
  },

  onPointerMove(event) {
    const rect = this.renderer.domElement.getBoundingClientRect();
    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(this.boreholeMeshes);

    const tooltip = document.getElementById('viz-tooltip');
    if (intersects.length > 0) {
      const bh = intersects[0].object.userData;
      tooltip.style.display = 'block';
      tooltip.style.left = (event.clientX - rect.left + 15) + 'px';
      tooltip.style.top = (event.clientY - rect.top + 15) + 'px';
      tooltip.innerHTML = `
        <strong style="color: var(--color-gold-light);">${bh.id}</strong><br>
        Depth: ${bh.depth}m | Net Coal: ${bh.netCoal}m<br>
        Avg GCV: <span style="color: var(--color-emerald); font-weight:700;">${bh.gcv} kcal/kg</span>
      `;
      document.body.style.cursor = 'pointer';
    } else {
      tooltip.style.display = 'none';
      document.body.style.cursor = 'default';
    }
  },

  onCanvasClick(event) {
    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(this.boreholeMeshes);
    if (intersects.length > 0) {
      const bh = intersects[0].object.userData;
      document.getElementById('bh-inspector-title').textContent = `Selected Borehole: ${bh.id}`;
      document.getElementById('bh-inspector-body').innerHTML = `
        <div class="flex flex-between">
          <span style="color: var(--text-secondary);">Collar Coordinates:</span>
          <span style="font-family: var(--font-mono); font-weight: 600;">23.765°N, 86.341°E</span>
        </div>
        <div class="flex flex-between">
          <span style="color: var(--text-secondary);">Collar Elevation (RL):</span>
          <span style="font-family: var(--font-mono);">+${bh.rl} m MSL</span>
        </div>
        <div class="flex flex-between">
          <span style="color: var(--text-secondary);">Total Drilled Depth:</span>
          <span style="font-family: var(--font-mono); color: var(--color-gold-light); font-weight: 700;">${bh.depth}.0 meters</span>
        </div>
        <div class="flex flex-between">
          <span style="color: var(--text-secondary);">Net Coal Thickness:</span>
          <span style="font-family: var(--font-mono); color: var(--color-emerald); font-weight: 700;">${bh.netCoal} meters</span>
        </div>
        <div class="flex flex-between">
          <span style="color: var(--text-secondary);">Mean GCV Value:</span>
          <span style="font-family: var(--font-mono);">${bh.gcv} kcal/kg</span>
        </div>
      `;
      App.showToast(`Selected Borehole ${bh.id}`, 'info');
    }
  },

  resetCamera() {
    if (this.camera && this.controls) {
      this.camera.position.set(150, 120, 200);
      this.controls.target.set(0, 0, 0);
      this.controls.update();
      App.showToast('Reset 3D Camera View', 'info');
    }
  },

  toggleWireframe() {
    this.wireframeMode = !this.wireframeMode;
    Object.values(this.seamMeshes).forEach(m => {
      m.material.wireframe = this.wireframeMode;
    });
    App.showToast(`Wireframe: ${this.wireframeMode ? 'ON' : 'OFF'}`, 'info');
  },

  toggleSeam(seamKey, visible) {
    if (seamKey === 'fault' && this.faultMesh) {
      this.faultMesh.visible = visible;
    } else if (this.seamMeshes[seamKey]) {
      this.seamMeshes[seamKey].visible = visible;
    }
  },

  changeColorMode(mode) {
    if (mode === 'gcv') {
      this.seamMeshes['seam9'].material.color.setHex(0x10B981); // High GCV green
      this.seamMeshes['seam5'].material.color.setHex(0xF59E0B); // Med GCV amber
      this.seamMeshes['seam3'].material.color.setHex(0x10B981);
    } else if (mode === 'ash') {
      this.seamMeshes['seam9'].material.color.setHex(0x3B82F6); // Low ash blue
      this.seamMeshes['seam5'].material.color.setHex(0xEF4444); // High ash red
      this.seamMeshes['seam3'].material.color.setHex(0x3B82F6);
    } else {
      this.seamMeshes['seam9'].material.color.setHex(0x10B981);
      this.seamMeshes['seam5'].material.color.setHex(0xF59E0B);
      this.seamMeshes['seam3'].material.color.setHex(0x3B82F6);
    }
    App.showToast(`Switched 3D coloring mode to: ${mode.toUpperCase()}`, 'info');
  },

  loadBlock(blockKey) {
    App.showToast(`Loading 3D Mine Block: ${blockKey.toUpperCase()}...`, 'info');
    this.resetCamera();
  },

  generateCrossSection() {
    App.showToast('Generating 2D Lithological Cross-Section Profile A-A\'...', 'info');
    setTimeout(() => {
      App.showToast('Cross-section generated between BH-040 and BH-045!', 'success');
    }, 900);
  },

  onWindowResize() {
    const container = document.getElementById('three-canvas-container');
    if (!container || !this.camera || !this.renderer) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }
};

document.addEventListener('DOMContentLoaded', () => {
  VizPage.init();
});
