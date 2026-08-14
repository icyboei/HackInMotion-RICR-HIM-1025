import { Link } from 'react-router-dom'
import { Button } from './ui/Button'
import { Badge } from './ui/Badge'
import { Card } from './ui/Card'
import { MedicalDoodleBackground } from './ui/MedicalDoodles'
import { ShieldCheckIcon, AlertTriangleIcon, PillIcon, ArrowRightIcon, CheckIcon } from './ui/Icons'

/**
 * Hero.jsx — Redesigned Split Clinical Hero Component
 */
function Hero() {
  return (
    <section
      id="home"
      className="relative bg-[#F5F9F7] py-16 md:py-24 px-6 overflow-hidden border-b border-[#DCE8E5]"
    >
      {/* Background Medical Doodles */}
      <MedicalDoodleBackground density="dense" />

      <div className="relative max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center z-10">

        {/* LEFT COLUMN: Copy & CTAs */}
        <div className="lg:col-span-7 flex flex-col items-start text-left space-y-6">

          {/* Eyebrow */}
          <Badge variant="brand" size="md" icon={ShieldCheckIcon} className="bg-white border-[#DCE8E5]">
            SMARTER MEDICATION SAFETY
          </Badge>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#12302E] tracking-tight leading-[1.15]">
            Know What Your Medicines<br />
            <span className="text-[#0F766E]">Are Doing Together.</span>
          </h1>

          {/* Supporting Text */}
          <p className="text-base sm:text-lg text-[#64748B] max-w-2xl leading-relaxed">
            Check medicine interactions, allergy conflicts, duplicate therapies, and medication safety risks — backed by trusted medical data.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap gap-4 pt-2 w-full sm:w-auto">
            <Link to="/checker" className="no-underline w-full sm:w-auto">
              <Button size="lg" variant="primary" icon={ArrowRightIcon} iconPosition="right" className="w-full sm:w-auto">
                Check Medicine Safety
              </Button>
            </Link>
            <Link to="/prices" className="no-underline w-full sm:w-auto">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                Explore Medicine Prices
              </Button>
            </Link>
          </div>

          {/* Micro trust points */}
          <div className="pt-4 flex flex-wrap items-center gap-6 text-xs font-semibold text-[#64748B]">
            <div className="flex items-center gap-1.5">
              <CheckIcon className="w-4 h-4 text-[#0F766E]" />
              <span>Two Independent Sources</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckIcon className="w-4 h-4 text-[#0F766E]" />
              <span>Plain Language Risk Explanations</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckIcon className="w-4 h-4 text-[#0F766E]" />
              <span>100% Free & Private</span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Visual Dashboard Illustration Panel */}
        <div className="lg:col-span-5 relative w-full">
          <div className="relative mx-auto max-w-md lg:max-w-none">

            {/* Main Interactive Preview Card */}
            <Card className="p-6 bg-white shadow-lg border-[#DCE8E5] space-y-4">

              {/* Panel Header */}
              <div className="flex items-center justify-between border-b border-[#DCE8E5] pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-[#EEF6F4] text-[#0F766E] flex items-center justify-center">
                    <ShieldCheckIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#12302E]">Safety Analysis</h4>
                    <p className="text-[11px] text-[#94A3B8]">Active Regimen Evaluation</p>
                  </div>
                </div>
                <Badge variant="warning" size="sm" icon={AlertTriangleIcon}>
                  Moderate Risk
                </Badge>
              </div>

              {/* Regimen Items */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between p-3 rounded-xl bg-[#F5F9F7] border border-[#DCE8E5]">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg bg-white text-[#0F766E] flex items-center justify-center border border-[#DCE8E5]">
                      <PillIcon className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#12302E]">Aspirin 81mg</p>
                      <p className="text-[10px] text-[#64748B]">Antiplatelet</p>
                    </div>
                  </div>
                  <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">Verified</span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-[#F5F9F7] border border-[#DCE8E5]">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg bg-white text-[#0F766E] flex items-center justify-center border border-[#DCE8E5]">
                      <PillIcon className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#12302E]">Ibuprofen 400mg</p>
                      <p className="text-[10px] text-[#64748B]">NSAID Pain Reliever</p>
                    </div>
                  </div>
                  <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">Verified</span>
                </div>
              </div>

              {/* Interaction Warning Result Box */}
              <div className="p-3.5 rounded-xl bg-amber-50/80 border border-amber-200 text-left space-y-1">
                <div className="flex items-center justify-between text-xs font-bold text-[#D97706]">
                  <span className="flex items-center gap-1.5">
                    <AlertTriangleIcon className="w-4 h-4" />
                    Interaction Detected
                  </span>
                  <span className="text-[10px] font-medium text-amber-700">RxNorm + OpenFDA</span>
                </div>
                <p className="text-[11px] text-amber-900 leading-snug">
                  Taking Ibuprofen with Aspirin may reduce Aspirin's cardioprotective effects and increase stomach irritation risk.
                </p>
              </div>

              {/* Footer status bar */}
              <div className="pt-1 flex items-center justify-between text-[11px] text-[#64748B]">
                <span>Cross-checked against FAERS database</span>
                <span className="font-semibold text-[#0F766E]">2 Sources Agree</span>
              </div>
            </Card>

            {/* Floating Decorative Accent Badge */}
            <div className="absolute -bottom-4 -left-4 bg-white p-3 rounded-2xl border border-[#DCE8E5] shadow-md flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <CheckIcon className="w-5 h-5" />
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-[#12302E]">No Allergy Conflict</p>
                <p className="text-[10px] text-[#64748B]">Checked against patient history</p>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  )
}

export default Hero
