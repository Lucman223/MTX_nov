import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import SEO from '../../components/Common/SEO';
import { Card, Button, Badge } from '../../components/Common/UIComponents';
import '../../../css/components.css';

/**
 * MotoristaTransactions Component
 *
 * [ES] Historial financiero dedicado para el motorista.
 *      Muestra retiros, ingresos y saldo actual de forma independiente al historial de viajes.
 *
 * [FR] Historique financier dédié pour le chauffeur.
 *      Affiche les retraits, les revenus et le solde actuel indépendamment de l'historique des trajets.
 */
const MotoristaTransactions = () => {
    const { logout, user } = useAuth();
    const navigate = useNavigate();
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [balance, setBalance] = useState(0);

    const { t } = useTranslation();
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            // Fetch transactions
            const txRes = await axios.get('/api/motorista/transacciones');
            setTransactions(txRes.data || []);

            // Fetch profile for current balance
            const profileRes = await axios.get('/api/motorista/perfil');
            setBalance(profileRes.data.billetera || 0);
        } catch (error) {
            console.error('Error fetching financial data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleWithdraw = async () => {
        if (balance <= 0) {
            toast.error(t('driver_dashboard.insufficient_funds'));
            return;
        }

        try {
            await axios.post('/api/motorista/retirar', { monto: balance });
            toast.success(t('driver_dashboard.withdraw_success'));
            fetchData();
        } catch (error) {
            toast.error(error.response?.data?.error || t('common.error'));
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="dashboard-container driver-theme">
            <SEO title={t('driver_dashboard.finance_title')} />

            <header className="mtx-header driver-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span style={{ fontSize: '2rem' }}>💰</span>
                    <div>
                        <h1 className="header-title" style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--secondary-color)', margin: 0 }}>
                            {t('driver_dashboard.finance_title')}
                        </h1>
                        <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                            {user?.name || t('driver_dashboard.driver_role')}
                        </span>
                    </div>
                </div>
                <div className="desktop-nav" style={{ display: 'flex', gap: '1rem' }}>
                    <Button onClick={() => navigate('/motorista')} label="Dashboard">
                        ← Dashboard
                    </Button>
                    <Button variant="outline" onClick={() => navigate('/motorista/perfil')} label={t('client_dashboard.profile')}>
                        👤 {t('client_dashboard.profile')}
                    </Button>
                    <Button variant="error" onClick={handleLogout} label={t('common.logout')}>
                        {t('common.logout')}
                    </Button>
                </div>
            </header>

            {/* Mobile Bottom Nav */}
            <nav className="mobile-bottom-nav">
                <Button variant="ghost" onClick={() => navigate('/motorista')} label="Dashboard">
                    <span style={{ fontSize: '1.25rem' }}>🏠</span>
                    {t('nav.dashboard')}
                </Button>
                <Button variant="ghost" className="active" label={t('driver_dashboard.finance_title')}>
                    <span style={{ fontSize: '1.25rem' }}>💰</span>
                    {t('driver_dashboard.finance_title').split(' ')[0]}
                </Button>
                <Button variant="ghost" onClick={() => navigate('/motorista/perfil')} label={t('client_dashboard.profile')}>
                    <span style={{ fontSize: '1.25rem' }}>👤</span>
                    {t('client_dashboard.profile')}
                </Button>
            </nav>

            <main className="main-content-centered">
                {/* Balance Card */}
                <Card style={{
                    background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
                    color: 'white',
                    marginBottom: '2rem',
                    display: 'flex',
                    flexDirection: isMobile ? 'column' : 'row',
                    justifyContent: 'space-between',
                    alignItems: isMobile ? 'flex-start' : 'center',
                    padding: '2rem',
                    gap: '1rem'
                }}>
                    <div>
                        <div style={{ fontSize: '0.9rem', opacity: 0.9, textTransform: 'uppercase', fontWeight: 'bold' }}>{t('driver_dashboard.balance_available')}</div>
                        <div style={{ fontSize: '3rem', fontWeight: '800' }}>{balance.toLocaleString()} CFA</div>
                    </div>
                    <Button
                        onClick={handleWithdraw}
                        disabled={balance <= 0}
                        style={{ backgroundColor: 'white', color: 'var(--secondary-color)', padding: '0.75rem 1.5rem', fontWeight: 'bold', borderRadius: '0.5rem' }}
                    >
                        💸 {t('driver_dashboard.withdraw_btn')}
                    </Button>
                </Card>

                <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1.5rem', color: 'var(--text-main)' }}>
                    {t('driver_dashboard.recent_transactions')}
                </h2>

                {loading ? (
                    <div className="loading-state">
                        {t('common.loading')}
                    </div>
                ) : transactions.length === 0 ? (
                    <Card className="empty-state">
                        <div className="empty-icon">💸</div>
                        <p className="empty-text">
                            {t('driver_dashboard.no_transactions')}
                        </p>
                    </Card>
                ) : (
                    <div style={{ display: 'grid', gap: '1rem' }}>
                        {transactions.map((tx) => (
                            <Card key={tx.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem' }}>
                                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                    <div style={{
                                        width: '45px',
                                        height: '45px',
                                        borderRadius: '50%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '1.25rem',
                                        background: tx.tipo === 'retiro_saldo' ? '#fee2e2' : '#dcfce7',
                                        color: tx.tipo === 'retiro_saldo' ? '#ef4444' : '#10b981'
                                    }}>
                                        {tx.tipo === 'retiro_saldo' ? '📤' : '📥'}
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: 'bold', color: 'var(--text-main)' }}>
                                            {tx.tipo === 'retiro_saldo' ? t('driver_dashboard.withdrawal') : t('driver_dashboard.income')}
                                        </div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                            {new Date(tx.created_at).toLocaleDateString('es-ES', {
                                                day: 'numeric', month: 'long', year: 'numeric'
                                            })}
                                        </div>
                                    </div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{
                                        fontSize: '1.15rem',
                                        fontWeight: '800',
                                        color: tx.tipo === 'retiro_saldo' ? '#ef4444' : '#10b981'
                                    }}>
                                        {tx.tipo === 'retiro_saldo' ? '-' : '+'}{tx.monto.toLocaleString()} CFA
                                    </div>
                                    <Badge variant={tx.estado === 'completado' ? 'secondary' : 'warning'}>
                                        {t(`status.${tx.estado || 'pendiente'}`)}
                                    </Badge>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};

export default MotoristaTransactions;
