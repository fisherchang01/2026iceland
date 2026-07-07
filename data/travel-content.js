/**
 * travel-content.js
 * 旅遊頁籤內容資料 (修正版)
 * 變數名稱：TRAVEL_HTML
 */

const TRAVEL_HTML = `
<div style="font-family: 'Noto Sans SC', sans-serif; color: #333; line-height: 1.6; padding-bottom: 80px;">

  <!-- === 1. 雷克雅維克 (Reykjavik) === -->
  <div style="margin: 15px; border: 1px solid #e0e0e0; border-radius: 12px; overflow: hidden; background: #fff; box-shadow: 0 4px 12px rgba(0,0,0,0.08);">
    
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

  <!-- === 2. 赫爾辛基 (Helsinki) === -->
  <div style="margin: 15px; border: 1px solid #e0e0e0; border-radius: 12px; overflow: hidden; background: #fff; box-shadow: 0 4px 12px rgba(0,0,0,0.08);">
    
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

</div>
`;
