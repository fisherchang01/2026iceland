# 圖片資料夾與命名規則

## 資料夾

- `banners/`：每日總覽卡片封面，建議 `day1-card.jpg`
- `routes/`：每日路線圖顯示版
- `routes/large/`：每日路線圖燈箱版
- `spots/thumb/`：景點卡片小圖
- `spots/medium/`：景點詳情中圖
- `spots/large/`：景點燈箱大圖
- `catalog/`：體驗、商店、工具分類圖片
- `app-icon-192.png`、`app-icon-512.png`：加到手機主畫面的 App 圖示

## 命名

- 只用小寫英文字母、數字與減號 `-`
- 不使用中文、空格、括號或版本字樣
- 使用可辨識名稱，例如 `thingvellir.webp`、`thingvellir-alt-1.webp`
- 路線圖使用 `route-day1.webp` 格式
- 同一景點的 thumb／medium／large 檔名必須完全相同

## 維護原則

- 網站使用 WebP 景點圖與路線圖，不保留同內容 JPG／PNG
- 刪除資料前先搜尋檔名，確認 `data/`、`index.html` 與 CSS 沒有引用
- 新增景點照片後同步更新 `data/image-manifest.js`
- 不把攝影原檔、編輯暫存、下載壓縮包或重複備份提交到 Repository
