// 今日卡的天氣預警（v1.9）：向冰島氣象局（IMO）即時 API 抓警戒，只看「這張卡顯示的那一天」
// 行程所在的官方預報分區，且警戒生效時間要跟那一天重疊。
//   - 沒有警戒 → 明確寫「目前没有异常天气预警」（不再退回顯示行程摘要，要看行程請點下方按鈕）
//   - 有警戒   → 用大白話說明：等級、類型、影響地區、生效時間、該怎麼做
//   - 抓不到   → 老實寫「暂时查询不到」，絕不能在沒查到時說「沒有預警」
// 資料來源與分區對照表見 data/weather-alerts-config.js。

var WEATHER_COLOR_RANK = { Red: 3, Orange: 2, Yellow: 1 };
var WEATHER_COLOR_LABEL_ZH = { Red: '红色警戒', Orange: '橙色警戒', Yellow: '黄色警戒' };
var WEATHER_COLOR_EMOJI = { Red: '🟥', Orange: '🟧', Yellow: '🟨' };
var WEATHER_COLOR_STYLE = {
  Red:    { bg: '#fdecea', border: '#e74c3c', text: '#7a1a12' },
  Orange: { bg: '#fdf0e2', border: '#e67e22', text: '#7a3d0a' },
  Yellow: { bg: '#fdf7e0', border: '#c99a06', text: '#5c4400' }
};
var WEATHER_OK_STYLE = { bg: '#eef7f0', border: '#7dbb8a', text: '#245a33' };
var WEATHER_UNKNOWN_STYLE = { bg: '#f3f3f3', border: '#c9c9c9', text: '#555' };

var WEATHER_REGION_ZH = {
  'Reykjavik - Capital Region': '雷克雅未克首都圈',
  'South Iceland': '南部',
  'Faxafloi - Southwest Iceland': '西南部（法赫萨湾）',
  'Southeast Iceland': '东南部',
  'Breidafjordur - Westnorthwest Iceland': '西北偏西（布雷扎湾）',
  'Westfjords': '西峡湾',
  'Northwest Iceland': '西北部',
  'Northeast Iceland': '东北部',
  'East Iceland': '东部',
  'Eastfjords': '东峡湾',
  'Central highlands - Uninhabited part of Iceland': '中部高地',
  'Iceland': '全冰岛'
};

// 警戒類型 → 白話中文（用結構化欄位 event_en，不去翻譯自由文字，避免誤譯）
function weatherEventZh(eventEn) {
  var e = String(eventEn || '').toLowerCase();
  if (/wind|gale|storm/.test(e)) return '大风';
  if (/rain|precip|downpour/.test(e)) return '大雨';
  if (/snow|blizzard/.test(e)) return '降雪';
  if (/ice|icing|slippery|frost/.test(e)) return '路面结冰';
  if (/flood/.test(e)) return '洪水';
  if (/landslide|rockslide|debris/.test(e)) return '山体滑坡／落石';
  if (/avalanche/.test(e)) return '雪崩';
  if (/volcan|eruption|gas/.test(e)) return '火山／气体';
  if (/sea|wave|surf/.test(e)) return '海浪';
  return eventEn ? String(eventEn) : '异常天气';
}

// 該怎麼做（依等級，白話）
function weatherAdviceZh(color) {
  if (color === 'Red') return '非常危险，强烈建议今天不要外出、不要开车。';
  if (color === 'Orange') return '有危险，开车、户外活动请特别小心，非必要建议改期或避开。';
  return '可能造成不便，开车放慢、户外多留意，出发前再查一次路况。';
}

function weatherFmtTime(date) {
  var tz = (typeof TRIP_DATA !== 'undefined' && TRIP_DATA.config && TRIP_DATA.config.timezone) || 'Atlantic/Reykjavik';
  var parts = new Intl.DateTimeFormat('en-GB', { timeZone: tz, month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false }).formatToParts(date);
  var v = {};
  parts.forEach(function (p) { v[p.type] = p.value; });
  var hh = v.hour === '24' ? '00' : v.hour;
  return v.month + '/' + v.day + ' ' + hh + ':' + v.minute;
}

function weatherRegionsZh(regions) {
  return regions.map(function (r) { return WEATHER_REGION_ZH[r] || r; }).join('、');
}

// 「這一天」的起訖（冰島時區 = UTC+0 全年不變）。dayDate 為 'YYYY-MM-DD'。
function weatherDayWindow(dayDate) {
  var start = Date.parse(dayDate + 'T00:00:00Z');
  return { start: start, end: start + 86400000 };
}

