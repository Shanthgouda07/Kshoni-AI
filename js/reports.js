// ============================================================
// BHOO-MITRA AI — Report Generator Controller
// ============================================================

const ReportsPage = {
  init() {
    // Mount sidebar and header
    document.getElementById('sidebar-mount').innerHTML = App.buildSidebar('reports');
    document.getElementById('header-mount').innerHTML = App.buildPageHeader(
      'Statutory Report Generator Engine',
      'Automated GR / GSR report drafting with UNFC reserve matrices & compliance verification',
      '<button class="btn btn-primary btn-sm" onclick="ReportsPage.exportPDF()">📄 Export PDF</button>'
    );
  },

  onTemplateChange() {
    const template = document.getElementById('report-template').value;
    const titleMap = {
      gr: 'GEOLOGICAL REPORT (GR) ON EXPLORATION FOR COAL',
      gsr: 'GEOLOGICAL STUDY REPORT (GSR) — PRELIMINARY PHASE',
      feasi: 'FEASIBILITY STUDY & MINE PLAN RESOURCE REPORT',
      mcp: 'STATUTORY MINE CLOSURE & ENVIRONMENTAL MANAGEMENT PLAN'
    };
    document.getElementById('doc-title').textContent = titleMap[template] || 'STATUTORY GEOLOGICAL REPORT';
    App.showToast(`Updated template structure to: ${template.toUpperCase()}`, 'info');
  },

  onSubsidiaryChange() {
    const sub = document.getElementById('report-subsidiary').value;
    const blockSelect = document.getElementById('report-block');
    
    const blocksMap = {
      BCCL: ['Jharia Coalfield — Block IX Open Cast', 'Moonidih UG Sector C', 'Katras Open Cast'],
      SECL: ['Gevra Expansion OC Mine (Korba)', 'Dipka OC Expansion', 'Kusmunda Mega Block'],
      MCL: ['Kaniha Sector B (Talcher)', 'Ananta OC Project', 'Lakhanpur Block III'],
      CCL: ['Amrapali Opencast Project', 'Magadh Coal Block', 'North Karanpura'],
      NCL: ['Jayant OC Mine (Singrauli)', 'Nigahi OC Project', 'Dudhichhua Block'],
      ECL: ['Sonalpur Bazari OC (Raniganj)', 'Rajmahal Open Cast', 'Jhanjra Underground'],
      WCL: ['Gondegaon Open Cast (Nagpur)', 'Penganga OC Mine', 'Umrer Project'],
      NEC: ['Tikak Colliery (Margherita)', 'Tirap Mine Sector', 'Bargolai Sector']
    };

    const blocks = blocksMap[sub] || ['General Block 1'];
    blockSelect.innerHTML = blocks.map(b => `<option value="${b}">${b}</option>`).join('');
    
    document.getElementById('doc-subtitle').textContent = `${blocks[0]} • ${sub} Region`;
    App.showToast(`Selected Subsidiary: ${sub}`, 'info');
  },

  generateDraft() {
    const btn = document.getElementById('btn-generate-report');
    btn.disabled = true;
    btn.innerHTML = '<span class="loading-spinner"></span> Synthesizing AI Draft Report...';

    const sub = document.getElementById('report-subsidiary').value;
    const block = document.getElementById('report-block').value;

    App.showToast(`Querying knowledge base for ${block} (${sub})...`, 'info');

    setTimeout(() => {
      btn.disabled = false;
      btn.innerHTML = '⚡ Auto-Draft Report via AI';
      
      document.getElementById('doc-subtitle').textContent = `${block} • ${sub} Region`;
      document.getElementById('doc-date').textContent = `Date: ${new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}`;
      
      App.showToast(`Generated AI draft report for ${block} with 98.6% compliance score!`, 'success');

      // Scroll to paper top
      document.getElementById('report-paper').scrollIntoView({ behavior: 'smooth' });
    }, 1200);
  },

  saveDraft() {
    App.showToast('Saving draft report to CMPDI Document Management System...', 'info');
    setTimeout(() => {
      App.showToast('Report draft DOC-ID: CMPDI/GR/2026/042 saved successfully!', 'success');
    }, 800);
  },

  auditCompliance() {
    App.showToast('Running statutory rules engine audit on report draft...', 'info');
    setTimeout(() => {
      window.location.href = 'compliance.html';
    }, 1000);
  },

  exportPDF() {
    App.showToast('Preparing government-ready high-resolution PDF download...', 'info');
    setTimeout(() => {
      window.print();
    }, 800);
  }
};

document.addEventListener('DOMContentLoaded', () => {
  ReportsPage.init();
});
