const CACHE_NAME = 'vintagevision-v2';
const STATIC_CACHE = 'vintagevision-static-v2';
const DYNAMIC_CACHE = 'vintagevision-dynamic-v2';

// Cache strategies
const CACHE_STRATEGIES = {
  CACHE_FIRST: 'cache-first',
  NETWORK_FIRST: 'network-first',
  STALE_WHILE_REVALIDATE: 'stale-while-revalidate',
  NETWORK_ONLY: 'network-only',
  CACHE_ONLY: 'cache-only'
};

// Resources to cache with different strategies
const CACHE_CONFIG = {
  [CACHE_STRATEGIES.CACHE_FIRST]: [
    '/',
    '/static/',
    'https://fonts.googleapis.com/',
    'https://fonts.gstatic.com/',
    '.css',
    '.js',
    '.woff2',
    '.woff',
    '.png',
    '.jpg',
    '.jpeg',
    '.svg',
    '.gif'
  ],
  [CACHE_STRATEGIES.NETWORK_FIRST]: [
    '/api/',
    '.json'
  ],
  [CACHE_STRATEGIES.STALE_WHILE_REVALIDATE]: [
    '/manifest.json',
    '/favicon.ico'
  ]
};

// Install event - cache static resources
self.addEventListener('install', (event) => {
  console.log('[SW] Installing...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        return cache.addAll([
          '/',
          '/manifest.json',
          '/favicon.ico',
          'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap'
        ]);
      })
      .then(() => {
        console.log('[SW] Static resources cached');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('[SW] Failed to cache static resources:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((cacheName) => {
              return cacheName.startsWith('vintagevision-') && 
                     cacheName !== CACHE_NAME && 
                     cacheName !== STATIC_CACHE && 
                     cacheName !== DYNAMIC_CACHE;
            })
            .map((cacheName) => {
              console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            })
        );
      })
      .then(() => {
        console.log('[SW] Old caches cleaned up');
        return self.clients.claim();
      })
  );
});

// Fetch event - handle requests with different strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests and chrome-extension requests
  if (request.method !== 'GET' || url.protocol === 'chrome-extension:') {
    return;
  }
  
  // Determine cache strategy based on request
  const strategy = getCacheStrategy(request);
  
  event.respondWith(handleRequest(request, strategy));
});

// Determine cache strategy based on request
function getCacheStrategy(request) {
  const url = request.url;
  
  // API requests - network first
  if (url.includes('/api/')) {
    return CACHE_STRATEGIES.NETWORK_FIRST;
  }
  
  // Static assets - cache first
  const staticExtensions = ['.css', '.js', '.woff2', '.woff', '.png', '.jpg', '.jpeg', '.svg', '.gif'];
  if (staticExtensions.some(ext => url.includes(ext))) {
    return CACHE_STRATEGIES.CACHE_FIRST;
  }
  
  // Google Fonts - cache first
  if (url.includes('fonts.googleapis.com') || url.includes('fonts.gstatic.com')) {
    return CACHE_STRATEGIES.CACHE_FIRST;
  }
  
  // Manifest and favicon - stale while revalidate
  if (url.includes('/manifest.json') || url.includes('/favicon.ico')) {
    return CACHE_STRATEGIES.STALE_WHILE_REVALIDATE;
  }
  
  // Default to network first
  return CACHE_STRATEGIES.NETWORK_FIRST;
}

// Handle request with specified strategy
async function handleRequest(request, strategy) {
  const cacheName = request.url.includes('/api/') ? DYNAMIC_CACHE : STATIC_CACHE;
  
  switch (strategy) {
    case CACHE_STRATEGIES.CACHE_FIRST:
      return cacheFirst(request, cacheName);
    
    case CACHE_STRATEGIES.NETWORK_FIRST:
      return networkFirst(request, cacheName);
    
    case CACHE_STRATEGIES.STALE_WHILE_REVALIDATE:
      return staleWhileRevalidate(request, cacheName);
    
    case CACHE_STRATEGIES.CACHE_ONLY:
      return caches.match(request);
    
    case CACHE_STRATEGIES.NETWORK_ONLY:
      return fetch(request);
    
    default:
      return networkFirst(request, cacheName);
  }
}

// Cache first strategy
async function cacheFirst(request, cacheName) {
  try {
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    const response = await fetch(request);
    
    if (response.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }
    
    return response;
  } catch (error) {
    console.error('[SW] Cache first error:', error);
    return caches.match(request) || new Response('Offline', { status: 503 });
  }
}

