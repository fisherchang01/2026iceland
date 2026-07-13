// 這個檔案是「導覽與頁籤切換邏輯」，一般調整行程/景點內容不需要改這裡，改 data/ 資料夾裡的檔案即可。

// ===== NAVIGATION =====
let currentPage = 'itinerary';
let currentDay  = null;
let currentSpot = null;
let currentSpotArea = null;
let currentGalleryImages = [];  // 燈箱使用的大圖網址陣列
let currentGalleryIndex  = 0;

// 頂端標題列（v6.1）：全站固定顯示同一行文字，不再依頁籤或日期切換內容，
// 文字來源在 data/trip-days.js 的 TRIP_META.bannerTitleHtml，要改標題文字改那邊即可。
function setHeaderDefaultBanner() {
  document.getElementById('headerTitle').innerHTML = TRIP_META.bannerTitleHtml;
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
// 路線圖與景點照片分開管理：列表顯示版放 images/routes/，點擊後的大圖放 images/routes/large/。
// 沒有設定的天數／行程概覽狀態，顯示預留版位，維持整站地圖區塊尺寸一致。
function updateItinMap(dayId) {
  var img = document.getElementById('itinMapImg');
  var placeholder = document.getElementById('itinMapPlaceholder');
  if (!img || !placeholder) return;
  var d = dayId ? TRIP[dayId] : null;
  if (d && d.routeMapImg) {
    img.decoding = 'async';
    img.fetchPriority = 'high';
    img.src = 'images/routes/' + d.routeMapImg;
    img.dataset.largeSrc = 'images/routes/large/' + d.routeMapImg;
    img.style.display = 'block';
    placeholder.style.display = 'none';
  } else {
    img.style.display = 'none';
    img.src = '';
    delete img.dataset.largeSrc;
    placeholder.style.display = 'flex';
  }
}
function openItinMapLightbox() {
  var img = document.getElementById('itinMapImg');
  if (!img || !img.src) return;
  currentGalleryImages = [img.dataset.largeSrc || img.src];
  currentGalleryIndex = 0;
  openLightbox(0);
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
