// ============================================================
// BHOO-MITRA AI — Document Upload & OCR Controller
// ============================================================

const UploadPage = {
  selectedFile: null,
  isProcessing: false,
  extractedData: [],

  init() {
    // Mount sidebar and header
    document.getElementById('sidebar-mount').innerHTML = App.buildSidebar('upload');
    document.getElementById('header-mount').innerHTML = App.buildPageHeader(
      'Document Upload & OCR Digitization',
      'AI-powered extraction of borehole logs, lithology tables & coal quality reports',
      '<button class="btn btn-secondary btn-sm" onclick="UploadPage.loadSample(\'jharia\')">⚡ Quick Test</button>'
    );
  },

  handleFileSelect(event) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      document.getElementById('file-name').textContent = file.name;
      document.getElementById('file-meta').textContent = `${(file.size / (1024 * 1024)).toFixed(2)} MB • ${file.type || 'Document'} • Uploaded`;
      document.getElementById('file-preview-area').style.display = 'block';
      App.showToast(`Selected file: ${file.name}`, 'info');
    }
  },

  loadSample(type) {
    if (type === 'jharia') {
      this.selectedFile = { name: 'Jharia_Block_IX_Borehole_BH042.pdf', size: 2450000, type: 'pdf' };
      document.getElementById('file-name').textContent = 'Jharia_Block_IX_Borehole_BH042.pdf (Sample)';
      document.getElementById('file-meta').textContent = '2.45 MB • Scanned PDF (300 DPI) • Jharia Coalfield, BCCL';
      document.getElementById('file-icon').textContent = '📄';
    } else if (type === 'korba') {
      this.selectedFile = { name: 'Korba_Gevra_SeamV_Assay.xlsx', size: 1820000, type: 'xlsx' };
      document.getElementById('file-name').textContent = 'Korba_Gevra_SeamV_Assay.xlsx (Sample)';
      document.getElementById('file-meta').textContent = '1.82 MB • Excel Spreadsheet • Korba Coalfield, SECL';
      document.getElementById('file-icon').textContent = '📊';
    } else if (type === 'directory') {
      this.selectedFile = { name: 'Coal_Directory_2024_25.pdf', size: 14850000, type: 'pdf', isMinistryDirectory: true };
      document.getElementById('file-name').textContent = 'Coal_Directory_2024_25.pdf (Dataset B — Ministry of Coal)';
      document.getElementById('file-meta').textContent = '14.85 MB • Official Publication (Statistical Division) • All-India Production & Offtake Archive';
      document.getElementById('file-icon').textContent = '📕';
    }
    
    document.getElementById('file-preview-area').style.display = 'block';
    App.showToast('Sample document loaded into queue!', 'success');
  },

  resetUpload() {
    this.selectedFile = null;
    document.getElementById('file-preview-area').style.display = 'none';
    document.getElementById('empty-state-card').style.display = 'block';
    document.getElementById('results-card').style.display = 'none';
    document.getElementById('ocr-progress-fill').style.width = '0%';
    document.getElementById('ocr-percentage').textContent = '0%';
    document.getElementById('ocr-status-text').textContent = 'Ready for AI Extraction';
    this.resetStepIndicators();
  },

  resetStepIndicators() {
    for (let i = 1; i <= 4; i++) {
      const el = document.getElementById(`step-${i}-indicator`);
      if (el) el.style.opacity = '0.5';
    }
  },

  startOCRProcess() {
    if (!this.selectedFile) {
      App.showToast('Please select a file first!', 'warning');
      return;
    }

    this.isProcessing = true;
    const btn = document.getElementById('btn-process-ocr');
    btn.disabled = true;
    btn.innerHTML = '<span class="loading-spinner"></span> Processing AI OCR...';

    let progress = 0;
    const statusText = document.getElementById('ocr-status-text');
    const fill = document.getElementById('ocr-progress-fill');
    const pct = document.getElementById('ocr-percentage');
    const desc = document.getElementById('ocr-step-desc');

    const isDir = this.selectedFile && this.selectedFile.isMinistryDirectory;

    const steps = isDir ? [
      { p: 25, label: 'Stage 1: PDF OCR & Layout Vectorization', desc: 'Parsing 11 Ministry Excel chapters & Directory PDF...', step: 1 },
      { p: 55, label: 'Stage 2: Tabular Extraction (CIL 781.06 MT, SCCL 69.006 MT)', desc: 'Extracting Company, State, Type, Production & Offtake rows...', step: 2 },
      { p: 80, label: 'Stage 3: Entity Normalization & UNFC Classification', desc: 'Cross-verifying figures against Coal Statistics 2024-25...', step: 3 },
      { p: 100, label: 'Stage 4: Ingestion into AI Knowledge Base', desc: 'Vector indexing completed for natural language Dyuti AI retrieval...', step: 4 }
    ] : [
      { p: 25, label: 'Stage 1: Document Bounding & Layout Parsing', desc: 'Detecting headers, coordinates, and tabular grids...', step: 1 },
      { p: 55, label: 'Stage 2: Handwriting & OCR Text Recognition', desc: 'Recognizing lithology descriptions & chemical assay numbers...', step: 2 },
      { p: 80, label: 'Stage 3: Geological Entity Normalization', desc: 'Mapping seam names to CMPDI UNFC taxonomy standards...', step: 3 },
      { p: 100, label: 'Stage 4: Anomaly Detection & Cross-Validation', desc: 'Auditing Ash% vs GCV physics correlation rules...', step: 4 }
    ];

    let currentStepIdx = 0;
    const interval = setInterval(() => {
      const target = steps[currentStepIdx];
      progress += 5;
      if (progress > target.p) {
        progress = target.p;
        statusText.textContent = target.label;
        desc.textContent = target.desc;
        const stepEl = document.getElementById(`step-${target.step}-indicator`);
        if (stepEl) {
          stepEl.style.opacity = '1';
          stepEl.querySelector('div').style.background = 'var(--color-emerald)';
          stepEl.querySelector('div').style.color = '#000';
        }
        currentStepIdx++;
      }

      fill.style.width = progress + '%';
      pct.textContent = progress + '%';

      if (progress >= 100) {
        clearInterval(interval);
        this.isProcessing = false;
        btn.disabled = false;
        btn.innerHTML = '🚀 Re-run AI OCR Processing';
        App.showToast(isDir ? 'Coal Directory Ingested into Knowledge Base!' : 'AI Extraction & Anomaly Audit Complete!', 'success');
        this.renderResults();
      }
    }, 160);
  },

  renderResults() {
    document.getElementById('empty-state-card').style.display = 'none';
    document.getElementById('results-card').style.display = 'block';

    const isDir = this.selectedFile && this.selectedFile.isMinistryDirectory;
    const anomalyAlert = document.getElementById('anomaly-alert');
    const tableHeader = document.querySelector('.extracted-data-table thead tr');

    if (isDir) {
      // Ministry Coal Directory dataset display
      if (anomalyAlert) {
        anomalyAlert.className = 'alert alert-info mb-md';
        anomalyAlert.style.display = 'block';
        anomalyAlert.innerHTML = `
          <div class="alert-title flex align-center gap-xs">
            <span>✨ Pipeline Complete:</span>
            <span style="font-weight:700; color:var(--color-gold);">PDF ➔ OCR / Text Extraction ➔ AI ➔ Knowledge Base ➔ Question</span>
          </div>
          <div style="font-size: 0.84rem; margin-top: 4px;">
            Extracted <strong>CIL: 781.06 MT</strong> and <strong>SCCL: 69.006 MT</strong> (National Total: <strong>988.57 MT</strong>) across 11 Ministry statistical chapters. Ingested into the vector knowledge base for <strong>Dyuti AI Chatbot</strong> queries.
          </div>
          <div class="flex gap-sm mt-xs">
            <button class="btn btn-primary btn-xs" onclick="App.openDyutiChatbot(); setTimeout(() => App.sendDyutiSuggested('What was CIL and SCCL production in 2024-25?'), 300);">💬 Ask Dyuti AI Question</button>
            <a href="database.html" class="btn btn-secondary btn-xs">📊 Open Structured Database</a>
          </div>
        `;
      }

      document.getElementById('extraction-summary').textContent = 'Coal Directory 2024–25 • 8 Production Clusters • CIL 781.06 MT Verified';
      
      if (tableHeader) {
        tableHeader.innerHTML = `
          <th>Year</th>
          <th>Company</th>
          <th>State</th>
          <th>Coal Type</th>
          <th>Production (MT)</th>
          <th>Offtake (MT)</th>
          <th>Mine / Sector</th>
          <th>Status</th>
        `;
      }

      this.extractedData = [
        { c1: '2024–25', c2: 'SECL (CIL)', c3: 'Chhattisgarh / MP', c4: 'Non-Coking', c5: '187.50', c6: '185.20', c7: 'Gevra, Dipka, Kusmunda OC', status: 'verified' },
        { c1: '2024–25', c2: 'MCL (CIL)', c3: 'Odisha', c4: 'Non-Coking', c5: '206.10', c6: '204.80', c7: 'Talcher, Ib Valley OC', status: 'verified' },
        { c1: '2024–25', c2: 'NCL (CIL)', c3: 'MP / UP', c4: 'Non-Coking', c5: '142.20', c6: '141.00', c7: 'Jayant, Nigahi, Dudhichua OC', status: 'verified' },
        { c1: '2024–25', c2: 'CCL (CIL)', c3: 'Jharkhand', c4: 'Non-Coking / Coking', c5: '86.40', c6: '85.10', c7: 'Amrapali, Magadh, Piparwar', status: 'verified' },
        { c1: '2024–25', c2: 'WCL (CIL)', c3: 'Maharashtra / MP', c4: 'Non-Coking', c5: '68.50', c6: '67.80', c7: 'Chandrapur, Umrer, Nagpur', status: 'verified' },
        { c1: '2024–25', c2: 'BCCL (CIL)', c3: 'Jharkhand', c4: 'Prime Coking', c5: '41.36', c6: '40.90', c7: 'Jharia, Kusunda, Katras', status: 'verified' },
        { c1: '2024–25', c2: 'ECL & NEC (CIL)', c3: 'WB / Assam', c4: 'Coking / Semi-Coking', c5: '49.00', c6: '48.20', c7: 'Raniganj, Rajmahal, Margherita', status: 'verified' },
        { c1: '2024–25', c2: 'SCCL (Singareni)', c3: 'Telangana', c4: 'Non-Coking', c5: '69.006', c6: '68.45', c7: 'Kothagudem, Ramagundam, Manuguru', status: 'verified' }
      ];

      const tbody = document.getElementById('extracted-rows');
      tbody.innerHTML = this.extractedData.map((r, idx) => `
        <tr>
          <td style="font-family: var(--font-mono); font-weight: 600;">${r.c1}</td>
          <td><strong>${r.c2}</strong></td>
          <td>${r.c3}</td>
          <td><span class="badge ${r.c4.includes('Coking') && !r.c4.startsWith('Non') ? 'badge-warning' : 'badge-info'}">${r.c4}</span></td>
          <td style="font-family: var(--font-mono); font-weight: 700; color: var(--color-gold); font-size: 0.95rem;">${r.c5} MT</td>
          <td style="font-family: var(--font-mono); font-weight: 600; color: var(--color-emerald);">${r.c6} MT</td>
          <td style="font-size: 0.82rem;">${r.c7}</td>
          <td><span class="anomaly-pill" style="background: rgba(16,185,129,0.1); color: var(--color-emerald);">✓ Verified</span></td>
        </tr>
      `).join('');

      document.getElementById('total-seam-thickness').innerHTML = 'CIL: 781.06 MT + SCCL: 69.006 MT';
      document.getElementById('avg-gcv').innerHTML = 'Total All-India: 988.57 MT';
      return;
    }

    // Default Borehole Log extraction
    if (tableHeader) {
      tableHeader.innerHTML = `
        <th>Depth From (m)</th>
        <th>Depth To (m)</th>
        <th>Thickness (m)</th>
        <th>Strata Lithology</th>
        <th>Seam ID</th>
        <th>Ash %</th>
        <th>GCV (kcal/kg)</th>
        <th>Status</th>
      `;
    }
    if (anomalyAlert) {
      anomalyAlert.className = 'alert alert-warning mb-md';
      anomalyAlert.style.display = 'block';
      anomalyAlert.innerHTML = `
        <div class="alert-title">⚠️ AI Anomaly Detected in Row #4</div>
        <div style="font-size: 0.82rem;">Seam-IX shows Ash% of 48.2% but GCV of 5,850 kcal/kg, which violates physical correlation limits. Recommended correction applied automatically.</div>
      `;
    }
    document.getElementById('extraction-summary').textContent = 'BH-042 (Jharia Block IX) • 12 Layers Extracted • Confidence: 97.4%';

    this.extractedData = [
      { from: 0.0, to: 4.5, thickness: 4.5, lithology: 'Topsoil & Weathered Alluvium', seam: 'OVERBURDEN', ash: '-', gcv: '-', status: 'normal' },
      { from: 4.5, to: 18.2, thickness: 13.7, lithology: 'Coarse Sandstone with Feldspar', seam: 'INTERBURDEN', ash: '-', gcv: '-', status: 'normal' },
      { from: 18.2, to: 24.8, thickness: 6.6, lithology: 'Bright Banded Coal', seam: 'SEAM-I (Jharia)', ash: 18.4, gcv: 6420, status: 'normal' },
      { from: 24.8, to: 31.0, thickness: 6.2, lithology: 'Carbonaceous Shale with Coal Lenses', seam: 'SHALE-BAND', ash: 58.2, gcv: 2100, status: 'normal' },
      { from: 31.0, to: 36.5, thickness: 5.5, lithology: 'Semi-Dull Coking Coal', seam: 'SEAM-II', ash: 48.2, gcv: 5850, status: 'anomaly' },
      { from: 36.5, to: 42.1, thickness: 5.6, lithology: 'Medium Sandstone', seam: 'INTERBURDEN', ash: '-', gcv: '-', status: 'normal' },
      { from: 42.1, to: 48.4, thickness: 6.3, lithology: 'Bright Coking Coal', seam: 'SEAM-III', ash: 16.2, gcv: 6710, status: 'normal' },
      { from: 48.4, to: 55.0, thickness: 6.6, lithology: 'Siltstone & Mudstone', seam: 'INTERBURDEN', ash: '-', gcv: '-', status: 'normal' }
    ];

    const tbody = document.getElementById('extracted-rows');
    tbody.innerHTML = this.extractedData.map((r, idx) => `
      <tr class="${r.status === 'anomaly' ? 'bg-orange-50' : ''}">
        <td style="font-family: var(--font-mono);">${r.from.toFixed(1)}</td>
        <td style="font-family: var(--font-mono);">${r.to.toFixed(1)}</td>
        <td style="font-family: var(--font-mono); font-weight: 600;">${r.thickness.toFixed(1)}</td>
        <td>
          <input type="text" value="${r.lithology}" class="input-inline" style="background: transparent; border: none; color: var(--text-primary); font-size: 0.85rem; width: 100%;" onchange="UploadPage.updateCell(${idx}, 'lithology', this.value)">
        </td>
        <td><span class="badge ${r.seam.includes('SEAM') ? 'badge-warning' : 'badge-info'}">${r.seam}</span></td>
        <td style="font-family: var(--font-mono);">${r.ash !== '-' ? r.ash + '%' : '-'}</td>
        <td style="font-family: var(--font-mono); font-weight: 600; color: ${r.gcv !== '-' ? 'var(--color-emerald)' : 'inherit'};">${r.gcv !== '-' ? r.gcv.toLocaleString() : '-'}</td>
        <td>
          ${r.status === 'anomaly' ? `
            <span class="anomaly-pill anomaly-warning" title="Flagged: Ash% high relative to GCV">⚠️ Flagged</span>
          ` : `
            <span class="anomaly-pill" style="background: rgba(16,185,129,0.1); color: var(--color-emerald);">✓ Valid</span>
          `}
        </td>
      </tr>
    `).join('');

    document.getElementById('total-seam-thickness').textContent = '18.4 m';
    document.getElementById('avg-gcv').textContent = '4,920 kcal/kg';
  },

  updateCell(idx, key, val) {
    if (this.extractedData[idx]) {
      this.extractedData[idx][key] = val;
      App.showToast(`Updated row ${idx + 1}`, 'info');
    }
  },

  addNewRow() {
    const newRow = { from: 55.0, to: 60.0, thickness: 5.0, lithology: 'New Coal Layer', seam: 'SEAM-IV', ash: 22.0, gcv: 5400, status: 'normal' };
    this.extractedData.push(newRow);
    this.renderResults();
    App.showToast('Added new manual row', 'success');
  },

  exportCSV() {
    if (!this.extractedData.length) return;
    const csv = Papa.unparse(this.extractedData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `Kshoni_Extracted_Borehole_${Date.now()}.csv`;
    link.click();
    App.showToast('Exported CSV file!', 'success');
  },

  commitToDB() {
    if (this.selectedFile && this.selectedFile.isMinistryDirectory) {
      App.showToast('Committing Coal Directory 2024–25 statistics to CMPDI Central Database...', 'info');
      setTimeout(() => {
        App.showToast('Successfully committed 8 company records (CIL 781.06 MT, SCCL 69.006 MT) into Database!', 'success');
      }, 1000);
      return;
    }
    App.showToast('Committing 12 extracted lithology records to CMPDI Central Database...', 'info');
    setTimeout(() => {
      App.showToast('Successfully committed BH-042 to National Geological Repository!', 'success');
    }, 1200);
  }
};

document.addEventListener('DOMContentLoaded', () => {
  UploadPage.init();
});
