import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import DashboardCharts from '../../components/Admin/DashboardCharts';

const AdminDashboard = () => {
    const { logout, user } = useAuth();
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

    useEffect(() => {
        fetchStatistics();
    }, []);

    const fetchStatistics = async () => {
        setLoading(true);
        try {
            const [statsRes, chartRes] = await Promise.all([
                axios.get('/api/admin/statistics'),
                axios.get('/api/admin/chart-data')
            ]);

            console.log('Admin Stats:', statsRes.data);
            setStats(statsRes.data);
            setChartData(chartRes.data);
        } catch (error) {
            console.error('Error fetching statistics:', error);
            // Optional: set dummy stats or error state
        } finally {
            setLoading(false);
        }
    };

    // ...

    // Recent Activity Render Logic
    const renderActivity = () => {
        if (!stats?.recentActivity) return <div style={{ color: '#6b7280', padding: '1rem' }}>No hay actividad reciente.</div>;

        // Ensure we have an array, even if backend returns object/map
        const activityList = Array.isArray(stats.recentActivity)
            ? stats.recentActivity
            : Object.values(stats.recentActivity);

        if (activityList.length === 0) return <div style={{ color: '#6b7280', padding: '1rem' }}>No hay actividad reciente.</div>;

        return activityList.map((activity, index) => (
            <div
                key={index}
                style={{
                    padding: '1rem',
                    borderLeft: `3px solid ${activity.color}`,
                    backgroundColor: 'white',
                    borderRadius: '0.5rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                }}
            >
                <span style={{ color: '#374151', fontWeight: '500' }}>{activity.text}</span>
                <span style={{ color: '#6b7280', fontSize: '0.875rem' }}>{activity.time}</span>
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
            title: 'Total Motoristas',
            value: stats.totalMotoristas,
            icon: '🏍️',
            color: colors.secondary,
            badge: stats.motoristasPendientes > 0 ? `${stats.motoristasPendientes} pendientes` : null
        },
        {
            title: 'Viajes Hoy',
            value: stats.viajesHoy,
            icon: '🚀',
            color: colors.primary,
            subtitle: `${stats.viajesTotales} totales`,
            onClick: () => navigate('/admin/viajes')
        },
        {
            title: 'Ingresos del Mes',
            value: `${Math.round(stats.ingresosMes).toLocaleString()} CFA`,
            icon: '💰',
            color: colors.accent,
            subtitle: 'Forfaits vendidos'
        },
        {
            title: 'Usuarios Activos',
            value: stats.usuariosActivos,
            icon: '👥',
            color: colors.purple,
            subtitle: `Rating: ${stats.ratingPromedio}⭐`
        }
    ] : [];

    const quickActions = [
        {
            title: 'Gestionar Motoristas',
            description: 'Aprobar, rechazar y gestionar motoristas',
            icon: '🏍️',
            color: colors.secondary,
            action: () => navigate('/admin/motoristas')
        },
        {
            title: 'Gestionar Clientes',
            description: 'Ver lista de usuarios registrados',
            icon: '👥',
            color: '#06b6d4', // Cyan
            action: () => navigate('/admin/clientes')
        },
        {
            title: 'Ver Forfaits',
            description: 'Administrar paquetes y precios',
            icon: '💳',
            color: colors.primary,
            action: () => navigate('/admin/forfaits')
        },
        {
            title: 'Reportes',
            description: 'Estadísticas y análisis',
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
        <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb', paddingBottom: isMobile ? '80px' : '0' }}>
            {/* Header */}
            <header style={{
                backgroundColor: 'white',
                padding: isMobile ? '1rem' : '1.25rem 2rem',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: `3px solid ${colors.purple}`,
                position: isMobile ? 'sticky' : 'static',
                top: 0,
                zIndex: 50
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <img src="/logo.png" alt="MotoTX" style={{ height: isMobile ? '2.5rem' : '3.5rem', objectFit: 'contain' }} />
                    <div>
                        <h1 style={{ fontSize: isMobile ? '1.1rem' : '1.5rem', fontWeight: 'bold', color: colors.purple, margin: 0 }}>
                            {isMobile ? 'Admin Panel' : 'MotoTX Admin v1.1'}
                        </h1>
                        <span style={{ fontSize: isMobile ? '0.75rem' : '0.875rem', color: '#6b7280' }}>
                            {user?.name || 'Admin'}
                        </span>
                    </div>
                </div>

                {/* Desktop Nav */}
                {!isMobile && (
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <button
                            onClick={handleLogout}
                            style={{
                                padding: '0.5rem 1.25rem',
                                backgroundColor: 'white',
                                color: colors.error,
                                border: `2px solid ${colors.error}`,
                                borderRadius: '0.5rem',
                                fontWeight: '600',
                                cursor: 'pointer',
                            }}
                        >
                            Cerrar Sesión
                        </button>
                    </div>
                )}
            </header>

            {/* Mobile Bottom Nav */}
            {isMobile && (
                <div style={{
                    position: 'fixed',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    backgroundColor: 'white',
                    borderTop: '1px solid #e5e7eb',
                    display: 'flex',
                    justifyContent: 'space-around',
                    padding: '0.75rem',
                    boxShadow: '0 -2px 10px rgba(0,0,0,0.05)',
                    zIndex: 100
                }}>
                    <button onClick={() => { }} style={{ background: 'none', border: 'none', color: colors.purple, display: 'flex', flexDirection: 'column', alignItems: 'center', fontSize: '0.75rem' }}>
                        <span style={{ fontSize: '1.25rem' }}>📊</span>
                        Stats
                    </button>
                    <button onClick={() => navigate('/admin/motoristas')} style={{ background: 'none', border: 'none', color: '#6b7280', display: 'flex', flexDirection: 'column', alignItems: 'center', fontSize: '0.75rem' }}>
                        <span style={{ fontSize: '1.25rem' }}>🏍️</span>
                        Motos
                    </button>
                    <button onClick={() => navigate('/admin/clientes')} style={{ background: 'none', border: 'none', color: '#6b7280', display: 'flex', flexDirection: 'column', alignItems: 'center', fontSize: '0.75rem' }}>
                        <span style={{ fontSize: '1.25rem' }}>👥</span>
                        Users
                    </button>
                    <button onClick={handleLogout} style={{ background: 'none', border: 'none', color: colors.error, display: 'flex', flexDirection: 'column', alignItems: 'center', fontSize: '0.75rem' }}>
                        <span style={{ fontSize: '1.25rem' }}>🚪</span>
                        Salir
                    </button>
                </div>
            )}

            {/* Main Content */}
            <main style={{ padding: isMobile ? '1rem' : '2rem', maxWidth: '1400px', margin: '0 auto' }}>

                {/* Welcome Section */}
                <div style={{ marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#111827', marginBottom: '0.5rem' }}>
                        Bienvenido, {user?.name || 'Admin'} 👋
                    </h2>
                    <p style={{ color: '#6b7280', fontSize: '1.05rem' }}>
                        Aquí está un resumen de la actividad de la plataforma
                    </p>
                </div>


                {/* Stats Grid */}
                {loading ? (
                    <div style={{
                        textAlign: 'center',
                        padding: '3rem',
                        color: '#6b7280',
                        backgroundColor: 'white',
                        borderRadius: '1rem',
                        marginBottom: '2.5rem'
                    }}>
                        Cargando estadísticas...
                    </div>
                ) : (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                        gap: '1.5rem',
                        marginBottom: '2.5rem'
                    }}>
                        {statsConfig.map((stat, index) => (
                            <div
                                key={index}
                                style={{
                                    backgroundColor: 'white',
                                    padding: '1.75rem',
                                    borderRadius: '1rem',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                                    border: '1px solid #e5e7eb',
                                    transition: 'all 0.2s',
                                    cursor: 'pointer'
                                }}
                                onMouseOver={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-4px)';
                                    e.currentTarget.style.boxShadow = `0 8px 20px ${stat.color}30`;
                                    e.currentTarget.style.borderColor = stat.color;
                                }}
                                onMouseOut={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)';
                                    e.currentTarget.style.borderColor = '#e5e7eb';
                                }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                                    <div style={{ fontSize: '0.875rem', color: '#6b7280', fontWeight: '600' }}>
                                        {stat.title}
                                    </div>
                                    <div style={{
                                        fontSize: '2rem',
                                        filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
                                    }}>
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
                                        background: `${colors.accent}20`,
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
                        Acciones Rápidas
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
                                style={{
                                    backgroundColor: 'white',
                                    padding: '2rem',
                                    borderRadius: '1rem',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                                    border: '1px solid #e5e7eb',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s'
                                }}
                                onMouseOver={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-6px)';
                                    e.currentTarget.style.boxShadow = `0 12px 24px ${action.color}30`;
                                    e.currentTarget.style.borderColor = action.color;
                                }}
                                onMouseOut={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)';
                                    e.currentTarget.style.borderColor = '#e5e7eb';
                                }}
                            >
                                <div style={{
                                    fontSize: '3rem',
                                    marginBottom: '1rem',
                                    filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))'
                                }}>
                                    {action.icon}
                                </div>
                                <h4 style={{
                                    fontSize: '1.25rem',
                                    fontWeight: 'bold',
                                    color: action.color,
                                    marginBottom: '0.5rem'
                                }}>
                                    {action.title}
                                </h4>
                                <p style={{ color: '#6b7280', fontSize: '0.95rem', lineHeight: 1.5 }}>
                                    {action.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Charts Section */}
                {!loading && <DashboardCharts data={chartData} />}

                {/* Recent Activity */}
                <div style={{
                    backgroundColor: 'white',
                    padding: '2rem',
                    borderRadius: '1rem',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                    border: '1px solid #e5e7eb'
                }}>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827', marginBottom: '1.5rem' }}>
                        Actividad Reciente
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {renderActivity()}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;
