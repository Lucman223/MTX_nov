import React, { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../../components/Common/LanguageSwitcher';

/**
 * RegisterPage Component
 *
 * [ES] Página de registro de nuevos usuarios.
 *      Permite la creación de cuentas para Clientes y Motoristas.
 *
 * [FR] Page d'inscription des nouveaux utilisateurs.
 *      Permet la création de comptes pour les Clients et les Chauffeurs.
 */
function RegisterPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [telefono, setTelefono] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [rol, setRol] = useState('cliente');

    // Color system
    const colors = {
        primary: '#2563eb',
        secondary: '#10b981',
        accent: '#f59e0b',
        error: '#ef4444'
    };

    // Pre-select role from URL parameter
    useEffect(() => {
        const rolParam = searchParams.get('rol');
        if (rolParam && ['cliente', 'motorista', 'admin'].includes(rolParam)) {
            setRol(rolParam);
        }
    }, [searchParams]);

    const handleSubmit = (event) => {
        event.preventDefault();
        // API call to register will be handled here
        console.log('Register attempt with:', { name, email, telefono, password, password_confirmation: passwordConfirmation, rol });
    };

    const getRoleColor = () => {
        if (rol === 'cliente') return colors.primary;
        if (rol === 'motorista') return colors.secondary;
        return colors.accent;
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
            <div style={{ position: 'absolute', top: '1rem', right: '1rem' }}>
                <LanguageSwitcher />
            </div>

            <div style={{
                background: 'white',
                borderRadius: '1.5rem',
                boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
                padding: '3rem',
                maxWidth: '500px',
                width: '100%'
            }}>
                {/* Logo y título */}
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <img src="/logo_clean.png" alt="MotoTX Logo" style={{ height: '5rem', marginBottom: '1rem', objectFit: 'contain' }} />
                    <h2 style={{
                        fontSize: '2rem',
                        fontWeight: 'bold',
                        color: getRoleColor(),
                        margin: '0 0 0.5rem 0'
                    }}>
                        {t('auth.register_title')}
                    </h2>
                    <p style={{ color: '#6b7280', margin: 0 }}>{t('auth.register_subtitle')}</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '1.25rem' }}>
                        <label
                            htmlFor="name"
                            style={{
                                display: 'block',
                                marginBottom: '0.5rem',
                                fontWeight: '600',
                                color: '#374151'
                            }}
                        >
                            {t('auth.name')}
                        </label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            style={{
                                width: '100%',
                                padding: '0.75rem 1rem',
                                border: '2px solid #e5e7eb',
                                borderRadius: '0.5rem',
                                fontSize: '1rem',
                                transition: 'border-color 0.2s',
                                outline: 'none'
                            }}
                            onFocus={(e) => e.target.style.borderColor = getRoleColor()}
                            onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                        />
                    </div>

                    <div style={{ marginBottom: '1.25rem' }}>
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
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            style={{
                                width: '100%',
                                padding: '0.75rem 1rem',
                                border: '2px solid #e5e7eb',
                                borderRadius: '0.5rem',
                                fontSize: '1rem',
                                transition: 'border-color 0.2s',
                                outline: 'none'
                            }}
                            onFocus={(e) => e.target.style.borderColor = getRoleColor()}
                            onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                        />
                    </div>

                    <div style={{ marginBottom: '1.25rem' }}>
                        <label
                            htmlFor="telefono"
                            style={{
                                display: 'block',
                                marginBottom: '0.5rem',
                                fontWeight: '600',
                                color: '#374151'
                            }}
                        >
                            {t('auth.phone')}
                        </label>
                        <input
                            type="tel"
                            id="telefono"
                            value={telefono}
                            onChange={(e) => setTelefono(e.target.value)}
                            required
                            style={{
                                width: '100%',
                                padding: '0.75rem 1rem',
                                border: '2px solid #e5e7eb',
                                borderRadius: '0.5rem',
                                fontSize: '1rem',
                                transition: 'border-color 0.2s',
                                outline: 'none'
                            }}
                            onFocus={(e) => e.target.style.borderColor = getRoleColor()}
                            onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                        />
                    </div>

                    <div style={{ marginBottom: '1.25rem' }}>
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
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            style={{
                                width: '100%',
                                padding: '0.75rem 1rem',
                                border: '2px solid #e5e7eb',
                                borderRadius: '0.5rem',
                                fontSize: '1rem',
                                transition: 'border-color 0.2s',
                                outline: 'none'
                            }}
                            onFocus={(e) => e.target.style.borderColor = getRoleColor()}
                            onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                        />
                    </div>

                    <div style={{ marginBottom: '1.25rem' }}>
                        <label
                            htmlFor="password_confirmation"
                            style={{
                                display: 'block',
                                marginBottom: '0.5rem',
                                fontWeight: '600',
                                color: '#374151'
                            }}
                        >
                            {t('auth.password_confirm')}
                        </label>
                        <input
                            type="password"
                            id="password_confirmation"
                            value={passwordConfirmation}
                            onChange={(e) => setPasswordConfirmation(e.target.value)}
                            required
                            style={{
                                width: '100%',
                                padding: '0.75rem 1rem',
                                border: '2px solid #e5e7eb',
                                borderRadius: '0.5rem',
                                fontSize: '1rem',
                                transition: 'border-color 0.2s',
                                outline: 'none'
                            }}
                            onFocus={(e) => e.target.style.borderColor = getRoleColor()}
                            onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                        />
                    </div>

                    <div style={{ marginBottom: '2rem' }}>
                        <label
                            style={{
                                display: 'block',
                                marginBottom: '0.5rem',
                                fontWeight: '600',
                                color: '#374151'
                            }}
                        >
                            {t('auth.i_want_to_be')}
                        </label>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                            <button
                                type="button"
                                onClick={() => setRol('cliente')}
                                style={{
                                    padding: '1rem',
                                    background: rol === 'cliente' ? colors.primary : 'white',
                                    color: rol === 'cliente' ? 'white' : colors.primary,
                                    border: `2px solid ${colors.primary}`,
                                    borderRadius: '0.75rem',
                                    fontWeight: 'bold',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s'
                                }}
                            >
                                {t('auth.role_client')}
                            </button>
                            <button
                                type="button"
                                onClick={() => setRol('motorista')}
                                style={{
                                    padding: '1rem',
                                    background: rol === 'motorista' ? colors.secondary : 'white',
                                    color: rol === 'motorista' ? 'white' : colors.secondary,
                                    border: `2px solid ${colors.secondary}`,
                                    borderRadius: '0.75rem',
                                    fontWeight: 'bold',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s'
                                }}
                            >
                                {t('auth.role_driver')}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        style={{
                            width: '100%',
                            padding: '1rem',
                            background: getRoleColor(),
                            color: 'white',
                            border: 'none',
                            borderRadius: '0.75rem',
                            fontSize: '1.05rem',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            boxShadow: `0 4px 12px ${getRoleColor()}40`
                        }}
                        onMouseOver={(e) => {
                            e.target.style.transform = 'translateY(-2px)';
                            e.target.style.boxShadow = `0 6px 16px ${getRoleColor()}50`;
                        }}
                        onMouseOut={(e) => {
                            e.target.style.transform = 'translateY(0)';
                            e.target.style.boxShadow = `0 4px 12px ${getRoleColor()}40`;
                        }}
                    >
                        {t('common.register')}
                    </button>
                </form>

                <div style={{
                    marginTop: '2rem',
                    paddingTop: '2rem',
                    borderTop: '1px solid #e5e7eb',
                    textAlign: 'center'
                }}>
                    <p style={{ color: '#6b7280', margin: '0 0 1rem 0' }}>
                        {t('auth.have_account')}
                    </p>
                    <Link
                        to="/login"
                        style={{
                            display: 'inline-block',
                            padding: '0.75rem 2rem',
                            background: 'white',
                            color: getRoleColor(),
                            border: `2px solid ${getRoleColor()}`,
                            borderRadius: '0.75rem',
                            textDecoration: 'none',
                            fontWeight: '600',
                            transition: 'all 0.2s'
                        }}
                        onMouseOver={(e) => {
                            e.target.style.background = getRoleColor();
                            e.target.style.color = 'white';
                        }}
                        onMouseOut={(e) => {
                            e.target.style.background = 'white';
                            e.target.style.color = getRoleColor();
                        }}
                    >
                        {t('common.login')}
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
                        onMouseOver={(e) => e.target.style.color = getRoleColor()}
                        onMouseOut={(e) => e.target.style.color = '#6b7280'}
                    >
                        {t('common.back_home')}
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default RegisterPage;
