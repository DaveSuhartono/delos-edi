/*
 * Service worker of the EDI launcher. Keeps the launcher's own files so the installed app opens even
 * without a signal; EDI itself (script.google.com) is never cached and always loads live.
 * Change CACHE when the launcher's files change, so phones drop the old copy.
 */
const CACHE = 'edi-launcher-v3'; // v3: the opening bar with a percentage instead of the gears
const FILES = ['./', 'index.html', 'launcher.css', 'launcher.js', 'manifest.webmanifest',
  'edi-app-icon.png', 'edi-app-icon-512.png'];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(FILES)));
});

self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key)))));
});

// Network first (so an update shows at once), the cached copy when offline. Other sites are left alone.
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET' || new URL(event.request.url).origin !== location.origin) return;
  event.respondWith(fetch(event.request).catch(() => caches.match(event.request)));
});
