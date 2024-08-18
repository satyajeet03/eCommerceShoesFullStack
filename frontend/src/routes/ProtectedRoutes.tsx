// // src/routes/ProtectedRoute.tsx
// import React from 'react';
// import { Navigate, Outlet } from 'react-router-dom';
// import { useSelector } from 'react-redux';
// import { RootState } from '../redux/store';

// const ProtectedRoute: React.FC = () => {
//   const { isAuthenticated } = useSelector((state: RootState) => state.auth);
//   console.log("ProtectedRoute - isAuthenticated:", isAuthenticated);
//   // console.log("ProtectedRoute - isAdminRoute:", isAdminRoute);
//   // console.log("ProtectedRoute - isAdmin:", isAdmin);
//   const getToken = localStorage.getItem("token")
//   console.log(getToken)
//   if (!getToken) {
//     alert("jj")
//     console.log("Redirecting to login because user is not authenticated");
//     return <Navigate to="/login" />;
//   }

  

//   return <Outlet />;
// };

// export default ProtectedRoute;
// src/routes/ProtectedRoute.tsx
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
