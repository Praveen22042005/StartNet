const express = require('express');
const router = express.Router();
const { passwordController } = require('../../controllers/auth/passwordController');
const auth = require('../../middleware/auth');

router.put('/update', auth, passwordController.updatePassword);

module.exports = router; 