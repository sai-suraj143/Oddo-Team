const mongoose = require('mongoose');

const PayrollSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    month: { type: String, required: true }, // e.g., "October 2023"
    year: { type: Number, required: true },
    salary: { type: Number, required: true }, // Base Salary
    bonus: { type: Number, default: 0 },
    deductions: { type: Number, default: 0 },
    netSalary: { type: Number, required: true },
    status: { type: String, enum: ['Paid', 'Processing', 'Pending'], default: 'Pending' },
    paymentDate: { type: Date }
});

module.exports = mongoose.model('Payroll', PayrollSchema);
