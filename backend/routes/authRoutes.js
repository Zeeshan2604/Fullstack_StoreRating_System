const express = require('express');
const { registerUser, loginUser } = require('../controllers/authController');
const { check } = require('express-validator');

const router = express.Router();

router.post('/signup', [
    check('name').isLength({ min: 5, max: 60 }),                    // NAME
    check('email').isEmail(),                                        // EMAIL
    check('password').matches(/^(?=.*[A-Z])(?=.*\W).{8,16}$/),       // PASSWORD
    check('address').isLength({ max: 400 }),                         // ADDRESS
    check('role').isIn(['admin', 'user', 'owner'])                   // ROLE
], registerUser);


router.post('/login', [
    check('email').isEmail(),
    check('password').exists()
], loginUser);

module.exports = router;
