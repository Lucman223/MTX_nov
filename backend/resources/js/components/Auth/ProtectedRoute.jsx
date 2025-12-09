import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ allowedRoles }) => {
    const { isAuthenticated, user, loading } = useAuth();

    console.log('ProtectedRoute Debug:', { isAuthenticated, user, loading, allowedRoles });

    if (loading) {
        return <div>Cargando autenticación...</div>;
    }

    if (!isAuthenticated) {
        console.log('Redirecting to login: Not authenticated');
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && user && !allowedRoles.includes(user.rol)) {
        console.log('Redirecting to home: Not authorized', { role: user.rol });
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
