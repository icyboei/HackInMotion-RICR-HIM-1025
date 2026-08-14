import { useState } from 'react'
import Navbar from '../components/Navbar'
import MedicineSearch from '../components/MedicineSearch'
import MedicineCard from '../components/MedicineCard'
import InteractionResult from '../components/InteractionResult'
import SafetyStatusCard from '../components/SafetyStatusCard'
import OCRUploader from '../components/OCRUploader'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorBanner from '../components/ErrorBanner'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { MedicalDoodleBackground } from '../components/ui/MedicalDoodles'
import {
  ShieldCheckIcon,
  SearchIcon,
  FileTextIcon,
  AlertTriangleIcon,
  PillIcon,
  CheckIcon,
  ArrowRightIcon,
  PlusIcon,
} from '../components/ui/Icons'
import api from '../utils/api'

function Checker() {
  const [medicines, setMedicines]       = useState([])
  const [result, setResult]             = useState(null)
  const [loading, setLoading]           = useState(false)
  const [error, setError]               = useState('')
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
    <div className="min-h-screen bg-[#F5F9F7] text-[#12302E] flex flex-col relative overflow-hidden font-sans">
      {/* Background Medical Doodles */}
      <MedicalDoodleBackground density="normal" />

      <Navbar />

      <main className="relative z-10 flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 py-8">
        {/* Page Title & Header */}
        <div className="mb-8 border-b border-[#DCE8E5] pb-6">
          <Badge variant="brand" size="md" icon={ShieldCheckIcon} className="bg-white border-[#DCE8E5] mb-2.5">
            MEDICATION SAFETY CHECK
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#12302E] tracking-tight">Medicine Safety Checker</h1>
          <p className="text-[#64748B] text-sm sm:text-base mt-1">
            Add your medicines to check for interactions, allergy conflicts, and safety concerns.
          </p>
        </div>

        {/* Search & Scan Input Card */}
        <Card className="bg-white border-[#DCE8E5] p-6 mb-6 shadow-sm rounded-2xl">
          {/* Tab Switcher */}
          <div className="flex gap-2.5 mb-5 border-b border-[#DCE8E5] pb-4">
            <button
              id="tab-manual"
              onClick={() => setActiveTab('manual')}
              className={`px-5 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'manual'
                  ? 'bg-[#0F766E] text-white shadow-sm'
                  : 'bg-white text-[#64748B] hover:text-[#12302E] border border-[#DCE8E5] hover:bg-[#EEF6F4]'
              }`}
            >
              <SearchIcon className={`w-4 h-4 ${activeTab === 'manual' ? 'text-white' : 'text-[#0F766E]'}`} />
              <span>Search Medicine</span>
            </button>
            <button
              id="tab-ocr"
              onClick={() => setActiveTab('ocr')}
              className={`px-5 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'ocr'
                  ? 'bg-[#0F766E] text-white shadow-sm'
                  : 'bg-white text-[#64748B] hover:text-[#12302E] border border-[#DCE8E5] hover:bg-[#EEF6F4]'
              }`}
            >
              <FileTextIcon className={`w-4 h-4 ${activeTab === 'ocr' ? 'text-white' : 'text-[#0F766E]'}`} />
              <span>Scan Prescription</span>
            </button>
          </div>

          {activeTab === 'manual' && (
            <div>
              <MedicineSearch
                onSelect={addMedicine}
                placeholder="Search by generic or brand name (e.g. paracetamol, aspirin)..."
                disabled={medicines.length >= 10}
              />
            </div>
          )}

          {activeTab === 'ocr' && (
            <div>
              <OCRUploader onExtracted={handleOCRExtracted} />
              {ocrMessage && (
                <p className="text-sm text-[#64748B] font-medium mt-3">{ocrMessage}</p>
              )}
              {ocrExtractions.length > 0 && (
                <div className="mt-4 space-y-2">
                  <p className="text-xs font-bold text-[#64748B] uppercase tracking-wide">Identified medicines — review & confirm:</p>
                  {ocrExtractions.map((med, i) => (
                    <div key={i} className="flex items-center justify-between bg-white border border-[#DCE8E5] rounded-xl px-4 py-3 shadow-sm">
                      <div>
                        <span className="text-[#12302E] text-sm font-bold capitalize">{med.genericName}</span>
                        {med.strength && <span className="text-[#64748B] text-xs ml-2 font-medium">{med.strength}</span>}
                        <span className={`ml-2 text-xs font-semibold px-2.5 py-0.5 rounded-full border ${
                          med.confidence >= 80 ? 'bg-emerald-50 text-[#16A34A] border-emerald-200' :
                          med.confidence >= 50 ? 'bg-amber-50 text-amber-700 border-amber-200' :
                          'bg-rose-50 text-rose-700 border-rose-200'
                        }`}>
                          {med.confidencePercent} confidence
                        </span>
                      </div>
                      <Button
                        size="sm"
                        variant="primary"
                        onClick={() => confirmOCRMedicine(med)}
                        icon={PlusIcon}
                      >
                        Confirm
                      </Button>
                    </div>
                  ))}
                  <p className="text-xs text-amber-800 font-medium mt-2 flex items-center gap-1">
                    <AlertTriangleIcon className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                    Always verify OCR results against your original prescription before checking.
                  </p>
                </div>
              )}
            </div>
          )}
        </Card>

        <ErrorBanner message={error} onDismiss={() => setError('')} />

        {/* Current Selected Medicines Section */}
        {medicines.length > 0 && (
          <Card className="bg-white border-[#DCE8E5] p-6 mb-6 shadow-sm rounded-2xl">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#DCE8E5]">
              <h2 className="text-xs font-bold text-[#64748B] uppercase tracking-wide flex items-center gap-2">
                <PillIcon className="w-4 h-4 text-[#0F766E]" />
                Selected Medicines to Check ({medicines.length})
              </h2>
              <button
                onClick={() => { setMedicines([]); setResult(null) }}
                className="text-xs text-[#94A3B8] hover:text-red-600 font-semibold transition-colors cursor-pointer"
              >
                Clear all
              </button>
            </div>

            <div className="space-y-2.5 mb-6">
              {medicines.map((med) => (
                <MedicineCard
                  key={med.rxcui}
                  medicine={med}
                  onRemove={() => removeMedicine(med.rxcui)}
                />
              ))}
            </div>

            <Button
              id="check-interactions-btn"
              onClick={checkInteractions}
              disabled={loading || medicines.length < 2}
              loading={loading}
              variant="primary"
              size="lg"
              className="w-full flex items-center justify-center gap-2 font-bold shadow-sm"
              icon={loading ? undefined : ArrowRightIcon}
              iconPosition="right"
            >
              Check Medication Safety
            </Button>

            {medicines.length < 2 && (
              <p className="text-xs text-[#94A3B8] text-center mt-2.5 font-medium">
                Add at least 2 medicines to check interactions.
              </p>
            )}
          </Card>
        )}

        {/* Empty State when no medicines selected */}
        {medicines.length === 0 && !result && !loading && (
          <Card className="bg-white border-[#DCE8E5] p-10 text-center shadow-sm rounded-2xl mb-6">
            <div className="w-14 h-14 rounded-2xl bg-[#EEF6F4] text-[#0F766E] flex items-center justify-center mx-auto mb-3.5 border border-[#DCE8E5]">
              <ShieldCheckIcon className="w-7 h-7" />
            </div>
            <h3 className="text-[#12302E] font-bold text-base">Check your medicines for interactions</h3>
            <p className="text-[#64748B] text-xs sm:text-sm mt-1 max-w-md mx-auto leading-relaxed">
              Add two or more medicines by generic or brand name, or scan a prescription image to analyze potential drug-drug interactions, allergy conflicts, and overlapping side effects.
            </p>
          </Card>
        )}

        {/* Loading Spinner State */}
        {loading && (
          <Card className="bg-white border-[#DCE8E5] p-12 text-center shadow-sm rounded-2xl mb-6">
            <LoadingSpinner message="Checking medication safety against FDA labels and RxNorm databases..." />
          </Card>
        )}

        {/* Results Display */}
        {result && !loading && (
          <div className="space-y-5">
            {/* Allergy warnings */}
            {result.allergyWarnings?.length > 0 && (
              <div className="bg-rose-50 border border-rose-200 rounded-2xl p-5 shadow-sm">
                <h3 className="text-rose-900 font-bold flex items-center gap-2 mb-3 text-sm">
                  <AlertTriangleIcon className="w-5 h-5 text-rose-600 flex-shrink-0 animate-pulse" />
                  Allergy Alert Detected
                </h3>
                {result.allergyWarnings.map((w, i) => (
                  <div key={i} className="mb-2">
                    <p className="text-rose-950 text-sm font-bold">{w.medicine}</p>
                    <p className="text-rose-800 text-xs mt-0.5">{w.message}</p>
                  </div>
                ))}
                <p className="text-xs text-rose-800/80 mt-2 font-medium">⚠️ Contact your doctor or pharmacist immediately if you have concerns.</p>
              </div>
            )}

            {/* Duplicate therapy warnings */}
            {result.duplicates?.length > 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 shadow-sm">
                <h3 className="text-amber-900 font-bold flex items-center gap-2 mb-3 text-sm">
                  <AlertTriangleIcon className="w-5 h-5 text-amber-600 flex-shrink-0" />
                  Possible Duplicate Therapy
                </h3>
                {result.duplicates.map((d, i) => (
                  <div key={i} className="text-sm text-amber-900 mb-2">
                    <span className="font-bold capitalize">{d.medicineA}</span> + <span className="font-bold capitalize">{d.medicineB}</span>
                    <p className="text-xs text-amber-800 mt-0.5">{d.message}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Overall Status Card */}
            <SafetyStatusCard
              overallSeverity={result.overallSeverity}
              overallSummary={result.overallSummary}
              noKnownInteraction={result.noKnownInteraction}
              unableToVerify={result.unableToVerify}
              crossCheck={result.crossCheck}
              totalMedicines={medicines.length}
              totalInteractions={result.interactions?.length || 0}
            />

            {/* Interaction Pair Details */}
            {result.interactions?.length > 0 && (
              <div>
                <h3 className="text-xs font-bold text-[#64748B] uppercase tracking-wide mb-3">
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

            {/* Overlapping Effects */}
            {result.overlappingEffects?.length > 0 && (
              <Card className="bg-white border-[#DCE8E5] rounded-2xl p-5 shadow-sm">
                <h3 className="text-[#12302E] font-bold text-sm mb-3 flex items-center gap-2">
                  <ShieldCheckIcon className="w-4 h-4 text-[#0F766E]" />
                  Overlapping Side Effects Detected
                </h3>
                <div className="space-y-2.5">
                  {result.overlappingEffects.map((oe, i) => (
                    <div key={i} className="text-sm">
                      <span className="text-[#12302E] font-bold capitalize">{oe.category} effects</span>
                      <p className="text-[#64748B] text-xs mt-0.5 font-medium">{oe.message}</p>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-amber-800/80 font-medium mt-3">{result.overlappingEffects[0]?.disclaimer}</p>
              </Card>
            )}

            {/* Disclaimer Box */}
            <div className="bg-amber-50/80 border border-amber-200 text-amber-900 rounded-xl p-4 text-xs leading-relaxed flex items-start gap-2.5 shadow-sm">
              <AlertTriangleIcon className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
              <span>{result.disclaimer || 'This tool is for informational purposes only. Always consult your healthcare provider before taking or altering any medications.'}</span>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default Checker
