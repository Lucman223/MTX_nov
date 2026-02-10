import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const HowItWorks = ({ colors }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();

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
            hoverColor: '#047857',
            steps: [
                t('landing.role_driver_step1'),
                t('landing.role_driver_step2'),
                t('landing.role_driver_step3')
            ],
            action: () => navigate('/register?rol=motorista')
        }
    ];

    return (
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
                        className="mtx-card"
                        style={{
                            overflow: 'hidden',
                            padding: 0,
                            border: '1px solid #e5e7eb'
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
                                className="mtx-button"
                                style={{
                                    width: '100%',
                                    padding: '1rem',
                                    background: role.color,
                                    boxShadow: `0 4px 12px ${role.color}40`
                                }}
                            >
                                {t('landing.register_as', { role: role.title })}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default HowItWorks;
