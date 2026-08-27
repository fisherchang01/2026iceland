# 圖片資料夾、規格與命名規則

> 對應版本：**v1.1**（2026-08-27）
> 本文取代舊的 `images/README.md`（該檔已改為指向本文）。

---

## 1. 資料夾分工（不可混放）

| 資料夾 | 用途 | 讀取者 |
|---|---|---|
| `images/banners/` | 每日總覽卡片封面（`dayN-card.jpg`）＋ 首頁 hero 封面（`cover-hero.webp`） | `js/render-overview.js` |
| `images/routes/` | 每日路線圖，顯示版與燈箱共用同一張 | `js/nav.js` `updateItinMap()` |
| `images/spots/thumb/` | 景點卡片縮圖 | `js/render-itinerary.js` |
| `images/spots/medium/` | 景點詳情大圖，同時是燈箱最大尺寸（不需另做 large） | `js/render-itinerary.js` |
| `images/catalog/` | **體驗頁 + 工具頁**的分類封面與項目內文圖 | `js/render-travel.js`、`js/catalog-nav.js` |
| `images/app-icon-*.png` | PWA 主畫面圖示 | `manifest.webmanifest` |

**根目錄只放** App 圖示與 `README.md`，其他圖片一律歸入子目錄。

---

## 2. 建議規格

| 用途 | 位置 | 比例 | 建議尺寸 | 格式／品質 |
|---|---|---|---|---|
| 景點縮圖（橫式） | `spots/thumb/` | 4:3 | 480×360 | WebP q76 |
| 景點縮圖（直式） | `spots/thumb/` | 3:4 | 360×480 | WebP q76 |
| 景點大圖（橫式） | `spots/medium/` | 4:3 | 960×720 | WebP q82 |
| 景點大圖（直式） | `spots/medium/` | 3:4 | 720×960 | WebP q82 |
| 路線圖 | `routes/` | 依實際地圖 | 寬 1200–1400px | WebP q80–88 |
| 每日封面卡 | `banners/dayN-card.jpg` | 約 2.2:1 | 約 900×410 | WebP |
| 首頁 hero 封面 | `banners/cover-hero.webp` | 約 1.2:1～1.3:1 | 約 1200×960 | WebP q80–85 |
| **總覽頁分類卡（2x4）** | `catalog/` | 2.2:1 | 900×410 | WebP |
| **總覽頁分類卡（2x2）** | `catalog/` | 1:1 | 800×800 | WebP |
| **項目卡封面（item-sm）** | `catalog/` | 1:1 | 800×800 | WebP |
| **項目卡封面（item-lg）** | `catalog/` | 2.2:1 | 900×410 | WebP |
| **項目詳情內文圖** | `catalog/` | 不限，依原始比例顯示 | 寬 900–1200px | WebP |
| App 圖示 | 根目錄 | 1:1 | 192×192、512×512 | PNG |

### `catalog/` 的規格說明（v1.0 起）

舊文件寫的「square／wide 兩種版型 × 列表／詳情 共 5 種規格」已經作廢。目前只有兩種尺寸系統：

**總覽頁分類卡**：由 `category.size` 決定
- `2x4` → 2.2:1 整行滿版
- `2x2` → 1:1 半行方卡

**分類詳情頁的項目卡**：由 `item.layout` 決定，封面圖**自動取項目第一張 `img` block**
- `sm` → 1:1，兩張並排
- `lg` → 2.2:1，獨佔整行

**項目詳情彈窗的內文圖**：`css/style.css` 的 `.item-detail img` 是 `width: 100%` 全出血、不裁切、依原始比例等比縮放。**因此內文圖不限比例**，橫式直式都可以，只要寬度夠（建議 900–1200px）。

> 實務建議：一張圖若同時要當「項目卡封面」與「詳情內文首圖」，用 1:1 最保險——`item-sm` 封面會 `object-fit: cover` 置中裁切，方形圖不會被切掉重點。

照片是橫式還是直式**不用登記**，網站會在載入完成當下依實際尺寸自動判斷。

---

## 3. 命名規則

