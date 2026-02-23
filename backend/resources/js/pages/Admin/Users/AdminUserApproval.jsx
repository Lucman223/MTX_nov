import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { Card, Button, Badge } from '../../../components/Common/UIComponents';
import { Search, UserCheck, UserX, Clock } from 'lucide-react';

const AdminUserApproval = () => {
    const { t } = useTranslation();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchPendingUsers();
    }, []);

    const fetchPendingUsers = async () => {
        try {
            const response = await axios.get('/api/admin/users/pending');
            setUsers(response.data);
        } catch (error) {
            toast.error(t('common.error_loading_data'));
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (userId, status) => {
        try {
            await axios.patch(`/api/admin/users/${userId}/status`, { status });
            toast.success(t(`admin_dashboard.users.status_updated_${status}`));
            setUsers(users.filter(u => u.id !== userId));
        } catch (error) {
            toast.error(t('common.error_updating_status'));
        }
    };

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="text-center p-20">{t('common.loading')}</div>;

    return (
        <div className="admin-approval-page">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">{t('admin_dashboard.users.pending_title')}</h1>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                        type="text"
                        placeholder={t('common.search')}
                        className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <Card className="overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="px-6 py-4 font-semibold text-sm text-gray-600 uppercase">{t('common.name')}</th>
                                <th className="px-6 py-4 font-semibold text-sm text-gray-600 uppercase">{t('common.email')}</th>
                                <th className="px-6 py-4 font-semibold text-sm text-gray-600 uppercase">{t('common.role')}</th>
                                <th className="px-6 py-4 font-semibold text-sm text-gray-600 uppercase">{t('common.date')}</th>
                                <th className="px-6 py-4 font-semibold text-sm text-gray-600 uppercase text-right">{t('common.actions')}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredUsers.length > 0 ? filteredUsers.map(user => (
                                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-gray-900">{user.name}</td>
                                    <td className="px-6 py-4 text-gray-600">{user.email}</td>
                                    <td className="px-6 py-4">
                                        <Badge variant={user.rol === 'admin' ? 'danger' : user.rol === 'motorista' ? 'secondary' : 'primary'}>
                                            {t(`roles.${user.rol}`)}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-4 text-gray-500 text-sm">
                                        {new Date(user.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                variant="primary"
                                                size="sm"
                                                onClick={() => handleUpdateStatus(user.id, 'aprobado')}
                                                title={t('common.approve')}
                                            >
                                                <UserCheck className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                variant="danger"
                                                size="sm"
                                                onClick={() => handleUpdateStatus(user.id, 'rechazado')}
                                                title={t('common.reject')}
                                            >
                                                <UserX className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="5" className="px-6 py-10 text-center text-gray-500">
                                        <div className="flex flex-col items-center gap-2">
                                            <Clock className="w-10 h-10 text-gray-300" />
                                            <p>{t('admin_dashboard.users.no_pending')}</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};

export default AdminUserApproval;
