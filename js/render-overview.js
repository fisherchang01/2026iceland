// 這個檔案是「總覽頁與其他頁籤內容的掛載邏輯」，一般調整行程/景點內容不需要改這裡，改 data/ 資料夾裡的檔案即可。

// ===== 由資料檔案渲染畫面（總覽卡片 / 其他頁籤內容）=====
function renderOverview() {
  var html = '';
  html += '<div class="trip-banner">' +
            '<div class="trip-banner-left">' +
              '<h1>' + TRIP_META.bannerTitleHtml + '</h1>' +
              '<p>' + TRIP_META.bannerDateLine + '</p>' +
            '</div>' +
            '<div class="trip-banner-right">' +
              TRIP_META.badges.map(function(b){ return '<div class="banner-badge">' + b + '</div>'; }).join('') +
            '</div>' +
          '</div>';

  TRIP_DAYS.forEach(function(d){
    if (d.sectionLabel) {
      html += '<div class="day-section-label">' + d.sectionLabel + '</div>';
    }
    html += '<div class="day-card ' + d.color + '" onclick="showDay(\'' + d.id + '\')">' +
              '<div class="day-card-bg"><img src="images/banners/' + d.id + '-card.jpg" alt="" loading="lazy" onerror="this.style.display=\'none\'" /></div>' +
              '<div class="day-card-scrim"></div>' +
              '<div class="day-card-content">' +
                '<div class="day-badge"><div class="month">' + d.month + '</div><div class="date">' + d.date + '</div></div>' +
                '<div class="day-card-info"><h3>' + d.title + '</h3><p>' + d.summary + '</p></div>' +
                '<div class="day-card-arrow"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg></div>' +
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
