const express = require('express');
const router = express.Router();
const Leave = require('../models/Leave');

// POST: Apply for Leave
router.post('/apply', async (req, res) => {
    try {
        const { userId, leaveType, startDate, endDate, reason } = req.body;

        const newLeave = new Leave({
            userId,
            leaveType,
            startDate,
            endDate,
            reason
        });

        await newLeave.save();
        res.status(201).json(newLeave);
    } catch (err) {
        res.status(500).json({ message: "Failed to apply for leave", error: err.message });
    }
});

// GET: Get My Leaves
router.get('/my-leaves/:userId', async (req, res) => {
    try {
        const leaves = await Leave.find({ userId: req.params.userId }).sort({ appliedAt: -1 });
        res.json(leaves);
    } catch (err) {
        res.status(500).json({ message: "Error fetching leaves" });
    }
});

// GET: Get All Leaves (Admin)
router.get('/all', async (req, res) => {
    try {
        const leaves = await Leave.find().populate('userId', 'name empId').sort({ appliedAt: -1 });
        res.json(leaves);
    } catch (err) {
        res.status(500).json({ message: "Error fetching all leaves" });
    }
});

// PATCH: Approve/Reject Leave (Admin)
router.patch('/:leaveId/status', async (req, res) => {
    try {
        const { status, adminComments } = req.body;
        const leave = await Leave.findByIdAndUpdate(
            req.params.leaveId,
            { status, adminComments },
            { new: true }
        );
        res.json(leave);
    } catch (err) {
        res.status(500).json({ message: "Error updating leave status" });
    }
});

module.exports = router;
