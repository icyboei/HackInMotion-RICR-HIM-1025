import { ClockIcon } from './ui/Icons'
import { Badge } from './ui/Badge'

/**
 * ReminderCard — displays a single medication reminder
 */
function ReminderCard({ reminder, onDelete }) {
  const { _id, medicineName, dosage, times = [], notes, startDate, endDate } = reminder

  return (
    <div className="bg-white border border-[#DCE8E5] rounded-2xl p-4.5 shadow-sm hover:shadow transition-all group flex items-start gap-3.5">
      <div className="w-10 h-10 rounded-xl bg-[#EEF6F4] text-[#0F766E] border border-[#DCE8E5] flex items-center justify-center flex-shrink-0">
        <ClockIcon className="w-5 h-5" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <p className="text-[#12302E] text-sm font-bold capitalize">{medicineName}</p>
          <Badge variant="brand" size="sm">Active</Badge>
        </div>
        {dosage && <p className="text-[#64748B] text-xs mt-0.5 font-medium">{dosage}</p>}
        <div className="flex flex-wrap gap-1.5 mt-2">
          {times.map((time) => (
            <span key={time} className="text-xs px-2.5 py-1 bg-[#EEF6F4] border border-[#DCE8E5] text-[#0F766E] rounded-full font-semibold">
              {time}
            </span>
          ))}
        </div>
        {notes && <p className="text-xs text-[#64748B] mt-1.5 italic">{notes}</p>}
        <div className="text-xs text-[#94A3B8] mt-1.5 font-medium">
          {startDate && <span>From: {new Date(startDate).toLocaleDateString()}</span>}
          {endDate && <span> · To: {new Date(endDate).toLocaleDateString()}</span>}
        </div>
      </div>
      {onDelete && (
        <button
          id={`delete-reminder-${_id}`}
          onClick={() => onDelete(_id)}
          className="w-7 h-7 rounded-lg flex items-center justify-center text-[#94A3B8] hover:text-red-600 hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100 flex-shrink-0 cursor-pointer"
          aria-label={`Delete reminder for ${medicineName}`}
        >
          ✕
        </button>
      )}
    </div>
  )
}

export default ReminderCard
