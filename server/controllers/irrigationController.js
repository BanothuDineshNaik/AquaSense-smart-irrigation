/* ========================================================
   Irrigation Controller — Core calculation + DB save
   ======================================================== */

const IrrigationReport = require('../models/IrrigationReport');

/* Base crop water requirements (liters per acre) */
const CROP_WATER = {
  rice: 12000,
  cotton: 8000,
  groundnut: 6000,
  maize: 7000,
  sugarcane: 15000,
};

/* Soil multipliers */
const SOIL_MULTIPLIER = {
  sandy: 1.10,
  loamy: 1.00,
  clay: 0.90,
};

/**
 * POST /api/calculate-irrigation
 */
exports.calculateIrrigation = async (req, res) => {
  try {
    const { cropType, soilType, landSize, rainfall } = req.body;

    /* ---------- Validation ---------- */
    if (!cropType || !CROP_WATER[cropType]) {
      return res.status(400).json({ error: 'Invalid or missing cropType.' });
    }
    if (!soilType || !SOIL_MULTIPLIER[soilType]) {
      return res.status(400).json({ error: 'Invalid or missing soilType.' });
    }
    if (!landSize || landSize <= 0) {
      return res.status(400).json({ error: 'landSize must be greater than 0.' });
    }
    if (rainfall === undefined || rainfall === null || rainfall < 0) {
      return res.status(400).json({ error: 'rainfall must be >= 0.' });
    }

    /* ---------- Calculation ---------- */
    // Step 1: base × land
    let water = CROP_WATER[cropType] * landSize;
    const baseWater = water;

    // Step 2: soil adjustment
    water *= SOIL_MULTIPLIER[soilType];

    // Step 3: rainfall adjustment
    const rainfallReduction = rainfall > 10;
    if (rainfallReduction) water *= 0.70;

    water = Math.round(water);

    // Efficiency score
    let efficiencyScore = 50;
    if (soilType === 'clay') efficiencyScore += 15;
    else if (soilType === 'loamy') efficiencyScore += 10;
    if (rainfall > 10) efficiencyScore += 25;
    else if (rainfall > 5) efficiencyScore += 10;
    if (landSize <= 2) efficiencyScore += 5;
    efficiencyScore = Math.min(efficiencyScore, 98);

    // Rainfall impact
    let rainImpact = 'Low';
    if (rainfall > 20) rainImpact = 'High';
    else if (rainfall > 10) rainImpact = 'Medium';

    // Next irrigation
    let nextIrrigation = 'After 3–5 days';
    if (rainfallReduction) nextIrrigation = 'After 5–7 days (rain accounted)';
    if (rainfall > 30) nextIrrigation = 'After 7–10 days (heavy rain)';

    // Water saved vs traditional (base without adjustments)
    const traditionalWater = Math.round(CROP_WATER[cropType] * landSize);
    const waterSaved = Math.max(0, traditionalWater - water);

    /* ---------- Save to DB ---------- */
    const report = await IrrigationReport.create({
      cropType,
      soilType,
      rainfall,
      landSize,
      requiredWater: water,
      efficiencyScore,
      rainImpact,
      nextIrrigation,
      waterSaved,
    });

    /* ---------- Response ---------- */
    res.status(200).json({
      success: true,
      data: {
        reportId: report._id,
        requiredWater: water,
        baseWater: Math.round(baseWater * SOIL_MULTIPLIER[soilType]),
        efficiencyScore,
        rainImpact,
        nextIrrigation,
        waterSaved,
        calculatedDate: report.calculatedDate,
      },
    });
  } catch (err) {
    console.error('Calculation error:', err);
    res.status(500).json({ error: 'Server error during calculation.' });
  }
};

/**
 * GET /api/irrigation-reports
 */
exports.getReports = async (_req, res) => {
  try {
    const reports = await IrrigationReport.find().sort({ calculatedDate: -1 }).limit(50);
    res.json({ success: true, data: reports });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch reports.' });
  }
};
