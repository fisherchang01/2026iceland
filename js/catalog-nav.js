// 「體驗／工具」頁籤的總覽、分類導覽與卡片詳情。
// 既有內容仍由 data/travel-content.js 與 data/other-content.js 維護；本檔只負責重新編排互動。

function catalogImageFor(text) {
  var value = text || '';
  for (var i = 0; i < CATALOG_IMAGE_MAP.length; i++) {
    if (value.indexOf(CATALOG_IMAGE_MAP[i][0]) !== -1) return CATALOG_IMAGE_MAP[i][1];
  }
  return '';
}

// v9 新增：這個項目詳情要用哪些照片。
// 目前多數項目都還沒有真實照片，所以預設沿用 CATALOG_IMAGE_MAP 配對到的單張圖示/favicon。
// 之後 Fisher 要補真實照片時，只要在 data/travel-content.js 或 data/other-content.js
// 對應的卡片元素上加一個 data-images="file1.jpg,file2.jpg" 屬性（檔名放在 images/catalog/ 底下），
// 這裡就會自動改成多張、可左右滑動；不需要動這支程式。
function catalogImagesFor(card, fallbackText) {
  var attr = card.getAttribute('data-images');
  if (attr) {
    return attr.split(',').map(function(s){ return s.trim(); }).filter(Boolean).map(function(f){
      return /^https?:\/\//.test(f) || f.indexOf('/') === 0 ? f : 'images/catalog/' + f;
    });
  }
  var mapped = catalogImageFor(fallbackText);
  return mapped ? [mapped] : [];
}

function catalogDirectCategories(page) {
  var inner = page && page.querySelector(':scope > .page-inner');
  return inner ? Array.from(inner.children).filter(function(el){ return el.classList.contains('travel-collapse'); }) : [];
}

function initCatalogPages() {
  Object.keys(CATALOG_PAGE_META).forEach(function(key){ initCatalogPage(key); });
  ensureCatalogSheet();
}

function initCatalogPage(key) {
  var meta = CATALOG_PAGE_META[key];
  var page = document.getElementById(meta.pageId);
  if (!page || page.dataset.catalogReady === '1') return;
  var inner = page.querySelector(':scope > .page-inner');
  var categories = catalogDirectCategories(page);
  if (!inner || !categories.length) return;

  page.dataset.catalogReady = '1';
  page.classList.add('catalog-page');
  categories.forEach(function(cat, index){
    cat.dataset.catalogIndex = String(index);
    prepareCatalogCards(cat);
  });

  var top = document.createElement('div');
  top.className = 'catalog-top';
  top.innerHTML = '<button class="catalog-pill catalog-pill-overview active" onclick="selectCatalogCategory(\'' + key + '\', null)">' +
    meta.overview + '</button><div class="catalog-pill-scroll">' + categories.map(function(cat, index){
      var title = cat.querySelector('.travel-collapse-title');
      return '<button class="catalog-pill" data-index="' + index + '" onclick="selectCatalogCategory(\'' + key + '\',' + index + ')">' +
        (meta.labels[index] || (title ? title.textContent.trim() : '分類 ' + (index + 1))) + '</button>';
    }).join('') + '</div>';
  inner.insertBefore(top, inner.firstChild);

  var overview = document.createElement('div');
  overview.className = 'catalog-overview';
  overview.innerHTML = '<div class="catalog-overview-heading"><h2>' + meta.overview + '</h2><p>選擇分類查看完整內容</p></div><div class="catalog-overview-grid">' +
    categories.map(function(cat, index){
      var emoji = cat.querySelector('.travel-collapse-emoji');
      var title = cat.querySelector('.travel-collapse-title');
      var sub = cat.querySelector('.travel-collapse-sub');
      return '<button class="catalog-overview-card" onclick="selectCatalogCategory(\'' + key + '\',' + index + ')">' +
        '<span class="catalog-overview-icon">' + (emoji ? emoji.textContent.trim() : '•') + '</span>' +
        '<span class="catalog-overview-copy"><strong>' + (meta.labels[index] || (title ? title.textContent.trim() : '分類')) + '</strong><small>' +
        (sub ? sub.textContent.trim() : '點選查看內容') + '</small></span><span class="catalog-overview-arrow">›</span></button>';
    }).join('') + '</div>';
  top.insertAdjacentElement('afterend', overview);
  selectCatalogCategory(key, null);
}

