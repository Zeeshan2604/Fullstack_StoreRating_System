const express = require('express');
const { authenticateToken } = require('../middlewares/authMiddleware');
const {
  getMyStoreRatings,
  getMyStoreAverageRating,
  getMyStoreInfo
} = require('../controllers/ownerController');

const router = express.Router();

router.use(authenticateToken);

router.get('/ratings', getMyStoreRatings);
router.get('/average-rating', getMyStoreAverageRating);
router.get('/store-info', getMyStoreInfo);

module.exports = router;
