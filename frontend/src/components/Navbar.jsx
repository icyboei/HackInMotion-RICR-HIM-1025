import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { isAuthenticated, user, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/')
    setMenuOpen(false)
  }

  const navLinks = isAuthenticated
    ? [
        { to: '/dashboard', label: 'Dashboard' },
        { to: '/checker',   label: 'Checker' },
        { to: '/ai',        label: 'Ask AI' },
        { to: '/prices',    label: 'Prices' },
        { to: '/reminders', label: 'Reminders' },
        { to: '/history',   label: 'History' },
      ]
    : [
        { to: '/#home',         label: 'Home',         hash: true },
        { to: '/#features',     label: 'Features',     hash: true },
        { to: '/#how-it-works', label: 'How It Works', hash: true },
      ]

  return (
    <header className="sticky top-0 bg-slate-950/95 backdrop-blur-md border-b border-slate-800 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 font-bold text-xl text-teal-400 no-underline flex-shrink-0">
          <span className="text-2xl">✚</span>
          <span>MediSafe</span>
        </Link>

        {/* Desktop nav links */}
        <nav className="hidden md:flex gap-6">
          {navLinks.map((link) => (
            link.hash
              ? <a key={link.label} href={link.to} className="text-slate-400 text-sm font-medium hover:text-teal-400 transition-colors no-underline">{link.label}</a>
              : <Link key={link.label} to={link.to} className="text-slate-400 text-sm font-medium hover:text-teal-400 transition-colors no-underline">{link.label}</Link>
          ))}
        </nav>

        {/* Desktop auth buttons */}
        <div className="hidden md:flex gap-3 items-center">
          {isAuthenticated ? (
            <>
              <span className="text-xs text-slate-500 font-medium">{user?.name}</span>
              <button
                id="logout-btn"
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-semibold text-slate-400 hover:text-teal-400 transition-colors cursor-pointer"
              >
                Log Out
              </button>
            </>
          ) : (
            <>
              <Link
                id="login-link"
                to="/login"
                className="px-4 py-2 text-sm font-semibold text-slate-400 hover:text-teal-400 transition-colors no-underline"
              >
                Log In
              </Link>
              <Link
                id="signup-link"
                to="/signup"
                className="px-4 py-2 text-sm font-semibold bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition-colors no-underline"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-2xl bg-transparent border-none cursor-pointer text-slate-400"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
          id="mobile-menu-btn"
        >
          {menuOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="md:hidden bg-slate-900 border-b border-slate-800 px-6 py-4 flex flex-col gap-4">
          {navLinks.map((link) => (
            link.hash
              ? <a key={link.label} href={link.to} onClick={() => setMenuOpen(false)} className="text-slate-300 text-sm font-medium no-underline">{link.label}</a>
              : <Link key={link.label} to={link.to} onClick={() => setMenuOpen(false)} className="text-slate-300 text-sm font-medium no-underline">{link.label}</Link>
          ))}
          <div className="flex gap-3 pt-2 border-t border-slate-800">
            {isAuthenticated ? (
              <button onClick={handleLogout} className="px-4 py-2 text-sm font-semibold text-slate-400 hover:text-teal-400 transition-colors">
                Log Out
              </button>
            ) : (
              <>
                <Link to="/login" onClick={() => setMenuOpen(false)} className="px-4 py-2 text-sm font-semibold text-slate-400 no-underline">Log In</Link>
                <Link to="/signup" onClick={() => setMenuOpen(false)} className="px-4 py-2 text-sm font-semibold bg-teal-600 text-white rounded-xl no-underline">Sign Up</Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}

export default Navbar
