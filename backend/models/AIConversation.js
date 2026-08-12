/**
 * AIConversation.js — Factory for AI assistant conversation history
 */
function createAIConversationDocument({ userId, question, answer, medicinesDetected, dataSourced }) {
  return {
    userId,
    question: question || "",
    answer: answer || "",
    medicinesDetected: medicinesDetected || [],   // medicines detected in the question
    dataSourced: dataSourced || false,            // whether drug data was retrieved before LLM call
    askedAt: new Date(),
  };
}

module.exports = { createAIConversationDocument };
