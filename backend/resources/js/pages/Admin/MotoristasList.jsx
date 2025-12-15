import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MotoristasList = () => {
    const [motoristas, setMotoristas] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMotoristas();
    }, []);

    const fetchMotoristas = async () => {
        try {
            const response = await axios.get('/api/users?rol=motorista'); // Assuming endpoint filter or getting all users and filtering
            // Note: In real implementation, better to have a dedicated endpoint /api/admin/motoristas
            // For now attempting to use the users resource if available or stubbing

            // If the standard user endpoint doesn't support easy filtering, we might need to adjust.
            // Let's assume the admin users endpoint returns all users.

            // Temporary mock data if API call fails or is not yet implemented fully for filtering
            if (response.data && Array.isArray(response.data)) {
                setMotoristas(response.data.filter(u => u.rol === 'motorista'));
            } else if (response.data && response.data.data) {
                setMotoristas(response.data.data.filter(u => u.rol === 'motorista'));
            }
            setLoading(false);
        } catch (error) {
            console.error("Error fetching motoristas", error);
            // Fallback mock data for demonstration
            setMotoristas([
                { id: 1, name: 'Amadou Koné', email: 'amadou@test.com', created_at: '2025-12-01', motorista_perfil: { estado_validacion: 'pendiente', marca_vehiculo: 'KTM 125' } },
                { id: 2, name: 'Seydou Keita', email: 'seydou@test.com', created_at: '2025-12-02', motorista_perfil: { estado_validacion: 'aprobado', marca_vehiculo: 'Yamaha' } }
            ]);
            setLoading(false);
        }
    };

    const handleStatusChange = async (id, newStatus) => {
        try {
            await axios.put(`/api/admin/motoristas/${id}/status`, { estado_validacion: newStatus });
            // Update local state
            setMotoristas(motoristas.map(m =>
                m.id === id ? { ...m, motorista_perfil: { ...m.motorista_perfil, estado_validacion: newStatus } } : m
            ));
        } catch (error) {
            console.error("Error updating status", error);
            alert("Error al actualizar estado");
        }
    };

    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    if (loading) return <div className="text-center p-10">Cargando...</div>;

    return (
        <div style={{ paddingBottom: isMobile ? '80px' : '0' }}>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Gestión de Motoristas</h2>

            {/* Desktop Table View */}
            {!isMobile && (
                <div className="bg-white shadow-md rounded-lg overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehículo</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Registro</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {motoristas.map((motorista) => (
                                <tr key={motorista.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="text-sm font-medium text-gray-900">{motorista.name}</div>
                                        </div>
                                        <div className="text-sm text-gray-500">{motorista.email}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">{motorista.motorista_perfil?.marca_vehiculo || 'N/A'}</div>
                                        <div className="text-sm text-gray-500">{motorista.motorista_perfil?.matricula || '-'}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="text-sm text-gray-500">{new Date(motorista.created_at).toLocaleDateString()}</span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                            ${motorista.motorista_perfil?.estado_validacion === 'aprobado' ? 'bg-green-100 text-green-800' :
                                                motorista.motorista_perfil?.estado_validacion === 'rechazado' ? 'bg-red-100 text-red-800' :
                                                    'bg-yellow-100 text-yellow-800'}`}>
                                            {motorista.motorista_perfil?.estado_validacion || 'pendiente'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        {motorista.motorista_perfil?.estado_validacion !== 'aprobado' && (
                                            <button
                                                onClick={() => handleStatusChange(motorista.id, 'aprobado')}
                                                className="text-green-600 hover:text-green-900 mr-4"
                                            >
                                                Aprobar
                                            </button>
                                        )}
                                        {motorista.motorista_perfil?.estado_validacion !== 'rechazado' && (
                                            <button
                                                onClick={() => handleStatusChange(motorista.id, 'rechazado')}
                                                className="text-red-600 hover:text-red-900"
                                            >
                                                Rechazar
                                            </button>
                                        )}
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
                    {motoristas.map((motorista) => (
                        <div key={motorista.id} style={{
                            backgroundColor: 'white',
                            padding: '1rem',
                            borderRadius: '0.5rem',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                            border: '1px solid #e5e7eb'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                <div>
                                    <div style={{ fontWeight: 'bold', color: '#1f2937' }}>{motorista.name}</div>
                                    <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>{motorista.email}</div>
                                </div>
                                <span style={{
                                    fontSize: '0.75rem',
                                    padding: '0.25rem 0.5rem',
                                    borderRadius: '9999px',
                                    height: 'fit-content',
                                    backgroundColor: motorista.motorista_perfil?.estado_validacion === 'aprobado' ? '#d1fae5' : '#fef3c7',
                                    color: motorista.motorista_perfil?.estado_validacion === 'aprobado' ? '#065f46' : '#92400e'
                                }}>
                                    {motorista.motorista_perfil?.estado_validacion || 'pendiente'}
                                </span>
                            </div>

                            <div style={{ fontSize: '0.875rem', color: '#4b5563', marginBottom: '1rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                                <div>
                                    <span style={{ fontWeight: '600' }}>Vehículo:</span><br />
                                    {motorista.motorista_perfil?.marca_vehiculo || 'N/A'}
                                </div>
                                <div>
                                    <span style={{ fontWeight: '600' }}>Matrícula:</span><br />
                                    {motorista.motorista_perfil?.matricula || '-'}
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                {motorista.motorista_perfil?.estado_validacion !== 'aprobado' && (
                                    <button
                                        onClick={() => handleStatusChange(motorista.id, 'aprobado')}
                                        style={{ flex: 1, padding: '0.5rem', backgroundColor: '#dcfce7', color: '#166534', border: '1px solid #bbf7d0', borderRadius: '0.375rem', fontWeight: '600' }}
                                    >
                                        ✓ Aprobar
                                    </button>
                                )}
                                {motorista.motorista_perfil?.estado_validacion !== 'rechazado' && (
                                    <button
                                        onClick={() => handleStatusChange(motorista.id, 'rechazado')}
                                        style={{ flex: 1, padding: '0.5rem', backgroundColor: '#fee2e2', color: '#991b1b', border: '1px solid #fecaca', borderRadius: '0.375rem', fontWeight: '600' }}
                                    >
                                        ✕ Rechazar
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MotoristasList;
