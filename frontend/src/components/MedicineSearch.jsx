import { useState, useEffect, useRef } from 'react'
import api from '../utils/api'

/**
 * MedicineSearch — Autocomplete medicine search input.
 * Supports: generic name, brand name, fuzzy/misspelling via backend RxNorm.
 * Props:
 *   onSelect(medicine) — called when user picks a suggestion
 *   placeholder — input placeholder text
 *   disabled — disable input
 */
function MedicineSearch({ onSelect, placeholder = 'Search medicine (e.g. aspirin, paracetamol)...', disabled = false }) {
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [error, setError] = useState('')
  const debounceRef = useRef(null)
  const wrapperRef = useRef(null)

  useEffect(() => {
    if (query.length < 2) {
      setSuggestions([])
      setOpen(false)
      return
    }

    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(async () => {
      setLoading(true)
      setError('')
      try {
        const data = await api.get('/medicines/search', { q: query })
        setSuggestions(data.results || [])
        setOpen(true)
      } catch (err) {
        setError(err.message || 'Medicine search unavailable')
        setSuggestions([])
      } finally {
        setLoading(false)
      }
    }, 350)

    return () => clearTimeout(debounceRef.current)
  }, [query])

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  function handleSelect(medicine) {
    setQuery(medicine.genericName || medicine.brandName)
    setOpen(false)
    setSuggestions([])
    onSelect(medicine)
  }

  return (
    <div ref={wrapperRef} className="relative w-full">
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">🔍</span>
        <input
          id="medicine-search-input"
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          autoComplete="off"
          className="w-full pl-9 pr-4 py-3 bg-slate-800 border border-slate-700 text-slate-100 rounded-xl text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all disabled:opacity-50"
        />
        {loading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <div className="w-4 h-4 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>

      {error && <p className="text-xs text-red-400 mt-1 px-1">{error}</p>}

      {open && suggestions.length > 0 && (
        <ul className="absolute z-50 w-full mt-1 bg-slate-800 border border-slate-700 rounded-xl shadow-xl overflow-hidden max-h-64 overflow-y-auto">
          {suggestions.map((med, i) => (
            <li key={`${med.rxcui}-${i}`}>
              <button
                id={`medicine-suggestion-${i}`}
                onClick={() => handleSelect(med)}
                className="w-full text-left px-4 py-3 hover:bg-slate-700 transition-colors flex items-center gap-3 border-b border-slate-700/50 last:border-0"
              >
                <span className="text-teal-400 text-xs">💊</span>
                <div>
                  <p className="text-slate-100 text-sm font-medium capitalize">
                    {med.genericName}
                  </p>
                  {med.brandName && (
                    <p className="text-slate-400 text-xs">{med.brandName}</p>
                  )}
                </div>
                <span className="ml-auto text-xs text-slate-500 flex-shrink-0">RXCUI: {med.rxcui}</span>
              </button>
            </li>
          ))}
        </ul>
      )}

      {open && suggestions.length === 0 && !loading && query.length >= 2 && (
        <div className="absolute z-50 w-full mt-1 bg-slate-800 border border-slate-700 rounded-xl p-4 text-center">
          <p className="text-slate-400 text-sm">No medicines found for "{query}"</p>
          <p className="text-slate-500 text-xs mt-1">Try a different spelling or generic name.</p>
        </div>
      )}
    </div>
  )
}

export default MedicineSearch
