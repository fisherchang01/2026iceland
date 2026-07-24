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

function buildNowDashboard(context) {
  if (!context) return '';
  var day = context.day;
  var primaryStop = getDayPrimaryStop(day);
  var reminders = getDayReminders(day);
  var stateLabel = context.state === 'today' ? '今天' :
    (context.state === 'complete' ? '旅程已完成' : (context.countdown ? context.countdown + ' 天後' : '下一個行程日'));
  var intro = context.state === 'today' ? '今天就照這裡開始' :
    (context.state === 'complete' ? '保留這趟旅程的最後一天' : '下一個要準備的行程');
  var stopHtml = primaryStop ?
    '<div class="now-info-card"><span class="now-info-label">下一站</span><strong>' + primaryStop.icon + ' ' + primaryStop.name + '</strong>' +
      (primaryStop.map ? '<a class="now-inline-link" href="https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(primaryStop.map) + '" target="_blank" rel="noopener">开启导航</a>' : '') + '</div>' : '';
  var lodgingHtml = day.hotel && day.hotel.name ?
    '<div class="now-info-card"><span class="now-info-label">今日住宿</span><strong>🏨 ' + day.hotel.name + '</strong>' +
      (day.hotel.map ? '<a class="now-inline-link" href="https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(day.hotel.map) + '" target="_blank" rel="noopener">住宿导航</a>' : '') + '</div>' : '';
  var remindersHtml = reminders.length ? '<div class="now-reminders"><span class="now-info-label">今日提醒</span><ul>' +
    reminders.map(function(item){ return '<li>' + item + '</li>'; }).join('') + '</ul></div>' : '';

  return '<section class="now-dashboard">' +
    '<div class="now-eyebrow">' + stateLabel + ' · 第' + (context.index + 1) + '日</div>' +
    '<h1>' + day.detailTitle + '</h1>' +
    '<p class="now-intro">' + intro + (day.summary ? '｜' + day.summary : '') + '</p>' +
    '<div class="now-info-grid">' + stopHtml + lodgingHtml + '</div>' +
    remindersHtml +
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

function renderOverview() {
  var html = buildTripHero();
  html += buildNowDashboard(getTripDayContext());
  html += '<div class="overview-section-title"><h2>完整行程</h2><p>也可以直接选择任一天查看</p></div>';

  TRIP_DATA.days.forEach(function(d, index){
    if (d.sectionLabel) html += '<div class="day-section-label">' + d.sectionLabel + '</div>';
    var bannerHtml = d.bannerImage ? '<img src="' + d.bannerImage + '" alt="" width="640" height="166" ' + (index === 0 ? 'fetchpriority="high"' : 'loading="lazy"') + ' decoding="async" onerror="this.style.display=\'none\'" />' : '';
    html += '<div class="day-card ' + (d.color || '') + '" onclick="showDay(\'' + d.id + '\')">' +
      '<div class="day-card-bg">' + bannerHtml + '</div><div class="day-card-scrim"></div>' +
      '<div class="day-card-content"><div class="day-badge"><div class="month">' + d.month + '</div><div class="date">' + d.dayOfMonth + '</div></div>' +
      '<div class="day-card-info"><h3>' + d.title + '</h3>' + (d.summary ? '<p>' + d.summary + '</p>' : '') + '</div></div></div>';
  });
  document.getElementById('overviewContent').innerHTML = html;
}

function mountTabContent() {
  document.getElementById('mount-travel').outerHTML = TRAVEL_HTML;
  document.getElementById('mount-budget').outerHTML = BUDGET_HTML;
  document.getElementById('mount-other').outerHTML = OTHER_HTML;
}
