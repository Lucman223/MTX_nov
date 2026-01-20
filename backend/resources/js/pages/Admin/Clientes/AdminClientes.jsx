import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

/**
 * AdminClientes Component
 *
 * [ES] Panel de gestión de usuarios con rol de Cliente.
 *      Muestra una lista de todos los clientes registrados, su información de contacto y permite la eliminación de cuentas.
 *
 * [FR] Panneau de gestion des utilisateurs avec le rôle de Client.
 *      Affiche une liste de tous les clients inscrits, leurs coordonnées et permet la suppression de comptes.
 */
const AdminClientes = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [clientes, setClientes] = useState([]);
    const [loading, setLoading] = useState(true);

    // Color system
    const colors = {
        primary: '#2563eb',
        secondary: '#10b981',
        error: '#ef4444',
        text: '#1f2937',
        subtext: '#6b7280'
    };

    useEffect(() => {
        fetchClientes();
    }, []);

    const fetchClientes = async () => {
        try {
            const response = await axios.get('/api/admin/users?rol=cliente');
            // Defensive coding just in case
            const data = Array.isArray(response.data) ? response.data : Object.values(response.data);
            setClientes(data);
        } catch (error) {
            console.error('Error loading clientes:', error);
            toast.error(t('common.error'));
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id, name) => {
        if (!window.confirm(t('admin_dashboard.clients.delete_confirm', { name }))) return;

        try {
            await axios.delete(`/api/admin/users/${id}`);
            toast.success(t('admin_dashboard.clients.delete_success'));
            fetchClientes();
        } catch (error) {
            console.error('Error deleting client:', error);
            toast.error(t('common.error'));
        }
    };

    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb', padding: isMobile ? '1rem' : '2rem', paddingBottom: isMobile ? '80px' : '2rem' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <span style={{ fontSize: isMobile ? '1.5rem' : '2rem' }}>👥</span>
                        <h1 style={{ fontSize: isMobile ? '1.25rem' : '1.875rem', fontWeight: 'bold', color: colors.text }}>
                            {isMobile ? t('nav.clients') : `${t('admin_dashboard.clients.title')} (${clientes.length})`}
                        </h1>
                    </div>
                    {!isMobile && (
                        <button
                            onClick={() => navigate('/admin')}
                            style={{
                                padding: '0.75rem 1.5rem',
                                backgroundColor: 'white',
                                border: '1px solid #d1d5db',
                                borderRadius: '0.5rem',
                                fontWeight: '600',
                                color: colors.text,
                                cursor: 'pointer'
                            }}
                        >
                            {t('common.back')}
                        </button>
                    )}
                </div>

                {/* Desktop Table View */}
                {!isMobile && (
                    <div style={{ backgroundColor: 'white', borderRadius: '1rem', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', overflow: 'hidden', border: '1px solid #e5e7eb' }}>
                        {loading ? (
                            <div style={{ padding: '3rem', textAlign: 'center', color: colors.subtext }}>
                                {t('common.loading')}
                            </div>
                        ) : clientes.length === 0 ? (
                            <div style={{ padding: '3rem', textAlign: 'center', color: colors.subtext }}>
                                {t('admin_dashboard.clients.empty')}
                            </div>
                        ) : (
                            <div style={{ overflowX: 'auto' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                    <thead>
                                        <tr style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                                            <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', color: colors.subtext, fontWeight: '600' }}>{t('admin_dashboard.clients.table.name')}</th>
                                            <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', color: colors.subtext, fontWeight: '600' }}>{t('admin_dashboard.clients.table.contact')}</th>
                                            <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', color: colors.subtext, fontWeight: '600' }}>{t('admin_dashboard.clients.table.registration')}</th>
                                            <th style={{ padding: '1rem', textAlign: 'right', fontSize: '0.875rem', color: colors.subtext, fontWeight: '600' }}>{t('admin_dashboard.clients.table.actions')}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {clientes.map((cliente) => (
                                            <tr key={cliente.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                                                <td style={{ padding: '1rem' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                        <div style={{
                                                            width: '2.5rem', height: '2.5rem',
                                                            backgroundColor: '#eff6ff', color: colors.primary,
                                                            borderRadius: '9999px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                            fontWeight: 'bold', fontSize: '1rem'
                                                        }}>
                                                            {cliente.name.charAt(0).toUpperCase()}
                                                        </div>
                                                        <span style={{ fontWeight: '600', color: colors.text }}>{cliente.name}</span>
                                                    </div>
                                                </td>
                                                <td style={{ padding: '1rem' }}>
                                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                        <span style={{ color: colors.text }}>{cliente.email}</span>
                                                        {cliente.telefono && <span style={{ fontSize: '0.85rem', color: colors.subtext }}>📞 {cliente.telefono}</span>}
                                                    </div>
                                                </td>
                                                <td style={{ padding: '1rem', color: colors.subtext }}>
                                                    {new Date(cliente.created_at).toLocaleDateString()}
                                                </td>
                                                <td style={{ padding: '1rem', textAlign: 'right' }}>
                                                    <button
                                                        onClick={() => handleDelete(cliente.id, cliente.name)}
                                                        style={{
                                                            padding: '0.5rem 1rem',
                                                            backgroundColor: '#fef2f2',
                                                            color: colors.error,
                                                            border: 'none',
                                                            borderRadius: '0.375rem',
                                                            fontWeight: '600',
                                                            cursor: 'pointer',
                                                            fontSize: '0.875rem'
                                                        }}
                                                    >
                                                        {t('admin_dashboard.clients.actions.delete')}
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}

                {/* Mobile Card View */}
                {isMobile && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {loading && <div className="text-center p-4">{t('common.loading')}</div>}
                        {!loading && clientes.length === 0 && <div className="text-center p-4">{t('admin_dashboard.clients.empty')}</div>}

                        {clientes.map((cliente) => (
                            <div key={cliente.id} style={{
                                backgroundColor: 'white',
                                padding: '1rem',
                                borderRadius: '0.5rem',
                                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                                border: '1px solid #e5e7eb'
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                        <div style={{
                                            width: '2.5rem', height: '2.5rem',
                                            backgroundColor: '#eff6ff', color: colors.primary,
                                            borderRadius: '9999px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            fontWeight: 'bold', fontSize: '1rem'
                                        }}>
                                            {cliente.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <div style={{ fontWeight: 'bold', color: colors.text }}>{cliente.name}</div>
                                            <div style={{ fontSize: '0.75rem', color: colors.subtext }}>Reg: {new Date(cliente.created_at).toLocaleDateString()}</div>
                                        </div>
                                    </div>
                                </div>

                                <div style={{ marginBottom: '1rem', paddingLeft: '3.25rem' }}>
                                    <div style={{ fontSize: '0.875rem', color: colors.text }}>{cliente.email}</div>
                                    {cliente.telefono && <div style={{ fontSize: '0.875rem', color: colors.subtext }}>📞 {cliente.telefono}</div>}
                                </div>

                                <button
                                    onClick={() => handleDelete(cliente.id, cliente.name)}
                                    style={{
                                        width: '100%',
                                        padding: '0.5rem',
                                        backgroundColor: '#fef2f2',
                                        color: colors.error,
                                        border: '1px solid #fecaca',
                                        borderRadius: '0.375rem',
                                        fontWeight: '600'
                                    }}
                                >
                                    🗑️ {t('admin_dashboard.clients.actions.delete')}
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminClientes;
