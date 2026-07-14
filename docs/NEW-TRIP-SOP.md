# 新旅程建立與部署 SOP

## A. 建立 Repository

1. 在此 Repository 點選 **Use this template**。
2. 選擇 **Create a new repository**。
3. Repository 名稱建議使用小寫英文與年份，例如 `2027japan`。
4. 建立後先不要修改 `js/`；所有旅程內容都由 `data/`、`images/`、`docs/` 替換。

## B. 替換基本資料

1. 修改 `data/trip-config.js`：名稱、國家、日期、時區、幣別、色彩。
2. 修改 `data/trip-days.js`：每日日期、標題、摘要、封面圖。
3. 修改 `data/trip-details.js`：每日景點、交通、住宿、提醒與路線圖。
4. 修改 `data/budget-config.js`：同行者、幣別、匯率與本機儲存名稱。
5. 修改 `data/docs-content.js`，並刪除 `docs/` 中不屬於新旅程的文件。
6. 依需要替換 `data/travel-content.js`、`data/other-content.js` 與 `data/catalog-config.js`。

沒有內容的選填欄位直接刪除；不要建立空標題或空卡片。

## C. 費用同步

Firebase 僅供費用同步：

1. 若新旅程不使用同步，把 `data/firebase-settings.js` 的 `enabled` 改為 `false`。
2. 若沿用同一 Firebase 專案，務必把 `expensesPath` 改成新的唯一值，例如 `trips/japan2027/expenses`。
3. 若使用新 Firebase 專案，替換 `config` 內容及 `expensesPath`。

不要共用舊旅程的 `expensesPath`，否則兩趟旅程的消費會混在一起。

## D. 圖片處理

景點照片：

- 橫式：thumb 480×360、medium 960×720、large 1200×900
- 直式：thumb 360×480、medium 720×960、large 900×1200
- 格式：WebP
- 建議品質：thumb 76、medium 82、large 85
- 三個尺寸必須使用相同檔名，分別放入 `images/spots/thumb`、`medium`、`large`

路線圖：

- 顯示版放 `images/routes/`，建議寬度 1200–1400px、WebP 品質 80–88
- 放大版放 `images/routes/large/`
- 兩個資料夾使用相同檔名
- 圖上文字需以手機人工檢查清晰度

完成後同步更新 `data/image-manifest.js`。不要把原始 JPG／PNG 留在網站資料夾造成重複。

## E. 本機驗收

至少檢查：

- 首頁、每日切換、路線圖與景點詳情可以開啟
- 沒有資料的選填區塊不會出現空卡
- 景點照片小／中／大尺寸都存在
- 手機寬度下沒有橫向捲動或明顯跳動
- 費用頁同行者、幣別與匯率正確
- 文件連結可開啟
- Firebase 關閉或斷線時仍可在本機記帳

## F. GitHub Pages 部署

1. 將變更提交並推送至 `main`。
2. 到 Repository 的 **Settings → Pages**。
3. Source 選擇 **Deploy from a branch**，分支選 `main`、資料夾選 `/ (root)`。
4. 等待 Actions 的 `pages build and deployment` 顯示成功。
5. 以手機開啟 `https://你的帳號.github.io/Repository名稱/` 完成最後驗收。

每次更新仍採相同步驟：修改資料 → 本機驗收 → 提交 → 推送 → 確認 Pages。
