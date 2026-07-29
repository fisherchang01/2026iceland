// 「体验」页完整正式版：六个分类全部套用已确认的北欧旅行手札视觉。
// 保留分类标签，内容依旅途中实际查找顺序重新编排。
const TRAVEL_HTML = `
<style id="travel-editorial-style">
  :is(#page-travel,#page-other) {
    --paper: #fbf8f1;
    --paper-deep: #eee7da;
    --paper-line: #d8cdbd;
    --forest: #3f6542;
    --forest-deep: #294a31;
    --ink: #27312d;
    --muted-ink: #68736d;
    background:
      radial-gradient(circle at 18% 8%, rgba(255,255,255,.84) 0 18%, transparent 42%),
      radial-gradient(circle at 86% 22%, rgba(218,204,181,.26) 0 9%, transparent 33%),
      linear-gradient(180deg, #f7f2e9 0%, #eee7db 100%);
  }
  :is(#page-travel,#page-other) > .page-inner { padding-top: 0; }

  :is(#page-travel,#page-other) .catalog-top {
    top: 0;
    margin: 0 calc(var(--sp-6) * -1) var(--sp-5);
    padding: 10px 14px 0;
    gap: 0;
    align-items: flex-end;
    background: rgba(247,242,233,.94);
    border-bottom: 1px solid var(--paper-line);
    box-shadow: 0 5px 14px rgba(78,63,44,.08);
    backdrop-filter: blur(14px);
  }
  :is(#page-travel,#page-other) .catalog-pill-scroll { gap: 0; padding: 0; }
  :is(#page-travel,#page-other) .catalog-pill {
    min-height: 48px;
    padding: 10px 15px 11px;
    border: 1px solid #d7ccbc;
    border-bottom-color: #cfc2af;
    border-radius: 17px 17px 5px 5px;
    background: linear-gradient(180deg, #f4eee4, #e8dece);
    color: #4b504c;
    font-family: var(--font-display);
    font-size: var(--fs-sm);
    font-weight: 600;
    box-shadow: inset 0 1px rgba(255,255,255,.8), 0 -2px 8px rgba(80,64,44,.05);
  }
  :is(#page-travel,#page-other) .catalog-pill + .catalog-pill { margin-left: -1px; }
  :is(#page-travel,#page-other) .catalog-pill.active {
    position: relative;
    z-index: 2;
    background: var(--paper);
    color: var(--forest);
    border-color: #d3c7b7;
    box-shadow: 0 -4px 12px rgba(75,62,43,.08);
  }
  :is(#page-travel,#page-other) .catalog-pill.active::before {
    content: '';
    position: absolute;
    left: 50%;
    bottom: 4px;
    width: 32px;
    height: 4px;
    transform: translateX(-50%);
    border-radius: 99px;
    background: var(--forest);
  }
  :is(#page-travel,#page-other) .catalog-pill-overview::after { display: none; }

  :is(#page-travel,#page-other).catalog-show-overview .catalog-overview-heading { display: none; }
  :is(#page-travel,#page-other) .catalog-overview { margin-bottom: 10px; }
  :is(#page-travel,#page-other) .catalog-overview-grid {
    grid-template-columns: repeat(2, minmax(0,1fr));
    gap: 12px;
  }
  :is(#page-travel,#page-other) .catalog-overview-card {
    min-height: 136px;
    padding: 17px;
    flex-direction: column;
    align-items: flex-start;
    justify-content: space-between;
    border: 1px solid #d9cfbf;
    border-radius: 20px;
    background: linear-gradient(145deg, rgba(255,255,255,.95), rgba(247,241,231,.94));
    box-shadow: 0 7px 17px rgba(83,68,47,.09), inset 0 1px rgba(255,255,255,.9);
  }
  /* v23：总览卡片尺寸系统——2x4 整行滿版大卡（帶封面照片）／2x2 半行方卡／1x4 整行長條卡，
     由 catalog-config.js 的 sizes 陣列決定每個分類套用哪一種，跟排列順序無關。 */
  :is(#page-travel,#page-other) .catalog-overview-card.ov-2x4 {
    grid-column: 1 / -1;
    padding: 0;
    overflow: hidden;
    background:
      radial-gradient(circle at 88% 25%, rgba(110,139,101,.22) 0 16%, transparent 38%),
      linear-gradient(135deg, #fdfaf3, #e8eee1);
    border-color: #c6d1bd;
  }
  :is(#page-travel,#page-other) .catalog-overview-media {
    width: 100%;
    overflow: hidden;
    background: linear-gradient(145deg, #dfe8da, #f4eadc);
  }
  :is(#page-travel,#page-other) .catalog-overview-card.ov-2x4 .catalog-overview-media {
    aspect-ratio: 2.2 / 1;
  }
  :is(#page-travel,#page-other) .catalog-overview-card.ov-2x2 {
    padding: 0;
    overflow: hidden;
  }
  :is(#page-travel,#page-other) .catalog-overview-card.ov-2x2 .catalog-overview-media {
    width: 100%;
    aspect-ratio: 1 / 1;
  }
  :is(#page-travel,#page-other) .catalog-overview-card.ov-2x2 .catalog-overview-copy {
    padding: 11px 13px 2px;
  }
  :is(#page-travel,#page-other) .catalog-overview-card.ov-2x2 .catalog-overview-arrow {
    margin: 0 13px 11px 0;
  }
  :is(#page-travel,#page-other) .catalog-overview-media img { width: 100%; height: 100%; object-fit: cover; display: block; }
  :is(#page-travel,#page-other) .catalog-overview-media.image-error {
    display: flex; align-items: center; justify-content: center;
    color: var(--forest-deep);
  }
  :is(#page-travel,#page-other) .catalog-overview-card.ov-2x4 .catalog-overview-media.image-error { font-size: 2.4rem; }
  :is(#page-travel,#page-other) .catalog-overview-card.ov-2x2 .catalog-overview-media.image-error { font-size: 2.2rem; }
  :is(#page-travel,#page-other) .catalog-overview-card.ov-2x4 .catalog-overview-copy { padding: 14px 18px 18px; }
  :is(#page-travel,#page-other) .catalog-overview-card.ov-1x4 {
    grid-column: 1 / -1;
    min-height: 92px;
    flex-direction: row;
    align-items: center;
  }
  :is(#page-travel,#page-other) .catalog-overview-icon {
    width: 46px;
    height: 46px;
    border: 1px solid #d9d1c4;
    border-radius: 15px;
    background: rgba(255,255,255,.72);
    box-shadow: 0 4px 10px rgba(71,60,45,.08);
  }
  :is(#page-travel,#page-other) .catalog-overview-card.ov-2x4 .catalog-overview-copy strong {
    font-size: var(--fs-xl);
  }
  :is(#page-travel,#page-other) .catalog-overview-copy strong {
    font-family: var(--font-display);
    font-size: var(--fs-base);
    line-height: 1.35;
    color: var(--ink);
  }
  :is(#page-travel,#page-other) .catalog-overview-copy small {
    margin-top: 5px;
    white-space: normal;
    line-height: 1.45;
    color: var(--muted-ink);
  }
  :is(#page-travel,#page-other) .catalog-overview-arrow {
    align-self: flex-end;
    color: var(--forest);
  }
  :is(#page-travel,#page-other) .catalog-overview-card.ov-1x4 .catalog-overview-arrow { align-self: center; }

  :is(#page-travel,#page-other) .catalog-category-intro {
    min-height: 112px;
    align-items: center;
    gap: 14px;
    padding: 18px 18px 18px 54px;
    margin: 4px 0 16px;
    border: 1px solid #ddd2c2;
    border-radius: 18px;
    background:
      radial-gradient(circle at 92% 18%, rgba(96,126,91,.08) 0 16%, transparent 34%),
      var(--paper);
    box-shadow: 0 7px 16px rgba(82,67,46,.08), inset 0 1px rgba(255,255,255,.9);
  }
  :is(#page-travel,#page-other) .catalog-category-intro::before {
    left: 16px;
    top: 16px;
    bottom: 16px;
    width: 16px;
    background-image: radial-gradient(circle, #d3c7b6 0 3px, rgba(255,255,255,.9) 3.2px 5px, transparent 5.2px);
    background-size: 16px 24px;
  }
  :is(#page-travel,#page-other) .catalog-category-intro-icon {
    width: 48px;
    height: 48px;
    border: 1px solid #d8cfbf;
    border-radius: 15px;
    background: linear-gradient(145deg, #fff, #e8eee2);
  }
  :is(#page-travel,#page-other) .catalog-category-intro-copy strong {
    font-size: var(--fs-xl);
    line-height: 1.3;
    color: var(--ink);
  }
  :is(#page-travel,#page-other) .catalog-category-intro-copy small {
    margin-top: 5px;
    line-height: 1.5;
  }

  /* 模組一・正方形圖文框（catalog-square）：上方 4:3 封面圖 + 標題 + 最多三行文字介紹 */
  :is(#page-travel,#page-other) .catalog-list-card.catalog-layout-square {
    overflow: hidden;
    border: 1px solid #d6ccbc;
    border-radius: 22px;
    background: var(--paper);
    box-shadow: 0 10px 22px rgba(74,62,45,.12);
  }
  :is(#page-travel,#page-other) .catalog-square-media {
    width: 100%;
    aspect-ratio: 4 / 3;
    overflow: hidden;
    background: linear-gradient(145deg, #dfe8da, #f4eadc);
  }
  :is(#page-travel,#page-other) .catalog-square-media img { width: 100%; height: 100%; object-fit: cover; display: block; }
  :is(#page-travel,#page-other) .catalog-square-media.image-error {
    display: flex; align-items: center; justify-content: center;
    font-size: 2.6rem; color: var(--forest-deep);
  }
  :is(#page-travel,#page-other) .catalog-square-info { padding: 19px 20px 17px; }
  :is(#page-travel,#page-other) .catalog-square-info h4 {
    margin-bottom: 7px;
    font-family: var(--font-display);
    font-size: var(--fs-xl);
    line-height: 1.35;
    color: var(--ink);
  }
  :is(#page-travel,#page-other) .souvenir-shop { color: var(--forest); }
  :is(#page-travel,#page-other) .souvenir-desc { margin-top: 4px; font-size: var(--fs-sm); line-height: 1.6; color: var(--muted-ink); }
  :is(#page-travel,#page-other) .souvenir-tip {
    margin-top: 10px;
    padding: 8px 12px;
    border-radius: 12px;
    background: #edf1e7;
    color: #4d634a;
    font-size: var(--fs-xs);
    line-height: 1.5;
  }

  /* 模組二・橫式圖文框（catalog-wide）：左側 1:1 縮圖 + 右側文字 + 右緣箭頭 */
  :is(#page-travel,#page-other) .catalog-list-card.catalog-layout-wide {
    display: flex;
    align-items: flex-start;
    gap: var(--sp-4);
    min-height: 108px;
    padding: var(--sp-4) 30px var(--sp-4) var(--sp-4);
    border-color: #d9cebe !important;
    border-radius: 19px !important;
    background: var(--paper) !important;
    box-shadow: 0 7px 16px rgba(79,65,46,.09);
  }
  :is(#page-travel,#page-other) .catalog-wide-media {
    width: 72px;
    height: 72px;
    flex-shrink: 0;
    border-radius: var(--radius-sm);
    overflow: hidden;
    background: linear-gradient(145deg, #e4eadf, #f5efe4);
  }
  :is(#page-travel,#page-other) .catalog-wide-media img { width: 100%; height: 100%; object-fit: cover; display: block; }
  :is(#page-travel,#page-other) .catalog-wide-media.image-error {
    display: flex; align-items: center; justify-content: center;
    font-size: var(--fs-2xl); color: var(--forest-deep);
  }
  :is(#page-travel,#page-other) .catalog-wide-info { flex: 1; min-width: 0; }
  :is(#page-travel,#page-other) .catalog-wide-info h4 {
    font-family: var(--font-display);
    font-size: var(--fs-sm);
    font-weight: 700;
    color: var(--ink);
    margin-bottom: var(--sp-1);
  }
  :is(#page-travel,#page-other) .catalog-wide-info p {
    font-size: var(--fs-xs);
    line-height: 1.5;
    color: var(--muted-ink);
  }

  /* 比較清單（原本磚卡型比較資訊，改成純文字框裡的條列清單，不放圖片） */
  :is(#page-travel,#page-other) .catalog-compare-list {
    list-style: none;
    display: grid;
    gap: 10px;
    margin-top: 10px;
  }
  :is(#page-travel,#page-other) .catalog-compare-item {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    padding: 12px 14px;
    border: 1px solid #ddd2c2;
    border-radius: 14px;
    background: rgba(255,255,255,.55);
  }
  :is(#page-travel,#page-other) .catalog-compare-icon {
    flex-shrink: 0;
    width: 34px;
    height: 34px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 10px;
    background: #edf2e9;
    font-size: var(--fs-base);
    font-weight: 700;
    color: var(--forest);
  }
  :is(#page-travel,#page-other) .catalog-compare-copy { flex: 1; min-width: 0; }
  :is(#page-travel,#page-other) .catalog-compare-copy strong {
    font-family: var(--font-display);
    font-size: var(--fs-base);
    color: var(--ink);
  }
  :is(#page-travel,#page-other) .catalog-compare-tag {
    display: inline-block;
    margin: 3px 0 5px;
    padding: 2px 8px;
    border-radius: 999px;
    background: #e7eee1;
    color: var(--forest);
    font-size: var(--fs-2xs);
    font-weight: 700;
  }
  :is(#page-travel,#page-other) .catalog-compare-copy p {
    margin: 0;
    font-size: var(--fs-xs);
    line-height: 1.5;
    color: var(--muted-ink);
  }

  :is(#page-travel,#page-other) .info-card,
  :is(#page-travel,#page-other) .alcohol-warn {
    position: relative;
    overflow: hidden;
    padding: 20px 20px 20px 54px;
    border: 1px solid #dacfbf;
    border-radius: 19px;
    background: linear-gradient(180deg, rgba(255,255,255,.55), transparent 30%), var(--paper);
    box-shadow: 0 7px 17px rgba(81,66,47,.09);
  }
  :is(#page-travel,#page-other) .info-card::before,
  :is(#page-travel,#page-other) .alcohol-warn::before {
    content: '';
    position: absolute;
    left: 14px;
    top: 14px;
    bottom: 14px;
    width: 16px;
    background-image: radial-gradient(circle, #d2c6b4 0 3px, #fff 3.2px 5px, transparent 5.2px);
    background-size: 16px 24px;
  }
  :is(#page-travel,#page-other) .editorial-note h4 {
    margin-bottom: 10px;
    font-family: var(--font-display);
    font-size: var(--fs-xl);
    line-height: 1.35;
    color: var(--ink);
  }
  :is(#page-travel,#page-other) .editorial-note p {
    font-size: var(--fs-sm);
    line-height: 1.7;
    color: var(--muted-ink);
  }
  :is(#page-travel,#page-other) .editorial-steps {
    list-style: none;
    counter-reset: editorial-step;
    display: grid;
    gap: 10px;
    margin-top: 12px;
  }
  :is(#page-travel,#page-other) .editorial-steps li {
    counter-increment: editorial-step;
    position: relative;
    padding-left: 34px;
    font-size: var(--fs-sm);
    line-height: 1.55;
    color: var(--ink);
  }
  :is(#page-travel,#page-other) .editorial-steps li::before {
    content: counter(editorial-step);
    position: absolute;
    left: 0;
    top: 0;
    width: 23px;
    height: 23px;
    display: grid;
    place-items: center;
    border: 1px solid #91a087;
    border-radius: 50%;
    color: var(--forest);
    font-size: var(--fs-xs);
    font-weight: 800;
    background: #f7faf4;
  }
  :is(#page-travel,#page-other) .editorial-chips {
    display: flex;
    flex-wrap: wrap;
    gap: 7px;
    margin-top: 12px;
  }
  :is(#page-travel,#page-other) .editorial-chips span {
    padding: 6px 10px;
    border: 1px solid #cbd5c4;
    border-radius: 999px;
    background: #edf2e9;
    color: var(--forest);
    font-size: var(--fs-xs);
    font-weight: 700;
  }
  @media (max-width: 420px) {
    :is(#page-travel,#page-other) .catalog-overview-card {
      min-height: 126px;
      padding: 15px;
    }
    :is(#page-travel,#page-other) .catalog-wide-media {
      width: 64px;
      height: 64px;
    }
  }
</style>


<div class="page" id="page-travel">
  <div class="page-inner">

    <!-- 1. 超市食物 -->
    <div class="travel-collapse" data-cover="supermarket_food.webp">
      <div class="travel-collapse-header" onclick="toggleTravelCollapse(this)">
        <div class="travel-collapse-left">
          <div class="travel-collapse-emoji">🧀</div>
          <div>
            <div class="travel-collapse-title">超市食物</div>
            <div class="travel-collapse-sub">超市值得购买的冰岛国民食物有Skyr优格、鱼子酱牙膏，也可品尝冰川水、可口可乐及当地啤酒。</div>
          </div>
        </div>
        <div class="travel-collapse-arrow">›</div>
      </div>
      <div class="travel-collapse-body">
        <!-- 項目內容之後補充：第二層 item-card（圖＋標題），詳情放在 .item-detail -->
      </div>
    </div>

    <!-- 2. 超市购物 -->
    <div class="travel-collapse" data-cover="supermarket_shopping.webp">
      <div class="travel-collapse-header" onclick="toggleTravelCollapse(this)">
        <div class="travel-collapse-left">
          <div class="travel-collapse-emoji">🛒</div>
          <div>
            <div class="travel-collapse-title">超市购物</div>
            <div class="travel-collapse-sub">介绍在冰岛超市上，适合采买的生活用品或食品，带回家分送亲友或同事。</div>
          </div>
        </div>
        <div class="travel-collapse-arrow">›</div>
      </div>
      <div class="travel-collapse-body">
        <!-- 項目內容之後補充：第二層 item-card（圖＋標題），詳情放在 .item-detail -->
      </div>
    </div>

    <!-- 3. 商店购物 -->
    <div class="travel-collapse" data-cover="store_shopping.webp">
      <div class="travel-collapse-header" onclick="toggleTravelCollapse(this)">
        <div class="travel-collapse-left">
          <div class="travel-collapse-emoji">🛍️</div>
          <div>
            <div class="travel-collapse-title">商店购物</div>
            <div class="travel-collapse-sub">整理冰岛特色商店、纪念品店及户外用品店，方便选购伴手礼、服饰与旅游用品。</div>
          </div>
        </div>
        <div class="travel-collapse-arrow">›</div>
      </div>
      <div class="travel-collapse-body">
        <!-- 項目內容之後補充：第二層 item-card（圖＋標題），詳情放在 .item-detail -->
      </div>
    </div>

    <!-- 4. 冰岛超市 -->
    <div class="travel-collapse" data-cover="iceland_supermarket.webp">
      <div class="travel-collapse-header" onclick="toggleTravelCollapse(this)">
        <div class="travel-collapse-left">
          <div class="travel-collapse-emoji">🏪</div>
          <div>
            <div class="travel-collapse-title">冰岛超市</div>
            <div class="travel-collapse-sub">介绍Bónus、Krónan及Nettó等冰岛超市</div>
          </div>
        </div>
        <div class="travel-collapse-arrow">›</div>
      </div>
      <div class="travel-collapse-body">
        <!-- 項目內容之後補充：第二層 item-card（圖＋標題），詳情放在 .item-detail -->
      </div>
    </div>

    <!-- 5. 芬兰购物 -->
    <div class="travel-collapse" data-cover="finland_shopping.webp">
      <div class="travel-collapse-header" onclick="toggleTravelCollapse(this)">
        <div class="travel-collapse-left">
          <div class="travel-collapse-emoji">🇫🇮</div>
          <div>
            <div class="travel-collapse-title">芬兰购物</div>
            <div class="travel-collapse-sub">芬兰可购买Marimekko、Iittala及Fazer等品牌商品，适合自用或作为北欧伴手礼。</div>
          </div>
        </div>
        <div class="travel-collapse-arrow">›</div>
      </div>
      <div class="travel-collapse-body">
        <!-- 項目內容之後補充：第二層 item-card（圖＋標題），詳情放在 .item-detail -->
      </div>
    </div>

    <!-- 6. 雷市美食 -->
    <div class="travel-collapse" data-cover="reykjavik_food.webp">
      <div class="travel-collapse-header" onclick="toggleTravelCollapse(this)">
        <div class="travel-collapse-left">
          <div class="travel-collapse-emoji">🍜</div>
          <div>
            <div class="travel-collapse-title">雷市美食</div>
            <div class="travel-collapse-sub">整理雷克雅维克热门餐厅与小吃，包括羊肉汤、热狗、海鲜料理及特色咖啡店。</div>
          </div>
        </div>
        <div class="travel-collapse-arrow">›</div>
      </div>
      <div class="travel-collapse-body">
        <!-- 項目內容之後補充：第二層 item-card（圖＋標題），詳情放在 .item-detail -->
      </div>
    </div>

    <!-- 7. 冰岛美食 -->
    <div class="travel-collapse" data-cover="iceland_food.webp">
      <div class="travel-collapse-header" onclick="toggleTravelCollapse(this)">
        <div class="travel-collapse-left">
          <div class="travel-collapse-emoji">🍲</div>
          <div>
            <div class="travel-collapse-title">冰岛美食</div>
            <div class="travel-collapse-sub">冰岛特色美食包含羊肉汤、龙虾汤、发酵鲨鱼、黑麦面包及各式新鲜海鲜。</div>
          </div>
        </div>
        <div class="travel-collapse-arrow">›</div>
      </div>
      <div class="travel-collapse-body">
        <!-- 項目內容之後補充：第二層 item-card（圖＋標題），詳情放在 .item-detail -->
      </div>
    </div>

    <!-- 8. 芬兰美食 -->
    <div class="travel-collapse" data-cover="finland_food.webp">
      <div class="travel-collapse-header" onclick="toggleTravelCollapse(this)">
        <div class="travel-collapse-left">
          <div class="travel-collapse-emoji">🥐</div>
          <div>
            <div class="travel-collapse-title">芬兰美食</div>
            <div class="travel-collapse-sub">芬兰必吃美食包括鲑鱼汤、肉桂卷、驯鹿肉、卡累利阿派及Fazer巧克力。</div>
          </div>
        </div>
        <div class="travel-collapse-arrow">›</div>
      </div>
      <div class="travel-collapse-body">
        <!-- 項目內容之後補充：第二層 item-card（圖＋標題），詳情放在 .item-detail -->
      </div>
    </div>

    <!-- 9. 世界遗产 -->
    <div class="travel-collapse" data-cover="world_heritage.webp">
      <div class="travel-collapse-header" onclick="toggleTravelCollapse(this)">
        <div class="travel-collapse-left">
          <div class="travel-collapse-emoji">🏛️</div>
          <div>
            <div class="travel-collapse-title">世界遗产</div>
            <div class="travel-collapse-sub">介绍此次前往的冰岛与芬兰的世界遗产景点。</div>
          </div>
        </div>
        <div class="travel-collapse-arrow">›</div>
      </div>
      <div class="travel-collapse-body">
        <!-- 項目內容之後補充：第二層 item-card（圖＋標題），詳情放在 .item-detail -->
      </div>
    </div>

    <!-- 10. 花儿少年 -->
    <div class="travel-collapse" data-cover="flowers_youth.webp">
      <div class="travel-collapse-header" onclick="toggleTravelCollapse(this)">
        <div class="travel-collapse-left">
          <div class="travel-collapse-emoji">🌼</div>
          <div>
            <div class="travel-collapse-title">花儿少年</div>
            <div class="travel-collapse-sub">整理《花儿与少年》冰岛同款景点、美食及节目中的特色旅行体验。</div>
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
