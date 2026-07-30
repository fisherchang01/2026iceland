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
        <div class="item-card item-lg">
          <h4 class="item-card-title">超市食物</h4>
          <div class="item-detail">
            <h4>一、	Skyr 優格</h4>
            <p>(1)冰島傳統國民優格，高蛋白、口感綿密，價格實惠。Skyr的水果優格在冰島很常見，對冰島人來說不只可以當早餐或點心，還可以拿來抹麵包吐司，甚至做成甜點或打成奶昔，根本萬用，有大中小不同包裝，中SIZE的一瓶約10元人民幣，有綜合水果、藍莓、草莓⋯等口味可以選，還挺好的。

(2)由維京人傳下來的Skyr 是冰島傳統優格，其實它在冰島人的眼中比較像是起司的存在，更是當地人飲食文化非常重要的一部份。Skyr 優格由大量的脫脂牛奶製成，吃起來相當濃郁綿密，不僅營養價值極高，熱量還很低，非常適合注重飲食養生的人。

(3)	這款優格最經典的吃法是用無糖原味Skyr 作為基底，加上糖及新鮮水果一同享用。Skyr 優格也有推出焦糖布丁、巧克力及香草⋯⋯等等口味，值得一試！

(4)愛吃優格的人千萬不要錯過冰島 Ísey 的 Skyr，質地比一般優格更綿密濃稠，接近希臘優格的稠度，而且 Ísey 的 Skyr 有超多種口味，低糖、低脂、蛋白質含量又高。</p>
            <img src="images/catalog/item-01.webp" alt="">
            <h4>二、	魚子醬牙膏 (Kaviar)</h4>
            <p>(1)擠壓條裝的管狀魚子醬（常見 Mills 品牌），搭配吐司或餅乾非常方便便宜，一條約20元人民幣，因為攜帶方便又便宜，可以買著搭配吐司、餅乾一起吃，是來冰島旅遊節省餐費的好幫手，我們是覺得原味（黑色字）的比較好吃。

(2)冰島人喜歡用鱈魚子醬抹麵包。這種魚子醬叫Kaviar，包裝有點像牙膏。我自己覺得挺好吃，不過調味有點鹹，不能塗太多。再夾點蔬菜弄成三文治也行，我們在冰島的午餐都是這樣解決的。</p>
            <img src="images/catalog/item-02.webp" alt="">
            <h4>三、	Ora魚子醬</h4>
            <p>這種玻璃罐裝的Ora魚子醬也很推薦，這是冰島有名的罐頭品牌，用來搭麵包、義大利麵也很絕配，滿滿100克Ora魚子醬才賣30元人民幣，完全是來冰島才能享受到的高貴不貴的平價美食。</p>
            <img src="images/catalog/item-03.webp" alt="">
            <h4>四、	冰川水</h4>
            <p>冰島以純淨的自然環境著名，冰川水被認為是全世界最乾淨的水，不只是口感上優質之外的礦物質也很豐富，瓶身通常會有極光、冰山等等較特別的設計，很適合帶回家收藏。

被譽為「全世界最好喝的水」Icelandic Glacial，不僅是世上第一瓶碳中和瓶裝水，瓶身還美到像藝術品！</p>
            <img src="images/catalog/item-04.png" alt="">
            <h4>五、	Einstok 啤酒</h4>
            <p>(1)作為維京人後代的冰島居民承襲了祖先愛喝酒的基因，所生產的Einstok 啤酒品質極高，榮登世界前50強啤酒。這個冰島精釀啤酒使用最靠近北極圈的純凈冰山水，釀造出口感滑順、清爽的高品質啤酒，非常適合夏天時飲用。整體來說，Einstok家的啤酒非常適合女性享用，淡雅又清爽，是追劇、烤肉或吃宵夜必備！

(2)Einstok推出的口味中最經典的是白啤酒，同時具有花香、麥香及柑橘香，另外也有帶有熱帶水果香氣或是莓果滋味的品項。</p>
            <div class="item-row"><img src="images/catalog/item-05.png" alt="">
            <img src="images/catalog/item-06.png" alt="">
            </div>
            <h4>六、	冰島可口可樂</h4>
            <p>(1)冰島的可口可樂被許多人譽為世界上最好喝的，主要原因在於它使用純淨無污染的冰島水源，天然軟水讓口感更順滑細緻

