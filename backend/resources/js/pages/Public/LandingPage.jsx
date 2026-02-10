import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import SEO from '../../components/Common/SEO';
import LanguageSwitcher from '../../components/Common/LanguageSwitcher';

// Landing Components
import Hero from '../../components/Landing/Hero';
import VitrinaForfaits from '../../components/Landing/VitrinaForfaits';
import Mission from '../../components/Landing/Mission';
import Features from '../../components/Landing/Features';
import HowItWorks from '../../components/Landing/HowItWorks';
import FAQ from '../../components/Landing/FAQ';
import ContactForm from '../../components/Landing/ContactForm';

/**
 * LandingPage Component
 * Refactored to modular components for better maintainability and SPA-like behavior.
 */
const LandingPage = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();

    // System colors (Consolidated)
    const colors = {
        primary: '#2563eb',
        secondary: '#059669',
        accent: '#b45309',
    };

    return (
        <div style={{ minHeight: '100vh', background: '#ffffff' }}>
            <SEO
                title={t('seo.landing_title')}
                description={t('seo.landing_desc')}
            />

            {/* Header / Nav */}
            <header style={{
                padding: '1.25rem 2rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 1px 10px rgba(0,0,0,0.05)',
                position: 'sticky',
                top: 0,
                zIndex: 100
            }}>
                <div
                    style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                >
                    <img src="/logo_clean.png" alt="MotoTX Logo" style={{ height: '2.75rem', objectFit: 'contain' }} />
                    <span style={{ fontSize: '1.5rem', fontWeight: '900', color: colors.primary, letterSpacing: '-0.5px' }}>MotoTX</span>
                </div>

                <nav className="desktop-only" style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                    <a href="#mission" className="mtx-nav-link">{t('landing.mission_title')}</a>
                    <a href="#how-it-works" className="mtx-nav-link">{t('landing.how_title')}</a>
                    <a href="#vitrina" className="mtx-nav-link">{t('nav.forfaits')}</a>
                    <a href="#faq" className="mtx-nav-link">{t('landing.faq_title_short')}</a>
                    <a href="#contact" className="mtx-nav-link">{t('landing.contact_title')}</a>

                    <div style={{ width: '1px', height: '24px', background: '#e5e7eb', margin: '0 0.5rem' }}></div>

                    <LanguageSwitcher />

                    <button
                        onClick={() => navigate('/login')}
                        className="mtx-button"
                        style={{ padding: '0.6rem 1.75rem', fontSize: '0.95rem' }}
                    >
                        {t('common.login')}
                    </button>
                </nav>
            </header>

            <main>
                <Hero colors={colors} />
                <Mission colors={colors} />
                <Features colors={colors} />
                <VitrinaForfaits colors={colors} />
                <HowItWorks colors={colors} />
                <FAQ colors={colors} />
                <ContactForm colors={colors} />
            </main>

            {/* Footer */}
            <footer style={{ padding: '3rem 2rem', background: '#1f2937', color: 'white', textAlign: 'center' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <div style={{ marginBottom: '2rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                            <img src="/logo_clean.png" alt="MotoTX" style={{ height: '3rem', objectFit: 'contain', background: 'white', borderRadius: '50%', padding: '0.25rem' }} />
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white', margin: 0 }}>MotoTX</h2>
                        </div>
                        <p style={{ opacity: 0.8, maxWidth: '600px', margin: '0 auto' }}>
                            {t('landing.footer_desc')}
                        </p>
                    </div>
                    <div style={{
                        borderTop: '1px solid rgba(255,255,255,0.1)',
                        paddingTop: '2rem',
                        opacity: 0.7,
                        fontSize: '0.9rem'
                    }}>
                        <p style={{ margin: '0 0 0.5rem 0' }}>
                            {t('landing.footer_copyright')}
                        </p>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
                            <a href="/privacy" className="mtx-footer-link">{t('landing.privacy_policy')}</a>
                            <a href="/terms" className="mtx-footer-link">{t('landing.terms_conditions')}</a>
                            <a href="/cgu" className="mtx-footer-link">{t('landing.cgu')}</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
