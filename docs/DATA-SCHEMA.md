# 統一資料 Schema

網站透過 `data/trip-schema.js` 將分散的旅程檔案整理成 `TRIP_DATA`。核心 `js/` 程式只讀取這個統一模型。

選填欄位沒有內容時，對應標籤、卡片或資訊區塊會隱藏，不需要放空白字串來撐版面。完整空白範例見 `template/trip-data.example.js`。

## 1. trip-config

旅程層級資料，維護於 `data/trip-config.js`。

必填：

- `tripName`：旅程名稱
- `siteTitle`：瀏覽器頁籤標題
- `countries`：國家陣列
- `dateRange.start`、`dateRange.end`：`YYYY-MM-DD`
- `timezone`：IANA 時區，例如 `Asia/Tokyo`
- `primaryCurrency`：主要當地幣別

選填：`theme`、`coverImage`、`bannerTitleHtml`、`badges`。

## 2. trip-days

每日總覽維護於 `data/trip-days.js`，每日細節維護於 `data/trip-details.js`，兩者以相同 `id` 對應。

必填：`id`、`title`、`isoDate`。

選填：`summary`、`sectionLabel`、`bannerImage`、`routeMapImg`、`hotel`、`reminders`、`spots`、`areas`、`flights`、`drives`。

## 3. spots

景點放在每日資料的 `spots`，需分區時使用 `areas[].spots`。

必填：`name`。`id` 與 `dayId` 會由統一模型自動建立。

選填：

- `label`：A／B／C 編號
- `localName`：當地語言名稱
- `time`、`duration`
- `map`：地圖查詢字串或位置
- `img` 或 `images`
- `desc`、`deepDesc`
- `parking`、`toilet`
- `price`、`booking`
- `tips`、`tags`、`nextStop`

## 4. transport

目前 `flights` 會自動整理為 `TRIP_DATA.transport`。其他交通可依相同欄位增加：

必填：`id`、`dayId`、`type`；`type` 可用 `flight`、`car-rental`、`train`、`transfer`。

選填：`provider`、`number`、`from`、`to`、`departure`、`arrival`、`duration`、`date`、`booking`、`note`。

## 5. lodging

每日 `hotel` 會自動整理為 `TRIP_DATA.lodging`。

必填：`name`；`id` 與 `dayId` 會自動建立。

選填：`address`、`checkIn`、`checkOut`、`map`、`contact`、`note`、`booking`。

## 6. budget

維護於 `data/budget-config.js`。

必填：`people`、`baseCurrency`、`currencies`、`categories`。

選填：`defaultDate`、`baseCurrencySymbol`、`storageKey`、`planned`、`paid`、`onSite`。

`currencies[].rate` 表示「1 單位該幣別等於多少基準幣」。既有 Firebase 費用同步維持不變。

## 7. documents

維護於 `data/docs-content.js`，檔案放在 `docs/`。

必填：`category`、`title`、`filename`。`id` 會自動建立。

選填：`icon`、`note`、`person`、`date`。分類可使用機票、住宿憑證、租車、保險、活動或緊急資訊。

## 8. 體驗／工具目錄（catalog）

> ⚠️ 這一節描述的系統**不屬於**上面 1–7 節的 `TRIP_DATA` 統一模型，是完全獨立的內容機制，維護與除錯方式都不一樣，請勿套用上面「填欄位」的邏輯來理解這部分。

「體驗」「工具」兩個底部頁籤的內容，**不是**由 `trip-schema.js` 整理出來的資料物件驅動，而是各自一整段**寫死的 HTML 模板字串**：

- `data/travel-content.js`：定義全域常數 `TRAVEL_HTML`（體驗頁）
- `data/other-content.js`：定義全域常數 `OTHER_HTML`（工具頁）
- `data/catalog-config.js`：定義 `CATALOG_PAGE_META`（兩頁籤各自的分類標籤陣列）與 `CATALOG_IMAGE_MAP`（品牌名稱關鍵字 → 圖示路徑的對照表）