(2)很多人會問我：冰島可口可樂真的比較好喝嗎？老實說我沒有明顯喝出差別 🤣。自 2017 年起，玻璃瓶裝和鋁罐裝改由瑞典生產，只有寶特瓶裝仍在冰島本地製造、使用當地水源，想體驗道地風味就選寶特瓶，並認明商品編號 569 開頭才是冰島製的。就讓大家自己來驗證這個都市傳說是不是真的囉。</p>
            <img src="images/catalog/item-07.webp" alt="">
          </div>
        </div>
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
        <div class="item-card item-lg">
          <h4 class="item-card-title">超市购物</h4>
          <div class="item-detail">
            <h4>一、	甘草糖 Lakkris</h4>
            <p>(1)甘草糖可以说是北欧很有代表性的零食，通常呈黑色，吃起来有类似八角茴香的味道，喜好程度非常见仁见智，对多数亚洲人来说偏猎奇。想送礼又怕踩雷的话，可以挑裹巧克力的版本，比较好入口。

(2)有世界最难吃零食之一的甘草糖 (Lakkrís)，在超市买最划算了，
虽有不少亚洲人觉得难吃，形容味道像八角一样恐怖，但甘草糖对北欧国家的人来说可是爱不释手的好物呢～

(3)冰岛甘草糖是冰岛人最爱的零食之一，特别是巧克力和甘草糖的组合，微苦又有咸甜融合的多层次风味，是一款很特别的零食，如果喜欢尝鲜的话可以购买，超市和纪念品店都可以看到他。

(4)冰岛马粪糖其实就是甘草糖，因为做成冰岛马粪的形状而有此名。另外当地也有其他造型的甘草糖，最常见的品牌就是Lakkris，可以在大大小小的商店中找到。

(5)甘草糖在欧洲是相当受欢迎的零食，不仅热量低，更有顾肠胃、止咳等等的功效。冰岛马粪糖的味道较重，吃起来就是甜甜的八角味道，对亚洲人来说可能吃起来比较不习惯。建议可以先在当地买一包尝尝味道，确定喜欢再大量购入也不迟！</p>
            <img src="images/catalog/supermarket-shopping-01.webp" alt="">
            <h4>二、	Mills鱼子酱牙膏</h4>
            <p>(1)Mills鱼子抹酱，产地挪威，是当地最大，市占率最高的鳕鱼子酱品牌，色泽亮橘，咸味颇高，记得不要一次加太多，可以用来涂面包、做色拉、煎蛋，有些超市会把它们放在常温区，如果没开封的话可以带回台湾分送给亲友尝尝看喔。

(2)Mills 鱼子酱牙膏的名气完全不需要多说，若是在冰岛超市有看到买下去就对了！这款鱼子酱牙膏是当地人餐桌常看见的食材，只要在放上水煮蛋的吐司上挤一圈，一口咬下就能品尝到北大西洋的滋味，咸香味十足。

(3)Mills鱼子酱牙膏有两种口味，原味的烟熏海味较浓，另外一款则是有加入蛋黄的，味道较为温润。

(4)由于冰岛温度较低，鱼子酱牙膏在当地是放在室温中贩卖。若是要带回家当伴手礼，建议考虑气温之后再下手喔！</p>
            <img src="images/catalog/supermarket-shopping-02.webp" alt="">
            <h4>三、	冰岛火山海盐</h4>
            <p>(1)冰岛火山海盐取自冰岛纯净的海水，无污染、无添加，是最天然的调味品，价格不贵又有冰岛的独特性，购买回家自用或是送礼都很适合也很实用

(2)冰岛火山盐（Lava Salt）来自冰岛纯净的海水，经过自然蒸发后再添加活性碳，这正是它呈现黑色的原因。我自己很喜欢在煎牛排或鲑鱼的时候搭配火山盐，黑盐带有淡淡的烟熏风味，我也买了好多送给亲戚好友。
</p>
            <img src="images/catalog/supermarket-shopping-03.webp" alt="">
            <h4>四、	冰岛鱼油 Lysi</h4>
            <p>(1)Lysi 是冰岛最知名的鱼油品牌，因鱼油取自无污染的冰岛海域，所以鱼油原料的纯净度和高质量是深受大家喜欢的，不只是传统品牌，这个品牌鱼油的 Omega-3 含量也很高，是非常优的健康食品，自用或当伴手礼送给家中长辈都很适合。

(2)鱼油在冰岛有着「海上的黄金」之称，当地人食用鱼油已经有数百年的历史。每个冰岛家庭在早餐时都会要求孩子喝上一匙鱼油，以摄取人体必需的维生素，保护身体健康。由于地理环境优良，冰岛出产的鱼油质量众所皆知，其中更是推荐入手LYSI鱼油。

(3)LYSI是冰岛第一间鱼油研发公司，使用高质量的冰岛鳕鱼生产鱼油及鱼肝油相关产品，名声享誉国际。LYSI家除了罐装可以直接饮用的油之外，也有做成胶囊状的产品贩卖，大家可以按照自身习惯购买。</p>
            <img src="images/catalog/supermarket-shopping-04.png" alt="">
          </div>
        </div>
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
