import React from 'react';
import { useTranslation } from 'react-i18next';
import SEO from '../../components/Common/SEO';
import { useNavigate } from 'react-router-dom';

/**
 * PrivacyPolicy Component
 *
 * [ES] Página informativa sobre el tratamiento de datos personales y privacidad.
 * [FR] Page informative sur le traitement des données personnelles et la confidentialité.
 */
const PrivacyPolicy = () => {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();

    return (
        <div className="main-content-centered" style={{ maxWidth: '900px', padding: '4rem 2rem' }}>
            <SEO
                title={t('seo.privacy_title')}
                description={t('seo.privacy_desc')}
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
                    {t('privacy.title')}
                </h1>

                <p style={{ marginBottom: '2rem', color: '#6b7280' }}>
                    <strong>{t('privacy.last_updated')}:</strong> {new Date().toLocaleDateString(i18n.language === 'es' ? 'es-ES' : i18n.language === 'en' ? 'en-US' : 'fr-FR')}
                </p>

                <section style={{ marginBottom: '2.5rem' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', color: '#1f2937' }}>{t('privacy.section1_title')}</h2>
                    <p style={{ color: '#4b5563', lineHeight: '1.8' }}>
                        {t('privacy.section1_content')}
                    </p>
                </section>

                <section style={{ marginBottom: '2.5rem' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', color: '#1f2937' }}>{t('privacy.section2_title')}</h2>
                    <p style={{ color: '#4b5563', lineHeight: '1.8' }}>
                        {t('privacy.section2_content')}
                    </p>
                    <ul style={{ color: '#4b5563', lineHeight: '1.8', marginLeft: '1.5rem' }}>
                        <li>{t('privacy.section2_item1')}</li>
                        <li>{t('privacy.section2_item2')}</li>
                        <li>{t('privacy.section2_item3')}</li>
                        <li>{t('privacy.section2_item4')}</li>
                    </ul>
                </section>

                <section style={{ marginBottom: '2.5rem' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', color: '#1f2937' }}>{t('privacy.section3_title')}</h2>
                    <p style={{ color: '#4b5563', lineHeight: '1.8' }}>{t('privacy.section3_content')}</p>
                    <ul style={{ color: '#4b5563', lineHeight: '1.8', marginLeft: '1.5rem' }}>
                        <li>{t('privacy.section3_item1')}</li>
                        <li>{t('privacy.section3_item2')}</li>
                        <li>{t('privacy.section3_item3')}</li>
                        <li>{t('privacy.section3_item4')}</li>
                    </ul>
                </section>

                <section style={{ marginBottom: '2.5rem' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', color: '#1f2937' }}>{t('privacy.section4_title')}</h2>
                    <p style={{ color: '#4b5563', lineHeight: '1.8' }}>
                        {t('privacy.section4_content1')}
                    </p>
                    <p style={{ marginTop: '1rem', color: '#4b5563', lineHeight: '1.8' }}>
                        {t('privacy.section4_content2')}
                        <a href="mailto:privacy@mototx.ml" style={{ color: '#2563eb', fontWeight: '600', textDecoration: 'none' }}> privacy@mototx.ml</a>.
                    </p>
                </section>

                <section>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', color: '#1f2937' }}>{t('privacy.section5_title')}</h2>
                    <p style={{ color: '#4b5563', lineHeight: '1.8' }}>
                        {t('privacy.section5_content')}
                    </p>
                </section>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
