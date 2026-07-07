/**
 * travel-content.js
 * 旅遊頁內容資料 (純 HTML 字串)
 * 變數名稱：TRAVEL_HTML (對應 render-overview.js 中的 mountTabContent)
 */

const TRAVEL_HTML = `
<div style="font-family: 'Noto Sans SC', sans-serif; color: #333; line-height: 1.6; padding: 0 15px; box-sizing: border-box;">

  <!-- === 1. 雷克雅維克 (Reykjavik) === -->
  <div style="margin-bottom: 15px; border: 1px solid #e0e0e0; border-radius: 12px; overflow: hidden; background: #fff; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
    
    <!-- 標題列 -->
    <div onclick="
      const c = this.nextElementSibling; 
      const a = this.querySelector('.arrow');
      if(c.style.maxHeight){ 
        c.style.maxHeight=null; 
        a.style.transform='rotate(0deg)'; 
      } else { 
        c.style.maxHeight=c.scrollHeight+'px'; 
        a.style.transform='rotate(180deg)'; 
      }
    " style="padding: 15px; background: #f8f9fa; cursor: pointer; display: flex; justify-content: space-between; align-items: center; font-weight: bold; font-size: 16px; user-select: none; border-bottom: 1px solid #eee;">
      <span>🇮🇸 雷克雅維克 (Reykjavik)</span>
      <span class="arrow" style="transition: 0.3s; font-size: 12px;">▼</span>
    </div>

    <!-- 內容區 -->
    <div style="max-height: 0; overflow: hidden; transition: max-height 0.3s ease; background: #fff;">
      <div style="padding: 15px;">

        <!-- 獨立景點：大教堂 -->
        <div style="margin-bottom: 12px; padding: 12px; border-radius: 8px; background: #f0f8ff; border-left: 4px solid #007bff;">
          <div style="font-weight: 600; color: #0056b3; font-size: 14px;">🏛️ Hallgrímskirkja 大教堂</div>
          <div style="font-size: 13px; color: #555; margin-top: 4px;">雷市地標，外觀模仿玄武岩流紋。建議登塔俯瞰全市色彩屋頂與海港景色。</div>
        </div>

        <!-- 動線 A：大教堂 → Harpa -->
        <div style="margin-bottom: 12px; padding: 12px; border-radius: 8px; background: #f8fff0; border-left: 4px solid #28a745;">
          <div onclick="
            const c = this.nextElementSibling; 
            const a = this.querySelector('.arrow');
            if(c.style.maxHeight){ c.style.maxHeight=null; a.style.transform='rotate(0deg)'; }
            else { c.style.maxHeight=c.scrollHeight+'px'; a.style.transform='rotate(180deg)'; }
          " style="font-weight: 600; color: #1e7e34; cursor: pointer; display: flex; justify-content: space-between; align-items: center; user-select: none; font-size: 14px;">
            <span>🚶‍♂️ 漫遊路線 A：大教堂 → Harpa</span>
            <span class="arrow" style="transition: 0.3s; font-size: 10px;">▼</span>
          </div>
          <div style="max-height: 0; overflow: hidden; transition: max-height 0.3s ease; font-size: 13px; color: #555; margin-top: 8px; padding-left: 10px;">
            <ol style="margin: 5px 0 0 15px; padding: 0; line-height: 1.6;">
              <li><strong>1. 大教堂</strong> (出發點)</li>
              <li><strong>2. 彩虹街</strong> (Handknitting, Geysir)</li>
              <li><strong>3. 主街 Laugavegur</strong> (Omnom, 66°North, Puffin, Saltverk)</li>
              <li><strong>4. Grandi 舊港區</strong> (Omnom 工廠店, Farmers Market, 藍湖保養品)</li>
              <li><strong>5. Harpa 音樂廳</strong> (終點，看夕陽)</li>
            </ol>
          </div>
        </div>

        <!-- 動線 B：Harpa → 大教堂 -->
        <div style="margin-bottom: 12px; padding: 12px; border-radius: 8px; background: #fff0f0; border-left: 4px solid #dc3545;">
          <div onclick="
            const c = this.nextElementSibling; 
            const a = this.querySelector('.arrow');
            if(c.style.maxHeight){ c.style.maxHeight=null; a.style.transform='rotate(0deg)'; }
            else { c.style.maxHeight=c.scrollHeight+'px'; a.style.transform='rotate(180deg)'; }
          " style="font-weight: 600; color: #992222; cursor: pointer; display: flex; justify-content: space-between; align-items: center; user-select: none; font-size: 14px;">
            <span>🚶‍♀️ 漫遊路線 B：Harpa → 大教堂</span>
            <span class="arrow" style="transition: 0.3s; font-size: 10px;">▼</span>
          </div>
          <div style="max-height: 0; overflow: hidden; transition: max-height 0.3s ease; font-size: 13px; color: #555; margin-top: 8px; padding-left: 10px;">
            <ol style="margin: 5px 0 0 15px; padding: 0; line-height: 1.6;">
              <li><strong>1. Harpa 音樂廳</strong> (出發點)</li>
              <li><strong>2. Grandi 舊港區</strong> (Omnom 工廠店, Farmers Market, 藍湖保養品)</li>
              <li><strong>3. 主街 Laugavegur</strong> (Omnom, 66°North, Puffin, Saltverk)</li>
              <li><strong>4. 彩虹街</strong> (Handknitting, Geysir)</li>
              <li><strong>5. 大教堂</strong> (終點)</li>
            </ol>
          </div>
        </div>

        <!-- 獨立景點：Harpa -->
        <div style="margin-bottom: 12px; padding: 12px; border-radius: 8px; background: #f0f0ff; border-left: 4px solid #6f42c1;">
          <div style="font-weight: 600; color: #4b0082; font-size: 14px;">🎵 Harpa 音樂廳</div>
          <div style="font-size: 13px; color: #555; margin-top: 4px;">海港邊的玻璃建築，幾何切割的外牆非常夢幻。建議傍晚前往欣賞夕陽與燈光秀。</div>
        </div>

        <!-- 獨立景點：藍湖 -->
        <div style="padding: 12px; border-radius: 8px; background: #e0ffff; border-left: 4px solid #17a2b8;">
          <div style="font-weight: 600; color: #008b8b; font-size: 14px;">♨️ 藍湖 (Blue Lagoon)</div>
          <div style="font-size: 13px; color: #555; margin-top: 4px;">世界聞名的地熱溫泉，乳白色的泥漿對皮膚很好。注意：距離市區約 50 分鐘車程，需提前預約。</div>
        </div>

      </div>
    </div>
  </div>

  <!-- === 2. 赫爾辛基 (Helsinki) === -->
  <div style="margin-bottom: 15px; border: 1px solid #e0e0e0; border-radius: 12px; overflow: hidden; background: #fff; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
    
    <!-- 標題列 -->
    <div onclick="
      const c = this.nextElementSibling; 
      const a = this.querySelector('.arrow');
      if(c.style.maxHeight){ c.style.maxHeight=null; a.style.transform='rotate(0deg)'; }
      else { c.style.maxHeight=c.scrollHeight+'px'; a.style.transform='rotate(180deg)'; }
    " style="padding: 15px; background: #f8f9fa; cursor: pointer; display: flex; justify-content: space-between; align-items: center; font-weight: bold; font-size: 16px; user-select: none; border-bottom: 1px solid #eee;">
      <span>🇫🇮 赫爾辛基 (Helsinki)</span>
      <span class="arrow" style="transition: 0.3s; font-size: 12px;">▼</span>
    </div>

    <!-- 內容區 -->
    <div style="max-height: 0; overflow: hidden; transition: max-height 0.3s ease; background: #fff;">
      <div style="padding: 15px;">

        <!-- A區：白教堂週邊 -->
        <div style="margin-bottom: 12px; padding: 12px; border-radius: 8px; background: #f0f8ff; border-left: 4px solid #007bff;">
          <div onclick="
            const c = this.nextElementSibling; 
            const a = this.querySelector('.arrow');
            if(c.style.maxHeight){ c.style.maxHeight=null; a.style.transform='rotate(0deg)'; }
            else { c.style.maxHeight=c.scrollHeight+'px'; a.style.transform='rotate(180deg)'; }
          " style="font-weight: 600; color: #0056b3; cursor: pointer; display: flex; justify-content: space-between; align-items: center; user-select: none; font-size: 14px;">
            <span>🏛️ A區. 白教堂週邊</span>
            <span class="arrow" style="transition: 0.3s; font-size: 10px;">▼</span>
          </div>
          <div style="max-height: 0; overflow: hidden; transition: max-height 0.3s ease; font-size: 13px; color: #555; margin-top: 8px; padding-left: 10px;">
            <div style="margin: 5px 0; line-height: 1.6;">
              中央車站 ➔ 大教堂(白教堂) ➔ 參議院廣場 ➔ Aleksanterinkatu 精品街 ➔ 埃斯普拉納公園
            </div>
          </div>
        </div>

        <!-- B區：市集廣場週邊 -->
        <div style="margin-bottom: 12px; padding: 12px; border-radius: 8px; background: #fff3cd; border-left: 4px solid #fd7e14;">
          <div onclick="
            const c = this.nextElementSibling; 
            const a = this.querySelector('.arrow');
            if(c.style.maxHeight){ c.style.maxHeight=null; a.style.transform='rotate(0deg)'; }
            else { c.style.maxHeight=c.scrollHeight+'px'; a.style.transform='rotate(180deg)'; }
          " style="font-weight: 600; color: #8b5a00; cursor: pointer; display: flex; justify-content: space-between; align-items: center; user-select: none; font-size: 14px;">
            <span>🛍️ B區. 市集廣場週邊</span>
            <span class="arrow" style="transition: 0.3s; font-size: 10px;">▼</span>
          </div>
          <div style="max-height: 0; overflow: hidden; transition: max-height 0.3s ease; font-size: 13px; color: #555; margin-top: 8px; padding-left: 10px;">
            <div style="margin: 5px 0; line-height: 1.6;">
              市集廣場 ➔ 老農貿市場 ➔ 哈維斯·阿曼達噴泉
            </div>
          </div>
        </div>

        <!-- C區：海濱週邊 -->
        <div style="margin-bottom: 12px; padding: 12px; border-radius: 8px; background: #d0f4f4; border-left: 4px solid #20c997;">
          <div onclick="
            const c = this.nextElementSibling; 
            const a = this.querySelector('.arrow');
            if(c.style.maxHeight){ c.style.maxHeight=null; a.style.transform='rotate(0deg)'; }
            else { c.style.maxHeight=c.scrollHeight+'px'; a.style.transform='rotate(180deg)'; }
          " style="font-weight: 600; color: #006666; cursor: pointer; display: flex; justify-content: space-between; align-items: center; user-select: none; font-size: 14px;">
            <span>🌊 C區. 海濱週邊</span>
            <span class="arrow" style="transition: 0.3s; font-size: 10px;">▼</span>
          </div>
          <div style="max-height: 0; overflow: hidden; transition: max-height 0.3s ease; font-size: 13px; color: #555; margin-top: 8px; padding-left: 10px;">
            <div style="margin: 5px 0; line-height: 1.6;">
              舊港海濱步道 ➔ 烏斯佩斯基大教堂(紅教堂) ➔ 愛之橋
            </div>
          </div>
        </div>

        <!-- D區：岩石教堂 -->
        <div style="margin-bottom: 12px; padding: 12px; border-radius: 8px; background: #f0f0ff; border-left: 4px solid #6f42c1;">
          <div style="font-weight: 600; color: #4b0082; font-size: 14px;">⛪ D區. 岩石教堂</div>
          <div style="font-size: 13px; color: #555; margin-top: 4px;">Temppeliaukio Church，直接在岩石中挖掘而成，銅頂設計獨特，聲學效果極佳，常有音樂會在此舉辦。</div>
        </div>

        <!-- E區：Allas Sea Pool -->
        <div style="padding: 12px; border-radius: 8px; background: #ffe6f2; border-left: 4px solid #e83e8c;">
          <div style="font-weight: 600; color: #c22; font-size: 14px;">🏊 E區. Allas Sea Pool</div>
          <div style="font-size: 13px; color: #555; margin-top: 4px;">海港旁的露天泳池與桑拿，可以一邊游泳一邊欣賞赫爾辛基港灣景色，是放鬆身心的絕佳去處。最後可返回中央車站。</div>
        </div>

      </div>
    </div>
  </div>

</div>
`;
