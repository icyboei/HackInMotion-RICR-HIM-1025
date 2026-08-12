/**
 * InteractionHistory.js — Factory for stored interaction check results
 */
function createInteractionHistoryDocument({ userId, medicines, interactions, overallSeverity, crossCheckResult }) {
  return {
    userId,
    medicines: medicines || [],           // array of { rxcui, genericName, brandName }
    interactions: interactions || [],     // array of InteractionResult objects
    overallSeverity: overallSeverity || "unknown",
    crossCheckResult: crossCheckResult || null,
    checkedAt: new Date(),
  };
}

module.exports = { createInteractionHistoryDocument };
