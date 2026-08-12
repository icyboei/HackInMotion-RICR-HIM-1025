import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'

/**
 * App.jsx — Router Shell
 * Responsibility: Sets up React Router and maps URL paths to page components.
 * This file should stay small. Add new <Route> entries here as you build new pages.
 *
 * Future routes to add:
 *   /login      → <Login />
 *   /signup     → <Signup />
 *   /checker    → <Checker />
 *   /dashboard  → <Dashboard />
 */
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
