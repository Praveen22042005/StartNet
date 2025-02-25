const express = require('express');
const router = express.Router();
const { uploadStartupLogo } = require('../../controllers/entrepreneur/startupLogoController');
const auth = require('../../middleware/auth');
const upload = require('../../config/multer');

router.post('/upload-startup-logo', auth, upload.single('file'), uploadStartupLogo);

module.exports = router;