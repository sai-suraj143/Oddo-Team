const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
    try {
        // This looks at your .env file for the "MONGO_URI"
        await mongoose.connect(process.env.MONGO_URI);
        console.log("🚀 MongoDB Connected Successfully!");
    } catch (err) {
        console.error("❌ MongoDB Connection Failed:", err.message);
    }
};

module.exports = connectDB;