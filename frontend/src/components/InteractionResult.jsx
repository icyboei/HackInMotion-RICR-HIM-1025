import { useState } from 'react'
import SeverityBadge from './SeverityBadge'
import { CheckIcon, AlertTriangleIcon, ShieldCheckIcon } from './ui/Icons'

/**
 * InteractionResult — displays a single drug-drug interaction pair result
 * Props:
 *   interaction: { medicineA, medicineB, severity, mechanism, effects, symptoms, management, source, sourceUrl, checkedAt, unableToVerify }
 */
function InteractionResult({ interaction }) {
  const [expanded, setExpanded] = useState(false)
  const {
    medicineA, medicineB, severity = 'unknown',
    mechanism, effects, symptoms = [], management, source, sourceUrl, checkedAt, unableToVerify,
  } = interaction

  const hasDetails = mechanism || effects || symptoms.length > 0 || management

  return (
    <div className="bg-white border border-[#DCE8E5] rounded-2xl shadow-sm hover:shadow transition-all font-sans">
      {/* Header */}
      <div className="p-4 sm:p-5 flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[#12302E] font-extrabold text-sm sm:text-base capitalize">{medicineA}</span>
          <span className="text-[#94A3B8] font-bold text-xs">+</span>
          <span className="text-[#12302E] font-extrabold text-sm sm:text-base capitalize">{medicineB}</span>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <SeverityBadge severity={severity} />
          {unableToVerify ? (
            <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
              <AlertTriangleIcon className="w-3.5 h-3.5" />
              Unverified
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-[#16A34A] border border-emerald-200">
              <CheckIcon className="w-3.5 h-3.5" />
              Verified
            </span>
          )}

          {hasDetails && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-[#64748B] hover:text-[#0F766E] hover:bg-[#EEF6F4] transition-colors text-xs font-bold px-3 py-1.5 rounded-lg border border-[#DCE8E5] cursor-pointer"
              aria-label="Toggle details"
            >
              {expanded ? 'Hide Details ▲' : 'View Details ▼'}
            </button>
          )}
        </div>
      </div>

      {/* Expandable details */}
      {expanded && hasDetails && (
        <div className="px-4 pb-5 sm:px-5 border-t border-[#DCE8E5] pt-4 space-y-4">

          {(effects || mechanism) && (
            <div>
              <h4 className="text-xs font-bold text-[#64748B] uppercase tracking-wide mb-1">Description & Interaction Effects</h4>
              <p className="text-sm text-[#12302E] leading-relaxed font-medium">{effects || mechanism}</p>
            </div>
          )}

          {mechanism && effects && mechanism !== effects && (
            <div>
              <h4 className="text-xs font-bold text-[#64748B] uppercase tracking-wide mb-1">Why this happens (Mechanism)</h4>
              <p className="text-sm text-[#12302E] leading-relaxed font-medium">{mechanism}</p>
            </div>
          )}

          {symptoms.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-[#64748B] uppercase tracking-wide mb-2">Symptoms & Signs to Watch For</h4>
              <div className="flex flex-wrap gap-2">
                {symptoms.map((s) => (
                  <span key={s} className="text-xs font-semibold px-3 py-1 bg-[#EEF6F4] text-[#0F766E] border border-[#DCE8E5] rounded-full capitalize">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}

          {management && (
            <div className="bg-[#EEF6F4]/70 border border-[#DCE8E5] rounded-xl p-4">
              <h4 className="text-xs font-bold text-[#0F766E] uppercase tracking-wide mb-1 flex items-center gap-1.5">
                <ShieldCheckIcon className="w-4 h-4" />
                Recommended Clinical Action
              </h4>
              <p className="text-sm text-[#12302E] leading-relaxed font-medium">{management}</p>
            </div>
          )}

          <div className="flex items-center justify-between text-xs text-[#94A3B8] font-medium pt-1 border-t border-[#DCE8E5]/60">
            <span>
              Source:{' '}
              {sourceUrl
                ? <a href={sourceUrl} target="_blank" rel="noopener noreferrer" className="text-[#0F766E] font-semibold hover:underline">{source}</a>
                : <span className="text-[#64748B] font-semibold">{source || 'OpenFDA / RxNorm'}</span>
              }
            </span>
            {checkedAt && <span>Checked: {new Date(checkedAt).toLocaleTimeString()}</span>}
          </div>
        </div>
      )}
    </div>
  )
}

export default InteractionResult
