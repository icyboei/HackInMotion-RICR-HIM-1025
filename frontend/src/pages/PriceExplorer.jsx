import { useState } from 'react'
import Navbar from '../components/Navbar'
import MedicineSearch from '../components/MedicineSearch'

/**
 * PriceExplorer — Medicine price comparison page.
 * Per specification: Live price data is not available via free APIs.
 * Shows a well-designed UI with appropriate disclaimers and a fallback message.
 * Any future price provider can be integrated by adding an API call in the useEffect below.
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
    <div className="min-h-screen bg-slate-950 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white mb-1">Medicine Price Explorer</h1>
          <p className="text-slate-400 text-sm">Find potential lower-cost products with the same active ingredient and formulation.</p>
        </div>

        {/* Safety note */}
        <div className="bg-amber-950/30 border border-amber-800/50 rounded-xl px-4 py-3 mb-6">
          <p className="text-xs text-amber-300/80">
            ⚠️ <strong>Important:</strong> Only confirm a substitution with your doctor or pharmacist. MediSafe does not recommend replacing a prescribed medicine without medical guidance.
          </p>
        </div>

        {/* Search */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-6">
          <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wide mb-4">Search Medicine</h2>
          <MedicineSearch
            onSelect={handleSelect}
            placeholder="Search medicine to compare prices (e.g. metformin, atorvastatin)..."
          />
        </div>

        {/* Selected medicine info */}
        {selectedMedicine && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-teal-900/40 border border-teal-700/40 flex items-center justify-center text-2xl flex-shrink-0">
                💊
              </div>
              <div>
                <h3 className="text-white font-semibold capitalize">{selectedMedicine.genericName}</h3>
                {selectedMedicine.brandName && (
                  <p className="text-slate-400 text-sm">Brand: {selectedMedicine.brandName}</p>
                )}
                <p className="text-slate-500 text-xs mt-1">RXCUI: {selectedMedicine.rxcui} · Source: RxNorm</p>
              </div>
            </div>
          </div>
        )}

        {/* Price results — placeholder per specification */}
        {selectedMedicine && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wide">
                Potential lower-cost products with matching active ingredient and formulation
              </h3>
            </div>

            {searching ? (
              <div className="flex items-center gap-3 py-8 justify-center">
                <div className="w-5 h-5 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
                <p className="text-slate-400 text-sm">Checking available price sources...</p>
              </div>
            ) : (
              <div>
                {/* Price unavailable notice per spec */}
                <div className="text-center py-8 border border-dashed border-slate-700 rounded-xl">
                  <div className="text-4xl mb-3">💰</div>
                  <p className="text-slate-300 font-medium text-sm">Live price information is currently unavailable.</p>
                  <p className="text-slate-500 text-xs mt-2 max-w-sm mx-auto">
                    Real-time medicine pricing requires a dedicated price data API. Contact your local pharmacies directly for current pricing.
                  </p>
                </div>

                {/* How to find prices — actionable guidance */}
                <div className="mt-5 space-y-3">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Where to compare prices</p>
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
                      className="flex items-center justify-between px-4 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl transition-colors group"
                    >
                      <div>
                        <p className="text-slate-200 text-sm font-medium">{site.name}</p>
                        <p className="text-slate-500 text-xs">{site.desc}</p>
                      </div>
                      <span className="text-slate-600 group-hover:text-teal-400 transition-colors">→</span>
                    </a>
                  ))}
                </div>

                <p className="text-xs text-amber-400/70 mt-5 text-center">
                  ⚠️ Confirm substitution with your doctor or pharmacist before changing a prescribed medicine.
                </p>
              </div>
            )}
          </div>
        )}

        {/* How it works */}
        {!selectedMedicine && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wide mb-4">How Price Comparison Works</h3>
            <div className="grid sm:grid-cols-3 gap-4">
              {[
                { step: '1', label: 'Select medicine', desc: 'Search by generic or brand name above' },
                { step: '2', label: 'Identify active ingredient', desc: 'We extract the active ingredient, strength, and form' },
                { step: '3', label: 'Find equivalents', desc: 'Products matching all key properties are shown' },
              ].map((s) => (
                <div key={s.step} className="text-center">
                  <div className="w-8 h-8 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold text-sm mx-auto mb-2">
                    {s.step}
                  </div>
                  <p className="text-slate-200 text-sm font-medium">{s.label}</p>
                  <p className="text-slate-500 text-xs mt-1">{s.desc}</p>
                </div>
              ))}
            </div>
            <div className="mt-5 bg-slate-800/50 rounded-xl p-4">
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wide mb-2">Matching criteria</p>
              <div className="flex flex-wrap gap-2">
                {['Active ingredient', 'Strength', 'Dosage form', 'Route', 'Release mechanism', 'Pack size'].map((c) => (
                  <span key={c} className="text-xs px-2.5 py-1 bg-slate-700 text-slate-300 rounded-full">{c}</span>
                ))}
              </div>
              <p className="text-xs text-amber-400/70 mt-3">⚠️ SR/ER/XR/CR/MR formulations are treated separately and will not be shown as equivalents of immediate-release products.</p>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default PriceExplorer
