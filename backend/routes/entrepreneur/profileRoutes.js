const express = require('express');
const router = express.Router();
const { profileController } = require('../../controllers/entrepreneur/profileController');
const auth = require('../../middleware/auth');
const upload = require('../../config/multer');

// Add all routes
router.get('/', auth, profileController.getProfile);
router.put('/', auth, profileController.updateProfile);
router.delete('/', auth, profileController.deleteProfile);
router.post('/upload-profile-picture', auth, upload.single('file'), profileController.uploadProfilePicture);

module.exports = router; 