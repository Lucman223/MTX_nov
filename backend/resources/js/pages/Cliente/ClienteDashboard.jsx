
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
import '../../../css/components.css';

/**
 * ClienteDashboard Component
 *
 * [ES] Interfaz principal para el rol de Cliente.
 *      Características: Mapa interactivo (Leaflet), actualizaciones en tiempo real, saldo de Forfait.
 *
 * [FR] Interface principale pour le rôle Client.
 *      Fonctionnalités : Carte interactive (Leaflet), mises à jour en temps réel, solde Forfait.
 *
 * @component
 */
const ClienteDashboard = () => {
    const { logout, user } = useAuth();
    const { t } = useTranslation();
    const navigate = useNavigate();

    const [origen, setOrigen] = useState(null);
    const [destino, setDestino] = useState(null);
    const [puntoActivo, setPuntoActivo] = useState('origen'); // 'origen' | 'destino'
    const [activeTrip, setActiveTrip] = useState(null);

    // Color system (Accessible)
    const colors = {
        primary: '#2563eb',
        secondary: '#059669',
        accent: '#b45309',
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
            alert(`Error: ${msg} `);
        }
    };

    const [addressOrigen, setAddressOrigen] = useState('');
    const [addressDestino, setAddressDestino] = useState('');
    const [searching, setSearching] = useState(false);
    const [tripMetrics, setTripMetrics] = useState({ distance: 0, time: 0 });
    const [distanciaExcedida, setDistanciaExcedida] = useState(false);

    // Get Active Forfait Limit
    const forfaitsActivos = user?.cliente_forfaits?.filter(f => f.estado === 'activo') || [];
    const forfaitPrincipal = forfaitsActivos[0]?.forfait;
    const maxDistance = parseFloat(forfaitPrincipal?.distancia_maxima || 0);
    // Haversine formula to calculate distance in km
    const getMetrics = (p1, p2) => {
        if (!p1 || !p2) return { distance: 0, time: 0 };
        const R = 6371; // Earth radius in km
        const dLat = (p2[0] - p1[0]) * Math.PI / 180;
        const dLon = (p2[1] - p1[1]) * Math.PI / 180;
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(p1[0] * Math.PI / 180) * Math.cos(p2[0] * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c;
        // Velocidad promedio en Bamako (moto): 25 km/h
        const time = Math.round((distance / 25) * 60);
        return { distance: distance.toFixed(1), time: Math.max(2, time) };
    };

    useEffect(() => {
        if (origen && destino) {
            const metrics = getMetrics(origen, destino);
            setTripMetrics(metrics);

            if (maxDistance > 0 && parseFloat(metrics.distance) > maxDistance) {
                setDistanciaExcedida(true);
            } else {
                setDistanciaExcedida(false);
            }
        }
    }, [origen, destino, maxDistance]);

    const handleAddressSearch = async (type) => {
        const query = type === 'origen' ? addressOrigen : addressDestino;
        if (!query) return;

        setSearching(true);
        try {
            // Buscamos específicamente en Bamako, Mali para mayor precisión
            const res = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}, Bamako, Mali&limit=1`);
            if (res.data && res.data.length > 0) {
                const { lat, lon, display_name } = res.data[0];
                const coords = [parseFloat(lat), parseFloat(lon)];

                if (type === 'origen') {
                    setOrigen(coords);
                    setAddressOrigen(display_name.split(',')[0]); // Nombre corto
                } else {
                    setDestino(coords);
                    setAddressDestino(display_name.split(',')[0]);
                }
                toast.success(t('common.success'));
            } else {
                toast.error(t('client_dashboard.tap_map'));
            }
        } catch (err) {
            console.error("Geocoding error", err);
            toast.error("Error al buscar dirección");
        } finally {
            setSearching(false);
        }
    };

    const forfaits = user?.cliente_forfaits || [];
    const viajesDisponibles = forfaits.reduce((acc, curr) => acc + (parseInt(curr.viajes_restantes) || 0), 0);

    console.log('UserData:', user, 'Forfaits:', forfaits, 'Balance:', viajesDisponibles);

    // Simplified: No longer need isMobile state as we use CSS Media Queries

    return (
        <div className="dashboard-container">
            <SEO title={t('nav.dashboard')} />

            {/* Header */}
            <header className="mtx-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <img src="/logo.png" alt="MotoTX Logo" className="mtx-header-logo" style={{ height: '3.5rem', objectFit: 'contain' }} />
                    <div>
                        <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary-color)', margin: 0 }}>MotoTX</h1>
                        <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                            {user?.name || 'Cliente'}
                        </span>
                    </div>
                </div>

                {/* Desktop Nav */}
                <div className="desktop-nav" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <Badge variant="premium">
                        {t('client_dashboard.trips_badge', { count: viajesDisponibles })}
                    </Badge>

                    <Button onClick={() => navigate('/cliente/historial')} variant="outline" className="nav-btn-history">
                        {t('client_dashboard.history')}
                    </Button>

                    <Button onClick={() => navigate('/cliente/perfil')} variant="outline" className="nav-btn-profile">
                        {t('client_dashboard.profile')}
                    </Button>

                    <Button onClick={handleLogout} variant="error" className="nav-btn-logout">
                        {t('common.logout')}
                    </Button>

                    <div className="nav-divider" style={{ width: '1px', height: '2rem', background: 'var(--border-color)', margin: '0 0.5rem' }}></div>
                    <LanguageSwitcher />
                </div>

                {/* Mobile Balance Badge (Visible via CSS) */}
                <div className="mobile-balance-badge">
                    <Badge variant="premium">{viajesDisponibles} 🎫</Badge>
                </div>
            </header>

            {/* Mobile Bottom Nav */}
            <nav className="mobile-bottom-nav">
                <Button variant="ghost" className="active" label={t('nav.dashboard')}>
                    <span style={{ fontSize: '1.25rem' }}>🏠</span>
                    {t('nav.dashboard')}
                </Button>
                <Button variant="ghost" onClick={() => navigate('/cliente/historial')} label={t('client_dashboard.history')}>
                    <span style={{ fontSize: '1.25rem' }}>📋</span>
                    {t('client_dashboard.history')}
                </Button>
                <Button variant="ghost" onClick={() => navigate('/cliente/perfil')} label={t('client_dashboard.profile')}>
                    <span style={{ fontSize: '1.25rem' }}>👤</span>
                    {t('client_dashboard.profile')}
                </Button>
                <Button variant="ghost" onClick={handleLogout} label={t('common.logout')} className="text-error">
                    <span style={{ fontSize: '1.25rem' }}>🚪</span>
                    {t('common.logout')}
                </Button>
            </nav>

            {/* Main Content */}
            <main className="main-content">
                {/* Left Panel: Controls & Info */}
                <div className="side-panel">
                    <Card>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span>📍</span> {t('client_dashboard.plan_trip')}
                        </h2>

                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.5rem', fontStyle: 'italic' }}>
                            💡 {t('client_dashboard.tap_map_instruction', 'También puedes tocar directamente en el mapa para marcar los puntos.')}
                        </p>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            <div className={`point-input-group ${puntoActivo === 'origen' ? 'active-origen' : ''}`}>
                                <label className="point-label-origen">{t('client_dashboard.origin')}</label>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <input
                                        type="text"
                                        placeholder={t('client_dashboard.tap_map')}
                                        value={addressOrigen}
                                        onChange={(e) => setAddressOrigen(e.target.value)}
                                        onFocus={() => setPuntoActivo('origen')}
                                        onKeyDown={(e) => e.key === 'Enter' && handleAddressSearch('origen')}
                                        className="mtx-input"
                                        style={{ flex: 1 }}
                                    />
                                    <Button
                                        onClick={() => handleAddressSearch('origen')}
                                        variant="ghost"
                                        className="search-mini-btn"
                                        disabled={searching}
                                    >
                                        🔍
                                    </Button>
                                    {origen && <span className="coord-badge">FIXED</span>}
                                </div>
                                {origen && (
                                    <div className="point-value-mini">
                                        {origen[0].toFixed(5)}, {origen[1].toFixed(5)}
                                    </div>
                                )}
                            </div>

                            <div className={`point-input-group ${puntoActivo === 'destino' ? 'active-destino' : ''}`}>
                                <label className="point-label-destino">{t('client_dashboard.destination')}</label>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <input
                                        type="text"
                                        placeholder={t('client_dashboard.tap_map')}
                                        value={addressDestino}
                                        onChange={(e) => setAddressDestino(e.target.value)}
                                        onFocus={() => setPuntoActivo('destino')}
                                        onKeyDown={(e) => e.key === 'Enter' && handleAddressSearch('destino')}
                                        className="mtx-input"
                                        style={{ flex: 1 }}
                                    />
                                    <Button
                                        onClick={() => handleAddressSearch('destino')}
                                        variant="ghost"
                                        className="search-mini-btn"
                                        disabled={searching}
                                    >
                                        🔍
                                    </Button>
                                    {destino && <span className="coord-badge">FIXED</span>}
                                </div>
                                {destino && (
                                    <div className="point-value-mini">
                                        {destino[0].toFixed(5)}, {destino[1].toFixed(5)}
                                    </div>
                                )}
                            </div>
                        </div>

                        {origen && destino && (
                            <div className={`estimated-fare-card ${distanciaExcedida ? 'limit-warning' : ''}`}>
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <span className="fare-label">
                                        {distanciaExcedida ? '⚠️ ' + t('client_dashboard.limit_exceeded') : t('client_dashboard.trip_details')}
                                    </span>
                                    <span className="fare-info-mini">
                                        ⏱️ {tripMetrics.time} min | 📏 {tripMetrics.distance} km
                                    </span>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <span className="fare-value" style={{ fontSize: '1.1rem', color: distanciaExcedida ? 'var(--error-color)' : 'var(--secondary-color)' }}>
                                        {distanciaExcedida ? t('client_dashboard.invalid_trip') : '🎟️ 1 ' + t('client_dashboard.trip_cost')}
                                    </span>
                                    <div style={{ fontSize: '0.65rem', opacity: 0.7, color: 'white' }}>
                                        {maxDistance > 0 ? `${t('client_dashboard.limit')}: ${maxDistance}km` : t('client_dashboard.forfait_applied')}
                                    </div>
                                </div>
                            </div>
                        )}

                        {distanciaExcedida && (
                            <div className="limit-alert-box">
                                {t('client_dashboard.need_premium_pack')}
                            </div>
                        )}

                        <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)' }}>
                            <Button
                                onClick={handleSolicitarViaje}
                                variant="primary"
                                className="w-full"
                                disabled={!origen || !destino || distanciaExcedida}
                            >
                                {t('client_dashboard.request_now')}
                            </Button>
                        </div>
                    </Card>

                    {/* Forfaits Card */}
                    <Card accent className="mt-6">
                        <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', marginBottom: '1rem' }}>{t('client_dashboard.balance_title')}</h3>
                        <div className="balance-value">
                            {viajesDisponibles}
                        </div>
                        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                            {viajesDisponibles > 0 ? t('client_dashboard.available_trips', { count: viajesDisponibles }) : t('client_dashboard.no_trips')}
                        </p>
                        <Button
                            onClick={() => navigate('/cliente/forfaits')}
                            variant="accent"
                            className="w-full"
                        >
                            {t('client_dashboard.buy_forfait')}
                        </Button>
                    </Card>

                    {/* Active Trip Status */}
                    {activeTrip && (
                        <div className="active-trip-banner">
                            <div style={{ fontSize: '0.875rem', opacity: 0.9, marginBottom: '0.5rem' }}>{t('client_dashboard.trip_active')}</div>
                            <div style={{ fontSize: '1.125rem', fontWeight: 'bold' }}>
                                {t('client_dashboard.state')}: {activeTrip.estado}
                            </div>
                            {activeTrip.motorista && (
                                <div style={{ marginTop: '0.75rem', fontSize: '0.95rem', opacity: 0.95 }}>
                                    {t('client_dashboard.driver')}: {activeTrip.motorista.name}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Right Panel: Map */}
                <div className="map-panel">
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
