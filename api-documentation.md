# MediSafe API Documentation

Base URL: `http://localhost:5000/api`

All protected endpoints require: `Authorization: Bearer <jwt_token>`

---

## Authentication

### POST `/auth/register`

Register a new user.

**Body:**
```json
{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "password": "securepassword123"
}
```

**Response 201:**
```json
{
  "message": "User registered successfully",
  "userId": "<mongo_id>"
}
```

---

### POST `/auth/login`

Login and receive JWT token.

**Body:**
```json
{
  "email": "jane@example.com",
  "password": "securepassword123"
}
```

**Response 200:**
```json
{
  "message": "Login successful",
  "token": "<jwt_token>",
  "user": { "id": "<id>", "name": "Jane Smith", "email": "jane@example.com" }
}
```

---

## Medicines

### GET `/medicines/search?q=<query>`

Fuzzy medicine search using RxNorm approximate term API.

**Response 200:**
```json
{
  "query": "paracetmol",
  "results": [
    {
      "rxcui": "161",
      "genericName": "Acetaminophen",
      "brandName": "Tylenol",
      "dosageForm": "TABLET",
      "score": 95,
      "source": "RxNorm"
    }
  ],
  "total": 8
}
```

---

### GET `/medicines/:rxcui`

Get detailed medicine information by RXCUI.

---

## Interactions

### POST `/interactions/check`

Check all pairs of medicines for interactions.
Auth is optional — history is stored if authenticated.

**Body:**
```json
{
  "medicines": [
    { "rxcui": "1191", "genericName": "aspirin", "brandName": "Bayer" },
    { "rxcui": "11289", "genericName": "warfarin", "brandName": "Coumadin" }
  ]
}
```

**Response 200:**
```json
{
  "interactions": [
    {
      "medicineA": "aspirin",
      "medicineB": "warfarin",
      "severity": "severe",
      "mechanism": "...",
      "effects": "...",
      "symptoms": ["bleeding"],
      "management": "Clinical monitoring may be recommended...",
      "source": "RxNorm (National Library of Medicine)",
      "checkedAt": "2026-08-13T..."
    }
  ],
  "overallSeverity": "severe",
  "overallSummary": "Severe",
  "noKnownInteraction": null,
  "allergyWarnings": [],
  "duplicates": [],
  "overlappingEffects": [
    { "category": "bleeding", "pairs": ["aspirin + warfarin"], "message": "..." }
  ],
  "crossCheck": {
    "status": "agree",
    "statusLabel": "Sources agree",
    "statusIcon": "🟢",
    "details": [...],
    "disclaimer": "..."
  },
  "disclaimer": "...",
  "checkedAt": "2026-08-13T..."
}
```

---

## Medications (Protected)

### GET `/medications`

Get authenticated user's medication list.

### POST `/medications`

Add a medicine to the user's list.

**Body:**
```json
{
  "rxcui": "1191",
  "genericName": "aspirin",
  "brandName": "Bayer",
  "strength": "81mg",
  "dosageForm": "tablet"
}
```

### DELETE `/medications/:id`

Remove a medication from the user's list.

---

## Allergies (Protected)

### GET `/allergies`
### POST `/allergies`

**Body:**
```json
{
  "allergen": "penicillin",
  "drugClass": "beta-lactam antibiotics",
  "reaction": "anaphylaxis",
  "severity": "severe"
}
```

### DELETE `/allergies/:id`

---

## Reminders (Protected)

### GET `/reminders`
### POST `/reminders`

**Body:**
```json
{
  "medicineName": "metformin",
  "dosage": "500mg",
  "times": ["08:00", "20:00"],
  "startDate": "2026-08-13",
  "endDate": "2026-09-13",
  "notes": "Take with food"
}
```

### DELETE `/reminders/:id`

---

## History (Protected)

### GET `/history?limit=20&skip=0`

Returns interaction checks, OCR scans, and AI conversations.

### DELETE `/history/:type/:id`

`:type` must be one of: `interaction`, `scan`, `ai`

---

## AI Assistant (Protected)

### POST `/ai/ask`

**Body:**
```json
{
  "question": "Why do aspirin and warfarin interact?"
}
```

**Response 200:**
```json
{
  "question": "Why do aspirin and warfarin interact?",
  "answer": "...",
  "medicinesDetected": ["aspirin", "warfarin"],
  "dataSourced": true,
  "safetyPassed": true,
  "disclaimer": "⚠️ This is for educational purposes only..."
}
```

---

## OCR (Auth Optional)

### POST `/ocr/extract`

**Body:**
```json
{
  "rawText": "Tab. Metformin 500mg BD\nAspirin 75mg OD"
}
```

**Response 200:**
```json
{
  "extractedMedicines": [
    {
      "raw": "Metformin",
      "genericName": "metformin",
      "rxcui": "6809",
      "strength": "500mg",
      "confidence": 90,
      "confidenceLabel": "high",
      "confidencePercent": "90%",
      "confirmed": false
    }
  ],
  "total": 2,
  "message": "2 potential medicine(s) identified...",
  "disclaimer": "⚠️ OCR results must be confirmed..."
}
```

---

## Error Responses

All endpoints return errors in this format:

```json
{
  "message": "Human-readable error message"
}
```

| Status | Meaning |
|--------|---------|
| 400 | Bad request / validation error |
| 401 | Unauthenticated |
| 403 | Forbidden |
| 404 | Not found |
| 409 | Conflict (e.g. duplicate) |
| 500 | Server error |
| 503 | External service unavailable |
