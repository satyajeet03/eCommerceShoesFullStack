import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Admin from '../pages/admin';
import Header from '../components/Header';
import Product from '../components/Products';
import ProductDetails from '../components/ProductDetails';
import Login from '../pages/Login';
import ProtectedRoute from '../routes/ProtectedRputes';
import AdminLogin from '../pages/AdminLogin';
import Signup from '../pages/Singup';
import Store from '../pages/Store';  

function Layout() {  
 
  return (
    <Router>
    <Header />
    <Routes>
      <Route path="/" element={<Product />} />
      <Route path="/shoes/:id" element={<ProductDetails />} />
      
      {/* Protect the store route */}
      <Route element={<ProtectedRoute />}>
        <Route path="/store" element={<Store />} />
      </Route>
      
      <Route path="/admin" element={<ProtectedRoute isAdminRoute={true} />}>
        <Route path="/admin" element={<Admin />} />
      </Route>
      
      <Route path="/login" element={<Login />} />
      <Route path="/adminLogin" element={<AdminLogin />} />
      <Route path="/signup" element={<Signup />} />
    </Routes>
  </Router>
  );
}

export default Layout;
