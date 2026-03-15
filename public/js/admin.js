/* ========================================================
   AquaSense — Admin Panel Logic
   ======================================================== */

(function () {
  'use strict';

  const $ = (sel) => document.querySelector(sel);

  /* ---------- Hamburger ---------- */
  const hamburger = $('#hamburger');
  const navLinks = $('#nav-links');
  if (hamburger) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      navLinks.classList.toggle('open');
    });
  }

  /* ---------- Fetch Admin Stats ---------- */
  async function loadStats() {
    try {
      const res = await fetch('/api/admin/stats');
      if (!res.ok) throw new Error('Failed');
      const json = await res.json();
      const d = json.data;

      /* Populate stat cards */
      $('#stat-reports').textContent = d.totalReports.toLocaleString();
      $('#stat-farmers').textContent = d.totalFarmers.toLocaleString();
      $('#stat-water-saved').textContent = d.totalWaterSaved.toLocaleString();
      $('#stat-avg-eff').textContent = d.avgEfficiency ? `${d.avgEfficiency}/100` : '—';

      /* Render charts */
      renderCropChart(d.recentReports);
      renderWaterUsageChart(d.recentReports);

      /* Populate table */
      renderTable(d.recentReports);
    } catch (err) {
      console.error('Failed to load admin stats:', err);
      $('#reports-body').innerHTML =
        '<tr><td colspan="9" class="empty-state"><i class="fas fa-exclamation-triangle"></i>Could not load data. Is the server running?</td></tr>';
    }
  }

  /* ---------- Crop Distribution Doughnut ---------- */
  function renderCropChart(reports) {
    const counts = {};
    reports.forEach((r) => {
      counts[r.cropType] = (counts[r.cropType] || 0) + 1;
    });

    const labels = Object.keys(counts).map((k) => k.charAt(0).toUpperCase() + k.slice(1));
    const data = Object.values(counts);
    const colors = ['#16a34a', '#0ea5e9', '#f59e0b', '#8b5cf6', '#ef4444'];

    new Chart($('#cropChart'), {
      type: 'doughnut',
      data: {
        labels,
        datasets: [{ data, backgroundColor: colors.slice(0, labels.length), borderWidth: 0 }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom', labels: { font: { family: 'Inter', size: 13 }, padding: 16 } },
        },
      },
    });
  }

  /* ---------- Water Usage Bar Chart ---------- */
  function renderWaterUsageChart(reports) {
    const recent = reports.slice(0, 10).reverse();
    const labels = recent.map((_, i) => `Report ${i + 1}`);
    const data = recent.map((r) => r.requiredWater);

    new Chart($('#waterUsageChart'), {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: 'Water (L)',
          data,
          backgroundColor: 'rgba(22, 163, 74, 0.6)',
          borderColor: '#16a34a',
          borderWidth: 2,
          borderRadius: 6,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: {
            beginAtZero: true,
            grid: { color: 'rgba(0,0,0,.05)' },
            ticks: { font: { family: 'Inter', size: 12 }, color: '#64748b' },
          },
          x: {
            grid: { display: false },
            ticks: { font: { family: 'Inter', size: 11 }, color: '#64748b' },
          },
        },
      },
    });
  }

  /* ---------- Reports Table ---------- */
  function renderTable(reports) {
    const tbody = $('#reports-body');
    if (!reports || reports.length === 0) {
      tbody.innerHTML =
        '<tr><td colspan="9" class="empty-state"><i class="fas fa-inbox"></i>No irrigation reports yet. Use the calculator first!</td></tr>';
      return;
    }

    tbody.innerHTML = reports
      .map(
        (r, i) => `
      <tr>
        <td>${i + 1}</td>
        <td style="text-transform:capitalize">${r.cropType}</td>
        <td style="text-transform:capitalize">${r.soilType}</td>
        <td>${r.landSize}</td>
        <td>${r.rainfall}</td>
        <td><strong>${r.requiredWater.toLocaleString()}</strong></td>
        <td>${r.efficiencyScore}/100</td>
        <td><span class="badge badge-${r.rainImpact.toLowerCase()}">${r.rainImpact}</span></td>
        <td>${new Date(r.calculatedDate).toLocaleDateString()}</td>
      </tr>`
      )
      .join('');
  }

  /* ---------- Init ---------- */
  loadStats();

})();
