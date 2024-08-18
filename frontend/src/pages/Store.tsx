import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../redux/store';
import { useEffect } from 'react';
import { fetchShoes } from '../redux/slices/shoesSlice';
import { addToCartData, fetchCart } from '../redux/slices/cartSlice';
import { useAuth } from '../hooks/useAuth'; 

const Store = () => {
  const productsInCart = useSelector((state: RootState) => state.cart.products );
  console.log(productsInCart)
  const { shoes, loading, error } = useSelector((state: RootState) => state.shoes);
  const dispatch: AppDispatch = useDispatch();
  const { token } = useAuth(); 
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  // useEffect(() => {
  //   const { token } = useAuth();
  //   if (token) {
  //     dispatch(setToken(token));
  //     dispatch(loadUserFromToken());
  //   }
  // }, [dispatch]);
  useEffect(() => {
    dispatch(fetchShoes());
    if (isAuthenticated && token) {
      dispatch(fetchCart(token)); // Fetch cart data with token
    }
  }, [dispatch, isAuthenticated, token]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const handleAddToCart = (product: any) => {
    dispatch(addToCartData([{ productId: product._id, quantity: 1 }]));
    if (isAuthenticated && token) {
      dispatch(fetchCart(token)); // Fetch cart data with token
    }
  };

//   const isInCart = (productId: string) => {
//     return productsInCart.some((product: any) => product._id === productId);
//   };
const isInCart = (productId: string) => {
    return Array.isArray(productsInCart) && productsInCart.some((product: any) => product._id === productId);
  };
  
  return (
    <>
    {/* {isAuthenticated ? <Header/> : "You are not logged in"} */}

    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mt-12 mb-8">All Products</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {shoes.map((product: any) => (
          <div key={product._id} className="border border-gray-200 rounded-lg p-4">
            <img src={product.imageUrl} alt={product.imageAlt} className="h-40 w-full object-cover mb-4" />
            <h2 className="text-lg font-semibold">{product.name}</h2>
            <p className="text-gray-600">{product.price}</p>
            {isInCart(product._id) ? (
              <button
                className="mt-4 w-full bg-gray-500 text-white py-2 rounded-lg"
                disabled
              >
                Already in Cart
              </button>
            ) : (
              <button
                className="mt-4 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
                onClick={() => handleAddToCart(product)}
              >
                Add to Cart
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
    </>
  );
};

export default Store;
