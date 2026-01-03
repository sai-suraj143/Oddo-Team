const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Profile = require('../models/Profile');
const { generateEmployeeId } = require('../utils/idGenerator');

// POST: Signup
router.post('/signup', async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // 1. Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists with this email" });
        }

        // 2. Generate Employee ID
        const empId = generateEmployeeId(name);

        // 3. Create User
        const newUser = await User.create({
            name,
            email,
            password, // Note: In a real app, hash this password!
            role,
            empId
        });

        // 4. Create Linked Profile
        await Profile.create({
            userId: newUser._id,
            personalDetails: {
                firstName: name.split(' ')[0],
                lastName: name.split(' ')[1] || ''
            },
            jobDetails: {
                joiningDate: new Date()
            },
            profilePicture: ""
        });

        res.status(201).json({
            message: "User registered successfully",
            empId: newUser.empId,
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role
            }
        });

    } catch (error) {
        console.error("Signup Error:", error);
        res.status(500).json({ message: "Server Error during registration" });
    }
});

// POST: Login
router.post('/login', async (req, res) => {
    try {
        const { empId, password } = req.body;

        // 1. Find User by Employee ID
        const user = await User.findOne({ empId });
        if (!user) {
            return res.status(400).json({ message: "Invalid Employee ID or Password" });
        }

        // 2. Verify Password (Simple comparison for now)
        if (user.password !== password) {
            return res.status(400).json({ message: "Invalid Employee ID or Password" });
        }

        // 3. Login Success
        res.json({
            message: "Login Successful",
            user: {
                id: user.empId, // Frontend expects 'id' to be the Employee ID for display/logic
                _id: user._id,   // sending database ID as well if needed
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: "Server Error during login" });
    }
});

module.exports = router;
