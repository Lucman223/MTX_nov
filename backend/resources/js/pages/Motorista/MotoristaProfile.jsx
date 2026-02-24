import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import SEO from '../../components/Common/SEO';
import { Card, Button, Badge } from '../../components/Common/UIComponents';
import { User, Mail, Phone, Settings, ShieldCheck, Bike, Calendar, Star, LogOut, LayoutDashboard, History, CheckCircle } from 'lucide-react';

/**
 * MotoristaProfile Component
 *
 * [ES] Gestión del perfil de conductor. Premium Redesign.
 */
const MotoristaProfile = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    // Local state
    const [formData, setFormData] = useState({ name: '', email: '', telefono: '' });
    const [stats, setStats] = useState({ rating: 0, viajes: 0 });
    const [motoInfo, setMotoInfo] = useState({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [memberSince, setMemberSince] = useState('2024');

    const { t } = useTranslation();

    useEffect(() => {
        fetchProfile();
        fetchStats();
    }, []);

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
            if (userData.motorista_perfil) {
                setMotoInfo(userData.motorista_perfil);
            }
            if (userData.created_at) {
                const year = new Date(userData.created_at).getFullYear();
                setMemberSince(year);
            }
        } catch (error) {
            toast.error(t('client_profile.loading_error'));
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const res = await axios.get('/api/motorista/stats');
            setStats({
                rating: res.data.rating_promedio || 0,
                viajes: res.data.viajes_completados || 0
            });
        } catch (e) {
            console.error("Error fetching driver stats", e);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            // Update personal info
            await axios.put('/api/auth/profile', {
                name: formData.name,
                email: formData.email,
                telefono: formData.telefono
            });

            // Update vehicle info
            await axios.put('/api/motorista/perfil', {
                matricula: motoInfo.matricula,
                modelo_moto: motoInfo.modelo_moto,
                anio_moto: motoInfo.anio_moto,
                color_moto: motoInfo.color_moto
            });

            toast.success(t('client_profile.update_success'));
        } catch (error) {
            toast.error(t('client_profile.update_error'));
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="dashboard-container driver-theme">
            <SEO title={t('driver_dashboard.profile')} />

            <header className="mtx-header driver-header">
                <div className="mtx-header-brand">
                    <div className="mtx-header-icon premium">
                        <User size={24} className="text-white" />
                    </div>
                    <div className="mtx-header-text">
                        <h1 className="header-title">
                            {t('driver_dashboard.profile')}
                        </h1>
                        <p className="header-subtitle">{t('driver_dashboard.manage_profile')}</p>
                    </div>
                </div>
                <div className="desktop-nav">
                    <Button onClick={() => navigate('/motorista')} variant="ghost" className="btn--sm">
                        <LayoutDashboard size={18} /> Dashboard
                    </Button>
                </div>
            </header>

            {/* Mobile Bottom Nav */}
            <nav className="mobile-bottom-nav">
                <Button variant="ghost" onClick={() => navigate('/motorista')} label="Dashboard">
                    <LayoutDashboard size={20} />
                    {t('nav.dashboard')}
                </Button>
                <Button variant="ghost" onClick={() => navigate('/motorista/historial')} label={t('client_dashboard.history')}>
                    <History size={20} />
                    {t('client_dashboard.history')}
                </Button>
                <Button variant="ghost" className="active" label={t('client_dashboard.profile')}>
                    <User size={20} />
                    {t('client_dashboard.profile')}
                </Button>
            </nav>

            <main className="main-content-centered">
                {/* Driver Identity Card - Premium Feature */}
                <div className="driver-id-card animate-in fade-in slide-in-from-bottom-4">
                    <div className="id-card-header">
                        <div className="driver-avatar-container">
                            <div className="driver-avatar-placeholder">
                                {formData.name?.charAt(0) || 'D'}
                            </div>
                            <div className="verified-badge-glow">
                                <ShieldCheck size={16} fill="#10b981" />
                            </div>
                        </div>
                        <div className="driver-main-info">
                            <h2 className="driver-name-display">{formData.name || 'Motorista'}</h2>
                            <div className="driver-meta-badges">
                                <Badge variant="premium" className="badge--sm status-pulse-active">
                                    <ShieldCheck size={12} style={{ marginRight: '4px' }} />
                                    {t('driver_dashboard.enabled')}
                                </Badge>
                                <div className="member-since">
                                    <Calendar size={12} />
                                    <span>{t('driver_dashboard.member_since', { year: memberSince })}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="id-card-stats">
                        <div className="id-stat-item">
                            <span className="id-stat-label">{t('driver_dashboard.average_rating')}</span>
                            <div className="id-stat-value">
                                <Star size={16} fill="#f59e0b" className="text-accent" />
                                <span>{stats.rating > 0 ? stats.rating.toFixed(1) : t('driver_dashboard.no_rating')}</span>
                            </div>
                        </div>
                        <div className="id-stat-divider"></div>
                        <div className="id-stat-item">
                            <span className="id-stat-label">{t('driver_dashboard.completed_trips')}</span>
                            <div className="id-stat-value">
                                <CheckCircle size={16} className="text-secondary" />
                                <span>{stats.viajes}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mtx-profile-grid" style={{ marginTop: '2rem' }}>
                    <Card className="profile-info-card">
                        <h2 className="card-title-section">
                            <User size={20} className="text-secondary" /> {t('driver_dashboard.personal_data')}
                        </h2>

                        <form onSubmit={handleSubmit} className="mtx-modern-form">
                            <div className="input-group-modern">
                                <label className="form-label">
                                    <User size={14} /> {t('common.name')}
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    className="mtx-input"
                                />
                            </div>
                            <div className="input-group-modern">
                                <label className="form-label">
                                    <Mail size={14} /> {t('common.email')}
                                </label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                    className="mtx-input"
                                />
                            </div>

                            <div className="input-group-modern">
                                <label className="form-label">
                                    <Phone size={14} /> {t('common.phone')}
                                </label>
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
                                className="btn--block"
                            >
                                {saving ? t('common.saving') : t('common.save_changes')}
                            </Button>
                        </form>
                    </Card>

                    {/* Preferences & Notifications Tester - Separate Card */}
                    <Card className="profile-preferences-card animate-in fade-in slide-in-from-bottom-6">
                        <div className="card-header-with-icon">
                            <Settings size={20} className="text-secondary" />
                            <h3 className="card-title-section-modern">{t('driver_dashboard.preferences')}</h3>
                        </div>
                        <p className="section-description-text">
                            {t('driver_dashboard.manage_profile')} - {t('driver_dashboard.notifications')}
                        </p>

                        <div className="preferences-action-box">
                            <div className="pref-info">
                                <span className="pref-label">{t('profile.test_notification')}</span>
                                <span className="pref-help">{t('profile.browser_no_notifications')}?</span>
                            </div>
                            <Button
                                variant="outline"
                                type="button"
                                className="btn--sm btn--ghost"
                                onClick={() => {
                                    if (!("Notification" in window)) {
                                        alert(t('profile.browser_no_notifications'));
                                    } else if (Notification.permission === "granted") {
                                        new Notification("MotoTX", { body: t('profile.notification_test_body') });
                                    } else if (Notification.permission !== "denied") {
                                        Notification.requestPermission().then(permission => {
                                            if (permission === "granted") {
                                                new Notification("MotoTX", { body: t('profile.notification_thanks') });
                                            }
                                        });
                                    }
                                }}
                            >
                                {t('profile.test_notification')}
                            </Button>
                        </div>
                    </Card>

                    <Card className="profile-danger-card animate-in fade-in slide-in-from-bottom-8">
                        <div className="danger-zone-enhanced">
                            <div className="danger-header">
                                <LogOut size={20} className="text-error" />
                                <h3 className="danger-title-modern">{t('client_profile.danger_zone')}</h3>
                            </div>
                            <p className="danger-description">
                                {t('client_profile.delete_confirm')}
                            </p>
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
                                            toast.error(error.response?.data?.message || t('client_profile.delete_error'));
                                        }
                                    }
                                }}
                                variant="error"
                                className="btn--block btn--ghost-error"
                            >
                                <LogOut size={16} /> {t('client_profile.delete_account')}
                            </Button>
                        </div>
                    </Card>

                    {/* Vehicle Info */}
                    <div className="vehicle-perspective-container">
                        <Card className="profile-vehicle-card-v2">
                            <div className="vehicle-card-header">
                                <Bike size={32} className="text-secondary opacity-20" />
                                <h2 className="card-title-section-modern">
                                    {t('driver_dashboard.your_vehicle')}
                                </h2>
                            </div>

                            <div className="vehicle-form-grid">
                                <div className="input-group-modern col-span-2">
                                    <label className="form-label">{t('driver_dashboard.license_plate')}</label>
                                    <div className="license-plate-input-wrapper">
                                        <input
                                            type="text"
                                            value={motoInfo.matricula || ''}
                                            onChange={e => setMotoInfo({ ...motoInfo, matricula: e.target.value })}
                                            className="mtx-input-plate"
                                            placeholder="ML-0000-XX"
                                        />
                                    </div>
                                </div>

                                <div className="input-group-modern">
                                    <label className="form-label">{t('driver_dashboard.model')}</label>
                                    <input
                                        type="text"
                                        value={motoInfo.modelo_moto || ''}
                                        onChange={e => setMotoInfo({ ...motoInfo, modelo_moto: e.target.value })}
                                        className="mtx-input"
                                    />
                                </div>
                                <div className="input-group-modern">
                                    <label className="form-label">{t('driver_dashboard.year')}</label>
                                    <input
                                        type="text"
                                        value={motoInfo.anio_moto || ''}
                                        onChange={e => setMotoInfo({ ...motoInfo, anio_moto: e.target.value })}
                                        className="mtx-input"
                                    />
                                </div>

                                <div className="input-group-modern col-span-2">
                                    <label className="form-label">{t('driver_dashboard.color')}</label>
                                    <div className="color-input-wrapper">
                                        <input
                                            type="text"
                                            value={motoInfo.color_moto || ''}
                                            onChange={e => setMotoInfo({ ...motoInfo, color_moto: e.target.value })}
                                            className="mtx-input"
                                        />
                                        {motoInfo.color_moto && (
                                            <div
                                                className="color-preview-node"
                                                style={{ backgroundColor: motoInfo.color_moto }}
                                            ></div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="vehicle-support-alert">
                                <ShieldCheck size={14} />
                                <span>{t('driver_dashboard.vehicle_support_note')}</span>
                            </div>
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default MotoristaProfile;
