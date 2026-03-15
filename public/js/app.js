/* ========================================================
   AquaSense — Application Logic
   ======================================================== */

(function () {
  'use strict';

  /* ---------- Helper: Translation ---------- */
  function t(key, replacements) {
    if (window.AquaSenseI18n) return window.AquaSenseI18n.t(key, replacements);
    return key;
  }

  /* ---------- Crop Water Data (liters per acre) ---------- */
  const CROP_WATER = {
    rice: 12000,
    cotton: 8000,
    groundnut: 6000,
    maize: 7000,
    sugarcane: 15000,
  };

  const CROP_LABELS = {
    rice: '🌾 Rice',
    cotton: '🌿 Cotton',
    groundnut: '🥜 Groundnut',
    maize: '🌽 Maize',
    sugarcane: '🎋 Sugarcane',
  };

  /* ---------- Soil Multipliers ---------- */
  const SOIL_MULTIPLIER = {
    sandy: 1.10,
    loamy: 1.00,
    clay: 0.90,
  };

  /* ---------- Water Saving Tip Keys ---------- */
  const TIP_KEYS = [
    'tip.drip', 'tip.morning', 'tip.mulch', 'tip.moisture',
    'tip.rainwater', 'tip.awd', 'tip.level', 'tip.schedule',
  ];

  /* ========================================================
     DOM REFERENCES
     ======================================================== */
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => document.querySelectorAll(sel);

  const loader = $('#page-loader');
  const navbar = $('#navbar');
  const hamburger = $('#hamburger');
  const navLinks = $('#nav-links');
  const form = $('#irrigation-form');
  const formCard = $('#calc-form-card');
  const dashboard = $('#results-dashboard');
  const recalcBtn = $('#recalc-btn');

  /* Form fields */
  const cropField = $('#crop-type');
  const soilField = $('#soil-type');
  const landField = $('#land-size');
  const rainField = $('#rainfall');

  /* Result elements */
  const resultWater = $('#result-water');
  const resultSchedule = $('#result-schedule');
  const resultRainImpact = $('#result-rain-impact');
  const efficiencyRing = $('#efficiency-ring');
  const efficiencyNumber = $('#efficiency-number');
  const efficiencyDesc = $('#efficiency-desc');
  const resultTip = $('#result-tip');

  let waterChart = null;

  /* ========================================================
     PAGE LOADER
     ======================================================== */
  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.classList.add('fade-out');
      setTimeout(() => { loader.style.display = 'none'; }, 600);
    }, 1200);
    animateCounters();
  });

  /* ========================================================
     NAVBAR — scroll effect + hamburger
     ======================================================== */
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
    highlightNav();
  });

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
  });

  /* Close mobile nav on link click */
  $$('.nav-link').forEach((link) => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
    });
  });

  /* Active nav highlight on scroll */
  function highlightNav() {
    const sections = ['hero', 'problem', 'benefits', 'calculator'];
    let current = '';
    sections.forEach((id) => {
      const sec = document.getElementById(id);
      if (sec && window.scrollY >= sec.offsetTop - 120) current = id;
    });
    $$('.nav-link').forEach((l) => {
      l.classList.toggle('active', l.dataset.section === current);
    });
  }

  /* ========================================================
     SCROLL ANIMATION (Intersection Observer)
     ======================================================== */
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          observer.unobserve(e.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  $$('.animate-on-scroll').forEach((el) => observer.observe(el));

  /* ========================================================
     COUNTER ANIMATION (Hero Stats)
     ======================================================== */
  function animateCounters() {
    $$('.stat-number').forEach((el) => {
      const target = +el.dataset.count;
      const duration = 2000;
      const start = performance.now();
      const step = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        el.textContent = Math.floor(progress * target);
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });
  }

  /* ========================================================
     FORM VALIDATION
     ======================================================== */
  function validate() {
    let valid = true;

    const groups = [
      { field: cropField, errorId: 'crop-error' },
      { field: soilField, errorId: 'soil-error' },
      { field: landField, errorId: 'land-error', check: () => +landField.value > 0 },
      { field: rainField, errorId: 'rain-error', check: () => rainField.value !== '' && +rainField.value >= 0 },
    ];

    groups.forEach(({ field, errorId, check }) => {
      const parent = field.closest('.form-group');
      const ok = check ? check() : !!field.value;
      parent.classList.toggle('error', !ok);
      if (!ok) valid = false;
    });

    return valid;
  }

  /* Clear errors on input */
  [cropField, soilField, landField, rainField].forEach((f) => {
    f.addEventListener('input', () => f.closest('.form-group').classList.remove('error'));
    f.addEventListener('change', () => f.closest('.form-group').classList.remove('error'));
  });

  /* ========================================================
     FORM SUBMIT — CALCULATE (API call with local fallback)
     ======================================================== */
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const crop = cropField.value;
    const soil = soilField.value;
    const land = +landField.value;
    const rain = +rainField.value;

    // Show loading state on button
    const calcBtn = $('#calc-btn');
    const calcBtnText = calcBtn.querySelector('[data-i18n="calc.submit"]') || calcBtn;
    const originalText = calcBtn.innerHTML;
    calcBtn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> <span>${t('calc.calculating')}</span>`;
    calcBtn.disabled = true;

    try {
      /* --- Call Backend API --- */
      const response = await fetch('/api/calculate-irrigation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cropType: crop, soilType: soil, landSize: land, rainfall: rain }),
      });

      if (!response.ok) throw new Error('API error');

      const json = await response.json();
      const d = json.data;

      const result = {
        water: d.requiredWater,
        baseWater: d.baseWater,
        efficiency: d.efficiencyScore,
        rainfallImpact: d.rainImpact,
        schedule: d.nextIrrigation,
        waterSaved: d.waterSaved,
      };
      displayResults(result, crop, rain, soil);

      // Save report for offline access
      if (window.AquaSenseOffline) {
        window.AquaSenseOffline.saveReport({ crop, soil, land, rain, ...result, timestamp: Date.now() });
      }
    } catch (err) {
      /* --- Fallback: calculate locally if API is unreachable --- */
      console.warn('API unreachable, using local calculation:', err.message);
      const result = calculate(crop, soil, land, rain);
      displayResults(result, crop, rain, soil);

      // Save report for offline access
      if (window.AquaSenseOffline) {
        window.AquaSenseOffline.saveReport({ crop, soil, land, rain, ...result, timestamp: Date.now() });
      }
    } finally {
      calcBtn.innerHTML = originalText;
      calcBtn.disabled = false;
    }
  });

  /* ========================================================
     CORE CALCULATION
     ======================================================== */
  function calculate(crop, soil, land, rain) {
    // Step 1: base × land
    let water = CROP_WATER[crop] * land;

    // Save pre-adjustment for comparison
    const baseWater = water;

    // Step 2: soil adjustment
    water *= SOIL_MULTIPLIER[soil];

    // Step 3: rainfall adjustment
    const rainfallReduction = rain > 10;
    if (rainfallReduction) water *= 0.70;

    water = Math.round(water);

    // Efficiency score (higher rainfall & better soil = higher efficiency)
    let efficiency = 50; // base
    if (soil === 'clay') efficiency += 15;
    else if (soil === 'loamy') efficiency += 10;
    if (rain > 10) efficiency += 25;
    else if (rain > 5) efficiency += 10;
    if (land <= 2) efficiency += 5;
    efficiency = Math.min(efficiency, 98);

    // Rainfall impact label
    let rainfallImpact = 'Low';
    if (rain > 20) rainfallImpact = 'High';
    else if (rain > 10) rainfallImpact = 'Medium';

    // Schedule suggestion
    let schedule = 'result.schedule.3_5';
    if (rainfallReduction) schedule = 'result.schedule.5_7';
    if (rain > 30) schedule = 'result.schedule.7_10';

    return { water, baseWater, efficiency, rainfallImpact, schedule };
  }

  /* ========================================================
     DISPLAY RESULTS
     ======================================================== */
  function displayResults(res, crop, rain, soil) {
    // Hide form, show dashboard
    formCard.classList.add('hidden');
    dashboard.classList.remove('hidden');

    // Scroll to dashboard
    dashboard.scrollIntoView({ behavior: 'smooth', block: 'start' });

    // Populate values with animation
    animateValue(resultWater, 0, res.water, 1200, true);

    // Translate schedule
    const scheduleText = t(res.schedule) !== res.schedule ? t(res.schedule) : res.schedule;
    resultSchedule.textContent = scheduleText;

    // Translate rainfall impact
    const impactKey = `result.rain.${res.rainfallImpact.toLowerCase()}`;
    const impactText = t(impactKey) !== impactKey ? t(impactKey) : res.rainfallImpact;
    resultRainImpact.textContent = impactText;

    // Color the rainfall impact
    resultRainImpact.style.color =
      res.rainfallImpact === 'High' ? 'var(--color-success)' :
      res.rainfallImpact === 'Medium' ? 'var(--color-warning)' :
      'var(--color-danger)';

    // Efficiency ring
    animateRing(res.efficiency);
    animateValue(efficiencyNumber, 0, res.efficiency, 1400);
    if (res.efficiency >= 75) {
      efficiencyDesc.textContent = t('result.eff.excellent');
    } else if (res.efficiency >= 50) {
      efficiencyDesc.textContent = t('result.eff.good');
    } else {
      efficiencyDesc.textContent = t('result.eff.fair');
    }

    // Tip — translated
    const tipKey = TIP_KEYS[Math.floor(Math.random() * TIP_KEYS.length)];
    resultTip.textContent = t(tipKey);

    // Water saving message
    if (rain > 10) {
      const saved = Math.round(res.baseWater * SOIL_MULTIPLIER[soil || 'loamy'] * 0.30);
      resultTip.textContent += ' ' + t('tip.saving', { amount: saved.toLocaleString() });
    }

    // Chart
    renderChart(crop);

    // Re-observe new animate-on-scroll elements inside dashboard
    $$('.results-dashboard .animate-on-scroll').forEach((el) => {
      el.classList.remove('visible');
      observer.observe(el);
    });

    // Re-apply translations for result section data-i18n elements
    if (window.AquaSenseI18n) {
      window.AquaSenseI18n.applyTranslations();
    }
  }

  /* Listen for language changes to re-translate results if visible */
  window.addEventListener('languageChanged', () => {
    if (dashboard && !dashboard.classList.contains('hidden')) {
      // Re-apply translations to result labels
      if (window.AquaSenseI18n) {
        window.AquaSenseI18n.applyTranslations();
      }
    }
  });

  /* ========================================================
     ANIMATE HELPERS
     ======================================================== */
  function animateValue(el, start, end, duration, format) {
    const startTime = performance.now();
    const step = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const val = Math.floor(start + (end - start) * easeOut(progress));
      el.textContent = format ? val.toLocaleString() : val;
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  function easeOut(t) { return 1 - Math.pow(1 - t, 3); }

  function animateRing(score) {
    const circumference = 2 * Math.PI * 52; // r = 52
    const offset = circumference - (score / 100) * circumference;
    efficiencyRing.style.strokeDasharray = circumference;
    // Start fully offset, then animate
    efficiencyRing.style.strokeDashoffset = circumference;
    requestAnimationFrame(() => {
      efficiencyRing.style.strokeDashoffset = offset;
    });

    // Colour based on score
    if (score >= 75) efficiencyRing.style.stroke = 'var(--color-success)';
    else if (score >= 50) efficiencyRing.style.stroke = 'var(--color-warning)';
    else efficiencyRing.style.stroke = 'var(--color-danger)';
  }

  /* ========================================================
     CHART.JS — Water Comparison Bar Chart
     ======================================================== */
  function renderChart(selectedCrop) {
    const ctx = document.getElementById('waterChart');
    if (!ctx) return;

    if (waterChart) waterChart.destroy();

    const labels = Object.keys(CROP_WATER).map((k) => CROP_LABELS[k]);
    const data = Object.values(CROP_WATER);
    const bgColors = Object.keys(CROP_WATER).map((k) =>
      k === selectedCrop
        ? 'rgba(22, 163, 74, 0.85)'
        : 'rgba(14, 165, 233, 0.25)'
    );
    const borderColors = Object.keys(CROP_WATER).map((k) =>
      k === selectedCrop ? '#16a34a' : '#0ea5e9'
    );

    waterChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: 'Water per Acre (Liters)',
          data,
          backgroundColor: bgColors,
          borderColor: borderColors,
          borderWidth: 2,
          borderRadius: 8,
          borderSkipped: false,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#1e293b',
            titleFont: { family: 'Outfit', size: 14 },
            bodyFont: { family: 'Inter', size: 13 },
            padding: 12,
            cornerRadius: 10,
            callbacks: {
              label: (c) => `${c.parsed.y.toLocaleString()} liters / acre`,
            },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: { color: 'rgba(0,0,0,.05)' },
            ticks: { font: { family: 'Inter', size: 12 }, color: '#64748b' },
          },
          x: {
            grid: { display: false },
            ticks: { font: { family: 'Inter', size: 12 }, color: '#1e293b' },
          },
        },
        animation: { duration: 1200, easing: 'easeOutQuart' },
      },
    });
  }

  /* ========================================================
     RECALCULATE BUTTON
     ======================================================== */
  recalcBtn.addEventListener('click', () => {
    dashboard.classList.add('hidden');
    formCard.classList.remove('hidden');
    formCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });

  /* ========================================================
     SMOOTH SCROLL — all anchor links
     ======================================================== */
  $$('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

})();
