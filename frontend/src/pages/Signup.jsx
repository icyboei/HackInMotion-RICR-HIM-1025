import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../utils/api'
import ErrorBanner from '../components/ErrorBanner'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { MedicalDoodleBackground } from '../components/ui/MedicalDoodles'
import { AlertTriangleIcon, CheckIcon, ArrowRightIcon } from '../components/ui/Icons'

function Signup() {
  const [name, setName]         = useState('')
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm]   = useState('')
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')
  const [success, setSuccess]   = useState(false)
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (password !== confirm) {
      return setError('Passwords do not match.')
    }
    if (password.length < 8) {
      return setError('Password must be at least 8 characters.')
    }

    setLoading(true)
    try {
      await api.post('/auth/register', { name, email, password })
      setSuccess(true)
      setTimeout(() => navigate('/login'), 2000)
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F5F9F7] text-[#12302E] flex flex-col items-center justify-center px-4 py-8 relative overflow-hidden font-sans">
      {/* Background Medical Doodles */}
      <MedicalDoodleBackground density="normal" />

      <div className="relative z-10 w-full max-w-md mx-auto">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-[#12302E] font-extrabold text-2xl tracking-tight">
            <div className="w-9 h-9 rounded-xl bg-[#0F766E] text-white flex items-center justify-center font-black text-xl shadow-sm">
              ✚
            </div>
            <span>MediSafe</span>
          </Link>
          <p className="text-[#64748B] text-sm mt-2 font-medium">Create your free account</p>
        </div>

        {/* Auth Card */}
        <Card className="bg-white border-[#DCE8E5] rounded-2xl p-8 shadow-sm">
          {success ? (
            <div className="text-center py-6">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-[#16A34A] border border-emerald-200 flex items-center justify-center mx-auto mb-3.5 shadow-sm">
                <CheckIcon className="w-7 h-7" />
              </div>
              <p className="text-[#12302E] font-bold text-lg">Account created!</p>
              <p className="text-[#64748B] text-sm mt-1 font-medium">Redirecting to login page...</p>
            </div>
          ) : (
            <>
              <ErrorBanner message={error} onDismiss={() => setError('')} />
              <form onSubmit={handleSubmit} className="space-y-4 mt-2">
                <div>
                  <label htmlFor="signup-name" className="block text-xs font-bold text-[#64748B] uppercase tracking-wide mb-1.5">
                    Full Name
                  </label>
                  <input
                    id="signup-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Jane Smith"
                    required
                    autoComplete="name"
                    className="w-full px-4 py-3 bg-white border border-[#DCE8E5] text-[#12302E] rounded-xl text-sm placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#0F766E] focus:border-transparent transition-all shadow-sm"
                  />
                </div>

                <div>
                  <label htmlFor="signup-email" className="block text-xs font-bold text-[#64748B] uppercase tracking-wide mb-1.5">
                    Email address
                  </label>
                  <input
                    id="signup-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    autoComplete="email"
                    className="w-full px-4 py-3 bg-white border border-[#DCE8E5] text-[#12302E] rounded-xl text-sm placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#0F766E] focus:border-transparent transition-all shadow-sm"
                  />
                </div>

                <div>
                  <label htmlFor="signup-password" className="block text-xs font-bold text-[#64748B] uppercase tracking-wide mb-1.5">
                    Password
                  </label>
                  <input
                    id="signup-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimum 8 characters"
                    required
                    autoComplete="new-password"
                    className="w-full px-4 py-3 bg-white border border-[#DCE8E5] text-[#12302E] rounded-xl text-sm placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#0F766E] focus:border-transparent transition-all shadow-sm"
                  />
                </div>

                <div>
                  <label htmlFor="signup-confirm" className="block text-xs font-bold text-[#64748B] uppercase tracking-wide mb-1.5">
                    Confirm Password
                  </label>
                  <input
                    id="signup-confirm"
                    type="password"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    placeholder="••••••••"
                    required
                    autoComplete="new-password"
                    className="w-full px-4 py-3 bg-white border border-[#DCE8E5] text-[#12302E] rounded-xl text-sm placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#0F766E] focus:border-transparent transition-all shadow-sm"
                  />
                </div>

                <Button
                  id="signup-submit-btn"
                  type="submit"
                  disabled={loading}
                  loading={loading}
                  variant="primary"
                  size="lg"
                  className="w-full font-bold shadow-sm mt-2"
                  icon={loading ? undefined : ArrowRightIcon}
                  iconPosition="right"
                >
                  Create Account
                </Button>
              </form>
            </>
          )}

          <p className="text-center text-sm text-[#64748B] mt-6 font-medium">
            Already have an account?{' '}
            <Link to="/login" className="text-[#0F766E] hover:underline font-bold">
              Sign in
            </Link>
          </p>
        </Card>

        {/* Disclaimer */}
        <p className="text-center text-xs text-[#94A3B8] font-medium mt-6 flex items-center justify-center gap-1.5 max-w-xs mx-auto">
          <AlertTriangleIcon className="w-3.5 h-3.5 text-amber-700 flex-shrink-0" />
          <span>MediSafe is for informational purposes only. Not a substitute for professional medical advice.</span>
        </p>
      </div>
    </div>
  )
}

export default Signup
