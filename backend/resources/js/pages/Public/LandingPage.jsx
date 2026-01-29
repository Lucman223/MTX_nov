import React from 'react';
import { useNavigate } from 'react-router-dom';
import SEO from '../../components/Common/SEO';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../../components/Common/LanguageSwitcher';

/**
 * LandingPage Component
 *
 * [ES] Página de inicio pública de la plataforma MotoTX.
 *      Presenta la propuesta de valor, características principales y opciones de registro para clientes y motoristas.
 *
 * [FR] Page d'accueil publique de la plateforme MotoTX.
 *      Présente la proposition de valeur, les principales caractéristiques et les options d'inscription pour les clients et les chauffeurs.
 */
const LandingPage = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();

    // Sistema de colores cohesivo (Accessible WCAG AA)
    const colors = {
        primary: '#2563eb',    // Blue-600 (4.6:1 vs White)
        secondary: '#059669',  // Emerald-600 (4.5:1 vs White) - Was #10b981
        accent: '#b45309',     // Amber-700 (4.5:1 vs White) - Was #f59e0b
    };

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

    const roles = [
        {
            title: t('landing.role_client_title'),
            subtitle: t('landing.role_client_subtitle'),
            icon: '👤',
            color: colors.primary,
            hoverColor: '#1d4ed8',
            steps: [
                t('landing.role_client_step1'),
                t('landing.role_client_step2'),
                t('landing.role_client_step3')
            ],
            action: () => navigate('/register?rol=cliente')
        },
        {
            title: t('landing.role_driver_title'),
            subtitle: t('landing.role_driver_subtitle'),
            icon: '🏍️',
            color: colors.secondary,
            hoverColor: '#047857', // Emerald-700
            steps: [
                t('landing.role_driver_step1'),
                t('landing.role_driver_step2'),
                t('landing.role_driver_step3')
            ],
            action: () => navigate('/register?rol=motorista')
        }
    ];

    return (
        <div style={{ minHeight: '100vh', background: '#ffffff' }}>
            <SEO
                title={t('seo.landing_title')}
                description={t('seo.landing_desc')}
            />
            {/* Header */}
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
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                    <img src="/logo_clean.png" alt="MotoTX Logo" style={{ height: '2.75rem', objectFit: 'contain' }} />
                    <span style={{ fontSize: '1.5rem', fontWeight: '900', color: colors.primary, letterSpacing: '-0.5px' }}>MotoTX</span>
                </div>

                {/* Desktop Navigation */}
                <nav className="desktop-only" style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                    <a href="#mission" style={{ textDecoration: 'none', color: '#4b5563', fontWeight: '500', transition: 'color 0.2s' }} onMouseOver={(e) => e.target.style.color = colors.primary} onMouseOut={(e) => e.target.style.color = '#4b5563'}>{t('landing.mission_title')}</a>
                    <a href="#how-it-works" style={{ textDecoration: 'none', color: '#4b5563', fontWeight: '500', transition: 'color 0.2s' }} onMouseOver={(e) => e.target.style.color = colors.primary} onMouseOut={(e) => e.target.style.color = '#4b5563'}>{t('landing.how_title')}</a>
                    <a href="#faq" style={{ textDecoration: 'none', color: '#4b5563', fontWeight: '500', transition: 'color 0.2s' }} onMouseOver={(e) => e.target.style.color = colors.primary} onMouseOut={(e) => e.target.style.color = '#4b5563'}>FAQ</a>
                    <a href="#contact" style={{ textDecoration: 'none', color: '#4b5563', fontWeight: '500', transition: 'color 0.2s' }} onMouseOver={(e) => e.target.style.color = colors.primary} onMouseOut={(e) => e.target.style.color = '#4b5563'}>{t('landing.contact_title')}</a>

                    <div style={{ width: '1px', height: '24px', background: '#e5e7eb', margin: '0 0.5rem' }}></div>

                    <LanguageSwitcher />

                    <button
                        onClick={() => navigate('/login')}
                        style={{
                            padding: '0.6rem 1.75rem',
                            background: colors.primary,
                            color: 'white',
                            border: 'none',
                            borderRadius: '2rem',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            transition: 'all 0.3s',
                            boxShadow: `0 4px 12px ${colors.primary}40`
                        }}
                    >
                        {t('common.login')}
                    </button>
                </nav>
            </header>

            {/* Hero Section */}
            <section style={{
                padding: '5rem 2rem',
                textAlign: 'center',
                background: `linear-gradient(135deg, ${colors.primary} 0%, #7c3aed 50%, ${colors.accent} 100%)`,
                color: 'white',
                position: 'relative',
                overflow: 'hidden'
            }}>
                <div style={{ position: 'relative', zIndex: 1 }}>
                    <h1 style={{
                        fontSize: '3.5rem',
                        fontWeight: '900',
                        marginBottom: '1.5rem',
                        textShadow: '0 2px 15px rgba(0,0,0,0.4)',
                        lineHeight: 1.1,
                        letterSpacing: '-1px'
                    }}>
                        {t('landing.hero_title')}
                    </h1>
                    <p style={{
                        fontSize: '1.25rem',
                        marginBottom: '2.5rem',
                        opacity: 0.95,
                        maxWidth: '700px',
                        margin: '0 auto 2.5rem',
                        textShadow: '0 1px 3px rgba(0,0,0,0.2)'
                    }}>
                        {t('landing.hero_subtitle')}
                    </p>
                    <button
                        onClick={() => navigate('/register')}
                        style={{
                            padding: '1.25rem 3.5rem',
                            fontSize: '1.25rem',
                            background: 'white',
                            color: colors.primary,
                            border: 'none',
                            borderRadius: '0.75rem',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
                            transition: 'all 0.3s'
                        }}
                        onMouseOver={(e) => {
                            e.target.style.transform = 'translateY(-5px) scale(1.05)';
                            e.target.style.boxShadow = '0 15px 35px rgba(0,0,0,0.4)';
                        }}
                        onMouseOut={(e) => {
                            e.target.style.transform = 'translateY(0) scale(1)';
                            e.target.style.boxShadow = '0 10px 25px rgba(0,0,0,0.3)';
                        }}
                    >
                        {t('landing.get_started')}
                    </button>
                </div>
            </section>

            {/* Mission Section (NEW) */}
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
                            <div style={{ padding: '1.5rem', background: '#f3f4f6', borderRadius: '1rem', flex: 1 }}>
                                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: colors.primary, marginBottom: '0.5rem' }}>100%</div>
                                <div style={{ fontSize: '0.9rem', color: '#6b7280' }}>Sûreté garantie</div>
                            </div>
                            <div style={{ padding: '1.5rem', background: '#f3f4f6', borderRadius: '1rem', flex: 1 }}>
                                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: colors.secondary, marginBottom: '0.5rem' }}>24/7</div>
                                <div style={{ fontSize: '0.9rem', color: '#6b7280' }}>Disponibilité locale</div>
                            </div>
                        </div>
                    </div>
                    <div style={{ position: 'relative' }}>
                        <div style={{ width: '100%', height: '400px', background: '#eff6ff', borderRadius: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10rem', transform: 'rotate(-3deg)' }}>
                            🏍️
                        </div>
                        <div style={{ position: 'absolute', bottom: '-20px', left: '-20px', padding: '2rem', background: 'white', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', borderRadius: '1.5rem', fontWeight: 'bold', color: colors.secondary }}>
                            Premium Service
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section - MÁS LLAMATIVAS */}
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
                            style={{
                                padding: '2.5rem',
                                background: 'white',
                                borderRadius: '1.5rem',
                                textAlign: 'center',
                                transition: 'all 0.3s',
                                cursor: 'pointer',
                                border: '2px solid transparent',
                                boxShadow: '0 4px 6px rgba(0,0,0,0.07)',
                                position: 'relative',
                                overflow: 'hidden'
                            }}
                            onMouseOver={(e) => {
                                e.currentTarget.style.transform = 'translateY(-15px) scale(1.03)';
                                e.currentTarget.style.boxShadow = `0 20px 40px ${feature.color}40`;
                                e.currentTarget.style.borderColor = feature.color;
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                                e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.07)';
                                e.currentTarget.style.borderColor = 'transparent';
                            }}
                        >
                            {/* Gradiente de fondo sutil */}
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

            {/* How It Works - Roles Section */}
            <section id="how-it-works" style={{ padding: '5rem 2rem', background: 'white' }}>
                <h3 style={{ fontSize: '2.5rem', fontWeight: 'bold', textAlign: 'center', marginBottom: '1rem', color: '#1f2937' }}>
                    {t('landing.join_title')}
                </h3>
                <p style={{ textAlign: 'center', color: '#6b7280', marginBottom: '3rem', fontSize: '1.125rem' }}>
                    {t('landing.join_subtitle')}
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2.5rem', maxWidth: '900px', margin: '0 auto' }}>
                    {roles.map((role, index) => (
                        <div
                            key={index}
                            style={{
                                background: 'white',
                                borderRadius: '1.5rem',
                                overflow: 'hidden',
                                boxShadow: '0 10px 25px rgba(0,0,0,0.08)',
                                transition: 'all 0.3s',
                                border: '1px solid #e5e7eb'
                            }}
                            onMouseOver={(e) => {
                                e.currentTarget.style.transform = 'translateY(-10px)';
                                e.currentTarget.style.boxShadow = `0 20px 40px ${role.color}30`;
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.08)';
                            }}
                        >
                            <div style={{ padding: '2.5rem', background: role.color, color: 'white', textAlign: 'center' }}>
                                <div style={{ fontSize: '3.5rem', marginBottom: '0.75rem' }}>{role.icon}</div>
                                <h4 style={{ fontSize: '1.75rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>{role.title}</h4>
                                <p style={{ opacity: 0.95, fontSize: '1.05rem' }}>{role.subtitle}</p>
                            </div>
                            <div style={{ padding: '2rem' }}>
                                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 2rem 0' }}>
                                    {role.steps.map((step, i) => (
                                        <li key={i} style={{
                                            padding: '0.75rem 0',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.75rem',
                                            color: '#4b5563',
                                            fontSize: '1.05rem'
                                        }}>
                                            <span style={{
                                                color: role.color,
                                                fontWeight: 'bold',
                                                fontSize: '1.25rem'
                                            }}>✓</span>
                                            {step}
                                        </li>
                                    ))}
                                </ul>
                                <button
                                    onClick={role.action}
                                    style={{
                                        width: '100%',
                                        padding: '1rem',
                                        background: role.color,
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '0.75rem',
                                        fontWeight: 'bold',
                                        fontSize: '1.05rem',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s',
                                        boxShadow: `0 4px 12px ${role.color}40`
                                    }}
                                    onMouseOver={(e) => {
                                        e.target.style.background = role.hoverColor;
                                        e.target.style.transform = 'translateY(-2px)';
                                        e.target.style.boxShadow = `0 6px 16px ${role.color}50`;
                                    }}
                                    onMouseOut={(e) => {
                                        e.target.style.background = role.color;
                                        e.target.style.transform = 'translateY(0)';
                                        e.target.style.boxShadow = `0 4px 12px ${role.color}40`;
                                    }}
                                >
                                    {t('landing.register_as', { role: role.title })}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* FAQ Section (NEW) */}
            <section id="faq" style={{ padding: '6rem 2rem', background: '#f9fafb' }}>
                <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                    <h3 style={{ fontSize: '2.5rem', fontWeight: '800', textAlign: 'center', marginBottom: '3rem', color: '#1f2937' }}>
                        {t('landing.faq_title')}
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {[1, 2].map(i => (
                            <div key={i} style={{ background: 'white', padding: '1.5rem', borderRadius: '1rem', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
                                <h4 style={{ fontSize: '1.2rem', fontWeight: 'bold', color: colors.primary, marginBottom: '0.75rem' }}>
                                    {t(`landing.faq_q${i}`)}
                                </h4>
                                <p style={{ color: '#4b5563', lineHeight: 1.6 }}>
                                    {t(`landing.faq_a${i}`)}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Contact Section (NEW) */}
            <section id="contact" style={{ padding: '6rem 2rem', background: 'white' }}>
                <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
                    <h3 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '1rem', color: '#1f2937' }}>
                        {t('landing.contact_title')}
                    </h3>
                    <p style={{ color: '#6b7280', marginBottom: '3rem' }}>Où que vous soyez, nous sommes là pour vous aider.</p>

                    <form style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }} onSubmit={(e) => e.preventDefault()}>
                        <input type="text" placeholder={t('landing.contact_name')} style={{ padding: '1rem', borderRadius: '0.75rem', border: '1px solid #e5e7eb', outline: 'none' }} />
                        <input type="email" placeholder="Email" style={{ padding: '1rem', borderRadius: '0.75rem', border: '1px solid #e5e7eb', outline: 'none' }} />
                        <textarea placeholder={t('landing.contact_message')} rows="4" style={{ padding: '1rem', borderRadius: '0.75rem', border: '1px solid #e5e7eb', outline: 'none', resize: 'none' }}></textarea>
                        <button style={{ padding: '1rem', background: colors.primary, color: 'white', border: 'none', borderRadius: '0.75rem', fontWeight: 'bold', cursor: 'pointer', boxShadow: `0 4px 12px ${colors.primary}40` }}>
                            {t('landing.contact_send')}
                        </button>
                    </form>
                </div>
            </section>

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
                            <a href="/privacy" style={{ color: 'white', opacity: 0.7, fontSize: '0.8rem', textDecoration: 'none', transition: 'opacity 0.2s' }} onMouseOver={e => e.target.style.opacity = 1} onMouseOut={e => e.target.style.opacity = 0.7}>{t('landing.privacy_policy')}</a>
                            <a href="/terms" style={{ color: 'white', opacity: 0.7, fontSize: '0.8rem', textDecoration: 'none', transition: 'opacity 0.2s' }} onMouseOver={e => e.target.style.opacity = 1} onMouseOut={e => e.target.style.opacity = 0.7}>{t('landing.terms_conditions')}</a>
                            <a href="/cgu" style={{ color: 'white', opacity: 0.7, fontSize: '0.8rem', textDecoration: 'none', transition: 'opacity 0.2s' }} onMouseOver={e => e.target.style.opacity = 1} onMouseOut={e => e.target.style.opacity = 0.7}>CGU</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
