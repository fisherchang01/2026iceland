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

> ⚠️ **隱私與安全提醒**
> - 此 Repository 預設為公開的，因此**不應上傳個人敏感文件**（機票 PDF、護照掃描、信用卡資訊等）
> - 實際旅行文件應存在本地，不提交到 git
> - 使用 `.gitignore` 排除敏感檔案（已預設 `docs/*.pdf`）
> - 詳見 [安全與隱私指南](SECURITY.md)

## 8. 體驗／工具目錄（catalog）

> ⚠️ 這一節描述的系統**不屬於**上面 1–7 節的 `TRIP_DATA` 統一模型，是完全獨立的內容機制，維護與除錯方式都不一樣，請勿套用上面「填欄位」的邏輯來理解這部分。
>
> **v23 改版**：原本的 hero／split／tile／note 四種版型，已改成 square／wide／text 三種；總覽頁新增 2x4／2x2／1x4 尺寸系統；「滿版大卡 Hero」（`travel-banner.editorial-hero`）已整段移除。下面內容已同步這一版，若看到別處文件還提到 hero/split/tile 或 Hero 大圖，那是舊版說明，以這裡為準。

「體驗」「工具」兩個底部頁籤的內容，**不是**由 `trip-schema.js` 整理出來的資料物件驅動，而是各自一整段**寫死的 HTML 模板字串**：

- `data/travel-content.js`：定義全域常數 `TRAVEL_HTML`（體驗頁）
- `data/other-content.js`：定義全域常數 `OTHER_HTML`（工具頁）
- `data/catalog-config.js`：定義 `CATALOG_PAGE_META`（兩頁籤各自的分類標籤、總覽卡片尺寸）與 `CATALOG_IMAGE_MAP`（品牌名稱關鍵字 → 圖示路徑的對照表）

`index.html` 載入時，`js/render-overview.js` 的 `mountTabContent()` 會把 `TRAVEL_HTML`／`OTHER_HTML` 整段字串塞進 `#mount-travel`／`#mount-other` 掛載點，`js/catalog-nav.js` 再依既有 class（`.catalog-square`、`.catalog-wide`、`.info-card`、`.alcohol-warn`）判斷每張卡片要用哪一種版型渲染、處理總覽／分類切換與詳情 Sheet。

### 新增或修改內容的方式

直接編輯 `data/travel-content.js` 或 `data/other-content.js` 裡對應分類的 HTML 片段，**不需要**（也不應該）修改 `js/catalog-nav.js`。分類的數量、順序、標籤文字、總覽卡片尺寸改在 `data/catalog-config.js`。

### 總覽頁：2x4／2x2／1x4 尺寸系統

「體驗總覽」「工具總覽」頁面的 6 個分類卡片，每個分類指定一種尺寸（`catalog-config.js` 的 `sizes` 陣列，跟 `labels` 一一對應），系統只負責照指定尺寸排版，**不決定**哪個分類該用哪種尺寸——這是 Fisher 自己依內容豐富度／重要性決定的編輯判斷。

| 尺寸 | 排版 | 內容 |
|---|---|---|
| `2x4` | 整行滿版、較高 | 4:3 封面照片 + 標題 + 副標，需要一張照片（沒有照片時自動退回大 emoji 佔位） |
| `2x2` | 半行方卡（跟另一個 2x2 並排） | emoji 圖示 + 標題 + 副標，不需要照片 |
| `1x4` | 整行滿版、較矮的長條卡 | emoji 圖示 + 標題 + 副標，不需要照片 |

`2x4` 的封面照片來源：先看該分類 `.travel-collapse` 元素本身有沒有 `data-cover="xxx.jpg"` 屬性，沒有就退回 `CATALOG_IMAGE_MAP` 依分類名稱關鍵字比對，兩者都沒有就用 emoji 佔位（不是壞掉，是正常 fallback）。

### 分類詳情頁：三種卡片版型

| Class | 版型 | 列表卡片呈現 | 點開詳情呈現 |
|---|---|---|---|
| `.catalog-square` | 正方形圖文框 | 上方 4:3 封面圖 → 標題 → 文字介紹 | 圖片**由上而下直式堆疊**（3:5，不是輪播），下方接原本的文字介紹 |
| `.catalog-wide` | 橫式圖文框 | 左側 1:1 縮圖 + 右側文字 + 右緣箭頭 | 圖片**左右滑動輪播**（4:3），下方接原本的文字介紹 |
| `.info-card` / `.alcohol-warn` | 純文字框 | 純文字，不放圖片 | **不能點擊展開**——內容本身已經是完整資訊，`js/catalog-nav.js` 不會替它加點擊事件 |

