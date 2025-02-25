const Profile = require('../../models/entrepreneur/Profile');
const { containerClient } = require('../../config/azureStorage');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

const profileController = {
  // Get profile
  getProfile: async (req, res) => {
    try {
      const userId = req.user.id;
      const profile = await Profile.findOne({ userId });
      
      if (!profile) {
        return res.status(404).json({ message: 'Profile not found' });
      }
      
      res.json(profile);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching profile' });
    }
  },

  // Update profile
  updateProfile: async (req, res) => {
    try {
      const userId = req.user.id;
      const profileData = req.body;

      const profile = await Profile.findOneAndUpdate(
        { userId },
        { ...profileData, updatedAt: new Date() },
        { new: true, upsert: true }
      );

      res.json(profile);
    } catch (error) {
      res.status(500).json({ message: 'Error updating profile' });
    }
  },

  // Delete profile
  deleteProfile: async (req, res) => {
    try {
      const userId = req.user.id;
      await Profile.findOneAndDelete({ userId });
      res.json({ message: 'Profile deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting profile' });
    }
  },

  uploadProfilePicture: async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }

      const userId = req.user.id;
      const blobName = `profile-picture-${userId}-${Date.now()}`;
      const blockBlobClient = containerClient.getBlockBlobClient(blobName);

      // Upload with public access
      await blockBlobClient.uploadData(req.file.buffer, {
        blobHTTPHeaders: { 
          blobContentType: req.file.mimetype,
          blobCacheControl: 'public, max-age=31536000' // 1 year cache
        }
      });

      // Set blob to be publicly accessible
      await blockBlobClient.setAccessTier('Hot');
      await blockBlobClient.setHTTPHeaders({
        blobContentType: req.file.mimetype,
        blobCacheControl: 'public, max-age=31536000'
      });

      const profilePictureUrl = blockBlobClient.url;

      await Profile.findOneAndUpdate(
        { userId },
        { profilePicture: profilePictureUrl },
        { new: true }
      );

      res.json({ profilePicture: profilePictureUrl });
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      res.status(500).json({ message: 'Failed to upload profile picture' });
    }
  }
};

const EntrepreneurProfile = require('../../models/entrepreneur/Profile');
const { entrepreneurContainerClient } = require('../../config/azureStorage');

const entrepreneurProfileController = {
  uploadProfilePicture: async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }

      const userId = req.user.id;
      const blobName = `profile-picture-${userId}-${Date.now()}`;
      const blockBlobClient = entrepreneurContainerClient.getBlockBlobClient(blobName);

      // Upload with public access
      await blockBlobClient.uploadData(req.file.buffer, {
        blobHTTPHeaders: { 
          blobContentType: req.file.mimetype,
          blobCacheControl: 'public, max-age=31536000' // 1 year cache
        }
      });

      // Set blob to be publicly accessible
      await blockBlobClient.setAccessTier('Hot');
      await blockBlobClient.setHTTPHeaders({
        blobContentType: req.file.mimetype,
        blobCacheControl: 'public, max-age=31536000'
      });

      const profilePictureUrl = blockBlobClient.url;

      await EntrepreneurProfile.findOneAndUpdate(
        { userId },
        { profilePicture: profilePictureUrl },
        { new: true }
      );

      res.json({ profilePicture: profilePictureUrl });
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      res.status(500).json({ message: 'Failed to upload profile picture' });
    }
  }
};

module.exports = { profileController, entrepreneurProfileController };