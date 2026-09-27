// 今日卡的天氣警戒摘要（v1.8）：向冰島氣象局（IMO）即時 API 抓「目前生效中」
// 的警戒，比對這一天行程落在哪個官方預報分區，挑等級最高的一筆蓋掉今日卡原本
// 兩三行的行程摘要文字，變成「警戒等級＋警戒內容｜今日行程」。
//
// 純前端 fetch，屬於「加分項」：抓不到（斷網／CORS／逾時／IMO 那邊掛了／今天
// 沒有相關分區）就悄悄放棄，今日卡照舊顯示原本的行程摘要——不能因為這個外部
// API 掛了就讓今日卡跟著壞掉或一直轉圈。
//
// 資料來源與分區對照表見 data/weather-alerts-config.js。

var WEATHER_COLOR_RANK = { Red: 3, Orange: 2, Yellow: 1 };
var WEATHER_COLOR_LABEL_ZH = { Red: '红色警戒', Orange: '橙色警戒', Yellow: '黄色警戒' };
var WEATHER_COLOR_STYLE = {
  Red:    { bg: '#fdecea', border: '#e74c3c', text: '#7a1a12' },
  Orange: { bg: '#fdf0e2', border: '#e67e22', text: '#7a3d0a' },
  Yellow: { bg: '#fdf7e0', border: '#c99a06', text: '#5c4400' }
};

// 抓這一天行程對應分區裡，等級最高的一筆警戒；沒有設定分區、抓失敗、逾時、
// 或沒有符合的警戒，一律回傳 null（呼叫端看到 null 就什麼都不改，維持原狀）。
function fetchIcelandWeatherAlertForDay(dayId) {
  var cfg = (typeof WEATHER_ALERT_CONFIG !== 'undefined') ? WEATHER_ALERT_CONFIG : null;
  var regions = cfg && cfg.dayRegions ? cfg.dayRegions[dayId] : null;
  if (!cfg || !regions || !regions.length || typeof fetch !== 'function') {
    return Promise.resolve(null);
  }
  var controller = (typeof AbortController !== 'undefined') ? new AbortController() : null;
  var timer = controller ? setTimeout(function () { controller.abort(); }, cfg.fetchTimeoutMs || 6000) : null;
  return fetch(cfg.apiUrl, controller ? { signal: controller.signal } : {})
    .then(function (res) {
      if (!res.ok) throw new Error('IMO alert fetch: bad status ' + res.status);
      return res.json();
    })
    .then(function (list) {
      if (timer) clearTimeout(timer);
      if (!Array.isArray(list)) return null;
      var best = null;
      list.forEach(function (item) {
        var color = item.parameter && item.parameter.Color && item.parameter.Color[0];
        if (!color || !WEATHER_COLOR_RANK[color]) return;
        var itemRegions = (item.geocode_en && item.geocode_en['Forecast Region']) || [];
        var matches = itemRegions.some(function (r) { return regions.indexOf(r) !== -1; });
        if (!matches) return;
        if (!best || WEATHER_COLOR_RANK[color] > WEATHER_COLOR_RANK[best.color]) {
          best = {
            color: color,
            headline: item.headline_en || item.event_en || '',
            event: item.event_en || ''
          };
        }
      });
      return best;
    })
    .catch(function () {
      if (timer) clearTimeout(timer);
      return null; // 斷網／CORS／逾時／IMO 那邊掛了，一律當作「沒有警戒」處理
    });
}

// 把警戒資訊套進今日卡：找到目前掛載的 .now-intro 就地整段換掉；找不到（使用者
// 已經切走分頁，或今日卡這次沒有渲染）就什麼都不做。daySummary 是原本兩三行的
// 行程摘要文字，警戒存在時會接在警戒內容後面，維持「結合當地行程」。
function applyWeatherAlertToNowCard(dayId, daySummary) {
  fetchIcelandWeatherAlertForDay(dayId).then(function (alert) {
    if (!alert) return;
    var introEl = document.querySelector('.now-dashboard .now-intro');
    if (!introEl) return;
    var style = WEATHER_COLOR_STYLE[alert.color] || WEATHER_COLOR_STYLE.Yellow;
    var label = WEATHER_COLOR_LABEL_ZH[alert.color] || alert.color;
    introEl.setAttribute('style',
      'background:' + style.bg + ';border:1px solid ' + style.border + ';color:' + style.text +
      ';border-radius:10px;padding:8px 12px;display:flex;gap:8px;align-items:flex-start;');
    introEl.innerHTML =
      '<span aria-hidden="true">⚠️</span>' +
      '<span>冰岛气象局' + label + '：' + alert.headline + (daySummary ? '｜今日行程：' + daySummary : '') + '</span>';
  });
}
