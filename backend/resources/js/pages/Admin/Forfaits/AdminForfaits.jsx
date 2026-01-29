import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

/**
 * AdminForfaits Component
 *
 * [ES] Gestor administrativo de planes (forfaits) para clientes.
 *      Implementa un CRUD completo para definir nombres, precios, viajes incluidos y validez de los paquetes.
 *
 * [FR] Gestionnaire administratif de forfaits pour les clients.
 *      Implémente un CRUD complet pour définir les noms, les prix, les trajets inclus et la validité des forfaits.
 */
const AdminForfaits = () => {
    const { t } = useTranslation();
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
            toast.error(t('common.error'));
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingForfait) {
                await axios.put(`/api/admin/forfaits/${editingForfait.id}`, formData);
                toast.success(t('admin_dashboard.forfaits.save_success'));
            } else {
                await axios.post('/api/admin/forfaits', formData);
                toast.success(t('admin_dashboard.forfaits.save_success'));
            }
            setModalOpen(false);
            setEditingForfait(null);
            setFormData({ nombre: '', descripcion: '', precio: '', dias_validez: '', viajes_incluidos: '', estado: 'activo' });
            fetchForfaits();
        } catch (error) {
            console.error('Error saving forfait:', error);
            toast.error(t('common.error'));
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

    const handleDelete = async (id, name) => {
        if (!window.confirm(t('admin_dashboard.forfaits.delete_confirm', { name }))) return;
        try {
            await axios.delete(`/api/admin/forfaits/${id}`);
            toast.success(t('common.success'));
            fetchForfaits();
        } catch (error) {
            console.error('Error deleting forfait:', error);
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
        <div className="main-content-centered" style={{ paddingBottom: isMobile ? '80px' : '2rem' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <div style={{
                    display: 'flex',
                    flexDirection: isMobile ? 'column' : 'row',
                    justifyContent: 'space-between',
                    alignItems: isMobile ? 'flex-start' : 'center',
                    gap: isMobile ? '1rem' : '0',
                    marginBottom: '2rem'
                }}>
                    <h1 style={{ fontSize: isMobile ? '1.5rem' : '1.875rem', fontWeight: 'bold', color: '#111827' }}>
                        {isMobile ? t('nav.forfaits') : t('admin_dashboard.forfaits.title')}
                    </h1>
                    <div style={{ display: 'flex', gap: '1rem', width: isMobile ? '100%' : 'auto' }}>
                        {!isMobile && (
                            <button
                                onClick={() => navigate('/admin')}
                                className="mtx-button"
                                style={{ border: '1px solid #d1d5db', background: 'white' }}
                            >
                                {t('common.back')}
                            </button>
                        )}
                        <button
                            onClick={() => {
                                setEditingForfait(null);
                                setFormData({ nombre: '', descripcion: '', precio: '', dias_validez: '', viajes_incluidos: '', estado: 'activo' });
                                setModalOpen(true);
                            }}
                            className="mtx-button mtx-button-primary"
                        >
                            {t('admin_dashboard.forfaits.new_btn')}
                        </button>
                    </div>
                </div>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '3rem', color: '#6b7280' }}>{t('common.loading')}</div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
                        {(Array.isArray(forfaits) ? forfaits : Object.values(forfaits || {})).map((forfait) => (
                            <div key={forfait.id} className="mtx-card">
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                                    <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#111827' }}>
                                        {t(`plans.${forfait.nombre}`, forfait.nombre)}
                                    </h3>
                                    <span style={{
                                        padding: '0.25rem 0.75rem',
                                        borderRadius: '9999px',
                                        fontSize: '0.75rem',
                                        fontWeight: '600',
                                        backgroundColor: forfait.estado === 'activo' || forfait.estado === 'aprobado' ? '#dcfce7' : '#f3f4f6',
                                        color: forfait.estado === 'activo' || forfait.estado === 'aprobado' ? '#15803d' : '#6b7280'
                                    }}>
                                        {t(`status.${forfait.estado}`, forfait.estado)}
                                    </span>
                                </div>
                                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: colors.primary, marginBottom: '1rem' }}>
                                    {parseInt(forfait.precio).toLocaleString()} CFA
                                </div>
                                <div style={{ spaceY: '0.5rem', color: '#4b5563', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
                                    <p>📅 {forfait.dias_validez} {t('admin_dashboard.forfaits.modal.label_days')}</p>
                                    <p>🚀 {forfait.viajes_incluidos} {t('admin_dashboard.forfaits.modal.label_trips')}</p>
                                    <p style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: '#9ca3af' }}>
                                        {t(`plans.${forfait.nombre}_desc`, forfait.descripcion)}
                                    </p>
                                </div>
                                <div style={{ display: 'flex', gap: '0.75rem' }}>
                                    <button
                                        onClick={() => handleEdit(forfait)}
                                        className="mtx-button"
                                        style={{ flex: 1, padding: '0.5rem', background: '#eff6ff', color: colors.primary }}
                                    >
                                        {t('common.edit')}
                                    </button>
                                    <button
                                        onClick={() => handleDelete(forfait.id, forfait.nombre)}
                                        className="mtx-button"
                                        style={{ flex: 1, padding: '0.5rem', background: '#fef2f2', color: colors.error }}
                                    >
                                        {t('admin_dashboard.clients.actions.delete')}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {modalOpen && (
                <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', zIndex: 50 }}>
                    <div className="mtx-card" style={{ width: '100%', maxWidth: '500px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>
                            {editingForfait ? t('admin_dashboard.forfaits.modal.title_edit') : t('admin_dashboard.forfaits.modal.title_create')}
                        </h2>
                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div>
                                <label className="form-label">{t('admin_dashboard.forfaits.modal.label_name')}</label>
                                <input required type="text" className="mtx-input" value={formData.nombre} onChange={e => setFormData({ ...formData, nombre: e.target.value })} />
                            </div>
                            <div>
                                <label className="form-label">{t('admin_dashboard.forfaits.modal.label_description')}</label>
                                <textarea className="mtx-input" value={formData.descripcion} onChange={e => setFormData({ ...formData, descripcion: e.target.value })} style={{ resize: 'none' }} />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div>
                                    <label className="form-label">{t('admin_dashboard.forfaits.modal.label_price')}</label>
                                    <input required type="number" className="mtx-input" value={formData.precio} onChange={e => setFormData({ ...formData, precio: e.target.value })} />
                                </div>
                                <div>
                                    <label className="form-label">{t('admin_dashboard.forfaits.modal.label_trips')}</label>
                                    <input required type="number" className="mtx-input" value={formData.viajes_incluidos} onChange={e => setFormData({ ...formData, viajes_incluidos: e.target.value })} />
                                </div>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div>
                                    <label className="form-label">{t('admin_dashboard.forfaits.modal.label_days')}</label>
                                    <input required type="number" className="mtx-input" value={formData.dias_validez} onChange={e => setFormData({ ...formData, dias_validez: e.target.value })} />
                                </div>
                                <div>
                                    <label className="form-label">{t('admin_dashboard.forfaits.modal.label_status')}</label>
                                    <select className="mtx-input" value={formData.estado} onChange={e => setFormData({ ...formData, estado: e.target.value })}>
                                        <option value="activo">{t('status.aprobado')}</option>
                                        <option value="inactivo">{t('status.rechazado')}</option>
                                    </select>
                                </div>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                                <button type="button" onClick={() => setModalOpen(false)} className="mtx-button" style={{ background: '#e5e7eb' }}>{t('admin_dashboard.forfaits.modal.cancel')}</button>
                                <button type="submit" className="mtx-button mtx-button-primary">{t('admin_dashboard.forfaits.modal.save')}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminForfaits;
