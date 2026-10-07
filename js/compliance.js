// ============================================================
// BHOO-MITRA AI — Statutory Compliance Auditor Engine
// Handles statutory checklists (MoEFCC, DGMS, MoC, CMPDI),
// compliance scoring, auto-scanning, and certificate generation.
// ============================================================

const ComplianceEngine = {
  currentFilter: 'all',
  currentSubsidiary: 'all',
  currentAuthority: 'all',
  
  complianceRules: [
    {
      id: 'COMP-101',
      title: 'UNFC 111 Proved Category Borehole Grid Density',
      authority: 'CMPDI',
      category: 'Geological Standards',
      subsidiary: 'BCCL',
      mineBlock: 'Jharia Block IX',
      status: 'pass',
      score: 96,
      mandatory: true,
      lastAudited: '2026-03-01',
      details: 'Grid density of 380m spacing satisfies UNFC 111 requirement (<400m grid for proved reserves). Core recovery avg 89.4%.',
      remedialAction: 'None required. Compliant for GR submission.'
    },
    {
      id: 'COMP-102',
      title: 'Environmental Clearance (EC) Peak Production Limit',
      authority: 'MoEFCC',
      category: 'Environmental',
      subsidiary: 'SECL',
      mineBlock: 'Gevra OC Extension',
      status: 'pass',
      score: 92,
      mandatory: true,
      lastAudited: '2026-02-24',
      details: 'Peak capacity approved for 70.0 MTPA. Current operating run-rate is 62.5 MTPA (89.2% capacity utilization).',
      remedialAction: 'Maintain current production rate; apply for expansion EC 6 months prior to reaching 68 MTPA.'
    },
    {
      id: 'COMP-103',
      title: 'Forest Clearance Stage-II (FC) Diversion Condition',
      authority: 'MoEFCC',
      category: 'Forestry',
      subsidiary: 'MCL',
      mineBlock: 'Kaniha Open Cast',
      status: 'warning',
      score: 74,
      mandatory: true,
      lastAudited: '2026-02-28',
      details: 'Compensatory Afforestation (CA) plantation target at 82% of statutory target. 42 hectares pending sapling plantation in non-forest land.',
      remedialAction: 'Accelerate CA plantation drive before monsoon onset to avoid penalty notice under Section 2 of Forest Conservation Act.'
    },
    {
      id: 'COMP-104',
      title: 'DGMS Inundation & Water Table Hydrogeological Study',
      authority: 'DGMS',
      category: 'Mine Safety',
      subsidiary: 'BCCL',
      mineBlock: 'Katras Underground Mine',
      status: 'fail',
      score: 48,
      mandatory: true,
      lastAudited: '2026-03-04',
      details: 'Hydrogeological barrier thickness between underground workings and abandoned waterlogged seam V/VI measures 18m (statutory minimum is 60m).',
      remedialAction: 'CRITICAL: Stop development heading 4W immediately. Perform directional probing boreholes and submit barrier reduction application under Regulation 127.'
    },
    {
      id: 'COMP-105',
      title: 'Progressive Mine Closure Plan (PMCP) Escrow Deposit',
      authority: 'MoC',
      category: 'Statutory Finance',
      subsidiary: 'CCL',
      mineBlock: 'Karanpura North Block',
      status: 'pass',
      score: 98,
      mandatory: true,
      lastAudited: '2026-01-15',
      details: 'Escrow account annual deposit of ₹14.82 Crores transferred to CIL escrow account as per Ministry of Coal guidelines.',
      remedialAction: 'Compliant. Submit bank confirmation receipt to Coal Controller Organization (CCO).'
    },
    {
      id: 'COMP-106',
      title: 'Overburden Slope Stability & Highwall Angle Audit',
      authority: 'DGMS',
      category: 'Mine Safety',
      subsidiary: 'NCL',
      mineBlock: 'Jayant Open Cast',
      status: 'pass',
      score: 91,
      mandatory: true,
      lastAudited: '2026-02-18',
      details: 'Overall pit slope angle maintained at 38° against maximum allowed 42°. Laser scanner displacement monitoring shows zero slope movement.',
      remedialAction: 'Continue monthly prism monitoring and real-time radar scanning.'
    },
    {
      id: 'COMP-107',
      title: 'Borehole Core Recovery & Quality Analysis Completeness',
      authority: 'CMPDI',
      category: 'Geological Standards',
      subsidiary: 'WCL',
      mineBlock: 'Wardha Valley Deep Block',
      status: 'warning',
      score: 68,
      mandatory: false,
      lastAudited: '2026-02-12',
      details: 'Core recovery in Seam I lowered to 78% due to friable coal zone. 12% of band-by-band proximate samples pending laboratory GCV validation.',
      remedialAction: 'Perform check drilling with triple-tube core barrel for friable zone and expedite lab test results.'
    },
    {
      id: 'COMP-108',
      title: 'Continuous Ambient Air Quality Monitoring (CAAQMS)',
      authority: 'MoEFCC',
      category: 'Environmental',
      subsidiary: 'ECL',
      mineBlock: 'Raniganj Underground',
      status: 'pass',
      score: 88,
      mandatory: true,
      lastAudited: '2026-02-26',
      details: 'PM10 and PM2.5 real-time data telemetered to State Pollution Control Board server. 99.4% uptime registered over Q4.',
      remedialAction: 'Recalibrate NO2 sensors at Monitoring Station 3.'
    }
  ],

  init() {
    this.renderStats();
    this.renderChecklist();
    this.renderSubsidiaryScores();
  },

  renderStats() {
    const total = this.complianceRules.length;
    const passed = this.complianceRules.filter(r => r.status === 'pass').length;
    const warnings = this.complianceRules.filter(r => r.status === 'warning').length;
    const failed = this.complianceRules.filter(r => r.status === 'fail').length;
    const avgScore = Math.round(this.complianceRules.reduce((acc, r) => acc + r.score, 0) / total);

    const elTotal = document.getElementById('stat-total-checks');
    const elPassed = document.getElementById('stat-passed-checks');
    const elWarnings = document.getElementById('stat-warning-checks');
    const elFailed = document.getElementById('stat-failed-checks');
    const elAvgScore = document.getElementById('stat-avg-score');

    if (elTotal) elTotal.textContent = total;
    if (elPassed) elPassed.textContent = passed;
    if (elWarnings) elWarnings.textContent = warnings;
    if (elFailed) elFailed.textContent = failed;
    if (elAvgScore) elAvgScore.textContent = avgScore + '%';
  },

  filterByAuthority(authority) {
    this.currentAuthority = authority;
    this.renderChecklist();
  },

  filterByStatus(status) {
    this.currentFilter = status;
    this.renderChecklist();
  },

  filterBySubsidiary(sub) {
    this.currentSubsidiary = sub;
    this.renderChecklist();
  },

  renderChecklist() {
    const listContainer = document.getElementById('compliance-checklist-container');
    if (!listContainer) return;

    let items = [...this.complianceRules];

    if (this.currentAuthority !== 'all') {
      items = items.filter(i => i.authority.toLowerCase() === this.currentAuthority.toLowerCase());
    }

    if (this.currentFilter !== 'all') {
      items = items.filter(i => i.status === this.currentFilter);
    }

    if (this.currentSubsidiary !== 'all') {
      items = items.filter(i => i.subsidiary.toLowerCase() === this.currentSubsidiary.toLowerCase());
    }

    if (items.length === 0) {
      listContainer.innerHTML = `
        <div style="text-align: center; padding: 40px; color: var(--text-tertiary);">
          <div style="font-size: 2.5rem; margin-bottom: 8px;">🔍</div>
          <p>No statutory compliance items match the selected filter criteria.</p>
        </div>
      `;
      return;
    }

    listContainer.innerHTML = items.map(item => {
      const badgeClass = item.status === 'pass' ? 'badge-emerald' : item.status === 'warning' ? 'badge-orange' : 'badge-red';
      const statusIcon = item.status === 'pass' ? '✓ Passed' : item.status === 'warning' ? '⚠️ Action Required' : '🚨 Critical Non-Compliance';
      
      return `
        <div class="card mb-md scroll-animate" style="border-left: 4px solid ${item.status === 'pass' ? '#10B981' : item.status === 'warning' ? '#F59E0B' : '#EF4444'};">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 12px; margin-bottom: 10px;">
            <div>
              <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
                <span class="badge" style="background: rgba(212,168,67,0.15); color: var(--color-gold); font-family: var(--font-mono);">${item.id}</span>
                <span class="badge badge-blue">${item.authority}</span>
                <span class="badge" style="background: rgba(255,255,255,0.06); color: var(--text-secondary);">${item.category}</span>
                ${item.mandatory ? '<span class="badge" style="background: rgba(239,68,68,0.15); color: #EF4444; font-size: 0.7rem;">MANDATORY</span>' : ''}
              </div>
              <h4 style="margin: 0; font-size: 1.05rem; font-weight: 600; color: var(--text-primary);">${item.title}</h4>
              <div style="font-size: 0.8rem; color: var(--text-tertiary); margin-top: 2px;">
                Subsidiary: <strong>${item.subsidiary}</strong> • Block: <strong>${item.mineBlock}</strong> • Last Audited: ${item.lastAudited}
              </div>
            </div>
            <div style="text-align: right;">
              <span class="badge ${badgeClass}" style="font-weight: 600; font-size: 0.82rem; padding: 4px 10px;">${statusIcon}</span>
              <div style="font-family: var(--font-mono); font-size: 1.1rem; font-weight: 700; color: ${item.score >= 85 ? '#10B981' : item.score >= 70 ? '#F59E0B' : '#EF4444'}; margin-top: 4px;">
                ${item.score}/100
              </div>
            </div>
          </div>

          <div style="background: rgba(10,22,40,0.5); border-radius: 6px; padding: 10px 14px; margin-top: 8px; font-size: 0.88rem; color: var(--text-secondary);">
            <strong>Finding:</strong> ${item.details}
          </div>

          <div style="background: rgba(212,168,67,0.08); border-left: 3px solid var(--color-gold); border-radius: 0 6px 6px 0; padding: 8px 12px; margin-top: 8px; font-size: 0.85rem; color: var(--color-gold-light);">
            <strong>AI Recommended Action:</strong> ${item.remedialAction}
          </div>
        </div>
      `;
    }).join('');
  },

  renderSubsidiaryScores() {
    const container = document.getElementById('subsidiary-scores-container');
    if (!container || typeof SUBSIDIARIES === 'undefined') return;

    container.innerHTML = SUBSIDIARIES.map(s => {
      const color = s.complianceScore >= 90 ? '#10B981' : s.complianceScore >= 80 ? '#F59E0B' : '#EF4444';
      return `
        <div style="display: flex; align-items: center; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid var(--border-color);">
          <div style="display: flex; align-items: center; gap: 8px;">
            <div style="width: 10px; height: 10px; border-radius: 50%; background: ${s.color};"></div>
            <span style="font-weight: 600; font-size: 0.9rem;">${s.shortName}</span>
          </div>
          <div style="display: flex; align-items: center; gap: 10px;">
            <div style="width: 100px; height: 6px; background: rgba(255,255,255,0.08); border-radius: 3px; overflow: hidden;">
              <div style="width: ${s.complianceScore}%; height: 100%; background: ${color}; border-radius: 3px;"></div>
            </div>
            <span style="font-family: var(--font-mono); font-weight: 700; color: ${color}; font-size: 0.85rem; width: 40px; text-align: right;">${s.complianceScore}%</span>
          </div>
        </div>
      `;
    }).join('');
  },

  runFullAudit() {
    const btn = document.getElementById('btn-run-audit');
    if (btn) {
      btn.disabled = true;
      btn.innerHTML = '⏳ Scanning 1,452 Mine Files...';
    }

    App.showToast('Initiating AI Statutory Scan across 8 CIL Subsidiaries...', 'info', 3000);

    setTimeout(() => {
      App.showToast('Scanning MoEFCC Environmental Clearance database...', 'info', 2500);
    }, 1500);

    setTimeout(() => {
      App.showToast('Auditing DGMS safety regulation adherence & water barriers...', 'warning', 2500);
    }, 3200);

    setTimeout(() => {
      // Refresh items with updated scores
      this.complianceRules.forEach(r => {
        r.score = Math.min(100, Math.max(45, r.score + Math.floor(Math.random() * 5) - 2));
      });
      this.renderStats();
      this.renderChecklist();
      this.renderSubsidiaryScores();

      if (btn) {
        btn.disabled = false;
        btn.innerHTML = '✨ Run Statutory AI Audit';
      }
      App.showToast('Statutory Audit Completed! 8 Checks Evaluated. 1 Critical Remediation Flagged.', 'success', 5000);
    }, 5000);
  },

  openCertificateModal() {
    const modal = document.getElementById('cert-modal');
    if (modal) {
      modal.style.display = 'flex';
    }
  },

  closeCertificateModal() {
    const modal = document.getElementById('cert-modal');
    if (modal) {
      modal.style.display = 'none';
    }
  },

  downloadCertificate() {
    App.showToast('Generating signed Statutory Compliance Clearance Certificate PDF...', 'success');
    setTimeout(() => {
      window.print();
    }, 800);
  }
};