`index.html` 載入時，`js/render-overview.js` 的 `mountTabContent()` 會把 `TRAVEL_HTML`／`OTHER_HTML` 整段字串塞進 `#mount-travel`／`#mount-other` 掛載點，`js/catalog-nav.js` 再依既有 class（`.souvenir-card`、`.souvenir-item`、`.market-card`、`.info-card`、`.alcohol-warn` 等）判斷每張卡片要用哪一種版型渲染、處理分類切換與詳情 Sheet。

### 新增或修改內容的方式

直接編輯 `data/travel-content.js` 或 `data/other-content.js` 裡對應分類的 HTML 片段，**不需要**（也不應該）修改 `js/catalog-nav.js`。分類的數量、順序、標籤文字改在 `data/catalog-config.js` 的 `labels` 陣列。

### 三種卡片版型（class 決定版型，不是另外設定欄位）

| Class | 版型 | 用途 |
|---|---|---|
| `.souvenir-card` | Hero 滿版圖文卡 | 精選／主打內容，每個分類建議只放 1 張 |
| `.souvenir-item` / `.link-card` | 左圖右文 split 卡 | 一般項目列表 |
| `.market-card` / `.station-card` | 2 欄磚卡（純圖示＋文字，不放照片） | 比價／比較型清單 |
| `.info-card` / `.alcohol-warn` | 提醒／說明紙頁 | 補充資訊、警示文字 |

### 圖片對應規則

商品／品牌圖片放在 `images/catalog/`，一張卡片實際顯示哪張圖，判斷順序是：

1. **優先**：卡片元素本身有沒有 `data-images="file1.jpg,file2.jpg"` 屬性（`js/catalog-nav.js` 的 `catalogImagesFor()`）。這是**補真實照片時該用的正規做法**——直接在 `travel-content.js`／`other-content.js` 對應卡片的 HTML 標籤上加這個屬性，檔名放 `images/catalog/` 底下，多張時可左右滑動，不需要改任何 JS。
2. **沒有 `data-images` 時**：退回用 `catalog-config.js` 的 `CATALOG_IMAGE_MAP`（`js/catalog-nav.js` 的 `catalogImageFor()`），拿卡片整段文字內容（`card.textContent`）去比對陣列裡的品牌關鍵字（字串包含比對，非精確比對），命中就用對應的圖示／favicon。
3. **兩者都沒有**：自動 fallback 成 emoji 圖示，這是正常設計，不是每張都要補圖。

新增一張有實際照片的卡片時，直接用第 1 種（`data-images` 屬性）即可，不需要為了顯示圖片就去修改 `CATALOG_IMAGE_MAP`。
- 體驗頁／工具頁共用的 CSS 是各自寫在 `travel-content.js`／`other-content.js` 檔案內的 `<style>` 區塊裡（不是外部 CSS 檔），選擇器一律要包在 `:is(#page-travel,#page-other)` 裡才不會外溢到行程／費用頁。

### 語言慣例

這兩頁的內文與 `catalog-config.js` 的分類標籤，統一使用**簡體中文**（與 `index.html` 宣告的 `lang="zh-Hans"` 一致）。行程頁 `data/trip-details.js`／`data/trip-days.js` 等其他檔案目前仍是繁體，這是既有旅程資料的既定寫法，**不要**為了「統一全站語言」而去動這些檔案的繁體內容，除非使用者明確要求。

### 此區塊沒有對應的 `template/trip-data.example.js` 範例

`template/trip-data.example.js` 目前只涵蓋上面 1–7 節（`TRIP_DATA` 模型），**沒有**包含體驗／工具內容的空白範例。用這個 repo 當模板建立新旅程時，`data/travel-content.js`／`data/other-content.js`／`data/catalog-config.js` 需要直接參考現有冰島／芬蘭版本的 HTML 結構改寫，不能只靠 `template/` 資料夾。

## 資料檢查

網站啟動時會檢查旅程名稱、時區、每日 `id/title/date`、景點名稱與同行者。缺少必填資料時會在瀏覽器開發者主控台列出警告，但不會讓整個網站停止顯示。這個檢查機制**不涵蓋**體驗／工具目錄（見上方第 8 節），那部分沒有資料驗證，格式錯誤只能靠瀏覽器 console 的 JS 錯誤或肉眼檢查發現。
