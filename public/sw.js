/**
 * Service Worker for Whitstable.shop
 *
 * Handles:
 * - Push notification display
 * - Notification click actions
 * - Offline caching (future)
 */

// Cache name for versioning
const CACHE_NAME = 'whitstable-v1';

// Install event - cache essential assets
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker...');
  // Skip waiting to activate immediately
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker...');
  event.waitUntil(
    Promise.all([
      // Claim all clients
      self.clients.claim(),
      // Clean up old caches
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((name) => name !== CACHE_NAME)
            .map((name) => caches.delete(name))
        );
      }),
    ])
  );
});

// Push notification received
self.addEventListener('push', (event) => {
  console.log('[SW] Push notification received');

  if (!event.data) {
    console.log('[SW] Push event with no data');
    return;
  }

  let payload;
  try {
    payload = event.data.json();
  } catch (e) {
    console.error('[SW] Failed to parse push data:', e);
    payload = {
      title: 'Whitstable.shop',
      body: event.data.text(),
    };
  }

  const options = {
    body: payload.body,
    icon: payload.icon || '/icons/icon-192.png',
    badge: payload.badge || '/icons/badge-72.png',
    image: payload.image,
    tag: payload.tag || 'default',
    data: payload.data || {},
    actions: payload.actions || [],
    requireInteraction: payload.requireInteraction || false,
    vibrate: payload.vibrate || [100, 50, 100],
    // Show timestamp
    timestamp: Date.now(),
  };

  event.waitUntil(
    self.registration.showNotification(payload.title, options)
  );
});

// Notification clicked
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notification clicked:', event.action);

  event.notification.close();

  // Handle action buttons
  if (event.action === 'dismiss') {
    return;
  }

  // Get URL from notification data
  const url = event.notification.data?.url || '/';
  const fullUrl = new URL(url, self.location.origin).href;

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // Check if there's already a window open
      for (const client of clientList) {
        if (client.url === fullUrl && 'focus' in client) {
          return client.focus();
        }
      }
      // Open new window
      if (clients.openWindow) {
        return clients.openWindow(fullUrl);
      }
    })
  );
});

// Notification closed (for analytics)
self.addEventListener('notificationclose', (event) => {
  console.log('[SW] Notification closed:', event.notification.tag);
  // Could send analytics here
});

// Background sync (future use)
self.addEventListener('sync', (event) => {
  console.log('[SW] Background sync:', event.tag);
  // Handle offline actions when back online
});

// Message from main thread
self.addEventListener('message', (event) => {
  console.log('[SW] Message received:', event.data);

  if (event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
