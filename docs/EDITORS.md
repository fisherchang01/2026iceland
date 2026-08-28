# 編輯器使用指南

> 對應版本：**v1.4**（2026-08-28）
> 本文取代已刪除的 `EDITORS_QUICK_START.md`、`PHASE_1_EDITOR_GUIDE.md`、`TRIP_EDITOR_PRO_GUIDE.md`。

---

## 1. 三個編輯器

| 編輯器 | 網址 | 編輯對象 | 資料變數 |
|---|---|---|---|
| 行程編輯器 | `/tools/trip-editor-pro.html` | `data/trip-details.js` | `TRIP` |
| 體驗編輯器 | `/tools/travel-editor-pro.html` | `data/travel-content.js` | `TRAVEL_CONTENT` |
| 工具編輯器 | `/tools/other-editor-pro.html` | `data/other-content.js` | `OTHER_CONTENT` |

入口頁：`/tools/`（也可從網站「工具」頁籤最下方的三張彩色卡片開啟）

> ⚠️ **每個編輯器只寫自己那一個資料檔。** 歷史上曾發生「編輯器寫的檔案跟網站讀的檔案不是同一個」的問題（編輯器寫 `travel-content.json`、網站讀 `travel-content.js`），造成「編了、上傳成功了、網站卻沒變」。上表的對應關係是硬約定，改動前務必確認。

體驗編輯器與工具編輯器共用同一份程式。v1.0 時它們是兩份 1142 行、只差 15 行的複製檔，
每個 bug 都要修兩遍；**v1.1 起改成「共用核心 + 薄外殼」**：

| 檔案 | 行數 | 內容 |
|---|---|---|
| `tools/catalog-editor-core.js` | ~1290 | 全部邏輯 |
| `tools/catalog-editor-core.css` | ~230 | 全部樣式 |
| `tools/travel-editor-pro.html` | 90 | 外殼，只設定 `EDITOR_CONFIG` |
| `tools/other-editor-pro.html` | 90 | 同上 |

兩個外殼之間**只差 20 行**，全部是設定值：

```js
window.EDITOR_CONFIG = {
    file:     'data/travel-content.js',   // 或 data/other-content.js
    varName:  'TRAVEL_CONTENT',           // 或 OTHER_CONTENT
    draftKey: 'travel_content_drafts',    // 或 other_content_drafts
    label:    '體驗內容',                  // 或 工具內容
    scope:    '體驗頁',                    // 顯示在工具列左側
    peer: { ... }   // 另一頁的同組設定，用來判斷圖片是否「他頁已用」
};
```

> ⚠️ 修 bug 一律改 `catalog-editor-core.js`。**不要**再把邏輯搬回外殼。

---

## 2. 準備 GitHub PAT

1. GitHub → Settings → Developer settings → Personal access tokens
2. 產生新 token，勾選 `repo` 權限
3. 複製 token（**只會顯示一次**）

第一次上傳時編輯器會跳出輸入框，貼上後存在瀏覽器 `localStorage.github_pat`，之後不用再輸入。

> ⚠️ PAT 存在瀏覽器本機。不要在公用電腦使用；不慎外洩時到 GitHub 撤銷該 token 即可。

---

## 3. 體驗／工具編輯器操作流程

### 介面

```
┌──────────────┬────────────────────────────┬──────────────────┐
│ 分類清單      │ 分類欄位 + 項目/Block 編輯   │ 即時預覽          │
│              │                            │                  │
│ 🇮🇸 冰島介紹   │ emoji / title / sub        │ （渲染後的樣子）   │
│ 🧀 超市食物 ● │ cover（圖片挑選器）         │                  │
│ 🛒 超市购物   │ size（2x4 / 2x2）           │                  │
│ ...          │ ────────────────────       │                  │
│ + 新增分類    │ 項目 #1                     │                  │
│              │   name / layout             │                  │
│              │   [小標題][文字][圖片] blocks │                  │
│              │ 項目 #2 ...                 │                  │
└──────────────┴────────────────────────────┴──────────────────┘
              [放棄] [💾 本地保存] [⬆️ 上傳到 GitHub]
```

分類名稱後面的 **●** 表示該分類有未上傳的草稿。

### 標準流程

