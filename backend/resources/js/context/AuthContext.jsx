import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

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
                localStorage.removeItem('token');
                delete axios.defaults.headers.common['Authorization'];
                setUser(null);
                setIsAuthenticated(false);
            } finally {
                setLoading(false);
            }
        };
        checkAuth();
    }, []);

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
            // Optionally, handle specific error messages from backend
            throw new Error(error.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
        setUser(null);
        setIsAuthenticated(false);
    };

    const refreshUser = async () => {
        try {
            const response = await axios.get('/api/auth/profile');
            setUser(response.data.user);
        } catch (error) {
            console.error('Error refreshing user profile:', error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, loading, login, logout, refreshUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
