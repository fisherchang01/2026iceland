// 這個檔案是「每日行程／景點詳情的畫面渲染邏輯」，一般調整行程/景點內容不需要改這裡，改 data/ 資料夾裡的檔案即可。

var carIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="connector-icon connector-icon-drive"><path d="M5 17H3a2 2 0 01-2-2v-4a2 2 0 012-2h14l4 4-4 4H5z"/><circle cx="7" cy="17" r="2"/><circle cx="15" cy="17" r="2"/></svg>';
var walkIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="connector-icon connector-icon-walk"><circle cx="13" cy="4" r="1.6" fill="currentColor" stroke="none"/><path d="M15 8l-3 2-1 5-3 6M12 10l1 4 3 2 2 5M9 15l-3 1"/></svg>';
var tramIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="connector-icon connector-icon-tram"><rect x="4" y="4" width="16" height="13" rx="2"/><path d="M4 12h16M8 17l-2 3M16 17l2 3"/><circle cx="8.5" cy="8.5" r="1" fill="currentColor" stroke="none"/><circle cx="15.5" cy="8.5" r="1" fill="currentColor" stroke="none"/></svg>';

// 固定日期標題欄（Phase 3）用：中文數字（第幾日）、月份英文縮寫轉數字（組成 (10/4) 這種格式）
var CN_DAY_NUM = ['一','二','三','四','五','六','七','八','九','十'];
var MONTH_NUM = { JAN:1, FEB:2, MAR:3, APR:4, MAY:5, JUN:6, JUL:7, AUG:8, SEP:9, OCT:10, NOV:11, DEC:12 };

// ===== 景點/一般卡片配色（v7，Phase 2）=====
// 不再依「當天」上色，全站固定兩色：有字母編號（A/B/C...）的是「景點」，沒有編號的
// （機場/超市/租車/取車等）是「一般」，只看 s.label 有沒有值就能判斷，沿用既有資料、不需要新增欄位。
function spotTypeClass(s) {
  return s.label ? 'type-spot' : 'type-general';
}
// 標題前綴：景點顯示「A.」「B.」這類編號；一般則顯示原本的 icon 表情符號，不再用彩色方塊當徽章。
function spotPrefixHtml(s) {
  if (s.label) return '<span class="spot-num">' + s.label + '.</span> ';
  if (s.icon)  return '<span class="spot-num-icon">' + s.icon + '</span> ';
  return '';
}

// 景點名稱資料可使用「拉丁字母 + 中文」混排。
// 這裡自動拆出拉丁字母片段當作「外文」，其餘（含中文字與標點）當作「中文」，
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

// 距離/時間文字：資料裡原本寫「约 85 km · 约 70 分钟」，這裡在顯示前把「约」拿掉，
// 呈現時不再標示估算字樣（資料本身不用改，只在畫面渲染這一層處理）。
function stripEstimateWording(str) {
  return (str || '').replace(/约\s*/g, '');
}

// 導航小圖示連結（Phase 2 調整）：不再放在每個景點詳情頁裡，改附掛在「距離/時間」這一行本身，
// 點了直接開Google/Apple地圖導航去下一站。destQuery 沒有值（例如最後一站沒有下一站資料）就不顯示。
function buildNavIconsHtml(destQuery, mode) {
  if (!destQuery) return '';
  var appleFlag = mode === 'w' ? 'w' : (mode === 'r' ? 'r' : 'd');
  return '<span class="nav-icon-links">' +
    '<a class="nav-icon-btn nav-icon-google" href="https://www.google.com/maps/dir/?api=1&destination=' + destQuery + '" target="_blank" rel="noopener" onclick="event.stopPropagation()" aria-label="Google地图导航">导航G</a>' +
    '<a class="nav-icon-btn nav-icon-apple" href="https://maps.apple.com/?daddr=' + destQuery + '&dirflg=' + appleFlag + '" target="_blank" rel="noopener" onclick="event.stopPropagation()" aria-label="Apple地图导航">导航A</a>' +
  '</span>';
}

