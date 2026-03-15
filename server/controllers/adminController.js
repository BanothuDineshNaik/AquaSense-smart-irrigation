/* ========================================================
   Admin Controller — Dashboard statistics
   ======================================================== */

const IrrigationReport = require('../models/IrrigationReport');
const Farmer = require('../models/Farmer');

/**
 * GET /api/admin/stats
 */
exports.getStats = async (_req, res) => {
  try {
    const [totalReports, totalFarmers, waterAgg, recentReports] = await Promise.all([
      IrrigationReport.countDocuments(),
      Farmer.countDocuments(),
      IrrigationReport.aggregate([
        {
          $group: {
            _id: null,
            totalWaterSaved: { $sum: '$waterSaved' },
            totalWaterUsed: { $sum: '$requiredWater' },
            avgEfficiency: { $avg: '$efficiencyScore' },
          },
        },
      ]),
      IrrigationReport.find().sort({ calculatedDate: -1 }).limit(20).lean(),
    ]);

    const agg = waterAgg[0] || { totalWaterSaved: 0, totalWaterUsed: 0, avgEfficiency: 0 };

    res.json({
      success: true,
      data: {
        totalReports,
        totalFarmers,
        totalWaterSaved: Math.round(agg.totalWaterSaved),
        totalWaterUsed: Math.round(agg.totalWaterUsed),
        avgEfficiency: Math.round(agg.avgEfficiency),
        recentReports,
      },
    });
  } catch (err) {
    console.error('Admin stats error:', err);
    res.status(500).json({ error: 'Failed to fetch admin stats.' });
  }
};
