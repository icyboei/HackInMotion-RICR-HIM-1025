/**
 * FeatureCard.jsx
 * Responsibility: A single reusable card showing one MediSafe feature.
 * Props: icon (emoji string), title (string), description (string).
 * Connected to: Features.jsx renders 4 of these cards in a grid.
 *
 * Why separate? Because a card is a reusable UI unit. If we add more
 * features later, we just pass new props — no copy-pasting HTML.
 */
function FeatureCard({ icon, title, description }) {
  return (
    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-7 text-left
                    transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">
      <div className="text-3xl mb-3">{icon}</div>
      <h3 className="text-base font-semibold text-slate-900 mb-2">{title}</h3>
      <p className="text-sm text-slate-500 leading-relaxed">{description}</p>
    </div>
  )
}

export default FeatureCard
