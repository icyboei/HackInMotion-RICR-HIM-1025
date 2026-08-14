import { AlertTriangleIcon } from './ui/Icons'

/**
 * Disclaimer.jsx — Professional Clinical Notice
 */
function Disclaimer() {
  return (
    <section className="bg-amber-50/60 border-y border-amber-200/80 py-6 px-6">
      <div className="max-w-4xl mx-auto flex items-start sm:items-center gap-3 text-left">
        <div className="w-8 h-8 rounded-lg bg-amber-100 text-[#D97706] flex items-center justify-center flex-shrink-0 mt-0.5 sm:mt-0">
          <AlertTriangleIcon className="w-5 h-5" />
        </div>
        <p className="text-xs text-amber-900 leading-relaxed">
          <strong className="font-bold">Medical Disclaimer:</strong> MediSafe provides general educational information synthesized from public health APIs (RxNorm, OpenFDA). It is not a substitute for professional medical advice, diagnosis, or treatment. Always consult your physician or pharmacist before changing, stopping, or taking any medication.
        </p>
      </div>
    </section>
  )
}

export default Disclaimer