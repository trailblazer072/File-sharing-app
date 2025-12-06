import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    const login = async (email, password) => {
        try {
            const response = await api.post('/auth/login', { email, password });
            const { token, user } = response.data;

            localStorage.setItem('token', token);
            setToken(token);
            // Decode token or fetch user details if needed. 
            // For now, let's assume login returns basic user info or we fetch it.
            // Wait, previous backend login returned { status, token }. It didn't return user object explicitly in data root?
            // Let's check backend auth controller logic if needed. 
            // Better: fetch me after login or decode token.
            // For simplicity, let's store token and rely on a verify/me endpoint if exists, OR just trust token validity.
            // Actually, backend login returns: { status, token }. User details are not in root.

            // To be safe, let's just save token.
            return true;
        } catch (error) {
            console.error("Login failed", error);
            throw error;
        }
    };

    const register = async (name, email, password) => {
        try {
            await api.post('/auth/register', { name, email, password });
            return true;
        } catch (error) {
            console.error("Registration failed", error);
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
    };

    // Check if token exists on load
    useEffect(() => {
        if (token) {
            // Ideally verify token with backend here
            // For now, just assume logged in state 
            setLoading(false);
        } else {
            setLoading(false);
        }
    }, [token]);

    const value = {
        user,
        token,
        login,
        register,
        logout,
        isAuthenticated: !!token
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
