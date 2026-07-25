// 首頁「當下導向」與完整行程總覽。旅程內容只讀取 TRIP_DATA。

function getTripDateKey(date) {
  if (typeof date === 'string') return date;
  var formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: TRIP_DATA.config.timezone,
    year: 'numeric', month: '2-digit', day: '2-digit'
  });
  var parts = formatter.formatToParts(date || new Date());
  var values = {};
  parts.forEach(function(part){ values[part.type] = part.value; });
  return values.year + '-' + values.month + '-' + values.day;
}

function getTripDayContext(referenceDate) {
  var days = TRIP_DATA.days;
  if (!days.length) return null;
  var today = getTripDateKey(referenceDate);
  var exactIndex = days.findIndex(function(day){ return day.date === today; });
  if (exactIndex >= 0) return { state:'today', day:days[exactIndex], index:exactIndex, today:today, countdown:0 };
  var firstDate = days[0].date;
  var lastDate = days[days.length - 1].date;
  if (today < firstDate) {
    return { state:'upcoming', day:days[0], index:0, today:today, countdown:daysBetween(today, firstDate) };
  }
  if (today > lastDate) {
    return { state:'complete', day:days[days.length - 1], index:days.length - 1, today:today, countdown:0 };
  }
  var nextIndex = days.findIndex(function(day){ return day.date > today; });
  return { state:'between', day:days[nextIndex], index:nextIndex, today:today, countdown:daysBetween(today, days[nextIndex].date) };
}

function daysBetween(from, to) {
  return Math.max(0, Math.round((Date.parse(to + 'T00:00:00Z') - Date.parse(from + 'T00:00:00Z')) / 86400000));
}

function getDaySpots(day) {
  var spots = (day.spots || []).slice();
  (day.areas || []).forEach(function(area){ spots = spots.concat(area.spots || []); });
  return spots;
}

function getDayPrimaryStop(day) {
  var spots = getDaySpots(day);
  if (spots.length) return { name:spots[0].name, map:spots[0].map || '', icon:spots[0].icon || '📍' };
  if (day.flights && day.flights.length) {
    var flight = day.flights[0];
    return { name:'航班 ' + flight.flightNo + ' · ' + flight.from + ' → ' + flight.to, map:'', icon:'✈️' };
  }
  return null;
}

function getDayReminders(day) {
  if (Array.isArray(day.reminders) && day.reminders.length) return day.reminders.slice(0, 2);
  var reminders = getDaySpots(day).filter(function(spot){ return !!spot.tips; }).slice(0, 2).map(function(spot){ return spot.tips; });
  if (!reminders.length && day.note) reminders.push(day.note);
  return reminders;
}

function getOfflineDayAssetUrls() {
  var context = getTripDayContext();
  if (!context) return [];
  var selected = [context.day];
  if (context.index + 1 < TRIP_DATA.days.length) selected.push(TRIP_DATA.days[context.index + 1]);
  var assets = [];
  selected.forEach(function(day) {
    normalizeImgList(day.routeMapImg).forEach(function(f){ assets.push('images/routes/' + f); });
    getDaySpots(day).filter(function(spot){ return getSpotImages(spot).length > 0; }).slice(0, 2).forEach(function(spot) {
      var images = getSpotImages(spot);
      if (images.length) assets.push(spotImagePath(images[0], 'thumb'));
    });
  });
  return assets.filter(function(asset, index){ return assets.indexOf(asset) === index; });
}

// 旅程進度環（v17）：小小的圓環顯示「旅程已進行 n/9 天」，
// 進度依 getTripDayContext 的狀態推算（出發前 0、旅程中第 n 天、結束滿格），不需新資料欄位。
function buildTripProgressRing(context) {
  var total = TRIP_DATA.days.length;
  var elapsed = 0;
  if (context) {
    if (context.state === 'complete') elapsed = total;
    else if (context.state === 'today' || context.state === 'between') elapsed = context.index;
  }
  var R = 18;
  var C = Math.round(2 * Math.PI * R * 10) / 10; // 圓周 113.1
  var pct = total ? elapsed / total : 0;
  var offset = Math.round(C * (1 - pct) * 10) / 10;
  return '<div class="now-progress" role="img" aria-label="旅程进度 ' + elapsed + '/' + total + ' 天">' +
    '<svg viewBox="0 0 44 44"><circle class="np-track" cx="22" cy="22" r="' + R + '"/>' +
    '<circle class="np-fill" cx="22" cy="22" r="' + R + '" style="stroke-dasharray:' + C + ';stroke-dashoffset:' + offset + '"/></svg>' +
    '<span class="np-num">' + elapsed + '/' + total + '</span></div>';
}

// 今日卡（v18）：依用戶要求精簡——只留 狀態 + 標題 + 兩行摘要 + 進度環 + 主按鈕，
// 刪除「下一站 / 今日住宿 / 今日提醒」資訊區（這些資訊在每日詳情頁本來就有完整呈現）。
function buildNowDashboard(context) {
  if (!context) return '';
  var day = context.day;
  var stateLabel = context.state === 'today' ? '今天' :
    (context.state === 'complete' ? '旅程已完成' : (context.countdown ? context.countdown + ' 天後' : '下一個行程日'));
  var intro = context.state === 'today' ? '今天就照這裡開始' :
    (context.state === 'complete' ? '保留這趟旅程的最後一天' : '下一個要準備的行程');

  return '<section class="now-dashboard">' +
    '<div class="now-top"><div class="now-top-text">' +
      '<div class="now-eyebrow">' + stateLabel + ' · 第' + (context.index + 1) + '日</div>' +
      '<h1>' + day.detailTitle + '</h1>' +
      '<p class="now-intro">' + intro + (day.summary ? '｜' + day.summary : '') + '</p>' +
    '</div>' + buildTripProgressRing(context) + '</div>' +
    '<button class="now-primary-btn" onclick="showDay(\'' + day.id + '\')">查看' + (context.state === 'today' ? '今日' : '這日') + '完整行程</button>' +
  '</section>';
}

