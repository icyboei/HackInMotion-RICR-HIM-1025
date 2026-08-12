import FeatureCard from './FeatureCard'

/**
 * Features.jsx
 * Responsibility: "What MediSafe Does" section.
 * Contains: Section heading, subtext, and a 4-column responsive grid of FeatureCards.
 * Connected to: Home.jsx renders this after the Hero section.
 *               Uses FeatureCard to render each individual feature.
 *
 * To add a new feature later: just add another object to the `features` array below.
 */

const features = [
  {
    icon: '🔍',
    title: 'Search Any Medicine',
    description: 'Find medicines by brand or generic name, even with a small typo.',
  },
  {
    icon: '⚠️',
    title: 'Detect Interactions',
    description: 'We check your medicine list against real drug-safety data.',
  },
  {
    icon: '📊',
    title: 'Clear Risk Levels',
    description: 'See if an interaction is mild, moderate, or severe — at a glance.',
  },
  {
    icon: '🔒',
    title: 'Private & Secure',
    description: 'Your medicine list and history stay visible only to you.',
  },
]

function Features() {
  return (
    <section id="features" className="py-20 px-6 max-w-7xl mx-auto text-center">
      <h2 className="text-3xl font-bold text-slate-900 mb-3">What MediSafe Does</h2>
      <p className="text-slate-500 text-base mb-12">
        Simple tools that help you avoid dangerous drug combinations.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature) => (
          <FeatureCard
            key={feature.title}
            icon={feature.icon}
            title={feature.title}
            description={feature.description}
          />
        ))}
      </div>
    </section>
  )
}

export default Features
