import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const MotoristaDashboard = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div>
            <h1>Panel de Motorista</h1>
            <p>Aquí se mostrarán las opciones para el motorista.</p>
            <button onClick={handleLogout} style={{ padding: '0.75rem 1.5rem', background: '#dc3545', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', marginTop: '1rem' }}>
                Cerrar Sesión
            </button>
        </div>
    );
};

export default MotoristaDashboard;
