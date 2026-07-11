// 這個檔案是「導覽與頁籤切換邏輯」，一般調整行程/景點內容不需要改這裡，改 data/ 資料夾裡的檔案即可。

// ===== NAVIGATION =====
let currentPage = 'itinerary';
let currentDay  = null;
let currentSpot = null;
let currentSpotArea = null;
let currentGalleryImages = [];  // 目前彈層裡景點照片的檔名陣列，供圖片燈箱切換使用
let currentGalleryIndex  = 0;

function setHeader(title, sub, illusSrc, colorClass) {
  document.getElementById('headerContent').innerHTML =
    '<div class="header-title">' + title + '</div>' +
    (sub ? '<div class="header-sub">' + sub + '</div>' : '');
  var illusImg = document.querySelector('#headerIllusBg img');
  illusImg.src = illusSrc || 'images/banners/header-illus.jpg';
  var headerEl = document.getElementById('siteHeader');
  headerEl.className = colorClass ? 'day-mode ' + colorClass : '';
}
// 預設頂端橫列（羅盤 + 標題 + 日期），行程總覽/旅遊/费用/其他頁籤共用，避免各頁重複寫一次橫幅資訊
var HEADER_CALENDAR_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" class="header-sub-icon"><rect x="3" y="4" width="18" height="18" rx="3"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>';
function setHeaderDefaultBanner() {
  setHeader(TRIP_META.bannerTitleHtml, HEADER_CALENDAR_ICON + TRIP_META.bannerDateLine);
}
function showBackBtn(show) {
  document.getElementById('backBtn').style.display = show ? 'flex' : 'none';
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
  } else {
    showBackBtn(false);
    setHeaderDefaultBanner();
  }
}

function showOverview() {
  closeSpotSheet();
  currentDay = null; currentSpot = null; currentSpotArea = null;
  showItineraryView('view-overview');
  showBackBtn(false);
  setHeaderDefaultBanner();
  setItinActive(null);
  updateItinMap(null);
}

// ===== 頂端地圖 + 日期選單列（v6）=====
// 依 TRIP_DAYS 順序產生「第1日～第9日」的可橫滑選單，「行程概覽」固定在最前面不參與橫滑。
// 這裡的「第N日」只是使用者看到的顯示編號（依 TRIP_DAYS 陣列順序 1~9），
// 跟 data 裡原本的 num 欄位（0~8，用於航班/駕駛小計等內部邏輯）是兩件事，互不影響。
function renderItinSelector() {
  var scrollEl = document.getElementById('itinPillScroll');
  if (!scrollEl) return;
  var html = '';
  TRIP_DAYS.forEach(function(d, i) {
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
// 有 d.routeMapImg 就顯示（使用者自行上傳，放在 images/spots/ 底下，跟景點照片同一個資料夾），
// 沒有設定的天數／行程概覽狀態，顯示預留版位，維持整站地圖區塊尺寸一致。
function updateItinMap(dayId) {
  var img = document.getElementById('itinMapImg');
  var placeholder = document.getElementById('itinMapPlaceholder');
  if (!img || !placeholder) return;
  var d = dayId ? TRIP[dayId] : null;
  if (d && d.routeMapImg) {
    img.src = 'images/spots/' + d.routeMapImg;
    img.style.display = 'block';
    placeholder.style.display = 'none';
  } else {
    img.style.display = 'none';
    img.src = '';
    placeholder.style.display = 'flex';
  }
}
function openItinMapLightbox() {
  var img = document.getElementById('itinMapImg');
  if (!img || !img.src) return;
  var filename = img.src.split('/images/spots/')[1] || img.src.split('/').pop();
  currentGalleryImages = [filename];
  currentGalleryIndex = 0;
  openLightbox(0);
}

function goBack() {
  if (isSpotSheetOpen()) { closeSpotSheet(); return; }
  if (currentPage !== 'itinerary') return;
  showOverview();
}

// ===== 景點詳情 Sheet（由下往上彈出，取代整頁跳轉）=====
function isSpotSheetOpen() {
  return document.getElementById('spotSheet').classList.contains('open');
}
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
