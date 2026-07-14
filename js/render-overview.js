// 這個檔案是「總覽頁與其他頁籤內容的掛載邏輯」，一般調整行程/景點內容不需要改這裡，改 data/ 資料夾裡的檔案即可。

// ===== 由資料檔案渲染畫面（總覽卡片 / 其他頁籤內容）=====
function renderOverview() {
  var html = '';

  TRIP_DATA.days.forEach(function(d, index){
    if (d.sectionLabel) {
      html += '<div class="day-section-label">' + d.sectionLabel + '</div>';
    }
    var bannerHtml = d.bannerImage ? '<img src="' + d.bannerImage + '" alt="" width="640" height="166" ' + (index === 0 ? 'fetchpriority="high"' : 'loading="lazy"') + ' decoding="async" onerror="this.style.display=\'none\'" />' : '';
    html += '<div class="day-card ' + (d.color || '') + '" onclick="showDay(\'' + d.id + '\')">' +
              '<div class="day-card-bg">' + bannerHtml + '</div>' +
              '<div class="day-card-scrim"></div>' +
              '<div class="day-card-content">' +
                '<div class="day-badge"><div class="month">' + d.month + '</div><div class="date">' + d.dayOfMonth + '</div></div>' +
                '<div class="day-card-info"><h3>' + d.title + '</h3>' + (d.summary ? '<p>' + d.summary + '</p>' : '') + '</div>' +
              '</div>' +
            '</div>';
  });

  document.getElementById('overviewContent').innerHTML = html;
}

function mountTabContent() {
  document.getElementById('mount-travel').outerHTML = TRAVEL_HTML;
  document.getElementById('mount-budget').outerHTML = BUDGET_HTML;
  document.getElementById('mount-other').outerHTML = OTHER_HTML;
}
