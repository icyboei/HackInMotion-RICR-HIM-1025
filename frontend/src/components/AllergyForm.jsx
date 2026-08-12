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
          <label htmlFor="allergy-allergen" className="text-xs font-medium text-slate-400 block mb-1">
            Allergen / Medicine *
          </label>
          <input
            id="allergy-allergen"
            type="text"
            value={allergen}
            onChange={(e) => setAllergen(e.target.value)}
            placeholder="e.g. penicillin, aspirin"
            required
            className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 text-slate-100 rounded-xl text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>
        <div>
          <label htmlFor="allergy-class" className="text-xs font-medium text-slate-400 block mb-1">
            Drug Class (optional)
          </label>
          <input
            id="allergy-class"
            type="text"
            value={drugClass}
            onChange={(e) => setDrugClass(e.target.value)}
            placeholder="e.g. beta-lactam antibiotics"
            className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 text-slate-100 rounded-xl text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>
        <div>
          <label htmlFor="allergy-reaction" className="text-xs font-medium text-slate-400 block mb-1">
            Reaction
          </label>
          <input
            id="allergy-reaction"
            type="text"
            value={reaction}
            onChange={(e) => setReaction(e.target.value)}
            placeholder="e.g. rash, anaphylaxis"
            className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 text-slate-100 rounded-xl text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>
        <div>
          <label htmlFor="allergy-severity" className="text-xs font-medium text-slate-400 block mb-1">
            Severity
          </label>
          <select
            id="allergy-severity"
            value={severity}
            onChange={(e) => setSeverity(e.target.value)}
            className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 text-slate-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
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
        className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-sm rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Adding...' : '+ Add Allergy'}
      </button>
    </form>
  )
}

export default AllergyForm
