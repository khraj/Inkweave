const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });

exports.register = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    if (await User.findOne({ email }))
      return res.status(400).json({ message: 'Email already registered' });
    const user = await User.create({ name, email, password, phone });
    res.status(201).json({ token: generateToken(user._id), user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password)))
      return res.status(401).json({ message: 'Invalid email or password' });
    if (!user.isActive)
      return res.status(401).json({ message: 'Account deactivated. Contact support.' });
    res.json({ token: generateToken(user._id), user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getMe = async (req, res) => {
  res.json({ user: req.user });
};

exports.updateProfile = async (req, res) => {
  try {
    const { name, phone, address } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, phone, address },
      { new: true, runValidators: true }
    );
    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);
    if (!(await user.matchPassword(currentPassword)))
      return res.status(400).json({ message: 'Current password is incorrect' });
    user.password = newPassword;
    await user.save();
    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Step 1: Customer enters email → get reset token
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ message: 'No account found with that email address' });

    const token = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });

    res.json({
      message: 'Reset token generated successfully',
      resetToken: token, // In production this would be emailed
      userId: user._id,
      note: 'Use this token to reset your password within 15 minutes'
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Step 2: Customer submits token + new password
exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user)
      return res.status(400).json({ message: 'Invalid or expired reset token' });

    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.json({
      token: generateToken(user._id),
      user,
      message: 'Password reset successfully'
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.seedAdmin = async (req, res) => {
  try {
    const existing = await User.findOne({ role: 'admin' });
    if (existing) return res.json({ message: 'Admin already exists', email: existing.email });
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@tshirtstore.com',
      password: 'Admin@123',
      role: 'admin'
    });
    res.status(201).json({ message: 'Admin created', email: admin.email, password: 'Admin@123' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};