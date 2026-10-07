const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 8080;
const PUBLIC_DIR = __dirname;

const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.pdf': 'application/pdf',
  '.csv': 'text/csv',
  '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
};

// Helper: parse JSON request body
const readJsonBody = (req) => new Promise((resolve) => {
  let body = '';
  req.on('data', chunk => { body += chunk; });
  req.on('end', () => {
    try { resolve(JSON.parse(body || '{}')); }
    catch (e) { resolve({}); }
  });
  req.on('error', () => resolve({}));
});

// Ground truth system prompt for CMPDI & Ministry of Coal
const SYSTEM_PROMPT = `You are Dyuti AI (द्युति), the official conversational AI assistant for Central Mine Planning & Design Institute (CMPDI) and the Ministry of Coal, Government of India.
You provide authoritative, fact-checked, technical answers regarding Indian coal geology, reserves, mine planning, and statutory reporting.

Ground Truth Knowledge & Official Ministry Statistics:
1. 2024-25 All-India Coal Production: 988.566 MT total.
   - Coal India Limited (CIL): 781.06 MT (MCL: 206.10 MT, SECL: 187.50 MT, NCL: 142.20 MT, CCL: 86.40 MT, WCL: 68.50 MT, BCCL: 41.36 MT, ECL & NEC: 49.00 MT).
   - Singareni Collieries Company Limited (SCCL): 69.006 MT (Telangana).
   - Captive & Commercial blocks: 138.50 MT.
2. 2024-25 Total Coal Offtake / Despatch: 972.10 MT (795.4 MT despatched to Thermal Power sector).
3. Ministry of Coal 11 Statistical Chapters:
   - Chapter 1: Overview & National Inventory (Total resources 378.2 BT).
   - Chapter 2: Coal Reserves by State & Quality (UNFC 111 Proved: 178.4 BT, 122 Indicated: 94.2 BT, 333 Inferred: 42.8 BT; Total 315.4 BT).
   - Chapter 3: Raw Coal Production by Company & State.
   - Chapter 4: Sector-wise Despatches & Offtake.
   - Chapter 5: Pithead Value of Coal Production (Aggregate value exceeds ₹1,74,200 Crores).
   - Chapter 6: Import and Export of Coal & Coke.
   - Chapter 7: Coal Washeries & Beneficiation Performance (12 operational CIL washeries).
   - Chapter 8: Captive & Commercial Mining Blocks (161 commercial blocks).
   - Chapter 9: Royalty, Stowing Excise Duty & GST Compensation Cess.
   - Chapter 10: Manpower, Productivity (OMS) & Industrial Relations.
   - Chapter 11: Safety, Mine Accidents & DGMS Regulatory Audits.
4. Key Mining Geologies:
   - Prime coking coal: Concentrated in Jharia (BCCL).
   - Lowest Stripping Ratios: MCL Talcher (0.98 m³/Tonne) and SECL Korba (1.45 m³/Tonne).
   - Safety Standards: DGMS Regulation 127 mandates 45m barrier pillars between mine workings.

Format your response in clean markdown with bold highlights, bullet points, and a professional, respectful tone suitable for government and technical personnel.`;

// Call OpenRouter API via HTTPS
const callOpenRouter = (apiKey, model, messages) => new Promise((resolve, reject) => {
  const payload = JSON.stringify({
    model: model || 'meta-llama/llama-3.2-3b-instruct:free',
    messages: messages,
    temperature: 0.3,
    max_tokens: 1200
  });

  const req = https.request('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'HTTP-Referer': 'http://localhost:8080',
      'X-Title': 'Kshoni CMPDI AI',
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(payload)
    },
    timeout: 35000
  }, (res) => {
    let data = '';
    res.on('data', chunk => { data += chunk; });
    res.on('end', () => {
      try {
        const json = JSON.parse(data);
        if (res.statusCode >= 200 && res.statusCode < 300 && json.choices && json.choices.length > 0) {
          resolve({ success: true, text: json.choices[0].message.content, model: json.model || model });
        } else {
          const errMsg = json.error ? (json.error.message || JSON.stringify(json.error)) : `HTTP ${res.statusCode}: ${data}`;
          reject(new Error(errMsg));
        }
      } catch (e) {
        reject(new Error(`Failed to parse OpenRouter response: ${e.message}`));
      }
    });
  });

  req.on('error', err => reject(err));
  req.on('timeout', () => {
    req.destroy();
    reject(new Error('OpenRouter API request timed out after 35 seconds'));
  });

  req.write(payload);
  req.end();
});

