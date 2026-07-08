// 「旅遊」頁籤的完整 HTML 內容，可直接編輯下方 HTML 標籤來調整文字、新增或刪除項目
const TRAVEL_HTML = `
<div class="page" id="page-travel">
  <div class="page-inner">
    <div class="travel-banner">
      <div class="travel-banner-icon">🛍️</div>
      <div class="travel-banner-text">
        <h2>旅游贴士 &amp; 伴手礼</h2>
        <p>冰岛 &amp; 芬兰购物指南</p>
      </div>
    </div>

    <!-- === 城市漫游快速导览：雷克雅未克 / 赫尔辛基 ===
         注意：这两块是之前直接编辑加进来的，样式跟下面 travel-collapse 系列用了不同写法（内联 style，
         不是共用的 CSS 变量／travel-collapse 元件），先保留原始外观，之后如果要统一视觉风格可以再调整。 -->
    <div style="margin: 0 0 15px 0; border: 1px solid #e0e0e0; border-radius: 12px; overflow: hidden; background: #fff; box-shadow: 0 4px 12px rgba(0,0,0,0.08);">

      <!-- 標題區 (可點擊折疊) -->
      <div onclick="var c=document.getElementById('reykjavik-content'); var a=document.getElementById('arrow-reykjavik'); if(c.style.display==='none'){c.style.display='block'; a.style.transform='rotate(180deg)'}else{c.style.display='none'; a.style.transform='rotate(0deg)'}" style="padding: 15px 20px; background: #f8f9fa; display: flex; justify-content: space-between; align-items: center; cursor: pointer; border-bottom: 1px solid #eee;">
        <h3 style="margin: 0; font-size: 1.1rem; font-weight: bold; color: #2c3e50;">🇮🇸 雷克雅維克 (Reykjavik)</h3>
        <span id="arrow-reykjavik" style="transition: transform 0.3s; font-size: 0.8rem; color: #666;">▼</span>
      </div>

      <!-- 內容區 -->
      <div id="reykjavik-content" style="display: block; padding: 20px;">

        <!-- 路線 A -->
        <div style="margin-bottom: 20px; padding-left: 15px; border-left: 3px solid #3498db;">
          <h4 style="margin: 0 0 10px 0; color: #3498db; font-size: 1rem;">🅰️ 路線 A：經典老城漫步</h4>
          <ul style="margin: 0; padding-left: 20px; color: #555;">
            <li style="margin-bottom: 5px;"><strong>哈爾格林姆教堂</strong>：登頂俯瞰彩色屋頂。</li>
            <li style="margin-bottom: 5px;"><strong>太陽航海者</strong>：海邊鋼鐵雕塑，拍攝維京船。</li>
            <li><strong>托寧湖</strong>：餵鴨子，參觀旁邊的市政廳。</li>
          </ul>
        </div>

        <!-- 路線 B -->
        <div style="padding-left: 15px; border-left: 3px solid #e67e22;">
          <h4 style="margin: 0 0 10px 0; color: #e67e22; font-size: 1rem;">🅱️ 路線 B：文青藝術與溫泉</h4>
          <ul style="margin: 0; padding-left: 20px; color: #555;">
            <li style="margin-bottom: 5px;"><strong>Harpa 音樂廳</strong>：欣賞蜂巢狀玻璃外牆光影。</li>
            <li style="margin-bottom: 5px;"><strong>Laugavegur 購物街</strong>：尋找設計小店與咖啡廳。</li>
            <li><strong>Sky Lagoon</strong>：傍晚前往，體驗無邊際海景溫泉。</li>
          </ul>
        </div>

      </div>
    </div>

    <div style="margin: 0 0 15px 0; border: 1px solid #e0e0e0; border-radius: 12px; overflow: hidden; background: #fff; box-shadow: 0 4px 12px rgba(0,0,0,0.08);">

      <!-- 標題區 (可點擊折疊) -->
      <div onclick="var c=document.getElementById('helsinki-content'); var a=document.getElementById('arrow-helsinki'); if(c.style.display==='none'){c.style.display='block'; a.style.transform='rotate(180deg)'}else{c.style.display='none'; a.style.transform='rotate(0deg)'}" style="padding: 15px 20px; background: #f8f9fa; display: flex; justify-content: space-between; align-items: center; cursor: pointer; border-bottom: 1px solid #eee;">
        <h3 style="margin: 0; font-size: 1.1rem; font-weight: bold; color: #2c3e50;">🇫🇮 赫爾辛基 (Helsinki)</h3>
        <span id="arrow-helsinki" style="transition: transform 0.3s; font-size: 0.8rem; color: #666;">▼</span>
      </div>

      <!-- 內容區 -->
      <div id="helsinki-content" style="display: block; padding: 20px;">

        <!-- 分區介紹 -->
        <div style="display: grid; gap: 15px;">

          <!-- A 區 -->
          <div style="background: #fdfdfd; padding: 10px; border-radius: 8px; border: 1px solid #eee;">
            <strong style="color: #2c3e50;">A. 參議院廣場周邊</strong>
            <p style="margin: 5px 0 0 0; font-size: 0.9rem; color: #666;">白教堂、赫爾辛基大學、舊市場大廳。</p>
          </div>

          <!-- B 區 -->
          <div style="background: #fdfdfd; padding: 10px; border-radius: 8px; border: 1px solid #eee;">
            <strong style="color: #2c3e50;">B. 設計區 (Design District)</strong>
            <p style="margin: 5px 0 0 0; font-size: 0.9rem; color: #666;">紅磚教堂、Iittala 旗艦店、Vintage 服飾店。</p>
          </div>

          <!-- C 區 -->
          <div style="background: #fdfdfd; padding: 10px; border-radius: 8px; border: 1px solid #eee;">
            <strong style="color: #2c3e50;">C. 岩石教堂</strong>
            <p style="margin: 5px 0 0 0; font-size: 0.9rem; color: #666;">Temppeliaukio Church，直接鑿開岩石建造的奇蹟。</p>
          </div>

          <!-- D 區 -->
          <div style="background: #fdfdfd; padding: 10px; border-radius: 8px; border: 1px solid #eee;">
            <strong style="color: #2c3e50;">D. 芬蘭堡 (Suomenlinna)</strong>
            <p style="margin: 5px 0 0 0; font-size: 0.9rem; color: #666;">搭渡輪前往海上要塞，世界文化遺產。</p>
          </div>

          <!-- E 區 -->
          <div style="background: #fdfdfd; padding: 10px; border-radius: 8px; border: 1px solid #eee;">
            <strong style="color: #2c3e50;">E. Oodi 中央圖書館</strong>
            <p style="margin: 5px 0 0 0; font-size: 0.9rem; color: #666;">現代建築傑作，頂樓有 3D 列印機與縫紉機。</p>
          </div>

        </div>
      </div>
    </div>

    <!-- 1. 冰岛伴手礼 — 一般商店 -->
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
        <div class="souvenir-card">
          <div class="souvenir-img-wrap"><div class="img-fallback">🧥</div></div>
          <div class="souvenir-info">
            <h4>Lopapeysa 冰岛羊毛毛衣</h4>
            <div class="souvenir-shop">📍 Handknitting Association of Iceland</div>
            <div class="souvenir-desc">传统圆肩花纹手工毛衣，防水保暖。总店位于 Skólavörðustígur 19（大教堂正对彩虹街），分店在 Laugavegur 53b。每件毛衣挂有编织者亲笔签名，约 23,000–44,000 ISK。</div>
            <div class="souvenir-tip">💡 建议周末顺路逛 Kolaportið 跳蚤市场，二手毛衣约 800–1,300 RMB 可议价</div>
          </div>
        </div>
        <div class="souvenir-card">
          <div class="souvenir-img-wrap"><div class="img-fallback">🍫</div></div>
          <div class="souvenir-info">
            <h4>Omnom 巧克力</h4>
            <div class="souvenir-shop">📍 雷市 Grandi 港口区工厂店</div>
            <div class="souvenir-desc">冰岛精品巧克力品牌，创意口味（海盐、甘草、焦糖）与精美包装，工厂店可试吃。Laugavegur 大街亦有专卖店。</div>
          </div>
        </div>
        <div class="souvenir-card">
          <div class="souvenir-img-wrap"><div class="img-fallback">🧤</div></div>
          <div class="souvenir-info">
            <h4>冰岛羊毛制品（帽/手套/围巾）</h4>
            <div class="souvenir-shop">📍 66°North / Farmers Market / Geysir</div>
            <div class="souvenir-desc">比毛衣平价，同样保暖实用。Farmers Market 位于 Grandi 旧港区（Hólmaslóð 2）及 Laugavegur 37；66°North 为户外机能品牌；Geysir 在 Skólavörðustíg 7&amp;16 有时尚设计款。</div>
            <div class="souvenir-tip">💡 帽子手套约 230–560 RMB，Rainbow Street 沿线多间可逛</div>
          </div>
        </div>
        <div class="souvenir-card">
          <div class="souvenir-img-wrap"><div class="img-fallback">🧂</div></div>
          <div class="souvenir-info">
            <h4>火山岩／熔岩盐（Saltverk）</h4>
            <div class="souvenir-shop">📍 设计店、纪念品店、机场</div>
            <div class="souvenir-desc">以火山地热蒸发制成的冰岛海盐，有黑火山盐、烟熏盐等。适合料理爱好者，包装具北欧设计感。</div>
          </div>
        </div>
        <div class="souvenir-card">
          <div class="souvenir-img-wrap"><div class="img-fallback">🧴</div></div>
          <div class="souvenir-info">
            <h4>蓝湖保养品（Blue Lagoon Skincare）</h4>
            <div class="souvenir-shop">📍 蓝湖温泉店 / 机场免税店</div>
            <div class="souvenir-desc">硅土面膜、身体乳等，富含地热矿物质。机场价格与市区相近，可最后补买。</div>
          </div>
        </div>
        <div class="souvenir-card">
          <div class="souvenir-img-wrap"><div class="img-fallback">🐦</div></div>
          <div class="souvenir-info">
            <h4>Puffin 海鸚周边</h4>
            <div class="souvenir-shop">📍 纪念品店普遍有售</div>
            <div class="souvenir-desc">冰岛国鸟玩偶、磁铁、明信片等，雷市 Laugavegur 大街纪念品店常见，适合送孩童。</div>
          </div>
        </div>
        <!-- 购物路线二级折叠 -->
        <div class="travel-sub-collapse">
          <div class="travel-sub-header" onclick="toggleSubCollapse(this)">
            <span class="travel-sub-title">🗺️ 雷市漫游路线 A（大教堂→音乐厅）</span>
            <span class="travel-sub-arrow">▼</span>
          </div>
          <div class="travel-sub-body">
            <p style="font-size:0.8rem;color:var(--sub);line-height:1.7;margin-bottom:8px;">全程下坡，轻松省力。大教堂出发 → 彩虹街（Handknitting、Geysir）→ 主街（Omnom、66°North、Puffin、Saltverk）→ Grandi旧港区（Omnom工厂店、Farmers Market、蓝湖保养品）→ Harpa</p>
            <div style="font-size:0.78rem;color:var(--text);line-height:1.8;">
              <div style="padding:4px 0;border-bottom:1px solid var(--border-light);">① Hallgrímskirkja 大教堂（起点）</div>
              <div style="padding:4px 0;border-bottom:1px solid var(--border-light);">② Skólavörðustígur 彩虹街 — Handknitting、Geysir</div>
              <div style="padding:4px 0;border-bottom:1px solid var(--border-light);">③ Laugavegur 主街 — Omnom、66°North、Puffin、Saltverk</div>
              <div style="padding:4px 0;border-bottom:1px solid var(--border-light);">④ Grandi 旧港区 — Omnom工厂店、Farmers Market、蓝湖保养品</div>
              <div style="padding:4px 0;">⑤ Harpa 音乐厅（终点）</div>
            </div>
          </div>
        </div>
        <div class="travel-sub-collapse">
          <div class="travel-sub-header" onclick="toggleSubCollapse(this)">
            <span class="travel-sub-title">🗺️ 雷市漫游路线 B（音乐厅→大教堂）</span>
            <span class="travel-sub-arrow">▼</span>
          </div>
          <div class="travel-sub-body">
            <p style="font-size:0.8rem;color:var(--sub);line-height:1.7;margin-bottom:8px;">从海滨出发，上坡走向市区制高点。最后登塔俯瞰全市作为压轴。</p>
            <div style="font-size:0.78rem;color:var(--text);line-height:1.8;">
              <div style="padding:4px 0;border-bottom:1px solid var(--border-light);">① Harpa 音乐厅（起点）</div>
              <div style="padding:4px 0;border-bottom:1px solid var(--border-light);">② Grandi 旧港区 — Omnom工厂店、Farmers Market、蓝湖保养品</div>
              <div style="padding:4px 0;border-bottom:1px solid var(--border-light);">③ Laugavegur 主街 — Omnom、66°North、Puffin、Saltverk</div>
              <div style="padding:4px 0;border-bottom:1px solid var(--border-light);">④ Skólavörðustígur 彩虹街 — Handknitting、Geysir</div>
              <div style="padding:4px 0;">⑤ Hallgrímskirkja 大教堂（终点，可登塔）</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 2. 冰岛伴手礼 — 超市 -->
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
        <div class="souvenir-item">
          <div class="souvenir-img-wrap small"><div class="img-fallback">🍫</div></div>
          <div class="souvenir-item-info">
            <h4>Nói Síríus 巧克力</h4>
            <p>冰岛本土老牌，价格亲民，口味多元，超市架位明显。</p>
            <span class="souvenir-brand">红白配色 + 红色蜡封徽章</span>
          </div>
        </div>
        <div class="souvenir-item">
          <div class="souvenir-img-wrap small"><div class="img-fallback">🍫</div></div>
          <div class="souvenir-item-info">
            <h4>Freyja 巧克力</h4>
            <p>极光主题包装，Since 1910 老牌，适合送礼。</p>
            <span class="souvenir-brand">金色「FREYJA」字样 + 极光背景</span>
          </div>
        </div>
        <div class="souvenir-item">
          <div class="souvenir-img-wrap small"><div class="img-fallback">🍫</div></div>
          <div class="souvenir-item-info">
            <h4>Hraun 巧克力脆片</h4>
            <p>以冰岛熔岩为名，不规则巧克力脆饼，黄色盒装易携带。</p>
            <span class="souvenir-brand">黄色放射状背景 + 棕色「Hraun」字样</span>
          </div>
        </div>
        <div class="souvenir-item">
          <div class="souvenir-img-wrap small"><div class="img-fallback">🍬</div></div>
          <div class="souvenir-item-info">
            <h4>甘草糖（Lakkrís）</h4>
            <p>冰岛人国民零食，巧克力包甘草（Þrista Stubbar）最适合初次尝试。</p>
            <span class="souvenir-brand">LAKKRÍS by Sambo Iceland / 黑白菱形格</span>
          </div>
        </div>
        <div class="souvenir-item">
          <div class="souvenir-img-wrap small"><div class="img-fallback">🧂</div></div>
          <div class="souvenir-item-info">
            <h4>冰岛海盐（小包装）</h4>
            <p>超市自有品牌或 Saltverk 小包装，价格远低于设计店，适合大量分送同事。</p>
            <span class="souvenir-brand">SALTVERK 黑色极简包装</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 3. 主要超市 -->
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
        <a class="link-card" href="https://www.icelandplanner.com/supermarkets" target="_blank" rel="noopener" style="margin-bottom:10px;">
          <div class="link-icon">🗺️</div>
          <div class="link-info">
            <h4>Iceland Planner Supermarket Finder</h4>
            <p>依路线搜寻沿途超市，可筛选品牌</p>
          </div>
        </a>
        <div class="market-grid">
          <div class="market-card">
            <span class="market-icon">🐷</span>
            <h4>Bónus（小猪超市）</h4>
            <span class="market-tag">最便宜</span>
            <p>雷市18间，Selfoss等南部城镇亦有</p>
            <p class="hours">10:00–19:00</p>
          </div>
          <div class="market-card">
            <span class="market-icon">🟡</span>
            <h4>Krónan</h4>
            <span class="market-tag">平价品项齐</span>
            <p>26间分店，营业时间较长</p>
            <p class="hours">有机/素食选项多</p>
          </div>
          <div class="market-card">
            <span class="market-icon">🔵</span>
            <h4>Nettó</h4>
            <span class="market-tag">中等价位</span>
            <p>购物中心常见，包装零食选择多</p>
          </div>
          <div class="market-card">
            <span class="market-icon">🏬</span>
            <h4>Hagkaup</h4>
            <span class="market-tag">品项最广</span>
            <p>雷市6间，24小时营业</p>
          </div>
          <div class="market-card">
            <span class="market-icon">🏪</span>
            <h4>Costco</h4>
            <span class="market-tag">大量采买最划算</span>
            <p>仅1间（雷市郊区），需会员卡</p>
          </div>
        </div>
        <div class="tips-box">
          <p>📌 离开雷市前在 Bónus 或 Krónan 补齐粮食｜鱼罐头、乳制品最划算｜酒类仅在 Vínbúðin 販售</p>
        </div>
      </div>
    </div>

    <!-- 4. 冰岛酒类 -->
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
        <div class="alcohol-warn">
          <div class="warn-title">⚠️ 重要提醒</div>
          <p>冰岛一般超市（Bónus、Krónan、Nettó、Hagkaup、Costco）<strong>均不販售酒類</strong>。<br>酒类仅能在持有执照的专卖店购买：<strong>Vínbúðin（国营酒类专卖店）</strong>。</p>
        </div>
        <div class="souvenir-card">
          <div class="souvenir-img-wrap"><div class="img-fallback">✈️</div></div>
          <div class="souvenir-info">
            <h4>💰 最便宜购买点：KEF 机场免税店</h4>
            <div class="souvenir-desc">入境冰岛时经过的免税店，价格远低于市区 Vínbúðin 及回国后购买。建议抵达时先采买，或离境时在机场免税店补货。</div>
            <div class="souvenir-tip">📍 Vínbúðin 市区分店查询：vinbudin.is</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 5. 芬兰伴手礼 — 超市 -->
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
        <div class="souvenir-item">
          <div class="souvenir-img-wrap small"><div class="img-fallback">🍫</div></div>
          <div class="souvenir-item-info">
            <h4>Fazer 蓝色经典巧克力</h4>
            <p>芬兰国民巧克力，牛奶巧克力口感滑顺，超市价格最实惠，必买伴手礼。</p>
            <span class="souvenir-brand">深蓝色包装 + 金色 Karl Fazer 字样</span>
          </div>
        </div>
        <div class="souvenir-item">
          <div class="souvenir-img-wrap small"><div class="img-fallback">☕</div></div>
          <div class="souvenir-item-info">
            <h4>Paulig / Juhla Mokka 咖啡</h4>
            <p>芬兰人均咖啡消耗量全球第一，Paulig 为本土老牌（Since 1876），总统系列与节庆限定款适合送长辈。</p>
            <span class="souvenir-brand">黑色六边形框 + 白色「Paulig」手写体</span>
          </div>
        </div>
        <div class="souvenir-item">
          <div class="souvenir-img-wrap small"><div class="img-fallback">🍵</div></div>
          <div class="souvenir-item-info">
            <h4>Nordqvist 花草茶</h4>
            <p>以芬兰莓果与花卉调味的有机茶，包装清新具北欧插画风格，适合送女性友人。</p>
            <span class="souvenir-brand">绿色椭圆标 + 蓝白北欧插画包装</span>
          </div>
        </div>
        <div class="souvenir-item">
          <div class="souvenir-img-wrap small"><div class="img-fallback">🍯</div></div>
          <div class="souvenir-item-info">
            <h4>云莓果酱（Lakka / Hilla）</h4>
            <p>北欧森林珍稀云莓制成，金黄色泽独特。配松饼或优格皆宜，小罐装易携带。</p>
            <span class="souvenir-brand">金色果酱 + 云莓图案标签</span>
          </div>
        </div>
        <div class="souvenir-item">
          <div class="souvenir-img-wrap small"><div class="img-fallback">🟡</div></div>
          <div class="souvenir-item-info">
            <h4>Turun Sinappi 芥末酱</h4>
            <p>图尔库百年芥末品牌（Since 1840），有温和至辛辣多款。包装具北欧设计感。</p>
            <span class="souvenir-brand">黄色瓶身 + 棕色「KOTI sinappi」字样</span>
          </div>
        </div>
        <div class="souvenir-item">
          <div class="souvenir-img-wrap small"><div class="img-fallback">🍬</div></div>
          <div class="souvenir-item-info">
            <h4>Salmiakki 咸甘草糖</h4>
            <p>芬兰人国民零食，口味强烈（咸+甘草）。建议买 Fazer 巧克力包覆款或「温和版」给初次尝试者。</p>
            <span class="souvenir-brand">Fazer 蓝色圆标 + 红白「Super Salmiakki」包装</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 6. 芬兰浴与其他洗浴文化 -->
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
        <div class="info-card">
          <div class="card-label">核心儀式：冷熱交替</div>
          <table class="sauna-table">
            <thead><tr><th>步骤</th><th>说明</th></tr></thead>
            <tbody>
              <tr><td>🔥 蒸桑拿</td><td>在 80–100°C 的木造桑拿房内蒸 10–15 分钟，满身大汗</td></tr>
              <tr><td>❄️ 跳冷水</td><td>直接冲进冰冷海水池或波罗的海中，瞬间收缩血管</td></tr>
              <tr><td>🔄 重复循环</td><td>来回 2–3 次，促进血液循环、加速新陈代谢</td></tr>
            </tbody>
          </table>
          <p style="font-size:0.78rem;color:var(--sub);line-height:1.7;">芬兰人相信：这种「冰火两重天」的冲击能锻炼心血管、释放压力、提升免疫力，是维持身心健康的秘密。</p>
        </div>
        <div class="travel-sub-collapse">
          <div class="travel-sub-header" onclick="toggleSubCollapse(this)">
            <span class="travel-sub-title">🌍 世界洗浴文化比较</span>
            <span class="travel-sub-arrow">▼</span>
          </div>
          <div class="travel-sub-body">
            <table class="sauna-table">
              <thead><tr><th>文化</th><th>核心体验</th></tr></thead>
              <tbody>
                <tr><td>🇫🇮 芬兰浴</td><td>热到窒息 → 跳进冰湖 → 心脏爆炸的快感</td></tr>
                <tr><td>🇯🇵 日本温泉</td><td>静静地泡，看山看雪，什么都不想</td></tr>
                <tr><td>🇹🇷 土耳其浴</td><td>躺着被人搓洗泡泡，像皇室一样被服务</td></tr>
                <tr><td>🇰🇷 韩国汗蒸幕</td><td>全家穿制服躺地板吃东西聊天，社交大于泡澡</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

  </div>
</div>
`;
