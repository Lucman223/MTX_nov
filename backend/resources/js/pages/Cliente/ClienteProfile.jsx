import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import SEO from '../../components/Common/SEO';
import { Card, Button, Badge } from '../../components/Common/UIComponents';
import '../../../css/components.css';
/**
 * ClienteProfile Component
 *
 * [ES] Gestión del perfil del cliente.
 *      Permite al usuario editar sus datos, ver sus forfaits activos y consultar el historial de compras de créditos de viaje.
 *
 * [FR] Gestion du profil du client.
 *      Permet à l'utilisateur de modifier ses données, de voir ses forfaits actifs et de consulter l'historique des achats de crédits de voyage.
 */
const ClienteProfile = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({ name: '', email: '', telefono: '' });
    const [forfaits, setForfaits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const { t } = useTranslation();

    // UI Color System (Internal)
    const colors = {
        primary: '#2563eb',
        primaryHover: '#1d4ed8',
        secondary: '#059669',
        border: '#e5e7eb',
        text: '#1f2937',
        subtext: '#6b7280'
    };

    useEffect(() => { fetchProfile(); }, []);

    const fetchProfile = async () => {
        setLoading(true);
        try {
            const response = await axios.get('/api/auth/profile');
            const userData = response.data.user;
            setFormData({
                name: userData.name || '',
                email: userData.email || '',
                telefono: userData.telefono || ''
            });
            const activeForfaits = userData.cliente_forfaits || userData.clienteForfaits || [];
            setForfaits(activeForfaits);
        } catch (error) {
            console.error('Error:', error);
            toast.error(t('client_profile.loading_error'));
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await axios.put('/api/auth/profile', formData);
            toast.success(t('client_profile.update_success'));
        } catch (error) {
            toast.error(t('client_profile.update_error'));
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="dashboard-container">
            <SEO title={t('client_dashboard.profile')} />

            <header className="mtx-header" style={{ padding: '2rem', background: 'linear-gradient(to right, var(--primary-color), #2563eb)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'white' }}>
                    <div style={{
                        background: 'rgba(255,255,255,0.2)',
                        padding: '0.75rem',
                        borderRadius: '50%',
                        fontSize: '2rem',
                        width: '4rem',
                        height: '4rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        👤
                    </div>
                    <div>
                        <h1 style={{ fontSize: '1.75rem', fontWeight: '800', margin: 0, color: 'white' }}>
                            {t('client_dashboard.profile')}
                        </h1>
                        <p style={{ margin: 0, opacity: 0.9, fontSize: '0.95rem' }}>{t('client_profile.manage_desc')}</p>
                    </div>
                </div>
                <div className="desktop-nav">
                    <Button onClick={() => navigate('/cliente')} label="Dashboard">
                        ← {t('nav.dashboard')}
                    </Button>
                </div>
            </header>

            {/* Mobile Bottom Nav */}
            <nav className="mobile-bottom-nav">
                <Button variant="ghost" onClick={() => navigate('/cliente')} label={t('nav.dashboard')}>
                    <span style={{ fontSize: '1.25rem' }}>🏠</span>
                    {t('nav.dashboard')}
                </Button>
                <Button variant="ghost" onClick={() => navigate('/cliente/history')} label={t('client_dashboard.history')}>
                    <span style={{ fontSize: '1.25rem' }}>📋</span>
                    {t('client_dashboard.history')}
                </Button>
                <Button variant="ghost" className="active" label={t('client_dashboard.profile')}>
                    <span style={{ fontSize: '1.25rem' }}>👤</span>
                    {t('client_dashboard.profile')}
                </Button>
            </nav>

            <main className="main-content-centered" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem', marginTop: '-2rem' }}>
                <Card className="profile-info-card">
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1.5rem', color: 'var(--text-main)' }}>
                        {t('client_profile.personal_info')}
                    </h2>

                    <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1.25rem' }}>
                        <div>
                            <label className="form-label">{t('common.name')}</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                className="mtx-input"
                            />
                        </div>
                        <div>
                            <label className="form-label">{t('common.email')}</label>
                            <input
                                type="email"
                                value={formData.email}
                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                                className="mtx-input"
                            />
                        </div>
                        <div>
                            <label className="form-label">{t('common.phone')}</label>
                            <input
                                type="text"
                                value={formData.telefono}
                                onChange={e => setFormData({ ...formData, telefono: e.target.value })}
                                className="mtx-input"
                            />
                        </div>

                        <Button
                            type="submit"
                            disabled={saving}
                            className="w-full"
                        >
                            {saving ? t('client_profile.saving') : t('client_profile.save_changes')}
                        </Button>
                    </form>

                    <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)' }}>
                        <h3 style={{ fontSize: '1rem', color: 'var(--error-color)', marginBottom: '0.5rem' }}>{t('client_profile.danger_zone')}</h3>
                        <Button
                            onClick={async () => {
                                const password = window.prompt(t('client_profile.enter_password_confirm'));
                                if (!password) return;

                                if (window.confirm(t('client_profile.delete_confirm'))) {
                                    try {
                                        await axios.delete('/api/profile', {
                                            data: { password }
                                        });
                                        toast.success(t('client_profile.account_deleted'));
                                        logout();
                                        navigate('/');
                                    } catch (error) {
                                        console.error(error);
                                        toast.error(error.response?.data?.message || t('client_profile.delete_error'));
                                    }
                                }
                            }}
                            variant="error"
                            className="w-full"
                        >
                            {t('client_profile.delete_account')}
                        </Button>
                    </div>
                </Card>

                {/* Forfaits Section */}
                <Card className="profile-forfaits-card" style={{ height: 'fit-content' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--text-main)' }}>
                            💳 {t('client_profile.my_forfaits')}
                        </h2>
                        <Button variant="ghost" onClick={() => navigate('/cliente/forfaits')} label={t('client_profile.buy_more')}>
                            {t('client_profile.buy_more')}
                        </Button>
                    </div>

                    {forfaits.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '2rem', border: '2px dashed #e5e7eb', borderRadius: '1rem', color: colors.subtext }}>
                            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🎫</div>
                            {t('client_profile.no_forfaits')}
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gap: '1rem' }}>
                            {forfaits.map((ff, index) => (
                                <div key={index} style={{
                                    background: `linear-gradient(135deg, ${colors.primary}, ${colors.primaryHover})`,
                                    padding: '1.5rem',
                                    borderRadius: '1rem',
                                    color: 'white',
                                    boxShadow: '0 4px 6px rgba(37, 99, 235, 0.2)',
                                    position: 'relative',
                                    overflow: 'hidden'
                                }}>
                                    <div style={{ position: 'relative', zIndex: 1 }}>
                                        <div style={{ fontSize: '0.75rem', opacity: 0.9, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{t('client_profile.active_forfait')}</div>
                                        <div style={{ fontSize: '2.5rem', fontWeight: '800', margin: '0.5rem 0' }}>
                                            {ff.viajes_restantes}
                                        </div>
                                        <div style={{ fontSize: '0.85rem', opacity: 0.9 }}>
                                            {t('client_profile.trips_remaining')}
                                        </div>
                                        <div style={{ marginTop: '1rem', fontSize: '0.8rem', opacity: 0.8, borderTop: '1px solid rgba(255,255,255,0.2)', paddingTop: '0.5rem' }}>
                                            {t('driver_dashboard.expires_on')}: {new Date(ff.fecha_expiracion).toLocaleDateString()}
                                        </div>
                                    </div>
                                    <div style={{
                                        position: 'absolute',
                                        right: '-1rem',
                                        bottom: '-1rem',
                                        opacity: 0.1,
                                        fontSize: '8rem',
                                        transform: 'rotate(-20deg)'
                                    }}>
                                        🏍️
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </Card>

                {/* Purchase History */}
                <Card className="profile-history-card" style={{ gridColumn: '1 / -1' }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1.5rem', color: 'var(--text-main)' }}>
                        📜 {t('client_profile.purchase_history')}
                    </h2>

                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                            <thead>
                                <tr style={{ borderBottom: `2px solid ${colors.border}`, textAlign: 'left' }}>
                                    <th style={{ padding: '1rem', color: colors.subtext }}>{t('client_profile.date')}</th>
                                    <th style={{ padding: '1rem', color: colors.subtext }}>{t('client_profile.plan')}</th>
                                    <th style={{ padding: '1rem', color: colors.subtext }}>{t('client_profile.price')}</th>
                                    <th style={{ padding: '1rem', color: colors.subtext }}>{t('client_dashboard.state')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {forfaits.length === 0 ? (
                                    <tr>
                                        <td colSpan="4" style={{ padding: '2rem', textAlign: 'center', color: colors.subtext }}>
                                            {t('client_profile.no_history')}
                                        </td>
                                    </tr>
                                ) : (
                                    forfaits.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).map((item, index) => (
                                        <tr key={index} style={{ borderBottom: `1px solid ${colors.border}` }}>
                                            <td style={{ padding: '1rem', color: colors.text }}>
                                                {new Date(item.created_at).toLocaleDateString()}
                                            </td>
                                            <td style={{ padding: '1rem', fontWeight: '500', color: colors.text }}>
                                                {item.forfait?.nombre || 'Plan Estándar'}
                                            </td>
                                            <td style={{ padding: '1rem', color: colors.text }}>
                                                {item.forfait?.precio ? `${item.forfait.precio.toLocaleString()} CFA` : '-'}
                                            </td>
                                            <td style={{ padding: '1rem' }}>
                                                <span style={{
                                                    padding: '0.25rem 0.75rem',
                                                    borderRadius: '9999px',
                                                    fontSize: '0.75rem',
                                                    fontWeight: '600',
                                                    backgroundColor: item.estado === 'activo' ? '#dcfce7' : '#f3f4f6',
                                                    color: item.estado === 'activo' ? '#166534' : '#4b5563'
                                                }}>
                                                    {item.estado ? item.estado.toUpperCase() : 'N/A'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </Card>

            </main >
        </div >
    );
};

export default ClienteProfile;