`.catalog-square` 跟 `.catalog-wide` 的詳情圖片是兩套獨立元件：`buildStackedPhotosHtml()`（直式堆疊，只給 square 用）跟 `buildPhotoCarouselHtml()`（左右輪播，wide 跟景點詳情共用）。兩種呈現在詳情 Sheet 裡都做成貼齊螢幕左右兩側的全出血效果，手法跟首頁 `.trip-hero` 的全出血一致（`width:100%` 搭配左右負邊距抵銷 `.catalog-sheet-body` 的內距）。

原本的比價／比較型清單（超市比一比、油站比一比等）已經沒有獨立的磚卡版型，改成用 `.info-card` 包一個 `.catalog-compare-list`（純文字條列清單），保留圖示、標籤、說明文字跟外部連結按鈕（如果有的話），只是不放照片。

### 圖片對應規則

商品／品牌圖片放在 `images/catalog/`，一張卡片實際顯示哪張圖，判斷順序是：

1. **優先**：卡片元素本身有沒有 `data-cover="xxx.jpg"`（清單卡片封面圖）跟 `data-images="a.jpg,b.jpg"`（詳情頁多張圖，逗號分隔）這兩個屬性。這是**補真實照片時該用的正規做法**——直接在 HTML 標籤上加，檔名放 `images/catalog/` 底下，不需要改任何 JS。兩者互相獨立：`data-cover` 只影響清單卡片封面，`data-images` 只影響詳情頁堆疊／輪播圖片，可以只設定其中一個。
2. **沒有 `data-cover` 時**：退回用 `catalog-config.js` 的 `CATALOG_IMAGE_MAP`，拿卡片標題（`<h4>` 文字）去比對陣列裡的品牌關鍵字（字串包含比對，非精確比對，且**只比對標題，不比對整段描述文字**——避免描述裡順帶提到的其他品牌被誤判成這張卡片的照片），命中就用對應的圖示。
3. **兩者都沒有**：自動 fallback 成該分類的 emoji 圖示，這是正常設計，不是每張都要補圖。

新增一張有實際照片的卡片時，直接加 `data-cover`／`data-images` 屬性即可，不需要為了顯示圖片就去修改 `CATALOG_IMAGE_MAP`。

體驗頁／工具頁共用的 CSS 大部分寫在各自檔案內的 `<style>` 區塊裡（負責「手札」editorial 主題色跟字體），三種版型的**基礎結構**（尺寸、排版方式、arrow 顯示等）則放在全站共用的 `css/style.css`，讓其他新旅程套用這個 repo 當模板時，即使不套用 Iceland/Finland 這套視覺主題，版型結構仍然是完整可用的。所有選擇器一律包在 `:is(#page-travel,#page-other)` 裡才不會外溢到行程／費用頁。

### 語言慣例

這兩頁的內文與 `catalog-config.js` 的分類標籤，統一使用**簡體中文**（與 `index.html` 宣告的 `lang="zh-Hans"` 一致）。行程頁 `data/trip-details.js`／`data/trip-days.js` 等其他檔案目前仍是繁體，這是既有旅程資料的既定寫法，**不要**為了「統一全站語言」而去動這些檔案的繁體內容，除非使用者明確要求。

### 此區塊沒有對應的 `template/trip-data.example.js` 範例

`template/trip-data.example.js` 目前只涵蓋上面 1–7 節（`TRIP_DATA` 模型），**沒有**包含體驗／工具內容的空白範例。用這個 repo 當模板建立新旅程時，`data/travel-content.js`／`data/other-content.js`／`data/catalog-config.js` 需要直接參考現有冰島／芬蘭版本的 HTML 結構改寫，不能只靠 `template/` 資料夾。

## 資料檢查

網站啟動時會檢查旅程名稱、時區、每日 `id/title/date`、景點名稱與同行者。缺少必填資料時會在瀏覽器開發者主控台列出警告，但不會讓整個網站停止顯示。這個檢查機制**不涵蓋**體驗／工具目錄（見上方第 8 節），那部分沒有資料驗證，格式錯誤只能靠瀏覽器 console 的 JS 錯誤或肉眼檢查發現。