function selectCatalogCategory(key, index) {
  var meta = CATALOG_PAGE_META[key];
  var page = meta && document.getElementById(meta.pageId);
  if (!page) return;
  var categories = catalogDirectCategories(page);
  var overview = page.querySelector('.catalog-overview');
  var banner = page.querySelector('.travel-banner');
  var overviewPill = page.querySelector('.catalog-pill-overview');
  var pills = page.querySelectorAll('.catalog-pill-scroll .catalog-pill');
  var isOverview = index === null || typeof index === 'undefined';

  page.classList.toggle('catalog-show-overview', isOverview);
  if (overview) overview.style.display = isOverview ? 'block' : 'none';
  if (banner) banner.style.display = isOverview ? 'flex' : 'none';
  if (overviewPill) overviewPill.classList.toggle('active', isOverview);
  pills.forEach(function(pill){ pill.classList.toggle('active', !isOverview && Number(pill.dataset.index) === Number(index)); });
  categories.forEach(function(cat, i){
    var selected = !isOverview && i === Number(index);
    cat.style.display = selected ? 'block' : 'none';
    var body = cat.querySelector(':scope > .travel-collapse-body');
    if (body) body.classList.toggle('open', selected);
  });
  if (!isOverview) {
    var activePill = page.querySelector('.catalog-pill-scroll .catalog-pill.active');
    if (activePill && activePill.scrollIntoView) activePill.scrollIntoView({ behavior:'smooth', inline:'center', block:'nearest' });
  }
  window.scrollTo({ top:0, behavior:'smooth' });
}

function prepareCatalogCards(category) {
  var body = category.querySelector(':scope > .travel-collapse-body');
  if (!body) return;
  var candidates = Array.from(body.children).filter(function(el){
    return el.matches('.souvenir-card, .souvenir-item, .market-grid, .station-grid, .info-card, .travel-sub-collapse, .link-card, .alcohol-warn');
  });
  candidates.forEach(function(el){
    if (el.classList.contains('market-grid') || el.classList.contains('station-grid')) {
      Array.from(el.children).forEach(function(card){ makeCatalogCard(card); });
    } else {
      makeCatalogCard(el);
    }
  });
}

function makeCatalogCard(card) {
  if (!card || card.dataset.catalogCard === '1') return;
  card.dataset.catalogCard = '1';
  card.classList.add('catalog-list-card');
  card.setAttribute('role', 'button');
  card.setAttribute('tabindex', '0');
  var titleEl = card.querySelector('h4, .travel-sub-title, .warn-title, strong');
  var title = titleEl ? titleEl.textContent.trim() : '詳細內容';
  var imageUrl = catalogImageFor(card.textContent);
  var existingImage = card.querySelector('.souvenir-img-wrap');
  var hasStandardCopy = !!card.querySelector(':scope > .souvenir-info, :scope > .souvenir-item-info');
  if (!hasStandardCopy) {
    var copy = document.createElement('div');
    copy.className = 'catalog-card-copy';
    while (card.firstChild) copy.appendChild(card.firstChild);
    card.appendChild(copy);
  }
  if (imageUrl && existingImage && !existingImage.querySelector('img')) {
    existingImage.innerHTML = '<img src="' + imageUrl + '" alt="' + title.replace(/"/g, '&quot;') + '" loading="lazy" decoding="async" onerror="this.remove()">';
  } else if (!existingImage) {
    var media = document.createElement('div');
    var categoryEmoji = card.closest('.travel-collapse').querySelector('.travel-collapse-emoji');
    media.className = 'catalog-card-media' + (imageUrl ? '' : ' image-error');
    media.innerHTML = imageUrl ? '<img src="' + imageUrl + '" alt="' + title.replace(/"/g, '&quot;') + '" loading="lazy" decoding="async" onerror="this.parentElement.classList.add(\'image-error\');this.remove()">' :
      '<span>' + (categoryEmoji ? categoryEmoji.textContent.trim() : '✦') + '</span>';
    card.insertBefore(media, card.firstChild);
  }
  card.addEventListener('click', function(event){
    var nearestLink = event.target.closest('a');
    if (nearestLink && nearestLink !== card) return; // 卡片內部另外嵌的連結，維持原本直接跳轉
    if (card.tagName === 'A') event.preventDefault(); // 卡片本身就是連結（如 link-card）：先開詳情層，不直接跳走
    openCatalogDetail(card, title);
  });
  card.addEventListener('keydown', function(event){
    if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); openCatalogDetail(card, title); }
  });
}

