/**
 * Footer.jsx
 * Responsibility: Site-wide footer with copyright.
 * Connected to: Home.jsx renders this at the very bottom.
 * Note: `new Date().getFullYear()` automatically shows the current year — no manual update needed.
 */
function Footer() {
  return (
    <footer className="py-6 px-6 text-center text-slate-400 text-sm mt-auto">
      <p>© {new Date().getFullYear()} MediSafe. Built for safer medicine use.</p>
    </footer>
  )
}

export default Footer
