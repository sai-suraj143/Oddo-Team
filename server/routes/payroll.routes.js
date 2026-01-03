const express = require('express');
const router = express.Router();
const Payroll = require('../models/Payroll');
const Profile = require('../models/Profile');

// GET: My Payroll History
router.get('/my-payroll/:userId', async (req, res) => {
    try {
        const payrolls = await Payroll.find({ userId: req.params.userId }).sort({ year: -1, month: -1 });
        res.json(payrolls);
    } catch (err) {
        res.status(500).json({ message: "Error fetching payrolls" });
    }
});

// GET: All Payrolls (Admin)
router.get('/all', async (req, res) => {
    try {
        const payrolls = await Payroll.find().populate('userId', 'name empId').sort({ year: -1 });
        res.json(payrolls);
    } catch (err) {
        res.status(500).json({ message: "Error fetching all payrolls" });
    }
});

// POST: Generate Payroll (Admin)
router.post('/generate', async (req, res) => {
    try {
        const { userId, month, year, bonus, deductions } = req.body;

        // Fetch base salary from Profile
        const profile = await Profile.findOne({ userId });
        if (!profile || !profile.salaryStructure || !profile.salaryStructure.baseSalary) {
            return res.status(400).json({ message: "User profile or salary structure missing" });
        }

        // Parse base salary (remove currency symbols if any)
        const baseSalary = parseFloat(profile.salaryStructure.baseSalary.replace(/[^0-9.]/g, ''));
        const netSalary = baseSalary + (parseFloat(bonus) || 0) - (parseFloat(deductions) || 0);

        const newPayroll = new Payroll({
            userId,
            month,
            year,
            salary: baseSalary,
            bonus: bonus || 0,
            deductions: deductions || 0,
            netSalary,
            status: 'Processing'
        });

        await newPayroll.save();
        res.status(201).json(newPayroll);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to generate payroll" });
    }
});

// PATCH: Mark as Paid
router.patch('/:id/pay', async (req, res) => {
    try {
        const payroll = await Payroll.findByIdAndUpdate(
            req.params.id,
            { status: 'Paid', paymentDate: new Date() },
            { new: true }
        );
        res.json(payroll);
    } catch (err) {
        res.status(500).json({ message: "Update failed" });
    }
});

module.exports = router;
