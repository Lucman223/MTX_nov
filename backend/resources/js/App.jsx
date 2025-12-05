import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import axios from 'axios';

import HomePage from './pages/Public/HomePage.jsx';
import LoginPage from './pages/Public/LoginPage.jsx';
import RegisterPage from './pages/Public/RegisterPage.jsx';

import AdminDashboard from './pages/Admin/AdminDashboard.jsx';
import ClienteDashboard from './pages/Cliente/ClienteDashboard.jsx';
import MotoristaDashboard from './pages/Motorista/MotoristaDashboard.jsx';

import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/Auth/ProtectedRoute';

// Set default base URL for Axios
axios.defaults.baseURL = '/api';

function App() {
    return (
        <Router>
            <AuthProvider>
                <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<HomePage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />

                    {/* Protected Admin Routes */}
                    <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                        <Route path="/admin" element={<AdminDashboard />} />
                    </Route>

                    {/* Protected Cliente Routes */}
                    <Route element={<ProtectedRoute allowedRoles={['cliente']} />}>
                        <Route path="/cliente" element={<ClienteDashboard />} />
                    </Route>

                    {/* Protected Motorista Routes */}
                    <Route element={<ProtectedRoute allowedRoles={['motorista']} />}>
                        <Route path="/motorista" element={<MotoristaDashboard />} />
                    </Route>

                    {/* Fallback for unmatched routes - could be a 404 page */}
                    <Route path="*" element={<div>404 Not Found</div>} />
                </Routes>
            </AuthProvider>
        </Router>
    );
}

export default App;
