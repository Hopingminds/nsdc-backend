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
  },
  assessmentStatus: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

// Create the Batch model
const Batch = mongoose.model('Batch', batchSchema);

module.exports = Batch;
