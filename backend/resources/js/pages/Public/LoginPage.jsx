import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login, isAuthenticated, user, loading } = useAuth();
    const navigate = useNavigate();

    // Color system
    const colors = {
        primary: '#2563eb',
        secondary: '#10b981',
        accent: '#f59e0b',
        error: '#ef4444'
    };

    useEffect(() => {
        if (!loading && isAuthenticated && user) {
            console.log('LoginPage: User authenticated, redirecting...', user.rol);
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
            setError(err.message || 'Error en el inicio de sesión.');
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: `linear-gradient(135deg, ${colors.primary} 0%, #7c3aed 50%, ${colors.accent} 100%)`,
            padding: '2rem'
        }}>
            <div style={{
                background: 'white',
                borderRadius: '1.5rem',
                boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
                padding: '3rem',
                maxWidth: '450px',
                width: '100%'
            }}>
                {/* Logo y título */}
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🏍️</div>
                    <h2 style={{
                        fontSize: '2rem',
                        fontWeight: 'bold',
                        color: colors.primary,
                        margin: '0 0 0.5rem 0'
                    }}>
                        Bienvenido a MotoTX
                    </h2>
                    <p style={{ color: '#6b7280', margin: 0 }}>Inicia sesión para continuar</p>
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
                            Email
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
                            onFocus={(e) => e.target.style.borderColor = colors.primary}
                            onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
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
                            Contraseña
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
                            onFocus={(e) => e.target.style.borderColor = colors.primary}
                            onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: '100%',
                            padding: '1rem',
                            background: colors.primary,
                            color: 'white',
                            border: 'none',
                            borderRadius: '0.75rem',
                            fontSize: '1.05rem',
                            fontWeight: 'bold',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            opacity: loading ? 0.6 : 1,
                            transition: 'all 0.2s',
                            boxShadow: `0 4px 12px ${colors.primary}40`
                        }}
                        onMouseOver={(e) => {
                            if (!loading) {
                                e.target.style.transform = 'translateY(-2px)';
                                e.target.style.boxShadow = `0 6px 16px ${colors.primary}50`;
                            }
                        }}
                        onMouseOut={(e) => {
                            e.target.style.transform = 'translateY(0)';
                            e.target.style.boxShadow = `0 4px 12px ${colors.primary}40`;
                        }}
                    >
                        {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                    </button>
                </form>

                <div style={{
                    marginTop: '2rem',
                    paddingTop: '2rem',
                    borderTop: '1px solid #e5e7eb',
                    textAlign: 'center'
                }}>
                    <p style={{ color: '#6b7280', margin: '0 0 1rem 0' }}>
                        ¿No tienes una cuenta?
                    </p>
                    <Link
                        to="/register"
                        style={{
                            display: 'inline-block',
                            padding: '0.75rem 2rem',
                            background: 'white',
                            color: colors.primary,
                            border: `2px solid ${colors.primary}`,
                            borderRadius: '0.75rem',
                            textDecoration: 'none',
                            fontWeight: '600',
                            transition: 'all 0.2s'
                        }}
                        onMouseOver={(e) => {
                            e.target.style.background = colors.primary;
                            e.target.style.color = 'white';
                        }}
                        onMouseOut={(e) => {
                            e.target.style.background = 'white';
                            e.target.style.color = colors.primary;
                        }}
                    >
                        Registrarse
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
                        ← Volver al inicio
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;
