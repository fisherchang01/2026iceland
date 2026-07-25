# 2026iceland 首頁與極光卡改造交接文件（v15 → v21）

> 交接範圍：`1d8ad82`（內容依 docx 重寫完成版）→ `66257d9`（目前線上最新版）
> 網站：https://fisherchang01.github.io/2026iceland/
> 撰寫日期：2026-07-25

---

## 一、Commit 總覽（依時間順序）

| 短碼 | 版本 | 內容 |
|---|---|---|
| `1d8ad82` | 基準點 | 內容依 docx 重寫完成（還原基準，出問題可回退到此） |
| `4d57fa9` | v15 | 北歐旅行誌改造：總覽時間軸、章節卡、飛行路線條、進場動畫 |
| `d53fdac` | — | 空 commit，重觸發 Pages 部署（後端擁塞） |
| `971bb67` | v16 | 首屏雜誌封面改造：hero 全出血、今日卡上疊、地圖改橫幅 |
| `eafc264` | v17 | 今日卡明信片化：白卡 + 旅程進度環 + 實心主按鈕 |
| `84df37b` | v18 | 首頁精簡：刪資訊區塊、刪路線橫幅、AI 冰河湖封面 |
| `d2e7ce0` | — | 空 commit，重觸發 Pages 部署（後端擁塞） |
| `d4057c6` | v19 | 極光觀測卡放大改版：夜空 hero + 180px 機率圓環 + 三指標大卡 |
| `bc26caa` | v20 | 首頁微調：封面 -20%、章節卡橫排、日期徽章上緣標籤、banner 裁殘影 |
| `66257d9` | v21 | 首頁日卡間距加大；行程頁里程小計移到極光卡上方並內縮 |

---

## 二、各版本異動明細

### v15（`4d57fa9`）北歐旅行誌改造
- 總覽 9 天卡片改為垂直時間軸：每列 `.ov-tl-row` 自帶一段線（`::before`），左邊 30px 節點欄（圓點），章節交界顏色轉換才對得齊。
- 國家分隔升級為「Chapter N」章節卡（`.chapter-card`），章節編號依 `sectionLabel` 出現順序自動累加，不需新欄位。
- 航班資訊改為飛行路線條（`.flight-strip`：航點 ─✈─ 航點）。
- 新增滾動進場動畫：`initScrollReveal()`（`js/render-itinerary.js`）+ `.reveal` CSS；`prefers-reduced-motion` 時自動關閉。
- 主要檔案：`js/render-overview.js`、`js/render-itinerary.js`、`css/style.css`

### v16（`971bb67`）首屏雜誌封面改造
- hero 左右全出血、上緣貼齊頁面（負 margin），高度 `min(64vh, 520px)`。
- 封面圖加 Ken Burns 緩慢推進動畫（`heroDrift`）。
- 今日卡向上疊住 hero 下緣（`margin: -44px`），hero 文字 `padding-bottom: 64px` 讓位。
- 地圖輪播搬到今日卡之後、壓成 21:9 橫幅（`#itinMapScrollOverview`）。
- 主要檔案：`css/style.css`（v16 區塊）

### v17（`eafc264`）今日卡明信片化
- 今日卡從綠色漸層儀表板改為白卡：狀態 + 標題 + 兩行摘要 + 進度環 + 實心主按鈕。
- 新增 `buildTripProgressRing()`：44px 小圓環顯示「旅程已進行 n/9 天」，依 `getTripDayContext()` 狀態推算，不需新欄位。
- 主要檔案：`js/render-overview.js`、`css/style.css`

### v18（`84df37b`）首頁精簡 + AI 封面
- 今日卡刪除「下一站 / 今日住宿 / 今日提醒」資訊區（這些資訊每日詳情頁本來就有）。
- 刪除路線橫幅。
- 封面改用 AI 生成的冰河湖圖（`images/banners/cover-hero.webp`）。
- 主要檔案：`js/render-overview.js`、`css/style.css`、`images/banners/cover-hero.webp`

