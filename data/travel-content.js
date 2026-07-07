/**
 * travel-content.js
 * 定義旅遊頁籤的內容結構 (多階折疊 + ICON 網格)
 */

// 定義圖片基礎路徑 (若圖片尚未上傳，會顯示備用文字或 Emoji)
const IMG_PATH = 'images/icons/';

// ---------------------------------------------------------
// 1. 內容產生邏輯 (使用 Template Literals)
// ---------------------------------------------------------

const TRAVEL_HTML = `
<div class="travel-container">
  
  <!-- === 冰島：雷克雅維克 (Reykjavik) === -->
  <div class="collapse-group">
    <button class="collapse-header" onclick="toggleCollapse(this)">
      <span class="icon">🇮🇸</span> 
      <span class="title">雷克雅維克 (Reykjavik)</span>
      <span class="arrow">▼</span>
    </button>
    
    <div class="collapse-content">
      
      <!-- 獨立景點 -->
      <div class="sub-item">
        <div class="sub-header" onclick="toggleSubItem(this)">
          <img src="${IMG_PATH}ic-church.svg" onerror="this.style.display='none'" alt="icon" class="item-icon">
          <span>Hallgrímskirkja 大教堂</span>
        </div>
        <div class="sub-body">
          <p>雷市地標，外觀模仿玄武岩流紋。</p>
          <ul>
            <li>建議安排：登塔俯瞰全市色彩屋頂。</li>
            <li>周邊：Skólavörðustígur 彩虹街起點。</li>
          </ul>
        </div>
      </div>

      <!-- 動線 A -->
      <div class="sub-item">
        <div class="sub-header" onclick="toggleSubItem(this)">
          <img src="${IMG_PATH}ic-route-a.svg" onerror="this.style.display='none'" alt="icon" class="item-icon">
          <span>漫遊路線 A：大教堂 → Harpa</span>
        </div>
        <div class="sub-body">
          <ol class="route-list">
            <li><strong>1. 大教堂</strong> (出發點)</li>
            <li><strong>2. 彩虹街</strong> (Handknitting, Geysir)</li>
            <li><strong>3. 主街 Laugavegur</strong> (Omnom, 66°North, Puffin, Saltverk)</li>
            <li><strong>4. Grandi 舊港區</strong> (Omnom 工廠店, Farmers Market, 藍湖保養品)</li>
            <li><strong>5. Harpa 音樂廳</strong> (終點，看夕陽)</li>
          </ol>
        </div>
      </div>

      <!-- 動線 B -->
      <div class="sub-item">
        <div class="sub-header" onclick="toggleSubItem(this)">
          <img src="${IMG_PATH}ic-route-b.svg" onerror="this.style.display='none'" alt="icon" class="item-icon">
          <span>漫遊路線 B：Harpa → 大教堂</span>
        </div>
        <div class="sub-body">
          <ol class="route-list">
            <li><strong>1. Harpa 音樂廳</strong> (出發點)</li>
            <li><strong>2. Grandi 舊港區</strong> (Omnom 工廠店, Farmers Market, 藍湖保養品)</li>
            <li><strong>3. 主街 Laugavegur</strong> (Omnom, 66°North, Puffin, Saltverk)</li>
            <li><strong>4. 彩虹街</strong> (Handknitting, Geysir)</li>
            <li><strong>5. 大教堂</strong> (終點)</li>
          </ol>
        </div>
      </div>

    </div>
  </div>

  <!-- === 芬蘭：赫爾辛基 (Helsinki) === -->
  <div class="collapse-group">
    <button class="collapse-header" onclick="toggleCollapse(this)">
      <span class="icon">🇫🇮</span> 
      <span class="title">赫爾辛基 (Helsinki)</span>
      <span class="arrow">▼</span>
    </button>
    
    <div class="collapse-content">
      
      <!-- A區 -->
      <div class="sub-item">
        <div class="sub-header" onclick="toggleSubItem(this)">
          <img src="${IMG_PATH}ic-hki-a.svg" onerror="this.style.display='none'" alt="icon" class="item-icon">
          <span>A區. 白教堂週邊</span>
        </div>
        <div class="sub-body">
          <p>經典市中心路線。</p>
          <div class="flow-arrow">中央車站 ➔ 大教堂(白教堂) ➔ 參議院廣場 ➔ Aleksanterinkatu 精品街 ➔ 埃斯普拉納公園</div>
        </div>
      </div>

      <!-- B區 -->
      <div class="sub-item">
        <div class="sub-header" onclick="toggleSubItem(this)">
          <img src="${IMG_PATH}ic-hki-b.svg" onerror="this.style.display='none'" alt="icon" class="item-icon">
          <span>B區. 市集廣場週邊</span>
        </div>
        <div class="sub-body">
          <p>海港生活體驗。</p>
          <div class="flow-arrow">市集廣場 ➔ 老農貿市場 ➔ 哈維斯·阿曼達噴泉</div>
        </div>
      </div>

      <!-- C區 -->
      <div class="sub-item">
        <div class="sub-header" onclick="toggleSubItem(this)">
          <img src="${IMG_PATH}ic-hki-c.svg" onerror="this.style.display='none'" alt="icon" class="item-icon">
          <span>C區. 海濱週邊</span>
        </div>
        <div class="sub-body">
          <p>紅教堂與海景。</p>
          <div class="flow-arrow">舊港海濱步道 ➔ 烏斯佩斯基大教堂(紅教堂) ➔ 愛之橋</div>
        </div>
      </div>

      <!-- D區 & E區 -->
      <div class="sub-item">
        <div class="sub-header" onclick="toggleSubItem(this)">
          <img src="${IMG_PATH}ic-hki-de.svg" onerror="this.style.display='none'" alt="icon" class="item-icon">
          <span>D/E區. 岩石教堂 & Allas Sea Pool</span>
        </div>
        <div class="sub-body">
          <ul>
            <li><strong>D區：</strong>岩石教堂 (Temppeliaukio Church)，直接在岩石中挖掘而成。</li>
            <li><strong>E區：</strong>Allas Sea Pool，海港旁的露天泳池與桑拿。</li>
            <li style="margin-top:8px; color:#666;">最後返回中央車站。</li>
          </ul>
        </div>
      </div>

    </div>
  </div>

</div>
`;

// ---------------------------------------------------------
// 2. 互動功能函數 (確保這些函數存在於全域或正確作用域)
// ---------------------------------------------------------

// 切換主要折疊 (城市層級)
window.toggleCollapse = function(btn) {
  btn.classList.toggle('active');
  const content = btn.nextElementSibling;
  if (content.style.maxHeight) {
    content.style.maxHeight = null;
  } else {
    content.style.maxHeight = content.scrollHeight + "px";
  }
};

// 切換子項目折疊 (路線層級)
window.toggleSubItem = function(header) {
  header.classList.toggle('active');
  const body = header.nextElementSibling;
  // 這裡不需要計算 scrollHeight，因為父層已經限制了高度，
  // 我們只需要簡單的 display 切換或 max-height 動畫即可
  if (body.style.display === "block") {
    body.style.display = "none";
  } else {
    body.style.display = "block";
    // 重新計算父層高度以包含展開的內容
    const parentContent = header.closest('.collapse-content');
    if(parentContent && parentContent.style.maxHeight){
       parentContent.style.maxHeight = parentContent.scrollHeight + body.scrollHeight + "px";
    }
  }
};
