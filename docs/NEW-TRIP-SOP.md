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
   
   > ⚠️ **重要隱私提醒**：不要上傳個人敏感文件（機票 PDF、護照掃描、租車合約等）到公開 Repository。這些檔案應存在本地，不提交到 git。已透過 `.gitignore` 排除 `docs/*.pdf`，但應確保 `.gitignore` 設定無誤。詳見 [安全與隱私指南](SECURITY.md)。

6. 依需要替換 `data/travel-content.js`（`TRAVEL_CONTENT`）與 `data/other-content.js`（`OTHER_CONTENT`）。
   這兩個是純資料物件，結構見 [統一資料 Schema](DATA-SCHEMA.md) 第 8 節；`data/catalog-config.js` 的分類清單與尺寸已改為從這兩個檔自動推導，**不需要**手動同步。最省事的做法是先把 `categories` 改成幾個 `items: []` 的空分類，之後再用編輯器補內容。
7. 修改 `manifest.webmanifest` 的網站名稱、簡稱、說明與色彩；需要時替換 `images/app-icon-192.png`、`app-icon-512.png`。

沒有內容的選填欄位直接刪除；不要建立空標題或空卡片。

## C. 費用同步

Firebase 僅供費用同步：

1. 若新旅程不使用同步，把 `data/firebase-settings.js` 的 `enabled` 改為 `false`。
2. 若沿用同一 Firebase 專案，務必把 `expensesPath` 改成新的唯一值，例如 `trips/japan2027/expenses`。
3. 若使用新 Firebase 專案，替換 `config` 內容及 `expensesPath`。

不要共用舊旅程的 `expensesPath`，否則兩趟旅程的消費會混在一起。

## D. 圖片處理

完整規格見 [圖片規格](IMAGES.md)，此處只列建立新旅程時的重點。

**景點照片**
- 同一張圖做兩個尺寸、**檔名完全相同**，分別放 `images/spots/thumb/`（480×360 或 360×480，WebP q76）與 `images/spots/medium/`（960×720 或 720×960，WebP q82）
- `medium` 同時是點擊放大燈箱的最大尺寸，不用再做 large
- 橫式還是直式不用登記，網站載入時自動判斷

**路線圖**
- 放 `images/routes/`，寬 1200–1400px、WebP q80–88
- 顯示版與燈箱共用同一張
- 圖上文字需以手機人工檢查清晰度

**封面與每日卡片橫幅（`images/banners/`）**
- `dayN-card.jpg`：約 2.2:1（例如 900×410），WebP，中央裁切，主體避免貼齊左右邊緣
- `cover-hero.webp`：首頁 hero 封面，由 `trip-config.js` 的 `coverImage` 指定，約 1.2:1～1.3:1（例如 1200×960），WebP q80–85
- 兩者都是 `background-size: cover` 置中裁切，不需分兩個尺寸

**體驗／工具目錄圖片（`images/catalog/`）**

只有兩種尺寸系統，圖片檔名直接寫在資料檔裡（`category.cover` 與 `img` block 的 `src`），不需要改任何 JS：

| 用途 | 決定於 | 比例 | 建議尺寸 |
|---|---|---|---|
| 總覽頁分類卡 | `category.size = "2x4"` | 2.2:1 | 900×410 |
| 總覽頁分類卡 | `category.size = "2x2"` | 1:1 | 800×800 |
| 項目卡封面 | `item.layout = "sm"` | 1:1 | 800×800 |
| 項目卡封面 | `item.layout = "lg"` | 2.2:1 | 900×410 |
| 項目詳情內文圖 | — | 不限，依原始比例顯示 | 寬 900–1200px |

項目卡封面**自動取該項目第一張 `img` block**，不需另外指定。

不要把原始 JPG／PNG 留在網站資料夾造成重複。

## E. 本機驗收

至少檢查：

- 首頁、每日切換、路線圖與景點詳情可以開啟
- **五個頁籤（行程／體驗／工具／費用／極光）都能正常切換，Console 零錯誤**
- **體驗頁與工具頁：總覽卡片、分類 pill 列、項目卡片、詳情彈窗都正常**
- 沒有資料的選填區塊不會出現空卡
- 景點照片 thumb／medium 都存在
- 手機寬度（≤420px）下沒有橫向捲動或明顯跳動
- 費用頁同行者、幣別與匯率正確
- 文件連結可開啟
- Firebase 關閉或斷線時仍可在本機記帳
- 安裝到主畫面後名稱與圖示正確
- 離線時可開啟網站並查看基本行程與住宿；照片大圖與 PDF 不要求離線
- **三個編輯器都能讀取、編輯、上傳，且上傳後網站確實更新**

## F. GitHub Pages 部署

1. 將變更提交並推送至 `main`。
2. 到 Repository 的 **Settings → Pages**。
3. Source 選擇 **Deploy from a branch**，分支選 `main`、資料夾選 `/ (root)`。
4. 等待 Actions 的 `pages build and deployment` 顯示成功。
5. 以手機開啟 `https://你的帳號.github.io/Repository名稱/` 完成最後驗收。

每次更新仍採相同步驟：修改資料 → 驗收 → 提交 → 推送 → 確認 Pages。

## G. 改動 `js/` 或 `css/` 之後

務必同時把 `sw.js` 開頭的 `SHELL_CACHE` 版本字串往上調（例如日期 + 序號），否則舊的 Service Worker 快取不會被清掉，使用者會繼續看到舊版程式。

只改 `data/` 的內容不需要動 `sw.js`——`data/*.js` 已設為 network-first，線上一定拿得到最新內容。