// 回傳 { status:'ok', alerts:[...] } 或 { status:'failed' } 或 { status:'na' }（這天不在冰島）。
function fetchIcelandWeatherAlertsForDay(dayId, dayDate) {
  var cfg = (typeof WEATHER_ALERT_CONFIG !== 'undefined') ? WEATHER_ALERT_CONFIG : null;
  var regions = cfg && cfg.dayRegions ? cfg.dayRegions[dayId] : null;
  if (!cfg || !regions || !regions.length) return Promise.resolve({ status: 'na' });
  // 「全冰島」等級的預警（分區名 Iceland）也涵蓋這天的行程區域，一併比對。
  regions = regions.concat('Iceland');
  if (typeof fetch !== 'function') return Promise.resolve({ status: 'failed' });
  var win = weatherDayWindow(dayDate);
  var controller = (typeof AbortController !== 'undefined') ? new AbortController() : null;
  var timer = controller ? setTimeout(function () { controller.abort(); }, cfg.fetchTimeoutMs || 6000) : null;
  return fetch(cfg.apiUrl, controller ? { signal: controller.signal } : {})
    .then(function (res) {
      if (!res.ok) throw new Error('IMO alert fetch: bad status ' + res.status);
      return res.json();
    })
    .then(function (list) {
      if (timer) clearTimeout(timer);
      if (!Array.isArray(list)) return { status: 'failed' };
      var alerts = [];
      list.forEach(function (item) {
        var color = item.parameter && item.parameter.Color && item.parameter.Color[0];
        if (!color || !WEATHER_COLOR_RANK[color]) return;
        var itemRegions = (item.geocode_en && item.geocode_en['Forecast Region']) || [];
        var hit = itemRegions.filter(function (r) { return regions.indexOf(r) !== -1; });
        if (!hit.length) return;
        var onset = item.onset ? Date.parse(item.onset) : NaN;
        var expires = item.expires ? Date.parse(item.expires) : NaN;
        // 生效時間要跟「這一天」重疊；沒有時間資訊就保守當作有效
        if (!isNaN(onset) && onset >= win.end) return;
        if (!isNaN(expires) && expires <= win.start) return;
        alerts.push({ color: color, event: item.event_en || '', regions: hit, onset: onset, expires: expires });
      });
      alerts.sort(function (a, b) { return WEATHER_COLOR_RANK[b.color] - WEATHER_COLOR_RANK[a.color]; });
      return { status: 'ok', alerts: alerts };
    })
    .catch(function () {
      if (timer) clearTimeout(timer);
      return { status: 'failed' };
    });
}

function weatherRenderBox(el, style, html) {
  el.setAttribute('style',
    'background:' + style.bg + ';border:1px solid ' + style.border + ';color:' + style.text +
    ';border-radius:10px;padding:8px 12px;line-height:1.7;');
  el.innerHTML = html;
}

// 把結果套進今日卡 .now-intro；找不到節點（使用者已切走分頁）就什麼都不做。
function applyWeatherAlertToNowCard(dayId, dayDate) {
  return fetchIcelandWeatherAlertsForDay(dayId, dayDate).then(function (result) {
    var el = document.querySelector('.now-dashboard .now-intro');
    if (!el || result.status === 'na') return;
    var areaZh = weatherRegionsZh(WEATHER_ALERT_CONFIG.dayRegions[dayId] || []);

    if (result.status === 'failed') {
      weatherRenderBox(el, WEATHER_UNKNOWN_STYLE,
        '❔ 天气预警暂时查询不到，请自行查看<a href="https://en.vedur.is/" target="_blank" rel="noopener">冰岛气象局</a>。');
      return;
    }
    if (!result.alerts.length) {
      weatherRenderBox(el, WEATHER_OK_STYLE, '✅ 目前没有异常天气预警（冰岛气象局，' + areaZh + '一带）');
      return;
    }
    var top = result.alerts[0];
    var lines = result.alerts.slice(0, 3).map(function (a) {
      var when = (!isNaN(a.onset) && !isNaN(a.expires))
        ? '，生效 ' + weatherFmtTime(new Date(a.onset)) + ' ～ ' + weatherFmtTime(new Date(a.expires)) : '';
      return WEATHER_COLOR_EMOJI[a.color] + ' <b>' + WEATHER_COLOR_LABEL_ZH[a.color] + '·' + weatherEventZh(a.event) + '</b>：' +
        weatherRegionsZh(a.regions) + when + '。' + weatherAdviceZh(a.color);
    });
    if (result.alerts.length > 3) lines.push('另有 ' + (result.alerts.length - 3) + ' 则预警，请到冰岛气象局查看。');
    weatherRenderBox(el, WEATHER_COLOR_STYLE[top.color] || WEATHER_COLOR_STYLE.Yellow,
      '⚠️ 冰岛气象局天气预警（' + areaZh + '一带）<br>' + lines.join('<br>'));
  });
}
