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
 * [ES] Gestión del perfil del cliente — diseño premium unificado con el panel del motorista.
 * [FR] Gestion du profil client — design premium unifié avec le panneau conducteur.
 */
const ClienteProfile = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const { t } = useTranslation();

    const [formData, setFormData] = useState({ name: '', email: '', telefono: '' });
    const [forfaits, setForfaits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

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

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const totalTripsLeft = Array.isArray(forfaits)
        ? forfaits.filter(f => f.estado === 'activo').reduce((acc, f) => acc + (parseInt(f.viajes_restantes) || 0), 0)
        : 0;

    if (loading) {
        return (
            <div className="dashboard-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
                <div className="searching-spinner" style={{
                    width: '3rem', height: '3rem',
                    border: '4px solid #e2e8f0',
                    borderTopColor: 'var(--primary-color)',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                }} />
            </div>
        );
    }

    return (
        <div className="dashboard-container">
            <SEO title={t('client_dashboard.profile')} />

            {/* ─── Header ─── */}
            <header className="mtx-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{
                        background: 'var(--primary-color)',
                        width: '2.5rem', height: '2.5rem',
                        borderRadius: '50%',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '1.25rem', flexShrink: 0
                    }}>👤</div>
                    <div>
                        <h1 className="header-title">{t('client_dashboard.profile')}</h1>
                        <span className="header-subtitle">{formData.name || t('auth.role_client')}</span>
                    </div>
                </div>
                <div className="desktop-nav">
                    <Badge variant="premium">{totalTripsLeft} 🎫</Badge>
                    <Button variant="outline" onClick={() => navigate('/cliente')} label={t('nav.dashboard')}>
                        ← {t('nav.dashboard')}
                    </Button>
                    <Button variant="error" onClick={handleLogout} label={t('common.logout')}>
                        {t('common.logout')}
                    </Button>
                </div>
                <div className="mobile-balance-badge">
                    <Badge variant="premium">{totalTripsLeft} 🎫</Badge>
                </div>
            </header>

            {/* ─── Mobile Bottom Nav ─── */}
            <nav className="mobile-bottom-nav">
                <Button variant="ghost" onClick={() => navigate('/cliente')} label={t('nav.dashboard')}>
                    <span style={{ fontSize: '1.25rem' }}>🏠</span>
                    {t('nav.dashboard')}
                </Button>
                <Button variant="ghost" onClick={() => navigate('/cliente/historial')} label={t('client_dashboard.history')}>
                    <span style={{ fontSize: '1.25rem' }}>📋</span>
                    {t('client_dashboard.history')}
                </Button>
                <Button variant="ghost" className="active" label={t('client_dashboard.profile')}>
                    <span style={{ fontSize: '1.25rem' }}>👤</span>
                    {t('client_dashboard.profile')}
                </Button>
                <Button variant="ghost" onClick={handleLogout} label={t('common.logout')} className="text-error">
                    <span style={{ fontSize: '1.25rem' }}>🚪</span>
                    {t('common.logout')}
                </Button>
            </nav>

            {/* ─── Main Content ─── */}
            <main className="main-content-centered" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(22rem, 1fr))', gap: '1.5rem', paddingTop: '1.5rem' }}>

                {/* Personal Info Card */}
                <Card>
                    <h2 className="card-title-section">
                        ✏️ {t('client_profile.personal_info')}
                    </h2>

                    <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1.25rem' }}>
                        <div className="input-group-modern">
                            <label className="form-label">{t('common.name')}</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                className="mtx-input"
                                placeholder={t('common.name')}
                            />
                        </div>
                        <div className="input-group-modern">
                            <label className="form-label">{t('common.email')}</label>
                            <input
                                type="email"
                                value={formData.email}
                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                                className="mtx-input"
                                placeholder={t('common.email')}
                            />
                        </div>
                        <div className="input-group-modern">
                            <label className="form-label">{t('common.phone')}</label>
                            <input
                                type="text"
                                value={formData.telefono}
                                onChange={e => setFormData({ ...formData, telefono: e.target.value })}
                                className="mtx-input"
                                placeholder="+223 ..."
                            />
                        </div>

                        <Button type="submit" disabled={saving} className="w-full">
                            {saving ? t('client_profile.saving') : t('client_profile.save_changes')}
                        </Button>
                    </form>

                    {/* Danger Zone */}
                    <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)' }}>
                        <h3 style={{ fontSize: '0.875rem', fontWeight: '700', color: 'var(--error-color)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            ⚠️ {t('client_profile.danger_zone')}
                        </h3>
                        <Button
                            variant="error"
                            className="w-full"
                            onClick={async () => {
                                const password = window.prompt(t('client_profile.enter_password_confirm'));
                                if (!password) return;
                                if (window.confirm(t('client_profile.delete_confirm'))) {
                                    try {
                                        await axios.delete('/api/profile', { data: { password } });
                                        toast.success(t('client_profile.account_deleted'));
                                        logout();
                                        navigate('/');
                                    } catch (error) {
                                        toast.error(error.response?.data?.message || t('client_profile.delete_error'));
                                    }
                                }
                            }}
                        >
                            🗑️ {t('client_profile.delete_account')}
                        </Button>
                    </div>
                </Card>

                {/* Active Forfaits Card */}
                <Card style={{ height: 'fit-content' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h2 className="card-title-section" style={{ marginBottom: 0 }}>
                            💳 {t('client_profile.my_forfaits')}
                        </h2>
                        <Button variant="ghost" onClick={() => navigate('/cliente/forfaits')} label={t('client_profile.buy_more')}>
                            {t('client_profile.buy_more')}
                        </Button>
                    </div>

                    {/* Total trips counter */}
                    {totalTripsLeft > 0 && (
                        <div style={{
                            background: 'linear-gradient(135deg, #f0fdf4, #dcfce7)',
                            border: '1px solid #86efac',
                            borderRadius: '1rem',
                            padding: '1rem',
                            marginBottom: '1rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem'
                        }}>
                            <span style={{ fontSize: '2rem' }}>🎟️</span>
                            <div>
                                <div style={{ fontSize: '1.5rem', fontWeight: '900', color: '#166534' }}>{totalTripsLeft}</div>
                                <div style={{ fontSize: '0.8rem', color: '#15803d' }}>{t('client_profile.trips_remaining')}</div>
                            </div>
                        </div>
                    )}

                    {forfaits.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '2rem', border: '2px dashed #e5e7eb', borderRadius: '1rem', color: 'var(--text-muted)' }}>
                            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🎫</div>
                            <p style={{ margin: 0 }}>{t('client_profile.no_forfaits')}</p>
                            <Button variant="accent" onClick={() => navigate('/cliente/forfaits')} style={{ marginTop: '1rem' }}>
                                {t('client_profile.buy_more')} →
                            </Button>
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gap: '1rem' }}>
                            {Array.isArray(forfaits) && forfaits.map((ff, index) => (
                                <div key={index} style={{
                                    background: ff.estado === 'activo'
                                        ? 'linear-gradient(135deg, #2563eb, #1d4ed8)'
                                        : 'linear-gradient(135deg, #6b7280, #4b5563)',
                                    padding: '1.25rem',
                                    borderRadius: '1rem',
                                    color: 'white',
                                    boxShadow: ff.estado === 'activo' ? '0 4px 12px rgba(37, 99, 235, 0.25)' : 'none',
                                    position: 'relative',
                                    overflow: 'hidden'
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                        <div>
                                            <div style={{ fontSize: '0.7rem', opacity: 0.85, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.25rem' }}>
                                                {ff.forfait?.nombre || t('client_profile.active_forfait')}
                                            </div>
                                            <div style={{ fontSize: '2.25rem', fontWeight: '900', lineHeight: 1 }}>
                                                {ff.viajes_restantes}
                                            </div>
                                            <div style={{ fontSize: '0.8rem', opacity: 0.85, marginTop: '0.25rem' }}>
                                                {t('client_profile.trips_remaining')}
                                            </div>
                                        </div>
                                        <Badge variant={ff.estado === 'activo' ? 'success' : 'default'} style={{ flexShrink: 0 }}>
                                            {ff.estado?.toUpperCase()}
                                        </Badge>
                                    </div>
                                    <div style={{ marginTop: '0.75rem', fontSize: '0.75rem', opacity: 0.8, borderTop: '1px solid rgba(255,255,255,0.2)', paddingTop: '0.5rem' }}>
                                        {t('driver_dashboard.expires_on')}: {new Date(ff.fecha_expiracion).toLocaleDateString()}
                                    </div>
                                    {/* Decorative icon */}
                                    <div style={{ position: 'absolute', right: '-1rem', bottom: '-1rem', opacity: 0.08, fontSize: '7rem', transform: 'rotate(-15deg)', pointerEvents: 'none' }}>
                                        🏍️
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </Card>

                {/* Purchase History Card */}
                <Card style={{ gridColumn: '1 / -1' }}>
                    <h2 className="card-title-section">
                        📜 {t('client_profile.purchase_history')}
                    </h2>

                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                            <thead>
                                <tr style={{ borderBottom: '2px solid var(--border-color)', textAlign: 'left' }}>
                                    <th style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)', fontWeight: '600', fontSize: '0.8rem', textTransform: 'uppercase' }}>
                                        {t('client_profile.date')}
                                    </th>
                                    <th style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)', fontWeight: '600', fontSize: '0.8rem', textTransform: 'uppercase' }}>
                                        {t('client_profile.plan')}
                                    </th>
                                    <th style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)', fontWeight: '600', fontSize: '0.8rem', textTransform: 'uppercase' }}>
                                        {t('client_profile.price')}
                                    </th>
                                    <th style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)', fontWeight: '600', fontSize: '0.8rem', textTransform: 'uppercase' }}>
                                        {t('client_dashboard.state')}
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {forfaits.length === 0 ? (
                                    <tr>
                                        <td colSpan="4" style={{ padding: '2.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                                            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📭</div>
                                            {t('client_profile.no_history')}
                                        </td>
                                    </tr>
                                ) : (
                                    Array.isArray(forfaits) && [...forfaits]
                                        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                                        .map((item, index) => (
                                            <tr key={index} style={{
                                                borderBottom: '1px solid var(--border-color)',
                                                transition: 'background 0.15s ease'
                                            }}
                                                onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                                                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                            >
                                                <td style={{ padding: '1rem', color: 'var(--text-main)' }}>
                                                    {new Date(item.created_at).toLocaleDateString()}
                                                </td>
                                                <td style={{ padding: '1rem', fontWeight: '600', color: 'var(--text-main)' }}>
                                                    {item.forfait?.nombre || t('client_profile.default_plan_name')}
                                                </td>
                                                <td style={{ padding: '1rem', color: 'var(--text-main)' }}>
                                                    {item.forfait?.precio ? `${item.forfait.precio.toLocaleString()} CFA` : '-'}
                                                </td>
                                                <td style={{ padding: '1rem' }}>
                                                    <span style={{
                                                        display: 'inline-block',
                                                        padding: '0.2rem 0.7rem',
                                                        borderRadius: '9999px',
                                                        fontSize: '0.72rem',
                                                        fontWeight: '700',
                                                        textTransform: 'uppercase',
                                                        backgroundColor: item.estado === 'activo' ? '#dcfce7' : '#f3f4f6',
                                                        color: item.estado === 'activo' ? '#166534' : '#6b7280'
                                                    }}>
                                                        {item.estado ? item.estado : 'N/A'}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </Card>

            </main>
        </div>
    );
};

export default ClienteProfile;
