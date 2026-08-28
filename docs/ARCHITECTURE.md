# 網站架構總覽

> 對應版本：**v1.0-stable**（2026-08-18）
> 這份文件說明整站怎麼組起來。要改內容看 [DATA-SCHEMA.md](DATA-SCHEMA.md)，要用編輯器看 [EDITORS.md](EDITORS.md)。

---

## 1. 技術定位

- 純靜態網站：HTML + CSS + 原生 JavaScript，**無建置工具、無框架、無後端**
- 部署在 GitHub Pages，網址 `https://fisherchang01.github.io/2026iceland/`
- PWA：可加到手機主畫面，`sw.js` 提供有限離線能力
- 唯一的外部服務是 Firebase，**只用於「費用」頁籤的雲端同步**，其他功能一律不依賴它

---

## 2. 五個頁籤

| 頁籤 | 掛載點 | 內容來源 | 渲染程式 |
|---|---|---|---|
| 行程 | `#page-itinerary`（寫在 index.html） | `data/trip-*.js` → `TRIP_DATA` | `js/render-overview.js`、`js/render-itinerary.js` |
| 體驗 | `#mount-travel` → `#page-travel` | `data/travel-content.js`（`TRAVEL_CONTENT`） | `js/render-travel.js` + `js/catalog-nav.js` |
| 工具 | `#mount-other` → `#page-other` | `data/other-content.js`（`OTHER_CONTENT`） | `js/render-other.js` + `js/catalog-nav.js` |
| 費用 | `#mount-budget` → `#page-budget` | `data/budget-content.js`（`BUDGET_HTML`） | `js/budget.js`、`js/firebase-config.js` |
| 極光 | `#mount-aurora` → `#page-aurora` | `data/aurora-config.js`（`AURORA_CONFIG`）＋ NOAA SWPC／Open-Meteo 即時 API | `js/render-aurora.js` |

頁籤切換由 `js/nav.js` 的 `switchTab(tab)` 負責，做法是找 `#page-{tab}` 並加上 `.active` class。

> ⚠️ **所有頁籤的最外層 `<div class="page" id="page-XXX">` 是硬契約。** 曾經因為編輯器把這層外框吃掉，導致整個「體驗」頁籤點下去直接拋 TypeError（見 CHANGELOG v1.0）。

---

## 3. 三種內容機制（重要：不要混用）

這個 repo 歷經多次改版，目前並存三種內容維護方式，各有各的規則：

### 機制 A：統一資料模型（行程頁）

```
data/trip-config.js ┐
data/trip-days.js   ├→ data/trip-schema.js → window.TRIP_DATA → js/render-*.js
data/trip-details.js┘
```

`trip-schema.js` 把分散的檔案整理成統一的 `TRIP_DATA`，核心程式只讀這個模型。詳見 DATA-SCHEMA.md 第 1–7 節。

### 機制 B：資料物件 + 渲染引擎（體驗頁、工具頁）★ v1.0 的主要改造

```
data/travel-content.js (TRAVEL_CONTENT) ┐
                                        ├→ js/render-travel.js: renderCatalogPage()
data/other-content.js  (OTHER_CONTENT)  ┘   （工具頁透過 js/render-other.js 呼叫同一支）
                                             ↓
                                        HTML 字串 → mountTabContent() 掛載
                                             ↓
                                        js/catalog-nav.js 接手互動
```

**核心設計原則（v1.0 的立身之本）：**

> 資料只住在 `data/*.js`、CSS 只住在 `css/`、HTML 骨架只由 `js/render-*.js` 產生。
> 編輯器只能寫 `data/*.js`，物理上碰不到 CSS 與骨架。

改造前這三樣東西全部塞在同一個 HTML 模板字串裡，任何一次編輯器生成失誤都會連骨架和 13KB 的 CSS 一起銷毀。改造後最慘只是內容變空，版面不會崩。

詳見 DATA-SCHEMA.md 第 8 節。

### 機制 C：HTML 模板字串（費用頁）

`data/budget-content.js` 仍是一整段寫死的 `const BUDGET_HTML = \`...\``。這頁是表單 UI 不是內容清單，沒有反覆編輯的需求，因此**刻意保留**舊做法，沒有列入改造範圍。要改就直接編輯該檔的 HTML。

---

## 4. 載入順序（`index.html`）

順序有嚴格語意，**不要重排**。

