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
            console.error('Error fetching profile:', error);
            toast.error('Error al cargar el perfil');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await axios.put('/api/auth/profile', {
                name: formData.name,
                email: formData.email,
                telefono: formData.telefono
            });
            toast.success('Perfil actualizado correctamente');
        } catch (error) {
            toast.error('Error al actualizar');
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
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', backgroundColor: 'rgba(5, 150, 105, 0.05)', borderRadius: '0.5rem', border: '1px solid var(--secondary-color)' }}>
                            <span style={{ color: 'var(--text-muted)', fontWeight: '500' }}>{t('driver_dashboard.license_plate')}</span>
                            <span style={{ fontWeight: 'bold', fontFamily: 'monospace', fontSize: '1.1rem', color: 'var(--text-main)' }}>{motoInfo.matricula || '---'}</span>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div style={{ padding: '1rem', backgroundColor: 'var(--bg-light)', borderRadius: '0.5rem' }}>
                                <div className="detail-label">{t('driver_dashboard.model')}</div>
                                <div className="detail-value" style={{ marginTop: '0.25rem' }}>{motoInfo.modelo_moto || '---'}</div>
                            </div>
                            <div style={{ padding: '1rem', backgroundColor: 'var(--bg-light)', borderRadius: '0.5rem' }}>
                                <div className="detail-label">{t('driver_dashboard.year')}</div>
                                <div className="detail-value" style={{ marginTop: '0.25rem' }}>{motoInfo.anio_moto || '---'}</div>
                            </div>
                        </div>

                        <div style={{ padding: '1rem', backgroundColor: 'var(--bg-light)', borderRadius: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div className="detail-label">{t('driver_dashboard.color')}</div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <span style={{ fontWeight: '600' }}>{motoInfo.color_moto || '---'}</span>
                                {motoInfo.color_moto && (
                                    <div style={{ width: '1.5rem', height: '1.5rem', borderRadius: '50%', backgroundColor: motoInfo.color_moto, border: '2px solid white', boxShadow: 'var(--shadow-sm)' }}></div>
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
