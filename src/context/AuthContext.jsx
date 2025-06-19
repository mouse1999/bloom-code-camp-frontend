// This file defines the AuthContext for managing user authentication state in a React application.
//                       The parent route '/reviewer' is protected. If the user is authenticated
import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

// Create the AuthContext
const AuthContext = createContext(null);

// AuthProvider component to wrap your application
export const AuthProvider = ({ children }) => {
    // Initialize user state from localStorage
    // It will now attempt to parse roles as an array from JSON string
    const [user, setUser] = useState(() => {
        try {
            const storedToken = localStorage.getItem('jwt token');
            const storedRolesString = localStorage.getItem('userRoles'); // Renamed to 'userRoles'
            
            let roles = [];
            if (storedRolesString) {
                try {
                    // Attempt to parse the stored string as a JSON array
                    roles = JSON.parse(storedRolesString);
                    // Ensure it's actually an array
                    if (!Array.isArray(roles)) {
                        console.warn("Stored userRoles is not an array, resetting to empty.");
                        roles = [];
                    }
                } catch (parseError) {
                    console.error("Error parsing stored userRoles from localStorage:", parseError);
                    roles = []; // Reset to empty array if parsing fails
                }
            }

            if (storedToken) { // Only return user if a token exists
                return { token: storedToken, roles: roles }; // 'role' is now 'roles' (an array)
            }
        } catch (error) {
            console.error("Failed to read auth state from localStorage:", error);
        }
        return null; // No user logged in or error reading storage
    });

    // Function to log in a user
    // Now expects 'roles' as an array of strings
    const login = (token, roles) => {
        if (!Array.isArray(roles)) {
            console.error("Login 'roles' argument must be an array.", roles);
            // Optionally, handle this error more gracefully or default to empty array
            roles = []; 
        }
        
        localStorage.setItem('jwt token', token);
        // Store the roles array as a JSON string
        localStorage.setItem('userRoles', JSON.stringify(roles)); 
        setUser({ token, roles }); // Update state with the roles array
    };

    // Function to log out a user
    const logout = () => {
        localStorage.removeItem('jwt token');
        localStorage.removeItem('userRoles'); // Clear the 'userRoles' item
        setUser(null);
    };
    useEffect(() => {
        const validateToken = async () => {
            if (!user || !user.token) return;

            try {
                // Replace with your actual token validation endpoint
                const response = await axios.get('http://localhost:8081/api/users/validate', {
                    headers: {
                        'Authorization': `Bearer ${user.token}` // Send the token in the Authorization header
                    },
                    withCredentials: true // Important if  backend uses sessions/cookies alongside JWT
                });

            console.log("Token validation response:", response.data);
                // Optionally, handle response if you want to update user info
            } catch (err) {
                // If the token is invalid or expired, log out the user
                logout();
            }
        };

        validateToken();
        // Optionally, you can set up an interval to check periodically
        const interval = setInterval(validateToken, 0.4 * 60 * 1000); // Check every 0.4 minutes
        return () => clearInterval(interval); // Cleanup on unmount

    }, [user]);

    // The value provided by the context to its consumers
    const value = {
        user, // The current user object { token, roles: ['role1', 'role2'] } or null
        isAuthenticated: !!user, // Convenience boolean
        userRoles: user ? user.roles : [], // Array of roles, or empty if not authenticated
        login, 
        logout 
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to easily consume the AuthContext
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
