/* ============================================================
   體驗／工具編輯器共用核心
   ------------------------------------------------------------
   歷史上這兩個編輯器是兩份 1142 行、只差 15 行的複製檔，每個 bug 都要修兩遍。
   v1.1 起改成「共用核心 + 薄外殼」：外殼只負責在載入本檔前設好 window.EDITOR_CONFIG。

   EDITOR_CONFIG 欄位：
     file      本編輯器讀寫的資料檔（例如 'data/travel-content.js'）
     varName   該檔的變數名（例如 'TRAVEL_CONTENT'）
     draftKey  localStorage 草稿鍵
     label     顯示用名稱（例如 '體驗內容'）
     scope     短標籤，顯示在工具列左側（例如 '體驗頁'）
     peer      另一個編輯器的 { file, varName, draftKey, scope }
               —— 用來判斷某張圖是不是「另一頁在用」，見 §圖片使用狀態
   ============================================================ */

(function () {
'use strict';

const CFG = window.EDITOR_CONFIG;
if (!CFG) throw new Error('缺少 EDITOR_CONFIG，請檢查 HTML 外殼');

const GITHUB_OWNER = 'fisherchang01';
const GITHUB_REPO = '2026iceland';
const IMAGE_DIR = 'images/catalog/';

// 上傳照片的統一規格：catalog 只有單一尺寸（不像景點要 thumb/medium 兩份）。
// 分類卡與項目卡的裁切都由 CSS 的 object-fit 負責，所以這裡只等比縮放、不裁切。
const UPLOAD_MAX_DIM = 1200;
const UPLOAD_QUALITY = 0.82;

const ID_PATTERN = /^[a-z0-9][a-z0-9-]*$/;

let data = null;              // 本編輯器的資料（從 GitHub 載入的原始版本，未套草稿）
let peerData = null;          // 另一個編輯器的資料，只讀，用來判斷圖片是否被他頁使用
let originalCategoryCount = 0;
let drafts = {};              // { [categoryKey]: 完整分類物件（草稿版本） }
let currentKey = null;
let imgModalTargetSetter = null;
let imageListCache = null;
let imgFilter = 'unused';     // 'unused' | 'here' | 'all'

/* ============================================================
   工具函式
   ============================================================ */

function utf8ToBase64(str) {
    try {
        return btoa(unescape(encodeURIComponent(str)));
    } catch (e) {
        const encoder = new TextEncoder();
        const bytes = encoder.encode(str);
        let binary = '';
        for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
        return btoa(binary);
    }
}

// 與 js/render-travel.js 的 parseMarkup 同步實作（先 escape 再套標記，避免 XSS）
function parseMarkup(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
        .replace(/\/n/g, '<br>')
        .replace(/\{#([0-9a-fA-F]{6})\}([\s\S]*?)\{\/color\}/g, '<span style="color:#$1">$2</span>')
        .replace(/\{bold\}([\s\S]*?)\{\/bold\}/g, '<strong>$1</strong>')
        .replace(/\{italic\}([\s\S]*?)\{\/italic\}/g, '<em>$1</em>');
}

function escapeAttr(str) {
    if (!str) return '';
    return String(str).replace(/&/g, '&amp;').replace(/"/g, '&quot;')
        .replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function showNotif(msg, type = 'success') {
    const notif = document.createElement('div');
    notif.className = `notification ${type}`;
    notif.textContent = msg;
    document.body.appendChild(notif);
    setTimeout(() => notif.remove(), 4000);
}

// 會跳輸入框。只在使用者明確按下「上傳」類動作時呼叫。
function getPAT() {
    let pat = localStorage.getItem('github_pat');
    if (!pat) {
        pat = prompt('🔑 輸入 GitHub Personal Access Token');
        if (pat) localStorage.setItem('github_pat', pat);
        else throw new Error('需要 PAT');
    }
    return pat;
}

// 不跳輸入框。用於「順便帶上就好」的唯讀 API 呼叫（例如列圖片清單），
// 有 PAT 時速率上限從匿名的 60 次/小時提高到 5000 次/小時。
function peekPAT() {
    return localStorage.getItem('github_pat') || null;
}

function ghHeaders() {
    const pat = peekPAT();
    return pat ? { 'Authorization': `token ${pat}` } : {};
}

function rawUrl(filename) {
    return `https://raw.githubusercontent.com/${GITHUB_OWNER}/${GITHUB_REPO}/main/${IMAGE_DIR}${filename}`;
}

// 分類 key 允許底線，但圖片檔名規則只允許小寫英數與減號。
function keyToSlug(key) {
    return String(key || '').toLowerCase().replace(/_/g, '-').replace(/[^a-z0-9-]/g, '');
}

/* ============================================================
   資料載入
   ============================================================ */

function parseDataFile(text, varName) {
    const marker = `const ${varName} = `;
    const startIdx = text.indexOf(marker);
    if (startIdx < 0) throw new Error('找不到資料標記 ' + marker);
    const jsonStart = startIdx + marker.length;
    const endIdx = text.lastIndexOf('};'); // 必須是 lastIndexOf，資料是巢狀物件
    if (endIdx < jsonStart) throw new Error('檔案結構異常');
    return JSON.parse(text.substring(jsonStart, endIdx + 1));
}

async function fetchDataFile(file, varName) {
    const resp = await fetch(`https://raw.githubusercontent.com/${GITHUB_OWNER}/${GITHUB_REPO}/main/${file}`);
    if (!resp.ok) throw new Error('無法讀取 ' + file);
    return parseDataFile(await resp.text(), varName);
}

async function init() {
    try {
        data = await fetchDataFile(CFG.file, CFG.varName);
        originalCategoryCount = data.categories.length;
    } catch (e) {
        console.error('載入失敗:', e);
        showNotif('載入失敗: ' + e.message, 'error');
        return;
    }
    // 另一頁的資料載入失敗不該擋住編輯，只會讓「他頁已用」判斷退化
    try {
        peerData = await fetchDataFile(CFG.peer.file, CFG.peer.varName);
    } catch (e) {
        console.warn('無法載入 ' + CFG.peer.file + '，圖片使用狀態將只依本頁判斷', e);
        peerData = null;
    }
    loadDrafts();
    renderSidebar();
    updateDraftBadge();
    const scopeEl = document.getElementById('scopeBadge');
    if (scopeEl) scopeEl.textContent = CFG.scope;
}

function loadDrafts() {
    const saved = localStorage.getItem(CFG.draftKey);
    drafts = saved ? JSON.parse(saved) : {};
}

function saveDrafts() {
    localStorage.setItem(CFG.draftKey, JSON.stringify(drafts));
    updateDraftBadge();
}

function updateDraftBadge() {
    const count = Object.keys(drafts).length;
    const badge = document.getElementById('draftBadge');
    const uploadBtn = document.getElementById('uploadBtn');
    if (count > 0) {
        badge.textContent = `${count} 個草稿`;
        badge.style.display = 'block';
        uploadBtn.style.display = 'block';
        document.getElementById('topBar').classList.add('has-unsaved');
    } else {
        badge.style.display = 'none';
        uploadBtn.style.display = 'none';
        document.getElementById('topBar').classList.remove('has-unsaved');
    }
    document.getElementById('topBar').style.display = currentKey ? 'flex' : (count > 0 ? 'flex' : 'none');
}

function getCategory(key) {
    if (drafts[key]) return drafts[key];
    return data.categories.find(c => c.key === key);
}

function allCategoryKeysInOrder() {
    const orig = data.categories.map(c => c.key);
    const extra = Object.keys(drafts).filter(k => !orig.includes(k));
    return orig.concat(extra);
}

/* ============================================================
   Sidebar
   ============================================================ */

function renderSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.innerHTML = '<div class="sidebar-title">📁 分類（共 ' + allCategoryKeysInOrder().length + ' 個）</div>';

    allCategoryKeysInOrder().forEach(key => {
        const cat = getCategory(key);
        if (!cat || cat.__deleted) return;
        const btn = document.createElement('button');
        btn.className = 'cat-btn';
        if (key === currentKey) btn.classList.add('active');
        if (drafts[key]) btn.classList.add('modified');
        if (!cat.items || cat.items.length === 0) btn.classList.add('empty-cat');
        btn.dataset.key = key;
        btn.innerHTML = `<span class="cat-label">${cat.emoji || ''} ${escapeAttr(cat.title || '(未命名)')}</span>` +
            `<div class="cat-meta">${(cat.items || []).length} 個項目 · ${cat.size || '2x2'}</div>`;
        btn.onclick = () => selectCategory(key);
        sidebar.appendChild(btn);
    });

    const addBtn = document.createElement('button');
    addBtn.className = 'add-cat-btn';
    addBtn.textContent = '+ 新增分類';
    addBtn.onclick = addCategory;
    sidebar.appendChild(addBtn);
}

function addCategory() {
    const key = prompt('輸入分類 key（僅限英數與底線，唯一，一旦建立不得更改）：');
    if (!key) return;
    if (!/^[A-Za-z0-9_]+$/.test(key)) {
        showNotif('key 只能使用英文字母、數字與底線', 'error');
        return;
    }
    if (allCategoryKeysInOrder().includes(key)) {
        showNotif('key 已存在，請換一個', 'error');
        return;
    }
    const title = prompt('輸入分類標題：') || key;
    drafts[key] = { key, emoji: '🆕', title, sub: '', cover: '', size: '2x2', items: [] };
    saveDrafts();
    renderSidebar();
    selectCategory(key);
    showNotif('已新增分類（尚未上傳）', 'success');
}

function deleteCategory(key) {
    if (!confirm(`確定刪除分類「${key}」？此動作在上傳前皆可用「放棄」復原。`)) return;
    drafts[key] = { __deleted: true, key: key };
    saveDrafts();
    if (currentKey === key) clearEditor();
    renderSidebar();
}

/* ============================================================
   Editor：分類欄位 + 項目 + Block
   ============================================================ */

function selectCategory(key) {
    currentKey = key;
    renderSidebar();
    renderEditor();
}

function clearEditor() {
    currentKey = null;
    document.getElementById('editor').innerHTML = '<div class="empty-state">請選擇一個分類開始編輯</div>';
    document.getElementById('previewContent').innerHTML = '（選擇分類查看預覽）';
    updateDraftBadge();
}

// renderEditor() 會整段重建 .editor-content 的 DOM，捲動位置因此歸零。
// 這裡在重繪前後保留捲動位置，並把剛動過的欄位捲進視野、給予焦點。
function mutateCurrentCategory(mutator, focusTargetId) {
    const scroller = document.querySelector('.editor-content');
    const prevScroll = scroller ? scroller.scrollTop : 0;
    const cat = JSON.parse(JSON.stringify(getCategory(currentKey)));
    mutator(cat);
    drafts[currentKey] = cat;
    saveDrafts();
    renderSidebar();
    renderEditor();
    restoreEditorView(prevScroll, focusTargetId);
}

function restoreEditorView(prevScroll, focusTargetId) {
    const scroller = document.querySelector('.editor-content');
    if (!scroller) return;
    scroller.scrollTop = prevScroll;
    if (!focusTargetId) return;
    const el = document.getElementById(focusTargetId);
    if (!el) return;
    const focusable = (el.tagName === 'TEXTAREA' || el.tagName === 'INPUT')
        ? el : el.querySelector('textarea, input');
    if (focusable) focusable.focus({ preventScroll: true });
    const box = el.getBoundingClientRect();
    const sBox = scroller.getBoundingClientRect();
    if (box.top < sBox.top + 8 || box.bottom > sBox.bottom - 8) {
        el.scrollIntoView({ block: 'center', behavior: 'smooth' });
    }
}

// 輕量更新：只改資料 + localStorage + 側欄／預覽的局部更新，不重繪輸入欄位本身。
function updateDraftField(mutator) {
    if (!drafts[currentKey]) {
        drafts[currentKey] = JSON.parse(JSON.stringify(getCategory(currentKey)));
    }
    mutator(drafts[currentKey]);
    localStorage.setItem(CFG.draftKey, JSON.stringify(drafts));
    updateDraftBadge();
    refreshSidebarEntry(currentKey);
    updateFullPreview();
}

function refreshSidebarEntry(key) {
    const cat = getCategory(key);
    if (!cat) return;
    const btn = document.querySelector(`.cat-btn[data-key="${CSS.escape(key)}"]`);
    if (!btn) return;
    btn.classList.toggle('modified', !!drafts[key]);
    btn.classList.toggle('empty-cat', !(cat.items && cat.items.length));
    const label = btn.querySelector('.cat-label');
    if (label) label.textContent = `${cat.emoji || ''} ${cat.title || '(未命名)'}`;
    const meta = btn.querySelector('.cat-meta');
    if (meta) meta.textContent = `${(cat.items || []).length} 個項目 · ${cat.size || '2x2'}`;
}

function updateHeaderLive() {
    const cat = getCategory(currentKey);
    if (!cat) return;
    const emojiEl = document.getElementById('hdr_emoji');
    const titleEl = document.getElementById('hdr_title');
    if (emojiEl) emojiEl.textContent = cat.emoji || '';
    if (titleEl) titleEl.textContent = cat.title || '';
}

function renderEditor() {
    const cat = getCategory(currentKey);
    if (!cat) { clearEditor(); return; }

    const editor = document.getElementById('editor');
    editor.innerHTML = `
        <div class="editor-header">
            <h2><span id="hdr_emoji">${cat.emoji || ''}</span> <span id="hdr_title">${escapeAttr(cat.title || '')}</span>
                <button class="btn btn-danger btn-mini" style="margin-left:auto" onclick="deleteCategory('${currentKey}')">刪除分類</button>
            </h2>
        </div>
        <div class="editor-content">
            <div class="field-row">
                <div class="field-group" style="max-width:80px;">
                    <label class="field-label">Emoji</label>
                    <input type="text" id="f_emoji" value="${escapeAttr(cat.emoji || '')}" oninput="onFieldInput()">
                </div>
                <div class="field-group">
                    <label class="field-label">標題 (title)</label>
                    <input type="text" id="f_title" value="${escapeAttr(cat.title || '')}" oninput="onFieldInput()">
                </div>
                <div class="field-group" style="max-width:120px;">
                    <label class="field-label">卡片尺寸 (size)</label>
                    <select id="f_size" onchange="onFieldInput()">
                        <option value="2x4" ${cat.size === '2x4' ? 'selected' : ''}>2x4（大卡）</option>
                        <option value="2x2" ${cat.size === '2x2' ? 'selected' : ''}>2x2（方卡）</option>
                    </select>
                </div>
            </div>
            <div class="field-group">
                <label class="field-label">副標 (sub)</label>
                <textarea id="f_sub" oninput="onFieldInput()" style="min-height:40px;">${escapeAttr(cat.sub || '')}</textarea>
            </div>
            <div class="field-group">
                <label class="field-label">封面圖 (cover)</label>
                <div class="cover-picker">
                    <img class="cover-thumb" id="f_cover_thumb" src="${cat.cover ? rawUrl(cat.cover) : ''}" onerror="this.style.opacity=0.2">
                    <div>
                        <div style="font-size:11px;color:#666;margin-bottom:4px;" id="f_cover_name">${escapeAttr(cat.cover || '（未設定）')}</div>
                        <div class="picker-actions">
                            <button class="btn btn-secondary btn-mini" onclick="openImgModal(setCoverImage)">選擇現有圖片</button>
                            <label class="photo-upload-box">📷 從本機上傳
                                <input type="file" accept="image/*" onchange="handleCoverUpload(this.files)">
                            </label>
                        </div>
                    </div>
                </div>
            </div>

            <div class="section-title">
                項目（${(cat.items || []).length} 個）
                <button class="btn btn-primary btn-mini" onclick="addItem()">+ 新增項目</button>
            </div>
            <div id="itemsContainer"></div>
        </div>
    `;
    renderItems();
    updateFullPreview();
    document.getElementById('topBar').style.display = 'flex';
}

function onFieldInput() {
    updateDraftField(cat => {
        cat.emoji = document.getElementById('f_emoji').value;
        cat.title = document.getElementById('f_title').value;
        cat.sub = document.getElementById('f_sub').value;
        cat.size = document.getElementById('f_size').value;
    });
    updateHeaderLive();
}

function setCoverImage(filename) {
    mutateCurrentCategory(cat => { cat.cover = filename; });
}

/* ---- 項目 CRUD ---- */

// item.id 是照片檔名的錨點（上傳的照片會叫 {id}-NN.webp），因此必須全域唯一、
// 只用小寫英數與減號。改 id 不會動到已經存在的檔案，只會影響之後新上傳的命名。
function allItemIds(excludeCatKey, excludeIdx) {
    const ids = [];
    const collect = (dataset, isSelf) => {
        if (!dataset) return;
        dataset.categories.forEach(cat => {
            if (cat.__deleted) return;
            (cat.items || []).forEach((it, i) => {
                if (isSelf && cat.key === excludeCatKey && i === excludeIdx) return;
                if (it.id) ids.push(it.id);
            });
        });
    };
    collect(buildFinalData(), true);
    collect(peerEffectiveData(), false);
    return ids;
}

function renderItems() {
    const cat = getCategory(currentKey);
    const container = document.getElementById('itemsContainer');
    container.innerHTML = '';
    (cat.items || []).forEach((item, idx) => {
        const hasId = !!item.id;
        const box = document.createElement('div');
        box.className = 'item-block';
        box.id = `itemBox_${idx}`;
        box.innerHTML = `
            <div class="item-block-header">
                <div class="item-block-title">
                    項目 #${idx + 1}
                    <span class="item-id-badge">${escapeAttr(item.id || '⚠ 未設定 id')}</span>
                </div>
                <div class="item-block-actions">
                    <button class="btn btn-secondary btn-mini" onclick="moveItem(${idx},-1)">↑</button>
                    <button class="btn btn-secondary btn-mini" onclick="moveItem(${idx},1)">↓</button>
                    <button class="btn btn-danger btn-mini" onclick="deleteItem(${idx})">刪除</button>
                </div>
            </div>
            <div class="field-row">
                <div class="field-group" style="max-width:150px;">
                    <label class="field-label">id（照片檔名前綴）</label>
                    <input type="text" id="itemId_${idx}" value="${escapeAttr(item.id || '')}"
                           placeholder="例如 skyr" onchange="onItemIdChange(${idx},this)">
                </div>
                <div class="field-group">
                    <label class="field-label">名稱 (name)</label>
                    <input type="text" id="itemName_${idx}" value="${escapeAttr(item.name || '')}" oninput="onItemFieldInput(${idx},'name',this.value)">
                </div>
                <div class="field-group" style="max-width:100px;">
                    <label class="field-label">layout</label>
                    <select onchange="onItemFieldInput(${idx},'layout',this.value)">
                        <option value="sm" ${item.layout === 'sm' ? 'selected' : ''}>sm</option>
                        <option value="lg" ${item.layout === 'lg' ? 'selected' : ''}>lg</option>
                    </select>
                </div>
            </div>
            <div style="font-size:11px;color:#888;margin-top:2px;">
                sm＝1:1 方形封面，兩張並排（一般項目用這個）｜lg＝2.2:1 橫式封面，獨佔整行
            </div>
            <div class="blocks-list" id="blocksList_${idx}"></div>
            <div class="add-block-bar">
                <button class="btn btn-secondary btn-mini" onclick="addBlock(${idx},'text')">+ 文字段</button>
                <button class="btn btn-secondary btn-mini" onclick="addBlock(${idx},'img')">+ 圖片</button>
                <button class="btn btn-secondary btn-mini" onclick="addBlock(${idx},'heading')">+ 小標題</button>
                <label class="photo-upload-box ${hasId ? '' : 'disabled'}" title="${hasId ? '' : '請先設定 id'}">📷 上傳照片
                    <input type="file" accept="image/*" multiple ${hasId ? '' : 'disabled'}
                           onchange="handleItemPhotoUpload(${idx},this.files)">
                </label>
                <span class="upload-hint">${hasId ? `會存成 ${escapeAttr(item.id)}-NN.webp 並自動接在最後` : '設定 id 後才能上傳'}</span>
            </div>
        `;
        container.appendChild(box);
        renderBlocks(idx);
    });
}

function onItemIdChange(idx, input) {
    const val = input.value.trim().toLowerCase();
    input.value = val;
    if (!val) {
        input.classList.add('invalid');
        showNotif('id 不可為空', 'error');
        return;
    }
    if (!ID_PATTERN.test(val)) {
        input.classList.add('invalid');
        showNotif('id 只能用小寫英文字母、數字與減號，且需以英數開頭', 'error');
        return;
    }
    if (allItemIds(currentKey, idx).includes(val)) {
        input.classList.add('invalid');
        showNotif('id 已被其他項目使用（含另一頁），請換一個', 'error');
        return;
    }
    input.classList.remove('invalid');
    mutateCurrentCategory(cat => { cat.items[idx].id = val; }, `itemId_${idx}`);
}

function addItem() {
    const cur = getCategory(currentKey);
    const newIdx = (cur && cur.items) ? cur.items.length : 0;
    const suggestion = `${keyToSlug(currentKey)}-${newIdx + 1}`;
    const id = (prompt('輸入項目 id（照片檔名前綴，小寫英數與減號，全域唯一）：', suggestion) || '').trim().toLowerCase();
    if (!id) return;
    if (!ID_PATTERN.test(id)) {
        showNotif('id 只能用小寫英文字母、數字與減號，且需以英數開頭', 'error');
        return;
    }
    if (allItemIds().includes(id)) {
        showNotif('id 已被使用（含另一頁），請換一個', 'error');
        return;
    }
    mutateCurrentCategory(cat => {
        if (!cat.items) cat.items = [];
        cat.items.push({ id, name: '', layout: 'sm', blocks: [] });
    }, `itemName_${newIdx}`);
}

function deleteItem(idx) {
    if (!confirm('確定刪除這個項目？')) return;
    mutateCurrentCategory(cat => { cat.items.splice(idx, 1); });
}

function moveItem(idx, dir) {
    mutateCurrentCategory(cat => {
        const j = idx + dir;
        if (j < 0 || j >= cat.items.length) return;
        const tmp = cat.items[idx];
        cat.items[idx] = cat.items[j];
        cat.items[j] = tmp;
    }, `itemBox_${idx + dir}`);
}

function onItemFieldInput(idx, field, value) {
    updateDraftField(cat => { cat.items[idx][field] = value; });
}

/* ---- Block CRUD ---- */

function blockActions(itemIdx, bIdx) {
    return `
        <div class="item-block-actions">
            <button class="btn btn-secondary btn-mini" onclick="moveBlock(${itemIdx},${bIdx},-1)">↑</button>
            <button class="btn btn-secondary btn-mini" onclick="moveBlock(${itemIdx},${bIdx},1)">↓</button>
            <button class="btn btn-danger btn-mini" onclick="deleteBlock(${itemIdx},${bIdx})">刪除</button>
        </div>`;
}

function renderBlocks(itemIdx) {
    const cat = getCategory(currentKey);
    const item = cat.items[itemIdx];
    const list = document.getElementById(`blocksList_${itemIdx}`);
    if (!list) return;
    list.innerHTML = '';
    (item.blocks || []).forEach((block, bIdx) => {
        const row = document.createElement('div');
        row.className = 'block-row';
        row.id = `blockRow_${itemIdx}_${bIdx}`;
        if (block.type === 'text') {
            const fieldId = `blockText_${itemIdx}_${bIdx}`;
            row.innerHTML = `
                <div class="block-row-head">
                    <span class="block-type-badge">文字</span>
                    ${blockActions(itemIdx, bIdx)}
                </div>
                <div class="markup-toolbar">
                    <button class="mini-btn" onclick="insertMarkup('${fieldId}','{bold}','{/bold}',${itemIdx},${bIdx})" title="粗體"><strong>B</strong></button>
                    <button class="mini-btn" onclick="insertMarkup('${fieldId}','{italic}','{/italic}',${itemIdx},${bIdx})" title="斜體"><em>I</em></button>
                    <button class="mini-btn" onclick="insertMarkup('${fieldId}','/n','',${itemIdx},${bIdx})" title="換行">↵</button>
                    <button class="color-btn red" onclick="applyColorMarkup('${fieldId}','#ff0000',${itemIdx},${bIdx})" title="紅色">R</button>
                    <button class="color-btn blue" onclick="applyColorMarkup('${fieldId}','#0066cc',${itemIdx},${bIdx})" title="藍色">B</button>
                    <button class="color-btn green" onclick="applyColorMarkup('${fieldId}','#00aa00',${itemIdx},${bIdx})" title="綠色">G</button>
                </div>
                <textarea id="${fieldId}" rows="6" oninput="onBlockTextInput(${itemIdx},${bIdx},this.value)">${escapeAttr(block.value || '')}</textarea>
            `;
        } else if (block.type === 'img') {
            const src = block.src ? rawUrl(block.src) : '';
            row.innerHTML = `
                <div class="block-row-head">
                    <span class="block-type-badge">圖片</span>
                    ${blockActions(itemIdx, bIdx)}
                </div>
                <div class="block-img-preview">
                    <img src="${src}" onerror="this.style.opacity=0.2">
                    <div>
                        <div style="font-size:11px;color:#666;">${escapeAttr(block.src || '（未設定）')}</div>
                        <div class="picker-actions" style="margin-top:4px;">
                            <button class="btn btn-secondary btn-mini" onclick="openImgModal(function(f){ setBlockImage(${itemIdx},${bIdx},f); })">選擇現有圖片</button>
                            <label class="photo-upload-box">📷 從本機上傳
                                <input type="file" accept="image/*" onchange="handleBlockUpload(${itemIdx},${bIdx},this.files)">
                            </label>
                        </div>
                    </div>
                </div>
            `;
        } else if (block.type === 'heading') {
            const headingFieldId = `blockHeading_${itemIdx}_${bIdx}`;
            row.innerHTML = `
                <div class="block-row-head">
                    <span class="block-type-badge heading">小標題</span>
                    ${blockActions(itemIdx, bIdx)}
                </div>
                <input type="text" id="${headingFieldId}" value="${escapeAttr(block.value || '')}" placeholder="小標題文字（渲染為 &lt;h4&gt;）" oninput="onBlockTextInput(${itemIdx},${bIdx},this.value)">
            `;
        } else {
            row.innerHTML = `
                <div class="block-row-head">
                    <span class="block-type-badge raw">客製區塊 raw</span>
                    ${blockActions(itemIdx, bIdx)}
                </div>
                <div class="raw-block-note">客製區塊，需手動改檔（不提供編輯 UI）</div>
                <textarea disabled style="background:#f5f0e0;color:#8a6d1a;">${escapeAttr(block.html || '')}</textarea>
            `;
        }
        list.appendChild(row);
    });
}

function addBlock(itemIdx, type) {
    const cur = getCategory(currentKey);
    const bIdx = ((cur.items[itemIdx] || {}).blocks || []).length;
    const focusId = type === 'text' ? `blockText_${itemIdx}_${bIdx}`
        : type === 'heading' ? `blockHeading_${itemIdx}_${bIdx}`
        : `blockRow_${itemIdx}_${bIdx}`;
    mutateCurrentCategory(cat => {
        const item = cat.items[itemIdx];
        if (!item.blocks) item.blocks = [];
        if (type === 'text') item.blocks.push({ type: 'text', value: '' });
        else if (type === 'img') item.blocks.push({ type: 'img', src: '' });
        else if (type === 'heading') item.blocks.push({ type: 'heading', value: '' });
    }, focusId);
}

function deleteBlock(itemIdx, bIdx) {
    mutateCurrentCategory(cat => { cat.items[itemIdx].blocks.splice(bIdx, 1); });
}

function moveBlock(itemIdx, bIdx, dir) {
    mutateCurrentCategory(cat => {
        const blocks = cat.items[itemIdx].blocks;
        const j = bIdx + dir;
        if (j < 0 || j >= blocks.length) return;
        const tmp = blocks[bIdx];
        blocks[bIdx] = blocks[j];
        blocks[j] = tmp;
    }, `blockRow_${itemIdx}_${bIdx + dir}`);
}

function onBlockTextInput(itemIdx, bIdx, value) {
    updateDraftField(cat => { cat.items[itemIdx].blocks[bIdx].value = value; });
}

// 文字標記：/n 換行、{bold}/{italic}/{#RRGGBB} color。
// 以游標選取範圍為準：有選取就前後包住，沒選取就在游標處插入空標記。
function insertMarkup(fieldId, before, after, itemIdx, bIdx) {
    const field = document.getElementById(fieldId);
    if (!field) return;
    const start = field.selectionStart;
    const end = field.selectionEnd;
    const text = field.value;
    const selected = text.substring(start, end);
    const newValue = text.substring(0, start) + before + selected + after + text.substring(end);
    field.value = newValue;
    const cursorPos = start + before.length + selected.length + after.length;
    field.focus();
    field.setSelectionRange(cursorPos, cursorPos);
    onBlockTextInput(itemIdx, bIdx, newValue);
}

function applyColorMarkup(fieldId, hexColor, itemIdx, bIdx) {
    insertMarkup(fieldId, `{#${hexColor.replace('#', '')}}`, '{/color}', itemIdx, bIdx);
}

function setBlockImage(itemIdx, bIdx, filename) {
    mutateCurrentCategory(cat => { cat.items[itemIdx].blocks[bIdx].src = filename; },
        `blockRow_${itemIdx}_${bIdx}`);
}

/* ============================================================
   圖片使用狀態（三態）
   ------------------------------------------------------------
   images/catalog/ 是體驗頁與工具頁共用的實體資料夾，但每個編輯器只讀自己那份
   資料檔，所以舊版算出來的「未使用」其實是「本頁沒用到」——工具編輯器因此會
   把 80 張體驗頁的圖列成未使用。這裡改成同時掃描兩份資料（含兩邊的 localStorage
   草稿），把每張圖分成 here / peer / none 三態。
   ============================================================ */

function collectUsed(dataset) {
    const used = new Set();
    if (!dataset) return used;
    dataset.categories.forEach(cat => {
        if (cat.__deleted) return;
        if (cat.cover) used.add(cat.cover);
        (cat.items || []).forEach(it => {
            (it.blocks || []).forEach(b => {
                if (b.type === 'img' && b.src) {
                    used.add(b.src);
                } else if (b.type === 'raw' && b.html) {
                    (b.html.match(/images\/catalog\/([^"'\s)]+)/g) || [])
                        .forEach(m => used.add(m.replace('images/catalog/', '')));
                }
            });
        });
    });
    return used;
}

// 另一頁的「有效資料」＝ GitHub 上的版本 + 同一個瀏覽器裡尚未上傳的草稿。
// 少了這一步，你在工具編輯器草稿裡剛掛上的圖，在體驗編輯器仍會被算成未使用。
function peerEffectiveData() {
    if (!peerData) return null;
    let peerDrafts = {};
    try {
        peerDrafts = JSON.parse(localStorage.getItem(CFG.peer.draftKey) || '{}');
    } catch (e) { /* 草稿壞掉就當作沒有 */ }
    const origKeys = peerData.categories.map(c => c.key);
    const merged = [];
    origKeys.forEach(key => {
        const d = peerDrafts[key];
        if (d && d.__deleted) return;
        merged.push(d || peerData.categories.find(c => c.key === key));
    });
    Object.keys(peerDrafts).forEach(key => {
        if (!origKeys.includes(key) && !peerDrafts[key].__deleted) merged.push(peerDrafts[key]);
    });
    return { categories: merged };
}

function computeUsage() {
    return {
        here: collectUsed(buildFinalData()),
        peer: collectUsed(peerEffectiveData()),
    };
}

/* ---- 圖片挑選器 ---- */

function openImgModal(setter) {
    imgModalTargetSetter = setter;
    imgFilter = 'unused';
    document.getElementById('imgModal').classList.add('open');
    document.getElementById('imgModalGrid').innerHTML = '';
    document.getElementById('imgModalManual').style.display = 'none';
    document.getElementById('imgModalStatus').textContent = '載入中...';
    syncFilterButtons();
    loadImageList();
}

function closeImgModal() {
    document.getElementById('imgModal').classList.remove('open');
    imgModalTargetSetter = null;
}

function setImgFilter(mode) {
    imgFilter = mode;
    syncFilterButtons();
    renderImgGrid(imageListCache);
}

function syncFilterButtons() {
    document.querySelectorAll('#imgFilterSeg button').forEach(b => {
        b.classList.toggle('active', b.dataset.mode === imgFilter);
    });
}

function refreshImageList() {
    imageListCache = null;
    document.getElementById('imgModalStatus').textContent = '重新載入中...';
    return loadImageList();
}

async function fetchImageList() {
    const r = await fetch(
        `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${IMAGE_DIR.replace(/\/$/, '')}`,
        { headers: ghHeaders() }   // 帶 PAT 時速率上限 60/小時 → 5000/小時
    );
    if (!r.ok) throw new Error('API 讀取失敗（未登入時每小時 60 次上限）');
    return (await r.json())
        .filter(f => /\.(webp|png|jpe?g)$/i.test(f.name))
        .map(f => f.name);
}

async function loadImageList() {
    if (imageListCache) { renderImgGrid(imageListCache); return imageListCache; }
    try {
        imageListCache = await fetchImageList();
        renderImgGrid(imageListCache);
        return imageListCache;
    } catch (e) {
        const status = document.getElementById('imgModalStatus');
        if (status) status.textContent = '無法載入圖片清單：' + e.message + '（請改用手動輸入檔名）';
        const manual = document.getElementById('imgModalManual');
        if (manual) manual.style.display = 'flex';
        throw e;
    }
}

function renderImgGrid(files) {
    if (!files) return;
    const usage = computeUsage();
    const stateOf = name => usage.here.has(name) ? 'here' : (usage.peer.has(name) ? 'peer' : 'none');

    const nUnused = files.filter(f => stateOf(f) === 'none').length;
    const nHere = files.filter(f => stateOf(f) === 'here').length;
    const nPeer = files.filter(f => stateOf(f) === 'peer').length;

    document.getElementById('imgModalStatus').innerHTML =
        `共 ${files.length} 張 ｜ <strong>未使用 ${nUnused}</strong> ｜ ${CFG.scope}已用 ${nHere} ｜ ${CFG.peer.scope}已用 ${nPeer}`;

    const grid = document.getElementById('imgModalGrid');
    grid.innerHTML = '';
    const displayFiles = files.filter(f => {
        const s = stateOf(f);
        if (imgFilter === 'all') return true;
        if (imgFilter === 'here') return s === 'here';
        return s === 'none';
    });

    if (displayFiles.length === 0) {
        const empty = document.createElement('div');
        empty.style.cssText = 'grid-column:1/-1;padding:24px 12px;text-align:center;font-size:12px;color:#888;line-height:1.7;';
        empty.innerHTML = imgFilter === 'unused'
            ? '目前沒有未使用的圖片。<br>直接在項目裡按「📷 上傳照片」，或切到「全部」重複挑選已用過的圖。'
            : '這個篩選條件下沒有圖片。';
        grid.appendChild(empty);
        document.getElementById('imgModalManual').style.display = 'flex';
        return;
    }

    displayFiles.forEach(name => {
        const state = stateOf(name);
        const wrap = document.createElement('div');
        wrap.className = 'thumb-wrap';
        const img = document.createElement('img');
        img.src = rawUrl(name);
        img.loading = 'lazy';
        img.onclick = () => {
            if (imgModalTargetSetter) imgModalTargetSetter(name);
            closeImgModal();
        };
        wrap.appendChild(img);
        if (state !== 'none') {
            const badge = document.createElement('div');
            badge.className = `used-badge ${state}`;
            badge.textContent = state === 'here' ? '本頁' : CFG.peer.scope;
            wrap.appendChild(badge);
        }
        const fname = document.createElement('div');
        fname.className = 'fname';
        fname.textContent = name;
        wrap.appendChild(fname);
        grid.appendChild(wrap);
    });
    document.getElementById('imgModalManual').style.display = 'flex';
}

function confirmManualImage() {
    const val = document.getElementById('imgManualInput').value.trim();
    if (!val) return;
    if (imgModalTargetSetter) imgModalTargetSetter(val);
    closeImgModal();
}

/* ============================================================
   從編輯器直接上傳照片
   ------------------------------------------------------------
   移植自 tools/trip-editor-pro.html 的階段 D 上傳功能，差別：
   - catalog 只需要單一尺寸（景點要 thumb + medium 兩份）
   - 檔名錨點是 item.id（景點是 spot.id）；封面則用 {分類 key}-cover-NN
   - 接號時不分大小寫比對：既有檔案有 Svarta-01、Seabaron-01 這種大寫開頭的，
     若用區分大小寫的比對，下一張會拿到 svarta-01.webp，在 GitHub 上是另一個檔案。
   ============================================================ */

function computeNextAvailableNumber(prefix, existingFiles) {
    const re = new RegExp('^' + prefix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '-(\\d{2,})\\.', 'i');
    let max = 0;
    existingFiles.forEach(f => {
        const m = String(f).match(re);
        if (m) max = Math.max(max, parseInt(m[1], 10));
    });
    return max + 1;
}

function resizeToWebpBlob(file, maxDim, quality) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        const url = URL.createObjectURL(file);
        img.onload = () => {
            URL.revokeObjectURL(url);
            let { width, height } = img;
            if (width >= height) {
                if (width > maxDim) { height = Math.round(height * maxDim / width); width = maxDim; }
            } else {
                if (height > maxDim) { width = Math.round(width * maxDim / height); height = maxDim; }
            }
            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            canvas.getContext('2d').drawImage(img, 0, 0, width, height);
            canvas.toBlob(blob => {
                if (!blob) { reject(new Error('瀏覽器不支援輸出 WebP')); return; }
                resolve(blob);
            }, 'image/webp', quality);
        };
        img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('圖片讀取失敗')); };
        img.src = url;
    });
}

function blobToBase64(blob) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result.split(',')[1]);
        reader.onerror = () => reject(new Error('檔案讀取失敗'));
        reader.readAsDataURL(blob);
    });
}

