# 行程編輯器 Pro - 建置指南與避坑提醒

## 📋 項目概述

**目標**：在線編輯並直接部署行程內容到 GitHub Pages，無需本地開發環境。

**技術棧**：
- 純 HTML/CSS/JavaScript（無框架）
- GitHub API（內容讀寫）
- localStorage（草稿本地存儲）
- GitHub Pages（靜態網頁部署）

**部署地址**：`https://fisherchang01.github.io/2026iceland/tools/trip-editor-pro.html`

---

## 🏗️ 核心架構

### 文件結構
```
2026iceland/
├── data/
│   ├── trip-details.js          ← 行程內容（編輯器修改的對象）
│   └── other-content.js
├── js/
│   ├── render-itinerary.js      ← 渲染行程（需要支持標記解析）
│   └── ...
├── tools/
│   └── trip-editor-pro.html     ← 編輯器（獨立 HTML 文件）
└── docs/
    └── TRIP_EDITOR_PRO_GUIDE.md ← 本文檔
```

### 數據結構（trip-details.js）
```javascript
const TRIP = {
  "day1": {
    "num": 1,
    "title": "冰島南岸一日遊",
    "spots": [
      {
        "icon": "🏛️",
        "name": "藍色秘境溪布 Brúarfoss",
        "tags": ["瀑布", "秘境"],
        "desc": "簡短介紹",           // 一行
        "deepDesc": "詳細描述",      // 多行 + 標記
        "tips": "小提醒",            // 多行 + 標記
        "parking": "停車及廁所",     // 多行 + 標記
        "toilet": "衛生間位置",      // 一行
        "map": "Google Maps 查詢字符串",  // 一行
        "nextStop": {...},
        "images": ["file.webp"]
      }
    ]
  }
};
```

---

## 🔑 關鍵實現要點

### 1. 標記系統（必須支持）

編輯器使用自定義標記，需要在渲染層支持解析：

| 標記 | 用途 | 示例 | 渲染結果 |
|------|------|------|---------|
| `/n` | 換行 | `第一句/n第二句` | 第一句<br>第二句 |
| `{bold}...{/bold}` | 粗體 | `{bold}重點{/bold}` | **重點** |
| `{italic}...{/italic}` | 斜體 | `{italic}備註{/italic}` | *備註* |
| `{#rrggbb}...{/color}` | 顏色 | `{#ff0000}警告{/color}` | <span style="color: #ff0000;">警告</span> |

**在 render-itinerary.js 中的解析函數**：
```javascript
function parseMarkup(str) {
    if (!str) return '';
    return str
        .replace(/\/n/g, '<br>')
        .replace(/\{#([0-9a-fA-F]{6})\}([^{]*?)\{\/color\}/g, '<span style="color: #$1;">$2</span>')
        .replace(/\{bold\}([^{]*?)\{\/bold\}/g, '<strong>$1</strong>')
        .replace(/\{italic\}([^{]*?)\{\/italic\}/g, '<em>$1</em>');
}
```

### 2. localStorage 草稿管理

編輯器使用 localStorage 存儲未上傳的修改：

```javascript
// 存儲格式
localStorage['trip_drafts'] = {
  'day1_0': {      // 'dayX_spotIndex'
    desc: '...',
    deepDesc: '...',
    tips: '...',
    parking: '...',
    toilet: '...',
    map: '...'
  },
  'day1_1': {...},
  'day2_0': {...}
}
```

**重要**：
- 鍵值必須是 `dayKey_spotIndex` 格式
- 每個草稿只儲存修改過的字段
- 編輯器加載時優先使用草稿數據

### 3. UTF-8 Base64 編碼

GitHub API 需要 Base64 編碼上傳內容，中文字符需要特殊處理：

```javascript
function utf8ToBase64(str) {
    try {
        return btoa(unescape(encodeURIComponent(str)));
    } catch(e) {
        // 備用方案：TextEncoder
        const encoder = new TextEncoder();
        const data = encoder.encode(str);
        let binary = '';
        for (let i = 0; i < data.length; i++) {
            binary += String.fromCharCode(data[i]);
        }
        return btoa(binary);
    }
}
```

**避坑**：不能直接用 `btoa(str)`，會導致中文亂碼！

