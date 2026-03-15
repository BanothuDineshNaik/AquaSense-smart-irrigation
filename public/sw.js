/* ========================================================
   AquaSense — Service Worker (PWA Offline Support)
   ======================================================== */

const CACHE_NAME = 'aquasense-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/admin.html',
  '/css/style.css',
  '/js/app.js',
  '/js/auth.js',
  '/js/admin.js',
  '/js/i18n.js',
  '/js/voice.js',
  '/js/offline-sync.js',
  '/manifest.json',
  '/images/hero-illustration.png',
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Outfit:wght@400;500;600;700;800&display=swap',
  'https://fonts.googleapis.com/css2?family=Noto+Sans+Telugu:wght@400;500;600;700;800&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css',
  'https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js',
];

const API_QUEUE_KEY = 'aquasense_api_queue';

/* ---------- INSTALL — Pre-cache static assets ---------- */
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS).catch((err) => {
        console.warn('[SW] Some assets failed to cache:', err);
        // Cache what we can individually
        return Promise.allSettled(
          STATIC_ASSETS.map((url) => cache.add(url).catch(() => console.warn('[SW] Failed:', url)))
        );
      });
    })
  );
  self.skipWaiting();
});

/* ---------- ACTIVATE — Clean old caches ---------- */
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((names) => {
      return Promise.all(
        names.filter((name) => name !== CACHE_NAME).map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

/* ---------- FETCH — Strategy: Cache-first for static, Network-first for API ---------- */
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // API calls — Network-first with offline queue
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(networkFirstAPI(request));
    return;
  }

  // Static assets — Cache-first
  event.respondWith(cacheFirst(request));
});

/* Cache-first strategy */
async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;

  try {
    const response = await fetch(request);
    // Cache successful responses
    if (response.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }
    return response;
  } catch (err) {
    // If it's a navigation request, serve the cached index.html
    if (request.mode === 'navigate') {
      const cached = await caches.match('/index.html');
      if (cached) return cached;
    }
    throw err;
  }
}

/* Network-first for API calls */
async function networkFirstAPI(request) {
  try {
    const response = await fetch(request);
    return response;
  } catch (err) {
    // If POST request fails (offline), queue it for later sync
    if (request.method === 'POST') {
      const body = await request.clone().text();
      await queueFailedRequest(request.url, body);
    }

    // Return cached response if available
    const cached = await caches.match(request);
    if (cached) return cached;

    // Return a JSON error response
    return new Response(
      JSON.stringify({ error: 'offline', message: 'You are currently offline.' }),
      { status: 503, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

/* Queue failed API request for background sync */
async function queueFailedRequest(url, body) {
  try {
    const clients = await self.clients.matchAll();
    clients.forEach((client) => {
      client.postMessage({
        type: 'API_QUEUED',
        url: url,
        body: body,
      });
    });
  } catch (err) {
    console.warn('[SW] Failed to notify client about queued request:', err);
  }
}

/* ---------- SYNC — Replay queued API calls ---------- */
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-api-queue') {
    event.waitUntil(replayQueue());
  }
});

async function replayQueue() {
  const clients = await self.clients.matchAll();
  clients.forEach((client) => {
    client.postMessage({ type: 'SYNC_START' });
  });
}

/* ---------- MESSAGE — Handle messages from main thread ---------- */
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
