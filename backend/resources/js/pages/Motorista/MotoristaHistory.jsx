import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import SEO from '../../components/Common/SEO';
import { Card, Button, Badge } from '../../components/Common/UIComponents';
import '../../../css/components.css';

/**
 * MotoristaHistory Component
 *
 * [ES] Historial de servicios realizados por el conductor.
 *      Muestra estadísticas de viajes totales y calificación media, además de la lista detallada de trayectos finalizados.
 *
 * [FR] Historique des services effectués par le chauffeur.
 *      Affiche les statistiques des trajets totaux et la note moyenne, ainsi que la liste détaillée des trajets terminés.
 */

// [PHASE 2] Helper for safe numeric display
const safeFixed = (val, digits = 4) => {
    const parsed = parseFloat(val);
    if (isNaN(parsed)) return '0.0000';
    return parsed.toFixed(digits);
};

const MotoristaHistory = () => {
    const { logout, user } = useAuth();
    const navigate = useNavigate();
    const [viajes, setViajes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ total: 0, average: 0 });

    const { t } = useTranslation();

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
            <div className="stars-container">
                {[1, 2, 3, 4, 5].map((star) => (
                    <span key={star} className={`star ${star <= rating ? 'filled' : 'empty'}`}>
                        ★
                    </span>
                ))}
            </div>
        );
    };

    return (
        <div className="dashboard-container driver-theme">
            <SEO title={t('client_dashboard.history')} />

            <header className="mtx-header driver-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span style={{ fontSize: '2rem' }}>🏍️</span>
                    <div>
                        <h1 className="header-title" style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--secondary-color)', margin: 0 }}>
                            {t('client_dashboard.history')}
                        </h1>
                        <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                            {user?.name || t('driver_dashboard.driver_role')}
                        </span>
                    </div>
                </div>
                <div className="desktop-nav" style={{ display: 'flex', gap: '1rem' }}>
                    <Button onClick={() => navigate('/motorista')} label="Dashboard">
                        ← Dashboard
                    </Button>
                    <Button variant="outline" onClick={() => navigate('/motorista/perfil')} label={t('client_dashboard.profile')}>
                        👤 {t('client_dashboard.profile')}
                    </Button>
                    <Button variant="error" onClick={handleLogout} label={t('common.logout')}>
                        {t('common.logout')}
                    </Button>
                </div>
            </header>

            {/* Mobile Bottom Nav */}
            <nav className="mobile-bottom-nav">
                <Button variant="ghost" onClick={() => navigate('/motorista')} label="Dashboard">
                    <span style={{ fontSize: '1.25rem' }}>🏠</span>
                    {t('nav.dashboard')}
                </Button>
                <Button variant="ghost" className="active" label={t('client_dashboard.history')}>
                    <span style={{ fontSize: '1.25rem' }}>📋</span>
                    {t('client_dashboard.history')}
                </Button>
                <Button variant="ghost" onClick={() => navigate('/motorista/perfil')} label={t('client_dashboard.profile')}>
                    <span style={{ fontSize: '1.25rem' }}>👤</span>
                    {t('client_dashboard.profile')}
                </Button>
            </nav>

            <main className="main-content-centered">
                {/* Stats Cards */}
                <div className="stats-row" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                    <Card style={{ border: '2px solid var(--secondary-color)' }}>
                        <div className="stat-label" style={{ fontSize: '0.875rem', fontWeight: '600' }}>
                            {t('driver_dashboard.completed_trips')}
                        </div>
                        <div className="stat-value" style={{ fontSize: '3rem', color: 'var(--secondary-color)' }}>
                            {stats.total}
                        </div>
                    </Card>
                    <Card style={{ border: '2px solid var(--accent-color)' }}>
                        <div className="stat-label" style={{ fontSize: '0.875rem', fontWeight: '600' }}>
                            {t('driver_dashboard.average_rating')}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div className="stat-value" style={{ fontSize: '3rem', color: 'var(--accent-color)' }}>
                                {stats.average}
                            </div>
                            <div style={{ fontSize: '2rem', color: 'var(--accent-color)' }}>★</div>
                        </div>
                    </Card>
                </div>

                {/* Trip List */}
                {loading ? (
                    <div className="loading-state">
                        {t('common.loading')}
                    </div>
                ) : viajes.length === 0 ? (
                    <Card className="empty-state">
                        <div className="empty-icon">📋</div>
                        <p className="empty-text">
                            {t('client_dashboard.no_trips')}
                        </p>
                    </Card>
                ) : (
                    <div className="history-grid" style={{ display: 'grid', gap: '1.5rem' }}>
                        {Array.isArray(viajes) && viajes.map((viaje) => (
                            <Card key={viaje.id} className="history-item">
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1.5rem' }}>
                                    <div>
                                        <div className="history-date" style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                                            {new Date(viaje.updated_at).toLocaleDateString('es-ES', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </div>
                                        <div className="history-client" style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--text-main)' }}>
                                            {t('client_dashboard.client')}: {viaje.cliente?.name || 'N/A'}
                                        </div>
                                    </div>
                                    <Badge variant="secondary">Completado</Badge>
                                </div>

                                <div className="trip-details-grid" style={{ background: 'var(--bg-light)', padding: '1rem', borderRadius: '0.5rem', marginBottom: '1.5rem' }}>
                                    <div className="detail-item">
                                        <div className="detail-label">{t('client_dashboard.origin')}</div>
                                        <div className="detail-value" style={{ fontSize: '0.9rem' }}>
                                            {viaje.origen || `${safeFixed(viaje.origen_lat)}, ${safeFixed(viaje.origen_lng)}`}
                                        </div>
                                    </div>
                                    <div className="detail-item">
                                        <div className="detail-label">{t('client_dashboard.destination')}</div>
                                        <div className="detail-value" style={{ fontSize: '0.9rem' }}>
                                            {viaje.destino || `${safeFixed(viaje.destino_lat)}, ${safeFixed(viaje.destino_lng)}`}
                                        </div>
                                    </div>
                                </div>

                                {/* Rating Section */}
                                {viaje.calificacion ? (
                                    <div className="rating-display" style={{ padding: '1.5rem', background: 'rgba(245, 158, 11, 0.1)', borderRadius: '0.75rem', borderLeft: '4px solid var(--accent-color)' }}>
                                        <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.75rem', fontWeight: '600' }}>
                                            {t('driver_dashboard.rating_received')}
                                        </div>
                                        {renderStars(viaje.calificacion.puntuacion)}
                                        {viaje.calificacion.comentario && (
                                            <div className="rating-comment" style={{ marginTop: '1rem', fontSize: '0.95rem', color: 'var(--text-main)', fontStyle: 'italic', padding: '0.75rem', background: 'white', borderRadius: '0.5rem' }}>
                                                "{viaje.calificacion.comentario}"
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="no-rating" style={{ padding: '1rem', background: 'var(--border-color)', borderRadius: '0.5rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                                        {t('driver_dashboard.no_rating')}
                                    </div>
                                )}
                            </Card>
                        ))}
                    </div>
                )}
            </main>
        </div >
    );
};

export default MotoristaHistory;
