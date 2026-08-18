# 旅行行程網站

可直接部署到 GitHub Pages 的手機優先旅行網站，使用 HTML、CSS 與原生 JavaScript，**不需要建置工具或後端伺服器**。

本 Repository 同時是「2026 冰島＋芬蘭」實際旅程的線上版，也是可複用的模板。

- 線上網址：`https://fisherchang01.github.io/2026iceland/`
- 目前穩定版本：**v1.0-stable**（2026-08-18）— 見 [CHANGELOG.md](CHANGELOG.md)

---

## 五個頁籤

| 頁籤 | 內容 |
|---|---|
| **行程** | 首頁 hero → 今日卡 → 完整行程時間軸；點進每日看路線圖、景點、交通、住宿 |
| **體驗** | 分類式內容目錄：介紹、美食、購物、世界遺產等 |
| **工具** | 分類式實用資訊：退稅、極光機率、拍攝、加油、洗浴文化等 |
| **費用** | 多幣別記帳，可選用 Firebase 雲端同步 |
| **極光** | 極光儀表板，多地點可左右滑動 |

另有 PWA 支援（可加到手機主畫面）與有限離線能力。

---

## 內容怎麼改

### 用編輯器（推薦）

三個線上編輯器，改完直接推 GitHub，不需要本地開發環境：

| 編輯器 | 網址 | 改什麼 |
|---|---|---|
| 行程編輯器 | `/tools/trip-editor-pro.html` | 每日景點的介紹、提醒、停車資訊 |
| 體驗編輯器 | `/tools/travel-editor-pro.html` | 「體驗」頁籤的分類與項目 |
| 工具編輯器 | `/tools/other-editor-pro.html` | 「工具」頁籤的分類與項目 |

入口頁 `/tools/`，或從網站「工具」頁籤最下方開啟。使用方式見 [編輯器使用指南](docs/EDITORS.md)。

### 手動改檔

所有旅程內容都在 `data/` 與 `images/`，`js/` 是共用核心程式，改內容時不需要動。

各檔案的資料結構見 [統一資料 Schema](docs/DATA-SCHEMA.md)。

---

## 目錄結構

```
index.html      骨架、載入順序、底部導覽
css/            style.css（全站版型）+ catalog-editorial.css（體驗/工具主題）
data/           所有旅程內容（唯一需要為新旅程替換的地方之一）
js/             共用渲染與互動邏輯，新旅程不需修改
images/         banners / routes / spots / catalog，見 docs/IMAGES.md
tools/          三個線上編輯器
docs/           說明文件（旅行 PDF 也放這裡，但被 .gitignore 排除）
template/       TRIP_DATA 空白範例
sw.js           PWA 離線快取
```

---

## 文件

| 文件 | 內容 |
|---|---|
| [架構總覽](docs/ARCHITECTURE.md) | 整站怎麼組起來、載入順序、DOM 契約、不可動區 ← **改程式前必讀** |
| [統一資料 Schema](docs/DATA-SCHEMA.md) | 每個資料檔的欄位定義 |
| [編輯器使用指南](docs/EDITORS.md) | 三個編輯器的操作與維護 |
| [圖片規格](docs/IMAGES.md) | 資料夾分工、尺寸建議、命名規則 |
| [新旅程建立 SOP](docs/NEW-TRIP-SOP.md) | 拿這個 repo 當模板做新旅程 |
| [安全與隱私指南](docs/SECURITY.md) | 公開 Repository 的注意事項 |
| [版本紀錄](CHANGELOG.md) | 改版歷史與回退基準 |

---

## 給要改程式的人：四條鐵律

這個網站曾因為違反這四條而整個「體驗」頁籤失效、耗費數小時全面回退（詳見 CHANGELOG）：

1. **`js/` 底下的主網站程式不得出現 `fetch`、`async`、`DOMContentLoaded`、`setTimeout` 重試。** `js/init.js` 在頂層同步呼叫 `mountTabContent()`，任何非同步載入都會比它慢。
2. **資料檔一律是 `.js` 且用 `<script src>` 同步載入**，不使用 `.json` + `fetch`。
3. **不重排 `index.html` 既有的 script 載入順序**，只在指定位置新增。
4. **不動 `js/catalog-nav.js`、`js/render-itinerary.js`、`js/nav.js`、`css/style.css`。** 若某需求似乎非改不可，先確認是不是資料層或渲染層能解決。

改動請分小步、每步獨立 commit 與驗收，不要一次性大改。

---

## 安全提醒

⚠️ 這是**公開** Repository。不要上傳機票 PDF、護照掃描、租車合約等個人敏感文件，也不要上傳含人臉的私人照片。`.gitignore` 已預設排除 `docs/*.pdf`，但仍請每次推送前確認 `git status`。詳見 [安全與隱私指南](docs/SECURITY.md)。

Firebase 僅用於費用同步。新旅程需在 `data/firebase-settings.js` 使用獨立的 `expensesPath`，或將 `enabled` 設為 `false`；不要把 Firebase 擴大到其他功能。
