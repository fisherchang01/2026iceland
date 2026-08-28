# 版本紀錄

版本標記方式：重要里程碑會打 git tag，可用 `git checkout <tag>` 回到該狀態。

```bash
git tag -l                    # 列出所有版本
git show v1.0-stable          # 看某版本的內容
git diff v1.0-stable HEAD     # 跟目前狀態比對
```

---

## v1.3-flight-day — 2026-08-28 ⭐ 飛機日版面重整 + 航班編輯器

**核心目的：第 1、7、9 日都是純航班日，畫面上同一份航班資料被顯示了三次——最上面一張手繪的 `route-dayN.webp`（裡面航空公司、航班號、起降時間、轉機等候全都有）、中間的機場航點條、下面的航段卡片。手繪圖改一次航班就要重畫一次，而它的每個字在 `trip-details.js` 裡都已經有了。另外飛機日的渲染分支從頭到尾沒讀過 `d.spots`，所以那天不可能加景點。**

**1 — 拿掉重複的兩層**
- 移除 day0/day6/day8 的 `routeMapImg`，刪除 `images/routes/route-day0|6|8.webp`
- 移除整個機場航點條（`buildFlightStripHtml()` 連函式一起刪）——它講的內容跟下面的航段卡片一樣
- `js/nav.js` 的 `updateItinMap()` 對空清單會渲染「地图准备中」佔位框，所以在 `showDay()` 結尾針對 transit 日清空容器。`.itin-map-scroll` 本身沒有 padding/margin/min-height，清空後高度歸零
- `css/style.css` 裡的 `.flight-strip` / `.fs-*` 因此變成死碼，但該檔案是不可動區，保留不動

**2 — `transit` 語意收斂，飛機日可以有景點**
- `transit` 現在只代表「不顯示手繪路線圖」
- 要不要畫時間軸改由「這天有沒有 spots/areas」決定；航班卡改由「有沒有 flights」決定
- 抽出 `buildFlightCardHtml()`、`buildDayNoteHtml()`、`buildDaySpotsHtml()` 三個函式，讓三個分支共用同一套景點渲染（景點迴圈、連接線、里程小計邏輯一行未改）
- 有時間軸時航班卡與備註卡包進 `.timeline-row`。flex 項目的 `min-width` 預設是 `auto`，卡片不加 `flex:1;min-width:0` 會往右溢出、日期徽章被切掉；`style.css` 對 `.spot-item` / `.hotel-card` / `.drive-summary-card` 有同樣的規則，但該檔不可動，故寫成行內樣式
- 這一項是為了讓 repo 當成其他旅程（美國、泰國）的範本時，「當日有飛機＋景點」能直接支援

**3 — 航班編輯器（`tools/trip-editor-pro.html` 階段 F）**
- 側欄新增「✈️ 航班（N 段）」入口，可新增／刪除／排序航段，右側即時預覽串起航段與轉機等候
- 欄位沿用既有的 `flights` 詞彙，不改成 `trip-schema.js` 宣告的 `transport` 詞彙（改詞彙要同時動資料檔與渲染端，風險大於收益；轉換仍由 `buildTripData()` 負責）
- Guard 新增 4b：`airline`/`flightNo`/`from`/`to`/`dep`/`arr` 缺一即中止；有航班卻沒 `transit` 標記也中止。異動摘要加上航班段數
- 修 bug：`renderSpots()` 的 `if (!day.spots) return;` 讓沒有 spots 的日子連「➕ 新增景點」按鈕都不出現，飛機日因此永遠加不了第一個景點。上傳前會清掉為此補出來的空陣列，不寫進資料檔
- 手繪路線圖的提醒改為只在非飛機日顯示

**4 — 文件**
- `ARCHITECTURE.md` 第 9 節「不可動區」改成兩層：`catalog-nav.js` / `nav.js` / `style.css` 維持完全不可動；`render-itinerary.js` 改成「改內容時不可動，改渲染行為時這裡就是正確位置，但須記錄於 CHANGELOG」。這次的需求正是後者——改的是飛機日該長什麼樣，不是行程內容
- `DATA-SCHEMA.md` 補上 `day.transit` 新語意與 `flights` 欄位表

