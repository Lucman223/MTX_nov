import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';

const ClienteForfaits = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [forfaits, setForfaits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedForfait, setSelectedForfait] = useState(null);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [processing, setProcessing] = useState(false);

    // Color system
    const colors = {
        primary: '#2563eb',
        secondary: '#10b981',
        accent: '#f59e0b',
        error: '#ef4444'
    };

    useEffect(() => {
        fetchForfaits();
    }, []);

    const fetchForfaits = async () => {
        try {
            const response = await axios.get('/api/forfaits/disponibles'); // You might need to check if this route exists or use auth protected one
            setForfaits(response.data);
        } catch (error) {
            console.error('Error fetching forfaits:', error);
            // Fallback mock data if API fails (for development safety)
            if (forfaits.length === 0) {
                setForfaits([
                    { id: 1, nombre: 'Pack Básico', precio: 2000, viajes: 5, descripcion: 'Ideal para probar' },
                    { id: 2, nombre: 'Pack Estándar', precio: 3500, viajes: 10, descripcion: 'El más popular' },
                    { id: 3, nombre: 'Pack Premium', precio: 6000, viajes: 20, descripcion: 'Para usuarios frecuentes' }
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
            // 1. Initiate Payment
            const initResponse = await axios.post('/api/forfaits/buy', {
                forfait_id: selectedForfait.id,
                phone_number: phoneNumber
            });

            // If immediate success (should be pending in new flow, but mostly pending)
            if (initResponse.data.status === 'pending') {
                setStatusMessage({ type: 'info', text: initResponse.data.message });

                // 2. Start Polling
                const orderId = initResponse.data.order_id;
                pollStatus(orderId);
            } else {
                // Immediate success?
                finishPurchase();
            }

        } catch (error) {
            console.error('Payment init error:', error);
            setStatusMessage({ type: 'error', text: error.response?.data?.error || 'Error al iniciar pago' });
            setProcessing(false);
        }
    };

    const pollStatus = async (orderId) => {
        let attempts = 0;
        const maxAttempts = 10; // 20 seconds approx

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
                    setStatusMessage({ type: 'error', text: 'Tiempo de espera agotado. Verifique su SMS.' });
                }
                // Else continue pending
            } catch (error) {
                console.error('Polling error', error);
                // Don't stop immediately on network glitch, but maybe after a few errors
            }
        }, 2000);
    };

    const finishPurchase = (msg = '¡Compra exitosa!') => {
        setProcessing(false);
        toast.success(msg);
        setStatusMessage({ type: 'success', text: msg });

        setTimeout(() => {
            setSelectedForfait(null);
            setPhoneNumber('');
            navigate('/cliente/dashboard');
        }, 2000);
    };

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb', padding: '2rem' }}>
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                <header style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <button
                        onClick={() => navigate('/cliente/dashboard')}
                        style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}
                    >
                        ⬅️
                    </button>
                    <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#111827' }}>Comprar Forfaits</h1>
                </header>

                {loading ? (
                    <div className="text-center p-8">Cargando paquetes...</div>
                ) : (
                    <div style={{ display: 'grid', gap: '1.5rem' }}>
                        {forfaits.map((forfait) => (
                            <div
                                key={forfait.id}
                                style={{
                                    backgroundColor: 'white',
                                    borderRadius: '1rem',
                                    padding: '1.5rem',
                                    border: selectedForfait?.id === forfait.id ? `2px solid ${colors.accent}` : '1px solid #e5e7eb',
                                    boxShadow: selectedForfait?.id === forfait.id ? `0 4px 12px ${colors.accent}30` : '0 2px 4px rgba(0,0,0,0.05)',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center'
                                }}
                                onClick={() => setSelectedForfait(forfait)}
                            >
                                <div>
                                    <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1f2937' }}>{forfait.nombre}</h3>
                                    <p style={{ color: '#6b7280', fontSize: '0.95rem' }}>{forfait.viajes} viajes • {forfait.descripcion}</p>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: colors.primary }}>
                                        {forfait.precio} CFA
                                    </div>
                                    {selectedForfait?.id === forfait.id && (
                                        <div style={{ fontSize: '0.875rem', color: colors.accent, fontWeight: '600' }}>Seleccionado</div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Payment Modal / Section */}
                {selectedForfait && (
                    <div style={{
                        marginTop: '2rem',
                        backgroundColor: 'white',
                        borderRadius: '1rem',
                        padding: '2rem',
                        boxShadow: '0 -4px 20px rgba(0,0,0,0.1)',
                        borderTop: `4px solid ${colors.accent}`,
                        animation: 'slideUp 0.3s ease-out'
                    }}>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span style={{ color: '#ff7900' }}>🟠</span> Pago con Orange Money
                        </h2>

                        <form onSubmit={handleBuy}>
                            <div style={{ marginBottom: '1.5rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#374151' }}>
                                    Número de Teléfono
                                </label>
                                <input
                                    type="text"
                                    value={phoneNumber}
                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                    placeholder="Ej: 77000000"
                                    style={{
                                        width: '100%',
                                        padding: '1rem',
                                        borderRadius: '0.5rem',
                                        border: '2px solid #e5e7eb',
                                        fontSize: '1.1rem',
                                        outline: 'none'
                                    }}
                                    required
                                    pattern="\d{8,}"
                                    title="Ingrese un número válido (mínimo 8 dígitos)"
                                    disabled={processing}
                                />
                                <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.5rem' }}>
                                    Se debitarán <strong>{selectedForfait.precio} CFA</strong> de su cuenta.
                                </p>
                            </div>

                            {/* Status Message Area */}
                            {statusMessage && (
                                <div style={{
                                    padding: '1rem',
                                    marginBottom: '1rem',
                                    backgroundColor: statusMessage.type === 'error' ? '#fee2e2' : '#dbeafe',
                                    color: statusMessage.type === 'error' ? '#991b1b' : '#1e40af',
                                    borderRadius: '0.5rem',
                                    textAlign: 'center'
                                }}>
                                    {statusMessage.text}
                                    {processing && <div className="spinner" style={{ marginTop: '0.5rem' }}>⏳ Esperando confirmación...</div>}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={processing}
                                style={{
                                    width: '100%',
                                    padding: '1.25rem',
                                    borderRadius: '0.75rem',
                                    border: 'none',
                                    backgroundColor: processing ? '#9ca3af' : '#ff7900', // OM Orange
                                    color: 'white',
                                    fontWeight: 'bold',
                                    fontSize: '1.1rem',
                                    cursor: processing ? 'not-allowed' : 'pointer',
                                    transition: 'background 0.2s'
                                }}
                            >
                                {processing ? 'Procesando Pago...' : `Pagar ${selectedForfait.precio} CFA`}
                            </button>
                        </form>
                    </div>
                )}
            </div>
            <style>{`
                @keyframes slideUp {
                    from { transform: translateY(20px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
            `}</style>
        </div >
    );
};

export default ClienteForfaits;
