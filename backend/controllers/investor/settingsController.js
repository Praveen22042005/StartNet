const bcrypt = require('bcryptjs');
const User = require('../../models/User');
const InvestorProfile = require('../../models/investor/Profile');

const settingsController = {
  updatePassword: async (req, res) => {
    try {
      const { currentPassword, newPassword } = req.body;
      const userId = req.user.id;

      // Find user
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Verify current password
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Current password is incorrect' });
      }

      // Hash new password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
      await user.save();

      res.json({ message: 'Password updated successfully' });
    } catch (error) {
      console.error('Error updating password:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  deleteAccount: async (req, res) => {
    try {
      const userId = req.user.id;

      // Delete investor profile
      await InvestorProfile.findOneAndDelete({ userId });

      // Delete user account
      await User.findByIdAndDelete(userId);

      res.json({ message: 'Account deleted successfully' });
    } catch (error) {
      console.error('Error deleting account:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
};

module.exports = settingsController;