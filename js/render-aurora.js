// ===== AURORA DASHBOARD =====
// 極光儀表板：4個地點（雷市+3個住宿地點）、水平滑動卡片、每小時自動更新
//
// 資料源（全部為真實 API，無任何亂數／模擬數值）：
//   Kp 實測值：https://services.swpc.noaa.gov/products/noaa-planetary-k-index.json         （欄位大寫 Kp）
//   Kp 預報值：https://services.swpc.noaa.gov/products/noaa-planetary-k-index-forecast.json （欄位小寫 kp，另有 observed 欄位）
//   雲量／日出日落：Open-Meteo（依地點座標查詢）
// 任一來源失敗時，對應區塊顯示「暫時取不到資料」，絕不回退到亂數或編造數值。

// 地點顯示用的 emoji（座標與名稱一律來自 data/aurora-config.js 的 AURORA_CONFIG，此處僅補 UI 用的圖示）
const AURORA_LOCATION_EMOJI = {
  reykjavik: '🏛️',
  selfoss:   '🏠',
  lakeview:  '🌲',
  gardur:    '🌊'
};

let auroraCurrentLocation = 0;

// Kp 資料為全球指數，與地點無關，四個地點共用同一份快取
let auroraKpTimeline = [];      // 用於圖表：過去12h ~ 未來36h 的 {time, kp, observed} 陣列
let auroraKpFetchedAt = null;   // 上次成功取得 Kp 資料的時間，避免切換地點時重複打 API
let auroraKpFetchFailed = false;

// 天氣資料依地點而異，每次切換地點或更新時重新取得
let auroraWeather = null;       // Open-Meteo 的 current 區塊
let auroraSunset = null;        // 當地今日日落時間（HH:MM），取自 Open-Meteo daily
let auroraWeatherFetchFailed = false;

let auroraLastUpdate = null;

// 初始化極光頁籤
function initAuroraPage() {
  const mount = document.getElementById('mount-aurora');
  if (!mount) return;

  mount.innerHTML = `
    <div class="page" id="page-aurora">
      <div class="page-inner">
        <div id="auroraContent" style="padding-bottom: 20px;"></div>
      </div>
    </div>
  `;

  // 首次加載
  renderAuroraDashboard();

  // 每小時自動更新（判斷是否在旅行期間）
  const tripStart = new Date('2026-10-01');
  const tripEnd = new Date('2026-10-12');
  const now = new Date();

  if (now >= tripStart && now <= tripEnd) {
    setInterval(renderAuroraDashboard, 60 * 60 * 1000); // 1小時
  }
}

// 渲染極光儀表板：依序取得 Kp（全域共用、有快取）與天氣（依地點），再畫面呈現
async function renderAuroraDashboard() {
  const loc = AURORA_CONFIG.locations[auroraCurrentLocation];

  // Kp 是全球指數，只要 1 小時內已取得過就不重複打 API（例如切換地點時）
  const kpStale = !auroraKpFetchedAt || (Date.now() - auroraKpFetchedAt) > 5 * 60 * 1000;
  if (kpStale) {
    await fetchAuroraKpData();
  }

  await fetchAuroraWeather(loc);

  renderAuroraUI(loc);
  auroraLastUpdate = new Date();
}

