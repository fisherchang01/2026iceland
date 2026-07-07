/**
 * travel-content.js
 * 旅遊頁籤內容資料 (純 HTML 字串 + 內聯樣式)
 * 變數：TRAVEL_CONTENT
 */

const TRAVEL_CONTENT = `
<div style="font-family: 'Noto Sans SC', sans-serif; color: #333; line-height: 1.6;">

  <!-- === 1. 雷克雅維克 (Reykjavik) === -->
  <div style="margin-bottom: 15px; border: 1px solid #e0e0e0; border-radius: 12px; overflow: hidden; background: #fff;">
    
    <!-- 標題 -->
    <div onclick="
      const c = this.nextElementSibling; 
      const a = this.querySelector('.arrow');
      if(c.style.maxHeight){ c.style.maxHeight=null; a.style.transform='rotate(0deg)'; }
      else { c.style.maxHeight=c.scrollHeight+'px'; a.style.transform='rotate(180deg)'; }
    " style="padding: 15px; background: #f8f9fa; cursor: pointer; display: flex; justify-content: space-between; align-items: center; font-weight: bold; font-size: 16px; user-select: none;">
      <span>🇮🇸 雷克雅維克 (Reykjavik)</span>
      <span class="arrow" style="transition: 0.3s; font-size: 12px;">▼</span>
    </div>

    <!-- 內容區 -->
    <div style="max-height: 0; overflow: hidden; transition: max-height 0.3s ease; background: #fff;">
      <div style="padding: 15px; border-top: 1px solid #eee;">
        
        <!-- 獨立景點：大教堂 -->
        <div style="margin-bottom: 12px; padding-left: 10px; border-left: 3px solid #007bff;">
          <div style="font-weight: 600; color: #007bff;">🏛️ Hallgrímskirkja 大教堂</div>
          <div style="font-size: 14px; color: #666; margin-top: 4px;">雷市地標，外觀模仿玄武岩流紋。建議登塔俯瞰全市色彩屋頂。</div>
        </div>

        <!-- 動線 A -->
        <div style="margin-bottom: 12px; padding-left: 10px; border-left: 3px solid #28a745;">
          <div onclick="
            const c = this.nextElementSibling; 
            const a = this.querySelector('.arrow');
            if(c.style.maxHeight){ c.style.maxHeight=null; a.style.transform='rotate(0deg)'; }
            else { c.style.maxHeight=c.scrollHeight+'px'; a.style.transform='rotate(180deg)'; }
          " style="font-weight: 600; color: #28a745; cursor: pointer; display: flex; justify-content: space-between; align-items: center; user-select: none;">
            <span>🚶‍♂️ 漫遊路線 A：大教堂 → Harpa</span>
            <span class="arrow" style="transition: 0.3s; font-size: 10px;">▼</span>
          </div>
          <div style="max-height: 0; overflow: hidden; transition: max-height 0.3s ease; font-size: 14px; color: #555; margin-top: 5px;">
            <ol style="margin: 5px 0 0 20px; padding: 0;">
              <li><strong>1. 大教堂</strong> (出發點)</li>
              <li><strong>2. 彩虹街</strong> (Handknitting, Geysir)</li>
              <li><strong>3. 主街 Laugavegur</strong> (Omnom, 66°North, Puffin, Saltverk)</li>
              <li><strong>4. Grandi 舊港區</strong> (Omnom 工廠店, Farmers Market, 藍湖保養品)</li>
              <li><strong>5. Harpa 音樂廳</strong> (終點，看夕陽)</li>
            </ol>
          </div>
        </div>

        <!-- 動線 B -->
        <div style="margin-bottom: 12px; padding-left: 10px; border-left: 3px solid #dc3545;">
          <div onclick="
            const c = this.nextElementSibling; 
            const a = this.querySelector('.arrow');
            if(c.style.maxHeight){ c.style.maxHeight=null; a.style.transform='rotate(0deg)'; }
            else { c.style.maxHeight=c.scrollHeight+'px'; a.style.transform='rotate(180deg)'; }
          " style="font-weight: 600; color: #dc3545; cursor: pointer; display: flex; justify-content: space-between; align-items: center; user-select: none;">
            <span>🚶‍♀️ 漫遊路線 B：Harpa → 大教堂</span>
            <span class="arrow" style="transition: 0.3s; font-size: 10px;">▼</span>
          </div>
          <div style="max-height: 0; overflow: hidden; transition: max-height 0.3s ease; font-size: 14px; color: #555; margin-top: 5px;">
            <ol style="margin: 5px 0 0 20px; padding: 0;">
              <li><strong>1. Harpa 音樂廳</strong> (出發點)</li>
              <li><strong>2. Grandi 舊港區</strong> (Omnom 工廠店, Farmers Market, 藍湖保養品)</li>
              <li><strong>3. 主街 Laugavegur</strong> (Omnom, 66°North, Puffin, Saltverk)</li>
              <li><strong>4. 彩虹街</strong> (Handknitting, Geysir)</li>
              <li><strong>5. 大教堂</strong> (終點)</li>
            </ol>
          </div>
        </div>

        <!-- 獨立景點：Harpa -->
        <div style="margin-bottom: 12px; padding-left: 10px; border-left: 3px solid #6f42c1;">
          <div style="font-weight: 600; color: #6f42c1;">🎵 Harpa 音樂廳</div>
          <div style="font-size: 14px; color: #666; margin-top: 4px;">海港邊的玻璃建築，建議傍晚前往欣賞夕陽與燈光秀。</div>
        </div>

        <!-- 藍湖 -->
        <div style="padding-left: 10px; border-left: 3px solid #17a2b8;">
          <div style="font-weight: 600; color: #17a2b8;">♨️ 藍湖 (Blue Lagoon)</div>
          <div style="font-size: 14px; color: #666; margin-top: 4px;">世界聞名的地熱溫泉，需提前預約。</div>
        </div>

      </div>
    </div>
  </div>

  <!-- === 2. 赫爾辛基 (Helsinki) === -->
  <div style="margin-bottom: 15px; border: 1px solid #e0e0e0; border-radius: 12px; overflow: hidden; background: #fff;">
    
    <!-- 標題 -->
    <div onclick="
      const c = this.nextElementSibling; 
      const a = this.querySelector('.arrow');
      if(c.style.maxHeight){ c.style.maxHeight=null; a.style.transform='rotate(0deg)'; }
      else { c.style.maxHeight=c.scrollHeight+'px'; a.style.transform='rotate(180deg)'; }
    " style="padding: 15px; background: #f8f9fa; cursor: pointer; display: flex; justify-content: space-between; align-items: center; font-weight: bold; font-size: 16px; user-select: none;">
      <span>🇫🇮 赫爾辛基 (Helsinki)</span>
      <span class="arrow" style="transition: 0.3s; font-size: 12px;">▼</span>
    </div>

    <!-- 內容區 -->
    <div style="max-height: 0; overflow: hidden; transition: max-height 0.3s ease; background: #fff;">
      <div style="padding: 15px; border-top: 1px solid #eee;">
        
        <!-- A區 -->
        <div style="margin-bottom: 12px; padding-left: 10px; border-left: 3px solid #007bff;">
          <div onclick="
            const c = this.nextElementSibling; 
            const a = this.querySelector('.arrow');
            if(c.style.maxHeight){ c.style.maxHeight=null; a.style.transform='rotate(0deg)'; }
            else { c.style.maxHeight=c.scrollHeight+'px'; a.style.transform='rotate(180deg)'; }
          " style="font-weight: 600; color: #007bff; cursor: pointer; display: flex; justify-content: space-between; align-items: center; user-select: none;">
            <span>🏛️ A區. 白教堂週邊</span>
            <span class="arrow" style="transition: 0.3s; font-size: 10px;">▼</span>
          </div>
          <div style="max-height: 0; overflow: hidden; transition: max-height 0.3s ease; font-size: 14px; color: #555; margin-top: 5px;">
            <div style="margin: 5px 0;">中央車站 ➔ 大教堂(白教堂) ➔ 參議院廣場 ➔ Aleksanterinkatu 精品街 ➔ 埃斯普拉納公園</div>
          </div>
        </div>

        <!-- B區 -->
        <div style="margin-bottom: 12px; padding-left: 10px; border-left: 3px solid #fd7e14;">
          <div onclick="
            const c = this.nextElementSibling; 
            const a = this.querySelector('.arrow');
            if(c.style.maxHeight){ c.style.maxHeight=null; a.style.transform='rotate(0deg)'; }
            else { c.style.maxHeight=c.scrollHeight+'px'; a.style.transform='rotate(180deg)'; }
          " style="font-weight: 600; color: #fd7e14; cursor: pointer; display: flex; justify-content: space-between; align-items: center; user-select: none;">
            <span>🛍️ B區. 市集廣場週邊</span>
            <span class="arrow" style="transition: 0.3s; font-size: 10px;">▼</span>
          </div>
          <div style="max-height: 0; overflow: hidden; transition: max-height 0.3s ease; font-size: 14px; color: #555; margin-top: 5px;">
            <div style="margin: 5px 0;">市集廣場 ➔ 老農貿市場 ➔ 哈維斯·阿曼達噴泉</div>
          </div>
        </div>

        <!-- C區 -->
        <div style="margin-bottom: 12px; padding-left: 10px; border-left: 3px solid #20c997;">
          <div onclick="
            const c = this.nextElementSibling; 
            const a = this.querySelector('.arrow');
            if(c.style.maxHeight){ c.style.maxHeight=null; a.style.transform='rotate(0deg)'; }
            else { c.style.maxHeight=c.scrollHeight+'px'; a.style.transform='rotate(180deg)'; }
          " style="font-weight: 600; color: #20c997; cursor: pointer; display: flex; justify-content: space-between; align-items: center; user-select: none;">
            <span>🌊 C區. 海濱週邊</span>
            <span class="arrow" style="transition: 0.3s; font-size: 10px;">▼</span>
          </div>
          <div style="max-height: 0; overflow: hidden; transition: max-height 0.3s ease; font-size: 14px; color: #555; margin-top: 5px;">
            <div style="margin: 5px 0;">舊港海濱步道 ➔ 烏斯佩斯基大教堂(紅教堂) ➔ 愛之橋</div>
          </div>
        </div>

        <!-- D區 -->
        <div style="margin-bottom: 12px; padding-left: 10px; border-left: 3px solid #6f42c1;">
          <div style="font-weight: 600; color: #6f42c1;">⛪ D區. 岩石教堂</div>
          <div style="font-size: 14px; color: #666; margin-top: 4px;">Temppeliaukio Church，直接在岩石中挖掘而成，聲學效果極佳。</div>
        </div>

        <!-- E區 -->
        <div style="padding-left: 10px; border-left: 3px solid #e83e8c;">
          <div style="font-weight: 600; color: #e83e8c;">🏊 E區. Allas Sea Pool</div>
          <div style="font-size: 14px; color: #666; margin-top: 4px;">海港旁的露天泳池與桑拿，最後返回中央車站。</div>
        </div>

      </div>
    </div>
  </div>

</div>
`;
