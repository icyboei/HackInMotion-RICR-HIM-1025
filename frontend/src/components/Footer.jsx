/**
 * Footer.jsx — updated with dark theme and links
 */
import { Link } from 'react-router-dom'

function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-slate-800 py-8 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-teal-400 font-bold">
            <span className="text-xl">✚</span>
            <span>MediSafe</span>
          </div>
          <div className="flex gap-6 text-xs text-slate-500">
            <Link to="/checker" className="hover:text-teal-400 transition-colors no-underline">Checker</Link>
            <Link to="/ai"      className="hover:text-teal-400 transition-colors no-underline">AI Assistant</Link>
            <Link to="/prices"  className="hover:text-teal-400 transition-colors no-underline">Prices</Link>
          </div>
          <p className="text-xs text-slate-600">
            © {new Date().getFullYear()} MediSafe · Built for safer medicine use.
          </p>
        </div>
        <p className="text-center text-xs text-slate-700 mt-4">
          Data sources: RxNorm (National Library of Medicine) · OpenFDA · FDA FAERS
        </p>
      </div>
    </footer>
  )
}

export default Footer