// 取得 Kp 實測值與預報值，合併為圖表用的時間序列
async function fetchAuroraKpData() {
  try {
    const [obsRes, fcRes] = await Promise.all([
      fetch('https://services.swpc.noaa.gov/products/noaa-planetary-k-index.json'),
      fetch('https://services.swpc.noaa.gov/products/noaa-planetary-k-index-forecast.json')
    ]);

    if (!obsRes.ok || !fcRes.ok) {
      throw new Error('Kp API 回應非 200（實測 ' + obsRes.status + '，預報 ' + fcRes.status + '）');
    }

    const obsData = await obsRes.json();
    const fcData = await fcRes.json();

    // 實測值：欄位大寫 Kp
    const observedSeries = (obsData || [])
      .filter(row => row && row.time_tag && typeof row.Kp === 'number')
      .map(row => ({ time: new Date(row.time_tag + 'Z'), kp: row.Kp, observed: true }));

    // 預報值：欄位小寫 kp；observed 欄位區分「已觀測」與「預測」
    const forecastSeries = (fcData || [])
      .filter(row => row && row.time_tag && typeof row.kp === 'number')
      .map(row => ({ time: new Date(row.time_tag + 'Z'), kp: row.kp, observed: row.observed === 'observed' }));

    if (observedSeries.length === 0 && forecastSeries.length === 0) {
      throw new Error('Kp API 回傳內容為空或格式不符預期');
    }

    // 圖表用時間序列：取預報端點（涵蓋過去與未來），裁切到「過去12h ~ 未來36h」
    const now = Date.now();
    const windowStart = now - 12 * 60 * 60 * 1000;
    const windowEnd = now + 36 * 60 * 60 * 1000;
    auroraKpTimeline = forecastSeries
      .filter(pt => pt.time.getTime() >= windowStart && pt.time.getTime() <= windowEnd)
      .sort((a, b) => a.time - b.time);

    // 若預報端點在裁切窗內完全沒有資料（理論上不應發生），退而用實測序列
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

// 取得指定地點的天氣（含分層雲量）與今日日落時間
async function fetchAuroraWeather(loc) {
  try {
    const url = 'https://api.open-meteo.com/v1/forecast'
      + '?latitude=' + loc.lat + '&longitude=' + loc.lon
      + '&current=temperature_2m,wind_speed_10m,cloud_cover,cloud_cover_low,cloud_cover_mid,cloud_cover_high'
      + '&daily=sunrise,sunset&timezone=auto&forecast_days=1';
    const res = await fetch(url);
    if (!res.ok) throw new Error('Open-Meteo 回應非 200（' + res.status + '）');
    const data = await res.json();

    if (!data.current) throw new Error('Open-Meteo 回傳缺少 current 區塊');

    auroraWeather = data.current;
    auroraSunset = (data.daily && data.daily.sunset && data.daily.sunset[0])
      ? data.daily.sunset[0].split('T')[1]
      : null;
    auroraWeatherFetchFailed = false;
  } catch (e) {
    console.warn('[Aurora] 天氣資料取得失敗（' + loc.name + '），不使用任何模擬數值：', e);
    auroraWeather = null;
    auroraSunset = null;
    auroraWeatherFetchFailed = true;
  }
}

// 計算極光機率（依 Kp 與總雲量的簡易換算，沿用既有公式）
function calculateAuroraChance(kp, cloudCover) {
  let chance = 0;

  if (kp < 2) chance = 0;
  else if (kp < 4) chance = 20 + kp * 10;
  else if (kp < 6) chance = 50 + (kp - 4) * 15;
  else chance = 80 + (kp - 6) * 5;

  chance *= (1 - cloudCover / 200); // 雲量影響

  return Math.max(0, Math.min(100, Math.round(chance)));
}

// 渲染 UI
function renderAuroraUI(loc) {
  const content = document.getElementById('auroraContent');
  if (!content) return;

  const emoji = AURORA_LOCATION_EMOJI[loc.key] || '📍';

  // 取得 22:00 時刻的 Kp 值（最佳觀測時間參考）；資料不可用時保持 null，絕不編造數值
  let current22Kp = null;
  if (auroraKpTimeline.length > 0) {
    const target22 = auroraKpTimeline.find(v => v.time.getHours() === 22)
      || auroraKpTimeline.find(v => v.time.getHours() >= 21)
      || auroraKpTimeline.find(v => v.time.getHours() >= 20)
      || auroraKpTimeline[Math.floor(auroraKpTimeline.length / 2)];
    current22Kp = target22 ? target22.kp : null;
  }

  const cloudCoverValue = auroraWeather ? auroraWeather.cloud_cover : null;

  const auroraChanceDisplay = (current22Kp === null || cloudCoverValue === null)
    ? '暫時取不到資料'
    : calculateAuroraChance(current22Kp, cloudCoverValue) + '%';

  const sunsetDisplay = auroraSunset || '暫時取不到資料';

  const updateTime = auroraLastUpdate
    ? `${auroraLastUpdate.getHours().toString().padStart(2, '0')}:${auroraLastUpdate.getMinutes().toString().padStart(2, '0')}`
    : '更新中';

  let html = `
    <style>
      #auroraContent {
        font-family: 'Noto Sans SC', sans-serif;
        background: linear-gradient(135deg, #1a2332 0%, #0f1419 100%);
        border-radius: 12px;
        color: #e0e0e0;
        padding: 12px;
      }

      .aurora-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 12px;
        font-size: 14px;
        color: #888;
      }

      .aurora-title {
        font-size: 18px;
        font-weight: 700;
        color: #4db8d4;
      }

      .location-card {
        background: linear-gradient(135deg, rgba(77, 184, 212, 0.15) 0%, rgba(77, 184, 212, 0.05) 100%);
        border: 1px solid rgba(77, 184, 212, 0.2);
        border-radius: 12px;
        padding: 12px;
        margin-bottom: 12px;
        position: relative;
        overflow: hidden;
      }

      .location-name {
        font-size: 18px;
        font-weight: 700;
        color: #4db8d4;
        margin-bottom: 8px;
      }

      .location-emoji {
        font-size: 32px;
        position: absolute;
        top: 12px;
        right: 12px;
        opacity: 0.3;
      }

      .metric-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 8px;
        margin-bottom: 12px;
      }

      .metric-box {
        background: rgba(77, 184, 212, 0.08);
        padding: 8px;
        border-radius: 8px;
        text-align: center;
      }

      .metric-value {
        font-size: 20px;
        font-weight: 700;
        color: #4db8d4;
        line-height: 1.2;
      }

      .metric-value.is-unavailable {
        font-size: 13px;
        color: #888;
      }

      .metric-label {
        font-size: 11px;
        color: #888;
        margin-top: 3px;
      }

      .kp-chart {
        background: rgba(15, 20, 25, 0.5);
        border-radius: 8px;
        padding: 6px;
        margin-bottom: 10px;
      }

      #auroraKpCanvas {
        width: 100%;
        height: 120px;
        display: block;
      }

      .gauge-single {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-bottom: 12px;
      }

      #auroraGaugeKp {
        width: 90px;
        height: 90px;
        display: block;
      }

      .gauge-label {
        font-size: 12px;
        color: #888;
        margin-top: 2px;
        font-weight: 600;
      }

      .weather-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 8px;
        margin-bottom: 12px;
      }

      .weather-item {
        background: rgba(77, 184, 212, 0.08);
        padding: 10px;
        border-radius: 8px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
      }

      .weather-emoji {
        font-size: 18px;
        margin-bottom: 4px;
      }

      .weather-label {
        font-size: 11px;
        color: #888;
        line-height: 1.2;
        margin-bottom: 2px;
      }

      .weather-value {
        font-size: 14px;
        font-weight: 600;
        color: #4db8d4;
      }

      .weather-value.is-unavailable {
        font-size: 11px;
      }

      .location-nav {
        display: flex;
        gap: 6px;
        margin-top: 0;
        overflow-x: auto;
        padding-bottom: 4px;
        padding-right: 8px;
      }

      .location-nav-wrapper {
        background: linear-gradient(135deg, #1a2332 0%, #0f1419 100%);
        padding: 12px;
        margin: -12px -12px 12px -12px;
        border-bottom: 1px solid rgba(77, 184, 212, 0.2);
        position: sticky;
        top: 0;
        z-index: 10;
      }

      .location-btn {
        flex: 0 0 auto;
        padding: 8px 12px;
        background: rgba(77, 184, 212, 0.1);
        border: 1px solid rgba(77, 184, 212, 0.2);
        color: #4db8d4;
        border-radius: 6px;
        font-size: 12px;
        cursor: pointer;
        white-space: nowrap;
      }

      .location-btn:hover {
        background: rgba(77, 184, 212, 0.2);
      }

      .update-time {
        font-size: 11px;
        color: #666;
        text-align: center;
        margin-top: 8px;
      }
    </style>

    <div class="aurora-header">
      <div class="aurora-title">☄️ 極光即時預報</div>
      <div>更新: ${updateTime}</div>
    </div>

    <div class="location-nav-wrapper">
      <div style="font-size: 11px; color: #666; margin-bottom: 6px;">📍 切換地點</div>
      <div class="location-nav">
  `;

  AURORA_CONFIG.locations.forEach((l, idx) => {
    const isActive = idx === auroraCurrentLocation;
    const lEmoji = AURORA_LOCATION_EMOJI[l.key] || '📍';
    html += `<button class="location-btn" onclick="switchAuroraLocation(${idx})" style="${isActive ? 'background: rgba(77, 184, 212, 0.3); border-color: rgba(77, 184, 212, 0.6);' : ''}">${lEmoji} ${l.name}</button>`;
  });

  html += `
      </div>
    </div>

    <div class="location-card">
      <div class="location-emoji">${emoji}</div>
      <div class="location-name">${loc.name}</div>

      <div class="metric-row">
        <div class="metric-box">
          <div class="metric-value ${current22Kp === null || cloudCoverValue === null ? 'is-unavailable' : ''}">${auroraChanceDisplay}</div>
          <div class="metric-label">極光機率<br/><span style="font-size: 10px; color: #888;">@22:00</span></div>
        </div>
        <div class="metric-box">
          <div class="metric-value ${!auroraSunset ? 'is-unavailable' : ''}">${sunsetDisplay}</div>
          <div class="metric-label">日落時間</div>
        </div>
      </div>

      <div style="border-top: 1px solid rgba(77, 184, 212, 0.2); padding-top: 12px; margin-top: 12px;">
        <div class="kp-chart">
          <canvas id="auroraKpCanvas" width="380" height="120"></canvas>
        </div>

        <div style="font-size: 12px; color: #888; text-align: center; margin-bottom: 12px;">過去12h | 未來36h <span style="color: #ff4444;">⬜ 紅框：22:00</span></div>

        <div style="font-size: 11px; color: #666; text-align: center; margin-bottom: 8px; font-style: italic;">下方數據基於 22:00 時刻預測</div>

        <div class="gauge-single">
          <canvas id="auroraGaugeKp" width="90" height="90"></canvas>
          <div class="gauge-label">Kp 指數</div>
        </div>
      </div>
    </div>

    <div>
      <div style="font-size: 12px; color: #888; margin-bottom: 8px; font-weight: 600;">🌤️ 當地天氣</div>
      <div class="weather-grid">
        <div style="display: flex; flex-direction: column; gap: 8px;">
          <div class="weather-item">
            <div class="weather-emoji">🌡️</div>
            <div class="weather-label">氣溫</div>
            <div class="weather-value ${!auroraWeather ? 'is-unavailable' : ''}">${auroraWeather ? auroraWeather.temperature_2m.toFixed(0) + '°C' : '暫時取不到資料'}</div>
          </div>
          <div class="weather-item">
            <div class="weather-emoji">💨</div>
            <div class="weather-label">風速</div>
            <div class="weather-value ${!auroraWeather ? 'is-unavailable' : ''}">${auroraWeather ? auroraWeather.wind_speed_10m.toFixed(1) + ' m/s' : '暫時取不到資料'}</div>
          </div>
          <div class="weather-item">
            <div class="weather-emoji">☁️</div>
            <div class="weather-label">總雲</div>
            <div class="weather-value ${!auroraWeather ? 'is-unavailable' : ''}">${auroraWeather ? auroraWeather.cloud_cover + '%' : '暫時取不到資料'}</div>
          </div>
        </div>
        <div style="display: flex; flex-direction: column; gap: 8px;">
          <div class="weather-item">
            <div class="weather-emoji">⬆️</div>
            <div class="weather-label">高雲</div>
            <div class="weather-value ${!auroraWeather ? 'is-unavailable' : ''}">${auroraWeather ? auroraWeather.cloud_cover_high + '%' : '暫時取不到資料'}</div>
          </div>
          <div class="weather-item">
            <div class="weather-emoji">➡️</div>
            <div class="weather-label">中雲</div>
            <div class="weather-value ${!auroraWeather ? 'is-unavailable' : ''}">${auroraWeather ? auroraWeather.cloud_cover_mid + '%' : '暫時取不到資料'}</div>
          </div>
          <div class="weather-item">
            <div class="weather-emoji">⬇️</div>
            <div class="weather-label">低雲</div>
            <div class="weather-value ${!auroraWeather ? 'is-unavailable' : ''}">${auroraWeather ? auroraWeather.cloud_cover_low + '%' : '暫時取不到資料'}</div>
          </div>
        </div>
      </div>
    </div>

    <div class="update-time">⚡ 每小時自動更新一次</div>
  `;

  content.innerHTML = html;

  // 繪製圖表（DOM 已同步掛載完成，用 requestAnimationFrame 取代原本的 setTimeout(…,150) hack）
  requestAnimationFrame(() => {
    const kpCanvas = document.getElementById('auroraKpCanvas');
    const gaugeKp = document.getElementById('auroraGaugeKp');

    if (kpCanvas && kpCanvas.width > 0) drawKpChart(kpCanvas, auroraKpTimeline);
    if (gaugeKp && gaugeKp.width > 0 && current22Kp !== null) drawGauge(gaugeKp, current22Kp, 0, 9);
  });
}

// 切換地點
function switchAuroraLocation(idx) {
  auroraCurrentLocation = idx;
  renderAuroraDashboard();
}

// 繪製 Kp 圖表
function drawKpChart(canvas, kpValues) {
  const ctx = canvas.getContext('2d');
  const width = canvas.width;
  const height = canvas.height;

  const gradient = ctx.createLinearGradient(0, 0, 0, height);
  gradient.addColorStop(0, 'rgba(15, 20, 25, 0.8)');
  gradient.addColorStop(1, 'rgba(10, 15, 21, 0.8)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  if (!kpValues || kpValues.length === 0) {
    ctx.fillStyle = '#666';
    ctx.font = '12px Noto Sans SC';
    ctx.textAlign = 'center';
    ctx.fillText('暫時取不到資料', width / 2, height / 2);
    return;
  }

  ctx.strokeStyle = 'rgba(77, 184, 212, 0.1)';
  ctx.lineWidth = 1;
  for (let i = 0; i <= 5; i++) {
    const y = (height / 5) * i;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }

  const barWidth = Math.max(2, width / kpValues.length - 2);
  const padding = 8;
  const chartHeight = height - padding * 2;

  // 找出資料中最接近今晚／明晚 22:00 的位置，畫紅框標示觀測窗口
  ctx.strokeStyle = '#ff4444';
  ctx.lineWidth = 2;
  ctx.setLineDash([4, 4]);

  kpValues.forEach((item, idx) => {
    if (item.time.getHours() === 22) {
      const x = padding + (width - padding * 2) * idx / (kpValues.length - 1);
      ctx.beginPath();
      ctx.rect(x - 6, padding - 2, 12, chartHeight + 4);
      ctx.stroke();
    }
  });

  ctx.setLineDash([]);

  // 繪製柱狀圖
  kpValues.forEach((item, idx) => {
    const x = padding + (width - padding * 2) * idx / (kpValues.length - 1);
    const kpHeight = (item.kp / 9) * chartHeight;

    if (item.kp < 4) ctx.fillStyle = '#3dbd67';
    else if (item.kp < 6) ctx.fillStyle = '#ffc107';
    else if (item.kp < 8) ctx.fillStyle = '#ff9800';
    else ctx.fillStyle = '#f44336';

    ctx.fillRect(x - barWidth / 2, height - padding - kpHeight, barWidth, kpHeight);
  });

  // 繪製時間標籤
  ctx.fillStyle = '#666';
  ctx.font = '9px Noto Sans SC';
  ctx.textAlign = 'center';
  kpValues.forEach((item, idx) => {
    if (idx % 3 === 0) {
      const x = padding + (width - padding * 2) * idx / (kpValues.length - 1);
      const hours = item.time.getHours();
      ctx.fillText(hours + 'h', x, height - 2);
    }
  });
}

// 繪製 Kp 儀表盤
function drawGauge(canvas, value, min, max) {
  const ctx = canvas.getContext('2d');
  const size = Math.min(canvas.width, canvas.height);
  const centerX = size / 2;
  const centerY = size / 2;
  const radius = size / 2 - 6;

  const bgGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
  bgGradient.addColorStop(0, 'rgba(30, 40, 55, 0.6)');
  bgGradient.addColorStop(1, 'rgba(20, 28, 42, 0.6)');
  ctx.fillStyle = bgGradient;
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
  ctx.fill();

  ctx.strokeStyle = 'rgba(77, 184, 212, 0.2)';
  ctx.lineWidth = 1;
  ctx.stroke();

  const startAngle = Math.PI;
  const endAngle = 2 * Math.PI;
  const arcRadius = radius - 10;

  ctx.strokeStyle = '#3dbd67';
  ctx.lineWidth = 14;
  ctx.lineCap = 'butt';
  ctx.beginPath();
  ctx.arc(centerX, centerY, arcRadius, startAngle, startAngle + (endAngle - startAngle) * 0.5);
  ctx.stroke();

  ctx.strokeStyle = '#ffc107';
  ctx.beginPath();
  ctx.arc(centerX, centerY, arcRadius, startAngle + (endAngle - startAngle) * 0.5, startAngle + (endAngle - startAngle) * 0.75);
  ctx.stroke();

  ctx.strokeStyle = '#f44336';
  ctx.beginPath();
  ctx.arc(centerX, centerY, arcRadius, startAngle + (endAngle - startAngle) * 0.75, endAngle);
  ctx.stroke();

  const normalizedValue = Math.max(min, Math.min(max, value));
  const ratio = (normalizedValue - min) / (max - min);
  const angle = startAngle + ratio * (endAngle - startAngle);

  ctx.strokeStyle = '#4db8d4';
  ctx.lineWidth = 3;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(centerX, centerY);
  ctx.lineTo(centerX + Math.cos(angle) * (arcRadius - 1), centerY + Math.sin(angle) * (arcRadius - 1));
  ctx.stroke();

  const dotGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 4);
  dotGradient.addColorStop(0, '#4db8d4');
  dotGradient.addColorStop(1, '#2a7a94');
  ctx.fillStyle = dotGradient;
  ctx.beginPath();
  ctx.arc(centerX, centerY, 4, 0, 2 * Math.PI);
  ctx.fill();

  ctx.strokeStyle = 'rgba(77, 184, 212, 0.3)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(centerX, centerY, 3.5, 0, 2 * Math.PI);
  ctx.stroke();

  // 繪製數值
  ctx.fillStyle = '#4db8d4';
  ctx.font = 'bold 16px Noto Sans SC';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(value.toFixed(1), centerX, centerY + 35);
}

// 在 init.js 中調用此函數
// initAuroraPage();
