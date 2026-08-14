# MediSafe — Smart Medicine Safety & Drug Interaction Assistant

> **Medical Disclaimer:** MediSafe is for educational and informational purposes only. It is not a substitute for professional medical advice, diagnosis, or treatment. Always consult your doctor or pharmacist before making any decisions about your medications.

---

## Overview

MediSafe is an AI-powered medicine safety platform that helps users identify dangerous drug interactions, allergy conflicts, and duplicate therapies — all cross-verified by two independent data sources.

Built for the **HackInMotion RICR HIM-1025** hackathon.

---

## Features

| Feature | Status |
|---------|--------|
| Medicine search (generic + brand name, fuzzy/misspelling) | ✅ |
| Multi-medicine interaction check (all pairs) | ✅ |
| Severity levels: Mild / Moderate / Severe / Critical | ✅ |
| Two-source cross-check (RxNorm + OpenFDA FAERS) | ✅ |
| Allergy profile & conflict detection | ✅ |
| Duplicate therapy detection | ✅ |
| Overlapping pharmacological effect analysis | ✅ |
| Clinical management information (cautious, attributed) | ✅ |
| AI medical assistant (Gemini, RAG pattern) | ✅ |
| AI safety guard (blocks prescribing/diagnosing) | ✅ |
| Prescription OCR (browser-side Tesseract.js) | ✅ |
| OCR confirmation required before adding | ✅ |
| Medicine price explorer (with honest disclaimer) | ✅ |
| User dashboard | ✅ |
| Medication history | ✅ |
| Medication reminders | ✅ |
| User authentication (JWT) | ✅ |
| Responsive UI (mobile + desktop) | ✅ |
| English + Hindi i18n | ✅ |

---

## Tech Stack

### Frontend
- React 19 + Vite 8
- TailwindCSS v4
- React Router v7
- Tesseract.js (browser-side OCR)

### Backend
- Node.js + Express 5
- MongoDB Atlas (native driver)
- bcryptjs + JWT
- No Mongoose — native MongoDB driver

### External APIs (all free, no key required)
- **RxNorm** (National Library of Medicine) — medicine search, normalization, interactions
- **OpenFDA** (US FDA) — drug labels, adverse events (FAERS)
- **Google Gemini** _(optional)_ — AI assistant

---

## Architecture

```
USER
  │
  ▼
REACT FRONTEND (Vite)
  │
  ▼ (Vite proxy → /api)
EXPRESS BACKEND
  │
  ├─── DrugDataProvider (RxNorm + OpenFDA)
  │         │
  │         ▼
  ├─── DrugInteractionService (all pairs)
  │         │
  │         ▼
  ├─── CrossCheckService (OpenFDA FAERS)
  │         │
  │         ▼
  ├─── Safety Result
  │
  ├─── AIService (Gemini RAG)
  │     ├── Medicine detection
  │     ├── Drug data retrieval
  │     ├── Safety guard
  │     └── Response verification
  │
  ├─── OCRService (text extraction + RxNorm normalization)
  │
  └─── MongoDB Atlas
        ├── users
        ├── medications
        ├── allergies
        ├── reminders
        ├── interaction_history
        ├── ocr_scans
        └── ai_conversations
```

---

## Installation

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (free tier works)

### Backend Setup

```bash
cd backend
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
npm install
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Visit: `http://localhost:5173`

---

## Environment Variables

### `backend/.env`

```env
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/medsafe
JWT_SECRET=<strong-random-secret>
PORT=5000
FRONTEND_URL=http://localhost:5173
GEMINI_API_KEY=<optional-gemini-key>
```

> Generate JWT secret: `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`
>
> Get Gemini API key (free): https://makersuite.google.com/app/apikey
>
> If `GEMINI_API_KEY` is not set, the AI assistant returns a helpful stub response directing users to reliable resources.

---

## API Endpoints

See [api-documentation.md](./api-documentation.md) for full documentation.

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/auth/register` | — | Register |
| POST | `/api/auth/login` | — | Login, returns JWT |
| GET | `/api/medicines/search?q=` | — | Fuzzy medicine search |
| GET | `/api/medicines/:rxcui` | — | Medicine details |
| POST | `/api/interactions/check` | Optional | Check all pairs |
| GET | `/api/medications` | ✅ | Get user's medication list |
| POST | `/api/medications` | ✅ | Add medication |
| DELETE | `/api/medications/:id` | ✅ | Remove medication |
| GET | `/api/allergies` | ✅ | Get allergy profile |
| POST | `/api/allergies` | ✅ | Add allergy |
| DELETE | `/api/allergies/:id` | ✅ | Remove allergy |
| GET | `/api/reminders` | ✅ | Get reminders |
| POST | `/api/reminders` | ✅ | Add reminder |
| DELETE | `/api/reminders/:id` | ✅ | Delete reminder |
| GET | `/api/history` | ✅ | Get history |
| DELETE | `/api/history/:type/:id` | ✅ | Delete history item |
| POST | `/api/ai/ask` | ✅ | Ask AI assistant |
| POST | `/api/ocr/extract` | Optional | Extract medicines from OCR text |

---

## Medical Safety Design

This application is built with patient safety as the first priority:

1. **No autonomous prescribing** — The AI cannot prescribe, diagnose, or recommend medicines
2. **No invented data** — Interactions are only reported when found in RxNorm or FAERS, not invented by LLM
3. **Two-source verification** — Every interaction check is cross-verified against a second independent source
4. **User confirmation required** — OCR results must be confirmed before being added to the medication list
5. **Explicit disclaimers** — Every interaction result, AI response, and price comparison includes a medical disclaimer
6. **"No interaction found" ≠ "Safe"** — The app explicitly communicates this nuance

---

## Testing & Production Build

```bash
# Frontend production build test
cd frontend && npm run build

# Backend startup & health check
cd backend && npm start
curl http://localhost:5000/health
```

---

## Production Deployment Guide

### Architecture
- **Frontend**: Deployed on **Vercel** (`frontend/`) with `vercel.json` SPA rewrites.
- **Backend**: Deployed on **Render** (`backend/`) with automated `/health` endpoint monitoring.
- **Database**: **MongoDB Atlas** (with fallback in-memory store).

### Environment Variables Matrix

| Variable | Scope | Purpose |
|----------|-------|---------|
| `VITE_API_URL` | Frontend (Vercel) | Base URL of deployed Render backend |
| `MONGODB_URI` | Backend (Render) | MongoDB Atlas connection string |
| `JWT_SECRET` | Backend (Render) | Secret key for signing user JWT tokens |
| `FRONTEND_URL` | Backend (Render) | Deployed Vercel frontend URL for CORS |
| `GEMINI_API_KEY` | Backend (Render) | Optional Gemini API key for AI assistant |
| `PORT` | Backend (Render) | Provided automatically by cloud host |

---

## Limitations

- Price comparison: Live medicine price APIs require commercial subscriptions. The price explorer currently provides a UI with links to established price comparison websites.
- OCR: Accuracy depends on image quality. Low-confidence results are flagged.
- Interaction data: Coverage depends on RxNorm/OpenFDA database completeness. Always verify with a pharmacist.
- AI: Requires a Gemini API key. Falls back to helpful guidance without one.
- Reminders: In-app only. Browser push notifications are not implemented in this version.

---

## Medical Disclaimer

MediSafe is for educational and informational purposes only. It does not provide medical advice. The information provided is not a substitute for professional medical advice, diagnosis, or treatment.

**Never** make changes to your prescribed medications without consulting your doctor or pharmacist.

Data sources: RxNorm (National Library of Medicine) · OpenFDA (US FDA) · FDA FAERS
