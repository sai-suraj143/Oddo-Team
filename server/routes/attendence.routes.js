const express = require('express');
const router = express.Router();
const Attendance = require('../models/Attendance');

// Helper to get today's date string (YYYY-MM-DD)
const getTodayDate = () => new Date().toISOString().split('T')[0];

// GET: Check status for today
router.get('/today/:userId', async (req, res) => {
    try {
        const today = getTodayDate();
        const attendance = await Attendance.findOne({
            userId: req.params.userId,
            date: today
        });
        res.json(attendance || { status: 'Absent' });
    } catch (err) {
        res.status(500).json({ message: "Error fetching attendance" });
    }
});

// GET: All Attendance (Admin)
router.get('/all-yesterday-today', async (req, res) => {
    try {
        const today = getTodayDate();
        // Fetch all attendance for today
        const attendance = await Attendance.find({ date: today }).populate('userId', 'name empId role department');
        res.json(attendance);
    } catch (err) {
        res.status(500).json({ message: "Error fetching all attendance" });
    }
});


// POST: Check In
router.post('/check-in', async (req, res) => {
    const { userId } = req.body;
    const today = getTodayDate();
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    try {
        let attendance = await Attendance.findOne({ userId, date: today });
        if (attendance) {
            return res.status(400).json({ message: "Already checked in today" });
        }

        attendance = new Attendance({
            userId,
            date: today,
            checkIn: time,
            status: 'Present'
        });

        await attendance.save();
        res.json(attendance);
    } catch (err) {
        res.status(500).json({ message: "Check-in failed" });
    }
});

// POST: Check Out
router.post('/check-out', async (req, res) => {
    const { userId } = req.body;
    const today = getTodayDate();
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    try {
        let attendance = await Attendance.findOne({ userId, date: today });
        if (!attendance) {
            return res.status(400).json({ message: "No check-in record found for today" });
        }

        attendance.checkOut = time;
        // Logic for Half-day? optional
        await attendance.save();
        res.json(attendance);
    } catch (err) {
        res.status(500).json({ message: "Check-out failed" });
    }
});

// GET: Attendance History
router.get('/history/:userId', async (req, res) => {
    try {
        const history = await Attendance.find({ userId: req.params.userId }).sort({ date: -1 });
        res.json(history);
    } catch (err) {
        res.status(500).json({ message: "Error fetching history" });
    }
});

module.exports = router;