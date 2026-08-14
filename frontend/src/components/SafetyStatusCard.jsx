import SeverityBadge from './SeverityBadge'
import CrossCheckBadge from './CrossCheckBadge'
import { Card } from './ui/Card'
import { AlertTriangleIcon, CheckIcon } from './ui/Icons'

/**
 * SafetyStatusCard — Overall safety summary for a medication list
 */
function SafetyStatusCard({
  overallSeverity,
  overallSummary,
  noKnownInteraction,
  unableToVerify,
  crossCheck,
  totalMedicines,
  totalInteractions,
}) {
  return (
    <Card className="bg-white border-[#DCE8E5] p-6 shadow-sm rounded-2xl">
      {/* Header & Main Status Area */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4 pb-4 border-b border-[#DCE8E5]">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-[#64748B] mb-2">
            OVERALL SAFETY STATUS
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <SeverityBadge severity={overallSeverity} size="lg" />
            {overallSummary && (
              <span className="text-[#12302E] text-sm font-bold">
                {overallSummary}
              </span>
            )}
          </div>
        </div>

        {/* Right-side Stats (aligned & responsive) */}
        <div className="text-left sm:text-right flex-shrink-0 bg-[#F5F9F7] sm:bg-transparent p-3 sm:p-0 rounded-xl sm:rounded-none border sm:border-0 border-[#DCE8E5]">
          <p className="text-xs font-bold text-[#12302E]">
            {totalMedicines} medicine{totalMedicines !== 1 ? 's' : ''} checked
          </p>
          {totalInteractions > 0 ? (
            <p className="text-xs font-bold text-[#D97706] mt-0.5">
              {totalInteractions} interaction{totalInteractions !== 1 ? 's' : ''} found
            </p>
          ) : (
            <p className="text-xs font-semibold text-emerald-600 mt-0.5">
              0 interactions found
            </p>
          )}
        </div>
      </div>

      {/* No Known Interaction Alert */}
      {noKnownInteraction && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-medium mb-3 flex items-start gap-2.5">
          <CheckIcon className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
          <span className="leading-snug">{noKnownInteraction}</span>
        </div>
      )}

      {/* Unable To Verify Warning */}
      {unableToVerify && (
        <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-medium mb-3 flex items-start gap-2.5">
          <AlertTriangleIcon className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
          <span className="leading-snug">{unableToVerify}</span>
        </div>
      )}

      {/* Cross Check Evidence */}
      {crossCheck && (
        <div className="mb-4">
          <CrossCheckBadge status={crossCheck.status} />
        </div>
      )}

      {/* High-Contrast Clinical Disclaimer */}
      <div className="p-3.5 rounded-xl bg-amber-50/80 border border-amber-200/80 flex items-start gap-2.5 mt-2">
        <AlertTriangleIcon className="w-4 h-4 text-[#D97706] flex-shrink-0 mt-0.5" />
        <p className="text-xs text-amber-900 leading-relaxed font-medium">
          This check is for informational purposes only. Always consult your doctor or pharmacist before making any changes to your medications.
        </p>
      </div>
    </Card>
  )
}

export default SafetyStatusCard
