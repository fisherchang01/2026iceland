// 這個檔案是「網站啟動時的初始化流程（載入順序：最後執行）」，一般調整行程/景點內容不需要改這裡，改 data/ 資料夾裡的檔案即可。

// ===== 初始化 =====
mountTabContent();
renderDocs();
renderOverview();
setHeader(TRIP_META.headerTitle, TRIP_META.headerSub);
renderExpenses();
renderSummary();
// 注意：費用雲端同步的啟動（initCloudExpensesSync）改由 js/firebase-config.js
// 自己載入完成後主動呼叫，不放在這裡執行，避免跟 Firebase 腳本的載入順序互相依賴。
