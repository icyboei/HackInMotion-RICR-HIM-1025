import { useState } from 'react'

/**
 * AllergyForm — add a new allergy entry
 * Props: onAdd(allergyData) callback
 */
function AllergyForm({ onAdd, loading }) {
  const [allergen, setAllergen] = useState('')
  const [reaction, setReaction] = useState('')
  const [severity, setSeverity] = useState('unknown')
  const [drugClass, setDrugClass] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    if (!allergen.trim()) return
    onAdd({ allergen: allergen.trim(), reaction: reaction.trim(), severity, drugClass: drugClass.trim() })
    setAllergen('')
    setReaction('')
    setSeverity('unknown')
    setDrugClass('')
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label htmlFor="allergy-allergen" className="text-xs font-semibold text-[#64748B] block mb-1">
            Allergen / Medicine *
          </label>
          <input
            id="allergy-allergen"
            type="text"
            value={allergen}
            onChange={(e) => setAllergen(e.target.value)}
            placeholder="e.g. penicillin, aspirin"
            required
            className="w-full px-3.5 py-2.5 bg-white border border-[#DCE8E5] text-[#12302E] rounded-xl text-sm placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#0F766E] focus:border-transparent transition-all"
          />
        </div>
        <div>
          <label htmlFor="allergy-class" className="text-xs font-semibold text-[#64748B] block mb-1">
            Drug Class (optional)
          </label>
          <input
            id="allergy-class"
            type="text"
            value={drugClass}
            onChange={(e) => setDrugClass(e.target.value)}
            placeholder="e.g. beta-lactam antibiotics"
            className="w-full px-3.5 py-2.5 bg-white border border-[#DCE8E5] text-[#12302E] rounded-xl text-sm placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#0F766E] focus:border-transparent transition-all"
          />
        </div>
        <div>
          <label htmlFor="allergy-reaction" className="text-xs font-semibold text-[#64748B] block mb-1">
            Reaction
          </label>
          <input
            id="allergy-reaction"
            type="text"
            value={reaction}
            onChange={(e) => setReaction(e.target.value)}
            placeholder="e.g. rash, anaphylaxis"
            className="w-full px-3.5 py-2.5 bg-white border border-[#DCE8E5] text-[#12302E] rounded-xl text-sm placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#0F766E] focus:border-transparent transition-all"
          />
        </div>
        <div>
          <label htmlFor="allergy-severity" className="text-xs font-semibold text-[#64748B] block mb-1">
            Severity
          </label>
          <select
            id="allergy-severity"
            value={severity}
            onChange={(e) => setSeverity(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-white border border-[#DCE8E5] text-[#12302E] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0F766E] focus:border-transparent transition-all"
          >
            <option value="unknown">Unknown</option>
            <option value="mild">Mild</option>
            <option value="moderate">Moderate</option>
            <option value="severe">Severe</option>
          </select>
        </div>
      </div>
      <button
        id="add-allergy-btn"
        type="submit"
        disabled={loading || !allergen.trim()}
        className="px-5 py-2.5 bg-[#0F766E] hover:bg-[#115E59] text-white font-semibold text-sm rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
      >
        {loading ? 'Adding...' : '+ Add Allergy'}
      </button>
    </form>
  )
}

export default AllergyForm
