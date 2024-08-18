// src/layouts/Layout.tsx
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Admin from '../pages/admin';
import Header from '../components/Header';
import Product from '../components/Products';
import ProductDetails from '../components/ProductDetails';
import Login from '../pages/Login';
import ProtectedRoute from '../routes/ProtectedRoutes';
import AdminLogin from '../pages/AdminLogin';
import Signup from '../pages/Singup';
import Store from '../pages/Store';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../redux/store';
import { useEffect } from 'react';
import { loadUserFromToken, setToken } from '../redux/slices/authSlices';

function Layout() {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, isAuthenticated } = useSelector((state: RootState) => state.auth);
 console.log(isAuthenticated)
 useEffect(() => {
  const token = localStorage.getItem('token');
  if (token) {
    dispatch(setToken(token)); // Set token from local storage
    dispatch(loadUserFromToken()); // Load user from token
  }
}, [dispatch]);

if (loading) {
  return <div>Loading...</div>; // Or a proper loading spinner
}
  return (
    <Router>
    <Header />
    <Routes>
      <Route path="/" element={<Product />} />
      <Route path="/shoes/:id" element={<ProductDetails />} />
      
      {/* Protect the store route */}
      <Route 
        path="/store" 
        element={
          <ProtectedRoute>
            <Store />
          </ProtectedRoute>
        } 
      />

      {/* Protect the admin route */}
      <Route 
        path="/admin" 
        element={
          <ProtectedRoute >
            <Admin />
          </ProtectedRoute>
        } 
      />

      <Route path="/login" element={<Login />} />
      <Route path="/adminLogin" element={<AdminLogin />} />
      <Route path="/signup" element={<Signup />} />
    </Routes>
  </Router>
  );
}

export default Layout;
