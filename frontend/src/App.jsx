import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'

// Pages
import Home        from './pages/Home'
import Login       from './pages/Login'
import Signup      from './pages/Signup'
import Dashboard   from './pages/Dashboard'
import Checker     from './pages/Checker'
import AIAssistant from './pages/AIAssistant'
import PriceExplorer from './pages/PriceExplorer'
import History     from './pages/History'
import Reminders   from './pages/Reminders'

/**
 * App.jsx — Router Shell
 * Wraps the entire app in AuthProvider for global auth state.
 * Protected routes redirect to /login if not authenticated.
 */
function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/"       element={<Home />} />
          <Route path="/login"  element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Checker is public (works without login, stores history if logged in) */}
          <Route path="/checker" element={<Checker />} />
          <Route path="/prices"  element={<PriceExplorer />} />

          {/* Protected routes */}
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/ai"        element={<ProtectedRoute><AIAssistant /></ProtectedRoute>} />
          <Route path="/history"   element={<ProtectedRoute><History /></ProtectedRoute>} />
          <Route path="/reminders" element={<ProtectedRoute><Reminders /></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
