const express = require('express');
const router = express.Router();
const Profile = require('../models/Profile');
const User = require('../models/User'); // Your friend's User model

// 1. HR: Add New Employee [Requirement 3.2.2]
router.post('/add-employee', async (req, res) => {
    try {
        const { name, email, role, department, designation, salary } = req.body;

        // First, create the Auth User (Friend's logic)
        const newUser = await User.create({ name, email, role, password: 'InitialPassword123' });

        // Second, create the linked Profile (Your logic)
        const newProfile = await Profile.create({
            userId: newUser._id,
            personalDetails: { firstName: name.split(' ')[0], lastName: name.split(' ')[1] || '' },
            jobDetails: { department, designation, joiningDate: new Date() },
            salaryStructure: { baseSalary: salary }
        });

        res.status(201).json({ message: "Employee Created Successfully", profile: newProfile });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// 2. HR: View All Employees [Requirement 3.2.2]
router.get('/all-employees', async (req, res) => {
    try {
        const employees = await Profile.find().populate('userId', 'name email role');
        res.json(employees);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
});

module.exports = router;