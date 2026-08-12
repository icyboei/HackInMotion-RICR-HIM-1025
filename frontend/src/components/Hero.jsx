/**
 * Hero.jsx
 * Responsibility: The top "above the fold" section of the landing page.
 * Contains: Badge tag, headline, subtext, two CTA buttons.
 * Connected to: Home.jsx renders this directly below the Navbar.
 */
function Hero() {
  return (
    <section
      id="home"
      className="bg-gradient-to-b from-teal-50 to-white py-20 px-6 text-center"
    >
      <div className="max-w-2xl mx-auto">
        {/* Badge */}
        <span className="inline-block bg-teal-100 text-teal-700 text-xs font-semibold px-4 py-1.5 rounded-full mb-5">
          Your digital health companion
        </span>

        {/* Headline */}
        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight mb-5">
          Know before you mix.<br />
          Stay safe with every dose.
        </h1>

        {/* Subtext */}
        <p className="text-lg text-slate-500 mb-8 leading-relaxed">
          Add the medicines you take and instantly check for risky interactions —
          explained in plain language, not confusing medical jargon.
        </p>

        {/* CTA buttons */}
        <div className="flex gap-4 justify-center flex-wrap">
          <button className="px-7 py-3.5 text-base font-semibold bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors cursor-pointer">
            Check My Medicines
          </button>
          <button className="px-7 py-3.5 text-base font-semibold text-teal-600 border-2 border-teal-600 rounded-lg hover:bg-teal-50 transition-colors cursor-pointer">
            Learn More
          </button>
        </div>
      </div>
    </section>
  )
}

export default Hero
