/**
 * ReminderCard — displays a single medication reminder
 */
function ReminderCard({ reminder, onDelete }) {
  const { _id, medicineName, dosage, times = [], notes, startDate, endDate } = reminder

  return (
    <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-4 group flex items-start gap-3">
      <div className="w-10 h-10 rounded-full bg-indigo-900/60 border border-indigo-700/50 flex items-center justify-center flex-shrink-0 text-lg">
        ⏰
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-slate-100 text-sm font-semibold capitalize">{medicineName}</p>
        {dosage && <p className="text-slate-400 text-xs mt-0.5">{dosage}</p>}
        <div className="flex flex-wrap gap-1.5 mt-2">
          {times.map((time) => (
            <span key={time} className="text-xs px-2.5 py-1 bg-indigo-900/40 border border-indigo-800/60 text-indigo-300 rounded-full font-medium">
              {time}
            </span>
          ))}
        </div>
        {notes && <p className="text-xs text-slate-500 mt-1.5">{notes}</p>}
        <div className="text-xs text-slate-600 mt-1.5">
          {startDate && <span>From: {new Date(startDate).toLocaleDateString()}</span>}
          {endDate && <span> · To: {new Date(endDate).toLocaleDateString()}</span>}
        </div>
      </div>
      {onDelete && (
        <button
          id={`delete-reminder-${_id}`}
          onClick={() => onDelete(_id)}
          className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-600 hover:text-red-400 hover:bg-red-950/50 transition-all opacity-0 group-hover:opacity-100 flex-shrink-0"
          aria-label={`Delete reminder for ${medicineName}`}
        >
          ✕
        </button>
      )}
    </div>
  )
}

export default ReminderCard
