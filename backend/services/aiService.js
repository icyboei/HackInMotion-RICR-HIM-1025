/**
 * aiService.js
 * MediSafe AI Medical Assistant
 */

const { GoogleGenAI } = require("@google/genai");
const { DrugDataProvider } = require("./drugDataProvider");

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  console.warn("⚠️ GEMINI_API_KEY is not configured.");
}

const ai = GEMINI_API_KEY
  ? new GoogleGenAI({ apiKey: GEMINI_API_KEY })
  : null;

// ============================================================
// Medicine detection
// ============================================================

async function detectMedicines(text) {
  const words = text.match(/[a-zA-Z]{3,}/g) || [];

  const stopWords = new Set([
    "what",
    "does",
    "this",
    "that",
    "with",
    "have",
    "will",
    "from",
    "they",
    "take",
    "used",
    "when",
    "how",
    "can",
    "why",
    "are",
    "for",
    "the",
    "and",
    "should",
    "watch",
    "safe",
    "drug",
    "medicine",
    "about",
    "tell",
    "give",
    "want",
    "know",
    "side",
    "effect",
    "effects",
    "interaction",
    "doctor",
    "pharmacist",
    "prescribed",
    "taking",
  ]);

  const candidates = [];

  for (const word of words) {
    if (
      word.length >= 4 &&
      !stopWords.has(word.toLowerCase())
    ) {
      candidates.push(word);
    }
  }

  const detected = [];

  for (const candidate of candidates.slice(0, 5)) {
    try {
      const results =
        await DrugDataProvider.searchMedicine(candidate);

      if (
        results &&
        results.length > 0 &&
        results[0].score > 70
      ) {
        detected.push(results[0]);
      }
    } catch (error) {
      console.error(
        `Medicine lookup failed for ${candidate}:`,
        error.message
      );
    }
  }

  return detected;
}

// ============================================================
// Safety guard
// ============================================================

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
  return !UNSAFE_PATTERNS.some((pattern) =>
    pattern.test(text)
  );
}

// ============================================================
// System prompt
// ============================================================

const SYSTEM_PROMPT = `
You are MediSafe's medical information assistant.

Your role is strictly educational.

You may:
1. Explain what a medicine is commonly used for.
2. Explain drug interactions using retrieved drug data.
3. Explain possible side effects using retrieved drug data.
4. Explain medical terminology.
5. Suggest questions a user can ask their doctor or pharmacist.

ABSOLUTE SAFETY RULES:

- NEVER prescribe medication.
- NEVER diagnose a disease.
- NEVER recommend starting a medicine.
- NEVER recommend stopping a prescribed medicine.
- NEVER recommend replacing one medicine with another.
- NEVER invent drug interactions.
- NEVER invent dosages.
- NEVER invent side effects.
- NEVER make unsupported medical claims.
- If reliable drug data is unavailable, clearly say so.
- Encourage the user to consult a doctor or pharmacist for personal medical decisions.

Always end your response with:

⚠️ This information is for educational purposes only. Consult your doctor or pharmacist before making any changes to your medication.
`;

// ============================================================
// Gemini call
// ============================================================

async function callGemini(userMessage, drugContext) {
  if (!ai) {
    throw new Error("GEMINI_API_KEY is not configured");
  }

  const prompt = `
${SYSTEM_PROMPT}

${drugContext
    ? `RETRIEVED DRUG DATA:
${drugContext}`
    : `No specific drug data was retrieved for this question.
Do not invent specific medical facts.`}

USER QUESTION:
${userMessage}
`;

  const response = await ai.models.generateContent({
    model: "gemini-3.6-flash",
    contents: prompt,
  });

  return response.text || "";
}

// ============================================================
// Public API
// ============================================================

const AIService = {
  async answer(question, userId) {
    if (!question || question.trim().length < 3) {
      return {
        answer: "Please ask a specific question about a medicine.",
        medicinesDetected: [],
        dataSourced: false,
        safetyPassed: true,
      };
    }

    // --------------------------------------------
    // 1. Detect medicines
    // --------------------------------------------

    const detectedMedicines =
      await detectMedicines(question);

    // --------------------------------------------
    // 2. Retrieve medicine information
    // --------------------------------------------

    let drugContext = "";

    if (detectedMedicines.length > 0) {
      const details = await Promise.all(
        detectedMedicines.map((medicine) =>
          DrugDataProvider.getMedicineDetails(
            medicine.rxcui
          )
        )
      );

      drugContext = details
        .filter(Boolean)
        .map(
          (d) => `
Medicine: ${d.genericName}
RXCUI: ${d.rxcui}
Active ingredients: ${
            (d.activeIngredients || []).join(", ") ||
            "not available"
          }
`
        )
        .join("\n");
    }

    const dataSourced =
      detectedMedicines.length > 0 &&
      drugContext.length > 0;

    // --------------------------------------------
    // 3. Call Gemini
    // --------------------------------------------

    let rawAnswer;

    try {
      rawAnswer = await callGemini(
        question,
        drugContext
      );
    } catch (error) {
      console.error(
        "Gemini API error:",
        error.message
      );

      throw new Error(
        "Gemini API request failed"
      );
    }

    // --------------------------------------------
    // 4. Safety verification
    // --------------------------------------------

    const safetyPassed =
      verifySafeResponse(rawAnswer);

    const finalAnswer = safetyPassed
      ? rawAnswer
      : `I'm unable to provide a safe response to that question. Please consult your doctor or pharmacist directly.

⚠️ This information is for educational purposes only. Consult your doctor or pharmacist before making any changes to your medication.`;

    return {
      answer: finalAnswer,
      medicinesDetected:
        detectedMedicines.map(
          (medicine) => medicine.genericName
        ),
      dataSourced,
      safetyPassed,
    };
  },
};

module.exports = {
  AIService,
};