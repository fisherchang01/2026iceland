// 「工具」页完整正式版：六个分类全部套用北欧旅行手札视觉。
// 外部网站与现场规定可能变动，出发前及使用当下应再核对最新资讯。
const OTHER_HTML = `
<style id="other-editorial-style">
  #page-other {
    --forest: #315f67;
    --forest-deep: #21484f;
  }
  #page-other .catalog-overview-card.ov-2x4 {
    background:
      radial-gradient(circle at 87% 20%, rgba(74,132,143,.22) 0 16%, transparent 38%),
      linear-gradient(135deg, #fdfaf3, #e3edef);
    border-color: #bdd0d3;
  }
  :is(#page-travel,#page-other) .tool-open-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-height: 36px;
    margin-top: 10px;
    padding: 7px 12px;
    border: 1px solid #b9cbd0;
    border-radius: 999px;
    background: #e9f1f2;
    color: #315f67;
    font-size: var(--fs-xs);
    font-weight: 800;
    cursor: pointer;
  }
  :is(#page-travel,#page-other) .tool-status-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0,1fr));
    gap: 8px;
    margin-top: 12px;
  }
  :is(#page-travel,#page-other) .tool-status {
    padding: 10px 7px;
    border: 1px solid #c8d7d9;
    border-radius: 13px;
    background: #edf4f3;
    text-align: center;
  }
  :is(#page-travel,#page-other) .tool-status strong {
    display: block;
    font-family: var(--font-display);
    font-size: var(--fs-lg);
    color: #315f67;
  }
  :is(#page-travel,#page-other) .tool-status small {
    display: block;
    margin-top: 3px;
    color: var(--muted-ink);
    font-size: var(--fs-2xs);
    line-height: 1.35;
  }
  :is(#page-travel,#page-other) .tool-callout {
    margin-top: 12px;
    padding: 11px 13px;
    border-left: 4px solid #4b7c84;
    border-radius: 0 12px 12px 0;
    background: #eaf1f1;
    color: #3c565c;
    font-size: var(--fs-xs);
    line-height: 1.6;
  }
  :is(#page-travel,#page-other) .tool-mini-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0,1fr));
    gap: 10px;
    margin: 12px 0;
  }
  :is(#page-travel,#page-other) .tool-mini-card {
    min-height: 118px;
    padding: 15px;
    border: 1px solid #cad7d8;
    border-radius: 17px;
    background: linear-gradient(145deg, #fffdf8, #e8f0ef);
    box-shadow: 0 6px 14px rgba(51,75,78,.08);
  }
  :is(#page-travel,#page-other) .tool-mini-card strong {
    display: block;
    margin: 7px 0 5px;
    font-family: var(--font-display);
    font-size: var(--fs-base);
    color: var(--ink);
  }
  :is(#page-travel,#page-other) .tool-mini-card p {
    margin: 0;
    color: var(--muted-ink);
    font-size: var(--fs-xs);
    line-height: 1.5;
  }
  :is(#page-travel,#page-other) .tool-big-icon {
    font-size: 1.65rem;
  }
  :is(#page-travel,#page-other) .tool-documents-live {
    min-height: 0;
    margin-top: 12px;
  }
  :is(#page-travel,#page-other) .tool-safety {
    border-color: #d9c4ad !important;
    background: linear-gradient(180deg, rgba(255,255,255,.65), transparent 32%), #fbf1e3 !important;
  }
  @media (max-width: 380px) {
    :is(#page-travel,#page-other) .tool-status-grid { grid-template-columns: 1fr; }
  }
</style>

<div class="page" id="page-other">
  <div class="page-inner">

    <!-- 編輯行程工具 -->
    <div class="tool-editor-section" style="margin-bottom: 24px; padding: 16px; background: linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%); border-radius: 12px; border-left: 4px solid #4a90e2;">
      <div style="display: flex; align-items: center; justify-content: space-between;">
        <div>
          <div style="font-family: var(--font-display); font-size: var(--fs-base); font-weight: 600; color: #333; margin-bottom: 4px;">✏️ 編輯行程細節</div>
          <div style="font-size: var(--fs-xs); color: #666; line-height: 1.4;">快速編輯和格式化行程文本、顏色標記與換行</div>
        </div>
        <button class="tool-open-btn" onclick="window.open('../tools/trip-details-editor.html', 'trip-editor', 'width=900,height=800,resizable=yes')" style="margin: 0; white-space: nowrap;">開啟編輯器</button>
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
