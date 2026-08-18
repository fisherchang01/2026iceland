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

> ⚠️ 這一節描述的系統**不屬於**上面 1–7 節的 `TRIP_DATA` 統一模型，是完全獨立的內容機制。
>
> **v1.0-stable（2026-08-18）起**：「體驗」頁與「工具」頁**都已改為「純資料物件 + 渲染引擎」架構**，兩頁共用同一支渲染器，維護方式完全一致。舊版「一整段寫死的 HTML 模板字串」做法已經全面淘汰，網路上或舊文件裡看到的 `TRAVEL_HTML` / `OTHER_HTML` 字串寫法都已不再適用。

### 8.1 架構

```
data/travel-content.js  → const TRAVEL_CONTENT = { categories: [...] }
data/other-content.js   → const OTHER_CONTENT  = { categories: [...] }
                                    ↓
js/render-travel.js  renderCatalogPage(data, pageId, extraBefore, extraAfter)  ← 通用渲染器
js/render-other.js   renderOtherHTML()  ← 呼叫上面那支，另外插入編輯器入口卡片骨架
                                    ↓
js/render-overview.js  mountTabContent()  ← 同步掛進 #mount-travel / #mount-other
                                    ↓
js/catalog-nav.js  ← 接手總覽卡片、分類切換、詳情 Sheet
```

兩個資料檔都是**純資料（JSON 結構），不含任何 HTML 或 CSS**。樣式在 `css/catalog-editorial.css`（editorial 主題）與 `css/style.css`（版型結構）。

DOM 契約與載入順序見 [ARCHITECTURE.md](ARCHITECTURE.md) 第 4、5 節。

### 8.2 資料結構

`TRAVEL_CONTENT` 與 `OTHER_CONTENT` 結構完全相同：

```js
{
  categories: [
    {
      key: "iceland_intro",     // 唯一識別碼，僅限英數與底線，建立後不可更改
      emoji: "🇮🇸",
      title: "冰島介紹",         // 同時作為總覽頁分類卡標題與 pill 文字
      sub: "副標文字",
      cover: "item-01.webp",    // 總覽卡片封面，檔名放 images/catalog/ 底下（必填）
      size: "2x4",              // "2x4" 整行滿版 ｜ "2x2" 半行方卡
      items: [
        {
          name: "項目名稱",      // 可為空字串（例如純相簿卡）
          layout: "sm",         // "sm" 1:1 兩兩並排 ｜ "lg" 2.2:1 獨佔整行
          blocks: [             // 依陣列順序渲染，順序即版面順序
            { type: "heading", value: "小標題" },
            { type: "text",    value: "段落文字" },
            { type: "img",     src:   "xxx.webp" }
          ]
        }
      ]
    }
  ]
}
```

#### Block 型別

| type | 用途 | 渲染結果 |
|---|---|---|
| `text` | 一般段落 | `<p>`，支援 `/n` 換行與 `{bold}` / `{italic}` / `{#RRGGBB}...{/color}` 標記 |
| `img` | 圖片 | `<img src="images/catalog/xxx">` |
| `heading` | 項目內小標題 | `<h4>` |
| `raw` | 逃生艙，保留原始 HTML 不 escape | 編輯器中**唯讀**；目前全站無使用 |

**為什麼用 `blocks` 陣列而不是「文字欄位 + 圖片欄位」**：`css/style.css` 對 `.item-detail` 的設計是「文字、圖片自由排列，任意順序、任意數量」。拆成兩個欄位會強制「文字全在前、圖片全在後」，破壞既有版面。`blocks` 保留原始順序。

#### `size` 與 `layout` 的差別（容易搞混）

| 欄位 | 層級 | 影響 |
|---|---|---|
| `category.size` | 分類 | **總覽頁**的分類卡尺寸：`2x4` 整行滿版／`2x2` 半行方卡（兩張並排） |
| `item.layout` | 項目 | **分類詳情頁**的項目卡尺寸：`sm` 1:1 兩兩並排／`lg` 2.2:1 獨佔整行 |

`layout: "lg"` 使用規則：`renderItems()` 只會把**連續的 `sm`** 兩兩配對進 `.item-row`；遇到 `lg` 會先把緩衝區的 `sm` 配對完，再讓 `lg` 獨佔整行。**不要**期待 `lg` 跟其他卡片並排——塞進兩欄格會造成左右高度對不齊的版面歪斜。一般項目一律用 `sm`。

### 8.3 分類清單怎麼來的

`data/catalog-config.js` 的 `CATALOG_PAGE_META` 的 `labels` 與 `sizes` 已改為 **getter**，直接從資料推導：

