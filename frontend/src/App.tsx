
 
import ErrorBoundary from './components/ErrorBoundary';
import Layout from './layouts/Layout';

function App() {
  return (
   <>
  <ErrorBoundary>
  <Layout/> 
  </ErrorBoundary> </>
  );
}

export default App;
