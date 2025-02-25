const express = require('express');
const router = express.Router();
const { investorProfileController } = require('../../controllers/investor/profileController');
const auth = require('../../middleware/auth');
const upload = require('../../config/multer');

router.get('/', auth, investorProfileController.getProfile);
router.put('/', auth, investorProfileController.updateProfile);
router.post('/upload-profile-picture', auth, upload.single('file'), investorProfileController.uploadProfilePicture);

// Add new route to get all investors
router.get('/all', auth, investorProfileController.getAllProfiles);

// On your backend
router.get('/:id', auth, investorProfileController.getProfileById);

module.exports = router;