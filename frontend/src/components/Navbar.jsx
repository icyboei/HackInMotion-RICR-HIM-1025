import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { MedicalCrossIcon, MenuIcon, CloseIcon, LogOutIcon } from './ui/Icons'

/**
 * Navbar.jsx — Clinical Health-Tech Design System Foundation
 * Preserves all routes, auth state, and mobile functionality.
 */
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
    <header className="sticky top-0 bg-white/95 backdrop-blur-md border-b border-[#DCE8E5] z-50 shadow-xs">
      <div className="max-w-7xl mx-auto px-6 py-3.5 flex items-center justify-between">

        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 font-extrabold text-xl text-[#0F766E] no-underline flex-shrink-0 group">
          <div className="w-8 h-8 rounded-lg bg-[#0F766E] text-white flex items-center justify-center shadow-xs group-hover:bg-[#115E59] transition-colors">
            <MedicalCrossIcon className="w-5 h-5" />
          </div>
          <span className="tracking-tight text-[#12302E]">Medi<span className="text-[#0F766E]">Safe</span></span>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex gap-7 items-center">
          {navLinks.map((link) => (
            link.hash
              ? (
                <a
                  key={link.label}
                  href={link.to}
                  className="text-[#64748B] text-sm font-semibold hover:text-[#0F766E] transition-colors no-underline"
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  key={link.label}
                  to={link.to}
                  className="text-[#64748B] text-sm font-semibold hover:text-[#0F766E] transition-colors no-underline"
                >
                  {link.label}
                </Link>
              )
          ))}
        </nav>

        {/* Desktop Auth Buttons */}
        <div className="hidden md:flex gap-3 items-center">
          {isAuthenticated ? (
            <>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#EEF6F4] text-xs font-semibold text-[#0F766E] border border-[#DCE8E5]">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>{user?.name}</span>
              </div>
              <button
                id="logout-btn"
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-[#64748B] hover:text-[#DC2626] transition-colors cursor-pointer"
              >
                <LogOutIcon className="w-4 h-4" />
                <span>Log Out</span>
              </button>
            </>
          ) : (
            <>
              <Link
                id="login-link"
                to="/login"
                className="px-4.5 py-2 text-sm font-semibold text-[#0F766E] hover:bg-[#EEF6F4] rounded-xl transition-colors no-underline border border-transparent"
              >
                Log In
              </Link>
              <Link
                id="signup-link"
                to="/signup"
                className="px-5 py-2 text-sm font-semibold bg-[#0F766E] text-white rounded-xl hover:bg-[#115E59] transition-colors no-underline shadow-xs hover:shadow"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden p-2 rounded-lg text-[#64748B] hover:text-[#12302E] hover:bg-[#EEF6F4] transition-colors cursor-pointer border-none"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
          id="mobile-menu-btn"
        >
          {menuOpen ? <CloseIcon className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <div className="md:hidden bg-white border-b border-[#DCE8E5] px-6 py-4 flex flex-col gap-3 shadow-md animate-in slide-in-from-top-2 duration-200">
          {navLinks.map((link) => (
            link.hash
              ? (
                <a
                  key={link.label}
                  href={link.to}
                  onClick={() => setMenuOpen(false)}
                  className="text-[#12302E] text-sm font-semibold py-1.5 no-underline hover:text-[#0F766E]"
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  key={link.label}
                  to={link.to}
                  onClick={() => setMenuOpen(false)}
                  className="text-[#12302E] text-sm font-semibold py-1.5 no-underline hover:text-[#0F766E]"
                >
                  {link.label}
                </Link>
              )
          ))}
          <div className="flex flex-col gap-2 pt-3 border-t border-[#DCE8E5]">
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 py-2 text-sm font-semibold text-[#DC2626] bg-red-50 rounded-xl"
              >
                <LogOutIcon className="w-4 h-4" />
                <span>Log Out ({user?.name})</span>
              </button>
            ) : (
              <div className="flex gap-2">
                <Link
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className="flex-1 text-center py-2 text-sm font-semibold text-[#0F766E] bg-[#EEF6F4] rounded-xl no-underline"
                >
                  Log In
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setMenuOpen(false)}
                  className="flex-1 text-center py-2 text-sm font-semibold bg-[#0F766E] text-white rounded-xl no-underline"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  )
}

export default Navbar
