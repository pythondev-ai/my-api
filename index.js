require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes');

const app = express();

// Middleware
app.use(express.json());

// MongoDB Connection
mongoose.connect('mongodb://127.0.0.1:27017/myapi')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Routes
app.use('/users', userRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: "My First API 🚀",
    endpoints: {
      login: "/users/login",
      register: "/users/register",
      users: "/users (protected)"
    }
  });
});

// Port (important for Render)
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});