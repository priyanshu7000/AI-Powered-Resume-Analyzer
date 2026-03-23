import { validateRegister, validateLogin } from '../middleware/validation.js';
import { registerUser, loginUser, refreshAccessToken, getUserById } from '../services/authService.js';
import { asyncHandler } from '../middleware/errorHandler.js';

export const register = asyncHandler(async (req, res) => {
  const { error, value } = validateRegister(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message,
    });
  }

  const user = await registerUser(value.name, value.email, value.password);

  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    user,
  });
});

export const login = asyncHandler(async (req, res) => {
  const { error, value } = validateLogin(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message,
    });
  }

  const { user, accessToken, refreshToken } = await loginUser(value.email, value.password);

  // Set refresh token in httpOnly cookie
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  res.status(200).json({
    success: true,
    message: 'Logged in successfully',
    user,
    accessToken,
  });
});

export const refresh = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies.refreshToken || req.body.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({
      success: false,
      message: 'Refresh token not found',
    });
  }

  const { accessToken, refreshToken: newRefreshToken } = await refreshAccessToken(refreshToken);

  // Update refresh token in cookie
  res.cookie('refreshToken', newRefreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(200).json({
    success: true,
    message: 'Token refreshed successfully',
    accessToken,
  });
});

export const logout = asyncHandler(async (req, res) => {
  res.clearCookie('refreshToken');
  res.clearCookie('accessToken');

  res.status(200).json({
    success: true,
    message: 'Logged out successfully',
  });
});

export const getMe = asyncHandler(async (req, res) => {
  const user = await getUserById(req.userId);

  res.status(200).json({
    success: true,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
  });
});
