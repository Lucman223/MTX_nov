import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import es from './locales/es.json';
import fr from './locales/fr.json';
import en from './locales/en.json';

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources: {
            es: { translation: es },
            fr: { translation: fr },
            en: { translation: en }
        },
        fallbackLng: "es",
        load: 'languageOnly', // Ignora variantes regionales como es-ES
        detection: {
            order: ['localStorage', 'navigator'],
            caches: ['localStorage'], // Persistencia automática
        },
        interpolation: {
            escapeValue: false
        }
    });

// Handle metadata update on language change
i18n.on('languageChanged', (lng) => {
    document.dir = 'ltr';
    document.documentElement.lang = lng;
    document.documentElement.dir = 'ltr';
});

export default i18n;
