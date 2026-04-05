const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser,
  getUsers,
  updateUser,
  deleteUser
} = require("../controllers/userController");

const authMiddleware = require("../middleware/authMiddleware");

// routes
router.post("/register", registerUser);
router.post("/login", loginUser);

router.get("/", authMiddleware, getUsers);
router.put("/:id", authMiddleware, updateUser);
router.delete("/:id", authMiddleware, deleteUser);

module.exports = router;