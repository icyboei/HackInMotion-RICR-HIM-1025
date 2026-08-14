import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import SeverityBadge from '../components/SeverityBadge'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorBanner from '../components/ErrorBanner'
import { Card } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { MedicalDoodleBackground } from '../components/ui/MedicalDoodles'
import {
  ShieldCheckIcon,
  BotIcon,
  FileTextIcon,
  ClockIcon,
  TrashIcon,
} from '../components/ui/Icons'
import api from '../utils/api'

function History() {
  const [interactions, setInteractions] = useState([])
  const [aiChats, setAiChats]           = useState([])
  const [scans, setScans]               = useState([])
  const [loading, setLoading]           = useState(true)
  const [error, setError]               = useState('')
  const [activeTab, setActiveTab]       = useState('interactions')

  useEffect(() => { loadHistory() }, [])

  async function loadHistory() {
    setLoading(true)
    try {
      const data = await api.get('/history')
      setInteractions(data.interactions || [])
      setAiChats(data.aiChats || [])
      setScans(data.scans || [])
    } catch (err) {
      setError(err.message || 'Failed to load history.')
    } finally {
      setLoading(false)
    }
  }

  async function deleteItem(type, id) {
    try {
      await api.delete(`/history/${type}/${id}`)
      if (type === 'interaction') setInteractions((p) => p.filter((x) => x._id !== id))
      if (type === 'ai') setAiChats((p) => p.filter((x) => x._id !== id))
      if (type === 'scan') setScans((p) => p.filter((x) => x._id !== id))
    } catch (err) {
      setError(err.message || 'Failed to delete record.')
    }
  }

  if (loading) return (
    <div className="min-h-screen bg-[#F5F9F7] text-[#12302E] flex flex-col font-sans">
      <Navbar />
      <LoadingSpinner message="Loading your medication history..." />
    </div>
  )

  const TABS = [
    { id: 'interactions', label: `Checks (${interactions.length})`, icon: ShieldCheckIcon },
    { id: 'ai',           label: `AI Chats (${aiChats.length})`, icon: BotIcon },
    { id: 'scans',        label: `OCR Scans (${scans.length})`, icon: FileTextIcon },
  ]

  return (
    <div className="min-h-screen bg-[#F5F9F7] text-[#12302E] flex flex-col relative overflow-hidden font-sans">
      {/* Background Medical Doodles */}
      <MedicalDoodleBackground density="normal" />

      <Navbar />

      <main className="relative z-10 flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 py-8">
        {/* Page Header */}
        <div className="mb-8 border-b border-[#DCE8E5] pb-6">
          <Badge variant="brand" size="md" icon={ClockIcon} className="bg-white border-[#DCE8E5] mb-2.5">
            MEDICATION HISTORY
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#12302E] tracking-tight">Medication History</h1>
          <p className="text-[#64748B] text-sm sm:text-base mt-1">
            Your past interaction checks, OCR scans, and AI conversations.
          </p>
        </div>

        <ErrorBanner message={error} onDismiss={() => setError('')} />

        {/* Tab Navigation Bar */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2 border-b border-[#DCE8E5]">
          {TABS.map((t) => {
            const Icon = t.icon
            const isActive = activeTab === t.id
            return (
              <button
                key={t.id}
                id={`history-tab-${t.id}`}
                onClick={() => setActiveTab(t.id)}
                className={`px-5 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer flex-shrink-0 flex items-center gap-2 ${
                  isActive
                    ? 'bg-[#0F766E] text-white shadow-sm'
                    : 'bg-white text-[#64748B] hover:text-[#12302E] border border-[#DCE8E5] hover:bg-[#EEF6F4]'
                }`}
              >
                <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-white' : 'text-[#0F766E]'}`} />
                <span>{t.label}</span>
              </button>
            )
          })}
        </div>

        {/* Interaction Checks Tab */}
        {activeTab === 'interactions' && (
          <div className="space-y-3.5">
            {interactions.length === 0 ? (
              <Card className="bg-white border-[#DCE8E5] p-12 text-center shadow-sm rounded-2xl">
                <div className="w-14 h-14 rounded-2xl bg-[#EEF6F4] text-[#0F766E] flex items-center justify-center mx-auto mb-3.5 border border-[#DCE8E5]">
                  <ShieldCheckIcon className="w-7 h-7" />
                </div>
                <p className="text-[#12302E] font-bold text-base">No interaction checks yet</p>
                <p className="text-[#64748B] text-xs sm:text-sm mt-1 max-w-sm mx-auto">
                  Run a safety check on your medicines to save interaction records here.
                </p>
              </Card>
            ) : (
              interactions.map((item) => (
                <Card key={item._id} className="bg-white border-[#DCE8E5] p-5 shadow-sm hover:shadow transition-all rounded-2xl group">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2.5 flex-wrap">
                        <SeverityBadge severity={item.overallSeverity} />
                        <span className="text-xs font-medium text-[#94A3B8]">
                          {new Date(item.checkedAt).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1.5 mb-2">
                        {item.medicines?.map((m, i) => (
                          <span key={i} className="text-xs font-semibold px-3 py-1 bg-[#EEF6F4] text-[#0F766E] border border-[#DCE8E5] rounded-full capitalize">
                            {m.genericName || m.brandName}
                          </span>
                        ))}
                      </div>
                      <p className="text-xs font-medium text-[#64748B] mt-2">
                        {item.interactions?.length === 1 ? '1 interaction found' : `${item.interactions?.length || 0} interactions found`}
                      </p>
                    </div>
                    <button
                      onClick={() => deleteItem('interaction', item._id)}
                      className="text-[#94A3B8] hover:text-red-600 hover:bg-red-50 p-1.5 rounded-lg transition-all opacity-0 group-hover:opacity-100 flex-shrink-0 cursor-pointer"
                      aria-label="Delete record"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </Card>
              ))
            )}
          </div>
        )}

        {/* AI Chats Tab */}
        {activeTab === 'ai' && (
          <div className="space-y-3.5">
            {aiChats.length === 0 ? (
              <Card className="bg-white border-[#DCE8E5] p-12 text-center shadow-sm rounded-2xl">
                <div className="w-14 h-14 rounded-2xl bg-[#EEF6F4] text-[#0F766E] flex items-center justify-center mx-auto mb-3.5 border border-[#DCE8E5]">
                  <BotIcon className="w-7 h-7" />
                </div>
                <p className="text-[#12302E] font-bold text-base">No AI conversations yet</p>
                <p className="text-[#64748B] text-xs sm:text-sm mt-1 max-w-sm mx-auto">
                  Ask questions on the AI Assistant page to save your conversation history here.
                </p>
              </Card>
            ) : (
              aiChats.map((item) => (
                <Card key={item._id} className="bg-white border-[#DCE8E5] p-5 shadow-sm hover:shadow transition-all rounded-2xl group">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <p className="text-[#12302E] text-sm font-bold mb-1">Q: {item.question}</p>
                      <p className="text-[#64748B] text-xs leading-relaxed line-clamp-2">{item.answer?.slice(0, 140)}...</p>
                      <p className="text-xs font-medium text-[#94A3B8] mt-2.5">{new Date(item.askedAt).toLocaleString()}</p>
                    </div>
                    <button
                      onClick={() => deleteItem('ai', item._id)}
                      className="text-[#94A3B8] hover:text-red-600 hover:bg-red-50 p-1.5 rounded-lg transition-all opacity-0 group-hover:opacity-100 flex-shrink-0 cursor-pointer"
                      aria-label="Delete AI chat"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </Card>
              ))
            )}
          </div>
        )}

        {/* OCR Scans Tab */}
        {activeTab === 'scans' && (
          <div className="space-y-3.5">
            {scans.length === 0 ? (
              <Card className="bg-white border-[#DCE8E5] p-12 text-center shadow-sm rounded-2xl">
                <div className="w-14 h-14 rounded-2xl bg-[#EEF6F4] text-[#0F766E] flex items-center justify-center mx-auto mb-3.5 border border-[#DCE8E5]">
                  <FileTextIcon className="w-7 h-7" />
                </div>
                <p className="text-[#12302E] font-bold text-base">No OCR scans yet</p>
                <p className="text-[#64748B] text-xs sm:text-sm mt-1 max-w-sm mx-auto">
                  Scan prescription images on the Checker page to store scan records here.
                </p>
              </Card>
            ) : (
              scans.map((item) => (
                <Card key={item._id} className="bg-white border-[#DCE8E5] p-5 shadow-sm hover:shadow transition-all rounded-2xl group">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-[#94A3B8] mb-2">{new Date(item.scannedAt).toLocaleString()}</p>
                      <div className="flex flex-wrap gap-1.5">
                        {item.extractedMedicines?.map((m, i) => (
                          <span key={i} className="text-xs font-semibold px-3 py-1 bg-[#EEF6F4] text-[#0F766E] border border-[#DCE8E5] rounded-full capitalize">
                            {m.genericName} {m.strength && `(${m.strength})`}
                          </span>
                        ))}
                      </div>
                    </div>
                    <button
                      onClick={() => deleteItem('scan', item._id)}
                      className="text-[#94A3B8] hover:text-red-600 hover:bg-red-50 p-1.5 rounded-lg transition-all opacity-0 group-hover:opacity-100 flex-shrink-0 cursor-pointer"
                      aria-label="Delete scan record"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </Card>
              ))
            )}
          </div>
        )}
      </main>
    </div>
  )
}

export default History
