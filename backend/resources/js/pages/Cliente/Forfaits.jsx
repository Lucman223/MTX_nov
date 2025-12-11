import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';

const Forfaits = () => {
    const { refreshUser } = useAuth();
    const [forfaits, setForfaits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [processingPayment, setProcessingPayment] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchForfaits = async () => {
            try {
                const response = await axios.get('/api/forfaits/disponibles');
                setForfaits(response.data);
            } catch (error) {
                console.error("Error loading forfaits", error);
                toast.error("Error al cargar los planes");
            } finally {
                setLoading(false);
            }
        };

        fetchForfaits();
    }, []);

    const handleBuy = async (forfait) => {
        if (!confirm(`¿Confirmar compra de ${forfait.nombre} por ${forfait.precio} CFA?`)) return;

        setProcessingPayment(true);
        const toastId = toast.loading('Iniciando pago...');

        try {
            // 1. Iniciar pago
            const initResponse = await axios.post('/api/pagos/iniciar', {
                forfait_id: forfait.id,
                metodo_pago: 'orange_money'
            });

            const { transaction_id } = initResponse.data;
            toast.message('Procesando pago con Orange Money...', { id: toastId });

            // 2. Simular tiempo de procesamiento (2 segundos)
            await new Promise(resolve => setTimeout(resolve, 2000));

            // 3. Confirmar pago (Simulación)
            toast.loading('Confirmando transacción...', { id: toastId });
            await axios.post('/api/pagos/verificar', {
                transaction_id: transaction_id,
                status: 'success'
            });

            toast.success('¡Compra realizada con éxito!', { id: toastId });
            await refreshUser(); // Actualizar saldo de viajes
            navigate('/cliente');

        } catch (error) {
            console.error('Error buying forfait:', error);
            const msg = error.response?.data?.message || 'Error desconocido';
            toast.error(`Error en la compra: ${msg}`, { id: toastId });
        } finally {
            setProcessingPayment(false);
        }
    };

    return (
        <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto', fontFamily: 'sans-serif' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem', color: '#1f2937' }}>
                Planes de Viajes 🎟️
            </h1>
            <button
                onClick={() => navigate('/cliente')}
                disabled={processingPayment}
                style={{
                    marginBottom: '2rem',
                    padding: '0.5rem 1rem',
                    background: '#e5e7eb',
                    borderRadius: '0.5rem',
                    border: 'none',
                    cursor: 'pointer',
                    fontWeight: '600',
                    color: '#374151'
                }}
            >
                ← Volver al Dashboard
            </button>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '3rem', color: '#6b7280' }}>Cargando planes...</div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
                    {forfaits.map(plan => (
                        <div key={plan.id} style={{
                            border: '1px solid #e5e7eb',
                            borderRadius: '1rem',
                            padding: '2rem',
                            background: 'white',
                            boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
                            textAlign: 'center',
                            display: 'flex',
                            flexDirection: 'column',
                            opacity: processingPayment ? 0.7 : 1,
                            pointerEvents: processingPayment ? 'none' : 'auto'
                        }}>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#374151', marginBottom: '0.5rem' }}>{plan.nombre}</h2>
                            <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#2563eb', marginBottom: '1.5rem' }}>
                                {plan.precio.toLocaleString()} <span style={{ fontSize: '1rem', color: '#6b7280' }}>CFA</span>
                            </div>

                            <ul style={{ listStyle: 'none', padding: 0, marginBottom: '2rem', color: '#4b5563', textAlign: 'left', margin: '0 0 2rem 1rem' }}>
                                <li style={{ marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    ✅ <span style={{ fontWeight: '600' }}>{plan.viajes_incluidos} Viajes</span> incluidos
                                </li>
                                <li style={{ marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    📅 Validez de <span style={{ fontWeight: '600' }}>{plan.dias_validez} días</span>
                                </li>
                                <li style={{ marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    🛡️ Soporte prioritario
                                </li>
                            </ul>

                            <button
                                onClick={() => handleBuy(plan)}
                                disabled={processingPayment}
                                style={{
                                    width: '100%',
                                    padding: '1rem',
                                    background: '#2563eb',
                                    color: 'white',
                                    fontWeight: 'bold',
                                    borderRadius: '0.75rem',
                                    border: 'none',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                    marginTop: 'auto',
                                    fontSize: '1rem',
                                    boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)'
                                }}
                                onMouseOver={(e) => !processingPayment && (e.target.style.transform = 'translateY(-2px)')}
                                onMouseOut={(e) => !processingPayment && (e.target.style.transform = 'translateY(0)')}
                            >
                                {processingPayment ? 'Procesando...' : 'Comprar Ahora'}
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Forfaits;
