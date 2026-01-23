import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

/**
 * AuthContext
 *
 * [ES] Proporciona estado de autenticación global a toda la aplicación usando React Context.
 *      Gestiona verificaciones de usuario, inicio de sesión, cierre de sesión y persistencia de tokens vía localStorage.
 *
 * [FR] Fournit l'état d'authentification global à toute l'application en utilisant React Context.
 *      Gère les vérifications des utilisateurs, la connexion, la déconnexion et la persistance des jetons via localStorage.
 */
const AuthContext = createContext({});

/**
 * AuthProvider Component
 *
 * [ES] Envuelve la aplicación para proporcionar estado de sesión de usuario.
 * [FR] Enveloppe l'application pour fournir l'état de session utilisateur.
 *
 * @component
 * @prop {React.ReactNode} children - The child components that need access to auth state.
 */
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    /**
     * [ES] Efecto para verificar un token válido existente al montar la aplicación.
     *      Establece los headers por defecto de axios si reside un token en localStorage.
     *
     * [FR] Effet pour vérifier un jeton valide existant au montage de l'application.
     *      Définit les en-têtes axios par défaut si un jeton réside dans localStorage.
     */
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const token = localStorage.getItem('token');
                if (token) {
                    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                    // Verify token with backend
                    const response = await axios.get('/api/auth/profile');
                    setUser(response.data.user);
                    setIsAuthenticated(true);
                }
            } catch (error) {
                console.error('Error verifying token:', error);

                // Only logout if it's strictly an Auth error (401 - Unauthorized)
                if (error.response && error.response.status === 401) {
                    localStorage.removeItem('token');
                    delete axios.defaults.headers.common['Authorization'];
                    setUser(null);
                    setIsAuthenticated(false);
                }
                // If it's a network error (no response), keep the user logged in locally
            } finally {
                setLoading(false);
            }
        };
        checkAuth();
    }, []);

    /**
     * [ES] Realiza la acción de inicio de sesión.
     *      Envía credenciales al backend, guarda el JWT retornado y actualiza el estado.
     *
     * [FR] Effectue l'action de connexion.
     *      Envoie les identifiants au backend, enregistre le JWT retourné et met à jour l'état.
     *
     * @param {string} email - User email.
     * @param {string} password - User password.
     * @returns {Promise<boolean>} Resolves to true on success.
     * @throws {Error} Throws invalid credentials error.
     */
    const login = async (email, password) => {
        setLoading(true);
        try {
            const response = await axios.post('/api/auth/login', { email, password });
            const { access_token, user } = response.data;
            localStorage.setItem('token', access_token);
            axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
            setUser(user);
            setIsAuthenticated(true);
            return true;
        } catch (error) {
            console.error('Login failed:', error);
            throw error; // Throw original error for debugging in Login page
        } finally {
            setLoading(false);
        }
    };

    /**
     * [ES] Cierra la sesión del usuario.
     *      Limpia el almacenamiento local y reinicia el estado global.
     *
     * [FR] Déconnecte l'utilisateur.
     *      Efface le stockage local et réinitialise l'état global.
     */
    const logout = () => {
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
        setUser(null);
        setIsAuthenticated(false);
    };

    /**
     * [ES] Refresca los datos del perfil de usuario desde el backend sin volver a iniciar sesión.
     *      Útil para actualizar saldo o estado de suscripción.
     *
     * [FR] Actualise les données de profil utilisateur depuis le backend sans se reconnecter.
     *      Utile pour mettre à jour le solde ou le statut d'abonnement.
     */
    const refreshUser = async () => {
        try {
            const response = await axios.get('/api/auth/profile');
            setUser(response.data.user);
        } catch (error) {
            console.error('Error refreshing user profile:', error);
        }
    };

    /**
     * [ES] Registra un nuevo usuario.
     *      Envía los datos al backend y realiza el login automático.
     *
     * @param {Object} data - User data (name, email, password, password_confirmation, rol, telefono).
     */
    const register = async (data) => {
        setLoading(true);
        try {
            await axios.post('/api/auth/register', data);
            // After successful registration, login automatically
            return await login(data.email, data.password);
        } catch (error) {
            console.error('Registration failed:', error);
            throw new Error(error.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, loading, login, logout, register, refreshUser }}>
            {children}
        </AuthContext.Provider>
    );
};

/**
 * Custom hook to access the AuthContext.
 * @returns {Object} { user, isAuthenticated, loading, login, logout, refreshUser }
 */
export const useAuth = () => useContext(AuthContext);
