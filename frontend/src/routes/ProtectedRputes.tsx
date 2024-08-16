// src/routes/ProtectedRoute.tsx

import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import { RootState } from '../redux/store';

const ProtectedRoute = ({ isAdminRoute = false }: { isAdminRoute?: boolean }) => {
  const { isAuthenticated, isAdmin } = useSelector((state: RootState) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to={isAdminRoute ? "/adminLogin" : "/login"} />;;
  }

  if (isAdminRoute && !isAdmin) {
    return <Navigate to="/" />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
