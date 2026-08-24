// ===== AURORA DASHBOARD =====
// 極光頁：「今晚的天空」。版面依規格書 §3.3 重建，CSS／SVG／Canvas 邏輯取自
// tools/aurora-preview.html（已確認的設計原型，commit e5a5370），逐字沿用。
//
// 真實資料源（無任何亂數／模擬數值）：
//   Kp 實測值：https://services.swpc.noaa.gov/products/noaa-planetary-k-index.json         （欄位大寫 Kp）
//   Kp 預報值：https://services.swpc.noaa.gov/products/noaa-planetary-k-index-forecast.json （欄位小寫 kp）
//   雲量／日出日落：Open-Meteo（依地點座標查詢，含逐時雲量與每日日出日落）
//   本頁「可見機率」為本站自行推導的啟發式換算，非官方演算法，介面上標明「本站換算，僅供參考」。
//
// 八方位雲況取樣（階段 C）：以住宿地為中心，八方位 × 10/20/30 km，一次多座標請求
// 取回 25 組資料，繪成連續雲場圖（IDW 內插）。取樣失敗時退回單點資料（不編造方向差異）。

const AURORA_DIRS = ['N','NE','E','SE','S','SW','W','NW'];
const AURORA_DIRNAME = ['正北','東北','正東','東南','正南','西南','正西','西北'];
const AURORA_KM = [10, 20, 30];

let auroraCurrentLocation = 0;
let auroraTheme = 'dark';

// Kp 資料為全球指數，與地點無關，四個地點共用同一份快取
let auroraKpTimeline = [];      // {time, kp, observed} 陣列，涵蓋過去與未來
let auroraKpFetchedAt = null;
let auroraKpFetchFailed = false;

// 每個地點各自的天氣／推算結果快取（key 為 loc.key）
let auroraLocData = {};
let auroraLastUpdate = null;

// OVATION「現在機率」：全球格點資料，按需載入（897 KB，開頁不自動抓）。
// 資料涵蓋全球，載入一次後切換地點只需重新查表，不必重新打 API。
let auroraOvationMap = null;        // Map<'lon360,lat', percent>
let auroraOvationForecastTime = null;
let auroraOvationLoading = false;
let auroraOvationFailed = false;

// canvas 狀態（雲況地圖）
let auroraMapCv = null, auroraMapCtx = null, auroraMapOff = null, auroraMapOffCtx = null;
let auroraMapDpr = 1;
const AURORA_MAP_CSS = 300, AURORA_MAP_R = 150, AURORA_MAP_FIELD = 200;
let auroraMapPts = [];

// ---------- 初始化 ----------

function initAuroraPage() {
  const mount = document.getElementById('mount-aurora');
  if (!mount) return;

  mount.innerHTML = buildAuroraShellHtml();

  // 依今天日期選出預設地點（今晚住宿地）；不在旅程期間時預設雷克雅未克
  auroraCurrentLocation = resolveDefaultAuroraLocation();

  bindAuroraShellEvents();
  renderAuroraDashboard();

  const tripStart = new Date('2026-10-01');
  const tripEnd = new Date('2026-10-12');
  const now = new Date();
  if (now >= tripStart && now <= tripEnd) {
    setInterval(renderAuroraDashboard, 60 * 60 * 1000);
  }
}

function resolveDefaultAuroraLocation() {
  if (typeof TRIP_DATA === 'undefined' || !TRIP_DATA.days) return 0;
  const today = new Date();
  const todayStr = today.getFullYear() + '-' + String(today.getMonth() + 1).padStart(2, '0')
    + '-' + String(today.getDate()).padStart(2, '0');
  const todayDay = TRIP_DATA.days.find(d => d.isoDate === todayStr);
  if (!todayDay) return 0; // 不在旅程期間：預設雷克雅未克（locations[0]）
  const idx = AURORA_CONFIG.locations.findIndex(l => l.nights.indexOf(todayDay.id) !== -1);
  return idx === -1 ? 0 : idx;
}

function isAuroraTripActive() {
  if (typeof TRIP_DATA === 'undefined' || !TRIP_DATA.days) return false;
  const today = new Date();
  const todayStr = today.getFullYear() + '-' + String(today.getMonth() + 1).padStart(2, '0')
    + '-' + String(today.getDate()).padStart(2, '0');
  return !!TRIP_DATA.days.find(d => d.isoDate === todayStr);
}

// ---------- 靜態外殼 HTML（一次掛載，之後只更新內容） ----------

