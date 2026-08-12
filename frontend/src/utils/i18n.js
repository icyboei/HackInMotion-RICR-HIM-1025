/**
 * i18n.js — Translation dictionary
 * Supports: English (en), Hindi (hi)
 * Architecture: add new language keys here, components call t('key')
 */

export const translations = {
  en: {
    // Nav
    "nav.home": "Home",
    "nav.checker": "Checker",
    "nav.dashboard": "Dashboard",
    "nav.ai": "Ask AI",
    "nav.prices": "Prices",
    "nav.login": "Log In",
    "nav.signup": "Sign Up",
    "nav.logout": "Log Out",

    // Hero
    "hero.headline": "Check Your Medicines\nBefore They Check You.",
    "hero.sub": "Add the medicines you take and instantly check for risky interactions — explained in plain language, not confusing medical jargon.",
    "hero.cta.primary": "Check Medicine Safety",
    "hero.cta.secondary": "Explore Medicine Prices",

    // Disclaimer
    "disclaimer.text": "MediSafe provides general information only and is not a substitute for professional medical advice. Always consult your doctor or pharmacist before making any decisions about your medications.",

    // Safety levels
    "severity.none": "No known interaction identified",
    "severity.mild": "Mild",
    "severity.moderate": "Moderate",
    "severity.severe": "Severe",
    "severity.critical": "Critical",
    "severity.unknown": "Insufficient data",

    // General
    "error.unavailable": "Service temporarily unavailable. Please try again.",
    "common.loading": "Loading...",
    "common.consultant": "Consult your doctor or pharmacist before making any changes to your medication.",
  },
  hi: {
    // Nav
    "nav.home": "होम",
    "nav.checker": "जांचें",
    "nav.dashboard": "डैशबोर्ड",
    "nav.ai": "AI से पूछें",
    "nav.prices": "कीमतें",
    "nav.login": "लॉग इन",
    "nav.signup": "साइन अप",
    "nav.logout": "लॉग आउट",

    // Hero
    "hero.headline": "अपनी दवाएं जांचें\nपहले।",
    "hero.sub": "अपनी दवाओं को जोड़ें और तुरंत खतरनाक इंटरैक्शन जांचें।",
    "hero.cta.primary": "दवा सुरक्षा जांचें",
    "hero.cta.secondary": "दवा कीमतें देखें",

    "disclaimer.text": "MediSafe केवल सामान्य जानकारी प्रदान करता है। कोई भी निर्णय लेने से पहले अपने डॉक्टर या फार्मासिस्ट से परामर्श करें।",

    "severity.none": "कोई ज्ञात इंटरैक्शन नहीं",
    "severity.mild": "हल्का",
    "severity.moderate": "मध्यम",
    "severity.severe": "गंभीर",
    "severity.critical": "अत्यंत गंभीर",
    "severity.unknown": "अपर्याप्त डेटा",

    "error.unavailable": "सेवा अस्थायी रूप से अनुपलब्ध है। कृपया पुनः प्रयास करें।",
    "common.loading": "लोड हो रहा है...",
    "common.consultant": "कोई भी बदलाव करने से पहले अपने डॉक्टर या फार्मासिस्ट से परामर्श करें।",
  },
};

let currentLang = localStorage.getItem("medsafe_lang") || "en";

export function setLanguage(lang) {
  if (translations[lang]) {
    currentLang = lang;
    localStorage.setItem("medsafe_lang", lang);
  }
}

export function getLanguage() {
  return currentLang;
}

export function t(key) {
  return translations[currentLang]?.[key] || translations.en?.[key] || key;
}
