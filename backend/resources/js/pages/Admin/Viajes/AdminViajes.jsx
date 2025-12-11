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

    return (
        <div style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold' }}>Historial Global de Viajes</h1>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        style={{ padding: '0.5rem', borderRadius: '0.5rem', border: '1px solid #d1d5db' }}
                    >
                        <option value="todos">Todos los estados</option>
                        <option value="pendiente">Pendientes</option>
                        <option value="en_curso">En Curso</option>
                        <option value="completado">Completados</option>
                        <option value="cancelado">Cancelados</option>
                    </select>
                    <button
                        onClick={() => navigate('/admin')}
                        style={{ padding: '0.5rem 1rem', background: '#e5e7eb', borderRadius: '0.5rem', fontWeight: '600' }}
                    >
                        Volver
                    </button>
                </div>
            </div>

            {loading ? (
                <div>Cargando...</div>
            ) : (
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
                                        <span style={{
                                            padding: '0.25rem 0.75rem',
                                            borderRadius: '9999px',
                                            fontSize: '0.75rem',
                                            fontWeight: 'bold',
                                            textTransform: 'uppercase',
                                            backgroundColor: '#f3f4f6' // Fallback
                                        }}>
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
        </div>
    );
};

export default AdminViajes;