function buildAuroraShellHtml() {
  const tripActive = isAuroraTripActive();
  const notice = tripActive ? '' :
    `<div class="trip-notice">旅程尚未開始，以下為雷克雅未克即時資料。</div>`;

  return `
    <div class="page" id="page-aurora">
      <div class="page-inner">
        <div id="auroraContent">
          ${notice}
          <div class="top">
            <h1>今晚的天空</h1>
            <div style="display:flex;align-items:center;gap:10px">
              <button id="auroraThemeBtn">◑ 淺色</button>
              <span class="upd mono" id="auroraUpdTime">更新中</span>
            </div>
          </div>

          <div class="tabs" id="auroraTabs"></div>

          <div class="swipe" id="auroraSwipe">
            <div class="place">
              <span class="nm" id="auroraPName"></span>
              <span class="sub" id="auroraPSub"></span>
              <span class="today" id="auroraPToday" style="display:none">今晚</span>
            </div>

            <div class="strip-cap">
              <span>日落 <b class="mono" id="auroraTSunset">--:--</b> → 日出 <b class="mono" id="auroraTSunrise">--:--</b></span>
              <span>完全天黑 <b class="mono" id="auroraTDark">--:--</b></span>
            </div>
            <svg class="strip" id="auroraStrip" viewBox="0 0 360 132" preserveAspectRatio="none"
                 role="img" aria-label="今晚從日落到日出的暮光變化、Kp 活動強度與低中雲量"></svg>
            <div class="strip-cap mono" id="auroraStripAxis" style="margin-top:5px;color:var(--ink-3)"></div>

            <div class="legend">
              <span><i style="background:#5FE3A1"></i>Kp 活動</span>
              <span><i style="background:#7C8BE8"></i>低中雲量</span>
              <span><i style="background:#2A4A6B"></i>天未黑</span>
            </div>

            <div class="verdict">
              <div class="lab">今晚值不值得等</div>
              <div class="stars" id="auroraStars">☆☆☆☆☆</div>
              <div class="say" id="auroraSay">計算中…</div>
              <div class="nums" id="auroraNums"></div>
            </div>

            <div class="row2">
              <div class="cell">
                <div class="lab">最佳時段</div>
                <div class="big mono" id="auroraBest">—</div>
                <div class="fine">該時段估計 <b id="auroraBestP" style="color:var(--ink-2)">—</b>　本站換算</div>
              </div>
              <div class="cell">
                <div class="lab">現在機率</div>
                <div class="big mono" id="auroraNow">—</div>
                <div class="fine" id="auroraNowFine"></div>
              </div>
            </div>

            <div class="dir">
              <div class="lab" id="auroraMapLab"></div>
              <div class="cmp-best">
                <span class="ar">↗</span>
                <div><b id="auroraBestLine">計算中…</b><span id="auroraBestSub"></span></div>
              </div>
              <div class="mapwrap">
                <canvas id="auroraCloudMap" width="300" height="300" role="img"
                        aria-label="以住宿地為中心的雲量分佈（八方位 × 10/20/30 公里）"></canvas>
                <span class="cdir n">北</span><span class="cdir e">東</span>
                <span class="cdir s">南</span><span class="cdir w">西</span>
              </div>
              <div class="readout" id="auroraReadout">點一下地圖任一處，看該方向的雲量</div>
              <div class="cmp-scale">
                <span><i id="auroraSc0"></i>晴</span>
                <span><i id="auroraSc1"></i></span>
                <span><i id="auroraSc2"></i></span>
                <span><i id="auroraSc3"></i></span>
                <span><i id="auroraSc4"></i>雲</span>
              </div>
              <div class="fine">
                三圈由內而外為 10 / 20 / 30 公里。數值為低層＋中層雲量；<br>
                高層薄雲半透明，僅作提示。出發前請先確認路況與路線。
              </div>
            </div>
          </div>

          <div class="links">
            <a href="${AURORA_CONFIG.links.vedur}" target="_blank" rel="noopener">
              <b>冰島氣象局</b>全島雲量地圖與極光活動</a>
            <a href="${AURORA_CONFIG.links.road}" target="_blank" rel="noopener">
              <b>Road.is</b>即時路況與封閉資訊</a>
          </div>

          <details class="learn">
            <summary>看到極光需要什麼條件？</summary>
            <div class="ldoc">
              <p class="lead">要看到極光，三件事必須<b>同時</b>成立。缺一件就是零，不是打折。</p>

              <div class="lrow"><span class="li">1</span><div>
                <b>天要夠黑</b>
                <p>極光一直都在，只是白天被日光蓋過。太陽落到地平線下約 12 度之後天才算真的暗，
                冰島十月大約是日落後一個半小時。這就是上方光帶裡深色那一段。</p>
              </div></div>

              <div class="lrow"><span class="li">2</span><div>
                <b>極光活動要夠強 —— 這就是 Kp</b>
                <p>Kp 是全球地磁擾動指數，0 到 9，每 3 小時一個值。數字越大，極光帶往低緯度擴張得越遠、也越明亮。</p>
                <p>但冰島有個先天優勢：<b>它本來就位在極光帶正下方</b>。所以在冰島 <b>Kp 2 到 3 常常就夠看</b>，
                不必等到 5 以上。Kp 5 以上屬於地磁風暴，一趟旅程遇到一兩次算幸運。</p>
              </div></div>

              <div class="lrow"><span class="li">3</span><div>
                <b>雲要夠少 —— 而且只看低層和中層</b>
                <p>極光發生在 100 公里以上的高空，比所有雲都高。所以雲不是「減弱」極光，是<b>直接擋死</b>。</p>
                <p>但三層雲的差別很大：<b>低層與中層雲不透光</b>，有就是完全看不到；
                <b>高層的卷雲是半透明的</b>，較亮的極光穿得過去，頂多像蒙了一層薄紗。</p>
                <p>所以本頁所有判斷只看低中雲，高雲僅作提示。冰島氣象局的雲量地圖也建議看「低層與中層」那一層。</p>
              </div></div>

              <div class="lnote">
                <b>為什麼權重不是各半？</b>
                <p>雲是硬否決條件，Kp 只要過門檻就行。
                <b>Kp 5 但低中雲 80%，結果多半是什麼都沒看到</b>；
                反過來 Kp 2 但萬里無雲，卻常常看得很清楚。所以判斷時先看雲，再看 Kp。</p>
              </div>

              <div class="lnote">
                <b>月光呢？</b>
                <p>滿月會洗掉比較暗弱的極光，但也會照亮地景，拍起來反而好看。
                影響不到雲那麼關鍵，本頁只當作參考提示。</p>
              </div>

              <div class="lnote">
                <b>實際操作</b>
                <p>到了現場給眼睛 15 到 20 分鐘適應黑暗，遠離路燈。
                極光是一陣一陣的，安靜半小時後突然爆發很常見，值得多等一會兒。</p>
              </div>
            </div>
          </details>

          <div class="foot">
            極光活動與機率來自 NOAA SWPC，雲量與日照來自 Open-Meteo。<br>
            星級為本站依上述資料自行換算，本站換算僅供參考，權威預報請以冰島氣象局為準。
          </div>
        </div>
      </div>
    </div>
  `;
}

function bindAuroraShellEvents() {
  // 地點標籤列
  const tabs = document.getElementById('auroraTabs');
  tabs.innerHTML = '';
  AURORA_CONFIG.locations.forEach((l, i) => {
    const b = document.createElement('div');
    b.className = 'tab';
    b.dataset.i = i;
    b.innerHTML = l.name + '<span class="tn">' + auroraLocationTag(l) + '</span>';
    b.onclick = () => switchAuroraLocation(i);
    tabs.appendChild(b);
  });

  // 左右滑（門檻：水平位移 > 50px 且 > 垂直位移 × 1.5）
  const sw = document.getElementById('auroraSwipe');
  let x0 = null, y0 = null;
  sw.addEventListener('touchstart', e => {
    x0 = e.touches[0].clientX; y0 = e.touches[0].clientY;
  }, { passive: true });
  sw.addEventListener('touchend', e => {
    if (x0 === null) return;
    const dx = e.changedTouches[0].clientX - x0;
    const dy = e.changedTouches[0].clientY - y0;
    x0 = null;
    if (Math.abs(dx) < 50 || Math.abs(dx) < Math.abs(dy) * 1.5) return;
    const next = dx < 0
      ? Math.min(auroraCurrentLocation + 1, AURORA_CONFIG.locations.length - 1)
      : Math.max(auroraCurrentLocation - 1, 0);
    switchAuroraLocation(next);
  }, { passive: true });

  // 主題切換
  const tb = document.getElementById('auroraThemeBtn');
  tb.onclick = () => {
    auroraTheme = auroraTheme === 'dark' ? 'light' : 'dark';
    const root = document.getElementById('page-aurora');
    if (root) root.setAttribute('data-theme', auroraTheme === 'light' ? 'light' : '');
    tb.textContent = auroraTheme === 'dark' ? '◑ 淺色' : '◐ 深色';
    renderAuroraDashboardUiOnly();
  };

  // 雲況地圖 canvas
  auroraMapCv = document.getElementById('auroraCloudMap');
  auroraMapCtx = auroraMapCv && auroraMapCv.getContext ? auroraMapCv.getContext('2d') : null;
  if (auroraMapCtx) {
    auroraMapDpr = Math.min(window.devicePixelRatio || 1, 3);
    auroraMapCv.width = AURORA_MAP_CSS * auroraMapDpr;
    auroraMapCv.height = AURORA_MAP_CSS * auroraMapDpr;
  }
  auroraMapOff = document.createElement('canvas');
  auroraMapOff.width = AURORA_MAP_FIELD;
  auroraMapOff.height = AURORA_MAP_FIELD;
  auroraMapOffCtx = auroraMapOff.getContext ? auroraMapOff.getContext('2d') : null;

  auroraMapCv && auroraMapCv.addEventListener('click', e => {
    const b = auroraMapCv.getBoundingClientRect();
    const x = (e.clientX - b.left) / b.width * AURORA_MAP_CSS;
    const y = (e.clientY - b.top) / b.height * AURORA_MAP_CSS;
    const dx = x - AURORA_MAP_R, dy = y - AURORA_MAP_R;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist > AURORA_MAP_R) return;
    const km = Math.round(dist / (AURORA_MAP_R * 0.94) * 30);
    const ang = (Math.atan2(dy, dx) * 180 / Math.PI + 90 + 360) % 360;
    const v = Math.round(auroraSampleMap(x, y));
    document.getElementById('auroraReadout').innerHTML = km < 3
      ? '所在地　低中雲 <b>' + v + '%</b>'
      : AURORA_DIRNAME[Math.round(ang / 45) % 8] + '方向 ' + km + ' 公里　低中雲 <b>' + v + '%</b>';
  });
}

function auroraLocationTag(l) {
  if (l.nights.length === 0) return '參考點';
  if (typeof TRIP_DATA === 'undefined' || !TRIP_DATA.days) return '';
  const d = TRIP_DATA.days.find(d => d.id === l.nights[0]);
  return d ? (d.month + d.date + '日') : '';
}

