// ProtectedRoute.js
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './AuthContext';

/**
 * ProtectedRoute Component
 * Renders the children component if the user is authenticated and has one of the required roles.
 * Otherwise, redirects to /login or /unauthorized.
 *
 * @param {Array<string>} allowedRoles - An array of roles that are allowed to access this route (e.g., ['learner', 'reviewer']).
 * @param {React.Component} children - The component(s) to render if access is granted.
 */
const ProtectedRoute = ({ allowedRoles, children }) => {
    const { isAuthenticated, userRoles } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // If allowedRoles is provided and user does not have any of the allowed roles, redirect to unauthorized
    if (allowedRoles && !userRoles.some(role => allowedRoles.includes(role))) {
        return <Navigate to="/unauthorized" replace />;
    }

    return children ? children : <Outlet />;
};

export default ProtectedRoute;