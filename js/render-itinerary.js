// 這個檔案是「每日行程／景點詳情的畫面渲染邏輯」，一般調整行程/景點內容不需要改這裡，改 data/ 資料夾裡的檔案即可。

var carIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="connector-icon connector-icon-drive"><path d="M5 17H3a2 2 0 01-2-2v-4a2 2 0 012-2h14l4 4-4 4H5z"/><circle cx="7" cy="17" r="2"/><circle cx="15" cy="17" r="2"/></svg>';
var walkIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="connector-icon connector-icon-walk"><circle cx="13" cy="4" r="1.6" fill="currentColor" stroke="none"/><path d="M15 8l-3 2-1 5-3 6M12 10l1 4 3 2 2 5M9 15l-3 1"/></svg>';
var tramIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="connector-icon connector-icon-tram"><rect x="4" y="4" width="16" height="13" rx="2"/><path d="M4 12h16M8 17l-2 3M16 17l2 3"/><circle cx="8.5" cy="8.5" r="1" fill="currentColor" stroke="none"/><circle cx="15.5" cy="8.5" r="1" fill="currentColor" stroke="none"/></svg>';

// ===== 景點方塊卡片配色（v5）：同一天的所有景點卡片統一使用「當天」的主題色，
// 跟頂端固定橫列（header.day-mode）用的是同一組 c0~c8 配色，色彩不會在同一天內跳來跳去。=====
// 有字母編號（label，如 A/B/C）的景點，方塊左上角徽章顯示字母；沒有編號的（機場/超市/租車等）顯示原本的 icon。
function spotBadgeHtml(s) {
  if (s.label) return '<div class="spot-badge">' + s.label + '</div>';
  return '<div class="spot-badge icon-badge">' + (s.icon || '📍') + '</div>';
}

