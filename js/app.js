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

var carIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:13px;height:13px;flex-shrink:0;color:var(--accent)"><path d="M5 17H3a2 2 0 01-2-2v-4a2 2 0 012-2h14l4 4-4 4H5z"/><circle cx="7" cy="17" r="2"/><circle cx="15" cy="17" r="2"/></svg>';

function makeDriveConnector(dist, time) {
  return '<div class="drive-connector">' +
    '<div class="drive-line-wrap"><div class="drive-dot"></div><div class="drive-dashed"></div><div class="drive-dot"></div></div>' +
    '<div class="drive-info">' + carIcon + '<span>🚗 ' + dist + (time ? ' &nbsp;·&nbsp; ⏱ ' + time : '') + '</span></div>' +
    '</div>';
}
function makeWalkConnector(text, detail) {
  return '<div class="walk-connector">' +
    '<div class="drive-line-wrap"><div class="drive-dot"></div><div class="drive-dashed"></div><div class="drive-dot"></div></div>' +
    '<div class="walk-info"><span>🚶 ' + (detail || text) + '</span></div>' +
    '</div>';
}
function makeTramConnector(text, detail) {
  return '<div class="tram-connector">' +
    '<div class="drive-line-wrap"><div class="drive-dot"></div><div class="drive-dashed"></div><div class="drive-dot"></div></div>' +
    '<div class="tram-info"><span>🚋 ' + (detail || text) + '</span></div>' +
    '</div>';
}

