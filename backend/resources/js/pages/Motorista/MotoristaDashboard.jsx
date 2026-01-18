import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';
import useNotifications from '../../hooks/useNotifications';
import InstallPrompt from '../../components/Common/InstallPrompt';
import { useTranslation } from 'react-i18next';
import SEO from '../../components/Common/SEO';
import { Card, Button, Badge } from '../../components/Common/UIComponents';
import LanguageSwitcher from '../../components/Common/LanguageSwitcher';
import '../../../css/components.css';

/**
 * MotoristaDashboard Component
 *
 * [ES] Interfaz dedicada para Conductores (Motoristas).
 *      Funcionalidades Clave: Toggle Online/Offline, Gestión de viajes, Resumen de ganancias.
 *
 * [FR] Interface dédiée pour les Chauffeurs (Motoristas).
 *      Fonctionnalités Clés : Bascule En ligne/Hors ligne, Gestion des voyages, Aperçu des revenus.
 *
 * @component
 */
const MotoristaDashboard = () => {
    const { logout, user } = useAuth();
    const { t } = useTranslation();
    const navigate = useNavigate();

    // Color system
    const colors = {
        primary: '#2563eb',
        secondary: '#10b981',
        accent: '#f59e0b',
        error: '#ef4444'
    };

    const [stats, setStats] = useState(null);
    const [status, setStatus] = useState(null);
    const [viajes, setViajes] = useState([]);
    const [currentTrip, setCurrentTrip] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isOnline, setIsOnline] = useState(false);
    const [profile, setProfile] = useState(null);

    const fetchData = async () => {
        setLoading(true);
        try {
            // Fetch Stats
            try {
                const statsRes = await axios.get('/api/motorista/stats');
                setStats(statsRes.data);
            } catch (e) { console.error('Error fetching stats', e); }

            // Fetch Profile (Wallet Balance)
            try {
                const profileRes = await axios.get('/api/motorista/perfil');
                setProfile(profileRes.data);
                setIsOnline(profileRes.data.estado_actual === 'activo');
            } catch (e) { console.error('Error fetching profile', e); }

            const activeRes = await axios.get('/api/motorista/viajes/actual'); // Corrected endpoint if needed
            if (activeRes.data && activeRes.data.id) {
                setCurrentTrip(activeRes.data);
                setViajes([]);
            } else {
                setCurrentTrip(null);
                const pendingRes = await axios.get('/api/motorista/viajes/solicitados');
                setViajes(Array.isArray(pendingRes.data) ? pendingRes.data : []);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    // ... (rest of useEffects) ...

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
            await axios.put(`/api/motorista/viajes/${currentTrip.id}/status`, { estado: newStatus });
            toast.success(t('driver_dashboard.status_updated', { status: newStatus }));
            fetchData();
        } catch (error) {
            console.error('Error updating status:', error);
            toast.error(t('driver_dashboard.update_error'));
        }
    };

    const handleWithdraw = async () => {
        if (!profile || profile.billetera <= 0) {
            toast.error(t('driver_dashboard.insufficient_funds'));
            return;
        }

        try {
            const res = await axios.post('/api/motorista/retirar', { monto: profile.billetera });
            toast.success(t('driver_dashboard.withdraw_success'));
            fetchData();
        } catch (error) {
            toast.error(error.response?.data?.error || 'Error processing withdrawal');
        }
    };

    // Simplified: No longer need isMobile state as we use CSS Media Queries

    return (
        <div className="dashboard-container driver-theme">
            <SEO title={t('nav.dashboard')} />
            <InstallPrompt />

            <header className="mtx-header driver-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <img src="/logo.png" alt="MotoTX Logo" className="mtx-header-logo" style={{ height: '3.5rem', objectFit: 'contain' }} />
                    <div>
                        <h1 className="header-title" style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--secondary-color)', margin: 0 }}>
                            MotoTX Motorista
                        </h1>
                        <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                            {user?.name || t('driver_dashboard.driver_role')}
                        </span>
                    </div>
                </div>

                <div className="desktop-nav" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <div
                        onClick={currentTrip ? null : handleToggleStatus}
                        className={`status-badge ${currentTrip ? 'in-service' : (isOnline ? 'online' : 'offline')}`}
                    >
                        {currentTrip ? t('driver_dashboard.in_service') : (isOnline ? t('driver_dashboard.status_online') : t('driver_dashboard.status_offline'))}
                        {!currentTrip && <span className="refresh-icon">↻</span>}
                    </div>

                    <Button variant="outline" onClick={() => navigate('/motorista/historial')} className="nav-btn-secondary">
                        {t('client_dashboard.history')}
                    </Button>

                    <Button variant="accent" onClick={() => navigate('/motorista/suscripciones')} className="nav-btn-premium">
                        👑 {t('nav.forfaits')}
                    </Button>

                    <Button variant="outline" onClick={() => navigate('/motorista/perfil')} className="nav-btn-profile">
                        {t('client_dashboard.profile')}
                    </Button>

                    <Button variant="error" onClick={handleLogout} className="nav-btn-logout">
                        {t('common.logout')}
                    </Button>

                    <div className="nav-divider" style={{ width: '1px', height: '2rem', background: 'var(--border-color)', margin: '0 0.5rem', opacity: 0.3 }}></div>
                    <LanguageSwitcher />
                </div>

                {/* Mobile Status Badge */}
                <div
                    className={`mobile-status-toggle ${currentTrip ? 'in-service' : (isOnline ? 'online' : 'offline')}`}
                    onClick={currentTrip ? null : handleToggleStatus}
                >
                    {currentTrip ? t('driver_dashboard.in_service') : (isOnline ? 'ON' : 'OFF')}
                </div>
            </header>

            {/* Mobile Bottom Nav */}
            <nav className="mobile-bottom-nav">
                <Button variant="ghost" className="active" label={t('nav.dashboard')}>
                    <span style={{ fontSize: '1.25rem' }}>🏠</span>
                    {t('nav.dashboard')}
                </Button>
                <Button variant="ghost" onClick={() => navigate('/motorista/historial')} label={t('client_dashboard.history')}>
                    <span style={{ fontSize: '1.25rem' }}>📋</span>
                    {t('client_dashboard.history')}
                </Button>
                <Button variant="ghost" onClick={() => navigate('/motorista/perfil')} label={t('client_dashboard.profile')}>
                    <span style={{ fontSize: '1.25rem' }}>👤</span>
                    {t('client_dashboard.profile')}
                </Button>
                <Button variant="ghost" onClick={handleLogout} label={t('common.logout')} className="text-error">
                    <span style={{ fontSize: '1.25rem' }}>🚪</span>
                    {t('common.logout')}
                </Button>
            </nav>

            <main className="main-content-centered">
                {loading && <div className="loading-state">{t('common.loading')}</div>}

                {/* Wallet Card */}
                {profile && (
                    <Card className="wallet-card">
                        <div className="wallet-info">
                            <div className="wallet-label">{t('driver_dashboard.wallet_title')}</div>
                            <div className="wallet-amount">
                                {profile.billetera} <span className="currency">CFA</span>
                            </div>
                            <div className="wallet-desc">{t('driver_dashboard.payout_daily_desc')}</div>
                        </div>

                        <div className="wallet-actions">
                            <Button
                                onClick={handleWithdraw}
                                disabled={profile.billetera <= 0}
                                className="withdraw-btn"
                            >
                                💸 {t('driver_dashboard.withdraw_btn')}
                            </Button>

                            <div className="stats-row">
                                <div className="stat-item">
                                    <div className="stat-label">{t('nav.trips')} (Hoy)</div>
                                    <div className="stat-value">{stats?.today_trips || 0}</div>
                                </div>
                                <div className="stat-item highlight">
                                    <div className="stat-label">⚡ Ahorro</div>
                                    <div className="stat-value">{stats?.commission_saved || 0} CFA</div>
                                </div>
                            </div>
                        </div>
                    </Card>
                )}

                {/* Active Trip */}
                {currentTrip && (
                    <Card className="active-trip-card">
                        <h2 className="card-title-active">🚀 {t('client_dashboard.trip_active')}</h2>
                        <div className="trip-details-grid">
                            <div className="detail-item">
                                <div className="detail-label">{t('client_dashboard.client')}</div>
                                <div className="detail-value">{currentTrip.cliente?.name || 'N/A'}</div>
                            </div>
                            <div className="detail-item">
                                <div className="detail-label">{t('client_dashboard.state')}</div>
                                <div className="detail-value status-active">{currentTrip.estado}</div>
                            </div>
                        </div>

                        <div className="trip-actions">
                            {currentTrip.estado === 'aceptado' && (
                                <Button onClick={() => handleUpdateStatus('en_curso')} className="w-full">
                                    {t('driver_dashboard.start_trip')}
                                </Button>
                            )}
                            {currentTrip.estado === 'en_curso' && (
                                <Button onClick={() => handleUpdateStatus('completado')} variant="secondary" className="w-full">
                                    {t('driver_dashboard.complete_trip')}
                                </Button>
                            )}
                        </div>
                    </Card>
                )}

                {/* Pending Requests */}
                {!currentTrip && (
                    <div className="requests-section">
                        <h2 className="section-title">📋 {t('driver_dashboard.pending_requests')}</h2>
                        {viajes.length === 0 ? (
                            <Card className="empty-state">
                                <div className="empty-icon">🔍</div>
                                <p className="empty-text">{t('driver_dashboard.no_requests')}</p>
                            </Card>
                        ) : (
                            <div className="requests-grid">
                                {viajes.map((viaje) => (
                                    <Card key={viaje.id} className="request-item-card">
                                        <div className="request-header">
                                            <div>
                                                <div className="detail-label">{t('client_dashboard.client')}</div>
                                                <div className="detail-value">{viaje.cliente?.name || 'N/A'}</div>
                                            </div>
                                            <Badge variant="accent">{t('driver_dashboard.new_tag')}</Badge>
                                        </div>
                                        <Button onClick={() => handleAcceptTrip(viaje.id)} className="w-full">
                                            {t('driver_dashboard.accept_trip')}
                                        </Button>
                                    </Card>
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
