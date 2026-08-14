import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../utils/api'
import ErrorBanner from '../components/ErrorBanner'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { MedicalDoodleBackground } from '../components/ui/MedicalDoodles'
import { AlertTriangleIcon, ArrowRightIcon } from '../components/ui/Icons'

function Login() {
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')
  const { login } = useAuth()
  const navigate  = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const data = await api.post('/auth/login', { email, password })
      login(data.user, data.token)
      navigate('/dashboard')
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.')
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
          <p className="text-[#64748B] text-sm mt-2 font-medium">Sign in to your account</p>
        </div>

        {/* Auth Card */}
        <Card className="bg-white border-[#DCE8E5] rounded-2xl p-8 shadow-sm">
          <ErrorBanner message={error} onDismiss={() => setError('')} />

          <form onSubmit={handleSubmit} className="space-y-4 mt-2">
            <div>
              <label htmlFor="login-email" className="block text-xs font-bold text-[#64748B] uppercase tracking-wide mb-1.5">
                Email address
              </label>
              <input
                id="login-email"
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
              <label htmlFor="login-password" className="block text-xs font-bold text-[#64748B] uppercase tracking-wide mb-1.5">
                Password
              </label>
              <input
                id="login-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                autoComplete="current-password"
                className="w-full px-4 py-3 bg-white border border-[#DCE8E5] text-[#12302E] rounded-xl text-sm placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#0F766E] focus:border-transparent transition-all shadow-sm"
              />
            </div>

            <Button
              id="login-submit-btn"
              type="submit"
              disabled={loading}
              loading={loading}
              variant="primary"
              size="lg"
              className="w-full font-bold shadow-sm mt-2"
              icon={loading ? undefined : ArrowRightIcon}
              iconPosition="right"
            >
              Sign In
            </Button>
          </form>

          <p className="text-center text-sm text-[#64748B] mt-6 font-medium">
            Don't have an account?{' '}
            <Link to="/signup" className="text-[#0F766E] hover:underline font-bold">
              Create one
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

export default Login
