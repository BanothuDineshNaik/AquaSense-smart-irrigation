const router = require('express').Router();
const ctrl = require('../controllers/adminController');

// GET /api/admin/stats
router.get('/stats', ctrl.getStats);

module.exports = router;