**驗證**：以 playwright 實跑 `index.html`，六個一般日（day1–5、day7）改動前後**逐像素完全相同**；420/360/900 三種寬度下卡片皆無溢出，飛機日路線圖容器高度 0px、一般日維持 294px；另模擬在飛機日加入景點，確認航班卡與景點卡在同一條時間軸上正常排版。編輯器以 playwright 跑 21 項端對端檢查（側欄入口、欄位帶入、排序、Guard 攔截、上傳打包重組後仍為合法 JSON）全數通過。

---

## v1.2-catalog-upload — 2026-08-27 ⭐ 體驗／工具編輯器：共用核心 + 直接上傳照片

**核心目的：`images/catalog/` 是體驗頁與工具頁共用的實體資料夾，但每個編輯器只掃自己那份資料檔，算出來的「未使用」其實是「本頁沒用到」——工具編輯器把 88 張圖列成未使用，其中 80 張是體驗頁在用的。更根本的問題是照片必須線下處理、先推到 GitHub、再回編輯器認領，所以「已上傳但還沒被引用」這個中間狀態一直存在。這次讓照片在編輯器裡直接上傳，中間狀態就不再產生。**

**1 — 兩個編輯器抽出共用核心**
- v1.0 時 `travel-editor-pro.html` 與 `other-editor-pro.html` 是兩份 1142 行、只差 15 行的複製檔，每個 bug 都要修兩遍（文件裡甚至有這條警告）
- 改成 `tools/catalog-editor-core.js`（~1290 行）+ `tools/catalog-editor-core.css`（~230 行）+ 兩個 90 行外殼，外殼之間只差 20 行的 `EDITOR_CONFIG`

**2 — item id（schema 變更）**
- 每個項目新增必填的 `id`，格式 `^[a-z0-9][a-z0-9-]*$`，跨兩個資料檔全域唯一，作為照片檔名前綴
- 為既有 38 個項目補上 id；`store_shopping` 的空項目（無名稱、無 block）一併刪除
- 上傳 Guard 新增 3b：id 非空、格式合法、本檔內不重複；與另一頁撞名只警告
- 渲染端不讀這個欄位，純服務編輯器

**3 — 從編輯器直接上傳照片**
- 移植 `trip-editor-pro.html` 階段 D 的上傳流程，catalog 版簡化為單一尺寸（長邊 1200px / WebP q0.82，不裁切，裁切交給 CSS 的 `object-fit`）
- 三個入口：項目「📷 上傳照片」（附加成新 block）、圖片 block「從本機上傳」（換圖）、封面欄位（`{分類key}-cover-NN.webp`）
- 接號改為**不分大小寫**比對——既有檔案有 `Svarta-06.webp`、`Seabaron-08.webp` 這類大寫開頭的，若區分大小寫，下一張會從 `svarta-01.webp` 重來，在 GitHub 上變成兩個不同檔案
- 上傳成功立刻把 block 掛上並寫進草稿，縮短「檔案在 repo 裡、資料檔卻沒引用」的孤兒視窗
- 進度面板固定在右下角，不放在項目 DOM 裡（上傳完成會重繪編輯區，錯誤訊息會被清掉）

**4 — 圖片使用狀態改為三態**
- 挑選器同時掃描兩份資料檔，並讀取兩邊 localStorage 的草稿，分成「本頁已用／他頁已用／未使用」
- 篩選由 checkbox 改為三段式：未使用（預設）／本頁已用／全部；他頁已用給橘色角標，跨頁重複用圖不再靜默發生
- 效果：工具編輯器的「未使用」從 88 張降為 8 張（清理後為 0）

