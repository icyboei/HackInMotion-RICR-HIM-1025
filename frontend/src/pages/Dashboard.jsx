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
import SafetyStatusCard from '../components/SafetyStatusCard'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { MedicalDoodleBackground } from '../components/ui/MedicalDoodles'
import {
  ShieldCheckIcon,
  AlertTriangleIcon,
  PillIcon,
  BotIcon,
  BellIcon,
  ClockIcon,
  ArrowRightIcon,
  PlusIcon,
  TrashIcon,
  CheckIcon,
  SparklesIcon,
  ClipboardIcon,
  FileTextIcon,
  SearchIcon,
  HeartPulseIcon,
  LayoutDashboardIcon,
} from '../components/ui/Icons'
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
  const SECTION_CONFIG = {
    overview: { label: 'Overview', icon: LayoutDashboardIcon },
    medications: { label: 'Medications', icon: PillIcon },
    allergies: { label: 'Allergies', icon: AlertTriangleIcon },
    reminders: { label: 'Reminders', icon: BellIcon },
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F9F7] text-[#12302E] flex flex-col font-sans">
        <Navbar />
        <LoadingSpinner message="Loading your safety dashboard..." />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F5F9F7] text-[#12302E] flex flex-col relative overflow-hidden font-sans">
      {/* Background Medical Doodles */}
      <MedicalDoodleBackground density="normal" />

      <Navbar />

      <main className="relative z-10 flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 py-8">
        {/* 1. Page Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-[#DCE8E5] pb-6">
          <div>
            <Badge variant="brand" size="md" icon={ShieldCheckIcon} className="bg-white border-[#DCE8E5] mb-2.5">
              MEDICATION SAFETY OVERVIEW
            </Badge>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#12302E] tracking-tight">
              Welcome back, <span className="text-[#0F766E]">{user?.name?.split(' ')[0] || 'there'}</span> 👋
            </h1>
            <p className="text-[#64748B] text-sm sm:text-base mt-1">
              Your personalized medication list, safety alerts, and health tools.
            </p>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <Link to="/checker">
              <Button variant="primary" size="md" icon={ArrowRightIcon} iconPosition="right">
                Check Safety
              </Button>
            </Link>
          </div>
        </div>

        {/* 2. Overview Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            {
              label: 'Active Medicines',
              value: medications.length,
              subText: 'Registered in profile',
              icon: PillIcon,
              badgeClass: 'bg-[#EEF6F4] text-[#0F766E] border-[#DCE8E5]',
              valColor: 'text-[#12302E]',
            },
            {
              label: 'Allergies Logged',
              value: allergies.length,
              subText: 'Known allergen profile',
              icon: AlertTriangleIcon,
              badgeClass: 'bg-amber-50 text-amber-700 border-amber-200',
              valColor: 'text-[#12302E]',
            },
            {
              label: 'Active Reminders',
              value: reminders.length,
              subText: 'Scheduled alerts',
              icon: BellIcon,
              badgeClass: 'bg-[#EEF6F4] text-[#0F766E] border-[#DCE8E5]',
              valColor: 'text-[#12302E]',
            },
            {
              label: 'Last Check Status',
              rawContent: recentCheck ? (
                <div className="pt-1">
                  <SeverityBadge severity={recentCheck.overallSeverity} />
                </div>
              ) : (
                <span className="text-[#94A3B8] text-xs font-semibold">No checks yet</span>
              ),
              subText: recentCheck ? new Date(recentCheck.checkedAt).toLocaleDateString() : 'Run your first check',
              icon: ShieldCheckIcon,
              badgeClass: 'bg-[#EEF6F4] text-[#0F766E] border-[#DCE8E5]',
              valColor: 'text-[#12302E]',
            },
          ].map((stat) => (
            <Card key={stat.label} className="p-5 bg-white border-[#DCE8E5] shadow-sm hover:shadow transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-[#64748B] uppercase tracking-wide">{stat.label}</span>
                <div className={`p-2 rounded-xl border flex items-center justify-center ${stat.badgeClass}`}>
                  <stat.icon className="w-4 h-4" />
                </div>
              </div>
              {stat.rawContent || (
                <p className={`text-2xl font-extrabold tracking-tight ${stat.valColor}`}>{stat.value}</p>
              )}
              <p className="text-[11px] text-[#94A3B8] mt-1">{stat.subText}</p>
            </Card>
          ))}
        </div>

        <ErrorBanner message={error} onDismiss={() => setError('')} />

        {/* Navigation Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6 border-b border-[#DCE8E5]">
          {SECTIONS.map((s) => {
            const cfg = SECTION_CONFIG[s]
            const Icon = cfg.icon
            const isActive = activeSection === s

            return (
              <button
                key={s}
                id={`dash-tab-${s}`}
                onClick={() => setActiveSection(s)}
                className={`px-5 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer flex-shrink-0 flex items-center gap-2 ${
                  isActive
                    ? 'bg-[#0F766E] text-white shadow-sm'
                    : 'bg-white text-[#64748B] hover:text-[#12302E] border border-[#DCE8E5] hover:bg-[#EEF6F4]'
                }`}
              >
                <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-white' : 'text-[#0F766E]'}`} />
                <span>{cfg.label}</span>
              </button>
            )
          })}
        </div>

        {/* ── OVERVIEW TAB ─────────────────────────────────────────────────── */}
        {activeSection === 'overview' && (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Last Safety Check Card */}
              <Card className="bg-white border-[#DCE8E5] p-6 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between border-b border-[#DCE8E5] pb-3 mb-4">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[#64748B]">Last Interaction Check</h3>
                    <Badge variant="brand" size="sm" icon={ShieldCheckIcon}>
                      VERIFIED
                    </Badge>
                  </div>
                  {recentCheck ? (
                    <div>
                      <div className="flex items-center gap-3 mb-3">
                        <SeverityBadge severity={recentCheck.overallSeverity} />
                        <span className="text-[#64748B] text-xs">
                          {new Date(recentCheck.checkedAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-xs text-[#64748B] mb-2 font-medium">Checked Medicines:</p>
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {recentCheck.medicines?.slice(0, 4).map((m, i) => (
                          <span
                            key={i}
                            className="text-xs font-medium px-2.5 py-1 bg-[#EEF6F4] text-[#0F766E] border border-[#DCE8E5] rounded-full capitalize"
                          >
                            {m.genericName}
                          </span>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <div className="w-12 h-12 rounded-2xl bg-[#EEF6F4] text-[#0F766E] flex items-center justify-center mx-auto mb-3 border border-[#DCE8E5]">
                        <ShieldCheckIcon className="w-6 h-6" />
                      </div>
                      <p className="text-[#12302E] font-semibold text-sm">No interaction checks yet</p>
                      <p className="text-[#64748B] text-xs mt-1">Cross-check your active regimen to detect potential safety risks.</p>
                    </div>
                  )}
                </div>
                <div className="pt-4 border-t border-[#DCE8E5]">
                  <Link to="/checker" className="no-underline block">
                    <Button variant="outline" size="sm" icon={ArrowRightIcon} iconPosition="right" className="w-full">
                      {recentCheck ? 'Run New Interaction Check' : 'Check Medicines Now'}
                    </Button>
                  </Link>
                </div>
              </Card>

              {/* Quick Actions Card */}
              <Card className="bg-white border-[#DCE8E5] p-6 shadow-sm">
                <div className="flex items-center justify-between border-b border-[#DCE8E5] pb-3 mb-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#64748B]">Quick Actions</h3>
                  <SparklesIcon className="w-4 h-4 text-[#0F766E]" />
                </div>
                <div className="space-y-2.5">
                  {[
                    { to: '/checker', icon: ShieldCheckIcon, label: 'Check Medicine Interactions', desc: 'Cross-check multi-drug safety' },
                    { to: '/ai', icon: BotIcon, label: 'Ask AI Assistant', desc: 'Educational guidance & drug usage' },
                    { to: '/prices', icon: SearchIcon, label: 'Explore Medicine Prices', desc: 'Compare lower-cost generic equivalents' },
                    { to: '/history', icon: ClipboardIcon, label: 'View Interaction History', desc: 'Review previous safety reports' },
                  ].map((action) => (
                    <Link
                      key={action.to}
                      to={action.to}
                      className="flex items-center gap-3 p-3 rounded-xl bg-[#F5F9F7] hover:bg-[#EEF6F4] border border-[#DCE8E5] transition-all group no-underline"
                    >
                      <div className="w-8 h-8 rounded-lg bg-white text-[#0F766E] flex items-center justify-center border border-[#DCE8E5] flex-shrink-0">
                        <action.icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-[#12302E] group-hover:text-[#0F766E] transition-colors">{action.label}</p>
                        <p className="text-[11px] text-[#64748B] truncate">{action.desc}</p>
                      </div>
                      <ArrowRightIcon className="w-4 h-4 text-[#94A3B8] group-hover:text-[#0F766E] transition-colors flex-shrink-0" />
                    </Link>
                  ))}
                </div>
              </Card>
            </div>

            {/* Bottom Row: Today's Reminders & Price Guide Card */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Upcoming Reminders Card */}
              <Card className="bg-white border-[#DCE8E5] p-6 shadow-sm">
                <div className="flex items-center justify-between border-b border-[#DCE8E5] pb-3 mb-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#64748B]">Today's Reminders</h3>
                  <BellIcon className="w-4 h-4 text-[#0F766E]" />
                </div>
                {reminders.length > 0 ? (
                  <div className="space-y-3">
                    {reminders.slice(0, 3).map((r) => (
                      <div key={r._id} className="flex items-center justify-between p-3 rounded-xl bg-[#F5F9F7] border border-[#DCE8E5]">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-[#EEF6F4] text-[#0F766E] flex items-center justify-center border border-[#DCE8E5]">
                            <ClockIcon className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-[#12302E] capitalize">{r.medicineName}</p>
                            <p className="text-[11px] text-[#64748B]">{r.times?.join(', ')}</p>
                          </div>
                        </div>
                        <Badge variant="brand" size="sm">Active</Badge>
                      </div>
                    ))}
                    {reminders.length > 3 && (
                      <button
                        onClick={() => setActiveSection('reminders')}
                        className="text-xs font-semibold text-[#0F766E] hover:underline pt-1 block"
                      >
                        +{reminders.length - 3} more reminders →
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <p className="text-xs text-[#64748B]">No reminders set for today.</p>
                    <Link to="/reminders" className="no-underline inline-block mt-3">
                      <Button variant="secondary" size="sm">Set New Reminder</Button>
                    </Link>
                  </div>
                )}
              </Card>

              {/* Budget / Price Guide Card */}
              <Card className="bg-gradient-to-br from-[#EEF6F4] via-white to-[#F5F9F7] border-[#DCE8E5] p-6 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between border-b border-[#DCE8E5] pb-3 mb-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[#0F766E]">Budget-Friendly Generic Search</h3>
                    <SearchIcon className="w-4 h-4 text-[#0F766E]" />
                  </div>
                  <p className="text-xs text-[#64748B] mb-3">
                    Search medicines to discover lower-cost equivalent products and brand alternatives.
                  </p>
                  <div className="space-y-1.5 text-xs text-[#64748B] mb-4">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-[#0F766E] text-white flex items-center justify-center text-[10px] font-bold">1</span>
                      <span>Enter medicine name in Price Explorer</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-[#0F766E] text-white flex items-center justify-center text-[10px] font-bold">2</span>
                      <span>Compare prices across registered brands</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-[#0F766E] text-white flex items-center justify-center text-[10px] font-bold">3</span>
                      <span>Discuss lower-cost generics with your pharmacist</span>
                    </div>
                  </div>
                </div>
                <Link to="/prices" className="no-underline block pt-2">
                  <Button variant="primary" size="sm" icon={ArrowRightIcon} iconPosition="right" className="w-full">
                    Explore Medicine Prices
                  </Button>
                </Link>
              </Card>
            </div>

            {/* Safety Status Card Section */}
            {recentCheck && (
              <div className="pt-2">
                <SafetyStatusCard
                  overallSeverity={recentCheck.overallSeverity}
                  overallSummary={recentCheck.overallSummary}
                  noKnownInteraction={recentCheck.noKnownInteraction}
                  unableToVerify={recentCheck.unableToVerify}
                  crossCheck={recentCheck.crossCheck}
                  totalMedicines={recentCheck.medicines?.length || 0}
                  totalInteractions={recentCheck.interactions?.length || 0}
                />
              </div>
            )}
          </div>
        )}

        {/* ── MEDICATIONS TAB ──────────────────────────────────────────────── */}
        {activeSection === 'medications' && (
          <Card className="bg-white border-[#DCE8E5] p-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-[#DCE8E5] pb-4 mb-5">
              <div>
                <h2 className="text-base font-bold text-[#12302E]">My Medication Profile ({medications.length})</h2>
                <p className="text-xs text-[#64748B] mt-0.5">Manage active prescription and over-the-counter medicines</p>
              </div>
              <Badge variant="brand" size="md" icon={PillIcon}>
                {medications.length} Added
              </Badge>
            </div>

            <div className="mb-6">
              <MedicineSearch onSelect={handleAddMedication} disabled={addingMed} />
            </div>

            {medications.length > 0 ? (
              <div className="space-y-3">
                {medications.map((m) => (
                  <MedicineCard key={m._id} medicine={m} onRemove={handleRemoveMedication} />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 bg-[#F5F9F7] rounded-xl border border-[#DCE8E5]">
                <PillIcon className="w-10 h-10 text-[#0F766E]/40 mx-auto mb-2" />
                <p className="text-sm font-semibold text-[#12302E]">No medications added yet</p>
                <p className="text-xs text-[#64748B] mt-1">Use the search box above to add your first medicine.</p>
              </div>
            )}

            {medications.length >= 2 && (
              <div className="mt-6 pt-5 border-t border-[#DCE8E5] flex justify-end">
                <Link to="/checker" className="no-underline">
                  <Button variant="primary" size="md" icon={ShieldCheckIcon} iconPosition="left">
                    Check These Medicines for Interactions →
                  </Button>
                </Link>
              </div>
            )}
          </Card>
        )}

        {/* ── ALLERGIES TAB ────────────────────────────────────────────────── */}
        {activeSection === 'allergies' && (
          <Card className="bg-white border-[#DCE8E5] p-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-[#DCE8E5] pb-4 mb-5">
              <div>
                <h2 className="text-base font-bold text-[#12302E]">Allergy & Sensitivity Profile ({allergies.length})</h2>
                <p className="text-xs text-[#64748B] mt-0.5">Log known drug allergies to enable conflict warnings</p>
              </div>
              <Badge variant="warning" size="md" icon={AlertTriangleIcon}>
                {allergies.length} Logged
              </Badge>
            </div>

            <AllergyForm onAdd={handleAddAllergy} loading={addingAllergy} />

            {allergies.length > 0 ? (
              <div className="space-y-3 mt-6">
                {allergies.map((a) => (
                  <div
                    key={a._id}
                    className="flex items-start gap-3 bg-[#F5F9F7] border border-[#DCE8E5] rounded-xl p-4 group transition-all"
                  >
                    <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-200 flex-shrink-0">
                      <AlertTriangleIcon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[#12302E] text-sm font-bold capitalize">{a.allergen}</p>
                      <p className="text-[#64748B] text-xs mt-0.5">{a.reaction || 'Reaction not specified'}</p>
                      <div className="flex items-center gap-2 mt-2">
                        {a.drugClass && (
                          <span className="text-xs px-2 py-0.5 bg-white border border-[#DCE8E5] text-[#64748B] rounded-md font-medium">
                            {a.drugClass}
                          </span>
                        )}
                        {a.severity !== 'unknown' && <SeverityBadge severity={a.severity} />}
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemoveAllergy(a._id)}
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-[#94A3B8] hover:text-red-600 hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100 flex-shrink-0"
                      aria-label={`Remove allergy ${a.allergen}`}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 bg-[#F5F9F7] rounded-xl border border-[#DCE8E5] mt-6">
                <AlertTriangleIcon className="w-10 h-10 text-amber-600/40 mx-auto mb-2" />
                <p className="text-sm font-semibold text-[#12302E]">No allergies logged</p>
                <p className="text-xs text-[#64748B] mt-1">Add drug allergies above to enable cross-checking against new medicines.</p>
              </div>
            )}
          </Card>
        )}

        {/* ── REMINDERS TAB ────────────────────────────────────────────────── */}
        {activeSection === 'reminders' && (
          <div className="space-y-4">
            <Card className="bg-white border-[#DCE8E5] p-6 shadow-sm flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-[#12302E]">Medication Reminders</h2>
                <p className="text-xs text-[#64748B] mt-0.5">Manage daily dosing schedules and notifications</p>
              </div>
              <Link to="/reminders" className="no-underline">
                <Button variant="primary" size="sm" icon={BellIcon}>
                  Manage All Reminders →
                </Button>
              </Link>
            </Card>

            {reminders.length > 0 ? (
              <div className="space-y-3">
                {reminders.map((r) => (
                  <ReminderCard key={r._id} reminder={r} onDelete={handleDeleteReminder} />
                ))}
              </div>
            ) : (
              <Card className="bg-white border-[#DCE8E5] p-8 text-center shadow-sm">
                <BellIcon className="w-10 h-10 text-[#0F766E]/40 mx-auto mb-2" />
                <p className="text-sm font-semibold text-[#12302E]">No reminders scheduled</p>
                <p className="text-xs text-[#64748B] mt-1 mb-4">Set time alerts so you never miss a dose.</p>
                <Link to="/reminders" className="no-underline inline-block">
                  <Button variant="secondary" size="sm">Create First Reminder</Button>
                </Link>
              </Card>
            )}
          </div>
        )}
      </main>
    </div>
  )
}

export default Dashboard
