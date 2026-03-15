const mongoose = require('mongoose');

const farmerSchema = new mongoose.Schema({
  farmerName: {
    type: String,
    required: [true, 'Farmer name is required'],
    trim: true,
  },
  location: {
    type: String,
    trim: true,
    default: '',
  },
  phoneNumber: {
    type: String,
    trim: true,
    default: '',
  },
  landSize: {
    type: Number,
    min: 0,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Farmer', farmerSchema);
