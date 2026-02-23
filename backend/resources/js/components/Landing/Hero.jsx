import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const Hero = ({ colors }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    return (
        <section style={{
            padding: '5rem 2rem',
            textAlign: 'center',
            background: `linear-gradient(135deg, ${colors.primary} 0%, #7c3aed 50%, ${colors.accent} 100%)`,
            color: 'white',
            position: 'relative',
            overflow: 'hidden'
        }}>
            <div style={{ position: 'relative', zIndex: 1 }}>
                <h2 style={{
                    fontSize: '3.5rem',
                    fontWeight: '900',
                    marginBottom: '1.5rem',
                    textShadow: '0 2px 15px rgba(0,0,0,0.4)',
                    lineHeight: 1.1,
                    letterSpacing: '-1px'
                }}>
                    {t('landing.hero_title')}
                </h2>
                <p style={{
                    fontSize: '1.25rem',
                    marginBottom: '2.5rem',
                    opacity: 0.95,
                    maxWidth: '800px',
                    margin: '0 auto 2.5rem',
                    textShadow: '0 1px 3px rgba(0,0,0,0.2)'
                }}>
                    {t('landing.hero_subtitle')}
                </p>
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                    <button
                        onClick={() => navigate('/register?role=client')}
                        className="btn btn--lg btn--hero-client"
                    >
                        {t('landing.role_client_title')} - {t('landing.get_started')}
                    </button>
                    <button
                        onClick={() => navigate('/register?role=driver')}
                        className="btn btn--lg btn--secondary"
                    >
                        {t('landing.role_driver_title')} - {t('landing.join_title')}
                    </button>
                </div>
            </div>
        </section>
    );
};

export default Hero;
