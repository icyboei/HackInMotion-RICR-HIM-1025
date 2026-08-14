import { Link } from 'react-router-dom'
import { Card } from './ui/Card'
import { Badge } from './ui/Badge'
import { Button } from './ui/Button'
import { MedicalDoodleBackground } from './ui/MedicalDoodles'
import {
  ShieldCheckIcon,
  DatabaseIcon,
  GlobeIcon,
  BotIcon,
  AlertTriangleIcon,
  LockIcon,
  ArrowRightIcon,
  CheckIcon,
  SearchIcon,
  HeartPulseIcon,
  FileTextIcon,
} from './ui/Icons'

function Features() {
  return (
    <div id="features" className="space-y-0 text-[#12302E]">

      {/* ─── SECTION 3: TRUST STRIP ───────────────────────────────────────── */}
      <section className="bg-white border-b border-[#DCE8E5] py-10 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#64748B]">
            <ShieldCheckIcon className="w-4 h-4 text-[#0F766E]" />
            <span>Built around trusted medical data</span>
          </div>

          <div className="grid grid-cols-2 md:flex items-center gap-6 md:gap-10 text-xs font-semibold text-[#12302E]">
            <div className="flex items-center gap-2">
              <DatabaseIcon className="w-4 h-4 text-[#0F766E]" />
              <span>RxNorm (NIH / NLM)</span>
            </div>
            <div className="flex items-center gap-2">
              <GlobeIcon className="w-4 h-4 text-[#0F766E]" />
              <span>OpenFDA Labels</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheckIcon className="w-4 h-4 text-[#0F766E]" />
              <span>FDA FAERS Reports</span>
            </div>
            <div className="flex items-center gap-2">
              <BotIcon className="w-4 h-4 text-[#0F766E]" />
              <span>AI-Assisted Explanations</span>
            </div>
          </div>
        </div>
      </section>

      {/* ─── SECTION 4: CORE VALUE EDITORIAL ──────────────────────────────── */}
      <section className="py-20 px-6 bg-[#F5F9F7] border-b border-[#DCE8E5]">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="max-w-2xl text-left space-y-4">
            <Badge variant="brand" size="sm">Core Capabilities</Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#12302E]">
              Medication safety shouldn't be complicated.
            </h2>
            <p className="text-base text-[#64748B] leading-relaxed">
              Understanding prescription interactions and health risks requires clear, verified data — not confusing jargon. MediSafe evaluates your entire medicine regimen in seconds.
            </p>
          </div>

          {/* Asymmetrical 3-Capability Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-8 space-y-4 bg-white hover:border-[#0F766E]/40 transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-black text-[#0F766E]/30">01</span>
                <div className="w-10 h-10 rounded-xl bg-[#EEF6F4] text-[#0F766E] flex items-center justify-center">
                  <SearchIcon className="w-5 h-5" />
                </div>
              </div>
              <h3 className="text-lg font-bold text-[#12302E]">Check Interactions</h3>
              <p className="text-sm text-[#64748B] leading-relaxed">
                Evaluate multi-drug combinations automatically across RxNorm and OpenFDA databases for potential conflicts.
              </p>
            </Card>

            <Card className="p-8 space-y-4 bg-white hover:border-[#0F766E]/40 transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-black text-[#0F766E]/30">02</span>
                <div className="w-10 h-10 rounded-xl bg-[#EEF6F4] text-[#0F766E] flex items-center justify-center">
                  <HeartPulseIcon className="w-5 h-5" />
                </div>
              </div>
              <h3 className="text-lg font-bold text-[#12302E]">Understand Your Risk</h3>
              <p className="text-sm text-[#64748B] leading-relaxed">
                Clear severity ratings from mild to critical, with plain-language explanations of potential side effects.
              </p>
            </Card>

            <Card className="p-8 space-y-4 bg-white hover:border-[#0F766E]/40 transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-black text-[#0F766E]/30">03</span>
                <div className="w-10 h-10 rounded-xl bg-[#EEF6F4] text-[#0F766E] flex items-center justify-center">
                  <FileTextIcon className="w-5 h-5" />
                </div>
              </div>
              <h3 className="text-lg font-bold text-[#12302E]">Stay Informed & Saved</h3>
              <p className="text-sm text-[#64748B] leading-relaxed">
                Check allergy profiles, detect duplicate active ingredients, and explore generic price alternatives.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* ─── SECTION 5: INTERACTION CHECK VISUAL SHOWCASE ─────────────────── */}
      <section className="py-20 px-6 bg-white border-b border-[#DCE8E5]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

          {/* Product Graphic Representation */}
          <div className="lg:col-span-6 bg-[#EEF6F4]/60 p-8 rounded-3xl border border-[#DCE8E5]">
            <div className="bg-white p-6 rounded-2xl border border-[#DCE8E5] shadow-sm space-y-5">
              <div className="flex items-center justify-between border-b border-[#DCE8E5] pb-4">
                <span className="text-xs font-bold uppercase text-[#12302E] tracking-wider">Pairwise Evaluation</span>
                <Badge variant="warning" size="sm">Moderate Risk</Badge>
              </div>

              {/* Medicine A + B Pair */}
              <div className="flex items-center justify-center gap-3 py-2">
                <div className="px-4 py-2 rounded-xl bg-[#F5F9F7] border border-[#DCE8E5] text-xs font-bold text-[#12302E]">
                  Aspirin 81mg
                </div>
                <span className="text-lg font-extrabold text-[#0F766E]">+</span>
                <div className="px-4 py-2 rounded-xl bg-[#F5F9F7] border border-[#DCE8E5] text-xs font-bold text-[#12302E]">
                  Ibuprofen 400mg
                </div>
              </div>

              {/* Flow Arrow */}
              <div className="flex justify-center text-[#0F766E]">
                <div className="w-8 h-8 rounded-full bg-[#EEF6F4] flex items-center justify-center border border-[#DCE8E5]">
                  ↓
                </div>
              </div>

              {/* Interaction Box */}
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-left space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-bold text-[#D97706]">
                  <AlertTriangleIcon className="w-4 h-4" />
                  <span>Interaction Identified</span>
                </div>
                <p className="text-xs text-amber-900 leading-relaxed">
                  Combining NSAIDs like Ibuprofen with low-dose Aspirin may decrease Aspirin's cardioprotective efficacy and elevate gastrointestinal bleeding risk.
                </p>
              </div>
            </div>
          </div>

          {/* Section Description */}
          <div className="lg:col-span-6 text-left space-y-6">
            <Badge variant="brand" size="sm">Independent Verification</Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#12302E]">
              Check multiple medicines at once.
            </h2>
            <p className="text-base text-[#64748B] leading-relaxed">
              Every drug combination in your list is evaluated independently. MediSafe verifies interaction severity, overlapping active ingredients, and reported adverse events across two separate medical APIs.
            </p>
            <div className="pt-2">
              <Link to="/checker" className="no-underline">
                <Button size="lg" variant="primary" icon={ArrowRightIcon} iconPosition="right">
                  Try the Safety Checker
                </Button>
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* ─── SECTION 6: AI ASSISTANT SHOWCASE ─────────────────────────────── */}
      <section className="py-20 px-6 bg-[#F5F9F7] border-b border-[#DCE8E5]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

          {/* Left Explanation */}
          <div className="lg:col-span-5 text-left space-y-6">
            <Badge variant="brand" size="sm" icon={BotIcon}>AI Assistant</Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#12302E]">
              Medical answers, explained simply.
            </h2>
            <p className="text-base text-[#64748B] leading-relaxed">
              Have questions about your medicines or interaction warnings? Ask MediSafe AI to translate complex pharmacological details into plain, understandable guidance.
            </p>
            <div className="pt-2">
              <Link to="/ai" className="no-underline">
                <Button size="lg" variant="secondary" icon={ArrowRightIcon} iconPosition="right">
                  Ask AI Assistant
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Conversational Mockup Card */}
          <div className="lg:col-span-7">
            <Card className="p-6 bg-white shadow-md space-y-4 border-[#DCE8E5] text-left">

              {/* Chat Header */}
              <div className="flex items-center justify-between border-b border-[#DCE8E5] pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#0F766E] text-white flex items-center justify-center font-bold text-xs">
                    <BotIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#12302E]">MediSafe AI Assistant</h4>
                    <span className="text-[10px] text-emerald-600 font-semibold">Grounded in RxNorm & OpenFDA</span>
                  </div>
                </div>
                <Badge variant="neutral" size="sm">Demo Interaction</Badge>
              </div>

              {/* User Prompt Bubble */}
              <div className="flex justify-end">
                <div className="bg-[#EEF6F4] text-[#12302E] p-3.5 rounded-2xl rounded-tr-xs text-xs font-medium max-w-md border border-[#DCE8E5]">
                  "Can I take Aspirin and Ibuprofen together every morning?"
                </div>
              </div>

              {/* AI Reply Bubble */}
              <div className="flex justify-start">
                <div className="bg-[#F5F9F7] text-[#12302E] p-4 rounded-2xl rounded-tl-xs text-xs space-y-2.5 max-w-lg border border-[#DCE8E5]">
                  <div className="flex items-center gap-2">
                    <Badge variant="warning" size="sm">Moderate Risk Warning</Badge>
                  </div>
                  <p className="leading-relaxed">
                    It is generally not recommended to take Aspirin and Ibuprofen concurrently every day without medical supervision. Ibuprofen can interfere with Aspirin's blood-thinning cardioprotective benefits and increase stomach discomfort.
                  </p>
                  <div className="pt-1 text-[11px] text-[#64748B] flex items-center gap-1.5 border-t border-[#DCE8E5]/60">
                    <ShieldCheckIcon className="w-3.5 h-3.5 text-[#0F766E]" />
                    <span>Source: RxNorm Interaction API & OpenFDA Labeling</span>
                  </div>
                </div>
              </div>

              <p className="text-[11px] text-[#94A3B8] italic pt-1">
                * MediSafe AI translates official drug data for educational clarity and does not replace your physician or pharmacist.
              </p>
            </Card>
          </div>

        </div>
      </section>

      {/* ─── SECTION 8: SECURITY & PRIVACY TRUST ──────────────────────────── */}
      <section className="py-20 px-6 bg-white border-b border-[#DCE8E5]">
        <div className="max-w-7xl mx-auto space-y-12 text-center">
          <div className="max-w-xl mx-auto space-y-3">
            <Badge variant="brand" size="sm" icon={LockIcon}>Security & Privacy</Badge>
            <h2 className="text-3xl font-extrabold tracking-tight text-[#12302E]">
              Your health information deserves privacy.
            </h2>
            <p className="text-sm text-[#64748B]">
              We adhere to essential privacy principles so you can check medications with total peace of mind.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <Card className="p-6 bg-[#F5F9F7] border-[#DCE8E5] space-y-3">
              <div className="w-9 h-9 rounded-xl bg-white text-[#0F766E] flex items-center justify-center border border-[#DCE8E5]">
                <ShieldCheckIcon className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#12302E]">Private by Design</h3>
              <p className="text-xs text-[#64748B] leading-relaxed">
                Searches and medication checks can be performed anonymously without creating a permanent tracking profile.
              </p>
            </Card>

            <Card className="p-6 bg-[#F5F9F7] border-[#DCE8E5] space-y-3">
              <div className="w-9 h-9 rounded-xl bg-white text-[#0F766E] flex items-center justify-center border border-[#DCE8E5]">
                <LockIcon className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#12302E]">Secure Authentication</h3>
              <p className="text-xs text-[#64748B] leading-relaxed">
                User accounts use JWT session tokens and password hashing protocols to protect saved history.
              </p>
            </Card>

            <Card className="p-6 bg-[#F5F9F7] border-[#DCE8E5] space-y-3">
              <div className="w-9 h-9 rounded-xl bg-white text-[#0F766E] flex items-center justify-center border border-[#DCE8E5]">
                <CheckIcon className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#12302E]">Your Data Stays Yours</h3>
              <p className="text-xs text-[#64748B] leading-relaxed">
                We never sell, trade, or share medication history with third-party advertisers or insurance brokers.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* ─── SECTION 9: FINAL CTA ─────────────────────────────────────────── */}
      <section className="relative py-20 px-6 bg-[#0F766E] text-white overflow-hidden">
        <MedicalDoodleBackground density="dense" className="opacity-20 text-white" />
        <div className="relative max-w-3xl mx-auto text-center space-y-6 z-10">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Make every medicine decision a little safer.
          </h2>
          <p className="text-base text-emerald-100 max-w-xl mx-auto leading-relaxed">
            Check interactions before they become a problem. Free, instant, and cross-verified across official sources.
          </p>
          <div className="pt-2 flex justify-center">
            <Link to="/checker" className="no-underline">
              <Button
                size="lg"
                variant="ghost"
                className="!bg-white !text-[#0F766E] border-2 border-white hover:!bg-[#115E59] hover:!text-white hover:!border-[#115E59] shadow-lg transition-all duration-200"
                icon={ArrowRightIcon}
                iconPosition="right"
              >
                Check Medicine Safety
              </Button>
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}

export default Features
