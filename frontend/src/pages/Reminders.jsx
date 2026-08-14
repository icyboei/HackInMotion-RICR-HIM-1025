import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import ReminderCard from '../components/ReminderCard'
import MedicineSearch from '../components/MedicineSearch'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorBanner from '../components/ErrorBanner'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { MedicalDoodleBackground } from '../components/ui/MedicalDoodles'
import { BellIcon, ClockIcon, PlusIcon, ShieldCheckIcon } from '../components/ui/Icons'
import api from '../utils/api'

function Reminders() {
  const [reminders, setReminders]       = useState([])
  const [loading, setLoading]           = useState(true)
  const [submitting, setSubmitting]     = useState(false)
  const [error, setError]               = useState('')
  const [showForm, setShowForm]         = useState(false)

  // Form state
  const [medicine, setMedicine]   = useState(null)
  const [dosage, setDosage]       = useState('')
  const [times, setTimes]         = useState(['08:00'])
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate]     = useState('')
  const [notes, setNotes]         = useState('')

  useEffect(() => { loadReminders() }, [])

  async function loadReminders() {
    setLoading(true)
    try {
      const data = await api.get('/reminders')
      setReminders(data.reminders || [])
    } catch (err) {
      setError(err.message || 'Failed to load reminders.')
    } finally {
      setLoading(false)
    }
  }

  function addTimeSlot() {
    if (times.length < 6) setTimes([...times, '12:00'])
  }

  function removeTimeSlot(i) {
    if (times.length > 1) setTimes(times.filter((_, idx) => idx !== i))
  }

  function updateTime(i, val) {
    const updated = [...times]
    updated[i] = val
    setTimes(updated)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!medicine) return setError('Please select a medicine.')
    setSubmitting(true)
    setError('')
    try {
      const data = await api.post('/reminders', {
        medicineName: medicine.genericName,
        dosage,
        times,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
        notes,
      })
      setReminders((prev) => [data.reminder, ...prev])
      setShowForm(false)
      setMedicine(null); setDosage(''); setTimes(['08:00']); setNotes('')
    } catch (err) {
      setError(err.message || 'Failed to add reminder.')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDelete(id) {
    try {
      await api.delete(`/reminders/${id}`)
      setReminders((prev) => prev.filter((r) => r._id?.toString() !== id))
    } catch (err) {
      setError(err.message || 'Failed to delete reminder.')
    }
  }

  if (loading) return (
    <div className="min-h-screen bg-[#F5F9F7] text-[#12302E] flex flex-col font-sans">
      <Navbar />
      <LoadingSpinner message="Loading reminders..." />
    </div>
  )

  return (
    <div className="min-h-screen bg-[#F5F9F7] text-[#12302E] flex flex-col relative overflow-hidden font-sans">
      <MedicalDoodleBackground density="normal" />

      <Navbar />

      <main className="relative z-10 flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-[#DCE8E5] pb-6">
          <div>
            <Badge variant="brand" size="md" icon={BellIcon} className="bg-white border-[#DCE8E5] mb-2">
              SCHEDULED ALERTS
            </Badge>
            <h1 className="text-3xl font-extrabold text-[#12302E] tracking-tight">Medication Reminders</h1>
            <p className="text-[#64748B] text-sm mt-1">Set daily dosing schedules and active medicine alerts.</p>
          </div>
          <Button
            id="add-reminder-btn"
            onClick={() => setShowForm(!showForm)}
            variant="primary"
            size="md"
            icon={showForm ? undefined : PlusIcon}
          >
            {showForm ? 'Cancel' : 'Add Reminder'}
          </Button>
        </div>

        <ErrorBanner message={error} onDismiss={() => setError('')} />

        {/* Add reminder form */}
        {showForm && (
          <Card className="bg-white border-[#DCE8E5] p-6 mb-6 shadow-sm">
            <h2 className="text-base font-bold text-[#12302E] mb-5 border-b border-[#DCE8E5] pb-3">New Reminder</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-[#64748B] block mb-1">Medicine *</label>
                <MedicineSearch
                  onSelect={(m) => setMedicine(m)}
                  placeholder="Search medicine..."
                />
                {medicine && (
                  <p className="text-xs text-[#0F766E] font-semibold mt-1.5 capitalize">Selected: {medicine.genericName}</p>
                )}
              </div>

              <div>
                <label htmlFor="reminder-dosage" className="text-xs font-semibold text-[#64748B] block mb-1">Dosage</label>
                <input
                  id="reminder-dosage"
                  type="text"
                  value={dosage}
                  onChange={(e) => setDosage(e.target.value)}
                  placeholder="e.g. 500mg, 1 tablet"
                  className="w-full px-3.5 py-2.5 bg-white border border-[#DCE8E5] text-[#12302E] rounded-xl text-sm placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#0F766E] focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#64748B] block mb-2">Reminder Times *</label>
                <div className="space-y-2">
                  {times.map((t, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <input
                        type="time"
                        value={t}
                        onChange={(e) => updateTime(i, e.target.value)}
                        className="px-3.5 py-2 bg-white border border-[#DCE8E5] text-[#12302E] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0F766E] focus:border-transparent transition-all font-semibold"
                      />
                      {times.length > 1 && (
                        <button type="button" onClick={() => removeTimeSlot(i)} className="text-[#94A3B8] hover:text-red-600 p-1">✕</button>
                      )}
                    </div>
                  ))}
                </div>
                {times.length < 6 && (
                  <button type="button" onClick={addTimeSlot} className="text-xs font-semibold text-[#0F766E] hover:underline mt-2.5 block">
                    + Add another time
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="reminder-start" className="text-xs font-semibold text-[#64748B] block mb-1">Start Date</label>
                  <input
                    id="reminder-start"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-[#DCE8E5] text-[#12302E] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0F766E] focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label htmlFor="reminder-end" className="text-xs font-semibold text-[#64748B] block mb-1">End Date</label>
                  <input
                    id="reminder-end"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-[#DCE8E5] text-[#12302E] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0F766E] focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="reminder-notes" className="text-xs font-semibold text-[#64748B] block mb-1">Notes</label>
                <input
                  id="reminder-notes"
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. take with food"
                  className="w-full px-3.5 py-2.5 bg-white border border-[#DCE8E5] text-[#12302E] rounded-xl text-sm placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#0F766E] focus:border-transparent transition-all"
                />
              </div>

              <Button
                id="submit-reminder-btn"
                type="submit"
                disabled={submitting || !medicine}
                loading={submitting}
                variant="primary"
                size="md"
                className="w-full"
              >
                Save Reminder
              </Button>
            </form>
          </Card>
        )}

        {/* Reminder list */}
        {reminders.length === 0 ? (
          <Card className="bg-white border-[#DCE8E5] p-12 text-center shadow-sm">
            <div className="w-14 h-14 rounded-2xl bg-[#EEF6F4] text-[#0F766E] flex items-center justify-center mx-auto mb-3 border border-[#DCE8E5]">
              <ClockIcon className="w-7 h-7" />
            </div>
            <p className="text-[#12302E] font-bold text-base">No reminders scheduled</p>
            <p className="text-[#64748B] text-xs mt-1 max-w-sm mx-auto">
              Add a reminder to receive daily dosing schedules and manage your medicine timing.
            </p>
          </Card>
        ) : (
          <div className="space-y-3">
            {reminders.map((r) => (
              <ReminderCard key={r._id} reminder={r} onDelete={handleDelete} />
            ))}
          </div>
        )}

        <p className="text-xs text-[#94A3B8] text-center mt-6">
          Note: Browser notifications are not yet supported. Reminders are stored and displayed within the application.
        </p>
      </main>
    </div>
  )
}

export default Reminders
