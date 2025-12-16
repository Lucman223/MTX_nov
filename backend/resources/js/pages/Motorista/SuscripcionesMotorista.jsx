import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';

const SuscripcionesMotorista = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [planes, setPlanes] = useState([]);
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
            console.error('Error loading data:', error);
            toast.error('Error al cargar planes');
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
                phone: phone
            });

            toast.success('¡Suscripción activada con éxito!');
            fetchPlanesAndStatus(); // Refresh status
        } catch (error) {
            console.error('Error subscribing:', error);
            toast.error('Error en el pago');
        } finally {
            setProcessing(null);
        }
    };

    if (loading) return <div className="p-8 text-center">Cargando planes...</div>;

    const { suscripcion_activa, plan: activePlan, fecha_fin, viajes_prueba_restantes, acceso_permitido } = currentStatus || {};

    return (
        <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto', fontFamily: 'system-ui' }}>
            <button onClick={() => navigate('/motorista')} style={{ marginBottom: '1rem', background: 'none', border: 'none', color: '#666', cursor: 'pointer' }}>
                ← Volver al Dashboard
            </button>

            <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem', color: '#111827' }}>
                Abonos y Suscripciones
            </h1>

            {!acceso_permitido && (
                <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', color: '#991b1b', padding: '1rem', borderRadius: '0.5rem', marginBottom: '2rem' }}>
                    <strong>⚠️ Acceso Bloqueado:</strong> No tienes viajes de prueba restantes ni suscripción activa. Debes adquirir un plan para trabajar.
                </div>
            )}

            <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '1rem', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>Estado Actual</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
                    <div>
                        <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>Estado Cuenta</div>
                        <div style={{ fontSize: '1.125rem', fontWeight: 'bold', color: acceso_permitido ? '#10b981' : '#ef4444' }}>
                            {acceso_permitido ? '✅ Habilitado' : '❌ Bloqueado'}
                        </div>
                    </div>
                    <div>
                        <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>Viajes Prueba Restantes</div>
                        <div style={{ fontSize: '1.125rem', fontWeight: 'bold' }}>
                            {viajes_prueba_restantes}
                        </div>
                    </div>
                    <div>
                        <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>Suscripción Activa</div>
                        <div style={{ fontSize: '1.125rem', fontWeight: 'bold', color: suscripcion_activa ? '#2563eb' : '#6b7280' }}>
                            {suscripcion_activa ? activePlan?.nombre : 'Ninguna'}
                        </div>
                    </div>
                    {suscripcion_activa && (
                        <div>
                            <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>Vence el</div>
                            <div style={{ fontSize: '1.125rem', fontWeight: 'bold' }}>
                                {new Date(fecha_fin).toLocaleDateString()}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem', color: '#111827' }}>
                Planes Disponibles
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
                {planes.map(plan => (
                    <div key={plan.id} style={{
                        backgroundColor: 'white',
                        padding: '1.5rem',
                        borderRadius: '1rem',
                        border: plan.es_vip ? '2px solid #f59e0b' : '1px solid #e5e7eb',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
                        position: 'relative'
                    }}>
                        {plan.es_vip && (
                            <div style={{ position: 'absolute', top: -12, right: 20, background: '#f59e0b', color: 'white', padding: '0.25rem 0.75rem', borderRadius: '1rem', fontSize: '0.75rem', fontWeight: 'bold' }}>
                                VIP
                            </div>
                        )}
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>{plan.nombre}</h3>
                        <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2563eb', marginBottom: '0.5rem' }}>
                            {plan.precio} CFA
                        </div>
                        <p style={{ color: '#6b7280', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
                            Validez: {plan.dias_validez} días
                        </p>
                        <ul style={{ listStyle: 'none', padding: 0, marginBottom: '1.5rem', color: '#374151' }}>
                            <li style={{ marginBottom: '0.5rem' }}>✓ Acceso 24h a plataforma</li>
                            <li style={{ marginBottom: '0.5rem' }}>✓ Recepción de viajes ilimitada</li>
                            {plan.es_vip && <li style={{ marginBottom: '0.5rem', fontWeight: 'bold', color: '#f59e0b' }}>✓ Prioridad en asignación</li>}
                        </ul>
                        <button
                            disabled={processing || (suscripcion_activa && activePlan?.id === plan.id)}
                            onClick={() => handleSubscribe(plan.id)}
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                borderRadius: '0.5rem',
                                border: 'none',
                                background: suscripcion_activa && activePlan?.id === plan.id ? '#10b981' : '#2563eb',
                                color: 'white',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                opacity: processing ? 0.7 : 1
                            }}
                        >
                            {processing === plan.id ? 'Procesando...' : (suscripcion_activa && activePlan?.id === plan.id ? 'Plan Actual' : 'Activar Plan')}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SuscripcionesMotorista;
