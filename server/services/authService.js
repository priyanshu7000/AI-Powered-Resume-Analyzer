import User from '../models/User.js';
import { generateAccessToken, generateRefreshToken, verifyToken } from '../utils/jwt.js';
import { AppError } from '../utils/customError.js';

export const registerUser = async (name, email, password) => {
  // Check if user exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new AppError('User already exists with this email', 400);
  }

  // Create user
  const user = await User.create({ name, email, password });

  return {
    id: user._id,
    name: user.name,
    email: user.email,
  };
};

export const loginUser = async (email, password) => {
  // Validate input
  if (!email || !password) {
    throw new AppError('Please provide email and password', 400);
  }

  // Check for user
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    throw new AppError('Wrong credentials', 401);
  }

  // Check password
  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    throw new AppError('Wrong credentials', 401);
  }

  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
    accessToken: generateAccessToken(user._id),
    refreshToken: generateRefreshToken(user._id),
  };
};

export const refreshAccessToken = async (refreshToken) => {
  const decoded = verifyToken(refreshToken, process.env.JWT_REFRESH_SECRET);
  if (!decoded) {
    throw new AppError('Invalid refresh token', 401);
  }

  const user = await User.findById(decoded.id);
  if (!user) {
    throw new AppError('User not found', 404);
  }

  return {
    accessToken: generateAccessToken(user._id),
    refreshToken: generateRefreshToken(user._id),
  };
};

export const getUserById = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError('User not found', 404);
  }
  return user;
};
