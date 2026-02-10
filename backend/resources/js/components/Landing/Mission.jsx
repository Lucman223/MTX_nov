import React from 'react';
import { useTranslation } from 'react-i18next';

const Mission = ({ colors }) => {
    const { t } = useTranslation();

    return (
        <section id="mission" style={{ padding: '6rem 2rem', background: '#ffffff' }}>
            <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem', alignItems: 'center' }}>
                <div>
                    <h3 style={{ fontSize: '2.5rem', fontWeight: '800', color: colors.primary, marginBottom: '1.5rem' }}>
                        {t('landing.mission_title')}
                    </h3>
                    <p style={{ fontSize: '1.2rem', lineHeight: 1.8, color: '#4b5563', marginBottom: '2rem' }}>
                        {t('landing.mission_text')}
                    </p>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <div style={{ padding: '1.5rem', background: '#f3f4f6', borderRadius: '1rem', flex: 1, textAlign: 'center' }}>
                            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: colors.primary, marginBottom: '0.5rem' }}>100%</div>
                            <div style={{ fontSize: '0.9rem', color: '#6b7280' }}>{t('landing.safety_guaranteed')}</div>
                        </div>
                        <div style={{ padding: '1.5rem', background: '#f3f4f6', borderRadius: '1rem', flex: 1, textAlign: 'center' }}>
                            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: colors.secondary, marginBottom: '0.5rem' }}>24/7</div>
                            <div style={{ fontSize: '0.9rem', color: '#6b7280' }}>{t('landing.local_availability')}</div>
                        </div>
                    </div>
                </div>
                <div style={{ position: 'relative' }}>
                    <div style={{
                        width: '100%',
                        height: '400px',
                        background: '#eff6ff',
                        borderRadius: '2rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '10rem',
                        transform: 'rotate(-3deg)',
                        boxShadow: 'inset 0 0 40px rgba(37, 99, 235, 0.1)'
                    }}>
                        🏍️
                    </div>
                    <div style={{
                        position: 'absolute',
                        bottom: '-20px',
                        left: '-20px',
                        padding: '1.5rem 2rem',
                        background: 'white',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                        borderRadius: '1.5rem',
                        fontWeight: 'bold',
                        color: colors.secondary,
                        border: '1px solid #f3f4f6'
                    }}>
                        ✨ {t('landing.premium_service')}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Mission;
