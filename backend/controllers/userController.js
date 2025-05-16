const pool = require('../config/db');

// Fetch all stores with avg rating and user’s rating
const getStores = async (req, res) => {
  try {
    const userId = req.user.id;
    const [stores] = await pool.query(`
      SELECT s.id, s.name, s.address,
        COALESCE(AVG(r.rating), 0) as avg_rating,
        (SELECT rating FROM ratings WHERE store_id = s.id AND user_id = ?) as user_rating
      FROM stores s
      LEFT JOIN ratings r ON s.id = r.store_id
      GROUP BY s.id
    `, [userId]);

    res.json(stores);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching stores" });
  }
};

// Rate or update rating
const rateStore = async (req, res) => {
  const userId = req.user.id;
  const { storeId, rating } = req.body;

  if (rating < 1 || rating > 5) {
    return res.status(400).json({ message: "Rating must be between 1 and 5" });
  }

  try {
    const [existing] = await pool.query("SELECT * FROM ratings WHERE user_id = ? AND store_id = ?", [userId, storeId]);

    if (existing.length > 0) {
      // Update existing
      await pool.query("UPDATE ratings SET rating = ? WHERE user_id = ? AND store_id = ?", [rating, userId, storeId]);
    } else {
      // New rating
      await pool.query("INSERT INTO ratings (user_id, store_id, rating) VALUES (?, ?, ?)", [userId, storeId, rating]);
    }

    res.json({ message: "Rating saved" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to save rating" });
  }
};

// View submitted ratings by the user
const getUserRatings = async (req, res) => {
  const userId = req.user.id;

  try {
    const [ratings] = await pool.query(`
      SELECT r.id, s.name as store_name, r.rating
      FROM ratings r
      JOIN stores s ON s.id = r.store_id
      WHERE r.user_id = ?
    `, [userId]);

    res.json(ratings);
  } catch (err) {
    res.status(500).json({ message: "Error fetching user ratings" });
  }
};

module.exports = { getStores, rateStore, getUserRatings };
