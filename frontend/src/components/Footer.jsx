import { Link } from 'react-router-dom'
import { MedicalCrossIcon } from './ui/Icons'

/**
 * Footer.jsx — Minimal & Premium Clinical Footer
 */
function Footer() {
  return (
    <footer className="bg-white border-t border-[#DCE8E5] py-12 px-6 text-[#12302E]">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">

          {/* Column 1: Brand & Tagline */}
          <div className="md:col-span-5 text-left space-y-3">
            <Link to="/" className="flex items-center gap-2.5 font-extrabold text-xl text-[#0F766E] no-underline">
              <div className="w-7 h-7 rounded-lg bg-[#0F766E] text-white flex items-center justify-center shadow-xs">
                <MedicalCrossIcon className="w-4 h-4" />
              </div>
              <span className="tracking-tight text-[#12302E]">Medi<span className="text-[#0F766E]">Safe</span></span>
            </Link>
            <p className="text-xs text-[#64748B] max-w-sm leading-relaxed">
              Smarter medication safety for everyone. Cross-verifying drug interactions, allergy risks, and duplicate therapies in real time.
            </p>
          </div>

          {/* Column 2: Navigation Links */}
          <div className="md:col-span-3 text-left space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#12302E]">Platform</h4>
            <div className="flex flex-col gap-2 text-xs font-medium text-[#64748B]">
              <Link to="/checker" className="hover:text-[#0F766E] transition-colors no-underline">Safety Checker</Link>
              <Link to="/ai" className="hover:text-[#0F766E] transition-colors no-underline">AI Assistant</Link>
              <Link to="/prices" className="hover:text-[#0F766E] transition-colors no-underline">Price Explorer</Link>
              <Link to="/reminders" className="hover:text-[#0F766E] transition-colors no-underline">Medication Reminders</Link>
            </div>
          </div>

          {/* Column 3: Medical Sources */}
          <div className="md:col-span-4 text-left space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#12302E]">Primary Data Sources</h4>
            <div className="flex flex-col gap-1.5 text-xs text-[#64748B]">
              <p>• RxNorm — NIH National Library of Medicine</p>
              <p>• OpenFDA — Drug Labeling & Approvals</p>
              <p>• FDA FAERS — Adverse Event Reporting</p>
            </div>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="pt-6 border-t border-[#DCE8E5] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#94A3B8]">
          <p>© {new Date().getFullYear()} MediSafe. Built for safer medication management.</p>
          <p className="text-[11px]">Educational and informational platform only.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