1. 開啟編輯器，左欄選分類
2. 編輯欄位、新增／刪除／搬移項目與 block
3. 要加照片就在該項目按「📷 上傳照片」，直接選本機檔案（v1.1 起，見下方）
4. **💾 本地保存** — 存進 `localStorage`，關掉瀏覽器也不會遺失
5. **⬆️ 上傳到 GitHub** — 通過 Guard 檢查後，跳出 diff 摘要確認視窗
6. 確認上傳 → GitHub Pages 約 1–2 分鐘後生效

### Block 編輯

每個項目由若干 block 組成，**順序即版面順序**：

| Block | 編輯方式 |
|---|---|
| 小標題（heading） | 單行輸入框 → 渲染成 `<h4>` |
| 文字（text） | 多行 textarea，附標記工具列 → 渲染成 `<p>` |
| 圖片（img） | 圖片挑選器 → 渲染成 `<img>` |
| raw | **唯讀**，逃生艙，需要時只能手動改資料檔 |

每個 block 都可以上下搬移與刪除。

新增或搬移項目／block 時，**畫面會停在原本的位置**，並自動把新欄位捲進視野、游標直接落在裡面，可以接著打字。（早期版本會跳回頂端，因為新增動作會整段重建編輯區的 DOM。）

### 文字標記

| 標記 | 效果 |
|---|---|
| `/n` | 換行 |
| `{bold}文字{/bold}` | **粗體** |
| `{italic}文字{/italic}` | *斜體* |
| `{#RRGGBB}文字{/color}` | 指定顏色 |

三個編輯器共用同一套標記。渲染端的實作：`js/render-travel.js` 的 `parseMarkup()`（體驗／工具）、`js/render-itinerary.js`（行程）。

> ⚠️ 渲染順序是**先 HTML-escape 再套用標記轉換**，因此內容裡的 `<`、`>`、`&` 會被安全處理，不會造成 XSS，也不會破壞標記本身。

### 上傳照片（v1.1 新增）

不用再自己開圖片軟體縮圖、想檔名、先推到 GitHub 再回來認領。三個入口：

| 位置 | 檔名 | 上傳後 |
|---|---|---|
| 項目底部「📷 上傳照片」 | `{item.id}-NN.webp` | 依序附加成新的 img block |
| 圖片 block 的「📷 從本機上傳」 | `{item.id}-NN.webp` | 換掉這個 block 的圖 |
| 封面欄位的「📷 從本機上傳」 | `{分類key}-cover-NN.webp` | 設為分類封面 |

可一次多選。瀏覽器端等比縮到**長邊 1200px、WebP q0.82**（不裁切——分類卡與項目卡的裁切由 CSS
的 `object-fit` 負責），再直接 commit 到 `images/catalog/`。進度顯示在畫面右下角。

幾個要知道的事：

- 需要 PAT（跟資料檔上傳同一組）
- 接號**不分大小寫**。既有檔案有 `Svarta-06.webp` 這種大寫開頭的，下一張會是 `svarta-07.webp`
  而不是從 01 重來——否則在 GitHub 上會變成兩個不同的檔案
- 上傳前會先查該路徑是否已存在，撞名直接中止
- **照片是立刻 commit 的，資料檔不是。** 上傳成功會馬上把 block 掛上並寫進草稿，
  縮短「檔案在 repo 裡、資料檔卻沒引用」的孤兒視窗；但如果你之後按「放棄」，那張照片就會變成孤兒
- 項目沒有 `id` 時上傳入口是停用的（見 §項目 id）

### 項目 id

每個項目有一個 `id`，是照片檔名的前綴，格式為小寫英數與減號、**跨兩個資料檔全域唯一**。
新增項目時會要求輸入，也可以在項目的 id 欄位直接改（重複或格式錯誤會即時擋下）。

改 id 不會動到已存在的檔案，只影響之後新上傳的命名。詳見
[DATA-SCHEMA.md](DATA-SCHEMA.md) §8.2。

### 圖片挑選器

- 讀取 GitHub API 列出 `images/catalog/` 全部圖片。**有 PAT 時會自動帶上**，
  速率上限從匿名的 60 次/小時提高到 5000 次/小時
