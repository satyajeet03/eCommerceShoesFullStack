import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { AppDispatch, RootState } from '../redux/store';
import CartModal from './CartModal';
import { loadUserFromToken, logout, setToken } from '../redux/slices/authSlices';
import { clearCart, fetchCart } from '../redux/slices/cartSlice';

const Header: React.FC = () => {
  const [cartModal, setCartModalOpen] = useState<boolean>(false);
  const products = useSelector((state: RootState) => state.cart.products || []);
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  setTimeout(()=>{
    console.log(user)
  },2000)
  const dispatch = useDispatch<AppDispatch>();

  // useEffect(() => {
  //   if (isAuthenticated) {
  //     console.log("User is authenticated, loading user info");
  //     dispatch(loadUserFromToken());
  //   }
  // }, [isAuthenticated, dispatch]);

  const handleCartModal = () => {
    setCartModalOpen(!cartModal);
  };

  const handleCloseModal = () => {
    setCartModalOpen(false);
  };

  const totalItems = Array.isArray(products)
    ? products.reduce((total, product) => total + (product.quantity || 0), 0)
    : 0;

  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearCart()); // Dispatch action to clear the cart
    navigate('/login');
  };

  return (
    <>
      <header className="bg-black text-white p-4">
        <nav className="container mx-auto">
          <Link to="/" className="text-lg font-bold">Leather Shoes</Link>
          {isAuthenticated ? (
            <>
              <button onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <></>
          )}
          <div 
            onClick={handleCartModal}
            className="relative"
            style={{ display: 'flex', alignContent: 'end', alignItems: 'flex-end', justifyContent: 'end' }}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-6 h-6">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.2 6.6a1.5 1.5 0 001.5 1.4h8.3a1.5 1.5 0 001.5-1.4L17 13m-10 0h10M7 13l-2-4M17 13l2-4m-6 6v2m0-2a2 2 0 110-4 2 2 0 010 4zm0 0v2"
              />
            </svg>
            {totalItems > 0 && (
              <span className="absolute top-0 right-0 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                {totalItems}
              </span>
            )}
          </div>
          <div>
            {isAuthenticated ? (
              <p>Welcome, {user?.name}!</p>
            ) : (
              <p>Please log in.</p>
            )}
          </div>
        </nav>
      </header>
      <CartModal closeModal={handleCloseModal} openModal={cartModal} />
    </>
  );
};

export default Header;