// Network first strategy
async function networkFirst(request, cacheName) {
  try {
    const response = await fetch(request);
    
    if (response.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }
    
    return response;
  } catch (error) {
    console.log('[SW] Network failed, trying cache:', request.url);
    
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return offline page for navigation requests
    if (request.destination === 'document') {
      return caches.match('/') || new Response('Offline', { 
        status: 503,
        headers: { 'Content-Type': 'text/html' }
      });
    }
    
    return new Response('Offline', { status: 503 });
  }
}

// Stale while revalidate strategy
async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cachedResponse = await cache.match(request);
  
  // Update cache in background
  const fetchPromise = fetch(request).then((response) => {
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  }).catch(() => {
    // Silently fail background update
  });
  
  // Return cached response immediately or wait for network
  return cachedResponse || fetchPromise;
}

// Background sync
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    console.log('[SW] Background sync triggered');
    event.waitUntil(handleBackgroundSync());
  }
});

async function handleBackgroundSync() {
  try {
    // Handle queued API calls
    const queuedRequests = await getQueuedRequests();
    
    for (const queuedRequest of queuedRequests) {
      try {
        await fetch(queuedRequest.url, queuedRequest.options);
        await removeFromQueue(queuedRequest.id);
        
        // Notify clients
        self.clients.matchAll().then(clients => {
          clients.forEach(client => {
            client.postMessage({
              type: 'SYNC_SUCCESS',
              data: queuedRequest
            });
          });
        });
      } catch (error) {
        console.error('[SW] Background sync failed for:', queuedRequest.url, error);
      }
    }
    
    console.log('[SW] Background sync completed');
  } catch (error) {
    console.error('[SW] Background sync error:', error);
  }
}

// Queued requests management (simplified - would use IndexedDB in production)
async function getQueuedRequests() {
  // Return empty array for now
  return [];
}

async function removeFromQueue(id) {
  // Remove from IndexedDB queue
}

// Push notifications
self.addEventListener('push', (event) => {
  if (!event.data) {
    console.log('[SW] Push event but no data');
    return;
  }
  
  const data = event.data.json();
  console.log('[SW] Push notification received:', data);
  
  const options = {
    body: data.body,
    icon: '/icon-192.png',
    badge: '/badge-72.png',
    image: data.image,
    tag: data.tag || 'default',
    requireInteraction: data.requireInteraction || false,
    silent: data.silent || false,
    vibrate: data.vibrate || [200, 100, 200],
    data: {
      url: data.url,
      timestamp: Date.now(),
      ...data.data
    },
    actions: data.actions || [
      {
        action: 'view',
        title: 'View',
        icon: '/icon-action-view.png'
      },
      {
        action: 'dismiss',
        title: 'Dismiss',
        icon: '/icon-action-dismiss.png'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notification clicked:', event);
  
  event.notification.close();
  
  const action = event.action;
  const data = event.notification.data;
  
  if (action === 'dismiss') {
    return;
  }
  
  // Default action or 'view' action
  const urlToOpen = data.url || '/';
  
  event.waitUntil(
    self.clients.matchAll({ type: 'window' }).then((clientList) => {
      // Check if app is already open
      for (const client of clientList) {
        if (client.url === urlToOpen && 'focus' in client) {
          return client.focus();
        }
      }
      
      // Open new window/tab
      if (self.clients.openWindow) {
        return self.clients.openWindow(urlToOpen);
      }
    })
  );
});

// Message handling
self.addEventListener('message', (event) => {
  console.log('[SW] Message received:', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Periodic background sync (if supported)
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'wishlist-check') {
    event.waitUntil(checkWishlistMatches());
  }
});

async function checkWishlistMatches() {
  try {
    // Check for new marketplace matches
    const response = await fetch('/api/wishlist/check-matches');
    
    if (response.ok) {
      const matches = await response.json();
      
      if (matches.length > 0) {
        // Send notification about new matches
        self.registration.showNotification('New Vintage Finds!', {
          body: `Found ${matches.length} new matches for your wishlist items`,
          icon: '/icon-192.png',
          tag: 'wishlist-matches',
          data: { matches }
        });
      }
    }
  } catch (error) {
    console.error('[SW] Wishlist check failed:', error);
  }
}

// Handle unhandled promise rejections
self.addEventListener('unhandledrejection', (event) => {
  console.error('[SW] Unhandled promise rejection:', event.reason);
  event.preventDefault();
});

// Handle errors
self.addEventListener('error', (event) => {
  console.error('[SW] Error:', event.error);
});

console.log('[SW] Service Worker loaded');
