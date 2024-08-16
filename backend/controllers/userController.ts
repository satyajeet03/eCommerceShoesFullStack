import asyncHandler from 'express-async-handler';
import { AuthRequest } from '../middleware/authMiddleware';
import User from '../models/user';
import {generateToken} from '../utils/generateToken';
import { Response } from 'express';

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
export const authUser = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
    //   _id: user._id.toString(), // Ensure _id is treated as a string
    //   name: user.name,
    //   email: user.email,
    //   isAdmin: user.isAdmin,
     token: generateToken(user._id.toString(), user.isAdmin),  // Ensure _id is treated as a string
    message: 'User logged in successfully'
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
export const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password, isAdmin } = req.body;

    // Check if the user already exists
    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(400);
        throw new Error('User already exists');
    }

    // Create a new user
    const user = await User.create({
        name,
        email,
        password,
        isAdmin: isAdmin || false, // Default to false if not provided
    });

    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token: generateToken(user._id, user.isAdmin),
        });
    } else {
        res.status(400);
        throw new Error('Invalid user data');
    }
});


// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
export const getUserProfile = asyncHandler(async (req: AuthRequest, res: Response) => {
  const user = await User.findById(req.user?._id);

  if (user) {
    res.json({
      _id: user._id.toString(), // Ensure _id is treated as a string
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// Controller to create an admin user (should be protected and used only by authorized personnel)
export const createAdminUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  // Ensure you have proper validation and authorization checks here
  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Please provide all required fields');
  }

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  // Create an admin user
  const adminUser = await User.create({
    name,
    email,
    password,
    isAdmin: true, // Set isAdmin to true
  });

  if (adminUser) {
    res.status(201).json({
      _id: adminUser._id,
      name: adminUser.name,
      email: adminUser.email,
      isAdmin: adminUser.isAdmin,
      token: generateToken(adminUser._id, adminUser.isAdmin),
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});