import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../../components/Common/LanguageSwitcher';
import { useAuth } from '../../context/AuthContext';
import SEO from '../../components/Common/SEO';

/**
 * LoginPage Component
 *
 * [ES] Página de inicio de sesión de la plataforma.
 *      Maneja la autenticación de usuarios y redirige según el rol (Admin, Cliente, Motorista).
 *
 * [FR] Page de connexion de la plateforme.
 *      Gère l'authentification des utilisateurs et redirige selon le rôle (Admin, Client, Chauffeur).
 */
function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login, isAuthenticated, user, loading } = useAuth();
    const navigate = useNavigate();
    const { t } = useTranslation();

    // Color system (Accessible)
    const colors = {
        primary: '#2563eb',
        secondary: '#059669',
        accent: '#b45309',
        error: '#ef4444'
    };

    useEffect(() => {
        if (!loading && isAuthenticated && user) {
            if (user.rol === 'admin') {
                navigate('/admin', { replace: true });
            } else if (user.rol === 'cliente') {
                navigate('/cliente', { replace: true });
            } else if (user.rol === 'motorista') {
                navigate('/motorista', { replace: true });
            } else {
                navigate('/', { replace: true });
            }
        }
    }, [isAuthenticated, loading, user, navigate]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');

        try {
            await login(email, password);
        } catch (err) {
            setError(err.message || t('auth.login_error'));
        }
    };


    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: `linear-gradient(135deg, ${colors.primary} 0%, #7c3aed 50%, ${colors.accent} 100%)`,
            padding: '2rem',
            position: 'relative'
        }}>
            <SEO
                title={t('seo.login_title')}
                description={t('seo.login_desc')}
            />
            <div style={{ position: 'absolute', top: '1rem', right: '1rem' }}>
                <LanguageSwitcher />
            </div>

            <div className="mtx-card" style={{
                maxWidth: '450px',
                width: '100%',
                boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
                padding: '3rem',
                border: 'none'
            }}>
                {/* Logo y título */}
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <img src="/logo_clean.png" alt="MotoTX Logo" style={{ height: '5rem', marginBottom: '1rem', objectFit: 'contain' }} />
                    <h2 style={{
                        fontSize: '2rem',
                        fontWeight: 'bold',
                        color: colors.primary,
                        margin: '0 0 0.5rem 0'
                    }}>
                        {t('auth.welcome_title')}
                    </h2>
                    <p style={{ color: '#6b7280', margin: 0 }}>{t('auth.login_subtitle')}</p>
                </div>

                {error && (
                    <div style={{
                        padding: '1rem',
                        background: '#fee2e2',
                        border: `1px solid ${colors.error}`,
                        borderRadius: '0.5rem',
                        color: colors.error,
                        marginBottom: '1.5rem',
                        textAlign: 'center'
                    }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label
                            htmlFor="email"
                            style={{
                                display: 'block',
                                marginBottom: '0.5rem',
                                fontWeight: '600',
                                color: '#374151'
                            }}
                        >
                            {t('common.email')}
                        </label>
                        <input
                            type="email"
                            id="email"
                            className="mtx-input"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div style={{ marginBottom: '2rem' }}>
                        <label
                            htmlFor="password"
                            style={{
                                display: 'block',
                                marginBottom: '0.5rem',
                                fontWeight: '600',
                                color: '#374151'
                            }}
                        >
                            {t('common.password')}
                        </label>
                        <input
                            type="password"
                            id="password"
                            className="mtx-input"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="mtx-button mtx-button-primary w-full"
                        disabled={loading}
                    >
                        {loading ? t('auth.logging_in') : t('common.login')}
                    </button>
                </form>

                <div style={{
                    marginTop: '2rem',
                    paddingTop: '2rem',
                    borderTop: '1px solid #e5e7eb',
                    textAlign: 'center'
                }}>
                    <p style={{ color: '#6b7280', margin: '0 0 1rem 0' }}>
                        {t('auth.no_account')}
                    </p>
                    <Link
                        to="/register"
                        className="mtx-button"
                        style={{
                            display: 'inline-flex',
                            background: 'white',
                            color: colors.primary,
                            border: `2px solid ${colors.primary}`,
                            width: 'auto'
                        }}
                    >
                        {t('common.register')}
                    </Link>
                </div>

                <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
                    <Link
                        to="/"
                        style={{
                            color: '#6b7280',
                            textDecoration: 'none',
                            fontSize: '0.9rem'
                        }}
                        onMouseOver={(e) => e.target.style.color = colors.primary}
                        onMouseOut={(e) => e.target.style.color = '#6b7280'}
                    >
                        {t('common.back_home')}
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;
