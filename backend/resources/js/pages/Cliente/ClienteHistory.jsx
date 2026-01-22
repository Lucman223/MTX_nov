import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import SEO from '../../components/Common/SEO';
import { Card, Button, Badge } from '../../components/Common/UIComponents';
import RatingModal from '../../components/RatingModal';
import '../../../css/components.css';

/**
 * ClienteHistory Component
 *
 * [ES] Historial de trayectos del cliente.
 *      Muestra todos los viajes realizados, su estado, tarifa y permite calificar aquellos que aún no tengan puntuación.
 *
 * [FR] Historique des trajets du client.
 *      Affiche tous les voyages effectués, leur statut, leur tarif et permet de noter ceux qui n'ont pas encore de note.
 */
const ClienteHistory = () => {
    const { logout, user } = useAuth();
    const navigate = useNavigate();
    const [viajes, setViajes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedTrip, setSelectedTrip] = useState(null);
    const [showRatingModal, setShowRatingModal] = useState(false);

    const { t } = useTranslation();

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        setLoading(true);
        try {
            const response = await axios.get('/api/viajes/historial');
            setViajes(response.data.data || []);
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

    const openRatingModal = (trip) => {
        setSelectedTrip(trip);
        setShowRatingModal(true);
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
        <div className="dashboard-container">
            <SEO title={t('client_dashboard.history')} />

            <header className="mtx-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span style={{ fontSize: '2rem' }}>🏍️</span>
                    <div>
                        <h1 className="header-title" style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary-color)', margin: 0 }}>
                            {t('client_dashboard.history')}
                        </h1>
                        <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                            {user?.name || t('common.client')}
                        </span>
                    </div>
                </div>

                <div className="desktop-nav" style={{ display: 'flex', gap: '1rem' }}>
                    <Button onClick={() => navigate('/cliente')} label="Dashboard">
                        ← Dashboard
                    </Button>
                    <Button variant="outline" onClick={() => navigate('/cliente/perfil')} label={t('client_dashboard.profile')}>
                        👤 {t('client_dashboard.profile')}
                    </Button>
                    <Button variant="error" onClick={handleLogout} label={t('common.logout')}>
                        {t('common.logout')}
                    </Button>
                </div>
            </header>

            {/* Mobile Bottom Nav */}
            <nav className="mobile-bottom-nav">
                <Button variant="ghost" onClick={() => navigate('/cliente')} label="Dashboard">
                    <span style={{ fontSize: '1.25rem' }}>🏠</span>
                    {t('nav.dashboard')}
                </Button>
                <Button variant="ghost" className="active" label={t('client_dashboard.history')}>
                    <span style={{ fontSize: '1.25rem' }}>📋</span>
                    {t('client_dashboard.history')}
                </Button>
                <Button variant="ghost" onClick={() => navigate('/cliente/perfil')} label={t('client_dashboard.profile')}>
                    <span style={{ fontSize: '1.25rem' }}>👤</span>
                    {t('client_dashboard.profile')}
                </Button>
            </nav>

            <main className="main-content-centered">
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
                        <Button
                            onClick={() => navigate('/cliente')}
                            className="mt-6"
                        >
                            {t('client_dashboard.request_trip')}
                        </Button>
                    </Card>
                ) : (
                    <div className="history-grid" style={{ display: 'grid', gap: '1.5rem' }}>
                        {viajes.map((viaje) => (
                            <Card key={viaje.id} className="history-item">
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1.5rem' }}>
                                    <div>
                                        <div className="history-date" style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                                            {new Date(viaje.updated_at).toLocaleDateString(t('common.date_locale', 'es-ES'), {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </div>
                                        <div className="history-driver" style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--text-main)' }}>
                                            {t('client_dashboard.driver')}: {viaje.motorista?.name || 'N/A'}
                                        </div>
                                    </div>
                                    <Badge variant="secondary">{t('status.completado')}</Badge>
                                </div>

                                <div className="trip-details-grid" style={{ background: 'var(--bg-light)', padding: '1rem', borderRadius: '0.5rem', marginBottom: '1.5rem' }}>
                                    <div className="detail-item">
                                        <div className="detail-label">{t('client_dashboard.origin')}</div>
                                        <div className="detail-value" style={{ fontSize: '0.9rem' }}>
                                            {viaje.origen || `${viaje.origen_lat?.toFixed(4)}, ${viaje.origen_lng?.toFixed(4)}`}
                                        </div>
                                    </div>
                                    <div className="detail-item">
                                        <div className="detail-label">{t('client_dashboard.destination')}</div>
                                        <div className="detail-value" style={{ fontSize: '0.9rem' }}>
                                            {viaje.destino || `${viaje.destino_lat?.toFixed(4)}, ${viaje.destino_lng?.toFixed(4)}`}
                                        </div>
                                    </div>
                                </div>

                                {/* Rating Section */}
                                {viaje.calificacion ? (
                                    <div className="rating-display" style={{ padding: '1rem', background: 'rgba(245, 158, 11, 0.1)', borderRadius: '0.5rem', borderLeft: '3px solid var(--accent-color)' }}>
                                        <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                                            {t('client_dashboard.your_rating')}:
                                        </div>
                                        {renderStars(viaje.calificacion.puntuacion)}
                                        {viaje.calificacion.comentario && (
                                            <div style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: 'var(--text-main)', fontStyle: 'italic' }}>
                                                "{viaje.calificacion.comentario}"
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <Button
                                        variant="accent"
                                        onClick={() => openRatingModal(viaje)}
                                        className="w-full"
                                    >
                                        ⭐ {t('client_dashboard.rate_trip')}
                                    </Button>
                                )}
                            </Card>
                        ))}
                    </div>
                )}
            </main>

            {/* Rating Modal */}
            {showRatingModal && selectedTrip && (
                <RatingModal
                    tripId={selectedTrip.id}
                    motoristaName={selectedTrip.motorista?.name || 'Motorista'}
                    onClose={() => {
                        setShowRatingModal(false);
                        setSelectedTrip(null);
                    }}
                    onSuccess={() => {
                        fetchHistory(); // Refresh list
                    }}
                />
            )}
        </div>
    );
};

export default ClienteHistory;
