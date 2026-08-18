// 「工具」页完整正式版：六个分类全部套用北欧旅行手札视觉。
// 外部网站与现场规定可能变动，出发前及使用当下应再核对最新资讯。
const OTHER_HTML = `
<div class="page" id="page-other">
  <div class="page-inner">

    <!-- 編輯工具套件 -->
    <div class="tool-editor-section" style="margin-bottom: 24px;">
      <!-- 高級編輯器 (推薦) -->
      <div style="padding: 16px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 12px; margin-bottom: 12px; box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);">
        <div style="display: flex; align-items: center; justify-content: space-between;">
          <div>
            <div style="font-family: var(--font-display); font-size: var(--fs-base); font-weight: 600; color: white; margin-bottom: 4px;">⭐ 行程編輯器 Pro</div>
            <div style="font-size: var(--fs-xs); color: rgba(255,255,255,0.85); line-height: 1.4;">選擇景點 → 編輯內容 → 直接保存 GitHub，一站式完成行程編輯</div>
          </div>
          <button class="tool-open-btn" onclick="window.open('./tools/trip-editor-pro.html', 'trip-editor-pro', 'width=1400,height=900,resizable=yes')" style="margin: 0; white-space: nowrap; background: white; color: #667eea; font-weight: 700;">開啟編輯器</button>
        </div>
      </div>

      <!-- 體驗內容編輯器 -->
      <div style="padding: 16px; background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); border-radius: 12px; margin-bottom: 12px; box-shadow: 0 4px 12px rgba(245, 87, 108, 0.3);">
        <div style="display: flex; align-items: center; justify-content: space-between;">
          <div>
            <div style="font-family: var(--font-display); font-size: var(--fs-base); font-weight: 600; color: white; margin-bottom: 4px;">🏔️ 體驗內容編輯器</div>
            <div style="font-size: var(--fs-xs); color: rgba(255,255,255,0.85); line-height: 1.4;">編輯美食、購物、世界遺產等體驗頁面內容（10 個分類）</div>
          </div>
          <button class="tool-open-btn" onclick="window.open('./tools/travel-editor-pro.html', 'travel-editor-pro', 'width=1400,height=900,resizable=yes')" style="margin: 0; white-space: nowrap; background: white; color: #f5576c; font-weight: 700;">開啟編輯器</button>
        </div>
      </div>

      <!-- 其他內容編輯器 -->
      <div style="padding: 16px; background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); border-radius: 12px; margin-bottom: 12px; box-shadow: 0 4px 12px rgba(79, 172, 254, 0.3);">
        <div style="display: flex; align-items: center; justify-content: space-between;">
          <div>
            <div style="font-family: var(--font-display); font-size: var(--fs-base); font-weight: 600; color: white; margin-bottom: 4px;">🛠️ 其他內容編輯器</div>
            <div style="font-size: var(--fs-xs); color: rgba(255,255,255,0.85); line-height: 1.4;">編輯退稅、極光、加油等實用工具頁面內容（6 個分類）</div>
          </div>
          <button class="tool-open-btn" onclick="window.open('./tools/other-editor-pro.html', 'other-editor-pro', 'width=1400,height=900,resizable=yes')" style="margin: 0; white-space: nowrap; background: white; color: #00f2fe; font-weight: 700;">開啟編輯器</button>
        </div>
      </div>
    </div>

    <!-- 1. 冰岛退税 -->
    <div class="travel-collapse" data-cover="iceland_tax_refund.webp">
      <div class="travel-collapse-header" onclick="toggleTravelCollapse(this)">
        <div class="travel-collapse-left">
          <div class="travel-collapse-emoji">🧾</div>
          <div>
            <div class="travel-collapse-title">冰岛退税</div>
            <div class="travel-collapse-sub">冰岛退税门槛、退税单及机场办理流程</div>
          </div>
        </div>
        <div class="travel-collapse-arrow">›</div>
      </div>
      <div class="travel-collapse-body">
        <!-- 項目內容之後補充：第二層 item-card（圖＋標題），詳情放在 .item-detail -->
      </div>
    </div>

    <!-- 2. 芬兰退税 -->
    <div class="travel-collapse" data-cover="finland_tax_refund.webp">
      <div class="travel-collapse-header" onclick="toggleTravelCollapse(this)">
        <div class="travel-collapse-left">
          <div class="travel-collapse-emoji">💶</div>
          <div>
            <div class="travel-collapse-title">芬兰退税</div>
            <div class="travel-collapse-sub">芬兰退税门槛、Global Blue及机场流程</div>
          </div>
        </div>
        <div class="travel-collapse-arrow">›</div>
      </div>
      <div class="travel-collapse-body">
        <!-- 項目內容之後補充：第二層 item-card（圖＋標題），詳情放在 .item-detail -->
      </div>
    </div>

    <!-- 3. 极光机率 -->
    <div class="travel-collapse" data-cover="aurora_forecast.webp">
      <div class="travel-collapse-header" onclick="toggleTravelCollapse(this)">
        <div class="travel-collapse-left">
          <div class="travel-collapse-emoji">🌌</div>
          <div>
            <div class="travel-collapse-title">极光机率</div>
            <div class="travel-collapse-sub">查询云量、KP值与极光出现机率</div>
          </div>
        </div>
        <div class="travel-collapse-arrow">›</div>
      </div>
      <div class="travel-collapse-body">
        <!-- 項目內容之後補充：第二層 item-card（圖＋標題），詳情放在 .item-detail -->
      </div>
    </div>

    <!-- 4. 拍摄极光 -->
    <div class="travel-collapse" data-cover="aurora_photography.webp">
      <div class="travel-collapse-header" onclick="toggleTravelCollapse(this)">
        <div class="travel-collapse-left">
          <div class="travel-collapse-emoji">📷</div>
          <div>
            <div class="travel-collapse-title">拍摄极光</div>
            <div class="travel-collapse-sub">手机夜间模式、脚架与曝光拍摄技巧</div>
          </div>
        </div>
        <div class="travel-collapse-arrow">›</div>
      </div>
      <div class="travel-collapse-body">
        <!-- 項目內容之後補充：第二層 item-card（圖＋標題），詳情放在 .item-detail -->
      </div>
    </div>

    <!-- 5. 冰岛加油 -->
    <div class="travel-collapse" data-cover="iceland_fuel.webp">
      <div class="travel-collapse-header" onclick="toggleTravelCollapse(this)">
        <div class="travel-collapse-left">
          <div class="travel-collapse-emoji">⛽</div>
          <div>
            <div class="travel-collapse-title">冰岛加油</div>
            <div class="travel-collapse-sub">介绍N1、Orkan及Olís等冰岛加油站，包含自助加油及如何付款</div>
          </div>
        </div>
        <div class="travel-collapse-arrow">›</div>
      </div>
      <div class="travel-collapse-body">
        <!-- 項目內容之後補充：第二層 item-card（圖＋標題），詳情放在 .item-detail -->
      </div>
    </div>

    <!-- 6. 洗浴文化 -->
    <div class="travel-collapse" data-cover="finnish_sauna.webp">
      <div class="travel-collapse-header" onclick="toggleTravelCollapse(this)">
        <div class="travel-collapse-left">
          <div class="travel-collapse-emoji">🧖</div>
          <div>
            <div class="travel-collapse-title">洗浴文化</div>
            <div class="travel-collapse-sub">认识各国桑拿、温泉与洗浴习俗</div>
          </div>
        </div>
        <div class="travel-collapse-arrow">›</div>
      </div>
      <div class="travel-collapse-body">
        <!-- 項目內容之後補充：第二層 item-card（圖＋標題），詳情放在 .item-detail -->
      </div>
    </div>

  </div>
</div>
`;


