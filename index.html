// 這個檔案是「每日行程／景點詳情的畫面渲染邏輯」，一般調整行程/景點內容不需要改這裡，改 data/ 資料夾裡的檔案即可。

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
          '<div class="spot-thumb-fallback">' + getSpotIconHtml(s.icon) + '</div>' +
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
        '<div class="spot-thumb-fallback">' + getSpotIconHtml(s.icon) + '</div>' +
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

// 景點圖片：如果這個景點有設定 img（見 data/trip-details.js 裡的 img 欄位），就顯示照片；
// 沒有設定，或是照片檔案找不到，都會自動顯示插圖 fallback，不會出現「圖片壞掉」的畫面。
function handleSpotImgError(imgEl, icon) {
  imgEl.parentElement.innerHTML = '<div class="img-fallback"><span class="fallback-icon">' + getSpotIconHtml(icon) + '</span><span class="fallback-label">插画示意</span></div>';
}
function buildSpotImageHtml(s) {
  var fallback = '<div class="img-fallback"><span class="fallback-icon">' + getSpotIconHtml(s.icon) + '</span><span class="fallback-label">插画示意</span></div>';
  if (s.img) {
    return '<div class="spot-img-wrap">' +
      '<img src="images/spots/' + s.img + '" alt="' + s.name + '" ' +
      "onerror=\"handleSpotImgError(this, '" + s.icon.replace(/'/g, "\\'") + "')\" />" +
      '</div>';
  }
  return '<div class="spot-img-wrap">' + fallback + '</div>';
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
  currentSpot = idx; currentSpotArea = null;
  renderSpotDetail(s, d);
  openSpotSheet();
}

function showSpotHelsinki(dayId, aIdx, sIdx) {
  var d = TRIP[dayId];
  if (!d || !d.areas) return;
  var s = d.areas[aIdx].spots[sIdx];
  if (!s) return;
  currentSpot = sIdx; currentSpotArea = aIdx;
  renderSpotDetail(s, d);
  openSpotSheet();
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
    buildSpotImageHtml(s) +
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
