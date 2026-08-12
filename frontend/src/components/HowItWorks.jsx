/**
 * HowItWorks.jsx — updated with 5-step process and dark theme
 */
const steps = [
  { number: 1, title: 'Register & log in',     description: 'Create a free account. Your data stays private and visible only to you.' },
  { number: 2, title: 'Add your medicines',     description: 'Search and add each medicine. Use search, or scan a prescription with OCR.' },
  { number: 3, title: 'We check all pairs',     description: 'Every combination of your medicines is evaluated against real medical databases.' },
  { number: 4, title: 'Get verified results',   description: 'Results are cross-verified by two independent sources — RxNorm and OpenFDA.' },
  { number: 5, title: 'Ask questions anytime',  description: 'Use the AI assistant to understand any medicine or interaction in plain language.' },
]

function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-slate-950 py-20 px-6 text-center border-b border-slate-800">
      <h2 className="text-3xl font-bold text-white mb-12">How MediSafe Works</h2>

      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-8">
        {steps.map((step, i) => (
          <div key={step.number} className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold text-lg mb-4 shadow-lg shadow-teal-900/50">
              {step.number}
            </div>
            {i < steps.length - 1 && (
              <div className="hidden md:block absolute translate-x-[80px] translate-y-[-28px] text-slate-700 text-lg">→</div>
            )}
            <h3 className="text-sm font-semibold text-slate-100 mb-2">{step.title}</h3>
            <p className="text-xs text-slate-500 leading-relaxed">{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

export default HowItWorks
