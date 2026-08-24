// 這個檔案是「費用記帳頁籤的邏輯」，一般調整行程/景點內容不需要改這裡，改 data/ 資料夾裡的檔案即可。

// ===== BUDGET =====
const BUDGET = TRIP_DATA.budget;
const CAT_ICON = BUDGET.categories.reduce(function(map, item){ map[item.id] = item.icon; return map; }, {});
const CAT_NAME = BUDGET.categories.reduce(function(map, item){ map[item.id] = item.name; return map; }, {});
const PEOPLE = BUDGET.people.slice();
const BASE_CURRENCY = BUDGET.baseCurrency;
const BASE_SYMBOL = BUDGET.baseCurrencySymbol || (BASE_CURRENCY + ' ');

const STORE_KEY     = BUDGET.storageKey || 'trip_expenses';
const RATES_KEY     = STORE_KEY + '_rates';
const PREFS_KEY     = STORE_KEY + '_prefs';

let selCat          = BUDGET.categories[0].id;
let selPayer        = PEOPLE[0];
let selParticipants = PEOPLE.slice();
let expenses        = JSON.parse(localStorage.getItem(STORE_KEY) || '[]');
let editingId       = null;   // 目前正在編輯的消費 id；null 表示新增模式

function persistExpenses() {
  localStorage.setItem(STORE_KEY, JSON.stringify(expenses));
}

