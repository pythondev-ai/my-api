const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


// REGISTER USER
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword
    });

    res.status(201).json({
      message: "User registered successfully",
      user
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// LOGIN USER
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || "secret",
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


// GET USERS (Pagination + Filtering + Sorting + Metadata)
const getUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    // FILTER
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

    // SORT
    let sort = {};
    if (req.query.sort) {
      const field = req.query.sort;

      if (field.startsWith("-")) {
        sort[field.substring(1)] = -1;
      } else {
        sort[field] = 1;
      }
    }

    const totalUsers = await User.countDocuments(filter);

    const users = await User.find(filter)
      .select("-password")
      .sort(sort)
      .skip(skip)
      .limit(limit);

    const totalPages = Math.ceil(totalUsers / limit);

    res.json({
      totalUsers,
      totalPages,
      currentPage: page,
      users
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


module.exports = {
  registerUser,
  loginUser,
  getUsers
};