function ensureCatalogSheet() {
  if (document.getElementById('catalogSheet')) return;
  var wrap = document.createElement('div');
  wrap.innerHTML = '<div class="catalog-sheet-backdrop" id="catalogSheetBackdrop" onclick="closeCatalogDetail()"></div>' +
    '<section class="catalog-sheet" id="catalogSheet" aria-modal="true" role="dialog">' +
    '<div class="catalog-sheet-handle"></div><button class="catalog-sheet-close" onclick="closeCatalogDetail()" aria-label="關閉">×</button>' +
    '<div class="catalog-sheet-title" id="catalogSheetTitle"></div><div class="catalog-sheet-body" id="catalogSheetBody"></div></section>';
  document.body.appendChild(wrap);
}

function openCatalogDetail(card, title) {
  ensureCatalogSheet();
  var categoryEl = card.closest('.travel-collapse');
  var categoryTitleEl = categoryEl && categoryEl.querySelector('.travel-collapse-title');
  var categoryEmojiEl = categoryEl && categoryEl.querySelector('.travel-collapse-emoji');
  var categoryLabel = categoryTitleEl ? categoryTitleEl.textContent.trim() : '';
  var fallbackIcon = categoryEmojiEl ? categoryEmojiEl.textContent.trim() : '✦';

  var clone = card.cloneNode(true);
  clone.classList.remove('catalog-list-card');
  clone.removeAttribute('role'); clone.removeAttribute('tabindex');
  clone.querySelectorAll('.travel-sub-body, .collapse-body').forEach(function(el){ el.classList.add('open'); });
  clone.querySelectorAll('[onclick]').forEach(function(el){ el.removeAttribute('onclick'); });
  // 原本內嵌的圖片/favicon 區塊拿掉，改由下面統一的相片輪播呈現（跟景點詳情同一套元件）
  clone.querySelectorAll('.souvenir-img-wrap, .catalog-card-media').forEach(function(el){ el.remove(); });
  // 連結類卡片（link-card 本身是 <a>）：詳情層裡不能整塊還是可點擊連結，
  // 改成跟住宿導航一樣「先看內容，底部另外放一個按鈕」的模式
  var linkHref = clone.tagName === 'A' ? clone.getAttribute('href') : null;
  if (linkHref) { clone.removeAttribute('href'); clone.removeAttribute('target'); }

  // 固定標題（不捲動）：分類 + 項目名稱，比照景點詳情層的 spot-hero 呈現
  document.getElementById('catalogSheetTitle').innerHTML =
    (categoryLabel ? '<div class="spot-hero-label">' + categoryLabel + '</div>' : '') +
    '<div class="spot-hero-title">' + title + '</div>';

  // 可捲動內容：相片輪播 → 原有介紹文字 → （連結類項目）前往連結按鈕
  var body = document.getElementById('catalogSheetBody');
  body.innerHTML = buildPhotoCarouselHtml(catalogImagesFor(card, card.textContent), fallbackIcon, title, 'plain');
  body.appendChild(clone);
  if (linkHref) {
    var btnRow = document.createElement('div');
    btnRow.className = 'map-btn-row';
    btnRow.innerHTML = '<a class="map-btn" target="_blank" rel="noopener" href="' + linkHref + '">前往連結 ↗</a>';
    body.appendChild(btnRow);
  }

  document.getElementById('catalogSheet').classList.add('open');
  document.getElementById('catalogSheetBackdrop').classList.add('open');
  document.getElementById('catalogSheetBody').scrollTop = 0;
  document.body.style.overflow = 'hidden';
}

function closeCatalogDetail() {
  var sheet = document.getElementById('catalogSheet');
  var backdrop = document.getElementById('catalogSheetBackdrop');
  if (sheet) sheet.classList.remove('open');
  if (backdrop) backdrop.classList.remove('open');
  document.body.style.overflow = '';
}
