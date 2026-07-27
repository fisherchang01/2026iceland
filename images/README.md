# 圖片資料夾與命名規則

## 資料夾

- `banners/`：每日總覽卡片封面（`dayN-card.jpg`）與首頁 `.trip-hero` 封面圖（`cover-hero.webp`，在 `trip-config.js` 的 `coverImage` 指定）
- `routes/`：每日路線圖，顯示版跟點擊放大燈箱版共用同一張，不用分開放
- `spots/thumb/`：景點卡片小圖
- `spots/medium/`：景點詳情用圖，同時也是點擊放大燈箱版的最大尺寸
- `catalog/`：體驗、工具目錄的分類與商品圖片
- `app-icon-192.png`、`app-icon-512.png`：加到手機主畫面的 App 圖示

> ⚠️ 體驗頁／工具頁本來各有一張「滿版大卡 Hero」共用 `cover-hero.webp`，v23 改版已整段移除；現在 `cover-hero.webp` 只用在首頁 `.trip-hero`，跟體驗／工具頁無關。

## 各用途建議比例與尺寸

| 用途 | 檔案位置 | 顯示比例 | 建議尺寸 | 格式／品質 |
|---|---|---|---|---|
| 景點縮圖（橫式） | `spots/thumb/` | 4:3 | 480×360 | WebP q76 |
| 景點縮圖（直式） | `spots/thumb/` | 3:4 | 360×480 | WebP q76 |
| 景點詳情大圖（橫式） | `spots/medium/` | 4:3 | 960×720 | WebP q82 |
| 景點詳情大圖（直式） | `spots/medium/` | 3:4 | 720×960 | WebP q82 |
| 路線圖 | `routes/` | 依實際地圖，無強制 | 寬 1200–1400px | WebP q80–88 |
| 每日封面卡 | `banners/dayN-card.jpg` | 約 2.2:1 | 約 900×410 | WebP |
| 首頁 `.trip-hero` 封面圖 | `banners/cover-hero.webp` | 約 1.2:1～1.3:1 | 約 1200×960 | WebP q80–85 |
| 體驗／工具總覽頁 2×4 大卡封面 | `catalog/` | 1:1 | 800×800 | WebP |
| 正方形圖文框——列表卡片封面圖 | `catalog/` | 4:3（橫式） | 900×675 | WebP |
| 正方形圖文框——詳情頁堆疊圖片 | `catalog/` | 3:5（直式） | 900×1500 | WebP |
| 橫式圖文框——列表卡片縮圖 | `catalog/` | 1:1 | 800×800 | WebP |
| 橫式圖文框——詳情頁輪播圖片 | `catalog/` | 4:3（橫式） | 1200×900 | WebP |
| App 圖示 | 根目錄 | 1:1 | 192×192、512×512 | PNG |

體驗／工具目錄的圖片依用途分成 5 種規格（見上表），不是同一張圖套進所有地方；每個項目依版型（正方形圖文框／橫式圖文框）各自準備「列表封面圖」跟「詳情頁圖片」兩張，命名建議：`item-cover.webp`（列表封面）、`item-1.webp`／`item-2.webp`…（詳情頁多張）。詳細的版型對應規則、`data-cover`／`data-images` 屬性怎麼用，見 [統一資料 Schema](../docs/DATA-SCHEMA.md) 第 8 節。

## 命名

- 只用小寫英文字母、數字與減號 `-`
- 不使用中文、空格、括號或版本字樣
- 使用可辨識名稱，例如 `thingvellir.webp`、`thingvellir-alt-1.webp`
- 路線圖使用 `route-day1.webp` 格式
- 同一景點的 thumb／medium 檔名必須完全相同

## 維護原則

- 網站使用 WebP 景點圖與路線圖，不保留同內容 JPG／PNG
- 刪除資料前先搜尋檔名，確認 `data/`、`index.html` 與 CSS 沒有引用
- 照片是橫式還是直式，網站會在載入完成的當下自動判斷（看實際尺寸），不用另外登記維護清單
- 不把攝影原檔、編輯暫存、下載壓縮包或重複備份提交到 Repository
