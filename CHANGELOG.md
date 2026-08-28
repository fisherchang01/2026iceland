# 版本紀錄

版本標記方式：重要里程碑會打 git tag，可用 `git checkout <tag>` 回到該狀態。

```bash
git tag -l                    # 列出所有版本
git show v1.0-stable          # 看某版本的內容
git diff v1.0-stable HEAD     # 跟目前狀態比對
```

---

## v1.6.1-script-unify — 2026-08-28 🈶 使用者可見文字統一為簡體

**問題：同一個畫面同時出現兩種字體。底部頁籤是「體驗／費用／極光」，點進去的內容卻是「关闭／今日景点」。**

檢查結果並不是隨機混用，而是**照頁面分裂**：

| 檔案 | 原本的使用者可見字串 |
|---|---|
| `render-itinerary.js`、`nav.js`、`init.js`、`render-docs.js` | 全簡體 |
| `budget.js` | 172 簡 / 8 繁（頁面內混用） |
| `render-overview.js` | 3 簡 / 29 繁 |
| `catalog-nav.js`、`render-other.js` | 全繁體 |
| `render-aurora.js` | 7 簡 / 462 繁 |

**選擇轉成簡體的理由**（而非反過來）：

1. `index.html` 宣告 `lang="zh-Hans"`
2. `data/` 底下的行程內容本來就以簡體為主——那是給旅伴看的
3. **繁→簡是安全方向**。`t2s` 一對一確定；`s2t` 有一對多（干 → 干／幹／乾），會出錯

**只轉使用者看得到的字串，程式註解維持繁體。** 註解是寫給維護者看的，不是網站內容。作法是用 acorn 解析出每個檔案的註解區間，只對區間以外的部分做 phrase-aware 轉換。轉換後逐檔比對「原版註解」與「新版註解」，確認 0 個檔案的註解被改動。

| 檔案 | 轉換字數 | 保留註解 |
|---|---|---|
| `render-aurora.js` | 462 | 87 段 |
| `firebase-config.js` | 69 | 22 段 |
| `render-other.js` | 60 | 14 段 |
| `render-overview.js` | 29 | 15 段 |
| `catalog-nav.js` | 17 | 39 段 |
| `budget.js` | 8 | 75 段 |
| `index.html` | 4 | 26 段 |

> ⚠️ **這次動到了第 9 節的第一層不可動區**（`js/nav.js` 無變更，但 `js/catalog-nav.js` 有 17 字）。
> 變更性質是**純顯示文字**——沒有動到任何選擇器、DOM 契約、函式或邏輯，`git diff --numstat`
> 顯示每個檔案都是等量的增減行（7/7、107/107…），即逐行字元替換。
> 若要回退，單獨 revert 這一個 commit 即可。

**過程中修掉一個會造成靜默損壞的坑**：acorn 回報的 `start`/`end` 是 **UTF-16 code unit** 位移，Python 字串索引卻是 **code point**。`spot-icons.js` 這類檔案裡有大量 emoji（surrogate pair，UTF-16 算 2 個單位），直接拿 acorn 的位移去切 Python 字串會整段錯位——第一次執行就把一行註解誤轉成簡體。改成一律先轉 `utf-16-le` bytes、以 2 bytes = 1 code unit 切片後才正確。

**驗證**：`js/` 全部檔案以 acorn 重新解析通過（`firebase-config.js` 以 module 模式）；全站使用者可見字串殘留繁體字 **0**；確認程式中沒有任何中文字串等值比較（不會因為轉換而比對失敗）。

`sw.js` 快取版本字串已更新為 `2026-08-28-v1`（動到 `js/`，依規則必須更新）。

`data/` 底下未動——那是內容，由編輯器維護。目前 `travel-content.js` 有 463 繁 / 2873 簡、`trip-details.js` 有 395 繁 / 4707 簡，若也要統一應該另外處理。

---

## v1.6-pat-session — 2026-08-28 🔐 PAT 改存 sessionStorage

**問題：編輯器跟正式網站同源（`fisherchang01.github.io`），而 `data/*.js` 是「會被編輯器改寫的可執行 JS」。一個有 repo 寫入權的 token 長期躺在同源的 `localStorage` 裡，等於任何能在該網域執行一行 JS 的東西都拿得到它——而拿到它就能改寫網站本身。**

- `getPAT` / `peekPAT` / `clearPAT` 全部改用 `sessionStorage`，暴露時間從「永久」縮到「這個分頁關閉為止」
- **自動遷移**：載入時若發現 `localStorage.github_pat` 還在，搬到 `sessionStorage` 並刪掉舊的那份。使用者不用重輸，舊的暴露也一併消除
- 三個編輯器工具列都加了一顆 **🔑** 按鈕，顯示目前狀態並可立即清除；`clearPAT` 會把兩邊都清掉
- 代價：每開一個新分頁要重輸一次 token

