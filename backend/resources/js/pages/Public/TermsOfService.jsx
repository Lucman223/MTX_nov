import React from 'react';
import { useTranslation } from 'react-i18next';
import SEO from '../../components/Common/SEO';
import { useNavigate } from 'react-router-dom';

/**
 * TermsOfService Component
 *
 * [ES] Términos y Condiciones de Uso (CGU) de la plataforma.
 * [FR] Conditions Générales d'Utilisation (CGU) de la plateforme MotoTX.
 */
const TermsOfService = () => {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();

    return (
        <div className="main-content-centered" style={{ maxWidth: '900px', padding: '4rem 2rem' }}>
            <SEO
                title={t('seo.terms_title')}
                description={t('seo.terms_desc')}
            />

            <button
                onClick={() => navigate(-1)}
                className="mtx-button"
                style={{ marginBottom: '2rem', background: '#f3f4f6', color: '#4b5563' }}
            >
                ← {t('common.back')}
            </button>

            <div className="mtx-card" style={{ padding: '3rem' }}>
                <h1 style={{ color: '#2563eb', marginBottom: '1.5rem', fontSize: '2.5rem', fontWeight: 'bold' }}>
                    {t('terms.title')}
                </h1>

                <p style={{ marginBottom: '2rem', color: '#6b7280' }}>
                    <strong>{t('terms.last_updated')}:</strong> {new Date().toLocaleDateString(i18n.language === 'es' ? 'es-ES' : i18n.language === 'en' ? 'en-US' : 'fr-FR')}
                </p>

                <section style={{ marginBottom: '2.5rem' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', color: '#1f2937' }}>{t('terms.section1_title')}</h2>
                    <p style={{ color: '#4b5563', lineHeight: '1.8' }}>
                        {t('terms.section1_content')}
                    </p>
                </section>

                <section style={{ marginBottom: '2.5rem' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', color: '#1f2937' }}>{t('terms.section2_title')}</h2>
                    <p style={{ color: '#4b5563', lineHeight: '1.8' }}>
                        {t('terms.section2_content')}
                    </p>
                </section>

                <section style={{ marginBottom: '2.5rem' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', color: '#1f2937' }}>{t('terms.section3_title')}</h2>
                    <p style={{ color: '#4b5563', lineHeight: '1.8' }}>
                        {t('terms.section3_content')}
                    </p>
                    <ul style={{ color: '#4b5563', lineHeight: '1.8', marginLeft: '1.5rem' }}>
                        <li>{t('terms.section3_item1')}</li>
                        <li>{t('terms.section3_item2')}</li>
                        <li>{t('terms.section3_item3')}</li>
                        <li>{t('terms.section3_item4')}</li>
                    </ul>
                </section>

                <section style={{ marginBottom: '2.5rem' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', color: '#1f2937' }}>{t('terms.section4_title')}</h2>
                    <p style={{ color: '#4b5563', lineHeight: '1.8' }}>
                        {t('terms.section4_content')}
                    </p>
                </section>

                <section style={{ marginBottom: '2.5rem' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', color: '#1f2937' }}>{t('terms.section5_title')}</h2>
                    <p style={{ color: '#4b5563', lineHeight: '1.8' }}>
                        {t('terms.section5_content')}
                    </p>
                </section>

                <section>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', color: '#1f2937' }}>{t('terms.section6_title')}</h2>
                    <p style={{ color: '#4b5563', lineHeight: '1.8' }}>
                        {t('terms.section6_content')}
                    </p>
                </section>
            </div>
        </div>
    );
};

export default TermsOfService;