**5 — 清理**
- 刪除 8 張確認無任何引用的孤兒圖：`is_airport-01/02/03.webp`、`kaviar-02.webp`、`parkinga-02/04.webp`、`skyx-cover-01.webp`、`注音与拼音对照.jpg`（最後一張同時違反「不使用中文檔名」的規則）
- 退稅圖檔統一為 hyphen 命名並依 block 順序重新編號：`is_refund_a-02/is_refund_a-01/is_refund-01` → `is-refund-01/02/03`，`fl_refund-01~04` → `fl-refund-01~04`
- 圖片清單 API 有 PAT 時自動帶上，速率上限 60 次/小時 → 5000 次/小時
- catalog 圖片數 111 → 103，全部有引用，孤兒為 0

**驗證**：以 jsdom 實跑兩個編輯器，涵蓋載入／渲染／三態計數／id 驗證／Guard 攔截／上傳打包重組後仍為合法 JSON；檔名接號另有 7 組邊界案例測試（大小寫、缺號、前綴誤判）。

---

## v1.1-aurora-live — 2026-08-23 ⭐ 極光頁改接真實資料

**核心目的：極光頁的 Kp、雲量、極光機率此前全部是 `Math.random()` 產生的亂數，但頁面標題寫著「極光即時預報」——使用者會據此決定要不要熬夜、要不要開車去暗處。這次改造把假資料全部換成真實 API，並重建版面、加入方向建議與即時機率。**

分 5 個階段施工，每階段獨立 commit、獨立驗收：

**階段 A — 資料層：接上真實 API**
- 新增 `data/aurora-config.js`（`AURORA_CONFIG`）：地點座標、取樣半徑、外部連結，取代寫死在 `js/render-aurora.js` 裡的 `AURORA_LOCATIONS`
- 刪除 `generateMockKpData()`、`calculateSunElevation()`（死碼）、Bz/Bt 兩個模擬儀表、13 行除錯 log
- Kp 改接 NOAA SWPC 兩支端點（實測值欄位 `Kp`、預報值欄位 `kp`，大小寫不同需分別處理）；雲量與日出日落改接 Open-Meteo
- 任一 API 失敗時顯示「暫時取不到資料」，不回退到亂數或編造值

**階段 B — 版面：套用新設計**
- 版面依已確認的設計原型（`tools/aurora-preview.html`）重建：今晚這一條 SVG、判斷卡（星級／一句話／四數值）、雲況地圖、外部連結、說明摺疊區
- CSS 外移至 `css/aurora.css`（此前寫在 `<style>` 字串裡、每次渲染重新注入）
- 判斷公式改用真實資料換算：太陽仰角（標準天文年曆公式）決定黑暗係數、Open-Meteo 分層雲量決定晴空係數、Kp 預報決定極光活動係數，介面明確標示「本站換算，僅供參考」
- 修正 Open-Meteo `timezone=auto` 回傳掛鐘時間字串在非冰島時區瀏覽器解析錯誤的問題（改用 `utc_offset_seconds` 換算，顯示固定用 `Atlantic/Reykjavik` 時區格式化）

**階段 C — 方向建議：多點取樣**
- 八方位 × 10/20/30 km（25 點）一次多座標請求取回全部資料，繪成連續雲場圖（IDW 內插）
- 差距 < 10 個百分點時明確寫「差距不大，不一定要特地移動」；文案用「東側條件較好」而非駕駛指令，避免暗示不明路況下的行車建議

**階段 D — OVATION 即時機率（按需載入）**
- 「現在機率」格改為按鈕，開頁不自動抓 897 KB 的 OVATION 資料，點擊才載入
- 65160 個格點載入後建成查詢表，資料為全球性質，切換地點只需重新查表

**階段 E — 清理與文件**
- 刪除 `tools/aurora-api-test.html`、`tools/aurora-preview.html`（任務完成）
- 刪除 `data/trip-details.js` 中已不再讀取的 `aurora` 欄位（5 筆）
- `sw.js` 快取清單納入 `css/aurora.css`、`data/aurora-config.js`，版本字串 bump
- 更新 `docs/ARCHITECTURE.md`（極光頁資料源、非同步例外的範圍）、`docs/DATA-SCHEMA.md`（新增 `AURORA_CONFIG` 定義）

