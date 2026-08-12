/**
 * MedicineCard — single medicine in the user's medication list
 */
function MedicineCard({ medicine, onRemove }) {
  const { _id, genericName, brandName, strength, dosageForm, addedAt } = medicine

  return (
    <div className="flex items-center gap-3 bg-slate-800/60 border border-slate-700 rounded-xl px-4 py-3 group">
      <div className="w-9 h-9 rounded-full bg-teal-900/60 border border-teal-700/50 flex items-center justify-center flex-shrink-0 text-base">
        💊
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-slate-100 text-sm font-semibold capitalize truncate">{genericName}</p>
        {brandName && <p className="text-slate-400 text-xs truncate">{brandName}</p>}
        <div className="flex items-center gap-2 mt-0.5">
          {strength && <span className="text-xs text-slate-500">{strength}</span>}
          {dosageForm && <span className="text-xs text-slate-500 capitalize">{dosageForm}</span>}
        </div>
      </div>
      {addedAt && (
        <span className="text-xs text-slate-600 flex-shrink-0 hidden sm:block">
          {new Date(addedAt).toLocaleDateString()}
        </span>
      )}
      {onRemove && (
        <button
          id={`remove-med-${_id}`}
          onClick={() => onRemove(_id)}
          className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-600 hover:text-red-400 hover:bg-red-950/50 transition-all opacity-0 group-hover:opacity-100"
          aria-label={`Remove ${genericName}`}
        >
          ✕
        </button>
      )}
    </div>
  )
}

export default MedicineCard
