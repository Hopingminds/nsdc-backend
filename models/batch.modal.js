const mongoose = require('mongoose');

// Define the batch schema
const batchSchema = new mongoose.Schema({
  batchId: {
    type: Number,
    required: true,
    unique: true
  },
  batchName: {
    type: String,
    required: true
  }
}, { timestamps: true });

// Create the Batch model
const Batch = mongoose.model('Batch', batchSchema);

module.exports = Batch;
