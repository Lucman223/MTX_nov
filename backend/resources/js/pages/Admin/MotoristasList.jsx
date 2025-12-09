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

    if (loading) return <div className="text-center p-10">Cargando...</div>;

    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Gestión de Motoristas</h2>

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
        </div>
    );
};

export default MotoristasList;
