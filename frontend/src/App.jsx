import { useState } from 'react'
import './App.css'

function App() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="app">
      {/* Navbar */}
      <header className="navbar">
        <div className="navbar-inner">
          <div className="logo">
            <span className="logo-icon">✚</span>
            <span className="logo-text">MediSafe</span>
          </div>

          <nav className={`nav-links ${menuOpen ? 'open' : ''}`}>
            <a href="#home">Home</a>
            <a href="#features">Features</a>
            <a href="#how-it-works">How It Works</a>
            <a href="#about">About</a>
          </nav>

          <div className="navbar-actions">
            <button className="btn btn-ghost">Log In</button>
            <button className="btn btn-primary">Sign Up</button>
          </div>

          <button
            className="menu-toggle"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            ☰
          </button>
        </div>
      </header>

      {/* Hero */}
      <section id="home" className="hero">
        <div className="hero-content">
          <span className="badge">Your digital health companion</span>
          <h1>
            Know before you mix.<br />Stay safe with every dose.
          </h1>
          <p className="hero-subtext">
            Add the medicines you take and instantly check for risky interactions —
            explained in plain language, not confusing medical jargon.
          </p>
          <div className="hero-actions">
            <button className="btn btn-primary btn-large">Check My Medicines</button>
            <button className="btn btn-outline btn-large">Learn More</button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="features">
        <h2>What MediSafe Does</h2>
        <p className="section-subtext">
          Simple tools that help you avoid dangerous drug combinations.
        </p>

        <div className="feature-grid">
          <div className="feature-card">
            <div className="feature-icon">🔍</div>
            <h3>Search Any Medicine</h3>
            <p>Find medicines by brand or generic name, even with a small typo.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">⚠️</div>
            <h3>Detect Interactions</h3>
            <p>We check your medicine list against real drug-safety data.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>Clear Risk Levels</h3>
            <p>See if an interaction is mild, moderate, or severe — at a glance.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🔒</div>
            <h3>Private & Secure</h3>
            <p>Your medicine list and history stay visible only to you.</p>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="how-it-works">
        <h2>How It Works</h2>
        <div className="steps">
          <div className="step">
            <div className="step-number">1</div>
            <h3>Add your medicines</h3>
            <p>Search and add each medicine you currently take.</p>
          </div>
          <div className="step">
            <div className="step-number">2</div>
            <h3>We check for risks</h3>
            <p>Our system compares them against known interactions.</p>
          </div>
          <div className="step">
            <div className="step-number">3</div>
            <h3>Get simple guidance</h3>
            <p>See the risk level and what to do next.</p>
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="disclaimer">
        <p>
          ⚠️ MediSafe provides general information only and is not a substitute for
          professional medical advice. Always consult your doctor or pharmacist.
        </p>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>© {new Date().getFullYear()} MediSafe. Built for safer medicine use.</p>
      </footer>
    </div>
  )
}

export default App