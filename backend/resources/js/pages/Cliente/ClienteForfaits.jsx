import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import SEO from '../../components/Common/SEO';
import { Card, Button, Badge } from '../../components/Common/UIComponents';
import '../../css/components.css';

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
            console.error('Error fetching forfaits:', error);
            if (forfaits.length === 0) {
                setForfaits([
                    { id: 1, nombre: 'Pack Prueba', precio: 2500, viajes_incluidos: 5, descripcion: 'Ideal para probar' },
                    { id: 2, nombre: 'Pack Estándar', precio: 5000, viajes_incluidos: 10, descripcion: 'El más popular' },
                    { id: 3, nombre: 'Pack Viajero', precio: 9000, viajes_incluidos: 20, descripcion: 'Para usuarios frecuentes' },
                    { id: 4, nombre: 'Pack Pro', precio: 2000, viajes_incluidos: 50, descripcion: 'Máximo ahorro' }
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
            console.error('Payment init error:', error);
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
                console.error('Polling error', error);
            }
        }, 2000);
    };

    const finishPurchase = (msg) => {
        setProcessing(false);
        const successMsg = msg || t('client_forfaits.purchase_success');
        toast.success(successMsg);
        setStatusMessage({ type: 'success', text: successMsg });
        setTimeout(() => {
            setSelectedForfait(null);
            setPhoneNumber('');
            navigate('/cliente/dashboard');
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
                    <Button variant="ghost" onClick={() => navigate('/cliente')} label="Volver">
                        ←
                    </Button>
                    <div>
                        <h1 className="header-title" style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>
                            {t('client_forfaits.title')}
                        </h1>
                        <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '0.875rem' }}>Elige el paquete que mejor se adapte a ti</p>
                    </div>
                </div>
            </header>

            <main className="main-content-centered">

                {loading ? (
                    <div className="loading-state">{t('common.loading')}</div>
                ) : (
                    <div className="forfaits-grid" style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
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
                                        {forfait.nombre}
                                    </h3>
                                    {selectedForfait?.id === forfait.id && (
                                        <Badge variant="premium">SELECCIONADO</Badge>
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
                                    {forfait.descripcion || t('client_forfaits.default_desc')}
                                </p>
                            </Card>
                        ))}
                    </div>
                )}

                {/* Payment Section */}
                {selectedForfait && (
                    <Card style={{
                        marginTop: '2rem',
                        maxWidth: '600px',
                        margin: '0 auto'
                    }}>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-main)' }}>
                            <img src="/om-logo.png" onError={(e) => e.target.style.display = 'none'} alt="" style={{ height: '24px' }} />
                            {t('client_forfaits.payment_title')}
                        </h2>

                        <form onSubmit={handleBuy}>
                            <div style={{ marginBottom: '2rem' }}>
                                <label className="form-label">
                                    {t('client_forfaits.phone_label')}
                                </label>
                                <div style={{ position: 'relative' }}>
                                    <input
                                        type="text"
                                        value={phoneNumber}
                                        onChange={(e) => setPhoneNumber(e.target.value)}
                                        placeholder="Ej: 771234567"
                                        className="mtx-input"
                                        style={{ paddingLeft: '3rem' }}
                                        required
                                        pattern="\d{8,}"
                                        disabled={processing}
                                    />
                                    <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', fontSize: '1.2rem' }}>📱</span>
                                </div>
                                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <span>ℹ️</span>
                                    <span dangerouslySetInnerHTML={{ __html: t('client_forfaits.debit_warning', { amount: selectedForfait.precio }) }} />
                                </p>
                            </div>

                            {statusMessage && (
                                <div style={{
                                    padding: '1rem',
                                    marginBottom: '1.5rem',
                                    backgroundColor: statusMessage.type === 'error' ? 'var(--bg-light)' : 'rgba(37, 99, 235, 0.05)',
                                    color: statusMessage.type === 'error' ? 'var(--error-color)' : 'var(--primary-color)',
                                    borderRadius: '0.75rem',
                                    textAlign: 'center',
                                    fontSize: '0.95rem',
                                    border: `1px solid ${statusMessage.type === 'error' ? 'var(--error-color)' : 'var(--primary-color)'}`
                                }}>
                                    {statusMessage.text}
                                    {processing && <div style={{ marginTop: '0.5rem', fontWeight: 'bold' }}>⏳ {t('client_forfaits.waiting')}</div>}
                                </div>
                            )}

                            <Button
                                type="submit"
                                disabled={processing}
                                className="w-full"
                            >
                                {processing ? (
                                    <>{t('client_forfaits.processing')}</>
                                ) : (
                                    <>
                                        <span>💳</span>
                                        {t('client_forfaits.pay_btn', { amount: selectedForfait.precio })}
                                    </>
                                )}
                            </Button>
                        </form>
                    </Card>
                )}
            </main>
        </div>
    );
};

export default ClienteForfaits;