- 三段式篩選：**未使用｜本頁已用｜全部**，預設「未使用」
- `images/catalog/` 是體驗頁與工具頁**共用的實體資料夾**，所以挑選器會同時掃描兩份資料檔
  （含兩邊 localStorage 裡尚未上傳的草稿），把每張圖分成三態：

  | 狀態 | 角標 | 說明 |
  |---|---|---|
  | 本頁已用 | 灰色「本頁」 | 這個編輯器的資料檔引用了它 |
  | 他頁已用 | 橘色「工具頁」/「體驗頁」 | 另一頁引用了它——**不是**未使用 |
  | 未使用 | 無 | 兩邊都沒引用 |

  > v1.0 的 `computeUsedImages()` 只掃自己那一份，算出來的「未使用」其實是「本頁沒用到」。
  > 工具編輯器因此把 80 張體驗頁的照片列成未使用（88 張裡只有 8 張是真的沒人用）。

- 清單有快取，**在別處上傳新圖後要按「🔄 重新整理清單」**（從編輯器內上傳會自動清快取）
- API 失敗時會退回手動輸入檔名

### 新增分類

點左欄「+ 新增分類」，輸入：

- **key**：唯一識別碼，**只能用英數與底線**，建立後不可更改（它同時是草稿的儲存鍵）
- **title**：分類標題

新分類預設 `emoji: 🆕`、`size: 2x2`、`cover: ''`、`items: []`。**記得補上 cover**，否則總覽卡片會顯示 emoji 佔位。

新增分類不需要另外去改 `data/catalog-config.js`——那裡的 `labels`／`sizes` 已改為從資料自動推導。

### 上傳前 Guard

上傳一定會先跑以下檢查，任一不過就中止：

1. 資料可序列化為 JSON
2. `categories` 是陣列且至少 1 個
3. 每個分類都有非空的 `key` 與 `title`，且 `key` 不重複
3b. 每個項目都有非空、格式合法（`^[a-z0-9][a-z0-9-]*$`）且不重複的 `id`
    （與另一頁撞名只警告，不阻擋）
4. 分類數不得少於載入時的數量（真要刪需二次確認）
5. 檔案 header 中確實找得到 `const {VAR_NAME}`
6. 顯示 diff 摘要（分類 / 項目 / 圖片 數量前後對照）供人工確認

這套 Guard 是為了防止 2026-08-18 事件重演——當時編輯器一次上傳把資料檔從 29,792 字砍到 15,489 字，連同頁面骨架與 13KB CSS 一起銷毀，整個「體驗」頁籤直接失效。

---

## 4. 行程編輯器

`tools/trip-editor-pro.html`，編輯 `data/trip-details.js` 的 `TRIP` 物件。

介面：左欄選日期 → 選景點 → 中欄編輯欄位 → 右欄即時預覽。

可編輯欄位：`desc`（簡短介紹）、`deepDesc`（詳細描述）、`tips`、`parking`、`toilet`、`map`。

草稿鍵格式 `{dayKey}_{spotIndex}`，例如 `day1_0`。

支援與體驗編輯器相同的四種文字標記。

### 當日設定：路線圖／備註／住宿（v1.4 新增）

側欄每一天都有「⚙️ 當日設定」，裡面三塊：

**🗺️ 路線圖** — 可直接從本機上傳（自動縮到長邊 1200px、WebP q0.82、命名為
`route-{dayId}-NN.webp`、commit 到 `images/routes/`），也可以手動輸入檔名或移除引用。
**建議尺寸 1200 × 900（4:3）**；容器是 4:3 且 `object-fit: contain`，其他比例不會被裁切但會留白。
可以放多張變成輪播。**留空則行程頁整塊地圖區域不顯示**——v1.4 起不再有「地图准备中」佔位框。
移除只是取消引用，檔案不會被刪。

**📝 當日備註** — 對應行程頁的「行程备注」卡。每一行一個段落，空行略過，支援文字標記。

**🏨 住宿** — `name` 沒填整張卡不顯示；`map` 有填卡片才可點開詳情；其餘選填。
六個欄位全部清空會整個移除 `hotel`，不留下空物件。

### 航班編輯（v1.3 新增）

**每一天**側欄都有「✈️ 航班」入口（v1.4 起不再只在飛機日出現）。可以新增／刪除／上下排序航段，
欄位就是 `data/trip-details.js` 既有的那組（`airline`、`flightNo`、`from`、`to`、
`dep`、`arr`、`duration`、`date`、`layoverAfter`、`note`），右側即時預覽會把航段
與轉機等候串起來，方便核對有沒有接錯段。

