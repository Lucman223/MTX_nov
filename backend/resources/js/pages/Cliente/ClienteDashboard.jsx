import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import MapSelection from './MapSelection';
import axios from 'axios';
import { toast } from 'sonner';
import useNotifications from '../../hooks/useNotifications';

const ClienteDashboard = () => {
    const { logout, user } = useAuth();
    const navigate = useNavigate();

    const [origen, setOrigen] = useState(null);
    const [destino, setDestino] = useState(null);
    const [puntoActivo, setPuntoActivo] = useState('origen'); // 'origen' | 'destino'
    const [activeTrip, setActiveTrip] = useState(null);

    // Color system
    const colors = {
        primary: '#2563eb',
        secondary: '#10b981',
        accent: '#f59e0b',
        error: '#ef4444'
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

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

    // Real-time updates
    const { listenToTripUpdates } = useNotifications();

    useEffect(() => {
        if (activeTrip?.id) {
            return listenToTripUpdates(activeTrip.id, (updatedTrip) => {
                setActiveTrip(updatedTrip);
                toast.info(`Actualización: ${updatedTrip.estado}`);
            });
        }
    }, [activeTrip?.id]);

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

    const forfaits = user?.cliente_forfaits || [];
    const viajesDisponibles = forfaits.reduce((acc, curr) => acc + (parseInt(curr.viajes_restantes) || 0), 0);

    console.log('UserData:', user, 'Forfaits:', forfaits, 'Balance:', viajesDisponibles);

    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb', display: 'flex', flexDirection: 'column', paddingBottom: isMobile ? '80px' : '0' }}>
            {/* Responsive Header */}
            <header style={{
                backgroundColor: 'white',
                padding: isMobile ? '1rem' : '1.25rem 2rem',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: `3px solid ${colors.primary}`,
                position: isMobile ? 'sticky' : 'static',
                top: 0,
                zIndex: 50
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <img src="/logo.png" alt="MotoTX" style={{ height: isMobile ? '2.5rem' : '3.5rem', objectFit: 'contain' }} />
                    <div>
                        <h1 style={{ fontSize: isMobile ? '1.1rem' : '1.5rem', fontWeight: 'bold', color: colors.primary, margin: 0 }}>MotoTX</h1>
                        <span style={{ fontSize: isMobile ? '0.75rem' : '0.875rem', color: '#6b7280' }}>
                            {user?.name || 'Cliente'}
                        </span>
                    </div>
                </div>

                {/* Desktop Nav */}
                {!isMobile && (
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <div style={{
                            padding: '0.5rem 1rem',
                            background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
                            borderRadius: '0.5rem',
                            color: 'white',
                            fontWeight: '600',
                            fontSize: '0.875rem'
                        }}>
                            {viajesDisponibles} viajes
                        </div>
                        <button
                            onClick={() => navigate('/cliente/historial')}
                            style={{
                                padding: '0.5rem 1.25rem',
                                background: 'white',
                                color: colors.primary,
                                border: `2px solid ${colors.primary}`,
                                borderRadius: '0.5rem',
                                fontWeight: '600',
                                cursor: 'pointer',
                            }}
                        >
                            📋 Historial
                        </button>
                        <button
                            onClick={() => navigate('/cliente/perfil')}
                            style={{
                                padding: '0.5rem 1.25rem',
                                background: 'white',
                                color: '#4b5563',
                                border: '1px solid #d1d5db',
                                borderRadius: '0.5rem',
                                fontWeight: '600',
                                cursor: 'pointer',
                            }}
                        >
                            👤 Perfil
                        </button>
                        <button
                            onClick={handleLogout}
                            style={{
                                padding: '0.5rem 1.25rem',
                                backgroundColor: 'white',
                                color: colors.error,
                                border: `2px solid ${colors.error}`,
                                borderRadius: '0.5rem',
                                fontWeight: '600',
                                cursor: 'pointer',
                            }}
                        >
                            Salir
                        </button>
                    </div>
                )}

                {/* Mobile Balance Badge (Right) */}
                {isMobile && (
                    <div style={{
                        padding: '0.25rem 0.75rem',
                        background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
                        borderRadius: '1rem',
                        color: 'white',
                        fontWeight: '600',
                        fontSize: '0.75rem'
                    }}>
                        {viajesDisponibles} 🎫
                    </div>
                )}
            </header>

            {/* Mobile Bottom Nav */}
            {isMobile && (
                <div style={{
                    position: 'fixed',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    backgroundColor: 'white',
                    borderTop: '1px solid #e5e7eb',
                    display: 'flex',
                    justifyContent: 'space-around',
                    padding: '0.75rem',
                    boxShadow: '0 -2px 10px rgba(0,0,0,0.05)',
                    zIndex: 100
                }}>
                    <button onClick={() => { }} style={{ background: 'none', border: 'none', color: colors.primary, display: 'flex', flexDirection: 'column', alignItems: 'center', fontSize: '0.75rem' }}>
                        <span style={{ fontSize: '1.25rem' }}>🏠</span>
                        Inicio
                    </button>
                    <button onClick={() => navigate('/cliente/historial')} style={{ background: 'none', border: 'none', color: '#6b7280', display: 'flex', flexDirection: 'column', alignItems: 'center', fontSize: '0.75rem' }}>
                        <span style={{ fontSize: '1.25rem' }}>📋</span>
                        Historial
                    </button>
                    <button onClick={() => navigate('/cliente/perfil')} style={{ background: 'none', border: 'none', color: '#6b7280', display: 'flex', flexDirection: 'column', alignItems: 'center', fontSize: '0.75rem' }}>
                        <span style={{ fontSize: '1.25rem' }}>👤</span>
                        Perfil
                    </button>
                    <button onClick={handleLogout} style={{ background: 'none', border: 'none', color: colors.error, display: 'flex', flexDirection: 'column', alignItems: 'center', fontSize: '0.75rem' }}>
                        <span style={{ fontSize: '1.25rem' }}>🚪</span>
                        Salir
                    </button>
                </div>
            )}

            {/* Main Content */}
            <main style={{
                flex: 1,
                padding: isMobile ? '1rem' : '2rem',
                display: 'flex',
                flexDirection: isMobile ? 'column-reverse' : 'row', // On mobile, map goes top (or bottom?) - Let's keep controls accessible. Actually map on top is standard but controllers bottom. Let's stack naturally but reserve order? No, keep Controls on top for easy access?
                // Better UX: Map on Top, Controls Below? 
                // Let's stick to standard flex column for mobile
                flexDirection: isMobile ? 'column' : 'row',
                gap: '2rem',
                // height: isMobile ? 'auto' : 'calc(100vh - 90px)' // Allow scrolling on mobile
            }}>

                {/* Left Panel: Controls & Info */}
                <div style={{ flex: isMobile ? 'auto' : '0 0 380px', display: 'flex', flexDirection: 'column', gap: '1.5rem', order: isMobile ? 2 : 1 }}>

                    {/* Status Card */}
                    <div style={{
                        backgroundColor: 'white',
                        padding: '2rem',
                        borderRadius: '1rem',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                        border: '1px solid #e5e7eb'
                    }}>
                        <h2 style={{
                            fontSize: '1.25rem',
                            fontWeight: 'bold',
                            marginBottom: '1.5rem',
                            color: '#111827',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                        }}>
                            <span>📍</span> Planificar Viaje
                        </h2>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <button
                                onClick={() => setPuntoActivo('origen')}
                                style={{
                                    padding: '1.25rem',
                                    borderRadius: '0.75rem',
                                    border: `2px solid ${puntoActivo === 'origen' ? colors.primary : '#e5e7eb'}`,
                                    backgroundColor: puntoActivo === 'origen' ? `${colors.primary}10` : 'white',
                                    textAlign: 'left',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                    boxShadow: puntoActivo === 'origen' ? `0 4px 12px ${colors.primary}20` : 'none'
                                }}
                            >
                                <div style={{ fontSize: '0.75rem', color: colors.primary, marginBottom: '0.5rem', fontWeight: '600', letterSpacing: '0.05em' }}>ORIGEN</div>
                                <div style={{ fontWeight: '600', color: origen ? '#111827' : '#9ca3af', fontSize: '0.95rem' }}>
                                    {origen ? `${origen[0].toFixed(4)}, ${origen[1].toFixed(4)}` : 'Toca en el mapa'}
                                </div>
                            </button>

                            <button
                                onClick={() => setPuntoActivo('destino')}
                                style={{
                                    padding: '1.25rem',
                                    borderRadius: '0.75rem',
                                    border: `2px solid ${puntoActivo === 'destino' ? colors.secondary : '#e5e7eb'}`,
                                    backgroundColor: puntoActivo === 'destino' ? `${colors.secondary}10` : 'white',
                                    textAlign: 'left',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                    boxShadow: puntoActivo === 'destino' ? `0 4px 12px ${colors.secondary}20` : 'none'
                                }}
                            >
                                <div style={{ fontSize: '0.75rem', color: colors.secondary, marginBottom: '0.5rem', fontWeight: '600', letterSpacing: '0.05em' }}>DESTINO</div>
                                <div style={{ fontWeight: '600', color: destino ? '#111827' : '#9ca3af', fontSize: '0.95rem' }}>
                                    {destino ? `${destino[0].toFixed(4)}, ${destino[1].toFixed(4)}` : 'Toca en el mapa'}
                                </div>
                            </button>
                        </div>

                        <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid #e5e7eb' }}>
                            <button
                                onClick={handleSolicitarViaje}
                                disabled={!origen || !destino}
                                style={{
                                    width: '100%',
                                    padding: '1.125rem',
                                    background: (!origen || !destino) ? '#d1d5db' : `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '0.75rem',
                                    fontWeight: 'bold',
                                    fontSize: '1.05rem',
                                    cursor: (!origen || !destino) ? 'not-allowed' : 'pointer',
                                    boxShadow: (!origen || !destino) ? 'none' : `0 4px 12px ${colors.primary}40`,
                                    transition: 'all 0.2s'
                                }}
                                onMouseOver={(e) => {
                                    if (origen && destino) {
                                        e.target.style.transform = 'translateY(-2px)';
                                        e.target.style.boxShadow = `0 6px 16px ${colors.primary}50`;
                                    }
                                }}
                                onMouseOut={(e) => {
                                    e.target.style.transform = 'translateY(0)';
                                    e.target.style.boxShadow = (!origen || !destino) ? 'none' : `0 4px 12px ${colors.primary}40`;
                                }}
                            >
                                🚀 Solicitar Moto Ahora
                            </button>
                        </div>
                    </div>

                    {/* Forfaits Card */}
                    <div style={{
                        backgroundColor: 'white',
                        padding: '2rem',
                        borderRadius: '1rem',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                        border: '1px solid #e5e7eb',
                        background: `linear-gradient(135deg, white 0%, ${colors.primary}05 100%)`
                    }}>
                        <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#111827', marginBottom: '1rem' }}>💰 Saldo de Viajes</h3>
                        <div style={{ fontSize: '3rem', fontWeight: 'bold', color: colors.primary, margin: '1rem 0' }}>
                            {viajesDisponibles}
                        </div>
                        <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '1.5rem' }}>
                            {viajesDisponibles > 0 ? `Tienes ${viajesDisponibles} viajes disponibles` : 'No tienes forfaits activos'}
                        </p>
                        <button
                            onClick={() => navigate('/cliente/forfaits')}
                            style={{
                                width: '100%',
                                padding: '0.875rem',
                                fontSize: '0.95rem',
                                color: 'white',
                                background: colors.accent,
                                border: 'none',
                                borderRadius: '0.75rem',
                                fontWeight: '600',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                boxShadow: `0 4px 12px ${colors.accent}40`
                            }}
                            onMouseOver={(e) => {
                                e.target.style.transform = 'translateY(-2px)';
                                e.target.style.boxShadow = `0 6px 16px ${colors.accent}50`;
                            }}
                            onMouseOut={(e) => {
                                e.target.style.transform = 'translateY(0)';
                                e.target.style.boxShadow = `0 4px 12px ${colors.accent}40`;
                            }}
                        >
                            Comprar Forfait
                        </button>
                    </div>

                    {/* Active Trip Status */}
                    {activeTrip && (
                        <div style={{
                            backgroundColor: colors.secondary,
                            color: 'white',
                            padding: '1.5rem',
                            borderRadius: '1rem',
                            boxShadow: `0 4px 12px ${colors.secondary}40`
                        }}>
                            <div style={{ fontSize: '0.875rem', opacity: 0.9, marginBottom: '0.5rem' }}>VIAJE ACTIVO</div>
                            <div style={{ fontSize: '1.125rem', fontWeight: 'bold' }}>
                                Estado: {activeTrip.estado}
                            </div>
                            {activeTrip.motorista && (
                                <div style={{ marginTop: '0.75rem', fontSize: '0.95rem', opacity: 0.95 }}>
                                    Motorista: {activeTrip.motorista.name}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Right Panel: Map */}
                <div style={{
                    flex: 1,
                    backgroundColor: 'white',
                    borderRadius: '1rem',
                    overflow: 'hidden',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                    position: 'relative',
                    border: '1px solid #e5e7eb',
                    minHeight: isMobile ? '300px' : 'auto', // Ensure map has height on mobile
                    order: isMobile ? 1 : 2
                }}>
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
