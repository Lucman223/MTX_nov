import React from 'react';

const StatCard = ({ title, value, color }) => (
    <div className={`p-6 bg-white rounded-lg shadow-md border-l-4 ${color}`}>
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{title}</h3>
        <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>
    </div>
);

const AdminDashboard = () => {
    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Resumen General</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard title="Usuarios Totales" value="1,245" color="border-indigo-500" />
                <StatCard title="Motoristas Activos" value="58" color="border-green-500" />
                <StatCard title="Viajes Hoy" value="234" color="border-yellow-500" />
                <StatCard title="Ingresos Mes" value="2.5M CFA" color="border-blue-500" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Actividad Reciente</h3>
                    <div className="text-gray-500 text-sm">
                        <p className="py-2 border-b">Nuevo motorista registrado: Cheick Diabaté</p>
                        <p className="py-2 border-b">Viaje completado #4523 - 2500 CFA</p>
                        <p className="py-2 border-b">Forfait comprado por Usuario #892</p>
                        <p className="py-2 py-0">Solicitud de reembolso #22</p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Estado del Sistema</h3>
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-600">Servidor API</span>
                        <span className="px-2 py-1 text-xs font-semibold text-green-800 bg-green-100 rounded-full">Operativo</span>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-600">Base de Datos</span>
                        <span className="px-2 py-1 text-xs font-semibold text-green-800 bg-green-100 rounded-full">Operativo</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-gray-600">Servicios de Mapa</span>
                        <span className="px-2 py-1 text-xs font-semibold text-yellow-800 bg-yellow-100 rounded-full">Lento</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