- `airline` / `flightNo` / `from` / `to` / `dep` / `arr` 是必填，缺任何一個 Guard 會擋下上傳
- `layoverAfter` 填的是**這一段之後**的轉機等候，最後一段留空
- 航班變更跟新增／排序景點一樣是**記憶體內的變更，不進本地草稿**，重新整理分頁會遺失

**飛機日也可以加景點**（v1.3）。以前 `renderSpots()` 有一行 `if (!day.spots) return;`，
沒有 `spots` 的日子連「➕ 新增景點」按鈕都不會出現，等於永遠加不了第一個景點。
現在飛機日可以照常加景點，把機場貴賓室、退稅櫃檯這類事情當成一般景點卡管理。

### 景點照片

景點照片可直接在編輯器上傳（階段 D 起）：選檔案後自動縮成 `medium`（長邊 960/q0.82）與
`thumb`（長邊 480/q0.76）兩份同名 WebP，命名為 `{spot.id}-NN.webp`，一次 commit 到
`images/spots/medium/` 與 `images/spots/thumb/`。

---

## 5. 上傳機制（給要修編輯器的人看）

三個編輯器共用同一套「解析 → 改資料 → 重組檔案 → PUT」流程：

```js
// 1. 讀原始檔
const oldContent = await (await fetch(
  `https://raw.githubusercontent.com/${OWNER}/${REPO}/main/${GITHUB_FILE}`)).text();

// 2. 切出 header / footer
const marker   = `const ${VAR_NAME} = `;
const startIdx = oldContent.indexOf(marker);
const header   = oldContent.substring(0, startIdx);
const endIdx   = oldContent.lastIndexOf('};');      // ⚠️ 必須是 lastIndexOf
const footer   = oldContent.substring(endIdx + 2);

// 3. 重組
const newContent = header + marker + JSON.stringify(data, null, 2) + ';\n' + footer;

// 4. 取 sha 後 PUT
```

### 兩個必踩的坑

**坑 1：`lastIndexOf('};')` 不是 `indexOf('};')`**
資料是巢狀物件，`indexOf` 會從中間第一個 `};` 切斷，造成大量資料重複與語法錯誤。
三個編輯器目前都已使用 `lastIndexOf`（`trip-editor-pro.html` 早期版本曾用 `indexOf`，
只因為 `trip-details.js` 剛好只有一個 `};` 才沒出事——那是運氣不是設計）。

**坑 2：中文編碼**
必須用 `utf8ToBase64()`（`btoa(unescape(encodeURIComponent(str)))`，並備妥 `TextEncoder` fallback），不能直接 `btoa()`，否則中文內容會壞。

---

## 6. 常見問題

**Q：上傳成功了，網站卻沒更新？**

依序檢查：
1. GitHub Pages 部署需要 1–2 分鐘，先等一下
2. 硬重新整理（Ctrl+Shift+R / 手機用無痕視窗）
3. 若手機 PWA 仍是舊的 → Service Worker 快取問題。`sw.js` 對 `data/*.js` 應為 network-first；若曾改回 cache-first，編輯器上傳的內容永遠不會生效（因為 `sw.js` 本身沒變，舊 Service Worker 不會重新安裝）
4. 到 GitHub 直接看 `data/*.js` 的最新 commit，確認內容真的變了

**Q：草稿不見了？**
草稿存在該瀏覽器的 `localStorage`，換瀏覽器、換裝置、清除瀏覽資料都會遺失。長內容建議編完就上傳。

**Q：不小心刪錯東西上傳了？**
每次上傳都是一個 commit，直接 `git revert` 或在 GitHub 網頁上還原該檔案的前一版即可。

**Q：可以兩個人同時編輯嗎？**
不行。編輯器是「讀整份 → 改 → 寫整份」，後上傳的會覆蓋先上傳的。

---

## 7. PAT 推送流程（手動改檔時）

```bash
git remote set-url origin https://<PAT>@github.com/fisherchang01/2026iceland.git
git push
git remote set-url origin https://github.com/fisherchang01/2026iceland.git   # 立刻還原
```
