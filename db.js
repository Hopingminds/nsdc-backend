// db.js
require('dotenv').config();
const mongoose = require('mongoose');

const MONGO_URI = 'mongodb+srv://anuj:anuj@cluster0.c7osm.mongodb.net/';

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DATABASE_URL);
        console.log('MongoDB connected successfully');
    } catch (err) {
        console.error('MongoDB connection error:', err.message);
        process.exit(1); // Exit process with failure
    }
};

module.exports = connectDB;

