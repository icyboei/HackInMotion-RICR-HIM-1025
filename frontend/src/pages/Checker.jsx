import { useState } from 'react'
import Navbar from '../components/Navbar'
import MedicineSearch from '../components/MedicineSearch'
import MedicineCard from '../components/MedicineCard'
import InteractionResult from '../components/InteractionResult'
import SafetyStatusCard from '../components/SafetyStatusCard'
import OCRUploader from '../components/OCRUploader'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorBanner from '../components/ErrorBanner'
import api from '../utils/api'

function Checker() {
  const [medicines, setMedicines]       = useState([])
  const [result, setResult]             = useState(null)
  const [loading, setLoading]           = useState(false)
  const [error, setError]               = useState('')
  const [showOCR, setShowOCR]           = useState(false)
  const [ocrExtractions, setOcrExtractions] = useState([])
  const [ocrMessage, setOcrMessage]     = useState('')
  const [activeTab, setActiveTab]       = useState('manual') // 'manual' | 'ocr'

  // ── Medicine list management ─────────────────────────────────────────────

  function addMedicine(med) {
    if (medicines.find((m) => m.rxcui === med.rxcui)) return
    if (medicines.length >= 10) {
      setError('Maximum 10 medicines can be checked at once.')
      return
    }
    setMedicines((prev) => [...prev, med])
    setResult(null)
    setError('')
  }

  function removeMedicine(rxcui) {
    setMedicines((prev) => prev.filter((m) => m.rxcui !== rxcui))
    setResult(null)
  }

  // ── Interaction check ────────────────────────────────────────────────────

  async function checkInteractions() {
    if (medicines.length < 2) {
      setError('Please add at least 2 medicines to check interactions.')
      return
    }
    setLoading(true)
    setError('')
    setResult(null)
    try {
      const data = await api.post('/interactions/check', { medicines })
      setResult(data)
    } catch (err) {
      setError(err.message || 'Drug interaction service is temporarily unavailable.')
    } finally {
      setLoading(false)
    }
  }

  // ── OCR ──────────────────────────────────────────────────────────────────

  async function handleOCRExtracted(rawText) {
    setError('')
    try {
      const data = await api.post('/ocr/extract', { rawText })
      setOcrExtractions(data.extractedMedicines || [])
      setOcrMessage(data.message || '')
    } catch (err) {
      setError(err.message || 'OCR extraction failed.')
    }
  }

  function confirmOCRMedicine(med) {
    addMedicine({
      rxcui: med.rxcui,
      genericName: med.genericName,
      brandName: med.brandName || '',
      strength: med.strength || '',
      source: 'ocr',
    })
  }

  // ── Render ───────────────────────────────────────────────────────────────

  const SEVERITY_ORDER = ['critical', 'severe', 'moderate', 'mild', 'none', 'unknown']

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-8">
        {/* Page title */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white mb-1">Medicine Safety Checker</h1>
          <p className="text-slate-400 text-sm">Add your medicines to check for interactions, allergy conflicts, and safety concerns.</p>
        </div>

        {/* Input section */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-6">
          {/* Tab switcher */}
          <div className="flex gap-2 mb-5">
            <button
              id="tab-manual"
              onClick={() => setActiveTab('manual')}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${activeTab === 'manual' ? 'bg-teal-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
            >
              🔍 Search Medicine
            </button>
            <button
              id="tab-ocr"
              onClick={() => setActiveTab('ocr')}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${activeTab === 'ocr' ? 'bg-teal-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
            >
              📄 Scan Prescription
            </button>
          </div>

          {activeTab === 'manual' && (
            <MedicineSearch
              onSelect={addMedicine}
              placeholder="Search by generic or brand name (e.g. paracetamol, aspirin)..."
              disabled={medicines.length >= 10}
            />
          )}

          {activeTab === 'ocr' && (
            <div>
              <OCRUploader onExtracted={handleOCRExtracted} />
              {ocrMessage && (
                <p className="text-sm text-slate-400 mt-3">{ocrMessage}</p>
              )}
              {ocrExtractions.length > 0 && (
                <div className="mt-4 space-y-2">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Identified medicines — please review and confirm:</p>
                  {ocrExtractions.map((med, i) => (
                    <div key={i} className="flex items-center justify-between bg-slate-800 border border-slate-700 rounded-xl px-4 py-3">
                      <div>
                        <span className="text-slate-100 text-sm font-medium capitalize">{med.genericName}</span>
                        {med.strength && <span className="text-slate-400 text-xs ml-2">{med.strength}</span>}
                        <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${
                          med.confidence >= 80 ? 'bg-green-900/40 text-green-400' :
                          med.confidence >= 50 ? 'bg-yellow-900/40 text-yellow-400' :
                          'bg-red-900/40 text-red-400'
                        }`}>
                          {med.confidencePercent} confidence
                        </span>
                      </div>
                      <button
                        onClick={() => confirmOCRMedicine(med)}
                        className="px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-medium rounded-lg transition-colors"
                      >
                        + Confirm
                      </button>
                    </div>
                  ))}
                  <p className="text-xs text-amber-400/70">⚠️ Always verify OCR results against your original prescription before adding.</p>
                </div>
              )}
            </div>
          )}
        </div>

        <ErrorBanner message={error} onDismiss={() => setError('')} />

        {/* Current medicine list */}
        {medicines.length > 0 && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wide">
                Medicines to Check ({medicines.length})
              </h2>
              <button
                onClick={() => { setMedicines([]); setResult(null) }}
                className="text-xs text-slate-500 hover:text-red-400 transition-colors"
              >
                Clear all
              </button>
            </div>
            <div className="space-y-2 mb-5">
              {medicines.map((med) => (
                <MedicineCard
                  key={med.rxcui}
                  medicine={med}
                  onRemove={() => removeMedicine(med.rxcui)}
                />
              ))}
            </div>
            <button
              id="check-interactions-btn"
              onClick={checkInteractions}
              disabled={loading || medicines.length < 2}
              className="w-full py-3.5 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Checking interactions...
                </>
              ) : (
                <>⚡ Check Interactions</>
              )}
            </button>
            {medicines.length < 2 && (
              <p className="text-xs text-slate-500 text-center mt-2">Add at least 2 medicines to check</p>
            )}
          </div>
        )}

        {/* Results */}
        {loading && <LoadingSpinner message="Checking drug interactions..." />}

        {result && !loading && (
          <div className="space-y-4">
            {/* Allergy warnings */}
            {result.allergyWarnings?.length > 0 && (
              <div className="bg-red-950/40 border border-red-700 rounded-2xl p-5">
                <h3 className="text-red-300 font-semibold flex items-center gap-2 mb-3">
                  <span className="text-lg animate-pulse">🚨</span>
                  Allergy Alert
                </h3>
                {result.allergyWarnings.map((w, i) => (
                  <div key={i} className="mb-2">
                    <p className="text-red-200 text-sm font-medium">{w.medicine}</p>
                    <p className="text-red-300/80 text-xs">{w.message}</p>
                  </div>
                ))}
                <p className="text-xs text-amber-300/70 mt-2">⚠️ Contact your doctor or pharmacist immediately if you have concerns.</p>
              </div>
            )}

            {/* Duplicate therapy warnings */}
            {result.duplicates?.length > 0 && (
              <div className="bg-orange-950/30 border border-orange-700 rounded-2xl p-5">
                <h3 className="text-orange-300 font-semibold flex items-center gap-2 mb-3">
                  <span>⚠️</span> Possible Duplicate Therapy
                </h3>
                {result.duplicates.map((d, i) => (
                  <div key={i} className="text-sm text-orange-200/80 mb-2">
                    <span className="font-medium capitalize">{d.medicineA}</span> + <span className="font-medium capitalize">{d.medicineB}</span>
                    <p className="text-xs text-orange-300/60 mt-0.5">{d.message}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Overall status */}
            <SafetyStatusCard
              overallSeverity={result.overallSeverity}
              overallSummary={result.overallSummary}
              noKnownInteraction={result.noKnownInteraction}
              crossCheck={result.crossCheck}
              totalMedicines={medicines.length}
              totalInteractions={result.interactions?.length || 0}
            />

            {/* Interaction pairs */}
            {result.interactions?.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wide mb-3">
                  Interaction Details ({result.interactions.length})
                </h3>
                <div className="space-y-3">
                  {result.interactions
                    .sort((a, b) => SEVERITY_ORDER.indexOf(a.severity) - SEVERITY_ORDER.indexOf(b.severity))
                    .map((ix, i) => (
                      <InteractionResult key={i} interaction={ix} />
                    ))}
                </div>
              </div>
            )}

            {/* Overlapping effects */}
            {result.overlappingEffects?.length > 0 && (
              <div className="bg-slate-900 border border-slate-700 rounded-2xl p-5">
                <h3 className="text-slate-300 font-semibold mb-3">⚡ Overlapping Effects Detected</h3>
                <div className="space-y-2">
                  {result.overlappingEffects.map((oe, i) => (
                    <div key={i} className="text-sm">
                      <span className="text-slate-200 font-medium capitalize">{oe.category} effects</span>
                      <p className="text-slate-400 text-xs mt-0.5">{oe.message}</p>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-amber-400/70 mt-3">{result.overlappingEffects[0]?.disclaimer}</p>
              </div>
            )}

            <p className="text-xs text-slate-600 text-center">
              {result.disclaimer}
            </p>
          </div>
        )}
      </main>
    </div>
  )
}

export default Checker
