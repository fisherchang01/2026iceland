// 這個檔案是「費用記帳頁籤的邏輯」，一般調整行程/景點內容不需要改這裡，改 data/ 資料夾裡的檔案即可。

// ===== BUDGET =====
const CAT_ICON = { food:'🍽️', activity:'🎫', transport:'🚗', stay:'🏨', shopping:'🛍️', other:'📦' };
const CAT_NAME = { food:'餐饮', activity:'景点活动', transport:'交通', stay:'住宿', shopping:'购物', other:'其他' };
const PEOPLE   = ['小良','老板','小翼','秋燕'];

let selCat          = 'food';
let selPayer        = '小良';
let selParticipants = ['小良','老板','小翼','秋燕'];
let expenses        = JSON.parse(localStorage.getItem('trip_expenses') || '[]');

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
  var map = { ISK:'rISK', EUR:'rEUR', USD:'rUSD', TWD:'rTWD', HKD:'rHKD', CNY:null };
  if (cur === 'CNY') return 1;
  var el = document.getElementById(map[cur]);
  return el ? (parseFloat(el.value) || 1) : 1;
}
function toCNY(amount, cur) { return amount * getRate(cur); }
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
  expenses.push({ id:Date.now(), cat:selCat, date:date, amount:amount, currency:currency, desc:desc, payer:selPayer, participants:selParticipants.slice() });
  localStorage.setItem('trip_expenses', JSON.stringify(expenses));
  document.getElementById('bAmount').value = '';
  document.getElementById('bDesc').value = '';
  renderExpenses(); renderSummary();
  showToast('✅ 已储存');
}

function deleteExpense(id) {
  expenses = expenses.filter(function(e){ return e.id !== id; });
  localStorage.setItem('trip_expenses', JSON.stringify(expenses));
  renderExpenses(); renderSummary();
  showToast('已删除');
}

function renderExpenses() {
  var el = document.getElementById('expenseList');
  if (!expenses.length) { el.innerHTML = '<div class="expense-empty">尚无消费记录</div>'; return; }
  el.innerHTML = expenses.slice().reverse().map(function(e) {
    var cny = toCNY(e.amount, e.currency);
    return '<div class="expense-item">' +
      '<div class="ei-cat">' + CAT_ICON[e.cat] + '</div>' +
      '<div class="ei-info"><div class="ei-desc">' + e.desc + '</div>' +
      '<div class="ei-meta">' + e.date + ' · ' + e.payer + ' · ' + e.participants.join('、') + '</div></div>' +
      '<div class="ei-right">' +
        '<div class="ei-amount">' + e.amount.toLocaleString('en-US') + ' ' + e.currency + '</div>' +
        '<div class="ei-cny">≈ ¥' + fmtNum(cny) + '</div>' +
        '<button class="ei-del" onclick="deleteExpense(' + e.id + ')">删除</button>' +
      '</div></div>';
  }).join('');
}

function renderSummary() {
  var catTotals={}, personPaid={}, personOwed={}, grandTotal=0;
  PEOPLE.forEach(function(p){ personPaid[p]=0; personOwed[p]=0; });
  expenses.forEach(function(e) {
    var cny = toCNY(e.amount, e.currency);
    catTotals[e.cat] = (catTotals[e.cat]||0) + cny;
    personPaid[e.payer] += cny;
    var share = cny / e.participants.length;
    e.participants.forEach(function(p){ personOwed[p] += share; });
    grandTotal += cny;
  });
  var catBody = document.getElementById('catSummary');
  if (!grandTotal) {
    catBody.innerHTML = '<tr><td colspan="3" style="text-align:center;color:var(--sub);padding:16px;">尚无资料</td></tr>';
  } else {
    catBody.innerHTML = Object.keys(catTotals).map(function(cat) {
      var amt = catTotals[cat];
      return '<tr><td>' + CAT_ICON[cat] + ' ' + CAT_NAME[cat] + '</td><td>¥' + fmtNum(amt) + '</td><td>' + (amt/grandTotal*100).toFixed(1) + '%</td></tr>';
    }).join('') + '<tr class="summary-total"><td>合计</td><td>¥' + fmtNum(grandTotal) + '</td><td>100%</td></tr>';
  }
  var netBody = document.getElementById('netSummary');
  if (!grandTotal) {
    netBody.innerHTML = '<tr><td colspan="4" style="text-align:center;color:var(--sub);padding:16px;">尚无资料</td></tr>';
  } else {
    netBody.innerHTML = PEOPLE.map(function(p) {
      var net = personPaid[p] - personOwed[p];
      var cls = net >= 0 ? 'net-pos' : 'net-neg';
      var sign = net > 0 ? '+' : '';
      return '<tr><td>' + p + '</td><td>¥' + fmtNum(personPaid[p]) + '</td><td>¥' + fmtNum(personOwed[p]) + '</td><td class="' + cls + '">' + sign + '¥' + fmtNum(net) + '</td></tr>';
    }).join('');
  }
  window._dailyTotals = {};
  expenses.forEach(function(e) {
    var cny = toCNY(e.amount, e.currency);
    window._dailyTotals[e.date] = (window._dailyTotals[e.date]||0) + cny;
  });
}

function renderDailySummary() {
  var dailyTotals = window._dailyTotals || {};
  var dailyBody = document.getElementById('dailySummary');
  var dates = Object.keys(dailyTotals).sort();
  if (!dates.length) { dailyBody.innerHTML = '<tr><td colspan="2" style="text-align:center;color:var(--sub);padding:16px;">尚无资料</td></tr>'; return; }
  var total = 0;
  var html = dates.map(function(d){ total += dailyTotals[d]; return '<tr><td>' + d + '</td><td>¥' + fmtNum(dailyTotals[d]) + '</td></tr>'; }).join('');
  html += '<tr class="summary-total"><td>合计</td><td>¥' + fmtNum(total) + '</td></tr>';
  dailyBody.innerHTML = html;
}

function showToast(msg) {
  var t = document.getElementById('toast');
  t.textContent = msg; t.classList.add('show');
  setTimeout(function(){ t.classList.remove('show'); }, 2200);
}
