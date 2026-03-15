/* ========================================================
   Farmer Controller — CRUD operations
   ======================================================== */

const Farmer = require('../models/Farmer');

/**
 * POST /api/farmers — Register a new farmer
 */
exports.createFarmer = async (req, res) => {
  try {
    const { farmerName, location, phoneNumber, landSize } = req.body;

    if (!farmerName || !farmerName.trim()) {
      return res.status(400).json({ error: 'farmerName is required.' });
    }

    const farmer = await Farmer.create({
      farmerName: farmerName.trim(),
      location: location || '',
      phoneNumber: phoneNumber || '',
      landSize: landSize || 0,
    });

    res.status(201).json({ success: true, data: farmer });
  } catch (err) {
    console.error('Create farmer error:', err);
    res.status(500).json({ error: 'Failed to register farmer.' });
  }
};

/**
 * GET /api/farmers — List all farmers
 */
exports.getFarmers = async (_req, res) => {
  try {
    const farmers = await Farmer.find().sort({ createdAt: -1 });
    res.json({ success: true, count: farmers.length, data: farmers });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch farmers.' });
  }
};

/**
 * GET /api/farmers/:id — Get a single farmer
 */
exports.getFarmer = async (req, res) => {
  try {
    const farmer = await Farmer.findById(req.params.id);
    if (!farmer) return res.status(404).json({ error: 'Farmer not found.' });
    res.json({ success: true, data: farmer });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch farmer.' });
  }
};
