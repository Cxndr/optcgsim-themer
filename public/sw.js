// Service Worker for aggressive caching
const CACHE_NAME = 'optcg-themer-v1';
const STATIC_CACHE = 'optcg-static-v1';
const IMAGE_CACHE = 'optcg-images-v1';
const API_CACHE = 'optcg-api-v1';

// URLs to cache on install
const STATIC_ASSETS = [
  '/',
  '/create',
  '/guide',
  '/faq',
  '/img/logo-op.webp',
  '/img/bg-01.webp',
  '/img/bg-02.webp',
  '/img/bg-03.webp',
  '/manifest.json',
  // Add more static assets as needed
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('Static assets cached successfully');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('Failed to cache static assets:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (![STATIC_CACHE, IMAGE_CACHE, API_CACHE].includes(cacheName)) {
              console.log('Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('Service Worker activated');
        return self.clients.claim();
      })
  );
});

// Fetch event - implement caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Handle different types of requests with different caching strategies
  if (url.pathname.startsWith('/api/images')) {
    // API responses - stale while revalidate
    event.respondWith(staleWhileRevalidate(request, API_CACHE, 5 * 60 * 1000)); // 5 minutes
  } else if (isImageRequest(request)) {
    // Images - cache first with long expiration
    event.respondWith(cacheFirst(request, IMAGE_CACHE, 24 * 60 * 60 * 1000)); // 24 hours
  } else if (isStaticAsset(request)) {
    // Static assets - cache first
    event.respondWith(cacheFirst(request, STATIC_CACHE, 60 * 60 * 1000)); // 1 hour
  } else if (isNavigationRequest(request)) {
    // Navigation requests - network first with fallback
    event.respondWith(networkFirst(request, STATIC_CACHE));
  }
});

// Cache first strategy - ideal for static assets and images
async function cacheFirst(request, cacheName, maxAge = 0) {
  try {
    const cache = await caches.open(cacheName);
    const cachedResponse = await cache.match(request);

    if (cachedResponse) {
      // Check if cache is still fresh
      const cachedTime = new Date(cachedResponse.headers.get('sw-cached-time') || 0);
      const now = new Date();
      
      if (maxAge === 0 || (now - cachedTime) < maxAge) {
        console.log('Cache hit:', request.url);
        return cachedResponse;
      }
    }

    // Fetch from network and cache
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const responseToCache = networkResponse.clone();
      
      // Add timestamp header for cache expiration
      const headers = new Headers(responseToCache.headers);
      headers.set('sw-cached-time', new Date().toISOString());
      
      const modifiedResponse = new Response(responseToCache.body, {
        status: responseToCache.status,
        statusText: responseToCache.statusText,
        headers: headers
      });
      
      cache.put(request, modifiedResponse);
      console.log('Cached new response:', request.url);
    }

    return networkResponse;
  } catch (error) {
    console.error('Cache first strategy failed:', error);
    
    // Try cache as fallback
    const cache = await caches.open(cacheName);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      console.log('Returning stale cache as fallback:', request.url);
      return cachedResponse;
    }
    
    throw error;
  }
}

// Stale while revalidate strategy - ideal for API responses
async function staleWhileRevalidate(request, cacheName, maxAge = 0) {
  try {
    const cache = await caches.open(cacheName);
    const cachedResponse = await cache.match(request);

    // Always try to fetch fresh data in the background
    const fetchPromise = fetch(request)
      .then((networkResponse) => {
        if (networkResponse.ok) {
          const responseToCache = networkResponse.clone();
          
          // Add timestamp header
          const headers = new Headers(responseToCache.headers);
          headers.set('sw-cached-time', new Date().toISOString());
          
          const modifiedResponse = new Response(responseToCache.body, {
            status: responseToCache.status,
            statusText: responseToCache.statusText,
            headers: headers
          });
          
          cache.put(request, modifiedResponse);
          console.log('Background update cached:', request.url);
        }
        return networkResponse;
      })
      .catch((error) => {
        console.error('Background fetch failed:', error);
      });

    if (cachedResponse) {
      // Check if cache is fresh
      const cachedTime = new Date(cachedResponse.headers.get('sw-cached-time') || 0);
      const now = new Date();
      
      if (maxAge === 0 || (now - cachedTime) < maxAge) {
        console.log('Returning fresh cache:', request.url);
        // Don't await the background fetch
        fetchPromise;
        return cachedResponse;
      }
    }

    // Wait for network if no fresh cache available
    console.log('Waiting for network:', request.url);
    return await fetchPromise;
  } catch (error) {
    console.error('Stale while revalidate failed:', error);
    throw error;
  }
}

// Network first strategy - ideal for navigation requests
async function networkFirst(request, cacheName) {
  try {
    console.log('Network first for:', request.url);
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.error('Network first failed, trying cache:', error);
    
    const cache = await caches.open(cacheName);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      console.log('Returning cached fallback:', request.url);
      return cachedResponse;
    }
    
    throw error;
  }
}

// Helper functions
function isImageRequest(request) {
  const url = new URL(request.url);
  const pathname = url.pathname.toLowerCase();
  return pathname.match(/\.(jpg|jpeg|png|webp|gif|svg|ico)$/) ||
         url.hostname === 'drive.google.com' ||
         url.hostname === 'lh3.googleusercontent.com' ||
         url.hostname === 'drive.usercontent.google.com';
}

function isStaticAsset(request) {
  const url = new URL(request.url);
  const pathname = url.pathname.toLowerCase();
  return pathname.match(/\.(js|css|woff|woff2|ttf|eot)$/) ||
         pathname.startsWith('/img/') ||
         pathname.startsWith('/fonts/') ||
         pathname === '/manifest.json';
}

function isNavigationRequest(request) {
  return request.mode === 'navigate' ||
         (request.method === 'GET' &&
          request.headers.get('accept').includes('text/html'));
}

// Message handling for cache management
self.addEventListener('message', (event) => {
  const { type, data } = event.data;

  switch (type) {
    case 'CLEAR_CACHE':
      clearCache(data.cacheName)
        .then(() => {
          event.ports[0].postMessage({ success: true });
        })
        .catch((error) => {
          event.ports[0].postMessage({ success: false, error: error.message });
        });
      break;
      
    case 'CLEAR_ALL_CACHES':
      clearAllCaches()
        .then(() => {
          event.ports[0].postMessage({ success: true });
        })
        .catch((error) => {
          event.ports[0].postMessage({ success: false, error: error.message });
        });
      break;
      
    case 'GET_CACHE_STATUS':
      getCacheStatus()
        .then((status) => {
          event.ports[0].postMessage({ success: true, data: status });
        })
        .catch((error) => {
          event.ports[0].postMessage({ success: false, error: error.message });
        });
      break;
  }
});

async function clearCache(cacheName) {
  console.log('Clearing cache:', cacheName);
  return await caches.delete(cacheName);
}

async function clearAllCaches() {
  console.log('Clearing all caches');
  const cacheNames = await caches.keys();
  return Promise.all(cacheNames.map(cacheName => caches.delete(cacheName)));
}

async function getCacheStatus() {
  const cacheNames = await caches.keys();
  const status = {};
  
  for (const cacheName of cacheNames) {
    const cache = await caches.open(cacheName);
    const keys = await cache.keys();
    status[cacheName] = keys.length;
  }
  
  return status;
} 