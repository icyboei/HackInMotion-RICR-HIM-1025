import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import SeverityBadge from '../components/SeverityBadge'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorBanner from '../components/ErrorBanner'
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
    <div className="min-h-screen bg-slate-950 flex flex-col">
      <Navbar />
      <LoadingSpinner message="Loading your history..." />
    </div>
  )

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-8">
        <h1 className="text-2xl font-bold text-white mb-1">Medication History</h1>
        <p className="text-slate-400 text-sm mb-6">Your past interaction checks, OCR scans, and AI conversations.</p>

        <ErrorBanner message={error} onDismiss={() => setError('')} />

        <div className="flex gap-2 mb-6 overflow-x-auto">
          {[
            { id: 'interactions', label: `⚡ Checks (${interactions.length})` },
            { id: 'ai',           label: `🤖 AI Chats (${aiChats.length})` },
            { id: 'scans',        label: `📄 OCR Scans (${scans.length})` },
          ].map((t) => (
            <button
              key={t.id}
              id={`history-tab-${t.id}`}
              onClick={() => setActiveTab(t.id)}
              className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors flex-shrink-0 ${activeTab === t.id ? 'bg-teal-600 text-white' : 'text-slate-400 bg-slate-800/60 hover:text-slate-200'}`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Interaction checks */}
        {activeTab === 'interactions' && (
          <div className="space-y-3">
            {interactions.length === 0 && (
              <p className="text-slate-500 text-center py-12">No interaction checks yet.</p>
            )}
            {interactions.map((item) => (
              <div key={item._id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 group">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <SeverityBadge severity={item.overallSeverity} />
                      <span className="text-xs text-slate-500">
                        {new Date(item.checkedAt).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {item.medicines?.map((m, i) => (
                        <span key={i} className="text-xs px-2.5 py-1 bg-slate-700 text-slate-300 rounded-full capitalize">
                          {m.genericName || m.brandName}
                        </span>
                      ))}
                    </div>
                    {item.interactions?.length > 0 && (
                      <p className="text-xs text-slate-500 mt-2">
                        {item.interactions.length} interaction(s) found
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => deleteItem('interaction', item._id)}
                    className="text-slate-600 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100 text-sm flex-shrink-0"
                    aria-label="Delete record"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* AI chats */}
        {activeTab === 'ai' && (
          <div className="space-y-3">
            {aiChats.length === 0 && (
              <p className="text-slate-500 text-center py-12">No AI conversations yet.</p>
            )}
            {aiChats.map((item) => (
              <div key={item._id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 group">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <p className="text-slate-200 text-sm font-medium mb-1">Q: {item.question}</p>
                    <p className="text-slate-400 text-xs line-clamp-2">{item.answer?.slice(0, 120)}...</p>
                    <p className="text-xs text-slate-600 mt-2">{new Date(item.askedAt).toLocaleString()}</p>
                  </div>
                  <button
                    onClick={() => deleteItem('ai', item._id)}
                    className="text-slate-600 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100 text-sm flex-shrink-0"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* OCR scans */}
        {activeTab === 'scans' && (
          <div className="space-y-3">
            {scans.length === 0 && (
              <p className="text-slate-500 text-center py-12">No prescription scans yet.</p>
            )}
            {scans.map((item) => (
              <div key={item._id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 group">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <p className="text-xs text-slate-500 mb-2">{new Date(item.scannedAt).toLocaleString()}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {item.extractedMedicines?.map((m, i) => (
                        <span key={i} className="text-xs px-2.5 py-1 bg-slate-700 text-slate-300 rounded-full capitalize">
                          {m.genericName} {m.strength && `(${m.strength})`}
                        </span>
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={() => deleteItem('scan', item._id)}
                    className="text-slate-600 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100 text-sm flex-shrink-0"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

export default History
