import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import es from './locales/es.json';
import fr from './locales/fr.json';
import en from './locales/en.json';
import ar from './locales/ar.json';

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources: {
            es: { translation: es },
            fr: { translation: fr },
            en: { translation: en },
            ar: { translation: ar }
        },
        fallbackLng: "es", // Default fallback
        interpolation: {
            escapeValue: false // React already escapes
        }
    });

// Handle RTL direction change
i18n.on('languageChanged', (lng) => {
    const isRtl = lng === 'ar';
    document.dir = isRtl ? 'rtl' : 'ltr';
    document.documentElement.lang = lng;
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
});

export default i18n;
