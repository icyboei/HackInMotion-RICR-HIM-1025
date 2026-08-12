const STATUS_CONFIG = {
  agree: {
    icon: '🟢',
    label: 'Sources agree',
    desc: 'Both RxNorm and FAERS adverse event data are consistent.',
    color: 'text-green-300',
    border: 'border-green-800',
    bg: 'bg-green-950/40',
  },
  partial: {
    icon: '🟡',
    label: 'Partial agreement',
    desc: 'Sources partially agree. Some data may be missing.',
    color: 'text-yellow-300',
    border: 'border-yellow-800',
    bg: 'bg-yellow-950/40',
  },
  disagree: {
    icon: '🔴',
    label: 'Sources disagree',
    desc: 'Medical sources provide differing information. Please verify with a pharmacist or doctor.',
    color: 'text-red-300',
    border: 'border-red-800',
    bg: 'bg-red-950/40',
  },
  insufficient_data: {
    icon: '⚪',
    label: 'Insufficient data',
    desc: 'Not enough data available for cross-verification.',
    color: 'text-slate-400',
    border: 'border-slate-700',
    bg: 'bg-slate-800/40',
  },
}

function CrossCheckBadge({ status, compact = false }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.insufficient_data

  if (compact) {
    return (
      <span className={`text-xs font-medium ${cfg.color}`}>
        {cfg.icon} {cfg.label}
      </span>
    )
  }

  return (
    <div className={`rounded-xl border ${cfg.border} ${cfg.bg} p-4`}>
      <div className="flex items-center gap-2 mb-1">
        <span className="text-lg">{cfg.icon}</span>
        <span className={`font-semibold text-sm ${cfg.color}`}>{cfg.label}</span>
        <span className="ml-auto text-xs text-slate-500">Cross-Check</span>
      </div>
      <p className="text-xs text-slate-400 leading-relaxed">{cfg.desc}</p>
    </div>
  )
}

export default CrossCheckBadge