function makeDriveConnector(dist, time, destQuery) {
  return '<div class="timeline-row connector-row">' +
    '<div class="timeline-node"><span class="timeline-dot connector-dot-drive"></span></div>' +
    '<div class="drive-connector">' +
    '<div class="drive-info">' + carIcon + '<span>' + stripEstimateWording(dist) + (time ? ' &nbsp;·&nbsp; ' + stripEstimateWording(time) : '') + '</span>' + buildNavIconsHtml(destQuery, 'd') + '</div>' +
    '</div></div>';
}
function makeWalkConnector(text, detail, destQuery) {
  return '<div class="timeline-row connector-row">' +
    '<div class="timeline-node"><span class="timeline-dot connector-dot-walk"></span></div>' +
    '<div class="walk-connector">' +
    '<div class="walk-info">' + walkIcon + '<span>' + stripEstimateWording(detail || text) + '</span>' + buildNavIconsHtml(destQuery, 'w') + '</div>' +
    '</div></div>';
}
function makeTramConnector(text, detail, destQuery) {
  return '<div class="timeline-row connector-row">' +
    '<div class="timeline-node"><span class="timeline-dot connector-dot-tram"></span></div>' +
    '<div class="tram-connector">' +
    '<div class="tram-info">' + tramIcon + '<span>' + stripEstimateWording(detail || text) + '</span>' + buildNavIconsHtml(destQuery, 'r') + '</div>' +
    '</div></div>';
}

// 卡片縮圖：跟景點詳情頁的圖片網格（buildSpotImageHtml）不同，這裡只載入第一張小圖，
// 用在「當日行程」列表卡片上，讓每張卡片高度與下載量都可預期。
// 縮圖延遲載入；若圖片載入失敗，
// 整條縮圖列連同內距一起收起來，不會留下一大塊空白。
function buildSpotThumbStripHtml(s) {
  var imgs = getSpotImages(s);
  if (!imgs.length) return '';
  var img = imgs[0];
  var meta = getSpotImageMeta(img);
  return '<div class="spot-thumb-strip">' +
    '<img class="spot-photo orientation-' + meta.orientation + '" src="' + spotImagePath(img, 'thumb') + '" alt="" ' +
    'width="' + meta.width + '" height="' + meta.height + '" loading="lazy" decoding="async" ' +
    'onerror="var p=this.parentElement; this.remove(); if(p && !p.children.length) p.remove();" />' +
    '</div>';
}

// ===== 統一卡片元件（v7，Phase 2）：景點與一般（機場/超市/取車等）共用同一個排版，
// 只差在配色（spotTypeClass）跟有沒有縮圖列。標題／標籤／摘要／縮圖／點擊行為都在這裡集中處理，
// showDay() 裡三種情境（一般行程、分區行程、住宿）都呼叫這個函式產生卡片，不用各自重寫一份。
// 卡片外面包一層 timeline-row（節點欄 + 卡片），節點欄裡的圓點才是真正對齊左側貫穿線的定位點，
// 不能直接畫在卡片自己身上（卡片有 overflow:hidden 讓圓角裁切正常，圓點疊在上面會被連帶裁掉）。=====
function buildSpotCardHtml(s, onclickExpr) {
  var isShop = s.isShop || false;
  var clickable = !isShop && !!onclickExpr;
  var scheduleParts = [];
  if (s.time) scheduleParts.push(s.time);
  if (s.duration) scheduleParts.push('停留 ' + s.duration);
  var scheduleHtml = scheduleParts.length ? '<div class="spot-card-meta">' + scheduleParts.join(' · ') + '</div>' : '';
  var thumbHtml = isShop ? '' : buildSpotThumbStripHtml(s);
  var tipsHtml = s.tips ? '<div class="spot-card-tip"><strong>注意：</strong><span>' + s.tips + '</span></div>' : '';
  var actions = '';
  if (s.map) {
    actions += '<a class="spot-card-action secondary" href="https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(s.map) + '" target="_blank" rel="noopener">导航</a>';
  }
  if (clickable) {
    actions += '<button class="spot-card-action primary" onclick="' + onclickExpr + '">查看详情</button>';
  }
  var actionsHtml = actions ? '<div class="spot-card-actions">' + actions + '</div>' : '';
  var cardHtml = '<div class="spot-item ' + spotTypeClass(s) + (isShop ? ' no-click' : '') + '">' +
    '<div class="spot-card-top">' +
      '<h4 class="spot-card-title">' + spotPrefixHtml(s) + spotTitleHtml(s.name) + '</h4>' +
    '</div>' +
    scheduleHtml + thumbHtml + tipsHtml + actionsHtml +
    '</div>';
  return '<div class="timeline-row">' +
    '<div class="timeline-node"><span class="timeline-dot ' + spotTypeClass(s) + '"></span></div>' +
    cardHtml +
    '</div>';
}

