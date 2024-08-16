import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { addToCart, removeFromCart } from '../redux/slices/cartSlice';
import { AppDispatch, RootState } from '../redux/store';
import { useDispatch, useSelector } from 'react-redux';
import {updateQuantity} from '../redux/slices/cartSlice'
interface Shoe {
  _id: string;
  name: string;
  price: number;
  description?: string;
  imageUrl?: string;
}

const ProductsDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [shoe, setShoe] = useState<Shoe | null>(null);
  const [quantity, setQuantity] = useState<number>(0); // State for quantity
  const dispatch: AppDispatch = useDispatch();
  const quantityInCart = useSelector((state: RootState) => 
    state.cart.products.find(item => item._id === id)?.quantity || 0
  ); // Get quantity from Redux store
  useEffect(() => {
    axios.get(`/api/shoes/${id}`)
      .then(res => setShoe(res.data))
      .catch(err => console.log(err));
  }, [id]);

  const handleAddToCart = (shoe: Shoe) => {
    if (quantityInCart === 0) {
      // Add item to cart with quantity 1
      dispatch(addToCart({
        _id: shoe._id,
        name: shoe.name,
        price: shoe.price,
        quantity: 1,
      }));
    } else {
      // Increase quantity if item is already in cart
      dispatch(updateQuantity({
        _id: shoe._id,
        quantity:  1,
      }));
    }
  };

//   const handleRemoveFromCart = (shoe: Shoe) => {
//     dispatch(removeFromCart(shoe._id));
//     setQuantity(prev => Math.max(prev - 1, 0));
//   };
const handleRemoveFromCart = (shoe: Shoe) => {
    if (quantityInCart > 1) {
      dispatch(updateQuantity({
        _id: shoe._id,
        quantity: -1
      }));
    } else {
      dispatch(removeFromCart(shoe._id));
    }
  };
  if (!shoe) return <div>Loading...</div>;

  return (
    <div className="bg-white">
      <div className="pt-6">
        {/* ... (existing code for breadcrumb and image gallery) */}
      </div>

      <div className="mx-auto max-w-2xl px-4 pb-16 pt-10 sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-3 lg:grid-rows-[auto,auto,1fr] lg:gap-x-8 lg:px-8 lg:pb-24 lg:pt-16">
        <div className="lg:col-span-2 lg:border-r lg:border-gray-200 lg:pr-8">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">{shoe.name}</h1>
        </div>

        <div className="mt-4 lg:row-span-3 lg:mt-0">
          <h2 className="sr-only">Product information</h2>
          <p className="text-3xl tracking-tight text-gray-900">${shoe.price}</p>
          <form className="mt-10">
            {/* ... (existing code for options like colors and sizes) */}
          </form>
          {quantityInCart === 0 ? (
            <button
              onClick={() => handleAddToCart(shoe)}
              className="mt-10 flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Add to bag
            </button>
          ) : (
            <div className="mt-10 flex items-center justify-center space-x-4">
              <button
                onClick={() => handleRemoveFromCart(shoe)}
                className="rounded-md border border-transparent bg-red-600 px-4 py-2 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                -
              </button>
              <span className="text-lg font-bold">{quantityInCart}</span>
              <button
                onClick={() => handleAddToCart(shoe)}
                className="rounded-md border border-transparent bg-green-600 px-4 py-2 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              >
                +
              </button>
            </div>
          )}
        </div>

        <div className="py-10 lg:col-span-2 lg:col-start-1 lg:border-r lg:border-gray-200 lg:pb-16 lg:pr-8 lg:pt-6">
          {/* Description and details */}
          <div>
            <h3 className="sr-only">Description</h3>
            <div className="space-y-6">
              <p className="text-base text-gray-900">{shoe.description}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsDetails;
