const fs = require('fs');
const path = require('path');

// Generate unique version from environment variables
const generateVersion = () => {
  // Use Vercel's commit SHA if available, fallback to timestamp
  const commitSha = process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 8);
  const timestamp = Date.now().toString(36);
  
  return commitSha || timestamp;
};

// Service worker template
const generateServiceWorker = (version) => `// Service Worker for aggressive caching - Generated at build time
const VERSION = '${version}';
const CACHE_NAME = \`optcg-themer-\${VERSION}\`;
const STATIC_CACHE = \`optcg-static-\${VERSION}\`;
const IMAGE_CACHE = \`optcg-images-\${VERSION}\`;
const API_CACHE = \`optcg-api-\${VERSION}\`;

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
  console.log('Service Worker installing with version:', VERSION);
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
  console.log('Service Worker activating with version:', VERSION);
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            // Keep only current version caches, delete all others
            if (![STATIC_CACHE, IMAGE_CACHE, API_CACHE].includes(cacheName)) {
              console.log('Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('Service Worker activated with version:', VERSION);
        return self.clients.claim();
      })
  );
});

// Fetch event - serve from cache with fallback strategies
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // Skip chrome-extension and non-http requests
  if (!url.protocol.startsWith('http')) {
    return;
  }

  // Handle different types of requests with appropriate caching strategies
  if (url.pathname.startsWith('/api/images/manifest')) {
    // Manifest API - cache first with background update
    event.respondWith(handleManifestRequest(event.request));
  } else if (url.pathname.startsWith('/api/images/')) {
    // Individual images - cache first with long TTL
    event.respondWith(handleImageRequest(event.request));
  } else if (url.pathname.startsWith('/api/')) {
    // Other API calls - network first with cache fallback
    event.respondWith(handleApiRequest(event.request));
  } else if (url.pathname.startsWith('/_next/static/') || 
             url.pathname.startsWith('/img/') ||
             STATIC_ASSETS.includes(url.pathname)) {
    // Static assets - cache first
    event.respondWith(handleStaticRequest(event.request));
  } else {
    // Pages and other requests - network first with cache fallback
    event.respondWith(handlePageRequest(event.request));
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

// Manifest handling - cache first with background update
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

// API request handling - network first
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

// Page request handling - network first with cache fallback
async function handlePageRequest(request) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(STATIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.error('Page request failed:', error);
    const cachedResponse = await caches.match(request);
    return cachedResponse || new Response('Page not available offline', { 
      status: 503,
      headers: { 'Content-Type': 'text/html' }
    });
  }
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
`;

// Main execution
const main = () => {
  const version = generateVersion();
  const swContent = generateServiceWorker(version);
  const outputPath = path.join(process.cwd(), 'public', 'sw.js');
  
  console.log(`🔨 Generating service worker with version: ${version}`);
  
  fs.writeFileSync(outputPath, swContent, 'utf8');
  
  console.log(`✅ Service worker generated at: ${outputPath}`);
  console.log(`📦 Cache names will be:`);
  console.log(`   - optcg-themer-${version}`);
  console.log(`   - optcg-static-${version}`);
  console.log(`   - optcg-images-${version}`);
  console.log(`   - optcg-api-${version}`);
};

if (require.main === module) {
  main();
}

module.exports = { generateVersion, generateServiceWorker }; 