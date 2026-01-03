const express = require('express');
const router = express.Router();
const Attendance = require('../models/Attendance');

// 1. CHECK-IN
router.post('/checkin', async (req, res) => {
    const { userId } = req.body;
    // Use local date for consistency
    const d = new Date();
    const offset = d.getTimezoneOffset() * 60000;
    const date = (new Date(d - offset)).toISOString().slice(0, 10);
    const time = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    try {
        let attendance = await Attendance.findOne({ userId, date });
        if (attendance) return res.status(400).json({ message: 'Already checked in' });

        attendance = await Attendance.create({
            userId,
            date,
            checkIn: time,
            status: 'Present'
        });
        res.json(attendance);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// 2. CHECK-OUT
router.post('/checkout', async (req, res) => {
    const { userId } = req.body;
    const d = new Date();
    const offset = d.getTimezoneOffset() * 60000;
    const date = (new Date(d - offset)).toISOString().slice(0, 10);
    const time = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    try {
        const attendance = await Attendance.findOne({ userId, date });
        if (!attendance) return res.status(400).json({ message: 'No check-in record found today' });

        attendance.checkOut = time;
        // Calculate work hours? (Simple diff not possible with time strings easily without ref, skipping for now or parsing)

        await attendance.save();
        res.json(attendance);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// 3. GET TODAY'S STATUS (New endpoint for Dashboard)
router.get('/today/:userId', async (req, res) => {
    try {
        const d = new Date();
        const offset = d.getTimezoneOffset() * 60000;
        const date = (new Date(d - offset)).toISOString().slice(0, 10);

        const attendance = await Attendance.findOne({ userId: req.params.userId, date });

        if (attendance) {
            res.json({
                status: attendance.status,
                checkIn: attendance.checkIn,
                checkOut: attendance.checkOut
            });
        } else {
            res.json({ status: 'Absent', checkIn: null });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// 4. GET ALL HISTORY
router.get('/:userId', async (req, res) => {
    try {
        const attendance = await Attendance.find({ userId: req.params.userId }).sort({ date: -1 });
        res.json(attendance);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;