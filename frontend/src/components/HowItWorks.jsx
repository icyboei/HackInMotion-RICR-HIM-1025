/**
 * HowItWorks.jsx
 * Responsibility: Explains the 3-step process of using MediSafe.
 * Contains: Section heading and 3 numbered step cards.
 * Connected to: Home.jsx renders this after Features.
 */

const steps = [
  {
    number: 1,
    title: 'Add your medicines',
    description: 'Search and add each medicine you currently take.',
  },
  {
    number: 2,
    title: 'We check for risks',
    description: 'Our system compares them against known interactions.',
  },
  {
    number: 3,
    title: 'Get simple guidance',
    description: 'See the risk level and what to do next.',
  },
]

function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-slate-50 py-20 px-6 text-center">
      <h2 className="text-3xl font-bold text-slate-900 mb-12">How It Works</h2>

      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {steps.map((step) => (
          <div key={step.number} className="flex flex-col items-center">
            {/* Step number circle */}
            <div className="w-10 h-10 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold mb-4">
              {step.number}
            </div>
            <h3 className="text-base font-semibold text-slate-900 mb-2">{step.title}</h3>
            <p className="text-sm text-slate-500">{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

export default HowItWorks
