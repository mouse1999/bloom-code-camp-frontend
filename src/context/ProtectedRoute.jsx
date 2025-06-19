// ProtectedRoute.js
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './AuthContext'; // Import your AuthContext

/**
 * ProtectedRoute Component
 * Renders the children component if the user is authenticated and has one of the required roles.
 * Otherwise, redirects to /login or /unauthorized.
 *
 * @param {Array<string>} allowedRoles - An array of roles that are allowed to access this route (e.g., ['learner', 'reviewer']).
 * @param {React.Component} children - The component(s) to render if access is granted.
 */
const ProtectedRoute = ({ allowedRoles, children }) => {
    const { isAuthenticated, userRoles } = useAuth(); // Get auth status and user role from context

    if (!isAuthenticated) {
        // User is not authenticated, redirect to login page
        
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && allowedRoles.includes(userRoles)) {
        console.log(userRoles);
        // User is authenticated but does not have the required role, redirect to unauthorized page
        return <Navigate to="/unauthorized" replace />;
    }

    // User is authenticated and has the required role, render the children component
    // Outlet is used when you have nested routes, otherwise, just render 'children'
    return children ? children : <Outlet />;
};

export default ProtectedRoute;