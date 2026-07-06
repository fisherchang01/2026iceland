// 這個檔案是「導覽與頁籤切換邏輯」，一般調整行程/景點內容不需要改這裡，改 data/ 資料夾裡的檔案即可。

// ===== NAVIGATION =====
let currentPage = 'itinerary';
let currentDay  = null;
let currentSpot = null;
let currentSpotArea = null;

function setHeader(title, sub) {
  document.getElementById('headerContent').innerHTML =
    '<div class="header-title">' + title + '</div>' +
    (sub ? '<div class="header-sub">' + sub + '</div>' : '');
}
function showBackBtn(show) {
  document.getElementById('backBtn').style.display = show ? 'flex' : 'none';
}
function showItineraryView(viewId) {
  document.querySelectorAll('#page-itinerary .view').forEach(function(v){ v.classList.remove('active'); });
  document.getElementById(viewId).classList.add('active');
}

function switchTab(tab) {
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
  currentDay = null; currentSpot = null; currentSpotArea = null;
  showItineraryView('view-overview');
  showBackBtn(false);
  setHeader(TRIP_META.headerTitle, TRIP_META.headerSub);
}

function goBack() {
  if (currentPage !== 'itinerary') return;
  if (currentSpot !== null || currentSpotArea !== null) {
    showDay(currentDay);
  } else {
    showOverview();
  }
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
