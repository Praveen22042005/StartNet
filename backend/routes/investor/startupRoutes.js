const express = require('express');
const router = express.Router();
const Startup = require('../../models/entrepreneur/my-startup');
const auth = require('../../middleware/auth');

router.get('/all', auth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 9;
    const skip = (page - 1) * limit;

    const query = {};
    
    // Add search functionality
    if (req.query.search) {
      query.$or = [
        { startupName: { $regex: req.query.search, $options: 'i' } },
        { industry: { $regex: req.query.search, $options: 'i' } },
        { description: { $regex: req.query.search, $options: 'i' } }
      ];
    }

    // Add industry filter
    if (req.query.industry && req.query.industry !== 'All') {
      query.industry = req.query.industry;
    }

    const startups = await Startup
      .find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Startup.countDocuments(query);

    res.json({
      startups,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        page,
        limit
      }
    });
  } catch (error) {
    console.error('Error fetching startups:', error);
    res.status(500).json({ message: 'Error fetching startups' });
  }
});

module.exports = router;