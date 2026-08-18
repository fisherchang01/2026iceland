/**
 * load-travel-data.js
 * 
 * 中央加載器責任：
 * 1. 從 data/travel-content.json 讀數據
 * 2. 用 render-travel.js 生成 HTML
 * 3. 掛載到頁面
 */

async function loadTravelData() {
  try {
    // 檢查 renderTravelContent 函數是否存在
    if (typeof renderTravelContent !== 'function') {
      console.error('❌ renderTravelContent 函數不存在！請確保 js/render-travel.js 已正確加載');
      return;
    }

    // 從 JSON 文件讀數據
    const response = await fetch('data/travel-content.json');
    if (!response.ok) {
      console.error(`❌ 無法讀取 data/travel-content.json (狀態: ${response.status})`);
      return;
    }

    const travelData = await response.json();
    console.log(`✅ 讀取 data/travel-content.json 成功，${travelData.categories.length} 個分類`);

    // 用 render-travel.js 生成 HTML（renderTravelContent 返回純 HTML 字符串）
    const html = renderTravelContent(travelData);
    
    // 🔑 關鍵：設置全局 window.TRAVEL_HTML，以便其他腳本（如 render-overview.js）可以訪問
    if (html) {
      window.TRAVEL_HTML = html;
      console.log('✅ HTML 生成成功，已設置為全局變數 window.TRAVEL_HTML');
      
      // 如果 mountTabContent 已經定義，馬上調用（如果 init.js 還沒執行）
      // 或者等待 init.js 自己調用（更正常的流程）
      if (typeof mountTabContent === 'function') {
        // 稍微延遲執行，確保其他 DOM 結構已準備好
        setTimeout(() => {
          try {
            mountTabContent();
            console.log('✅ 體驗頁面內容已掛載');
          } catch (e) {
            console.error('❌ mountTabContent 執行失敗:', e);
          }
        }, 100);
      }
    } else {
      console.error('❌ renderTravelContent 返回空值');
    }

  } catch (error) {
    console.error('❌ loadTravelData 錯誤:', error);
  }
}

// 在 DOM 加載完成後執行
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadTravelData);
} else {
  // 如果已經加載完成，直接執行
  loadTravelData();
}
