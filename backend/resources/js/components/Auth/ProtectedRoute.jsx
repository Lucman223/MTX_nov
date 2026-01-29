import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/**
 * ProtectedRoute Component
 *
 * [ES] Componente de orden superior para proteger rutas según el estado de autenticación y rol del usuario.
 *      Redirige a /login si no está autenticado o a / si el rol no tiene permisos.
 *
 * [FR] Composant d'ordre supérieur pour protéger les routes en fonction de l'état d'authentification et du rôle de l'utilisateur.
 *      Redirige vers /login s'il n'est pas authentifié ou vers / si le rôle n'a pas les permissions.
 */
const ProtectedRoute = ({ allowedRoles }) => {
    const { isAuthenticated, user, loading } = useAuth();


    if (loading) {
        return <div>Cargando autenticación...</div>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && user && !allowedRoles.includes(user.rol)) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