```js
travel: {
  overview: '体验总览', pageId: 'page-travel',
  get labels() { return TRAVEL_CONTENT.categories.map(c => c.title); },
  get sizes()  { return TRAVEL_CONTENT.categories.map(c => c.size || '2x2'); }
}
```

因此**新增／刪除／調整順序分類，只需要改 `data/*-content.js` 一個檔案**，不需要同步維護 `catalog-config.js` 的平行陣列。

> ⚠️ 前提是 `index.html` 中 `data/catalog-config.js` 必須排在 `travel-content.js`、`other-content.js` **之後**。

### 8.4 總覽頁卡片尺寸

| 尺寸 | 排版 | 呈現 |
|---|---|---|
| `2x4` | 整行滿版、較高（2.2:1） | 封面照片 + 標題 + 副標 |
| `2x2` | 半行方卡（跟另一個 2x2 並排，1:1） | 封面照片 + 標題 + 副標 + 右緣箭頭 |

哪個分類該用哪種尺寸是**編輯判斷**（依內容豐富度／重要性），系統只照 `size` 欄位排版。

排列邏輯（`initCatalogPage()`）：`2x4` 固定置頂；`2x2` 一律先兩兩配對成「行單位」再洗牌，確保不會有落單方卡卡在中間造成缺角；數量為奇數時落單那個固定墊底。

### 8.5 圖片對應規則

體驗頁與工具頁的圖片**都放在 `images/catalog/`**，兩個來源：

1. `category.cover` → 總覽頁分類卡封面
2. `block.type === "img"` 的 `src` → 項目詳情內文圖；其中**第一張**會自動被 `makeItemCard()` 取為列表卡片封面

兩者都是明確指定檔名，**不走** `CATALOG_IMAGE_MAP` 關鍵字比對。

`CATALOG_IMAGE_MAP` 目前只剩「品牌名稱 → Google favicon URL」的對應，供未來卡片沒設封面時 fallback 用；所有指向不存在本地檔案的舊對應已於 v1.0 移除。新增對應前請先確認圖片真的存在。

`cover` 留空時會 fallback 成分類 emoji 佔位——這是正常設計不是壞掉，但正式內容應該補上封面。

### 8.6 工具頁的固定骨架

`js/render-other.js` 內有一段 `TOOL_EDITOR_SECTION_HTML`（三個彩色編輯器入口卡片）。這屬於 **UI 骨架不屬於資料**，因此寫死在渲染器裡，不放進 `OTHER_CONTENT`。

它透過 `renderCatalogPage()` 的 `extraAfter` 參數插在分類之後，並由 `css/catalog-editorial.css` 的 `#page-other.catalog-show-overview .tool-editor-section` 規則控制「只在工具總覽頁顯示、分類詳情頁隱藏」，**沒有改動 `js/catalog-nav.js`**。

### 8.7 編輯方式

優先使用編輯器（見 [EDITORS.md](EDITORS.md)）：

- 體驗頁 → `tools/travel-editor-pro.html`
- 工具頁 → `tools/other-editor-pro.html`

手動編輯 `data/*-content.js` 也可以，維持相同資料結構即可，**不需要**（也不應該）修改 `js/render-travel.js`、`js/render-other.js` 或 `js/render-overview.js`。

### 8.8 語言

體驗頁／工具頁的內文與分類標籤，統一使用**簡體中文**（與 `index.html` 宣告的 `lang="zh-Hans"` 一致）。

行程頁 `data/trip-details.js`／`data/trip-days.js` 等檔案目前仍是繁體，這是既有旅程資料的既定寫法，**不要**為了「統一全站語言」去動這些檔案，除非明確要求。

### 8.9 用作新旅程模板時

`template/trip-data.example.js` 只涵蓋第 1–7 節的 `TRIP_DATA` 模型，**沒有**體驗／工具內容的空白範例。建立新旅程時，直接參考 8.2 的資料結構寫新的 `TRAVEL_CONTENT` / `OTHER_CONTENT` 即可，結構很簡單：

```js
const TRAVEL_CONTENT = {
  categories: [
    { key: "sample", emoji: "📍", title: "分類名稱", sub: "副標",
      cover: "sample.webp", size: "2x2", items: [] }
  ]
};
```

---

## 資料檢查

網站啟動時會檢查旅程名稱、時區、每日 `id/title/date`、景點名稱與同行者。缺少必填資料時會在瀏覽器主控台列出警告，但不會讓網站停止顯示。

這個檢查機制**不涵蓋**第 8 節的體驗／工具目錄。該部分的驗證改由編輯器的**上傳前 Guard** 負責（分類陣列非空、key 唯一且非空、title 非空、分類數不得無故減少），手動編輯資料檔則沒有任何保護，格式錯誤只能靠瀏覽器 console 發現。