### 4. 編輯器頂部按鈕固定定位

使用 `position: fixed` 固定在頂部，確保按鈕始終可見：

```css
.editor-top-bar {
    position: fixed;
    top: 0;
    left: 251px;      /* 側邊欄寬度 + 1px 分隔線 */
    right: 321px;     /* 預覽區寬度 + 1px 分隔線 */
    height: 50px;
    background: white;
    border-bottom: 2px solid #667eea;
    z-index: 100;
}
```

**避坑**：
- 不要用 `bottom: 0`（會被內容遮擋）
- 一定要設置 `z-index`（避免被其他元素蓋住）
- `left/right` 要計算準確（包括分隔線寬度）

### 5. 焦點字段檢測失敗案例

❌ **不要這樣做**：
```javascript
// 焦點檢測容易出錯
function smartInsert(before, after = '') {
    const activeElement = document.activeElement;
    // ... 複雜的檢測邏輯
}
```

✅ **正確做法**：為每個字段提供獨立工具按鈕
```javascript
// 直接指定字段，簡單可靠
function insertToField(fieldId, before, after = '') {
    const field = document.getElementById(fieldId);
    // ... 直接操作該字段
}
```

### 6. Color Input 事件綁定問題

❌ **不要用 color input 的 onchange**：
```html
<!-- 可能不工作，尤其在 Edge 瀏覽器 -->
<input type="color" onchange="applyColor(this.value)">
```

✅ **改用直接的按鈕**：
```html
<!-- 簡單可靠 -->
<button onclick="applyColorToField('descInput', '#ff0000')">R</button>
<button onclick="applyColorToField('descInput', '#0066cc')">B</button>
<button onclick="applyColorToField('descInput', '#00aa00')">G</button>
```

---

## 🚨 避坑指南

### 避坑 #1：Header 邊距計算錯誤

編輯器 header 需要 `margin-top` 為固定頂欄騰出空間：

```css
.editor-header {
    margin-top: 50px;  /* 要等於 .editor-top-bar 的高度 */
}
```

### 避坑 #2：editor-content 的 overflow 問題

如果設置 `overflow-y: auto`，要確保有足夠的 `padding-bottom`：

```css
.editor-content {
    overflow-y: auto;
    padding: 16px;
    padding-bottom: 100px;  /* 防止最後字段被遮擋 */
}
```

### 避坑 #3：GitHub API SHA 獲取失敗

上傳前必須先獲取文件的 SHA，否則 PUT 請求會失敗：

```javascript
// 第一步：獲取 SHA
const shaResp = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/contents/${file}`,
    { headers: { 'Authorization': `token ${pat}` } }
);
const fileData = await shaResp.json();
const sha = fileData.sha;

// 第二步：上傳時必須包含 SHA
const updateResp = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/contents/${file}`,
    {
        method: 'PUT',
        body: JSON.stringify({
            message: '...',
            content: base64Content,
            sha: sha  // 👈 必須提供
        })
    }
);
```

### 避坑 #4：PAT 權限不足

確保 PAT 有以下權限：
- ✅ `repo` - 完整倉庫存取
- ✅ `contents` - 讀寫文件內容
- ✅ 沒有設置 `Expiration`（或設置足夠長的過期時間）

### 避坑 #5：JSON.stringify 格式化

保存到 GitHub 時，使用格式化的 JSON（便於版本控制）：

```javascript
// ✅ 好
const newContent = 'const TRIP = ' + JSON.stringify(tripData, null, 2) + ';\n';

// ❌ 不好（難以閱讀 diff）
const newContent = 'const TRIP = ' + JSON.stringify(tripData) + ';\n';
```

### 避坑 #6：eval 解析 JavaScript 對象

載入數據時使用 eval（因為數據是 JavaScript 代碼）：

```javascript
const content = await fetch(...).then(r => r.text());
const match = content.match(/const TRIP = ({[\s\S]*?});/);
eval(`tripData = ${match[1]}`);  // 👈 因為是 JS 對象，不是 JSON
```

不能用 `JSON.parse()`！

### 避坑 #7：Textarea 的預設值轉義

HTML 屬性中的特殊字符需要轉義：

