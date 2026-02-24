import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { Card, Button } from '../../components/Common/UI';

/**
 * AdminProfile Component
 *
 * [ES] Vista de perfil para administradores. Muestra información básica y gestión de cuenta.
 * [FR] Vue de profil pour les administrateurs. Affiche les informations de base et la gestion du compte.
 */
const AdminProfile = () => {
    const { user, logout } = useAuth();
    const { t } = useTranslation();

    return (
        <div className="main-content-centered">
            <main style={{ maxWidth: '800px', margin: '0 auto', width: '100%' }}>
                <div style={{ marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#111827' }}>
                        {t('client_dashboard.profile')}
                    </h2>
                </div>

                <Card className="mb-6">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2rem' }}>
                        <div style={{
                            width: '80px',
                            height: '80px',
                            background: 'var(--primary-color)',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '2.5rem',
                            color: 'white'
                        }}>
                            👤
                        </div>
                        <div>
                            <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{user?.name}</h3>
                            <p style={{ color: 'var(--text-muted)' }}>{user?.email}</p>
                            <span style={{
                                display: 'inline-block',
                                marginTop: '0.5rem',
                                padding: '0.25rem 0.75rem',
                                background: '#fef3c7',
                                color: '#92400e',
                                borderRadius: '9999px',
                                fontSize: '0.75rem',
                                fontWeight: 'bold'
                            }}>
                                {t('nav.admin_role')}
                            </span>
                        </div>
                    </div>

                    <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
                        <h4 style={{ fontWeight: 'bold', marginBottom: '1rem' }}>{t('client_profile.personal_info')}</h4>
                        <div style={{ display: 'grid', gap: '1rem' }}>
                            <div>
                                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{t('common.name')}</label>
                                <p style={{ fontWeight: '500' }}>{user?.name}</p>
                            </div>
                            <div>
                                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{t('common.email')}</label>
                                <p style={{ fontWeight: '500' }}>{user?.email}</p>
                            </div>
                        </div>
                    </div>
                </Card>

                <Card accent>
                    <h4 style={{ color: '#b91c1c', fontWeight: 'bold', marginBottom: '1rem' }}>
                        {t('client_profile.danger_zone')}
                    </h4>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                        {t('client_profile.danger_zone_desc')}
                    </p>
                    <Button variant="danger" onClick={logout} className="w-full">
                        {t('common.logout')}
                    </Button>
                </Card>
            </main>
        </div>
    );
};

export default AdminProfile;
