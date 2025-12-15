import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../components/Common/LanguageSwitcher';
import { useAuth } from '../context/AuthContext';

const AdminLayout = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const { t } = useTranslation();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <aside className="w-64 bg-slate-900 text-white flex flex-col">
                <div className="p-6 text-2xl font-bold border-b border-gray-700 flex items-center gap-3">
                    <img src="/logo_clean.png" alt="MotoTX" className="h-8 w-auto object-contain bg-white rounded-full p-1" />
                    {t('nav.admin_title')}
                </div>
                <nav className="flex-1 p-4 space-y-2">
                    <Link to="/admin" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-slate-700 hover:text-white">
                        {t('nav.dashboard')}
                    </Link>
                    <Link to="/admin/motoristas" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-slate-700 hover:text-white">
                        {t('nav.drivers')}
                    </Link>
                    <Link to="/admin/viajes" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-slate-700 hover:text-white">
                        {t('nav.trips')}
                    </Link>
                    <Link to="/admin/forfaits" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-slate-700 hover:text-white">
                        {t('nav.forfaits')}
                    </Link>
                    <Link to="/admin/clientes" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-slate-700 hover:text-white">
                        {t('nav.clients')}
                    </Link>
                    <Link to="/admin/reportes" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-slate-700 hover:text-white">
                        {t('nav.reports')}
                    </Link>
                </nav>
                <div className="p-4 border-t border-gray-700">
                    <button
                        onClick={handleLogout}
                        className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                    >
                        {t('common.logout')}
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="flex justify-between items-center py-4 px-6 bg-white shadow-md">
                    <h1 className="text-xl font-semibold text-gray-800">{t('nav.admin_panel')}</h1>
                    <div className="flex items-center gap-4">
                        <LanguageSwitcher />
                        <div className="flex items-center">
                            <span className="text-gray-600 mr-4">{t('nav.admin_role')}</span>
                            <div className="h-8 w-8 bg-indigo-500 rounded-full flex items-center justify-center text-white font-bold">
                                A
                            </div>
                        </div>
                    </div>
                </header>
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
