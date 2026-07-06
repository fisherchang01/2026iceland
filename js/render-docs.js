// 「旅行文件」清單的渲染邏輯：讀取 data/docs-content.js 的 DOCS 陣列，
// 依 category 分組後顯示成可點擊下載/查看的清單。
// 新增文件不需要改這裡，只要編輯 data/docs-content.js 就好。
function renderDocs() {
  var container = document.getElementById('docsListContainer');
  if (!container) return;

  if (typeof DOCS === 'undefined' || DOCS.length === 0) {
    container.innerHTML = '<p style="font-size:var(--fs-sm);color:var(--sub);padding:var(--sp-5) 0;">尚未上传任何文件。可参考 docs/README.txt 说明新增机票、住宿、租车等 PDF。</p>';
    return;
  }

  var groups = {};
  var order = [];
  DOCS.forEach(function(d) {
    if (!groups[d.category]) { groups[d.category] = []; order.push(d.category); }
    groups[d.category].push(d);
  });

  var html = '';
  order.forEach(function(cat) {
    html += '<div class="doc-group-label">' + cat + '</div>';
    groups[cat].forEach(function(d) {
      html += '<a class="link-card" href="docs/' + d.filename + '" target="_blank" rel="noopener">' +
                '<div class="link-icon">' + (d.icon || '📄') + '</div>' +
                '<div class="link-info"><h4>' + d.title + '</h4><p>' + (d.note || '') + '</p></div>' +
              '</a>';
    });
  });

  container.innerHTML = html;
}
