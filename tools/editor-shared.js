/* ============================================================
   三個編輯器的共用底層（v1.5）
   ------------------------------------------------------------
   在此之前，catalog-editor-core.js 與 trip-editor-pro.html 各自
   帶著一份同名同義的函式（getPAT / resizeToWebpBlob / blobToBase64 /
   uploadNewImageFile / computeNextAvailableNumber / showNotif /
   escapeAttr）。兩份已經漂移：core 版的 computeNextAvailableNumber
   有 /i、有 regex 逸出、用 {2,}，trip 版三樣都沒有。這個檔案把它們
   收成一份，三個編輯器都引用。

   載入順序：本檔必須排在 catalog-editor-core.js 之前，
   也必須排在 trip-editor-pro.html 自己的 <script> 之前。

   對外只掛一個 window.EditorShared，各編輯器在自己的作用域頂端
   用解構取出要用的函式，呼叫端寫法完全不變。

   ★ 唯一的例外是 armPaste()：它要給 HTML 的 onclick 用，所以另外
     直接掛在 window 上。
   ============================================================ */

(function () {
'use strict';

/* ============================================================
   §1 GitHub 設定
   ============================================================ */

let GH_OWNER = '';
let GH_REPO = '';

function configure(opts) {
    GH_OWNER = opts.owner;
    GH_REPO = opts.repo;
}

/* ============================================================
   §2 小工具
   ============================================================ */

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

/* ============================================================
   §3 PAT
   ------------------------------------------------------------
   維持既有行為（localStorage.github_pat），只是收成一份。
   注意：編輯器與正式網站同源，而 data/*.js 是會被編輯器改寫的
   可執行 JS，等於一個有 repo 寫入權的 token 長期躺在同源的
   localStorage 裡。改成 sessionStorage 是另一件事，不在這次範圍。
   ============================================================ */

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

function clearPAT() {
    localStorage.removeItem('github_pat');
    showNotif('🔑 已清除本機儲存的 PAT', 'success');
}

/* ============================================================
   §4 檔名接號
   ------------------------------------------------------------
   採用原 catalog 版（較嚴謹的那一份）：
   - 前綴先做 regex 逸出，避免 id 含特殊字元時比對錯誤
   - 不分大小寫：images/catalog/ 有 Svarta-01、Seabaron-01 這種大寫開頭的
     舊檔，若用區分大小寫的比對，下一張會拿到 svarta-01.webp，
     在 GitHub 上是另一個檔案，等於撞號
   - {2,} 而非 {2}：超過 99 張時仍能正確接號
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

/* ============================================================
   §5 圖片轉檔
   ------------------------------------------------------------
   接受任何 Blob／File，所以剪貼簿來的圖（getAsFile() 回傳的 File）
   走的是同一條路，不需要另一套。

   ★ toBlob 的靜默 fallback ★
   規格上瀏覽器不支援要求的 type 時，不會回 null，而是「改用 PNG」。
   舊寫法只檢查 !blob，因此在 Safari 16.4 以前會安靜產出一個
   副檔名 .webp、內容其實是 PNG 的檔案（大 3~5 倍）。
   這裡改成檢查 blob.type，真的拿不到 WebP 就明確中止。
   ============================================================ */

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
                if (blob.type !== 'image/webp') {
                    reject(new Error('這個瀏覽器不支援輸出 WebP（會變成 PNG），請改用 Chrome／Edge，或 Safari 16.4 以上'));
                    return;
                }
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
        `https://api.github.com/repos/${GH_OWNER}/${GH_REPO}/contents/${path}`,
        { headers: { 'Authorization': `token ${pat}` } }
    );
    if (checkResp.ok) {
        throw new Error(`${path} 已經存在，請按「🔄 重新整理清單」後重試`);
    }
    const base64 = await blobToBase64(blob);
    const putResp = await fetch(
        `https://api.github.com/repos/${GH_OWNER}/${GH_REPO}/contents/${path}`,
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

/* ============================================================
   §6 截圖貼上 / 拖放
   ------------------------------------------------------------
   剪貼簿的圖經 getAsFile() 拿到的就是 File 物件，所以轉檔、接號、
   查重、上傳這整條鏈一行都不用改，只要把 File 餵進既有的上傳函式。

   要解決的只有「貼到哪裡」：paste 是 document 層級事件，它不知道
   目標。做法是「先武裝、再貼上」：

     1. 每個上傳位置旁邊放一顆 armPaste('<key>') 的按鈕，按下去
        就把自己登記成目標並高亮
     2. document 的 paste 監聽器取出圖片，交給編輯器註冊的 onFiles(key, files)
     3. 沒有武裝就貼上時，不默默丟掉——掃描畫面上所有
        [data-paste-key] 元素，列成選單讓使用者挑
     4. 用掉就解除武裝，避免下一次不相干的貼上又跑進同一個位置

   拖放共用同一條出口：拖到某個貼上區上面直接放開，不需要先武裝。
   ============================================================ */

let armedKey = null;
let onFilesHandler = null;
let pendingFiles = null;      // 未武裝時暫存，等使用者從選單挑目標

function setPasteHandler(fn) {
    onFilesHandler = fn;
}

function extractImageFiles(dt) {
    if (!dt) return [];
    // items 才分得出 kind='file'；files 在某些瀏覽器貼上純文字時也會是空陣列
    const fromItems = Array.from(dt.items || [])
        .filter(i => i.kind === 'file' && i.type.startsWith('image/'))
        .map(i => i.getAsFile())
        .filter(Boolean);
    if (fromItems.length) return fromItems;
    return Array.from(dt.files || []).filter(f => f.type.startsWith('image/'));
}

function zones() {
    return Array.from(document.querySelectorAll('[data-paste-key]'));
}

function armPaste(key) {
    armedKey = key;
    refreshArmedHighlight();
    const el = zones().find(z => z.dataset.pasteKey === key);
    const label = el ? (el.dataset.pasteLabel || '這個位置') : '這個位置';
    showNotif(`📋 已鎖定「${label}」，現在按 Ctrl+V／⌘V 貼上截圖`, 'success');
}

function disarmPaste() {
    armedKey = null;
    refreshArmedHighlight();
}

// 編輯器重繪之後呼叫，讓高亮跟著新的 DOM 走。
function refreshArmedHighlight() {
    zones().forEach(z => z.classList.toggle('paste-armed', z.dataset.pasteKey === armedKey));
}

function deliver(key, files) {
    if (!files.length) return;
    if (!onFilesHandler) { showNotif('❌ 本編輯器尚未接上貼上功能', 'error'); return; }
    disarmPaste();
    onFilesHandler(key, files);
}

/* ---- 未武裝時的目標選擇面板 ---- */

function ensurePicker() {
    let el = document.getElementById('pasteTargetPicker');
    if (el) return el;
    el = document.createElement('div');
    el.id = 'pasteTargetPicker';
    el.innerHTML = `
        <div class="ptp-box">
            <div class="ptp-head">要把這張截圖貼到哪裡？</div>
            <img class="ptp-preview" id="ptpPreview" alt="">
            <div class="ptp-list" id="ptpList"></div>
            <button type="button" class="ptp-cancel" id="ptpCancel">取消</button>
        </div>`;
    document.body.appendChild(el);
    el.addEventListener('click', e => { if (e.target === el) closePicker(); });
    el.querySelector('#ptpCancel').addEventListener('click', closePicker);
    return el;
}

function closePicker() {
    const el = document.getElementById('pasteTargetPicker');
    if (el) el.classList.remove('open');
    const prev = document.getElementById('ptpPreview');
    if (prev && prev.src.startsWith('blob:')) { URL.revokeObjectURL(prev.src); prev.src = ''; }
    pendingFiles = null;
}

function openPicker(files) {
    const list = zones();
    if (!list.length) {
        showNotif('❌ 目前畫面沒有可以貼上的位置，請先展開一個項目', 'error');
        return;
    }
    pendingFiles = files;
    const el = ensurePicker();
    const prev = el.querySelector('#ptpPreview');
    prev.src = URL.createObjectURL(files[0]);
    const listEl = el.querySelector('#ptpList');
    listEl.innerHTML = '';
    list.forEach(z => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'ptp-item';
        btn.textContent = z.dataset.pasteLabel || z.dataset.pasteKey;
        btn.addEventListener('click', () => {
            const f = pendingFiles;
            const key = z.dataset.pasteKey;
            closePicker();
            deliver(key, f);
        });
        listEl.appendChild(btn);
    });
    el.classList.add('open');
}

/* ---- 事件掛載 ---- */

function initPasteSupport() {
    document.addEventListener('paste', e => {
        const files = extractImageFiles(e.clipboardData);
        if (!files.length) return;          // 純文字貼上，交還給輸入框
        e.preventDefault();
        if (armedKey) deliver(armedKey, files);
        else openPicker(files);
    });

    // 拖放：拖到貼上區上面直接放開就送出，不需要先武裝。
    // 沒拖到貼上區的一律吃掉，避免瀏覽器把圖片當成網址開走、離開編輯頁。
    document.addEventListener('dragover', e => {
        if (!e.dataTransfer || !Array.from(e.dataTransfer.types || []).includes('Files')) return;
        e.preventDefault();
        const zone = e.target.closest && e.target.closest('[data-paste-key]');
        zones().forEach(z => z.classList.toggle('paste-over', z === zone));
    });
    document.addEventListener('dragleave', e => {
        if (e.relatedTarget) return;
        zones().forEach(z => z.classList.remove('paste-over'));
    });
    document.addEventListener('drop', e => {
        const files = extractImageFiles(e.dataTransfer);
        if (!files.length) return;
        e.preventDefault();
        zones().forEach(z => z.classList.remove('paste-over'));
        const zone = e.target.closest && e.target.closest('[data-paste-key]');
        if (zone) deliver(zone.dataset.pasteKey, files);
        else if (armedKey) deliver(armedKey, files);
        else openPicker(files);
    });

    injectStyles();
}

// 樣式自帶，這樣三個編輯器不用各自複製一份 CSS
// （trip-editor-pro.html 的樣式是內嵌的，catalog 的在 catalog-editor-core.css）。
function injectStyles() {
    if (document.getElementById('editorSharedStyles')) return;
    const s = document.createElement('style');
    s.id = 'editorSharedStyles';
    s.textContent = `
.paste-zone {
    display: inline-flex; align-items: center; gap: 5px; padding: 5px 10px;
    border: 1px dashed #b58bd8; border-radius: 4px; background: #faf5ff;
    cursor: pointer; font-size: 11px; font-weight: 600; color: #7b4aa8;
    font-family: inherit; line-height: 1.4;
}
.paste-zone:hover { background: #f2e8ff; }
.paste-zone:disabled { opacity: .45; cursor: not-allowed; }
.paste-zone.paste-armed {
    background: #7b4aa8; color: #fff; border-style: solid; border-color: #7b4aa8;
    box-shadow: 0 0 0 3px rgba(123,74,168,.22);
}
.paste-zone.paste-over { background: #e8d9ff; border-color: #7b4aa8; border-style: solid; }
#pasteTargetPicker {
    display: none; position: fixed; inset: 0; z-index: 9999;
    background: rgba(0,0,0,.45); align-items: center; justify-content: center;
}
#pasteTargetPicker.open { display: flex; }
#pasteTargetPicker .ptp-box {
    background: #fff; border-radius: 8px; padding: 16px; width: min(420px, 92vw);
    max-height: 82vh; overflow-y: auto; font-size: 13px;
    box-shadow: 0 12px 40px rgba(0,0,0,.3);
}
#pasteTargetPicker .ptp-head { font-weight: 700; margin-bottom: 10px; }
#pasteTargetPicker .ptp-preview {
    display: block; max-width: 100%; max-height: 140px; margin: 0 auto 12px;
    border: 1px solid #e0e0e0; border-radius: 4px; background: #fafafa;
}
#pasteTargetPicker .ptp-item {
    display: block; width: 100%; text-align: left; margin-bottom: 6px;
    padding: 8px 10px; border: 1px solid #d8d8e8; border-radius: 4px;
    background: #f7f7ff; cursor: pointer; font-size: 12px; font-family: inherit;
}
#pasteTargetPicker .ptp-item:hover { background: #e9edff; }
#pasteTargetPicker .ptp-cancel {
    width: 100%; margin-top: 6px; padding: 7px; border: 1px solid #d0d0d0;
    border-radius: 4px; background: #f0f0f0; cursor: pointer;
    font-size: 12px; font-family: inherit;
}`;
    document.head.appendChild(s);
}

/* ---- 貼上區的 HTML 產生器（三個編輯器共用同一個外觀） ---- */

function pasteZoneHtml(key, label, opts = {}) {
    const disabled = opts.disabled ? 'disabled' : '';
    const text = opts.text || '📋 貼上截圖';
    return `<button type="button" class="paste-zone" ${disabled}
        data-paste-key="${escapeAttr(key)}" data-paste-label="${escapeAttr(label)}"
        title="按一下鎖定這裡，然後 Ctrl+V／⌘V 貼上截圖；也可以直接把圖片拖進來"
        onclick="armPaste('${escapeAttr(key)}')">${text}</button>`;
}

/* ============================================================
   §7 對外
   ============================================================ */

window.EditorShared = {
    configure,
    escapeAttr, showNotif,
    getPAT, peekPAT, ghHeaders, clearPAT,
    computeNextAvailableNumber,
    resizeToWebpBlob, blobToBase64, uploadNewImageFile,
    setPasteHandler, initPasteSupport, refreshArmedHighlight,
    disarmPaste, pasteZoneHtml,
};

// HTML 的 onclick 需要 global
window.armPaste = armPaste;

})();