### v19（`d4057c6`）極光觀測卡放大改版
- `buildAuroraWidget()` 整個重寫（`js/render-itinerary.js`），依設計稿 `iceland_aurora_guide_v2.html` 改版並全面放大。
- 新增 `aurora2SkySvg()`：手繪 SVG 極光緞帶 + 星空 + 山影，不依賴外部圖片，離線可用。
- 結構：夜空 hero（機率徽章 + 標題 + 觀測點）→ 180px 機率圓環（r=74、周長 465，填充率 high .9 / medium .6 / low .32，中央顯示「高/中等/偏低」，**不編造假百分比**）→ 三指標大卡（KP 指數 / 天空雲量 / 日落，各帶一行白話解讀）→ 行動建議 → 核實提醒。
- 配色依機率等級：high `#a8e6cf`（極光綠）、medium `#ffd28a`（暖黃）、low 灰藍。
- CSS 新增完整 `aurora2-*` 區塊（`css/style.css` 末端），舊 `aurora-*` 樣式保留無害。
- ⚠️ 注意：`data/trip-details.js` 的 aurora 欄位（kpIndex、cloudCover、probability 等）目前是**示例數值**，出發前需人工更新或接真實預報。
- 主要檔案：`js/render-itinerary.js`、`css/style.css`、`sw.js`

### v20（`bc26caa`）首頁四項微調
1. **封面高度 -20%**：`min(64vh, 520px)` → `min(51vh, 416px)`，今日卡與「完整行程」標題首屏完整露出。
2. **章節卡橫排**：`buildChapterCardHtml()` 改為「Chapter N」與國名同一列（span + flex），卡片高度壓縮成書籤式分隔帶。
3. **日期徽章改上緣標籤**：`.day-badge` 從 `.day-card-content` 內左下角移出，成為 `.ov-tl-row` 的直接子層，絕對定位 `top: -12px; left: 40px` 探出卡片頂邊（行李吊牌感）。顏色類別從 `.day-card.cN .day-badge` 改為 `.day-badge.cN`。
4. **每日 banner 裁殘影**：問題根源是圖檔本身——9 張 banner 是從整頁截圖裁出的，每張頂部帶有前一天卡片的下緣殘影（7~32px 不等）。已用 PIL 逐張偵測邊界裁切（`images/banners/day1~day8-card.jpg`，day0 乾淨未動），**原圖備份在 `images/banners/_orig/`**。
- 主要檔案：`js/render-overview.js`、`css/style.css`、`sw.js`、`images/banners/day1~8-card.jpg`

### v21（`66257d9`）間距與行程頁末端重排
1. **首頁日卡間距加大**：`.day-card` `margin-bottom` 從 `--sp-4`（10px）改為 `--sp-9`（24px）——徽章探出 12px 後 10px 間距會讓徽章幾乎貼到上一張卡。
2. **行程頁末端順序**：改為「住宿 → 🚗 今日自駕里程小計 → 🌌 極光觀測卡」（原本極光卡在里程小計之上）。
3. **解決壓線**：里程小計卡與極光卡比照住宿卡包進 `.timeline-row` + `.timeline-node` 內縮——原本滿版放在 `#spotList` 裡，左邊貫穿整天的虛線時間軸會從卡片底下穿過。新增 `.timeline-row .drive-summary-card, .timeline-row .aurora-card { flex: 1 }` 與 `.timeline-dot.aurora-dot`（深夜藍 `#1c3a6e`）。
- 主要檔案：`js/render-itinerary.js`、`css/style.css`、`sw.js`

---

## 三、接手必讀：作業規則與坑

