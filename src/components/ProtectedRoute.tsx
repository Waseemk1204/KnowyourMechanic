import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth, UserRole } from '../context/AuthContext';
interface ProtectedRouteProps {
  children: React.ReactNode;
  role?: UserRole;
}
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  role
}) => {
  const {
    isAuthenticated,
    user
  } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }
  if (role && user?.role !== role) {
    // Redirect to appropriate dashboard if authenticated but wrong role
    if (user?.role === 'customer') {
      return <Navigate to="/customer/explore" replace />;
    } else if (user?.role === 'garage') {
      return <Navigate to="/garage/dashboard" replace />;
    } else {
      return <Navigate to="/" replace />;
    }
  }
  return <>{children}</>;
};