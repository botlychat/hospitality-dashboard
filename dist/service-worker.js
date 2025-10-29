/**
 * Service Worker - Simple Cache Strategy
 * Only caches static assets, not HTML pages
 * Minimizes caching issues and errors
 */

const CACHE_NAME = 'hospitality-dashboard-v15';
const STATIC_ASSETS = [
  // CSS files
  '/hospitality-dashboard/css/variables.css',
  '/hospitality-dashboard/css/global.css',
  '/hospitality-dashboard/css/responsive.css',
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
  
  // External CDN (Font Awesome)
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css',
];

/**
 * Install event - cache static assets only
 */
self.addEventListener('install', (event) => {
  console.log('[ServiceWorker] Installing...');
  
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[ServiceWorker] Caching static assets...');
      return cache.addAll(STATIC_ASSETS).catch((error) => {
        console.warn('[ServiceWorker] Some assets failed to cache:', error);
        // Continue even if some assets fail
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
 * Fetch event - network first for everything
 * Falls back to cache only for static assets
 */
self.addEventListener('fetch', (event) => {
  const { request } = event;
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Network first strategy for all requests
  event.respondWith(
    fetch(request)
      .then((response) => {
        // Don't cache non-successful responses
        if (!response || response.status !== 200) {
          return response;
        }

        // Only cache CSS and JS files
        if (request.url.includes('.css') || request.url.includes('.js')) {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseToCache);
          });
        }

        return response;
      })
      .catch(() => {
        // Fallback to cache for static assets only
        return caches.match(request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          // Return offline page or nothing
          return new Response('Offline - please check your connection', {
            status: 503,
            statusText: 'Service Unavailable',
            headers: new Headers({
              'Content-Type': 'text/plain'
            })
          });
        });
      })
  );
});