function buildTripHero() {
  var cfg = TRIP_DATA.config;
  var coverFiles = normalizeImgList(cfg.coverImage);
  var bgImg = coverFiles.length ? '<img src="' + coverFiles[0] + '" alt="" decoding="async" onerror="this.style.display=\'none\'" />' : '';
  var badgesHtml = (cfg.badges || []).map(function(b){ return '<span class="hero-badge">' + b + '</span>'; }).join('');
  return '<section class="trip-hero">' +
    '<div class="trip-hero-bg">' + bgImg + '</div><div class="trip-hero-scrim"></div>' +
    '<div class="trip-hero-content">' +
      '<div class="trip-hero-dates">' + (cfg.dateRange && cfg.dateRange.display ? cfg.dateRange.display : '') + '</div>' +
      '<h1 class="trip-hero-title">' + (cfg.bannerTitleHtml || cfg.tripName) + '</h1>' +
      (badgesHtml ? '<div class="trip-hero-badges">' + badgesHtml + '</div>' : '') +
    '</div>' +
  '</section>';
}

// 章節卡（v15）：國家分隔從一行小字升級成「Chapter N」章節卡，營造翻頁進入下一段旅程的感覺。
// 章節編號依 sectionLabel 出現順序自動累加，未來新旅程的資料不需要額外設定。
function buildChapterCardHtml(chapterIdx, label) {
  return '<div class="ov-tl-row ov-tl-chapter ov-ch-' + chapterIdx + '">' +
    '<div class="ov-tl-node"><span class="ov-tl-diamond"></span></div>' +
    '<div class="chapter-card"><div class="chapter-eyebrow">Chapter ' + chapterIdx + '</div>' +
    '<div class="chapter-title">' + label + '</div></div></div>';
}

// 總覽「完整行程」時間軸（v15）：9 天卡片從獨立堆疊改成一條垂直時間軸串起來。
// 每張日卡左邊多一根節點欄（圓點 + 貫穿線），線與點的顏色跟著章節走（冰島段藍、芬蘭段暖金），
// 今天當天的圓點放大發光、已過去的日子淡化——狀態沿用 getTripDayContext() 的 today，不需新欄位。
function renderOverview() {
  // v16：首屏拆成兩個掛載點——hero + 今日卡放 #overviewContent（頁面最頂），
  // 地圖橫幅由 updateItinMap 填在中間，時間軸放 #overviewTimeline。
  var context = getTripDayContext();
  var topEl = document.getElementById('overviewContent');
  topEl.innerHTML = buildTripHero() + buildNowDashboard(context);

  var html = '<div class="overview-section-title"><h2>完整行程</h2><p>也可以直接选择任一天查看</p></div>';
  var todayKey = context ? context.today : '';
  var chapterIdx = 0;
  html += '<div class="ov-timeline">';
  TRIP_DATA.days.forEach(function(d, index){
    if (d.sectionLabel) {
      chapterIdx += 1;
      html += buildChapterCardHtml(chapterIdx, d.sectionLabel);
    }
    var stateClass = '';
    if (todayKey && d.date) {
      if (d.date === todayKey) stateClass = ' is-today';
      else if (d.date < todayKey) stateClass = ' is-past';
    }
    var bannerHtml = d.bannerImage ? '<img src="' + d.bannerImage + '" alt="" width="640" height="166" ' + (index === 0 ? 'fetchpriority="high"' : 'loading="lazy"') + ' decoding="async" onerror="this.style.display=\'none\'" />' : '';
    html += '<div class="ov-tl-row ov-ch-' + chapterIdx + stateClass + '">' +
      '<div class="ov-tl-node"><span class="ov-tl-dot"></span></div>' +
      '<div class="day-card ' + (d.color || '') + '" onclick="showDay(\'' + d.id + '\')">' +
      '<div class="day-card-bg">' + bannerHtml + '</div><div class="day-card-scrim"></div>' +
      '<div class="day-card-content"><div class="day-badge"><div class="month">' + d.month + '</div><div class="date">' + d.dayOfMonth + '</div></div>' +
      '<div class="day-card-info"><h3>' + d.title + '</h3>' + (d.summary ? '<p>' + d.summary + '</p>' : '') + '</div></div></div></div>';
  });
  html += '</div>';
  var timelineEl = document.getElementById('overviewTimeline');
  timelineEl.innerHTML = html;
  if (typeof initScrollReveal === 'function') {
    initScrollReveal(topEl);
    initScrollReveal(timelineEl);
  }
}

function mountTabContent() {
  document.getElementById('mount-travel').outerHTML = TRAVEL_HTML;
  document.getElementById('mount-budget').outerHTML = BUDGET_HTML;
  document.getElementById('mount-other').outerHTML = OTHER_HTML;
}