```javascript
function escapeAttr(str) {
    if (!str) return '';
    return str
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}

// 使用
<textarea id="descInput">${escapeAttr(spot.desc || '')}</textarea>
```

### 避坑 #8：Editor footer 定位

❌ **footer 在 editor 內部時**：
```css
/* 不行，overflow 會遮擋 */
.editor-footer {
    flex-shrink: 0;  /* 沒用，還是會被遮擋 */
}
```

✅ **必須 fixed 定位**：
```css
/* 正確，固定在屏幕 */
.editor-footer {
    position: fixed;
    bottom: 0;
    z-index: 100;
}
```

---

## 💡 工作流程詳解

### 用戶流程

```
1. 打開編輯器
   ↓
2. 選擇日期 → 選擇景點
   ↓
3. 編輯各字段（支持標記、顏色等）
   ↓
4. 點「本地保存」
   ├─ 修改保存到 localStorage
   ├─ 景點旁顯示 ● 標記
   └─ 頂部顯示「3 個草稿」
   ↓
5. 重複 2-4，編輯其他景點
   ↓
6. 所有修改完成
   ↓
7. 點「上傳到GitHub」
   ├─ 讀取 localStorage 中的所有草稿
   ├─ 應用草稿到 tripData
   ├─ 格式化為 JavaScript 代碼
   ├─ Base64 編碼
   ├─ 通過 GitHub API 上傳
   └─ 清空 localStorage
   ↓
8. 部署完成，網站自動更新
```

### 代碼流程

```
renderEditor()
  ↓
加載景點數據
  ├─ 如果有本地草稿 → 優先使用草稿
  └─ 否則 → 使用原始數據
  ↓
用戶編輯字段（實時預覽更新）
  ↓
點「本地保存」
  ├─ 收集所有字段值
  ├─ 保存到 drafts['day1_0']
  ├─ 寫入 localStorage
  ├─ 更新侧邊欄（顯示 ● 標記）
  └─ 更新徽章（「3 個草稿」）
  ↓
點「上傳到GitHub」
  ├─ 遍歷 drafts 對象
  ├─ 應用每個草稿到 tripData
  ├─ 讀取遠端文件內容
  ├─ 提取 header 和 footer
  ├─ 重組新的 JavaScript 代碼
  ├─ 獲取文件 SHA
  ├─ 調用 GitHub API PUT
  ├─ 清空 localStorage
  └─ 更新 UI（隱藏徽章，隱藏上傳按鈕）
```

---

## 🔌 GitHub API 集成

### 必需的 API 端點

| 操作 | 端點 | 方法 | 用途 |
|------|------|------|------|
| 讀取文件 | `/repos/{owner}/{repo}/contents/{path}` | GET | 獲取文件內容和 SHA |
| 更新文件 | `/repos/{owner}/{repo}/contents/{path}` | PUT | 上傳修改的內容 |

### 完整的上傳流程

