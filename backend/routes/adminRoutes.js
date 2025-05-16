const express = require('express');
const { authenticateToken } = require('../middlewares/authMiddleware');
const {
  addUser, addStore, getDashboardStats, getAllUsers, getAllStores
} = require('../controllers/adminController');

const router = express.Router();

// All admin routes protected
router.use(authenticateToken);

// Add user
router.post('/users', addUser);

// Add store
router.post('/stores', addStore);

// Dashboard stats
router.get('/dashboard', getDashboardStats);

// List users
router.get('/users', getAllUsers);

// List stores
router.get('/stores', getAllStores);

module.exports = router;
