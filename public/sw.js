// EverKind Community Support Service Worker
const CACHE_NAME = 'ekcs-v1.1';
const STATIC_CACHE_URLS = [
  '/',
  '/about-us',
  '/services',
  '/contact-us',
  '/careers',
  '/manifest.json',
  '/web-app-manifest-192x192.png',
  '/web-app-manifest-512x512.png',
  '/apple-icon.png',
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Caching static assets');
        return cache.addAll(STATIC_CACHE_URLS);
      })
      .catch((error) => {
        console.error('[SW] Failed to cache static assets:', error);
      })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker');
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .catch((error) => {
        console.error('[SW] Failed to clean up caches:', error);
      })
  );
  self.clients.claim();
});

// Fetch event - serve from cache with network fallback
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  // Skip external requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  // Skip JavaScript files and other dynamic assets from caching
  if (event.request.url.includes('.js') ||
    event.request.url.includes('.jsx') ||
    event.request.url.includes('.ts') ||
    event.request.url.includes('.tsx') ||
    event.request.url.includes('.hot-update') ||
    event.request.url.includes('/_next/static/chunks/') ||
    event.request.url.includes('/admin') ||
    event.request.url.includes('/api/auth') ||
    event.request.url.includes('/api/')) {
    console.log('[SW] Skipping cache for dynamic asset:', event.request.url);
    return fetch(event.request);
  }

  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          console.log('[SW] Serving from cache:', event.request.url);
          return cachedResponse;
        }

        console.log('[SW] Fetching from network:', event.request.url);
        return fetch(event.request)
          .then((response) => {
            // Only cache static assets and images, not dynamic HTML or API responses
            if (response.status === 200 &&
              (event.request.url.includes('.png') ||
                event.request.url.includes('.jpg') ||
                event.request.url.includes('.jpeg') ||
                event.request.url.includes('.svg') ||
                event.request.url.includes('.ico') ||
                event.request.url.includes('/manifest.json'))) {
              const responseClone = response.clone();
              caches.open(CACHE_NAME)
                .then((cache) => {
                  cache.put(event.request, responseClone);
                })
                .catch((error) => {
                  console.error('[SW] Failed to cache response:', error);
                });
            }
            return response;
          })
          .catch((error) => {
            console.error('[SW] Network request failed:', error);
            // Return offline page or fallback
            return new Response('Offline - Please check your connection', {
              status: 503,
              statusText: 'Service Unavailable'
            });
          });
      })
      .catch((error) => {
        console.error('[SW] Cache match failed:', error);
        return fetch(event.request);
      })
  );
});

// Background sync for form submissions
self.addEventListener('sync', (event) => {
  console.log('[SW] Background sync triggered:', event.tag);

  if (event.tag === 'contact-form-sync') {
    event.waitUntil(syncContactForms());
  }

  if (event.tag === 'career-form-sync') {
    event.waitUntil(syncCareerForms());
  }
});

// Sync contact forms when back online
async function syncContactForms() {
  try {
    // Implementation for syncing offline contact form submissions
    console.log('[SW] Syncing contact forms');
  } catch (error) {
    console.error('[SW] Failed to sync contact forms:', error);
  }
}

// Sync career forms when back online
async function syncCareerForms() {
  try {
    // Implementation for syncing offline career form submissions
    console.log('[SW] Syncing career forms');
  } catch (error) {
    console.error('[SW] Failed to sync career forms:', error);
  }
}

// Message event - handle cache clearing and service worker updates
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    console.log('[SW] Clearing cache on logout');
    event.waitUntil(
      caches.keys()
        .then((cacheNames) => {
          return Promise.all(
            cacheNames.map((cacheName) => {
              console.log('[SW] Deleting cache:', cacheName);
              return caches.delete(cacheName);
            })
          );
        })
        .then(() => {
          console.log('[SW] Cache cleared successfully');
        })
        .catch((error) => {
          console.error('[SW] Failed to clear cache:', error);
        })
    );
  }

  if (event.data && event.data.type === 'SKIP_WAITING') {
    console.log('[SW] Skipping waiting phase');
    self.skipWaiting();
  }
});
