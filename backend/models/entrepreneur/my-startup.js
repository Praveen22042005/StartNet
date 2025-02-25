const mongoose = require('mongoose');

const startupSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // Basic Information
  startupName: {
    type: String,
    required: true,
    maxlength: 100
  },
  industry: {
    type: String,
    required: true,
    maxlength: 50
  },
  description: {
    type: String,
    required: true,
    maxlength: 500
  },
  startupLogo: {
    type: String,
    default: ''
  },

  // Contact Information
  website: {
    type: String
  },
  address: {
    type: String,
    required: true,
    maxlength: 100
  },
  email: {
    type: String,
    required: true
  },
  mobile: {
    type: String,
    required: true
  },

  // Financial Information
  fundingGoal: {
    type: Number,
    required: true,
    min: 0
  },
  raisedSoFar: {
    type: Number,
    default: 0,
    min: 0
  },

  // Overview
  founded: {
    type: Number,
    required: true
  },
  // Idea & Validation
  problem: {
    type: String,
    required: true,
    maxlength: 300
  },
  solution: {
    type: String,
    required: true,
    maxlength: 300
  },
  traction: {
    type: String,
    required: true,
    maxlength: 250
  },

  // Market & Growth
  targetMarket: {
    type: String,
    required: true,
    maxlength: 100
  },
  tam: {
    type: String,
    required: true,
    maxlength: 50
  },
  demand: {
    type: String,
    required: true,
    maxlength: 150
  },
  scalability: {
    type: String,
    required: true,
    maxlength: 150
  },

  // Competitors & Edge
  competitors: {
    type: String,
    required: true,
    maxlength: 150
  },
  advantage: {
    type: String,
    required: true,
    maxlength: 150
  },

  // Revenue & Financials
  revenueStreams: {
    type: String,
    required: true,
    maxlength: 200
  },
  annualRevenue: {
    type: Number,
    required: true,
    min: 0
  },
  projectedRevenue: {
    type: String,
    required: true,
    maxlength: 100
  },

  // Funding & Investment
  previousFunding: {
    type: String,
    required: true,
    maxlength: 100
  },
  seeking: {
    type: String,
    required: true,
    maxlength: 100
  },
  investorROI: {
    type: String,
    required: true,
    maxlength: 50
  },
  equityAvailable: {
    type: String,
    required: true,
    maxlength: 50
  },

  // Team Members
  team: [{
    name: { 
      type: String, 
      required: true,
      maxlength: 100
    },
    role: { 
      type: String, 
      required: true,
      maxlength: 50
    },
    email: { 
      type: String, 
      required: true 
    },
    linkedIn: { 
      type: String,
      maxlength: 200
    }
  }]
}, {
  timestamps: true
});

// Add indexes for better query performance
startupSchema.index({ startupName: 1 });
startupSchema.index({ industry: 1 });
startupSchema.index({ user: 1 });

module.exports = mongoose.model('Startup', startupSchema);