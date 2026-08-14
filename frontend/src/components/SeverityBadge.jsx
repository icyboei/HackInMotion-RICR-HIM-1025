const SEVERITY_CONFIG = {
  critical: {
    label: 'Critical',
    bg: 'bg-rose-100',
    border: 'border-rose-300',
    text: 'text-[#B91C1C]',
    dot: 'bg-rose-600',
    pulse: true,
  },
  severe: {
    label: 'Severe',
    bg: 'bg-amber-50',
    border: 'border-amber-300',
    text: 'text-[#D97706]',
    dot: 'bg-amber-600',
    pulse: false,
  },
  moderate: {
    label: 'Moderate',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    text: 'text-[#D97706]',
    dot: 'bg-amber-500',
    pulse: false,
  },
  mild: {
    label: 'Mild',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    text: 'text-[#2563EB]',
    dot: 'bg-blue-500',
    pulse: false,
  },
  none: {
    label: 'No Known Interaction',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    text: 'text-[#16A34A]',
    dot: 'bg-emerald-500',
    pulse: false,
  },
  unknown: {
    label: 'Insufficient Data',
    bg: 'bg-slate-100',
    border: 'border-slate-200',
    text: 'text-[#64748B]',
    dot: 'bg-slate-400',
    pulse: false,
  },
}

function SeverityBadge({ severity, size = 'sm' }) {
  const cfg = SEVERITY_CONFIG[severity] || SEVERITY_CONFIG.unknown
  const textSize = size === 'lg' ? 'text-sm' : 'text-xs'
  const padding = size === 'lg' ? 'px-3.5 py-1.5' : 'px-2.5 py-1'

  return (
    <span className={`inline-flex items-center gap-1.5 ${padding} rounded-full font-semibold ${textSize} ${cfg.bg} ${cfg.border} ${cfg.text} border`}>
      <span className={`w-2 h-2 rounded-full flex-shrink-0 ${cfg.dot} ${cfg.pulse ? 'animate-pulse' : ''}`} />
      {cfg.label}
    </span>
  )
}

export default SeverityBadge
export { SEVERITY_CONFIG }
