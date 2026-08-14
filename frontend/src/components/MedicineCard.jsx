import { PillIcon } from './ui/Icons'

/**
 * MedicineCard — single medicine in the user's medication list
 */
function MedicineCard({ medicine, onRemove }) {
  const { _id, genericName, brandName, strength, dosageForm, addedAt } = medicine

  return (
    <div className="bg-white border border-[#DCE8E5] rounded-2xl p-4 shadow-sm hover:shadow transition-all group flex items-center gap-3.5">
      <div className="w-9 h-9 rounded-full bg-[#EEF6F4] text-[#0F766E] border border-[#DCE8E5] flex items-center justify-center flex-shrink-0">
        <PillIcon className="w-4 h-4" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[#12302E] text-sm font-bold capitalize truncate">{genericName}</p>
        {brandName && <p className="text-[#64748B] text-xs truncate font-medium">{brandName}</p>}
        <div className="flex items-center gap-2 mt-0.5">
          {strength && <span className="text-xs text-[#94A3B8] font-medium">{strength}</span>}
          {dosageForm && <span className="text-xs text-[#94A3B8] font-medium capitalize">{dosageForm}</span>}
        </div>
      </div>
      {addedAt && (
        <span className="text-xs text-[#94A3B8] font-medium flex-shrink-0 hidden sm:block">
          {new Date(addedAt).toLocaleDateString()}
        </span>
      )}
      {onRemove && (
        <button
          id={`remove-med-${_id}`}
          onClick={() => onRemove(_id)}
          className="w-7 h-7 rounded-lg flex items-center justify-center text-[#94A3B8] hover:text-red-600 hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100 flex-shrink-0 cursor-pointer"
          aria-label={`Remove ${genericName}`}
        >
          ✕
        </button>
      )}
    </div>
  )
}

export default MedicineCard
