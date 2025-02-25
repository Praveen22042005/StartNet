const express = require('express');
const router = express.Router();
const Startup = require('../../models/entrepreneur/my-startup');
const auth = require('../../middleware/auth');

// @route   POST api/entrepreneur/startups
// @desc    Create a new startup
// @access  Private
router.post('/', auth, async (req, res) => {
  console.log('POST /api/entrepreneur/startups - Start');
  try {
    console.log('POST /api/entrepreneur/startups - Request body:', req.body);
    
    // Validate required fields
    const requiredFields = ['startupName', 'industry', 'fundingGoal', 'description', 'address', 'email', 'mobile'];
    const missingFields = requiredFields.filter(field => !req.body[field]);
    
    if (missingFields.length > 0) {
      return res.status(400).json({ 
        message: `Missing required fields: ${missingFields.join(', ')}`
      });
    }

    // Ensure team has at least one member
    if (!req.body.team || !Array.isArray(req.body.team) || req.body.team.length === 0) {
      return res.status(400).json({ 
        message: 'At least one team member is required'
      });
    }

    const newStartup = new Startup({
      ...req.body,
      user: req.user.id // Ensure this is set during creation
    });

    console.log('POST /api/entrepreneur/startups - Creating new startup:', newStartup);
    const startup = await newStartup.save();
    console.log('POST /api/entrepreneur/startups - Startup saved:', startup);
    res.status(201).json(startup);
  } catch (err) {
    console.error('POST /api/entrepreneur/startups - Error:', err);
    if (err.name === 'ValidationError') {
      return res.status(400).json({ 
        message: Object.values(err.errors).map(e => e.message).join(', ')
      });
    }
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
  console.log('POST /api/entrepreneur/startups - End');
});

// @route   GET api/entrepreneur/startups/:id
// @desc    Get startup by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const startup = await Startup.findById(req.params.id)
      .orFail(new Error('Startup not found'));
    res.json(startup);
  } catch (err) {
    if (err.message === 'Startup not found' || err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Startup not found' });
    }
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   GET api/entrepreneur/startups
// @desc    Get all startups for the logged-in entrepreneur
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    // Get the user ID from the auth middleware
    const userId = req.user.id;

    // Find startups where user field matches the logged-in user's ID
    const startups = await Startup.find({ user: userId }).sort({ createdAt: -1 });

    res.json(startups);
  } catch (error) {
    console.error('Error fetching startups:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   PUT api/entrepreneur/startups/:id
// @desc    Update startup details
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    const startup = await Startup.findById(req.params.id)
      .select('+user')
      .orFail(new Error('Startup not found'));

    // Check if user owns the startup
    if (!startup.user || startup.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized to update this startup' });
    }

    const updatedStartup = await Startup.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    ).orFail(new Error('Update failed'));
    
    res.json(updatedStartup);
  } catch (err) {
    console.error('Update error:', err);
    const statusCode = err.message.includes('not found') ? 404 : 500;
    res.status(statusCode).json({ 
      message: err.message.includes('validation') ? 'Invalid data' : err.message 
    });
  }
});

// @route   DELETE api/entrepreneur/startups/:id
// @desc    Delete a startup
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  console.log('DELETE /api/entrepreneur/startups/:id - Start');
  try {
    console.log('DELETE /api/entrepreneur/startups/:id - Request params:', req.params);
    const startup = await Startup.findById(req.params.id);

    if (!startup) {
      console.log('DELETE /api/entrepreneur/startups/:id - Startup not found');
      return res.status(404).json({ message: 'Startup not found' });
    }

    // Make sure user owns startup
    if (startup.user.toString() !== req.user.id) {
      console.log('DELETE /api/entrepreneur/startups/:id - Not authorized');
      return res.status(401).json({ message: 'Not authorized' });
    }

    console.log('DELETE /api/entrepreneur/startups/:id - Removing startup');
    await startup.remove();
    console.log('DELETE /api/entrepreneur/startups/:id - Startup removed');
    res.json({ message: 'Startup removed' });
  } catch (err) {
    console.error('DELETE /api/entrepreneur/startups/:id - Error:', err.message);
    if (err.kind === 'ObjectId') {
      console.log('DELETE /api/entrepreneur/startups/:id - Invalid ObjectId');
      return res.status(404).json({ message: 'Startup not found' });
    }
    res.status(500).json({ message: 'Server Error' });
  }
  console.log('DELETE /api/entrepreneur/startups/:id - End');
});

module.exports = router;