```javascript
async function uploadToGitHub() {
    // 1. 獲取 PAT
    const pat = localStorage.getItem('github_pat');
    
    // 2. 應用草稿
    Object.entries(drafts).forEach(([draftKey, data]) => {
        const [dayKey, spotIdx] = draftKey.split('_');
        const idx = parseInt(spotIdx);
        Object.assign(tripData[dayKey].spots[idx], data);
    });
    
    // 3. 讀取遠端文件
    const getResp = await fetch(
        `https://raw.githubusercontent.com/${owner}/${repo}/main/${file}`
    );
    const oldContent = await getResp.text();
    
    // 4. 提取 header 和 footer
    const header = oldContent.substring(0, oldContent.indexOf('const TRIP = {'));
    const footer = oldContent.substring(oldContent.indexOf('};') + 2);
    
    // 5. 組裝新內容
    const newContent = header + 'const TRIP = ' + 
                      JSON.stringify(tripData, null, 2) + ';\n' + footer;
    
    // 6. 獲取 SHA
    const shaResp = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/contents/${file}`,
        { headers: { 'Authorization': `token ${pat}` } }
    );
    const fileData = await shaResp.json();
    
    // 7. 上傳
    const updateResp = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/contents/${file}`,
        {
            method: 'PUT',
            headers: {
                'Authorization': `token ${pat}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: `📝 批量編輯 ${Object.keys(drafts).length} 個景點`,
                content: utf8ToBase64(newContent),
                sha: fileData.sha
            })
        }
    );
    
    if (!updateResp.ok) throw new Error('上傳失敗');
}
```

---

## 🎯 應用到其他模塊

### 體驗（Experiences）編輯器

結構類似，需要：

```javascript
const EXPERIENCES = {
  "eating": {
    "title": "美食體驗",
    "items": [
      {
        "icon": "🍽️",
        "name": "冰島傳統漁湯",
        "desc": "簡短介紹",
        "deepDesc": "詳細描述",
        // ... 其他字段
      }
    ]
  }
};
```

改動點：
1. ✅ 複製相同的編輯器結構
2. ✅ 改用 EXPERIENCES 數據源
3. ✅ 調整字段顯示（根據實際需求）
4. ✅ 改用 `experiences-details.js` 文件名
5. ✅ localStorage 鍵值改為 `experience_drafts`

### 費用（Expenses）編輯器

如果費用是表格形式，需要額外考慮：

```javascript
const EXPENSES = {
  "day1": {
    "items": [
      { "name": "住宿", "amount": 100, "currency": "USD", "paid_by": "Fisher" },
      // ...
    ]
  }
};
```

改動點：
1. ✅ 表格行操作（新增、刪除、修改）
2. ✅ 計算總額、分帳等複雜邏輯
3. ✅ 可能需要 JSON 編輯而不是自由文本

---

## 📚 文件清單

需要修改/建立的文件：

| 文件 | 用途 | 狀態 |
|------|------|------|
| `tools/trip-editor-pro.html` | 行程編輯器 | ✅ 完成 |
| `data/trip-details.js` | 行程數據 | ✅ 現有 |
| `js/render-itinerary.js` | 行程渲染 | ⚠️ 需要添加標記解析 |
| `tools/experiences-editor.html` | 體驗編輯器（待建） | ❌ 待實現 |
| `data/experiences.js` | 體驗數據（待建） | ❌ 待實現 |
| `tools/expenses-editor.html` | 費用編輯器（待建） | ❌ 待實現 |
| `data/expenses.js` | 費用數據（待建） | ❌ 待實現 |

---

## 🔍 常見問題

### Q1：編輯器如何知道哪些文件需要上傳？
A：通過 `localStorage['trip_drafts']` 中的草稿鍵值。只要有草稿，就顯示「上傳」按鈕。

### Q2：萬一網路中斷，修改會丟失嗎？
A：不會！修改保存在 localStorage（瀏覽器本地存儲），網路恢復後可以繼續上傳。

### Q3：能否在多個設備上編輯？
A：目前不支持。每個設備的 localStorage 是獨立的。如果需要多設備同步，可以考慮：
- 導出/導入草稿（JSON 下載）
- 使用雲端存儲（Firebase 等）

### Q4：為什麼不能用 Color Input？
A：某些瀏覽器（尤其 Edge）的 color input 事件觸發不穩定。改用直接按鈕更可靠。

### Q5：標記系統能否擴展？
A：可以。在 `parseMarkup()` 函數中添加新的正則表達式，例如：
```javascript
.replace(/\{highlight\}([^{]*?)\{\/highlight\}/g, '<mark>$1</mark>')
```

### Q6：如何備份未上傳的修改？
A：打開瀏覽器開發工具 → Console → 輸入：
```javascript
console.log(JSON.stringify(localStorage.getItem('trip_drafts'), null, 2))
```
複製輸出，保存為 JSON 文件。

### Q7：PAT 過期了怎麼辦？
A：
1. 清除 localStorage 中的舊 PAT：`localStorage.removeItem('github_pat')`
2. 重新打開編輯器
3. 會提示輸入新的 PAT

---

## 📖 參考資源

- [GitHub API 文檔](https://docs.github.com/en/rest)
- [localStorage MDN 文檔](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)
- [Base64 編碼 MDN](https://developer.mozilla.org/en-US/docs/Glossary/Base64)

---

## 📝 版本歷史

| 版本 | 日期 | 更改 |
|------|------|------|
| 1.0 | 2026-08-16 | 初始版本：本地保存 + 統一上傳功能 |

