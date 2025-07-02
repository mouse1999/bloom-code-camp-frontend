// This file defines the AuthContext for managing user authentication state in a React application.
//                       The parent route '/reviewer' is protected. If the user is authenticated
import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        try {
            const storedToken = localStorage.getItem('jwt token');
            const storedRolesString = localStorage.getItem('userRoles');
            
            let roles = [];
            if (storedRolesString) {
                try {
                    roles = JSON.parse(storedRolesString);
                    if (!Array.isArray(roles)) {
                        roles = [];
                    }
                } catch (parseError) {
                    roles = [];
                }
            }

            if (storedToken) {
                return { token: storedToken, roles: roles };
            }
        } catch (error) {}
        return null;
    });

    const login = (token, roles) => {
        if (!Array.isArray(roles)) {
            roles = []; 
        }
        localStorage.setItem('jwt token', token);
        localStorage.setItem('userRoles', JSON.stringify(roles)); 
        setUser({ token, roles });
    };

    const logout = () => {
        localStorage.removeItem('jwt token');
        localStorage.removeItem('userRoles');
        setUser(null);
    };

    useEffect(() => {
        const validateToken = async () => {
            if (!user || !user.token) return;
            try {
                const response = await axios.get('https://bloomcamp.onrender.com/api/auth/validate', {
                    headers: {
                        'Authorization': `Bearer ${user.token}`
                    },
                    withCredentials: true
                });
            } catch (err) {
                logout();
            }
        };

        validateToken();
        const interval = setInterval(validateToken, 0.4 * 60 * 1000);
        return () => clearInterval(interval);
    }, [user]);

    const value = {
        user,
        isAuthenticated: !!user,
        userRoles: user ? user.roles : [],
        login, 
        logout 
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};