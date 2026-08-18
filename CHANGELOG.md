# 版本紀錄

版本標記方式：重要里程碑會打 git tag，可用 `git checkout <tag>` 回到該狀態。

```bash
git tag -l                    # 列出所有版本
git show v1.0-stable          # 看某版本的內容
git diff v1.0-stable HEAD     # 跟目前狀態比對
```

---

## v1.0-stable — 2026-08-18 ⭐ 目前的穩定基準版

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
