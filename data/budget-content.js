// 「費用」頁籤的完整 HTML 內容，可直接編輯下方 HTML 標籤來調整文字、新增或刪除項目
const BUDGET_HTML = `
<div class="page" id="page-budget">
  <div class="page-inner">
    <div class="budget-section-header">📝 记录消费</div>
    <div class="budget-card">
      <div class="form-label" style="margin-bottom:8px;">消费类别</div>
      <div class="cat-grid" id="catGrid">
      </div>
      <div class="date-currency-row">
        <div class="date-wrap">
          <label class="form-label">日期</label>
          <input type="date" class="form-input" id="bDate">
        </div>
        <div class="cur-wrap">
          <label class="form-label">币别</label>
          <select class="currency-select" id="bCurrency">
          </select>
        </div>
      </div>
      <div class="form-group">
        <label class="form-label">金额</label>
        <input type="text" class="form-input amount-input" id="bAmount" placeholder="0" inputmode="decimal" oninput="formatAmount(this)" onblur="formatAmount(this, true)">
      </div>
      <div class="form-group">
        <label class="form-label">说明（选填）</label>
        <input type="text" class="form-input" id="bDesc" placeholder="例：超市采购、蓝湖门票">
      </div>
      <div class="people-section">
        <div class="people-title">付款人（选 1 人）</div>
        <div class="people-grid-simple" id="payerGrid">
        </div>
      </div>
      <div class="people-section">
        <div class="people-title">参与者（可多选）</div>
        <div class="people-grid-simple" id="participantGrid">
        </div>
      </div>
      <button class="save-btn" onclick="saveExpense()">💾 储存记录</button>
    </div>

    <div class="budget-section-header">📊 分类汇总（<span class="base-currency-label"></span>）</div>
    <div class="budget-card">
      <table class="summary-table">
        <thead><tr><th>分类</th><th>金额</th><th>占比</th></tr></thead>
        <tbody id="catSummary"></tbody>
      </table>
    </div>

    <div class="budget-section-header">👥 人均结算（<span class="base-currency-label"></span>）</div>
    <div class="budget-card">
      <table class="summary-table">
        <thead><tr><th>姓名</th><th>已付</th><th>应付</th><th>净额</th></tr></thead>
        <tbody id="netSummary"></tbody>
      </table>
    </div>

    <div class="collapse-header" onclick="toggleCollapse('dailyBody', this)">
      <span class="ch-title">📅 每日花费（CNY）</span>
      <span class="ch-arrow">▼</span>
    </div>
    <div class="collapse-body" id="dailyBody">
      <div class="budget-card">
        <table class="summary-table">
          <thead><tr><th>日期</th><th>金额</th></tr></thead>
          <tbody id="dailySummary"></tbody>
        </table>
      </div>
    </div>

    <div class="collapse-header" onclick="toggleCollapse('recordBody', this)">
      <span class="ch-title">📋 消费记录</span>
      <span class="ch-arrow">▼</span>
    </div>
    <div class="collapse-body" id="recordBody">
      <div class="budget-card">
        <div id="expenseList"><div class="expense-empty">尚无消费记录</div></div>
      </div>
    </div>

    <div class="collapse-header" onclick="toggleCollapse('rateBody', this)">
      <span class="ch-title">💱 汇率设定</span>
      <span class="ch-arrow">▼</span>
    </div>
    <div class="collapse-body" id="rateBody">
      <div class="budget-card">
        <div id="rateRows"></div>
        <div id="rateHint" style="font-size:0.7rem;color:var(--sub);margin-top:8px;"></div>
      </div>
    </div>
  </div>
</div>
`;
