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

    // 用 render-travel.js 生成 HTML
    const travelHTMLScript = renderTravelContent(travelData);
    
    // 評估生成的 HTML（這樣可以定義 TRAVEL_HTML 全局變數）
    eval(travelHTMLScript);
    
    console.log('✅ HTML 生成成功');

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
