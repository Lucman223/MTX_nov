import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const AdminViajes = () => {
    const navigate = useNavigate();
    const [viajes, setViajes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('todos');

    useEffect(() => {
        fetchViajes();
    }, []);

    const fetchViajes = async () => {
        try {
            const response = await axios.get('/api/admin/viajes');
            setViajes(response.data);
        } catch (error) {
            console.error('Error loading viajes:', error);
            toast.error('Error al cargar historial de viajes');
        } finally {
            setLoading(false);
        }
    };

    const statusColors = {
        pendiente: 'bg-yellow-100 text-yellow-800',
        aceptado: 'bg-blue-100 text-blue-800',
        en_curso: 'bg-purple-100 text-purple-800',
        completado: 'bg-green-100 text-green-800',
        cancelado: 'bg-red-100 text-red-800',
    };

    const safeViajes = Array.isArray(viajes) ? viajes : Object.values(viajes || {});

    const filteredViajes = filter === 'todos'
        ? safeViajes
        : safeViajes.filter(v => v.estado === filter);

    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div style={{ padding: isMobile ? '1rem' : '2rem', paddingBottom: isMobile ? '80px' : '2rem' }}>
            <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', alignItems: isMobile ? 'flex-start' : 'center', gap: isMobile ? '1rem' : '0', marginBottom: '2rem' }}>
                <h1 style={{ fontSize: isMobile ? '1.5rem' : '1.875rem', fontWeight: 'bold' }}>{isMobile ? 'Historial Viajes' : 'Historial Global de Viajes'}</h1>
                <div style={{ display: 'flex', gap: '1rem', width: isMobile ? '100%' : 'auto', flexWrap: 'wrap' }}>
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        style={{ padding: '0.5rem', borderRadius: '0.5rem', border: '1px solid #d1d5db', flex: isMobile ? 1 : 'initial' }}
                    >
                        <option value="todos">Todos los estados</option>
                        <option value="pendiente">Pendientes</option>
                        <option value="en_curso">En Curso</option>
                        <option value="completado">Completados</option>
                        <option value="cancelado">Cancelados</option>
                    </select>
                    {!isMobile && (
                        <button
                            onClick={() => navigate('/admin')}
                            style={{ padding: '0.5rem 1rem', background: '#e5e7eb', borderRadius: '0.5rem', fontWeight: '600' }}
                        >
                            Volver
                        </button>
                    )}
                </div>
            </div>

            {loading ? (
                <div>Cargando...</div>
            ) : (
                <>
                    {/* Desktop Table View */}
                    {!isMobile && (
                        <div style={{ overflowX: 'auto', backgroundColor: 'white', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead style={{ backgroundColor: '#f9fafb' }}>
                                    <tr>
                                        <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#6b7280' }}>ID</th>
                                        <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#6b7280' }}>Fecha</th>
                                        <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#6b7280' }}>Cliente</th>
                                        <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#6b7280' }}>Motorista</th>
                                        <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#6b7280' }}>Origen / Destino</th>
                                        <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#6b7280' }}>Estado</th>
                                        <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#6b7280' }}>Tarifa</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredViajes.map((viaje) => (
                                        <tr key={viaje.id} style={{ borderTop: '1px solid #e5e7eb' }}>
                                            <td style={{ padding: '1rem' }}>#{viaje.id}</td>
                                            <td style={{ padding: '1rem' }}>{new Date(viaje.created_at).toLocaleString()}</td>
                                            <td style={{ padding: '1rem' }}>{viaje.cliente?.name || 'N/A'}</td>
                                            <td style={{ padding: '1rem' }}>{viaje.motorista?.name || '-'}</td>
                                            <td style={{ padding: '1rem', maxWidth: '300px' }}>
                                                <div style={{ fontSize: '0.875rem' }}>📍 {viaje.origen}</div>
                                                <div style={{ fontSize: '0.875rem', marginTop: '0.25rem' }}>🏁 {viaje.destino}</div>
                                            </td>
                                            <td style={{ padding: '1rem' }}>
                                                <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase ${statusColors[viaje.estado] || 'bg-gray-100 text-gray-800'}`}>
                                                    {viaje.estado}
                                                </span>
                                            </td>
                                            <td style={{ padding: '1rem', fontWeight: '600' }}>
                                                {viaje.tarifa_estimada ? `${parseInt(viaje.tarifa_estimada).toLocaleString()} CFA` : '-'}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Mobile Card View */}
                    {isMobile && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {filteredViajes.map((viaje) => (
                                <div key={viaje.id} style={{
                                    backgroundColor: 'white',
                                    padding: '1rem',
                                    borderRadius: '0.5rem',
                                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                                    border: '1px solid #e5e7eb'
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                                        <span style={{ fontWeight: 'bold', color: '#374151' }}>#{viaje.id}</span>
                                        <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase ${statusColors[viaje.estado] || 'bg-gray-100 text-gray-800'}`}>
                                            {viaje.estado}
                                        </span>
                                    </div>

                                    <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>
                                        {new Date(viaje.created_at).toLocaleString()}
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '1rem', fontSize: '0.875rem' }}>
                                        <div>
                                            <span style={{ fontWeight: '600', display: 'block' }}>Cliente:</span>
                                            {viaje.cliente?.name || 'N/A'}
                                        </div>
                                        <div>
                                            <span style={{ fontWeight: '600', display: 'block' }}>Motorista:</span>
                                            {viaje.motorista?.name || '-'}
                                        </div>
                                    </div>

                                    <div style={{ backgroundColor: '#f9fafb', padding: '0.75rem', borderRadius: '0.375rem', marginBottom: '0.75rem' }}>
                                        <div style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                                            <span style={{ marginRight: '0.5rem' }}>📍</span>
                                            {viaje.origen}
                                        </div>
                                        <div style={{ fontSize: '0.875rem' }}>
                                            <span style={{ marginRight: '0.5rem' }}>🏁</span>
                                            {viaje.destino}
                                        </div>
                                    </div>

                                    <div style={{ textAlign: 'right', fontWeight: 'bold', color: '#2563eb', fontSize: '1rem' }}>
                                        {viaje.tarifa_estimada ? `${parseInt(viaje.tarifa_estimada).toLocaleString()} CFA` : '-'}
                                    </div>
                                </div>
                            ))}
                            {filteredViajes.length === 0 && (
                                <div className="text-center p-4 text-gray-500">No hay viajes en esta categoría</div>
                            )}
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default AdminViajes;
