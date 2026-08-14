/**
 * crossCheckService.js — CrossCheckService
 *
 * Provides a second independent verification layer using the
 * OpenFDA Drug Adverse Events API (FAERS database).
 *
 * Architecture:
 *   Primary check → RxNorm Interaction API
 *   Cross-check  → OpenFDA Adverse Events
 *
 * Compares severity and presence of interactions.
 * NEVER silently chooses one source over another if they disagree.
 */

const https = require("https");

function fetchJSON(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, { timeout: 8000 }, (res) => {
      let data = "";
      res.on("data", (c) => (data += c));
      res.on("end", () => {
        try { resolve(JSON.parse(data)); }
        catch { reject(new Error("Invalid JSON")); }
      });
    });
    req.on("error", reject);
    req.on("timeout", () => { req.destroy(); reject(new Error("Timeout")); });
  });
}

/**
 * Look up adverse event co-reporting for two drugs in OpenFDA FAERS.
 * Returns count of adverse event reports mentioning both drugs together.
 */
async function getFAERSCoReports(drugA, drugB) {
  try {
    const a = encodeURIComponent(drugA.toLowerCase());
    const b = encodeURIComponent(drugB.toLowerCase());
    const url = `https://api.fda.gov/drug/event.json?search=patient.drug.medicinalproduct:"${a}"+AND+patient.drug.medicinalproduct:"${b}"&limit=1&count=patient.reaction.reactionmeddrapt.exact`;
    const data = await fetchJSON(url);
    const results = data?.results || [];
    // Return top reported reactions
    return results.slice(0, 5).map((r) => ({
      reaction: r.term,
      count: r.count,
    }));
  } catch {
    return null; // null = data unavailable (not "no reports")
  }
}

const SEVERITY_ORDER = ["unknown", "none", "mild", "moderate", "severe", "critical"];

function compareSeverity(primary, secondary) {
  const pi = SEVERITY_ORDER.indexOf(primary);
  const si = SEVERITY_ORDER.indexOf(secondary);
  if (pi === si) return "agree";
  if (Math.abs(pi - si) <= 1) return "partial";
  return "disagree";
}

const CrossCheckService = {
  /**
   * Cross-check the primary interaction results against OpenFDA FAERS.
   * @param {Array} interactions — from DrugInteractionService
   * @param {Array} medicines — input medication list
   * @param {boolean} primarySuccess — whether primary RxNorm check succeeded
   * @returns { status, details, disclaimer }
   */
  async verify(interactions, medicines = [], primarySuccess = true) {
    let pairsToCheck = [];
    if (interactions && interactions.length > 0) {
      pairsToCheck = interactions.map((ix) => ({
        medicineA: ix.medicineA,
        medicineB: ix.medicineB,
        primarySeverity: ix.severity,
      }));
    } else if (medicines && medicines.length >= 2) {
      for (let i = 0; i < medicines.length; i++) {
        for (let j = i + 1; j < medicines.length; j++) {
          const medA = medicines[i].genericName || medicines[i].brandName || "";
          const medB = medicines[j].genericName || medicines[j].brandName || "";
          if (medA && medB) {
            pairsToCheck.push({
              medicineA: medA,
              medicineB: medB,
              primarySeverity: "unknown",
            });
          }
        }
      }
    }

    if (pairsToCheck.length === 0) {
      return {
        status: "insufficient_data",
        statusLabel: "Insufficient Data",
        statusIcon: "⚪",
        details: [],
        disclaimer: "No medicine pairs to cross-check.",
      };
    }

    const results = [];
    let overallStatus = primarySuccess ? "agree" : "insufficient_data";

    for (const pair of pairsToCheck.slice(0, 5)) { // limit to 5 pairs to avoid rate limits
      const faersData = await getFAERSCoReports(pair.medicineA, pair.medicineB);

      let pairStatus = "insufficient_data";
      let pairNote = "";

      if (faersData === null) {
        pairStatus = "insufficient_data";
        pairNote = "Cross-check data is currently unavailable for this pair.";
      } else if (faersData.length === 0) {
        pairStatus = "insufficient_data";
        pairNote = "No co-reported adverse events found in FAERS. This does not confirm the combination is safe.";
        if (primarySuccess && overallStatus === "agree") overallStatus = "partial";
      } else {
        // FAERS reports exist — supporting evidence
        pairStatus = primarySuccess ? "agree" : "insufficient_data";
        pairNote = `FAERS database contains supporting adverse event reports involving this drug combination. Top reported reactions: ${faersData.map((r) => r.reaction).join(", ")}.`;
      }

      results.push({
        medicineA: pair.medicineA,
        medicineB: pair.medicineB,
        primarySeverity: pair.primarySeverity,
        faersReactions: faersData || [],
        status: pairStatus,
        note: pairNote,
      });

      if (primarySuccess && pairStatus === "insufficient_data" && overallStatus === "agree") {
        overallStatus = "partial";
      }
    }

    if (!primarySuccess) {
      overallStatus = "insufficient_data";
    }

    const statusConfig = {
      agree:             { label: "Sources agree",           icon: "🟢" },
      partial:           { label: "Partial agreement",       icon: "🟡" },
      disagree:          { label: "Sources disagree",        icon: "🔴" },
      insufficient_data: { label: "Insufficient data",       icon: "⚪" },
    };

    const cfg = statusConfig[overallStatus] || statusConfig.insufficient_data;

    return {
      status: overallStatus,
      statusLabel: cfg.label,
      statusIcon: cfg.icon,
      details: results,
      disclaimer: !primarySuccess
        ? "Primary interaction database (RxNorm) was unavailable. OpenFDA FAERS data is provided as supporting adverse-event evidence only and does not replace professional medical advice."
        : overallStatus === "disagree"
        ? "Medical sources provide differing information. Please verify this combination with a pharmacist or doctor."
        : "Cross-check is supplementary supporting evidence and does not replace professional medical advice.",
      checkedAt: new Date().toISOString(),
      source: "OpenFDA FAERS (FDA Adverse Event Reporting System)",
    };
  },
};

module.exports = { CrossCheckService };
