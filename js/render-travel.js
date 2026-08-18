// 「體驗」頁渲染引擎。資料在 data/travel-content.js（TRAVEL_CONTENT），樣式在 css/catalog-editorial.css。
// 本檔為純同步函式，由 js/render-overview.js 的 mountTabContent() 直接呼叫。
// 不得有 async / fetch / DOMContentLoaded / setTimeout。

(function () {

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  // 文字標記格式（沿用行程編輯器 §8.6）：
  //   換行：/n（若既有內容本身就是真實 \n，兩者都支援）
  //   顏色：{#RRGGBB}文字{/color}
  //   粗體：{bold}文字{/bold}
  //   斜體：{italic}文字{/italic}
  // 順序：先 escape，再套用標記轉換，避免 XSS 且不破壞標記符號本身。
  function parseMarkup(raw) {
    var escaped = escapeHtml(raw);
    escaped = escaped.replace(/\/n/g, '\n');
    escaped = escaped.replace(/\{#([0-9a-fA-F]{6})\}([\s\S]*?)\{\/color\}/g, function (m, color, text) {
      return '<span style="color:#' + color + '">' + text + '</span>';
    });
    escaped = escaped.replace(/\{bold\}([\s\S]*?)\{\/bold\}/g, '<strong>$1</strong>');
    escaped = escaped.replace(/\{italic\}([\s\S]*?)\{\/italic\}/g, '<em>$1</em>');
    return escaped;
  }

  function renderBlock(block) {
    if (!block) return '';
    if (block.type === 'text') {
      return '<p>' + parseMarkup(block.value) + '</p>';
    }
    if (block.type === 'img') {
      return '<img src="images/catalog/' + escapeHtml(block.src) + '" alt="">';
    }
    if (block.type === 'raw') {
      return block.html; // 客製區塊，不 escape
    }
    return '';
  }

  function renderItemCard(item) {
    var layoutClass = (item.layout === 'lg') ? 'item-lg' : 'item-sm';
    var blocksHtml = (item.blocks || []).map(renderBlock).join('\n');
    var titleHtml = item.name ? escapeHtml(item.name) : '';
    return (
      '<div class="item-card ' + layoutClass + '">\n' +
      '  <h4 class="item-card-title">' + titleHtml + '</h4>\n' +
      '  <div class="item-detail">\n' +
      blocksHtml + '\n' +
      '  </div>\n' +
      '</div>'
    );
  }

  // §6.2（修訂）：item-lg 為整行滿版，不得包進 .item-row；
  // 只有連續的 item-sm 才兩兩配對進 .item-row。
  // 落單的 sm 維持原設計（直接放在 body 下，全寬 1:1），與 848f202 版「冰島介紹」行為一致。
  function renderItems(items) {
    if (!items || items.length === 0) return '';
    var out = [];
    var buffer = [];   // 暫存連續的 sm

    function flush() {
      for (var i = 0; i < buffer.length; i += 2) {
        var pair = buffer.slice(i, i + 2);
        if (pair.length === 2) {
          out.push('<div class="item-row">\n' + pair.map(renderItemCard).join('\n') + '\n</div>');
        } else {
          out.push(renderItemCard(pair[0]));
        }
      }
      buffer = [];
    }

    items.forEach(function (item) {
      if (item.layout === 'lg') {
        flush();
        out.push(renderItemCard(item));   // lg 獨佔整行
      } else {
        buffer.push(item);
      }
    });
    flush();

    return out.join('\n\n');
  }

  function renderCategory(cat) {
    return (
      '<div class="travel-collapse" data-cover="' + escapeHtml(cat.cover) + '">\n' +
      '  <div class="travel-collapse-header" onclick="toggleTravelCollapse(this)">\n' +
      '    <div class="travel-collapse-left">\n' +
      '      <div class="travel-collapse-emoji">' + cat.emoji + '</div>\n' +
      '      <div>\n' +
      '        <div class="travel-collapse-title">' + escapeHtml(cat.title) + '</div>\n' +
      '        <div class="travel-collapse-sub">' + escapeHtml(cat.sub) + '</div>\n' +
      '      </div>\n' +
      '    </div>\n' +
      '    <div class="travel-collapse-arrow">›</div>\n' +
      '  </div>\n' +
      '  <div class="travel-collapse-body">\n' +
      renderItems(cat.items) + '\n' +
      '  </div>\n' +
      '</div>'
    );
  }

  // 通用渲染器：data 需含 { categories: [...] }，pageId 為外層 <div class="page" id="...">
  function renderCatalogPage(data, pageId) {
    var categoriesHtml = (data.categories || []).map(renderCategory).join('\n\n');
    return (
      '<div class="page" id="' + pageId + '">\n' +
      '  <div class="page-inner">\n\n' +
      categoriesHtml + '\n\n' +
      '  </div>\n' +
      '</div>'
    );
  }

  function renderTravelHTML() {
    return renderCatalogPage(TRAVEL_CONTENT, 'page-travel');
  }

  // 暴露到全域，供 render-overview.js 呼叫
  window.renderCatalogPage = renderCatalogPage;
  window.renderTravelHTML = renderTravelHTML;

})();
