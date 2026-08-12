const SEVERITY_CONFIG = {
  critical: {
    label: 'Critical',
    bg: 'bg-red-950/60',
    border: 'border-red-700',
    text: 'text-red-300',
    dot: 'bg-red-500',
    pulse: true,
  },
  severe: {
    label: 'Severe',
    bg: 'bg-orange-950/60',
    border: 'border-orange-700',
    text: 'text-orange-300',
    dot: 'bg-orange-500',
    pulse: false,
  },
  moderate: {
    label: 'Moderate',
    bg: 'bg-yellow-950/60',
    border: 'border-yellow-700',
    text: 'text-yellow-300',
    dot: 'bg-yellow-400',
    pulse: false,
  },
  mild: {
    label: 'Mild',
    bg: 'bg-blue-950/60',
    border: 'border-blue-700',
    text: 'text-blue-300',
    dot: 'bg-blue-400',
    pulse: false,
  },
  none: {
    label: 'No Interaction',
    bg: 'bg-green-950/60',
    border: 'border-green-700',
    text: 'text-green-300',
    dot: 'bg-green-500',
    pulse: false,
  },
  unknown: {
    label: 'Insufficient Data',
    bg: 'bg-slate-800/60',
    border: 'border-slate-600',
    text: 'text-slate-400',
    dot: 'bg-slate-500',
    pulse: false,
  },
}

function SeverityBadge({ severity, size = 'sm' }) {
  const cfg = SEVERITY_CONFIG[severity] || SEVERITY_CONFIG.unknown
  const textSize = size === 'lg' ? 'text-sm' : 'text-xs'
  const padding = size === 'lg' ? 'px-3 py-1.5' : 'px-2.5 py-1'

  return (
    <span className={`inline-flex items-center gap-1.5 ${padding} rounded-full font-semibold ${textSize} ${cfg.bg} ${cfg.border} ${cfg.text} border`}>
      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${cfg.dot} ${cfg.pulse ? 'animate-pulse' : ''}`} />
      {cfg.label}
    </span>
  )
}

export default SeverityBadge
export { SEVERITY_CONFIG }
