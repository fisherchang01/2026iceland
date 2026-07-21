// 這個檔案是「導覽與頁籤切換邏輯」，一般調整行程/景點內容不需要改這裡，改 data/ 資料夾裡的檔案即可。

// ===== NAVIGATION =====
let currentPage = 'itinerary';
let currentDay  = null;
let currentSpot = null;
let currentSpotArea = null;
let currentGalleryImages = [];  // 燈箱使用的大圖網址陣列
let currentGalleryIndex  = 0;

// 頂端標題列（v6.1）：全站固定顯示同一行文字，不再依頁籤或日期切換內容，
// 文字來源在 data/trip-config.js，不需要修改核心程式。
function setHeaderDefaultBanner() {
  document.getElementById('headerTitle').innerHTML = TRIP_DATA.config.bannerTitleHtml || TRIP_DATA.config.tripName;
}
function showItineraryView(viewId) {
  document.querySelectorAll('#page-itinerary .view').forEach(function(v){ v.classList.remove('active'); });
  document.getElementById(viewId).classList.add('active');
}

function switchTab(tab) {
  closeSpotSheet();
  document.querySelectorAll('.page').forEach(function(p){ p.classList.remove('active'); });
  document.getElementById('page-' + tab).classList.add('active');
  document.querySelectorAll('.nav-tab').forEach(function(t){ t.classList.remove('active'); });
  document.getElementById('tab-' + tab).classList.add('active');
  currentPage = tab;
  if (tab === 'itinerary') {
    showOverview();
  } else if (tab === 'travel' || tab === 'other') {
    selectCatalogCategory(tab, null);
  }
}

function showOverview() {
  closeSpotSheet();
  currentDay = null; currentSpot = null; currentSpotArea = null;
  showItineraryView('view-overview');
  setItinActive(null);
  updateItinMap(null);
  var headingEl = document.getElementById('itinDayHeading');
  if (headingEl) headingEl.style.display = 'none';
}

// ===== 頂端地圖 + 日期選單列（v6）=====
// 依統一資料模型的 days 順序產生「第1日～第N日」的可橫滑選單。
// 這裡的「第N日」只是使用者看到的顯示編號，
// 跟 data 裡原本的 num 欄位（0~8，用於航班/駕駛小計等內部邏輯）是兩件事，互不影響。
function renderItinSelector() {
  var scrollEl = document.getElementById('itinPillScroll');
  if (!scrollEl) return;
  var html = '';
  TRIP_DATA.days.forEach(function(d, i) {
    html += '<button class="itin-pill" data-day="' + d.id + '" onclick="selectItin(\'' + d.id + '\')">第' + (i + 1) + '日</button>';
  });
  scrollEl.innerHTML = html;
}
function selectItin(target) {
  if (target === 'overview') showOverview();
  else showDay(target);
}
function setItinActive(dayId) {
  var overviewBtn = document.getElementById('itinPillOverview');
  if (overviewBtn) overviewBtn.classList.toggle('active', !dayId);
  document.querySelectorAll('#itinPillScroll .itin-pill').forEach(function(btn) {
    btn.classList.toggle('active', btn.getAttribute('data-day') === dayId);
  });
  if (dayId) {
    var activeBtn = document.querySelector('#itinPillScroll .itin-pill[data-day="' + dayId + '"]');
    if (activeBtn && activeBtn.scrollIntoView) {
      activeBtn.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  } else {
    var scrollEl = document.getElementById('itinPillScroll');
    if (scrollEl) scrollEl.scrollLeft = 0;
  }
}
// 路線圖跟景點照片一樣只保留 thumb+medium 兩層（v13 拿掉 large）：images/routes/ 底下直接放單一尺寸圖，
// 顯示版跟點擊放大燈箱共用同一份檔案，不用再分開放。
// v10 調整：地圖圖片不再固定在頂端，改成插入「行程總覽 / 每日行程」可捲動內容最上面，
// 並改用共用的相片輪播元件（js/render-itinerary.js buildPhotoCarouselHtml），支援多張圖左右滑動。
// 沒有設定圖片的天數／行程概覽狀態，顯示預留版位，維持版面尺寸一致，之後要補圖只需要在
// data/trip-details.js 的 routeMapImg 補上檔名即可（單張填字串，多張改填陣列，如 ['a.webp','b.webp']）。
function normalizeImgList(v) {
  if (!v) return [];
  return Array.isArray(v) ? v : [v];
}
function mapPinIconHtml() {
  return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" style="width:30px;height:30px;opacity:.6"><path d="M21 10c0 6-9 12-9 12s-9-6-9-12a9 9 0 1118 0z"/><circle cx="12" cy="10" r="3"/></svg>';
}
function updateItinMap(dayId) {
  if (typeof buildPhotoCarouselHtml !== 'function') return; // js/render-itinerary.js 尚未載入時安全跳過

  if (!dayId) {
    var overviewMount = document.getElementById('itinMapScrollOverview');
    if (!overviewMount) return;
    var coverFiles = normalizeImgList(TRIP_DATA.config.coverImage);
    overviewMount.innerHTML = buildPhotoCarouselHtml(
      coverFiles, mapPinIconHtml(), TRIP_DATA.config.tripName || '行程总览', 'plain',
      { fallbackLabel: '地图准备中' }
    );
    return;
  }

  var dayMount = document.getElementById('itinMapScrollDay');
  if (!dayMount) return;
  var d = TRIP_DATA.daysById[dayId];
  var routeFiles = d ? normalizeImgList(d.routeMapImg) : [];
  dayMount.innerHTML = buildPhotoCarouselHtml(
    routeFiles.map(function(f){ return 'images/routes/' + f; }),
    mapPinIconHtml(),
    (d && (d.detailTitle || d.title)) || '路线图',
    'plain',
    { fallbackLabel: '地图准备中' }
  );
}

// ===== 景點詳情 Sheet（由下往上彈出，取代整頁跳轉）=====
function openSpotSheet() {
  document.getElementById('spotSheet').classList.add('open');
  document.getElementById('sheetBackdrop').classList.add('open');
  document.getElementById('spotSheet').scrollTop = 0;
  document.querySelector('.spot-sheet-scroll').scrollTop = 0;
  document.body.style.overflow = 'hidden';
}
function closeSpotSheet() {
  document.getElementById('spotSheet').classList.remove('open');
  document.getElementById('sheetBackdrop').classList.remove('open');
  document.body.style.overflow = '';
  currentSpot = null; currentSpotArea = null;
  closeLightbox();
}

function toggleFlightCollapse(header) {
  var body = header.nextElementSibling;
  header.classList.toggle('open');
  body.classList.toggle('open');
}
function toggleTravelCollapse(header) {
  var body = header.nextElementSibling;
  header.classList.toggle('open');
  body.classList.toggle('open');
}
function toggleSubCollapse(header) {
  var body = header.nextElementSibling;
  header.classList.toggle('open');
  body.classList.toggle('open');
}
function toggleCollapse(id, header) {
  var body = document.getElementById(id);
  if (body.classList.contains('open')) {
    body.classList.remove('open'); header.classList.remove('open');
  } else {
    body.classList.add('open'); header.classList.add('open');
    if (id === 'dailyBody') renderDailySummary();
  }
}