```
<head>
  css/style.css              ← 全站基礎樣式（版型結構）
  css/catalog-editorial.css  ← 體驗/工具頁的 editorial 主題（覆蓋層，必須排在 style.css 之後）
</head>

<!-- 資料檔：全部同步載入，必須排在程式邏輯之前 -->
data/trip-config.js
data/budget-config.js
data/firebase-settings.js
data/trip-days.js
data/trip-details.js
data/travel-content.js       ← TRAVEL_CONTENT
data/budget-content.js
data/other-content.js        ← OTHER_CONTENT
data/catalog-config.js       ← 必須排在上面兩個 content 之後（labels/sizes 是 getter，從它們推導）
data/docs-content.js
data/trip-schema.js          ← 組出 TRIP_DATA，必須排在所有 trip-* 之後

<!-- 程式邏輯 -->
js/nav.js
js/catalog-nav.js
js/spot-icons.js
js/render-itinerary.js
js/budget.js
js/render-travel.js          ← 提供 renderCatalogPage()，必須排在 render-other.js 之前
js/render-other.js           ← 重用 render-travel.js 的通用渲染器
js/render-overview.js        ← mountTabContent() 在這裡
js/render-docs.js
js/render-aurora.js
js/init.js                   ← 啟動流程，務必最後

js/firebase-config.js (type=module)  ← 獨立於上面的順序，自己載完自己啟動
```

### ⚠️ 為什麼一定要同步載入

`js/init.js` 是在檔案頂層**直接呼叫** `mountTabContent()` 的（不包在任何事件回調裡）。任何 `fetch()` / `DOMContentLoaded` / `async` 的資料載入都會比它慢，導致掛載時資料還不存在 → 白頁。

歷史上曾嘗試改成 `data/travel-content.json` + `await fetch()`，結果連鎖崩壞、耗時 210 分鐘後全面回退（見 CHANGELOG）。

> **鐵律：`js/` 底下的主網站程式不得出現 `fetch`、`async`、`DOMContentLoaded`、`setTimeout` 重試。**
> （`js/firebase-config.js` 與 `js/render-aurora.js` 的外部 API 呼叫是例外，它們本來就是非同步資料源、失敗也不影響其他頁籤。）

#### 極光頁的非同步例外（範圍界定）

`js/render-aurora.js` 是目前唯一在**資料層**大量使用 `fetch`/`async` 的主網站程式，資料源：

- Kp 實測值／預報值：NOAA SWPC（`services.swpc.noaa.gov`），全域共用、與地點無關
- 雲量、日出日落、八方位取樣：Open-Meteo（`api.open-meteo.com`），依地點座標查詢
- OVATION 即時機率：NOAA SWPC，897 KB，**按需載入**（點按鈕才抓，開頁不自動抓）

例外的範圍**僅限於「取資料」**，不含頁面骨架掛載：`initAuroraPage()` 掛載 `#page-aurora` 骨架與地點標籤列是同步執行的，之後才非同步抓資料、非同步渲染內容。任一 API 失敗時，對應區塊顯示「暫時取不到資料」，**不回退到亂數或編造數值**，其他頁籤與極光頁本身的其餘區塊不受影響。

八方位雲況地圖與 OVATION 現在機率都額外做了「全域資料快取」：Kp 與 OVATION 跟地點無關，載入一次全域共用；切換地點通常只需重新查表或重新查詢該地點座標，不必每次都重新打全部 API。

---

## 5. 體驗／工具頁的 DOM 契約

`js/catalog-nav.js` 靠 CSS class 與 DOM 層級抓資料，**少一層就壞**。`js/render-travel.js` 必須產生以下結構：

```html
<div class="page" id="page-travel">            <!-- nav.js switchTab() 靠這個 id -->
  <div class="page-inner">                      <!-- catalogDirectCategories() 用 :scope > .page-inner -->

    <div class="travel-collapse" data-cover="item-01.webp">   <!-- 必須是 .page-inner 直接子元素 -->
      <div class="travel-collapse-header" onclick="toggleTravelCollapse(this)">
        <div class="travel-collapse-left">
          <div class="travel-collapse-emoji">🇮🇸</div>
          <div>
            <div class="travel-collapse-title">冰島介紹</div>
            <div class="travel-collapse-sub">副標</div>
          </div>
        </div>
        <div class="travel-collapse-arrow">›</div>
      </div>
      <div class="travel-collapse-body">        <!-- 必須是 .travel-collapse 直接子元素 -->

        <div class="item-row">                  <!-- 兩張 item-sm 並排時才有 -->
          <div class="item-card item-sm">
            <h4 class="item-card-title">項目名稱</h4>   <!-- 必須是 .item-card 直接子元素 -->
            <div class="item-detail">                   <!-- 必須是 .item-card 直接子元素 -->
              <h4>小標題</h4>
              <p>段落文字</p>
              <img src="images/catalog/xxx.webp" alt="">
            </div>
          </div>
          <div class="item-card item-sm">...</div>
        </div>

      </div>
    </div>

  </div>
</div>
```