// 上傳前一定先查該路徑是否已存在，避免用同一個檔名意外覆蓋掉別人剛好也在傳的檔案。
async function uploadNewImageFile(path, blob, pat) {
    const checkResp = await fetch(
        `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${path}`,
        { headers: { 'Authorization': `token ${pat}` } }
    );
    if (checkResp.ok) {
        throw new Error(`${path} 已經存在，請按「🔄 重新整理清單」後重試`);
    }
    const base64 = await blobToBase64(blob);
    const putResp = await fetch(
        `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${path}`,
        {
            method: 'PUT',
            headers: { 'Authorization': `token ${pat}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: `📷 新增照片 ${path}`, content: base64 })
        }
    );
    if (!putResp.ok) {
        const errBody = await putResp.json().catch(() => ({}));
        throw new Error(`上傳失敗：${errBody.message || putResp.status}`);
    }
}

// 進度面板固定在畫面右下角，不在項目 DOM 裡 —— 上傳完成會重繪編輯區，
// 若把狀態放在項目內，錯誤訊息會跟著被清掉。
function openProgress(title) {
    const el = document.getElementById('uploadProgress');
    el.innerHTML = `<div class="up-head"><span>${escapeAttr(title)}</span>
        <button class="btn btn-secondary btn-mini" onclick="closeProgress()">關閉</button></div>`;
    el.classList.add('open');
    return el;
}

function closeProgress() {
    document.getElementById('uploadProgress').classList.remove('open');
}

function progressRow(text, cls) {
    const el = document.getElementById('uploadProgress');
    const row = document.createElement('div');
    row.className = `up-row ${cls}`;
    row.textContent = text;
    el.appendChild(row);
    return row;
}

// 目前已知會佔用檔名的來源：GitHub 上的實體檔案 + 本編輯器所有草稿裡引用到的檔名
// + 另一頁草稿引用到的檔名。盡量抓最新，抓不到就退回快取。
async function gatherKnownFilenames() {
    let files = [];
    try {
        imageListCache = null;
        files = await fetchImageList();
        imageListCache = files;
    } catch (e) {
        files = imageListCache || [];
    }
    const usage = computeUsage();
    return files.concat(Array.from(usage.here), Array.from(usage.peer));
}

async function runUpload(prefix, fileList, title, onDone) {
    const files = Array.from(fileList || []);
    if (!files.length) return;

    let pat;
    try {
        pat = getPAT();
    } catch (e) {
        showNotif('❌ ' + e.message, 'error');
        return;
    }

    openProgress(title);
    const known = await gatherKnownFilenames();
    const uploaded = [];

    for (const file of files) {
        const n = computeNextAvailableNumber(prefix, known);
        const filename = `${prefix}-${String(n).padStart(2, '0')}.webp`;
        const row = progressRow(`⏳ ${file.name} → ${filename} 處理中...`, 'pending');
        try {
            const blob = await resizeToWebpBlob(file, UPLOAD_MAX_DIM, UPLOAD_QUALITY);
            row.textContent = `⏳ ${filename} 上傳中...`;
            await uploadNewImageFile(`${IMAGE_DIR}${filename}`, blob, pat);
            row.className = 'up-row ok';
            row.textContent = `✅ ${filename}（${Math.round(blob.size / 1024)} KB）`;
            known.push(filename);      // 同一批下一張才不會撞號
            uploaded.push(filename);
        } catch (e) {
            row.className = 'up-row err';
            row.textContent = `❌ ${file.name}：${e.message}`;
        }
    }

    imageListCache = null;  // 讓挑選器下次重抓
    if (uploaded.length) {
        onDone(uploaded);
        showNotif(`✅ ${uploaded.length} 張照片已上傳並掛上（資料檔仍需按「⬆️ 上傳到GitHub」）`, 'success');
    }
}

function handleItemPhotoUpload(itemIdx, fileList) {
    const item = getCategory(currentKey).items[itemIdx];
    if (!item.id) { showNotif('請先設定這個項目的 id', 'error'); return; }
    runUpload(item.id, fileList, `上傳到「${item.name || item.id}」`, uploaded => {
        // 照片已經 commit 到 GitHub，這裡立刻把 block 掛上並寫進草稿，
        // 縮短「檔案在 repo 裡、資料檔卻沒引用」的孤兒視窗。
        mutateCurrentCategory(cat => {
            const it = cat.items[itemIdx];
            if (!it.blocks) it.blocks = [];
            uploaded.forEach(f => it.blocks.push({ type: 'img', src: f }));
        }, `itemBox_${itemIdx}`);
    });
}

function handleBlockUpload(itemIdx, bIdx, fileList) {
    const item = getCategory(currentKey).items[itemIdx];
    if (!item.id) { showNotif('請先設定這個項目的 id', 'error'); return; }
    runUpload(item.id, fileList, `更換「${item.name || item.id}」的圖片`, uploaded => {
        setBlockImage(itemIdx, bIdx, uploaded[0]);
    });
}

function handleCoverUpload(fileList) {
    const prefix = `${keyToSlug(currentKey)}-cover`;
    runUpload(prefix, fileList, `上傳「${getCategory(currentKey).title || currentKey}」的封面`, uploaded => {
        setCoverImage(uploaded[0]);
    });
}

/* ============================================================
   即時預覽
   ============================================================ */

function updateFullPreview() {
    const cat = getCategory(currentKey);
    const el = document.getElementById('previewContent');
    if (!cat) return;
    let html = `<div class="preview-card"><strong>${cat.emoji || ''} ${escapeAttr(cat.title || '')}</strong>
        <p style="margin-top:6px;">${parseMarkup(cat.sub || '')}</p></div>`;
    (cat.items || []).forEach(item => {
        html += `<div class="preview-card">`;
        if (item.name) html += `<h4>${escapeAttr(item.name)}</h4>`;
        (item.blocks || []).forEach(b => {
            if (b.type === 'text') {
                html += `<p>${parseMarkup(b.value)}</p>`;
            } else if (b.type === 'img') {
                html += `<img src="${b.src ? rawUrl(b.src) : ''}" onerror="this.style.opacity=0.2">`;
            } else if (b.type === 'heading') {
                html += `<h4>${escapeAttr(b.value)}</h4>`;
            } else if (b.type === 'raw') {
                html += b.html || '';
            }
        });
        html += `</div>`;
    });
    el.innerHTML = html;
}

/* ============================================================
   保存 / 上傳
   ============================================================ */

function discardChanges() {
    if (!confirm('放棄目前分類未上傳的變更？')) return;
    delete drafts[currentKey];
    saveDrafts();
    renderSidebar();
    renderEditor();
}

function saveLocally() {
    showNotif('✅ 已本地保存（草稿）', 'success');
}

function buildFinalData() {
    if (!data) return { categories: [] };
    const origKeys = data.categories.map(c => c.key);
    const merged = [];
    origKeys.forEach(key => {
        const d = drafts[key];
        if (d && d.__deleted) return;
        merged.push(d ? d : data.categories.find(c => c.key === key));
    });
    Object.keys(drafts).forEach(key => {
        if (!origKeys.includes(key) && !drafts[key].__deleted) merged.push(drafts[key]);
    });
    return { categories: merged };
}

function countStats(dataset) {
    let items = 0, imgs = 0;
    dataset.categories.forEach(c => {
        (c.items || []).forEach(it => {
            items++;
            (it.blocks || []).forEach(b => { if (b.type === 'img') imgs++; });
        });
    });
    return { categories: dataset.categories.length, items, imgs };
}

function startUpload() {
    if (Object.keys(drafts).length === 0) { showNotif('沒有未上傳的修改', 'error'); return; }

    let finalData;
    try {
        finalData = buildFinalData();
        JSON.stringify(finalData);                       // guard 1
    } catch (e) {
        showNotif('❌ 資料序列化失敗：' + e.message, 'error');
        return;
    }

    // guard 2
    if (!Array.isArray(finalData.categories) || finalData.categories.length < 1) {
        showNotif('❌ 分類陣列為空，中止上傳', 'error');
        return;
    }
    // guard 3：分類 key 非空且不重複
    const seenKeys = new Set();
    for (const c of finalData.categories) {
        if (!c.key || !c.title) { showNotif('❌ 有分類缺少 key 或 title，中止上傳', 'error'); return; }
        if (seenKeys.has(c.key)) { showNotif('❌ key 重複：' + c.key + '，中止上傳', 'error'); return; }
        seenKeys.add(c.key);
    }
    // guard 3b（v1.1 新增）：item id 非空、格式合法、本檔內不重複
    const seenIds = new Set();
    for (const c of finalData.categories) {
        for (const it of (c.items || [])) {
            const where = `${c.title || c.key} 的「${it.name || '(未命名項目)'}」`;
            if (!it.id) { showNotif(`❌ ${where} 缺少 id，中止上傳`, 'error'); return; }
            if (!ID_PATTERN.test(it.id)) { showNotif(`❌ ${where} 的 id「${it.id}」格式不合法，中止上傳`, 'error'); return; }
            if (seenIds.has(it.id)) { showNotif(`❌ item id 重複：${it.id}，中止上傳`, 'error'); return; }
            seenIds.add(it.id);
        }
    }
    // guard 4
    if (finalData.categories.length < originalCategoryCount) {
        if (!confirm(`分類數從 ${originalCategoryCount} 減少為 ${finalData.categories.length}，確定要刪除分類嗎？`)) return;
    }

    const before = countStats(data);
    const after = countStats(finalData);

    const noCover = finalData.categories.filter(c => !c.cover).map(c => c.title || c.key);
    const coverWarn = noCover.length
        ? `<div style="margin-top:8px;color:#b8860b;">⚠️ 以下分類尚未設定封面圖，總覽頁會顯示 emoji 佔位：<br>${noCover.join('、')}</div>`
        : '';

    // 警告級：id 與另一頁撞名不會擋上傳，但兩邊的照片會共用同一組流水號，先提醒一聲
    const peerIds = new Set();
    const peerEff = peerEffectiveData();
    if (peerEff) peerEff.categories.forEach(c => (c.items || []).forEach(it => { if (it.id) peerIds.add(it.id); }));
    const clash = Array.from(seenIds).filter(id => peerIds.has(id));
    const clashWarn = clash.length
        ? `<div style="margin-top:8px;color:#b8860b;">⚠️ 以下 id 與${CFG.peer.scope}重複，兩邊照片會共用流水號：${clash.join('、')}</div>`
        : '';

    document.getElementById('diffSummary').innerHTML =
        `分類 ${before.categories} → ${after.categories}<br>` +
        `項目 ${before.items} → ${after.items}<br>` +
        `圖片 ${before.imgs} → ${after.imgs}<br>` +
        `<span style="color:#218838;">✓ ${seenIds.size} 個 item id 格式合法且不重複</span>` +
        coverWarn + clashWarn;
    window.__pendingUploadData = finalData;
    document.getElementById('uploadModal').classList.add('open');
}

function closeUploadModal() {
    document.getElementById('uploadModal').classList.remove('open');
}

async function confirmUpload() {
    closeUploadModal();
    const finalData = window.__pendingUploadData;
    if (!finalData) return;

    const uploadBtn = document.getElementById('uploadBtn');
    uploadBtn.disabled = true;
    uploadBtn.textContent = '⏳ 上傳中...';

    try {
        const pat = getPAT();

        const getResp = await fetch(`https://raw.githubusercontent.com/${GITHUB_OWNER}/${GITHUB_REPO}/main/${CFG.file}`);
        const oldContent = await getResp.text();

        const marker = `const ${CFG.varName} = `;
        const startIdx = oldContent.indexOf(marker);
        if (startIdx < 0) throw new Error('找不到資料標記，中止上傳');

        const header = oldContent.substring(0, startIdx);
        const endIdx = oldContent.lastIndexOf('};');   // guard: 必須是 lastIndexOf
        if (endIdx < startIdx) throw new Error('檔案結構異常，中止上傳');
        const footer = oldContent.substring(endIdx + 2);

        // guard 5：header 非空，且舊檔確實含有變數宣告
        if (header.trim().length === 0) throw new Error('header 異常，中止上傳');
        if (oldContent.indexOf(`const ${CFG.varName}`) === -1) {
            throw new Error('舊檔案缺少 const ' + CFG.varName + ' 宣告，中止上傳');
        }

        const newContent = header + marker + JSON.stringify(finalData, null, 2) + ';\n' + footer;

        const shaResp = await fetch(
            `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${CFG.file}`,
            { headers: { 'Authorization': `token ${pat}` } }
        );
        const fileData = await shaResp.json();

        const updateResp = await fetch(
            `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${CFG.file}`,
            {
                method: 'PUT',
                headers: { 'Authorization': `token ${pat}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: `📝 編輯${CFG.label}：${finalData.categories.length} 個分類 | ${CFG.file.split('/').pop()}`,
                    content: utf8ToBase64(newContent),
                    sha: fileData.sha
                })
            }
        );
        if (!updateResp.ok) throw new Error('更新失敗');

        data = finalData;
        originalCategoryCount = finalData.categories.length;
        drafts = {};
        saveDrafts();

        showNotif('✅ 已上傳到 GitHub！', 'success');
        renderSidebar();
        if (currentKey && !data.categories.find(c => c.key === currentKey)) clearEditor();
        else renderEditor();
    } catch (e) {
        showNotif('❌ 錯誤: ' + e.message, 'error');
    } finally {
        uploadBtn.disabled = false;
        uploadBtn.textContent = '⬆️ 上傳到GitHub';
    }
}

/* ============================================================
   對外掛載（HTML 的 onclick 需要 global）
   ============================================================ */

Object.assign(window, {
    addCategory, deleteCategory, selectCategory,
    onFieldInput, setCoverImage,
    addItem, deleteItem, moveItem, onItemFieldInput, onItemIdChange,
    addBlock, deleteBlock, moveBlock, onBlockTextInput,
    insertMarkup, applyColorMarkup, setBlockImage,
    openImgModal, closeImgModal, refreshImageList, renderImgGrid, setImgFilter,
    confirmManualImage,
    handleItemPhotoUpload, handleBlockUpload, handleCoverUpload, closeProgress,
    discardChanges, saveLocally, startUpload, closeUploadModal, confirmUpload,
});

window.addEventListener('load', init);

})();
