/**
 * aiService.js — AI Medical Assistant Service
 *
 * Architecture: RAG pattern
 *   User question → medicine detection → data retrieval → safety guard → LLM → response verification → user
 *
 * Uses Google Gemini API (configurable via GEMINI_API_KEY env var).
 * Falls back to a structured stub response if no key is configured.
 *
 * SAFETY RULES (enforced in the system prompt):
 * - Never prescribe medicine
 * - Never diagnose disease
 * - Never invent drug interactions, side effects, or dosages
 * - Never tell user to stop a prescribed medicine
 * - Always recommend consulting a doctor/pharmacist
 * - Use only retrieved drug data, not internal LLM knowledge
 */

const https = require("https");
const { DrugDataProvider } = require("./drugDataProvider");

// ─── Medicine detection ───────────────────────────────────────────────────────

/** Detect medicine names mentioned in a question using a simple keyword approach */
async function detectMedicines(text) {
  // Common medicine name patterns — extract candidates
  const words = text.match(/[a-zA-Z]{3,}/g) || [];
  const candidates = [];

  // Filter out common English stop words
  const stopWords = new Set([
    "what", "does", "this", "that", "with", "have", "will", "from", "they",
    "take", "used", "when", "how", "can", "why", "are", "for", "the", "and",
    "should", "watch", "safe", "drug", "medicine", "about", "tell", "give",
    "want", "know", "side", "effect", "effects", "interaction", "doctor",
    "pharmacist", "prescribed", "taking",
  ]);

  for (const word of words) {
    if (!stopWords.has(word.toLowerCase()) && word.length >= 4) {
      candidates.push(word);
    }
  }

  // Try to look up each candidate against RxNorm
  const detected = [];
  for (const candidate of candidates.slice(0, 5)) {
    const results = await DrugDataProvider.searchMedicine(candidate);
    if (results.length > 0 && results[0].score > 70) {
      detected.push(results[0]);
    }
  }
  return detected;
}

// ─── Safety guard ─────────────────────────────────────────────────────────────

const UNSAFE_PATTERNS = [
  /prescri(be|ption)/i,
  /diagnos(e|is|tic)/i,
  /stop.*taking.*your/i,
  /discontinue.*prescribed/i,
  /replace.*medicine/i,
  /you (should|must|need to) take/i,
  /I recommend.*taking/i,
];

function verifySafeResponse(text) {
  for (const pattern of UNSAFE_PATTERNS) {
    if (pattern.test(text)) {
      return false;
    }
  }
  return true;
}

// ─── LLM call ─────────────────────────────────────────────────────────────────

function postJSON(url, body) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(body);
    const urlObj = new URL(url);
    const options = {
      hostname: urlObj.hostname,
      path: urlObj.pathname + urlObj.search,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(data),
      },
      timeout: 20000,
    };

    const req = https.request(options, (res) => {
      let response = "";
      res.on("data", (chunk) => (response += chunk));
      res.on("end", () => {
        if (res.statusCode < 200 || res.statusCode >= 300) {
          return reject(new Error(`Gemini HTTP ${res.statusCode}: ${response}`));
        }
        try { resolve(JSON.parse(response)); }
        catch { reject(new Error("Invalid JSON from Gemini")); }
      });
    });
    req.on("error", reject);
    req.on("timeout", () => { req.destroy(); reject(new Error("Gemini request timed out")); });
    req.write(data);
    req.end();
  });
}

async function callGemini(systemPrompt, userMessage) {
  const apiKey = process.env.GEMINI_API_KEY || "";
  const models = [
    process.env.GEMINI_MODEL,
    "gemini-3.6-flash",
    "gemini-2.5-flash",
    "gemini-flash-latest",
  ].filter(Boolean);

  const body = {
    contents: [
      {
        role: "user",
        parts: [{ text: `${systemPrompt}\n\nUser question: ${userMessage}` }],
      },
    ],
    generationConfig: {
      temperature: 0.3,
      maxOutputTokens: 2048,
    },
  };

  let lastError = null;
  for (const model of models) {
    try {
      const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      const response = await postJSON(geminiUrl, body);
      const text = response?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text) return text;
    } catch (err) {
      lastError = err;
      console.warn(`Gemini model ${model} failed (${err.message}). Trying fallback...`);
    }
  }

  throw lastError || new Error("All Gemini model endpoints failed");
}

