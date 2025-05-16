const pool = require('../config/db');

// Get ratings submitted to this owner's store
const getMyStoreRatings = async (req, res) => {
  const ownerId = req.user.id;

  try {
    const [ratings] = await pool.query(`
      SELECT u.name AS user_name, u.email, r.rating
      FROM ratings r
      JOIN users u ON u.id = r.user_id
      JOIN stores s ON s.id = r.store_id
      WHERE s.owner_id = ?
    `, [ownerId]);

    res.json(ratings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching store ratings" });
  }
};

// Get average rating of this owner's store
const getMyStoreAverageRating = async (req, res) => {
  const ownerId = req.user.id;

  try {
    const [[result]] = await pool.query(`
      SELECT COALESCE(AVG(r.rating), 0) as avg_rating
      FROM ratings r
      JOIN stores s ON s.id = r.store_id
      WHERE s.owner_id = ?
    `, [ownerId]);

    res.json({ averageRating: result.avg_rating });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching average rating" });
  }
};

const getMyStoreInfo = async (req, res) => {
  const ownerId = req.user.id;
  try {
    const [store] = await pool.query(`SELECT id, name FROM stores WHERE owner_id = ?`, [ownerId]);
    if (store.length === 0) return res.status(404).json({ message: "Store not found" });
    res.json(store[0]);
  } catch (err) {
    res.status(500).json({ message: "Error fetching store info" });
  }
};

module.exports = { getMyStoreRatings, getMyStoreAverageRating, getMyStoreInfo };

