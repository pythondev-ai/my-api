const express = require('express');
const router = express.Router();

const auth = require('../middleware/authMiddleware');

const {
  getUsers,
  createUser,
  deleteUser,
  updateUser,
  registerUser,
  loginUser
} = require('../controllers/userController');

router.get('/', auth, getUsers);
router.post('/', auth, createUser);
router.delete('/:id', auth, deleteUser);
router.put('/:id', auth, updateUser);

router.post('/register', registerUser);
router.post('/login', loginUser);

module.exports = router;