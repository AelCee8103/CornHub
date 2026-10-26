import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('user');
        return savedUser ? JSON.parse(savedUser) : null;
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const response = await api.get('/user');
                    setUser(response.data.user);
                    localStorage.setItem('user', JSON.stringify(response.data.user));
                } catch {
                    logout();
                }
            }
            setLoading(false);
        };

        checkAuth();
    }, []);

    const login = async (email, password) => {
        const response = await api.post('/login', { email, password });
        const { user, access_token } = response.data;
        localStorage.setItem('token', access_token);
        localStorage.setItem('user', JSON.stringify(user));
        setUser(user);
        return response.data;
    };

    const register = async (name, email, password, password_confirmation) => {
        const response = await api.post('/register', {
            name,
            email,
            password,
            password_confirmation,
        });
        const { user, access_token } = response.data;
        localStorage.setItem('token', access_token);
        localStorage.setItem('user', JSON.stringify(user));
        setUser(user);
        return response.data;
    };

    const logout = async () => {
        try {
            await api.post('/logout');
        } catch {
            // Ignore network errors on logout
        } finally {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setUser(null);
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout, isAuthenticated: !!user }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};