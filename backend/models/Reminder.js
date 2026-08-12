/**
 * Reminder.js — Factory for medication reminder entries
 */
function createReminderDocument({ userId, medicationId, medicineName, dosage, times, startDate, endDate, notes }) {
  return {
    userId,
    medicationId: medicationId || null,
    medicineName: medicineName || "",
    dosage: dosage || "",
    times: times || [],     // e.g. ["08:00", "14:00", "20:00"]
    startDate: startDate ? new Date(startDate) : new Date(),
    endDate: endDate ? new Date(endDate) : null,
    notes: notes || "",
    active: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

module.exports = { createReminderDocument };
