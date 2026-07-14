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
    primary: '#2c5f6e',
    accent: '#4a8fa3',
    background: '#f5f5f0',
    header: '#faf3ea'
  },
  coverImage: 'images/banners/day0-card.jpg',
  bannerTitleHtml: '🧊 冰与火的国度（冰岛 + 芬兰）',
  badges: ['🇮🇸 冰岛 5天', '🇫🇮 芬兰 2天', '✈️ 含5航班']
};
