/**
 * Service Worker - Cache First Strategy
 * Caches sidebar, CSS, JS, and static assets for fast loading and offline support
 */

const CACHE_NAME = 'hospitality-dashboard-v1';
const ASSETS_TO_CACHE = [
  // HTML files
  '/',
  '/hospitality-dashboard/',
  '/hospitality-dashboard/index.html',
  '/hospitality-dashboard/dashboard.html',
  '/hospitality-dashboard/calendar.html',
  '/hospitality-dashboard/units.html',
  '/hospitality-dashboard/contacts.html',
  '/hospitality-dashboard/aiagent.html',
  '/hospitality-dashboard/website.html',
  '/hospitality-dashboard/business-info.html',
  
  // CSS files
  '/hospitality-dashboard/css/variables.css',
  '/hospitality-dashboard/css/global.css',
  '/hospitality-dashboard/css/responsive.css',
  '/hospitality-dashboard/css/profile.css',
  '/hospitality-dashboard/css/dashboard.css',
  '/hospitality-dashboard/css/calendar.css',
  '/hospitality-dashboard/css/units.css',
  '/hospitality-dashboard/css/contacts.css',
  '/hospitality-dashboard/css/aiagent.css',
  '/hospitality-dashboard/css/website.css',
  
  // JavaScript files
  '/hospitality-dashboard/js/storage.js',
  '/hospitality-dashboard/js/utils.js',
  '/hospitality-dashboard/js/components.js',
  '/hospitality-dashboard/js/components/profile.js',
  '/hospitality-dashboard/js/page-loader.js',
  
  // External CDN (Font Awesome)
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css',
];

/**
 * Install event - cache assets
 */
self.addEventListener('install', (event) => {
  console.log('[ServiceWorker] Installing...');
  
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[ServiceWorker] Caching assets...');
      return cache.addAll(ASSETS_TO_CACHE).catch((error) => {
        console.warn('[ServiceWorker] Some assets failed to cache:', error);
        // Continue even if some assets fail to cache
      });
    })
  );
});

/**
 * Activate event - clean up old caches
 */
self.addEventListener('activate', (event) => {
  console.log('[ServiceWorker] Activating...');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[ServiceWorker] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  
  self.clients.claim();
});

/**
 * Fetch event - serve from cache, fallback to network
 * Cache first strategy for assets, network first for pages
 */
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Strategy for HTML pages - network first with cache fallback
  if (request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Cache successful responses
          if (response.status === 200) {
            const cache = caches.open(CACHE_NAME);
            cache.then((c) => c.put(request, response.clone()));
          }
          return response;
        })
        .catch(() => {
          // Fallback to cache
          return caches.match(request);
        })
    );
    return;
  }

  // Strategy for assets (CSS, JS, fonts) - cache first with network fallback
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(request).then((response) => {
        // Don't cache non-successful responses
        if (!response || response.status !== 200) {
          return response;
        }

        // Clone the response
        const responseToCache = response.clone();

        caches.open(CACHE_NAME).then((cache) => {
          cache.put(request, responseToCache);
        });

        return response;
      });
    }).catch(() => {
      // Return cached version or offline page
      return caches.match(request);
    })
  );
});
