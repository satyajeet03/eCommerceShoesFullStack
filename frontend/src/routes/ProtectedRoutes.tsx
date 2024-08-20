
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  console.log("ProtectedRoute - isAuthenticated:", isAuthenticated);

  const token = localStorage.getItem("token");
  console.log(token);

  if (!token || !isAuthenticated) {
    console.log("Redirecting to login because user is not authenticated");
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
