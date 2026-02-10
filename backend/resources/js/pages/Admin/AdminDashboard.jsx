import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import DashboardCharts from '../../components/Admin/DashboardCharts';
import { useTranslation } from 'react-i18next';

/**
 * AdminDashboard Component
 *
 * [ES] El centro de mando para los administradores de la plataforma.
 *      Proporciona una visión general en tiempo real de KPIs, gráficos y acciones rápidas.
 *      Características: Tarjetas de estadísticas, Gráficos interactivos, Feed de actividad reciente.
 *
 * [FR] Le centre de commandement pour les administrateurs de la plateforme.
 *      Fournit une vue d'ensemble en temps réel des KPI, des graphiques et des actions rapides.
 *      Fonctionnalités : Cartes de statistiques, Graphiques interactifs, Flux d'activité récente.
 *
 * @component
 */
const AdminDashboard = () => {
    const { logout, user } = useAuth();
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [stats, setStats] = useState(null);
    const [chartData, setChartData] = useState([]);
    const [loading, setLoading] = useState(true);

    // Color system
    const colors = {
        primary: '#2563eb',
        secondary: '#10b981',
        accent: '#f59e0b',
        error: '#ef4444',
        purple: '#7c3aed'
    };

    /**
     * Effect: Fetches initial dashboard data on mount.
     */
    useEffect(() => {
        fetchStatistics();
    }, []);

    /**
     * Asynchronously retrieves dashboard statistics and chart data from the API.
     * Updates local state and handles loading states.
     */
    const fetchStatistics = async () => {
        setLoading(true);
        try {
            const [statsRes, chartRes] = await Promise.all([
                axios.get('/api/admin/statistics'),
                axios.get('/api/admin/chart-data')
            ]);

            setStats(statsRes.data);
            setChartData(chartRes.data);
        } catch (error) {
            // Optional: set dummy stats or error state
        } finally {
            setLoading(false);
        }
    };

    // ...

    // Recent Activity Render Logic
    // Recent Activity Render Logic
    /**
     * Renders the Recent Activity feed list.
     * Handles different data structures (array vs object) returned by the API.
     *
     * @returns {JSX.Element} The rendered activity list.
     */
    const renderActivity = () => {
        if (!stats?.recentActivity) return <div style={{ color: '#6b7280', padding: '1rem' }}>{t('admin_dashboard.activity.empty')}</div>;

        const activityList = Array.isArray(stats.recentActivity)
            ? stats.recentActivity
            : Object.values(stats.recentActivity);

        if (activityList.length === 0) return <div style={{ color: '#6b7280', padding: '1rem' }}>{t('admin_dashboard.activity.empty')}</div>;

        return activityList.map((activity, index) => (
            <div
                key={index}
                className="mtx-card"
                style={{
                    padding: '1rem 1.5rem',
                    borderLeft: `5px solid ${activity.color}`,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}
            >
                <span style={{ color: '#374151', fontWeight: '600' }}>
                    {activity.key ? t(activity.key, activity.params) : activity.text}
                </span>
                <span style={{ color: '#9ca3af', fontSize: '0.8rem', fontWeight: '500' }}>
                    {new Date(activity.time).toLocaleString()}
                </span>
            </div>
        ));
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // Stats cards configuration
    const statsConfig = stats ? [
        {
            title: t('admin_dashboard.stats.drivers'),
            value: stats.totalMotoristas,
            icon: '🏍️',
            color: colors.secondary,
            badge: stats.motoristasPendientes > 0 ? t('admin_dashboard.stats.drivers_pending', { count: stats.motoristasPendientes }) : null
        },
        {
            title: t('admin_dashboard.stats.trips_today'),
            value: stats.viajesHoy,
            icon: '🚀',
            color: colors.primary,
            subtitle: t('admin_dashboard.stats.trips_total', { count: stats.viajesTotales }),
            onClick: () => navigate('/admin/viajes')
        },
        {
            title: t('admin_dashboard.stats.income'),
            value: `${Math.round(stats.ingresosMes).toLocaleString()} CFA`,
            icon: '💰',
            color: colors.accent,
            subtitle: t('admin_dashboard.stats.forfaits_sold')
        },
        {
            title: t('admin_dashboard.stats.active_users'),
            value: stats.usuariosActivos,
            icon: '👥',
            color: colors.purple,
            subtitle: `${t('admin_dashboard.stats.average_rating')}: ${stats.ratingPromedio}⭐`
        }
    ] : [];

    const quickActions = [
        {
            title: t('admin_dashboard.actions.manage_drivers'),
            description: t('admin_dashboard.actions.manage_drivers_desc'),
            icon: '🏍️',
            color: colors.secondary,
            action: () => navigate('/admin/motoristas')
        },
        {
            title: t('admin_dashboard.actions.manage_clients'),
            description: t('admin_dashboard.actions.manage_clients_desc'),
            icon: '👥',
            color: '#06b6d4', // Cyan
            action: () => navigate('/admin/clientes')
        },
        {
            title: t('admin_dashboard.actions.manage_forfaits'),
            description: t('admin_dashboard.actions.manage_forfaits_desc'),
            icon: '💳',
            color: colors.primary,
            action: () => navigate('/admin/forfaits')
        },
        {
            title: t('admin_dashboard.actions.reports'),
            description: t('admin_dashboard.actions.reports_desc'),
            icon: '📊',
            color: colors.accent,
            action: () => navigate('/admin/reportes')
        }
    ];

    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div className="main-content-centered">
            {/* Main Content */}
            <main style={{ maxWidth: '1400px', margin: '0 auto', paddingBottom: '3rem' }}>


                {/* Welcome Section */}
                <div style={{ marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#111827', marginBottom: '0.5rem' }}>
                        {t('admin_dashboard.welcome', { name: user?.name || 'Admin' })}
                    </h2>
                    <p style={{ color: '#6b7280', fontSize: '1.05rem' }}>
                        {t('admin_dashboard.summary')}
                    </p>
                </div>


                {/* Stats Grid */}
                {loading ? (
                    <div className="mtx-card" style={{ textAlign: 'center', padding: '3rem', marginBottom: '2.5rem' }}>
                        {t('admin_dashboard.loading')}
                    </div>
                ) : (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                        gap: '1.5rem',
                        marginBottom: '2.5rem'
                    }}>
                        {statsConfig.map((stat, index) => (
                            <div
                                key={index}
                                className="mtx-card"
                                style={{
                                    padding: '1.75rem',
                                    transition: 'all 0.2s',
                                    cursor: 'pointer',
                                    borderLeft: `5px solid ${stat.color}`
                                }}
                                onMouseOver={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-4px)';
                                    e.currentTarget.style.boxShadow = `0 8px 24px ${stat.color}25`;
                                }}
                                onMouseOut={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                                }}
                                onClick={stat.onClick}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                                    <div style={{ fontSize: '0.875rem', color: '#6b7280', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                        {stat.title}
                                    </div>
                                    <div style={{ fontSize: '2rem' }}>
                                        {stat.icon}
                                    </div>
                                </div>
                                <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: stat.color, marginBottom: '0.5rem' }}>
                                    {stat.value}
                                </div>
                                {stat.badge && (
                                    <div style={{
                                        fontSize: '0.875rem',
                                        color: colors.accent,
                                        fontWeight: '600',
                                        padding: '0.25rem 0.75rem',
                                        background: `${colors.accent}15`,
                                        borderRadius: '0.5rem',
                                        display: 'inline-block',
                                        marginBottom: '0.5rem'
                                    }}>
                                        {stat.badge}
                                    </div>
                                )}
                                {stat.subtitle && (
                                    <div style={{ fontSize: '0.875rem', color: '#6b7280', fontWeight: '500' }}>
                                        {stat.subtitle}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {/* Quick Actions */}
                <div style={{ marginBottom: '2rem' }}>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827', marginBottom: '1.5rem' }}>
                        {t('admin_dashboard.actions.title')}
                    </h3>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                        gap: '1.5rem'
                    }}>
                        {quickActions.map((action, index) => (
                            <div
                                key={index}
                                onClick={action.action}
                                className="mtx-card"
                                style={{
                                    padding: '2.5rem 2rem',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    textAlign: 'center'
                                }}
                                onMouseOver={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-8px)';
                                    e.currentTarget.style.boxShadow = `0 20px 25px -5px ${action.color}20`;
                                    e.currentTarget.style.borderColor = action.color;
                                }}
                                onMouseOut={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                                    e.currentTarget.style.borderColor = 'var(--border-color)';
                                }}
                            >
                                <div style={{
                                    fontSize: '3.5rem',
                                    marginBottom: '1.5rem',
                                    filter: 'drop-shadow(0 10px 8px rgba(0,0,0,0.1))'
                                }}>
                                    {action.icon}
                                </div>
                                <h4 style={{
                                    fontSize: '1.25rem',
                                    fontWeight: 'bold',
                                    color: '#1f2937',
                                    marginBottom: '0.75rem'
                                }}>
                                    {action.title}
                                </h4>
                                <p style={{ color: '#6b7280', fontSize: '0.95rem', lineHeight: 1.6 }}>
                                    {action.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Charts Section */}
                {!loading && <DashboardCharts data={chartData} />}

                {/* Recent Activity */}
                <div className="mtx-card" style={{ padding: '2.5rem' }}>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <span style={{ fontSize: '1.2rem' }}>🔔</span> {t('admin_dashboard.activity.title')}
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
                        {renderActivity()}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;
