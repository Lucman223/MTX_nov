import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

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
        const gradients = [
            'linear-gradient(135deg, #60a5fa 0%, #2563eb 100%)',   // Blue
            'linear-gradient(135deg, #34d399 0%, #059669 100%)',   // Green
            'linear-gradient(135deg, #ffbbf2 0%, #d946ef 100%)',   // Pink
            'linear-gradient(135deg, #fbbf24 0%, #d97706 100%)',   // Gold
        ];
        return gradients[index % gradients.length];
    };

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#f3f4f6', padding: '2rem 1rem' }}>
            <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
                <header style={{ marginBottom: '2.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <button
                        onClick={() => navigate('/cliente/dashboard')}
                        style={{
                            background: 'white',
                            border: 'none',
                            borderRadius: '50%',
                            width: '40px',
                            height: '40px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '1.25rem',
                            cursor: 'pointer',
                            boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                        }}
                    >
                        ⬅️
                    </button>
                    <div>
                        <h1 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#111827', margin: 0 }}>
                            {t('client_forfaits.title')}
                        </h1>
                        <p style={{ color: '#6b7280', margin: 0 }}>Elige el paquete que mejor se adapte a ti</p>
                    </div>
                </header>

                {loading ? (
                    <div className="text-center p-8 text-gray-500 font-medium">{t('common.loading')}</div>
                ) : (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                        gap: '1.5rem',
                        marginBottom: '3rem'
                    }}>
                        {forfaits.map((forfait, index) => (
                            <div
                                key={forfait.id}
                                onClick={() => setSelectedForfait(forfait)}
                                style={{
                                    background: selectedForfait?.id === forfait.id ? getCardStyle(index) : 'white',
                                    color: selectedForfait?.id === forfait.id ? 'white' : '#1f2937',
                                    borderRadius: '1.5rem',
                                    padding: '2rem',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                    transform: selectedForfait?.id === forfait.id ? 'scale(1.03) translateY(-5px)' : 'scale(1)',
                                    boxShadow: selectedForfait?.id === forfait.id
                                        ? '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
                                        : '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                                    border: selectedForfait?.id === forfait.id ? 'none' : '1px solid #e5e7eb',
                                    position: 'relative',
                                    overflow: 'hidden'
                                }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                                    <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                                        {forfait.nombre}
                                    </h3>
                                    {selectedForfait?.id === forfait.id && (
                                        <span style={{ fontSize: '1.5rem' }}>✨</span>
                                    )}
                                </div>

                                <div style={{ marginBottom: '1.5rem' }}>
                                    <span style={{ fontSize: '2.5rem', fontWeight: '800' }}>
                                        {forfait.precio}
                                    </span>
                                    <span style={{ fontSize: '1rem', opacity: 0.8, marginLeft: '4px' }}>CFA</span>
                                </div>

                                <div style={{
                                    padding: '0.75rem',
                                    borderRadius: '0.75rem',
                                    background: selectedForfait?.id === forfait.id ? 'rgba(255,255,255,0.2)' : '#f3f4f6',
                                    marginBottom: '1rem',
                                    fontWeight: '600'
                                }}>
                                    🚀 {t('client_forfaits.trips_count', { count: forfait.viajes_incluidos || forfait.viajes })}
                                </div>

                                <p style={{ fontSize: '0.9rem', opacity: 0.9, lineHeight: '1.5' }}>
                                    {forfait.descripcion || t('client_forfaits.default_desc')}
                                </p>
                            </div>
                        ))}
                    </div>
                )}

                {/* Payment Section */}
                {selectedForfait && (
                    <div style={{
                        marginTop: '2rem',
                        backgroundColor: 'white',
                        borderRadius: '1.5rem',
                        padding: '2.5rem',
                        boxShadow: '0 -10px 40px rgba(0,0,0,0.1)',
                        animation: 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                        maxWidth: '600px',
                        margin: '0 auto'
                    }}>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#111827' }}>
                            <img src="/om-logo.png" onError={(e) => e.target.style.display = 'none'} alt="" style={{ height: '24px' }} />
                            {t('client_forfaits.payment_title')}
                        </h2>

                        <form onSubmit={handleBuy}>
                            <div style={{ marginBottom: '2rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.75rem', fontWeight: '600', color: '#374151', fontSize: '0.95rem' }}>
                                    {t('client_forfaits.phone_label')}
                                </label>
                                <div style={{ position: 'relative' }}>
                                    <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', fontSize: '1.2rem' }}>📱</span>
                                    <input
                                        type="text"
                                        value={phoneNumber}
                                        onChange={(e) => setPhoneNumber(e.target.value)}
                                        placeholder="Ej: 771234567"
                                        style={{
                                            width: '100%',
                                            padding: '1rem 1rem 1rem 3rem',
                                            borderRadius: '0.75rem',
                                            border: '2px solid #e5e7eb',
                                            fontSize: '1.1rem',
                                            outline: 'none',
                                            transition: 'border-color 0.2s',
                                            backgroundColor: '#f9fafb'
                                        }}
                                        onFocus={(e) => { e.target.style.borderColor = '#ea580c'; e.target.style.backgroundColor = 'white'; }}
                                        onBlur={(e) => { e.target.style.borderColor = '#e5e7eb'; e.target.style.backgroundColor = '#f9fafb'; }}
                                        required
                                        pattern="\d{8,}"
                                        disabled={processing}
                                    />
                                </div>
                                <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <span>ℹ️</span>
                                    <span dangerouslySetInnerHTML={{ __html: t('client_forfaits.debit_warning', { amount: selectedForfait.precio }) }} />
                                </p>
                            </div>

                            {statusMessage && (
                                <div style={{
                                    padding: '1rem',
                                    marginBottom: '1.5rem',
                                    backgroundColor: statusMessage.type === 'error' ? '#fef2f2' : '#eff6ff',
                                    color: statusMessage.type === 'error' ? '#b91c1c' : '#1d4ed8',
                                    borderRadius: '0.75rem',
                                    textAlign: 'center',
                                    fontSize: '0.95rem',
                                    border: `1px solid ${statusMessage.type === 'error' ? '#fecaca' : '#bfdbfe'}`
                                }}>
                                    {statusMessage.text}
                                    {processing && <div style={{ marginTop: '0.5rem', fontWeight: 'bold' }}>⏳ {t('client_forfaits.waiting')}</div>}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={processing}
                                style={{
                                    width: '100%',
                                    padding: '1.25rem',
                                    borderRadius: '1rem',
                                    border: 'none',
                                    background: processing ? '#9ca3af' : 'linear-gradient(to right, #ea580c, #c2410c)',
                                    color: 'white',
                                    fontWeight: 'bold',
                                    fontSize: '1.1rem',
                                    cursor: processing ? 'not-allowed' : 'pointer',
                                    boxShadow: processing ? 'none' : '0 4px 6px -1px rgba(234, 88, 12, 0.3)',
                                    transition: 'transform 0.1s',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '0.75rem'
                                }}
                                onMouseDown={(e) => !processing && (e.currentTarget.style.transform = 'scale(0.98)')}
                                onMouseUp={(e) => !processing && (e.currentTarget.style.transform = 'scale(1)')}
                            >
                                {processing ? (
                                    <>{t('client_forfaits.processing')}</>
                                ) : (
                                    <>
                                        <span>💳</span>
                                        {t('client_forfaits.pay_btn', { amount: selectedForfait.precio })}
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                )}
            </div>
            <style>{`
                @keyframes slideUp {
                    from { transform: translateY(50px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
            `}</style>
        </div >
    );
};

export default ClienteForfaits;
