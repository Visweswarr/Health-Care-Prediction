const mongoose = require('mongoose');

const insuranceSchema = new mongoose.Schema({
  provider: {
    type: String,
    required: true
  },
  planName: {
    type: String,
    required: true
  },
  basePremium: {
    type: Number,
    required: true
  },
  coverage: {
    type: String,
    required: true
  },
  ageMultiplier: {
    type: Number,
    default: 1.0
  },
  genderMultiplier: {
    male: { type: Number, default: 1.0 },
    female: { type: Number, default: 1.0 },
    other: { type: Number, default: 1.0 }
  },
  medicalConditionMultiplier: {
    type: Number,
    default: 1.0
  },
  maxAge: {
    type: Number,
    default: 65
  },
  minAge: {
    type: Number,
    default: 18
  },
  description: {
    type: String,
    required: true
  },
  features: [{
    type: String
  }],
  exclusions: [{
    type: String
  }]
});

module.exports = mongoose.model('Insurance', insuranceSchema); 