// ─── Public API ───────────────────────────────────────────────────────────────

const SYSTEM_PROMPT = `You are MediSafe's medical information assistant. Your role is strictly limited to:
1. Explaining what a medicine is commonly used for (based on retrieved data provided to you)
2. Explaining drug interactions in simple language (only from the data provided)
3. Describing possible side effects (only from the data provided)
4. Suggesting questions for the user to ask their doctor or pharmacist
5. Explaining medical terms and warning labels

ABSOLUTE RULES — never violate these:
- NEVER prescribe or recommend a medicine
- NEVER diagnose any condition
- NEVER invent drug interactions, dosages, or side effects
- NEVER tell the user to stop taking a prescribed medicine
- NEVER suggest substituting one medicine for another
- NEVER make medical claims not supported by the drug data provided to you
- ALWAYS end your response with: "⚠️ This information is for educational purposes only. Consult your doctor or pharmacist before making any changes to your medication."
- If you are uncertain, say: "I don't have reliable information about this. Please consult your pharmacist or doctor."

Only use information from the drug data context provided. Do not use your internal training knowledge to make specific medical claims.`;

const AIService = {
  /**
   * Answer a medical question with safety guards applied.
   * @param {string} question — user's question
   * @param {string} userId — for logging
   * @returns { answer, medicinesDetected, dataSourced, safetyPassed }
   */
  async answer(question, userId) {
    if (!question || question.trim().length < 3) {
      return {
        answer: "Please ask a specific question about a medicine.",
        medicinesDetected: [],
        dataSourced: false,
        safetyPassed: true,
      };
    }

    // Step 1: Detect medicines in question
    const detectedMedicines = await detectMedicines(question);

    // Step 2: Retrieve drug data for detected medicines
    let drugContext = "";
    if (detectedMedicines.length > 0) {
      const details = await Promise.all(
        detectedMedicines.map((m) => DrugDataProvider.getMedicineDetails(m.rxcui))
      );
      drugContext = details
        .map((d) => `Medicine: ${d.genericName} (RXCUI: ${d.rxcui})\nActive ingredients: ${(d.activeIngredients || []).join(", ") || "not available"}`)
        .join("\n\n");
    }

    const contextualPrompt = drugContext
      ? `${SYSTEM_PROMPT}\n\nDrug data context (use this — do not rely on internal knowledge):\n${drugContext}`
      : `${SYSTEM_PROMPT}\n\nNo specific drug data was retrieved for this question. Answer only in general educational terms and strongly recommend consulting a pharmacist.`;

    // Step 3: Call LLM (or stub if no key)
    let rawAnswer = "";
    let dataSourced = detectedMedicines.length > 0 && drugContext.length > 0;
    const apiKey = process.env.GEMINI_API_KEY || "";

    if (!apiKey) {
      // Stub response when no API key
      rawAnswer = `I'm sorry, the AI assistant requires an API key to be configured. 

For information about your medicines, I recommend:
- Consulting your pharmacist (most accessible healthcare professional)
- Visiting MedlinePlus (medlineplus.gov) — free, authoritative drug information
- Calling your doctor's office

⚠️ This information is for educational purposes only. Consult your doctor or pharmacist before making any changes to your medication.`;
    } else {
      try {
        rawAnswer = await callGemini(contextualPrompt, question);
      } catch (err) {
        console.error("Gemini API error:", err.message);
        rawAnswer = `The AI assistant is temporarily unavailable. For medicine information, please consult your pharmacist or visit MedlinePlus (medlineplus.gov).

⚠️ This information is for educational purposes only. Consult your doctor or pharmacist before making any changes to your medication.`;
      }
    }

    // Step 4: Safety verification
    const safetyPassed = verifySafeResponse(rawAnswer);
    const finalAnswer = safetyPassed
      ? rawAnswer
      : `I'm unable to provide a safe response to that question. Please consult your doctor or pharmacist directly.

⚠️ This information is for educational purposes only. Consult your doctor or pharmacist before making any changes to your medication.`;

    return {
      answer: finalAnswer,
      medicinesDetected: detectedMedicines.map((m) => m.genericName),
      dataSourced,
      safetyPassed,
    };
  },
};

module.exports = { AIService };
