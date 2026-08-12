import { useState } from 'react'
import { Link } from 'react-router-dom'

/**
 * Navbar.jsx
 * Responsibility: Sticky top navigation bar.
 * Contains: MediSafe logo, nav links, auth buttons, mobile hamburger menu.
 * Connected to: Home.jsx renders this at the top of every page.
 *               React Router <Link> is used so future pages don't cause full page reloads.
 */
function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 bg-white border-b border-slate-200 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 font-bold text-xl text-teal-600 no-underline">
          <span className="text-2xl">✚</span>
          <span>MediSafe</span>
        </Link>

        {/* Desktop nav links */}
        <nav className="hidden md:flex gap-7">
          <a href="#home"         className="text-slate-700 text-sm font-medium hover:text-teal-600 transition-colors no-underline">Home</a>
          <a href="#features"     className="text-slate-700 text-sm font-medium hover:text-teal-600 transition-colors no-underline">Features</a>
          <a href="#how-it-works" className="text-slate-700 text-sm font-medium hover:text-teal-600 transition-colors no-underline">How It Works</a>
          <a href="#about"        className="text-slate-700 text-sm font-medium hover:text-teal-600 transition-colors no-underline">About</a>
        </nav>

        {/* Desktop auth buttons */}
        <div className="hidden md:flex gap-3">
          <button className="px-4 py-2 text-sm font-semibold text-slate-700 rounded-lg hover:text-teal-600 transition-colors cursor-pointer">
            Log In
          </button>
          <button className="px-4 py-2 text-sm font-semibold bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors cursor-pointer">
            Sign Up
          </button>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-2xl bg-transparent border-none cursor-pointer text-slate-700"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-6 py-4 flex flex-col gap-4">
          <a href="#home"         onClick={() => setMenuOpen(false)} className="text-slate-700 text-sm font-medium hover:text-teal-600 no-underline">Home</a>
          <a href="#features"     onClick={() => setMenuOpen(false)} className="text-slate-700 text-sm font-medium hover:text-teal-600 no-underline">Features</a>
          <a href="#how-it-works" onClick={() => setMenuOpen(false)} className="text-slate-700 text-sm font-medium hover:text-teal-600 no-underline">How It Works</a>
          <a href="#about"        onClick={() => setMenuOpen(false)} className="text-slate-700 text-sm font-medium hover:text-teal-600 no-underline">About</a>
          <div className="flex gap-3 pt-2 border-t border-slate-100">
            <button className="px-4 py-2 text-sm font-semibold text-slate-700 rounded-lg hover:text-teal-600 transition-colors cursor-pointer">
              Log In
            </button>
            <button className="px-4 py-2 text-sm font-semibold bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors cursor-pointer">
              Sign Up
            </button>
          </div>
        </div>
      )}
    </header>
  )
}

export default Navbar
