const mongoose = require('mongoose');

const irrigationReportSchema = new mongoose.Schema({
  cropType: {
    type: String,
    required: true,
    enum: ['rice', 'cotton', 'groundnut', 'maize', 'sugarcane'],
  },
  soilType: {
    type: String,
    required: true,
    enum: ['sandy', 'loamy', 'clay'],
  },
  rainfall: {
    type: Number,
    required: true,
    min: 0,
  },
  landSize: {
    type: Number,
    required: true,
    min: 0.1,
  },
  requiredWater: {
    type: Number,
    required: true,
  },
  efficiencyScore: {
    type: Number,
    required: true,
  },
  rainImpact: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
  },
  nextIrrigation: {
    type: String,
  },
  waterSaved: {
    type: Number,
    default: 0,
  },
  calculatedDate: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('IrrigationReport', irrigationReportSchema);
