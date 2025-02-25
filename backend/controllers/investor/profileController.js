const InvestorProfile = require('../../models/investor/Profile');
const { investorContainerClient } = require('../../config/azureStorage');

const investorProfileController = {
  getProfile: async (req, res) => {
    try {
      const userId = req.user.id;
      const profile = await InvestorProfile.findOne({ userId });
      
      if (!profile) {
        return res.status(404).json({ message: 'Profile not found' });
      }
      
      res.json(profile);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching profile' });
    }
  },

  getProfileById: async (req, res) => {
    try {
      const profile = await InvestorProfile.findById(req.params.id);
      if (!profile) {
        return res.status(404).json({ message: 'Investor profile not found' });
      }
      res.json(profile);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching investor profile' });
    }
  },

  updateProfile: async (req, res) => {
    try {
      const userId = req.user.id;
      const profileData = req.body;

      const profile = await InvestorProfile.findOneAndUpdate(
        { userId },
        { ...profileData, updatedAt: new Date() },
        { new: true, upsert: true }
      );

      res.json(profile);
    } catch (error) {
      res.status(500).json({ message: 'Error updating profile' });
    }
  },

  uploadProfilePicture: async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }

      const userId = req.user.id;
      const blobName = `profile-picture-${userId}-${Date.now()}`;
      const blockBlobClient = investorContainerClient.getBlockBlobClient(blobName);

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

      // Update the profile directly like in entrepreneur profile
      await InvestorProfile.findOneAndUpdate(
        { userId },
        { profilePicture: profilePictureUrl },
        { new: true, upsert: true }
      );

      res.json({ profilePicture: profilePictureUrl });
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      res.status(500).json({ message: 'Failed to upload profile picture' });
    }
  },

  getAllProfiles: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;

      const query = {};
      
      // Add search functionality
      if (req.query.search) {
        query.$or = [
          { fullName: { $regex: req.query.search, $options: 'i' } },
          { location: { $regex: req.query.search, $options: 'i' } },
          { 'skills.name': { $regex: req.query.search, $options: 'i' } }
        ];
      }

      // Add portfolio size filter
      if (req.query.portfolioSize && req.query.portfolioSize !== 'All') {
        query.portfolioSize = req.query.portfolioSize;
      }

      // Add investment range filter
      if (req.query.minInvestment) {
        query['investmentRange.min'] = { $gte: parseInt(req.query.minInvestment) };
      }
      if (req.query.maxInvestment) {
        query['investmentRange.max'] = { $lte: parseInt(req.query.maxInvestment) };
      }

      const investors = await InvestorProfile
        .find(query)
        .select('fullName location profilePicture bio portfolioSize investmentRange skills')
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 });

      const total = await InvestorProfile.countDocuments(query);

      res.json({
        investors,
        pagination: {
          total,
          pages: Math.ceil(total / limit),
          page,
          limit
        }
      });
    } catch (error) {
      console.error('Error fetching investor profiles:', error);
      res.status(500).json({ message: 'Error fetching investor profiles' });
    }
  }
};

// Helper function to get file extension
const getFileExtension = (filename) => {
  const ext = filename.split('.').pop();
  return ext ? `.${ext}` : '';
};

module.exports = { investorProfileController };