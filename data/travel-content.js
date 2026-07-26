// 「體驗」頁第一階段：採用已確認的北歐旅行手札視覺。
// 伴手禮（商店）已換回正式既有內容並改為「購物路線優先、商品輔助」。
// 其餘分類暫保留設計示範，待逐項確認後再替換正式文字與照片。
const TRAVEL_HTML = `
<style id="travel-editorial-style">
  #page-travel {
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
  #page-travel > .page-inner { padding-top: 0; }

  #page-travel .catalog-top {
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
  #page-travel .catalog-pill-scroll { gap: 0; padding: 0; }
  #page-travel .catalog-pill {
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
  #page-travel .catalog-pill + .catalog-pill { margin-left: -1px; }
  #page-travel .catalog-pill.active {
    position: relative;
    z-index: 2;
    background: var(--paper);
    color: var(--forest);
    border-color: #d3c7b7;
    box-shadow: 0 -4px 12px rgba(75,62,43,.08);
  }
  #page-travel .catalog-pill.active::before {
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
  #page-travel .catalog-pill-overview::after { display: none; }

  #page-travel .travel-banner.editorial-hero {
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

  #page-travel.catalog-show-overview .catalog-overview-heading { display: none; }
  #page-travel .catalog-overview { margin-bottom: 10px; }
  #page-travel .catalog-overview-grid {
    grid-template-columns: repeat(2, minmax(0,1fr));
    gap: 12px;
  }
  #page-travel .catalog-overview-card {
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
  #page-travel .catalog-overview-card:first-child {
    grid-column: 1 / -1;
    min-height: 174px;
    padding: 22px;
    background:
      radial-gradient(circle at 88% 25%, rgba(110,139,101,.22) 0 16%, transparent 38%),
      linear-gradient(135deg, #fdfaf3, #e8eee1);
    border-color: #c6d1bd;
  }
  #page-travel .catalog-overview-card:nth-child(4) {
    grid-column: 1 / -1;
    min-height: 100px;
    flex-direction: row;
    align-items: center;
  }
  #page-travel .catalog-overview-icon {
    width: 46px;
    height: 46px;
    border: 1px solid #d9d1c4;
    border-radius: 15px;
    background: rgba(255,255,255,.72);
    box-shadow: 0 4px 10px rgba(71,60,45,.08);
  }
  #page-travel .catalog-overview-card:first-child .catalog-overview-icon {
    width: 58px;
    height: 58px;
    margin-bottom: 13px;
  }
  #page-travel .catalog-overview-copy strong {
    font-family: var(--font-display);
    font-size: var(--fs-base);
    line-height: 1.35;
    color: var(--ink);
  }
  #page-travel .catalog-overview-card:first-child .catalog-overview-copy strong {
    font-size: var(--fs-xl);
  }
  #page-travel .catalog-overview-copy small {
    margin-top: 5px;
    white-space: normal;
    line-height: 1.45;
    color: var(--muted-ink);
  }
  #page-travel .catalog-overview-arrow {
    align-self: flex-end;
    color: var(--forest);
  }

  #page-travel .catalog-category-intro {
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
  #page-travel .catalog-category-intro::before {
    left: 16px;
    top: 16px;
    bottom: 16px;
    width: 16px;
    background-image: radial-gradient(circle, #d3c7b6 0 3px, rgba(255,255,255,.9) 3.2px 5px, transparent 5.2px);
    background-size: 16px 24px;
  }
  #page-travel .catalog-category-intro-icon {
    width: 48px;
    height: 48px;
    border: 1px solid #d8cfbf;
    border-radius: 15px;
    background: linear-gradient(145deg, #fff, #e8eee2);
  }
  #page-travel .catalog-category-intro-copy strong {
    font-size: var(--fs-xl);
    line-height: 1.3;
    color: var(--ink);
  }
  #page-travel .catalog-category-intro-copy small {
    margin-top: 5px;
    line-height: 1.5;
  }

  #page-travel .catalog-list-card.catalog-layout-hero {
    overflow: hidden;
    border: 1px solid #d6ccbc;
    border-radius: 22px;
    background: var(--paper);
    box-shadow: 0 10px 22px rgba(74,62,45,.12);
  }
  #page-travel .editorial-feature-card .souvenir-img-wrap { height: 224px; }
  #page-travel .editorial-feature-card .souvenir-info { padding: 19px 20px 17px; }
  #page-travel .catalog-list-card.catalog-layout-hero .souvenir-info h4 {
    margin-bottom: 7px;
    font-size: var(--fs-xl);
    line-height: 1.35;
    color: var(--ink);
  }
  #page-travel .souvenir-shop { color: var(--forest); }
  #page-travel .souvenir-tip {
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

  #page-travel .catalog-list-card.catalog-layout-split {
    min-height: 122px;
    border-color: #d9cebe !important;
    border-radius: 19px !important;
    background: var(--paper) !important;
    box-shadow: 0 7px 16px rgba(79,65,46,.09);
  }
  #page-travel .catalog-list-card.catalog-layout-split .souvenir-img-wrap,
  #page-travel .catalog-list-card.catalog-layout-split .souvenir-img-wrap.small,
  #page-travel .catalog-list-card.catalog-layout-split .catalog-card-media {
    width: 108px !important;
    flex-basis: 108px !important;
    min-height: 122px;
    background: linear-gradient(145deg, #e4eadf, #f5efe4);
  }
  #page-travel .catalog-list-card.catalog-layout-split h4 {
    font-family: var(--font-display);
    color: var(--ink);
  }

  #page-travel .market-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0,1fr));
    gap: 11px;
    margin-bottom: 14px;
  }
  #page-travel .market-card {
    min-height: 154px;
    padding: 18px 14px;
    border: 1px solid #d9cebe;
    border-radius: 18px;
    background: linear-gradient(145deg, #fffdf7, #eee9df);
    box-shadow: 0 6px 14px rgba(77,64,47,.08);
  }
  #page-travel .market-card h4 {
    margin-top: 8px;
    font-family: var(--font-display);
    font-size: var(--fs-base);
    color: var(--ink);
  }
  #page-travel .market-tag {
    background: #e7eee1;
    color: var(--forest);
  }

  #page-travel .info-card,
  #page-travel .alcohol-warn {
    position: relative;
    overflow: hidden;
    padding: 20px 20px 20px 54px;
    border: 1px solid #dacfbf;
    border-radius: 19px;
    background: linear-gradient(180deg, rgba(255,255,255,.55), transparent 30%), var(--paper);
    box-shadow: 0 7px 17px rgba(81,66,47,.09);
  }
  #page-travel .info-card::before,
  #page-travel .alcohol-warn::before {
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
    #page-travel .travel-banner.editorial-hero {
      min-height: 305px;
      border-radius: 20px;
    }
    .editorial-hero-copy {
      left: 20px;
      right: 20px;
      bottom: 75px;
    }
    .editorial-hero h2 { font-size: 2rem; }
    #page-travel .catalog-overview-card {
      min-height: 126px;
      padding: 15px;
    }
    #page-travel .catalog-list-card.catalog-layout-split .souvenir-img-wrap,
    #page-travel .catalog-list-card.catalog-layout-split .souvenir-img-wrap.small,
    #page-travel .catalog-list-card.catalog-layout-split .catalog-card-media {
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

    <!-- 3. 主要超市：设计示范 -->
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
        <div class="market-grid">
          <div class="market-card"><span class="market-icon">🐷</span><h4>Bónus</h4><span class="market-tag">预算优先</span><p>适合基本补给与大量采购</p></div>
          <div class="market-card"><span class="market-icon">🟡</span><h4>Krónan</h4><span class="market-tag">品项平衡</span><p>生鲜、轻食与特殊饮食较完整</p></div>
          <div class="market-card"><span class="market-icon">🔵</span><h4>Nettó</h4><span class="market-tag">营业弹性</span><p>适合沿途临时补货</p></div>
          <div class="market-card"><span class="market-icon">🏬</span><h4>Hagkaup</h4><span class="market-tag">一次购齐</span><p>用品、食品与生活杂货较齐全</p></div>
        </div>
        <div class="info-card editorial-note">
          <h4>离开雷市前的补给纸条</h4>
          <p>此分类暂为设计示范，后续换回正式营业时间、分店数量与路线建议。</p>
          <div class="editorial-chips"><span>早餐</span><span>车上零食</span><span>热饮</span><span>应急用品</span></div>
        </div>
      </div>
    </div>

    <!-- 4. 冰岛酒类：设计示范 -->
    <div class="travel-collapse">
      <div class="travel-collapse-header" onclick="toggleTravelCollapse(this)">
        <div class="travel-collapse-left">
          <div class="travel-collapse-emoji">🍷</div>
          <div>
            <div class="travel-collapse-title">冰岛酒类</div>
            <div class="travel-collapse-sub">Vínbúðin · KEF机场免税</div>
          </div>
        </div>
        <div class="travel-collapse-arrow">▼</div>
      </div>
      <div class="travel-collapse-body">
        <div class="alcohol-warn editorial-note">
          <h4>先看购买限制，再看推荐品项</h4>
          <p>警示卡适合放法规、营业限制或容易踩雷的资讯；正式内容将在下一阶段换回。</p>
        </div>
        <div class="souvenir-item">
          <div class="souvenir-img-wrap small editorial-illustration"><div class="img-fallback">🛬</div></div>
          <div class="souvenir-item-info"><h4>机场免税优先</h4><p>用购买时机取代冗长说明，旅途中更容易快速判断。</p><span class="souvenir-brand">抵达／离境</span></div>
        </div>
        <div class="info-card editorial-note">
          <h4>购买顺序</h4>
          <ol class="editorial-steps"><li>抵达时先确认需求与额度</li><li>市区只补买当地限定或遗漏品项</li><li>离境前再做最后检查</li></ol>
        </div>
      </div>
    </div>

    <!-- 5. 芬兰伴手礼：设计示范 -->
    <div class="travel-collapse">
      <div class="travel-collapse-header" onclick="toggleTravelCollapse(this)">
        <div class="travel-collapse-left">
          <div class="travel-collapse-emoji">🇫🇮</div>
          <div>
            <div class="travel-collapse-title">芬兰伴手礼 — 超市</div>
            <div class="travel-collapse-sub">K-Market · S-Market · Prisma · Lidl</div>
          </div>
        </div>
        <div class="travel-collapse-arrow">▼</div>
      </div>
      <div class="travel-collapse-body">
        <div class="souvenir-card editorial-feature-card" data-images="nordqvist.jpg">
          <div class="souvenir-img-wrap"><img src="images/catalog/nordqvist.jpg" alt="芬兰伴手礼设计示范" loading="lazy" decoding="async"></div>
          <div class="souvenir-info">
            <h4>芬兰包装设计｜轻巧、明亮、适合送礼</h4>
            <div class="souvenir-shop">📍 超市与市中心百货</div>
            <div class="souvenir-desc">此分类暂为设计示范，正式内容将再换回巧克力、咖啡、花草茶与酱料。</div>
          </div>
        </div>
        <div class="souvenir-item">
          <div class="souvenir-img-wrap small editorial-illustration"><div class="img-fallback">🍫</div></div>
          <div class="souvenir-item-info"><h4>巧克力与糖果</h4><p>国民品牌、限定包装与口味强度。</p><span class="souvenir-brand">送礼首选</span></div>
        </div>
        <div class="souvenir-item">
          <div class="souvenir-img-wrap small editorial-illustration"><div class="img-fallback">☕</div></div>
          <div class="souvenir-item-info"><h4>咖啡与花草茶</h4><p>以包装色系、冲泡方式与适合对象说明。</p><span class="souvenir-brand">长辈／同事</span></div>
        </div>
      </div>
    </div>

    <!-- 6. 芬兰浴：设计示范 -->
    <div class="travel-collapse">
      <div class="travel-collapse-header" onclick="toggleTravelCollapse(this)">
        <div class="travel-collapse-left">
          <div class="travel-collapse-emoji">🧖</div>
          <div>
            <div class="travel-collapse-title">芬兰浴与其他洗浴文化</div>
            <div class="travel-collapse-sub">冷热交替 · 冰火两重天体验</div>
          </div>
        </div>
        <div class="travel-collapse-arrow">▼</div>
      </div>
      <div class="travel-collapse-body">
        <div class="souvenir-card editorial-feature-card">
          <div class="souvenir-img-wrap editorial-illustration"><div class="img-fallback">♨</div></div>
          <div class="souvenir-info">
            <h4>一页看懂芬兰浴体验</h4>
            <div class="souvenir-shop">体验型内容：气氛图＋流程＋现场提醒</div>
            <div class="souvenir-desc">体验类采用大图开场，再接步骤纸条与比较卡；正式内容将在后续换回。</div>
          </div>
          <div class="editorial-action-row"><span>▤ 体验流程</span><span>◌ 注意事项</span><span>☆ 收藏</span></div>
        </div>
        <div class="info-card editorial-note">
          <h4>冷热交替 4 步骤</h4>
          <ol class="editorial-steps"><li>淋浴并确认现场规则</li><li>进入桑拿房，让身体逐渐升温</li><li>短暂冷水或户外降温</li><li>休息补水，再视状况重复</li></ol>
        </div>
        <div class="info-card editorial-note">
          <h4>不同洗浴文化的阅读方式</h4>
          <p>比较内容不塞进传统表格，改用短句与标签，让手机画面更像旅行杂志的知识页。</p>
          <div class="editorial-chips"><span>芬兰浴</span><span>冰岛温泉</span><span>日本温泉</span><span>土耳其浴</span></div>
        </div>
      </div>
    </div>
  </div>
</div>
`;
