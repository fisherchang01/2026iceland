# CSS 死碼清單

`css/style.css` 是 [ARCHITECTURE.md §9](ARCHITECTURE.md) 的**第一層不可動區**，
所以下面這些規則雖然確認沒有任何地方在用，仍**保留在檔案裡沒有刪除**。
這份清單的用途是：**日後把這個 repo 複製成新旅程範本時，在新的副本上一次清掉。**
在正在使用中的行程站上動這個檔案，風險大於 7 KB 的收益。

（v1.3 的 CHANGELOG 已經為 `.fs-*` 做過同樣的判斷，這裡只是把範圍補完整並留下依據。）

---

## 掃描方法

1. 從 `css/style.css` 的**選擇器**（排除註解）取出所有 class，共 347 個
2. 在**除了 style.css 以外的全部** `.html` / `.js` / `.css` / `.md` / `.json` 檔案裡搜尋每個 class 名
3. 對「字串串接組出來的 class」另外處理——全站只有兩處這種寫法：

   | 位置 | 寫法 |
   |---|---|
   | `js/render-overview.js:135,166` | `'ov-ch-' + chapterIdx` |
   | `js/catalog-nav.js:198` | `'catalog-layout-' + layout` |

   這兩組**不是死碼**，只是靜態搜尋看不到。`.ov-ch-0` / `.ov-ch-2` 控制總覽時間軸
   的章節配色，`.catalog-layout-square` / `.catalog-layout-wide` 控制目錄卡版型。
   **這正是不能只靠「搜尋不到就刪」的原因**——第一次掃描報 44 個，其中 2 個會直接
   弄壞總覽頁的配色。

## 確認為死碼：42 個 class

| 前綴 | 數量 | class |
|---|---|---|
| `day-*` | 3 | `day-card-summary`, `day-route-map`, `day-section-label` |
| `flight-*` | 8 | `flight-collapse-arrow`, `flight-collapse-body`, `flight-collapse-card`, `flight-collapse-header`, `flight-collapse-icon`, `flight-collapse-left`, `flight-collapse-sub`, `flight-collapse-title` |
| `fs-*` | 7 | `fs-code`, `fs-dur`, `fs-leg`, `fs-leg-mid`, `fs-plane`, `fs-point`, `fs-time` |
| `info-*` | 1 | `info-section` |
| `link-*` | 1 | `link-badge` |
| `now-*` | 6 | `now-details`, `now-info-card`, `now-info-grid`, `now-info-label`, `now-inline-link`, `now-reminders` |
| `parking-*` | 3 | `parking-card`, `parking-item`, `parking-row` |
| `sauna-*` | 1 | `sauna-table` |
| `single-*` | 1 | `single` |
| `souvenir-*` | 1 | `souvenir-brand` |
| `spot-*` | 1 | `spot-img-gallery` |
| `tips-*` | 1 | `tips-box` |
| `travel-*` | 7 | `travel-banner-icon`, `travel-banner-text`, `travel-sub-arrow`, `travel-sub-body`, `travel-sub-collapse`, `travel-sub-header`, `travel-sub-title` |
| `warn-*` | 1 | `warn-title` |

完全由這些 class 構成的規則約 **58 條、7 KB**（全檔 79 KB，約 9%）。

## 由來

大多是被改版取代、但 CSS 沒跟著清掉的舊版面：

- `flight-collapse-*` / `fs-*` — v1.3 之前的航班卡與航班條，已被現行航班卡取代
- `travel-sub-*` / `travel-banner-*` — v1.0 重構前的體驗頁摺疊版型，該頁已改成資料驅動渲染
- `now-info-*` / `now-details` / `now-reminders` — v18 首頁動線簡化前的「今日卡」欄位
- `parking-*` / `sauna-table` / `souvenir-brand` / `tips-box` / `warn-title` — 早期把內容寫死在 HTML 時代的專用樣式，內容搬進 `data/` 之後就沒人用了

## 要清的時候

在新 repo 上執行，然後**逐頁目視檢查**行程／體驗／工具／費用／極光五個頁籤，
特別確認總覽頁時間軸的章節配色與目錄卡版型（那兩組動態 class 就在附近）。