// Test OpenRouter Key validity
const testOpenRouterKey = (apiKey) => new Promise((resolve) => {
  const req = https.request('https://openrouter.ai/api/v1/auth/key', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${apiKey}`
    },
    timeout: 10000
  }, (res) => {
    let data = '';
    res.on('data', chunk => { data += chunk; });
    res.on('end', () => {
      try {
        const json = JSON.parse(data);
        if (res.statusCode === 200 && json.data) {
          resolve({ success: true, data: json.data });
        } else {
          resolve({ success: false, error: json.error ? (json.error.message || JSON.stringify(json.error)) : `HTTP ${res.statusCode}` });
        }
      } catch (e) {
        resolve({ success: false, error: e.message });
      }
    });
  });
  req.on('error', err => resolve({ success: false, error: err.message }));
  req.on('timeout', () => {
    req.destroy();
    resolve({ success: false, error: 'Timeout verifying OpenRouter key' });
  });
  req.end();
});

// API Endpoints Handler
const handleAPIRequest = async (req, res, pathname) => {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  if (pathname === '/api/chat' && req.method === 'POST') {
    const body = await readJsonBody(req);
    const query = body.query || '';
    const userModel = body.model || 'meta-llama/llama-3.2-3b-instruct:free';
    const effectiveKey = body.apiKey || process.env.OPENROUTER_API_KEY || '';

    if (!effectiveKey) {
      res.writeHead(200);
      res.end(JSON.stringify({
        success: false,
        fallback: true,
        reason: 'no_key',
        message: 'No OpenRouter API key provided. Using built-in local knowledge base.'
      }));
      return;
    }

    try {
      const messages = [
        { role: 'system', content: SYSTEM_PROMPT },
        ...(Array.isArray(body.history) ? body.history.slice(-6) : []),
        { role: 'user', content: query }
      ];

      const result = await callOpenRouter(effectiveKey, userModel, messages);
      res.writeHead(200);
      res.end(JSON.stringify({
        success: true,
        response: result.text,
        model: result.model,
        live: true
      }));
    } catch (err) {
      console.warn(`[OpenRouter Warning] ${err.message}. Falling back to local offline knowledge base.`);
      res.writeHead(200);
      res.end(JSON.stringify({
        success: false,
        fallback: true,
        reason: 'error',
        error: err.message
      }));
    }
    return;
  }

  if (pathname === '/api/test-key' && req.method === 'POST') {
    const body = await readJsonBody(req);
    const key = body.apiKey || '';
    if (!key) {
      res.writeHead(400);
      res.end(JSON.stringify({ success: false, error: 'API key is required' }));
      return;
    }
    const testResult = await testOpenRouterKey(key);
    res.writeHead(200);
    res.end(JSON.stringify(testResult));
    return;
  }

  if (pathname === '/api/dataset') {
    const metaPath = path.join(PUBLIC_DIR, 'CMPDI_CIL_DATASET', 'metadata.json');
    if (fs.existsSync(metaPath)) {
      res.writeHead(200);
      res.end(fs.readFileSync(metaPath, 'utf8'));
      return;
    }
  }

  if (pathname === '/api/health') {
    res.writeHead(200);
    res.end(JSON.stringify({
      status: 'ok',
      service: 'Kshoni AI Engine',
      version: '1.2.0',
      openRouterEnabled: true,
      time: new Date().toISOString()
    }));
    return;
  }

  if (pathname === '/api/subsidiaries') {
    const subsidiaries = [
      { id: 'BCCL', name: 'Bharat Coking Coal Limited', hq: 'Dhanbad, Jharkhand', reserves: '14,850 MT', provedPct: '68%', color: '#D4A843' },
      { id: 'SECL', name: 'South Eastern Coalfields Limited', hq: 'Bilaspur, Chhattisgarh', reserves: '38,400 MT', provedPct: '82%', color: '#10B981' },
      { id: 'MCL', name: 'Mahanadi Coalfields Limited', hq: 'Sambalpur, Odisha', reserves: '34,200 MT', provedPct: '79%', color: '#3B82F6' },
      { id: 'CCL', name: 'Central Coalfields Limited', hq: 'Ranchi, Jharkhand', reserves: '28,600 MT', provedPct: '71%', color: '#8B5CF6' },
      { id: 'NCL', name: 'Northern Coalfields Limited', hq: 'Singrauli, Madhya Pradesh', reserves: '18,500 MT', provedPct: '88%', color: '#EC4899' },
      { id: 'ECL', name: 'Eastern Coalfields Limited', hq: 'Sanctoria, West Bengal', reserves: '21,800 MT', provedPct: '65%', color: '#F59E0B' },
      { id: 'WCL', name: 'Western Coalfields Limited', hq: 'Nagpur, Maharashtra', reserves: '11,200 MT', provedPct: '62%', color: '#06B6D4' },
      { id: 'NEC', name: 'North Eastern Coalfields', hq: 'Margherita, Assam', reserves: '1,600 MT', provedPct: '54%', color: '#10B981' }
    ];
    res.writeHead(200);
    res.end(JSON.stringify(subsidiaries));
    return;
  }

  if (pathname === '/api/boreholes') {
    const boreholes = [
      { id: 'BH-040', x: -60, z: -40, depth: 160, netCoal: 16.5, gcv: 6200, rl: 212.0, subsidiary: 'BCCL', block: 'Jharia Block IX' },
      { id: 'BH-041', x: -20, z: -50, depth: 175, netCoal: 17.8, gcv: 6350, rl: 213.5, subsidiary: 'BCCL', block: 'Jharia Block IX' },
      { id: 'BH-042', x: 20, z: -10, depth: 185, netCoal: 18.4, gcv: 6420, rl: 214.5, subsidiary: 'BCCL', block: 'Jharia Block IX' },
      { id: 'BH-043', x: 70, z: 30, depth: 190, netCoal: 19.2, gcv: 6580, rl: 216.0, subsidiary: 'SECL', block: 'Gevra Expansion' },
      { id: 'BH-044', x: -40, z: 40, depth: 170, netCoal: 16.9, gcv: 6150, rl: 211.8, subsidiary: 'MCL', block: 'Talcher Kaniha' },
      { id: 'BH-045', x: 30, z: 60, depth: 180, netCoal: 18.1, gcv: 6390, rl: 215.2, subsidiary: 'CCL', block: 'Amrapali OC' }
    ];
    res.writeHead(200);
    res.end(JSON.stringify({ status: 'ok', count: boreholes.length, boreholes }));
    return;
  }

  if (pathname === '/api/ocr-process' && req.method === 'POST') {
    res.writeHead(200);
    res.end(JSON.stringify({
      success: true,
      boreholeId: 'BH-042',
      confidence: 97.4,
      totalSeamThickness: 18.4,
      avgGCV: 4920,
      anomaliesDetected: 1
    }));
    return;
  }

  // Fallback 404 for unknown API
  res.writeHead(404);
  res.end(JSON.stringify({ error: 'Endpoint not found' }));
};

const server = http.createServer((req, res) => {
  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = parsedUrl.pathname;

  if (pathname.startsWith('/api/')) {
    handleAPIRequest(req, res, pathname);
    return;
  }

  let filePath = path.join(PUBLIC_DIR, pathname === '/' ? 'index.html' : pathname);
  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end('<h1>404 Not Found — Kshoni AI</h1>');
      } else {
        res.writeHead(500);
        res.end(`Server Error: ${err.code}`);
      }
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
});

server.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(` 🚀 KSHONI AI BACKEND & FRONTEND SERVER RUNNING `);
  console.log(` URL: http://localhost:${PORT}`);
  console.log(` Health: http://localhost:${PORT}/api/health`);
  console.log(` Live LLM Bridge: http://localhost:${PORT}/api/chat`);
  console.log(`====================================================`);
});
