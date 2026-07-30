// 「體驗／工具」頁籤的總覽、分類導覽與卡片詳情。
// 既有內容仍由 data/travel-content.js 與 data/other-content.js 維護；本檔只負責重新編排互動。
//
// v23 改版說明：
// 舊版本是 hero／split／tile／note 四種版型，這一版改成三種——
//   square（正方形圖文框）：上方 4:3 封面圖 + 標題 + 文字介紹，詳情頁圖片直式堆疊（3:5）
//   wide（橫式圖文框）：左側 1:1 縮圖 + 右側文字 + 右緣箭頭，詳情頁圖片左右滑動輪播（4:3）
//   text（純文字框，info-card／alcohol-warn）：不放圖片、不能點擊展開，內容本身已完整
// 「滿版大卡 Hero」（travel-banner.editorial-hero）已整段移除，不再保留。
// 總覽頁卡片尺寸系統（2x4／2x2 兩種），由 catalog-config.js 的 sizes 陣列指定。

function normalizeCatalogImagePath(f) {
  return /^https?:\/\//.test(f) || f.indexOf('/') === 0 ? f : 'images/catalog/' + f;
}

function catalogImageFor(text) {
  var value = text || '';
  for (var i = 0; i < CATALOG_IMAGE_MAP.length; i++) {
    if (value.indexOf(CATALOG_IMAGE_MAP[i][0]) !== -1) return CATALOG_IMAGE_MAP[i][1];
  }
  return '';
}

// 清單卡片／總覽卡片共用的封面圖抓取邏輯：優先讀 data-cover（補真實照片時用這個），
// 沒有的話才退回關鍵字比對 CATALOG_IMAGE_MAP，兩者都沒有就交給呼叫端顯示 emoji 佔位。
function catalogCoverFor(el, fallbackText) {
  var attr = el.getAttribute('data-cover');
  if (attr) return normalizeCatalogImagePath(attr.trim());
  return catalogImageFor(fallbackText);
}

// 詳情頁多張照片：優先讀 data-images（補真實照片時用這個，檔名放 images/catalog/ 底下，逗號分隔）；
// 沒有的話退回 data-cover／關鍵字比對到的單張圖。
function catalogImagesFor(card, fallbackText) {
  var attr = card.getAttribute('data-images');
  if (attr) {
    return attr.split(',').map(function(s){ return s.trim(); }).filter(Boolean).map(normalizeCatalogImagePath);
  }
  var mapped = catalogCoverFor(card, fallbackText);
  return mapped ? [mapped] : [];
}

function catalogDirectCategories(page) {
  var inner = page && page.querySelector(':scope > .page-inner');
  return inner ? Array.from(inner.children).filter(function(el){ return el.classList.contains('travel-collapse'); }) : [];
}

