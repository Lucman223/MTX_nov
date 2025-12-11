import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const AdminForfaits = () => {
    const navigate = useNavigate();
    const [forfaits, setForfaits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingForfait, setEditingForfait] = useState(null);
    const [formData, setFormData] = useState({
        nombre: '',
        descripcion: '',
        precio: '',
        dias_validez: '',
        viajes_incluidos: '',
        estado: 'activo'
    });

    const colors = {
        primary: '#2563eb',
        secondary: '#10b981',
        error: '#ef4444',
    };

    useEffect(() => {
        fetchForfaits();
    }, []);

    const fetchForfaits = async () => {
        try {
            const response = await axios.get('/api/admin/forfaits');
            setForfaits(response.data);
        } catch (error) {
            console.error('Error loading forfaits:', error);
            toast.error('Error al cargar los forfaits');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingForfait) {
                await axios.put(`/api/admin/forfaits/${editingForfait.id}`, formData);
                toast.success('Forfait actualizado correctamente');
            } else {
                await axios.post('/api/admin/forfaits', formData);
                toast.success('Forfait creado correctamente');
            }
            setModalOpen(false);
            setEditingForfait(null);
            setFormData({ nombre: '', descripcion: '', precio: '', dias_validez: '', viajes_incluidos: '', estado: 'activo' });
            fetchForfaits();
        } catch (error) {
            console.error('Error saving forfait:', error);
            toast.error('Error al guardar el forfait');
        }
    };

    const handleEdit = (forfait) => {
        setEditingForfait(forfait);
        setFormData({
            nombre: forfait.nombre,
            descripcion: forfait.descripcion || '',
            precio: forfait.precio,
            dias_validez: forfait.dias_validez,
            viajes_incluidos: forfait.viajes_incluidos,
            estado: forfait.estado
        });
        setModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('¿Estás seguro de eliminar este forfait?')) return;
        try {
            await axios.delete(`/api/admin/forfaits/${id}`);
            toast.success('Forfait eliminado');
            fetchForfaits();
        } catch (error) {
            console.error('Error deleting forfait:', error);
            toast.error('Error al eliminar');
        }
    };

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb', padding: '2rem' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#111827' }}>
                        ADMIN - Gestión de Forfaits
                    </h1>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button
                            onClick={() => navigate('/admin')}
                            style={{
                                padding: '0.75rem 1.5rem',
                                border: '1px solid #d1d5db',
                                borderRadius: '0.5rem',
                                backgroundColor: 'white',
                                color: '#374151',
                                fontWeight: '600',
                                cursor: 'pointer'
                            }}
                        >
                            Volver
                        </button>
                        <button
                            onClick={() => {
                                setEditingForfait(null);
                                setFormData({ nombre: '', descripcion: '', precio: '', dias_validez: '', viajes_incluidos: '', estado: 'activo' });
                                setModalOpen(true);
                            }}
                            style={{
                                padding: '0.75rem 1.5rem',
                                backgroundColor: colors.primary,
                                color: 'white',
                                borderRadius: '0.5rem',
                                border: 'none',
                                fontWeight: '600',
                                cursor: 'pointer',
                                boxShadow: `0 4px 6px ${colors.primary}40`
                            }}
                        >
                            + Nuevo Forfait
                        </button>
                    </div>
                </div>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '3rem', color: '#6b7280' }}>Cargando...</div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                        {(Array.isArray(forfaits) ? forfaits : Object.values(forfaits || {})).map((forfait) => (
                            <div key={forfait.id} style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '1rem', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', border: '1px solid #e5e7eb' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                                    <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#111827' }}>{forfait.nombre}</h3>
                                    <span style={{
                                        padding: '0.25rem 0.75rem',
                                        borderRadius: '9999px',
                                        fontSize: '0.75rem',
                                        fontWeight: '600',
                                        backgroundColor: forfait.estado === 'activo' ? '#dcfce7' : '#f3f4f6',
                                        color: forfait.estado === 'activo' ? '#15803d' : '#6b7280'
                                    }}>
                                        {forfait.estado}
                                    </span>
                                </div>
                                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: colors.primary, marginBottom: '1rem' }}>
                                    {parseInt(forfait.precio).toLocaleString()} CFA
                                </div>
                                <div style={{ spaceY: '0.5rem', color: '#4b5563', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
                                    <p>📅 {forfait.dias_validez} días de validez</p>
                                    <p>🚀 {forfait.viajes_incluidos} viajes incluidos</p>
                                    <p style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: '#9ca3af' }}>{forfait.descripcion}</p>
                                </div>
                                <div style={{ display: 'flex', gap: '0.75rem' }}>
                                    <button
                                        onClick={() => handleEdit(forfait)}
                                        style={{ flex: 1, padding: '0.5rem', backgroundColor: '#eff6ff', color: colors.primary, borderRadius: '0.375rem', border: 'none', fontWeight: '600', cursor: 'pointer' }}
                                    >
                                        Editar
                                    </button>
                                    <button
                                        onClick={() => handleDelete(forfait.id)}
                                        style={{ flex: 1, padding: '0.5rem', backgroundColor: '#fef2f2', color: colors.error, borderRadius: '0.375rem', border: 'none', fontWeight: '600', cursor: 'pointer' }}
                                    >
                                        Eliminar
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {modalOpen && (
                <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', zIndex: 50 }}>
                    <div style={{ backgroundColor: 'white', borderRadius: '1rem', padding: '2rem', width: '100%', maxWidth: '500px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>
                            {editingForfait ? 'Editar Forfait' : 'Nuevo Forfait'}
                        </h2>
                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.25rem' }}>Nombre</label>
                                <input required type="text" value={formData.nombre} onChange={e => setFormData({ ...formData, nombre: e.target.value })} style={{ width: '100%', padding: '0.5rem', borderRadius: '0.375rem', border: '1px solid #d1d5db' }} />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.25rem' }}>Descripción</label>
                                <textarea value={formData.descripcion} onChange={e => setFormData({ ...formData, descripcion: e.target.value })} style={{ width: '100%', padding: '0.5rem', borderRadius: '0.375rem', border: '1px solid #d1d5db' }} />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.25rem' }}>Precio (CFA)</label>
                                    <input required type="number" value={formData.precio} onChange={e => setFormData({ ...formData, precio: e.target.value })} style={{ width: '100%', padding: '0.5rem', borderRadius: '0.375rem', border: '1px solid #d1d5db' }} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.25rem' }}>Viajes</label>
                                    <input required type="number" value={formData.viajes_incluidos} onChange={e => setFormData({ ...formData, viajes_incluidos: e.target.value })} style={{ width: '100%', padding: '0.5rem', borderRadius: '0.375rem', border: '1px solid #d1d5db' }} />
                                </div>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.25rem' }}>Días Validez</label>
                                    <input required type="number" value={formData.dias_validez} onChange={e => setFormData({ ...formData, dias_validez: e.target.value })} style={{ width: '100%', padding: '0.5rem', borderRadius: '0.375rem', border: '1px solid #d1d5db' }} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.25rem' }}>Estado</label>
                                    <select value={formData.estado} onChange={e => setFormData({ ...formData, estado: e.target.value })} style={{ width: '100%', padding: '0.5rem', borderRadius: '0.375rem', border: '1px solid #d1d5db' }}>
                                        <option value="activo">Activo</option>
                                        <option value="inactivo">Inactivo</option>
                                    </select>
                                </div>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                                <button type="button" onClick={() => setModalOpen(false)} style={{ padding: '0.5rem 1rem', borderRadius: '0.375rem', border: 'none', backgroundColor: '#e5e7eb', cursor: 'pointer' }}>Cancelar</button>
                                <button type="submit" style={{ padding: '0.5rem 1rem', borderRadius: '0.375rem', border: 'none', backgroundColor: colors.primary, color: 'white', fontWeight: 'bold', cursor: 'pointer' }}>Guardar</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminForfaits;
