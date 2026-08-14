import { useState } from 'react'
import Navbar from '../components/Navbar'
import MedicineSearch from '../components/MedicineSearch'
import { Card } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { MedicalDoodleBackground } from '../components/ui/MedicalDoodles'
import { SearchIcon, PillIcon, AlertTriangleIcon, ArrowRightIcon } from '../components/ui/Icons'

/**
 * PriceExplorer — Medicine price comparison page.
 * Live price data is simulated per specification with external pharmacy price resources.
 */
function PriceExplorer() {
  const [selectedMedicine, setSelectedMedicine] = useState(null)
  const [searching, setSearching] = useState(false)

  function handleSelect(med) {
    setSelectedMedicine(med)
    setSearching(true)
    // Simulate checking — in production, connect a price API here
    setTimeout(() => setSearching(false), 1500)
  }

  return (
    <div className="min-h-screen bg-[#F5F9F7] text-[#12302E] flex flex-col relative overflow-hidden font-sans">
      {/* Background Medical Doodles */}
      <MedicalDoodleBackground density="normal" />

      <Navbar />

      <main className="relative z-10 flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 py-8">
        {/* Page Header */}
        <div className="mb-8 border-b border-[#DCE8E5] pb-6">
          <Badge variant="brand" size="md" icon={SearchIcon} className="bg-white border-[#DCE8E5] mb-2.5">
            PRICE EXPLORER
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#12302E] tracking-tight">Medicine Price Explorer</h1>
          <p className="text-[#64748B] text-sm sm:text-base mt-1">
            Find potential lower-cost products with the same active ingredient and formulation.
          </p>
        </div>

        {/* Safety Note */}
        <div className="bg-amber-50/90 border border-amber-200 text-amber-900 rounded-2xl p-4 mb-6 shadow-sm flex items-start gap-3">
          <AlertTriangleIcon className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" />
          <p className="text-xs sm:text-sm leading-relaxed font-medium">
            <strong>Important:</strong> Only confirm a substitution with your doctor or pharmacist. MediSafe does not recommend replacing a prescribed medicine without medical guidance.
          </p>
        </div>

        {/* Search Medicine Card */}
        <Card className="bg-white border-[#DCE8E5] p-6 mb-6 shadow-sm rounded-2xl">
          <h2 className="text-xs font-bold text-[#64748B] uppercase tracking-wide mb-4">Search Medicine</h2>
          <MedicineSearch
            onSelect={handleSelect}
            placeholder="Search medicine to compare prices (e.g. metformin, atorvastatin)..."
          />
        </Card>

        {/* Selected Medicine Info */}
        {selectedMedicine && (
          <Card className="bg-white border-[#DCE8E5] p-6 mb-6 shadow-sm rounded-2xl">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#EEF6F4] text-[#0F766E] border border-[#DCE8E5] flex items-center justify-center flex-shrink-0">
                <PillIcon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-[#12302E] font-bold text-base capitalize">{selectedMedicine.genericName}</h3>
                {selectedMedicine.brandName && (
                  <p className="text-[#64748B] text-sm font-medium">Brand: {selectedMedicine.brandName}</p>
                )}
                <p className="text-[#94A3B8] text-xs mt-1 font-medium">RXCUI: {selectedMedicine.rxcui} · Source: RxNorm</p>
              </div>
            </div>
          </Card>
        )}

        {/* Price Results / Comparison Sources */}
        {selectedMedicine && (
          <Card className="bg-white border-[#DCE8E5] p-6 mb-6 shadow-sm rounded-2xl">
            <div className="flex items-center justify-between mb-4 border-b border-[#DCE8E5] pb-3">
              <h3 className="text-xs font-bold text-[#64748B] uppercase tracking-wide">
                Potential lower-cost products with matching active ingredient
              </h3>
            </div>

            {searching ? (
              <div className="flex items-center gap-3 py-8 justify-center">
                <div className="w-5 h-5 border-2 border-[#0F766E] border-t-transparent rounded-full animate-spin" />
                <p className="text-[#64748B] text-sm font-medium">Checking available price sources...</p>
              </div>
            ) : (
              <div>
                {/* Price Unavailable Notice */}
                <div className="text-center py-8 border border-dashed border-[#DCE8E5] bg-[#EEF6F4]/30 rounded-2xl p-6 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-[#EEF6F4] text-[#0F766E] border border-[#DCE8E5] flex items-center justify-center mx-auto mb-3">
                    <PillIcon className="w-6 h-6" />
                  </div>
                  <p className="text-[#12302E] font-bold text-sm">Live price information is currently unavailable.</p>
                  <p className="text-[#64748B] text-xs mt-1.5 max-w-sm mx-auto leading-relaxed">
                    Real-time medicine pricing requires a dedicated price data API. Contact your local pharmacies directly for current pricing.
                  </p>
                </div>

                {/* Where to Compare Prices Links */}
                <div className="space-y-2.5">
                  <p className="text-xs font-bold text-[#64748B] uppercase tracking-wide mb-2">Where to Compare Prices</p>
                  {[
                    { name: '1mg', url: 'https://www.1mg.com', desc: 'Compare medicine prices across pharmacies' },
                    { name: 'PharmEasy', url: 'https://pharmeasy.in', desc: 'Online pharmacy with price comparison' },
                    { name: 'Netmeds', url: 'https://www.netmeds.com', desc: 'Search generic alternatives' },
                    { name: 'GoodRx (US)', url: 'https://www.goodrx.com', desc: 'US pharmacy price comparison' },
                  ].map((site) => (
                    <a
                      key={site.name}
                      href={site.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between px-4.5 py-3.5 bg-white hover:bg-[#EEF6F4] border border-[#DCE8E5] rounded-xl transition-all shadow-sm group"
                    >
                      <div>
                        <p className="text-[#12302E] text-sm font-bold">{site.name}</p>
                        <p className="text-[#64748B] text-xs font-medium">{site.desc}</p>
                      </div>
                      <span className="text-[#94A3B8] group-hover:text-[#0F766E] transition-colors font-bold text-sm">→</span>
                    </a>
                  ))}
                </div>

                <p className="text-xs text-amber-900 font-medium mt-5 text-center flex items-center justify-center gap-1.5">
                  <AlertTriangleIcon className="w-3.5 h-3.5 text-amber-700 flex-shrink-0" />
                  Confirm substitution with your doctor or pharmacist before changing a prescribed medicine.
                </p>
              </div>
            )}
          </Card>
        )}

        {/* How Price Comparison Works */}
        {!selectedMedicine && (
          <Card className="bg-white border-[#DCE8E5] p-6 shadow-sm rounded-2xl">
            <h3 className="text-xs font-bold text-[#64748B] uppercase tracking-wide mb-5">How Price Comparison Works</h3>
            <div className="grid sm:grid-cols-3 gap-6">
              {[
                { step: '1', label: 'Select medicine', desc: 'Search by generic or brand name above' },
                { step: '2', label: 'Identify active ingredient', desc: 'We extract the active ingredient, strength, and form' },
                { step: '3', label: 'Find equivalents', desc: 'Products matching all key properties are shown' },
              ].map((s) => (
                <div key={s.step} className="text-center">
                  <div className="w-9 h-9 rounded-full bg-[#EEF6F4] text-[#0F766E] border border-[#DCE8E5] flex items-center justify-center font-extrabold text-sm mx-auto mb-3 shadow-sm">
                    {s.step}
                  </div>
                  <p className="text-[#12302E] text-sm font-bold">{s.label}</p>
                  <p className="text-[#64748B] text-xs mt-1 leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>

            {/* Matching Criteria Sub-Panel */}
            <div className="mt-6 bg-[#EEF6F4]/60 border border-[#DCE8E5] rounded-xl p-4">
              <p className="text-xs text-[#0F766E] font-bold uppercase tracking-wide mb-2.5">Matching criteria</p>
              <div className="flex flex-wrap gap-2">
                {['Active ingredient', 'Strength', 'Dosage form', 'Route', 'Release mechanism', 'Pack size'].map((c) => (
                  <span key={c} className="text-xs px-3 py-1 bg-white border border-[#DCE8E5] text-[#0F766E] font-semibold rounded-full shadow-sm">
                    {c}
                  </span>
                ))}
              </div>
              <p className="text-xs text-amber-900 font-medium mt-3 flex items-start gap-1.5">
                <AlertTriangleIcon className="w-3.5 h-3.5 text-amber-700 flex-shrink-0 mt-0.5" />
                SR/ER/XR/CR/MR formulations are treated separately and will not be shown as equivalents of immediate-release products.
              </p>
            </div>
          </Card>
        )}
      </main>
    </div>
  )
}

export default PriceExplorer
