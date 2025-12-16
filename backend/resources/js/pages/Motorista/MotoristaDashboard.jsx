import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';
import useNotifications from '../../hooks/useNotifications';
import InstallPrompt from '../../components/Common/InstallPrompt';
import { useTranslation } from 'react-i18next';
import SEO from '../../components/Common/SEO';

const MotoristaDashboard = () => {
    const { logout, user } = useAuth();
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [viajes, setViajes] = useState([]);
    const [currentTrip, setCurrentTrip] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isOnline, setIsOnline] = useState(false);

    // Color system
    const colors = {
        primary: '#2563eb',
        secondary: '#10b981',
        accent: '#f59e0b',
        error: '#ef4444'
    };

    const fetchData = async () => {
        setLoading(true);
        try {
            const activeRes = await axios.get('/api/viajes/actual');
            if (activeRes.data && activeRes.data.id) {
                setCurrentTrip(activeRes.data);
                setViajes([]);
            } else {
                setCurrentTrip(null);
                const pendingRes = await axios.get('/api/viajes/pendientes');
                setViajes(Array.isArray(pendingRes.data) ? pendingRes.data : []);
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

        const locationInterval = setInterval(() => {
            if ("geolocation" in navigator) {
                navigator.geolocation.getCurrentPosition(async (position) => {
                    const { latitude, longitude } = position.coords;
                    try {
                        await axios.put('/api/motorista/ubicacion', { latitude, longitude });
                        console.log('Location updated', { latitude, longitude });
                    } catch (err) { }
                }, (error) => {
                    console.error("Geolocation error:", error);
                });
            }
        }, 10000);

        return () => {
            clearInterval(interval);
            clearInterval(locationInterval);
        };
    }, []);

    const { listenToAvailableTrips } = useNotifications();

    useEffect(() => {
        listenToAvailableTrips((trip) => {
            toast.success(t('driver_dashboard.new_trip_alert'));
            fetchData();
        });
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleAcceptTrip = async (tripId) => {
        try {
            await axios.post(`/api/viajes/${tripId}/aceptar`);
            toast.success(t('driver_dashboard.trip_accepted'));
            fetchData();
        } catch (error) {
            console.error('Error accepting trip:', error);
            const msg = error.response?.data?.error || t('driver_dashboard.accept_error');
            if (msg.includes('not active')) {
                toast.error(t('driver_dashboard.offline_error'));
            } else {
                toast.error(msg);
            }
        }
    };

    const handleToggleStatus = async () => {
        const newStatus = !isOnline ? 'activo' : 'inactivo';
        try {
            await axios.put('/api/motorista/status', { estado_actual: newStatus });
            setIsOnline(!isOnline);
            toast.success(newStatus === 'activo' ? t('driver_dashboard.online_msg') : t('driver_dashboard.offline_msg'));
        } catch (error) {
            console.error('Error toggling status:', error);
            if (error.response && error.response.status === 403) {
                toast.error(t('driver_dashboard.subscription_required'));
                setTimeout(() => navigate('/motorista/suscripciones'), 1500);
                return;
            }
            alert('Error updating status: ' + (error.response?.data?.message || 'Check connection'));
        }
    };

    const handleUpdateStatus = async (newStatus) => {
        if (!currentTrip) return;
        try {
            await axios.put(`/api/viajes/${currentTrip.id}/estado`, { estado: newStatus });
            toast.success(t('driver_dashboard.status_updated', { status: newStatus }));
            fetchData();
        } catch (error) {
            console.error('Error updating status:', error);
            toast.error(t('driver_dashboard.update_error'));
        }
    };

    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb', paddingBottom: isMobile ? '80px' : '0' }}>
            <SEO title={t('nav.dashboard')} />
            <InstallPrompt />

            <header style={{
                backgroundColor: 'white',
                padding: isMobile ? '1rem' : '1.25rem 2rem',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: `3px solid ${colors.secondary}`,
                position: isMobile ? 'sticky' : 'static',
                top: 0,
                zIndex: 50
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <img src="/logo.png" alt="MotoTX" style={{ height: isMobile ? '2.5rem' : '3.5rem', objectFit: 'contain' }} />
                    <div>
                        <h1 style={{ fontSize: isMobile ? '1.1rem' : '1.5rem', fontWeight: 'bold', color: colors.secondary, margin: 0 }}>
                            {isMobile ? 'MotoTX Driver' : 'MotoTX Motorista v1.1'}
                        </h1>
                        <span style={{ fontSize: isMobile ? '0.75rem' : '0.875rem', color: '#6b7280' }}>
                            {user?.name || t('driver_dashboard.driver_role')}
                        </span>
                    </div>
                </div>

                {!isMobile && (
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <div
                            onClick={currentTrip ? null : handleToggleStatus}
                            style={{
                                padding: '0.5rem 1rem',
                                background: currentTrip ? colors.secondary : (isOnline ? colors.secondary : '#e5e7eb'),
                                borderRadius: '2rem',
                                color: currentTrip ? 'white' : (isOnline ? 'white' : '#6b7280'),
                                fontWeight: '600',
                                fontSize: '0.875rem',
                                cursor: currentTrip ? 'default' : 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                border: isOnline ? `2px solid ${colors.secondary}` : '2px solid transparent'
                            }}
                        >
                            {currentTrip ? t('driver_dashboard.in_service') : (isOnline ? t('driver_dashboard.status_online') : t('driver_dashboard.status_offline'))}
                            {!currentTrip && <span style={{ fontSize: '0.75rem' }}>↻</span>}
                        </div>
                        <button
                            onClick={() => navigate('/motorista/historial')}
                            style={{
                                padding: '0.5rem 1.25rem',
                                background: 'white',
                                color: colors.secondary,
                                border: `2px solid ${colors.secondary}`,
                                borderRadius: '0.5rem',
                                fontWeight: '600',
                                cursor: 'pointer',
                            }}
                        >
                            {t('client_dashboard.history')}
                        </button>
                        <button
                            onClick={() => navigate('/motorista/suscripciones')}
                            style={{
                                padding: '0.5rem 1.25rem',
                                background: '#f59e0b',
                                color: 'white',
                                border: 'none',
                                borderRadius: '0.5rem',
                                fontWeight: '600',
                                cursor: 'pointer',
                            }}
                        >
                            👑 {t('nav.forfaits')}
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
                            }}
                        >
                            {t('client_dashboard.profile')}
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
                            {t('common.logout')}
                        </button>
                    </div>
                )}

                {isMobile && (
                    <div
                        onClick={currentTrip ? null : handleToggleStatus}
                        style={{
                            padding: '0.25rem 0.75rem',
                            background: currentTrip ? colors.secondary : (isOnline ? colors.secondary : '#e5e7eb'),
                            borderRadius: '2rem',
                            color: currentTrip ? 'white' : (isOnline ? 'white' : '#6b7280'),
                            fontWeight: '600',
                            fontSize: '0.75rem',
                            cursor: currentTrip ? 'default' : 'pointer',
                            border: isOnline ? `2px solid ${colors.secondary}` : '1px solid #d1d5db'
                        }}
                    >
                        {currentTrip ? t('driver_dashboard.in_service') : (isOnline ? 'ON' : 'OFF')}
                    </div>
                )}
            </header>

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
                        {t('nav.dashboard')}
                    </button>
                    <button onClick={() => navigate('/motorista/historial')} style={{ background: 'none', border: 'none', color: '#6b7280', display: 'flex', flexDirection: 'column', alignItems: 'center', fontSize: '0.75rem' }}>
                        <span style={{ fontSize: '1.25rem' }}>📋</span>
                        {t('client_dashboard.history')}
                    </button>
                    <button onClick={() => navigate('/motorista/perfil')} style={{ background: 'none', border: 'none', color: '#6b7280', display: 'flex', flexDirection: 'column', alignItems: 'center', fontSize: '0.75rem' }}>
                        <span style={{ fontSize: '1.25rem' }}>👤</span>
                        {t('client_dashboard.profile')}
                    </button>
                    <button onClick={handleLogout} style={{ background: 'none', border: 'none', color: colors.error, display: 'flex', flexDirection: 'column', alignItems: 'center', fontSize: '0.75rem' }}>
                        <span style={{ fontSize: '1.25rem' }}>🚪</span>
                        {t('common.logout')}
                    </button>
                </div>
            )}

            <main style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
                {loading && (
                    <div style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
                        {t('common.loading')}
                    </div>
                )}

                {currentTrip && (
                    <div style={{
                        backgroundColor: 'white',
                        padding: '2rem',
                        borderRadius: '1rem',
                        marginBottom: '2rem',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                        border: `2px solid ${colors.secondary}`
                    }}>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: colors.secondary, marginBottom: '1.5rem' }}>
                            🚀 {t('client_dashboard.trip_active')}
                        </h2>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
                            <div>
                                <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>{t('client_dashboard.client')}</div>
                                <div style={{ fontSize: '1.125rem', fontWeight: '600', color: '#111827' }}>
                                    {currentTrip.cliente?.name || 'N/A'}
                                </div>
                            </div>
                            <div>
                                <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>{t('client_dashboard.state')}</div>
                                <div style={{
                                    fontSize: '1.125rem',
                                    fontWeight: '600',
                                    color: colors.secondary,
                                    textTransform: 'capitalize'
                                }}>
                                    {currentTrip.estado}
                                </div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                            {currentTrip.estado === 'aceptado' && (
                                <button
                                    onClick={() => handleUpdateStatus('en_curso')}
                                    style={{
                                        flex: 1,
                                        padding: '1rem',
                                        background: colors.primary,
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '0.75rem',
                                        fontWeight: 'bold',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s',
                                        boxShadow: `0 4px 12px ${colors.primary}40`
                                    }}
                                    onMouseOver={(e) => {
                                        e.target.style.transform = 'translateY(-2px)';
                                        e.target.style.boxShadow = `0 6px 16px ${colors.primary}50`;
                                    }}
                                    onMouseOut={(e) => {
                                        e.target.style.transform = 'translateY(0)';
                                        e.target.style.boxShadow = `0 4px 12px ${colors.primary}40`;
                                    }}
                                >
                                    {t('driver_dashboard.start_trip')}
                                </button>
                            )}
                            {currentTrip.estado === 'en_curso' && (
                                <button
                                    onClick={() => handleUpdateStatus('completado')}
                                    style={{
                                        flex: 1,
                                        padding: '1rem',
                                        background: colors.secondary,
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '0.75rem',
                                        fontWeight: 'bold',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s',
                                        boxShadow: `0 4px 12px ${colors.secondary}40`
                                    }}
                                    onMouseOver={(e) => {
                                        e.target.style.transform = 'translateY(-2px)';
                                        e.target.style.boxShadow = `0 6px 16px ${colors.secondary}50`;
                                    }}
                                    onMouseOut={(e) => {
                                        e.target.style.transform = 'translateY(0)';
                                        e.target.style.boxShadow = `0 4px 12px ${colors.secondary}40`;
                                    }}
                                >
                                    {t('driver_dashboard.complete_trip')}
                                </button>
                            )}
                        </div>
                    </div>
                )}

                {!currentTrip && (
                    <div>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827', marginBottom: '1.5rem' }}>
                            📋 {t('driver_dashboard.pending_requests')}
                        </h2>
                        {viajes.length === 0 ? (
                            <div style={{
                                backgroundColor: 'white',
                                padding: '3rem',
                                borderRadius: '1rem',
                                textAlign: 'center',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
                            }}>
                                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
                                <p style={{ color: '#6b7280', fontSize: '1.125rem' }}>
                                    {t('driver_dashboard.no_requests')}
                                </p>
                            </div>
                        ) : (
                            <div style={{ display: 'grid', gap: '1.5rem' }}>
                                {viajes.map((viaje) => (
                                    <div
                                        key={viaje.id}
                                        style={{
                                            backgroundColor: 'white',
                                            padding: '1.5rem',
                                            borderRadius: '1rem',
                                            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                                            border: '1px solid #e5e7eb',
                                            transition: 'all 0.2s'
                                        }}
                                        onMouseOver={(e) => {
                                            e.currentTarget.style.transform = 'translateY(-4px)';
                                            e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.12)';
                                        }}
                                        onMouseOut={(e) => {
                                            e.currentTarget.style.transform = 'translateY(0)';
                                            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)';
                                        }}
                                    >
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                                            <div>
                                                <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>{t('client_dashboard.client')}</div>
                                                <div style={{ fontSize: '1.125rem', fontWeight: '600', color: '#111827' }}>
                                                    {viaje.cliente?.name || 'N/A'}
                                                </div>
                                            </div>
                                            <div style={{
                                                padding: '0.375rem 0.75rem',
                                                background: `${colors.accent}20`,
                                                color: colors.accent,
                                                borderRadius: '0.5rem',
                                                fontSize: '0.875rem',
                                                fontWeight: '600'
                                            }}>
                                                {t('driver_dashboard.new_tag')}
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleAcceptTrip(viaje.id)}
                                            style={{
                                                width: '100%',
                                                padding: '0.875rem',
                                                background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '0.75rem',
                                                fontWeight: 'bold',
                                                cursor: 'pointer',
                                                transition: 'all 0.2s',
                                                boxShadow: `0 4px 12px ${colors.primary}40`
                                            }}
                                            onMouseOver={(e) => {
                                                e.target.style.transform = 'translateY(-2px)';
                                                e.target.style.boxShadow = `0 6px 16px ${colors.primary}50`;
                                            }}
                                            onMouseOut={(e) => {
                                                e.target.style.transform = 'translateY(0)';
                                                e.target.style.boxShadow = `0 4px 12px ${colors.primary}40`;
                                            }}
                                        >
                                            {t('driver_dashboard.accept_trip')}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
};

export default MotoristaDashboard;
