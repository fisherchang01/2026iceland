const CACHE_PREFIX = 'trip-' + self.registration.scope.replace(/[^a-z0-9]+/gi, '-').toLowerCase();
const SHELL_CACHE = CACHE_PREFIX + 'shell-2026-07-20-carousel-fix';
const DAY_CACHE = CACHE_PREFIX + 'current-days-2026-07-20-carousel-fix';

// 僅預先快取程式、資料與 App 圖示；不預載照片大圖、所有路線圖或 PDF。
const SHELL_ASSETS = [
  './', './index.html', './manifest.webmanifest', './css/style.css',
  './images/app-icon-192.png', './images/app-icon-512.png',
  './data/trip-config.js', './data/budget-config.js', './data/firebase-settings.js', './data/catalog-config.js',
  './data/trip-days.js', './data/trip-details.js', './data/image-manifest.js', './data/travel-content.js',
  './data/budget-content.js', './data/other-content.js', './data/docs-content.js', './data/trip-schema.js',
  './js/nav.js', './js/catalog-nav.js', './js/spot-icons.js', './js/render-itinerary.js', './js/budget.js',
  './js/render-overview.js', './js/render-docs.js', './js/init.js', './js/firebase-config.js'
];

self.addEventListener('install', function(event) {
  event.waitUntil(caches.open(SHELL_CACHE).then(function(cache){ return cache.addAll(SHELL_ASSETS); }).then(function(){ return self.skipWaiting(); }));
});

self.addEventListener('activate', function(event) {
  event.waitUntil(caches.keys().then(function(keys) {
    return Promise.all(keys.filter(function(key){
      return key.indexOf(CACHE_PREFIX) === 0 && key !== SHELL_CACHE && key !== DAY_CACHE;
    }).map(function(key){ return caches.delete(key); }));
  }).then(function(){ return self.clients.claim(); }));
});

// 網頁只傳送「當日＋下一日」的顯示版路線圖及少量縮圖；每次更新會取代上一組。
self.addEventListener('message', function(event) {
  if (!event.data || event.data.type !== 'CACHE_TRIP_DAY_ASSETS') return;
  var allowed = (event.data.assets || []).filter(function(asset) {
    return /^images\/(routes\/[^/]+\.webp|spots\/thumb\/[^/]+\.webp)$/.test(asset);
  }).slice(0, 6).map(function(asset){ return new URL(asset, self.registration.scope).href; });
  event.waitUntil(caches.delete(DAY_CACHE).then(function(){ return caches.open(DAY_CACHE); }).then(function(cache) {
    return Promise.allSettled(allowed.map(function(url){ return cache.add(url); }));
  }));
});

self.addEventListener('fetch', function(event) {
  if (event.request.method !== 'GET') return;
  var url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;

  if (event.request.mode === 'navigate') {
    event.respondWith(fetch(event.request).then(function(response) {
      var copy = response.clone();
      caches.open(SHELL_CACHE).then(function(cache){ cache.put('./index.html', copy); });
      return response;
    }).catch(function(){ return caches.match('./index.html'); }));
    return;
  }

  event.respondWith(caches.match(event.request).then(function(cached) {
    if (cached) return cached;
    return fetch(event.request);
  }));
});
