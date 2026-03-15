const router = require('express').Router();
const ctrl = require('../controllers/farmerController');

// POST /api/farmers
router.post('/', ctrl.createFarmer);

// GET /api/farmers
router.get('/', ctrl.getFarmers);

// GET /api/farmers/:id
router.get('/:id', ctrl.getFarmer);

module.exports = router;