function showDay(dayId) {
  var d = TRIP[dayId];
  if (!d) return;
  currentDay = dayId; currentSpot = null; currentSpotArea = null;

  document.querySelectorAll('.page').forEach(function(p){ p.classList.remove('active'); });
  document.getElementById('page-itinerary').classList.add('active');
  document.querySelectorAll('.nav-tab').forEach(function(t){ t.classList.remove('active'); });
  document.getElementById('tab-itinerary').classList.add('active');
  currentPage = 'itinerary';

  showItineraryView('view-day');

  document.getElementById('dayHero').innerHTML =
    '<div class="day-hero-label">DAY ' + d.num + '</div>' +
    '<div class="day-hero-title">' + d.title + '</div>' +
    '<div class="day-hero-date">' + (d.dateLabel || '') + '</div>';

  var listEl = document.getElementById('spotList');

  if (d.transit) {
    var flightHtml = '';
    if (d.flights && d.flights.length) {
      d.flights.forEach(function(f, i) {
        flightHtml += '<div class="flight-segment">' +
          '<div class="flight-header">' +
          '<span class="flight-airline">✈️ ' + f.airline + ' ' + f.flightNo + '</span>' +
          '<span class="flight-date">' + f.date + '</span>' +
          '</div>' +
          '<div class="flight-route">' +
          '<div class="flight-dep"><div class="flight-time">' + f.dep + '</div><div class="flight-airport">' + f.from + '</div></div>' +
          '<div class="flight-arrow">→</div>' +
          '<div class="flight-arr"><div class="flight-time">' + f.arr + '</div><div class="flight-airport">' + f.to + '</div></div>' +
          '<div class="flight-duration">' + f.duration + '</div>' +
          '</div>' +
          (f.note ? '<div class="flight-note">' + f.note + '</div>' : '') +
          '</div>';
        if (i < d.flights.length - 1) {
          flightHtml += '<div class="flight-transfer">🔄 转机等候</div>';
        }
      });
    }
    var hotelHtml = buildHotelHtml(d.hotel);
    listEl.innerHTML =
      '<div class="info-card"><div class="card-label">航班资讯</div>' + flightHtml + '</div>' +
      (d.note ? '<div class="tips-card"><div class="card-label">行程备注</div><p>' + d.note + '</p></div>' : '') +
      hotelHtml;
  } else if (d.isHelsinki) {
    var html = '';
    d.areas.forEach(function(area, aIdx) {
      html += '<div class="area-label">' + area.label + '</div>';
      area.spots.forEach(function(s, sIdx) {
        var clickable = !s.isShop;
        html += '<div class="spot-item' + (s.isShop ? ' no-click' : '') + '"' +
          (clickable ? ' onclick="showSpotHelsinki(\'' + dayId + '\',' + aIdx + ',' + sIdx + ')"' : '') + '>' +
          '<div class="spot-thumb-fallback">' + s.icon + '</div>' +
          '<div class="spot-item-info"><h4>' + s.name + '</h4>' +
          '<p>' + (s.tags ? s.tags.join(' · ') : '') + '</p></div>' +
          (clickable ? '<div class="spot-item-arrow"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg></div>' : '<div style="width:32px;"></div>') +
          '</div>';
        if (s.nextStop) {
          var ns = s.nextStop;
          if (ns.type === 'drive') html += makeDriveConnector(ns.detail, '');
          else if (ns.type === 'walk') html += makeWalkConnector(ns.text, ns.detail);
          else if (ns.type === 'tram') html += makeTramConnector(ns.text, ns.detail);
        }
      });
    });
    html += buildHotelHtml(d.hotel);
    listEl.innerHTML = html;
  } else {
    var html = '';
    d.spots.forEach(function(s, i) {
      var isShop = s.isShop || false;
      var clickable = !isShop;
      html += '<div class="spot-item' + (isShop ? ' no-click' : '') + '"' +
        (clickable ? ' onclick="showSpot(\'' + dayId + '\',' + i + ')"' : '') + '>' +
        '<div class="spot-thumb-fallback">' + s.icon + '</div>' +
        '<div class="spot-item-info"><h4>' + s.name + '</h4>' +
        '<p>' + (s.tags ? s.tags.join(' · ') : '') + '</p></div>' +
        (clickable ? '<div class="spot-item-arrow"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg></div>' : '<div style="width:32px;"></div>') +
        '</div>';
      if (d.drives && d.drives[i]) {
        var dr = d.drives[i];
        html += makeDriveConnector(dr.dist, dr.time);
      } else if (s.nextStop) {
        var ns = s.nextStop;
        if (ns.type === 'walk') html += makeWalkConnector(ns.text, ns.detail);
        else if (ns.type === 'tram') html += makeTramConnector(ns.text, ns.detail);
        else if (ns.type === 'drive') html += makeDriveConnector(ns.detail, '');
      }
    });

    html += buildHotelHtml(d.hotel);

    if (d.driveSummary) {
      html += '<div class="drive-summary-card">' +
        '<div class="drive-summary-icon">🚗</div>' +
        '<div class="drive-summary-info"><h4>今日自驾里程小计</h4><p>总里程：' + d.driveSummary.total + '　总驾驶时间：' + d.driveSummary.time + '</p></div>' +
        '</div>';
    }
    listEl.innerHTML = html;
  }

  showBackBtn(true);
  setHeader(d.title, d.dateLabel || '');
}

function buildHotelHtml(hotel) {
  if (!hotel) return '';
  var hotelMapQuery = hotel.map ? encodeURIComponent(hotel.map) : '';
  var hotelMapBtn = hotel.map ?
    '<a class="map-btn hotel-map-btn" target="_blank" rel="noopener" href="https://www.google.com/maps/search/?api=1&query=' + hotelMapQuery + '">' +
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 6-9 12-9 12s-9-6-9-12a9 9 0 1118 0z"/><circle cx="12" cy="10" r="3"/></svg> Google 导航' +
    '</a>' : '';
  return '<div class="hotel-card">' +
    '<div class="hotel-icon">🏨</div>' +
    '<div class="hotel-info"><h4>' + hotel.name + '</h4><p>' + hotel.note + '</p></div>' +
    '</div>' + hotelMapBtn;
}

function showSpot(dayId, idx) {
  var d = TRIP[dayId];
  if (!d) return;
  var s = d.spots[idx];
  if (!s) return;
  currentDay = dayId; currentSpot = idx; currentSpotArea = null;
  showItineraryView('view-spot');
  renderSpotDetail(s, d);
  showBackBtn(true);
  setHeader(s.name, d.title);
}

