import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../utils/api'
import ErrorBanner from '../components/ErrorBanner'

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
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-teal-400 font-bold text-2xl">
            <span className="text-3xl">✚</span>
            <span>MediSafe</span>
          </Link>
          <p className="text-slate-400 text-sm mt-2">Sign in to your account</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl">
          <ErrorBanner message={error} onDismiss={() => setError('')} />

          <form onSubmit={handleSubmit} className="space-y-5 mt-4">
            <div>
              <label htmlFor="login-email" className="block text-sm font-medium text-slate-300 mb-2">
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
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 text-slate-100 rounded-xl text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
              />
            </div>

            <div>
              <label htmlFor="login-password" className="block text-sm font-medium text-slate-300 mb-2">
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
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 text-slate-100 rounded-xl text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
              />
            </div>

            <button
              id="login-submit-btn"
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl transition-colors disabled:opacity-60 disabled:cursor-not-allowed text-sm"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-sm text-slate-400 mt-6">
            Don't have an account?{' '}
            <Link to="/signup" className="text-teal-400 hover:text-teal-300 font-medium">
              Create one
            </Link>
          </p>
        </div>

        <p className="text-center text-xs text-slate-600 mt-6">
          ⚠️ MediSafe is for informational purposes only. Not a substitute for professional medical advice.
        </p>
      </div>
    </div>
  )
}

export default Login