// 景點名稱資料是「英文/拉丁拼音 + 中文」混排（例如 "Þórufoss 索鲁瀑布"）。
// 這裡自動拆出拉丁字母/冰島文特殊字母的片段當作「英文」，其餘（含中文字與標點）當作「中文」，
// 顯示時改成「中文（放大）＋ 英文（縮小灰字）」的順序，不需要更動 data 里的原始資料。
function splitSpotName(name) {
  if (!name) return { zh: '', en: '' };
  var enRegex = /[A-Za-zÀ-ÿ0-9][A-Za-zÀ-ÿ0-9 .'&\-]*/g;
  var enMatches = name.match(enRegex) || [];
  var en = enMatches.join(' ').replace(/\s+/g, ' ').trim();
  if (!en) return { zh: name, en: '' };
  var zh = name.replace(enRegex, '').replace(/[（(]\s*[）)]/g, '').replace(/\s+/g, ' ').trim();
  if (!zh) return { zh: name, en: '' }; // 整段都是英文（如 Allas Sea Pool），就不拆了
  return { zh: zh, en: en };
}
function spotTitleHtml(name) {
  var parts = splitSpotName(name);
  var html = '<span class="cjk-lg">' + parts.zh + '</span>';
  if (parts.en) html += ' <span class="name-en">' + parts.en + '</span>';
  return html;
}

function makeDriveConnector(dist, time) {
  return '<div class="drive-connector">' +
    '<div class="drive-line-wrap"><div class="drive-dot"></div><div class="drive-dashed"></div><div class="drive-dot"></div></div>' +
    '<div class="drive-info">' + carIcon + '<span>' + dist + (time ? ' &nbsp;·&nbsp; ' + time : '') + '</span></div>' +
    '</div>';
}
function makeWalkConnector(text, detail) {
  return '<div class="walk-connector">' +
    '<div class="drive-line-wrap"><div class="drive-dot walk"></div><div class="drive-dashed walk"></div><div class="drive-dot walk"></div></div>' +
    '<div class="walk-info">' + walkIcon + '<span>' + (detail || text) + '</span></div>' +
    '</div>';
}
function makeTramConnector(text, detail) {
  return '<div class="tram-connector">' +
    '<div class="drive-line-wrap"><div class="drive-dot tram"></div><div class="drive-dashed tram"></div><div class="drive-dot tram"></div></div>' +
    '<div class="tram-info">' + tramIcon + '<span>' + (detail || text) + '</span></div>' +
    '</div>';
}

// ===== 每日路线简图（v6）：显示位置改到页面最顶端的常驻地图区块（见 index.html 的 .itin-map），
// 不再嵌在每日景点列表里；相关渲染逻辑改放在 js/nav.js 的 updateItinMap()／openItinMapLightbox()。
// d.routeMapImg 欄位本身用法不变（使用者自行把图片放到 images/spots/ 底下、档名填进这个欄位）。

function showDay(dayId) {
  var d = TRIP[dayId];
  if (!d) return;
  currentDay = dayId; currentSpot = null; currentSpotArea = null;

  document.querySelectorAll('.page').forEach(function(p){ p.classList.remove('active'); });
  document.getElementById('page-itinerary').classList.add('active');
  document.querySelectorAll('.nav-tab').forEach(function(t){ t.classList.remove('active'); });
  document.getElementById('tab-itinerary').classList.add('active');
  currentPage = 'itinerary';

  var dayMeta = TRIP_DAYS.find(function(x){ return x.id === dayId; });
  var dayColorClass = dayMeta ? dayMeta.color : 'c0';

  showItineraryView('view-day');

  var headingEl = document.getElementById('dayTitleHeading');
  if (headingEl) headingEl.textContent = '第' + (TRIP_DAYS.findIndex(function(x){ return x.id === dayId; }) + 1) + '日．' + d.title;

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
    var hotelHtml = buildHotelHtml(d.hotel, dayId);
    listEl.innerHTML =
      '<div class="info-card"><div class="card-label">航班资讯</div>' + flightHtml + '</div>' +
      (d.note ? '<div class="tips-card"><div class="card-label">行程备注</div><p>' + d.note + '</p></div>' : '') +
      hotelHtml;
  } else if (d.isHelsinki) {
    // 分区折叠（第1项功能）：沿用「其他/旅游」页签既有的 travel-collapse 折叠元件，
    // 每一区预设收合，点击标题展开，跟其他页签的折叠行为一致（低风险：只是重新排版既有元件，非新增功能）。
    var html = '';
    d.areas.forEach(function(area, aIdx) {
      html += '<div class="travel-collapse area-collapse">' +
        '<div class="travel-collapse-header" onclick="toggleTravelCollapse(this)">' +
          '<div class="travel-collapse-left">' +
            '<div class="travel-collapse-emoji">📍</div>' +
            '<div>' +
              '<div class="travel-collapse-title">' + area.label + '</div>' +
              '<div class="travel-collapse-sub">' + area.spots.length + ' 个地点</div>' +
            '</div>' +
          '</div>' +
          '<div class="travel-collapse-arrow">▼</div>' +
        '</div>' +
        '<div class="travel-collapse-body">';
      area.spots.forEach(function(s, sIdx) {
        var clickable = !s.isShop;
        html += '<div class="spot-item ' + dayColorClass + (s.isShop ? ' no-click' : '') + '"' +
          (clickable ? ' onclick="showSpotHelsinki(\'' + dayId + '\',' + aIdx + ',' + sIdx + ')"' : '') + '>' +
          '<div class="spot-item-head">' + spotBadgeHtml(s) +
          '<div class="spot-title"><h4>' + spotTitleHtml(s.name) + '</h4></div>' +
          (clickable ? '<div class="spot-item-arrow"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg></div>' : '<div style="width:32px;"></div>') +
          '</div>' +
          '<div class="spot-item-info"><p>' + (s.tags ? s.tags.join(' · ') : '') + '</p></div>' +
          '</div>';
        if (s.nextStop) {
          var ns = s.nextStop;
          if (ns.type === 'drive') html += makeDriveConnector(ns.detail, '');
          else if (ns.type === 'walk') html += makeWalkConnector(ns.text, ns.detail);
          else if (ns.type === 'tram') html += makeTramConnector(ns.text, ns.detail);
        }
      });
      html += '</div></div>'; // 关闭 travel-collapse-body 与 travel-collapse
    });
    html += buildHotelHtml(d.hotel, dayId);
    listEl.innerHTML = html;
  } else {
    var html = '';
    d.spots.forEach(function(s, i) {
      var isShop = s.isShop || false;
      var clickable = !isShop;
      html += '<div class="spot-item ' + dayColorClass + (isShop ? ' no-click' : '') + '"' +
        (clickable ? ' onclick="showSpot(\'' + dayId + '\',' + i + ')"' : '') + '>' +
        '<div class="spot-item-head">' + spotBadgeHtml(s) +
        '<div class="spot-title"><h4>' + spotTitleHtml(s.name) + '</h4></div>' +
        (clickable ? '<div class="spot-item-arrow"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg></div>' : '<div style="width:32px;"></div>') +
        '</div>' +
        '<div class="spot-item-info"><p>' + (s.tags ? s.tags.join(' · ') : '') + '</p></div>' +
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

    html += buildHotelHtml(d.hotel, dayId);

    if (d.driveSummary) {
      html += '<div class="drive-summary-card">' +
        '<div class="drive-summary-icon">🚗</div>' +
        '<div class="drive-summary-info"><h4>今日自驾里程小计</h4><p>总里程：' + d.driveSummary.total + '　总驾驶时间：' + d.driveSummary.time + '</p></div>' +
        '</div>';
    }
    listEl.innerHTML = html;
  }

  setItinActive(dayId);
  updateItinMap(dayId);
}

// 景點圖片：可以用新版 images:['a.jpg','b.jpg'] 放多張（瀑布流呈現），
// 也向下相容舊版單張 img:'x.jpg'（見 data/trip-details.js 開頭說明）。
// 沒有設定，或是照片檔案找不到，都會自動顯示插圖 fallback，不會出現「圖片壞掉」的畫面。
function getSpotImages(s) {
  if (Array.isArray(s.images) && s.images.length) return s.images;
  if (s.img) return [s.img];
  return [];
}
function handleSpotImgError(imgEl, icon) {
  var wrap = imgEl.parentElement;
  wrap.className = 'spot-img-wrap fallback-only';
  wrap.innerHTML = '<div class="img-fallback"><span class="fallback-icon">' + getSpotIconHtml(icon) + '</span><span class="fallback-label">插画示意</span></div>';
}
function handleGalleryImgError(imgEl) {
  imgEl.style.display = 'none';
}
function buildSpotImageHtml(s) {
  var imgs = getSpotImages(s);
  currentGalleryImages = imgs;
  currentGalleryIndex = 0;

  if (imgs.length === 0) {
    var fallback = '<div class="img-fallback"><span class="fallback-icon">' + getSpotIconHtml(s.icon) + '</span><span class="fallback-label">插画示意</span></div>';
    return '<div class="spot-img-wrap fallback-only">' + fallback + '</div>';
  }
  if (imgs.length === 1) {
    return '<div class="spot-img-wrap single">' +
      '<img src="images/spots/' + imgs[0] + '" alt="' + s.name + '" onclick="openLightbox(0)" ' +
      "onerror=\"handleSpotImgError(this, '" + s.icon.replace(/'/g, "\\'") + "')\" />" +
      '</div>';
  }
  var galleryHtml = imgs.map(function(img, i) {
    return '<img src="images/spots/' + img + '" alt="' + s.name + '" onclick="openLightbox(' + i + ')" onerror="handleGalleryImgError(this)" />';
  }).join('');
  return '<div class="spot-img-gallery">' + galleryHtml + '</div>';
}

// ===== 圖片放大燈箱：點擊景點照片（單張或瀑布流縮圖）可放大檢視，多張時可左右切換 =====
function openLightbox(idx) {
  if (!currentGalleryImages.length) return;
  currentGalleryIndex = idx;
  renderLightbox();
  document.getElementById('imgLightbox').classList.add('open');
}
function renderLightbox() {
  var imgs = currentGalleryImages;
  if (!imgs.length) return;
  document.getElementById('lightboxImg').src = 'images/spots/' + imgs[currentGalleryIndex];
  var multi = imgs.length > 1;
  document.getElementById('lightboxPrev').style.display = multi ? 'flex' : 'none';
  document.getElementById('lightboxNext').style.display = multi ? 'flex' : 'none';
  document.getElementById('lightboxCounter').textContent = multi ? (currentGalleryIndex + 1) + ' / ' + imgs.length : '';
}
function closeLightbox(e) {
  if (e) e.stopPropagation();
  document.getElementById('imgLightbox').classList.remove('open');
}
function lightboxPrev(e) {
  e.stopPropagation();
  var len = currentGalleryImages.length;
  if (!len) return;
  currentGalleryIndex = (currentGalleryIndex - 1 + len) % len;
  renderLightbox();
}
function lightboxNext(e) {
  e.stopPropagation();
  var len = currentGalleryImages.length;
  if (!len) return;
  currentGalleryIndex = (currentGalleryIndex + 1) % len;
  renderLightbox();
}

// 住宿改为「点击才显示导航」（第5项功能）：卡片本身跟景点一样可点击，点开后在同一个
// spotSheet 详情弹层里显示导航按钮，逻辑上就是复制一份景点的呈现模式。
// 没有 map 栏位的住宿（例如 Day8「飞机上」）维持不可点击、纯资讯显示，不会呈现无用的导航按钮。
function buildHotelHtml(hotel, dayId) {
  if (!hotel) return '';
  var clickable = !!hotel.map;
  return '<div class="hotel-card' + (clickable ? ' clickable' : '') + '"' +
    (clickable ? ' onclick="showHotel(\'' + dayId + '\')"' : '') + '>' +
    '<div class="hotel-icon">🏨</div>' +
    '<div class="hotel-info"><h4>' + hotel.name + '</h4><p>' + hotel.note + '</p></div>' +
    (clickable ? '<div class="spot-item-arrow"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg></div>' : '') +
    '</div>';
}

function showHotel(dayId) {
  var d = TRIP[dayId];
  if (!d || !d.hotel) return;
  currentSpot = null; currentSpotArea = null;
  renderHotelDetail(d.hotel, d);
  openSpotSheet();
}

function renderHotelDetail(hotel, d) {
  var mapQuery = encodeURIComponent(hotel.map || hotel.name);
  document.getElementById('spotDetail').innerHTML =
    '<div class="spot-hero">' +
      '<div class="spot-hero-label">' + d.title + ' · 住宿</div>' +
      '<div class="spot-hero-title">' + hotel.name + '</div>' +
    '</div>' +
    '<div class="info-card"><div class="card-label">住宿说明</div><p>' + hotel.note + '</p></div>' +
    '<a class="map-btn" target="_blank" rel="noopener" href="https://www.google.com/maps/search/?api=1&query=' + mapQuery + '">' +
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 6-9 12-9 12s-9-6-9-12a9 9 0 1118 0z"/><circle cx="12" cy="10" r="3"/></svg> 在 Google 地图导航' +
    '</a>';
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
    var nsIcon = ns.type === 'walk' ? walkIcon : (ns.type === 'tram' ? tramIcon : carIcon);
    nextStopHtml = '<div class="next-stop-card"><div class="next-stop-icon">' + nsIcon + '</div><div class="next-stop-info"><strong>前往下一站：</strong>' + (ns.detail || ns.text) + '</div></div>';
  }

  document.getElementById('spotDetail').innerHTML =
    '<div class="spot-hero">' +
      '<div class="spot-hero-label">' + d.title + '</div>' +
      '<div class="spot-hero-title">' + spotTitleHtml(s.name) + '</div>' +
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
