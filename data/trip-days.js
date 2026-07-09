// 總覽頁「橫幅」與「每日卡片列表」資料
// 修改行程天數、標題、日期徽章，或新增/刪除某一天的卡片，都只需要編輯這個檔案。
// 每張卡片的詳細內容（景點、飯店等）在 trip-details.js 裡用相同的 id 對應。

const TRIP_META = {
  headerTitle: '🧊 冰岛 + 芬兰 慢活之旅',
  headerSub:   'October 3 – 11, 2026',
  bannerTitleHtml: '冰与火的国度<br>（冰岛 + 芬兰）',
  bannerDateLine:  'Oct 3 – 11，9天',
  badges: ['🇮🇸 冰岛 5天', '🇫🇮 芬兰 2天', '✈️ 含5航班']
};

const TRIP_DAYS = [
  { id:'day0', color:'c0', month:'OCT', date:'3',  title:'去程',            summary:'HKG → SIN → HEL → KEF · 转机2次',                              sectionLabel:null },

  { id:'day1', color:'c1', month:'OCT', date:'4',  title:'初探冰岛',        summary:'Þórufoss · Þingvellir · Brúarfoss',                             sectionLabel:'🇮🇸 冰岛' },
  { id:'day2', color:'c2', month:'OCT', date:'5',  title:'深入黄金圈',      summary:'马场 · Geysir · Gullfoss · Faxi · Friðheimar · Kerið',          sectionLabel:null },
  { id:'day3', color:'c3', month:'OCT', date:'6',  title:'南岸经典',        summary:'Seljalandsfoss · Skógafoss · Dyrhólaey · Reynisfjara',          sectionLabel:null },
  { id:'day4', color:'c4', month:'OCT', date:'7',  title:'冰川徒步',        summary:'Blue Ice Cave · Jökulsárlón · Diamond Beach',                   sectionLabel:null },
  { id:'day5', color:'c5', month:'OCT', date:'8',  title:'雷克雅未克 + 蓝湖', summary:'Hallgrímskirkja · 路线A/B City Walk · Harpa · Blue Lagoon',   sectionLabel:null },

  { id:'day6', color:'c6', month:'OCT', date:'9',  title:'前往芬兰',        summary:'KEF → HEL · 移动日',                                            sectionLabel:'🇫🇮 芬兰' },
  { id:'day7', color:'c7', month:'OCT', date:'10', title:'芬兰人的一天',    summary:'白教堂 · 市集广场 · 红教堂 · 岩石教堂 · Allas Sea Pool',        sectionLabel:null },
  { id:'day8', color:'c8', month:'OCT', date:'11', title:'返程',            summary:'HEL → HKG · 深夜航班',                                          sectionLabel:null }
];
