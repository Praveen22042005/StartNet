const bcrypt = require('bcryptjs');
const User = require('../../models/User');

const passwordController = {
  updatePassword: async (req, res) => {
    try {
      console.log('\n=== Password Update Request Received ===');
      console.log('Request Headers:', req.headers);
      console.log('Request Body:', req.body);
      console.log('Authenticated User:', req.user);

      const { currentPassword, newPassword } = req.body;
      const userId = req.user.id;

      if (!currentPassword || !newPassword) {
        console.log('❌ Missing required fields');
        return res.status(400).json({ message: 'Both current and new password are required' });
      }

      // Find user
      console.log('\nLooking up user in database...');
      const user = await User.findById(userId);
      if (!user) {
        console.log('❌ User not found for ID:', userId);
        return res.status(404).json({ message: 'User not found' });
      }

      console.log('✅ User found:', user.email);
      console.log('Stored hashed password:', user.password);

      // Verify current password
      console.log('\nVerifying current password...');
      if (!user.password) {
        console.log('❌ User password is undefined');
        return res.status(400).json({ message: 'Password not set for this user' });
      }
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      console.log('Password match result:', isMatch);
      
      if (!isMatch) {
        console.log('❌ Password mismatch for user:', user.email);
        return res.status(400).json({ message: 'Current password is incorrect' });
      }

      // Validate new password
      console.log('\nValidating new password...');
      if (!newPassword || newPassword.length < 8) {
        console.log('❌ Invalid new password:', newPassword);
        return res.status(400).json({ message: 'New password must be at least 8 characters' });
      }

      // Hash new password
      console.log('\nHashing new password...');
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);
      console.log('New hashed password:', hashedPassword);

      // Update password
      console.log('\nUpdating password in database...');
      user.password = hashedPassword;
      await user.save();

      console.log('\n✅ Password updated successfully for user:', user.email);
      res.json({ message: 'Password updated successfully' });
    } catch (error) {
      console.error('\n❌ Password update error:', error);
      res.status(500).json({ message: 'Server error during password update' });
    }
  }
};

module.exports = { passwordController }; 