// ===== AURORA DASHBOARD =====
// 極光儀表板：4個地點（雷市+3個住宿地點）、水平滑動卡片、每小時自動更新

const AURORA_LOCATIONS = [
  { name: '雷克雅維克', lat: 63.1466, lon: -21.9426, emoji: '🏛️' },
  { name: '南部民宿 (Selfoss)', lat: 63.93, lon: -20.85, emoji: '🏠' },
  { name: 'Lakeview Cabin', lat: 63.79, lon: -18.06, emoji: '🌲' },
  { name: 'Garður', lat: 64.07, lon: -22.70, emoji: '🌊' }
];

let auroraCurrentLocation = 0;
let auroraKpValues = [];
let auroraWeather = null;
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

// 渲染極光儀表板
async function renderAuroraDashboard() {
  const loc = AURORA_LOCATIONS[auroraCurrentLocation];
  
  try {
    // 獲取天氣數據
    const weatherResponse = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${loc.lat}&longitude=${loc.lon}&current=temperature_2m,wind_speed_10m,cloud_cover,cloud_cover_low,cloud_cover_mid,cloud_cover_high&timezone=auto`
    );
    const weatherData = await weatherResponse.json();
    auroraWeather = weatherData.current;
  } catch (e) {
    console.error('Weather API error:', e);
    auroraWeather = null;
  }
  
  // 生成模擬 Kp 數據
  if (auroraKpValues.length === 0) {
    generateMockKpData();
  }
  
  renderAuroraUI(loc);
  auroraLastUpdate = new Date();
}

// 生成模擬 Kp 數據（過去12小時 + 未來36小時）
function generateMockKpData() {
  auroraKpValues = [];
  const now = new Date();
  
  for (let i = -12; i <= 36; i += 3) {
    const time = new Date(now.getTime() + i * 60 * 60 * 1000);
    const baseKp = 3 + Math.sin(i / 12) * 2 + Math.random() * 1.5;
    const kp = Math.max(0, Math.min(9, baseKp));
    
    auroraKpValues.push({ time, kp: parseFloat(kp.toFixed(1)) });
  }
}

// 計算太陽高度角
function calculateSunElevation(lat, lon) {
  const now = new Date();
  const h = (now.getUTCHours() + now.getUTCMinutes() / 60 + lon / 15) % 24;
  const d = now.getUTCDate();
  const m = now.getUTCMonth() + 1;
  
  const L = (281.9353 + 0.01671 * d + 0.01674 * m * 30) * Math.PI / 180;
  const delta = Math.asin(Math.sin(L) * Math.sin(23.439 * Math.PI / 180));
  const lat_rad = lat * Math.PI / 180;
  const H = (h - 12 + lon / 15) * 15 * Math.PI / 180;
  
  const sinAlt = Math.sin(lat_rad) * Math.sin(delta) + 
                 Math.cos(lat_rad) * Math.cos(delta) * Math.cos(H);
  const altitude = Math.asin(Math.max(-1, Math.min(1, sinAlt))) * 180 / Math.PI;
  
  return altitude;
}

// 計算極光機率
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
  
  const sunElevation = calculateSunElevation(loc.lat, loc.lon).toFixed(1);
  const currentKp = auroraKpValues.length > 0 ? auroraKpValues[Math.floor(auroraKpValues.length / 2)].kp : 3;
  const cloudCover = auroraWeather ? auroraWeather.cloud_cover : 50;
  const auroraChance = calculateAuroraChance(currentKp, cloudCover);
  
  const updateTime = auroraLastUpdate ? 
    `${auroraLastUpdate.getHours().toString().padStart(2, '0')}:${auroraLastUpdate.getMinutes().toString().padStart(2, '0')}` :
    '更新中';
  
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
        padding: 16px;
        margin-bottom: 12px;
        position: relative;
        overflow: hidden;
      }
      
      .location-name {
        font-size: 22px;
        font-weight: 700;
        color: #4db8d4;
        margin-bottom: 12px;
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
        gap: 12px;
        margin-bottom: 12px;
      }
      
      .metric-box {
        background: rgba(77, 184, 212, 0.08);
        padding: 12px;
        border-radius: 8px;
        text-align: center;
      }
      
      .metric-value {
        font-size: 28px;
        font-weight: 700;
        color: #4db8d4;
        line-height: 1;
      }
      
      .metric-label {
        font-size: 12px;
        color: #888;
        margin-top: 6px;
      }
      
      .kp-chart {
        background: rgba(15, 20, 25, 0.5);
        border-radius: 8px;
        padding: 8px;
        margin-bottom: 12px;
      }
      
      #auroraKpCanvas {
        width: 100%;
        height: 140px;
        display: block;
      }
      
      .gauge-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 4px;
        margin-bottom: 12px;
      }
      
      .gauge-container {
        text-align: center;
      }
      
      #auroraGaugeBz, #auroraGaugeBt, #auroraGaugeKp {
        width: 100%;
        height: 80px;
        display: block;
        aspect-ratio: 1;
      }
      
      .gauge-label {
        font-size: 14px;
        color: #888;
        margin-top: 4px;
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
        display: grid;
        grid-template-columns: auto 1fr;
        align-items: center;
        gap: 8px;
      }
      
      .weather-emoji {
        font-size: 20px;
      }
      
      .weather-label {
        font-size: 12px;
        color: #888;
        line-height: 1.2;
      }
      
      .weather-value {
        font-size: 14px;
        font-weight: 600;
        color: #4db8d4;
      }
      
      .location-nav {
        display: flex;
        gap: 6px;
        margin-top: 12px;
        overflow-x: auto;
        padding-bottom: 4px;
      }
      
      .location-btn {
        flex: 0 0 auto;
        padding: 8px 12px;
        background: ${auroraCurrentLocation === AURORA_LOCATIONS.indexOf(loc) ? 'rgba(77, 184, 212, 0.3)' : 'rgba(77, 184, 212, 0.1)'};
        border: 1px solid rgba(77, 184, 212, ${auroraCurrentLocation === AURORA_LOCATIONS.indexOf(loc) ? '0.6' : '0.2'});
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
    
    <div class="location-card">
      <div class="location-emoji">${loc.emoji}</div>
      <div class="location-name">${loc.name}</div>
      
      <div class="metric-row">
        <div class="metric-box">
          <div class="metric-value">${auroraChance}%</div>
          <div class="metric-label">極光機率</div>
        </div>
        <div class="metric-box">
          <div class="metric-value">${sunElevation}°</div>
          <div class="metric-label">太陽高度</div>
        </div>
      </div>
      
      <div style="border-top: 1px solid rgba(77, 184, 212, 0.2); padding-top: 12px; margin-top: 12px;">
        <div class="kp-chart">
          <canvas id="auroraKpCanvas"></canvas>
        </div>
        
        <div style="font-size: 12px; color: #888; text-align: center; margin-bottom: 12px;">過去12h | 未來36h</div>
        
        <div class="gauge-grid">
          <div class="gauge-container">
            <canvas id="auroraGaugeKp"></canvas>
            <div class="gauge-label">Kp 指數</div>
          </div>
          <div class="gauge-container">
            <canvas id="auroraGaugeBz"></canvas>
            <div class="gauge-label">Bz (nT)</div>
          </div>
          <div class="gauge-container">
            <canvas id="auroraGaugeBt"></canvas>
            <div class="gauge-label">Bt (nT)</div>
          </div>
        </div>
      </div>
    </div>
    
    <div>
      <div style="font-size: 12px; color: #888; margin-bottom: 8px; font-weight: 600;">🌤️ 當地天氣</div>
      <div class="weather-grid">
        <div class="weather-item">
          <div class="weather-emoji">🌡️</div>
          <div>
            <div class="weather-label">氣溫</div>
            <div class="weather-value">${auroraWeather ? auroraWeather.temperature_2m.toFixed(0) : '--'}°C</div>
          </div>
        </div>
        <div class="weather-item">
          <div class="weather-emoji">💨</div>
          <div>
            <div class="weather-label">風速</div>
            <div class="weather-value">${auroraWeather ? auroraWeather.wind_speed_10m.toFixed(1) : '--'} m/s</div>
          </div>
        </div>
        <div class="weather-item">
          <div class="weather-emoji">☁️</div>
          <div>
            <div class="weather-label">總雲</div>
            <div class="weather-value">${auroraWeather ? auroraWeather.cloud_cover : '--'}%</div>
          </div>
        </div>
        <div class="weather-item">
          <div class="weather-emoji">⬇️</div>
          <div>
            <div class="weather-label">低雲</div>
            <div class="weather-value">${auroraWeather ? auroraWeather.cloud_cover_low : '--'}%</div>
          </div>
        </div>
        <div class="weather-item">
          <div class="weather-emoji">➡️</div>
          <div>
            <div class="weather-label">中雲</div>
            <div class="weather-value">${auroraWeather ? auroraWeather.cloud_cover_mid : '--'}%</div>
          </div>
        </div>
        <div class="weather-item">
          <div class="weather-emoji">⬆️</div>
          <div>
            <div class="weather-label">高雲</div>
            <div class="weather-value">${auroraWeather ? auroraWeather.cloud_cover_high : '--'}%</div>
          </div>
        </div>
      </div>
    </div>
    
    <div style="font-size: 12px; color: #888; margin: 12px 0; font-weight: 600;">📍 切換地點</div>
    <div class="location-nav">
  `;
  
  AURORA_LOCATIONS.forEach((l, idx) => {
    const isActive = idx === auroraCurrentLocation;
    html += `<button class="location-btn" onclick="switchAuroraLocation(${idx})" style="${isActive ? 'background: rgba(77, 184, 212, 0.3); border-color: rgba(77, 184, 212, 0.6);' : ''}">${l.emoji} ${l.name}</button>`;
  });
  
  html += `
    </div>
    
    <div class="update-time">⚡ 每小時自動更新一次</div>
  `;
  
  content.innerHTML = html;
  
  // 繪製圖表
  setTimeout(() => {
    const kpCanvas = document.getElementById('auroraKpCanvas');
    const gaugeKp = document.getElementById('auroraGaugeKp');
    const gaugeBz = document.getElementById('auroraGaugeBz');
    const gaugeBt = document.getElementById('auroraGaugeBt');
    
    if (kpCanvas) drawKpChart(kpCanvas, auroraKpValues);
    if (gaugeKp) drawGauge(gaugeKp, currentKp, 0, 9);
    if (gaugeBz) drawGauge(gaugeBz, -15 + Math.random() * 30, -50, 50);
    if (gaugeBt) drawGauge(gaugeBt, 20 + Math.random() * 30, 0, 100);
  }, 100);
}

// 切換地點
function switchAuroraLocation(idx) {
  auroraCurrentLocation = idx;
  renderAuroraDashboard();
}

// 繪製 KP 圖表
function drawKpChart(canvas, kpValues) {
  const ctx = canvas.getContext('2d');
  const width = canvas.width;
  const height = canvas.height;
  
  const gradient = ctx.createLinearGradient(0, 0, 0, height);
  gradient.addColorStop(0, 'rgba(15, 20, 25, 0.8)');
  gradient.addColorStop(1, 'rgba(10, 15, 21, 0.8)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
  
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
  
  kpValues.forEach((item, idx) => {
    const x = padding + (width - padding * 2) * idx / (kpValues.length - 1);
    const kpHeight = (item.kp / 9) * chartHeight;
    
    if (item.kp < 4) ctx.fillStyle = '#3dbd67';
    else if (item.kp < 6) ctx.fillStyle = '#ffc107';
    else if (item.kp < 8) ctx.fillStyle = '#ff9800';
    else ctx.fillStyle = '#f44336';
    
    ctx.fillRect(x - barWidth / 2, height - padding - kpHeight, barWidth, kpHeight);
  });
  
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

// 繪製儀表盤
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
}

// 在 init.js 中調用此函數
// initAuroraPage();