---

## v1.0-stable — 2026-08-18 ⭐ 體驗／工具頁架構重建的穩定基準版

**這是第一個「架構乾淨、內容可安全編輯」的版本。日後任何改壞的情況，都可以安全回退到這裡。**

### 核心成果：體驗頁／工具頁改為「資料 + 渲染引擎」架構

改造前，`data/travel-content.js` 一個檔案裡同時裝了三種東西：

```
[13.7KB CSS] + [頁面骨架 HTML] + [實際內容]
```

編輯器的工作方式是「解析舊檔 → 重新生成整個檔案 → 覆蓋上傳」，因此**任何一次生成失誤都會連骨架和 CSS 一起銷毀**。2026-08-16 到 08-18 之間就發生過：編輯器一次上傳把檔案從 29,792 字砍到 15,489 字，`<div class="page" id="page-travel">` 外框消失，導致 `switchTab('travel')` 對 `null` 取屬性直接拋錯、`initCatalogPage()` 找不到掛載點提前 return，整個「體驗」頁籤失效，同時 13.7KB 的共用 editorial CSS 一併遺失，連「工具」頁的視覺也被拖累。

改造後三者徹底分離：

| 層 | 位置 | 編輯器能碰嗎 |
|---|---|---|
| 樣式 | `css/catalog-editorial.css` | ❌ |
| HTML 骨架 | `js/render-travel.js`、`js/render-other.js` | ❌ |
| 內容資料 | `data/travel-content.js`、`data/other-content.js` | ✅ 唯一可寫 |

現在即使編輯器把資料檔寫壞，最慘只是內容變空，**版面不會崩、CSS 不會掉、頁籤不會失效**。

### 詳細變更

**架構**
- 新增 `css/catalog-editorial.css`：從兩個資料檔抽出 editorial 主題 CSS（約 16.5KB）
- 新增 `js/render-travel.js`：體驗頁渲染引擎，內含通用 `renderCatalogPage(data, pageId, extraBefore, extraAfter)`
- 新增 `js/render-other.js`：工具頁渲染引擎，重用上面的通用渲染器
- `data/travel-content.js`：HTML 模板字串 → 純資料物件 `TRAVEL_CONTENT`
- `data/other-content.js`：HTML 模板字串 → 純資料物件 `OTHER_CONTENT`
- `data/catalog-config.js`：`labels` / `sizes` 改為 getter，從資料自動推導，不再需要手動維護平行陣列
- `js/render-overview.js`：`mountTabContent()` 改呼叫渲染引擎，**移除 `setTimeout` 重試殘骸**
- `index.html`：新增 CSS link 與兩支渲染引擎 script；`catalog-config.js` 移到兩個 content 檔之後
- `sw.js`：快取清單納入新增的 CSS 與 JS

**編輯器**
- `tools/travel-editor-pro.html`：從指向不存在的 `data/travel-content.json`（404，完全無法使用）改為讀寫 `data/travel-content.js`
- `tools/other-editor-pro.html`：從指向網站根本不載入的孤兒檔 `data/other-tools.js` 改為讀寫 `data/other-content.js`
- 兩者新增：Block 編輯器、圖片挑選器（含「已使用」標記與未使用篩選）、文字標記工具列、localStorage 草稿與髒標記、上傳前 5 道 Guard 與 diff 確認視窗
- 修正打字／點標記按鈕會觸發整個編輯區重繪、導致游標與捲動位置被重置的問題（連續輸入類欄位改為只更新資料不重繪）

