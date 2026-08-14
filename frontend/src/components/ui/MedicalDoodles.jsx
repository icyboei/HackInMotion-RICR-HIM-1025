/**
 * MediSafe Hand-Drawn Medical Doodle System
 * Ultra-subtle, elegant vector line art elements for clinical background accents.
 */

export function StethoscopeDoodle({ className = "w-16 h-16 text-teal-800/15" }) {
  return (
    <svg className={className} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M 30 15 L 30 40 C 30 55, 70 55, 70 40 L 70 15" />
      <path d="M 50 48 L 50 70 C 50 82, 75 82, 75 70 L 75 65" />
      <circle cx="75" cy="62" r="5" fill="currentColor" fillOpacity="0.2" />
      <circle cx="30" cy="15" r="4" fill="currentColor" />
      <circle cx="70" cy="15" r="4" fill="currentColor" />
    </svg>
  );
}

export function CapsuleDoodle({ className = "w-14 h-14 text-teal-800/15" }) {
  return (
    <svg className={className} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <rect x="25" y="35" width="50" height="30" rx="15" transform="rotate(-30 50 50)" />
      <line x1="38" y1="36" x2="62" y2="64" />
    </svg>
  );
}

export function MedicineBottleDoodle({ className = "w-16 h-16 text-teal-800/15" }) {
  return (
    <svg className={className} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="35" y="15" width="30" height="12" rx="3" />
      <path d="M 30 27 L 70 27 L 75 35 L 75 80 C 75 84, 71 88, 67 88 L 33 88 C 29 88, 25 84, 25 80 L 25 35 Z" />
      <line x1="50" y1="48" x2="50" y2="68" />
      <line x1="40" y1="58" x2="60" y2="58" />
    </svg>
  );
}

export function EcgDoodle({ className = "w-20 h-10 text-teal-800/15" }) {
  return (
    <svg className={className} viewBox="0 0 120 60" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M 5 30 L 30 30 L 38 10 L 46 50 L 54 20 L 62 40 L 70 30 L 115 30" />
    </svg>
  );
}

export function HeartDoodle({ className = "w-14 h-14 text-teal-800/15" }) {
  return (
    <svg className={className} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M 50 85 C 10 60, 10 30, 32 20 C 45 15, 50 30, 50 30 C 50 30, 55 15, 68 20 C 90 30, 90 60, 50 85 Z" />
      <path d="M 30 35 L 42 35 L 46 27 L 50 43 L 54 35 L 65 35" strokeWidth="2" />
    </svg>
  );
}

export function DnaDoodle({ className = "w-16 h-16 text-teal-800/15" }) {
  return (
    <svg className={className} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M 30 15 Q 70 35 30 55 Q 70 75 30 90" />
      <path d="M 70 15 Q 30 35 70 55 Q 30 75 70 90" />
      <line x1="38" y1="24" x2="62" y2="24" />
      <line x1="48" y1="40" x2="52" y2="40" />
      <line x1="38" y1="56" x2="62" y2="56" />
      <line x1="48" y1="72" x2="52" y2="72" />
    </svg>
  );
}

export function SyringeDoodle({ className = "w-16 h-16 text-teal-800/15" }) {
  return (
    <svg className={className} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="20" y1="80" x2="10" y2="90" strokeWidth="3" />
      <rect x="25" y="35" width="20" height="40" rx="2" transform="rotate(-45 35 55)" />
      <line x1="55" y1="25" x2="75" y2="5" strokeWidth="3" />
      <line x1="65" y1="35" x2="80" y2="20" />
    </svg>
  );
}

export function MedicalCrossDoodle({ className = "w-12 h-12 text-teal-800/15" }) {
  return (
    <svg className={className} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M 40 15 L 60 15 L 60 40 L 85 40 L 85 60 L 60 60 L 60 85 L 40 85 L 40 60 L 15 60 L 15 40 L 40 40 Z" />
    </svg>
  );
}

/**
 * Reusable Decorative Background Component
 * Renders non-intrusive clinical medical doodle accents
 */
export function MedicalDoodleBackground({ density = "normal", className = "" }) {
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none z-0 select-none ${className}`}>
      {/* Top Left Accent */}
      <div className="absolute -top-4 left-6 opacity-40 hover:opacity-60 transition-opacity">
        <StethoscopeDoodle className="w-24 h-24 text-teal-700/10" />
      </div>

      {/* Top Right Accent */}
      <div className="absolute top-8 right-10 opacity-40 hover:opacity-60 transition-opacity">
        <CapsuleDoodle className="w-20 h-20 text-teal-700/10" />
      </div>

      {/* Middle Left Accent */}
      <div className="absolute top-1/2 -left-6 -translate-y-1/2 opacity-30">
        <EcgDoodle className="w-32 h-16 text-teal-600/10" />
      </div>

      {/* Middle Right Accent */}
      <div className="absolute top-1/2 right-4 -translate-y-1/2 opacity-35">
        <MedicineBottleDoodle className="w-20 h-20 text-teal-700/10" />
      </div>

      {density === "dense" && (
        <>
          <div className="absolute bottom-12 left-1/4 opacity-25">
            <DnaDoodle className="w-20 h-20 text-teal-800/10" />
          </div>
          <div className="absolute bottom-8 right-1/3 opacity-25">
            <HeartDoodle className="w-18 h-18 text-teal-800/10" />
          </div>
        </>
      )}

      {/* Bottom Right Accent */}
      <div className="absolute -bottom-6 right-16 opacity-35">
        <MedicalCrossDoodle className="w-24 h-24 text-teal-700/10" />
      </div>
    </div>
  );
}