function showSpotHelsinki(dayId, aIdx, sIdx) {
  var d = TRIP[dayId];
  if (!d || !d.areas) return;
  var s = d.areas[aIdx].spots[sIdx];
  if (!s) return;
  currentDay = dayId; currentSpot = sIdx; currentSpotArea = aIdx;
  showItineraryView('view-spot');
  renderSpotDetail(s, d);
  showBackBtn(true);
  setHeader(s.name, d.title);
}

function renderSpotDetail(s, d) {
  var tagsHtml = (s.tags || []).map(function(t){ return '<span class="tag">' + t + '</span>'; }).join('');
  var mapQuery = encodeURIComponent(s.map || s.name);

  var parkingHtml = (s.parking || s.toilet) ?
    '<div class="parking-card"><div class="card-label">停车 &amp; 厕所</div><div class="parking-row">' +
    (s.parking ? '<div class="parking-item"><strong>🅿️ 停车：</strong>' + s.parking + '</div>' : '') +
    (s.toilet ? '<div class="parking-item"><strong>🚻 厕所：</strong>' + s.toilet + '</div>' : '') +
    '</div></div>' : '';

  var nextStopHtml = '';
  if (s.nextStop) {
    var ns = s.nextStop;
    var nsIcon = ns.type === 'walk' ? '🚶' : (ns.type === 'tram' ? '🚋' : '🚗');
    nextStopHtml = '<div class="next-stop-card"><div class="next-stop-icon">' + nsIcon + '</div><div class="next-stop-info"><strong>前往下一站：</strong>' + (ns.detail || ns.text) + '</div></div>';
  }

  document.getElementById('spotDetail').innerHTML =
    '<div class="spot-hero">' +
      '<div class="spot-hero-label">' + d.title + '</div>' +
      '<div class="spot-hero-title">' + s.name + '</div>' +
      '<div class="spot-hero-sub">' + (s.tags ? s.tags.join(' · ') : '') + '</div>' +
    '</div>' +
    '<div class="spot-img-wrap"><div class="img-fallback"><span>' + s.icon + '</span><span>暂无图片</span></div></div>' +
    '<div class="tags">' + tagsHtml + '</div>' +
    '<div class="info-card"><div class="card-label">景点介绍</div><p>' + s.desc + '</p></div>' +
    (s.deepDesc ? '<div class="info-card"><div class="card-label">深度介绍</div><p>' + s.deepDesc + '</p></div>' : '') +
    (s.tips ? '<div class="tips-card"><div class="card-label">小提醒</div><p>' + s.tips + '</p></div>' : '') +
    parkingHtml +
    nextStopHtml +
    '<a class="map-btn" target="_blank" rel="noopener" href="https://www.google.com/maps/search/?api=1&query=' + mapQuery + '">' +
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 6-9 12-9 12s-9-6-9-12a9 9 0 1118 0z"/><circle cx="12" cy="10" r="3"/></svg> 在 Google 地图查看' +
    '</a>';
}

// ===== BUDGET =====
const CAT_ICON = { food:'🍽️', activity:'🎫', transport:'🚗', stay:'🏨', shopping:'🛍️', other:'📦' };
const CAT_NAME = { food:'餐饮', activity:'景点活动', transport:'交通', stay:'住宿', shopping:'购物', other:'其他' };
const PEOPLE   = ['小良','老板','小翼','秋燕'];

let selCat          = 'food';
let selPayer        = '小良';
let selParticipants = ['小良','老板','小翼','秋燕'];
let expenses        = JSON.parse(localStorage.getItem('trip_expenses') || '[]');

function selectCat(el) {
  document.querySelectorAll('.cat-btn').forEach(function(b){ b.classList.remove('active'); });
  el.classList.add('active');
  selCat = el.dataset.cat;
}
function selectPayer(el) {
  document.querySelectorAll('#payerGrid .person-simple').forEach(function(c){ c.classList.remove('active'); });
  el.classList.add('active');
  selPayer = el.dataset.p;
}
function toggleParticipant(el) {
  var p = el.dataset.p;
  if (el.classList.contains('active')) {
    if (selParticipants.length <= 1) { showToast('至少选择 1 位'); return; }
    el.classList.remove('active');
    selParticipants = selParticipants.filter(function(x){ return x !== p; });
  } else {
    el.classList.add('active');
    selParticipants.push(p);
  }
}

