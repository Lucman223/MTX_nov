import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';
import useNotifications from '../../hooks/useNotifications';
import InstallPrompt from '../../components/Common/InstallPrompt';
import { useTranslation } from 'react-i18next';
import SEO from '../../components/Common/SEO';
import { Card, Button, Badge, Modal } from '../../components/Common/UIComponents';
import BottomNav from '../../components/Common/BottomNav';
import LanguageSwitcher from '../../components/Common/LanguageSwitcher';
import TripPhaseTracker from '../../components/Viaje/TripPhaseTracker';
import '../../../css/components.css';
import { Star, LayoutDashboard, History, User, LogOut, Crown } from 'lucide-react';

const MotoristaDashboard = () => {
    const { logout, user, refreshUser } = useAuth();
    const { t } = useTranslation();
    const navigate = useNavigate();

    const [stats, setStats] = useState(null);
    const [status, setStatus] = useState(null);
    const [viajes, setViajes] = useState([]);
    const [currentTrip, setCurrentTrip] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isOnline, setIsOnline] = useState(false);
    const [profile, setProfile] = useState(null);
    const [ratingModalOpen, setRatingModalOpen] = useState(false);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [lastFinishedTripId, setLastFinishedTripId] = useState(null);
    const [isTogglingStatus, setIsTogglingStatus] = useState(false);
    const [geoError, setGeoError] = useState(null);
    const statusLockRef = React.useRef(false);

    const fetchData = async (isManual = false) => {
        if (!isManual) setLoading(true);
        const ts = Date.now();
        try {
            try {
                const statsRes = await axios.get(`/api/motorista/stats?t=${ts}`);
                setStats(statsRes.data);
            } catch (e) { }

            try {
                const profileRes = await axios.get(`/api/motorista/perfil?t=${ts}`);
                setProfile(profileRes.data);

                if (!statusLockRef.current) {
                    const serverIsOnline = profileRes.data.estado_actual === 'activo';
                    setIsOnline(serverIsOnline);
                }
            } catch (e) { }

            const activeRes = await axios.get(`/api/viajes/actual?t=${ts}`);
            if (activeRes.data && activeRes.data.id) {
                const trip = activeRes.data;
                trip.origen_lat = parseFloat(trip.origen_lat);
                trip.origen_lng = parseFloat(trip.origen_lng);
                trip.destino_lat = parseFloat(trip.destino_lat);
                trip.destino_lng = parseFloat(trip.destino_lng);
                setCurrentTrip(trip);
                setViajes([]);
            } else {
                setCurrentTrip(null);
                const pendingRes = await axios.get(`/api/motorista/viajes/solicitados?t=${ts}`);
                setViajes(Array.isArray(pendingRes.data) ? pendingRes.data : []);
            }
        } finally {
            if (!isManual) setLoading(false);
        }
    };

    useEffect(() => {
        refreshUser();
        fetchData();
        const interval = setInterval(fetchData, 10000);

        const locationInterval = setInterval(() => {
            if ("geolocation" in navigator) {
                navigator.geolocation.getCurrentPosition(async (position) => {
                    setGeoError(null);
                    const { latitude, longitude } = position.coords;
                    try {
                        await axios.put('/api/motorista/ubicacion', { latitude, longitude });
                    } catch (err) {
                        console.error("[GEO] Failed to update backend:", err);
                    }
                }, (error) => {
                    setGeoError(error.code === error.PERMISSION_DENIED ? 'denied' : 'error');
                });
            } else {
                setGeoError('not_supported');
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
            const msg = error.response?.data?.error || t('driver_dashboard.accept_error');
            if (msg.includes('not active')) {
                toast.error(t('driver_dashboard.offline_error'));
            } else {
                toast.error(msg);
            }
        }
    };

    const toggleStatus = async () => {
        if (isTogglingStatus || currentTrip) return;

        const newIsOnline = !isOnline;
        const newStatus = newIsOnline ? 'activo' : 'inactivo';

        statusLockRef.current = true;
        setIsTogglingStatus(true);
        setIsOnline(newIsOnline);

        const promise = axios.put('/api/motorista/status', { estado_actual: newStatus });

        toast.promise(promise, {
            loading: t('common.saving'),
            success: (response) => {
                if (response.data && response.data.data) {
                    setProfile(prev => ({ ...prev, ...response.data.data }));
                    setIsOnline(response.data.data.estado_actual === 'activo');
                }
                return newIsOnline ? t('driver_dashboard.online_msg') : t('driver_dashboard.offline_msg');
            },
            error: (err) => {
                setIsOnline(!newIsOnline);
                const errorMsg = err.response?.data?.error || '';
                if (errorMsg.includes('Subscription required') || err.response?.status === 403) {
                    setTimeout(() => navigate('/motorista/suscripciones'), 2000);
                    return t('driver_dashboard.subscription_required');
                }
                return t('driver_dashboard.update_error');
            },
            finally: () => {
                setTimeout(() => setIsTogglingStatus(false), 500);
                setTimeout(() => statusLockRef.current = false, 12000);
            }
        });
    };

    const handleUpdateStatus = async (newStatus) => {
        if (!currentTrip) return;
        try {
            await axios.put(`/api/motorista/viajes/${currentTrip.id}/status`, { estado: newStatus });
            toast.success(t('driver_dashboard.status_updated', { status: t(`status.${newStatus}`) }));

            if (newStatus === 'completado') {
                setLastFinishedTripId(currentTrip.id);
                setRatingModalOpen(true);
            }
            fetchData();
        } catch (error) {
            toast.error(error.response?.data?.error || t('driver_dashboard.update_error'));
        }
    };

    const submitRatingOnly = async () => {
        const tripId = lastFinishedTripId || currentTrip?.id;
        if (!tripId) {
            setRatingModalOpen(false);
            return;
        }

        try {
            await axios.post(`/api/viajes/${tripId}/calificar`, {
                puntuacion: rating,
                comentario: comment,
                tipo: 'motorista_a_cliente'
            });

            toast.success(t('driver_dashboard.rating_modal.success'));
            setRatingModalOpen(false);
            setRating(5);
            setComment('');
            fetchData();
        } catch (error) {
            toast.error(t('driver_dashboard.rating_modal.error'));
        }
    };

    const openGoogleMaps = () => {
        if (!currentTrip) return;
        const url = `https://www.google.com/maps/dir/?api=1&origin=${currentTrip.origen_lat},${currentTrip.origen_lng}&destination=${currentTrip.destino_lat},${currentTrip.destino_lng}&travelmode=driving`;
        window.open(url, '_blank');
    };

    const handleWithdraw = async () => {
        if (!profile || profile.billetera <= 0) {
            toast.error(t('driver_dashboard.insufficient_funds'));
            return;
        }
        try {
            await axios.post('/api/motorista/retirar', { monto: profile.billetera });
            toast.success(t('driver_dashboard.withdraw_success'));
            fetchData();
        } catch (error) {
            toast.error(error.response?.data?.error || t('common.error'));
        }
    };

    return (
        <div className="dashboard-container driver-theme">
            <SEO title={t('nav.dashboard')} />
            <InstallPrompt />

            <header className="mtx-header driver-header">
                <div className="mtx-header-brand">
                    <img src="/logo.png" alt="MotoTX Logo" className="mtx-header-logo" />
                    <div className="mtx-header-text">
                        <h1 className="header-title">MotoTX</h1>
                        <span className="header-subtitle">
                            {user?.name || t('driver_dashboard.driver_role')}
                        </span>
                    </div>
                </div>

                <div className="desktop-nav">
                    <button
                        onClick={toggleStatus}
                        disabled={!!currentTrip || isTogglingStatus}
                        className={`status-badge ${currentTrip ? 'in-service' : (isOnline ? 'online' : 'offline')} ${isTogglingStatus ? 'is-loading' : ''}`}
                    >
                        {isTogglingStatus ? (
                            <span className="animate-spin">↻</span>
                        ) : (
                            currentTrip ? t('driver_dashboard.in_service') : (isOnline ? t('driver_dashboard.status_online') : t('driver_dashboard.status_offline'))
                        )}
                    </button>

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
                    <div className="nav-divider"></div>
                    <LanguageSwitcher />
                </div>

                <button
                    className={`mobile-status-toggle ${currentTrip ? 'in-service' : (isOnline ? 'online' : 'offline')} ${isTogglingStatus ? 'is-loading' : ''}`}
                    onClick={toggleStatus}
                    disabled={!!currentTrip || isTogglingStatus}
                >
                    {isTogglingStatus ? (
                        <div className="animate-spin" style={{ width: '20px', height: '20px', border: '2px solid', borderTopColor: 'transparent', borderRadius: '50%' }}></div>
                    ) : (
                        currentTrip ? "🟢" : (isOnline ? 'ON' : 'OFF')
                    )}
                </button>
            </header>


            <main className="main-content-centered" style={{ paddingBottom: '80px' }}>
                {geoError && (
                    <div className="alert alert--error mb-4">
                        <strong>⚠️ {t('common.error')}:</strong> {geoError}
                    </div>
                )}

                {user?.status === 'pendiente' && (
                    <div className="alert alert--warning mb-4" style={{ background: '#fff7ed', border: '1px solid #fb923c', padding: '1rem', borderRadius: '0.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <span style={{ fontSize: '1.5rem' }}>⏳</span>
                            <div>
                                <strong>{t('common.account_pending_title')}</strong>
                                <p style={{ margin: 0, fontSize: '0.875rem' }}>{t('common.account_pending_desc')}</p>
                            </div>
                        </div>
                    </div>
                )}

                {profile?.viajes_prueba_restantes > 0 && (
                    <div className="alert alert--info mb-4" style={{ background: '#eff6ff', border: '1px solid #93c5fd', padding: '1rem', borderRadius: '0.5rem', display: 'flex', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <span style={{ fontSize: '1.5rem' }}>🎁</span>
                            <div>
                                <strong>Viajes de Prueba</strong>
                                <span style={{ display: 'block', fontSize: '0.875rem' }}>Te quedan {profile.viajes_prueba_restantes} viajes gratuitos.</span>
                            </div>
                        </div>
                    </div>
                )}

                {user?.status === 'aprobado' && profile && profile.viajes_prueba_restantes === 0 && !profile.suscripcion_activa && (
                    <div className="alert alert--warning mb-4">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                            <span style={{ fontSize: '1.5rem' }}>👑</span>
                            <strong>{t('driver_dashboard.access_blocked')}</strong>
                        </div>
                        <p style={{ margin: '0 0 1rem 0', fontSize: '0.875rem' }}>{t('driver_dashboard.blocked_desc')}</p>
                        <Button onClick={() => navigate('/motorista/suscripciones')} className="btn btn--block" style={{ backgroundColor: '#f97316', color: 'white', border: 'none' }}>
                            {t('driver_dashboard.activate_plan')}
                        </Button>
                    </div>
                )}

                {loading && <div className="loading-state">{t('common.loading')}</div>}

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
                            <Button onClick={handleWithdraw} disabled={profile.billetera <= 0} className="btn btn--block" style={{ background: 'white', color: '#10b981', border: 'none' }}>
                                💸 {t('driver_dashboard.withdraw_btn')}
                            </Button>

                            <div className="stats-row" style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                <div className="stat-item" style={{ flex: 1, textAlign: 'center' }}>
                                    <div className="stat-label">{t('driver_dashboard.trips_today')}</div>
                                    <div className="stat-value">{stats?.today_trips || 0}</div>
                                </div>
                                <div className="stat-item highlight" style={{ flex: 1, textAlign: 'center' }}>
                                    <div className="stat-label">⚡ {t('driver_dashboard.savings')}</div>
                                    <div className="stat-value">{stats?.commission_saved || 0} CFA</div>
                                </div>
                            </div>
                        </div>
                    </Card>
                )}

                {currentTrip && (
                    <Card accent className="active-trip-card mt-4">
                        <h2 className="card-title-active">🚀 {t('client_dashboard.trip_active')}</h2>
                        <TripPhaseTracker estado={currentTrip.estado} />

                        <div className="trip-details-grid" style={{ marginTop: '1rem' }}>
                            <div style={{ marginBottom: '1rem' }}>
                                <strong>{t('client_dashboard.client')}: </strong> {currentTrip.cliente?.name || 'N/A'}
                            </div>
                            <div style={{ marginBottom: '1rem' }}>
                                <strong>📍 {t('client_dashboard.origin')}: </strong> {currentTrip.origen || 'Ubicación de Origen'}
                            </div>
                            <div style={{ marginBottom: '1rem' }}>
                                <strong>🏁 {t('client_dashboard.destination')}: </strong> {currentTrip.destino || 'Destino'}
                            </div>
                        </div>

                        <div className="trip-actions" style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <Button onClick={openGoogleMaps} variant="outline" className="w-full">
                                🗺️ Navegar con Maps
                            </Button>

                            {currentTrip.estado === 'aceptado' && (
                                <Button onClick={() => handleUpdateStatus('en_curso')} className="w-full" variant="primary">
                                    {t('driver_dashboard.start_trip')}
                                </Button>
                            )}
                            {currentTrip.estado === 'en_curso' && (
                                <Button onClick={() => handleUpdateStatus('completado')} className="w-full" style={{ background: '#10b981', color: 'white' }}>
                                    {t('driver_dashboard.complete_trip')}
                                </Button>
                            )}
                        </div>
                    </Card>
                )}

                {!currentTrip && (
                    <div className="requests-section mt-4">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                            <h2 style={{ fontSize: '1.2rem', margin: 0 }}>📋 {t('driver_dashboard.pending_requests')}</h2>
                            <Button onClick={fetchData} variant="ghost" size="sm">🔄</Button>
                        </div>

                        {(Array.isArray(viajes) && viajes.length === 0) ? (
                            <Card className="empty-state text-center" style={{ padding: '2rem' }}>
                                <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🔍</div>
                                <p>{t('driver_dashboard.no_requests')}</p>
                            </Card>
                        ) : (
                            <div className="requests-grid" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {Array.isArray(viajes) && viajes.map((viaje) => (
                                    <Card key={viaje.id}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                            <strong>{viaje.cliente?.name || 'Cliente'}</strong>
                                            <Badge variant="accent">{t('driver_dashboard.new_tag')}</Badge>
                                        </div>
                                        <div style={{ fontSize: '0.9rem', marginBottom: '1rem', color: '#64748b' }}>
                                            <div style={{ marginBottom: '0.5rem' }}>📍 {viaje.origen || 'Origen'}</div>
                                            <div>🏁 {viaje.destino || 'Destino'}</div>
                                        </div>
                                        <Button onClick={() => handleAcceptTrip(viaje.id)} className="w-full" variant="primary">
                                            {t('driver_dashboard.accept_trip')}
                                        </Button>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </main>

            {ratingModalOpen && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                    <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.5rem', width: '90%', maxWidth: '400px' }}>
                        <h3 className="text-lg font-bold mb-4">{t('driver_dashboard.rating_modal.title')}</h3>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button key={star} onClick={() => setRating(star)} style={{ border: 'none', background: 'none' }}>
                                    <Star size={36} fill={star <= rating ? "#f59e0b" : "none"} stroke={star <= rating ? "#f59e0b" : "#cbd5e1"} />
                                </button>
                            ))}
                        </div>
                        <textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder={t('driver_dashboard.rating_modal.placeholder')} style={{ width: '100%', padding: '0.5rem', border: '1px solid #e2e8f0', borderRadius: '0.5rem', marginBottom: '1rem' }} rows="3" />
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                            <Button variant="ghost" onClick={() => setRatingModalOpen(false)}>{t('common.cancel')}</Button>
                            <Button variant="primary" onClick={submitRatingOnly}>{t('driver_dashboard.rating_modal.submit')}</Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MotoristaDashboard;
