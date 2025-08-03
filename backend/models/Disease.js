const mongoose = require('mongoose');

const diseaseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  symptoms: [{
    type: String,
    required: true
  }],
  description: {
    type: String,
    required: true
  },
  severity: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  treatment: {
    type: String,
    required: true
  },
  prevention: {
    type: String,
    required: true
  },
  riskFactors: [{
    type: String
  }],
  ageGroup: {
    type: String,
    enum: ['child', 'adult', 'elderly', 'all'],
    default: 'all'
  },
  genderPreference: {
    type: String,
    enum: ['male', 'female', 'none'],
    default: 'none'
  }
});

module.exports = mongoose.model('Disease', diseaseSchema); 