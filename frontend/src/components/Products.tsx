import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AppDispatch, RootState } from '../redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { fetchShoes } from '../redux/slices/shoesSlice';

// interface ProductProps {
//   id: number;
//   name: string;
//   price: number;
// }

// interface Props {
//   products: ProductProps[];
//   addToCart: (product: ProductProps) => void;
// }
// const Products = ({ products, addToCart }: Props) => {
  
  interface Shoes {
    _id: string;
    name: string;
    price: number;
    imageUrl: string;
  }
const Product: React.FC = ({ }) => {
    const dispatch: AppDispatch = useDispatch();
    const { shoes, loading, error } = useSelector((state: RootState) => state.shoes);
  
    useEffect(() => {
      dispatch(fetchShoes());
    }, [dispatch]);
  
    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
  return (
    <div className="bg-white">
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
      <h2 className="text-2xl font-bold tracking-tight text-gray-900">Explore Your Comfort</h2>

      <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
        {shoes.map((product) => (
            <Link to={`/shoes/${product._id}`}>
              <div key={product._id} className="group relative">
            <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-80">
              <img
                //alt={product.imageAlt}
                src={product.imageUrl}
                className="h-full w-full object-cover object-center lg:h-full lg:w-full"
              />
            </div>
            <div className="mt-4 flex justify-between">
              <div>
                <h3 className="text-sm text-gray-700">
                  <a
                   //href={product.href}
                   >
                    <span aria-hidden="true" className="absolute inset-0" />
                    {product.name}
                  </a>
                </h3>
                {/* <p className="mt-1 text-sm text-gray-500">{product.color}</p> */}
              </div>
              <p className="text-sm font-medium text-gray-900">{product.price}</p>
            </div>
          </div>
            </Link>
        
        ))}
      </div>
    </div>
  </div>
  );
};

export default Product;
