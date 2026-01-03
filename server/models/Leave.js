const mongoose = require('mongoose');

const LeaveSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    leaveType: { type: String, enum: ['Paid', 'Sick', 'Unpaid'], required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    reason: { type: String, required: true },
    status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
    adminComments: { type: String },
    appliedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Leave', LeaveSchema);
