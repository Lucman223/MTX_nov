import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login, isAuthenticated, user, loading } = useAuth();
    const navigate = useNavigate();

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
            // Redirection logic is now handled by the useEffect
        } catch (err) {
            setError(err.message || 'Error en el inicio de sesión.');
        }
    };

    return (
        <div style={{ padding: '2rem', fontFamily: 'sans-serif', maxWidth: '400px', margin: 'auto' }}>
            <h2>Iniciar Sesión</h2>
            {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '1rem' }}>
                    <label htmlFor="email" style={{ display: 'block', marginBottom: '0.5rem' }}>Email</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={{ width: '100%', padding: '0.5rem' }}
                    />
                </div>
                <div style={{ marginBottom: '1rem' }}>
                    <label htmlFor="password" style={{ display: 'block', marginBottom: '0.5rem' }}>Contraseña</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={{ width: '100%', padding: '0.5rem' }}
                    />
                </div>
                <button type="submit" disabled={loading} style={{ width: '100%', padding: '0.75rem', background: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: loading ? 'not-allowed' : 'pointer' }}>
                    {loading ? 'Iniciando sesión...' : 'Login'}
                </button>
            </form>
            <p style={{ marginTop: '1rem', textAlign: 'center' }}>
                ¿No tienes una cuenta? <Link to="/register">Regístrate aquí</Link>
            </p>
        </div>
    );
}

export default LoginPage;
