// 這個檔案是「網站啟動時的初始化流程（載入順序：最後執行）」，一般調整行程/景點內容不需要改這裡，改 data/ 資料夾裡的檔案即可。

// ===== 初始化 =====
mountTabContent();
renderDocs();
renderOverview();
setHeader(TRIP_META.headerTitle, TRIP_META.headerSub);
renderExpenses();
renderSummary();
initCloudExpensesSync();