- 只用小寫英文字母、數字與減號 `-`
- 不使用中文、空格、括號或版本字樣
- 使用可辨識名稱，例如 `thingvellir.webp`、`thingvellir-02.webp`
- 路線圖用 `route-day1.webp` 格式
- 同一景點的 `thumb` 與 `medium` **檔名必須完全相同**
- `catalog/` 一律用「`{item.id}`-序號」格式，例如 `skyr-01.webp`、`parking-zones-02.webp`；
  分類封面用 `{分類key}-cover-NN.webp`。由編輯器上傳時會自動照這個規則命名
- 歷史檔案裡仍有不符規則的名字（`Svarta-*`、`Seabaron-*` 大寫開頭；`is_gas-*`、
  `supermarket_food.webp` 用底線；少數 `.png`）。它們能正常運作，不急著改；
  編輯器接號時已做不分大小寫比對，不會因為 `Svarta-06` 而讓新檔從 `svarta-01` 重來

---

## 4. 加圖片的流程

### 體驗頁／工具頁（v1.1 起可直接在編輯器上傳）

1. 開編輯器 → 選分類 → 找到項目 → 按「📷 上傳照片」，直接選本機檔案（可多選）
2. 瀏覽器會自動縮成長邊 1200px 的 WebP（q0.82）、命名為 `{item.id}-NN.webp`、
   commit 到 `images/catalog/`，並立刻附加成該項目的 img block
3. 按「⬆️ 上傳到GitHub」把資料檔一起送上去

封面圖同理，檔名是 `{分類key}-cover-NN.webp`。

要用**已經存在**的圖（例如同一張圖既當封面又當內文圖），改按「選擇現有圖片」，
挑選器有「未使用／本頁已用／全部」三段篩選。詳見 [EDITORS.md](EDITORS.md)。

手動放檔案仍然可行（GitHub 網頁上傳或 git push），放完記得在挑選器按「🔄 重新整理清單」。

### 行程頁景點

在行程編輯器選好景點，直接上傳本機照片即可：會自動產生 `medium`（長邊 960/q0.82）與
`thumb`（長邊 480/q0.76）兩份**同名** WebP，命名為 `{spot.id}-NN.webp`。

手動做的話：同一張圖做兩個尺寸、檔名相同，分別放 `images/spots/thumb/` 與
`images/spots/medium/`，再到 `data/trip-details.js` 對應景點的 `images` 陣列補上檔名。

---

## 5. 維護原則

- 刪圖前先全域搜尋檔名，確認 `data/`、`js/`、`css/` 沒有引用
- WebP 版本存在時，刪掉同內容的 PNG／JPG 重複檔
- 不把攝影原檔、編輯暫存、下載壓縮包或重複備份提交進 Repository
- `data/catalog-config.js` 的 `CATALOG_IMAGE_MAP` 新增對應前，先確認檔案真的存在（v1.0 已清掉 8 筆指向不存在檔案的舊對應）

### 快速盤點指令

檢查有沒有孤兒圖片或壞引用：

```bash
# 列出 catalog 裡沒被任何資料檔引用的圖片
# （必須同時掃 travel 與 other——只掃一份會把另一頁的圖誤判成孤兒）
# 註：兩段 grep 的結果要「合併後再排序一次」，舊版文件把兩個各自 sort 過的清單直接
#     串起來就餵給 comm，會噴 "input is not in sorted order" 並給出錯誤答案。
comm -23 \
  <(ls images/catalog | sort) \
  <( { grep -oh 'images/catalog/[^"'"'"']*' data/*.js js/*.js | sed 's|.*/||';
       grep -oh '"\(cover\|src\)": *"[^"]*"' data/travel-content.js data/other-content.js \
         | sed 's/.*: *"//;s/"//'; } | sort -u )
```

v1.1 清理時這條指令找出 8 張孤兒（`is_airport-01/02/03`、`kaviar-02`、`parkinga-02/04`、
`skyx-cover-01`、`注音与拼音对照.jpg`），已全部刪除。目前 103 張圖全部有引用。

---

## 6. 隱私與安全

- ⚠️ 這是**公開** Repository。含人臉的家族照、需徵詢同意才能公開的影像，不要上傳
- 個人敏感檔案（機票 PDF、護照掃描等）一律不上傳，`.gitignore` 已排除 `docs/*.pdf`
- 詳見 [安全與隱私指南](SECURITY.md)