// ===== 每日路线简图（v6）：显示位置改到页面最顶端的常驻地图区块（见 index.html 的 .itin-map），
// 不再嵌在每日景点列表里；相关渲染逻辑改放在 js/nav.js 的 updateItinMap()／openItinMapLightbox()。
// d.routeMapImg 欄位本身用法不變（顯示版放 images/routes/，燈箱版放 images/routes/large/）。

function showDay(dayId) {
  var d = TRIP_DATA.daysById[dayId];
  if (!d) return;
  currentDay = dayId; currentSpot = null; currentSpotArea = null;

  document.querySelectorAll('.page').forEach(function(p){ p.classList.remove('active'); });
  document.getElementById('page-itinerary').classList.add('active');
  document.querySelectorAll('.nav-tab').forEach(function(t){ t.classList.remove('active'); });
  document.getElementById('tab-itinerary').classList.add('active');
  currentPage = 'itinerary';

  showItineraryView('view-day');

  var dayIdx = TRIP_DATA.days.findIndex(function(x){ return x.id === dayId; });
  var dayMeta2 = TRIP_DATA.days[dayIdx];
  var headingEl = document.getElementById('itinDayHeading');
  if (headingEl && dayMeta2) {
    var monthNum = MONTH_NUM[dayMeta2.month] || dayMeta2.month;
    headingEl.textContent = '(' + monthNum + '/' + dayMeta2.dayOfMonth + ')\u3000第' + (CN_DAY_NUM[dayIdx] || (dayIdx + 1)) + '日\u3000' + d.detailTitle;
    headingEl.style.display = 'block';
  }

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
      (flightHtml ? '<div class="info-card"><div class="card-label">航班资讯</div>' + flightHtml + '</div>' : '') +
      (d.note ? '<div class="tips-card"><div class="card-label">行程备注</div><p>' + d.note + '</p></div>' : '') +
      hotelHtml;
  } else if (d.areas && d.areas.length) {
    // 分區折疊：任何旅程都可使用 areas，不依賴特定城市名稱。
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
        var onclickExpr = s.isShop ? null : "showAreaSpot('" + dayId + "'," + aIdx + ',' + sIdx + ')';
        html += buildSpotCardHtml(s, onclickExpr);
        if (s.nextStop) {
          var ns = s.nextStop;
          var nextSpot = area.spots[sIdx + 1];
          var destQuery = nextSpot ? encodeURIComponent(nextSpot.map || nextSpot.name) : null;
          if (ns.type === 'drive') html += makeDriveConnector(ns.detail, '', destQuery);
          else if (ns.type === 'walk') html += makeWalkConnector(ns.text, ns.detail, destQuery);
          else if (ns.type === 'tram') html += makeTramConnector(ns.text, ns.detail, destQuery);
        }
      });
      html += '</div></div>'; // 关闭 travel-collapse-body 与 travel-collapse
    });
    html += buildHotelHtml(d.hotel, dayId);
    listEl.innerHTML = html;
  } else {
    var html = '';
    (d.spots || []).forEach(function(s, i) {
      var onclickExpr = s.isShop ? null : "showSpot('" + dayId + "'," + i + ')';
      html += buildSpotCardHtml(s, onclickExpr);
      var nextSpot = (d.spots || [])[i + 1];
      var destQuery = nextSpot ? encodeURIComponent(nextSpot.map || nextSpot.name) :
        (d.hotel && d.hotel.map ? encodeURIComponent(d.hotel.map) : null);
      if (d.drives && d.drives[i]) {
        var dr = d.drives[i];
        html += makeDriveConnector(dr.dist, dr.time, destQuery);
      } else if (s.nextStop) {
        var ns = s.nextStop;
        if (ns.type === 'walk') html += makeWalkConnector(ns.text, ns.detail, destQuery);
        else if (ns.type === 'tram') html += makeTramConnector(ns.text, ns.detail, destQuery);
        else if (ns.type === 'drive') html += makeDriveConnector(ns.detail, '', destQuery);
      }
    });

    html += buildHotelHtml(d.hotel, dayId);

    if (d.driveSummary) {
      html += '<div class="drive-summary-card">' +
        '<div class="drive-summary-icon">🚗</div>' +
        '<div class="drive-summary-info"><h4>今日自驾里程小计</h4><p>总里程：' + stripEstimateWording(d.driveSummary.total) + '　总驾驶时间：' + stripEstimateWording(d.driveSummary.time) + '</p></div>' +
        '</div>';
    }
    listEl.innerHTML = html;
  }

  setItinActive(dayId);
  updateItinMap(dayId);
}

