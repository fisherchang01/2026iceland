// 「體驗／工具」頁籤的總覽、分類導覽與卡片詳情。
// 既有內容仍由 data/travel-content.js 與 data/other-content.js 維護；本檔只負責重新編排互動。

function catalogImageFor(text) {
  var value = text || '';
  for (var i = 0; i < CATALOG_IMAGE_MAP.length; i++) {
    if (value.indexOf(CATALOG_IMAGE_MAP[i][0]) !== -1) return CATALOG_IMAGE_MAP[i][1];
  }
  return '';
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
    return el.matches('.souvenir-card, .souvenir-item, .market-grid, .info-card, .travel-sub-collapse, .link-card, .alcohol-warn');
  });
  candidates.forEach(function(el){
    if (el.classList.contains('market-grid')) {
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
    if (event.target.closest('a')) return;
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
  var clone = card.cloneNode(true);
  clone.classList.remove('catalog-list-card');
  clone.removeAttribute('role'); clone.removeAttribute('tabindex');
  clone.querySelectorAll('.travel-sub-body, .collapse-body').forEach(function(el){ el.classList.add('open'); });
  clone.querySelectorAll('[onclick]').forEach(function(el){ el.removeAttribute('onclick'); });
  document.getElementById('catalogSheetTitle').textContent = title;
  var body = document.getElementById('catalogSheetBody');
  body.innerHTML = ''; body.appendChild(clone);
  document.getElementById('catalogSheet').classList.add('open');
  document.getElementById('catalogSheetBackdrop').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeCatalogDetail() {
  var sheet = document.getElementById('catalogSheet');
  var backdrop = document.getElementById('catalogSheetBackdrop');
  if (sheet) sheet.classList.remove('open');
  if (backdrop) backdrop.classList.remove('open');
  document.body.style.overflow = '';
}
