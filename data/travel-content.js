// 「體驗」頁完整正式版：六個分類全部套用已確認的北歐旅行手札視覺。
// 保留分類標籤，內容依旅途中實際查找順序重新編排。
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

  :is(#page-travel,#page-other) .travel-banner.editorial-hero {
    --editorial-hero-image: url('images/banners/cover-hero.webp');
    position: relative;
    min-height: 330px;
    display: block !important;
    overflow: hidden;
    padding: 0;
    margin: 0 0 16px;
    border: 1px solid rgba(255,255,255,.62);
    border-radius: 24px;
    color: #fff;
    background-image:
      linear-gradient(180deg, rgba(18,26,27,.14) 0%, rgba(18,25,25,.23) 42%, rgba(16,23,22,.82) 100%),
      var(--editorial-hero-image);
    background-size: cover;
    background-position: center;
    box-shadow: 0 13px 28px rgba(49,42,31,.18), inset 0 0 0 1px rgba(255,255,255,.16);
  }
  .editorial-hero-copy {
    position: absolute;
    left: 24px;
    right: 24px;
    bottom: 78px;
    z-index: 2;
  }
  .editorial-kicker {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    margin-bottom: 10px;
    font-size: var(--fs-2xs);
    font-weight: 700;
    letter-spacing: .13em;
    text-transform: uppercase;
    color: rgba(255,255,255,.82);
  }
  .editorial-kicker::before {
    content: '';
    width: 24px;
    height: 1px;
    background: rgba(255,255,255,.72);
  }
  .editorial-hero h2 {
    max-width: 540px;
    font-family: var(--font-display);
    font-size: clamp(2rem, 8vw, 3rem);
    line-height: 1.12;
    font-weight: 700;
    text-shadow: 0 3px 14px rgba(0,0,0,.38);
  }
  .editorial-hero p {
    max-width: 520px;
    margin-top: 10px;
    font-size: var(--fs-sm);
    line-height: 1.7;
    color: rgba(255,255,255,.9);
  }
  .editorial-hero-actions,
  .editorial-action-row {
    display: grid;
    grid-template-columns: repeat(3, minmax(0,1fr));
    align-items: stretch;
  }
  .editorial-hero-actions {
    position: absolute;
    left: 12px;
    right: 12px;
    bottom: 12px;
    z-index: 3;
    min-height: 54px;
    border: 1px solid rgba(255,255,255,.34);
    border-radius: 16px;
    overflow: hidden;
    background: rgba(15,23,22,.68);
    box-shadow: 0 5px 18px rgba(0,0,0,.24);
    backdrop-filter: blur(12px);
  }
  .editorial-hero-actions button {
    border: 0;
    border-right: 1px solid rgba(255,255,255,.24);
    background: transparent;
    color: #fff;
    font-size: var(--fs-xs);
    font-weight: 600;
    cursor: pointer;
  }
  .editorial-hero-actions button:last-child { border-right: 0; }
  .editorial-hero-actions button span {
    display: block;
    font-size: var(--fs-md);
    margin-bottom: 2px;
  }

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
  :is(#page-travel,#page-other) .catalog-overview-card:first-child {
    grid-column: 1 / -1;
    min-height: 174px;
    padding: 22px;
    background:
      radial-gradient(circle at 88% 25%, rgba(110,139,101,.22) 0 16%, transparent 38%),
      linear-gradient(135deg, #fdfaf3, #e8eee1);
    border-color: #c6d1bd;
  }
  :is(#page-travel,#page-other) .catalog-overview-card:nth-child(4) {
    grid-column: 1 / -1;
    min-height: 100px;
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
  :is(#page-travel,#page-other) .catalog-overview-card:first-child .catalog-overview-icon {
    width: 58px;
    height: 58px;
    margin-bottom: 13px;
  }
  :is(#page-travel,#page-other) .catalog-overview-copy strong {
    font-family: var(--font-display);
    font-size: var(--fs-base);
    line-height: 1.35;
    color: var(--ink);
  }
  :is(#page-travel,#page-other) .catalog-overview-card:first-child .catalog-overview-copy strong {
    font-size: var(--fs-xl);
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

  :is(#page-travel,#page-other) .catalog-list-card.catalog-layout-hero {
    overflow: hidden;
    border: 1px solid #d6ccbc;
    border-radius: 22px;
    background: var(--paper);
    box-shadow: 0 10px 22px rgba(74,62,45,.12);
  }
  :is(#page-travel,#page-other) .editorial-feature-card .souvenir-img-wrap { height: 224px; }
  :is(#page-travel,#page-other) .editorial-feature-card .souvenir-info { padding: 19px 20px 17px; }
  :is(#page-travel,#page-other) .catalog-list-card.catalog-layout-hero .souvenir-info h4 {
    margin-bottom: 7px;
    font-size: var(--fs-xl);
    line-height: 1.35;
    color: var(--ink);
  }
  :is(#page-travel,#page-other) .souvenir-shop { color: var(--forest); }
  :is(#page-travel,#page-other) .souvenir-tip {
    margin-top: 10px;
    background: #edf1e7;
    color: #4d634a;
  }
  .editorial-action-row {
    min-height: 54px;
    margin: 0 12px 12px;
    border: 1px solid #d7cdbd;
    border-radius: 15px;
    overflow: hidden;
    background: rgba(255,253,248,.92);
    box-shadow: 0 5px 12px rgba(69,57,42,.07);
  }
  .editorial-action-row span {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    padding: 8px 6px;
    border-right: 1px solid #ddd3c5;
    font-size: var(--fs-xs);
    font-weight: 700;
    color: var(--forest);
    text-align: center;
  }
  .editorial-action-row span:last-child { border-right: 0; }

  :is(#page-travel,#page-other) .catalog-list-card.catalog-layout-split {
    min-height: 122px;
    border-color: #d9cebe !important;
    border-radius: 19px !important;
    background: var(--paper) !important;
    box-shadow: 0 7px 16px rgba(79,65,46,.09);
  }
  :is(#page-travel,#page-other) .catalog-list-card.catalog-layout-split .souvenir-img-wrap,
  :is(#page-travel,#page-other) .catalog-list-card.catalog-layout-split .souvenir-img-wrap.small,
  :is(#page-travel,#page-other) .catalog-list-card.catalog-layout-split .catalog-card-media {
    width: 108px !important;
    flex-basis: 108px !important;
    min-height: 122px;
    background: linear-gradient(145deg, #e4eadf, #f5efe4);
  }
  :is(#page-travel,#page-other) .catalog-list-card.catalog-layout-split h4 {
    font-family: var(--font-display);
    color: var(--ink);
  }

  :is(#page-travel,#page-other) .market-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0,1fr));
    gap: 11px;
    margin-bottom: 14px;
  }
  :is(#page-travel,#page-other) .market-card {
    min-height: 154px;
    padding: 18px 14px;
    border: 1px solid #d9cebe;
    border-radius: 18px;
    background: linear-gradient(145deg, #fffdf7, #eee9df);
    box-shadow: 0 6px 14px rgba(77,64,47,.08);
  }
  :is(#page-travel,#page-other) .market-card h4 {
    margin-top: 8px;
    font-family: var(--font-display);
    font-size: var(--fs-base);
    color: var(--ink);
  }
  :is(#page-travel,#page-other) .market-tag {
    background: #e7eee1;
    color: var(--forest);
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
  .editorial-note h4 {
    margin-bottom: 10px;
    font-family: var(--font-display);
    font-size: var(--fs-xl);
    line-height: 1.35;
    color: var(--ink);
  }
  .editorial-note p {
    font-size: var(--fs-sm);
    line-height: 1.7;
    color: var(--muted-ink);
  }
  .editorial-steps {
    list-style: none;
    counter-reset: editorial-step;
    display: grid;
    gap: 10px;
    margin-top: 12px;
  }
  .editorial-steps li {
    counter-increment: editorial-step;
    position: relative;
    padding-left: 34px;
    font-size: var(--fs-sm);
    line-height: 1.55;
    color: var(--ink);
  }
  .editorial-steps li::before {
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
  .editorial-chips {
    display: flex;
    flex-wrap: wrap;
    gap: 7px;
    margin-top: 12px;
  }
  .editorial-chips span {
    padding: 6px 10px;
    border: 1px solid #cbd5c4;
    border-radius: 999px;
    background: #edf2e9;
    color: var(--forest);
    font-size: var(--fs-xs);
    font-weight: 700;
  }
  .editorial-illustration {
    background:
      radial-gradient(circle at 30% 28%, rgba(255,255,255,.9), transparent 30%),
      linear-gradient(145deg, #dfe8da, #f4eadc) !important;
  }
  .editorial-illustration .img-fallback {
    color: var(--forest-deep);
    text-shadow: 0 3px 12px rgba(49,75,46,.15);
  }
  .catalog-sheet-body .editorial-action-row { display: none !important; }

  @media (max-width: 420px) {
    :is(#page-travel,#page-other) .travel-banner.editorial-hero {
      min-height: 305px;
      border-radius: 20px;
    }
    .editorial-hero-copy {
      left: 20px;
      right: 20px;
      bottom: 75px;
    }
    .editorial-hero h2 { font-size: 2rem; }
    :is(#page-travel,#page-other) .catalog-overview-card {
      min-height: 126px;
      padding: 15px;
    }
    :is(#page-travel,#page-other) .catalog-list-card.catalog-layout-split .souvenir-img-wrap,
    :is(#page-travel,#page-other) .catalog-list-card.catalog-layout-split .souvenir-img-wrap.small,
    :is(#page-travel,#page-other) .catalog-list-card.catalog-layout-split .catalog-card-media {
      width: 98px !important;
      flex-basis: 98px !important;
    }
  }
</style>

<div class="page" id="page-travel">
  <div class="page-inner">
    <section class="travel-banner editorial-hero">
      <div class="editorial-hero-copy">
        <div class="editorial-kicker">Iceland &amp; Finland · Editorial Guide</div>
        <h2>旅行中的好物与体验</h2>
        <p>以路线、购买时机与实际使用场景组织资讯，让旅途中可以快速找到真正需要的内容。</p>
      </div>
      <div class="editorial-hero-actions">
        <button type="button" onclick="selectCatalogCategory('travel',0)"><span>⌁</span>购物路线</button>
        <button type="button" onclick="selectCatalogCategory('travel',2)"><span>⌂</span>超市补给</button>
        <button type="button" onclick="selectCatalogCategory('travel',5)"><span>♨</span>在地体验</button>
      </div>
    </section>

    <!-- 1. 冰岛伴手礼 — 一般商店：正式内容 -->
    <div class="travel-collapse">
      <div class="travel-collapse-header" onclick="toggleTravelCollapse(this)">
        <div class="travel-collapse-left">
          <div class="travel-collapse-emoji">🏪</div>
          <div>
            <div class="travel-collapse-title">冰岛伴手礼 — 一般商店</div>
            <div class="travel-collapse-sub">彩虹街 · Grandi港区 · 主街购物路线</div>
          </div>
        </div>
        <div class="travel-collapse-arrow">▼</div>
      </div>
      <div class="travel-collapse-body">

        <div class="souvenir-card editorial-feature-card" data-images="omnom.jpg">
          <div class="souvenir-img-wrap">
            <img src="images/banners/cover-hero.webp" alt="雷市伴手礼购物路线" loading="lazy" decoding="async">
          </div>
          <div class="souvenir-info">
            <h4>雷市伴手礼漫游｜先选路线，再找商品</h4>
            <div class="souvenir-shop">📍 Hallgrímskirkja · 彩虹街 · Laugavegur · Grandi · Harpa</div>
            <div class="souvenir-desc">本页先安排两条雷市购物路线，再依商品类型整理可购买地点。旅途中可先决定从大教堂或音乐厅出发，再查看沿途适合购买的伴手礼。</div>
            <div class="souvenir-tip">路线 A 全程下坡较轻松；路线 B 从海滨上坡，最后以大教堂登塔作为压轴。</div>
          </div>
          <div class="editorial-action-row">
            <span>⌁ 先看路线</span>
            <span>⌖ 找购买点</span>
            <span>☆ 建立清单</span>
          </div>
        </div>

        <div class="info-card editorial-note">
          <h4>雷市漫游路线 A（大教堂→音乐厅）</h4>
          <p>全程下坡，轻松省力。大教堂出发 → 彩虹街（Handknitting、Geysir）→ 主街（Omnom、66°North、Puffin、Saltverk）→ Grandi旧港区（Omnom工厂店、Farmers Market、蓝湖保养品）→ Harpa</p>
          <ol class="editorial-steps">
            <li>Hallgrímskirkja 大教堂（起点）</li>
            <li>Skólavörðustígur 彩虹街 — Handknitting、Geysir</li>
            <li>Laugavegur 主街 — Omnom、66°North、Puffin、Saltverk</li>
            <li>Grandi 旧港区 — Omnom工厂店、Farmers Market、蓝湖保养品</li>
            <li>Harpa 音乐厅（终点）</li>
          </ol>
        </div>

        <div class="info-card editorial-note">
          <h4>雷市漫游路线 B（音乐厅→大教堂）</h4>
          <p>从海滨出发，上坡走向市区制高点。最后登塔俯瞰全市作为压轴。</p>
          <ol class="editorial-steps">
            <li>Harpa 音乐厅（起点）</li>
            <li>Grandi 旧港区 — Omnom工厂店、Farmers Market、蓝湖保养品</li>
            <li>Laugavegur 主街 — Omnom、66°North、Puffin、Saltverk</li>
            <li>Skólavörðustígur 彩虹街 — Handknitting、Geysir</li>
            <li>Hallgrímskirkja 大教堂（终点，可登塔）</li>
          </ol>
        </div>

        <div class="souvenir-item">
          <div class="souvenir-img-wrap small editorial-illustration"><div class="img-fallback">🧥</div></div>
          <div class="souvenir-item-info">
            <h4>Lopapeysa 冰岛羊毛毛衣</h4>
            <p>传统圆肩花纹手工毛衣，防水保暖。总店位于 Skólavörðustígur 19（大教堂正对彩虹街），分店在 Laugavegur 53b。每件毛衣挂有编织者亲笔签名，约 23,000–44,000 ISK。</p>
            <span class="souvenir-brand">📍 Handknitting Association of Iceland</span>
          </div>
        </div>
        <div class="tips-box"><p>💡 建议周末顺路逛 Kolaportið 跳蚤市场，二手毛衣约 800–1,300 RMB 可议价</p></div>

        <div class="souvenir-item">
          <div class="souvenir-img-wrap small"><img src="images/catalog/omnom.jpg" alt="Omnom 巧克力" loading="lazy" decoding="async"></div>
          <div class="souvenir-item-info">
            <h4>Omnom 巧克力</h4>
            <p>冰岛精品巧克力品牌，创意口味（海盐、甘草、焦糖）与精美包装，工厂店可试吃。Laugavegur 大街亦有专卖店。</p>
            <span class="souvenir-brand">📍 雷市 Grandi 港口区工厂店</span>
          </div>
        </div>

        <div class="souvenir-item">
          <div class="souvenir-img-wrap small editorial-illustration"><div class="img-fallback">🧤</div></div>
          <div class="souvenir-item-info">
            <h4>冰岛羊毛制品（帽/手套/围巾）</h4>
            <p>比毛衣平价，同样保暖实用。Farmers Market 位于 Grandi 旧港区（Hólmaslóð 2）及 Laugavegur 37；66°North 为户外机能品牌；Geysir 在 Skólavörðustíg 7&amp;16 有时尚设计款。</p>
            <span class="souvenir-brand">📍 66°North / Farmers Market / Geysir</span>
          </div>
        </div>
        <div class="tips-box"><p>💡 帽子手套约 230–560 RMB，Rainbow Street 沿线多间可逛</p></div>

        <div class="souvenir-item">
          <div class="souvenir-img-wrap small"><img src="images/catalog/saltverk.jpg" alt="Saltverk 冰岛海盐" loading="lazy" decoding="async"></div>
          <div class="souvenir-item-info">
            <h4>火山岩／熔岩盐（Saltverk）</h4>
            <p>以火山地热蒸发制成的冰岛海盐，有黑火山盐、烟熏盐等。适合料理爱好者，包装具北欧设计感。</p>
            <span class="souvenir-brand">📍 设计店、纪念品店、机场</span>
          </div>
        </div>

        <div class="souvenir-item">
          <div class="souvenir-img-wrap small editorial-illustration"><div class="img-fallback">🧴</div></div>
          <div class="souvenir-item-info">
            <h4>蓝湖保养品（Blue Lagoon Skincare）</h4>
            <p>硅土面膜、身体乳等，富含地热矿物质。机场价格与市区相近，可最后补买。</p>
            <span class="souvenir-brand">📍 蓝湖温泉店 / 机场免税店</span>
          </div>
        </div>

        <div class="souvenir-item">
          <div class="souvenir-img-wrap small editorial-illustration"><div class="img-fallback">🐦</div></div>
          <div class="souvenir-item-info">
            <h4>Puffin 海鸚周边</h4>
            <p>冰岛国鸟玩偶、磁铁、明信片等，雷市 Laugavegur 大街纪念品店常见，适合送孩童。</p>
            <span class="souvenir-brand">📍 纪念品店普遍有售</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 2. 冰岛伴手礼 — 超市：设计示范 -->
    <div class="travel-collapse">
      <div class="travel-collapse-header" onclick="toggleTravelCollapse(this)">
        <div class="travel-collapse-left">
          <div class="travel-collapse-emoji">🛒</div>
          <div>
            <div class="travel-collapse-title">冰岛伴手礼 — 超市</div>
            <div class="travel-collapse-sub">Bónus · Krónan · Nettó · Hagkaup</div>
          </div>
        </div>
        <div class="travel-collapse-arrow">▼</div>
      </div>
      <div class="travel-collapse-body">
        <div class="souvenir-card editorial-feature-card" data-images="noi-sirius.jpg">
          <div class="souvenir-img-wrap"><img src="images/catalog/noi-sirius.jpg" alt="超市伴手礼包装示范" loading="lazy" decoding="async"></div>
          <div class="souvenir-info">
            <h4>超市伴手礼｜一眼认出包装</h4>
            <div class="souvenir-shop">购物逻辑：品牌识别 → 价格带 → 携带方式</div>
            <div class="souvenir-desc">此分类暂为设计示范，下一阶段再逐项换回正式品牌、包装特征与购买建议。</div>
          </div>
          <div class="editorial-action-row"><span>▤ 品牌清单</span><span>◉ 包装辨识</span><span>＋ 加入采购</span></div>
        </div>
        <div class="souvenir-item">
          <div class="souvenir-img-wrap small"><img src="images/catalog/omnom.jpg" alt="精品巧克力示范" loading="lazy" decoding="async"></div>
          <div class="souvenir-item-info"><h4>精品巧克力</h4><p>适合送礼、包装醒目；以一行说明购买理由。</p><span class="souvenir-brand">礼物型</span></div>
        </div>
        <div class="souvenir-item">
          <div class="souvenir-img-wrap small"><img src="images/catalog/noi-sirius.jpg" alt="分享装示范" loading="lazy" decoding="async"></div>
          <div class="souvenir-item-info"><h4>平价分享装</h4><p>适合办公室分送，重点显示份量、包装与价格层级。</p><span class="souvenir-brand">大量分送</span></div>
        </div>
        <div class="info-card editorial-note">
          <h4>超市选购逻辑</h4>
          <p>正式内容可依「自用、送礼、办公室分送」重新分组。</p>
          <div class="editorial-chips"><span>容易携带</span><span>常温保存</span><span>包装醒目</span><span>价格清楚</span></div>
        </div>
      </div>
    </div>

    <!-- 3. 主要超市：正式内容 -->
    <div class="travel-collapse">
      <div class="travel-collapse-header" onclick="toggleTravelCollapse(this)">
        <div class="travel-collapse-left">
          <div class="travel-collapse-emoji">🏬</div>
          <div>
            <div class="travel-collapse-title">主要超市</div>
            <div class="travel-collapse-sub">雷市及南部沿途超市一览</div>
          </div>
        </div>
        <div class="travel-collapse-arrow">▼</div>
      </div>
      <div class="travel-collapse-body">

        <div class="souvenir-card editorial-feature-card">
          <div class="souvenir-img-wrap editorial-illustration"><div class="img-fallback">🛒</div></div>
          <div class="souvenir-info">
            <h4>冰岛超市补给｜先看任务，再决定去哪一家</h4>
            <div class="souvenir-shop">预算采购 · 生鲜轻食 · 临时补货 · 一次购齐</div>
            <div class="souvenir-desc">超市不只用价格区分。旅途中更实用的方式，是依据今天要买早餐、车上零食、晚餐食材或生活用品，快速选择适合的店型。</div>
            <div class="souvenir-tip">离开雷市前先完成主要补给；进入南部或较偏远路段后，看到合适超市就提早补足。</div>
          </div>
          <div class="editorial-action-row">
            <span>⌂ 选择店型</span>
            <span>▤ 建立清单</span>
            <span>⌁ 安排顺路</span>
          </div>
        </div>

        <div class="market-grid">
          <div class="market-card">
            <span class="market-icon">🐷</span>
            <h4>Bónus</h4>
            <span class="market-tag">预算优先</span>
            <p>适合基本食品、饮料、零食与大量采购。采购目标明确时，最容易快速完成。</p>
          </div>
          <div class="market-card">
            <span class="market-icon">🟡</span>
            <h4>Krónan</h4>
            <span class="market-tag">品项平衡</span>
            <p>生鲜、轻食与日常食品选择较完整，适合准备自炊晚餐或隔日早餐。</p>
          </div>
          <div class="market-card">
            <span class="market-icon">🔵</span>
            <h4>Nettó</h4>
            <span class="market-tag">临时补给</span>
            <p>适合沿途补买遗漏品项、车上零食或简单生活用品。</p>
          </div>
          <div class="market-card">
            <span class="market-icon">🏬</span>
            <h4>Hagkaup</h4>
            <span class="market-tag">一次购齐</span>
            <p>食品与生活用品范围较广，适合需要同时补齐多种用品时使用。</p>
          </div>
        </div>

        <div class="info-card editorial-note">
          <h4>离开雷市前的补给清单</h4>
          <div class="editorial-chips">
            <span>早餐与牛奶</span>
            <span>车上零食</span>
            <span>热饮与饮用水</span>
            <span>晚餐食材</span>
            <span>纸巾与垃圾袋</span>
            <span>应急用品</span>
          </div>
          <ol class="editorial-steps">
            <li>先看住宿是否有厨房、冰箱与基本调味料</li>
            <li>依未来两天路线决定采购量，不必一次买满全程</li>
            <li>冷藏品最后拿，结帐后尽快放入保冷袋</li>
            <li>把隔日早餐独立装袋，早上离开住宿更有效率</li>
          </ol>
        </div>

      </div>
    </div>

    <!-- 4. 冰岛酒类：正式内容 -->
    <div class="travel-collapse">
      <div class="travel-collapse-header" onclick="toggleTravelCollapse(this)">
        <div class="travel-collapse-left">
          <div class="travel-collapse-emoji">🍷</div>
          <div>
            <div class="travel-collapse-title">冰岛酒类</div>
            <div class="travel-collapse-sub">Vínbúðin · KEF机场免税 · 购买时机</div>
          </div>
        </div>
        <div class="travel-collapse-arrow">▼</div>
      </div>
      <div class="travel-collapse-body">

        <div class="souvenir-card editorial-feature-card">
          <div class="souvenir-img-wrap editorial-illustration"><div class="img-fallback">🍷</div></div>
          <div class="souvenir-info">
            <h4>冰岛酒类购买｜先决定时机，再挑品项</h4>
            <div class="souvenir-shop">抵达机场 · 市区酒类专卖店 · 离境补买</div>
            <div class="souvenir-desc">把购买地点与行程顺序放在一起看，比单纯列出品牌更实用。抵达时先确认旅途中需要的数量，市区再补买当地限定或遗漏品项。</div>
            <div class="souvenir-tip">营业时间、购买限制与免税额度可能变化，出发前及现场应再核对最新规定。</div>
          </div>
          <div class="editorial-action-row">
            <span>🛬 抵达购买</span>
            <span>⌂ 市区补买</span>
            <span>✈ 离境检查</span>
          </div>
        </div>

        <div class="souvenir-item">
          <div class="souvenir-img-wrap small editorial-illustration"><div class="img-fallback">🛬</div></div>
          <div class="souvenir-item-info">
            <h4>KEF 机场免税店</h4>
            <p>适合在抵达或离境时集中处理。抵达后若已确定需求，可减少之后特别绕去购买的时间。</p>
            <span class="souvenir-brand">适合：旅行途中饮用、一次购齐</span>
          </div>
        </div>

        <div class="souvenir-item">
          <div class="souvenir-img-wrap small editorial-illustration"><div class="img-fallback">🏪</div></div>
          <div class="souvenir-item-info">
            <h4>Vínbúðin 酒类专卖店</h4>
            <p>适合寻找特定品牌、当地产品或抵达时遗漏的品项。行程中应先确认分店位置与营业时间。</p>
            <span class="souvenir-brand">适合：特定品牌、当地限定、途中补买</span>
          </div>
        </div>

        <div class="souvenir-item">
          <div class="souvenir-img-wrap small editorial-illustration"><div class="img-fallback">🍺</div></div>
          <div class="souvenir-item-info">
            <h4>当地啤酒与轻饮</h4>
            <p>自用可优先选择小容量或组合装，减少重量；送礼则优先确认包装完整与托运行李空间。</p>
            <span class="souvenir-brand">选择重点：容量、重量、包装完整</span>
          </div>
        </div>

        <div class="souvenir-item">
          <div class="souvenir-img-wrap small editorial-illustration"><div class="img-fallback">🎁</div></div>
          <div class="souvenir-item-info">
            <h4>送礼型酒类</h4>
            <p>先确认收礼对象与行李限制，再决定是否购买玻璃瓶或礼盒，避免最后一天才发现难以携带。</p>
            <span class="souvenir-brand">选择重点：辨识度、体积、易碎程度</span>
          </div>
        </div>

        <div class="alcohol-warn editorial-note">
          <h4>现场提醒</h4>
          <p>一般超市不应被当作主要购酒地点。实际购买年龄、营业时间、免税额度与入境规定，请以现场公告及官方最新资讯为准。</p>
          <ol class="editorial-steps">
            <li>抵达时先确认旅途中真正需要的数量</li>
            <li>市区只补买当地限定或遗漏品项</li>
            <li>玻璃瓶集中保护，避免散放在行李边缘</li>
            <li>离境前重新确认托运、随身行李与免税限制</li>
          </ol>
        </div>

      </div>
    </div>

    <!-- 5. 芬兰伴手礼：正式内容 -->
    <div class="travel-collapse">
      <div class="travel-collapse-header" onclick="toggleTravelCollapse(this)">
        <div class="travel-collapse-left">
          <div class="travel-collapse-emoji">🇫🇮</div>
          <div>
            <div class="travel-collapse-title">芬兰伴手礼 — 超市</div>
            <div class="travel-collapse-sub">巧克力 · 咖啡 · 花草茶 · 北欧设计</div>
          </div>
        </div>
        <div class="travel-collapse-arrow">▼</div>
      </div>
      <div class="travel-collapse-body">

        <div class="souvenir-card editorial-feature-card" data-images="nordqvist.jpg">
          <div class="souvenir-img-wrap">
            <img src="images/catalog/nordqvist.jpg" alt="芬兰伴手礼" loading="lazy" decoding="async">
          </div>
          <div class="souvenir-info">
            <h4>芬兰伴手礼｜轻巧、明亮、适合送礼</h4>
            <div class="souvenir-shop">📍 超市 · 百货食品区 · 设计商店</div>
            <div class="souvenir-desc">芬兰伴手礼适合依收礼对象分组：办公室选择易分送食品，家人选择咖啡与花草茶，喜欢设计的人则可挑选姆明或北欧图案用品。</div>
            <div class="souvenir-tip">赫尔辛基停留时间有限时，优先在交通方便的超市或百货一次买齐。</div>
          </div>
          <div class="editorial-action-row">
            <span>🎁 按对象选</span>
            <span>▤ 按品类找</span>
            <span>＋ 加入采购</span>
          </div>
        </div>

        <div class="souvenir-item">
          <div class="souvenir-img-wrap small editorial-illustration"><div class="img-fallback">🍫</div></div>
          <div class="souvenir-item-info">
            <h4>Fazer 巧克力与糖果</h4>
            <p>包装辨识度高，适合办公室分送或一般送礼。可优先选择经典包装与方便分装的尺寸。</p>
            <span class="souvenir-brand">适合：同事、朋友、办公室</span>
          </div>
        </div>

        <div class="souvenir-item">
          <div class="souvenir-img-wrap small editorial-illustration"><div class="img-fallback">☕</div></div>
          <div class="souvenir-item-info">
            <h4>芬兰咖啡</h4>
            <p>适合常喝咖啡的家人或同事。购买前确认研磨方式、包装重量与是否方便冲泡。</p>
            <span class="souvenir-brand">适合：咖啡爱好者、家人</span>
          </div>
        </div>

        <div class="souvenir-item">
          <div class="souvenir-img-wrap small">
            <img src="images/catalog/nordqvist.jpg" alt="Nordqvist 花草茶" loading="lazy" decoding="async">
          </div>
          <div class="souvenir-item-info">
            <h4>Nordqvist 花草茶</h4>
            <p>北欧风包装适合送礼，茶包轻巧、容易携带，也适合不喝咖啡的收礼对象。</p>
            <span class="souvenir-brand">适合：长辈、同事、轻量送礼</span>
          </div>
        </div>

        <div class="souvenir-item">
          <div class="souvenir-img-wrap small editorial-illustration"><div class="img-fallback">🐾</div></div>
          <div class="souvenir-item-info">
            <h4>姆明与北欧图案用品</h4>
            <p>可选择杯垫、餐巾、文具或小型生活用品，兼具芬兰辨识度与实用性。</p>
            <span class="souvenir-brand">适合：儿童、设计爱好者</span>
          </div>
        </div>

        <div class="souvenir-item">
          <div class="souvenir-img-wrap small editorial-illustration"><div class="img-fallback">🌿</div></div>
          <div class="souvenir-item-info">
            <h4>木糖醇与莓果产品</h4>
            <p>体积小、容易放入行李，可作为补充型伴手礼；购买时注意口味与包装语言。</p>
            <span class="souvenir-brand">适合：自用、小份量分送</span>
          </div>
        </div>

        <div class="info-card editorial-note">
          <h4>赫尔辛基短暂停留采购法</h4>
          <ol class="editorial-steps">
            <li>先列收礼对象与数量，避免在货架前重复计算</li>
            <li>食品优先选常温、轻巧、包装完整的品项</li>
            <li>设计用品限制在小尺寸，避免占用过多行李空间</li>
            <li>离开商店前集中拍照记录价格与购买数量</li>
          </ol>
          <div class="editorial-chips">
            <span>办公室分送</span>
            <span>家人礼物</span>
            <span>北欧设计</span>
            <span>轻量携带</span>
          </div>
        </div>

      </div>
    </div>

    <!-- 6. 芬兰浴：正式内容 -->
    <div class="travel-collapse">
      <div class="travel-collapse-header" onclick="toggleTravelCollapse(this)">
        <div class="travel-collapse-left">
          <div class="travel-collapse-emoji">🧖</div>
          <div>
            <div class="travel-collapse-title">芬兰浴与其他洗浴文化</div>
            <div class="travel-collapse-sub">冷热交替 · 现场规则 · 体验节奏</div>
          </div>
        </div>
        <div class="travel-collapse-arrow">▼</div>
      </div>
      <div class="travel-collapse-body">

        <div class="souvenir-card editorial-feature-card">
          <div class="souvenir-img-wrap editorial-illustration"><div class="img-fallback">♨</div></div>
          <div class="souvenir-info">
            <h4>芬兰浴体验｜把流程与现场规则先看懂</h4>
            <div class="souvenir-shop">传统桑拿 · 海水泳池 · 酒店桑拿</div>
            <div class="souvenir-desc">体验前先确认是否分男女、是否穿泳衣、毛巾与置物柜是否包含。真正进入现场后，只需要依身体状况调整冷热交替次数。</div>
            <div class="souvenir-tip">不必追求高温或长时间；补水、休息与舒适度比完成次数更重要。</div>
          </div>
          <div class="editorial-action-row">
            <span>▤ 体验流程</span>
            <span>◌ 现场规则</span>
            <span>🎒 随身物品</span>
          </div>
        </div>

        <div class="market-grid">
          <div class="market-card">
            <span class="market-icon">🔥</span>
            <h4>传统桑拿</h4>
            <span class="market-tag">文化体验</span>
            <p>重点在安静放松、蒸汽与休息节奏，进入前先确认现场服装规则。</p>
          </div>
          <div class="market-card">
            <span class="market-icon">🌊</span>
            <h4>海水泳池型</h4>
            <span class="market-tag">冷热交替</span>
            <p>适合想体验桑拿、户外冷水与休息空间的人，需留意天气与防滑。</p>
          </div>
          <div class="market-card">
            <span class="market-icon">🏨</span>
            <h4>酒店桑拿</h4>
            <span class="market-tag">方便入门</span>
            <p>流程较简单，适合第一次体验或行程时间有限的人。</p>
          </div>
          <div class="market-card">
            <span class="market-icon">♨</span>
            <h4>冰岛温泉</h4>
            <span class="market-tag">不同逻辑</span>
            <p>以户外泡汤与地热体验为主，不应完全套用芬兰桑拿的流程与规则。</p>
          </div>
        </div>

        <div class="info-card editorial-note">
          <h4>冷热交替 4 步骤</h4>
          <ol class="editorial-steps">
            <li>淋浴并确认现场规则，把贵重物品放入置物柜</li>
            <li>进入桑拿房，让身体逐渐升温，不必勉强停留</li>
            <li>短暂冷水、户外空气或冷水池降温</li>
            <li>休息补水，依身体状况决定是否再重复</li>
          </ol>
        </div>

        <div class="info-card editorial-note">
          <h4>随身准备与礼仪</h4>
          <div class="editorial-chips">
            <span>泳衣或替换衣物</span>
            <span>毛巾</span>
            <span>拖鞋</span>
            <span>饮用水</span>
            <span>防水袋</span>
          </div>
          <ol class="editorial-steps">
            <li>进入前先淋浴，遵守现场关于泳衣与毛巾的规定</li>
            <li>保持安静，不在桑拿房内长时间拍照或通话</li>
            <li>身体不适、饮酒后或过度疲劳时，不勉强进行冷热交替</li>
            <li>离开前补水并预留换衣、吹干头发与交通时间</li>
          </ol>
        </div>

      </div>
    </div>

  </div>
</div>
`;