// 景點圖片：可以用 images:['a.webp','b.webp'] 放多張，
// 也支援單張 img:'x.webp'（見 data/trip-details.js 開頭說明）。
// 沒有設定，或是照片檔案找不到，都會自動顯示插圖 fallback，不會出現「圖片壞掉」的畫面。
function getSpotImages(s) {
  if (Array.isArray(s.images) && s.images.length) return s.images;
  if (s.img) return [s.img];
  return [];
}
function getSpotImageMeta(filename) {
  return SPOT_IMAGE_META[filename] || { orientation: 'landscape', width: 1200, height: 900, srcset: [480, 960, 1200] };
}
function spotImagePath(filename, size) {
  return 'images/spots/' + size + '/' + filename;
}
function spotImageAttrs(filename, sizes) {
  var meta = getSpotImageMeta(filename);
  return 'class="spot-photo orientation-' + meta.orientation + '" ' +
    'src="' + spotImagePath(filename, 'medium') + '" ' +
    'srcset="' + spotImagePath(filename, 'thumb') + ' ' + meta.srcset[0] + 'w, ' +
      spotImagePath(filename, 'medium') + ' ' + meta.srcset[1] + 'w, ' +
      spotImagePath(filename, 'large') + ' ' + meta.srcset[2] + 'w" ' +
    'sizes="' + sizes + '" width="' + meta.width + '" height="' + meta.height + '"';
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
  currentGalleryImages = imgs.map(function(img) { return spotImagePath(img, 'large'); });
  currentGalleryIndex = 0;

  if (imgs.length === 0) {
    var fallback = '<div class="img-fallback"><span class="fallback-icon">' + getSpotIconHtml(s.icon) + '</span><span class="fallback-label">插画示意</span></div>';
    return '<div class="spot-img-wrap fallback-only">' + fallback + '</div>';
  }
  if (imgs.length === 1) {
    return '<div class="spot-img-wrap single">' +
      '<img ' + spotImageAttrs(imgs[0], '(max-width: 720px) calc(100vw - 48px), 680px') + ' alt="' + s.name + '" loading="lazy" decoding="async" onclick="openLightbox(0)" ' +
      "onerror=\"handleSpotImgError(this, '" + s.icon.replace(/'/g, "\\'") + "')\" />" +
      '</div>';
  }
  var galleryHtml = imgs.map(function(img, i) {
    return '<img ' + spotImageAttrs(img, '(max-width: 720px) calc(50vw - 30px), 330px') + ' alt="' + s.name + '" loading="lazy" decoding="async" onclick="openLightbox(' + i + ')" onerror="handleGalleryImgError(this)" />';
  }).join('');
  return '<div class="spot-img-gallery">' + galleryHtml + '</div>';
}

// ===== 圖片放大燈箱：點擊景點照片（單張或網格縮圖）可放大檢視，多張時可左右切換 =====
function openLightbox(idx) {
  if (!currentGalleryImages.length) return;
  currentGalleryIndex = idx;
  renderLightbox();
  document.getElementById('imgLightbox').classList.add('open');
}
function renderLightbox() {
  var imgs = currentGalleryImages;
  if (!imgs.length) return;
  document.getElementById('lightboxImg').src = imgs[currentGalleryIndex];
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
  if (!hotel || !hotel.name) return '';
  var clickable = !!hotel.map;
  var cardHtml = '<div class="hotel-card' + (clickable ? ' clickable' : '') + '"' +
    (clickable ? ' onclick="showHotel(\'' + dayId + '\')"' : '') + '>' +
    '<div class="hotel-icon">🏨</div>' +
    '<div class="hotel-info"><h4>' + hotel.name + '</h4>' + (hotel.note ? '<p>' + hotel.note + '</p>' : '') + '</div>' +
    (clickable ? '<div class="spot-item-arrow"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg></div>' : '') +
    '</div>';
  return '<div class="timeline-row">' +
    '<div class="timeline-node"><span class="timeline-dot hotel-dot"></span></div>' +
    cardHtml +
    '</div>';
}

function showHotel(dayId) {
  var d = TRIP_DATA.daysById[dayId];
  if (!d || !d.hotel) return;
  currentSpot = null; currentSpotArea = null;
  renderHotelDetail(d.hotel, d);
  openSpotSheet();
}

function renderHotelDetail(hotel, d) {
  var mapQuery = encodeURIComponent(hotel.map || hotel.name);
  document.getElementById('spotSheetHero').innerHTML =
    '<div class="spot-hero">' +
      '<div class="spot-hero-label">' + d.detailTitle + ' · 住宿</div>' +
      '<div class="spot-hero-title">' + hotel.name + '</div>' +
    '</div>';
  document.getElementById('spotDetail').innerHTML =
    (hotel.note ? '<div class="info-card"><div class="card-label">住宿说明</div><p>' + hotel.note + '</p></div>' : '') +
    (hotel.address ? '<div class="info-card"><div class="card-label">住宿地址</div><p>' + hotel.address + '</p></div>' : '') +
    (hotel.checkIn ? '<div class="info-card"><div class="card-label">入住资讯</div><p>' + hotel.checkIn + '</p></div>' : '') +
    (hotel.contact ? '<div class="info-card"><div class="card-label">联络方式</div><p>' + hotel.contact + '</p></div>' : '') +
    buildMapBtnRowHtml(mapQuery, '导航');
}

// 雙導航（Phase 2 新增）：同一個地點的查詢字串，分別組成 Google Maps 與 Apple Maps 的連結，
// 兩個按鈕並排顯示，使用者用慣哪個地圖 App 就點哪個，不用只能二選一。
function buildMapBtnRowHtml(mapQuery, actionLabel) {
  var label = actionLabel || '查看';
  return '<div class="map-btn-row">' +
    '<a class="map-btn" target="_blank" rel="noopener" href="https://www.google.com/maps/search/?api=1&query=' + mapQuery + '">' +
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 6-9 12-9 12s-9-6-9-12a9 9 0 1118 0z"/><circle cx="12" cy="10" r="3"/></svg> Google 地图' + label +
    '</a>' +
    '<a class="map-btn map-btn-apple" target="_blank" rel="noopener" href="https://maps.apple.com/?q=' + mapQuery + '">' +
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 6-9 12-9 12s-9-6-9-12a9 9 0 1118 0z"/><circle cx="12" cy="10" r="3"/></svg> Apple 地图' + label +
    '</a>' +
  '</div>';
}

function showSpot(dayId, idx) {
  var d = TRIP_DATA.daysById[dayId];
  if (!d) return;
  var s = d.spots[idx];
  if (!s) return;
  currentSpot = idx; currentSpotArea = null;
  renderSpotDetail(s, d);
  openSpotSheet();
}

function showAreaSpot(dayId, aIdx, sIdx) {
  var d = TRIP_DATA.daysById[dayId];
  if (!d || !d.areas) return;
  var s = d.areas[aIdx].spots[sIdx];
  if (!s) return;
  currentSpot = sIdx; currentSpotArea = aIdx;
  renderSpotDetail(s, d);
  openSpotSheet();
}

function renderSpotDetail(s, d) {
  var tagsHtml = (s.tags || []).map(function(t){ return '<span class="tag">' + t + '</span>'; }).join('');
  var facts = [];
  if (s.time) facts.push('<div><strong>时间：</strong>' + s.time + '</div>');
  if (s.duration) facts.push('<div><strong>停留：</strong>' + s.duration + '</div>');
  if (s.price) facts.push('<div><strong>票价：</strong>' + s.price + '</div>');
  if (s.booking) facts.push('<div><strong>预订：</strong>' + s.booking + '</div>');
  var factsHtml = facts.length ? '<div class="info-card"><div class="card-label">参观资讯</div>' + facts.join('') + '</div>' : '';

  var parkingHtml = (s.parking || s.toilet) ?
    '<div class="parking-card"><div class="card-label">停车 &amp; 厕所</div><div class="parking-row">' +
    (s.parking ? '<div class="parking-item"><strong>🅿️ 停车：</strong>' + s.parking + '</div>' : '') +
    (s.toilet ? '<div class="parking-item"><strong>🚻 厕所：</strong>' + s.toilet + '</div>' : '') +
    '</div></div>' : '';

  var nextStopHtml = '';
  if (s.nextStop) {
    var ns = s.nextStop;
    var nsIcon = ns.type === 'walk' ? walkIcon : (ns.type === 'tram' ? tramIcon : carIcon);
    nextStopHtml = '<div class="next-stop-card"><div class="next-stop-icon">' + nsIcon + '</div><div class="next-stop-info"><strong>前往下一站：</strong>' + stripEstimateWording(ns.detail || ns.text) + '</div></div>';
  }

  // v8：標題框（hero）固定在彈層最上面不捲動，只放編號＋名稱，不再重複顯示標籤文字
  // （標籤已經在下面用膠囊樣式顯示一次，不需要在標題框再顯示一次純文字版）。
  document.getElementById('spotSheetHero').innerHTML =
    '<div class="spot-hero">' +
      '<div class="spot-hero-label">' + d.detailTitle + '</div>' +
      '<div class="spot-hero-title">' + spotTitleHtml(s.name) + (s.localName ? ' <span class="name-en">' + s.localName + '</span>' : '') + '</div>' +
    '</div>';

  // 其餘內容可捲動，順序：標籤 → 介紹 → 深度介紹 → 提醒 → 停車廁所 → 前往下一站 → 照片網格（移到最下面）
  document.getElementById('spotDetail').innerHTML =
    (tagsHtml ? '<div class="tags">' + tagsHtml + '</div>' : '') +
    factsHtml +
    (s.desc ? '<div class="info-card"><div class="card-label">景点介绍</div><p>' + s.desc + '</p></div>' : '') +
    (s.deepDesc ? '<div class="info-card"><div class="card-label">深度介绍</div><p>' + s.deepDesc + '</p></div>' : '') +
    (s.tips ? '<div class="tips-card"><div class="card-label">小提醒</div><p>' + s.tips + '</p></div>' : '') +
    parkingHtml +
    nextStopHtml +
    buildSpotImageHtml(s);
  // 注意（Phase 2 調整）：景點詳情頁不再放導航按鈕，導航改附掛在列表卡片之間「距離/時間」那一行
  // （見 buildNavIconsHtml），這裡只留景點本身的介紹內容。住宿詳情頁的導航按鈕不受影響，維持原樣。
}
