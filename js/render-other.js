// 「工具」頁渲染引擎。資料在 data/other-content.js（OTHER_CONTENT），樣式在 css/catalog-editorial.css。
// 分類卡片渲染邏輯（travel-collapse / item-card / item-row 等）與體驗頁完全共用，
// 直接呼叫 js/render-travel.js 暴露出來的 window.renderCatalogPage()，本檔只負責：
//   1. 工具頁專屬的固定骨架（編輯器入口卡片，屬於 UI 不屬於資料，不放進 OTHER_CONTENT）
//   2. 把骨架跟 OTHER_CONTENT 的分類資料組起來
// 本檔為純同步函式，由 js/render-overview.js 的 mountTabContent() 直接呼叫。
// 不得有 async / fetch / DOMContentLoaded / setTimeout。
// 依賴 js/render-travel.js 必須先載入（index.html 已確保順序）。

(function () {

  // 編輯器入口卡片（三個彩色漸層按鈕），逐字保留自舊版 data/other-content.js 開頭區塊，
  // 純 UI 骨架，不隨分類資料變動，因此寫死在這裡而不是放進 OTHER_CONTENT。
  var TOOL_EDITOR_SECTION_HTML =
    '<!-- 編輯工具套件 -->\n' +
    '    <div class="tool-editor-section" style="margin-bottom: 24px;">\n' +
    '      <!-- 高級編輯器 (推薦) -->\n' +
    '      <div style="padding: 16px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 12px; margin-bottom: 12px; box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);">\n' +
    '        <div style="display: flex; align-items: center; justify-content: space-between;">\n' +
    '          <div>\n' +
    '            <div style="font-family: var(--font-display); font-size: var(--fs-base); font-weight: 600; color: white; margin-bottom: 4px;">⭐ 行程編輯器 Pro</div>\n' +
    '            <div style="font-size: var(--fs-xs); color: rgba(255,255,255,0.85); line-height: 1.4;">選擇景點 → 編輯內容 → 直接保存 GitHub，一站式完成行程編輯</div>\n' +
    '          </div>\n' +
    '          <button class="tool-open-btn" onclick="window.open(\'./tools/trip-editor-pro.html\', \'trip-editor-pro\', \'width=1400,height=900,resizable=yes\')" style="margin: 0; white-space: nowrap; background: white; color: #667eea; font-weight: 700;">開啟編輯器</button>\n' +
    '        </div>\n' +
    '      </div>\n' +
    '\n' +
    '      <!-- 體驗內容編輯器 -->\n' +
    '      <div style="padding: 16px; background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); border-radius: 12px; margin-bottom: 12px; box-shadow: 0 4px 12px rgba(245, 87, 108, 0.3);">\n' +
    '        <div style="display: flex; align-items: center; justify-content: space-between;">\n' +
    '          <div>\n' +
    '            <div style="font-family: var(--font-display); font-size: var(--fs-base); font-weight: 600; color: white; margin-bottom: 4px;">🏔️ 體驗內容編輯器</div>\n' +
    '            <div style="font-size: var(--fs-xs); color: rgba(255,255,255,0.85); line-height: 1.4;">編輯美食、購物、世界遺產等體驗頁面內容</div>\n' +
    '          </div>\n' +
    '          <button class="tool-open-btn" onclick="window.open(\'./tools/travel-editor-pro.html\', \'travel-editor-pro\', \'width=1400,height=900,resizable=yes\')" style="margin: 0; white-space: nowrap; background: white; color: #f5576c; font-weight: 700;">開啟編輯器</button>\n' +
    '        </div>\n' +
    '      </div>\n' +
    '\n' +
    '      <!-- 其他內容編輯器 -->\n' +
    '      <div style="padding: 16px; background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); border-radius: 12px; margin-bottom: 12px; box-shadow: 0 4px 12px rgba(79, 172, 254, 0.3);">\n' +
    '        <div style="display: flex; align-items: center; justify-content: space-between;">\n' +
    '          <div>\n' +
    '            <div style="font-family: var(--font-display); font-size: var(--fs-base); font-weight: 600; color: white; margin-bottom: 4px;">🛠️ 其他內容編輯器</div>\n' +
    '            <div style="font-size: var(--fs-xs); color: rgba(255,255,255,0.85); line-height: 1.4;">編輯退稅、極光、加油等實用工具頁面內容</div>\n' +
    '          </div>\n' +
    '          <button class="tool-open-btn" onclick="window.open(\'./tools/other-editor-pro.html\', \'other-editor-pro\', \'width=1400,height=900,resizable=yes\')" style="margin: 0; white-space: nowrap; background: white; color: #00f2fe; font-weight: 700;">開啟編輯器</button>\n' +
    '        </div>\n' +
    '      </div>\n' +
    '    </div>';

  function renderOtherHTML() {
    // 編輯器入口卡片只要出現在「工具總覽」頁最下方，個別分類詳情頁不需要。
    // 放在 categories 之後（extraAfter），並靠 CSS 用 catalog-nav.js 既有的
    // .catalog-show-overview class（總覽模式時會加到 #page-other 上）控制顯示/隱藏，
    // 不需要更動 catalog-nav.js。
    return window.renderCatalogPage(OTHER_CONTENT, 'page-other', null, TOOL_EDITOR_SECTION_HTML);
  }

  window.renderOtherHTML = renderOtherHTML;

})();
