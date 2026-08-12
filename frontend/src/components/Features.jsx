import FeatureCard from './FeatureCard'

const features = [
  { icon: '🔍', title: 'Smart Medicine Search',        description: 'Find medicines by generic or brand name, even with spelling mistakes. Powered by RxNorm.' },
  { icon: '⚠️', title: 'Interaction Detection',         description: 'Check up to 10 medicines at once. We evaluate every pair combination automatically.' },
  { icon: '📊', title: 'Clear Risk Levels',             description: 'Severity shown as mild, moderate, severe, or critical — with plain-language explanations.' },
  { icon: '🔗', title: 'Two-Source Cross-Check',        description: 'Every interaction is independently verified against RxNorm and OpenFDA FAERS adverse events.' },
  { icon: '🚨', title: 'Allergy Warnings',              description: 'Log your allergies. We alert you if a new medicine conflicts with your allergy profile.' },
  { icon: '💊', title: 'Duplicate Therapy Detection',   description: 'Identifies medicines sharing the same active ingredient or overlapping effects.' },
  { icon: '🤖', title: 'AI Medical Assistant',          description: 'Ask questions about medicines and interactions. Answers retrieved from real drug data.' },
  { icon: '📄', title: 'Prescription Scanner',          description: 'Scan your prescription image. OCR extracts medicine names for confirmation before adding.' },
  { icon: '💰', title: 'Price Explorer',                description: 'Search for potential lower-cost products with the same active ingredient and formulation.' },
  { icon: '⏰', title: 'Medication Reminders',          description: 'Set daily medicine reminders with flexible schedules and dosage notes.' },
  { icon: '🌐', title: 'Hindi Support',                 description: 'Interface available in English and Hindi. More languages can be added.' },
  { icon: '🔒', title: 'Private & Secure',              description: 'Your medication data is only visible to you. Secured with JWT authentication.' },
]

function Features() {
  return (
    <section id="features" className="py-20 px-6 bg-slate-900/40 border-y border-slate-800">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-white mb-3">Everything You Need for Medication Safety</h2>
        <p className="text-slate-400 text-base mb-12">
          Professional-grade tools for patients, caregivers, and healthcare professionals.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {features.map((feature) => (
            <FeatureCard
              key={feature.title}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default Features
