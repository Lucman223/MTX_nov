import React, { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../../components/Common/LanguageSwitcher';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'sonner';
import SEO from '../../components/Common/SEO';

/**
 * RegisterPage Component
 *
 * [ES] Página de registro de nuevos usuarios.
 *      Permite la creación de cuentas para Clientes y Motoristas.
 *
 * [FR] Page d'inscription des nouveaux utilisateurs.
 *      Permet la création de comptes para los Clients et les Chauffeurs.
 */
function RegisterPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { register, loading, isAuthenticated, user } = useAuth();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [telefono, setTelefono] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [rol, setRol] = useState('cliente');
    const [identityDocument, setIdentityDocument] = useState(null);
    const [aceptaTerminos, setAceptaTerminos] = useState(false);
    const [error, setError] = useState('');

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

    // Pre-select role from URL parameter
    useEffect(() => {
        const rolParam = searchParams.get('rol');
        if (rolParam && ['cliente', 'motorista', 'admin'].includes(rolParam)) {
            setRol(rolParam);
        }
    }, [searchParams]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                toast.error(t('auth.file_too_large'));
                return;
            }
            setIdentityDocument(file);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');

        if (!aceptaTerminos) {
            setError(t('auth.accept_terms_error') || 'Debe aceptar los términos y condiciones');
            return;
        }

        if (password !== passwordConfirmation) {
            setError(t('auth.password_mismatch') || 'Passwords do not match');
            return;
        }

        if (!identityDocument) {
            setError(t('auth.identity_document_required') || 'Documento de identidad requerido');
            toast.error(t('auth.identity_document_required') || 'Documento de identidad requerido');
            return;
        }

        try {
            const formData = new FormData();
            formData.append('name', name);
            formData.append('email', email);
            formData.append('telefono', telefono);
            formData.append('password', password);
            formData.append('password_confirmation', passwordConfirmation);
            formData.append('rol', rol);
            formData.append('documento_identidad', identityDocument);

            await register(formData);
            toast.success(t('auth.register_success') || 'Account created successfully!');
        } catch (err) {
            setError(err.message || t('auth.register_error'));
            toast.error(err.message || t('auth.register_error'));
        }
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
            <SEO
                title={t('seo.register_title')}
                description={t('seo.register_desc')}
            />

            <div className="mtx-card" style={{
                maxWidth: '500px',
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
                        color: getRoleColor(),
                        margin: '0 0 0.5rem 0'
                    }}>
                        {t('auth.register_title')}
                    </h2>
                    <p style={{ color: '#6b7280', margin: 0 }}>{t('auth.register_subtitle')}</p>
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
                            className="mtx-input"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            disabled={loading}
                            style={{ width: '100%' }}
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
                            className="mtx-input"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            disabled={loading}
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
                            className="mtx-input"
                            value={telefono}
                            onChange={(e) => setTelefono(e.target.value)}
                            required
                            disabled={loading}
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
                            className="mtx-input"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            disabled={loading}
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
                            className="mtx-input"
                            value={passwordConfirmation}
                            onChange={(e) => setPasswordConfirmation(e.target.value)}
                            required
                            disabled={loading}
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
                                disabled={loading}
                                onClick={() => setRol('cliente')}
                                style={{
                                    padding: '1rem',
                                    background: rol === 'cliente' ? colors.primary : 'white',
                                    color: rol === 'cliente' ? 'white' : colors.primary,
                                    border: `2px solid ${colors.primary}`,
                                    borderRadius: '0.75rem',
                                    fontWeight: 'bold',
                                    cursor: loading ? 'not-allowed' : 'pointer',
                                    transition: 'all 0.2s',
                                    opacity: loading && rol !== 'cliente' ? 0.5 : 1
                                }}
                            >
                                {t('auth.role_client')}
                            </button>
                            <button
                                type="button"
                                disabled={loading}
                                onClick={() => setRol('motorista')}
                                style={{
                                    padding: '1rem',
                                    background: rol === 'motorista' ? colors.secondary : 'white',
                                    color: rol === 'motorista' ? 'white' : colors.secondary,
                                    border: `2px solid ${colors.secondary}`,
                                    borderRadius: '0.75rem',
                                    fontWeight: 'bold',
                                    cursor: loading ? 'not-allowed' : 'pointer',
                                    transition: 'all 0.2s',
                                    opacity: loading && rol !== 'motorista' ? 0.5 : 1
                                }}
                            >
                                {t('auth.role_driver')}
                            </button>
                        </div>
                    </div>

                    <div style={{ marginBottom: '1.25rem' }}>
                        <label
                            htmlFor="identity_document"
                            style={{
                                display: 'block',
                                marginBottom: '0.25rem',
                                fontWeight: '600',
                                color: '#374151'
                            }}
                        >
                            {t('auth.identity_document')}
                        </label>
                        <small style={{ display: 'block', color: '#6b7280', marginBottom: '0.5rem' }}>
                            {t('auth.upload_id_helper')}
                        </small>
                        <input
                            type="file"
                            id="identity_document"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={handleFileChange}
                            required
                            disabled={loading}
                            style={{
                                width: '100%',
                                padding: '0.5rem',
                                border: '2px dashed #e5e7eb',
                                borderRadius: '0.75rem',
                                cursor: 'pointer'
                            }}
                        />
                    </div>

                    <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                        <input
                            type="checkbox"
                            id="aceptaTerminos"
                            checked={aceptaTerminos}
                            onChange={(e) => setAceptaTerminos(e.target.checked)}
                            style={{ marginTop: '0.25rem', cursor: 'pointer' }}
                        />
                        <label htmlFor="aceptaTerminos" style={{ fontSize: '0.9rem', color: '#4b5563', cursor: 'pointer' }}>
                            {t('auth.i_accept')} <Link to="/privacy" style={{ color: getRoleColor(), fontWeight: '600' }}>{t('auth.terms_and_privacy')}</Link>.
                            <br />
                            <small style={{ color: '#9ca3af' }}>{t('auth.rgpd_notice')}</small>
                        </label>
                    </div>

                    <button
                        type="submit"
                        className="mtx-button mtx-button-primary w-full"
                        disabled={loading}
                        style={{ background: getRoleColor(), boxShadow: `0 4px 12px ${getRoleColor()}40` }}
                    >
                        {loading ? t('common.loading') : t('common.register')}
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
                        className="mtx-button"
                        style={{
                            display: 'inline-flex',
                            background: 'white',
                            color: getRoleColor(),
                            border: `2px solid ${getRoleColor()}`,
                            width: 'auto'
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
