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
    const [activeTab, setActiveTab] = useState('clientes'); // 'clientes' or 'motoristas'
    const [editingForfait, setEditingForfait] = useState(null);
    const [formData, setFormData] = useState({
        nombre: '',
        descripcion: '',
        precio: '',
        dias_validez: '',
        viajes_incluidos: '',
        es_vip: false,
        estado: 'activo'
    });

    const colors = {
        primary: '#2563eb',
        secondary: '#10b981',
        error: '#ef4444',
    };

    useEffect(() => {
        fetchData();
    }, [activeTab]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const endpoint = activeTab === 'clientes' ? '/api/admin/forfaits' : '/api/admin/motorista-plans';
            const response = await axios.get(endpoint);
            setForfaits(response.data);
        } catch (error) {
            toast.error(t('common.error'));
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const endpoint = activeTab === 'clientes' ? '/api/admin/forfaits' : '/api/admin/motorista-plans';
            if (editingForfait) {
                await axios.put(`${endpoint}/${editingForfait.id}`, formData);
                toast.success(t('admin_dashboard.forfaits.save_success'));
            } else {
                await axios.post(endpoint, formData);
                toast.success(t('admin_dashboard.forfaits.save_success'));
            }
            setModalOpen(false);
            setEditingForfait(null);
            resetForm();
            fetchData();
        } catch (error) {
            toast.error(t('common.error'));
        }
    };

    const resetForm = () => {
        setFormData({
            nombre: '',
            descripcion: '',
            precio: '',
            dias_validez: '',
            viajes_incluidos: '',
            es_vip: false,
            estado: 'activo'
        });
    };

    const handleEdit = (forfait) => {
        setEditingForfait(forfait);
        if (activeTab === 'clientes') {
            setFormData({
                nombre: forfait.nombre,
                descripcion: forfait.descripcion || '',
                precio: forfait.precio,
                dias_validez: forfait.dias_validez,
                viajes_incluidos: forfait.viajes_incluidos,
                estado: forfait.estado
            });
        } else {
            setFormData({
                nombre: forfait.nombre,
                descripcion: forfait.descripcion || '',
                precio: forfait.precio,
                dias_validez: forfait.dias_validez,
                es_vip: !!forfait.es_vip,
                estado: 'activo'
            });
        }
        setModalOpen(true);
    };

    const handleDelete = async (id, name) => {
        if (!window.confirm(t('admin_dashboard.forfaits.delete_confirm', { name }))) return;
        try {
            const endpoint = activeTab === 'clientes' ? '/api/admin/forfaits' : '/api/admin/motorista-plans';
            await axios.delete(`${endpoint}/${id}`);
            toast.success(t('common.success'));
            fetchData();
        } catch (error) {
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
                        {t('nav.forfaits')}
                    </h1>
                    <div style={{ display: 'flex', gap: '1rem', width: isMobile ? '100%' : 'auto' }}>
                        {!isMobile && (
                            <button
                                onClick={() => navigate('/admin')}
                                className="btn btn--sm btn--ghost"
                            >
                                {t('common.back')}
                            </button>
                        )}
                        <button
                            onClick={() => {
                                setEditingForfait(null);
                                resetForm();
                                setModalOpen(true);
                            }}
                            className="btn btn--primary"
                        >
                            {t('admin_dashboard.forfaits.new_btn')}
                        </button>
                    </div>
                </div>

                {/* Tabs */}
                <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid var(--border-color)', marginBottom: '2rem' }}>
                    <button
                        onClick={() => setActiveTab('clientes')}
                        style={{
                            padding: '1rem 1.5rem',
                            border: 'none',
                            background: 'none',
                            borderBottom: activeTab === 'clientes' ? '2px solid var(--primary-color)' : 'none',
                            color: activeTab === 'clientes' ? 'var(--primary-color)' : 'var(--text-muted)',
                            fontWeight: activeTab === 'clientes' ? 'bold' : 'normal',
                            cursor: 'pointer'
                        }}
                    >
                        {t('roles.cliente')}
                    </button>
                    <button
                        onClick={() => setActiveTab('motoristas')}
                        style={{
                            padding: '1rem 1.5rem',
                            border: 'none',
                            background: 'none',
                            borderBottom: activeTab === 'motoristas' ? '2px solid var(--secondary-color)' : 'none',
                            color: activeTab === 'motoristas' ? 'var(--secondary-color)' : 'var(--text-muted)',
                            fontWeight: activeTab === 'motoristas' ? 'bold' : 'normal',
                            cursor: 'pointer'
                        }}
                    >
                        {t('roles.motorista')}
                    </button>
                </div>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '3rem', color: '#6b7280' }}>{t('common.loading')}</div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(20rem, 1fr))', gap: '2rem' }}>
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
                                        backgroundColor: (activeTab === 'clientes'
                                            ? (forfait.estado === 'activo' || forfait.estado === 'aprobado')
                                            : true) // Plans are always active if they exist for now
                                            ? '#dcfce7' : '#f3f4f6',
                                        color: (activeTab === 'clientes'
                                            ? (forfait.estado === 'activo' || forfait.estado === 'aprobado')
                                            : true)
                                            ? '#15803d' : '#6b7280'
                                    }}>
                                        {activeTab === 'clientes'
                                            ? t(`status.${forfait.estado}`, forfait.estado)
                                            : (forfait.es_vip ? 'VIP' : 'Standard')
                                        }
                                    </span>
                                </div>
                                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: colors.primary, marginBottom: '1rem' }}>
                                    {parseInt(forfait.precio).toLocaleString()} CFA
                                </div>
                                <div style={{ spaceY: '0.5rem', color: '#4b5563', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
                                    <p>📅 {forfait.dias_validez} {t('admin_dashboard.forfaits.modal.label_days')}</p>
                                    {activeTab === 'clientes' && <p>🚀 {forfait.viajes_incluidos} {t('admin_dashboard.forfaits.modal.label_trips')}</p>}
                                    {activeTab === 'motoristas' && <p>👑 {forfait.es_vip ? 'Prioridad VIP' : 'Normal'}</p>}
                                    <p style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: '#9ca3af' }}>
                                        {t(`plans.${forfait.nombre}_desc`, forfait.descripcion)}
                                    </p>
                                </div>
                                <div style={{ display: 'flex', gap: '0.75rem' }}>
                                    <button
                                        onClick={() => handleEdit(forfait)}
                                        className="btn btn--sm btn--ghost"
                                        style={{ flex: 1 }}
                                    >
                                        {t('common.edit')}
                                    </button>
                                    <button
                                        onClick={() => handleDelete(forfait.id, forfait.nombre)}
                                        className="btn btn--sm btn--danger"
                                        style={{ flex: 1 }}
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
                    <div className="mtx-card" style={{ width: '100%', maxWidth: '32rem', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', boxSizing: 'border-box' }}>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>
                            {editingForfait ? t('admin_dashboard.forfaits.modal.title_edit') : t('admin_dashboard.forfaits.modal.title_create')}
                        </h2>
                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div>
                                <label className="form-label">{t('admin_dashboard.forfaits.modal.label_name')}</label>
                                <input required type="text" className="mtx-input" value={formData.nombre} onChange={e => setFormData({ ...formData, nombre: e.target.value })} maxLength="50" />
                            </div>
                            <div>
                                <label className="form-label">{t('admin_dashboard.forfaits.modal.label_description')}</label>
                                <textarea className="mtx-input" value={formData.descripcion} onChange={e => setFormData({ ...formData, descripcion: e.target.value })} style={{ resize: 'none' }} maxLength="255" />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div>
                                    <label className="form-label">{t('admin_dashboard.forfaits.modal.label_price')}</label>
                                    <input required type="number" className="mtx-input" value={formData.precio} onChange={e => setFormData({ ...formData, precio: e.target.value })} min="0" />
                                </div>
                                {activeTab === 'clientes' ? (
                                    <div>
                                        <label className="form-label">{t('admin_dashboard.forfaits.modal.label_trips')}</label>
                                        <input required type="number" className="mtx-input" value={formData.viajes_incluidos} onChange={e => setFormData({ ...formData, viajes_incluidos: e.target.value })} min="0" />
                                    </div>
                                ) : (
                                    <div>
                                        <label className="form-label">Tipo Plan</label>
                                        <select className="mtx-input" value={formData.es_vip} onChange={e => setFormData({ ...formData, es_vip: e.target.value === 'true' })}>
                                            <option value="false">Standard</option>
                                            <option value="true">VIP (Prioridad)</option>
                                        </select>
                                    </div>
                                )}
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div>
                                    <label className="form-label">{t('admin_dashboard.forfaits.modal.label_days')}</label>
                                    <input required type="number" className="mtx-input" value={formData.dias_validez} onChange={e => setFormData({ ...formData, dias_validez: e.target.value })} min="0" />
                                </div>
                                {activeTab === 'clientes' && (
                                    <div>
                                        <label className="form-label">{t('admin_dashboard.forfaits.modal.label_status')}</label>
                                        <select className="mtx-input" value={formData.estado} onChange={e => setFormData({ ...formData, estado: e.target.value })}>
                                            <option value="activo">{t('status.aprobado')}</option>
                                            <option value="inactivo">{t('status.rechazado')}</option>
                                        </select>
                                    </div>
                                )}
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                                <button type="button" onClick={() => setModalOpen(false)} className="btn btn--ghost">{t('admin_dashboard.forfaits.modal.cancel')}</button>
                                <button type="submit" className="btn btn--primary">{t('admin_dashboard.forfaits.modal.save')}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminForfaits;
