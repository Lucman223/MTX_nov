import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import SEO from '../../components/Common/SEO';
import { Card, Button, Badge } from '../../components/Common/UIComponents';
import '../../../css/components.css';

/**
 * SuscripcionesMotorista Component
 *
 * [ES] Gestión de abonos para motoristas. 
 *      Permite al conductor visualizar su estado actual (habilitado/bloqueado) y adquirir planes para poder recibir viajes.
 *
 * [FR] Gestion des abonnements pour les chauffeurs.
 *      Permet au chauffeur de visualiser son statut actuel (activé/bloqué) et d'acquérir des plans pour recevoir des trajets.
 */
const SuscripcionesMotorista = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [planes, setPlanes] = useState([]);
    const { t } = useTranslation();
    const [loading, setLoading] = useState(true);
    const [currentStatus, setCurrentStatus] = useState(null);
    const [processing, setProcessing] = useState(null); // id of plan being purchased

    useEffect(() => {
        fetchPlanesAndStatus();
    }, []);

    const fetchPlanesAndStatus = async () => {
        try {
            const [planesRes, statusRes] = await Promise.all([
                axios.get('/api/motorista/planes'),
                axios.get('/api/motorista/planes/status')
            ]);
            setPlanes(planesRes.data);
            setCurrentStatus(statusRes.data);
        } catch (error) {
            toast.error(t('common.error'));
        } finally {
            setLoading(false);
        }
    };

    const handleSubscribe = async (planId) => {
        setProcessing(planId);
        try {
            // Mock Phone input (usually user inputs this)
            const phone = user.telefono || '00000000';

            await axios.post('/api/motorista/planes/subscribe', {
                plan_id: planId,
                payment_method: 'orange_money', // Default for prototype
                phone_number: phone
            });

            toast.success(t('common.success'));
            fetchPlanesAndStatus(); // Refresh status
        } catch (error) {
            toast.error(t('common.error'));
        } finally {
            setProcessing(null);
        }
    };

    if (loading) return <div className="loading-state">{t('common.loading')}</div>;

    const { suscripcion_activa, plan: activePlan, fecha_fin, viajes_prueba_restantes, acceso_permitido } = currentStatus || {};

    return (
        <div className="dashboard-container driver-theme">
            <SEO title={t('driver_dashboard.subscriptions')} />

            <header className="mtx-header driver-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <Button variant="ghost" onClick={() => navigate('/motorista')} label={t('common.back')}>
                        ←
                    </Button>
                    <div>
                        <h1 className="header-title" style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>
                            {t('driver_dashboard.subscriptions')}
                        </h1>
                    </div>
                </div>
            </header>

            <main className="main-content-centered">

                {!acceso_permitido && (
                    <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid var(--error-color)', color: 'var(--error-color)', padding: '1rem', borderRadius: '0.5rem', marginBottom: '2rem' }}>
                        <strong>⚠️ {t('driver_dashboard.access_blocked')}:</strong> {t('driver_dashboard.blocked_desc')}
                    </div>
                )}

                <Card style={{ marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem', color: 'var(--text-main)' }}>{t('driver_dashboard.current_status')}</h2>
                    <div className="trip-details-grid">
                        <div>
                            <div className="detail-label">{t('driver_dashboard.account_status')}</div>
                            <div style={{ fontSize: '1.125rem', fontWeight: 'bold', color: acceso_permitido ? 'var(--secondary-color)' : 'var(--error-color)' }}>
                                {acceso_permitido ? t('driver_dashboard.enabled') : t('driver_dashboard.blocked')}
                            </div>
                        </div>
                        <div>
                            <div className="detail-label">{t('driver_dashboard.trial_remaining')}</div>
                            <div className="detail-value">
                                {viajes_prueba_restantes} {t('client_dashboard.trips_badge', { count: '' })}
                            </div>
                        </div>
                        <div>
                            <div className="detail-label">{t('driver_dashboard.subscriptions')}</div>
                            <div style={{ fontSize: '1.125rem', fontWeight: 'bold', color: suscripcion_activa ? 'var(--secondary-color)' : 'var(--text-muted)' }}>
                                {suscripcion_activa ? t(`plans.${activePlan?.nombre}`) : t('driver_dashboard.none')}
                            </div>
                        </div>
                        {suscripcion_activa && (
                            <div>
                                <div className="detail-label">{t('driver_dashboard.expires_on')}</div>
                                <div className="detail-value">
                                    {new Date(fecha_fin).toLocaleDateString()}
                                </div>
                            </div>
                        )}
                    </div>
                </Card>

                <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem', color: 'var(--text-main)' }}>
                    {t('driver_dashboard.available_plans')}
                </h2>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
                    {planes.map(plan => (
                        <Card key={plan.id} style={{
                            border: plan.es_vip ? '2px solid var(--accent-color)' : '1px solid var(--border-color)',
                            position: 'relative'
                        }}>
                            {plan.es_vip && (
                                <Badge variant="premium" style={{ position: 'absolute', top: -12, right: 20 }}>
                                    VIP
                                </Badge>
                            )}
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem', color: 'var(--text-main)' }}>{t(`plans.${plan.nombre}`)}</h3>
                            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--secondary-color)', marginBottom: '0.5rem' }}>
                                {plan.precio} CFA
                            </div>
                            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
                                {t('driver_dashboard.validity')}: {plan.dias_validez} {t('driver_dashboard.days')}
                            </p>
                            <ul style={{ listStyle: 'none', padding: 0, marginBottom: '2rem', color: 'var(--text-main)', fontSize: '0.9rem' }}>
                                <li style={{ marginBottom: '0.5rem', display: 'flex', gap: '0.5rem' }}><span>✓</span> {t('driver_dashboard.feature_24h')}</li>
                                <li style={{ marginBottom: '0.5rem', display: 'flex', gap: '0.5rem' }}><span>✓</span> {t('driver_dashboard.feature_unlimited')}</li>
                                {plan.es_vip && <li style={{ marginBottom: '0.5rem', display: 'flex', gap: '0.5rem', fontWeight: 'bold', color: 'var(--accent-color)' }}><span>✓</span> {t('driver_dashboard.feature_priority')}</li>}
                            </ul>
                            <Button
                                variant={suscripcion_activa && activePlan?.id === plan.id ? 'primary' : 'outline'}
                                disabled={processing || (suscripcion_activa && activePlan?.id === plan.id)}
                                onClick={() => handleSubscribe(plan.id)}
                                className="w-full"
                            >
                                {processing === plan.id ? t('driver_dashboard.processing') : (suscripcion_activa && activePlan?.id === plan.id ? t('driver_dashboard.current_plan') : t('driver_dashboard.activate_plan'))}
                            </Button>
                        </Card>
                    ))}
                </div>
            </main>
        </div>
    );
};

export default SuscripcionesMotorista;
