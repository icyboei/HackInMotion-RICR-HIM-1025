/**
 * FeatureCard.jsx — updated to match dark design system
 */
function FeatureCard({ icon, title, description }) {
  return (
    <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-6 text-left
                    transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-teal-900/20 hover:border-slate-600">
      <div className="text-3xl mb-3">{icon}</div>
      <h3 className="text-base font-semibold text-slate-100 mb-2">{title}</h3>
      <p className="text-sm text-slate-400 leading-relaxed">{description}</p>
    </div>
  )
}

export default FeatureCard