function auroraLocationSub(l) {
  if (l.nights.length === 0) return '參考點・非住宿';
  if (typeof TRIP_DATA === 'undefined' || !TRIP_DATA.days) return '住宿地';
  const days = l.nights.map(id => TRIP_DATA.days.find(d => d.id === id)).filter(Boolean);
  if (days.length === 0) return '住宿地';
  const first = days[0], last = days[days.length - 1];
  let label = first.month + first.date + '日';
  if (days.length > 1) label += '–' + last.date + '日';
  return label + ' · 住宿地';
}

// ---------- 天文計算（真實公式，非亂數；用於黑暗係數與月齡） ----------
// 太陽仰角：低精度天文年曆公式（Astronomical Almanac low-precision formula），
// 精度約 ±0.01°，足供判斷「天黑到什麼程度」使用。

// Open-Meteo 的 timezone=auto 回傳「當地掛鐘時間」字串（無時區標記）。
// 直接用 new Date() 解析會被瀏覽器當成「瀏覽器所在時區」的時間，離開冰島時區測試會整批算錯。
// 用回應本身的 utc_offset_seconds 換算回正確的 UTC 時刻，才能與真正的「現在」正確比較。
function auroraParseLocalTime(str, utcOffsetSeconds) {
  const fakeUtcMs = Date.parse(str + 'Z'); // 把掛鐘數字當成 UTC 解析
  return new Date(fakeUtcMs - utcOffsetSeconds * 1000);
}

function auroraJulianDay(date) {
  return date.getTime() / 86400000 + 2440587.5;
}

function auroraSolarElevationDeg(date, lat, lon) {
  const jd = auroraJulianDay(date);
  const n = jd - 2451545.0;
  const rad = Math.PI / 180;

  let L = (280.460 + 0.9856474 * n) % 360; if (L < 0) L += 360;
  let g = (357.528 + 0.9856003 * n) % 360; if (g < 0) g += 360;
  const gRad = g * rad;
  const lambda = L + 1.915 * Math.sin(gRad) + 0.020 * Math.sin(2 * gRad);
  const lambdaRad = lambda * rad;
  const epsilon = (23.439 - 0.0000004 * n) * rad;

  const alpha = Math.atan2(Math.cos(epsilon) * Math.sin(lambdaRad), Math.cos(lambdaRad)) / rad;
  const delta = Math.asin(Math.sin(epsilon) * Math.sin(lambdaRad));

  let gmst = (280.46061837 + 360.98564736629 * n) % 360; if (gmst < 0) gmst += 360;
  let lst = (gmst + lon) % 360; if (lst < 0) lst += 360;
  let H = lst - alpha; if (H > 180) H -= 360; if (H < -180) H += 360;
  const Hrad = H * rad;

  const latRad = lat * rad;
  const sinAlt = Math.sin(latRad) * Math.sin(delta) + Math.cos(latRad) * Math.cos(delta) * Math.cos(Hrad);
  return Math.asin(Math.max(-1, Math.min(1, sinAlt))) / rad;
}

// 月齡（距離上一次朔的天數）：以已知朔望日為基準，模同步月週期，屬標準天文近似公式。
function auroraMoonAgeDays(date) {
  const synodic = 29.53058867;
  const knownNewMoonJd = 2451550.1; // 2000-01-06 18:14 UTC
  const jd = auroraJulianDay(date);
  let age = (jd - knownNewMoonJd) % synodic;
  if (age < 0) age += synodic;
  return age;
}

function auroraDarkFactor(elevDeg) {
  if (elevDeg > -6) return 0;
  if (elevDeg > -12) return 0.3;
  if (elevDeg > -18) return 0.8;
  return 1.0;
}

function auroraClearFactor(low, mid, high) {
  return (1 - low / 100) * (1 - mid / 100) * (1 - high * 0.4 / 100);
}

// 有效低中雲遮蔽（合併表示用，用於顯示數值與否決判斷）
function auroraEffectiveLowMid(low, mid) {
  return Math.round((1 - (1 - low / 100) * (1 - mid / 100)) * 100);
}

function auroraKpActivityFactor(kp) {
  if (kp < 1) return 0.2;
  if (kp < 2) return 0.5;
  if (kp < 3) return 0.75;
  if (kp < 4) return 0.9;
  return 1.0;
}

function auroraNearestKp(time) {
  if (auroraKpTimeline.length === 0) return null;
  let best = auroraKpTimeline[0], bestDiff = Math.abs(time - best.time);
  for (let i = 1; i < auroraKpTimeline.length; i++) {
    const diff = Math.abs(time - auroraKpTimeline[i].time);
    if (diff < bestDiff) { best = auroraKpTimeline[i]; bestDiff = diff; }
  }
  return best.kp;
}

// ---------- 資料取得 ----------

async function fetchAuroraKpData() {
  try {
    const [obsRes, fcRes] = await Promise.all([
      fetch('https://services.swpc.noaa.gov/products/noaa-planetary-k-index.json'),
      fetch('https://services.swpc.noaa.gov/products/noaa-planetary-k-index-forecast.json')
    ]);
    if (!obsRes.ok || !fcRes.ok) throw new Error('Kp API 回應非 200');

    const obsData = await obsRes.json();
    const fcData = await fcRes.json();

    const observedSeries = (obsData || [])
      .filter(row => row && row.time_tag && typeof row.Kp === 'number')
      .map(row => ({ time: new Date(row.time_tag + 'Z'), kp: row.Kp, observed: true }));

    const forecastSeries = (fcData || [])
      .filter(row => row && row.time_tag && typeof row.kp === 'number')
      .map(row => ({ time: new Date(row.time_tag + 'Z'), kp: row.kp, observed: row.observed === 'observed' }));

    if (observedSeries.length === 0 && forecastSeries.length === 0) {
      throw new Error('Kp API 回傳內容為空或格式不符預期');
    }

    const now = Date.now();
    const windowStart = now - 12 * 60 * 60 * 1000;
    const windowEnd = now + 48 * 60 * 60 * 1000;
    auroraKpTimeline = forecastSeries
      .filter(pt => pt.time.getTime() >= windowStart && pt.time.getTime() <= windowEnd)
      .sort((a, b) => a.time - b.time);

    if (auroraKpTimeline.length === 0) {
      auroraKpTimeline = observedSeries
        .filter(pt => pt.time.getTime() >= windowStart && pt.time.getTime() <= windowEnd)
        .sort((a, b) => a.time - b.time);
    }

    auroraKpFetchFailed = auroraKpTimeline.length === 0;
    auroraKpFetchedAt = Date.now();
  } catch (e) {
    console.warn('[Aurora] Kp 資料取得失敗，不使用任何模擬數值：', e);
    auroraKpTimeline = [];
    auroraKpFetchFailed = true;
    auroraKpFetchedAt = Date.now();
  }
}

async function fetchAuroraWeather(loc) {
  try {
    const url = 'https://api.open-meteo.com/v1/forecast'
      + '?latitude=' + loc.lat + '&longitude=' + loc.lon
      + '&current=temperature_2m,wind_speed_10m,cloud_cover,cloud_cover_low,cloud_cover_mid,cloud_cover_high'
      + '&hourly=cloud_cover_low,cloud_cover_mid,cloud_cover_high,cloud_cover'
      + '&daily=sunrise,sunset&timezone=auto&forecast_days=2';
    const res = await fetch(url);
    if (!res.ok) throw new Error('Open-Meteo 回應非 200（' + res.status + '）');
    const data = await res.json();
    if (!data.current || !data.hourly || !data.daily || typeof data.utc_offset_seconds !== 'number') {
      throw new Error('Open-Meteo 回傳缺少必要區塊');
    }
    return { ok: true, data };
  } catch (e) {
    console.warn('[Aurora] 天氣資料取得失敗（' + loc.name + '），不使用任何模擬數值：', e);
    return { ok: false, data: null };
  }
}

