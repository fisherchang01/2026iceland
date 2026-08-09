// 旅程層級設定。建立新旅程時先修改此檔，不需要改動 js/ 核心程式。
const TRIP_CONFIG = window.TRIP_CONFIG = {
  tripName: '冰岛 + 芬兰 慢活之旅',
  siteTitle: '冰岛 + 芬兰 慢活之旅 2026',
  countries: ['冰岛', '芬兰'],
  dateRange: {
    start: '2026-10-03',
    end: '2026-10-11',
    display: 'October 3 – 11, 2026'
  },
  timezone: 'Atlantic/Reykjavik',
  primaryCurrency: 'ISK',
  currencies: ['ISK', 'EUR', 'HKD', 'CNY', 'USD', 'TWD'],
  theme: {
    primary: '#3f6e7a',
    accent: '#4a8fa3',
    background: '#f2ede4',
    header: '#faf3ea'
  },
  coverImage: 'images/banners/cover-hero.webp',
  bannerTitleHtml: '<span class="hero-title-main">🧊 冰与火的国度</span><span class="hero-title-sub"><span class="hero-sub-tag">冰岛 + 芬兰</span></span>',
  badges: ['🇮🇸 冰岛 5天', '🇫🇮 芬兰 2天', '✈️ 含5航班']
};
