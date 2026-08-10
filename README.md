# 旅行行程網站模板

這是一套可直接部署到 GitHub Pages 的手機旅行網站模板，使用 HTML、CSS 與原生 JavaScript，不需要建置工具或後端伺服器。

目前 Repository 同時保留「2026 冰島＋芬蘭」實際旅程資料。用 GitHub 的 **Use this template** 建立新 Repository 後，只需替換 `data/`、`images/`、`docs/` 與 `manifest.webmanifest` 的旅程內容，不需修改 `js/` 核心渲染程式。

## 模板結構

- `data/`：旅程設定、每日行程、景點、費用、文件與體驗內容
- `images/`：旅程視覺資源
  - `banners/`：每日卡片與首頁 hero 封面
  - `routes/`：每日路線地圖
  - `spots/thumb/`、`spots/medium/`：景點卡片縮圖與詳情頁圖片
  - `catalog/`：體驗與工具分類圖片
  - `app-icon-*.png`：手機主畫面圖示
- `docs/`：資料結構與新旅程建立說明（⚠️ 不應包含個人敏感文件，見 [安全指南](docs/SECURITY.md)）
- `js/`：共用顯示與互動邏輯，新旅程不需修改
- `css/`：共用版型與主題樣式
- `template/trip-data.example.js`：七大類資料的空白示範
- `manifest.webmanifest`、`sw.js`：加到手機主畫面與有限離線使用

## 建立新旅程

請依序閱讀：

1. [統一資料 Schema](docs/DATA-SCHEMA.md)
2. [新旅程建立與部署 SOP](docs/NEW-TRIP-SOP.md)
3. [圖片資料夾與命名規則](images/README.md)

Firebase 僅用於費用同步。新旅程需在 `data/firebase-settings.js` 使用獨立路徑，或將 `enabled` 設為 `false`；不要將 Firebase 擴大到其他功能。
