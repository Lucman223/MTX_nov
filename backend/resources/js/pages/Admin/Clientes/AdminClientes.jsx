import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const AdminClientes = () => {
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
            toast.error('Error al cargar la lista de clientes');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id, name) => {
        if (!window.confirm(`¿Estás seguro de eliminar al cliente ${name}? Esta acción es irreversible.`)) return;

        try {
            await axios.delete(`/api/admin/users/${id}`);
            toast.success('Cliente eliminado correctamente');
            fetchClientes();
        } catch (error) {
            console.error('Error deleting client:', error);
            toast.error('Error al eliminar el cliente');
        }
    };

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb', padding: '2rem' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <span style={{ fontSize: '2rem' }}>👥</span>
                        <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: colors.text }}>
                            Gestión de Clientes ({clientes.length})
                        </h1>
                    </div>
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
                        Volver al Panel
                    </button>
                </div>

                {/* Table */}
                <div style={{ backgroundColor: 'white', borderRadius: '1rem', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', overflow: 'hidden', border: '1px solid #e5e7eb' }}>
                    {loading ? (
                        <div style={{ padding: '3rem', textAlign: 'center', color: colors.subtext }}>
                            Cargando clientes...
                        </div>
                    ) : clientes.length === 0 ? (
                        <div style={{ padding: '3rem', textAlign: 'center', color: colors.subtext }}>
                            No hay clientes registrados en la plataforma.
                        </div>
                    ) : (
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                                        <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', color: colors.subtext, fontWeight: '600' }}>Nombre</th>
                                        <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', color: colors.subtext, fontWeight: '600' }}>Email / Contacto</th>
                                        <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', color: colors.subtext, fontWeight: '600' }}>Registrado</th>
                                        <th style={{ padding: '1rem', textAlign: 'right', fontSize: '0.875rem', color: colors.subtext, fontWeight: '600' }}>Acciones</th>
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
                                                    Eliminar
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminClientes;
