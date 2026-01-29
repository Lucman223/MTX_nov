import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { Card, Button, Badge } from '../../../components/Common/UIComponents';
import DashboardCharts from '../../../components/Admin/DashboardCharts';
import { toast } from 'sonner';

const AdminReportes = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [stats, setStats] = useState(null);
    const [chartData, setChartData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const [statsRes, chartRes] = await Promise.all([
                    axios.get('/api/admin/statistics'),
                    axios.get('/api/admin/chart-data')
                ]);
                setStats(statsRes.data);
                setChartData(chartRes.data);
            } catch (err) {
                toast.error(t('common.error'));
            } finally {
                setLoading(false);
            }
        };
        fetchReports();
    }, []);

    if (loading) return <div className="text-center p-20">{t('common.loading')}</div>;

    return (
        <div className="main-content-centered" style={{ minHeight: '100vh', paddingBottom: '3rem' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#111827' }}>
                        📊 {t('admin_dashboard.actions.reports')}
                    </h1>
                    <Button onClick={() => navigate('/admin')} variant="outline">
                        {t('common.back')}
                    </Button>
                </div>

                {/* KPIs Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
                    <Card style={{ borderLeft: '5px solid #2563eb' }}>
                        <div style={{ color: '#6b7280', fontSize: '0.875rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{t('admin_dashboard.stats.trips_total')}</div>
                        <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#111827', marginTop: '0.5rem' }}>{stats?.viajesTotales || 0}</div>
                        <div style={{ fontSize: '0.875rem', color: '#10b981', fontWeight: '600', marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            <span style={{ fontSize: '1.1rem' }}>↑</span> 12% <span style={{ color: '#6b7280', fontWeight: 'normal' }}>{t('admin_dashboard.stats.vs_last_month')}</span>
                        </div>
                    </Card>
                    <Card style={{ borderLeft: '5px solid #f59e0b' }}>
                        <div style={{ color: '#6b7280', fontSize: '0.875rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{t('admin_dashboard.stats.income')}</div>
                        <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#111827', marginTop: '0.5rem' }}>{stats?.ingresosMes?.toLocaleString() || 0} CFA</div>
                        <div style={{ fontSize: '0.875rem', color: '#10b981', fontWeight: '600', marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            <span style={{ fontSize: '1.1rem' }}>↑</span> 8% <span style={{ color: '#6b7280', fontWeight: 'normal' }}>{t('admin_dashboard.stats.vs_last_month')}</span>
                        </div>
                    </Card>
                    <Card style={{ borderLeft: '5px solid #7c3aed' }}>
                        <div style={{ color: '#6b7280', fontSize: '0.875rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{t('admin_dashboard.stats.active_users')}</div>
                        <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#111827', marginTop: '0.5rem' }}>{stats?.usuariosActivos || 0}</div>
                    </Card>
                    <Card style={{ borderLeft: '5px solid #f59e0b' }}>
                        <div style={{ color: '#6b7280', fontSize: '0.875rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{t('admin_dashboard.stats.average_rating')}</div>
                        <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#f59e0b', marginTop: '0.5rem' }}>★ {stats?.ratingPromedio || 0}</div>
                    </Card>
                </div>

                {/* Charts Section */}
                <div style={{ marginBottom: '2.5rem' }}>
                    <DashboardCharts data={chartData} />
                </div>

                {/* Detailed States Table */}
                <Card>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>{t('admin_dashboard.stats.distribution')}</h3>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                        {Object.entries(stats?.viajesPorEstado || {}).map(([estado, total]) => (
                            <div key={estado} style={{ padding: '1rem', background: '#f3f4f6', borderRadius: '0.5rem', flex: 1, minWidth: '150px' }}>
                                <div style={{ textTransform: 'capitalize', fontSize: '0.875rem', color: '#6b7280' }}>{t(`status.${estado}`)}</div>
                                <div style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>{total}</div>
                            </div>
                        ))}
                    </div>
                </Card>

                <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                    <Button disabled variant="ghost" style={{ opacity: 0.6 }}>
                        📥 {t('admin_dashboard.actions.export_pdf')} {t('admin_dashboard.actions.coming_soon')}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default AdminReportes;
