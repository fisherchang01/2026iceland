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
7. 修改 `manifest.webmanifest` 的網站名稱、簡稱、說明與色彩；需要時替換 `images/app-icon-192.png`、`app-icon-512.png`。

沒有內容的選填欄位直接刪除；不要建立空標題或空卡片。

## C. 費用同步

Firebase 僅供費用同步：

1. 若新旅程不使用同步，把 `data/firebase-settings.js` 的 `enabled` 改為 `false`。
2. 若沿用同一 Firebase 專案，務必把 `expensesPath` 改成新的唯一值，例如 `trips/japan2027/expenses`。
3. 若使用新 Firebase 專案，替換 `config` 內容及 `expensesPath`。

不要共用舊旅程的 `expensesPath`，否則兩趟旅程的消費會混在一起。

## D. 圖片處理

景點照片：

- 橫式：thumb 480×360、medium 960×720
- 直式：thumb 360×480、medium 720×960
- 格式：WebP
- 建議品質：thumb 76、medium 82
- medium 同時也是點擊放大燈箱用的最大尺寸，不用再另外做一份 large
- 兩個尺寸必須使用相同檔名，分別放入 `images/spots/thumb`、`medium`
- 橫式還是直式不用另外登記，網站會在照片載入完成當下自動判斷（看實際尺寸）

路線圖：

- 放 `images/routes/`，建議寬度 1200–1400px、WebP 品質 80–88
- 顯示版跟點擊放大燈箱版共用同一張，不用分開放
- 圖上文字需以手機人工檢查清晰度

封面／每日卡片橫幅（`images/banners/`）：

- `dayN-card.jpg`：顯示區塊固定高度 168px，寬度＝卡片寬（手機約 340–390px），建議比例約 **2.2:1**（例如 900×410px），WebP，畫面裁切以中央為準，主體避免貼在最左右兩側
- `cover-hero.webp`（首頁 `.trip-hero` 封面圖，由 `trip-config.js` 的 `coverImage` 指定，跟體驗／工具頁無關）：顯示區塊高度約 330px、寬度＝裝置寬，建議比例約 **1.2:1～1.3:1**（例如 1200×960px 或 1400×1100px），WebP 品質 80–85
- 這兩種都是 `background-size:cover` 置中裁切，不需要跟景點照片一樣分兩個尺寸

體驗／工具目錄圖片（`images/catalog/`）：

- v23 改版後分成 5 種規格，依「版型 × 列表/詳情」區分，不是同一張圖套所有地方：

  | 用途 | 比例 | 建議尺寸 |
  |---|---|---|
  | 總覽頁 2×4 大卡封面 | 1:1 | 800×800 |
  | 正方形圖文框——列表卡片封面圖 | 4:3 橫式 | 900×675 |
  | 正方形圖文框——詳情頁堆疊圖片 | 3:5 直式 | 900×1500 |
  | 橫式圖文框——列表卡片縮圖 | 1:1 | 800×800 |
  | 橫式圖文框——詳情頁輪播圖片 | 4:3 橫式 | 1200×900 |

- 每個項目依版型準備「列表封面圖」＋「詳情頁圖片（可多張）」，命名建議 `item-cover.webp` / `item-1.webp`、`item-2.webp`…
- 圖片透過 `data-cover`／`data-images` 屬性掛在對應的 HTML 卡片上，不需要改 `js/catalog-nav.js`
- 詳細的版型對應規則見 [統一資料 Schema](DATA-SCHEMA.md) 第 8 節「體驗／工具目錄（catalog）」

不要把原始 JPG／PNG 留在網站資料夾造成重複。

## E. 本機驗收

至少檢查：

- 首頁、每日切換、路線圖與景點詳情可以開啟
- 沒有資料的選填區塊不會出現空卡
- 景點照片小／中／大尺寸都存在
- 手機寬度下沒有橫向捲動或明顯跳動
- 費用頁同行者、幣別與匯率正確
- 文件連結可開啟
- Firebase 關閉或斷線時仍可在本機記帳
- 安裝到主畫面後名稱與圖示正確
- 離線時可開啟網站並查看基本行程與住宿；照片大圖與 PDF 不要求離線

## F. GitHub Pages 部署

1. 將變更提交並推送至 `main`。
2. 到 Repository 的 **Settings → Pages**。
3. Source 選擇 **Deploy from a branch**，分支選 `main`、資料夾選 `/ (root)`。
4. 等待 Actions 的 `pages build and deployment` 顯示成功。
5. 以手機開啟 `https://你的帳號.github.io/Repository名稱/` 完成最後驗收。

每次更新仍採相同步驟：修改資料 → 本機驗收 → 提交 → 推送 → 確認 Pages。
