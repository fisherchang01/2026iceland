// 這個檔案是「網站啟動時的初始化流程（載入順序：最後執行）」，一般調整行程/景點內容不需要改這裡，改 data/ 資料夾裡的檔案即可。

// ===== 初始化 =====
applyTripConfig();
mountTabContent();
initBudgetForm();
renderDocs();
initCatalogPages();
renderOverview();
setHeaderDefaultBanner();
renderItinSelector();
setItinActive(null);
updateItinMap(null);
renderExpenses();
renderSummary();
// 注意：費用雲端同步的啟動（initCloudExpensesSync）改由 js/firebase-config.js
// 自己載入完成後主動呼叫，不放在這裡執行，避免跟 Firebase 腳本的載入順序互相依賴。

function applyTripConfig() {
  var config = TRIP_DATA.config;
  document.title = config.siteTitle || config.tripName || '旅行行程';
  var root = document.documentElement;
  var theme = config.theme || {};
  if (theme.primary) root.style.setProperty('--primary', theme.primary);
  if (theme.accent) root.style.setProperty('--accent', theme.accent);
  if (theme.background) root.style.setProperty('--bg', theme.background);
  if (theme.header) root.style.setProperty('--header-bg', theme.header);
  var themeMeta = document.querySelector('meta[name="theme-color"]');
  if (!themeMeta) {
    themeMeta = document.createElement('meta');
    themeMeta.name = 'theme-color';
    document.head.appendChild(themeMeta);
  }
  themeMeta.content = theme.primary || '#2c5f6e';
}
