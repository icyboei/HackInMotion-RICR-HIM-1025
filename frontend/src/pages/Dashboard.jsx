import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import MedicineCard from '../components/MedicineCard'
import MedicineSearch from '../components/MedicineSearch'
import ReminderCard from '../components/ReminderCard'
import AllergyForm from '../components/AllergyForm'
import SeverityBadge from '../components/SeverityBadge'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorBanner from '../components/ErrorBanner'
import { useAuth } from '../context/AuthContext'
import api from '../utils/api'

function Dashboard() {
  const { user } = useAuth()

  const [medications, setMedications]     = useState([])
  const [reminders, setReminders]         = useState([])
  const [allergies, setAllergies]         = useState([])
  const [recentCheck, setRecentCheck]     = useState(null)
  const [loading, setLoading]             = useState(true)
  const [error, setError]                 = useState('')
  const [activeSection, setActiveSection] = useState('overview')
  const [addingMed, setAddingMed]         = useState(false)
  const [addingAllergy, setAddingAllergy] = useState(false)

  useEffect(() => {
    loadDashboard()
  }, [])

  async function loadDashboard() {
    setLoading(true)
    try {
      const [medsData, remindersData, allergiesData, historyData] = await Promise.allSettled([
        api.get('/medications'),
        api.get('/reminders'),
        api.get('/allergies'),
        api.get('/history', { limit: 1 }),
      ])

      if (medsData.status === 'fulfilled')      setMedications(medsData.value.medications || [])
      if (remindersData.status === 'fulfilled') setReminders(remindersData.value.reminders || [])
      if (allergiesData.status === 'fulfilled') setAllergies(allergiesData.value.allergies || [])
      if (historyData.status === 'fulfilled' && historyData.value.interactions?.[0]) {
        setRecentCheck(historyData.value.interactions[0])
      }
    } catch {
      setError('Failed to load dashboard data.')
    } finally {
      setLoading(false)
    }
  }

  async function handleAddMedication(med) {
    setAddingMed(true)
    setError('')
    try {
      const data = await api.post('/medications', {
        rxcui: med.rxcui,
        genericName: med.genericName,
        brandName: med.brandName || '',
        source: 'dashboard',
      })
      setMedications((prev) => [data.medication, ...prev])
    } catch (err) {
      setError(err.message || 'Failed to add medication.')
    } finally {
      setAddingMed(false)
    }
  }

  async function handleRemoveMedication(id) {
    try {
      await api.delete(`/medications/${id}`)
      setMedications((prev) => prev.filter((m) => m._id?.toString() !== id))
    } catch (err) {
      setError(err.message || 'Failed to remove medication.')
    }
  }

  async function handleAddAllergy(allergyData) {
    setAddingAllergy(true)
    try {
      const data = await api.post('/allergies', allergyData)
      setAllergies((prev) => [data.allergy, ...prev])
    } catch (err) {
      setError(err.message || 'Failed to add allergy.')
    } finally {
      setAddingAllergy(false)
    }
  }

  async function handleRemoveAllergy(id) {
    try {
      await api.delete(`/allergies/${id}`)
      setAllergies((prev) => prev.filter((a) => a._id?.toString() !== id))
    } catch (err) {
      setError(err.message || 'Failed to remove allergy.')
    }
  }

  async function handleDeleteReminder(id) {
    try {
      await api.delete(`/reminders/${id}`)
      setReminders((prev) => prev.filter((r) => r._id?.toString() !== id))
    } catch (err) {
      setError(err.message || 'Failed to delete reminder.')
    }
  }

  const SECTIONS = ['overview', 'medications', 'allergies', 'reminders']
  const SECTION_LABELS = { overview: '📊 Overview', medications: '💊 Medications', allergies: '🔴 Allergies', reminders: '⏰ Reminders' }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col">
        <Navbar />
        <LoadingSpinner message="Loading your dashboard..." />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8">

        {/* Welcome banner */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">
            Welcome back, {user?.name?.split(' ')[0] || 'there'} 👋
          </h1>
          <p className="text-slate-400 text-sm mt-1">Your Medication Safety Overview</p>
        </div>

        {/* Summary stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Active Medicines', value: medications.length, icon: '💊', color: 'text-teal-400' },
            { label: 'Allergies Logged', value: allergies.length, icon: '🔴', color: 'text-red-400' },
            { label: 'Reminders', value: reminders.length, icon: '⏰', color: 'text-indigo-400' },
            {
              label: 'Last Check',
              value: recentCheck ? new SeverityBadge({ severity: recentCheck.overallSeverity }) : '—',
              rawContent: recentCheck
                ? <SeverityBadge severity={recentCheck.overallSeverity} />
                : <span className="text-slate-500 text-sm">No checks yet</span>,
              icon: '⚡',
              color: 'text-yellow-400',
            },
          ].map((stat) => (
            <div key={stat.label} className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <span>{stat.icon}</span>
                <span className="text-xs text-slate-500">{stat.label}</span>
              </div>
              {stat.rawContent || (
                <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
              )}
            </div>
          ))}
        </div>

        <ErrorBanner message={error} onDismiss={() => setError('')} />

        {/* Section tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1 mb-6">
          {SECTIONS.map((s) => (
            <button
              key={s}
              id={`dash-tab-${s}`}
              onClick={() => setActiveSection(s)}
              className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors flex-shrink-0 ${activeSection === s ? 'bg-teal-600 text-white' : 'text-slate-400 hover:text-slate-200 bg-slate-800/60'}`}
            >
              {SECTION_LABELS[s]}
            </button>
          ))}
        </div>

        {/* ── Overview ─────────────────────────────────────────────────────── */}
        {activeSection === 'overview' && (
          <div className="grid md:grid-cols-2 gap-6">
            {/* Recent interaction check */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
              <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wide mb-4">Last Safety Check</h3>
              {recentCheck ? (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <SeverityBadge severity={recentCheck.overallSeverity} />
                    <span className="text-slate-400 text-xs">{new Date(recentCheck.checkedAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {recentCheck.medicines?.slice(0, 4).map((m, i) => (
                      <span key={i} className="text-xs px-2.5 py-1 bg-slate-700 text-slate-300 rounded-full capitalize">{m.genericName}</span>
                    ))}
                  </div>
                  <Link to="/checker" className="inline-block mt-4 text-xs text-teal-400 hover:text-teal-300">
                    Run new check →
                  </Link>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-slate-500 text-sm">No interaction checks yet.</p>
                  <Link to="/checker" className="inline-block mt-3 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-xl transition-colors">
                    Check Medicines Now
                  </Link>
                </div>
              )}
            </div>

            {/* Quick actions */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
              <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wide mb-4">Quick Actions</h3>
              <div className="space-y-2">
                {[
                  { to: '/checker',  icon: '⚡', label: 'Check Medicine Interactions' },
                  { to: '/ai',       icon: '🤖', label: 'Ask the AI Assistant' },
                  { to: '/prices',   icon: '💰', label: 'Explore Medicine Prices' },
                  { to: '/history',  icon: '📋', label: 'View Full History' },
                ].map((action) => (
                  <Link
                    key={action.to}
                    to={action.to}
                    className="flex items-center gap-3 px-4 py-3 bg-slate-800 hover:bg-slate-700 rounded-xl text-sm text-slate-300 hover:text-white transition-colors group"
                  >
                    <span className="text-base">{action.icon}</span>
                    <span>{action.label}</span>
                    <span className="ml-auto text-slate-600 group-hover:text-slate-400">→</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Upcoming reminders */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
              <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wide mb-4">Today's Reminders</h3>
              {reminders.length > 0 ? (
                <div className="space-y-2">
                  {reminders.slice(0, 3).map((r) => (
                    <div key={r._id} className="flex items-center gap-3">
                      <span className="text-indigo-400 text-sm">⏰</span>
                      <div>
                        <p className="text-sm text-slate-200 capitalize">{r.medicineName}</p>
                        <p className="text-xs text-slate-500">{r.times?.join(', ')}</p>
                      </div>
                    </div>
                  ))}
                  {reminders.length > 3 && (
                    <button onClick={() => setActiveSection('reminders')} className="text-xs text-teal-400">
                      +{reminders.length - 3} more →
                    </button>
                  )}
                </div>
              ) : (
                <p className="text-slate-500 text-sm text-center py-2">No reminders set.</p>
              )}
            </div>

            {/* Budget card */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-800/60 border border-slate-700 rounded-2xl p-5">
              <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wide mb-2">Budget-Friendly Options</h3>
              <p className="text-slate-400 text-sm mb-4">Looking for a lower-cost equivalent?</p>
              <div className="space-y-2 text-xs text-slate-500 mb-4">
                <div className="flex items-center gap-2"><span className="text-teal-400">①</span> Search medicine</div>
                <div className="flex items-center gap-2"><span className="text-teal-400">②</span> Compare products</div>
                <div className="flex items-center gap-2"><span className="text-teal-400">③</span> View price range</div>
              </div>
              <Link to="/prices" className="inline-block px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-xl transition-colors">
                Explore Prices →
              </Link>
            </div>
          </div>
        )}

        {/* ── Medications ──────────────────────────────────────────────────── */}
        {activeSection === 'medications' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-sm font-semibold text-white">My Medications ({medications.length})</h2>
            </div>
            <div className="mb-5">
              <MedicineSearch onSelect={handleAddMedication} disabled={addingMed} />
            </div>
            {medications.length > 0 ? (
              <div className="space-y-2">
                {medications.map((m) => (
                  <MedicineCard key={m._id} medicine={m} onRemove={handleRemoveMedication} />
                ))}
              </div>
            ) : (
              <p className="text-slate-500 text-sm text-center py-6">
                No medications added yet. Search above to add your first medicine.
              </p>
            )}
            {medications.length >= 2 && (
              <Link
                to="/checker"
                className="inline-block mt-5 px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold rounded-xl transition-colors"
              >
                ⚡ Check These Medicines for Interactions →
              </Link>
            )}
          </div>
        )}

        {/* ── Allergies ────────────────────────────────────────────────────── */}
        {activeSection === 'allergies' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-sm font-semibold text-white mb-5">My Allergy Profile ({allergies.length})</h2>
            <AllergyForm onAdd={handleAddAllergy} loading={addingAllergy} />
            {allergies.length > 0 ? (
              <div className="space-y-2 mt-5">
                {allergies.map((a) => (
                  <div key={a._id} className="flex items-start gap-3 bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 group">
                    <span className="text-lg">🔴</span>
                    <div className="flex-1">
                      <p className="text-slate-100 text-sm font-semibold capitalize">{a.allergen}</p>
                      <p className="text-slate-400 text-xs">{a.reaction || 'Reaction not specified'}</p>
                      <div className="flex gap-2 mt-1">
                        {a.drugClass && <span className="text-xs text-slate-500">{a.drugClass}</span>}
                        {a.severity !== 'unknown' && (
                          <SeverityBadge severity={a.severity} />
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemoveAllergy(a._id)}
                      className="text-slate-600 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100 text-sm"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-500 text-sm text-center py-6 mt-5">
                No allergies logged. Add them above to enable allergy checking.
              </p>
            )}
          </div>
        )}

        {/* ── Reminders ────────────────────────────────────────────────────── */}
        {activeSection === 'reminders' && (
          <div>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-4">
              <h2 className="text-sm font-semibold text-white mb-4">Add Reminder</h2>
              <Link
                to="/reminders"
                className="inline-block px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold rounded-xl transition-colors"
              >
                Manage All Reminders →
              </Link>
            </div>
            {reminders.length > 0 ? (
              <div className="space-y-3">
                {reminders.map((r) => (
                  <ReminderCard key={r._id} reminder={r} onDelete={handleDeleteReminder} />
                ))}
              </div>
            ) : (
              <p className="text-slate-500 text-sm text-center py-6">No reminders set.</p>
            )}
          </div>
        )}
      </main>
    </div>
  )
}

export default Dashboard
