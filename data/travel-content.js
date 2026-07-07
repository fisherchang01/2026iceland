// data/travel-content.js
const travelContentHTML = `
    <!-- 1. 城市漫遊指南 (ICON 網格 + 多階折疊) -->
    <div class="icon-grid">
        <div class="app-icon" onclick="toggleIconSection('reykjavik-section')">
            <img src="images/icons/ic-reykjavik.svg" alt="雷市" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
            <span class="icon-emoji" style="display:none;">🇮🇸</span>
            <p>雷克雅維克</p>
        </div>
        <div class="app-icon" onclick="toggleIconSection('helsinki-section')">
            <img src="images/icons/ic-helsinki.svg" alt="赫爾辛基" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
            <span class="icon-emoji" style="display:none;">🇫🇮</span>
            <p>赫爾辛基</p>
        </div>
        <div class="app-icon" onclick="toggleIconSection('shopping-section')">
            <img src="images/icons/ic-shopping.svg" alt="購物" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
            <span class="icon-emoji" style="display:none;">🛍️</span>
            <p>購物指南</p>
        </div>
        <div class="app-icon" onclick="toggleIconSection('sauna-section')">
            <img src="images/icons/ic-sauna.svg" alt="桑拿" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
            <span class="icon-emoji" style="display:none;">🧖</span>
            <p>桑拿文化</p>
        </div>
    </div>

    <!-- 雷克雅維克區塊 -->
    <div id="reykjavik-section" class="icon-section-content">
        <div class="travel-collapse">
            <div class="collapse-header" onclick="toggleCollapse(this)">🇮🇸 雷克雅維克市區 <span class="arrow">▼</span></div>
            <div class="collapse-body">
                <!-- 獨立景點：大教堂 -->
                <div class="travel-sub-collapse">
                    <div class="sub-collapse-header" onclick="toggleSubCollapse(this)">🏛️ Hallgrímskirkja 大教堂 <span class="arrow">▼</span></div>
                    <div class="sub-collapse-body">
                        <p>雷克雅維克地標，建議從山頂俯瞰市區全景。</p>
                    </div>
                </div>
                <!-- 路線 A -->
                <div class="travel-sub-collapse">
                    <div class="sub-collapse-header" onclick="toggleSubCollapse(this)">🚶‍♂️ 漫遊路線 A (大教堂 → 音樂廳) <span class="arrow">▼</span></div>
                    <div class="sub-collapse-body">
                        <p><strong>1. 大教堂</strong> ➔ <strong>2. 彩虹街</strong> (Handknitting, Geysir) ➔ <strong>3. 主街</strong> (Omnom, 66°North, Farmers Market, Puffin, Saltverk) ➔ <strong>4. Grandi 舊港區</strong> (Omnom 工廠店, Farmers Market, 藍湖保養品) ➔ <strong>5. Harpa 音樂廳</strong></p>
                    </div>
                </div>
                <!-- 路線 B -->
                <div class="travel-sub-collapse">
                    <div class="sub-collapse-header" onclick="toggleSubCollapse(this)">🚶‍♀️ 漫遊路線 B (音樂廳 → 大教堂) <span class="arrow">▼</span></div>
                    <div class="sub-collapse-body">
                        <p><strong>1. Harpa 音樂廳</strong> ➔ <strong>2. Grandi 舊港區</strong> (Omnom 工廠店, Farmers Market, 藍湖保養品) ➔ <strong>3. 主街</strong> (Omnom, 66°North, Farmers Market, Puffin, Saltverk) ➔ <strong>4. 彩虹街</strong> (Handknitting, Geysir) ➔ <strong>5. 大教堂</strong></p>
                    </div>
                </div>
                <!-- 獨立景點：Harpa -->
                <div class="travel-sub-collapse">
                    <div class="sub-collapse-header" onclick="toggleSubCollapse(this)">🎵 Harpa 音樂廳 <span class="arrow">▼</span></div>
                    <div class="sub-collapse-body">
                        <p>極具設計感的玻璃建築，內部光影效果絕佳。</p>
                    </div>
                </div>
                <!-- 藍湖 -->
                <div class="travel-sub-collapse">
                    <div class="sub-collapse-header" onclick="toggleSubCollapse(this)">♨️ 藍湖 Blue Lagoon <span class="arrow">▼</span></div>
                    <div class="sub-collapse-body">
                        <p>世界聞名的地熱溫泉，建議提前預約。</p>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- 赫爾辛基區塊 -->
    <div id="helsinki-section" class="icon-section-content">
        <div class="travel-collapse">
            <div class="collapse-header" onclick="toggleCollapse(this)">🇫🇮 赫爾辛基市區 <span class="arrow">▼</span></div>
            <div class="collapse-body">
                <div class="travel-sub-collapse">
                    <div class="sub-collapse-header" onclick="toggleSubCollapse(this)">🏛️ A區. 白教堂週邊 <span class="arrow">▼</span></div>
                    <div class="sub-collapse-body"><p>中央車站 ➔ 大教堂（白教堂） ➔ 參議院廣場 ➔ Aleksanterinkatu 精品街 ➔ 埃斯普拉納公園</p></div>
                </div>
                <div class="travel-sub-collapse">
                    <div class="sub-collapse-header" onclick="toggleSubCollapse(this)">🛍️ B區. 市集廣場週邊 <span class="arrow">▼</span></div>
                    <div class="sub-collapse-body"><p>市集廣場 ➔ 老農貿市場 ➔ 哈維斯·阿曼達噴泉</p></div>
                </div>
                <div class="travel-sub-collapse">
                    <div class="sub-collapse-header" onclick="toggleSubCollapse(this)">🌊 C區. 海濱週邊 <span class="arrow">▼</span></div>
                    <div class="sub-collapse-body"><p>舊港海濱步道 ➔ 烏斯佩斯基大教堂（紅教堂） ➔ 愛之橋</p></div>
                </div>
                <div class="travel-sub-collapse">
                    <div class="sub-collapse-header" onclick="toggleSubCollapse(this)">⛪ D區. 岩石教堂 <span class="arrow">▼</span></div>
                    <div class="sub-collapse-body"><p>由天然岩石開鑿而成的獨特教堂，音響效果極佳。</p></div>
                </div>
                <div class="travel-sub-collapse">
                    <div class="sub-collapse-header" onclick="toggleSubCollapse(this)">🏊 E區. Allas Sea Pool <span class="arrow">▼</span></div>
                    <div class="sub-collapse-body"><p>海濱露天泳池與桑拿，體驗芬蘭夏日風情。</p></div>
                </div>