| 契約 | 讀取者 | 違反後果 |
|---|---|---|
| `id="page-travel"` / `id="page-other"` | `nav.js switchTab()` | 點頁籤直接 TypeError |
| `.page-inner` 是 page 的**直接**子元素 | `catalogDirectCategories()` | 分類全抓不到，總覽空白 |
| `.travel-collapse` 是 `.page-inner` 的**直接**子元素 | 同上 | 同上 |
| `data-cover` | `catalogCoverFor()` | 總覽卡片退回 emoji 佔位 |
| `.travel-collapse-body` 是 `.travel-collapse` 的**直接**子元素 | `selectCatalogCategory()` | 分類無法展開 |
| `onclick="toggleTravelCollapse(this)"` 在 header 上 | `nav.js` | 展開失效 |
| `h4.item-card-title` 是 `.item-card` 的**直接**子元素 | `makeItemCard()` | 詳情彈窗標題變「詳細內容」 |
| `.item-detail` 是 `.item-card` 的**直接**子元素 | `makeItemCard()` / `openItemDetail()` | 詳情彈窗空白、卡片封面消失 |
| `.item-detail` 內第一張 `<img>` | `makeItemCard()` 取封面 | 卡片封面退回 emoji |
| `item-sm` / `item-lg` | `css/style.css` 決定封面比例 | 版面比例錯亂 |

### `item-sm` / `item-lg` 排版規則

`renderItems()`：
- 連續的 `sm` 兩兩配對包進 `.item-row`（`grid-template-columns: 1fr 1fr`，封面 1:1）
- `lg` **獨佔整行**，不進 `.item-row`（封面 2.2:1）
- 落單的 `sm` 直接放在 body 下，全寬 1:1（例如「冰島介紹」的相簿卡）

⚠️ 把 `lg` 塞進兩欄格會造成版面歪斜（左右卡片高度對不齊）。一般項目一律用 `sm`。

---

## 6. 樣式分層

| 檔案 | 內容 | 誰該改 |
|---|---|---|
| `css/style.css` | 全站基礎版型：`.page`、`.item-card`、`.item-row`、`.catalog-*` 的**結構**（尺寸、grid、比例、arrow） | 只有改版型系統時才動 |
| `css/catalog-editorial.css` | 體驗／工具頁的「手札」editorial 主題（配色、字體、質感），全部包在 `:is(#page-travel,#page-other)` 內 | 換視覺主題時才動 |

兩者分開的用意：其他旅程拿這個 repo 當模板時，就算不套用冰島這套視覺，`style.css` 的版型結構仍完整可用。

⚠️ 所有體驗／工具的選擇器**一律包在 `:is(#page-travel,#page-other)` 裡**，避免外溢到行程／費用頁。

---

## 7. Service Worker 快取策略

`sw.js` 分兩個快取：

- `SHELL_CACHE`：程式碼、資料檔、App 圖示（`SHELL_ASSETS` 清單）
- `DAY_CACHE`：當日＋次日的路線圖與少量景點縮圖，由網頁主動推送（`CACHE_TRIP_DAY_ASSETS` 訊息）

**快取策略**：
- `data/*.js` → **network-first, cache fallback**（線上一定拿到最新內容，離線才用快取）
- 其他 shell 資源 → cache-first

> ⚠️ **為什麼 `data/` 必須是 network-first**：編輯器上傳只改 `data/*.js`，`sw.js` 本身沒變，舊 Service Worker 不會重新安裝。若 `data/` 也走 cache-first，編輯完上傳後手機／PWA 上會**永遠看不到新內容**。

**改動 `js/` 或 `css/` 後，務必同時 bump `sw.js` 開頭的 `SHELL_CACHE` 與 `DAY_CACHE` 版本字串**，否則舊快取不會被清掉。

命名規則：`shell-YYYY-MM-DD-vN` / `current-days-YYYY-MM-DD-vN`，日期改成今天，同一天內第二次改就把 `N` 往上加，兩個字串保持一致。