**Bug 修正**
- `item-lg` 改為獨佔整行、不進 `.item-row`（此前 `lg` 被硬塞進兩欄 grid，造成左右卡片高度對不齊的版面歪斜）
- 新增 `heading` block 型別，「雷市美食」的 6 個小標題從唯讀的 `raw` 轉為可編輯
- 移除 `CATALOG_IMAGE_MAP` 中 8 筆指向不存在檔案的對應（`bonus.png`、`kronan.jpg`、`omnom.jpg`、`noi-sirius.jpg`、`freyja.jpg`、`hraun.jpg`、`saltverk.jpg`、`nordqvist.jpg`）
- 編輯器入口卡片改為只在「工具總覽」頁顯示、分類詳情頁隱藏（用 CSS 搭配 `catalog-nav.js` 既有的 `.catalog-show-overview` class 解決，**沒有改動 `catalog-nav.js`**）

**清理**
- 刪除 `data/travel-data.js`、`data/other-tools.js`（前一代 AI 產生的孤兒檔，網站從未載入，且內容是憑空編造的）
- 刪除 `tools/travel-editor-pro.html.backup`
- 清理孤兒圖片

**文件**
- 新增 `docs/ARCHITECTURE.md`、`docs/EDITORS.md`、`docs/IMAGES.md`、`CHANGELOG.md`
- 重寫 `docs/DATA-SCHEMA.md` 第 8 節、`README.md`、`docs/NEW-TRIP-SOP.md`
- 刪除 `docs/EDITORS_QUICK_START.md`、`docs/PHASE_1_EDITOR_GUIDE.md`、`docs/TRIP_EDITOR_PRO_GUIDE.md`（描述的檔名與架構皆已不存在）

### 這次學到的四條鐵律（寫進 ARCHITECTURE.md，日後改動請遵守）

1. **資料檔必須是 `.js` 且同步 `<script src>` 載入，不准 `.json` + `fetch`。** `js/init.js` 在頂層同步呼叫 `mountTabContent()`，任何非同步載入都會比它慢 → 白頁。
2. **不准新增 `setTimeout` 重試或「防禦性等待」。** 它掩蓋真正的錯誤（曾洗出 15 次重複警告，反而找不到真問題）。
3. **不准重排 `index.html` 既有的 script 順序**，只允許在指定位置新增。
4. **內容一律從既有檔案機械化萃取，不准 AI 自行編造。**

### 施工方式

分 6 個 Step（Step 0 止血 → Step 1 抽 CSS → Step 2 體驗頁資料化 → Step 3 體驗編輯器 → Step 4 工具頁 → Step 5 清理），**每個 Step 獨立 commit、獨立驗收、獨立回退**。

這是相對於前一次失敗嘗試的關鍵差異：2026-08-18 稍早曾一次性改動 3 新檔 + 2 改檔 + 1 刪檔共 2500+ 行，結果連鎖崩壞、無法定位問題、中間版本也回退不了，耗時 210 分鐘後全面放棄。

---

## 歷史（v1.0 之前）

以下為 v1.0 之前的重要節點，僅供回溯參考。

| 標記 | 內容 |
|---|---|
| `23c4682` | 全面回退，放棄 JSON + fetch 架構實驗（該次實驗完全失敗） |
| `848f202` | v1.0 改造前最後一個「體驗頁完好」的版本（HTML 字串架構） |
| v24 | 總覽頁 2x4／2x2 尺寸系統；`item-card` 取代 square／wide 版型判斷 |
| v23 | 體驗／工具頁改版：hero／split／tile／note 四版型 → square／wide／text 三版型；移除滿版大卡 Hero |
| — | 極光儀表板加入為第五個頁籤 |
| — | 景點照片改為 thumb／medium 兩層（移除 large，medium 兼作燈箱） |
| — | 首頁改為 hero → 今日卡 → 完整行程時間軸 |

> ⚠️ 舊版本的文件（特別是提到 `TRAVEL_HTML` / `OTHER_HTML` 字串、`square`／`wide` 版型、`travel-editor.html` / `other-editor.html` 檔名的部分）**都已作廢**，請以 v1.0-stable 的文件為準。
