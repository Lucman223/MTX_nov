import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const MotoristaDashboard = () => {
    const { logout, user } = useAuth();
    const navigate = useNavigate();
    const [viajes, setViajes] = useState([]);
    const [currentTrip, setCurrentTrip] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        try {
            // Check for active trip first
            const activeRes = await axios.get('/api/viajes/actual');

            // Fix: Check if data has an ID (avoids empty object issue)
            if (activeRes.data && activeRes.data.id) {
                setCurrentTrip(activeRes.data);
                setViajes([]); // Clear pending list
            } else {
                setCurrentTrip(null);
                const pendingRes = await axios.get('/api/viajes/pendientes');
                setViajes(pendingRes.data);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 10000);

        // Location Tracking
        const locationInterval = setInterval(() => {
            if ("geolocation" in navigator) {
                navigator.geolocation.getCurrentPosition(async (position) => {
                    const { latitude, longitude } = position.coords;
                    try {
                        await axios.put('/api/motorista/ubicacion', { latitude, longitude });
                        console.log('Location updated', { latitude, longitude });
                    } catch (err) {
                        console.error('Error updating location', err);
                    }
                }, (error) => {
                    console.error("Geolocation error:", error);
                });
            }
        }, 10000); // Update location every 10s

        return () => {
            clearInterval(interval);
            clearInterval(locationInterval);
        };
    }, []);

    const handleAcceptTrip = async (viajeId) => {
        try {
            await axios.post(`/api/viajes/${viajeId}/aceptar`);
            alert('¡Viaje aceptado!');
            fetchData();
        } catch (error) {
            console.error('Error accepting trip:', error);
            alert('Error: ' + (error.response?.data?.message || 'No se pudo aceptar'));
        }
    };

    const handleUpdateStatus = async (status) => {
        if (!currentTrip) return;
        try {
            await axios.post(`/api/viajes/${currentTrip.id}/estado`, { estado: status });
            alert(`Estado actualizado a: ${status}`);
            fetchData();
        } catch (error) {
            console.error('Error updating status:', error);
            alert('Error al actualizar estado');
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#f3f4f6', padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937' }}>Tablero de Motorista</h1>
                    <p style={{ color: '#6b7280' }}>Bienvenido, {user?.name}</p>
                </div>
                <button onClick={handleLogout} style={{ padding: '0.5rem 1rem', background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                    Cerrar Sesión
                </button>
            </div>

            {loading && !currentTrip && !viajes.length && <p>Cargando...</p>}

            {/* ACTIVE TRIP PANEL */}
            {currentTrip && (
                <div style={{ background: '#ecfdf5', padding: '2rem', borderRadius: '0.5rem', border: '2px solid #10b981', marginBottom: '2rem' }}>
                    <h2 style={{ color: '#065f46', marginBottom: '1rem' }}>VIAJE EN CURSO (#{currentTrip.id})</h2>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <p><strong>Estado:</strong> <span style={{ textTransform: 'uppercase', fontWeight: 'bold' }}>{currentTrip.estado}</span></p>
                        <p><strong>Origen:</strong> {currentTrip.origen_lat}, {currentTrip.origen_lng}</p>
                        <p><strong>Destino:</strong> {currentTrip.destino_lat}, {currentTrip.destino_lng}</p>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem' }}>
                        {currentTrip.estado === 'aceptado' && (
                            <button
                                onClick={() => handleUpdateStatus('en_curso')}
                                style={{ padding: '1rem 2rem', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '0.5rem', fontWeight: 'bold', cursor: 'pointer' }}
                            >
                                INICIAR VIAJE (Recoger Cliente)
                            </button>
                        )}
                        {currentTrip.estado === 'en_curso' && (
                            <button
                                onClick={() => handleUpdateStatus('completado')}
                                style={{ padding: '1rem 2rem', background: '#10b981', color: 'white', border: 'none', borderRadius: '0.5rem', fontWeight: 'bold', cursor: 'pointer' }}
                            >
                                FINALIZAR VIAJE
                            </button>
                        )}
                        <button
                            onClick={() => handleUpdateStatus('cancelado')}
                            style={{ padding: '1rem 2rem', background: '#ef4444', color: 'white', border: 'none', borderRadius: '0.5rem', fontWeight: 'bold', cursor: 'pointer' }}
                        >
                            CANCELAR
                        </button>
                    </div>
                </div>
            )}

            {/* PENDING LIST (Only visible if no active trip) */}
            {!currentTrip && (
                <>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <h2 style={{ fontSize: '1.2rem', fontWeight: '600', color: '#374151' }}>Solicitudes Pendientes</h2>
                        <button onClick={fetchData} style={{ padding: '0.5rem', background: 'white', border: '1px solid #d1d5db', borderRadius: '5px', cursor: 'pointer' }}>
                            Actualizar
                        </button>
                    </div>

                    {!loading && viajes.length === 0 && (
                        <div style={{ padding: '2rem', textAlign: 'center', background: 'white', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                            <p style={{ color: '#9ca3af' }}>No hay viajes pendientes.</p>
                        </div>
                    )}

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
                        {viajes.map((viaje) => (
                            <div key={viaje.id} style={{ background: 'white', padding: '1.5rem', borderRadius: '0.5rem', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', borderLeft: '4px solid #f59e0b' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                    <span style={{ fontWeight: 'bold', color: '#f59e0b' }}>SOLICITUD #{viaje.id}</span>
                                    <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>{new Date(viaje.created_at).toLocaleTimeString()}</span>
                                </div>
                                <div style={{ marginBottom: '1rem' }}>
                                    <p><strong>De:</strong> {viaje.origen_lat.toFixed(4)}, {viaje.origen_lng.toFixed(4)}</p>
                                    <p><strong>A:</strong> {viaje.destino_lat ? `${viaje.destino_lat.toFixed(4)}, ${viaje.destino_lng.toFixed(4)}` : 'Sin destino fijo'}</p>
                                </div>
                                <button
                                    onClick={() => handleAcceptTrip(viaje.id)}
                                    style={{ width: '100%', padding: '0.75rem', background: '#10b981', color: 'white', border: 'none', borderRadius: '0.5rem', fontWeight: 'bold', cursor: 'pointer' }}
                                >
                                    ACEPTAR VIAJE
                                </button>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default MotoristaDashboard;
