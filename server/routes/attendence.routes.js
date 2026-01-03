const express = require('express');
const router = express.Router();
const Profile = require('../models/Profile');

// GET: View Profile
router.get('/:userId', async (req, res) => {
    try {
        const profile = await Profile.findOne({ userId: req.params.userId });
        // Note: Frontend should hide Salary if logged-in user isn't HR
        res.json(profile);
    } catch (err) {
        res.status(500).json({ message: "Error fetching profile" });
    }
});

// PATCH: Edit Profile
router.patch('/:userId', async (req, res) => {
    const { role, updates } = req.body; // 'role' comes from Auth middleware

    try {
        if (role === 'Employee') {
            // Employees can only edit limited fields
            const allowed = ['personalDetails.address', 'personalDetails.phone', 'profilePicture'];
            const filteredUpdates = {};

            allowed.forEach(field => {
                if (updates[field]) filteredUpdates[field] = updates[field];
            });

            const updated = await Profile.findOneAndUpdate(
                { userId: req.params.userId },
                { $set: filteredUpdates },
                { new: true }
            );
            return res.json(updated);
        }

        if (role === 'HR') {
            // Admin/HR can edit all details
            const updated = await Profile.findOneAndUpdate(
                { userId: req.params.userId },
                { $set: updates },
                { new: true }
            );
            return res.json(updated);
        }
    } catch (err) {
        res.status(400).json({ message: "Update failed" });
    }
});

module.exports = router;