// ---------- 八方位雲況取樣（階段 C）----------
// 以住宿地為中心，八方位 × 10/20/30 km，一次多座標請求取回 25 組資料。
// 取樣點順序固定為：[中心, N10,N20,N30, NE10,NE20,NE30, … , NW10,NW20,NW30]，
// 與 drawAuroraMap() 畫圖時的點位順序一致，兩邊都不能各自調整順序。

function auroraOffsetLatLon(lat, lon, bearingDeg, km) {
  const R = 6371, b = bearingDeg * Math.PI / 180;
  const dLat = (km / R) * Math.cos(b) * 180 / Math.PI;
  const dLon = (km / R) * Math.sin(b) * 180 / Math.PI / Math.cos(lat * Math.PI / 180);
  return [lat + dLat, lon + dLon];
}

function auroraBuildRingPoints(loc) {
  const pts = [{ lat: loc.lat, lon: loc.lon, dir: null, km: null }];
  AURORA_DIRS.forEach((dir, i) => {
    const bearing = i * 45;
    AURORA_KM.forEach(km => {
      const [lat, lon] = auroraOffsetLatLon(loc.lat, loc.lon, bearing, km);
      pts.push({ lat, lon, dir, km });
    });
  });
  return pts;
}

async function fetchAuroraRingData(loc) {
  const points = auroraBuildRingPoints(loc);
  try {
    const latStr = points.map(p => p.lat.toFixed(4)).join(',');
    const lonStr = points.map(p => p.lon.toFixed(4)).join(',');
    const url = 'https://api.open-meteo.com/v1/forecast'
      + '?latitude=' + latStr + '&longitude=' + lonStr
      + '&hourly=cloud_cover_low,cloud_cover_mid,cloud_cover_high'
      + '&timezone=auto&forecast_days=2';
    const res = await fetch(url);
    if (!res.ok) throw new Error('Open-Meteo 多座標回應非 200（' + res.status + '）');
    const raw = await res.json();
    // ⚠️ 多座標時回傳陣列；理論上單座標才會是物件，這裡固定送 25 點，保險起見仍判斷型別
    const entries = Array.isArray(raw) ? raw : [raw];
    if (entries.length !== points.length) {
      throw new Error('Open-Meteo 多座標回傳筆數（' + entries.length + '）與請求點數（' + points.length + '）不符');
    }

    const values = entries.map(entry => {
      if (!entry.hourly || typeof entry.utc_offset_seconds !== 'number') return null;
      const offset = entry.utc_offset_seconds;
      const times = entry.hourly.time;
      let bestIdx = -1, bestDiff = Infinity;
      const now = new Date();
      for (let i = 0; i < times.length; i++) {
        const t = auroraParseLocalTime(times[i], offset);
        const diff = Math.abs(t - now);
        if (diff < bestDiff) { bestDiff = diff; bestIdx = i; }
      }
      if (bestIdx === -1) return null;
      const low = entry.hourly.cloud_cover_low[bestIdx];
      const mid = entry.hourly.cloud_cover_mid[bestIdx];
      if (typeof low !== 'number' || typeof mid !== 'number') return null;
      return auroraEffectiveLowMid(low, mid);
    });

    if (values[0] === null) throw new Error('中心點雲量資料缺失');

    const byDir = {};
    AURORA_DIRS.forEach((dir, i) => {
      byDir[dir] = [values[1 + i * 3], values[1 + i * 3 + 1], values[1 + i * 3 + 2]];
    });

    return { ok: true, center: values[0], byDir };
  } catch (e) {
    console.warn('[Aurora] 八方位雲況取樣失敗（' + loc.name + '），不編造方向資料：', e);
    return { ok: false };
  }
}

// ---------- 綜合推算：今晚每小時的可見機率、星級、最佳時段 ----------