function escapeHtml(str) {
  return String(str == null ? '' : str)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

// 每筆消費的唯一 id。原本只用 Date.now()，兩個人在同一毫秒新增就會撞號，
// 導致刪除或編輯時動到別人的記錄，因此補上亂數尾碼。
function newExpenseId() {
  return String(Date.now()) + '-' + Math.random().toString(36).slice(2, 7);
}

// ---------- 匯率：整趟行程共用一組，存本機也同步雲端 ----------
function loadLocalRates() {
  try { return JSON.parse(localStorage.getItem(RATES_KEY) || 'null'); } catch (e) { return null; }
}
function collectRatesFromInputs() {
  var out = {};
  BUDGET.currencies.forEach(function(cur) {
    if (cur.code === BASE_CURRENCY) return;
    var el = document.getElementById('r' + cur.code);
    if (el) out[cur.code] = parseFloat(el.value) || cur.rate;
  });
  return out;
}
function applyRatesToInputs(rates) {
  if (!rates) return;
  Object.keys(rates).forEach(function(code) {
    var el = document.getElementById('r' + code);
    if (el && parseFloat(el.value) !== rates[code]) el.value = rates[code];
  });
}
// 匯率輸入變動：存本機 + 推雲端 + 重算所有畫面（單一匯率、回溯重算）
function onRateInput() {
  var rates = collectRatesFromInputs();
  localStorage.setItem(RATES_KEY, JSON.stringify(rates));
  if (window.cloudRates && window.cloudRates.available) window.cloudRates.set(rates);
  renderSummary();
  renderExpenses();
  updateAmountPreview();
}
// 由 js/firebase-config.js 在自己載入完成後主動呼叫
function initCloudRatesSync() {
  if (!(window.cloudRates && window.cloudRates.available)) return;
  window.cloudRates.onChange(function(remoteRates) {
    localStorage.setItem(RATES_KEY, JSON.stringify(remoteRates));
    applyRatesToInputs(remoteRates);
    renderSummary();
    renderExpenses();
    updateAmountPreview();
  });
}

function initBudgetForm() {
  var catGrid = document.getElementById('catGrid');
  var palette = ['#e8f4f8', '#f0e8f4', '#f8f0e8', '#e8f8f0', '#f4e8f0', '#f0f4e8'];
  catGrid.innerHTML = BUDGET.categories.map(function(cat, index) {
    return '<div class="cat-btn' + (index === 0 ? ' active' : '') + '" data-cat="' + cat.id + '" onclick="selectCat(this)" style="background:' + (cat.color || palette[index % palette.length]) + ';">' +
      '<span class="cat-icon">' + (cat.icon || '📦') + '</span><span class="cat-label">' + (cat.shortName || cat.name) + '</span></div>';
  }).join('');
  document.getElementById('bDate').value = BUDGET.defaultDate || TRIP_DATA.config.dateRange.start;
  document.getElementById('bCurrency').innerHTML = BUDGET.currencies.map(function(cur) {
    return '<option value="' + cur.code + '">' + cur.code + '</option>';
  }).join('');
  var personHtml = function(allActive) {
    return PEOPLE.map(function(person, index) {
      return '<div class="person-simple' + (allActive || index === 0 ? ' active' : '') + '" data-p="' + person + '" style="background:' + palette[index % palette.length] + '">' + person + '</div>';
    }).join('');
  };
  var payerGrid = document.getElementById('payerGrid');
  payerGrid.innerHTML = personHtml(false);
  payerGrid.querySelectorAll('.person-simple').forEach(function(el){ el.onclick = function(){ selectPayer(el); }; });
  var participantGrid = document.getElementById('participantGrid');
  participantGrid.innerHTML = personHtml(true);
  participantGrid.querySelectorAll('.person-simple').forEach(function(el){ el.onclick = function(){ toggleParticipant(el); }; });
  document.querySelectorAll('.base-currency-label').forEach(function(el){ el.textContent = BASE_CURRENCY; });
  document.getElementById('rateRows').innerHTML = BUDGET.currencies.filter(function(cur){ return cur.code !== BASE_CURRENCY; }).map(function(cur) {
    return '<div class="rate-row"><label>' + cur.code + '</label><input type="number" id="r' + cur.code + '" value="' + cur.rate + '" step="' + (cur.step || 0.01) + '" oninput="onRateInput()"></div>';
  }).join('');
  document.getElementById('rateHint').textContent = '* 1 单位外币 = ? ' + BASE_CURRENCY + '（全队共用一组汇率，修改后所有记录一起重算）';
  applyRatesToInputs(loadLocalRates());   // 先用本機存的，之後雲端同步會再覆蓋

  // 日期預設「今天」（僅限旅程期間內），否則沿用設定的起始日
  var dateEl = document.getElementById('bDate');
  var today = new Date();
  var todayStr = today.getFullYear() + '-' +
    String(today.getMonth() + 1).padStart(2, '0') + '-' +
    String(today.getDate()).padStart(2, '0');
  var range = (TRIP_DATA.config && TRIP_DATA.config.dateRange) || {};
  if (range.start && range.end && todayStr >= range.start && todayStr <= range.end) {
    dateEl.value = todayStr;
  }

  // 套用上次記住的付款人與幣別
  var prefs = loadPrefs();
  if (prefs) {
    if (prefs.currency && BUDGET.currencies.some(function(c){ return c.code === prefs.currency; })) {
      document.getElementById('bCurrency').value = prefs.currency;
    }
    if (prefs.payer && PEOPLE.indexOf(prefs.payer) !== -1) {
      selPayer = prefs.payer;
      payerGrid.querySelectorAll('.person-simple').forEach(function(c){
        c.classList.toggle('active', c.dataset.p === prefs.payer);
      });
    }
  }

  document.getElementById('bCurrency').addEventListener('change', updateAmountPreview);
  updateAmountPreview();
}

function selectCat(el) {
  document.querySelectorAll('.cat-btn').forEach(function(b){ b.classList.remove('active'); });
  el.classList.add('active');
  selCat = el.dataset.cat;
}
function selectPayer(el) {
  document.querySelectorAll('#payerGrid .person-simple').forEach(function(c){ c.classList.remove('active'); });
  el.classList.add('active');
  selPayer = el.dataset.p;
  rememberPrefs();
}
function toggleParticipant(el) {
  var p = el.dataset.p;
  if (el.classList.contains('active')) {
    if (selParticipants.length <= 1) { showToast('至少选择 1 位'); return; }
    el.classList.remove('active');
    selParticipants = selParticipants.filter(function(x){ return x !== p; });
  } else {
    el.classList.add('active');
    selParticipants.push(p);
  }
  updateAmountPreview();
}

// 金額欄位下方的即時換算：一邊打字就顯示等值基準幣與每人分帳金額，
// 不必等儲存後才知道。幣別、參與者人數變動時也會一起更新。
function updateAmountPreview() {
  var el = document.getElementById('amountPreview');
  if (!el) return;
  var amount = parseAmount(document.getElementById('bAmount').value);
  var cur = document.getElementById('bCurrency').value;
  if (!amount || amount <= 0) { el.textContent = ''; el.classList.remove('show'); return; }
  var n = selParticipants.length || 1;
  var base = toBaseCurrency(amount, cur);
  var txt = (cur === BASE_CURRENCY ? '' : '≈ ' + BASE_SYMBOL + fmtNum(base) + '　');
  txt += '每人 ' + BASE_SYMBOL + fmtNum(base / n) + '（' + n + ' 人均分）';
  el.textContent = txt;
  el.classList.add('show');
}

// 記住上次用的付款人與幣別：實際付錢的通常固定 1～2 人，
// 到了芬蘭之後幣別也會一直是 EUR，每次都要重選很浪費時間。
function rememberPrefs() {
  try {
    localStorage.setItem(PREFS_KEY, JSON.stringify({
      payer: selPayer,
      currency: document.getElementById('bCurrency').value
    }));
  } catch (e) {}
}
function loadPrefs() {
  try { return JSON.parse(localStorage.getItem(PREFS_KEY) || 'null'); } catch (e) { return null; }
}

// 每日花費表原本只有在展開摺疊區的當下才重畫，
// 若它本來就是展開狀態，新增消費後數字會停在舊值。
function refreshDailyIfOpen() {
  var body = document.getElementById('dailyBody');
  if (body && body.classList.contains('open')) renderDailySummary();
}

function getRate(cur) {
  if (cur === BASE_CURRENCY) return 1;
  var el = document.getElementById('r' + cur);
  return el ? (parseFloat(el.value) || 1) : 1;
}
function toBaseCurrency(amount, cur) { return amount * getRate(cur); }
function formatAmount(el, blur) {
  var val = el.value.replace(/,/g,'').replace(/[^0-9.]/g,'');
  if (blur && val) { var n = parseFloat(val); if (!isNaN(n)) el.value = n.toLocaleString('en-US'); }
}
function parseAmount(str) { return parseFloat((str||'').replace(/,/g,'')) || 0; }
function fmtNum(n) { return Math.round(n).toLocaleString('en-US'); }

function saveExpense() {
  // 先讓輸入框失焦，手機鍵盤才會收起 —— 否則畫面底部的 toast 會被鍵盤蓋住，
  // 使用者看不到任何回饋，以為沒存成功。
  if (document.activeElement && document.activeElement.blur) document.activeElement.blur();

  var amount = parseAmount(document.getElementById('bAmount').value);
  if (!amount || amount <= 0) { showToast('请输入金额'); return; }
  if (selParticipants.length === 0) { showToast('请选择参与者'); return; }
  var currency = document.getElementById('bCurrency').value;
  var desc = document.getElementById('bDesc').value.trim() || CAT_NAME[selCat];
  var date = document.getElementById('bDate').value;
  var cloudOn = !!(window.cloudExpenses && window.cloudExpenses.available);

  if (editingId) {
    // ---- 編輯既有記錄 ----
    var target = expenses.find(function(e){ return e.id === editingId; });
    if (!target) { showToast('找不到这笔记录'); cancelEdit(); return; }
    target.cat = selCat; target.date = date; target.amount = amount;
    target.currency = currency; target.desc = desc; target.payer = selPayer;
    target.participants = selParticipants.slice();
    persistExpenses();
    if (cloudOn && target._cloudId) {
      window.cloudExpenses.update(target._cloudId, target);
      showToast('✅ 已更新并同步给旅伴');
      flashSaved('✅ 已更新并同步');
    } else {
      showToast('✅ 已更新（目前只存在本机）');
      flashSaved('✅ 已更新');
    }
    cancelEdit();
    renderExpenses(); renderSummary(); refreshDailyIfOpen();
    return;
  }

  // ---- 新增 ----
  // 防連按：完全相同的一筆在 10 秒內重複送出，先問過再存。
  // 手機上鍵盤會蓋住畫面底部的 toast，使用者常以為沒反應而連按好幾下，
  // 結果一次存進四五筆一樣的記錄，分類彙總就變成好幾倍金額。
  var now = Date.now();
  var dup = expenses.filter(function(e) {
    return e.cat === selCat && e.date === date && e.amount === amount &&
           e.currency === currency && e.desc === desc && e.payer === selPayer &&
           (now - parseInt(String(e.id).split('-')[0], 10)) < 10000;
  });
  if (dup.length) {
    if (!confirm('刚刚已经存过一笔一模一样的记录：\n\n' + desc + '　' +
                 amount.toLocaleString('en-US') + ' ' + currency +
                 '\n\n确定要再存一笔吗？')) { flashSaved('已取消'); return; }
  }

  var expense = { id:newExpenseId(), cat:selCat, date:date, amount:amount, currency:currency, desc:desc, payer:selPayer, participants:selParticipants.slice() };

  // 先存本机，确保没网路也能立即看到、立即可用
  expenses.push(expense);
  persistExpenses();
  document.getElementById('bAmount').value = '';
  document.getElementById('bDesc').value = '';
  rememberPrefs();
  updateAmountPreview();
  renderExpenses(); renderSummary(); refreshDailyIfOpen();

  // 同步到云端（如果 Firebase 有连上），旅伴的手机会即时收到这笔记录
  if (cloudOn) {
    // ⚠️ 只有在雲端真的寫入成功之後才記下 _cloudId。
    // 失敗的話這筆維持「沒有 _cloudId」＝待上傳，由 initCloudExpensesSync 的合併邏輯補傳。
    window.cloudExpenses.push(expense, function(cloudId) {
      if (cloudId) { expense._cloudId = cloudId; persistExpenses(); }
    });
    showToast('✅ 已储存并同步给旅伴');
    flashSaved('✅ 已储存并同步');
  } else {
    showToast('✅ 已储存在本机（目前未连上云端同步）');
    flashSaved('✅ 已储存在本机');
  }
}

// 在儲存鍵本身給回饋：手機上鍵盤可能蓋住底部 toast，
// 按鈕就在拇指下方，這裡的變化一定看得到。
function flashSaved(msg) {
  var btn = document.getElementById('saveBtn');
  if (!btn) return;
  var original = editingId ? '✏️ 更新记录' : '💾 储存记录';
  btn.textContent = msg;
  btn.classList.add('saved');
  btn.disabled = true;
  clearTimeout(window.__saveFlash);
  window.__saveFlash = setTimeout(function() {
    btn.textContent = original;
    btn.classList.remove('saved');
    btn.disabled = false;
  }, 1400);
}

function startEdit(id) {
  var e = expenses.find(function(x){ return String(x.id) === String(id); });
  if (!e) return;
  editingId = e.id;
  selCat = e.cat;
  document.querySelectorAll('.cat-btn').forEach(function(b){ b.classList.toggle('active', b.dataset.cat === e.cat); });
  document.getElementById('bDate').value = e.date;
  document.getElementById('bCurrency').value = e.currency;
  document.getElementById('bAmount').value = e.amount.toLocaleString('en-US');
  document.getElementById('bDesc').value = e.desc;
  selPayer = e.payer;
  document.querySelectorAll('#payerGrid .person-simple').forEach(function(c){ c.classList.toggle('active', c.dataset.p === e.payer); });
  selParticipants = e.participants.slice();
  document.querySelectorAll('#participantGrid .person-simple').forEach(function(c){ c.classList.toggle('active', e.participants.indexOf(c.dataset.p) !== -1); });
  setEditMode(true);
  updateAmountPreview();
  document.getElementById('page-budget').scrollIntoView({ behavior:'smooth', block:'start' });
  showToast('编辑中，修改后按「更新记录」');
}

function cancelEdit() {
  editingId = null;
  setEditMode(false);
  document.getElementById('bAmount').value = '';
  document.getElementById('bDesc').value = '';
  updateAmountPreview();
  renderExpenses();
}

function setEditMode(on) {
  var btn = document.getElementById('saveBtn');
  var bar = document.getElementById('editBar');
  if (btn) btn.textContent = on ? '✏️ 更新记录' : '💾 储存记录';
  if (bar) bar.style.display = on ? 'flex' : 'none';
  var card = document.getElementById('budgetFormCard');
  if (card) card.classList.toggle('editing', !!on);
}

function deleteExpense(id) {
  var target = expenses.find(function(e){ return String(e.id) === String(id); });
  if (!target) return;
  // 刪除會同步刪掉所有旅伴手上的那筆，且無法復原，因此一定要二次確認。
  var label = target.desc + '（' + target.amount.toLocaleString('en-US') + ' ' + target.currency + '）';
  if (!confirm('确定删除这笔消费？\n\n' + label + '\n\n删除后所有旅伴的记录也会一起移除，且无法复原。')) return;
  if (String(editingId) === String(id)) cancelEdit();
  expenses = expenses.filter(function(e){ return String(e.id) !== String(id); });
  persistExpenses();
  renderExpenses(); renderSummary(); refreshDailyIfOpen();
  if (target._cloudId && window.cloudExpenses && window.cloudExpenses.available) {
    window.cloudExpenses.remove(target._cloudId);
  }
  showToast('已删除');
}

// 訂閱雲端即時更新：只要旅伴（或自己）新增/刪除了任何一筆消費，
// 這裡就會收到最新的完整清單。
//
// ⚠️ 這裡必須是「合併」不是「取代」。
// 早期版本直接 expenses = remoteList，結果在山區沒訊號時記的帳，
// 一旦連上線收到雲端清單就會連同 localStorage 一起被蓋掉，資料無聲消失。
// 現在的規則：
//   - 有 _cloudId 的以雲端為準（不在雲端清單裡＝別人刪掉了，跟著移除）
//   - 沒有 _cloudId 的是「還沒成功上傳」，保留下來並重新嘗試上傳
function initCloudExpensesSync() {
  if (!(window.cloudExpenses && window.cloudExpenses.available)) return;
  window.cloudExpenses.onChange(function(remoteList) {
    var pending = expenses.filter(function(e){ return !e._cloudId; });
    expenses = remoteList.concat(pending);
    persistExpenses();

    // 補傳離線期間累積的記錄
    pending.forEach(function(e) {
      window.cloudExpenses.push(e, function(cloudId) {
        if (cloudId) { e._cloudId = cloudId; persistExpenses(); }
      });
    });
    if (pending.length) showToast('已补传 ' + pending.length + ' 笔离线记录');

    renderExpenses();
    renderSummary();
    refreshDailyIfOpen();
  });
}

function renderExpenses() {
  var el = document.getElementById('expenseList');
  if (!expenses.length) { el.innerHTML = '<div class="expense-empty">尚无消费记录</div>'; return; }
  el.innerHTML = expenses.slice().reverse().map(buildExpenseItemHtml).join('');
}

function buildExpenseItemHtml(e) {
  var baseAmount = toBaseCurrency(e.amount, e.currency);
  var idAttr = escapeHtml(String(e.id));
  var pending = e._cloudId ? '' : '<span class="ei-pending" title="尚未同步到云端">⏳</span>';
  return '<div class="expense-item' + (String(editingId) === String(e.id) ? ' editing' : '') + '">' +
    '<div class="ei-cat">' + (CAT_ICON[e.cat] || '📦') + '</div>' +
    '<div class="ei-info"><div class="ei-desc">' + escapeHtml(e.desc) + pending + '</div>' +
    '<div class="ei-meta">' + escapeHtml(e.date) + ' · ' + escapeHtml(e.payer) + ' · ' + escapeHtml(e.participants.join('、')) + '</div></div>' +
    '<div class="ei-right">' +
      '<div class="ei-amount">' + e.amount.toLocaleString('en-US') + ' ' + escapeHtml(e.currency) + '</div>' +
      '<div class="ei-cny">≈ ' + BASE_SYMBOL + fmtNum(baseAmount) + '</div>' +
      '<div class="ei-actions">' +
        '<button class="ei-edit" onclick="startEdit(\'' + idAttr + '\')">编辑</button>' +
        '<button class="ei-del" onclick="deleteExpense(\'' + idAttr + '\')">删除</button>' +
      '</div>' +
    '</div></div>';
}

function renderSummary() {
  var catTotals={}, personPaid={}, personOwed={}, grandTotal=0;
  PEOPLE.forEach(function(p){ personPaid[p]=0; personOwed[p]=0; });
  expenses.forEach(function(e) {
    var baseAmount = toBaseCurrency(e.amount, e.currency);
    catTotals[e.cat] = (catTotals[e.cat]||0) + baseAmount;
    personPaid[e.payer] = (personPaid[e.payer] || 0) + baseAmount;
    var share = baseAmount / e.participants.length;
    e.participants.forEach(function(p){ personOwed[p] = (personOwed[p] || 0) + share; });
    grandTotal += baseAmount;
  });
  var catBody = document.getElementById('catSummary');
  if (!grandTotal) {
    catBody.innerHTML = '<tr><td colspan="3" style="text-align:center;color:var(--sub);padding:16px;">尚无资料</td></tr>';
  } else {
    // 依設定檔的分類順序輸出，不要用 Object.keys 的插入順序 ——
    // 否則每新增一個沒出現過的分類，整張表的排序就會洗牌一次，看起來像出錯。
    catBody.innerHTML = BUDGET.categories.filter(function(c){ return catTotals[c.id]; })
      .map(function(c) {
        var amt = catTotals[c.id];
        return '<tr><td>' + c.icon + ' ' + c.name + '</td><td>' + BASE_SYMBOL + fmtNum(amt) + '</td><td>' + (amt/grandTotal*100).toFixed(1) + '%</td></tr>';
      }).join('') +
      '<tr class="summary-total"><td>合计（' + expenses.length + ' 笔）</td><td>' + BASE_SYMBOL + fmtNum(grandTotal) + '</td><td>100%</td></tr>';
  }
  var netBody = document.getElementById('netSummary');
  if (!grandTotal) {
    netBody.innerHTML = '<tr><td colspan="4" style="text-align:center;color:var(--sub);padding:16px;">尚无资料</td></tr>';
  } else {
    netBody.innerHTML = PEOPLE.map(function(p) {
      var net = personPaid[p] - personOwed[p];
      var cls = net >= 0 ? 'net-pos' : 'net-neg';
      var sign = net > 0 ? '+' : '';
      return '<tr><td>' + p + '</td><td>' + BASE_SYMBOL + fmtNum(personPaid[p]) + '</td><td>' + BASE_SYMBOL + fmtNum(personOwed[p]) + '</td><td class="' + cls + '">' + sign + BASE_SYMBOL + fmtNum(net) + '</td></tr>';
    }).join('');
  }
  renderSettlement(personPaid, personOwed, grandTotal);
  renderRecent();

  window._dailyTotals = {};
  expenses.forEach(function(e) {
    var baseAmount = toBaseCurrency(e.amount, e.currency);
    window._dailyTotals[e.date] = (window._dailyTotals[e.date]||0) + baseAmount;
  });
}

// 結算建議：把每個人的淨額配對成「誰付給誰多少」，用貪心法求較少的轉帳筆數。
// 只顯示結果，不改動任何資料。
function renderSettlement(personPaid, personOwed, grandTotal) {
  var el = document.getElementById('settleList');
  if (!el) return;
  if (!grandTotal) { el.innerHTML = '<div class="settle-empty">尚无资料</div>'; return; }

  var debtors = [], creditors = [];
  PEOPLE.forEach(function(p) {
    var net = Math.round(personPaid[p] - personOwed[p]);
    if (net < -0.5) debtors.push({ name:p, amt:-net });
    else if (net > 0.5) creditors.push({ name:p, amt:net });
  });
  debtors.sort(function(a,b){ return b.amt - a.amt; });
  creditors.sort(function(a,b){ return b.amt - a.amt; });

  var lines = [], i = 0, j = 0;
  while (i < debtors.length && j < creditors.length) {
    var pay = Math.min(debtors[i].amt, creditors[j].amt);
    if (pay >= 1) {
      lines.push('<div class="settle-row"><span class="settle-from">' + escapeHtml(debtors[i].name) + '</span>' +
        '<span class="settle-arrow">→</span>' +
        '<span class="settle-to">' + escapeHtml(creditors[j].name) + '</span>' +
        '<span class="settle-amt">' + BASE_SYMBOL + fmtNum(pay) + '</span></div>');
    }
    debtors[i].amt -= pay; creditors[j].amt -= pay;
    if (debtors[i].amt < 1) i++;
    if (creditors[j].amt < 1) j++;
  }
  el.innerHTML = lines.length ? lines.join('') : '<div class="settle-empty">已经结清，不用互相转帐 🎉</div>';
}

// 儲存鍵下方的「最近 3 筆」：存完立刻能確認記對了，不用展開消費記錄。
function renderRecent() {
  var el = document.getElementById('recentList');
  if (!el) return;
  if (!expenses.length) { el.innerHTML = ''; return; }
  el.innerHTML = '<div class="recent-title">最近 3 笔</div>' +
    expenses.slice(-3).reverse().map(buildExpenseItemHtml).join('');
}

function renderDailySummary() {
  var dailyTotals = window._dailyTotals || {};
  var dailyBody = document.getElementById('dailySummary');
  var dates = Object.keys(dailyTotals).sort();
  if (!dates.length) { dailyBody.innerHTML = '<tr><td colspan="2" style="text-align:center;color:var(--sub);padding:16px;">尚无资料</td></tr>'; return; }
  var total = 0;
  var html = dates.map(function(d){ total += dailyTotals[d]; return '<tr><td>' + d + '</td><td>' + BASE_SYMBOL + fmtNum(dailyTotals[d]) + '</td></tr>'; }).join('');
  html += '<tr class="summary-total"><td>合计</td><td>' + BASE_SYMBOL + fmtNum(total) + '</td></tr>';
  dailyBody.innerHTML = html;
}

// 匯出 CSV：旅程結束後對帳用。加 BOM 讓 Excel 正確辨識 UTF-8 中文。
function exportExpensesCsv() {
  if (!expenses.length) { showToast('尚无消费记录'); return; }
  var head = ['日期','分类','说明','金额','币别','等值' + BASE_CURRENCY,'付款人','参与者'];
  var rows = expenses.slice().sort(function(a,b){ return a.date < b.date ? -1 : a.date > b.date ? 1 : 0; })
    .map(function(e) {
      return [e.date, CAT_NAME[e.cat] || e.cat, e.desc, e.amount, e.currency,
              Math.round(toBaseCurrency(e.amount, e.currency)), e.payer, e.participants.join(' ')];
    });
  var csv = [head].concat(rows).map(function(r) {
    return r.map(function(c){ return '"' + String(c).replace(/"/g, '""') + '"'; }).join(',');
  }).join('\r\n');
  var blob = new Blob(['\ufeff' + csv], { type:'text/csv;charset=utf-8;' });
  var a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'expenses-' + new Date().toISOString().slice(0,10) + '.csv';
  document.body.appendChild(a); a.click();
  document.body.removeChild(a); URL.revokeObjectURL(a.href);
  showToast('已导出 ' + expenses.length + ' 笔记录');
}

// 手機鍵盤彈出時，position:fixed 仍以版面視窗為準，畫面底部的 toast 會被鍵盤蓋住。
// 用 visualViewport 算出被遮住的高度，把 toast 往上頂。
(function () {
  var vv = window.visualViewport;
  if (!vv) return;
  function sync() {
    var hidden = Math.max(0, window.innerHeight - vv.height - vv.offsetTop);
    document.documentElement.style.setProperty('--kb-offset', hidden + 'px');
  }
  vv.addEventListener('resize', sync);
  vv.addEventListener('scroll', sync);
  sync();
})();

function showToast(msg) {
  var t = document.getElementById('toast');
  t.textContent = msg; t.classList.add('show');
  setTimeout(function(){ t.classList.remove('show'); }, 2200);
}