**順手修掉一個 token 讀取的 bug**：舊寫法 `sessionStorage.setItem(KEY, pat.trim())` 存的是 trim 過的值，`return pat` 回傳的卻是**沒 trim 的原值**。從網頁複製 token 常會帶到前後空白，那次 session 的第一次上傳會直接拿未清理的字串去打 `Authorization` header，GitHub 回 401，而錯誤訊息完全看不出是空白造成的（下一次因為讀的是存好的值反而正常，更難查）。這個 bug 是寫測試時才發現的。

**測試**：9 項於 jsdom 下驗證通過——乾淨啟動、舊 token 遷移、sessionStorage 已有值時不被覆蓋、`peekPAT` 不回頭讀 localStorage、prompt 輸入去空白、取消輸入不存空值、`clearPAT` 兩邊清乾淨、`ghHeaders` 有無 token、按鈕狀態切換。

未動 `js/`、`css/` 與 `data/`，`sw.js` 快取版本字串不需調整。

---

## v1.5-paste-screenshot — 2026-08-28 ⭐ 截圖可直接貼上；三個編輯器的底層收成一份

**核心目的：截圖不該還要「先另存新檔 → 開檔案總管 → 選檔案」。剪貼簿的圖經 `getAsFile()` 拿到的本來就是 `File` 物件，既有的轉檔／接號／查重／上傳鏈一行都不用改，缺的只是「怎麼決定貼到哪裡」。**

**1 — `tools/editor-shared.js`（新檔，~370 行）**

在此之前 `catalog-editor-core.js` 與 `trip-editor-pro.html` 各帶一份同名同義的函式，而且已經漂移——`computeNextAvailableNumber` 的 catalog 版有 `/i`、有 regex 逸出、用 `{2,}`，trip 版三樣都沒有（目前 33 個 spot id 全是小寫乾淨字串所以還沒出事）。這一版把七個函式收成一份，三個編輯器都引用：

`escapeAttr`、`showNotif`、`getPAT`／`peekPAT`／`ghHeaders`、`computeNextAvailableNumber`、`resizeToWebpBlob`、`blobToBase64`、`uploadNewImageFile`

各編輯器在自己作用域頂端解構取用，**呼叫端寫法完全沒變**。載入順序：`editor-shared.js` 必須排在其他編輯器腳本之前，缺了會在載入時直接拋錯，不會靜默半殘。

**2 — 截圖貼上 / 拖放**

互動是「先鎖定、再貼上」：每個上傳位置旁邊多一顆「📋 貼上截圖」，按下去鎖定並高亮，然後 `Ctrl+V`／`⌘V`。

- 拖放共用同一條出口：拖到貼上區直接放開即可，不需要先鎖定
- **忘了先鎖定不會默默丟掉**——掃描畫面上所有 `[data-paste-key]`，列成面板讓使用者挑，附縮圖確認
- 用掉即自動解鎖，避免下一次不相干的複製又跑進同一格
- 貼上純文字完全不攔截（只在真的抓到 `kind==='file'` 且 `type` 是 `image/*` 時才 `preventDefault`）
- 沒拖到貼上區的檔案拖放一律吃掉，避免瀏覽器把圖片當網址開走、離開編輯頁

檔名規則沒有任何例外，走的是同一套 `{id}-NN` 接號。

**3 — 截圖用另一組轉檔參數**

截圖裡通常有 UI 文字，lossy WebP 在 q0.82 會讓小字發糊：

| | 一般上傳（拍照） | 貼上／拖放（截圖） |
|---|---|---|
| 體驗／工具 | 長邊 1200px、q0.82 | 長邊 1600px、q0.92 |
| 行程景點 | 960 + 480px、q0.82／0.76 | 960 + 480px、q0.92 |

行程景點的長邊刻意維持 960／480 不動——行程頁的 `srcset` 寫死了 `480w` / `960w`，產出一個 1600px 卻標成 960w 的檔案會讓瀏覽器選錯尺寸。

**4 — 修掉 `toBlob` 的靜默 fallback**

規格上瀏覽器不支援要求的 type 時，`canvas.toBlob` 不會回 `null`，而是**改用 PNG**。舊寫法只檢查 `!blob`，因此在 Safari 16.4 以前會安靜產出一個副檔名 `.webp`、內容其實是 PNG 的檔案（大 3~5 倍）。改成檢查 `blob.type`，拿不到 WebP 就明確中止並提示換瀏覽器。

**5 — 4 張手動貼上的 PNG 截圖轉成 WebP**

`images/catalog/` 裡僅存的 4 張 PNG（正是「以前只能手動貼」的產物）以 v1.5 的貼上參數（1600 / q0.92，四張原圖都 < 1600 所以沒有縮放）重新輸出：

| 檔案 | 尺寸 | 原始 | WebP |
|---|---|---|---|
| `svarta-kaffid-01` | 960×675 | 985 KB | 158 KB |
| `b-jarins-beztu-pylsur-02` | 969×681 | 822 KB | 105 KB |
| `b-jarins-beztu-pylsur-01` | 1374×696 | 678 KB | 104 KB |
| `supermarket-shopping-04` | 768×711 | 565 KB | 81 KB |
| **合計** | | **3.0 MB** | **450 KB（省 85%）** |