// Fisher-Yates 洗牌，回傳新陣列（不改動原陣列）——總覽頁隨機排版用。
function shuffleArray(arr) {
  var a = arr.slice();
  for (var i = a.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var tmp = a[i]; a[i] = a[j]; a[j] = tmp;
  }
  return a;
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
    addCatalogCategoryIntro(cat);
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
  // v24：總覽排版順序——只有 2x4（固定置頂）跟 2x2 兩種尺寸。
  // 2x2 一律先兩兩配對成一個「行單位」再參與洗牌，確保不管怎麼隨機，
  // 都不會有落單的 2x2 卡在中間造成排版缺角；奇數時，落單的那一個固定墊底。
  var big = [], square = [];
  categories.forEach(function(_, i){
    var size = (meta.sizes && meta.sizes[i]) || '2x2';
    if (size === '2x4') big.push(i);
    else square.push(i);
  });
  square = shuffleArray(square);
  var trailingOrphan = null;
  if (square.length % 2 === 1) { trailingOrphan = square.pop(); }
  var units = [];
  for (var p = 0; p < square.length; p += 2) { units.push([square[p], square[p + 1]]); }
  units = shuffleArray(units);
  var order = big.concat.apply(big, units);
  if (trailingOrphan !== null) order.push(trailingOrphan);
  overview.innerHTML = '<div class="catalog-overview-heading"><h2>' + meta.overview + '</h2><p>選擇分類查看完整內容</p></div><div class="catalog-overview-grid">' +
    order.map(function(index){
      var cat = categories[index];
      var emoji = cat.querySelector('.travel-collapse-emoji');
      var title = cat.querySelector('.travel-collapse-title');
      var sub = cat.querySelector('.travel-collapse-sub');
      var size = (meta.sizes && meta.sizes[index]) || '2x2';
      var label = meta.labels[index] || (title ? title.textContent.trim() : '分類');
      var subText = sub ? sub.textContent.trim() : '點選查看內容';
      var emojiText = emoji ? emoji.textContent.trim() : '•';
      // v24：兩種尺寸（2x4／2x2）都需要封面圖；圖片讀取失敗時才退回 emoji 佔位，不是設計上的預設選項
      var coverUrl = catalogCoverFor(cat, label);
      var mediaHtml = '<div class="catalog-overview-media' + (coverUrl ? '' : ' image-error') + '">' +
        (coverUrl ? '<img src="' + coverUrl + '" alt="' + label + '" loading="lazy" decoding="async" onerror="this.parentElement.classList.add(\'image-error\');this.remove()">' : '<span>' + emojiText + '</span>') +
        '</div>';
      return '<button class="catalog-overview-card ov-' + size + '" onclick="selectCatalogCategory(\'' + key + '\',' + index + ')">' +
        mediaHtml +
        '<span class="catalog-overview-copy"><strong>' + label + '</strong><small>' + subText + '</small></span>' +
        (size === '2x4' ? '' : '<span class="catalog-overview-arrow">›</span>') +
        '</button>';
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
  var overviewPill = page.querySelector('.catalog-pill-overview');
  var pills = page.querySelectorAll('.catalog-pill-scroll .catalog-pill');
  var isOverview = index === null || typeof index === 'undefined';

  page.classList.toggle('catalog-show-overview', isOverview);
  if (overview) overview.style.display = isOverview ? 'block' : 'none';
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

function addCatalogCategoryIntro(cat) {
  var body = cat.querySelector(':scope > .travel-collapse-body');
  var titleEl = cat.querySelector('.travel-collapse-title');
  if (!body || !titleEl || body.querySelector(':scope > .catalog-category-intro')) return;
  var subEl = cat.querySelector('.travel-collapse-sub');
  var emojiEl = cat.querySelector('.travel-collapse-emoji');
  var intro = document.createElement('div');
  intro.className = 'catalog-category-intro';
  intro.innerHTML = '<span class="catalog-category-intro-icon">' + (emojiEl ? emojiEl.textContent.trim() : '✦') + '</span>' +
    '<span class="catalog-category-intro-copy"><strong>' + titleEl.textContent.trim() + '</strong>' +
    (subEl ? '<small>' + subEl.textContent.trim() + '</small>' : '') + '</span>';
  body.insertBefore(intro, body.firstChild);
}

function prepareCatalogCards(category) {
  var body = category.querySelector(':scope > .travel-collapse-body');
  if (!body) return;
  var candidates = Array.from(body.children).filter(function(el){
    return el.matches('.catalog-square, .catalog-wide, .info-card, .alcohol-warn');
  });
  candidates.forEach(function(el){ makeCatalogCard(el); });

  // v24（測試中）：簡化版 item-card，可以直接放在 body 下（大卡 item-lg 常見這樣），
  // 也可以包在 .item-row 裡兩張並排（小卡 item-sm 常見這樣）。
  Array.from(body.querySelectorAll('.item-card')).forEach(function(el){ makeItemCard(el); });
}

// 版型判斷：card 本身的 class 決定它是哪一種——不再靠猜測內容型態。
function catalogLayoutFor(card) {
  if (card.classList.contains('catalog-square')) return 'square';
  if (card.classList.contains('catalog-wide')) return 'wide';
  return 'text';
}

function makeCatalogCard(card) {
  if (!card || card.dataset.catalogCard === '1') return;
  card.dataset.catalogCard = '1';
  var layout = catalogLayoutFor(card);
  card.classList.add('catalog-list-card', 'catalog-layout-' + layout);

  // 純文字框：不放圖片、不能點擊展開，內容本身已經是完整資訊。
  if (layout === 'text') return;

  card.setAttribute('role', 'button');
  card.setAttribute('tabindex', '0');
  var titleEl = card.querySelector('h4, strong');
  var title = titleEl ? titleEl.textContent.trim() : '詳細內容';

  var coverUrl = catalogCoverFor(card, title);
  var media = document.createElement('div');
  media.className = layout === 'square' ? 'catalog-square-media' : 'catalog-wide-media';
  if (coverUrl) {
    media.innerHTML = '<img src="' + coverUrl + '" alt="' + title.replace(/"/g, '&quot;') + '" loading="lazy" decoding="async" onerror="this.parentElement.classList.add(\'image-error\');this.remove()">';
  } else {
    var categoryEl = card.closest('.travel-collapse');
    var categoryEmoji = categoryEl && categoryEl.querySelector('.travel-collapse-emoji');
    media.classList.add('image-error');
    media.innerHTML = '<span>' + (categoryEmoji ? categoryEmoji.textContent.trim() : '✦') + '</span>';
  }
  card.insertBefore(media, card.firstChild);

  card.addEventListener('click', function(event){
    var nearestLink = event.target.closest('a');
    if (nearestLink && nearestLink !== card) return; // 卡片內部另外嵌的連結，維持原本直接跳轉
    openCatalogDetail(card, title);
  });
  card.addEventListener('keydown', function(event){
    if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); openCatalogDetail(card, title); }
  });
}

// v24（測試中）：簡化版圖文卡，只分大（item-lg，2.2:1）／小（item-sm，1:1）兩種尺寸，
// 不再區分 square／wide 版型。封面圖不用另外指定，直接取第三層 .item-detail 裡的
// 第一張圖片；圖片比例跟卡框（2.2:1／1:1）對不上時，用置中裁切（object-fit:cover）顯示，
// 不會影響到原圖本身——第三層詳情頁看到的仍是完整原圖、原始比例。
function makeItemCard(card) {
  if (!card || card.dataset.catalogCard === '1') return;
  card.dataset.catalogCard = '1';

  var titleEl = card.querySelector(':scope > .item-card-title');
  var title = titleEl ? titleEl.textContent.trim() : '詳細內容';

  var detailEl = card.querySelector(':scope > .item-detail');
  var firstImg = detailEl && detailEl.querySelector('img');
  var coverUrl = firstImg ? firstImg.getAttribute('src') : '';

  var media = document.createElement('div');
  media.className = 'item-card-media';
  if (coverUrl) {
    media.innerHTML = '<img src="' + coverUrl + '" alt="' + title.replace(/"/g, '&quot;') + '" loading="lazy" decoding="async" onerror="this.parentElement.classList.add(\'image-error\');this.remove()">';
  } else {
    var categoryEl = card.closest('.travel-collapse');
    var categoryEmoji = categoryEl && categoryEl.querySelector('.travel-collapse-emoji');
    media.classList.add('image-error');
    media.innerHTML = '<span>' + (categoryEmoji ? categoryEmoji.textContent.trim() : '✦') + '</span>';
  }
  card.insertBefore(media, card.firstChild);

  card.setAttribute('role', 'button');
  card.setAttribute('tabindex', '0');
  card.addEventListener('click', function(){ openItemDetail(card, title); });
  card.addEventListener('keydown', function(event){
    if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); openItemDetail(card, title); }
  });
}

// v24（測試中）：詳情彈窗直接顯示 .item-detail 裡原始寫好的內容（文字、圖片自由排列、
// 任意順序、任意數量），不再做堆疊／輪播轉換，也不限制圖片比例。
function openItemDetail(card, title) {
  ensureCatalogSheet();
  var categoryEl = card.closest('.travel-collapse');
  var categoryTitleEl = categoryEl && categoryEl.querySelector('.travel-collapse-title');
  var categoryLabel = categoryTitleEl ? categoryTitleEl.textContent.trim() : '';

  document.getElementById('catalogSheetTitle').innerHTML =
    (categoryLabel ? '<div class="spot-hero-label">' + categoryLabel + '</div>' : '') +
    '<div class="spot-hero-title">' + title + '</div>';

  // 保留 .item-detail 外層容器（而非直接展開內容），這樣裡面的文字／圖片是
  // .item-detail 的子層、不是 .catalog-sheet-body 的直接子層，
  // 才不會被舊規則「.catalog-sheet-body > * { margin:0 !important }」蓋掉間距。
  var detailSrc = card.querySelector(':scope > .item-detail');
  var body = document.getElementById('catalogSheetBody');
  body.innerHTML = '<div class="item-detail">' + (detailSrc ? detailSrc.innerHTML : '') + '</div>';

  document.getElementById('catalogSheet').classList.add('open');
  document.getElementById('catalogSheetBackdrop').classList.add('open');
  document.getElementById('catalogSheetBody').scrollTop = 0;
  document.body.style.overflow = 'hidden';
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

// v23 新增：正方形圖文框詳情頁的多圖呈現——由上而下直接排列（3:5 直式），不是左右滑動。
// 跟 buildPhotoCarouselHtml()（景點詳情、橫式圖文框共用的輪播元件）是兩套不同元件，各自服務不同版型。
function buildStackedPhotosHtml(images, fallbackIconHtml) {
  if (!images || images.length === 0) {
    return '<div class="catalog-stacked-fallback"><span>' + fallbackIconHtml + '</span></div>';
  }
  return '<div class="catalog-stacked-photos">' + images.map(function(src){
    return '<div class="catalog-stacked-photo"><img src="' + src + '" alt="" loading="lazy" decoding="async" onerror="this.closest(\'.catalog-stacked-photo\').remove()"></div>';
  }).join('') + '</div>';
}

function openCatalogDetail(card, title) {
  ensureCatalogSheet();
  var layout = catalogLayoutFor(card);
  var categoryEl = card.closest('.travel-collapse');
  var categoryTitleEl = categoryEl && categoryEl.querySelector('.travel-collapse-title');
  var categoryEmojiEl = categoryEl && categoryEl.querySelector('.travel-collapse-emoji');
  var categoryLabel = categoryTitleEl ? categoryTitleEl.textContent.trim() : '';
  var fallbackIcon = categoryEmojiEl ? categoryEmojiEl.textContent.trim() : '✦';

  var clone = card.cloneNode(true);
  clone.classList.remove('catalog-list-card');
  clone.removeAttribute('role'); clone.removeAttribute('tabindex');
  clone.querySelectorAll('[onclick]').forEach(function(el){
    if (el === clone) return; // 卡片本身若帶 onclick 保留給下方按鈕情境使用；一般清單卡片沒有這個屬性
    el.removeAttribute('onclick');
  });
  // 原本清單卡片自己的封面圖拿掉，改由下面統一的堆疊圖／輪播呈現
  clone.querySelectorAll('.catalog-square-media, .catalog-wide-media').forEach(function(el){ el.remove(); });

  // 固定標題（不捲動）：分類 + 項目名稱，比照景點詳情層的 spot-hero 呈現
  document.getElementById('catalogSheetTitle').innerHTML =
    (categoryLabel ? '<div class="spot-hero-label">' + categoryLabel + '</div>' : '') +
    '<div class="spot-hero-title">' + title + '</div>';

  // 可捲動內容：正方形圖文框＝直式堆疊圖；橫式圖文框＝左右滑動輪播；接著是原有介紹文字
  var body = document.getElementById('catalogSheetBody');
  var images = catalogImagesFor(card, title);
  body.innerHTML = layout === 'square'
    ? buildStackedPhotosHtml(images, fallbackIcon)
    : buildPhotoCarouselHtml(images, fallbackIcon, title, 'plain');
  body.appendChild(clone);

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
