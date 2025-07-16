const CACHE_NAME = 'notas-app-v1';
const URLS_TO_CACHE = [
  './',
  './index.html',
  './style.css',
  './app.js',
  './manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(URLS_TO_CACHE))
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.url.includes('data.json')) return;

  event.respondWith(
    caches.match(event.request).then((response) => response || fetch(event.request))
  );
});

