import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import Features from '../components/Features'
import HowItWorks from '../components/HowItWorks'
import Disclaimer from '../components/Disclaimer'
import Footer from '../components/Footer'

/**
 * Home.jsx — The Landing Page
 * Responsibility: Assembles all sections of the MediSafe homepage.
 * This "page" is purely a composition — it imports components and lays them out.
 * It holds no logic of its own.
 *
 * Connected to: App.jsx renders <Home /> when the route is "/".
 * As we build new pages (Checker, Dashboard, Login), they will get their own
 * files here in pages/ and be added to the router in App.jsx.
 */
function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Features />
        <HowItWorks />
        <Disclaimer />
      </main>
      <Footer />
    </div>
  )
}

export default Home
