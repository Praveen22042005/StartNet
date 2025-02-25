const mongoose = require('mongoose');

const investorProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  profilePicture: {
    type: String,
    default: ''
  },
  fullName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phone: String,
  location: String,
  bio: String,
  socialMedia: [{
    platform: {
      type: String,
      required: true,
      enum: ['LinkedIn', 'Twitter', 'Instagram', 'GitHub', 'Facebook', 'YouTube']
    },
    url: {
      type: String,
      required: true
    }
  }],
  skills: [{
    name: {
      type: String,
      required: true
    }
  }],
  investmentPreferences: [String],
  portfolioSize: String,
  investmentRange: {
    min: Number,
    max: Number
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

investorProfileSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

const InvestorProfile = mongoose.model('InvestorProfile', investorProfileSchema);

module.exports = InvestorProfile;