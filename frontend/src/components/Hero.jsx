import { Link } from 'react-router-dom'

/**
 * Hero.jsx — Updated with stronger headline and wired CTAs
 */
function Hero() {
  return (
    <section
      id="home"
      className="relative bg-slate-950 py-24 px-6 text-center overflow-hidden"
    >
      {/* Background glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-teal-950/40 via-slate-950 to-indigo-950/30 pointer-events-none" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-2xl mx-auto">
        {/* Badge */}
        <span className="inline-block bg-teal-950 border border-teal-700/50 text-teal-400 text-xs font-semibold px-4 py-1.5 rounded-full mb-6">
          🛡️ Your digital health companion
        </span>

        {/* Headline */}
        <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-5">
          Check Your Medicines<br />
          <span className="text-teal-400">Before They Check You.</span>
        </h1>

        {/* Subtext */}
        <p className="text-lg text-slate-400 mb-8 leading-relaxed">
          Add the medicines you take and instantly check for risky interactions —
          explained in plain language, cross-verified by two independent sources.
        </p>

        {/* CTA buttons */}
        <div className="flex gap-4 justify-center flex-wrap">
          <Link
            id="hero-cta-primary"
            to="/checker"
            className="px-7 py-3.5 text-base font-semibold bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition-all hover:scale-105 shadow-lg shadow-teal-900/50 no-underline"
          >
            ⚡ Check Medicine Safety
          </Link>
          <Link
            id="hero-cta-secondary"
            to="/prices"
            className="px-7 py-3.5 text-base font-semibold text-teal-400 border-2 border-teal-700 rounded-xl hover:bg-teal-950 transition-all no-underline"
          >
            💰 Explore Medicine Prices
          </Link>
        </div>

        {/* Trust indicators */}
        <div className="flex items-center justify-center gap-6 mt-10 flex-wrap">
          {[
            { icon: '🔬', label: 'RxNorm data' },
            { icon: '🏥', label: 'OpenFDA verified' },
            { icon: '🤖', label: 'AI-powered' },
            { icon: '🔒', label: 'Private & secure' },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-1.5 text-xs text-slate-500">
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Hero
