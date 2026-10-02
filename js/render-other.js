// 「工具」頁渲染引擎。資料在 data/other-content.js（OTHER_CONTENT），樣式在 css/catalog-editorial.css。
// 分類卡片渲染邏輯（travel-collapse / item-card / item-row 等）與體驗頁完全共用，
// 直接呼叫 js/render-travel.js 暴露出來的 window.renderCatalogPage()，本檔只負責：
//   1. 工具頁專屬的固定骨架（編輯器入口卡片，屬於 UI 不屬於資料，不放進 OTHER_CONTENT）
//   2. 把骨架跟 OTHER_CONTENT 的分類資料組起來
// 本檔為純同步函式，由 js/render-overview.js 的 mountTabContent() 直接呼叫。
// 不得有 async / fetch / DOMContentLoaded / setTimeout。
// 依賴 js/render-travel.js 必須先載入（index.html 已確保順序）。

(function () {

  // 編輯器入口（v1.14 起改成折疊式）：純 UI 骨架，不隨分類資料變動，因此寫死在這裡
  // 而不是放進 OTHER_CONTENT。用原生 <details>/<summary>，不用額外寫開合的 JS。
  // 展開後每個編輯器只有「icon + 標題」一行，不再是大塊漸層卡片＋說明文字。
  var TOOL_EDITOR_SECTION_HTML =
    '<!-- 编辑工具套件（折叠） -->\n' +
    '    <details class="tool-editor-section">\n' +
    '      <summary class="tool-editor-toggle">🛠️ 编辑工具</summary>\n' +
    '      <div class="tool-editor-list">\n' +
    '        <button class="tool-editor-link" style="--accent:#667eea" onclick="window.open(\'./tools/trip-editor-pro.html\', \'trip-editor-pro\', \'width=1400,height=900,resizable=yes\')">⭐ 行程编辑器 Pro</button>\n' +
    '        <button class="tool-editor-link" style="--accent:#f5576c" onclick="window.open(\'./tools/travel-editor-pro.html\', \'travel-editor-pro\', \'width=1400,height=900,resizable=yes\')">🏔️ 体验内容编辑器</button>\n' +
    '        <button class="tool-editor-link" style="--accent:#00c2fe" onclick="window.open(\'./tools/other-editor-pro.html\', \'other-editor-pro\', \'width=1400,height=900,resizable=yes\')">🛠️ 其他内容编辑器</button>\n' +
    '      </div>\n' +
    '    </details>';

  function renderOtherHTML() {
    // 編輯器入口卡片只要出現在「工具總覽」頁最下方，個別分類詳情頁不需要。
    // 放在 categories 之後（extraAfter），並靠 CSS 用 catalog-nav.js 既有的
    // .catalog-show-overview class（總覽模式時會加到 #page-other 上）控制顯示/隱藏，
    // 不需要更動 catalog-nav.js。
    return window.renderCatalogPage(OTHER_CONTENT, 'page-other', null, TOOL_EDITOR_SECTION_HTML);
  }

  window.renderOtherHTML = renderOtherHTML;

})();
