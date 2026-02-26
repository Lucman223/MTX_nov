import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import SEO from '../../components/Common/SEO';
import { useNavigate } from 'react-router-dom';
import MapSelection from './MapSelection';
import axios from 'axios';
import { toast } from 'sonner';
import useNotifications from '../../hooks/useNotifications';
import { useTranslation } from 'react-i18next';
import { Card, Button, Badge } from '../../components/Common/UIComponents';
import LanguageSwitcher from '../../components/Common/LanguageSwitcher';
import TripPhaseTracker from '../../components/Viaje/TripPhaseTracker';
import BottomNav from '../../components/Common/BottomNav';
import { Star, LayoutDashboard, History, User } from 'lucide-react';
import '../../../css/components.css';

const safeParseCoord = (val, label = 'unknown') => {
    const parsed = parseFloat(val);
    if (isNaN(parsed)) return 0;
    return parsed;
};

const ClienteDashboard = () => {
    const { logout, user, refreshUser } = useAuth();
    const { t } = useTranslation();
    const navigate = useNavigate();

    const [origen, setOrigen] = useState(null);
    const [destino, setDestino] = useState(null);
    const [puntoActivo, setPuntoActivo] = useState('origen');
    const [activeTrip, setActiveTrip] = useState(null);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [isSubmittingRating, setIsSubmittingRating] = useState(false);
    const [addressOrigen, setAddressOrigen] = useState('');
    const [addressDestino, setAddressDestino] = useState('');
    const [searching, setSearching] = useState(false);
    const [tripMetrics, setTripMetrics] = useState({ distance: 0, time: 0 });
    const [distanciaExcedida, setDistanciaExcedida] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    useEffect(() => {
        const checkTripStatus = async () => {
            try {
                const response = await axios.get('/api/viajes/actual');
                if (response.data && response.data.id) {
                    const polledTrip = response.data;
                    polledTrip.origen_lat = parseFloat(polledTrip.origen_lat);
                    polledTrip.origen_lng = parseFloat(polledTrip.origen_lng);
                    polledTrip.destino_lat = parseFloat(polledTrip.destino_lat);
                    polledTrip.destino_lng = parseFloat(polledTrip.destino_lng);
                    if (polledTrip.motorista?.motorista_perfil) {
                        polledTrip.motorista.motorista_perfil.latitud_actual = parseFloat(polledTrip.motorista.motorista_perfil.latitud_actual);
                        polledTrip.motorista.motorista_perfil.longitud_actual = parseFloat(polledTrip.motorista.motorista_perfil.longitud_actual);
                    }
                    setActiveTrip(polledTrip);

                    if (!origen && polledTrip.origen_lat) setOrigen([polledTrip.origen_lat, polledTrip.origen_lng]);
                    if (!destino && polledTrip.destino_lat) setDestino([polledTrip.destino_lat, polledTrip.destino_lng]);
                } else {
                    // EXAM HOTFIX: Si el backend devuelve null (viaje completado o inexistente), reseteamos el estado para no quedarnos bloqueados en "En Camino"
                    setActiveTrip(prev => prev ? null : prev);
                }
            } catch (error) { }
        };

        const interval = setInterval(checkTripStatus, 5000);
        checkTripStatus();
        return () => clearInterval(interval);
    }, []);

    const { listenToTripUpdates } = useNotifications();

    const submitRating = async () => {
        if (!activeTrip) return;
        setIsSubmittingRating(true);
        try {
            await axios.post(`/api/viajes/${activeTrip.id}/calificar`, {
                puntuacion: rating,
                comentario: comment,
                tipo: 'cliente_a_motorista'
            });
            toast.success(t('driver_dashboard.rating_modal.success'));
            setActiveTrip(null);
            setRating(5);
            setComment('');
        } catch (error) {
            toast.error(t('driver_dashboard.rating_modal.error'));
        } finally {
            setIsSubmittingRating(false);
        }
    };

    useEffect(() => {
        if (activeTrip?.id) {
            const callbacks = (updatedTrip) => {
                if (updatedTrip && updatedTrip.id) {
                    updatedTrip.origen_lat = parseFloat(updatedTrip.origen_lat);
                    updatedTrip.origen_lng = parseFloat(updatedTrip.origen_lng);
                    updatedTrip.destino_lat = parseFloat(updatedTrip.destino_lat);
                    updatedTrip.destino_lng = parseFloat(updatedTrip.destino_lng);
                    setActiveTrip(updatedTrip);
                }
            };
            callbacks.onLocationUpdate = (data) => {
                if (data.lat && data.lng) {
                    setActiveTrip(prev => {
                        if (!prev || !prev.motorista) return prev;
                        return {
                            ...prev,
                            motorista: {
                                ...prev.motorista,
                                motorista_perfil: {
                                    ...prev.motorista.motorista_perfil,
                                    latitud_actual: parseFloat(data.lat),
                                    longitud_actual: parseFloat(data.lng)
                                }
                            }
                        };
                    });
                }
            };
            return listenToTripUpdates(activeTrip.id, callbacks);
        }
    }, [activeTrip?.id]);

    const handleSolicitarViaje = async () => {
        if (!origen || !destino) return;
        try {
            const response = await axios.post('/api/viajes/solicitar', {
                origen_lat: origen[0],
                origen_lng: origen[1],
                destino_lat: destino[0],
                destino_lng: destino[1],
                origen: addressOrigen,
                destino: addressDestino
            });
            toast.success(t('auth.trip_requested_success'));
            setActiveTrip(response.data.data);
        } catch (error) {
            toast.error(`${t('common.error')}: ${error.response?.data?.error || ''}`);
        }
    };

    const forfaitsActivos = user?.cliente_forfaits?.filter(f => f.estado === 'activo') || [];
    const forfaitPrincipal = forfaitsActivos[0]?.forfait;
    const maxDistance = parseFloat(forfaitPrincipal?.distancia_maxima || 0);

    const getMetrics = (p1, p2) => {
        if (!p1 || !p2) return { distance: 0, time: 0 };
        const R = 6371;
        const dLat = (p2[0] - p1[0]) * Math.PI / 180;
        const dLon = (p2[1] - p1[1]) * Math.PI / 180;
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(p1[0] * Math.PI / 180) * Math.cos(p2[0] * Math.PI / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c;
        const time = Math.round((distance / 25) * 60);
        return { distance: (Number(distance) || 0).toFixed(1), time: Math.max(2, time) };
    };

    const reverseGeocode = async (coords, type) => {
        if (!coords) return;
        if (type === 'origen') setAddressOrigen('Buscando...');
        if (type === 'destino') setAddressDestino('Buscando...');
        try {
            const lat = parseFloat(coords[0]);
            const lng = parseFloat(coords[1]);
            const res = await axios.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
            if (res.data && res.data.display_name) {
                const shortName = res.data.display_name.split(',').slice(0, 2).join(',');
                if (type === 'origen') setAddressOrigen(shortName);
                if (type === 'destino') setAddressDestino(shortName);
            }
        } catch (error) {
            if (type === 'origen') setAddressOrigen(`${coords[0].toFixed(5)}, ${coords[1].toFixed(5)}`);
            if (type === 'destino') setAddressDestino(`${coords[0].toFixed(5)}, ${coords[1].toFixed(5)}`);
        }
    };

    useEffect(() => { if (origen) reverseGeocode(origen, 'origen'); }, [origen]);
    useEffect(() => { if (destino) reverseGeocode(destino, 'destino'); }, [destino]);

    useEffect(() => {
        if (origen && destino) {
            const metrics = getMetrics(origen, destino);
            setTripMetrics(metrics);
            setDistanciaExcedida(maxDistance > 0 && parseFloat(metrics.distance) > maxDistance);
        }
    }, [origen, destino, maxDistance]);

    useEffect(() => {
        if (origen && !destino && puntoActivo === 'origen') setPuntoActivo('destino');
    }, [origen]);

    const handleClearPoint = (type) => {
        if (type === 'origen') { setOrigen(null); setAddressOrigen(''); setPuntoActivo('origen'); }
        else { setDestino(null); setAddressDestino(''); setPuntoActivo('destino'); }
    };

    const handleAddressSearch = async (type) => {
        const query = type === 'origen' ? addressOrigen : addressDestino;
        if (!query) return;
        setSearching(true);
        try {
            const res = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}, Bamako, Mali&limit=1`);
            if (res.data && res.data.length > 0) {
                const coords = [parseFloat(res.data[0].lat), parseFloat(res.data[0].lon)];
                if (type === 'origen') { setOrigen(coords); setAddressOrigen(res.data[0].display_name.split(',')[0]); }
                else { setDestino(coords); setAddressDestino(res.data[0].display_name.split(',')[0]); }
            } else {
                toast.error(t('client_dashboard.tap_map'));
            }
        } catch (err) { } finally { setSearching(false); }
    };

    const viajesDisponibles = (user?.cliente_forfaits || []).reduce((acc, curr) => acc + (parseInt(curr.viajes_restantes) || 0), 0);

    const cancelarSolicitud = async () => {
        if (!activeTrip) return;
        try {
            await axios.post(`/api/viajes/${activeTrip.id}/cancelar`);
            setActiveTrip(null);
            toast.success("Viaje cancelado");
        } catch (e) {
            toast.error("Error al cancelar");
        }
    }

    return (
        <div className="dashboard-container">
            <SEO title={t('nav.dashboard')} />
            <header className="mtx-header">
                <div className="mtx-header-brand">
                    <img src="/logo.png" alt="MotoTX Logo" className="mtx-header-logo" />
                    <div className="mtx-header-text">
                        <h1 className="header-title">MotoTX</h1>
                        <span className="header-subtitle">{user?.name || t('auth.role_client')}</span>
                    </div>
                </div>

                <div className="desktop-nav">
                    <Badge variant="premium">{t('client_dashboard.trips_badge', { count: viajesDisponibles })}</Badge>
                    <Button onClick={() => navigate('/cliente/historial')} variant="outline">{t('client_dashboard.history')}</Button>
                    <Button onClick={() => navigate('/cliente/perfil')} variant="outline">{t('client_dashboard.profile')}</Button>
                    <Button onClick={handleLogout} variant="error">{t('common.logout')}</Button>
                    <div className="nav-divider"></div>
                    <LanguageSwitcher />
                </div>
            </header>


            <main className="main-content" style={{ paddingBottom: '80px' }}>
                <div className="side-panel">
                    {!activeTrip ? (
                        <>
                            <Card>
                                <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>📍 {t('client_dashboard.plan_trip')}</h2>
                                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', background: '#f3f4f6', padding: '0.4rem', borderRadius: '1rem' }}>
                                    <button onClick={() => setPuntoActivo('origen')} className={`btn btn--block ${puntoActivo === 'origen' ? 'btn--primary' : 'btn--ghost'}`} style={{ flex: 1, fontSize: '0.85rem' }}>📍 {t('client_dashboard.origin')}</button>
                                    <button onClick={() => setPuntoActivo('destino')} className={`btn btn--block ${puntoActivo === 'destino' ? 'btn--accent' : 'btn--ghost'}`} style={{ flex: 1, fontSize: '0.85rem' }}>🚩 {t('client_dashboard.destination')}</button>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    <div className="point-input-group">
                                        <label className="point-label-origen">{t('client_dashboard.origin')}</label>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <input type="text" placeholder={t('client_dashboard.tap_map')} value={addressOrigen} onChange={(e) => setAddressOrigen(e.target.value)} onFocus={() => setPuntoActivo('origen')} className="mtx-input" style={{ flex: 1 }} />
                                            {addressOrigen && <button onClick={() => handleClearPoint('origen')} className="btn btn--ghost">✕</button>}
                                            <Button onClick={() => handleAddressSearch('origen')} variant="ghost">🔍</Button>
                                        </div>
                                    </div>
                                    <div className="point-input-group">
                                        <label className="point-label-destino">{t('client_dashboard.destination')}</label>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <input type="text" placeholder={t('client_dashboard.tap_map')} value={addressDestino} onChange={(e) => setAddressDestino(e.target.value)} onFocus={() => setPuntoActivo('destino')} className="mtx-input" style={{ flex: 1 }} />
                                            {addressDestino && <button onClick={() => handleClearPoint('destino')} className="btn btn--ghost">✕</button>}
                                            <Button onClick={() => handleAddressSearch('destino')} variant="ghost">🔍</Button>
                                        </div>
                                    </div>
                                </div>

                                {origen && destino && (
                                    <div className={`estimated-fare-card ${distanciaExcedida ? 'limit-warning' : ''}`} style={{ marginTop: '1.5rem' }}>
                                        <div>
                                            <span className="fare-label">{distanciaExcedida ? '⚠️ ' + t('client_dashboard.limit_exceeded') : t('client_dashboard.trip_details')}</span>
                                            <span className="fare-info-mini">⏱️ {tripMetrics.time} min | 📏 {tripMetrics.distance} km</span>
                                        </div>
                                    </div>
                                )}
                                <Button onClick={handleSolicitarViaje} variant="primary" className="w-full mt-4" disabled={!origen || !destino || distanciaExcedida}>
                                    {t('client_dashboard.request_now')}
                                </Button>
                            </Card>

                            <Card accent className="mt-4">
                                <h3>{t('client_dashboard.balance_title')}</h3>
                                <div className="balance-value" style={{ fontSize: '2rem', fontWeight: 'bold' }}>{viajesDisponibles}</div>
                                <Button onClick={() => navigate('/cliente/forfaits')} variant="accent" className="w-full mt-2">{t('client_dashboard.buy_forfait')}</Button>
                            </Card>
                        </>
                    ) : (
                        <Card style={{ padding: 0, overflow: 'hidden' }}>
                            <div style={{ background: 'var(--primary-color)', color: 'white', padding: '1.5rem', textAlign: 'center' }}>
                                <h2>{activeTrip.estado === 'solicitado' ? t('client_dashboard.searching_driver') : (activeTrip.estado === 'aceptado' ? t('client_dashboard.trip_active') : t('client_dashboard.trip_active'))}</h2>
                            </div>

                            <div style={{ padding: '1.25rem' }}>
                                {activeTrip.estado === 'completado' ? (
                                    <div style={{ textAlign: 'center' }}>
                                        <h3 style={{ marginBottom: '1rem' }}>{t('client_dashboard.rate_trip') || 'Califica tu viaje'}</h3>
                                        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                                            {[1, 2, 3, 4, 5].map((s) => (
                                                <Star key={s} size={32} fill={s <= rating ? "#f59e0b" : "none"} stroke={s <= rating ? "#f59e0b" : "#cbd5e1"} onClick={() => setRating(s)} />
                                            ))}
                                        </div>
                                        <Button variant="primary" onClick={submitRating} className="w-full" disabled={isSubmittingRating}>
                                            {t('driver_dashboard.rating_modal.submit')}
                                        </Button>
                                    </div>
                                ) : (
                                    <>
                                        <TripPhaseTracker estado={activeTrip.estado} />
                                        {activeTrip.motorista && (
                                            <div style={{ marginTop: '1rem', background: '#f8fafc', padding: '1rem', borderRadius: '0.5rem' }}>
                                                <div style={{ fontWeight: 'bold' }}>🏍️ {activeTrip.motorista.name}</div>
                                                <div style={{ color: '#64748b', fontSize: '0.9rem' }}>{activeTrip.motorista.motorista_perfil?.matricula}</div>
                                            </div>
                                        )}
                                    </>
                                )}
                                {activeTrip.estado === 'solicitado' && (
                                    <Button onClick={cancelarSolicitud} variant="ghost" className="w-full mt-4" style={{ color: '#ef4444' }}>
                                        {t('common.cancel_request')}
                                    </Button>
                                )}
                            </div>
                        </Card>
                    )}
                </div>

                <div className="map-panel">
                    <MapSelection
                        origen={origen} setOrigen={setOrigen}
                        destino={destino} setDestino={setDestino}
                        puntoActivo={puntoActivo}
                        motoristaPos={activeTrip?.motorista?.motorista_perfil ? [parseFloat(activeTrip.motorista.motorista_perfil.latitud_actual), parseFloat(activeTrip.motorista.motorista_perfil.longitud_actual)] : null}
                    />
                </div>
            </main>
            <BottomNav role="cliente" />
        </div>
    );
};

export default ClienteDashboard;