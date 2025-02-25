const mongoose = require('mongoose');

const socialMediaSchema = new mongoose.Schema({
  platform: {
    type: String,
    required: true,
    enum: ['LinkedIn', 'Twitter', 'Instagram', 'GitHub', 'Facebook', 'YouTube']
  },
  url: {
    type: String,
    required: true
  }
});

const skillSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  }
});

const profileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
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
  profilePicture: {
    type: String,
    default: ''
  },
  socialMedia: [socialMediaSchema],
  skills: [skillSchema],
  expertise: [String],
  achievements: [String],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

profileSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

const Profile = mongoose.model('Profile', profileSchema);

module.exports = Profile;