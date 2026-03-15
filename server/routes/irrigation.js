const router = require('express').Router();
const ctrl = require('../controllers/irrigationController');

// POST /api/calculate-irrigation
router.post('/calculate-irrigation', ctrl.calculateIrrigation);

// GET /api/irrigation-reports
router.get('/irrigation-reports', ctrl.getReports);

module.exports = router;
