// src/cartModel.js
const mongoose = require('mongoose');

// Assuming you have a User model


const cartItemSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  items: [
    {
      // productId: { type: String, required: true },
    //   name: { type: String, required: true },
      // price: { type: Number, required: true },
      // quantity: { type: Number, required: true },
    },
  ],
});

const Cart = mongoose.model('Cart', cartItemSchema);

module.exports = Cart;
