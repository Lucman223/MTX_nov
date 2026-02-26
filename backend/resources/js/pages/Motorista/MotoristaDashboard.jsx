import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import SEO from '../../components/Common/SEO';
import { Card, Button, Badge } from '../../components/Common/UIComponents';
import BottomNav from '../../components/Common/BottomNav';
import TripPhaseTracker from '../../components/Viaje/TripPhaseTracker';
import '../../../css/components.css';

const MotoristaDashboard = () => {
    const { logout, user } = useAuth();
    const { t } = useTranslation();
    const navigate = useNavigate();

    const [profile, setProfile] = useState(null);
    const [currentTrip, setCurrentTrip] = useState(null);
    const [viajes, setViajes] = useState([]);
    const [isOnline, setIsOnline] = useState(false);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const [profileRes, activeRes, pendingRes] = await Promise.all([
                axios.get('/api/motorista/perfil'),
                axios.get('/api/viajes/actual'),
                axios.get('/api/motorista/viajes/solicitados')
            ]);

            setProfile(profileRes.data);
            setIsOnline(profileRes.data.estado_actual === 'activo');

            if (activeRes.data && activeRes.data.id) {
                setCurrentTrip(activeRes.data);
            } else {
                setCurrentTrip(null);
            }

            setViajes(Array.isArray(pendingRes.data) ? pendingRes.data : []);
        } catch (error) {
            console.error("Error fetching dashboard data", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 8000);
        return () => clearInterval(interval);
    }, []);

    const toggleStatus = async () => {
        const newStatus = !isOnline ? 'activo' : 'inactivo';
        // Optimistic UI
        setIsOnline(!isOnline);
        try {
            await axios.put('/api/motorista/status', { estado_actual: newStatus });
            toast.success(newStatus === 'activo' ? 'Estás en línea' : 'Estás desconectado');
        } catch (error) {
            fetchData(); // Revert on error
            toast.error("Error al cambiar estado");
        }
    };

    const handleAcceptTrip = async (tripId) => {
        toast.loading("Aceptando viaje...", { id: 'accept' });
        try {
            await axios.post(`/api/viajes/${tripId}/aceptar`);
            toast.success("Viaje aceptado", { id: 'accept' });
            fetchData();
        } catch (error) {
            toast.error(error.response?.data?.error || "Error al aceptar", { id: 'accept' });
        }
    };

    const handleUpdateStatus = async (newStatus) => {
        try {
            await axios.put(`/api/motorista/viajes/${currentTrip.id}/status`, { estado: newStatus });
            toast.success("Estado actualizado");
            fetchData();
        } catch (error) {
            toast.error("Error al actualizar estado");
        }
    };

    if (loading && !profile) return <div className="p-8 text-center">Cargando Dashboard...</div>;

    return (
        <div className="dashboard-container driver-theme">
            <SEO title="Dashboard Motorista" />

            <header className="mtx-header driver-header">
                <div className="mtx-header-brand">
                    <img src="/logo.png" alt="Logo" className="mtx-header-logo" style={{ height: '40px' }} />
                    <div className="mtx-header-text">
                        <h1 className="header-title">MotoTX</h1>
                        <span className="header-subtitle">{user?.name} (Motorista)</span>
                    </div>
                </div>

                <button
                    onClick={toggleStatus}
                    className={`status-badge ${currentTrip ? 'in-service' : (isOnline ? 'online' : 'offline')}`}
                    style={{ padding: '0.5rem 1rem', borderRadius: '2rem', fontWeight: 'bold' }}
                >
                    {currentTrip ? 'EN VIAJE' : (isOnline ? 'ONLINE' : 'OFFLINE')}
                </button>
            </header>

            <main className="main-content-centered p-4" style={{ paddingBottom: '100px' }}>

                {/* Billetera Simplificada */}
                <Card style={{ background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)', color: 'white', marginBottom: '1.5rem' }}>
                    <div className="text-sm opacity-80 uppercase font-bold">Saldo Billetera</div>
                    <div className="text-3xl font-black">{profile?.billetera || 0} CFA</div>
                    <div className="text-xs mt-2 opacity-70">Listo para retirar hoy</div>
                </Card>

                {/* Viaje Activo */}
                {currentTrip && (
                    <Card style={{ border: '2px solid #059669', marginBottom: '1.5rem' }}>
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                            🚀 Viaje en Curso
                        </h2>
                        <TripPhaseTracker estado={currentTrip.estado} />

                        <div className="mt-4 space-y-2">
                            <p><strong>De:</strong> {currentTrip.origen}</p>
                            <p><strong>A:</strong> {currentTrip.destino}</p>
                            <p><strong>Cliente:</strong> {currentTrip.cliente?.name}</p>
                        </div>

                        <div className="mt-6 space-y-3">
                            {currentTrip.estado === 'aceptado' && (
                                <Button onClick={() => handleUpdateStatus('en_curso')} variant="primary" className="w-full py-4 text-lg">
                                    INICIAR VIAJE
                                </Button>
                            )}
                            {currentTrip.estado === 'en_curso' && (
                                <Button onClick={() => handleUpdateStatus('completado')} style={{ background: '#059669', color: 'white' }} className="w-full py-4 text-lg">
                                    FINALIZAR VIAJE
                                </Button>
                            )}
                            <Button onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${currentTrip.origen_lat},${currentTrip.origen_lng}`, '_blank')} variant="ghost" className="w-full">
                                🗺️ Ver en Maps
                            </Button>
                        </div>
                    </Card>
                )}

                {/* Lista de Viajes Pendientes */}
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-bold">📋 Pedidos Cerca</h2>
                        <Badge variant={isOnline ? 'success' : 'outline'}>
                            {isOnline ? 'Buscando...' : 'Desconectado'}
                        </Badge>
                    </div>

                    {viajes.length === 0 ? (
                        <div className="text-center p-12 bg-white rounded-xl border border-dashed border-gray-300">
                            <span className="text-4xl block mb-2">🔭</span>
                            <p className="text-gray-500">No hay pedidos por ahora</p>
                        </div>
                    ) : (
                        viajes.map(viaje => (
                            <Card key={viaje.id} className="animate-in fade-in slide-in-from-bottom-4">
                                <div className="flex justify-between items-start mb-3">
                                    <div className="font-bold text-lg">{viaje.cliente?.name}</div>
                                    <div className="text-green-600 font-black">{viaje.precio || 500} CFA</div>
                                </div>
                                <div className="text-sm text-gray-600 mb-4">
                                    <div>📍 {viaje.origen}</div>
                                    <div>🏁 {viaje.destino}</div>
                                </div>
                                <Button
                                    onClick={() => handleAcceptTrip(viaje.id)}
                                    variant="primary"
                                    className="w-full py-3"
                                    disabled={!isOnline}
                                >
                                    ACEPTAR PEDIDO
                                </Button>
                            </Card>
                        ))
                    )}
                </div>
            </main>

            <BottomNav role="motorista" />
        </div >
    );
};

export default MotoristaDashboard;
