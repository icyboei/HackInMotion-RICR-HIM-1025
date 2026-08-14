const STATUS_CONFIG = {
  agree: {
    icon: '🟢',
    label: 'Sources agree',
    desc: 'Both RxNorm and FAERS adverse event data are consistent.',
    color: 'text-emerald-800',
    border: 'border-emerald-200',
    bg: 'bg-emerald-50',
  },
  partial: {
    icon: '🟡',
    label: 'Partial agreement',
    desc: 'Sources partially agree. Some data may be missing.',
    color: 'text-amber-900',
    border: 'border-amber-200',
    bg: 'bg-amber-50',
  },
  disagree: {
    icon: '🔴',
    label: 'Sources disagree',
    desc: 'Medical sources provide differing information. Please verify with a pharmacist or doctor.',
    color: 'text-rose-900',
    border: 'border-rose-200',
    bg: 'bg-rose-50',
  },
  insufficient_data: {
    icon: '⚪',
    label: 'Insufficient data',
    desc: 'Not enough data available for cross-verification.',
    color: 'text-slate-700',
    border: 'border-slate-200',
    bg: 'bg-slate-50',
  },
}

function CrossCheckBadge({ status, compact = false }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.insufficient_data

  if (compact) {
    return (
      <span className={`text-xs font-semibold ${cfg.color}`}>
        {cfg.icon} {cfg.label}
      </span>
    )
  }

  return (
    <div className={`rounded-xl border ${cfg.border} ${cfg.bg} p-4`}>
      <div className="flex items-center gap-2 mb-1">
        <span className="text-base">{cfg.icon}</span>
        <span className={`font-bold text-xs uppercase tracking-wide ${cfg.color}`}>{cfg.label}</span>
        <span className="ml-auto text-[11px] font-semibold text-[#64748B]">Cross-Check Evidence</span>
      </div>
      <p className="text-xs text-[#64748B] leading-relaxed">{cfg.desc}</p>
    </div>
  )
}

export default CrossCheckBadge