⚠️ **不要把功能名稱寫進版本字串**（例如 `shell-2026-08-19-stage-b-note-v1`）。這兩個字串只是快取的「名字」，內容叫什麼完全不重要，有意義的只有「跟上一版不一樣」這件事——它是開關，不是紀錄。改了什麼寫在 commit message 與 `CHANGELOG.md` 就好。曾經因為每個人都想把自己的功能名塞進去，字串越接越長且難以判斷該不該覆蓋。

---

## 8. 檔案地圖

```
index.html                    骨架、載入順序、底部五頁籤導覽
sw.js                         PWA 離線快取
manifest.webmanifest          PWA 設定

css/style.css                 全站基礎版型
css/catalog-editorial.css     體驗/工具頁 editorial 主題
css/aurora.css                極光頁樣式（從 tools/aurora-preview.html 逐字複製，scoped 於 #page-aurora）

data/trip-config.js           旅程名稱、日期、時區、主題色、封面
data/trip-days.js             每日總覽
data/trip-details.js          每日景點/交通/住宿細節（行程編輯器讀寫）
data/trip-schema.js           組出統一模型 TRIP_DATA
data/travel-content.js        體驗頁資料 TRAVEL_CONTENT（體驗編輯器讀寫）
data/other-content.js         工具頁資料 OTHER_CONTENT（工具編輯器讀寫）
data/catalog-config.js        體驗/工具的頁籤 meta（labels/sizes 為 getter）+ CATALOG_IMAGE_MAP
data/budget-content.js        費用頁 HTML 模板
data/budget-config.js         同行者、幣別、匯率、類別
data/docs-content.js          旅行文件清單
data/firebase-settings.js     Firebase 開關與路徑
data/aurora-config.js         極光頁地點座標、取樣半徑、外部連結（AURORA_CONFIG，見 DATA-SCHEMA.md）

js/nav.js                     頁籤切換、日期選單、collapse toggle、燈箱
js/catalog-nav.js             體驗/工具的總覽、分類切換、卡片與詳情 Sheet
js/render-travel.js           體驗頁渲染引擎（含通用 renderCatalogPage）
js/render-other.js            工具頁渲染引擎（重用 renderCatalogPage）
js/render-overview.js         行程總覽 + mountTabContent() 掛載三個頁籤
js/render-itinerary.js        每日行程、景點詳情、相片輪播
js/render-docs.js             旅行文件清單
js/render-aurora.js           極光儀表板（資料來源見 data/aurora-config.js 與 NOAA/Open-Meteo API）
js/budget.js                  費用記帳
js/firebase-config.js         費用雲端同步（ES module）
js/spot-icons.js              景點 SVG 插圖
js/init.js                    啟動流程，index.html 最後載入

tools/index.html              編輯器入口頁
tools/trip-editor-pro.html    行程編輯器 → data/trip-details.js
tools/travel-editor-pro.html  體驗編輯器 → data/travel-content.js
tools/other-editor-pro.html   工具編輯器 → data/other-content.js

images/banners/               每日卡片封面 + 首頁 hero
images/routes/                每日路線圖
images/spots/thumb/           景點縮圖
images/spots/medium/          景點大圖（兼燈箱）
images/catalog/               體驗 + 工具的分類封面與內文圖

docs/                         本文件與其他說明；旅行 PDF 放這裡但被 .gitignore 排除
template/trip-data.example.js TRIP_DATA 的空白範例
```

---

## 9. 不可動區

分成兩層（v1.3 起）。

**第一層：不可動。** 跨頁共用的地基，任何需求都不該從這裡下手：

- `js/catalog-nav.js`
- `js/nav.js`
- `css/style.css`

**第二層：改內容時不可動，改渲染行為時這裡就是正確位置。**

- `js/render-itinerary.js`

行程頁「該長什麼樣」本來就是這支檔案的職責。要改的是版面行為（例如 v1.3 讓飛機日
也能顯示景點）而不是行程內容時，改這裡是對的，但必須在 CHANGELOG 記錄改了什麼、
並且確認一般日的渲染沒有連帶改變。

若某個需求似乎必須動到第一層，先停下來確認是不是資料或渲染層可以解決。v1.0 有個好例子：「編輯器入口卡片只在工具總覽頁顯示」的需求，最後是用 `css/catalog-editorial.css` 搭配 `catalog-nav.js` 既有的 `.catalog-show-overview` class 解決的，一行 JS 都沒改。