function buildAuroraTonight(loc, weatherResult) {
  if (!weatherResult.ok) return { ok: false };

  const data = weatherResult.data;
  const offset = data.utc_offset_seconds;
  const hourlyTime = data.hourly.time;
  const hours = hourlyTime.map((t, i) => {
    const time = auroraParseLocalTime(t, offset);
    const elevDeg = auroraSolarElevationDeg(time, loc.lat, loc.lon);
    const low = data.hourly.cloud_cover_low[i];
    const mid = data.hourly.cloud_cover_mid[i];
    const high = data.hourly.cloud_cover_high[i];
    const total = data.hourly.cloud_cover[i];
    const kp = auroraNearestKp(time);
    const dark = auroraDarkFactor(elevDeg);
    const clear = (typeof low === 'number' && typeof mid === 'number' && typeof high === 'number')
      ? auroraClearFactor(low, mid, high) : null;
    const activity = (kp !== null) ? auroraKpActivityFactor(kp) : null;
    const prob = (clear !== null && activity !== null) ? activity * clear * dark : null;
    const effLowMid = (typeof low === 'number' && typeof mid === 'number') ? auroraEffectiveLowMid(low, mid) : null;
    return { time, elevDeg, low, mid, high, total, kp, dark, clear, activity, prob, effLowMid };
  });

  const sunset = data.daily.sunset[0] ? auroraParseLocalTime(data.daily.sunset[0], offset) : null;
  const sunriseStr = data.daily.sunrise[1] || data.daily.sunrise[0];
  const sunrise = sunriseStr ? auroraParseLocalTime(sunriseStr, offset) : null;

  // 完全天黑時刻：日落後太陽仰角首次 <= -18 度（每 5 分鐘掃描一次，取精確時間）。
  // 掃描範圍必須到日出為止，不能只掃 3 小時——冰島經度偏西，太陽仰角最低點
  // （約當地太陽子夜）比日落晚 4 小時以上才到，掃太短會誤判成「沒有完全天黑」。
  // 夏天則是另一回事：緯度夠高時，太陽整晚都不會低於 -18 度（永昏／永曉），
  // 這種情況下 darkStart 為 null 是天文事實，不是資料錯誤，UI 要分開講。
  let darkStart = null;
  let noFullDarkness = false;
  if (sunset) {
    const scanEnd = sunrise ? sunrise.getTime() : sunset.getTime() + 12 * 60 * 60000;
    let minElev = Infinity;
    for (let t = sunset.getTime(); t <= scanEnd; t += 5 * 60000) {
      const elev = auroraSolarElevationDeg(new Date(t), loc.lat, loc.lon);
      if (elev < minElev) minElev = elev;
      if (darkStart === null && elev <= -18) darkStart = new Date(t);
    }
    if (darkStart === null && minElev > -18) noFullDarkness = true;
  }

  // 找出可見機率最高點：優先用「完全天黑」時段（elevDeg <= -18）。
  // 但夏天在冰島這種高緯度，太陽整晚可能都不會低於 -18 度（見上面 noFullDarkness），
  // 這種情況下這裡若堅持只看完全天黑的時段，會整晚一小時都篩不到，整張判斷卡
  // 變成「暫時取不到資料」——但那不是真的沒資料，是門檻設太嚴。
  // 退一步改用航海暮光（elevDeg <= -12，對應 auroraDarkFactor 的 0.8 那一檔）
  // 來評估，並在結論文字裡誠實註明用的是哪一種暗度，不要讓使用者誤以為是完全天黑。
  let fullDarkHours = hours.filter(h => h.elevDeg <= -18 && h.prob !== null);
  let darkTierUsed = 'astronomical';
  if (fullDarkHours.length === 0) {
    fullDarkHours = hours.filter(h => h.elevDeg <= -12 && h.prob !== null);
    darkTierUsed = 'nautical';
  }
  if (fullDarkHours.length === 0) darkTierUsed = 'none';

  let peakProb = 0, peakHour = null;
  fullDarkHours.forEach(h => { if (h.prob > peakProb) { peakProb = h.prob; peakHour = h; } });

  let bestSlot = null;
  if (peakHour && peakProb * 100 >= 5) {
    const idxInFull = fullDarkHours.indexOf(peakHour);
    let s = idxInFull, e = idxInFull;
    while (s > 0 && fullDarkHours[s - 1].prob >= peakProb * 0.9) s--;
    while (e < fullDarkHours.length - 1 && fullDarkHours[e + 1].prob >= peakProb * 0.9) e++;
    const startT = fullDarkHours[s].time, endT = new Date(fullDarkHours[e].time.getTime() + 60 * 60000);
    bestSlot = {
      label: auroraFmtHM(startT) + '–' + auroraFmtHM(endT),
      probPct: Math.round(peakProb * 100),
      startT, endT
    };
  }

  // 否決規則：全黑（或退而求其次的航海暮光）時段內「低中雲」最差（最高）值 >= 70% → 最多 1 星
  let worstEffHour = null, worstEff = -1;
  fullDarkHours.forEach(h => { if (h.effLowMid !== null && h.effLowMid > worstEff) { worstEff = h.effLowMid; worstEffHour = h; } });
  const vetoed = worstEff >= 70;

  let stars;
  if (vetoed) stars = 1;
  else if (peakProb * 100 >= 45) stars = 5;
  else if (peakProb * 100 >= 30) stars = 4;
  else if (peakProb * 100 >= 18) stars = 3;
  else if (peakProb * 100 >= 8) stars = 2;
  else stars = 1;

  // 四個數值的參考時刻：否決時用最差雲況時刻，否則用最佳時段的峰值時刻
  const refHour = vetoed ? worstEffHour : (peakHour || worstEffHour);
  const moonAge = auroraMoonAgeDays(new Date());

  const nums = refHour ? [
    ['Kp', refHour.kp !== null ? refHour.kp.toFixed(1) : '—', auroraKpDesc(refHour.kp), ''],
    ['低中雲', refHour.effLowMid !== null ? refHour.effLowMid + '%' : '—',
      vetoed ? '主要原因' : auroraCloudDesc(refHour.effLowMid), vetoed ? 'no' : (refHour.effLowMid !== null && refHour.effLowMid < 30 ? 'ok' : '')],
    ['高雲', typeof refHour.high === 'number' ? Math.round(refHour.high) + '%' : '—', '半透明', ''],
    ['月齡', moonAge.toFixed(0) + ' 天', '參考用', '']
  ] : [
    ['Kp', '—', '暫時取不到資料', ''],
    ['低中雲', '—', '暫時取不到資料', ''],
    ['高雲', '—', '暫時取不到資料', ''],
    ['月齡', moonAge.toFixed(0) + ' 天', '參考用', '']
  ];

  const tierNote = darkTierUsed === 'nautical' ? '（本季無完全天黑，以航海暮光估算）' : '';
  let say;
  if (!refHour) say = darkTierUsed === 'none' ? '本季這個時段幾乎不會天黑，無法判斷' : '暫時取不到足夠資料進行判斷';
  else if (vetoed) say = '雲層過厚，今晚多半看不到' + tierNote;
  else if (stars >= 5) say = '非常值得等，' + (bestSlot ? bestSlot.label + ' 前後條件絕佳' : '今晚條件絕佳') + tierNote;
  else if (stars >= 4) say = '值得等，' + (bestSlot ? bestSlot.label + ' 前後條件不錯' : '今晚條件不錯') + tierNote;
  else if (stars >= 3) say = '尚可，' + (bestSlot ? bestSlot.label + ' 前後有機會' : '今晚有機會') + tierNote;
  else if (stars >= 2) say = '機會不高，但' + (bestSlot ? bestSlot.label + ' 仍有機會' : '仍有機會') + tierNote;
  else say = '極光活動偏弱或雲況不佳，今晚機會不大' + tierNote;

  // 單點雲況地圖用值：取「現在」時刻最接近的一筆 low/mid 有效值
  const nowIdx = hours.reduce((best, h, i) => {
    const diff = Math.abs(h.time - new Date());
    return (best === -1 || diff < Math.abs(hours[best].time - new Date())) ? i : best;
  }, -1);
  const mapCenterValue = (nowIdx !== -1 && hours[nowIdx].effLowMid !== null) ? hours[nowIdx].effLowMid : null;

  // 「今晚這一條」SVG 只畫一個晚上（日落前一小時到日出後一小時），
  // 不能塞整段 48 小時預報——天空漸層是照「一次日落到日出」的固定比例畫的，
  // 塞兩天進去會讓漸層對不上真實天黑時間，而且兩天份的資料擠進同一張圖的
  // 每格會變得很窄，鄰近格雲量本來就會有落差，格子一窄，落差看起來就變成
  // 一格一格明顯的色塊，而不是原設計那種平滑的雲層漸層感。
  let stripHours = hours;
  if (sunset && sunrise) {
    const winStart = new Date(sunset.getTime() - 60 * 60000);
    const winEnd = new Date(sunrise.getTime() + 60 * 60000);
    const windowed = hours.filter(h => h.time >= winStart && h.time <= winEnd);
    if (windowed.length >= 2) stripHours = windowed;
  }

  return {
    ok: true,
    hours, stripHours,
    sunset, sunrise, darkStart, noFullDarkness,
    bestSlot, stars, say, nums, mapCenterValue,
    currentTemp: data.current.temperature_2m,
    currentWind: data.current.wind_speed_10m
  };
}

