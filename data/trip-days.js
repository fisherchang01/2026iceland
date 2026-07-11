// 總覽頁「橫幅」與「每日卡片列表」資料
// 修改行程天數、標題、日期徽章，或新增/刪除某一天的卡片，都只需要編輯這個檔案。
// 每張卡片的詳細內容（景點、飯店等）在 trip-details.js 裡用相同的 id 對應。

const TRIP_META = {
  // 頂端標題列（v6.1 起全站固定顯示，不再依頁籤/日期切換內容）
  bannerTitleHtml: '🧊 冰与火的国度（冰岛 + 芬兰）',
  // 以下欄位目前沒有被任何畫面使用，保留只是紀錄行程基本資訊，供之後需要時參考
  headerTitle: '🧊 冰岛 + 芬兰 慢活之旅',
  headerSub:   'October 3 – 11, 2026',
  bannerDateLine:  'Oct 3 – 11，9天',
  badges: ['🇮🇸 冰岛 5天', '🇫🇮 芬兰 2天', '✈️ 含5航班']
};

const TRIP_DAYS = [
  { id:'day0', color:'c0', month:'OCT', date:'3',  title:'去程',              summary:'共三段航班，下午从香港出发，经新加坡、赫尔辛基转机，于10/4清晨抵达冰岛雷克雅未克，机上过夜。', sectionLabel:null },

  { id:'day1', color:'c1', month:'OCT', date:'4',  title:'初探冰岛',          summary:'抵达冰岛后直奔经典前哨，探访国家公园、秘境蓝瀑布与地裂奇景，晚上入住乡间民宿。', sectionLabel:'🇮🇸 冰岛' },
  { id:'day2', color:'c2', month:'OCT', date:'5',  title:'深入黄金圈',        summary:'畅游世界闻名的黄金圈，近距离看喷泉喷发、彩虹瀑布、火山口湖，还有疗愈马场与温室西红柿餐。', sectionLabel:null },
  { id:'day3', color:'c3', month:'OCT', date:'6',  title:'南岸经典',          summary:'沿着一号公路驶向冰岛南岸，走进瀑布水幕、站上黑沙滩与岬角，感受北大西洋的狂野与壮丽。', sectionLabel:null },
  { id:'day4', color:'c4', month:'OCT', date:'7',  title:'冰川徒步 + 冰洞钻石', summary:'深入瓦特纳冰川，探访梦幻蓝冰洞、漂浮冰河湖的巨型浮冰，以及沙滩上的闪耀钻石冰。', sectionLabel:null },
  { id:'day5', color:'c5', month:'OCT', date:'8',  title:'雷市漫游 + 蓝湖温泉', summary:'慢游北欧最酷首都，从地标教堂、彩虹街到哈帕音乐厅，傍晚在梦幻蓝湖温泉中卸下一身疲惫。', sectionLabel:null },

  { id:'day6', color:'c6', month:'OCT', date:'9',  title:'前往芬兰',          summary:'走进设计之都赫尔辛基，从白教堂、红教堂到岩石教堂，逛市集、泡海港芬兰浴，体验地道北欧生活。', sectionLabel:'🇫🇮 芬兰' },
  { id:'day7', color:'c7', month:'OCT', date:'10', title:'芬兰人的一天',      summary:'赫尔辛基市区景点串连：白教堂、红教堂、市集广场、老农贸市场、岩石教堂，最后体验海滨芬兰浴，节奏悠闲的城市日。', sectionLabel:null },
  { id:'day8', color:'c8', month:'OCT', date:'11', title:'回程',              summary:'凌晨从赫尔辛基机场起飞，直飞香港，傍晚抵达，结束冰岛之旅。', sectionLabel:null }
];