function getRate(cur) {
  var map = { ISK:'rISK', EUR:'rEUR', USD:'rUSD', TWD:'rTWD', HKD:'rHKD', CNY:null };
  if (cur === 'CNY') return 1;
  var el = document.getElementById(map[cur]);
  return el ? (parseFloat(el.value) || 1) : 1;
}
function toCNY(amount, cur) { return amount * getRate(cur); }
function formatAmount(el, blur) {
  var val = el.value.replace(/,/g,'').replace(/[^0-9.]/g,'');
  if (blur && val) { var n = parseFloat(val); if (!isNaN(n)) el.value = n.toLocaleString('en-US'); }
}
function parseAmount(str) { return parseFloat((str||'').replace(/,/g,'')) || 0; }
function fmtNum(n) { return Math.round(n).toLocaleString('en-US'); }

function saveExpense() {
  var amount = parseAmount(document.getElementById('bAmount').value);
  if (!amount || amount <= 0) { showToast('请输入金额'); return; }
  if (selParticipants.length === 0) { showToast('请选择参与者'); return; }
  var currency = document.getElementById('bCurrency').value;
  var desc = document.getElementById('bDesc').value.trim() || CAT_NAME[selCat];
  var date = document.getElementById('bDate').value;
  expenses.push({ id:Date.now(), cat:selCat, date:date, amount:amount, currency:currency, desc:desc, payer:selPayer, participants:selParticipants.slice() });
  localStorage.setItem('trip_expenses', JSON.stringify(expenses));
  document.getElementById('bAmount').value = '';
  document.getElementById('bDesc').value = '';
  renderExpenses(); renderSummary();
  showToast('✅ 已储存');
}

function deleteExpense(id) {
  expenses = expenses.filter(function(e){ return e.id !== id; });
  localStorage.setItem('trip_expenses', JSON.stringify(expenses));
  renderExpenses(); renderSummary();
  showToast('已删除');
}

function renderExpenses() {
  var el = document.getElementById('expenseList');
  if (!expenses.length) { el.innerHTML = '<div class="expense-empty">尚无消费记录</div>'; return; }
  el.innerHTML = expenses.slice().reverse().map(function(e) {
    var cny = toCNY(e.amount, e.currency);
    return '<div class="expense-item">' +
      '<div class="ei-cat">' + CAT_ICON[e.cat] + '</div>' +
      '<div class="ei-info"><div class="ei-desc">' + e.desc + '</div>' +
      '<div class="ei-meta">' + e.date + ' · ' + e.payer + ' · ' + e.participants.join('、') + '</div></div>' +
      '<div class="ei-right">' +
        '<div class="ei-amount">' + e.amount.toLocaleString('en-US') + ' ' + e.currency + '</div>' +
        '<div class="ei-cny">≈ ¥' + fmtNum(cny) + '</div>' +
        '<button class="ei-del" onclick="deleteExpense(' + e.id + ')">删除</button>' +
      '</div></div>';
  }).join('');
}

