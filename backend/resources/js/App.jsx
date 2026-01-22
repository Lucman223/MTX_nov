import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import axios from 'axios';
import { Toaster } from 'sonner';
import '../css/app.css';
import '../css/components.css';

import LandingPage from './pages/Public/LandingPage.jsx';
import LoginPage from './pages/Public/LoginPage.jsx';
import RegisterPage from './pages/Public/RegisterPage.jsx';
import PrivacyPolicy from './pages/Public/PrivacyPolicy.jsx';

import AdminLayout from './layouts/AdminLayout';
import AdminDashboard from './pages/Admin/AdminDashboard';
import MotoristasList from './pages/Admin/MotoristasList';
import AdminForfaits from './pages/Admin/Forfaits/AdminForfaits';
import AdminViajes from './pages/Admin/Viajes/AdminViajes';
import AdminReportes from './pages/Admin/Reports/AdminReportes';
import AdminClientes from './pages/Admin/Clientes/AdminClientes';

import ClienteDashboard from './pages/Cliente/ClienteDashboard.jsx';
import ClienteForfaits from './pages/Cliente/ClienteForfaits.jsx';
import ClienteHistory from './pages/Cliente/ClienteHistory.jsx';
import ClienteProfile from './pages/Cliente/ClienteProfile.jsx';
import ClientActiveTrip from './pages/Cliente/ClientActiveTrip.jsx';
import MotoristaDashboard from './pages/Motorista/MotoristaDashboard.jsx';
import MotoristaHistory from './pages/Motorista/MotoristaHistory.jsx';
import MotoristaProfile from './pages/Motorista/MotoristaProfile.jsx';
import MotoristaTransactions from './pages/Motorista/MotoristaTransactions.jsx';
import DriverActiveTrip from './pages/Motorista/DriverActiveTrip.jsx';
import SuscripcionesMotorista from './pages/Motorista/SuscripcionesMotorista.jsx';

import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';
import { AccessibilityProvider } from './context/AccessibilityContext';
import { HelmetProvider } from 'react-helmet-async';

/**
 * App Component
 *
 * [ES] Punto de entrada principal de la aplicación React.
 *      Configura el enrutamiento global (Router), el proveedor de autenticación (AuthProvider) y el sistema de manejo de errores.
 *
 * [FR] Point d'entrée principal de l'application React.
 *      Configure le routage global (Router), le fournisseur d'authentification (AuthProvider) et le système de gestion des erreurs.
 */
function App() {
    return (
        <HelmetProvider>
            <Router>
                <AccessibilityProvider>
                    <AuthProvider>
                        <ErrorBoundary>
                            <Toaster richColors position="top-center" />
                            <AppContent />
                        </ErrorBoundary>
                    </AuthProvider>
                </AccessibilityProvider>
            </Router>
        </HelmetProvider>
    );
}

import AccessibilityToggle from './components/Common/AccessibilityToggle';

function AppContent() {
    const { loading } = useAuth();

    if (loading) {
        return <div>Cargando...</div>;
    }

    return (
        <>
            <AccessibilityToggle />
            <Routes>
                {/* Public Routes */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/privacy" element={<PrivacyPolicy />} />

                {/* Protected Admin Routes with Layout */}
                <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                    <Route path="/admin" element={<AdminLayout />}>
                        <Route index element={<AdminDashboard />} />
                        <Route path="motoristas" element={<MotoristasList />} />
                        <Route path="forfaits" element={<AdminForfaits />} />
                        <Route path="viajes" element={<AdminViajes />} />
                        <Route path="clientes" element={<AdminClientes />} />
                        <Route path="reportes" element={<AdminReportes />} />
                    </Route>
                </Route>

                {/* Protected Cliente Routes */}
                <Route element={<ProtectedRoute allowedRoles={['cliente']} />}>
                    <Route path="/cliente" element={<ClienteDashboard />} />
                    <Route path="/cliente/historial" element={<ClienteHistory />} />
                    <Route path="/cliente/forfaits" element={<ClienteForfaits />} />
                    <Route path="/cliente/perfil" element={<ClienteProfile />} />
                    <Route path="/cliente/viaje-actual" element={<ClientActiveTrip />} />
                </Route>

                {/* Protected Motorista Routes */}
                <Route element={<ProtectedRoute allowedRoles={['motorista']} />}>
                    <Route path="/motorista" element={<MotoristaDashboard />} />
                    <Route path="/motorista/historial" element={<MotoristaHistory />} />
                    <Route path="/motorista/finanzas" element={<MotoristaTransactions />} />
                    <Route path="/motorista/perfil" element={<MotoristaProfile />} />
                    <Route path="/motorista/viaje-actual" element={<DriverActiveTrip />} />
                    <Route path="/motorista/suscripciones" element={<SuscripcionesMotorista />} />
                </Route>

                {/* Fallback for unmatched routes */}
                <Route path="*" element={<div>404 Not Found</div>} />
            </Routes>
        </>
    );
}

export default App;
