import React from 'react';
import { useTranslation } from 'react-i18next';

/**
 * LanguageSwitcher Component
 *
 * [ES] Selector global de idioma que utiliza i18next para cambiar la localización de la app.
 *      Sincroniza el estado visual con el idioma actualmente cargado.
 *
 * [FR] Sélecteur de langue global utilisant i18next pour changer la localisation de l'application.
 *      Synchronise l'état visuel avec la langue actuellement chargée.
 */
const LanguageSwitcher = () => {
    const { i18n } = useTranslation();

    const languages = [
        { code: 'es', label: 'ES', name: 'Español' },
        { code: 'fr', label: 'FR', name: 'Français' },
        { code: 'en', label: 'EN', name: 'English' }
    ];

    return (
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }} translate="no">
            {languages.map((lang) => (
                <button
                    key={lang.code}
                    onClick={() => {
                        i18n.changeLanguage(lang.code);
                    }}
                    style={{
                        padding: '0.25rem 0.5rem',
                        borderRadius: '0.25rem',
                        border: '1px solid #e5e7eb',
                        background: i18n.language.startsWith(lang.code) ? '#2563eb' : 'white',
                        color: i18n.language.startsWith(lang.code) ? 'white' : '#374151',
                        fontSize: '0.75rem',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                    }}
                    title={lang.name}
                    translate="no"
                >
                    {lang.label}
                </button>
            ))}
        </div>
    );
};

export default LanguageSwitcher;
