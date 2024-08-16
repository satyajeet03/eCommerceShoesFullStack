import asyncHandler from 'express-async-handler';
import User from '../models/user';
import Shoe from '../models/Shoe';
// Add or update cart items
export const addToCart = asyncHandler(async (req:any, res) => {
  const { productId, quantity } = req.body;
  const userId = req.user?.id;

  const user = await User.findById(userId);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  const itemIndex = user.cart.findIndex(item => item.productId.toString() === productId);

  if (itemIndex > -1) {
    // Update existing item
    user.cart[itemIndex].quantity = quantity;
  } else {
    // Add new item
    user.cart.push({ productId, quantity });
  }

  await user.save();

  res.json(user.cart);
});
// Update cart item quantity
export const updateCartQuantity = asyncHandler(async (req: any, res) => {
  const { productId, quantity } = req.body;
  const userId = req.user?.id;

  const user = await User.findById(userId);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  const itemIndex = user.cart.findIndex(item => item.productId.toString() === productId);

  if (itemIndex > -1) {
    // Update existing item
    if (quantity <= 0) {
      user.cart.splice(itemIndex, 1); // Remove item if quantity is zero or less
    } else {
      user.cart[itemIndex].quantity = quantity;
    }
  } else {
    // Add new item
    if (quantity > 0) {
      user.cart.push({ productId, quantity });
    }
  }

  await user.save();

  res.json(user.cart);
});

// Get cart items
export const getCart = asyncHandler(async (req:any, res) => {
  const userId = req.user?.id;

  const user = await User.findById(userId).populate('cart.productId');

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  res.json(user.cart);
});
