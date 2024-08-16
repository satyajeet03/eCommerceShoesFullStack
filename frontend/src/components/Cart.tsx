import React, { useState } from 'react';

interface Product {
  id: number;
  name: string;
  price: number;
}

interface Props {
  cart: Product[];
  subtotal: number;
  discount: number;
  total: number;
  removeFromCart: (product: Product) => void;
  applyDiscount: (discountCode: string) => void;
}

const Cart: React.FC<Props> = ({ cart, subtotal, discount, total, removeFromCart, applyDiscount }) => {
  const [discountCode, setDiscountCode] = useState<string>('');
  console.log(cart)
  const handleApplyDiscount = () => {
    applyDiscount(discountCode);
  };

  return (
    <div>
      <h2>Cart</h2>
      <ul>
        {cart.map((product, index) => (
          <li key={index}>
            {product.name} - ${product.price}
            <button onClick={() => removeFromCart(product)}>Remove</button>
          </li>
        ))}
      </ul>
      <p>Subtotal: ${subtotal}</p>
      <input
        type="text"
        value={discountCode}
        onChange={(e) => setDiscountCode(e.target.value)}
        placeholder="Enter discount code"
      />
      <button onClick={handleApplyDiscount}>Apply Discount</button>
      <p>Discount: {discount}%</p>
      <p>Total: ${total}</p>
    </div>
  );
};

export default Cart;
