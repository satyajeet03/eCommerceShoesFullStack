import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../redux/store'; // Adjust the path to where your store is located
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { fetchCart, removeFromCart, updateQuantity } from '../redux/slices/cartSlice';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';

interface ModalProps {
    openModal: boolean;
    closeModal: () => void;
}

export default function CartModal({ openModal, closeModal }: ModalProps) {
  //const products = useSelector((state: RootState) => state.cart.products);
  const products = useSelector((state: RootState) => state.cart.products || []);
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  console.log(products)
  const { token } = useAuth(); // Updated to get token 
  useEffect(() => {
    if (token) {
      dispatch(fetchCart(token)); // Fetch cart data with token
    }
  }, [dispatch, token]);
  const handleRemoveCart = (id: string) => {
    dispatch(removeFromCart(id));
  };
    // Calculate the subtotal
    const subtotal = products.reduce((total, product) => 
        total + product.price * product.quantity, 0
      ).toFixed(2);

      const handleIncreaseQuantity = (_id: string) => {
        dispatch(updateQuantity({ _id, quantity: 1 }));
      };
    
      const handleDecreaseQuantity = (_id: string) => {
        dispatch(updateQuantity({ _id, quantity: -1 }));
      };   
      const { isAuthenticated } = useSelector((state: RootState) => state.auth);
 
      const handleCheckout = () => {
        if (!isAuthenticated) {
          // Store the intended destination for redirection after login
          navigate('/login', { state: { from: '/checkout' } });
        } else {
          navigate('/checkout'); // Redirect to the checkout page
        }
        closeModal()
      };
      const handleContinueShopping = () => {
        if (isAuthenticated) {
          navigate('/store');
        } else {
          navigate('/');
        }
        closeModal();
      };
  return (
    <Dialog open={openModal} onClose={closeModal} className="relative z-10">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity duration-500 ease-in-out data-[closed]:opacity-0"
      />

      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
            <DialogPanel
              transition
              className="pointer-events-auto w-screen max-w-md transform transition duration-500 ease-in-out data-[closed]:translate-x-full sm:duration-700"
            >
              <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                  <div className="flex items-start justify-between">
                    <DialogTitle className="text-lg font-medium text-gray-900">Shopping cart</DialogTitle>
                    <div className="ml-3 flex h-7 items-center">
                      <button
                        type="button"
                        onClick={closeModal}
                        className="relative -m-2 p-2 text-gray-400 hover:text-gray-500"
                      >
                        <span className="absolute -inset-0.5" />
                        <span className="sr-only">Close panel</span>
                        <XMarkIcon aria-hidden="true" className="h-6 w-6" />
                      </button>
                    </div>
                  </div>

                  <div className="mt-8">
                    <div className="flow-root">
                      <ul role="list" className="-my-6 divide-y divide-gray-200">
                        {products.map((product:any) => (
                          <li key={product.id} className="flex py-6">
                            <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                              <img
                                alt={product.imageAlt}
                                src={product.imageSrc}
                                className="h-full w-full object-cover object-center"
                              />
                            </div>

                            <div className="ml-4 flex flex-1 flex-col">
                              <div>
                                <div className="flex justify-between text-base font-medium text-gray-900">
                                  <h3>
                                    <a href={product.href}>{product.name}</a>
                                  </h3>
                                  <p className="ml-4">{product.price}</p>
                                </div>
                                <p className="mt-1 text-sm text-gray-500">{product.color}</p>
                              </div>
                              <div className="flex flex-1 items-end justify-between text-sm">
                              <div className="flex items-center">
                                  <button 
                               
                                    type="button" 
                                    onClick={() => handleDecreaseQuantity(product._id)}
                                    className="rounded-md border border-transparent bg-yellow-700 px-3 py-1 text-base font-medium text-white hover:bg-black-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                                    disabled={product.quantity <= 1}
                                  >
                                    -
                                  </button>
                                  <p className="mx-2 text-gray-500">Qty {product.quantity}</p>
                                  <button 
                                    type="button" 
                                    onClick={() => handleIncreaseQuantity(product._id)}
                                    className="rounded-md border border-transparent bg-yellow-700 px-3 py-1 text-base font-medium text-white hover:bg-black-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                                  >
                                    +
                                  </button>
                                </div>

                                <div className="flex"
                                onClick={() => handleRemoveCart(product._id)}
                                >
                                  <button type="button" className="font-medium text-indigo-600 hover:text-indigo-500">
                                    Remove
                                  </button>
                                </div>
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
                  <div className="flex justify-between text-base font-medium text-gray-900">
                    <p>Subtotal</p>
                    <p>{subtotal}</p>
                  </div>
                  <p className="mt-0.5 text-sm text-gray-500">Shipping and taxes calculated at checkout.</p>
                  <div className="mt-6">
                    <button
                       onClick={handleCheckout}
                      className="flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700"
                    >
                      Checkout
                    </button>
                  </div>
                  <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
                    <p>
                      or{' '}
                      <button
                        type="button"
                        onClick={handleContinueShopping}
                        className="font-medium text-indigo-600 hover:text-indigo-500"
                      >
                        Continue Shopping
                        <span aria-hidden="true"> &rarr;</span>
                      </button>
                    </p>
                  </div>
                </div>
              </div>
            </DialogPanel>
          </div>
        </div>
      </div>
    </Dialog>
  );
}
