import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import axios from 'axios';

import HomePage from './pages/Public/HomePage.jsx';
import LoginPage from './pages/Public/LoginPage.jsx';
import RegisterPage from './pages/Public/RegisterPage.jsx';

import AdminLayout from './layouts/AdminLayout';
import AdminDashboard from './pages/Admin/AdminDashboard';
import MotoristasList from './pages/Admin/MotoristasList';

import ClienteDashboard from './pages/Cliente/ClienteDashboard.jsx';
import Forfaits from './pages/Cliente/Forfaits.jsx';
import MotoristaDashboard from './pages/Motorista/MotoristaDashboard.jsx';

import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';

// axios.defaults.baseURL = '/api'; // Comentado para evitar doble prefijo si ya se usa /api en las llamadas

function App() {
    return (
        <Router>
            <AuthProvider>
                <ErrorBoundary>
                    <AppContent />
                </ErrorBoundary>
            </AuthProvider>
        </Router>
    );
}

function AppContent() {
    const { loading } = useAuth();

    if (loading) {
        return <div>Cargando...</div>;
    }

    return (
        <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Protected Admin Routes with Layout */}
            <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                <Route path="/admin" element={<AdminLayout />}>
                    <Route index element={<AdminDashboard />} />
                    <Route path="motoristas" element={<MotoristasList />} />
                </Route>
            </Route>

            {/* Protected Cliente Routes */}
            <Route element={<ProtectedRoute allowedRoles={['cliente']} />}>
                <Route path="/cliente" element={<ClienteDashboard />} />
                <Route path="/cliente/forfaits" element={<Forfaits />} />
            </Route>

            {/* Protected Motorista Routes */}
            <Route element={<ProtectedRoute allowedRoles={['motorista']} />}>
                <Route path="/motorista" element={<MotoristaDashboard />} />
            </Route>

            {/* Fallback for unmatched routes - could be a 404 page */}
            <Route path="*" element={<div>404 Not Found</div>} />
        </Routes>
    );
}


export default App;