function renderSummary() {
  var catTotals={}, personPaid={}, personOwed={}, grandTotal=0;
  PEOPLE.forEach(function(p){ personPaid[p]=0; personOwed[p]=0; });
  expenses.forEach(function(e) {
    var cny = toCNY(e.amount, e.currency);
    catTotals[e.cat] = (catTotals[e.cat]||0) + cny;
    personPaid[e.payer] += cny;
    var share = cny / e.participants.length;
    e.participants.forEach(function(p){ personOwed[p] += share; });
    grandTotal += cny;
  });
  var catBody = document.getElementById('catSummary');
  if (!grandTotal) {
    catBody.innerHTML = '<tr><td colspan="3" style="text-align:center;color:var(--sub);padding:16px;">尚无资料</td></tr>';
  } else {
    catBody.innerHTML = Object.keys(catTotals).map(function(cat) {
      var amt = catTotals[cat];
      return '<tr><td>' + CAT_ICON[cat] + ' ' + CAT_NAME[cat] + '</td><td>¥' + fmtNum(amt) + '</td><td>' + (amt/grandTotal*100).toFixed(1) + '%</td></tr>';
    }).join('') + '<tr class="summary-total"><td>合计</td><td>¥' + fmtNum(grandTotal) + '</td><td>100%</td></tr>';
  }
  var netBody = document.getElementById('netSummary');
  if (!grandTotal) {
    netBody.innerHTML = '<tr><td colspan="4" style="text-align:center;color:var(--sub);padding:16px;">尚无资料</td></tr>';
  } else {
    netBody.innerHTML = PEOPLE.map(function(p) {
      var net = personPaid[p] - personOwed[p];
      var cls = net >= 0 ? 'net-pos' : 'net-neg';
      var sign = net > 0 ? '+' : '';
      return '<tr><td>' + p + '</td><td>¥' + fmtNum(personPaid[p]) + '</td><td>¥' + fmtNum(personOwed[p]) + '</td><td class="' + cls + '">' + sign + '¥' + fmtNum(net) + '</td></tr>';
    }).join('');
  }
  window._dailyTotals = {};
  expenses.forEach(function(e) {
    var cny = toCNY(e.amount, e.currency);
    window._dailyTotals[e.date] = (window._dailyTotals[e.date]||0) + cny;
  });
}

function renderDailySummary() {
  var dailyTotals = window._dailyTotals || {};
  var dailyBody = document.getElementById('dailySummary');
  var dates = Object.keys(dailyTotals).sort();
  if (!dates.length) { dailyBody.innerHTML = '<tr><td colspan="2" style="text-align:center;color:var(--sub);padding:16px;">尚无资料</td></tr>'; return; }
  var total = 0;
  var html = dates.map(function(d){ total += dailyTotals[d]; return '<tr><td>' + d + '</td><td>¥' + fmtNum(dailyTotals[d]) + '</td></tr>'; }).join('');
  html += '<tr class="summary-total"><td>合计</td><td>¥' + fmtNum(total) + '</td></tr>';
  dailyBody.innerHTML = html;
}

function showToast(msg) {
  var t = document.getElementById('toast');
  t.textContent = msg; t.classList.add('show');
  setTimeout(function(){ t.classList.remove('show'); }, 2200);
}

// ===== 由資料檔案渲染畫面（總覽卡片 / 其他頁籤內容）=====
function renderOverview() {
  var html = '';
  html += '<div class="trip-banner">' +
            '<div class="trip-banner-left">' +
              '<h1>' + TRIP_META.bannerTitleHtml + '</h1>' +
              '<p>' + TRIP_META.bannerDateLine + '</p>' +
            '</div>' +
            '<div class="trip-banner-right">' +
              TRIP_META.badges.map(function(b){ return '<div class="banner-badge">' + b + '</div>'; }).join('') +
            '</div>' +
          '</div>';

  TRIP_DAYS.forEach(function(d){
    if (d.sectionLabel) {
      html += '<div class="day-section-label">' + d.sectionLabel + '</div>';
    }
    html += '<div class="day-card ' + d.color + '" onclick="showDay(\'' + d.id + '\')">' +
              '<div class="day-badge"><div class="month">' + d.month + '</div><div class="date">' + d.date + '</div></div>' +
              '<div class="day-card-info"><h3>' + d.title + '</h3><p>' + d.summary + '</p></div>' +
              '<div class="day-card-arrow"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg></div>' +
            '</div>';
  });

  document.getElementById('overviewContent').innerHTML = html;
}

function mountTabContent() {
  document.getElementById('mount-travel').outerHTML = TRAVEL_HTML;
  document.getElementById('mount-budget').outerHTML = BUDGET_HTML;
  document.getElementById('mount-other').outerHTML = OTHER_HTML;
}

// ===== 初始化 =====
mountTabContent();
renderOverview();
setHeader(TRIP_META.headerTitle, TRIP_META.headerSub);
renderExpenses();
renderSummary();
