import { useState, useEffect, useRef } from 'react'
import api from '../utils/api'
import { SearchIcon, PillIcon } from './ui/Icons'

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
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8]">
          <SearchIcon className="w-4 h-4" />
        </span>
        <input
          id="medicine-search-input"
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          autoComplete="off"
          className="w-full pl-10 pr-4 py-3 bg-white border border-[#DCE8E5] text-[#12302E] rounded-xl text-sm placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#0F766E] focus:border-transparent transition-all shadow-sm disabled:opacity-50"
        />
        {loading && (
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2">
            <div className="w-4 h-4 border-2 border-[#0F766E] border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>

      {error && <p className="text-xs text-red-600 mt-1 px-1">{error}</p>}

      {open && suggestions.length > 0 && (
        <ul className="absolute z-50 w-full mt-1 bg-white border border-[#DCE8E5] rounded-xl shadow-xl overflow-hidden max-h-64 overflow-y-auto">
          {suggestions.map((med, i) => (
            <li key={`${med.rxcui}-${i}`}>
              <button
                id={`medicine-suggestion-${i}`}
                onClick={() => handleSelect(med)}
                className="w-full text-left px-4 py-3 hover:bg-[#EEF6F4] transition-colors flex items-center gap-3 border-b border-[#DCE8E5]/60 last:border-0 cursor-pointer"
              >
                <div className="w-7 h-7 rounded-lg bg-[#EEF6F4] text-[#0F766E] flex items-center justify-center border border-[#DCE8E5] flex-shrink-0">
                  <PillIcon className="w-3.5 h-3.5" />
                </div>
                <div>
                  <p className="text-[#12302E] text-sm font-bold capitalize">
                    {med.genericName}
                  </p>
                  {med.brandName && (
                    <p className="text-[#64748B] text-xs font-medium">{med.brandName}</p>
                  )}
                </div>
                <span className="ml-auto text-xs text-[#94A3B8] font-medium flex-shrink-0">RXCUI: {med.rxcui}</span>
              </button>
            </li>
          ))}
        </ul>
      )}

      {open && suggestions.length === 0 && !loading && query.length >= 2 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-[#DCE8E5] rounded-xl p-4 text-center shadow-xl">
          <p className="text-[#12302E] text-sm font-semibold">No medicines found for "{query}"</p>
          <p className="text-[#64748B] text-xs mt-1">Try a different spelling or generic name.</p>
        </div>
      )}
    </div>
  )
}

export default MedicineSearch
