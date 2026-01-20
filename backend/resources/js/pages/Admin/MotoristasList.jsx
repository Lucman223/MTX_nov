import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

/**
 * MotoristasList Component
 *
 * [ES] Interfaz de administración para la gestión y validación de conductores.
 *      Permite al administrador aprobar o rechazar el registro de motoristas basándose en sus datos y vehículo.
 *
 * [FR] Interface d'administration pour la gestion et la validation des chauffeurs.
 *      Permet à l'administrateur d'approuver ou de rejeter l'inscription des chauffeurs en fonction de leurs données et de leur véhicule.
 */
const MotoristasList = () => {
    const { t } = useTranslation();
    const [motoristas, setMotoristas] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMotoristas();
    }, []);

    const fetchMotoristas = async () => {
        try {
            const response = await axios.get('/api/admin/users?rol=motorista');
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
            setMotoristas(motoristas.map(m =>
                m.id === id ? { ...m, motorista_perfil: { ...m.motorista_perfil, estado_validacion: newStatus } } : m
            ));
        } catch (error) {
            console.error("Error updating status", error);
            alert(t('common.error'));
        }
    };

    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    if (loading) return <div className="text-center p-10">{t('common.loading')}</div>;

    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">{t('admin_dashboard.motoristas.title')}</h2>

            {!isMobile && (
                <div className="bg-white shadow-md rounded-lg overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('admin_dashboard.motoristas.table.name')}</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('admin_dashboard.motoristas.table.vehicle')}</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('admin_dashboard.motoristas.table.registration')}</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('admin_dashboard.motoristas.table.status')}</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('admin_dashboard.motoristas.table.actions')}</th>
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
                                        {motorista.telefono && <div className="text-xs text-gray-400">📞 {motorista.telefono}</div>}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">
                                            {motorista.motorista_perfil?.marca_vehiculo} {motorista.motorista_perfil?.modelo_moto}
                                            ({motorista.motorista_perfil?.anio_moto || 'N/A'})
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            Matrícula: {motorista.motorista_perfil?.matricula || '-'}
                                            {motorista.motorista_perfil?.color_moto && ` | Color: ${motorista.motorista_perfil?.color_moto}`}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="text-sm text-gray-500">{new Date(motorista.created_at).toLocaleDateString()}</span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                            ${motorista.motorista_perfil?.estado_validacion === 'aprobado' ? 'bg-green-100 text-green-800' :
                                                motorista.motorista_perfil?.estado_validacion === 'rechazado' ? 'bg-red-100 text-red-800' :
                                                    'bg-yellow-100 text-yellow-800'}`}>
                                            {t(`status.${motorista.motorista_perfil?.estado_validacion || 'pendiente'}`)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        {motorista.motorista_perfil?.estado_validacion !== 'aprobado' && (
                                            <button
                                                onClick={() => handleStatusChange(motorista.id, 'aprobado')}
                                                className="text-green-600 hover:text-green-900 mr-4"
                                            >
                                                {t('admin_dashboard.motoristas.actions.approve')}
                                            </button>
                                        )}
                                        {motorista.motorista_perfil?.estado_validacion !== 'rechazado' && (
                                            <button
                                                onClick={() => handleStatusChange(motorista.id, 'rechazado')}
                                                className="text-red-600 hover:text-red-900"
                                            >
                                                {t('admin_dashboard.motoristas.actions.reject')}
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

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
                                    {motorista.telefono && <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>📞 {motorista.telefono}</div>}
                                </div>
                                <span style={{
                                    fontSize: '0.75rem',
                                    padding: '0.25rem 0.5rem',
                                    borderRadius: '9999px',
                                    height: 'fit-content',
                                    backgroundColor: motorista.motorista_perfil?.estado_validacion === 'aprobado' ? '#d1fae5' : '#fef3c7',
                                    color: motorista.motorista_perfil?.estado_validacion === 'aprobado' ? '#065f46' : '#92400e'
                                }}>
                                    {t(`status.${motorista.motorista_perfil?.estado_validacion || 'pendiente'}`)}
                                </span>
                            </div>

                            <div style={{ fontSize: '0.875rem', color: '#4b5563', marginBottom: '1rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                                <div>
                                    <span style={{ fontWeight: '600' }}>{t('admin_dashboard.motoristas.info.vehicle')}:</span><br />
                                    {motorista.motorista_perfil?.marca_vehiculo} {motorista.motorista_perfil?.modelo_moto} ({motorista.motorista_perfil?.anio_moto})
                                </div>
                                <div>
                                    <span style={{ fontWeight: '600' }}>{t('admin_dashboard.motoristas.info.plate')}:</span><br />
                                    {motorista.motorista_perfil?.matricula || '-'} / {motorista.motorista_perfil?.color_moto || 'N/A'}
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                {motorista.motorista_perfil?.estado_validacion !== 'aprobado' && (
                                    <button
                                        onClick={() => handleStatusChange(motorista.id, 'aprobado')}
                                        style={{ flex: 1, padding: '0.5rem', backgroundColor: '#dcfce7', color: '#166534', border: '1px solid #bbf7d0', borderRadius: '0.375rem', fontWeight: '600' }}
                                    >
                                        ✓ {t('admin_dashboard.motoristas.actions.approve')}
                                    </button>
                                )}
                                {motorista.motorista_perfil?.estado_validacion !== 'rechazado' && (
                                    <button
                                        onClick={() => handleStatusChange(motorista.id, 'rechazado')}
                                        style={{ flex: 1, padding: '0.5rem', backgroundColor: '#fee2e2', color: '#991b1b', border: '1px solid #fecaca', borderRadius: '0.375rem', fontWeight: '600' }}
                                    >
                                        ✕ {t('admin_dashboard.motoristas.actions.reject')}
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
