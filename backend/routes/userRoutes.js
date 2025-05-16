const express = require('express');
const { authenticateToken } = require('../middlewares/authMiddleware');
const {
  getStores,
  rateStore,
  getUserRatings
} = require('../controllers/userController');

const router = express.Router();

router.use(authenticateToken);

// View all stores with average and user rating
router.get('/stores', getStores);

// Submit/update rating
router.post('/rate', rateStore);

// View user’s own ratings
router.get('/my-ratings', getUserRatings);

module.exports = router;
