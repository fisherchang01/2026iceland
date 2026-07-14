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

## 資料檢查

網站啟動時會檢查旅程名稱、時區、每日 `id/title/date`、景點名稱與同行者。缺少必填資料時會在瀏覽器開發者主控台列出警告，但不會讓整個網站停止顯示。
