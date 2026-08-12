/**
 * Disclaimer.jsx
 * Responsibility: Medical disclaimer banner shown at the bottom of the landing page.
 * Contains: A warning note that MediSafe is informational only.
 * Connected to: Home.jsx renders this after HowItWorks.
 *
 * IMPORTANT: This disclaimer is legally and ethically necessary.
 * MediSafe must never claim to replace a doctor or pharmacist.
 * Do not remove or weaken this component.
 */
function Disclaimer() {
  return (
    <section className="bg-amber-50 border-y border-amber-200 py-5 px-6 text-center">
      <p className="text-sm text-amber-800 max-w-3xl mx-auto">
        ⚠️{' '}
        <strong>Medical Disclaimer:</strong> MediSafe provides general information only and is
        not a substitute for professional medical advice. Always consult your doctor or
        pharmacist before making any decisions about your medications.
      </p>
    </section>
  )
}

export default Disclaimer
