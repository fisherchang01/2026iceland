// 每日詳細行程資料（景點、飯店、航班等）。此為主要維護檔案：
// 新增/修改/刪除景點或某一天的細節，只需編輯這裡的 TRIP 物件，不必動 index.html 或其他檔案。
//
// ★ 景點照片：
// 一張照片：img: 'thingvellir.webp'（舊版寫法，繼續有效，不用改）
// 多張照片：images: ['thingvellir.webp', 'thingvellir-alt-1.webp']
//   → 兩張以上會自動排成固定雙欄網格，直式與橫式照片會依方向使用一致比例，
//     點擊任一張都能放大檢視完整照片，多張時可左右切換。
//   同一個景點如果兩個欄位都寫，images 優先、img 會被忽略。
// 圖片檔案都要放在 images/spots/ 這個資料夾裡，檔名要跟欄位寫的完全一樣（含副檔名）。
// 沒有寫任何照片欄位、或圖片檔案不存在，網站都會自動顯示插畫代替，不會出現「圖片壞掉」的畫面，
// 所以可以之後有照片再慢慢補上，不會影響現在的顯示。
// 縮圖會使用固定比例裁切以維持整齊；燈箱會完整顯示照片，直式橫式照片都適用。
// ===== TRIP DATA =====
const TRIP = {
  day0: {
    num:'0', dateLabel:'10月3日（周六）→ 10月4日（周日）', title:'飞越北境·初抵冰岛', transit:true,
    flights:[
      { airline:'国泰航空', flightNo:'CX635', from:'香港 HKG T1', to:'新加坡樟宜 SIN T4', dep:'15:05', arr:'19:05', duration:'约4小时', date:'10月3日', layoverAfter:'约 2 小时 30 分钟' },
      { airline:'芬兰航空', flightNo:'AY132', from:'新加坡樟宜 SIN T1', to:'赫尔辛基万塔 HEL', dep:'21:35', arr:'06:00+1', duration:'约12小时25分', date:'10月3日→10月4日', note:'当地10月4日抵达', layoverAfter:'约 1 小时 10 分钟（转机时间较紧凑）' },
      { airline:'芬兰航空', flightNo:'AY991', from:'赫尔辛基万塔 HEL', to:'凯夫拉维克 KEF', dep:'07:10', arr:'07:50', duration:'约3小时40分', date:'10月4日' }
    ],
    note:'一、香港机场贵宾室：65号玉衡堂（优先）、33号逸连堂、1号寰宇堂。\n二、新加坡机场：Qantas或英国航空贵宾室，T1航厦D5登机口。\n三、赫尔辛基机场：芬兰航空申根区3楼22号登机口；回程为非申根区52号登机口。'
  },
  day1: {
    num:'1', dateLabel:'10月4日（周日）', title:'雷市初见·地热启程',
    routeMapImg:'route-day1.webp',
    driveSummary: { total:'约 165 km', time:'约 2小时45分钟（不含景点停留，市区路段为步行）' },
    hotel:{ name:'South Central Country Apartment 民宿', note:'黄金圈地区，舒适乡村民宿环境', map:'South Central Country Apartment Iceland' },
    aurora:{ location:{ name:'南部民宿（Selfoss 一带）', lat:63.93, lon:-20.85 },
      sunrise:'07:57', sunset:'18:52', kpIndex:3, cloudCover:30, probability:'medium',
      summary:'云量偏低、KP指数中等，示例情境下观测机会中等', updatedAt:'示例数值，出发前请再核实预报' },
    spots: [
      { icon:'🛬', name:'冰岛机场 KEF Airport', tags:['机场'],
        desc:'欢迎来到冰岛！抵达机场后可先在入境免税店采买酒类，出境后搭接驳车前往 MyCar 办理租车手续，正式展开冰岛自驾之旅。',
        deepDesc:'一、机场位置：凯夫拉维克国际机场（KEF）是游客入境冰岛的第一站，位于冰岛西南部雷克雅内斯半岛，距离蓝湖温泉约20公里，距离首都雷克雅未克约50公里。\n二、入境系统：欧盟的入出境系统（EES）是申根国通用的数位化边境管理系统，已正式启用，全面取代过去人工护照盖章，会自动记录非申根国籍旅客进出申根区的时间地点，并计算剩余合法停留天数。\n三、免税店购物：入境大厅行李提取处旁设有一间大型免税店，出关前务必在此买齐酒类，价格比市区划算不少。\n四、ATM取钱：下飞机等行李的输送带附近就有ATM柜员机，是下飞机后最快能到的一台；如果人多，出了海关关口后的换钱柜台也有ATM可用。\n五、租车：领完行李、走出入境大厅后，寻找写着 "National, Enterprise, Alamo" 的告示牌，工作人员会引导前往 MyCar 站点搭接驳车，每10–15分钟一班。\n六、道路税：金额6,950 ISK，取车时缴纳；保险为Zero Excess（自负额0），已涵盖碰撞、挡风玻璃裂痕、强风吹门受损、风砂损伤、碎石损伤、刮伤/凹痕、轮胎保护等，但不包含底盘损伤及轮圈。',
        toilet:'机场内免费',
        map:'Keflavik International Airport',
        nextStop:{ type:'drive', text:'🚗 前往雷克雅未克市区', detail:'约 50 km · 约 45 分钟' } },
      { icon:'⛪', name:'哈尔格林姆教堂 Hallgrímskirkja', label:'A', tags:['花儿与少年'],
        desc:'冰岛首都雷克雅未克的著名地标，外观以火山爆发所呈现的玄武岩熔岩流为主要意象，前卫设计让人很难与传统欧洲教堂联想在一起。',
        deepDesc:'一、教堂高达73公尺，是冰岛最大的教堂，也是全国第六高建筑。外观以玄武岩熔岩流为意象，有人说很像NASA太空梭，是100%观光客都会造访的打卡景点。\n二、教堂前的广场立着一尊青铜雕像，是1930年美国为庆祝冰岛建国千年所赠，雕的是冰岛独立运动之父雷弗尔·西格松。\n三、走进教堂内部，不像欧洲传统教堂迎面而来大大的十字架与花窗玻璃，反而是明亮极简的味道，符合北欧风设计。巨大的管风琴不时传来沉稳悠扬的琴声，吸引游客忍不住坐下来聆听。\n四、教堂入口旁有个小小的贩售区，卖冰岛风景明信片和纪念品；购票（成人1400 ISK，可刷卡）就能搭电梯登顶，欣赏雷克雅未克市容，全程没有人收票或管制。',
        tips:'教堂周边原先有一些免费停车场，若找不到，亦有许多收费停车场。\n厕所：教堂内免费。',
        map:'Hallgrimskirkja Reykjavik',
        nextStop:{ type:'walk', text:'🚶 沿彩虹步道步行前往彩虹街', detail:'约 5 分钟步行' } },
      { icon:'🌈', name:'彩虹街与购物主街 Laugavegur', label:'B', tags:['花儿与少年'],
        desc:'从大教堂正门沿彩虹步道缓坡下行，直接汇入热闹购物主街，一路逛至旧港边的哈帕音乐厅。',
        deepDesc:'一、彩虹街位在雷克雅未克中心地段，是冰岛精华中的精华——想吃冰岛美食、买伴手礼，甚至想找间酒吧、餐酒馆坐下来，通通都在这里解决，不只好拍还很好玩。\n二、劳德威格尔购物街（Laugavegur）是冰岛最古老、也最热闹繁华的一条街，纪念品种类比沿途各景点附设商店齐全得多：蓝湖温泉保养品、各种羊毛制品、帕芬鸟造型娃娃、冰箱贴、明信片、巧克力应有尽有，只是价格不算便宜。\n三、冰岛不像欧洲其他国家可以买精品（LV、香奈儿并不适合来这里找），这里主要是 Geysir、Icewear、Lopapeysa、66°North 这类本土保暖品牌。\n四、花儿与少年同款店：MJÚK 帽子店（各种彩色羊毛帽子围巾）、Icewear 分店（冰岛常见连锁户外品牌）、Valdís 冰淇淋店、Icelandic Street Food（羊肉汤跟海鲜汤面包碗）。',
        map:'Laugavegur Reykjavik',
        nextStop:{ type:'walk', text:'🚶 步行前往哈帕音乐厅', detail:'约 10–15 分钟步行' } },
      { icon:'🎼', name:'哈帕音乐厅 Harpa', label:'C', tags:['花儿与少年'],
        desc:'冰岛最重要的艺术场地，外观使用不规则玻璃片，灵感同样来自冰岛的六边形玄武岩地质。',
        deepDesc:'一、哈帕音乐厅外观使用不规则玻璃片作为主要材料，灵感来源是冰岛的六边形玄武岩。不同材质、不同颜色的玻璃片在阳光洒下时非常独特，随光线和天气变化都会有所不同，内部阳光折射进来的光影也很美。晚上还会亮起LED灯，幸运的话可以同时看到音乐厅跟极光，是白天晚上来都美的建筑。\n二、太阳航海者：雷克雅未克海岸线上的一座雕塑，又称维京船骨架，象征探索和冒险精神，也是冰岛航海历史的象征，距离哈帕音乐厅很近，散步就能到。冰岛历史和维京人密不可分——公元9世纪维京人首次抵达冰岛，是这片土地的第一批定居者。也有人说太阳航海者是一艘梦想之船，象征光明与希望。',
        map:'Harpa Reykjavik',
        nextStop:{ type:'drive', text:'🚗 前往辛格维利尔国家公园', detail:'约 50 km · 约 50 分钟' } },
      { icon:'🚶', name:'回程路线：海港与托宁湖', tags:[], isOptional:true,
        desc:'离开哈帕音乐厅后，不走回头路，改沿旧港区海滨及托宁湖，徒步感受不同路径返回大教堂。',
        deepDesc:'一、托宁湖是雷克雅未克市内最大的湖泊，沿湖畔走一圈，好多天鹅、海鸥、野鸭漫游其中，有些游客还会带饲料或面包来场喂食秀，景色相当美。\n二、托宁湖算是比较小众的冰岛秘境，不是每个到雷克雅未克的人都会去。湖里有超多天鹅、鸭子，很多人会直接带饲料或面包来喂食，所以被当地人称为「世界最大面包汤」。' },
      { icon:'🏞️', name:'辛格维利尔国家公园 Þingvellir', label:'D', images:['thingvellir.webp','thingvellir-alt-1.webp','thingvellir-alt-2.webp','thingvellir-alt-3.webp','thingvellir-alt-4.webp','thingvellir-alt-5.webp','pingvellir-1.webp','pingvellir-2.webp','pingvellir-3.webp','pingvellir-4.webp','pingvellir-5.webp','oxararfoss-1.webp'], tags:['花儿与少年','世界遗产','火山','喷泉'],
        desc:'游客可在北美板块与欧亚板块之间行走，这里也是冰岛国会的诞生地，历史可追溯至西元930年。',
        deepDesc:'一、建议路线：车停P1停车场，以游客中心为起点，步行经过欧美板块交界、全世界最早的议会遗址、法律石 Lögberg、辛格瓦拉教堂、冰岛总理夏季官邸等景点。\n二、欧美板块交界：这里是欧亚板块与北美板块海平面上唯一的交会处——一边是美洲、另一边是欧洲，两大板块每年以约2.5公分的速度撕裂，形成壮观的大裂谷地貌，经过一亿多年才出现现在的大西洋。地壳长期拉张，形成一条条向外打开的裂谷，能看到明显的岩壁、高低落差和狭长谷地。阿尔曼纳峡谷（Almannagjá）从游客中心出发，沿步道下行进入这座壮观的断层峡谷，两旁高耸的岩壁即为板块交界处。\n三、议会遗址：最早的议会地点就在名为 Lögberg（法律石）的巨石周围，也就是插着冰岛国旗的那块巨石区域。公元930年维京人在此建立世界最早的议会之一，园区被联合国教科文组织列为世界文化遗产——这里岩壁天然形成的回音效果，让所有人都能听清演讲者的声音。法律石是法官、议员与群众「集会宣法」的讲坛，「站上这里说出的话，全冰岛人都听得到。」\n四、Hakið观景台：可以俯瞰整个辛格维利尔，除了远眺一望无际的山脉湖泊，还能看到建于1859年的辛格维利尔教堂，旁边的农舍则是冰岛总理夏季官邸。\n五、黄金大裂缝 Silfra：阿尔曼纳陡崖高30米，Silfra裂缝能见度达100米，议会湖存有全球唯一的天然鳟鱼种群。Silfra是被冰川融水经过地下熔岩过滤30~100年后所填满的大裂缝，是世界上唯一可以在两个板块（欧亚板块和北美板块）间潜水或浮潜的位置，因此许多人会参加「Silfra裂缝潜水」行程，由专业导游带领探索。\n六、延伸景点──奥克萨瀑布（Öxarárfoss）：沿步道往北，或开车到P2停车场，可到达隐藏在裂缝峡谷间、落差约13米的小巧瀑布，虽不算最厉害，但小而美、乾净清澈，值得顺路拍照。',
        tips:'共有五个收费停车场（P1、P2、P3、P4、P5），ISK 1000/天。\n推荐将车停在P1（游客中心）或P5（近潜水集合点）或P2（Öxarárfoss瀑布）。',
        toilet:'游客中心 200 ISK。',
        map:'Thingvellir National Park Iceland',
        nextStop:{ type:'drive', text:'🚗 前往 Kerið 火山口湖', detail:'约 30 km · 约 30 分钟' } },
      { icon:'🌀', name:'火山口湖 Kerið', label:'E', images:['kerid.webp','kerid-alt-1.webp','kerid-alt-2.webp','kerid-alt-3.webp','kerid-alt-4.webp','kerid-alt-5.webp','Kerio-1.webp','Kerio-2.webp'], tags:['火山'],
        desc:'这座漂亮的火口湖形成于6500年前的火山爆发，深度达50公尺，从山顶看相当壮观，沿着步道可以绕火山口一整圈。',
        deepDesc:'一、Kerið 火山口湖位于35号公路旁，是黄金圈路线上很容易顺路造访的景点，特色是椭圆形火山口与碧绿色湖水，加上周围红褐色岩壁，颜色对比强烈，阳光充足时拍照相当抢眼。火山口周围坡度相对平缓，可以沿边缘走一圈，也可以沿步道走到湖边，对脚力普通的旅人来说不算吃力。\n二、收费亭后方的步道就是环绕火山口步道的起点，环绕一圈大概30分钟；再沿楼梯往下走到火山口湖旁（湖口55公尺深），下楼梯的入口和环绕步道起点一样都在售票亭旁边，看到「down to the lake」的指标就是了。\n三、Kerið 本来是一个锥形火山，经官方证实并非火山喷发造成，而是火山喷发熔岩后椎体塌落形成的巨型凹洞。火山口底部的水跟地下水处于同一水平面，含大量矿物质，在不同阳光照射下颜色略有不同，有时深蓝、有时翡翠绿；这座火山湖是冰岛最年轻的火山之一，所以岩壁仍是鲜明的红色火山岩。',
        tips:'少数需要收门票的自然景点，门票每人ISK 600。\n无停车费用，没有提供厕所。',
        map:'Kerid Crater Iceland',
        // 两段式导航链：先到超市补给，再到民宿（10/4、10/5 两晚都住这间）
        nextStops:[
          { name:'超市', address:'Bónus Selfoss Iceland', distanceKm:15, etaMin:15 },
          { name:'民宿', address:'South Central Country Apartment Iceland', distanceKm:20, etaMin:25 }
        ] }
    ]
  },
  day2: {
    num:'2', dateLabel:'10月5日（周一）', title:'追泉逐瀑·黄金圈巡礼',
    routeMapImg:'route-day2.webp',
    driveSummary: { total:'约 102 km', time:'约 1小时45分钟（不含景点停留，不含备选景点绕行）' },
    hotel:{ name:'South Central Country Apartment 民宿', note:'连住，黄金圈地区', map:'South Central Country Apartment Iceland' },
    aurora:{ location:{ name:'南部民宿（Selfoss 一带）', lat:63.93, lon:-20.85 },
      sunrise:'08:00', sunset:'18:49', kpIndex:2, cloudCover:55, probability:'low',
      summary:'云量偏高，示例情境下观测机会偏低', updatedAt:'示例数值，出发前请再核实预报' },
    spots: [
      { icon:'💎', name:'蓝色秘境瀑布 Brúarfoss', label:'A', images:['bruarfoss.webp','bruarfoss-alt-2.webp','bruarfoss-alt-3.webp','bruarfoss-alt-4.webp','bruarfoss-alt-5.webp','Bruarfoss-1.webp','Bruarfoss-2.webp','Bruarfoss-3.webp','Bruarfoss-4.webp','Bruarfoss-5.webp'], tags:['瀑布'],
        desc:'这是冰岛最美的瀑布之一，河水因玄武岩地质呈现黄金圈隐藏版的蒂芙尼蓝绿色。',
        deepDesc:'一、foss就是冰岛话「瀑布」的意思，冰岛可以说是世界上瀑布最多的地方，因为这里断崖很多，非常容易形成瀑布，与一些更著名的瀑布相比，这里更加宁静祥和。\n二、蒂芙尼蓝瀑布之所以得名，是因为瀑布所呈现的颜色接近蒂芙尼蓝——瀑布高度不高，水量集中在一个水道，水道深度也不深，刚好反射阳光后呈现出这种颜色。\n三、旧停车场「Brúará Trail」可以走三小时的荒野健行。虽然大家都叫它秘境，但说实话，现在有了新停车场之后，这里已经不算秘境了。正对着 Brúarfoss 的最佳拍摄点就是那座木桥，桥面空间略小，遇到旅行团放人的时候，要在桥上卡到位子拍空景需要一点耐心跟运气。',
        tips:'Brúarfoss Parking 为私人经营，开车从37号公路转进来后有3公里的碎石路，停车费750 ISK。\n没有厕所，旁边有禁止大便的告示牌。',
        parking:'750 ISK（私人停车场，Parka app）',
        toilet:'无。',
        map:'Bruarfoss Iceland',
        nextStop:{ type:'drive', text:'🚗 前往 Geysir', detail:'约 35 km · 约 35 分钟' } },
      { icon:'💦', name:'盖锡尔地热区 Geysir', label:'B', images:['geysir.webp','geysir-alt-1.webp','geysir-alt-2.webp','geysir-alt-3.webp','geysir-alt-4.webp','geysir-alt-5.webp'], tags:['花儿与少年','火山'],
        desc:'Strokkur 间歇泉大约每5–10分钟就会把热水柱直冲天空几十公尺，不应该错过的「现场Live表演」。',
        deepDesc:'一、盖锡尔大喷泉（Geysir）又称冰岛大喷泉，是冰岛喷得最高也最大的间歇泉，每次喷发高度约70-80公尺，比出名的黄石公园老忠实间歇泉还多出25~50公尺。不过现在处于休眠期——它曾在20世纪中停止喷发，2000年冰岛南部地震后重新活动，但已不像早年那样规律壮观，目前多数游客很少有机会亲眼看到它完整喷发。\n二、第二大喷泉斯特罗库间歇泉（Strokkur）目前还处于活跃期，每5~10分钟就会喷发一次，高度大约25~35公尺。Strokkur 这个名字在冰岛语中有「搅拌」的意思，位于 Haukadalur 谷地，是 Geysir 地区最活跃的一个间歇泉，也是抵达现场后会看到最多游客围着拍照的那一个。\n三、Geysir间歇泉的游客中心里有餐厅、逛街区、博物馆等。餐厅采开放式自由入席，有轻食料理、面包、汤品等，采光很不错；里面还有冰岛自有品牌66° North的服饰店，连冰岛的新鲜罐装空气也有卖。',
        tips:'游客中心有免费的厕所。\n停车费1000 ISK。',
        parking:'1000 ISK',
        toilet:'游客中心内免费，环境不错。',
        map:'Geysir Iceland',
        nextStop:{ type:'drive', text:'🚗 前往 Gullfoss', detail:'约 10 km · 约 10 分钟' } },
      { icon:'🌊', name:'黄金瀑布 Gullfoss', label:'C', images:['gullfoss.webp','gullfoss-alt-1.webp','gullfoss-alt-2.webp','gullfoss-alt-3.webp','gullfoss-alt-4.webp','gullfoss-alt-5.webp','Gullfoss-1.webp','Gullfoss-2.webp','Gullfoss-3.webp','Gullfoss-4.webp','Gullfoss-5.webp','Gullfoss-6.webp','Gullfoss-7.webp','Gullfoss-8.webp'], tags:['花儿与少年','瀑布'],
        desc:'黄金瀑布是冰岛第二大瀑布，晴天很容易拍到「黄金瀑布＋彩虹」的经典画面，是整个黄金圈里最具震撼力的一站。',
        deepDesc:'一、黄金瀑布（Gullfoss）身处的峡谷宽约2500米、瀑布高度约70米，是冰岛最大的断层瀑布。Gullfoss 的冰岛语翻译直接就是「黄金=Gull；瀑布=Foss」。Hvítá 河水沿着阶梯状岩壁分两层坠入狭窄峡谷，水雾在阳光下常折射出彩虹，因此晴天很容易拍到「黄金瀑布＋彩虹」的经典画面。\n二、大瀑布分上、下两部分，高度分别为11公尺和21公尺，最后流入70公尺深的河谷，最大水量可达每秒2000立方公尺，加上水量庞大、峡谷狭窄，现场感受会比照片中壮观得多。上、下两个观景区以步道相连：上方平台接近游客中心，视野较广、步道铺设完善；下方贴近河道与瀑布，水雾较重、临场感更强。秋冬水雾在低温下容易在步道结成厚冰，当地管理单位每年都会在路面过于湿滑时暂时封闭部分下方步道。\n三、Gullfoss 也承载了一段环境保育的冰岛故事：20世纪初曾有计画将 Gullfoss 和附近河流开发成水力发电厂，甚至一度签署了相关租约。相传当时农场主人的女儿 Sigríður Tómasdóttir 为了守护瀑布，不断往返雷克雅未克与律师协商，甚至扬言如果瀑布被强行开发就要跳进瀑布抗议，这段故事后来成为冰岛早期环境保护运动的象征，Sigríður 也常被称为「守护黄金瀑布的女孩」。\n四、游客中心：上方靠近游客中心的停车场有洗手间、咖啡馆、餐厅和纪念品店，适合中途休息用餐，直接跟店员点 Lamb Soup 羊肉汤就能听懂，一碗 ISK 2490，凭发票还可以免费续一次汤。停车场旁边就是一家很大的商店，东西不比首都市中心来得少。',
        tips:'上、下两个主要停车场均可免费停车。\n上方靠近游客中心，下方停车场则更接近部分步道入口，空间相对朴素，但走到瀑布会更快。',
        parking:'免费（上、下两个停车场）',
        toilet:'游客中心内。',
        map:'Gullfoss Iceland',
        nextStop:{ type:'drive', text:'🚗 前往 Faxi 瀑布（备选）', detail:'约 24 km · 约 20 分钟' } },
      { icon:'💧', name:'黄金圈隐藏版瀑布 Faxi', label:'D', images:['Faxi-1.webp','Faxi-2.webp'], tags:['瀑布'], isOptional:true,
        desc:'Faxi 意为马鬃，生动地形容了瀑布鬃毛般的绵密水势，有点像缩小版的「迷你黄金瀑布」。',
        deepDesc:'一、Faxi（又写作 Faxafoss）是位于黄金圈一带的一条矮瀑布，瀑宽大、水流量足，看起来有点像缩小版、平和许多的「迷你黄金瀑布」，但少了峡谷的戏剧性，取而代之的是比较宁静、开阔的河谷景色。\n二、很多人会把 Faxi 当作「介于大景之间的一个 bonus stop」，适合自驾旅人顺路停15–30分钟拍照、伸展筋骨，不一定需要特地绕一大圈专程造访。Faxi 位于 Tungufljót 河上，介于 Geysir／Gullfoss 一带与南部平原之间，自驾时常见安排是从黄金圈主线略微绕入，短暂停留后再接回主路。\n三、停车费约900至1000冰岛克朗，缴费后会获得一张折扣券，可在现场咖啡厅（如经过营业）折抵部分消费。',
        tips:'停车费900 ISK。走不走这站不影响后续路线。',
        parking:'约 900 ISK（现场缴费）',
        map:'Faxi Waterfall Iceland' },
      { icon:'🍦', name:'家庭农庄 Efstidalur II', label:'E', tags:[], isOptional:true,
        desc:'一家位于黄金圈的家庭式乳品厂，可以尝到农场直供的冰淇淋跟美食。',
        deepDesc:'一、地点就在前往盖锡尔间歇泉、Gullfoss黄金瀑布的必经道路上，几乎很多冰岛当地的旅游行程都会来这里看牛牛、吃冰淇淋，人潮络绎不绝。\n二、这是一间非常有名的在地农场餐厅，自产的冰淇淋超级香浓好吃，一边吃冰还能透过玻璃窗看牛棚里的乳牛，是黄金圈自驾中很棒的休息站。两球是1400 kr，要用饼干装再加50 kr，以冰岛的物价来说算是平价美食，吃起来偏甜却也不至于腻口。\n三、农场周边的草地上，常常能看到悠闲吃草的冰岛马。牠们体型小巧结实，拥有独特的五种步法，自维京时代就被带到冰岛，千年以来未与外来马种混血，是冰岛文化的重要象征。',
        map:'Efstidalur II Iceland' },
      { icon:'🐴', name:'冰岛马场 Bru Horsefarm', label:'F', images:['BruHorsefarm-1.webp','BruHorsefarm-2.webp','BruHorsefarm-3.webp','BruHorsefarm-4.webp'], tags:[],
        desc:'超可爱、一直想靠近人的冰岛马，却也是世界上最孤独的马。',
        deepDesc:'一、来到冰岛，如果没有亲手喂过冰岛马，别说你来过！这里不只有壮阔的冰岛冬色，还有一群非常有「个性」的冰岛马等着大家。\n二、自助式马糖果（Horse Candy）一盒300克朗，五盒只要1000克朗，自己拿、自己投钱。远方山上设有监视器，想吃霸王餐可不容易。当你手上有糖果时，牠们是世界上最温柔的伙伴；盒子空了，转身的速度绝对让你目瞪口呆。喂马小撇步：记得将掌心平放，让马儿轻轻舔走糖果，看着牠们厚实的嘴唇、飘逸的长发，那一瞬间所有的寒冷都被疗愈了。\n三、冰岛马特色：（1）世界唯一步法「tölt」——一般马奔跑时身体会明显上下震动，但tölt几乎不太颠，马蹄以固定节奏轮流落地，整匹马像在滑行，平稳到有点不可思议。（2）千年纯种与防疫孤岛——冰岛马是世界上最纯种的马，西元九世纪由维京人引进后，冰岛极严格禁止任何马匹进口，冰岛马一旦出国就终生不得回国，造就了血统最纯正的马种。（3）耐寒长寿又亲人——身形矮小但肌肉扎实、毛发丰厚，能适应冰岛极地气候，性格极度温驯亲人，不具防御或攻击本能。',
        parking:'农场旁免费停车',
        toilet:'无',
        map:'Bru Horsefarm Iceland',
        // 农场与民宿同一带，距离极近
        nextStop:{ type:'drive', text:'🚗 前往民宿', detail:'约 2 km · 约 5 分钟' } }
    ]
  },
  day3: {
    num:'3', dateLabel:'10月6日（周二）', title:'瀑布之路·南岸奇境',
    routeMapImg:'route-day3.webp',
    driveSummary: { total:'约 158 km', time:'约 2小时25分钟（不含景点停留）' },
    hotel:{ name:'Lakeview Cabin 民宿', note:'南岸地区，湖景小屋，有机会观赏极光', map:'Lakeview Cabin Iceland' },
    aurora:{ location:{ name:'Lakeview Cabin（近 Kirkjubæjarklaustur）', lat:63.79, lon:-18.06 },
      sunrise:'08:03', sunset:'18:45', kpIndex:4, cloudCover:20, probability:'high',
      summary:'云量低、KP指数偏高，示例情境下是这趟旅程观测机会最好的一晚', updatedAt:'示例数值，出发前请再核实预报' },
    spots: [
      { icon:'💧', name:'塞里雅兰瀑布 Seljalandsfoss', label:'A', images:['seljalandsfoss.webp','Seljalandsfoss-1.webp','Seljalandsfoss-2.webp','Seljalandsfoss-3.webp'], tags:['需带雨衣','瀑布'],
        desc:'又称水帘洞瀑布，后方有一条步道可以穿过瀑布，从瀑布里面往外拍照，景色更为优美。',
        deepDesc:'一、塞里雅兰瀑布在冰岛景点中相当有名，虽然不像其他几个大型瀑布那么壮观，但因为可以顺着步道走进瀑布后面，瞬间很像来到孙悟空的花果山水帘洞，所以也被叫做「水帘洞瀑布」，甚至被选为冰岛最美的瀑布之一，是很多人喜欢的冰岛摄影点。地点就在主要环岛公路上，来冰岛租车自驾的话肯定会经过，造就了这里游客如织的高人气。\n二、水帘洞瀑布并不是特别壮观，但可以走到瀑布后方的独特体验却让它成为唯一——只要通过瀑布就一定会湿，差别只在于半身湿或是全身湿而已。如果要走到瀑布后方，非常建议准备「全身的防水装备」，像是附帽子的防水外套、防水裤、防水靴等，千万不要小看这里所溅起的水花，绝对是又大又湿又冷。\n三、延伸版景点──秘密瀑布 Gljúfrabúi：距离水帘洞瀑布大约500公尺，还有一个隐藏在石壁内的秘密瀑布，直接就在密闭洞穴里面，只要走进去就会被满满的大水淋上全身。从岩石缝涉水入内之后，就会看到这座不小的瀑布，被石壁圍繞，和水帘洞瀑布呈现完全不同的感觉，同样非常壮观。要离开的话一样要涉水通过，虽然石壁旁有一些较大的石头可以踩踏，但建议穿防水鞋（最好是靴子），不然踩进水里，湿湿的双脚对后续行程会很不舒服。',
        tips:'门票 700 ISK。\n有厕所（免费）、简单轻食吧、纪念品店。',
        parking:'700 ISK',
        toilet:'有（免费）',
        map:'Seljalandsfoss Iceland',
        nextStop:{ type:'drive', text:'🚗 前往 Skógafoss', detail:'约 30 km · 约 25 分钟' } },
      { icon:'🏔️', name:'史可加瀑布 Skógafoss', label:'B', images:['skogafoss.webp','Skógafoss-1.webp','Skógafoss-2.webp','Skógafoss-3.webp','Skógafoss-4.webp','Skógafoss-5.webp','Skógafoss-6.webp'], tags:['瀑布','花儿与少年'],
        desc:'又称「彩虹瀑布」，因为有阳光的时候，约有九成的机率可以在这里看到彩虹。',
        deepDesc:'一、位于冰岛南部1号环岛公路旁，宽25公尺、高60公尺，是冰岛经典瀑布之一，几乎所有南部行程都会包含在内，电影《白日梦冒险王》曾在此取景而声名大噪。与其说是一个瀑布，倒不如说它是个瀑布群——从接近停车场的彩虹瀑布开始，沿着步道不断往上走，一共会出现大大小小共九个瀑布，很多人认为这条步道是冰岛最让人惊艳的瀑布步道之一，全长大约7公里，能走多远看个人脚程。\n二、九个瀑布中就以停车场前的彩虹瀑布最为知名，瀑布前就能拍下不少照片。步行时间：从停车场到彩虹瀑布大约5分钟；如果要完整收集步道中9个瀑布，来回大约需要2~2.5小时。推荐停留时间：只看彩虹瀑布0.5~1小时，完整收集9个瀑布则需预留半天时间。',
        tips:'停车费 1000 ISK/天。\n有厕所（免费）。',
        parking:'1000 ISK/天',
        toilet:'有（免费）',
        map:'Skogafoss Iceland',
        nextStop:{ type:'drive', text:'🚗 前往 Dyrhólaey', detail:'约 35 km · 约 30 分钟' } },
      { icon:'🐦', name:'岬角 Dyrhólaey', label:'C', images:['Dyrholaey-1.webp','Dyrholaey-2.webp','Dyrholaey-3.webp','Dyrholaey-4.webp'], tags:['花儿与少年','火山'],
        desc:'著名特色是一座横跨在海面上的巨型火成岩拱桥、灯塔、黑沙滩与黑色玄武岩柱，对面就是黑沙滩。',
        deepDesc:'一、冰岛南岸最南端的壮观火山岬角，特色是巨大火山熔岩海蚀拱门 Dyrhólaey Arch 与经典灯塔，登高可俯瞰黑沙滩与海岸线，以及远处的 Arnardrangur（鹰石）。每年夏天（5-8月）是海鹦筑巢繁殖季节的热门赏鸟点，站在悬崖边可眺望辽阔风景。高处与黑沙滩皆适合散步，天气好时气势非凡。\n二、如果从首都出发，会在到达维克之前先到达 Dyrhólaey，从环岛1号公路转218号公路后有两条路可选：其一直走朝平地黑沙滩前进；其二右转往高山里爬坡前行，规定要四驱车才能上山（虽然当天也有看到小车开上去，但建议开四驱车比较保险）。前往的218号公路是一段崎岖难行的碎石路，如果不是开四驱SUV最好不要开上去，路程颠簸坑洞多。\n三、可从高处俯瞰黑沙滩海岸线，和千年遗迹拱门状海岬，一望无际的海岸线黑白分明。山顶上还有一座像「城堡」外形的灯塔，孤傲地坐立在那里，像是这片美景的守护者。',
        map:'Dyrholaey Iceland',
        nextStop:{ type:'drive', text:'🚗 前往 Reynisfjara 黑沙滩', detail:'约 10 km · 约 10 分钟' } },
      { icon:'⚫', name:'黑沙滩 Reynisfjara', label:'D', images:['reynisfjara.webp','Reynisfjara-1.webp','Reynisfjara-2.webp','Reynisfjara-3.webp','Reynisfjara-4.webp','Reynisfjara-5.webp','Reynisfjara-6.webp','Reynisfjara-7.webp','Reynisfjara-8.webp','Reynisfjara-9.webp','Reynisfjara-10.webp'], tags:['花儿与少年','火山'],
        desc:'冰岛很多地方都有黑沙滩，但只有这里的黑沙滩有玄武岩岩石群和人形岩石群可以欣赏。',
        deepDesc:'一、虽然冰岛很多地方都有黑沙滩，但只有 Reynisfjara 这里有玄武岩岩石群和海上 Reynisdrangar 人形岩石群可以欣赏，尤其是玄武岩岩石群形状相当特殊，很值得一看。维克黑沙滩和 Reynisfjara 地理上虽然紧邻，却因一座山隔开，两边景观与体验截然不同，千万别搞混地点。\n二、进入黑沙滩之前，有明显的警告标语需要注意——这里的浪其实相当危险，很多人为了拍照而走入浪花里，下一秒就有可能被卷走。入口处有个警示灯号立牌，红、黄、绿三种颜色分别代表不同的危险等级。\n三、黑沙滩的起源：这片黑沙滩由古老火山爆发后的熔岩冷卻、碎裂，经历数千年冰岛南岸极端天气与大西洋巨浪反复冲刷，才淬炼而成。每一粒细沙本身都是火山岩风化的黑色结晶；岸边壮观的玄武岩石柱群，是岩浆遇冷急速凝固，再被海浪侵蚀雕塑出的天然奇观，代表冰岛「火」与「冰」、「山」与「海」的完美结合。黑色沙子来自邻近卡特拉火山的喷发物，透水性极高，很难预测海浪沖上沙滩的最上缘是何处，这也是危险的地方。\n四、传说如果把黑沙滩的石头带回家就会招来厄运，来这里时请静静欣赏美丽的景色就好，不要将石头捡回家。',
        tips:'停车收费 1000 ISK。',
        parking:'1000 ISK',
        map:'Reynisfjara Black Sand Beach',
        nextStops:[
          { name:'超市', address:'Kronan Vik Iceland', distanceKm:1, etaMin:5 },
          { name:'教堂', address:'Vík í Mýrdal Church', distanceKm:1, etaMin:5 }
        ] },
      { icon:'🏘️', name:'维克镇 Vík', label:'E', tags:['补给'],
        desc:'冰岛本岛最南部的小镇，也是南部海岸线最适合停留加油、住宿、采买食材的地方。',
        deepDesc:'一、超市补给：维克镇是冰岛本岛最南部的小镇，常住人口约几百人，虽然面积不大，却是所有旅行团必经地，也是自驾旅人向东出发南岸的重要补给站。镇上唯一的一间大型超级市场 KRÓNAN，结完帐之后收银台旁边有位置可以在这里用餐休息，这间复合式商场里面也有餐厅可以选择，还有一区是 ICEWEAR 的衣服专卖店，各项登山露营用品一应俱全，羊毛衫、羽绒外套、整块皮毛料都有卖。KRÓNAN 和 ICEWEAR 两间店的中间有连通，可以不用走到冷冷的建筑物外，直接两间一起逛。\n二、维克教堂 Vík í Mýrdal Church：冰岛南岸最具标志性的景点之一，位于小镇山丘上，白墙红顶与黑沙滩、海岸线、火山背景形成鲜明对比，是南岸自驾或跟团必拍的经典地标。教堂小巧朴实，但无论外观或内部皆极具安静美感；教堂入口、教堂外的墓地，以及教堂后方山坡都是拍照取景的极佳位置，能俯瞰维克小镇全景、海岸及 Reynisdrangar 海上巨石，日出日落时分更有戏剧性的光线。沿着教堂后方步道往上走，利用地势的前后景衬托，可以拍出宏伟且带有童话感的教堂全貌。有趣的是，这座教堂常被拿来跟全球视力检查标准图像（红色小屋）的本尊——位于冰岛西部海德利桑德的英格亚尔德斯霍尔教堂相提并论，算是「平替款」。',
        map:'Vík í Mýrdal Church',
        // 民宿与维克镇之间没有实测数据，为估算值
        nextStop:{ type:'drive', text:'🚗 前往民宿', detail:'约 72 km · 约 60 分钟' } }
    ]
  },
  day4: {
    num:'4', dateLabel:'10月7日（周三）', title:'走进蓝冰·闪耀钻石海岸',
    driveSummary: { total:'约 30 km', time:'约 30 分钟（不含景点停留）' },
    hotel:{ name:'Lakeview Cabin 民宿', note:'连住，南岸湖景小屋', map:'Lakeview Cabin Iceland' },
    aurora:{ location:{ name:'Lakeview Cabin（近 Kirkjubæjarklaustur）', lat:63.79, lon:-18.06 },
      sunrise:'08:06', sunset:'18:41', kpIndex:3, cloudCover:45, probability:'medium',
      summary:'云量中等，示例情境下观测机会中等', updatedAt:'示例数值，出发前请再核实预报' },
    spots: [
      { icon:'🧊', name:'Blue Ice Cave 蓝冰洞', label:'A', img:'blue-ice-cave.webp', tags:['冰洞','需向导'],
        desc:'需由专业向导带领进入的冰川冰洞，洞壁呈现罕见蓝色冰晶纹理，是冰岛独有体验之一。',
        deepDesc:'加入一场难忘的冒险，前往瓦特纳冰川——欧洲最大的冰川。行程从 Troll base（霍夫/Hof）出发，乘车15分钟前往冰川停车场，再步行15分钟抵达冰川。约2小时探索 Falljökull 冰川，穿越深裂缝，发现随季节变化的独特冰层结构，并进入天然形成的蓝冰洞。回到集合点后可享用免费热饮和糖果棒暖身。',
        tips:'请携带保暖衣物、手套与防滑鞋；需提前预订行程。',
        parking:'跟团集合点停车。',
        toilet:'无。',
        map:'Troll Expeditions Skaftafel',
        nextStop:{ type:'drive', text:'🚗 前往 Jökulsárlón', detail:'约 15 km · 约 15 分钟' } },
      { icon:'🚤', name:'Jökulsárlón 冰河湖', label:'B', img:'jokulsarlon.webp', tags:['冰河湖','花儿与少年'],
        desc:'冰岛最著名冰河湖，大块浮冰缓缓漂向出海口，湖光与冰山相映，可报名搭船近距离观赏。',
        deepDesc:'傑古沙龍冰河湖是冰岛最大、最著名的冰河湖，湖底深达200公尺，也是冰岛的第二大深湖。你可以报名搭乘水陆两栖船，在冰山之间穿梭，聆听导游讲解每座冰山的年龄与故事；也可以只是在岸边静静坐着，看海豹偶尔探出头来。这里是《古墓奇兵》、《蝙蝠侠：开战时刻》及007系列电影的取景地。',
        tips:'建议安排充足拍照时间，湖边风大且气温偏低，请注意保暖。',
        parking:'1000 ISK（Parka app）。',
        toilet:'游客中心或咖啡馆，200 ISK。',
        map:'Jokulsarlon Glacier Lagoon',
        nextStop:{ type:'walk', text:'🚶 步行前往 Diamond Beach', detail:'约 1 km · 约 10 分钟（过桥即达）' } },
      { icon:'💠', name:'Diamond Beach 钻石海滩', label:'C', img:'diamond-beach.webp', tags:['黑沙滩','浮冰','花儿与少年'],
        desc:'与冰河湖相邻的黑沙滩，被海浪冲上岸的透明浮冰散落沙滩，在阳光下犹如钻石点点。',
        deepDesc:'钻石沙滩与冰河湖只隔一条马路，却呈现截然不同的梦境。瓦特纳冰川融化崩解之后，大大小小的冰块从傑古龍冰河湖中顺着水道被带到海上，再被海浪冲上岸边，放眼望去就像一颗颗镶嵌在黑沙滩上的巨大钻石。透明的冰块在黑色火山沙的衬托下，闪烁着蓝白色的光芒，日出与日落时分尤其梦幻。',
        tips:'冰块表面湿滑，不建议攀爬冰块拍照，靠近海浪处请留意安全。2025年起取消单独收费。',
        parking:'与冰河湖停车场通用，2025年起取消单独收费。',
        toilet:'无。',
        map:'Diamond Beach Iceland',
        nextStop:{ type:'drive', text:'🚗 前往民宿', detail:'约 90 km · 约 75 分钟' } }
    ],
    drives:[
      { from:'Blue Ice Cave（集合点）', to:'Jökulsárlón', dist:'约 15 km', time:'约 15 分钟' },
      null,
      null
    ]
  },
  day5: {
    num:'5', dateLabel:'10月8日（周四）', title:'公路慢行·蓝湖疗愈',
    routeMapImg:'route-day5.webp',
    driveSummary: { total:'约 325 km', time:'约 4小时50分钟（不含景点停留，这天是长途转场日）' },
    hotel:{ name:'Garður Apartments 民宿', note:'Garður 地区公寓式民宿，邻近蓝湖与机场', map:'Gardur Apartments Iceland' },
    aurora:{ location:{ name:'Garður（近蓝湖与机场）', lat:64.07, lon:-22.70 },
      sunrise:'08:09', sunset:'18:38', kpIndex:2, cloudCover:65, probability:'low',
      summary:'云量偏高、又邻近机场光害，示例情境下观测机会偏低', updatedAt:'示例数值，出发前请再核实预报' },
    spots: [
      { icon:'🏞️', name:'Fjaðrárgljúfur 羽毛峡谷', label:'A', tags:['峡谷','世界最美峡谷'],
        desc:'冰岛南部最壮丽的自然奇观之一，狭长河谷全长约2公里、深约100米，从高空俯瞰形似一根羽毛。',
        deepDesc:'羽毛峡谷由小冰河末期的流水与冰川侵蚀而成，软质岩体被带走，坚硬岩体留下，造就了现在看到的壮丽峡谷地形。峡谷岩壁陡峭蜿蜒，从高空俯瞰时形状如同一根羽毛，因此得名「羽毛河」。沿着上方步道走一圈约需40至60分钟，不同角度都能看到河流在谷底蜿蜒的画面，是南岸公路旅行中很值得停留的一段插曲。',
        tips:'步道有些路段靠近断崖边缘，请留意脚下，不建议穿拖鞋前往。',
        parking:'下方停车场有免费简易厕所。',
        toilet:'下方停车场设有免费简易厕所。',
        map:'Fjadrargljufur Canyon Iceland',
        nextStop:{ type:'drive', text:'🚗 前往 Blue Lagoon 蓝湖', detail:'约 295 km · 约 4 小时 15 分钟' } },
      { icon:'♨️', name:'Blue Lagoon 蓝湖温泉', label:'B', img:'blue-lagoon.webp', tags:['地热温泉','SPA'],
        desc:'世界知名地热温泉 SPA，乳白蓝色温泉水富含矽土与矿物质，据说对皮肤有舒缓效果。',
        deepDesc:'蓝湖温泉是冰岛最著名的「放松仪式」。有趣的是，蓝湖并非天然温泉，而是人为地热池——邻近的 Svartsengi 地热发电厂将地下热水抽取至地表发电后，排出的高温含矿废水流入熔岩区的低洼地，经年累月积聚形成这片温泉池，多孔的玄武岩天然过滤了水中杂质。乳白色的湖水也不是色素造成，而是水中的二氧化矽与藻类让阳光散射，短波长的蓝光被反射、长波长的红光被吸收，形成从乳白到深蓝层次变化的独特色泽，与冰岛蓝冰洞的「蓝」是同样的光学原理。水温常年维持在37至39度，即使外面风雪交加，泡在温暖的蓝湖中依然舒适无比。温泉区提供矽土面膜，敷着面膜、喝着冰沙、和朋友聊天，是北欧式「慢活」的极致体验——矽土能舒缓软化肌肤，水中的硫、钙、镁等矿物质则有助于放松肌肉、促进血液循环。',
        tips:'门票分 Comfort（含门票、矽泥面膜、毛巾、一杯饮品）、Premium（加浴袍拖鞋、两款面膜、两杯饮品）、Signature（再加一套居家保养品）三个等级，建议提前在官网预订。矿物质水会让头发变得极度干涩，进池前务必涂抹大量护发素；隐形眼镜不建议佩戴，改戴眼镜或闭眼享受。冰岛温泉规定入池前需裸身淋浴。',
        parking:'温泉区停车场免费。',
        toilet:'温泉区内。务必导航「Blue Lagoon Iceland」，勿搜中文「蓝湖」以免误导至废弃地热厂区。',
        map:'Blue Lagoon Iceland',
        nextStop:{ type:'drive', text:'🚗 前往民宿', detail:'约 20 km · 约 20 分钟' } }
    ]
  },
  day6: {
    num:'6', dateLabel:'10月9日（周五）', title:'告别冰岛·飞向芬兰', transit:true,
    flights:[
      { airline:'芬兰航空', flightNo:'AY992', from:'凯夫拉维克 KEF', to:'赫尔辛基万塔 HEL', dep:'08:35', arr:'15:00', duration:'约3小时25分', date:'10月9日' }
    ],
    hotel:{ name:'Hilton Helsinki Airport', note:'赫尔辛基机场希尔顿酒店，抵达后入住，交通便利', map:'Hilton Helsinki Airport' }
  },
  day7: {
    num:'7', dateLabel:'10月10日（周六）', title:'赫尔辛基·北欧漫游日',
    routeMapImg:'route-day7.webp',
    hotel:{ name:'飞机上', note:'当晚搭乘深夜航班返港（AY099，00:35起飞）' },
    isHelsinki: true,
    areas: [
      {
        label:'A区 · 白教堂周边',
        spots: [
          { icon:'🚉', name:'中央车站', label:'A', tags:['交通枢纽','建筑'], isShop:true,
            desc:'赫尔辛基中央车站，绿色新艺术风格钟楼，门口两座巨型石像守护，是城市漫游的出发点。',
            tips:'建议在车站附近购买一日电车票，方便后续各区移动。',
            map:'Helsinki Central Station' },
          { icon:'⛪', name:'赫尔辛基大教堂（白教堂）', label:'A', img:'helsinki-cathedral.webp', tags:['地标','参议院广场'],
            desc:'矗立在参议院广场高处的白色新古典主义教堂，是赫尔辛基最具代表性的地标建筑之一。',
            deepDesc:'赫尔辛基大教堂位于市中心参议院广场上，建于1830年，属于新古典主义风格，上方有一个大绿色圆顶，周围是四个小圆顶，小圆顶是模仿圣彼得堡的圣以薩大教堂设计，上方还有12位圣徒雕像。教堂同时也是赫尔辛基大学神学院的礼堂，经常举行婚礼等特别活动。坐在白色阶梯上，看着广场上来来往往的芬兰人，这个以「沉默」闻名的民族，在这座纯白教堂前显得格外从容。旧时出海的水手远远看到这座白色教堂，就知道离赫尔辛基越来越近，因此赫尔辛基又被称为「白都」。',
            tips:'教堂前白色阶梯是热门拍照点，内部通常免费开放参观。',
            map:'Helsinki Cathedral' },
          { icon:'🏛️', name:'参议院广场 & Aleksanterinkatu 精品街', label:'A', tags:['广场','购物'], isShop:true,
            desc:'亚历山大二世雕像与教堂对称构图，旁边 Aleksanterinkatu 精品街有 Moomin 商店、Marimekko、Iittala 设计小店。',
            tips:'Moomin 商店有丰富的芬兰姆明周边，是亲子伴手礼首选。',
            map:'Senate Square Helsinki' }
        ]
      },
      {
        label:'B区 · 市集广场周边',
        spots: [
          { icon:'🐟', name:'市集广场 Market Square', label:'B', img:'market-square-helsinki.webp', tags:['港边市集','当地美食'],
            desc:'紧邻港口码头的传统市集，可品尝当地小吃与新鲜渔获，也能选购手工艺品与纪念品。',
            deepDesc:'赫尔辛基市集广场紧邻港口，是感受芬兰人日常生活最直接的窗口。攤販们販售新鲜渔获、漿果、野菇、手工肥皂和羊毛制品，空气中弥漫着烟熏鲑鱼和肉桂卷的香气。建议和旅伴买一份「鲑鱼汤配黑麵包」站在岸边吃，看着往来的渡轮与海鸥，体验最道地的北欧市集氛围。',
            tips:'营业摊位数量依季节与天气调整，建议先查询当日是否营业。',
            map:'Market Square Helsinki' },
          { icon:'🏛️', name:'老农贸市场（Vanha Kauppahalli）', label:'B', tags:['美食','午餐'], isShop:true,
            desc:'红砖建筑内部，建议在此享用午餐：品尝芬兰鱼汤、烟熏鲑鱼、驯鹿肉罐头等传统美食。',
            tips:'建议预留约40分钟在此用餐，鱼汤配黑麵包是招牌组合。',
            map:'Vanha Kauppahalli Helsinki' },
          { icon:'🗿', name:'哈维斯·阿曼达喷泉', label:'B', tags:['地标'], isShop:true,
            desc:'裸女青铜雕像，芬兰最著名地标之一，位于市集广场一隅，是赫尔辛基的象征性雕塑。',
            map:'Havis Amanda Helsinki' }
        ]
      },
      {
        label:'C区 · 海滨周边',
        spots: [
          { icon:'🌊', name:'旧港海滨步道', label:'C', tags:['散步','海景'], isShop:true,
            desc:'沿南港散步，眺望波罗的海与渡轮，感受赫尔辛基的海港城市氛围。',
            map:'South Harbour Helsinki' },
          { icon:'🔴', name:'乌斯佩斯基大教堂（红教堂）', label:'C', img:'uspenski-cathedral.webp', tags:['东正教','地标'],
            desc:'红砖绿尖塔、东正教洋葱圆顶，站在平台可眺望白教堂，是赫尔辛基「红白双教堂」同框的绝佳地点。',
            deepDesc:'乌斯佩斯基大教堂是北欧最大的东正教教堂，兴建于芬兰仍被俄国统治的1862–1868年，由俄国建筑师设计，耗时6年完工。外立面用了70万块红砖堆砌而成，最大的特色是大量金色圆顶与十字架，共十三座塔，所有尖塔上的十字架都朝向东方，象征耶稣与十二使徒。红砖外墙配上绿色洋葱圆顶，与白色的赫尔辛基大教堂形成强烈对比。站在教堂前的平台上，可以同时将白教堂与港口尽收眼底，是拍摄赫尔辛基「双教堂同框」最经典的角度。内部正中央的 Iconostasis 圣龛墙金碧辉煌，是传统东正教堂艺术风格的代表。',
            tips:'通常周六开放 10:00–15:00，请留意开放时间。教堂门口广场是拍摄爱情锁桥+大教堂同框角度的好位置。',
            map:'Uspenski Cathedral Helsinki' },
          { icon:'💕', name:'爱之桥', label:'C', tags:['爱情锁','打卡'], isShop:true,
            desc:'桥栏布满爱情锁，桥上可远眺红白双教堂同框，是浪漫打卡胜地。',
            map:'Love Lock Bridge Helsinki' }
        ]
      },
      {
        label:'D区 · 岩石教堂',
        spots: [
          { icon:'🪨', name:'岩石教堂（Temppeliaukio Church）', label:'D', img:'temppeliaukio-church.webp', tags:['地标','岩洞教堂'],
            desc:'北欧唯一岩洞教堂，铜制圆顶、天然岩壁、天窗光线洒落，建筑直接从天然岩石中开凿而成。',
            deepDesc:'岩石教堂又称「圣殿广场教堂」，完工于1969年，是赫尔辛基三大教堂中最近代的建筑，也颠覆了很多人对欧洲教堂华丽古典的刻板印象。教堂外墙完全由岩石构成，内部保留原始的岩壁纹理，上方覆盖着巨大的铜制圆顶，中央的圆形天窗让自然光洒落其中。虽没有华丽的装饰与精致的雕花，但特殊的空间氛围与建筑手法，让这里成为赫尔辛基最热门的景点与音乐会场地之一，绝佳的音响效果让每一场演出都成为难忘的体验。',
            tips:'门票约 5 欧元，周一休。建议上午或下午造访，避开正午团客高峰。',
            map:'Temppeliaukio Church Helsinki' }
        ]
      },
      {
        label:'E区 · 芬兰堡 Suomenlinna',
        spots: [
          { icon:'⛴️', name:'搭船前往芬兰堡', label:'E', tags:['渡轮','海上要塞'], isShop:true,
            desc:'从市集广场码头搭渡轮约15-20分钟即达，芬兰堡是建于18世纪的海上要塞，也是联合国教科文组织世界遗产。',
            tips:'渡轮为市区交通卡通用范围，班次频繁，来回记得留意末班船时间。',
            map:'Suomenlinna Ferry Helsinki' },
          { icon:'⛪', name:'芬兰堡教堂 Suomenlinna Church', label:'E', tags:['教堂','灯塔'],
            desc:'建于1854年的教堂，最初是俄罗斯东正教驻军教堂，现为福音路德教堂，塔楼内的灯塔至今仍为空中与海上交通导航。',
            deepDesc:'芬兰堡教堂最初建于1854年，是俄罗斯东正教驻军教堂，原建筑有五座洋葱顶尖塔；芬兰独立后改建为福音路德教堂，圆顶不再是洋葱状，塔楼也改为四方型。教堂尖塔内设有一座为空中和海上交通导航的灯塔，会发出四次连续闪光——在摩斯电码中代表「H」，正是赫尔辛基的意思。如今这里也是举办婚礼、音乐会等活动的场所，游客中心与小超市之间的小路，就是探索要塞的「蓝色路线」起点。',
            tips:'教堂旁的游客中心可索取要塞地图，蓝色路线沿途会经过多处历史遗迹与炮台。',
            map:'Suomenlinna Church' }
        ]
      },
      {
        label:'F区 · Allas Sea Pool',
        spots: [
          { icon:'🏊', name:'Allas Sea Pool', label:'F', img:'allas-sea-pool.webp', tags:['海景泳池','桑拿'],
            desc:'位于港边的海景泳池综合设施，包含海水池、淡水池与传统桑拿房，可一边泡水一边眺望港湾。',
            deepDesc:'Allas Sea Pool 是赫尔辛基近年最热门的「海边生活」据点，包含温水淡水池（27°C）、海水池与传统芬兰桑拿。最经典的体验是：在桑拿房里蒸到满身大汗，然后直接冲进冰冷的海水池中——这种「冰火两重天」的冲击，是芬兰人保持身心健康的秘密。即使10月气温已低，温水池依然舒适，而且可以一边泡水一边眺望港湾与教堂，景色无敌。',
            tips:'需付费入场，建议自备泳装与毛巾，现场也提供租借服务。行程结束后步行返回中央车站，转乘火车前往机场酒店取行李，深夜搭机返港。',
            map:'Allas Sea Pool Helsinki' }
        ]
      }
    ]
  },
  day8: {
    num:'8', dateLabel:'10月10日（周六）深夜 → 10月11日（周日）', title:'满载回忆·返回香港', transit:true,
    flights:[
      { airline:'芬兰航空', flightNo:'AY099', from:'赫尔辛基万塔 HEL', to:'香港 HKG', dep:'00:35', arr:'17:10', duration:'约9小时35分', date:'10月11日', note:'10月10日行程结束后深夜航班' }
    ],
    note:'10月10日为「芬兰人的一天」行程，当晚无需住宿，深夜航班返港；10月11日傍晚抵达香港。'
  }
};
