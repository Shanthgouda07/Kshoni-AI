// ============================================================
// BHOO-MITRA AI — Official Government Portal Application Engine
// Standardized across Ministry of Coal & CMPDI Digital Guidelines
// ============================================================

const App = {
  currentUser: null,
  toastContainer: null,
  currentTheme: 'light', // Default to official government light theme
  currentFontSize: 100,
  currentLang: 'en', // FIX: Initialize language property (was missing, causing undefined behavior)

  users: [
    { id: 1, name: 'Dr. Rajesh Kumar', role: 'Chief Geologist', subsidiary: 'BCCL (Jharia)', email: 'rajesh.kumar@cmpdi.gov.in', avatar: 'RK' },
    { id: 2, name: 'Smt. Priya Sharma', role: 'GM (Mine Planning)', subsidiary: 'CMPDI HQ', email: 'priya.sharma@cmpdi.gov.in', avatar: 'PS' },
    { id: 3, name: 'Shri Anil Verma', role: 'Director (Technical)', subsidiary: 'Ministry of Coal', email: 'anil.verma@coal.nic.in', avatar: 'AV' },
    { id: 4, name: 'Dr. Meera Patel', role: 'Chief Inspector', subsidiary: 'DGMS / CMPDI', email: 'meera.patel@cmpdi.gov.in', avatar: 'MP' }
  ],

  init() {
    // Check saved theme
    const savedTheme = localStorage.getItem('kshoniTheme') || 'light';
    this.currentTheme = savedTheme;
    // FIX: Unify theme approach — use body class (setTheme uses body classes)
    document.body.classList.remove('theme-dark', 'theme-contrast');
    if (savedTheme === 'dark') document.body.classList.add('theme-dark');
    else if (savedTheme === 'contrast') document.body.classList.add('theme-contrast');

    // FIX: Restore saved language
    const savedLang = localStorage.getItem('kshoniLang') || 'en';
    this.currentLang = savedLang;
    document.documentElement.lang = savedLang; // FIX: sync html lang attribute

    // Check if user is logged in
    const savedUser = localStorage.getItem('kshoniUser');
    if (savedUser) {
      this.currentUser = JSON.parse(savedUser);
    } else {
      this.currentUser = this.users[0];
    }

    this.setupToastContainer();
    this.injectGovtHeader();
    this.injectGovtFooter();
    this.injectFloatingDyutiWidget();
    this.updateAIEngineBadge();
    this._setupMobileSidebarOverlay(); // FIX: mobile sidebar support
  },

  setTheme(theme) {
    this.currentTheme = theme;
    localStorage.setItem('kshoniTheme', theme);
    document.body.classList.remove('theme-dark', 'theme-contrast');
    if (theme === 'dark') {
      document.body.classList.add('theme-dark');
    } else if (theme === 'contrast') {
      document.body.classList.add('theme-contrast');
    }
    const themeBtn = document.getElementById('theme-toggle-btn');
    if (themeBtn) {
      themeBtn.innerHTML = theme === 'dark' ? '☀️ Portal Light View' : '🌙 Command Center Dark';
    }
  },

  toggleTheme() {
    if (this.currentTheme === 'light') {
      this.setTheme('dark');
      this.showToast('Switched to Command Center Dark Mode', 'info');
    } else {
      this.setTheme('light');
      this.showToast('Switched to Official NIC Light Portal View', 'info');
    }
  },

  toggleContrast() {
    if (this.currentTheme === 'contrast') {
      this.setTheme('light');
      this.showToast('Normal Contrast Mode Restored', 'info');
    } else {
      this.setTheme('contrast');
      this.showToast('High Contrast Mode Activated (GIGW 3.0)', 'warning');
    }
  },

  setFontSize(action) {
    if (action === 'inc' && this.currentFontSize < 130) this.currentFontSize += 10;
    else if (action === 'dec' && this.currentFontSize > 80) this.currentFontSize -= 10;
    else if (action === 'reset') this.currentFontSize = 100;
    document.documentElement.style.fontSize = this.currentFontSize + '%';
    this.showToast(`Text Size Adjusted: ${this.currentFontSize}%`, 'info', 2000);
  },

  // FIX: Removed duplicate toggleLanguage() — only the real one below remains
  toggleLanguage() {
    this.currentLang = this.currentLang === 'hi' ? 'en' : 'hi';
    localStorage.setItem('kshoniLang', this.currentLang);
    document.documentElement.lang = this.currentLang; // FIX: update <html lang> attribute for a11y & SEO
    this.injectGovtHeader();
    this.injectGovtFooter();
    this.showToast(`Language switched to: ${this.currentLang === 'hi' ? 'हिंदी (Hindi)' : 'English'}`, 'success');
  },

  login(userId) {
    const user = this.users.find(u => u.id === userId);
    if (user) {
      this.currentUser = user;
      localStorage.setItem('kshoniUser', JSON.stringify(user));
      this.showToast('Welcome, ' + user.name + ' (' + user.role + ')', 'success');
      setTimeout(() => {
        window.location.href = 'dashboard.html';
      }, 700);
    }
  },

  logout() {
    this.currentUser = null;
    localStorage.removeItem('kshoniUser');
    window.location.href = 'index.html';
  },

  // ---------- Official Top Header Suite ----------
  injectGovtHeader() {
    const topMount = document.getElementById('govt-top-header-mount');
    if (!topMount) return;

    const lang = this.currentLang || 'en';
    const path = window.location.pathname;
    const page = path.split('/').pop().replace('.html', '') || 'index';

    topMount.innerHTML = `
      <!-- National Flag Tricolor Line -->
      <div class="govt-tricolor-bar"></div>

      <!-- 1. Official Government Utility Header -->
      <div class="govt-utility-header">
        <div class="govt-utility-left">
          ${lang === 'hi' ? `
            <span class="govt-emblem-inline">🏛️ भारत सरकार</span>
            <span style="opacity:0.35;">|</span>
            <span style="font-weight:600;">कोयला मंत्रालय</span>
            <span style="opacity:0.35;">|</span>
            <span style="color: var(--color-gold-light);">कोल इण्डिया लिमिटेड (CIL) एवं सीएमपीडीआई का राष्ट्रीय पोर्टल</span>
          ` : `
            <span class="govt-emblem-inline">🏛️ Government of India</span>
            <span style="opacity:0.35;">|</span>
            <span style="font-weight:600;">Ministry of Coal</span>
            <span style="opacity:0.35;">|</span>
            <span style="color: var(--color-gold-light);">National Portal of CIL & CMPDI</span>
          `}
        </div>
        <div class="govt-utility-right">
          <a href="#main-content">${lang === 'hi' ? 'मुख्य सामग्री पर जाएं' : 'Skip to Main Content'}</a>
          <span style="opacity:0.35;">|</span>
          <button onclick="App.toggleLanguage()" style="color: var(--color-gold-light); font-weight:700; background:none; border:none; cursor:pointer;">
            ${lang === 'hi' ? 'English' : 'हिंदी'}
          </button>
        </div>
      </div>

      <!-- 2. Official Portal Branding Banner -->
      <div class="govt-portal-banner">
        <div class="govt-brand-block">
          <img src="assets/images/emblem_india.svg" alt="National Emblem of India" style="height:62px; width:auto; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.15));" />
          <div class="govt-brand-titles">
            ${lang === 'hi' ? `
              <div class="govt-title-hi">क्षोणी एआई <img src="assets/images/kshoni_logo.svg" alt="Kshoni Logo" style="height:24px; width:auto; vertical-align:middle; margin-left:4px;" /> • राष्ट्रीय भू-वैज्ञानिक एवं खनन रिपोर्टिंग प्रणाली</div>
              <div class="govt-subtitle">सेंट्रल माइन प्लानिंग एंड डिजाइन इंस्टीट्यूट लिमिटेड (CMPDI) • कोयला मंत्रालय, भारत सरकार की आधिकारिक एआई पहल</div>
            ` : `
              <div class="govt-title-en">KSHONI AI <img src="assets/images/kshoni_logo.svg" alt="Kshoni Logo" style="height:26px; width:auto; vertical-align:middle; margin-left:6px; margin-right:6px; filter: drop-shadow(0 2px 4px rgba(212,168,67,0.4));" /> • NATIONAL GEOLOGICAL & MINING REPOSITORY</div>
              <div class="govt-subtitle">Central Mine Planning & Design Institute Limited (CMPDI) • Ministry of Coal, Government of India</div>
            `}
          </div>
        </div>

        <div class="govt-logos-right">
          <!-- FIX: Added explicit width/height to prevent CLS (Cumulative Layout Shift) -->
          <img src="assets/images/coal_india_logo.svg" alt="Coal India Limited" width="46" height="46" style="height:46px; width:auto;" title="Coal India Limited" loading="lazy" />
          <img src="assets/images/cmpdi_logo.svg" alt="CMPDI" width="46" height="46" style="height:46px; width:auto;" title="CMPDI HQ Ranchi" loading="lazy" />
          <img src="assets/images/swachh_bharat.svg" alt="Swachh Bharat" width="38" height="38" style="height:38px; width:auto;" title="Swachh Bharat Mission" loading="lazy" />
          <div class="official-badge-link" style="border-color: #10b981; color:#059669;">
            <span>🛡️</span>
            <span>GIGW 3.0</span>
          </div>
        </div>
      </div>

      <!-- 3. Primary Government Navigation Bar -->
      <nav class="govt-navbar" role="navigation" aria-label="Main Navigation">
        <ul class="govt-nav-menu">
          <li class="govt-nav-item">
            <a href="index.html" class="govt-nav-link ${page === 'index' || page === '' ? 'active' : ''}">
              <span>🏠 ${lang === 'hi' ? 'मुख्य पृष्ठ' : 'Home'}</span>
            </a>
          </li>
          <li class="govt-nav-item">
            <a href="dashboard.html" class="govt-nav-link ${page === 'dashboard' ? 'active' : ''}">
              <span>📊 ${lang === 'hi' ? 'राष्ट्रीय डैशबोर्ड' : 'National Dashboard'}</span>
            </a>
          </li>
          <li class="govt-nav-item">
            <a href="upload.html" class="govt-nav-link ${page === 'upload' ? 'active' : ''}">
              <span>📤 ${lang === 'hi' ? 'दस्तावेज ओसीआर' : 'OCR Ingestion'}</span>
              <span class="govt-nav-badge">New</span>
            </a>
          </li>
          <li class="govt-nav-item">
            <a href="javascript:void(0)" onclick="App.openDyutiChatbot(event)" class="govt-nav-link ${page === 'dyuti' || page === 'ask-kshoni' || page === 'ask-cmpdi' ? 'active' : ''}" title="Open Dyuti AI Floating Chatbot">
              <span><img src="assets/images/coal_lump.svg" alt="Coal" style="width:16px; height:16px; vertical-align:middle;" /> ${lang === 'hi' ? 'द्युति एआई चैटबॉट' : 'Dyuti AI Chatbot'}</span>
            </a>
          </li>
          <li class="govt-nav-item">
            <a href="reports.html" class="govt-nav-link ${page === 'reports' ? 'active' : ''}">
              <span>📄 ${lang === 'hi' ? 'जीआर रिपोर्ट जनरेटर' : 'GR Report Engine'}</span>
            </a>
          </li>
          <li class="govt-nav-item">
            <a href="visualization.html" class="govt-nav-link ${page === 'visualization' ? 'active' : ''}">
              <span>🗺️ ${lang === 'hi' ? '3डी भू-मॉडल' : '3D Geo-Viz'}</span>
            </a>
          </li>
          <li class="govt-nav-item">
            <a href="compliance.html" class="govt-nav-link ${page === 'compliance' ? 'active' : ''}">
              <span>✅ ${lang === 'hi' ? 'वैधानिक अनुपालन' : 'Statutory Compliance'}</span>
              <span class="govt-nav-badge">DGMS</span>
            </a>
          </li>
          <li class="govt-nav-item">
            <a href="database.html" class="govt-nav-link ${page === 'database' ? 'active' : ''}">
              <span>🗄️ ${lang === 'hi' ? 'मास्टर डेटाबेस व एआई रिपोर्ट' : 'Master Database & AI Report'}</span>
            </a>
          </li>
        </ul>
        <!-- FIX: Mobile hamburger button for nav collapse on small screens -->
        <button class="govt-mobile-menu-btn" aria-label="Toggle Navigation Menu"
          onclick="(function(){var m=document.querySelector('.govt-nav-menu');if(m)m.classList.toggle('open');})()">
          ☰
        </button>
      </nav>

      <!-- 4. Announcement Ticker -->
      <div class="govt-ticker-bar">
        <div class="govt-ticker-label">${lang === 'hi' ? 'नवीनतम सूचनाएं' : 'LATEST UPDATES'}</div>
        <div class="govt-ticker-content">
          <div class="govt-ticker-text">
            ${lang === 'hi' ? `
              📢 [कोयला मंत्रालय] ₹37,500 करोड़ की सतही कोयला गैसीकरण योजना के द्वितीय चरण के आवेदन प्रारंभ। • 📜 [DGMS आदेश] समस्त भूमिगत कोयला खदानों हेतु जलभराव अवरोधक ऑडिट पूर्ण करने का निर्देश। • ⛏️ [CMPDI UNFC] 14,520 बोरहोलों का डिजिटल पुनर्वर्गीकरण Kshoni AI पर लाइव।
            ` : `
              📢 [MINISTRY OF COAL] Phase-II applications open for ₹37,500 Cr Surface Coal Gasification Scheme. • 📜 [DGMS MANDATE] Hydrogeological Barrier Audit mandatory for underground coal mines. • ⛏️ [CMPDI UNFC] Digital re-classification of 14,520 boreholes live on Kshoni AI.
            `}
          </div>
        </div>
      </div>
    `;
  },

  // ---------- Official Government Footer (Matching Image 2 + Subsidiary Contacts + Social Media) ----------
  injectGovtFooter() {
    const footerMount = document.getElementById('govt-footer-mount');
    if (!footerMount) return;

    const lang = this.currentLang || 'en';

    footerMount.innerHTML = `
      <!-- Master Historical Database Callout Banner -->
      <div style="background: linear-gradient(135deg, #0b192c 0%, #1e3a8a 100%); color: #ffffff; padding: 24px 32px; border-top: 4px solid var(--color-gold); box-shadow: inset 0 2px 10px rgba(0,0,0,0.3);">
        <div style="max-width: 1240px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; gap: 20px; flex-wrap: wrap;">
          <div style="display: flex; align-items: center; gap: 16px;">
            <div style="width: 52px; height: 52px; border-radius: 12px; background: rgba(212, 168, 67, 0.2); border: 1px solid var(--color-gold); display: flex; align-items: center; justify-content: center; font-size: 1.8rem;">
              🗄️
            </div>
            <div>
              <h3 style="font-size: 1.15rem; font-weight: 800; color: #ffffff; margin: 0 0 4px 0;">
                ${lang === 'hi' ? 'राष्ट्रीय भू-वैज्ञानिक मास्टर डेटाबेस एवं एआई अंतिम रिपोर्ट हब (1975–2026)' : 'National Geological Master Database & AI Final Report Hub (1975–2026)'}
              </h3>
              <p style="font-size: 0.85rem; color: #cbd5e1; margin: 0;">
                ${lang === 'hi' ? '14,500+ बोरहोल डेटा खोजें, नया डेटा अपलोड करें, और संपूर्ण सार्वजनिक रिपोर्ट सीधे पीडीएफ या वर्ड में डाउनलोड करें।' : 'Explore 14,500+ historical borehole logs, upload new field data, export CSV datasets, or generate instant statutory AI final reports.'}
              </p>
            </div>
          </div>
          <div style="display: flex; gap: 12px;">
            <a href="database.html" class="btn btn-gold btn-sm" style="padding: 10px 20px; font-weight: 700;">
              🗄️ ${lang === 'hi' ? 'मास्टर डेटाबेस खोलें' : 'Open Master Database & Reports'} ➔
            </a>
          </div>
        </div>
      </div>

      <!-- Subsidiary & Ministry Contact Matrix & Social Links -->
      <div style="background: #09121d; color: #94a3b8; padding: 36px 24px; border-top: 1px solid #1e293b; font-size: 0.82rem;">
        <div style="max-width: 1240px; margin: 0 auto;">
          <div style="margin-bottom: 20px; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #1e293b; padding-bottom: 12px;">
            <h4 style="font-size: 0.95rem; font-weight: 800; color: #f8fafc; text-transform: uppercase; letter-spacing: 0.8px; margin: 0; display: flex; align-items: center; gap: 8px;">
              🏢 ${lang === 'hi' ? 'कोल इण्डिया सहायक कंपनियां एवं मंत्रालय संपर्क निर्देशिका' : 'CIL Subsidiaries & Ministry Contact Directory'}
            </h4>
            <span style="font-size: 0.78rem; color: var(--color-gold-light); font-weight: 600;">
              24x7 Nodal Helplines & Official Social Portals
            </span>
          </div>

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(270px, 1fr)); gap: 20px;">
            <!-- MoC & CIL HQ -->
            <div style="background: #0f172a; padding: 14px; border-radius: 8px; border: 1px solid #1e293b;">
              <div style="display:flex; align-items:center; gap:10px; margin-bottom:8px;">
                <img src="assets/images/emblem_india.svg" alt="MoC" style="height:32px; width:auto;" />
                <div>
                  <strong style="color:#f1f5f9; display:block;">Ministry of Coal (MoC)</strong>
                  <span style="font-size:0.75rem; color:#64748b;">Shastri Bhawan, New Delhi</span>
                </div>
              </div>
              <div style="line-height:1.6; margin-bottom:8px;">
                <div>📞 Helpline: <strong style="color:#e2e8f0;">011-23384214</strong> / <strong style="color:#e2e8f0;">1800-11-2026</strong></div>
                <div>✉️ Email: <a href="mailto:coal-moc@nic.in" style="color:#38bdf8; text-decoration:none;">coal-moc@nic.in</a></div>
              </div>
              <div style="display:flex; gap:8px; border-top:1px solid #1e293b; padding-top:8px;">
                <a href="https://facebook.com" target="_blank" style="color:#60a5fa;" title="Facebook">🌐 FB</a>
                <a href="https://x.com" target="_blank" style="color:#38bdf8;" title="Twitter/X">🐦 X</a>
                <a href="https://instagram.com" target="_blank" style="color:#f472b6;" title="Instagram">📸 Insta</a>
                <a href="https://youtube.com" target="_blank" style="color:#f87171;" title="YouTube">▶️ YouTube</a>
              </div>
            </div>

            <!-- CMPDI HQ -->
            <div style="background: #0f172a; padding: 14px; border-radius: 8px; border: 1px solid #1e293b;">
              <div style="display:flex; align-items:center; gap:10px; margin-bottom:8px;">
                <img src="assets/images/cmpdi_logo.svg" alt="CMPDI HQ" style="height:32px; width:auto;" />
                <div>
                  <strong style="color:#f1f5f9; display:block;">CMPDI HQ Ranchi</strong>
                  <span style="font-size:0.75rem; color:#64748b;">Gondwana Place, Kanke Road</span>
                </div>
              </div>
              <div style="line-height:1.6; margin-bottom:8px;">
                <div>📞 Phone: <strong style="color:#e2e8f0;">+91-651-2230001</strong> / <strong style="color:#e2e8f0;">2231851</strong></div>
                <div>✉️ Nodal Email: <a href="mailto:gmm.cmpdi@coalindia.in" style="color:#38bdf8; text-decoration:none;">gmm.cmpdi@coalindia.in</a></div>
              </div>
              <div style="display:flex; gap:8px; border-top:1px solid #1e293b; padding-top:8px;">
                <a href="https://facebook.com" target="_blank" style="color:#60a5fa;">🌐 FB</a>
                <a href="https://x.com" target="_blank" style="color:#38bdf8;">🐦 X</a>
                <a href="https://linkedin.com" target="_blank" style="color:#818cf8;">💼 LinkedIn</a>
              </div>
            </div>

            <!-- Coal India HQ -->
            <div style="background: #0f172a; padding: 14px; border-radius: 8px; border: 1px solid #1e293b;">
              <div style="display:flex; align-items:center; gap:10px; margin-bottom:8px;">
                <img src="assets/images/coal_india_logo.svg" alt="Coal India" style="height:32px; width:auto;" />
                <div>
                  <strong style="color:#f1f5f9; display:block;">Coal India Limited (CIL HQ)</strong>
                  <span style="font-size:0.75rem; color:#64748b;">Action Area 1A, Rajarhat, Kolkata</span>
                </div>
              </div>
              <div style="line-height:1.6; margin-bottom:8px;">
                <div>📞 Helpline: <strong style="color:#e2e8f0;">+91-33-2324-5555</strong></div>
                <div>✉️ Desk Email: <a href="mailto:helpline@coalindia.in" style="color:#38bdf8; text-decoration:none;">helpline@coalindia.in</a></div>
              </div>
              <div style="display:flex; gap:8px; border-top:1px solid #1e293b; padding-top:8px;">
                <a href="https://facebook.com" target="_blank" style="color:#60a5fa;">🌐 FB</a>
                <a href="https://x.com" target="_blank" style="color:#38bdf8;">🐦 X</a>
                <a href="https://instagram.com" target="_blank" style="color:#f472b6;">📸 Insta</a>
                <a href="https://youtube.com" target="_blank" style="color:#f87171;">▶️ YouTube</a>
              </div>
            </div>

            <!-- SECL & BCCL -->
            <div style="background: #0f172a; padding: 14px; border-radius: 8px; border: 1px solid #1e293b;">
              <div style="display:flex; align-items:center; gap:10px; margin-bottom:8px;">
                <span style="font-size:1.4rem;">⛏️</span>
                <div>
                  <strong style="color:#f1f5f9; display:block;">SECL Bilaspur & BCCL Dhanbad</strong>
                  <span style="font-size:0.75rem; color:#64748b;">Chhattisgarh & Jharkhand Divisions</span>
                </div>
              </div>
              <div style="line-height:1.6; margin-bottom:8px;">
                <div>📞 SECL: <strong style="color:#e2e8f0;">07752-246371</strong> | BCCL: <strong style="color:#e2e8f0;">0326-2230190</strong></div>
                <div>✉️ SECL Email: <a href="mailto:secl.nodal@nic.in" style="color:#38bdf8; text-decoration:none;">secl.nodal@nic.in</a></div>
              </div>
              <div style="display:flex; gap:8px; border-top:1px solid #1e293b; padding-top:8px;">
                <a href="https://facebook.com" target="_blank" style="color:#60a5fa;">🌐 FB</a>
                <a href="https://x.com" target="_blank" style="color:#38bdf8;">🐦 X</a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Official Government Partner Carousel Bar (Matching Image 2) -->
      <div class="govt-partner-carousel-section" style="background:#F8FAFC; border-top:1px solid #E2E8F0; padding:16px 24px;">
        <div style="max-width:1200px; margin:0 auto; display:flex; align-items:center; gap:16px;">
          <button onclick="App.scrollPartnerCarousel(-1)" class="carousel-nav-btn" style="background:#0F172A; color:#FFF; border:none; padding:8px 12px; border-radius:4px; cursor:pointer; font-weight:700;">❮</button>
          
          <div id="partner-carousel-track" style="flex:1; display:flex; gap:16px; overflow-x:auto; scroll-behavior:smooth; padding:4px 0;">
            <a href="https://shebox.wcd.gov.in/" target="_blank" class="carousel-partner-card" title="SHe-Box Sexual Harassment Complaint Portal">
              <img src="assets/images/she_box_logo.svg" alt="SHe-Box Portal" style="height:48px; width:auto; border-radius:4px; box-shadow:0 2px 4px rgba(0,0,0,0.1);" />
            </a>
            <a href="https://www.indiacode.nic.in/" target="_blank" class="carousel-partner-card" title="India Code Digital Repository of All Acts">
              <img src="assets/images/india_code_logo.svg" alt="India Code" style="height:48px; width:auto; border-radius:4px; box-shadow:0 2px 4px rgba(0,0,0,0.1);" />
            </a>
            <a href="https://pgportal.gov.in/" target="_blank" class="carousel-partner-card" title="CPGRAMS Public Grievance Redressal">
              <img src="assets/images/cpgrams_logo.svg" alt="CPGRAMS" style="height:48px; width:auto; border-radius:4px; box-shadow:0 2px 4px rgba(0,0,0,0.1);" />
            </a>
            <a href="https://services.india.gov.in/" target="_blank" class="carousel-partner-card" title="National Government Services Portal">
              <img src="assets/images/services_india_logo.svg" alt="National Government Services Portal" style="height:48px; width:auto; border-radius:4px; box-shadow:0 2px 4px rgba(0,0,0,0.1);" />
            </a>
            <a href="https://voters.eci.gov.in/" target="_blank" class="carousel-partner-card" title="Online Services for Voters - ECI">
              <img src="assets/images/voters_eci_logo.svg" alt="Online Services for Voters" style="height:48px; width:auto; border-radius:4px; box-shadow:0 2px 4px rgba(0,0,0,0.1);" />
            </a>
            <a href="https://www.mygov.in/" target="_blank" class="carousel-partner-card" title="MyGov Citizen Engagement Portal">
              <img src="assets/images/mygov_logo.svg" alt="MyGov" style="height:48px; width:auto; border-radius:4px; box-shadow:0 2px 4px rgba(0,0,0,0.1);" />
            </a>
          </div>

          <button onclick="App.scrollPartnerCarousel(1)" class="carousel-nav-btn" style="background:#0F172A; color:#FFF; border:none; padding:8px 12px; border-radius:4px; cursor:pointer; font-weight:700;">❯</button>
          <button onclick="App.showToast('Carousel Auto-scroll Paused', 'info')" class="carousel-nav-btn" style="background:#334155; color:#FFF; border:none; padding:8px 12px; border-radius:4px; cursor:pointer; font-weight:700;" title="Pause/Play Carousel">❚❚</button>
        </div>
      </div>

      <!-- Policy Navigation Bar (Matching Image 2) -->
      <div style="background:#1E293B; border-top:1px solid #334155; padding:12px 24px; text-align:center; font-size:0.85rem; color:#CBD5E1;">
        <a href="#policy" onclick="App.showToast('Website Policy Document', 'info')" style="color:#F1F5F9; text-decoration:none; margin:0 8px;">Website Policy</a> | 
        <a href="#help" onclick="App.showToast('Help & Support Portal', 'info')" style="color:#F1F5F9; text-decoration:none; margin:0 8px;">Help</a> | 
        <a href="#contact" onclick="App.showToast('Contact CMPDI & Ministry of Coal', 'info')" style="color:#F1F5F9; text-decoration:none; margin:0 8px;">Contact Us</a> | 
        <a href="#terms" onclick="App.showToast('Terms and Conditions', 'info')" style="color:#F1F5F9; text-decoration:none; margin:0 8px;">Terms and Conditions</a> | 
        <a href="#feedback" onclick="App.showToast('Submit Feedback', 'info')" style="color:#F1F5F9; text-decoration:none; margin:0 8px;">Feedback</a> | 
        <a href="#manager" onclick="App.showToast('Web Information Manager Details', 'info')" style="color:#F1F5F9; text-decoration:none; margin:0 8px;">Web Information Manager</a> | 
        <a href="#disclaimer" onclick="App.showToast('Legal Disclaimer Statement', 'info')" style="color:#F1F5F9; text-decoration:none; margin:0 8px;">Disclaimer</a>
      </div>

      <!-- Visitor Counter Bar (Matching Image 2) -->
      <div style="background:#0F172A; padding:8px 24px; text-align:center; font-size:0.82rem; color:#94A3B8; border-top:1px solid #1E293B;">
        Total Visitors: <strong style="color:#D4A843; font-family:var(--font-mono);">0</strong> | Since: <strong style="color:#10B981; font-family:var(--font-mono);">07/22/2021 - 14:47</strong>
      </div>

      <!-- Footer Ownership & NIC Metadata (Matching Image 2) -->
      <footer style="background:#020617; padding:20px 24px; color:#64748B; font-size:0.8rem; border-top:1px solid #0F172A;">
        <div style="max-width:1200px; margin:0 auto; display:flex; align-items:center; justify-content:center; gap:16px; flex-wrap:wrap; text-align:center;">
          <img src="assets/images/cqw_logo.svg" alt="CQW 3.0 Logo" style="height:38px; width:auto;" title="Certified Quality Website 3.0" />
          <div>
            <div style="color:#E2E8F0; font-weight:600;">Website Content Owned by <strong>Ministry of Coal, Government Of India</strong></div>
            <div style="color:#94A3B8; margin-top:2px;">Designed, Developed and Hosted by <strong>National Informatics Centre (NIC)</strong></div>
            <div style="color:#64748B; margin-top:2px; font-size:0.75rem;">Last Updated: <strong>08 Sep 2026</strong></div>
          </div>
        </div>
      </footer>
    `;
  },

  scrollPartnerCarousel(dir) {
    const track = document.getElementById('partner-carousel-track');
    if (track) {
      track.scrollBy({ left: dir * 220, behavior: 'smooth' });
    }
  },

  // ---------- Sidebar Builder (for dashboard/workspace view) ----------
  buildSidebar(activePage) {
    return `
    <div class="sidebar" id="sidebar">
      <div class="sidebar-header" style="padding:16px 20px; border-bottom:1px solid var(--color-border); background:var(--color-bg-tertiary); display:flex; align-items:center; gap:12px;">
        <img src="assets/images/kshoni_logo.svg" alt="Kshoni AI Emblem" style="width:36px; height:36px; filter: drop-shadow(0 2px 4px rgba(212,168,67,0.4));" />
        <div>
          <span style="font-size:0.95rem; font-weight:700; color:var(--color-text-primary); display:flex; align-items:center; gap:6px;">
            Kshoni AI <img src="assets/images/kshoni_logo.svg" alt="logo" style="height:16px; width:auto;" />
          </span>
          <span style="font-size:0.72rem; color:var(--color-text-gold); display:block;">CMPDI • CIL Portal</span>
        </div>
      </div>
      
      <nav class="sidebar-nav" style="padding:14px 10px; flex:1; overflow-y:auto;">
        <div style="font-size:0.68rem; font-weight:700; color:var(--color-text-tertiary); text-transform:uppercase; letter-spacing:1px; padding:8px 12px 4px 12px;">
          मुख्य मेनू | Main Menu
        </div>
        <a href="dashboard.html" class="nav-item ${activePage === 'dashboard' ? 'active' : ''}">
          <span>📊</span>
          <span>राष्ट्रीय डैशबोर्ड (Dashboard)</span>
        </a>
        <a href="upload.html" class="nav-item ${activePage === 'upload' ? 'active' : ''}">
          <span>📤</span>
          <span>दस्तावेज अपलोड (OCR Upload)</span>
          <span class="nav-badge">3</span>
        </a>
        <a href="javascript:void(0)" onclick="App.openDyutiChatbot(event)" class="nav-item ${activePage === 'dyuti' || activePage === 'ask-kshoni' ? 'active' : ''}" title="Open Dyuti AI Floating Chatbot">
          <span><img src="assets/images/coal_lump.svg" alt="Coal" style="width:18px; height:18px; vertical-align:middle;" /></span>
          <span>द्युति चैटबॉट (Dyuti Chatbot)</span>
        </a>
        <a href="reports.html" class="nav-item ${activePage === 'reports' ? 'active' : ''}">
          <span>📄</span>
          <span>जीआर रिपोर्ट जनरेटर (Reports)</span>
        </a>
        <a href="visualization.html" class="nav-item ${activePage === 'visualization' ? 'active' : ''}">
          <span>🗺️</span>
          <span>3D भू-मॉडल (3D Strata)</span>
        </a>
        <a href="compliance.html" class="nav-item ${activePage === 'compliance' ? 'active' : ''}">
          <span>✅</span>
          <span>वैधानिक अनुपालन (Compliance)</span>
          <span class="nav-badge">DGMS</span>
        </a>
        <a href="database.html" class="nav-item ${activePage === 'database' ? 'active' : ''}">
          <span>🗄️</span>
          <span>मास्टर डेटाबेस व एआई रिपोर्ट (Master Database & AI Report)</span>
        </a>
      </nav>
      
      <div class="sidebar-footer" style="padding:14px; border-top:1px solid var(--color-border); background:var(--color-bg-tertiary);">
        <div style="display:flex; align-items:center; gap:10px;">
          <div style="width:32px; height:32px; border-radius:50%; background:var(--color-gold); color:#000; font-weight:700; display:flex; align-items:center; justify-content:center; font-size:0.8rem;">
            ${this.currentUser ? this.currentUser.avatar : 'RK'}
          </div>
          <div>
            <span style="font-size:0.82rem; font-weight:600; color:var(--color-text-primary); display:block;">${this.currentUser ? this.currentUser.name : 'Dr. Rajesh Kumar'}</span>
            <span style="font-size:0.7rem; color:var(--color-text-tertiary); display:block;">${this.currentUser ? this.currentUser.role : 'Chief Geologist'}</span>
          </div>
        </div>
      </div>
    </div>`;
  },

  buildPageHeader(title, subtitle, rightContent = '') {
    return `
    <header class="page-header" style="padding:16px 28px; background:var(--color-bg-secondary); border-bottom:1px solid var(--color-border); display:flex; justify-content:space-between; align-items:center;">
      <div style="display:flex; align-items:center; gap:12px;">
        <button class="mobile-menu-toggle" onclick="document.getElementById('sidebar')?.classList.toggle('open')" style="background:none; border:none; font-size:1.3rem; color:var(--color-text-primary); cursor:pointer;">☰</button>
        <div>
          <h1 class="page-title" style="font-size:1.25rem; font-weight:800; color:var(--color-text-primary); margin:0;">
            ${title}
          </h1>
          ${subtitle ? `<p style="font-size:0.8rem; color:var(--color-text-secondary); margin-top:2px; margin-bottom:0;">${subtitle}</p>` : ''}
        </div>
      </div>
      <div style="display:flex; align-items:center; gap:12px;">
        ${rightContent}
        <div style="position:relative;">
          <input type="text" placeholder="Search data/boreholes..." style="padding:6px 12px 6px 30px; font-size:0.8rem; border-radius:4px; border:1px solid var(--color-border); background:var(--color-bg-input); color:var(--color-text-primary); width:200px;" />
          <span style="position:absolute; left:10px; top:50%; transform:translateY(-50%); font-size:0.75rem; color:var(--color-text-tertiary);">🔍</span>
        </div>
        <button class="btn btn-secondary btn-sm" onclick="App.logout()" title="Logout">🚪 Logout</button>
      </div>
    </header>`;
  },

  setupToastContainer() {
    if (!document.querySelector('.toast-container')) {
      const container = document.createElement('div');
      container.className = 'toast-container';
      document.body.appendChild(container);
      this.toastContainer = container;
    } else {
      this.toastContainer = document.querySelector('.toast-container');
    }
  },

  showToast(message, type = 'info', duration = 4000) {
    if (!this.toastContainer) this.setupToastContainer();
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    const icons = { success: '✓', error: '✕', warning: '⚠', info: 'ℹ' };
    
    toast.innerHTML = `
      <span style="font-size: 1.1rem;">${icons[type] || 'ℹ'}</span>
      <span class="toast-message">${message}</span>
      <span class="toast-close" onclick="this.parentElement.remove()">✕</span>
    `;
    this.toastContainer.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(20px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, duration);
  },

  animateCounter(element, target, duration = 2000, suffix = '') {
    if (!element) return;
    const start = 0;
    const startTime = performance.now();
    const updateCounter = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(start + (target - start) * eased);
      element.textContent = current.toLocaleString('en-IN') + suffix;
      if (progress < 1) requestAnimationFrame(updateCounter);
    };
    requestAnimationFrame(updateCounter);
  },

  getIndiaMapSVG() {
    return `
    <svg viewBox="0 0 500 600" xmlns="http://www.w3.org/2000/svg" class="india-map-svg" style="width:100%; height:auto;">
      <path d="M200,50 L280,45 L320,60 L350,80 L380,95 L390,120 L400,150 L410,180 L420,210 L430,250 L425,290 L415,330 L400,370 L380,400 L360,430 L340,460 L310,490 L280,510 L250,530 L230,545 L220,550 L200,540 L180,520 L160,500 L140,470 L120,440 L110,410 L100,380 L95,350 L90,320 L85,290 L90,260 L100,230 L110,200 L120,170 L130,140 L140,120 L160,90 L180,65 Z" 
            fill="var(--color-bg-tertiary)" stroke="var(--color-border-gold)" stroke-width="2"/>
      ${SUBSIDIARIES.map(s => `
        <g class="coalfield-dot" data-subsidiary="${s.id}" style="cursor:pointer;" onclick="App.showToast('Selected ${s.shortName} (${s.name})', 'info')">
          <circle cx="${this._mapLngToX(s.lng)}" cy="${this._mapLatToY(s.lat)}" r="14" fill="${s.color}" opacity="0.25">
            <animate attributeName="r" values="14;20;14" dur="3s" repeatCount="indefinite"/>
          </circle>
          <circle cx="${this._mapLngToX(s.lng)}" cy="${this._mapLatToY(s.lat)}" r="7" fill="${s.color}" stroke="#ffffff" stroke-width="1.5"/>
          <text x="${this._mapLngToX(s.lng)}" y="${this._mapLatToY(s.lat) - 14}" text-anchor="middle" fill="var(--color-text-primary)" font-size="11" font-weight="700" font-family="Inter">${s.shortName}</text>
        </g>
      `).join('')}
    </svg>`;
  },

  _mapLngToX(lng) { return ((lng - 76) / (96 - 76)) * 400 + 50; },
  _mapLatToY(lat) { return ((32 - lat) / (32 - 8)) * 500 + 50; },

  // ---------- Backend Integration & Export Engine ----------
  async apiFetch(endpoint, options = {}) {
    const apiBase = 'http://127.0.0.1:8000/api';
    try {
      const response = await fetch(`${apiBase}${endpoint}`, options);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch (err) {
      console.warn(`[Kshoni API] Offline fallback for ${endpoint}:`, err);
      return null; // Signals fallback to local dataset
    }
  },

  downloadCSV(filename, csvText) {
    const blob = new Blob([csvText], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    this.showToast(`Downloaded CSV export: ${filename}`, 'success');
  },

  async exportDatasetCSV(type) {
    this.showToast(`Requesting CSV export for ${type.toUpperCase()} dataset...`, 'info');
    try {
      const response = await fetch('http://127.0.0.1:8000/api/export/csv', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dataset_type: type })
      });
      if (response.ok) {
        const text = await response.text();
        this.downloadCSV(`Kshoni_${type.toUpperCase()}_Export.csv`, text);
        return;
      }
    } catch (e) {
      console.warn('API CSV export offline, using client-side generator');
    }

    // Client-side fallback
    if (type === 'reserves') {
      let csv = 'Subsidiary Code,Subsidiary Name,Proved 111 (BT),Indicated 122 (BT),Inferred 333 (BT),Stripping Ratio (m3/T)\n';
      SUBSIDIARIES.forEach(s => {
        csv += `${s.id},"${s.name}",${s.reserves.proved},${s.reserves.indicated},${s.reserves.inferred},${s.strippingRatio}\n`;
      });
      this.downloadCSV('Kshoni_UNFC_Reserves_Local.csv', csv);
    } else if (type === 'compliance') {
      let csv = 'Audit ID,Subsidiary,Mine Block,Authority,Category,Score (%),Status,Remarks\n';
      csv += 'CHK-MOEFCC-01,BCCL,Jharia Block IX OC,MoEFCC,Environmental Clearance,96.5,PASS,AAQM Parameters normal\n';
      csv += 'CHK-DGMS-02,SECL,Gevra Expansion OC,DGMS,Slope Stability & Bench Safety,98.2,PASS,Radar slope monitoring online\n';
      csv += 'CHK-MOC-03,MCL,Talcher Kaniha OC,Ministry of Coal,Star Rating of Mines,94.0,PASS,5-Star Certified\n';
      csv += 'CHK-DGMS-04,WCL,Pench Kanhan Underground,DGMS,Underground Ventilation,78.4,WARN,Telemetry calibration log due\n';
      csv += 'CHK-MOEFCC-05,ECL,Rajmahal OC Project,MoEFCC,Forest Clearance Stage II,45.0,FAIL,Land transfer documentation delayed\n';
      this.downloadCSV('Kshoni_Compliance_Audit_Local.csv', csv);
    }
  },

  exportPDF(elementId, filename = 'Kshoni_Statutory_Report.pdf') {
    this.showToast('Generating high-resolution statutory PDF...', 'info');
    setTimeout(() => {
      window.print();
    }, 600);
  },

  // ---------- Floating Dyuti AI Chatbot Widget (द्युति) ----------
  injectFloatingDyutiWidget() {
    if (document.getElementById('dyuti-floating-container')) return;

    const container = document.createElement('div');
    container.id = 'dyuti-floating-container';
    container.innerHTML = `
      <!-- Floating Call-to-Action Bubble -->
      <div id="dyuti-welcome-bubble" onclick="App.toggleDyutiDrawer()" style="position:fixed !important; bottom:98px !important; right:24px !important; z-index:2147483646 !important; background:linear-gradient(135deg,#0A1628,#1E3A5F) !important; border:1px solid #D4A843 !important; border-radius:12px !important; padding:8px 14px !important; color:#F8FAFC !important; box-shadow:0 8px 24px rgba(0,0,0,0.6),0 0 15px rgba(212,168,67,0.3) !important; cursor:pointer !important; font-size:0.8rem !important; display:flex !important; align-items:center !important; gap:8px !important; transition:transform 0.2s ease;">
        <span style="font-size:1.1rem;">👋</span>
        <span><strong>Dyuti AI is live!</strong> Ask any geological query</span>
        <span style="color:#D4A843; font-weight:800; margin-left:4px;">Chat ➔</span>
      </div>

      <!-- Floating Trigger Button in Right Bottom Corner -->
      <div class="dyuti-float-trigger-wrapper" id="dyuti-float-trigger-wrapper" style="position:fixed !important; bottom:24px !important; right:24px !important; z-index:2147483647 !important; display:flex !important; align-items:center !important; gap:10px !important;">
        <div class="dyuti-float-pill" onclick="App.toggleDyutiDrawer()" title="Click to chat with Dyuti AI (द्युति)" style="cursor:pointer; display:flex; align-items:center; gap:6px;">
          <span style="font-size:1.1rem;">💬</span>
          <span>द्युति AI • Chat</span>
        </div>
        <button class="dyuti-float-trigger" onclick="App.toggleDyutiDrawer()" title="Dyuti AI Chatbot (द्युति चैटबॉट)" aria-label="Open Dyuti AI Chatbot" style="cursor:pointer;">
          <img src="assets/images/coal_lump.svg" alt="Dyuti Coal Icon" style="width:36px; height:36px; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.5));" />
          <span class="dyuti-float-badge">LIVE</span>
        </button>
      </div>

      <!-- Floating Drawer Dialog in Right Bottom Corner -->
      <div class="dyuti-float-drawer" id="dyuti-floating-drawer" role="dialog" aria-label="Dyuti AI Chat Window" style="position:fixed !important; bottom:96px !important; right:24px !important; z-index:2147483647 !important;">
        <div class="dyuti-drawer-header">
          <div style="display:flex; align-items:center; gap:10px;">
            <div style="width:32px; height:32px; background:#0F172A; border:1px solid #D4A843; border-radius:50%; display:flex; align-items:center; justify-content:center; flex-shrink:0;">
              <img src="assets/images/coal_lump.svg" alt="Dyuti" style="width:18px; height:18px;" />
            </div>
            <div>
              <div style="font-weight:700; font-size:0.92rem; color:#FFFFFF;">Dyuti AI (द्युति)</div>
              <div style="font-size:0.70rem; color:#10B981; font-weight:600; display:flex; align-items:center; gap:4px;">
                <span style="width:6px; height:6px; background:#10B981; border-radius:50%; display:inline-block;"></span> Online • Assistant
              </div>
            </div>
          </div>
          <div style="display:flex; align-items:center; gap:8px;">
            <button onclick="App.openAISettingsModal()" style="background:none; border:none; color:#94A3B8; font-size:0.85rem; cursor:pointer; padding:4px 6px;" title="AI Model & OpenRouter Key Settings">⚙️</button>
            <button onclick="App.clearDyutiChat('floating-chat-messages')" style="background:none; border:none; color:#94A3B8; font-size:0.85rem; cursor:pointer; padding:4px 6px;" title="Clear conversation">🗑️</button>
            <button onclick="App.toggleDyutiDrawer()" style="background:none; border:none; color:#94A3B8; font-size:1.2rem; cursor:pointer; padding:2px 6px; line-height:1;" title="Close">✕</button>
          </div>
        </div>

        <div class="dyuti-drawer-body" id="floating-chat-messages">
          <div class="chat-msg assistant">
            <div class="chat-msg-avatar">
              <img src="assets/images/coal_lump.svg" alt="Dyuti" style="width:18px; height:18px;" />
            </div>
            <div style="flex:1; min-width:0;">
              <div class="chat-msg-bubble">
                Namaste! I am <strong>Dyuti AI</strong>, your geological chatbot for CMPDI & Ministry of Coal. How can I help you today?
              </div>
            </div>
          </div>
        </div>

        <div id="floating-typing-indicator" style="display: none; padding: 6px 14px; font-size: 0.78rem; color: var(--color-gold-light);" class="flex align-center gap-xs">
          <span class="loading-spinner"></span> <span>Dyuti is thinking...</span>
        </div>

        <div class="dyuti-drawer-footer">
          <button class="btn btn-ghost btn-icon" style="padding:6px 8px; font-size:0.95rem;" onclick="App.simulateDyutiVoice('floating-chat-input')" title="Voice Query">🎙️</button>
          <input type="text" class="chat-input" id="floating-chat-input" placeholder="Type a message..." onkeydown="if(event.key==='Enter'){event.preventDefault();App.sendDyutiMessage('floating-chat-messages','floating-chat-input');}">
          <button class="btn btn-primary btn-sm" style="padding:8px 14px; font-weight:600;" onclick="App.sendDyutiMessage('floating-chat-messages','floating-chat-input')">Send</button>
        </div>
      </div>
    `;

    document.body.appendChild(container);

    // If on full-page dyuti.html, suppress the floating duplicate widget
    if (window.location.pathname.includes('dyuti.html')) {
      container.style.display = 'none';
      return;
    }

    // Auto-open if query parameter open_dyuti=true
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('open_dyuti') === 'true') {
      setTimeout(() => App.openDyutiChatbot(), 300);
    }
  },

  openDyutiChatbot(e) {
    if (e && e.preventDefault) e.preventDefault();
    const drawer = document.getElementById('dyuti-floating-drawer');
    const bubble = document.getElementById('dyuti-welcome-bubble');
    if (bubble) bubble.style.display = 'none';
    if (drawer) {
      drawer.classList.add('active');
      const input = document.getElementById('floating-chat-input');
      if (input) setTimeout(() => input.focus(), 150);
      App.showToast('Dyuti AI Chatbot is ready in the bottom-right corner! 💬', 'info');
    }
  },

  toggleDyutiDrawer() {
    const drawer = document.getElementById('dyuti-floating-drawer');
    const bubble = document.getElementById('dyuti-welcome-bubble');
    if (bubble) bubble.style.display = 'none';
    if (drawer) {
      drawer.classList.toggle('active');
      if (drawer.classList.contains('active')) {
        const input = document.getElementById('floating-chat-input');
        if (input) setTimeout(() => input.focus(), 150);
      }
    }
  },

  // ---------- Full Dyuti Messaging Engine (Smart Multi-Container Resolution) ----------
  sendDyutiMessage(containerId, inputId) {
    // 1. Resolve input element intelligently
    let input = null;
    if (inputId) {
      input = document.getElementById(inputId);
    }
    if (!input || !input.value.trim()) {
      const activeEl = document.activeElement;
      const floatInput = document.getElementById('floating-chat-input');
      const pageInput = document.getElementById('chat-user-input');

      if (activeEl && (activeEl === floatInput || activeEl === pageInput) && activeEl.value.trim()) {
        input = activeEl;
      } else if (floatInput && floatInput.value.trim()) {
        input = floatInput;
      } else if (pageInput && pageInput.value.trim()) {
        input = pageInput;
      } else {
        input = floatInput || pageInput;
      }
    }
    if (!input) return;

    const query = input.value.trim();
    if (!query) return;

    // 2. Resolve container element intelligently
    let container = null;
    if (containerId) {
      container = document.getElementById(containerId);
    }
    if (!container) {
      if (input.id === 'floating-chat-input') {
        container = document.getElementById('floating-chat-messages');
      } else {
        container = document.getElementById('chat-messages') || document.getElementById('floating-chat-messages');
      }
    }
    if (!container) return;

    // 3. Append user message
    this.appendDyutiMessage('user', query, container.id);
    input.value = '';

    // 4. Show typing indicator in the active area
    const indicator = input.id === 'floating-chat-input'
      ? document.getElementById('floating-typing-indicator')
      : (document.getElementById('typing-indicator') || document.getElementById('floating-typing-indicator'));
    if (indicator) indicator.style.display = 'flex';

    // 5. Scroll container to bottom
    container.scrollTop = container.scrollHeight;

    // Check if OpenRouter Live Mode is active
    const isLive = localStorage.getItem('kshoni_openrouter_live') === 'true';
    const apiKey = localStorage.getItem('kshoni_openrouter_key') || '';
    const model = localStorage.getItem('kshoni_openrouter_model') || 'meta-llama/llama-3.2-3b-instruct:free';

    if (isLive && apiKey) {
      if (indicator) {
        const textSpan = indicator.querySelector('span:last-child');
        if (textSpan) textSpan.textContent = `Consulting OpenRouter Live AI (${model.split('/')[1] || model})...`;
      }

      fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, model, apiKey })
      })
      .then(res => res.json())
      .then(data => {
        if (indicator) indicator.style.display = 'none';
        if (data && data.success && data.response) {
          const formatted = this.formatDyutiMarkdown(data.response);
          const liveBadge = `
            <div style="display:inline-flex; align-items:center; gap:5px; font-size:0.72rem; color:var(--color-emerald); background:rgba(16,185,129,0.12); padding:2px 8px; border-radius:4px; margin-bottom:8px; font-family:var(--font-mono); border:1px solid rgba(16,185,129,0.25);">
              <span>⚡ Live LLM:</span> <strong>${data.model || model}</strong>
            </div>
          `;
          this.appendDyutiMessage('assistant', liveBadge + formatted, container.id);
        } else {
          // Graceful fallback to local verified knowledge base
          const aiData = this.getDyutiAIResponse(query);
          const fallbackBadge = `
            <div style="display:inline-flex; align-items:center; gap:5px; font-size:0.72rem; color:var(--color-gold); background:rgba(212,168,67,0.12); padding:2px 8px; border-radius:4px; margin-bottom:8px; border:1px solid rgba(212,168,67,0.25);">
              <span>🟡 Offline Fallback:</span> <span>CMPDI Knowledge Base</span>
            </div>
          `;
          this.appendDyutiMessage('assistant', fallbackBadge + aiData.html, container.id);
        }
        container.scrollTop = container.scrollHeight;
      })
      .catch(err => {
        if (indicator) indicator.style.display = 'none';
        const aiData = this.getDyutiAIResponse(query);
        this.appendDyutiMessage('assistant', aiData.html, container.id);
        container.scrollTop = container.scrollHeight;
      });
      return;
    }

    // Default offline local knowledge base response
    setTimeout(() => {
      if (indicator) indicator.style.display = 'none';
      const aiData = this.getDyutiAIResponse(query);
      this.appendDyutiMessage('assistant', aiData.html, container.id);
      container.scrollTop = container.scrollHeight;
    }, 350);
  },

  sendDyutiSuggested(text, containerId, inputId) {
    let resolvedInput = null;
    if (inputId) resolvedInput = document.getElementById(inputId);
    if (!resolvedInput) {
      resolvedInput = document.getElementById('floating-chat-input') || document.getElementById('chat-user-input');
    }
    let resolvedContainer = null;
    if (containerId) resolvedContainer = document.getElementById(containerId);
    if (!resolvedContainer) {
      resolvedContainer = document.getElementById('floating-chat-messages') || document.getElementById('chat-messages');
    }
    if (resolvedInput && resolvedContainer) {
      resolvedInput.value = text;
      this.sendDyutiMessage(resolvedContainer.id, resolvedInput.id);
    }
  },

  simulateDyutiVoice(inputId = 'floating-chat-input') {
    this.showToast('Listening to voice query... Speak now 🎙️', 'info');
    setTimeout(() => {
      const input = document.getElementById(inputId);
      if (input) {
        input.value = 'What is the proved coal reserve in BCCL Jharia?';
        this.showToast('Voice captured: "What is the proved coal reserve in BCCL Jharia?"', 'success');
        this.sendDyutiMessage('floating-chat-messages', inputId);
      }
    }, 1400);
  },

  clearDyutiChat(containerId = 'floating-chat-messages') {
    const container = document.getElementById(containerId);
    if (container) {
      container.innerHTML = `
        <div class="chat-msg assistant">
          <div class="chat-msg-avatar">
            <img src="assets/images/coal_lump.svg" alt="Dyuti" style="width:18px; height:18px;" />
          </div>
          <div style="flex: 1; min-width: 0;">
            <div class="chat-msg-bubble">
              Namaste! I am <strong>Dyuti AI</strong>. How can I help you with geological data today?
            </div>
          </div>
        </div>
      `;
    }
    this.showToast('Chat cleared', 'info');
  },

  appendDyutiMessage(role, content, containerId = 'floating-chat-messages') {
    const container = document.getElementById(containerId);
    if (!container) return;

    const msgDiv = document.createElement('div');
    msgDiv.className = `chat-msg ${role}`;

    const avatarHtml = role === 'user'
      ? (this.currentUser ? this.currentUser.avatar : 'U')
      : `<img src="assets/images/coal_lump.svg" alt="Dyuti" style="width:18px; height:18px;" />`;

    msgDiv.innerHTML = `
      <div class="chat-msg-avatar" style="${role === 'assistant' ? 'background: #0F172A; border: 1px solid #D4A843;' : ''}">${avatarHtml}</div>
      <div style="flex: 1; min-width: 0;">
        <div class="chat-msg-bubble">${content}</div>
      </div>
    `;

    container.appendChild(msgDiv);
    container.scrollTop = container.scrollHeight;
  },

  formatDyutiMarkdown(text) {
    if (typeof marked !== 'undefined') {
      try { return marked.parse(text); } catch (e) {}
    }
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/^\* (.*?)$/gm, '<div style="margin:2px 0 2px 8px;">• $1</div>')
      .replace(/^(\d+)\. (.*?)$/gm, '<div style="margin:2px 0 2px 8px;">$1. $2</div>')
      .replace(/\n\n/g, '<br><br>')
      .replace(/\n/g, '<br>');
  },

  getDyutiAIResponse(query) {
    const qLower = query.toLowerCase();

    const kb = [
      {
        keywords: ['hello', 'hi', 'namaste', 'hey', 'good morning', 'good afternoon', 'who are you', 'help'],
        response: `Hello! I am **Dyuti AI**, conversational assistant for **CMPDI** & **Ministry of Coal**.<br><br>You can ask me about coal reserves, seam quality (GCV/Ash%), stripping ratios, UNFC classifications, or borehole reports.`
      },
      {
        keywords: ['proved', 'jharia', 'bccl'],
        response: `**BCCL Jharia Coalfield Reserves (UNFC 111):**<br><br>• **Proved Reserves:** 14,850 MT (14.85 Billion Tonnes)<br>• **Total Resource Base:** 20,700 MT (Includes Indicated & Inferred)<br>• **Prime Seam:** Combined Seam IX/X (8.4m thickness, GCV 6,400–6,800 kcal/kg, Ash 16–20%)<br>• **Significance:** Holds >68% of India's prime coking coal for domestic steel mills.`
      },
      {
        keywords: ['gcv', 'korba', 'secl', 'gevra', 'kusmunda', 'dipka'],
        response: `**SECL Korba Seam Quality & GCV Assays:**<br><br>• **Gevra Seam V:** GCV 5,850 kcal/kg | Ash 22.4% (Grade G7)<br>• **Dipka Seam VI:** GCV 5,420 kcal/kg | Ash 26.1% (Grade G9)<br>• **Kusmunda Seam IV:** GCV 4,980 kcal/kg | Ash 31.5% (Grade G11)<br>• **Stripping Ratio:** Ultra-low 1.45 m³/Tonne (CIL's most cost-effective opencast mining).`
      },
      {
        keywords: ['stripping', 'ratio', 'mcl', 'ccl', 'talcher', 'amrapali', 'overburden'],
        response: `**Stripping Ratio & Overburden Comparison:**<br><br>• **MCL Talcher (Ananta OC):** 0.98 m³/Tonne (~₹420/T production cost)<br>• **CCL Amrapali OC:** 1.62 m³/Tonne (thick Seam V exposure)<br>• **CIL National Average:** 2.45 m³/Tonne (lower ratio = higher mining efficiency)`
      },
      {
        keywords: ['unfc', '111', '122', '333', 'classification', 'category'],
        response: `**CIL National UNFC Reserve Rollup (315.4 BT Total):**<br><br>• **UNFC 111 (Proved / Viable):** 178.4 BT (56.5%)<br>• **UNFC 122 (Indicated / Probable):** 94.2 BT (29.9%)<br>• **UNFC 333 (Inferred / Reconnaissance):** 42.8 BT (13.6%)<br><br>*Top Subsidiaries:* SECL (38.4 BT), MCL (34.2 BT), CCL (28.6 BT), BCCL (24.1 BT).`
      },
      {
        keywords: ['coking', 'steel', 'metallurgical'],
        response: `**Mission Coking Coal & Domestic Steel Strategy:**<br><br>India has ~34.5 BT of coking coal reserves, concentrated in Jharia and Bokaro. CIL operates 12 modern washeries with 24 MTPA capacity to reduce import dependence by 35% by 2030.`
      },
      {
        keywords: ['gasification', 'clean coal', 'net zero', 'fmc', 'silo'],
        response: `**Clean Coal Initiatives & First Mile Connectivity (FMC):**<br><br>• **Coal Gasification:** Mission targeting 100 MT coal gasified by 2030 (₹37,500 Cr incentive scheme).<br>• **FMC Rail Silos:** 52 mechanized rail silos operational, eliminating truck road pollution.<br>• **Eco-Parks:** Over 30 reclaimed opencast mine eco-parks developed by CMPDI.`
      },
      {
        keywords: ['database', 'report', 'download', 'csv', 'word', 'master report'],
        response: `You can access all 18,542 borehole records, download CSV datasets, or generate a printable Master AI Report on the **[Master Database](database.html)** page.`
      },
      {
        keywords: ['upload', 'ocr', 'ingestion', 'scan', 'borehole log'],
        response: `Go to **[OCR Ingestion](upload.html)** to upload scanned borehole PDFs or lithologs for automatic table extraction.`
      },
      {
        keywords: ['safety', 'dgms', 'regulation', '127', 'compliance'],
        response: `**DGMS Safety & Regulatory Compliance:**<br><br>• **DGMS Reg 127:** Mandates 45m barrier pillars between mine workings.<br>• **Slope Stability:** Automated radar slope monitoring active on dumps >60m.<br>• **Environmental Permits:** Real-time EC and FC status monitored in the **[Compliance Hub](compliance.html)**.`
      },
      {
        keywords: ['2024-25', '2024–25', '781.06', '69.006', 'production', 'offtake', 'dispatch', 'sccl', 'cil production', 'coal directory'],
        response: `**Ministry of Coal — All-India Coal Production & Offtake (2024–25):**<br><br>• **Coal India Limited (CIL):** **781.06 MT** (Official target achieved; led by MCL at 206.1 MT & SECL at 187.5 MT)<br>• **Singareni (SCCL):** **69.006 MT** (Telangana coalfields: Kothagudem, Ramagundam)<br>• **Captive & Commercial Miners:** **138.50 MT**<br>• **Total National Coal Production:** **988.566 MT** (~1.0 Billion Tonne milestone)<br>• **National Offtake / Dispatch:** **972.10 MT** (Power sector received 795.4 MT)<br><br>*Source: Verified from **Coal Directory 2024–25** & Ministry of Coal Statistical Division. Access the full dataset in the **[Master Database](database.html)**.*`
      },
      {
        keywords: ['chapter', 'chapters', '11 chapters', 'coal statistics', 'dataset', 'cmpdi_cil_dataset', 'directory 2023', 'directory 2022'],
        response: `**Ministry of Coal Statistical Dataset Archive (11 Excel Chapters & Directories):**<br><br>• **Structured Datasets (Excel/CSV):** <code>Production_Data.xlsx</code> & <code>Coal_Statistics.xlsx</code> encompassing all 11 chapters (Reserves, Production, Offtake, Coal Washeries, Captive Blocks, Foreign Trade, Manpower & Safety, State-wise Despatches).<br>• **Official Document Dataset (PDF):** <code>Coal_Directory_2024_25.pdf</code>, <code>Coal_Directory_2023_24.pdf</code>, and <code>Coal_Directory_2022_23.pdf</code>.<br>• **Historical & Scanned Reports:** <code>Historical_Report.docx</code> and <code>Sample_Scanned_Report.pdf</code>.<br><br>*All files are cataloged and downloadable under the **CMPDI_CIL_DATASET Files** tab in the **[Master Database](database.html)**.*`
      }
    ];

    let match = kb.find(k => k.keywords.some(kw => qLower.includes(kw)));

    let textResponse = match ? match.response : `Based on CMPDI geological records, **"${query}"** is correlated across 18,542 verified borehole logs. Workable seam horizons typically average 4.2m to 11.5m with medium-to-high GCV (4,800–6,200 kcal/kg) under UNFC 111/122 guidelines.`;

    const html = `<div>${this.formatDyutiMarkdown(textResponse)}</div>`;
    return { html };
  },

  // ---------- OpenRouter AI Engine Settings Modal ----------
  openAISettingsModal() {
    let modal = document.getElementById('ai-settings-modal-overlay');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'ai-settings-modal-overlay';
      modal.style.cssText = `
        position: fixed; inset: 0; background: rgba(5, 11, 20, 0.75);
        backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);
        display: flex; align-items: center; justify-content: center;
        z-index: 10005; padding: 16px;
      `;
      document.body.appendChild(modal);
    }

    const currentKey = localStorage.getItem('kshoni_openrouter_key') || '';
    const currentModel = localStorage.getItem('kshoni_openrouter_model') || 'meta-llama/llama-3.2-3b-instruct:free';
    const isLive = localStorage.getItem('kshoni_openrouter_live') === 'true';

    modal.innerHTML = `
      <div style="background: var(--bg-secondary); border: 1px solid rgba(212,168,67,0.3); border-radius: 12px; width: 100%; max-width: 520px; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.6); overflow: hidden; animation: fadeIn 0.2s ease;">
        <div style="padding: 16px 20px; background: var(--bg-tertiary); border-bottom: 1px solid var(--border-color); display: flex; align-items: center; justify-content: space-between;">
          <div class="flex align-center gap-sm">
            <div style="width: 32px; height: 32px; border-radius: 8px; background: rgba(212,168,67,0.15); display: flex; align-items: center; justify-content: center; font-size: 1.1rem; border: 1px solid rgba(212,168,67,0.3);">⚡</div>
            <div>
              <h3 style="font-size: 1.05rem; font-weight: 700; margin: 0; color: var(--text-primary);">OpenRouter AI Engine Settings</h3>
              <div style="font-size: 0.75rem; color: var(--text-tertiary);">Configure live LLM integration or offline geological knowledge base</div>
            </div>
          </div>
          <button onclick="App.closeAISettingsModal()" style="background: none; border: none; font-size: 1.25rem; color: var(--text-tertiary); cursor: pointer; padding: 4px;" title="Close">✕</button>
        </div>

        <div style="padding: 20px;">
          <!-- Live Mode Toggle -->
          <div style="background: var(--bg-primary); padding: 14px 16px; border-radius: 8px; border: 1px solid var(--border-color); margin-bottom: 16px; display: flex; align-items: center; justify-content: space-between;">
            <div>
              <div style="font-weight: 600; font-size: 0.92rem; color: var(--text-primary);">Enable Live OpenRouter LLM</div>
              <div style="font-size: 0.76rem; color: var(--text-tertiary); margin-top: 2px;">When ON, Dyuti AI connects to OpenRouter models. When OFF, runs 100% offline.</div>
            </div>
            <label style="position: relative; display: inline-block; width: 44px; height: 24px; cursor: pointer;">
              <input type="checkbox" id="modal-or-live" ${isLive ? 'checked' : ''} style="opacity: 0; width: 0; height: 0;" onchange="document.getElementById('live-indicator-pill').textContent = this.checked ? 'Active' : 'Offline'">
              <span style="position: absolute; inset: 0; background: ${isLive ? 'var(--color-emerald)' : '#475569'}; border-radius: 24px; transition: .2s;" id="modal-toggle-bg"></span>
              <span style="position: absolute; height: 18px; width: 18px; left: ${isLive ? '23px' : '3px'}; bottom: 3px; background: white; border-radius: 50%; transition: .2s;" id="modal-toggle-knob"></span>
            </label>
          </div>

          <!-- API Key Input -->
          <div style="margin-bottom: 16px;">
            <label style="display: block; font-size: 0.82rem; font-weight: 600; margin-bottom: 6px; color: var(--text-primary);">OpenRouter API Key (Free)</label>
            <div style="display: flex; gap: 8px;">
              <input type="password" id="modal-or-key" value="${currentKey}" placeholder="sk-or-v1-..." class="chat-input" style="flex: 1; font-family: var(--font-mono); font-size: 0.85rem; padding: 8px 12px; background: var(--bg-primary); border: 1px solid var(--border-color); border-radius: 6px; color: var(--text-primary);">
              <button class="btn btn-secondary btn-sm" onclick="App.toggleKeyVisibility()" title="Show/Hide Key">👁️</button>
              <button class="btn btn-secondary btn-sm" onclick="App.testOpenRouterKey()" id="btn-test-key" title="Verify Key">🧪 Test</button>
            </div>
            <div style="font-size: 0.76rem; color: var(--text-tertiary); margin-top: 6px;">
              💡 Get your free unlimited key in 30 seconds at <a href="https://openrouter.ai/keys" target="_blank" style="color: var(--color-gold-light); text-decoration: underline; font-weight: 600;">openrouter.ai/keys</a>. No credit card required.
            </div>
            <div id="test-key-status" style="font-size: 0.78rem; margin-top: 4px; display: none;"></div>
          </div>

          <!-- Model Selector -->
          <div style="margin-bottom: 16px;">
            <label style="display: block; font-size: 0.82rem; font-weight: 600; margin-bottom: 6px; color: var(--text-primary);">Select AI Model</label>
            <select id="modal-or-model" style="width: 100%; padding: 9px 12px; background: var(--bg-primary); border: 1px solid var(--border-color); border-radius: 6px; color: var(--text-primary); font-size: 0.86rem; font-family: var(--font-sans);">
              <option value="meta-llama/llama-3.2-3b-instruct:free" ${currentModel === 'meta-llama/llama-3.2-3b-instruct:free' ? 'selected' : ''}>🌟 Meta Llama 3.2 3B Instruct (Free & Super Fast)</option>
              <option value="google/gemini-2.0-flash-exp:free" ${currentModel === 'google/gemini-2.0-flash-exp:free' ? 'selected' : ''}>⚡ Google Gemini 2.0 Flash Exp (Free & High Intelligence)</option>
              <option value="meta-llama/llama-3.1-8b-instruct:free" ${currentModel === 'meta-llama/llama-3.1-8b-instruct:free' ? 'selected' : ''}>🧠 Meta Llama 3.1 8B Instruct (Free & Advanced Reasoning)</option>
              <option value="mistralai/mistral-7b-instruct:free" ${currentModel === 'mistralai/mistral-7b-instruct:free' ? 'selected' : ''}>🔷 Mistral 7B Instruct (Free)</option>
              <option value="qwen/qwen-2.5-7b-instruct:free" ${currentModel === 'qwen/qwen-2.5-7b-instruct:free' ? 'selected' : ''}>🌏 Qwen 2.5 7B Instruct (Free)</option>
            </select>
          </div>

          <!-- Context Grounding Note -->
          <div style="background: rgba(212,168,67,0.08); border-left: 3px solid var(--color-gold); padding: 10px 14px; border-radius: 4px; font-size: 0.78rem; color: #CBD5E1;">
            <strong>Ground Truth Protection:</strong> All OpenRouter queries automatically inject verified CMPDI reserves, 11 Ministry statistical chapters, and 2024–25 production statistics (CIL: 781.06 MT, SCCL: 69.006 MT).
          </div>
        </div>

        <div style="padding: 14px 20px; background: var(--bg-tertiary); border-top: 1px solid var(--border-color); display: flex; justify-content: flex-end; gap: 8px;">
          <button class="btn btn-ghost btn-sm" onclick="App.closeAISettingsModal()">Cancel</button>
          <button class="btn btn-primary btn-sm" onclick="App.saveAISettings()" style="font-weight: 600;">💾 Save & Apply</button>
        </div>
      </div>
    `;

    // Toggle switch live listener
    const chk = document.getElementById('modal-or-live');
    const bg = document.getElementById('modal-toggle-bg');
    const knob = document.getElementById('modal-toggle-knob');
    if (chk && bg && knob) {
      chk.addEventListener('change', () => {
        bg.style.background = chk.checked ? 'var(--color-emerald)' : '#475569';
        knob.style.left = chk.checked ? '23px' : '3px';
      });
    }

    modal.style.display = 'flex';
  },

  closeAISettingsModal() {
    const modal = document.getElementById('ai-settings-modal-overlay');
    if (modal) modal.style.display = 'none';
  },

  toggleKeyVisibility() {
    const input = document.getElementById('modal-or-key');
    if (input) {
      input.type = input.type === 'password' ? 'text' : 'password';
    }
  },

  testOpenRouterKey() {
    const keyInput = document.getElementById('modal-or-key');
    const key = keyInput ? keyInput.value.trim() : '';
    const statusDiv = document.getElementById('test-key-status');
    const btn = document.getElementById('btn-test-key');

    if (!key) {
      if (statusDiv) {
        statusDiv.style.display = 'block';
        statusDiv.style.color = '#EF4444';
        statusDiv.innerHTML = '⚠️ Please enter an API key first!';
      }
      return;
    }

    if (btn) btn.innerHTML = '<span class="loading-spinner"></span>';
    if (statusDiv) {
      statusDiv.style.display = 'block';
      statusDiv.style.color = 'var(--color-gold-light)';
      statusDiv.innerHTML = 'Connecting to OpenRouter...';
    }

    fetch('/api/test-key', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ apiKey: key })
    })
    .then(r => r.json())
    .then(data => {
      if (btn) btn.innerHTML = '🧪 Test';
      if (statusDiv) {
        if (data.success) {
          statusDiv.style.color = 'var(--color-emerald)';
          statusDiv.innerHTML = '✔ OpenRouter API Key verified successfully! Free tier active.';
        } else {
          statusDiv.style.color = '#EF4444';
          statusDiv.innerHTML = `✖ Key check: ${data.error || 'Check key format'}`;
        }
      }
    })
    .catch(err => {
      if (btn) btn.innerHTML = '🧪 Test';
      if (statusDiv) {
        statusDiv.style.color = '#EF4444';
        statusDiv.innerHTML = `✖ Network error: ${err.message}`;
      }
    });
  },

  saveAISettings() {
    const live = document.getElementById('modal-or-live')?.checked ?? false;
    const key = document.getElementById('modal-or-key')?.value.trim() ?? '';
    const model = document.getElementById('modal-or-model')?.value ?? 'meta-llama/llama-3.2-3b-instruct:free';

    localStorage.setItem('kshoni_openrouter_live', live ? 'true' : 'false');
    localStorage.setItem('kshoni_openrouter_key', key);
    localStorage.setItem('kshoni_openrouter_model', model);

    this.closeAISettingsModal();
    this.updateAIEngineBadge();
    this.showToast(live ? `Live AI Activated: ${model.split('/')[1] || model}` : 'Switched to 100% Offline Local Knowledge Base', 'success');
  },

  updateAIEngineBadge() {
    const isLive = localStorage.getItem('kshoni_openrouter_live') === 'true';
    const model = localStorage.getItem('kshoni_openrouter_model') || 'meta-llama/llama-3.2-3b-instruct:free';
    const badge = document.getElementById('ai-engine-status-badge');
    if (badge) {
      if (isLive) {
        badge.innerHTML = `● <span style="color:var(--color-emerald); font-weight:600;">Live LLM:</span> ${model.split('/')[1] || model}`;
      } else {
        badge.innerHTML = `● <span style="color:var(--color-gold); font-weight:600;">Offline Mode:</span> Built-in CMPDI Knowledge`;
      }
    }
  },

  // FIX: Mobile sidebar overlay support
  _setupMobileSidebarOverlay() {
    // Create overlay backdrop for mobile
    if (!document.getElementById('sidebar-overlay')) {
      const overlay = document.createElement('div');
      overlay.id = 'sidebar-overlay';
      overlay.style.cssText = `
        display: none; position: fixed; inset: 0;
        background: rgba(0,0,0,0.5); z-index: 200;
        backdrop-filter: blur(2px);
      `;
      overlay.addEventListener('click', () => {
        const sidebar = document.getElementById('sidebar');
        if (sidebar) sidebar.classList.remove('open');
        overlay.style.display = 'none';
      });
      document.body.appendChild(overlay);
    }
    // Show overlay when sidebar opens on mobile
    const sidebar = document.getElementById('sidebar');
    if (sidebar) {
      const observer = new MutationObserver(() => {
        const overlay = document.getElementById('sidebar-overlay');
        if (overlay) {
          overlay.style.display = sidebar.classList.contains('open') ? 'block' : 'none';
        }
      });
      observer.observe(sidebar, { attributes: true, attributeFilter: ['class'] });
    }
  }
};

// Explicit Global Window Bindings for maximum compatibility
window.App = App;
window.DyutiPage = {
  sendMessage: (containerId, inputId) => App.sendDyutiMessage(containerId, inputId),
  sendSuggested: (text, containerId, inputId) => App.sendDyutiSuggested(text, containerId, inputId),
  simulateVoiceInput: (inputId) => App.simulateDyutiVoice(inputId),
  clearChat: (containerId) => App.clearDyutiChat(containerId),
  init: () => {}
};
window.openDyutiChatbot = (e) => App.openDyutiChatbot(e);
window.toggleDyutiDrawer = () => App.toggleDyutiDrawer();

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => App.init());
} else {
  App.init();
}


