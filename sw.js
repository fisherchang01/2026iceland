const CACHE_PREFIX = 'trip-' + self.registration.scope.replace(/[^a-z0-9]+/gi, '-').toLowerCase();
// ★ 快取版本字串 ★
//
// 這兩個字串只是快取的「名字」，內容叫什麼完全不重要，
// 有意義的只有「跟上一版不一樣」這件事：
//   名字沒變 → 瀏覽器繼續用舊快取 → 使用者看到的還是舊版程式
//   名字變了 → 重新抓取並清掉舊快取 → 使用者拿到新版
//
// 規則（請照做，不要往裡面塞功能名稱）：
//   1. 改動 js/ 或 css/ 之後，把日期改成今天；同一天內第二次改就把 v 往上加
//   2. 只改 data/ 的內容不用動這裡（data/*.js 走 network-first，線上一定拿得到最新版）
//   3. 兩個字串一起改，日期與序號保持一致
//
// 改了什麼請寫在 commit message 與 CHANGELOG，不要寫在這裡——
// 這是開關，不是紀錄。
const SHELL_CACHE = CACHE_PREFIX + 'shell-2026-08-23-v4';
const DAY_CACHE = CACHE_PREFIX + 'current-days-2026-08-23-v4';

// 僅預先快取程式、資料與 App 圖示；不預載照片大圖、所有路線圖或 PDF。
const SHELL_ASSETS = [
  './', './index.html', './manifest.webmanifest', './css/style.css', './css/catalog-editorial.css',
  './css/aurora.css',
  './images/app-icon-192.png', './images/app-icon-512.png',
  './data/trip-config.js', './data/budget-config.js', './data/firebase-settings.js', './data/catalog-config.js',
  './data/trip-days.js', './data/trip-details.js', './data/travel-content.js',
  './data/budget-content.js', './data/other-content.js', './data/docs-content.js', './data/trip-schema.js',
  './data/aurora-config.js',
  './js/nav.js', './js/catalog-nav.js', './js/spot-icons.js', './js/render-itinerary.js', './js/budget.js',
  './js/render-travel.js',
  './js/render-other.js',
  './js/render-overview.js', './js/render-docs.js', './js/render-aurora.js',
  './js/init.js', './js/firebase-config.js'
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

  // data/*.js 走 network-first：這些檔案會被 tools/ 底下的編輯器直接改寫，
  // 但 sw.js 本身不會跟著變，舊的 Service Worker 也就不會重新安裝。
  // 若這裡也用 cache-first，編輯器上傳後手機／PWA 會永遠停在舊內容。
  // 線上一律取最新版並回寫快取，離線時才退回快取。
  if (url.pathname.indexOf('/data/') !== -1) {
    event.respondWith(fetch(event.request).then(function(response) {
      var copy = response.clone();
      caches.open(SHELL_CACHE).then(function(cache){ cache.put(event.request, copy); });
      return response;
    }).catch(function(){ return caches.match(event.request); }));
    return;
  }

  // 其餘 shell 資源維持 cache-first（版本更新靠上方 SHELL_CACHE 字串）。
  event.respondWith(caches.match(event.request).then(function(cached) {
    if (cached) return cached;
    return fetch(event.request);
  }));
});
