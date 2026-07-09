// 這個檔案是「導覽與頁籤切換邏輯」，一般調整行程/景點內容不需要改這裡，改 data/ 資料夾裡的檔案即可。

// ===== NAVIGATION =====
let currentPage = 'itinerary';
let currentDay  = null;
let currentSpot = null;
let currentSpotArea = null;
let currentGalleryImages = [];  // 目前彈層裡景點照片的檔名陣列，供圖片燈箱切換使用
let currentGalleryIndex  = 0;

function setHeader(title, sub, dayIconSrc, colorClass) {
  document.getElementById('headerContent').innerHTML =
    '<div class="header-title">' + title + '</div>' +
    (sub ? '<div class="header-sub">' + sub + '</div>' : '');
  var iconEl = document.getElementById('headerDayIcon');
  if (dayIconSrc) {
    iconEl.innerHTML = '<img src="' + dayIconSrc + '" alt="" onerror="this.parentElement.style.display=\'none\'" />';
    iconEl.style.display = 'block';
  } else {
    iconEl.innerHTML = '';
    iconEl.style.display = 'none';
  }
  var headerEl = document.getElementById('siteHeader');
  headerEl.className = colorClass ? 'day-mode ' + colorClass : '';
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
    setHeader(TRIP_META.headerTitle, TRIP_META.headerSub);
  }
}

function showOverview() {
  closeSpotSheet();
  currentDay = null; currentSpot = null; currentSpotArea = null;
  showItineraryView('view-overview');
  showBackBtn(false);
  setHeader(TRIP_META.headerTitle, TRIP_META.headerSub);
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