`data/travel-content.js` 的 4 處引用同步更新，PNG 已刪除。`images/` 底下現在除了 `app-icon-*.png`（PWA 圖示）以外沒有非 WebP 的內容圖。

**測試**：`computeNextAvailableNumber`（含大小寫、regex 逸出、`{2,}`、非字串元素）、`escapeAttr`、`pasteZoneHtml`、貼上分派、目標選擇面板、自動解鎖、純文字不攔截、多張同時貼、重繪後高亮恢復、拖放——共 23 項於 jsdom 下驗證通過。

未動 `js/` 與 `css/`，`sw.js` 快取版本字串因此不需要調整。

---

## v1.4.1-thumb-fix — 2026-08-28 🩹 補齊 21 張缺漏的景點縮圖

**問題：`images/spots/medium/` 有 214 個檔案，`images/spots/thumb/` 只有 193 個，缺的 21 張全部正在被 `data/trip-details.js` 引用（27 處）。**

缺漏清單：`bluelagoon-01`~`-11`（11 張）、`centralstation-01`~`-04`（4 張）、`diamond-beach-01`~`-06`（6 張）。推測是先前從 git history 救回照片時只救了 medium 這一層。

**為什麼會壞：**
- `render-itinerary.js` 的景點縮圖列（`buildSpotThumbRowHtml`）直接指 `thumb/`，路徑 404
- 景點詳情大圖的 `srcset` 是 `thumb/... 480w, medium/... 960w`。瀏覽器一旦選中 480w 的候選檔而該檔 404，**不會退回 `src`**，整張圖直接壞掉——窄螢幕（手機）受影響最大

**修法：** 由既有 medium 檔以編輯器同一組參數重新產出（長邊 480px、WebP q0.76、等比不裁切），與現有 193 張的規格一致（全站 thumb 長邊皆為 480）。共新增 373 KB。

未動任何程式碼與資料檔，`sw.js` 快取版本字串因此不需要調整（照片不在 `SHELL_ASSETS` 內）。

---

## v1.4-day-settings — 2026-08-28 ⭐ 刪除 transit 旗標，每一天的編輯入口統一

**核心目的：v1.3 把飛機日的重複顯示清掉了，但規則仍寫死在渲染器裡——`if (d.transit) 不顯示路線圖`。這個 repo 要當成之後美國、泰國行程的範本，「這天是不是飛機日」不該是一種需要特別標記的類型。這一版把它拆成三個互不相干的資料條件，`transit` 因此可以整個刪除。**

**1 — `transit` 旗標移除**
- 全站只有 `render-itinerary.js` 一個地方讀它（`render-overview.js` 讀的是 `flights`），所以移除的影響面極小
- 路線圖顯示與否改由 `routeMapImg` 有沒有值決定
- 資料檔移除 day0/day6/day8 的 `"transit": true`

現在每一天的三個畫面元素各自獨立：

| 元素 | 顯示條件 |
|---|---|
| 路線圖 | `routeMapImg` 有值 |
| 航班卡 | `flights` 有值 |
| 景點時間軸 | `spots` / `areas` 有值 |

「飛機日」不再是一種類型，只是「有航班、沒景點」的自然結果。

**2 — 「地图准备中」佔位框移除**
- 沒填 `routeMapImg` 就整塊不顯示，規則沒有例外
- 行為變更：day4 目前沒有 `route-day4.webp`，以前顯示佔位框，現在是完全不顯示。「這天還沒做圖」的提醒改由編輯器的空欄位承擔——那個訊息是給編輯者的，不是給旅伴的

**3 — 當日設定面板（`tools/trip-editor-pro.html` 階段 G）**
- 側欄每一天都有「⚙️ 當日設定」「✈️ 航班」「➕ 新增景點」三個入口，不再依日子類型變化
- **路線圖**：可從本機直接上傳（長邊 1200px / WebP q0.82 / `route-{dayId}-NN.webp` / commit 到 `images/routes/`），也可手動輸入檔名或移除引用。面板標注建議尺寸 1200×900（4:3）。單張寫回字串、多張寫回陣列，維持既有資料寫法。移除只取消引用，不刪檔案
- **當日備註 `note`**、**住宿 `hotel`**（name / note / map / address / checkIn / contact）也納入編輯，這兩項以前只能手改資料檔
- Guard 新增 4c：住宿填了內容卻沒填 `name`（行程頁會整張卡不顯示，等於白填）即中止
- 移除 v1.3 的 transit 一致性檢查與 `addFlight()` 裡自動設旗標的行為
- 上傳前清掉空的 `spots` / `flights` / `routeMapImg` 陣列與空的 `hotel` 物件

**驗證**：playwright 端對端 24 項檢查全數通過（三入口在每一天都存在、欄位帶入與寫回、空值清除、單張/多張序列化差異、接號不分大小寫且不被既有無序號檔名干擾、Guard 攔截、上傳打包後所有 transit 已消失）。前台有路線圖的一般日（day1/2/3/5/7）改動前後逐像素相同；day4 的地圖區塊由 294px 佔位框變成 0px。

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
