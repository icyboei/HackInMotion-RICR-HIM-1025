import SeverityBadge from './SeverityBadge'
import CrossCheckBadge from './CrossCheckBadge'

/**
 * SafetyStatusCard — Overall safety summary for a medication list
 */
function SafetyStatusCard({ overallSeverity, overallSummary, noKnownInteraction, unableToVerify, crossCheck, totalMedicines, totalInteractions }) {
  return (
    <div className="rounded-2xl border border-slate-700 bg-slate-800/50 p-6">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Overall Safety Status</p>
          <div className="flex items-center gap-2">
            <SeverityBadge severity={overallSeverity} size="lg" />
            <span className="text-slate-300 text-sm font-medium">{overallSummary}</span>
          </div>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="text-xs text-slate-500">{totalMedicines} medicine{totalMedicines !== 1 ? 's' : ''} checked</p>
          {totalInteractions > 0 && (
            <p className="text-xs text-slate-500">{totalInteractions} interaction{totalInteractions !== 1 ? 's' : ''} found</p>
          )}
        </div>
      </div>

      {noKnownInteraction && (
        <p className="text-sm text-green-300/80 bg-green-950/30 border border-green-800/50 rounded-xl px-4 py-3 mb-4">
          ✓ {noKnownInteraction}
        </p>
      )}

      {unableToVerify && (
        <p className="text-sm text-amber-300/80 bg-amber-950/30 border border-amber-800/50 rounded-xl px-4 py-3 mb-4">
          ⚠️ {unableToVerify}
        </p>
      )}

      {crossCheck && (
        <CrossCheckBadge status={crossCheck.status} />
      )}

      <p className="text-xs text-amber-400/70 mt-3">
        ⚠️ This check is for informational purposes only. Always consult your doctor or pharmacist before making any changes to your medications.
      </p>
    </div>
  )
}

export default SafetyStatusCard
