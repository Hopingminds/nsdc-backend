// src/cartModel.js
const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  personalDetails: {
    namePrefix: { type: String, default: 'Mr' },
    firstName: { type: String, required: true },
    gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
    dob: { type: Date, required: true },
    fatherName: { type: String, required: true },
    guardianName: { type: String, required: false },
  },
  contactDetails: {
    email: { type: String, required: true },
    phone: { type: String, required: true },
    countryCode: { type: String, default: '+91' },
  },
  candidateId: { type: String, required: true, unique: true }
}, { timestamps: true });

const Cart = mongoose.model('Student', cartItemSchema);

module.exports = Cart;
