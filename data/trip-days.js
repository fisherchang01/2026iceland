// 總覽頁「橫幅」與「每日卡片列表」資料
// 修改行程天數、標題、日期徽章，或新增/刪除某一天的卡片，都只需要編輯這個檔案。
// 每張卡片的詳細內容（景點、飯店等）在 trip-details.js 裡用相同的 id 對應。

// 相容舊版欄位；旅程層級設定統一在 trip-config.js 維護。
const TRIP_META = TRIP_CONFIG;

const TRIP_DAYS = [
  { id:'day0', color:'c0', month:'OCT', date:'3', isoDate:'2026-10-03', bannerImage:'images/banners/day0-card.jpg', title:'飞越北境·初抵冰岛', summary:'共三段航班，下午从香港出发，经新加坡、赫尔辛基转机，于10/4清晨抵达冰岛雷克雅未克，机上过夜。', sectionLabel:null },

  { id:'day1', color:'c1', month:'OCT', date:'4', isoDate:'2026-10-04', bannerImage:'images/banners/day1-card.jpg', title:'雷市初见·地热启程', summary:'抵达冰岛后先逛雷克雅未克市区地标教堂、彩虹街与哈帕音乐厅，再驱车前往辛格维利尔国家公园与火山口湖，晚上入住乡间民宿。', sectionLabel:'🇮🇸 冰岛' },
  { id:'day2', color:'c2', month:'OCT', date:'5', isoDate:'2026-10-05', bannerImage:'images/banners/day2-card.jpg', title:'追泉逐瀑·黄金圈巡礼', summary:'畅游世界闻名的黄金圈，近距离看蓝钻石瀑布、喷泉喷发、彩虹瀑布，最后到冰岛马场跟温驯的国宝马互动。', sectionLabel:null },
  { id:'day3', color:'c3', month:'OCT', date:'6', isoDate:'2026-10-06', bannerImage:'images/banners/day3-card.jpg', title:'瀑布之路·南岸奇境', summary:'沿着一号公路驶向冰岛南岸，走进瀑布水幕、站上黑沙滩与岬角，感受北大西洋的狂野与壮丽。', sectionLabel:null },
  { id:'day4', color:'c4', month:'OCT', date:'7', isoDate:'2026-10-07', bannerImage:'images/banners/day4-card.jpg', title:'走进蓝冰·闪耀钻石海岸', summary:'深入瓦特纳冰川，探访梦幻蓝冰洞、漂浮冰河湖的巨型浮冰，以及沙滩上的闪耀钻石冰。', sectionLabel:null },
  { id:'day5', color:'c5', month:'OCT', date:'8', isoDate:'2026-10-08', bannerImage:'images/banners/day5-card.jpg', title:'公路慢行·蓝湖疗愈', summary:'早上探访羽毛峡谷，感受南岸最后一段风景，接着长途转场至西南角，傍晚在梦幻蓝湖温泉中卸下一身疲惫。', sectionLabel:null },

  { id:'day6', color:'c6', month:'OCT', date:'9', isoDate:'2026-10-09', bannerImage:'images/banners/day6-card.jpg', title:'告别冰岛·飞向芬兰', summary:'搭乘芬兰航空班机告别冰岛，飞往设计之都赫尔辛基，入住机场酒店，为明天的城市漫游养精蓄锐。', sectionLabel:'🇫🇮 芬兰' },
  { id:'day7', color:'c7', month:'OCT', date:'10', isoDate:'2026-10-10', bannerImage:'images/banners/day7-card.jpg', title:'赫尔辛基·北欧漫游日', summary:'赫尔辛基市区景点串连：白教堂、红教堂、市集广场、岩石教堂，搭船探访世界遗产芬兰堡，最后体验海滨芬兰浴，节奏悠闲的城市日。', sectionLabel:null },
  { id:'day8', color:'c8', month:'OCT', date:'11', isoDate:'2026-10-11', bannerImage:'images/banners/day8-card.jpg', title:'满载回忆·返回香港', summary:'凌晨从赫尔辛基机场起飞，直飞香港，傍晚抵达，结束冰岛之旅。', sectionLabel:null }
];
