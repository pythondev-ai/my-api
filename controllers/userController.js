const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// GET users
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST user
exports.createUser = async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// DELETE user
exports.deleteUser = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await User.deleteOne({ id: id });
    res.json({ message: "User deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE user
exports.updateUser = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await User.updateOne({ id: id }, req.body);
    res.json({ message: "User updated" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// REGISTER
exports.registerUser = async (req, res) => {
  try {
    const { id, name, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      id,
      name,
      email,
      password: hashedPassword
    });

    await user.save();
    res.json({ message: "User registered successfully" });

  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// LOGIN
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    res.json({
      message: "Login successful",
      token: token
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};