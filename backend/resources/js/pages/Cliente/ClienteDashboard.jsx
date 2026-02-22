
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
import { Star } from 'lucide-react';
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

// [PHASE 2] Helper to guarantee numeric coordinates
const safeParseCoord = (val, label = 'unknown') => {
    const parsed = parseFloat(val);
    if (isNaN(parsed)) {
        console.error(`[CRITICAL_COORD_ERROR] Failed to parse coordinate for ${label}:`, val);
        return 0; // Fallback to 0 to prevent toFixed crash
    }
    return parsed;
};

const ClienteDashboard = () => {
    const { logout, user } = useAuth();
    const { t } = useTranslation();
    const navigate = useNavigate();

    const [origen, setOrigen] = useState(null);
    const [destino, setDestino] = useState(null);
    const [puntoActivo, setPuntoActivo] = useState('origen'); // 'origen' | 'destino'
    const [activeTrip, setActiveTrip] = useState(null);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [isSubmittingRating, setIsSubmittingRating] = useState(false);

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

                    console.log('Active trip loaded (polling processed):', polledTrip);
                    setActiveTrip(polledTrip);

                    // If trip is active, auto-set markers if not set
                    if (!origen && polledTrip.origen_lat) {
                        const newOrigen = [polledTrip.origen_lat, polledTrip.origen_lng];
                        console.log('Auto-setting origen from active trip:', newOrigen);
                        setOrigen(newOrigen);
                    }
                    if (!destino && polledTrip.destino_lat) {
                        const newDestino = [polledTrip.destino_lat, polledTrip.destino_lng];
                        console.log('Auto-setting destino from active trip:', newDestino);
                        setDestino(newDestino);
                    }
                }
            } catch (error) {
            }
        };

        const interval = setInterval(checkTripStatus, 5000); // Poll every 5s
        checkTripStatus(); // Initial check

        return () => clearInterval(interval);
    }, []);

    // Real-time updates
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
            setActiveTrip(null); // Close the journey mode after rating
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
                // If it's a full trip object (ViajeActualizado/ViajeAceptado)
                if (updatedTrip && updatedTrip.id) {
                    updatedTrip.origen_lat = parseFloat(updatedTrip.origen_lat);
                    updatedTrip.origen_lng = parseFloat(updatedTrip.origen_lng);
                    updatedTrip.destino_lat = parseFloat(updatedTrip.destino_lat);
                    updatedTrip.destino_lng = parseFloat(updatedTrip.destino_lng);
                    if (updatedTrip.motorista?.motorista_perfil) {
                        updatedTrip.motorista.motorista_perfil.latitud_actual = parseFloat(updatedTrip.motorista.motorista_perfil.latitud_actual);
                        updatedTrip.motorista.motorista_perfil.longitud_actual = parseFloat(updatedTrip.motorista.motorista_perfil.longitud_actual);
                    }
                    setActiveTrip(updatedTrip);
                    toast.info(`Actualización: ${updatedTrip.estado}`);
                }
            };

            // Attach specific location handler to the callback object
            callbacks.onLocationUpdate = (data) => {
                if (data.lat && data.lng) {
                    // Update activeTrip with new motorista location deep merged
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
        if (!origen || !destino) {
            alert('Por favor, selecciona origen y destino en el mapa.');
            return;
        }

        try {
            const response = await axios.post('/api/viajes/solicitar', {
                origen_lat: origen[0],
                origen_lng: origen[1],
                destino_lat: destino[0],
                destino_lng: destino[1],
                origen: addressOrigen,
                destino: addressDestino
            });

            toast.success(t('auth.trip_requested_success', '¡Viaje solicitado con éxito!'));
            const trip = response.data.data;
            if (trip) {
                trip.origen_lat = parseFloat(trip.origen_lat);
                trip.origen_lng = parseFloat(trip.origen_lng);
                trip.destino_lat = parseFloat(trip.destino_lat);
                trip.destino_lng = parseFloat(trip.destino_lng);
            }
            console.log('Setting activeTrip from request:', trip);
            setActiveTrip(trip);
        } catch (error) {
            const msg = error.response?.data?.error || error.response?.data?.message || t('common.error');
            toast.error(`${t('common.error')}: ${msg}`);
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
        console.log('[LOG_COORD_1] Calculating metrics for distance:', distance);
        const metrics = { distance: (Number(distance) || 0).toFixed(1), time: Math.max(2, time) };
        console.log('Metrics calculated:', metrics, 'from distance:', distance);
        return metrics;
    };

    // Reverse Geocoding Function
    const reverseGeocode = async (coords, type) => {
        if (!coords) return;
        if (type === 'origen') setAddressOrigen('Buscando...');
        if (type === 'destino') setAddressDestino('Buscando...');

        try {
            const lat = parseFloat(coords[0]);
            const lng = parseFloat(coords[1]);
            const res = await axios.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
            if (res.data && res.data.display_name) {
                // Keep it short: first 2 parts
                const shortName = res.data.display_name.split(',').slice(0, 2).join(',');
                if (type === 'origen') setAddressOrigen(shortName);
                if (type === 'destino') setAddressDestino(shortName);
            } else {
                try {
                    const safeLat = safeParseCoord(lat, 'addressOrigen_lat');
                    const safeLng = safeParseCoord(lng, 'addressOrigen_lng');
                    console.log('[LOG_COORD_2] Setting addressOrigen:', safeLat, safeLng);
                    if (type === 'origen') setAddressOrigen(`${safeLat.toFixed(5)}, ${safeLng.toFixed(5)}`);
                    if (type === 'destino') setAddressDestino(`${safeLat.toFixed(5)}, ${safeLng.toFixed(5)}`);
                } catch (e) {
                    console.error('[LOG_COORD_ERROR_A] toFixed failed in handleMapClick:', e);
                }
            }
        } catch (error) {
            const lat = parseFloat(coords[0]);
            const lng = parseFloat(coords[1]);
            try {
                const safeLat = safeParseCoord(lat, 'search_lat');
                const safeLng = safeParseCoord(lng, 'search_lng');
                console.log('[LOG_COORD_3] Setting address via search:', safeLat, safeLng);
                if (type === 'origen') setAddressOrigen(`${safeLat.toFixed(5)}, ${safeLng.toFixed(5)}`);
                if (type === 'destino') setAddressDestino(`${safeLat.toFixed(5)}, ${safeLng.toFixed(5)}`);
            } catch (e) {
                console.error('[LOG_COORD_ERROR_B] toFixed failed in handleAddressSearch:', e);
            }
        }
    };

    // Auto-fetch address on coordinate change (debounced 1s could be better but direct for now)
    useEffect(() => {
        if (origen) reverseGeocode(origen, 'origen');
    }, [origen]);

    useEffect(() => {
        if (destino) reverseGeocode(destino, 'destino');
    }, [destino]);

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

    // [ES] Cambio automático a destino TRAS marcar origen (solo si destino está vacío)
    // [FR] Changement automatique vers destination APRÈS avoir marqué l'origine (unicamente si destination es vide)
    useEffect(() => {
        if (origen && !destino && puntoActivo === 'origen') {
            setPuntoActivo('destino');
        }
    }, [origen]);

    const handleClearPoint = (type) => {
        if (type === 'origen') {
            setOrigen(null);
            setAddressOrigen('');
            setPuntoActivo('origen');
        } else {
            setDestino(null);
            setAddressDestino('');
            setPuntoActivo('destino');
        }
    };

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
            toast.error("Error al buscar dirección");
        } finally {
            setSearching(false);
        }
    };

    const forfaits = user?.cliente_forfaits || [];
    const viajesDisponibles = forfaits.reduce((acc, curr) => acc + (parseInt(curr.viajes_restantes) || 0), 0);


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
                            {user?.email === 'cliente@test.com' ? t('auth.role_client') + ' (Demo)' : user?.name || t('auth.role_client')}
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
                    {!activeTrip ? (
                        <>
                            <Card>
                                <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <span>📍</span> {t('client_dashboard.plan_trip')}
                                </h2>

                                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.25rem', fontStyle: 'italic' }}>
                                    💡 {t('client_dashboard.tap_map_instruction')}
                                </p>

                                {/* Mode Selector Toggles */}
                                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', background: '#f3f4f6', padding: '0.4rem', borderRadius: '1rem' }}>
                                    <button
                                        onClick={() => setPuntoActivo('origen')}
                                        style={{
                                            flex: 1,
                                            padding: '0.6rem',
                                            borderRadius: '0.75rem',
                                            border: 'none',
                                            fontSize: '0.85rem',
                                            fontWeight: '700',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s',
                                            background: puntoActivo === 'origen' ? 'var(--primary-color)' : 'transparent',
                                            color: puntoActivo === 'origen' ? 'white' : 'var(--text-muted)',
                                            boxShadow: puntoActivo === 'origen' ? '0 4px 10px rgba(37, 99, 235, 0.2)' : 'none'
                                        }}
                                    >
                                        📍 {t('client_dashboard.origin')}
                                    </button>
                                    <button
                                        onClick={() => setPuntoActivo('destino')}
                                        style={{
                                            flex: 1,
                                            padding: '0.6rem',
                                            borderRadius: '0.75rem',
                                            border: 'none',
                                            fontSize: '0.85rem',
                                            fontWeight: '700',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s',
                                            background: puntoActivo === 'destino' ? 'var(--accent-color)' : 'transparent',
                                            color: puntoActivo === 'destino' ? 'white' : 'var(--text-muted)',
                                            boxShadow: puntoActivo === 'destino' ? '0 4px 10px rgba(245, 158, 11, 0.2)' : 'none'
                                        }}
                                    >
                                        🚩 {t('client_dashboard.destination')}
                                    </button>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                    <div className={`point-input-group ${puntoActivo === 'origen' ? 'active-origen' : ''}`}>
                                        <label className="point-label-origen">{t('client_dashboard.origin')}</label>
                                        <div style={{ display: 'flex', gap: '0.5rem', position: 'relative' }}>
                                            <input
                                                type="text"
                                                placeholder={t('client_dashboard.tap_map')}
                                                value={addressOrigen}
                                                onChange={(e) => setAddressOrigen(e.target.value)}
                                                onFocus={() => setPuntoActivo('origen')}
                                                onKeyDown={(e) => e.key === 'Enter' && handleAddressSearch('origen')}
                                                className="mtx-input"
                                                style={{ flex: 1, paddingRight: addressOrigen ? '2.5rem' : '0.75rem' }}
                                            />
                                            {addressOrigen && (
                                                <button
                                                    onClick={() => handleClearPoint('origen')}
                                                    style={{
                                                        position: 'absolute',
                                                        right: '4.5rem',
                                                        top: '50%',
                                                        transform: 'translateY(-50%)',
                                                        background: 'none',
                                                        border: 'none',
                                                        color: '#9ca3af',
                                                        cursor: 'pointer',
                                                        fontSize: '1.1rem',
                                                        display: 'flex',
                                                        alignItems: 'center'
                                                    }}
                                                    title="Clear"
                                                >
                                                    ✕
                                                </button>
                                            )}
                                            <Button
                                                onClick={() => handleAddressSearch('origen')}
                                                variant="ghost"
                                                className="search-mini-btn"
                                                disabled={searching}
                                            >
                                                🔍
                                            </Button>
                                            {origen && <span className="coord-badge" style={{ backgroundColor: 'var(--primary-color)' }}>{t('common.done') || 'FIX'}</span>}
                                        </div>
                                        {origen && (
                                            <div className="point-value-mini">
                                                {console.log('[LOG_COORD_4] Rendering origen mini:', origen)}
                                                {safeParseCoord(origen[0], 'origen_0').toFixed(5)}, {safeParseCoord(origen[1], 'origen_1').toFixed(5)}
                                            </div>
                                        )}
                                    </div>

                                    <div className={`point-input-group ${puntoActivo === 'destino' ? 'active-destino' : ''}`}>
                                        <label className="point-label-destino">{t('client_dashboard.destination')}</label>
                                        <div style={{ display: 'flex', gap: '0.5rem', position: 'relative' }}>
                                            <input
                                                type="text"
                                                placeholder={t('client_dashboard.tap_map')}
                                                value={addressDestino}
                                                onChange={(e) => setAddressDestino(e.target.value)}
                                                onFocus={() => setPuntoActivo('destino')}
                                                onKeyDown={(e) => e.key === 'Enter' && handleAddressSearch('destino')}
                                                className="mtx-input"
                                                style={{ flex: 1, paddingRight: addressDestino ? '2.5rem' : '0.75rem' }}
                                            />
                                            {addressDestino && (
                                                <button
                                                    onClick={() => handleClearPoint('destino')}
                                                    style={{
                                                        position: 'absolute',
                                                        right: '4.5rem',
                                                        top: '50%',
                                                        transform: 'translateY(-50%)',
                                                        background: 'none',
                                                        border: 'none',
                                                        color: '#9ca3af',
                                                        cursor: 'pointer',
                                                        fontSize: '1.1rem',
                                                        display: 'flex',
                                                        alignItems: 'center'
                                                    }}
                                                    title="Clear"
                                                >
                                                    ✕
                                                </button>
                                            )}
                                            <Button
                                                onClick={() => handleAddressSearch('destino')}
                                                variant="ghost"
                                                className="search-mini-btn"
                                                disabled={searching}
                                            >
                                                🔍
                                            </Button>
                                            {destino && <span className="coord-badge" style={{ backgroundColor: 'var(--accent-color)' }}>{t('common.done') || 'FIX'}</span>}
                                        </div>
                                        {destino && (
                                            <div className="point-value-mini">
                                                {console.log('[LOG_COORD_5] Rendering destino mini:', destino)}
                                                {safeParseCoord(destino[0], 'destino_0').toFixed(5)}, {safeParseCoord(destino[1], 'destino_1').toFixed(5)}
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
                        </>
                    ) : (
                        <div className="journey-mode-focused animate-in fade-in zoom-in duration-300">
                            <Card className="active-trip-master-card" style={{ padding: '0', overflow: 'hidden' }}>
                                {/* Header del Modo Trayecto */}
                                <div style={{
                                    background: 'var(--primary-color)',
                                    color: 'white',
                                    padding: '1.5rem',
                                    textAlign: 'center'
                                }}>
                                    <h2 style={{ fontSize: '1.1rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                        {activeTrip.estado === 'solicitado' ? t('client_dashboard.searching_driver') : t('client_dashboard.trip_active')}
                                    </h2>
                                    <p style={{ fontSize: '0.8rem', opacity: 0.9 }}>ID: #{String(activeTrip.id).padStart(5, '0')}</p>
                                </div>

                                {/* Trayecto en Curso vs Calificación */}
                                <div style={{ padding: '1.25rem' }}>
                                    {activeTrip.estado === 'completado' ? (
                                        <div className="rating-view animate-in fade-in slide-in-from-bottom-4 duration-500">
                                            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                                                <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🎊</div>
                                                <h3 style={{ fontWeight: '800', fontSize: '1.25rem' }}>{t('client_dashboard.trip_finished_title') || '¡Has llegado!'}</h3>
                                                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{t('client_dashboard.rate_driver_instruction') || '¿Cómo fue tu viaje con ' + (activeTrip.motorista?.name || 'el conductor') + '?'}</p>
                                            </div>

                                            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <button
                                                        key={star}
                                                        onClick={() => setRating(star)}
                                                        style={{ background: 'none', border: 'none', cursor: 'pointer', outline: 'none' }}
                                                    >
                                                        <Star
                                                            size={36}
                                                            fill={star <= rating ? "#f59e0b" : "none"}
                                                            stroke={star <= rating ? "#f59e0b" : "#cbd5e1"}
                                                            style={{ transition: 'transform 0.2s' }}
                                                        />
                                                    </button>
                                                ))}
                                            </div>

                                            <textarea
                                                value={comment}
                                                onChange={(e) => setComment(e.target.value)}
                                                placeholder={t('driver_dashboard.rating_modal.placeholder')}
                                                style={{
                                                    width: '100%',
                                                    padding: '0.75rem',
                                                    borderRadius: '0.75rem',
                                                    border: '1px solid #e2e8f0',
                                                    marginBottom: '1.5rem',
                                                    fontSize: '0.9rem',
                                                    minHeight: '80px'
                                                }}
                                            />

                                            <Button
                                                variant="primary"
                                                className="w-full"
                                                onClick={submitRating}
                                                disabled={isSubmittingRating}
                                            >
                                                {isSubmittingRating ? '...' : t('driver_dashboard.rating_modal.submit')}
                                            </Button>

                                            <Button
                                                variant="ghost"
                                                className="w-full mt-2"
                                                onClick={() => setActiveTrip(null)}
                                                style={{ fontSize: '0.8rem', opacity: 0.6 }}
                                            >
                                                {t('common.skip') || 'Omitir'}
                                            </Button>
                                        </div>
                                    ) : (
                                        <>
                                            <TripPhaseTracker estado={activeTrip.estado} />

                                            {activeTrip.motorista ? (
                                                <div className="driver-profile-premium" style={{ marginTop: '1rem' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                                                        <div className="driver-avatar-circle" style={{
                                                            width: '4rem',
                                                            height: '4rem',
                                                            borderRadius: '50%',
                                                            background: '#e2e8f0',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            fontSize: '1.5rem',
                                                            border: '3px solid white',
                                                            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                                                        }}>
                                                            🏍️
                                                        </div>
                                                        <div style={{ flex: 1 }}>
                                                            <div style={{ fontWeight: '800', fontSize: '1.2rem' }}>{activeTrip.motorista.name}</div>
                                                            <div style={{ color: '#059669', fontWeight: 'bold', fontSize: '0.9rem' }}>
                                                                {activeTrip.estado === 'aceptado' ? '🚗 En camino a por ti' : '🚀 En viaje'}
                                                            </div>
                                                            <div style={{ display: 'flex', gap: '0.2rem', color: '#f59e0b', fontSize: '0.85rem' }}>
                                                                ★★★★★ <span style={{ color: 'var(--text-muted)', fontWeight: 'normal' }}>(5.0)</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="vehicle-safety-grid" style={{
                                                        display: 'grid',
                                                        gridTemplateColumns: '1fr 1fr',
                                                        gap: '1rem',
                                                        background: '#f8fafc',
                                                        padding: '1rem',
                                                        borderRadius: '1rem',
                                                        border: '1px solid #f1f5f9'
                                                    }}>
                                                        <div>
                                                            <label style={{ fontSize: '0.65rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 'bold' }}>{t('client_dashboard.vehicle')}</label>
                                                            <div style={{ fontWeight: 'bold' }}>{activeTrip.motorista.motorista_perfil?.marca_vehiculo || 'MotoTX Standard'}</div>
                                                        </div>
                                                        <div>
                                                            <label style={{ fontSize: '0.65rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 'bold' }}>{t('client_dashboard.plate')}</label>
                                                            <div style={{ fontWeight: 'bold', color: 'var(--primary-color)' }}>{activeTrip.motorista.motorista_perfil?.matricula || 'M-2234'}</div>
                                                        </div>
                                                    </div>

                                                    <div className="security-code-banner" style={{
                                                        marginTop: '1.5rem',
                                                        padding: '1rem',
                                                        background: 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)',
                                                        borderRadius: '1rem',
                                                        textAlign: 'center',
                                                        border: '1px dashed #166534'
                                                    }}>
                                                        <div style={{ fontSize: '0.7rem', color: '#166534', fontWeight: 'bold', marginBottom: '0.25rem' }}>{t('client_dashboard.safety_code')}</div>
                                                        <div style={{ fontSize: '1.75rem', fontWeight: '900', color: '#14532d', letterSpacing: '0.2em' }}>
                                                            {String(activeTrip.id).padStart(4, '0').slice(-4)}
                                                        </div>
                                                    </div>

                                                    <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
                                                        <Button variant="outline" className="flex-1" style={{ borderColor: '#ef4444', color: '#ef4444' }}>
                                                            🆘 SOS
                                                        </Button>
                                                        <Button variant="primary" className="flex-1">
                                                            📞 {t('common.call') || 'Llamar'}
                                                        </Button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div style={{
                                                    padding: '2rem',
                                                    textAlign: 'center',
                                                    background: '#f8fafc',
                                                    borderRadius: '1rem',
                                                    marginTop: '1rem'
                                                }}>
                                                    <div className="searching-spinner" style={{
                                                        width: '3rem',
                                                        height: '3rem',
                                                        border: '4px solid #e2e8f0',
                                                        borderTopColor: 'var(--primary-color)',
                                                        borderRadius: '50%',
                                                        animation: 'mtx-spin 1s linear infinite',
                                                        margin: '0 auto 1.5rem'
                                                    }}></div>
                                                    <p style={{ fontWeight: 'bold', color: '#64748b' }}>{t('client_dashboard.waiting_for_assignment')}</p>
                                                    <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '0.5rem' }}>Notificando a conductores cercanos...</p>

                                                    <style dangerouslySetInnerHTML={{
                                                        __html: `
                                                        @keyframes mtx-spin { to { transform: rotate(360deg); } }
                                                    `}} />
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>
                            </Card>

                            <Button
                                onClick={() => setActiveTrip(null)}
                                variant="ghost"
                                className="w-full mt-4"
                                style={{ fontSize: '0.8rem', opacity: 0.6 }}
                            >
                                {t('common.cancel_request') || 'Cancelar Solicitud'}
                            </Button>
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
                            [
                                parseFloat(activeTrip.motorista.motorista_perfil.latitud_actual),
                                parseFloat(activeTrip.motorista.motorista_perfil.longitud_actual)
                            ]
                            : null}
                    />
                </div>
            </main>
        </div>
    );
};

export default ClienteDashboard;
