import { useState } from 'react'
import SeverityBadge from './SeverityBadge'

/**
 * InteractionResult — displays a single drug-drug interaction pair result
 * Props:
 *   interaction: { medicineA, medicineB, severity, mechanism, effects, symptoms, management, source, sourceUrl, checkedAt }
 */
function InteractionResult({ interaction }) {
  const [expanded, setExpanded] = useState(false)
  const {
    medicineA, medicineB, severity = 'unknown',
    mechanism, effects, symptoms = [], management, source, sourceUrl, checkedAt,
  } = interaction

  const hasDetails = mechanism || effects || symptoms.length > 0 || management

  return (
    <div className={`rounded-2xl border transition-all ${
      severity === 'critical' ? 'border-red-700 bg-red-950/30' :
      severity === 'severe'   ? 'border-orange-700 bg-orange-950/20' :
      severity === 'moderate' ? 'border-yellow-700 bg-yellow-950/20' :
      severity === 'mild'     ? 'border-blue-700 bg-blue-950/20' :
                                'border-slate-700 bg-slate-800/30'
    }`}>
      {/* Header */}
      <div className="p-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-slate-100 font-semibold text-sm capitalize">{medicineA}</span>
          <span className="text-slate-500 text-xs">+</span>
          <span className="text-slate-100 font-semibold text-sm capitalize">{medicineB}</span>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <SeverityBadge severity={severity} />
          {hasDetails && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-slate-400 hover:text-teal-400 transition-colors text-sm px-2 py-1 rounded-lg hover:bg-slate-700"
              aria-label="Toggle details"
            >
              {expanded ? '▲ Less' : '▼ More'}
            </button>
          )}
        </div>
      </div>

      {/* Expandable details */}
      {expanded && hasDetails && (
        <div className="px-4 pb-4 border-t border-slate-700/50 pt-3 space-y-3">

          {(mechanism || effects) && (
            <div>
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">What happens?</h4>
              <p className="text-sm text-slate-300 leading-relaxed">{effects || mechanism}</p>
            </div>
          )}

          {mechanism && effects && mechanism !== effects && (
            <div>
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">Why does it happen?</h4>
              <p className="text-sm text-slate-300 leading-relaxed">{mechanism}</p>
            </div>
          )}

          {symptoms.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">What should I watch for?</h4>
              <div className="flex flex-wrap gap-2">
                {symptoms.map((s) => (
                  <span key={s} className="text-xs px-2.5 py-1 bg-slate-700 text-slate-300 rounded-full capitalize">{s}</span>
                ))}
              </div>
            </div>
          )}

          {management && (
            <div className="bg-teal-950/40 border border-teal-800/50 rounded-xl p-3">
              <h4 className="text-xs font-semibold text-teal-400 uppercase tracking-wide mb-1">Clinical Management Information</h4>
              <p className="text-sm text-slate-300 leading-relaxed">{management}</p>
              <p className="text-xs text-amber-400/80 mt-2">⚠️ Do not make changes to your medication without consulting your doctor or pharmacist.</p>
            </div>
          )}

          <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
            <span>
              Source:{' '}
              {sourceUrl
                ? <a href={sourceUrl} target="_blank" rel="noopener noreferrer" className="text-teal-500 hover:underline">{source}</a>
                : source
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
