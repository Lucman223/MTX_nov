import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ allowedRoles }) => {
    const { isAuthenticated, user, loading } = useAuth();

    if (loading) {
        return <div>Cargando autenticación...</div>; // Or a spinner
    }

    if (!isAuthenticated) {
        // User not authenticated, redirect to login page
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && user && !allowedRoles.includes(user.rol)) {
        // User authenticated but not authorized, redirect to a forbidden page or home
        // For now, let's redirect to home
        return <Navigate to="/" replace />;
    }

    // User is authenticated and authorized
    return <Outlet />;
};

export default ProtectedRoute;
