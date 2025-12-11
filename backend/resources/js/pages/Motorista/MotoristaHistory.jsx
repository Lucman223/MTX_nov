import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const MotoristaHistory = () => {
    const { logout, user } = useAuth();
    const navigate = useNavigate();
    const [viajes, setViajes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ total: 0, average: 0 });

    // Color system
    const colors = {
        primary: '#2563eb',
        secondary: '#10b981',
        accent: '#f59e0b',
        error: '#ef4444'
    };

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        setLoading(true);
        try {
            const response = await axios.get('/api/viajes/historial');
            const trips = response.data.data || [];
            setViajes(trips);

            // Calculate stats
            const ratedTrips = trips.filter(v => v.calificacion);
            const totalRating = ratedTrips.reduce((sum, v) => sum + (v.calificacion?.puntuacion || 0), 0);
            const avgRating = ratedTrips.length > 0 ? (totalRating / ratedTrips.length).toFixed(1) : 0;

            setStats({
                total: trips.length,
                average: avgRating
            });
        } catch (error) {
            console.error('Error fetching history:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const renderStars = (rating) => {
        return (
            <div style={{ display: 'flex', gap: '0.25rem' }}>
                {[1, 2, 3, 4, 5].map((star) => (
                    <span key={star} style={{ color: star <= rating ? colors.accent : '#d1d5db', fontSize: '1.25rem' }}>
                        ★
                    </span>
                ))}
            </div>
        );
    };

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
            {/* Header */}
            <header style={{
                backgroundColor: 'white',
                padding: '1.25rem 2rem',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: `3px solid ${colors.secondary}`
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span style={{ fontSize: '2rem' }}>🏍️</span>
                    <div>
                        <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: colors.secondary, margin: 0 }}>
                            Historial de Viajes
                        </h1>
                        <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                            {user?.name || 'Motorista'}
                        </span>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button
                        onClick={() => navigate('/motorista')}
                        style={{
                            padding: '0.5rem 1.25rem',
                            background: colors.secondary,
                            color: 'white',
                            border: 'none',
                            borderRadius: '0.5rem',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                        }}
                    >
                        ← Dashboard
                    </button>

                    <button
                        onClick={() => navigate('/motorista/perfil')}
                        style={{
                            padding: '0.5rem 1.25rem',
                            background: 'white',
                            color: '#4b5563',
                            border: '1px solid #d1d5db',
                            borderRadius: '0.5rem',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
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
                            transition: 'all 0.2s'
                        }}
                    >
                        Cerrar Sesión
                    </button>
                </div>
            </header >

            {/* Main Content */}
            < main style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
                {/* Stats Cards */}
                < div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                    gap: '1.5rem',
                    marginBottom: '2rem'
                }}>
                    <div style={{
                        backgroundColor: 'white',
                        padding: '2rem',
                        borderRadius: '1rem',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                        border: `2px solid ${colors.secondary}`
                    }}>
                        <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem', fontWeight: '600' }}>
                            VIAJES COMPLETADOS
                        </div>
                        <div style={{ fontSize: '3rem', fontWeight: 'bold', color: colors.secondary }}>
                            {stats.total}
                        </div>
                    </div>
                    <div style={{
                        backgroundColor: 'white',
                        padding: '2rem',
                        borderRadius: '1rem',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                        border: `2px solid ${colors.accent}`
                    }}>
                        <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem', fontWeight: '600' }}>
                            CALIFICACIÓN PROMEDIO
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ fontSize: '3rem', fontWeight: 'bold', color: colors.accent }}>
                                {stats.average}
                            </div>
                            <div style={{ fontSize: '2rem', color: colors.accent }}>★</div>
                        </div>
                    </div>
                </div >

                {/* Trip List */}
                {
                    loading ? (
                        <div style={{ textAlign: 'center', padding: '3rem', color: '#6b7280' }}>
                            Cargando historial...
                        </div>
                    ) : viajes.length === 0 ? (
                        <div style={{
                            backgroundColor: 'white',
                            padding: '3rem',
                            borderRadius: '1rem',
                            textAlign: 'center',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
                        }}>
                            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📋</div>
                            <p style={{ color: '#6b7280', fontSize: '1.125rem' }}>
                                No tienes viajes completados aún
                            </p>
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gap: '1.5rem' }}>
                            {viajes.map((viaje) => (
                                <div
                                    key={viaje.id}
                                    style={{
                                        backgroundColor: 'white',
                                        padding: '2rem',
                                        borderRadius: '1rem',
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                                        border: '1px solid #e5e7eb',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1.5rem' }}>
                                        <div>
                                            <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>
                                                {new Date(viaje.updated_at).toLocaleDateString('es-ES', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </div>
                                            <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#111827' }}>
                                                Cliente: {viaje.cliente?.name || 'N/A'}
                                            </div>
                                        </div>
                                        <div style={{
                                            padding: '0.5rem 1rem',
                                            background: `${colors.secondary}20`,
                                            color: colors.secondary,
                                            borderRadius: '0.5rem',
                                            fontSize: '0.875rem',
                                            fontWeight: '600'
                                        }}>
                                            Completado
                                        </div>
                                    </div>

                                    <div style={{
                                        display: 'grid',
                                        gridTemplateColumns: '1fr 1fr',
                                        gap: '1rem',
                                        marginBottom: '1.5rem',
                                        padding: '1rem',
                                        background: '#f9fafb',
                                        borderRadius: '0.5rem'
                                    }}>
                                        <div>
                                            <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.25rem' }}>ORIGEN</div>
                                            <div style={{ fontSize: '0.9rem', color: '#374151' }}>
                                                {viaje.origen_lat?.toFixed(4)}, {viaje.origen_lng?.toFixed(4)}
                                            </div>
                                        </div>
                                        <div>
                                            <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.25rem' }}>DESTINO</div>
                                            <div style={{ fontSize: '0.9rem', color: '#374151' }}>
                                                {viaje.destino_lat?.toFixed(4)}, {viaje.destino_lng?.toFixed(4)}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Rating Section */}
                                    {viaje.calificacion ? (
                                        <div style={{
                                            padding: '1.5rem',
                                            background: `${colors.accent}10`,
                                            borderRadius: '0.75rem',
                                            borderLeft: `4px solid ${colors.accent}`
                                        }}>
                                            <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.75rem', fontWeight: '600' }}>
                                                CALIFICACIÓN RECIBIDA
                                            </div>
                                            {renderStars(viaje.calificacion.puntuacion)}
                                            {viaje.calificacion.comentario && (
                                                <div style={{
                                                    marginTop: '1rem',
                                                    fontSize: '0.95rem',
                                                    color: '#374151',
                                                    fontStyle: 'italic',
                                                    padding: '0.75rem',
                                                    background: 'white',
                                                    borderRadius: '0.5rem'
                                                }}>
                                                    "{viaje.calificacion.comentario}"
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div style={{
                                            padding: '1rem',
                                            background: '#f3f4f6',
                                            borderRadius: '0.5rem',
                                            textAlign: 'center',
                                            color: '#9ca3af',
                                            fontSize: '0.9rem'
                                        }}>
                                            Sin calificación
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )
                }
            </main >
        </div >
    );
};

export default MotoristaHistory;
