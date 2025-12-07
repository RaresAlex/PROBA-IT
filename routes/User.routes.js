const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/User.model.js');

router.post('/register', async (req, res) => {
    const { username, password } = req.body;

    try {
        // 1. Check if user exists
        let user = await User.findOne({ username });
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        // 2. Create new user instance
        user = new User({
            username,
            password,
            miciBalance: 5 // Number of Mici(Likes) given to each user
        });

        // 3. Hash Password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        // 4. Save to DB
        await user.save();

        // 5. Create and send Token (JWT)
        const payload = {
            user: {
                id: user.id,
                miciBalance: user.miciBalance
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '1h' },
            (err, token) => {
                if (err) throw err;
                res.json({ token, miciBalance: user.miciBalance });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   POST /api/auth/login
// @desc    Authenticate user and get token
// @access  Public
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        // 1. Check if user exists
        let user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        // 2. Check Password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        // 3. Create and send Token (JWT)
        const payload = {
            user: {
                id: user.id,
                miciBalance: user.miciBalance
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '1h' },
            (err, token) => {
                if (err) throw err;
                // Send back the token and the current Mici balance
                res.json({ token, miciBalance: user.miciBalance, userId: user.id });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});


module.exports = router;