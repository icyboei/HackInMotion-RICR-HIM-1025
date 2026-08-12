import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import ReminderCard from '../components/ReminderCard'
import MedicineSearch from '../components/MedicineSearch'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorBanner from '../components/ErrorBanner'
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
    <div className="min-h-screen bg-slate-950 flex flex-col">
      <Navbar />
      <LoadingSpinner message="Loading reminders..." />
    </div>
  )

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">Reminders</h1>
            <p className="text-slate-400 text-sm mt-1">Set daily medication reminders.</p>
          </div>
          <button
            id="add-reminder-btn"
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-sm rounded-xl transition-colors"
          >
            {showForm ? 'Cancel' : '+ Add Reminder'}
          </button>
        </div>

        <ErrorBanner message={error} onDismiss={() => setError('')} />

        {/* Add reminder form */}
        {showForm && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-6">
            <h2 className="text-sm font-semibold text-white mb-5">New Reminder</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-medium text-slate-400 block mb-1">Medicine *</label>
                <MedicineSearch
                  onSelect={(m) => setMedicine(m)}
                  placeholder="Search medicine..."
                />
                {medicine && (
                  <p className="text-xs text-teal-400 mt-1 capitalize">Selected: {medicine.genericName}</p>
                )}
              </div>

              <div>
                <label htmlFor="reminder-dosage" className="text-xs font-medium text-slate-400 block mb-1">Dosage</label>
                <input
                  id="reminder-dosage"
                  type="text"
                  value={dosage}
                  onChange={(e) => setDosage(e.target.value)}
                  placeholder="e.g. 500mg, 1 tablet"
                  className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 text-slate-100 rounded-xl text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-400 block mb-2">Reminder Times *</label>
                <div className="space-y-2">
                  {times.map((t, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <input
                        type="time"
                        value={t}
                        onChange={(e) => updateTime(i, e.target.value)}
                        className="px-3 py-2 bg-slate-800 border border-slate-700 text-slate-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                      {times.length > 1 && (
                        <button type="button" onClick={() => removeTimeSlot(i)} className="text-slate-500 hover:text-red-400 transition-colors">✕</button>
                      )}
                    </div>
                  ))}
                </div>
                {times.length < 6 && (
                  <button type="button" onClick={addTimeSlot} className="text-xs text-teal-400 hover:text-teal-300 mt-2">
                    + Add another time
                  </button>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="reminder-start" className="text-xs font-medium text-slate-400 block mb-1">Start Date</label>
                  <input
                    id="reminder-start"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 text-slate-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label htmlFor="reminder-end" className="text-xs font-medium text-slate-400 block mb-1">End Date</label>
                  <input
                    id="reminder-end"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 text-slate-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="reminder-notes" className="text-xs font-medium text-slate-400 block mb-1">Notes</label>
                <input
                  id="reminder-notes"
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. take with food"
                  className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 text-slate-100 rounded-xl text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <button
                id="submit-reminder-btn"
                type="submit"
                disabled={submitting || !medicine}
                className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-sm rounded-xl transition-colors disabled:opacity-50"
              >
                {submitting ? 'Saving...' : 'Save Reminder'}
              </button>
            </form>
          </div>
        )}

        {/* Reminder list */}
        {reminders.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">⏰</div>
            <p className="text-slate-400 font-medium">No reminders yet</p>
            <p className="text-slate-500 text-sm mt-1">Add a reminder to stay on schedule with your medications.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {reminders.map((r) => (
              <ReminderCard key={r._id} reminder={r} onDelete={handleDelete} />
            ))}
          </div>
        )}

        <p className="text-xs text-slate-600 text-center mt-6">
          Note: Browser notifications are not yet supported. Reminders are stored and shown within the app only.
        </p>
      </main>
    </div>
  )
}

export default Reminders
