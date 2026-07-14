// 這個檔案是「費用記帳頁籤的邏輯」，一般調整行程/景點內容不需要改這裡，改 data/ 資料夾裡的檔案即可。

// ===== BUDGET =====
const BUDGET = TRIP_DATA.budget;
const CAT_ICON = BUDGET.categories.reduce(function(map, item){ map[item.id] = item.icon; return map; }, {});
const CAT_NAME = BUDGET.categories.reduce(function(map, item){ map[item.id] = item.name; return map; }, {});
const PEOPLE = BUDGET.people.slice();
const BASE_CURRENCY = BUDGET.baseCurrency;
const BASE_SYMBOL = BUDGET.baseCurrencySymbol || (BASE_CURRENCY + ' ');

let selCat          = BUDGET.categories[0].id;
let selPayer        = PEOPLE[0];
let selParticipants = PEOPLE.slice();
let expenses        = JSON.parse(localStorage.getItem(BUDGET.storageKey || 'trip_expenses') || '[]');

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
    return '<div class="rate-row"><label>' + cur.code + '</label><input type="number" id="r' + cur.code + '" value="' + cur.rate + '" step="' + (cur.step || 0.01) + '" oninput="renderSummary()"></div>';
  }).join('');
  document.getElementById('rateHint').textContent = '* 1 单位外币 = ? ' + BASE_CURRENCY;
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
  var amount = parseAmount(document.getElementById('bAmount').value);
  if (!amount || amount <= 0) { showToast('请输入金额'); return; }
  if (selParticipants.length === 0) { showToast('请选择参与者'); return; }
  var currency = document.getElementById('bCurrency').value;
  var desc = document.getElementById('bDesc').value.trim() || CAT_NAME[selCat];
  var date = document.getElementById('bDate').value;
  var expense = { id:Date.now(), cat:selCat, date:date, amount:amount, currency:currency, desc:desc, payer:selPayer, participants:selParticipants.slice() };

  // 先存本机，确保没网路也能立即看到、立即可用
  expenses.push(expense);
  localStorage.setItem(BUDGET.storageKey || 'trip_expenses', JSON.stringify(expenses));
  document.getElementById('bAmount').value = '';
  document.getElementById('bDesc').value = '';
  renderExpenses(); renderSummary();

  // 同步到云端（如果 Firebase 有连上），旅伴的手机会即时收到这笔记录
  if (window.cloudExpenses && window.cloudExpenses.available) {
    window.cloudExpenses.push(expense);
    showToast('✅ 已储存并同步给旅伴');
  } else {
    showToast('✅ 已储存在本机（目前未连上云端同步）');
  }
}

function deleteExpense(id) {
  var target = expenses.find(function(e){ return e.id === id; });
  expenses = expenses.filter(function(e){ return e.id !== id; });
  localStorage.setItem(BUDGET.storageKey || 'trip_expenses', JSON.stringify(expenses));
  renderExpenses(); renderSummary();
  if (target && target._cloudId && window.cloudExpenses && window.cloudExpenses.available) {
    window.cloudExpenses.remove(target._cloudId);
  }
  showToast('已删除');
}

// 訂閱雲端即時更新：只要旅伴（或自己）新增/刪除了任何一筆消費，
// 這裡就會收到最新的完整清單，取代本機資料並重新整理畫面。
function initCloudExpensesSync() {
  if (!(window.cloudExpenses && window.cloudExpenses.available)) return;
  window.cloudExpenses.onChange(function(remoteList) {
    expenses = remoteList;
    localStorage.setItem(BUDGET.storageKey || 'trip_expenses', JSON.stringify(expenses));
    renderExpenses();
    renderSummary();
  });
}

function renderExpenses() {
  var el = document.getElementById('expenseList');
  if (!expenses.length) { el.innerHTML = '<div class="expense-empty">尚无消费记录</div>'; return; }
  el.innerHTML = expenses.slice().reverse().map(function(e) {
    var baseAmount = toBaseCurrency(e.amount, e.currency);
    return '<div class="expense-item">' +
      '<div class="ei-cat">' + CAT_ICON[e.cat] + '</div>' +
      '<div class="ei-info"><div class="ei-desc">' + e.desc + '</div>' +
      '<div class="ei-meta">' + e.date + ' · ' + e.payer + ' · ' + e.participants.join('、') + '</div></div>' +
      '<div class="ei-right">' +
        '<div class="ei-amount">' + e.amount.toLocaleString('en-US') + ' ' + e.currency + '</div>' +
        '<div class="ei-cny">≈ ' + BASE_SYMBOL + fmtNum(baseAmount) + '</div>' +
        '<button class="ei-del" onclick="deleteExpense(' + e.id + ')">删除</button>' +
      '</div></div>';
  }).join('');
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
    catBody.innerHTML = Object.keys(catTotals).map(function(cat) {
      var amt = catTotals[cat];
      return '<tr><td>' + CAT_ICON[cat] + ' ' + CAT_NAME[cat] + '</td><td>' + BASE_SYMBOL + fmtNum(amt) + '</td><td>' + (amt/grandTotal*100).toFixed(1) + '%</td></tr>';
    }).join('') + '<tr class="summary-total"><td>合计</td><td>' + BASE_SYMBOL + fmtNum(grandTotal) + '</td><td>100%</td></tr>';
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
  window._dailyTotals = {};
  expenses.forEach(function(e) {
    var baseAmount = toBaseCurrency(e.amount, e.currency);
    window._dailyTotals[e.date] = (window._dailyTotals[e.date]||0) + baseAmount;
  });
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

function showToast(msg) {
  var t = document.getElementById('toast');
  t.textContent = msg; t.classList.add('show');
  setTimeout(function(){ t.classList.remove('show'); }, 2200);
}
