const mongoose = require('mongoose');

const experienceSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  jobTitle: {
    type: String,
    required: true
  },
  companyName: {
    type: String,
    required: true
  },
  salary: {
    type: Number,
    required: true
  },
  yearOfJoining: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  questions: {
    technical: [{
      type: String,
      required: true
    }],
    nonTechnical: [{
      type: String,
      required: true
    }]
  },
  rounds: [{
    roundNumber: {
      type: Number,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    keyPoints: [{
      type: String,
      required: true
    }]
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Experience', experienceSchema); 