const express = require('express');
const router = express.Router();
const settingsController = require('../../controllers/investor/settingsController');
const auth = require('../../middleware/auth');

router.put('/update-password', auth, settingsController.updatePassword);
router.delete('/delete-account', auth, settingsController.deleteAccount);

module.exports = router;