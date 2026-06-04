const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Sign a JWT carrying the user id.
const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

// Shape a user document for API responses (never leak the password hash).
const publicUser = (user) => ({
  id: user._id,
  fullName: user.fullName,
  email: user.email,
  phone: user.phone,
  goal: user.goal,
  timezone: user.timezone,
});

// @route   POST /api/auth/register
// @access  Public
const register = async (req, res, next) => {
  try {
    const { fullName, email, phone, password } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({ message: 'Full name, email and password are required' });
    }

    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) {
      return res.status(409).json({ message: 'An account with this email already exists' });
    }

    const user = await User.create({ fullName, email, phone, password });

    return res.status(201).json({
      user: publicUser(user),
      token: generateToken(user._id),
    });
  } catch (error) {
    return next(error);
  }
};

// @route   POST /api/auth/login
// @access  Public
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // password has select:false, so request it explicitly.
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    return res.json({
      user: publicUser(user),
      token: generateToken(user._id),
    });
  } catch (error) {
    return next(error);
  }
};

// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  return res.json({ user: publicUser(req.user) });
};

// @route   PUT /api/auth/me
// @access  Private  (profile page: fullName, phone, goal, timezone)
const updateProfile = async (req, res, next) => {
  try {
    const { fullName, phone, goal, timezone } = req.body;
    const user = req.user;

    if (fullName !== undefined) user.fullName = fullName;
    if (phone !== undefined) user.phone = phone;
    if (goal !== undefined) user.goal = goal;
    if (timezone !== undefined) user.timezone = timezone;

    await user.save();
    return res.json({ user: publicUser(user) });
  } catch (error) {
    return next(error);
  }
};

module.exports = { register, login, getMe, updateProfile };
