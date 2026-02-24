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
 * ClienteForfaits Component
 *
 * [ES] Página de compra de paquetes de viajes para clientes.
 *      Lista los forfaits disponibles, maneja la integración de pagos con Orange Money y el seguimiento del estado del pago.
 *
 * [FR] Page d'achat de forfaits de voyage pour les clients.
 *      Répertorie les forfaits disponibles, gère l'intégration des paiements avec Orange Money et le suivi de l'état du paiement.
 */
const ClienteForfaits = () => {
    const { user } = useAuth();
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [forfaits, setForfaits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedForfait, setSelectedForfait] = useState(null);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        fetchForfaits();
    }, []);

    const fetchForfaits = async () => {
        try {
            const response = await axios.get('/api/forfaits/disponibles');
            setForfaits(response.data);
        } catch (error) {
            if (forfaits.length === 0) {
                setForfaits([
                    { id: 1, nombre: t('plans.Prueba', 'Pack Prueba'), precio: 2500, viajes_incluidos: 5, descripcion: t('plans.Prueba_desc', 'Ideal para probar') },
                    { id: 2, nombre: t('plans.Estándar', 'Pack Estándar'), precio: 5000, viajes_incluidos: 10, descripcion: t('plans.Estándar_desc', 'El más popular') },
                    { id: 3, nombre: t('plans.Viajero', 'Pack Viajero'), precio: 9000, viajes_incluidos: 20, descripcion: t('plans.Viajero_desc', 'Para usuarios frecuentes') },
                    { id: 4, nombre: t('plans.Pro', 'Pack Pro'), precio: 20000, viajes_incluidos: 50, descripcion: t('plans.Pro_desc', 'Máximo ahorro') }
                ]);
            }
        } finally {
            setLoading(false);
        }
    };

    const [statusMessage, setStatusMessage] = useState(null);

    const handleBuy = async (e) => {
        e.preventDefault();
        if (!selectedForfait || !phoneNumber) return;

        setProcessing(true);
        setStatusMessage(null);

        try {
            const initResponse = await axios.post('/api/forfaits/buy', {
                forfait_id: selectedForfait.id,
                phone_number: phoneNumber
            });

            if (initResponse.data.status === 'pending') {
                setStatusMessage({ type: 'info', text: initResponse.data.message });
                const orderId = initResponse.data.order_id;
                pollStatus(orderId);
            } else {
                finishPurchase();
            }

        } catch (error) {
            setStatusMessage({ type: 'error', text: error.response?.data?.error || t('client_forfaits.payment_error') });
            setProcessing(false);
        }
    };

    const pollStatus = async (orderId) => {
        let attempts = 0;
        const maxAttempts = 10;
        const interval = setInterval(async () => {
            attempts++;
            try {
                const response = await axios.post('/api/forfaits/check-status', {
                    order_id: orderId,
                    forfait_id: selectedForfait.id
                });
                if (response.data.status === 'SUCCESS') {
                    clearInterval(interval);
                    finishPurchase(response.data.message);
                } else if (attempts >= maxAttempts) {
                    clearInterval(interval);
                    setProcessing(false);
                    setStatusMessage({ type: 'error', text: t('client_forfaits.timeout_error') });
                }
            } catch (error) {
            }
        }, 2000);
    };

    const finishPurchase = (msg) => {
        setProcessing(false);
        const successMsg = msg || t('client_forfaits.purchase_success');
        toast.success(successMsg);
        setStatusMessage({ type: 'success', text: successMsg });

        // Refresh local user state (viajes_restantes)
        refreshUser();

        setTimeout(() => {
            setSelectedForfait(null);
            setPhoneNumber('');
            navigate('/cliente');
        }, 2000);
    };

    const getCardStyle = (index) => {
        const colors = ['#2563eb', '#059669', '#d946ef', '#f59e0b'];
        return colors[index % colors.length];
    };

    return (
        <div className="dashboard-container">
            <SEO title={t('client_forfaits.title')} />

            <header className="mtx-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <Button variant="ghost" onClick={() => navigate('/cliente')} label={t('client_forfaits.back')}>
                        ←
                    </Button>
                    <div>
                        <h1 className="header-title" style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>
                            {t('client_forfaits.title')}
                        </h1>
                        <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '0.875rem' }}>{t('client_forfaits.subtitle')}</p>
                    </div>
                </div>
            </header>

            <main className="main-content-centered">

                {loading ? (
                    <div className="loading-state">{t('common.loading')}</div>
                ) : (
                    <div className="forfaits-grid" style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(17rem, 1fr))',
                        gap: '1.5rem',
                        marginBottom: '3rem'
                    }}>
                        {forfaits.map((forfait, index) => (
                            <Card
                                key={forfait.id}
                                onClick={() => setSelectedForfait(forfait)}
                                style={{
                                    borderTop: selectedForfait?.id === forfait.id ? `8px solid ${getCardStyle(index)}` : '1px solid var(--border-color)',
                                    transform: selectedForfait?.id === forfait.id ? 'translateY(-10px)' : 'none',
                                    cursor: 'pointer'
                                }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                                    <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--text-main)' }}>
                                        {t(`plans.${forfait.nombre}`, forfait.nombre)}
                                    </h3>
                                    {selectedForfait?.id === forfait.id && (
                                        <Badge variant="premium">{t('client_forfaits.selected')}</Badge>
                                    )}
                                </div>

                                <div style={{ marginBottom: '1.5rem' }}>
                                    <span style={{ fontSize: '2.5rem', fontWeight: '800', color: getCardStyle(index) }}>
                                        {forfait.precio}
                                    </span>
                                    <span style={{ fontSize: '1rem', color: 'var(--text-muted)', marginLeft: '4px' }}>CFA</span>
                                </div>

                                <div style={{
                                    padding: '0.75rem',
                                    borderRadius: '0.75rem',
                                    background: 'var(--bg-light)',
                                    marginBottom: '1rem',
                                    fontWeight: '600',
                                    color: 'var(--text-main)'
                                }}>
                                    🚀 {t('client_forfaits.trips_count', { count: forfait.viajes_incluidos || forfait.viajes })}
                                </div>

                                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                                    {t(`plans.${forfait.nombre}_desc`, forfait.descripcion || t('client_forfaits.default_desc'))}
                                </p>
                            </Card>
                        ))}
                    </div>
                )}

                {/* Payment Section - Redesigned for Transparency */}
                {selectedForfait && (
                    <Card style={{
                        marginTop: '2rem',
                        maxWidth: '42rem',
                        width: '100%',
                        margin: '2rem auto 0',
                        boxSizing: 'border-box',
                        border: '1px solid var(--primary-color)',
                        boxShadow: '0 8px 30px rgba(37, 99, 235, 0.1)'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0, color: 'var(--text-main)' }}>
                                🛒 {t('client_forfaits.checkout_title')}
                            </h2>
                            <Button variant="ghost" onClick={() => { setSelectedForfait(null); setStatusMessage(null); }} size="sm">
                                ✕
                            </Button>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                            {/* Left: Order Summary */}
                            <div style={{ background: 'var(--bg-light)', padding: '1.5rem', borderRadius: '1rem' }}>
                                <h3 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '1rem', fontWeight: 'bold' }}>
                                    {t('client_forfaits.confirm_details')}
                                </h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span style={{ color: 'var(--text-muted)' }}>{t('client_forfaits.pack_name')}:</span>
                                        <span style={{ fontWeight: 'bold' }}>{t(`plans.${selectedForfait.nombre}`, selectedForfait.nombre)}</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span style={{ color: 'var(--text-muted)' }}>{t('client_forfaits.trip_units')}:</span>
                                        <span style={{ fontWeight: 'bold' }}>{selectedForfait.viajes_incluidos || selectedForfait.viajes}</span>
                                    </div>
                                    <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{ fontWeight: 'bold', color: 'var(--text-main)' }}>{t('client_forfaits.total_to_pay')}:</span>
                                        <span style={{ fontSize: '1.5rem', fontWeight: '900', color: 'var(--primary-color)' }}>
                                            {selectedForfait.precio.toLocaleString()} CFA
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Right: Payment Logic */}
                            <div>
                                {!statusMessage && !processing ? (
                                    <>
                                        <h3 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '1rem', fontWeight: 'bold' }}>
                                            {t('client_forfaits.select_gateway')}
                                        </h3>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                                            <div
                                                onClick={() => setStatusMessage(null)}
                                                style={{
                                                    border: '2px solid var(--primary-color)',
                                                    borderRadius: '0.75rem',
                                                    padding: '0.75rem',
                                                    textAlign: 'center',
                                                    cursor: 'pointer',
                                                    background: 'rgba(37, 99, 235, 0.05)'
                                                }}
                                            >
                                                <div style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>🟠</div>
                                                <div style={{ fontSize: '0.75rem', fontWeight: 'bold' }}>{t('client_forfaits.gateway_om')}</div>
                                            </div>
                                            <div
                                                style={{
                                                    border: '1px solid var(--border-color)',
                                                    borderRadius: '0.75rem',
                                                    padding: '0.75rem',
                                                    textAlign: 'center',
                                                    opacity: 0.6,
                                                    cursor: 'not-allowed'
                                                }}
                                            >
                                                <div style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>🔵</div>
                                                <div style={{ fontSize: '0.75rem', fontWeight: 'bold' }}>{t('client_forfaits.gateway_moov')}</div>
                                            </div>
                                        </div>

                                        <form onSubmit={handleBuy}>
                                            <div style={{ marginBottom: '1.5rem' }}>
                                                <label className="form-label" style={{ fontSize: '0.8rem' }}>
                                                    {t('client_forfaits.phone_label')}
                                                </label>
                                                <div style={{ position: 'relative' }}>
                                                    <input
                                                        type="text"
                                                        value={phoneNumber}
                                                        onChange={(e) => setPhoneNumber(e.target.value)}
                                                        placeholder={t('client_forfaits.phone_placeholder')}
                                                        className="mtx-input"
                                                        style={{ paddingLeft: '2.5rem', fontSize: '0.9rem' }}
                                                        required
                                                        pattern="\d{8,}"
                                                        disabled={processing}
                                                    />
                                                    <span style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }}>📱</span>
                                                </div>
                                            </div>

                                            <Button type="submit" className="w-full" size="lg">
                                                {t('client_forfaits.pay_now')}
                                            </Button>
                                        </form>
                                    </>
                                ) : (
                                    <div style={{
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'center',
                                        textAlign: 'center',
                                        padding: '1rem'
                                    }}>
                                        {statusMessage?.type === 'info' && (
                                            <>
                                                <div style={{
                                                    width: '3.5rem', height: '3.5rem',
                                                    border: '4px solid #e2e8f0',
                                                    borderTopColor: 'var(--primary-color)',
                                                    borderRadius: '50%',
                                                    animation: 'spin 1s linear infinite',
                                                    margin: '0 auto 1.5rem'
                                                }} />
                                                <h4 style={{ margin: '0 0 0.5rem', color: 'var(--primary-color)' }}>{t('client_forfaits.processing')}</h4>
                                                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{statusMessage.text}</p>
                                                <div style={{ marginTop: '1rem', fontWeight: 'bold', fontSize: '0.9rem', color: 'var(--text-main)' }}>
                                                    📲 {t('client_forfaits.waiting')}
                                                </div>
                                            </>
                                        )}
                                        {statusMessage?.type === 'error' && (
                                            <>
                                                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>❌</div>
                                                <h4 style={{ margin: '0 0 0.5rem', color: 'var(--error-color)' }}>{t('common.error')}</h4>
                                                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>{statusMessage.text}</p>
                                                <Button variant="outline" size="sm" onClick={() => setStatusMessage(null)}>
                                                    {t('common.back')}
                                                </Button>
                                            </>
                                        )}
                                        {statusMessage?.type === 'success' && (
                                            <>
                                                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
                                                <h4 style={{ margin: '0 0 0.5rem', color: '#10b981' }}>{t('common.success')}</h4>
                                                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{statusMessage.text}</p>
                                            </>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div style={{ marginTop: '1.5rem', fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
                            🔒 {t('auth.rgpd_notice')}
                        </div>
                    </Card>
                )}
            </main>
        </div>
    );
};

export default ClienteForfaits;

