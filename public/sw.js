// Service Worker for smart caching - Generated at build time
const VERSION = 'mddlek60';
const APP_NAME = 'optcg-themer';
const IS_DEVELOPMENT = self.location.hostname === 'localhost' || self.location.hostname === '127.0.0.1';
const ENVIRONMENT = IS_DEVELOPMENT ? 'dev' : 'prod';

// Environment-aware cache names to prevent cross-app collisions
const CACHE_NAME = `${APP_NAME}-${ENVIRONMENT}-${VERSION}`;
const STATIC_CACHE = `${APP_NAME}-static-${ENVIRONMENT}-${VERSION}`;
const IMAGE_CACHE = `${APP_NAME}-images-${ENVIRONMENT}-${VERSION}`;
const API_CACHE = `${APP_NAME}-api-${ENVIRONMENT}-${VERSION}`;

// URLs to cache on install - Only essential static assets (NO HTML pages)
const STATIC_ASSETS = [
  '/img/logo-op.webp',
  '/img/bg-01.webp',
  '/img/bg-02.webp',
  '/img/bg-03.webp',
  '/manifest.json',
  // Note: Removed HTML pages entirely - not a best practice to cache them
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log(`Service Worker installing with version: ${VERSION} (${ENVIRONMENT})`);
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('Static assets cached');
        // Force the waiting service worker to become the active service worker
        return self.skipWaiting();
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log(`Service Worker activating with version: ${VERSION} (${ENVIRONMENT})`);
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            // Keep only current version caches for this app, delete all others
            const isCurrentAppCache = cacheName.startsWith(`${APP_NAME}-`) && 
              [STATIC_CACHE, IMAGE_CACHE, API_CACHE].includes(cacheName);
            
            if (!isCurrentAppCache) {
              console.log('Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log(`Service Worker activated with version: ${VERSION} (${ENVIRONMENT})`);
        return self.clients.claim();
      })
  );
});

// Fetch event - serve from cache with best-practice strategies
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // Skip chrome-extension and non-http requests
  if (!url.protocol.startsWith('http')) {
    return;
  }

  // Skip caching for different localhost ports in development
  if (IS_DEVELOPMENT && url.hostname === 'localhost' && url.port !== self.location.port) {
    return;
  }

  // Handle different types of requests with appropriate caching strategies
  if (url.pathname.startsWith('/api/images/manifest')) {
    // Manifest API - stale-while-revalidate
    event.respondWith(handleManifestRequest(event.request));
  } else if (url.pathname.startsWith('/api/images/')) {
    // Individual images - cache first with long TTL
    event.respondWith(handleImageRequest(event.request));
  } else if (url.pathname.startsWith('/api/')) {
    // Other API calls - network first with cache fallback
    event.respondWith(handleApiRequest(event.request));
  } else if (url.pathname.startsWith('/_next/static/') || 
             url.pathname.startsWith('/img/') ||
             url.pathname.endsWith('.css') ||
             url.pathname.endsWith('.js') ||
             url.pathname.endsWith('.woff') ||
             url.pathname.endsWith('.woff2')) {
    // Static assets - cache first
    event.respondWith(handleStaticRequest(event.request));
  } else {
    // HTML pages and other requests - network-only (best practice)
    // Let the browser handle these normally without service worker interference
    return;
  }
});

// Cache-first strategy for static assets
async function handleStaticRequest(request) {
  try {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(STATIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.error('Static request failed:', error);
    // Try to serve from cache as fallback
    return caches.match(request) || new Response('Offline', { status: 503 });
  }
}

// Stale-while-revalidate for manifest
async function handleManifestRequest(request) {
  // Don't cache POST requests - let them pass through directly
  if (request.method !== 'GET') {
    return fetch(request);
  }

  try {
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
      // Return cached version immediately, but update in background
      updateManifestInBackground(request);
      return cachedResponse;
    } else {
      // No cache, fetch from network
      const networkResponse = await fetch(request);
      if (networkResponse.ok) {
        const cache = await caches.open(API_CACHE);
        cache.put(request, networkResponse.clone());
      }
      return networkResponse;
    }
  } catch (error) {
    console.error('Manifest request failed:', error);
    return caches.match(request) || new Response('[]', { 
      headers: { 'Content-Type': 'application/json' },
      status: 503 
    });
  }
}

// Background update for manifest
async function updateManifestInBackground(request) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(API_CACHE);
      await cache.put(request, networkResponse.clone());
    }
  } catch (error) {
    // Background updates can fail silently
  }
}

// Image request handling - cache first with long TTL
async function handleImageRequest(request) {
  try {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(IMAGE_CACHE);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.error('Image request failed:', error);
    return caches.match(request) || new Response('Image not available', { status: 503 });
  }
}

// API request handling - network first with short-term caching
async function handleApiRequest(request) {
  // Don't cache POST requests - let them pass through directly
  if (request.method !== 'GET') {
    return fetch(request);
  }

  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(API_CACHE);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.error('API request failed:', error);
    const cachedResponse = await caches.match(request);
    return cachedResponse || new Response('API unavailable', { status: 503 });
  }
}

// Message handling for cache management
self.addEventListener('message', (event) => {
  const { type, data } = event.data;
  
  switch (type) {
    case 'SKIP_WAITING':
      self.skipWaiting();
      break;
      
    case 'GET_CACHE_STATUS':
      getCacheStatus().then(status => {
        event.ports[0].postMessage({ success: true, data: status });
      }).catch(error => {
        event.ports[0].postMessage({ success: false, error: error.message });
      });
      break;
      
    case 'CLEAR_CACHE':
      clearSpecificCache(data.cacheName).then(() => {
        event.ports[0].postMessage({ success: true });
      }).catch(error => {
        event.ports[0].postMessage({ success: false, error: error.message });
      });
      break;
      
    case 'CLEAR_ALL_CACHES':
      clearAllAppCaches().then(() => {
        event.ports[0].postMessage({ success: true });
      }).catch(error => {
        event.ports[0].postMessage({ success: false, error: error.message });
      });
      break;
  }
});

// Cache management functions
async function getCacheStatus() {
  const cacheNames = await caches.keys();
  const appCaches = cacheNames.filter(name => name.startsWith(`${APP_NAME}-`));
  const status = {};
  
  for (const cacheName of appCaches) {
    const cache = await caches.open(cacheName);
    const keys = await cache.keys();
    status[cacheName] = keys.length;
  }
  
  return status;
}

async function clearSpecificCache(cacheName) {
  return await caches.delete(cacheName);
}

async function clearAllAppCaches() {
  const cacheNames = await caches.keys();
  const appCaches = cacheNames.filter(name => name.startsWith(`${APP_NAME}-`));
  
  return Promise.all(appCaches.map(name => caches.delete(name)));
}

// Error handling for uncaught errors
self.addEventListener('error', (event) => {
  console.error('Service Worker error:', event.error);
});

// Handle unhandled promise rejections
self.addEventListener('unhandledrejection', (event) => {
  console.error('Service Worker unhandled rejection:', event.reason);
  event.preventDefault();
});
