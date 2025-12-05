import React from 'react';
import { Link } from 'react-router-dom';

function HomePage() {
    return (
        <div style={{ padding: '2rem', fontFamily: 'sans-serif', textAlign: 'center' }}>
            <h1>Bienvenido a MotoTX</h1>
            <p>Tu solución de confianza para el transporte en moto.</p>
            <nav style={{ marginTop: '2rem' }}>
                <Link to="/login" style={{ margin: '0 1rem', padding: '0.5rem 1rem', background: '#007bff', color: 'white', textDecoration: 'none', borderRadius: '5px' }}>
                    Iniciar Sesión
                </Link>
                <Link to="/register" style={{ margin: '0 1rem', padding: '0.5rem 1rem', background: '#28a745', color: 'white', textDecoration: 'none', borderRadius: '5px' }}>
                    Registrarse
                </Link>
            </nav>
        </div>
    );
}

export default HomePage;
