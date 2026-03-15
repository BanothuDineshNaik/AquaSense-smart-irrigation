/* ========================================================
   AquaSense — Offline Sync & PWA Enhancements
   ======================================================== */

(function () {
  'use strict';

  const QUEUE_KEY = 'aquasense_api_queue';
  const REPORTS_KEY = 'aquasense_offline_reports';
  const MAX_REPORTS = 10;

  let deferredInstallPrompt = null;

  /* ========================================================
     SERVICE WORKER REGISTRATION
     ======================================================== */
  function registerServiceWorker() {
    if (!('serviceWorker' in navigator)) return;

    navigator.serviceWorker
      .register('/sw.js')
      .then((reg) => {
        console.log('[PWA] Service Worker registered:', reg.scope);

        // Listen for updates
        reg.addEventListener('updatefound', () => {
          const newWorker = reg.installing;
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'activated') {
              console.log('[PWA] New Service Worker activated');
            }
          });
        });
      })
      .catch((err) => {
        console.warn('[PWA] Service Worker registration failed:', err);
      });

    // Listen for messages from Service Worker
    navigator.serviceWorker.addEventListener('message', (event) => {
      if (event.data.type === 'API_QUEUED') {
        addToQueue(event.data.url, event.data.body);
      }
      if (event.data.type === 'SYNC_START') {
        replayQueuedRequests();
      }
    });
  }

  /* ========================================================
     OFFLINE / ONLINE DETECTION
     ======================================================== */
  let offlineBanner = null;

  function createOfflineBanner() {
    if (offlineBanner) return;

    offlineBanner = document.createElement('div');
    offlineBanner.className = 'offline-banner';
    offlineBanner.id = 'offline-banner';

    const t = window.AquaSenseI18n ? window.AquaSenseI18n.t : (k) => k;
    offlineBanner.innerHTML = `
      <i class="fas fa-wifi-slash"></i>
      <span data-i18n="offline.banner">${t('offline.banner')}</span>
    `;

    document.body.prepend(offlineBanner);
    requestAnimationFrame(() => offlineBanner.classList.add('visible'));
  }

  function removeOfflineBanner() {
    if (!offlineBanner) return;
    offlineBanner.classList.remove('visible');
    setTimeout(() => {
      if (offlineBanner) {
        offlineBanner.remove();
        offlineBanner = null;
      }
    }, 400);
  }

  function showSyncSuccess() {
    const t = window.AquaSenseI18n ? window.AquaSenseI18n.t : (k) => k;
    const toast = document.createElement('div');
    toast.className = 'sync-toast';
    toast.innerHTML = `
      <i class="fas fa-check-circle"></i>
      <span>${t('offline.synced')}</span>
    `;
    document.body.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add('visible'));
    setTimeout(() => {
      toast.classList.remove('visible');
      setTimeout(() => toast.remove(), 400);
    }, 3000);
  }

  function updateOnlineStatus() {
    if (navigator.onLine) {
      removeOfflineBanner();
      replayQueuedRequests();
    } else {
      createOfflineBanner();
    }
  }

  window.addEventListener('online', updateOnlineStatus);
  window.addEventListener('offline', updateOnlineStatus);

  /* ========================================================
     API REQUEST QUEUE (for offline sync)
     ======================================================== */
  function getQueue() {
    try { return JSON.parse(localStorage.getItem(QUEUE_KEY)) || []; }
    catch { return []; }
  }

  function saveQueue(queue) {
    localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
  }

  function addToQueue(url, body) {
    const queue = getQueue();
    queue.push({ url, body, timestamp: Date.now() });
    saveQueue(queue);
  }

  async function replayQueuedRequests() {
    const queue = getQueue();
    if (queue.length === 0) return;

    const remaining = [];
    let synced = false;

    for (const item of queue) {
      try {
        await fetch(item.url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: item.body,
        });
        synced = true;
      } catch {
        remaining.push(item);
      }
    }

    saveQueue(remaining);

    if (synced) {
      showSyncSuccess();
    }
  }

  /* ========================================================
     OFFLINE REPORTS STORAGE
     ======================================================== */
  function saveReport(report) {
    try {
      let reports = JSON.parse(localStorage.getItem(REPORTS_KEY)) || [];
      reports.unshift({ ...report, savedAt: Date.now() });
      if (reports.length > MAX_REPORTS) reports = reports.slice(0, MAX_REPORTS);
      localStorage.setItem(REPORTS_KEY, JSON.stringify(reports));
    } catch (e) {
      console.warn('[Offline] Failed to save report:', e);
    }
  }

  function getReports() {
    try { return JSON.parse(localStorage.getItem(REPORTS_KEY)) || []; }
    catch { return []; }
  }

  /* ========================================================
     PWA INSTALL PROMPT
     ======================================================== */
  let installBtn = null;

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredInstallPrompt = e;
    showInstallButton();
  });

  function showInstallButton() {
    if (installBtn || !deferredInstallPrompt) return;

    const t = window.AquaSenseI18n ? window.AquaSenseI18n.t : (k) => k;
    installBtn = document.createElement('button');
    installBtn.className = 'pwa-install-btn';
    installBtn.id = 'pwa-install-btn';
    installBtn.innerHTML = `
      <i class="fas fa-download"></i>
      <span data-i18n="pwa.install">${t('pwa.install')}</span>
    `;

    installBtn.addEventListener('click', async () => {
      if (!deferredInstallPrompt) return;
      deferredInstallPrompt.prompt();
      const result = await deferredInstallPrompt.userChoice;
      if (result.outcome === 'accepted') {
        installBtn.remove();
        installBtn = null;
      }
      deferredInstallPrompt = null;
    });

    document.body.appendChild(installBtn);
    setTimeout(() => installBtn.classList.add('visible'), 500);
  }

  window.addEventListener('appinstalled', () => {
    if (installBtn) {
      installBtn.remove();
      installBtn = null;
    }
    deferredInstallPrompt = null;
  });

  /* ========================================================
     INITIALIZE
     ======================================================== */
  function init() {
    registerServiceWorker();

    // Check initial status
    if (!navigator.onLine) {
      createOfflineBanner();
    }

    // Listen for language changes to update banner text
    window.addEventListener('languageChanged', () => {
      if (offlineBanner) {
        const t = window.AquaSenseI18n ? window.AquaSenseI18n.t : (k) => k;
        const span = offlineBanner.querySelector('span');
        if (span) span.textContent = t('offline.banner');
      }
      if (installBtn) {
        const t = window.AquaSenseI18n ? window.AquaSenseI18n.t : (k) => k;
        const span = installBtn.querySelector('span');
        if (span) span.textContent = t('pwa.install');
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  /* ========================================================
     PUBLIC API
     ======================================================== */
  window.AquaSenseOffline = {
    saveReport,
    getReports,
    addToQueue,
    replayQueuedRequests,
    isOnline: () => navigator.onLine,
  };

})();
