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
 * MotoristaProfile Component
 *
 * [ES] Gestión del perfil de conductor.
 *      Permite actualizar datos personales (nombre, email, teléfono) y visualizar la información técnica del vehículo registrado.
 *
 * [FR] Gestion du profil du chauffeur.
 *      Permet de mettre à jour les données personnelles (nom, email, téléphone) et de visualiser les informations techniques du véhicule enregistré.
 */
const MotoristaProfile = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    // Local state
    const [formData, setFormData] = useState({ name: '', email: '', telefono: '' });
    const [motoInfo, setMotoInfo] = useState({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const { t } = useTranslation();

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
            if (userData.motorista_perfil) {
                setMotoInfo(userData.motorista_perfil);
            }
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
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{
                        background: 'rgba(255,255,255,0.2)',
                        padding: '0.75rem',
                        borderRadius: '1rem',
                        fontSize: '2rem'
                    }}>
                        🛵
                    </div>
                    <div>
                        <h1 className="header-title" style={{ fontSize: '1.75rem', fontWeight: '800', margin: 0 }}>
                            {t('driver_dashboard.profile')}
                        </h1>
                        <p style={{ margin: 0, opacity: 0.9, fontSize: '0.95rem' }}>{t('driver_dashboard.manage_profile')}</p>
                    </div>
                </div>
                <div className="desktop-nav">
                    <Button onClick={() => navigate('/motorista')} label="Dashboard">
                        ← Dashboard
                    </Button>
                </div>
            </header>

            {/* Mobile Bottom Nav */}
            <nav className="mobile-bottom-nav">
                <Button variant="ghost" onClick={() => navigate('/motorista')} label="Dashboard">
                    <span style={{ fontSize: '1.25rem' }}>🏠</span>
                    {t('nav.dashboard')}
                </Button>
                <Button variant="ghost" onClick={() => navigate('/motorista/history')} label={t('client_dashboard.history')}>
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
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1.5rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        👤 {t('driver_dashboard.personal_data')}
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
                        {/* Preferences */}
                        <Card className="profile-section">
                            <h3 className="section-title">⚙️ {t('profile.preferences')}</h3>
                            <div className="preferences-list">
                                <div className="pref-item">
                                    <span>🔔 {t('profile.notifications')}</span>
                                    <Button
                                        variant="outline"
                                        className="btn-sm"
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
                            </div>
                        </Card>
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
                            {saving ? t('common.saving') : t('common.save_changes')}
                        </Button>
                    </form>
                </Card>

                {/* Vehicle Info */}
                <Card className="profile-vehicle-card" style={{ height: 'fit-content' }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1.5rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        🏍️ {t('driver_dashboard.your_vehicle')}
                    </h2>

                    <div style={{ display: 'grid', gap: '1rem' }}>
                        <div style={{ display: 'grid', gap: '0.5rem' }}>
                            <label className="form-label">{t('driver_dashboard.license_plate')}</label>
                            <input
                                type="text"
                                value={motoInfo.matricula || ''}
                                onChange={e => setMotoInfo({ ...motoInfo, matricula: e.target.value })}
                                className="mtx-input"
                                style={{ fontWeight: 'bold', fontFamily: 'monospace' }}
                            />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div>
                                <label className="form-label">{t('driver_dashboard.model')}</label>
                                <input
                                    type="text"
                                    value={motoInfo.modelo_moto || ''}
                                    onChange={e => setMotoInfo({ ...motoInfo, modelo_moto: e.target.value })}
                                    className="mtx-input"
                                />
                            </div>
                            <div>
                                <label className="form-label">{t('driver_dashboard.year')}</label>
                                <input
                                    type="text"
                                    value={motoInfo.anio_moto || ''}
                                    onChange={e => setMotoInfo({ ...motoInfo, anio_moto: e.target.value })}
                                    className="mtx-input"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="form-label">{t('driver_dashboard.color')}</label>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <input
                                    type="text"
                                    value={motoInfo.color_moto || ''}
                                    onChange={e => setMotoInfo({ ...motoInfo, color_moto: e.target.value })}
                                    className="mtx-input"
                                />
                                {motoInfo.color_moto && (
                                    <div style={{
                                        width: '40px',
                                        height: '40px',
                                        borderRadius: '0.5rem',
                                        backgroundColor: motoInfo.color_moto,
                                        border: '1px solid var(--border-color)',
                                        flexShrink: 0
                                    }}></div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div style={{ marginTop: '1.5rem', fontSize: '0.875rem', color: 'var(--text-muted)', textAlign: 'center', fontStyle: 'italic' }}>
                        * {t('driver_dashboard.vehicle_support_note')}
                    </div>
                </Card>
            </main>
        </div>
    );
};

export default MotoristaProfile;
