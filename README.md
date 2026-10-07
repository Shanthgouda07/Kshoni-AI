# Kshoni AI (भू-मित्र) — National Geological Intelligence Portal
### Official System for Central Mine Planning & Design Institute (CMPDI) & Ministry of Coal, Government of India

---

## 🌟 Long-Term Future Portability & Longevity Guarantees

This system was engineered with **extreme durability and zero external dependency risk**:

1. **Zero Brittle Node Modules:**
   - The backend server (`server.js`) relies **exclusively** on native Node.js core libraries (`http`, `https`, `fs`, `path`).
   - It will run without ever having to run `npm install` or worrying about deprecated packages 5, 10, or 20 years from now.
2. **Dual-Engine Architecture (100% Offline + Live Cloud LLM):**
   - **Offline Mode:** If there is no internet or no API key, Dyuti AI automatically answers using its built-in CMPDI/CIL verified geological knowledge base.
   - **Live OpenRouter Mode:** When internet & a free OpenRouter key are present, Dyuti AI routes queries to state-of-the-art open models with grounded Ministry context.
3. **One-Click Launch:**
   - On Windows: Simply double-click `start.bat`.
   - On Linux / Mac / Server: Run `node server.js`.
4. **Cloud / Free Hosting Readiness:**
   - **Render / Railway / Fly.io:** Deploy as a standard Node.js web service (port 8080 or process.env.PORT).
   - **Vercel / Netlify / Cloudflare Pages:** The frontend HTML/CSS/JS files can be hosted as a completely static web app.
   - **On-Premise Ministry Server:** Works out-of-the-box behind corporate firewalls and government NIC networks.

---

## ⚡ Integrating a Free Unlimited API Key from OpenRouter

OpenRouter provides free models tagged with `:free` that require zero credit card or billing.

### Step-by-Step Setup (Takes 30 seconds):
1. Visit **[openrouter.ai/keys](https://openrouter.ai/keys)** and sign in with Google or GitHub.
2. Click **Create Key**, give it a name (e.g. `Kshoni-Free`), and copy the key (starts with `sk-or-v1-...`).
3. In the Kshoni application:
   - Go to the **[Dyuti AI Chatbot](dyuti.html)** page or click the floating coal chatbot in the bottom right corner.
   - Click the ⚙️ **AI Engine Settings** button in the chat header.
   - Toggle **Enable Live OpenRouter LLM** to **ON**.
   - Paste your API key into the input field.
   - Select your preferred free model:
     - `meta-llama/llama-3.2-3b-instruct:free` (Recommended • Super Fast)
     - `google/gemini-2.0-flash-exp:free` (Free • Google Gemini 2.0 Flash)
     - `meta-llama/llama-3.1-8b-instruct:free` (Free • Meta Llama 3.1 8B)
     - `mistralai/mistral-7b-instruct:free` (Free • Mistral 7B)
     - `qwen/qwen-2.5-7b-instruct:free` (Free • Alibaba Qwen 2.5)
   - Click **🧪 Test** to verify connection, then click **💾 Save & Apply**.
4. You're done! Dyuti AI will now generate real-time AI responses injected with official Ministry ground truth!

---

## 📁 Prototype Dataset Repository (`CMPDI_CIL_DATASET`)

All official files are stored inside the local folder `CMPDI_CIL_DATASET/`:

```
📁 CMPDI_CIL_DATASET
   ├── 📁 Excel
   │     ├── Production_Data.xlsx & Production_Data.csv (All-India company, state, & offtake data)
   │     └── Coal_Statistics.xlsx & Coal_Statistics.csv (11 Ministry Statistical Chapters)
   ├── 📁 PDF
   │     ├── Coal_Directory_2024_25.pdf  (Includes CIL's 781.06 MT & SCCL's 69.006 MT)
   │     ├── Coal_Directory_2023_24.pdf
   │     └── Coal_Directory_2022_23.pdf
   ├── 📁 Word
   │     └── Historical_Report.docx
   ├── 📁 Images_Scanned
   │     └── Sample_Scanned_Report.pdf
   └── metadata.json
```

---

## 🔄 Document Pipeline Active in App

$$\text{PDF} \longrightarrow \text{OCR / Text Extraction} \longrightarrow \text{AI} \longrightarrow \text{Knowledge Base} \longrightarrow \text{Question}$$

- Test this workflow on the **[Document Upload & OCR (upload.html)](upload.html)** page by clicking `📂 Load Coal Directory 2024–25 (Dataset B)`.
- Query the results on the **[Master Database (database.html)](database.html)** or **[Dyuti AI (dyuti.html)](dyuti.html)**.
