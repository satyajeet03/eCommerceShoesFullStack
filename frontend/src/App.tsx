
 
import { useDispatch, useSelector } from 'react-redux';
import ErrorBoundary from './components/ErrorBoundary';
import Layout from './layouts/Layout';
import { useEffect } from 'react';
import { loadUserFromToken, setToken } from './redux/slices/authSlices';
import { AppDispatch, RootState } from './redux/store';

function App() {

 
  return (
   <>
  <ErrorBoundary>
  <Layout/> 
  </ErrorBoundary> </>
  );
}

export default App;
