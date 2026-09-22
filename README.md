# MicroRFP 🚀
### Elite B2B Government Contracting & Enterprise Proposal Strategist

MicroRFP is an AI-powered proposal strategy platform that conducts exhaustive analyses of Request for Proposal (RFP) documents. In seconds, it produces:

1. **Executive RFP Overview** (Agency, Solicitation ID, Official Submission Deadline, Estimated Budget Ceiling)
2. **Bid/No-Bid Decision Scorecard** (0-100 score, `RECOMMENDED | RISKY | NOT_RECOMMENDED` verdict, and strategic rationale)
3. **Compliance & Eligibility Matrix** (Mandatory vs optional rules, page limits, required attachments, and proposal manager red flags)
4. **Key Qualifications & Risk Assessment** (Security certifications, past performance gates, high/medium/low risk categorization)
5. **Evaluation Criteria Breakdown** (Scoring weights, points, and resource investment strategy)
6. **Draft Proposal Response Outline** (Section-by-section outline ready for immediate drafting)
7. **Downloadable Microsoft Word (.docx) Draft** (Direct client-side generation via `docx` & `file-saver`)

---

## Architecture & Design Decisions

### 1. Robust PDF Extraction (`lib/pdf-extract.ts`)
- Powered by `pdf-parse` v2 in Node.js serverless runtime.
- Configured with `export const runtime = 'nodejs'` and `export const maxDuration = 60` for extended execution on large multi-page documents.
- Includes a **150,000-word safety guard** to prevent context blowouts while digesting 150+ page enterprise RFPs.

### 2. Large Context Window & Structured Output (`lib/gemini.ts`)
- Powered by the `@google/genai` SDK using Google Gemini (`gemini-3.8-flash` / `gemini-2.5-pro` with 1M+ token context window).
- Enforces strict JSON Schema validation (`responseMimeType: "application/json"`, `responseSchema`) to guarantee parseable, structured responses without markdown syntax wrappers.
- `maxOutputTokens: 8192` prevents JSON truncation mid-object on complex compliance matrices.

### 3. State Management & Zero URL Bottlenecks
- Single-page fluid state transition (`app/page.tsx`) with `sessionStorage` fallback.
- Avoids passing large JSON objects through URL parameters or query strings.

### 4. Interactive Proposal Manager Features
- **Interactive Compliance Tracker**: Check off items as your team prepares the bid package.
- **Word (.docx) Export**: Formatted executive report with tables, bullets, and proposal drafting outline.
- **Raw JSON Inspection**: Copy or export full structured JSON directly from the UI.
- **Instant Federal Sample Mode**: Try the platform immediately with a realistic multi-million dollar federal health IT RFP without needing an API key.

---

## Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```
Add your Gemini API Key:
```env
GEMINI_API_KEY=your_gemini_api_key_here
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Deploying to Vercel

MicroRFP is configured out-of-the-box for seamless Vercel deployment:
1. Push your repository to GitHub / GitLab.
2. Import the project into Vercel.
3. Add the `GEMINI_API_KEY` Environment Variable in your Vercel project settings.
4. Deploy!
