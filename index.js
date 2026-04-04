require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const userRoutes = require("./routes/userRoutes");

const app = express();

app.use(cors());
app.use(express.json());

/* ROUTES */
app.get("/", (req, res) => {
  res.json({
    message: "My First API 🚀",
    endpoints: {
      login: "/users/login",
      register: "/users/register",
      users: "/users (protected)",
    },
  });
});

app.use("/users", userRoutes);

/* MONGODB CONNECTION */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected ✅"))
  .catch((err) => console.log("MongoDB error ❌", err));

/* PORT */
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});