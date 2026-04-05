const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


/* ===============================
   REGISTER USER
================================ */
const registerUser = async (req, res) => {
  try {
    const { id, name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      id,
      name,
      email,
      password: hashedPassword
    });

    await user.save();

    res.status(201).json({
      message: "User registered successfully"
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


/* ===============================
   LOGIN USER
================================ */
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login successful",
      token
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


/* ===============================
   GET USERS (Pagination + Filter + Sort)
================================ */
const getUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    // filtering
    const filter = {};

    if (req.query.name) {
      filter.name = {
        $regex: req.query.name,
        $options: "i"
      };
    }

    if (req.query.email) {
      filter.email = {
        $regex: req.query.email,
        $options: "i"
      };
    }

    // sorting
    let sort = {};
    if (req.query.sort) {
      const field = req.query.sort;

      if (field.startsWith("-")) {
        sort[field.substring(1)] = -1;
      } else {
        sort[field] = 1;
      }
    }

    const users = await User.find(filter)
      .select("-password")
      .sort(sort)
      .skip(skip)
      .limit(limit);

    res.json(users);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


/* ===============================
   UPDATE USER
================================ */
const updateUser = async (req, res) => {
  try {
    const { name, email } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { name, email },
      { new: true }
    ).select("-password");

    res.json(user);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


/* ===============================
   DELETE USER
================================ */
const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);

    res.json({ message: "User deleted successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


module.exports = {
  registerUser,
  loginUser,
  getUsers,
  updateUser,
  deleteUser
};