// 一律以冰島當地時區顯示時刻，避免使用者裝置不在冰島時區時（例如出發前用台灣手機測試）
// getHours()/getMinutes() 顯示成瀏覽器所在時區的時間。
const AURORA_TZ_FORMATTER = (typeof Intl !== 'undefined')
  ? new Intl.DateTimeFormat('zh-TW', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Atlantic/Reykjavik' })
  : null;

function auroraFmtHM(date) {
  if (AURORA_TZ_FORMATTER) {
    return AURORA_TZ_FORMATTER.format(date).replace(/^24:/, '00:');
  }
  return String(date.getHours()).padStart(2, '0') + ':' + String(date.getMinutes()).padStart(2, '0');
}

function auroraKpDesc(kp) {
  if (kp === null) return '—';
  if (kp < 2) return '偏低';
  if (kp < 3) return '中等';
  if (kp < 4) return '偏高';
  return '很高';
}

function auroraCloudDesc(v) {
  if (v === null) return '—';
  if (v < 15) return '大致晴空';
  if (v < 40) return '部分多雲';
  if (v < 70) return '多雲';
  return '陰天';
}

// ---------- OVATION「現在機率」（階段 D，按需載入）----------
// 格點查詢：經度 0–360，緯度有正負（lat=-63 是南極光，本頁地點皆為北半球正緯度）。

function auroraOvationKey(lat, lon) {
  const lon360 = Math.round((lon + 360) % 360);
  return lon360 + ',' + Math.round(lat);
}

async function loadAuroraOvation() {
  if (auroraOvationLoading) return;
  auroraOvationLoading = true;
  auroraOvationFailed = false;
  renderAuroraNowCell();

  try {
    const res = await fetch('https://services.swpc.noaa.gov/json/ovation_aurora_latest.json');
    if (!res.ok) throw new Error('OVATION API 回應非 200（' + res.status + '）');
    const data = await res.json();
    if (!data.coordinates || !data['Forecast Time']) throw new Error('OVATION 回傳缺少必要欄位');

    const map = new Map();
    data.coordinates.forEach(c => { map.set(c[0] + ',' + c[1], c[2]); });
    auroraOvationMap = map;
    auroraOvationForecastTime = new Date(data['Forecast Time']); // 含 Z，直接是正確 UTC 時刻
    auroraOvationFailed = false;
  } catch (e) {
    console.warn('[Aurora] OVATION 現在機率取得失敗，不使用任何模擬數值：', e);
    auroraOvationMap = null;
    auroraOvationForecastTime = null;
    auroraOvationFailed = true;
  }
  auroraOvationLoading = false;
  renderAuroraNowCell();
}

// 只重繪「現在機率」這一格，供載入完成或切換地點時呼叫
function renderAuroraNowCell() {
  const nowEl = document.getElementById('auroraNow');
  const fineEl = document.getElementById('auroraNowFine');
  if (!nowEl || !fineEl) return;

  const loc = AURORA_CONFIG.locations[auroraCurrentLocation];

  if (auroraOvationLoading) {
    nowEl.innerHTML = '<span class="mono" style="font-size:14px;color:var(--ink-3)">載入中…</span>';
    fineEl.textContent = '資料量較大（約 900 KB），慢速網路請稍候數秒';
    return;
  }

  if (auroraOvationFailed) {
    nowEl.innerHTML = '<span style="font-size:14px;color:var(--ink-3)">暫時取不到資料</span>';
    fineEl.innerHTML = 'NOAA OVATION　<button class="ovation-btn" id="auroraOvationBtn" type="button">重試</button>';
    const btn = document.getElementById('auroraOvationBtn');
    if (btn) btn.onclick = loadAuroraOvation;
    return;
  }

  if (!auroraOvationMap) {
    nowEl.innerHTML = '<button class="ovation-btn" id="auroraOvationBtn" type="button">查看現在機率</button>';
    fineEl.textContent = 'NOAA OVATION　未來 30 分鐘（按需載入，約 900 KB）';
    const btn = document.getElementById('auroraOvationBtn');
    if (btn) btn.onclick = loadAuroraOvation;
    return;
  }

  const key = auroraOvationKey(loc.lat, loc.lon);
  const value = auroraOvationMap.has(key) ? auroraOvationMap.get(key) : null;
  // 白天顯示 0% 屬正常（OVATION 只反映極光活動本身，未排除日照），不視為錯誤
  nowEl.textContent = (value === null) ? '—' : value + '%';
  fineEl.textContent = 'NOAA OVATION　預報時間 '
    + (auroraOvationForecastTime ? auroraFmtHM(auroraOvationForecastTime) : '—')
    + '　未來 30 分鐘';
}

// ---------- 方向建議（階段 C）----------
// 誠實原則：差距 < 10 個百分點時明確說「差距不大，不一定要特地移動」——
// 差 3% 不值得半夜開車。文案一律用「東側條件較好」而非「往東開 20 公里」，
// 避免暗示不明路況下的駕駛指示；出發前請先確認路況與路線（見下方 .dir .fine）。
function auroraBuildDirectionConclusion(loc, ring) {
  if (!ring || !ring.ok) {
    return { bestLine: '暫時取不到方向資料', bestSub: '八方位雲況取樣本次失敗，僅顯示所在地單點資料' };
  }

  let bestDir = null, bestKmIdx = -1, bestVal = Infinity;
  AURORA_DIRS.forEach(dir => {
    ring.byDir[dir].forEach((v, kmIdx) => {
      if (typeof v === 'number' && v < bestVal) { bestVal = v; bestDir = dir; bestKmIdx = kmIdx; }
    });
  });

  if (bestDir === null) {
    return { bestLine: '暫時取不到方向資料', bestSub: '八方位雲況取樣本次失敗，僅顯示所在地單點資料' };
  }

  const diff = ring.center - bestVal;
  if (diff < 10) {
    return {
      bestLine: '四周條件差不多　所在地低中雲 ' + ring.center + '%',
      bestSub: '差距不大，不一定要特地移動'
    };
  }

  const dirName = AURORA_DIRNAME[AURORA_DIRS.indexOf(bestDir)];
  const km = AURORA_KM[bestKmIdx];
  return {
    bestLine: dirName + '側 ' + km + ' 公里條件較好　低中雲 ' + bestVal + '%',
    bestSub: '所在地 ' + ring.center + '%，出發前請先確認路況與路線'
  };
}

// ---------- 主渲染流程 ----------

async function renderAuroraDashboard() {
  const kpStale = !auroraKpFetchedAt || (Date.now() - auroraKpFetchedAt) > 5 * 60 * 1000;
  if (kpStale) await fetchAuroraKpData();

  const loc = AURORA_CONFIG.locations[auroraCurrentLocation];
  const [weatherResult, ringResult] = await Promise.all([
    fetchAuroraWeather(loc),
    fetchAuroraRingData(loc)
  ]);
  const tonight = buildAuroraTonight(loc, weatherResult);
  tonight.ring = ringResult;
  tonight.direction = auroraBuildDirectionConclusion(loc, ringResult);
  auroraLocData[loc.key] = tonight;

  auroraLastUpdate = new Date();
  renderAuroraDashboardUiOnly();
}

// 只重繪畫面（不重新打 API），用於切主題、初次掛載已抓好資料後的重繪
function renderAuroraDashboardUiOnly() {
  const loc = AURORA_CONFIG.locations[auroraCurrentLocation];
  const tonight = auroraLocData[loc.key];
  if (!tonight) return;

  [].forEach.call(document.getElementById('auroraTabs').children, (b, i) => {
    b.classList.toggle('on', i === auroraCurrentLocation);
  });

  document.getElementById('auroraPName').textContent = loc.name;
  document.getElementById('auroraPSub').textContent = auroraLocationSub(loc);
  document.getElementById('auroraPToday').style.display =
    (auroraCurrentLocation === resolveDefaultAuroraLocation() && isAuroraTripActive()) ? 'inline-block' : 'none';

  document.getElementById('auroraUpdTime').textContent = auroraLastUpdate
    ? auroraFmtHM(auroraLastUpdate) + ' 更新' : '更新中';

  renderAuroraNowCell(); // OVATION 現在機率與資料流程獨立，不論今晚判斷是否成功都要更新

  if (!tonight.ok) {
    document.getElementById('auroraTSunset').textContent = '暫時取不到資料';
    document.getElementById('auroraTSunrise').textContent = '暫時取不到資料';
    document.getElementById('auroraTDark').textContent = '暫時取不到資料';
    document.getElementById('auroraStars').textContent = '☆☆☆☆☆';
    document.getElementById('auroraSay').textContent = '暫時取不到資料';
    document.getElementById('auroraNums').innerHTML = '';
    document.getElementById('auroraBest').textContent = '—';
    document.getElementById('auroraBestP').textContent = '暫時取不到資料';
    document.getElementById('auroraStrip').innerHTML = '';
    return;
  }

  document.getElementById('auroraTSunset').textContent = tonight.sunset ? auroraFmtHM(tonight.sunset) : '暫時取不到資料';
  document.getElementById('auroraTSunrise').textContent = tonight.sunrise ? auroraFmtHM(tonight.sunrise) : '暫時取不到資料';
  document.getElementById('auroraTDark').textContent = tonight.darkStart
    ? auroraFmtHM(tonight.darkStart)
    : (tonight.noFullDarkness ? '本季無完全天黑' : '暫時取不到資料');

  document.getElementById('auroraStars').textContent = '★★★★★☆☆☆☆☆'.slice(5 - tonight.stars, 10 - tonight.stars);
  document.getElementById('auroraSay').textContent = tonight.say;
  document.getElementById('auroraNums').innerHTML = tonight.nums.map(n =>
    '<div class="n"><span class="nk">' + n[0] + '</span>'
    + '<span class="nv mono ' + n[3] + '">' + n[1] + '</span>'
    + '<span class="nn">' + n[2] + '</span></div>'
  ).join('');

  document.getElementById('auroraBest').textContent = tonight.bestSlot ? tonight.bestSlot.label : '—';
  document.getElementById('auroraBestP').textContent = tonight.bestSlot ? tonight.bestSlot.probPct + '%' : '暫時無足夠可見機率';

  document.getElementById('auroraMapLab').textContent = '目前雲況（以' + loc.name + '為中心，半徑 30 公里）';
  document.getElementById('auroraBestLine').textContent = tonight.direction ? tonight.direction.bestLine : '暫時取不到方向資料';
  document.getElementById('auroraBestSub').textContent = tonight.direction ? tonight.direction.bestSub : '';
  document.getElementById('auroraReadout').textContent = '點一下地圖任一處，看該方向的雲量';

  drawAuroraStrip(tonight);
  drawAuroraMap(tonight);
  paintAuroraScale();
}

function switchAuroraLocation(idx) {
  auroraCurrentLocation = idx;
  const loc = AURORA_CONFIG.locations[idx];
  if (auroraLocData[loc.key]) {
    renderAuroraDashboardUiOnly();
  } else {
    renderAuroraDashboard();
  }
}

// ---------- 「今晚這一條」SVG（§3.4） ----------

function drawAuroraStrip(tonight) {
  const strip = document.getElementById('auroraStrip');
  const axis = document.getElementById('auroraStripAxis');
  if (!strip) return;

  const hours = tonight.stripHours || tonight.hours;
  if (!hours || hours.length === 0) { strip.innerHTML = ''; if (axis) axis.innerHTML = ''; return; }

  const W = 360, PAD = 26, PW = W - PAD;
  const N = hours.length;
  const x = i => i / (N - 1) * PW;
  const t0 = hours[0].time.getTime(), t1 = hours[N - 1].time.getTime();
  const xTime = t => Math.max(0, Math.min(PW, (t - t0) / (t1 - t0) * PW));
  const KMIN = 1, KMAX = 6;
  const ky = v => {
    const c = Math.max(KMIN, Math.min(KMAX, v === null ? KMIN : v));
    return 118 - (c - KMIN) / (KMAX - KMIN) * 98;
  };
  // 低中雲量虛線用自己的縱軸（跟 Kp 刻度分開），0% 貼近頂端、100% 落在中段
  const cloudY = v => 12 + Math.max(0, Math.min(100, v === null ? 0 : v)) / 100 * 60;
  const axisCol = auroraTheme === 'light' ? 'rgba(255,255,255,.45)' : 'rgba(255,255,255,.38)';

  let g = '<defs><linearGradient id="auroraSky" x1="0" y1="0" x2="1" y2="0">'
    + '<stop offset="0" stop-color="#2A4A6B"/><stop offset=".08" stop-color="#1B3A5C"/>'
    + '<stop offset=".17" stop-color="#0E1C2E"/><stop offset=".27" stop-color="#070C14"/>'
    + '<stop offset=".73" stop-color="#070C14"/><stop offset=".84" stop-color="#0E1C2E"/>'
    + '<stop offset=".93" stop-color="#1B3A5C"/><stop offset="1" stop-color="#2A4A6B"/>'
    + '</linearGradient>'
    + '<linearGradient id="auroraRidge" x1="0" y1="0" x2="0" y2="1">'
    + '<stop offset="0" stop-color="#5FE3A1" stop-opacity=".9"/>'
    + '<stop offset=".55" stop-color="#5FE3A1" stop-opacity=".3"/>'
    + '<stop offset="1" stop-color="#5FE3A1" stop-opacity="0"/>'
    + '</linearGradient></defs>';

  let s = '<rect width="' + PW + '" height="132" fill="url(#auroraSky)"/>';

  for (let kv = KMIN + 1; kv <= KMAX; kv++) {
    const yy = ky(kv);
    s += '<line x1="0" y1="' + yy.toFixed(1) + '" x2="' + PW + '" y2="' + yy.toFixed(1)
      + '" stroke="rgba(255,255,255,.09)"/>';
    s += '<text x="' + (PW + 6) + '" y="' + (yy + 4).toFixed(1) + '" fill="' + axisCol
      + '" font-size="11" font-family="IBM Plex Mono,monospace">'
      + (kv === KMAX ? '6+' : kv) + '</text>';
  }
  s += '<text x="' + (PW + 6) + '" y="12" fill="' + axisCol
    + '" font-size="9.5" font-family="Noto Sans SC,sans-serif">Kp</text>';

  // Kp 山脊：綠色折線 + 向下漸層填充
  let d = 'M' + x(0) + ',' + ky(hours[0].kp).toFixed(1);
  for (let i = 1; i < N; i++) d += ' L' + x(i).toFixed(1) + ',' + ky(hours[i].kp).toFixed(1);
  s += '<path d="' + d + ' L' + PW + ',132 L0,132 Z" fill="url(#auroraRidge)"/>';
  s += '<path d="' + d + '" fill="none" stroke="#5FE3A1" stroke-width="2" stroke-linejoin="round"/>';

  // 低中雲量虛線：藍紫色、疊在山脊之上，跟 Kp 用不同縱軸不同視覺語彙，一眼分得出兩件事
  let cd = 'M' + x(0) + ',' + cloudY(hours[0].effLowMid).toFixed(1);
  for (let i = 1; i < N; i++) cd += ' L' + x(i).toFixed(1) + ',' + cloudY(hours[i].effLowMid).toFixed(1);
  s += '<path d="' + cd + '" fill="none" stroke="#7C8BE8" stroke-width="1.3" stroke-dasharray="3 3" opacity=".85"/>';

  // 建議時段高亮帶：半透明色塊＋兩條邊界線，疊在最上層，讀者一眼看到「就是這一段」
  if (tonight.bestSlot && tonight.bestSlot.startT && tonight.bestSlot.endT) {
    const xs = xTime(tonight.bestSlot.startT.getTime());
    const xe = xTime(tonight.bestSlot.endT.getTime());
    if (xe > xs) {
      s += '<rect x="' + xs.toFixed(1) + '" y="0" width="' + (xe - xs).toFixed(1) + '" height="132" fill="#5FE3A1" opacity=".07"/>';
      s += '<line x1="' + xs.toFixed(1) + '" y1="0" x2="' + xs.toFixed(1) + '" y2="132" stroke="#5FE3A1" stroke-width=".8" opacity=".5"/>';
      s += '<line x1="' + xe.toFixed(1) + '" y1="0" x2="' + xe.toFixed(1) + '" y2="132" stroke="#5FE3A1" stroke-width=".8" opacity=".5"/>';
    }
  }

  strip.innerHTML = g + s;

  if (axis) {
    const labelIdx = [0, Math.floor((N - 1) / 4), Math.floor((N - 1) / 2), Math.floor((N - 1) * 3 / 4), N - 1];
    axis.innerHTML = labelIdx.map(i => '<span>' + auroraFmtHM(hours[i].time) + '</span>').join('');
  }
}

// ---------- 雲況地圖（§3.5，本階段為單點資料，方向皆與中心同值） ----------

function auroraSampleMap(x, y) {
  let n = 0, dn = 0;
  for (let i = 0; i < auroraMapPts.length; i++) {
    const dx = x - auroraMapPts[i].x, dy = y - auroraMapPts[i].y, d2 = dx * dx + dy * dy;
    if (d2 < 1) return auroraMapPts[i].v;
    const w = 1 / (d2 * d2);
    n += auroraMapPts[i].v * w; dn += w;
  }
  return dn === 0 ? 0 : n / dn;
}

const AURORA_RAMP = { dark: [[13, 26, 26], [238, 241, 245]], light: [[26, 74, 86], [255, 255, 255]] };

function auroraShade(v) {
  const r = AURORA_RAMP[auroraTheme];
  const t = Math.max(0, Math.min(1, v / 100));
  const e = t * t * (3 - 2 * t);
  return [
    Math.round(r[0][0] + (r[1][0] - r[0][0]) * e),
    Math.round(r[0][1] + (r[1][1] - r[0][1]) * e),
    Math.round(r[0][2] + (r[1][2] - r[0][2]) * e)
  ];
}

function auroraRampCss(v) {
  const c = auroraShade(v);
  return 'rgb(' + c[0] + ',' + c[1] + ',' + c[2] + ')';
}

function drawAuroraMap(tonight) {
  if (!auroraMapCtx || !auroraMapOffCtx) return;

  const ring = tonight.ring;
  const hasRing = ring && ring.ok;
  const center = hasRing ? ring.center : tonight.mapCenterValue;

  if (center === null || typeof center === 'undefined') {
    auroraMapCtx.setTransform(1, 0, 0, 1, 0, 0);
    auroraMapCtx.clearRect(0, 0, auroraMapCv.width, auroraMapCv.height);
    auroraMapCtx.setTransform(auroraMapDpr, 0, 0, auroraMapDpr, 0, 0);
    auroraMapCtx.fillStyle = auroraTheme === 'light' ? '#4B6673' : '#8397A0';
    auroraMapCtx.font = '13px "Noto Sans SC",sans-serif';
    auroraMapCtx.textAlign = 'center';
    auroraMapCtx.fillText('暫時取不到資料', AURORA_MAP_R, AURORA_MAP_R);
    return;
  }

  // 階段 C：有真實八方位資料時逐點取值；取樣失敗時退回單點（沿用中心值，不編造方向差異）
  auroraMapPts = [{ x: AURORA_MAP_R, y: AURORA_MAP_R, v: center }];
  AURORA_DIRS.forEach((d, i) => {
    const a = (i * 45 - 90) * Math.PI / 180;
    AURORA_KM.forEach((km, j) => {
      const r = AURORA_MAP_R * (km / 30) * 0.94;
      const v = hasRing ? ring.byDir[d][j] : center;
      auroraMapPts.push({ x: AURORA_MAP_R + r * Math.cos(a), y: AURORA_MAP_R + r * Math.sin(a), v: (typeof v === 'number' ? v : center) });
    });
  });

  // 每次重繪都完整清空，避免舊筆跡殘留（DPR 縮放陷阱：putImageData 需在離屏畫布操作，見 §3.5）
  auroraMapCtx.setTransform(1, 0, 0, 1, 0, 0);
  auroraMapCtx.clearRect(0, 0, auroraMapCv.width, auroraMapCv.height);
  auroraMapCtx.setTransform(auroraMapDpr, 0, 0, auroraMapDpr, 0, 0);

  const k = AURORA_MAP_CSS / AURORA_MAP_FIELD, FR = AURORA_MAP_FIELD / 2;
  const img = auroraMapOffCtx.createImageData(AURORA_MAP_FIELD, AURORA_MAP_FIELD);
  const D = img.data;
  for (let y = 0; y < AURORA_MAP_FIELD; y++) {
    for (let x = 0; x < AURORA_MAP_FIELD; x++) {
      const i = (y * AURORA_MAP_FIELD + x) * 4;
      const dx = x - FR, dy = y - FR, dist = Math.sqrt(dx * dx + dy * dy);
      if (dist > FR) { D[i + 3] = 0; continue; }
      const c = auroraShade(auroraSampleMap(x * k, y * k));
      D[i] = c[0]; D[i + 1] = c[1]; D[i + 2] = c[2];
      D[i + 3] = dist > FR - 1.5 ? Math.round(255 * (FR - dist) / 1.5) : 255;
    }
  }
  auroraMapOffCtx.putImageData(img, 0, 0);
  auroraMapCtx.imageSmoothingEnabled = true;
  auroraMapCtx.drawImage(auroraMapOff, 0, 0, AURORA_MAP_CSS, AURORA_MAP_CSS);

  auroraMapCtx.strokeStyle = auroraTheme === 'light' ? 'rgba(0,0,0,.16)' : 'rgba(255,255,255,.16)';
  auroraMapCtx.lineWidth = 0.8;
  AURORA_KM.forEach(km => {
    auroraMapCtx.beginPath();
    auroraMapCtx.arc(AURORA_MAP_R, AURORA_MAP_R, AURORA_MAP_R * (km / 30) * 0.94, 0, Math.PI * 2);
    auroraMapCtx.stroke();
  });
  auroraMapCtx.strokeStyle = auroraTheme === 'light' ? 'rgba(0,0,0,.10)' : 'rgba(255,255,255,.09)';
  for (let kk = 0; kk < 4; kk++) {
    const a = kk * 45 * Math.PI / 180, rr = AURORA_MAP_R * 0.94;
    auroraMapCtx.beginPath();
    auroraMapCtx.moveTo(AURORA_MAP_R - rr * Math.cos(a), AURORA_MAP_R - rr * Math.sin(a));
    auroraMapCtx.lineTo(AURORA_MAP_R + rr * Math.cos(a), AURORA_MAP_R + rr * Math.sin(a));
    auroraMapCtx.stroke();
  }

  const G = auroraTheme === 'light' ? '#0E7A50' : '#5FE3A1';
  const HALO = auroraTheme === 'light' ? 'rgba(255,255,255,.9)' : 'rgba(8,13,20,.85)';

  // 最清朗的取樣點（僅在有真實方向資料時標示；否則所有點同值，標了也沒有意義）
  if (hasRing) {
    let bi = 0;
    for (let q = 1; q < auroraMapPts.length; q++) if (auroraMapPts[q].v < auroraMapPts[bi].v) bi = q;
    if (bi > 0) {
      auroraMapCtx.beginPath(); auroraMapCtx.arc(auroraMapPts[bi].x, auroraMapPts[bi].y, 13, 0, Math.PI * 2);
      auroraMapCtx.fillStyle = HALO; auroraMapCtx.fill();
      auroraMapCtx.strokeStyle = G; auroraMapCtx.lineWidth = 2.6; auroraMapCtx.stroke();
      auroraMapCtx.beginPath(); auroraMapCtx.arc(auroraMapPts[bi].x, auroraMapPts[bi].y, 4, 0, Math.PI * 2);
      auroraMapCtx.fillStyle = G; auroraMapCtx.fill();
      auroraMapLabel('最清朗', auroraMapPts[bi].x, auroraMapPts[bi].y - 21, G, HALO);
    }
  }

  // 你在這裡
  auroraMapCtx.beginPath(); auroraMapCtx.arc(AURORA_MAP_R, AURORA_MAP_R, 15, 0, Math.PI * 2);
  auroraMapCtx.fillStyle = HALO; auroraMapCtx.fill();
  auroraMapCtx.beginPath(); auroraMapCtx.arc(AURORA_MAP_R, AURORA_MAP_R, 15, 0, Math.PI * 2);
  auroraMapCtx.strokeStyle = G; auroraMapCtx.lineWidth = 1.6; auroraMapCtx.stroke();
  auroraMapCtx.beginPath(); auroraMapCtx.arc(AURORA_MAP_R, AURORA_MAP_R, 6.5, 0, Math.PI * 2);
  auroraMapCtx.fillStyle = G; auroraMapCtx.fill();
  auroraMapLabel('住宿', AURORA_MAP_R, AURORA_MAP_R + 30, G, HALO);
}

function auroraMapLabel(txt, x, y, color, halo) {
  const ctx = auroraMapCtx;
  ctx.font = '500 13px "Noto Sans SC",sans-serif';
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  const w = ctx.measureText(txt).width + 12;
  ctx.fillStyle = halo;
  ctx.beginPath();
  if (ctx.roundRect) ctx.roundRect(x - w / 2, y - 10, w, 20, 10); else ctx.rect(x - w / 2, y - 10, w, 20);
  ctx.fill();
  ctx.fillStyle = color; ctx.fillText(txt, x, y);
}

function paintAuroraScale() {
  [0, 25, 50, 75, 100].forEach((v, i) => {
    const el = document.getElementById('auroraSc' + i);
    if (el) el.style.background = auroraRampCss(v);
  });
}
