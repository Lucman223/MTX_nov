import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import MapSelection from './MapSelection';
import axios from 'axios';

const ClienteDashboard = () => {
    const { logout, user } = useAuth();
    const navigate = useNavigate();

    const [origen, setOrigen] = useState(null);
    const [destino, setDestino] = useState(null);
    const [puntoActivo, setPuntoActivo] = useState('origen'); // 'origen' | 'destino'

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const [activeTrip, setActiveTrip] = useState(null);

    // Poll for active trip status
    useEffect(() => {
        const checkTripStatus = async () => {
            try {
                const response = await axios.get('/api/viajes/actual');
                if (response.data) {
                    setActiveTrip(response.data);
                    // If trip is active, auto-set markers if not set
                    if (!origen && response.data.origen_lat) {
                        setOrigen([response.data.origen_lat, response.data.origen_lng]);
                    }
                    if (!destino && response.data.destino_lat) {
                        setDestino([response.data.destino_lat, response.data.destino_lng]);
                    }
                }
            } catch (error) {
                console.error("Error polling trip", error);
            }
        };

        const interval = setInterval(checkTripStatus, 5000); // Poll every 5s
        checkTripStatus(); // Initial check

        return () => clearInterval(interval);
    }, []);

    const handleSolicitarViaje = async () => {
        if (!origen || !destino) {
            alert('Por favor, selecciona origen y destino en el mapa.');
            return;
        }

        try {
            const response = await axios.post('/api/viajes/solicitar', {
                origen_lat: origen[0],
                origen_lng: origen[1],
                destino_lat: destino[0],
                destino_lng: destino[1]
            });

            alert('¡Viaje solicitado con éxito! Un motorista aceptará pronto.');
            setActiveTrip(response.data.data); // Set immediate state
        } catch (error) {
            console.error('Error al solicitar viaje:', error);
            const msg = error.response?.data?.error || error.response?.data?.message || 'Error al conectar con el servidor';
            alert(`Error: ${msg}`);
        }
    };

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#f3f4f6', display: 'flex', flexDirection: 'column' }}>
            {/* Header */}
            <header style={{ backgroundColor: 'white', padding: '1rem 2rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937' }}>MotoTX</h1>
                    <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Bienvenido, {user?.name || 'Cliente'}</span>
                </div>
                <button
                    onClick={handleLogout}
                    style={{ padding: '0.5rem 1rem', backgroundColor: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '0.375rem', fontWeight: '500', cursor: 'pointer', transition: 'background 0.2s' }}
                    onMouseOver={(e) => e.target.style.backgroundColor = '#fecaca'}
                    onMouseOut={(e) => e.target.style.backgroundColor = '#fee2e2'}
                >
                    Cerrar Sesión
                </button>
            </header>

            {/* Main Content */}
            <main style={{ flex: 1, padding: '2rem', display: 'flex', gap: '2rem', height: 'calc(100vh - 80px)' }}>

                {/* Left Panel: Controls & Info */}
                <div style={{ flex: '0 0 350px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                    {/* Status Card */}
                    <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.75rem', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                        <h2 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem', color: '#374151' }}>Planificar Viaje</h2>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <button
                                onClick={() => setPuntoActivo('origen')}
                                style={{
                                    padding: '1rem',
                                    borderRadius: '0.5rem',
                                    border: `2px solid ${puntoActivo === 'origen' ? '#3b82f6' : '#e5e7eb'}`,
                                    backgroundColor: puntoActivo === 'origen' ? '#eff6ff' : 'white',
                                    textAlign: 'left',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s'
                                }}
                            >
                                <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.25rem' }}>PUNTO DE ORIGEN</div>
                                <div style={{ fontWeight: '500', color: origen ? '#111827' : '#9ca3af' }}>
                                    {origen ? `Lat: ${origen[0].toFixed(4)}, Lng: ${origen[1].toFixed(4)}` : 'Toca en el mapa para fijar'}
                                </div>
                            </button>

                            <button
                                onClick={() => setPuntoActivo('destino')}
                                style={{
                                    padding: '1rem',
                                    borderRadius: '0.5rem',
                                    border: `2px solid ${puntoActivo === 'destino' ? '#10b981' : '#e5e7eb'}`,
                                    backgroundColor: puntoActivo === 'destino' ? '#ecfdf5' : 'white',
                                    textAlign: 'left',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s'
                                }}
                            >
                                <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.25rem' }}>PUNTO DE DESTINO</div>
                                <div style={{ fontWeight: '500', color: destino ? '#111827' : '#9ca3af' }}>
                                    {destino ? `Lat: ${destino[0].toFixed(4)}, Lng: ${destino[1].toFixed(4)}` : 'Toca en el mapa para fijar'}
                                </div>
                            </button>
                        </div>

                        <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid #e5e7eb' }}>
                            <button
                                onClick={handleSolicitarViaje}
                                disabled={!origen || !destino}
                                style={{
                                    width: '100%',
                                    padding: '0.875rem',
                                    backgroundColor: (!origen || !destino) ? '#d1d5db' : '#2563eb',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '0.5rem',
                                    fontWeight: '600',
                                    cursor: (!origen || !destino) ? 'not-allowed' : 'pointer',
                                    boxShadow: (!origen || !destino) ? 'none' : '0 4px 6px rgba(37, 99, 235, 0.2)',
                                    transition: 'background 0.2s'
                                }}
                            >
                                Solicitar Moto Ahora
                            </button>
                        </div>
                    </div>

                    {/* Forfaits Promo */}
                    <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.75rem', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                        <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#374151' }}>Saldo de Viajes</h3>
                        <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#111827', margin: '0.5rem 0' }}>
                            {user?.cliente_forfaits?.reduce((acc, curr) => acc + curr.viajes_restantes, 0) || 0}
                        </div>
                        <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '1rem' }}>
                            {user?.cliente_forfaits?.length > 0 ? 'Viajes disponibles.' : 'No tienes forfaits activos.'}
                        </p>
                        <button
                            onClick={() => navigate('/cliente/forfaits')}
                            style={{ fontSize: '0.875rem', color: '#2563eb', background: 'none', border: 'none', padding: 0, cursor: 'pointer', textDecoration: 'underline' }}
                        >
                            Comprar Forfait
                        </button>
                    </div>
                </div>

                {/* Right Panel: Map */}
                <div style={{ flex: 1, backgroundColor: 'white', borderRadius: '0.75rem', overflow: 'hidden', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', position: 'relative' }}>
                    <MapSelection
                        origen={origen}
                        setOrigen={setOrigen}
                        destino={destino}
                        setDestino={setDestino}
                        puntoActivo={puntoActivo}
                        motoristaPos={activeTrip?.motorista?.motorista_perfil ?
                            [activeTrip.motorista.motorista_perfil.latitud_actual, activeTrip.motorista.motorista_perfil.longitud_actual]
                            : null}
                    />
                </div>
            </main>
        </div>
    );
};

export default ClienteDashboard;
