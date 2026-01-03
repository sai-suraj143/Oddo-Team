const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // This links to your friend's User model
        required: true
    },
    personalDetails: {
        firstName: String,
        lastName: String,
        phone: String,
        address: String
    },
    jobDetails: {
        designation: String,
        department: String,
        joiningDate: { type: Date, default: Date.now }
    },
    salaryStructure: {
        baseSalary: String
    },
    profilePicture: { type: String, default: "" },
    documents: [String]
});

module.exports = mongoose.model('Profile', ProfileSchema);