### 1. Service Worker 快取（最重要）
- 網站是 PWA，`sw.js` 有兩個快取字串：`SHELL_CACHE` 與 `DAY_CACHE`。
- **每次修改任何 CSS / JS / 圖片，都必須 bump 這兩個字串**，否則使用者手機會一直看到舊版。
- 目前版本：`shell-2026-07-25-spacing-v4` / `current-days-2026-07-25-spacing-v4`

### 2. 推送方式：GitHub Git Data API（不要用 git clone/push）
- 此機器 `git clone` 會逾時，固定走 REST API，流程：
  1. `GET /repos/fisherchang01/2026iceland/git/ref/heads/main` 拿 HEAD sha
  2. `GET /git/commits/{sha}` 拿 base tree
  3. 逐檔 `POST /git/blobs`（base64）
  4. `POST /git/trees`（帶 `base_tree`）
  5. `POST /git/commits` → `PATCH /git/refs/heads/main`
- 腳本用完即刪（內含流程可參考本文件重建）。

### 3. Pages 部署擁塞的解法
- GitHub Pages 後端偶發擁塞：deploy job 會卡在 `updating_pages` 逾時或被取消（build 永遠 success）。
- **解法**：用同一個 tree 再推一個空 commit 重新觸發即可（`d53fdac`、`d2e7ce0` 就是這樣產生的）。
- 部署狀態查詢：`GET /repos/fisherchang01/2026iceland/actions/runs?per_page=1`，push 後約 80 秒可查。

### 4. 本機預覽與截圖
- 專案內有三個 stub-DOM 預覽 harness（Node 直接跑，不需瀏覽器開伺服器）：
  - `test-v16.js`：總覽頁（renderOverview + 時間軸）→ 輸出 `preview-v16.html`
  - `test-v19.js`：三種機率等級的極光卡 → 輸出 `preview-v19.html`
  - `test-v21.js`：總覽 + 每日行程頁末端（找一天同時有 driveSummary + aurora 的）→ 輸出 `preview-v21.html`
- 截圖用無頭 Edge：
  ```
  msedge.exe --headless=new --disable-gpu --hide-scrollbars \
    --user-data-dir=<全新空目錄> --virtual-time-budget=6000 \
    --window-size=430,3000 --screenshot=<路徑> file:///<預覽頁絕對路徑>
  ```
- 注意：`--user-data-dir` 每次要換全新目錄，否則可能逾時卡死；file:// 路徑要把 `\` 轉成 `/`。

### 5. 資料維護方式
- 每日行程內容只需改 `data/trip-details.js` 的 `TRIP` 物件，不必動 `index.html` 或其他檔案。
- 景點照片放 `images/spots/`，欄位寫檔名即可；沒有照片會自動顯示插畫。
- 極光卡資料在每天的 `aurora` 欄位；芬蘭段沒有此欄位，天然不顯示極光卡。

### 6. 已知限制 / 注意事項
- banner 圖右側的「›」箭頭是**嵌在圖裡的**（從整頁截圖裁來的），若要改樣式需重新產圖。
- 極光數值是示例，非真實預報。
- 本機 bash 無 `python`/`py`，也無 `zip` 指令（用 `tar -acf`）；影像處理用 Daimon 託管 Python（有 PIL）。

---

## 四、建議的下一階段方向

1. **極光卡接真實預報**：vedur.is 雲量 + KP 指數，出發前每天更新（目前為示例數值，卡上已有「出發前請再核實預報」提醒）。
2. **真機驗收**：首頁間距、徽章觸碰區、極光卡位置，需使用者在手機上實際滑過確認。
3. **banner 圖正規化**：若之後要調整卡片高度或箭頭樣式，建議重新產生 9 張乾淨的 banner（目前的圖是截圖裁切而來，箭頭與部分文字嵌在圖裡）。

---

## 五、安全提醒

- 本次作業使用的 GitHub PAT 已在對話中多次暴露，**請立即撤銷**（GitHub → Settings → Developer settings → Personal access tokens → Revoke），下次作業前重新產生。
