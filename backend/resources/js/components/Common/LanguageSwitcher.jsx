import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher = () => {
    const { i18n } = useTranslation();

    const languages = [
        { code: 'es', label: 'ES', name: 'Español' },
        { code: 'fr', label: 'FR', name: 'Français' },
        { code: 'en', label: 'EN', name: 'English' },
        { code: 'ar', label: 'عربي', name: 'العربية' }
    ];

    return (
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }} translate="no">
            {languages.map((lang) => (
                <button
                    key={lang.code}
                    onClick={() => i18n.changeLanguage(lang.code)}
                    style={{
                        padding: '0.25rem 0.5rem',
                        borderRadius: '0.25rem',
                        border: '1px solid #e5e7eb',
                        background: i18n.language === lang.code ? '#2563eb' : 'white',
                        color: i18n.language === lang.code ? 'white' : '#374151',
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
