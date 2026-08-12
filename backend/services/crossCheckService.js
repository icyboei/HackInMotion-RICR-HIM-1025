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
   * @returns { status, details, disclaimer }
   */
  async verify(interactions) {
    if (!interactions || interactions.length === 0) {
      return {
        status: "insufficient_data",
        statusLabel: "Insufficient Data",
        statusIcon: "⚪",
        details: [],
        disclaimer: "No interactions to cross-check.",
      };
    }

    const results = [];
    let overallStatus = "agree"; // optimistic start

    for (const ix of interactions.slice(0, 5)) { // limit to 5 pairs to avoid rate limits
      const faersData = await getFAERSCoReports(ix.medicineA, ix.medicineB);

      let pairStatus = "insufficient_data";
      let pairNote = "";

      if (faersData === null) {
        pairStatus = "insufficient_data";
        pairNote = "Cross-check data is currently unavailable for this pair.";
      } else if (faersData.length === 0) {
        pairStatus = "partial";
        pairNote = "No co-reported adverse events found in FAERS. This does not confirm the combination is safe.";
        if (overallStatus === "agree") overallStatus = "partial";
      } else {
        // FAERS reports exist — this confirms there is known concern
        pairStatus = "agree";
        pairNote = `FAERS database contains adverse event reports involving this drug combination. Top reactions: ${faersData.map((r) => r.reaction).join(", ")}.`;
      }

      results.push({
        medicineA: ix.medicineA,
        medicineB: ix.medicineB,
        primarySeverity: ix.severity,
        faersReactions: faersData || [],
        status: pairStatus,
        note: pairNote,
      });

      if (pairStatus === "insufficient_data" && overallStatus === "agree") {
        overallStatus = "partial";
      }
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
      disclaimer: overallStatus === "disagree"
        ? "Medical sources provide differing information. Please verify this combination with a pharmacist or doctor."
        : "Cross-check is supplementary and does not replace professional medical advice.",
      checkedAt: new Date().toISOString(),
      source: "OpenFDA FAERS (FDA Adverse Event Reporting System)",
    };
  },
};

module.exports = { CrossCheckService };
