const pool = require('../config/db');

// Add a new user
const addUser = async (req, res) => {
  const { name, email, password, address, role } = req.body;
  try {
    const [exists] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
    if (exists.length) return res.status(400).json({ message: "User already exists" });

    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query(
      "INSERT INTO users (name, email, password, address, role) VALUES (?, ?, ?, ?, ?)",
      [name, email, hashedPassword, address, role]
    );

    res.status(201).json({ message: "User created" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Add a new store
const addStore = async (req, res) => {
  const { name, email, address, owner_id } = req.body;
  try {
    await pool.query(
      "INSERT INTO stores (name, email, address, owner_id) VALUES (?, ?, ?, ?)",
      [name, email, address, owner_id]
    );
    res.status(201).json({ message: "Store created" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get dashboard metrics
const getDashboardStats = async (req, res) => {
  try {
    const [[{ totalUsers }]] = await pool.query("SELECT COUNT(*) as totalUsers FROM users");
    const [[{ totalStores }]] = await pool.query("SELECT COUNT(*) as totalStores FROM stores");
    const [[{ totalRatings }]] = await pool.query("SELECT COUNT(*) as totalRatings FROM ratings");

    res.json({ totalUsers, totalStores, totalRatings });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all users
const getAllUsers = async (req, res) => {
  try {
    const [users] = await pool.query("SELECT id, name, email, address, role FROM users");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Error fetching users" });
  }
};

// Get all stores with average rating
const getAllStores = async (req, res) => {
  try {
    const [stores] = await pool.query(`
      SELECT s.id, s.name, s.email, s.address,
        COALESCE(AVG(r.rating), 0) AS rating,
        u.name AS owner_name
      FROM stores s
      LEFT JOIN ratings r ON s.id = r.store_id
      LEFT JOIN users u ON s.owner_id = u.id
      GROUP BY s.id, u.name
    `);
    res.json(stores);
  } catch (err) {
    res.status(500).json({ message: "Error fetching stores" });
  }
};


module.exports = { addUser, addStore, getDashboardStats, getAllUsers, getAllStores };
