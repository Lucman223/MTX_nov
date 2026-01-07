import React from 'react';
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';

const DashboardCharts = ({ data }) => {
    if (!data || data.length === 0) {
        return <div className="p-4 text-center text-gray-500">No hay datos históricos disponibles</div>;
    }

    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>

            {/* Ingresos Chart */}
            <div style={{
                backgroundColor: 'white',
                padding: '1.5rem',
                borderRadius: '1rem',
                boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
                border: '1px solid #e5e7eb'
            }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '1rem', color: '#1f2937' }}>
                    📈 Ingresos (Últimos 30 días)
                </h3>
                <div style={{ height: '300px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                            <XAxis
                                dataKey="date"
                                tick={{ fontSize: 12, fill: '#6b7280' }}
                                axisLine={false}
                                tickLine={false}
                            />
                            <YAxis
                                tick={{ fontSize: 12, fill: '#6b7280' }}
                                axisLine={false}
                                tickLine={false}
                                tickFormatter={(value) => `${value} CFA`}
                            />
                            <Tooltip
                                contentStyle={{ borderRadius: '0.5rem', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
                                formatter={(value) => [`${value} CFA`, 'Ingresos']}
                            />
                            <Line
                                type="monotone"
                                dataKey="ingresos"
                                stroke="#f59e0b"
                                strokeWidth={3}
                                dot={{ r: 4, fill: '#f59e0b', strokeWidth: 2, stroke: '#fff' }}
                                activeDot={{ r: 6 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Viajes Chart */}
            <div style={{
                backgroundColor: 'white',
                padding: '1.5rem',
                borderRadius: '1rem',
                boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
                border: '1px solid #e5e7eb'
            }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '1rem', color: '#1f2937' }}>
                    🚀 Viajes (Últimos 30 días)
                </h3>
                <div style={{ height: '300px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                            <XAxis
                                dataKey="date"
                                tick={{ fontSize: 12, fill: '#6b7280' }}
                                axisLine={false}
                                tickLine={false}
                            />
                            <YAxis
                                tick={{ fontSize: 12, fill: '#6b7280' }}
                                axisLine={false}
                                tickLine={false}
                            />
                            <Tooltip
                                cursor={{ fill: '#f3f4f6' }}
                                contentStyle={{ borderRadius: '0.5rem', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
                            />
                            <Bar
                                dataKey="viajes"
                                fill="#3b82f6"
                                radius={[4, 4, 0, 0]}
                                barSize={20}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default DashboardCharts;
