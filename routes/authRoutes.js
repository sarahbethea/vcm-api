const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// login route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        //check for password match
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Incorrect password' });
        }

        //generate JWT token
        const token = jwt.sign(
            { id: user._id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '2h' }
        );

        res.status(200).json({ 
            message: 'Login successful', 
            user: { id: user._id, firstName: user.firstName, lastName: user.lastName, role: user.role },
            token,
        });
    } catch (e) {
        res.status(500).json({ message: 'Server error', error: e.message });
    }
});



// sign up route
router.post('/signup', async (req, res) => {
    const { email, password, firstName, lastName, role } = req.body;
    console.log('Signing up user...')
    

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    try {
        // check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        //hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        //create new user
        const newUser = new User({
            email,
            password: hashedPassword,
            firstName: firstName || '',
            lastName: lastName || '',
            role: role || 'student',
        });

        await newUser.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (e) {
        res.status(500).json({ message: 'Server error', error: e.message });
      }
});

module.exports = router;