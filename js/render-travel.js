/**
 * render-travel.js
 * 
 * 核心責任：將 JSON 數據轉換為 HTML 呈現
 * 永遠不會被編輯器修改
 * 編輯器只改 data/travel-content.json
 */

/**
 * renderTravelContent(travelData)
 * 返回HTML內容（去掉外層的const和反引號）
 * 呼叫方可以設置 window.TRAVEL_HTML = html
 */
function renderTravelContent(travelData) {
  if (!travelData || !travelData.categories) {
    console.error('❌ 無效的 travelData 結構');
    return '';
  }

  let html = `<style id="travel-editorial-style">
  /* 保留原有 CSS 樣式 */
  :is(#page-travel,#page-other) {
    --paper: #fbf8f1;
    --paper-deep: #eee7da;
    --paper-line: #d8cdbd;
    --forest: #3f6542;
    --forest-deep: #294a31;
    --ink: #27312d;
    --muted-ink: #68736d;
  }
</style>

<div class="travel-container">
`;

  // 遍歷每個分類
  travelData.categories.forEach((category) => {
    const dataCoverAttr = category.dataCover ? ` data-cover="${escapeHTML(category.dataCover)}"` : '';
    
    html += `  <div class="travel-collapse"${dataCoverAttr}>
    <div class="travel-collapse-header" onclick="toggleTravelCollapse(this)">
      <div class="travel-collapse-left">
        <div class="travel-collapse-emoji">${escapeHTML(category.emoji)}</div>
        <div>
          <div class="travel-collapse-title">${escapeHTML(category.title)}</div>
          <div class="travel-collapse-sub">${escapeHTML(category.subtitle)}</div>
        </div>
      </div>
      <div class="travel-collapse-arrow">›</div>
    </div>
    <div class="travel-collapse-body">
`;

    // 渲染項目（每行2個）
    const items = category.items || [];
    for (let i = 0; i < items.length; i += 2) {
      html += `      <div class="item-row">
`;
      
      // 第一個項目
      const item1 = items[i];
      if (item1.name) {  // 只有有名稱的才顯示
        html += renderItemCard(item1);
      }
      
      // 第二個項目
      if (i + 1 < items.length) {
        const item2 = items[i + 1];
        if (item2.name) {
          html += renderItemCard(item2);
        }
      }
      
      html += `      </div>
`;
    }

    html += `    </div>
  </div>
`;
  });

  html += `</div>`;
  
  // 直接返回 HTML 內容（不包含 const TRAVEL_HTML = `...` 的包裝）
  return html;
}

function renderItemCard(item) {
  return `        <div class="item-card item-sm">
          <h4 class="item-card-title">${escapeHTML(item.name)}</h4>
          <div class="item-detail">
            <p>${escapeHTML(item.content)}</p>
          </div>
        </div>
`;
}

function escapeHTML(text) {
  if (!text) return '';
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return String(text).replace(/[&<>"']/g, m => map[m]);
}
