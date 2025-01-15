const express = require('express');
const router = express.Router();
const User = require('../models/User');




//get all users
router.get('/', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);

    } catch (e) {
        res.status(500).json({message: e.message});
    }
});


//get user by ID
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found.' });
        res.json(user); //sends response with user data in JSON format back to client
    } catch (e) {
        res.status(500).json({message: e.message});
    }
});

//get user by email
router.get('/', async (req, res) => {
    const { email } = req.query;
    console.log(`GET by email /api/users?email=${email}`);

    try {
        const user = await User.findOne({ email });
        console.log('User fetched', user);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (e) {
        console.error('Error fetching user:', e);
        res.status(400).json(e);
    }
});


//create new user
router.post('/', async (req, res) => {
    const user = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.role,
    });

    try {
        const newUser = await user.save(); //save new user to DB
        res.status(201).json(newUser); //respond with created user in JSON format with created status code
    } catch (e) {
        res.status(400).json({ message: e.message }); //400 is bad request status code. 
    }
});

// update User by PATCH request
router.patch('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found.' });

        if (req.body.firstName != null) user.firstName = req.body.firstName;
        if (req.body.lastName != null) user.lastName = req.body.lastName;
        if (req.body.email != null) user.email = req.body.email;
        // add an option to change role??????

        const updatedUser = user.save();
        res.json(updatedUser);
    } catch (e) {
        res.status(400).json({ message: e.message });
    }
});


// update user by PUT request 
router.put('/:id', async (req, res) => {
    const { id } = req.params
    try {
        const updatedUser = await User.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
        if (!updatedUser) return res.status(404).json({ message: 'User not found'});
        res.status(200).json(updatedUser);
    } catch (e) {
        res.status(400).json({ message: e.message });
    }
});


// Email validation function
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Basic email validation regex
    return emailRegex.test(email);
}


// Sync user data
router.post('/sync', async (req, res) => {
    const { email, firstName, lastName, role } = req.body;
    console.log(`POST sync request /api/users/sync for email: ${email}`);

    if (!isValidEmail(email)) {
        return res.status(400).json({ message: 'Invalid email format' });
    }

    try {
        const user = await User.findOne({ email });

        if (!user) {
            user = new User({
                email, 
                firstName: firstName || '',
                lastName: lastName || '',
                role: role || 'student',
            });
            await user.save();
            console.log(`Created new user in MongoDB for email: ${email}`)
        } else {
            console.log(`User already exists in MongoDB for email: ${email}`);
        }

        res.status(200).json({ message: 'User synced' });
    } catch (e) {
        console.error('Error syncing user:', e);
        res.status(500).json({ message: 'Error syncing user' });
    }
});

module.exports = router;



