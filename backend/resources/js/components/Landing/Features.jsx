import React from 'react';
import { useTranslation } from 'react-i18next';

const Features = ({ colors }) => {
    const { t } = useTranslation();

    const features = [
        {
            icon: '🚀',
            title: t('landing.feature_fast_title'),
            description: t('landing.feature_fast_desc'),
            color: colors.primary,
            gradient: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)'
        },
        {
            icon: '💰',
            title: t('landing.feature_forfait_title'),
            description: t('landing.feature_forfait_desc'),
            color: colors.secondary,
            gradient: 'linear-gradient(135deg, #34d399 0%, #059669 100%)'
        },
        {
            icon: '📍',
            title: t('landing.feature_tracking_title'),
            description: t('landing.feature_tracking_desc'),
            color: colors.accent,
            gradient: 'linear-gradient(135deg, #fbbf24 0%, #b45309 100%)'
        }
    ];

    return (
        <section style={{ padding: '5rem 2rem', background: '#f9fafb' }}>
            <h3 style={{
                fontSize: '2.5rem',
                fontWeight: 'bold',
                textAlign: 'center',
                marginBottom: '1rem',
                color: '#1f2937',
                background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
            }}>
                {t('landing.why_title')}
            </h3>
            <p style={{ textAlign: 'center', color: '#6b7280', marginBottom: '3rem', fontSize: '1.125rem' }}>
                {t('landing.why_subtitle')}
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
                {features.map((feature, index) => (
                    <div
                        key={index}
                        className="mtx-card"
                        style={{
                            padding: '2.5rem',
                            textAlign: 'center',
                            transition: 'all 0.3s',
                            cursor: 'pointer',
                            border: '2px solid transparent',
                            position: 'relative',
                            overflow: 'hidden'
                        }}
                    >
                        <div style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            height: '5px',
                            background: feature.gradient
                        }}></div>

                        <div style={{
                            fontSize: '4rem',
                            marginBottom: '1.5rem',
                            filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))'
                        }}>
                            {feature.icon}
                        </div>
                        <h4 style={{
                            fontSize: '1.5rem',
                            fontWeight: 'bold',
                            marginBottom: '1rem',
                            color: feature.color
                        }}>
                            {feature.title}
                        </h4>
                        <p style={{ color: '#6b7280', fontSize: '1.05rem', lineHeight: 1.6 }}>
                            {feature.description}
                        </p>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Features;
