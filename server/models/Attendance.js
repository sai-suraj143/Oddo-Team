const mongoose = require('mongoose');

const AttendanceSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: String, required: true }, // Format: YYYY-MM-DD
    checkIn: String,
    checkOut: String,
    status: { type: String, enum: ['Present', 'Absent', 'Half-day', 'Leave'], default: 'Present' }
});

module.exports = mongoose.model('Attendance', AttendanceSchema);