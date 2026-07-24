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
    note:'10月3日从香港出发，经新加坡樟宜、赫尔辛基万塔转机，10月4日清晨抵达冰岛凯夫拉维克机场，展开黄金圈行程。'
  },
  day1: {
    num:'1', dateLabel:'10月4日（周日）', title:'雷市初见·地热启程',
    routeMapImg:'route-day1.webp',
    driveSummary: { total:'约 165 km', time:'约 2小时45分钟（不含景点停留，市区路段为步行）' },
    hotel:{ name:'South Central Country Apartment 民宿', note:'黄金圈地区，舒适乡村民宿环境', map:'South Central Country Apartment Iceland' },
    spots: [
      // TODO(图片)：目前没有 img/images，之后有照片时记得补上
      { icon:'🛬', name:'KEF 机场抵达 · 取车', tags:['机场','免税店','租车'],
        desc:'抵达凯夫拉维克国际机场，于免税店采买酒类（价格远低于市区），办理租车手续，正式展开冰岛自驾之旅。',
        deepDesc:'凯夫拉维克国际机场（KEF）是冰岛唯一的国际门户，虽然不大，但动线清晰、效率极高。落地后第一件事：冲向免税店！冰岛的酒类仅能在国营专卖店 Vínbúðin 或机场免税店购买，而免税店的价格远低于市区，是补货的最佳时机。拿到车钥匙的那一刻，北国大地的冒险才正式开始。别忘了在机场上个厕所、喝杯咖啡，因为接下来的行程，可是马不停蹄的精彩！',
        tips:'别忘了在机场上个厕所！',
        toilet:'机场内免费',
        map:'Keflavik International Airport',
        nextStop:{ type:'drive', text:'🚗 前往雷克雅未克市区', detail:'约 50 km · 约 45 分钟' } },
      { icon:'⛪', name:'哈尔格林姆教堂 Hallgrímskirkja', label:'A', tags:['地标教堂','必访'],
        desc:'冰岛地标教堂，外观以玄武岩熔岩流为灵感，前卫造型让人很难联想到传统欧洲教堂，是所有旅人的必访打卡点。',
        deepDesc:'哈尔格林姆教堂高73米，是冰岛最大的教堂，也是全国第六高建筑。外观以火山爆发时的玄武岩熔岩流为意象，线条锐利前卫，第一眼很难把它跟传统欧洲教堂划上等号。教堂前的广场立着一尊青铜雕像，是1930年美国为庆祝冰岛建国千年所赠，雕的是冰岛独立运动之父雷弗尔·艾里克森。走进教堂内部，没有想象中金碧辉煌的十字架与花窗，反而是明亮极简的北欧风，巨大的管风琴不时传出沉稳琴声，让人忍不住多坐一会儿。购票（成人1400 ISK，可刷卡）可搭电梯登顶，居高俯瞰雷克雅未克市容。',
        tips:'教堂周边有免费停车场，找不到位子的话附近也有不少收费停车场。',
        toilet:'教堂内免费。',
        map:'Hallgrimskirkja Reykjavik',
        nextStop:{ type:'walk', text:'🚶 沿彩虹步道步行前往彩虹街', detail:'约 5 分钟步行' } },
      { icon:'🌈', name:'彩虹街与购物主街 Laugavegur', label:'B', tags:['购物街','美食'],
        desc:'从教堂正门沿彩虹步道缓坡而下，直接汇入雷克雅未克最热闹的购物主街，一路可以逛到旧港边。',
        deepDesc:'彩虹街可以说是冰岛精华中的精华——想吃冰岛美食、买伴手礼，或找间酒吧餐酒馆坐下来，通通都在这条街上解决。彩虹街尽头接上的劳德威格尔购物街（Laugavegur）是冰岛最古老也最繁华的一条街，纪念品种类比沿途各景点附设的商店齐全得多：蓝湖保养品、羊毛制品、帕芬鸟娃娃、冰箱贴、明信片应有尽有，只是价格不算便宜。想吃点在地小吃，Icelandic Street Food 的羊肉汤／海鲜汤面包碗、Valdís 冰淇淋都是熟门熟路的选择。',
        tips:'想买保暖品牌可以留意 Geysir、Icewear、66°North 这几家冰岛本土品牌店。',
        map:'Laugavegur Reykjavik',
        nextStop:{ type:'walk', text:'🚶 步行前往哈帕音乐厅', detail:'约 10–15 分钟步行' } },
      { icon:'🎼', name:'哈帕音乐厅 Harpa', label:'C', tags:['地标建筑','海港'],
        desc:'冰岛最重要的艺术场地，外观由不规则玻璃片组成，灵感来自六边形玄武岩，随光线与天气变化呈现不同色彩。',
        deepDesc:'哈帕音乐厅的立面用了大量不规则形状的玻璃片，跟哈尔格林姆教堂一样，灵感都来自冰岛的六边形玄武岩地质。白天阳光洒落时，玻璃片会折射出斑斓光影；晚上则会亮起LED灯，运气好的话还能同时拍到音乐厅跟极光同框，是白天夜晚都值得来的建筑。旁边海岸线上还有一座维京船骨架造型的雕塑「太阳航海者」，象征探索与冒险精神，散步过去只要几分钟。',
        tips:'傍晚时段来最容易拍到LED灯光与晚霞交织的画面。',
        map:'Harpa Reykjavik',
        nextStop:{ type:'drive', text:'🚗 前往辛格维利尔国家公园', detail:'约 50 km · 约 50 分钟' } },
      { icon:'🚶', name:'回程路线：海港与托宁湖', tags:['备选','散步'], isOptional:true,
        desc:'不想直接开车离开的话，可以沿着旧港区海滨与托宁湖散步走回教堂一带，用不同路径感受市区的另一面。',
        deepDesc:'托宁湖是雷克雅未克市内最大的湖泊，沿湖畔走一圈，天鹅、海鸥、野鸭悠游其中，很多当地人会带饲料或面包来喂食，因此被戏称为「世界最大面包汤」。比起彩虹街的喧闹，这里安静许多，算是市区里比较小众的一面，体力和时间允许的话，很适合当作离开雷克雅未克前的最后一段散步。',
        tips:'这段是体力/时间允许时的加分行程，走不走都不影响后续开车路线。' },
      { icon:'🏞️', name:'Þingvellir 辛格维利尔国家公园', label:'D', images:['thingvellir.webp','thingvellir-alt-1.webp','thingvellir-alt-2.webp','thingvellir-alt-3.webp','thingvellir-alt-4.webp','thingvellir-alt-5.webp','pingvellir-1.webp','pingvellir-2.webp','pingvellir-3.webp','pingvellir-4.webp','pingvellir-5.webp','oxararfoss-1.webp'], tags:['世界遗产','国家公园','地质奇观','花儿与少年'],
        desc:'冰岛最早的露天议会旧址，同时也是北美板块与欧亚板块的交界裂谷带，可沿步道走在两大板块之间。',
        deepDesc:'辛格维利尔于2004年列入世界遗产，素有「世界最古老的民主议会会址」之称——早在公元930年，维京人就曾在这里集会议事，堪称人类民主制度的摇篮。更神奇的是，你脚下踩着的正是北美板块与欧亚板块的交接裂谷，两大陆地每年仍以约2公分的速度缓缓分离。园区步道可通往法律石 Lögberg（当年议会宣法的讲坛）与 Hakið 观景台，在此可俯瞰整个国家公园，一旁还有建于1859年的辛格维利尔教堂与冰岛总理夏季官邸。对闺蜜或夫妻来说，手牵手「横跨两大洲」的画面，是这趟旅程最浪漫的打卡姿势之一。',
        tips:'建议安排 1.5–2 小时，主步道平缓适合长辈同行，山风较大请注意保暖。',
        parking:'共有 P1–P5 五个停车场，P1/P2/P5 收费 1000 ISK（Parka app），其余免费。',
        toilet:'游客中心 200 ISK。',
        map:'Thingvellir National Park Iceland',
        nextStop:{ type:'drive', text:'🚗 前往 Kerið 火山口湖', detail:'约 30 km · 约 30 分钟' } },
      { icon:'🌀', name:'Kerið 火山口湖', label:'E', images:['kerid.webp','kerid-alt-1.webp','kerid-alt-2.webp','kerid-alt-3.webp','kerid-alt-4.webp','kerid-alt-5.webp','Kerio-1.webp','Kerio-2.webp'], tags:['火山口','湖泊'],
        desc:'约三千年历史的火山口湖，湖水呈蓝绿色，四周是红褐色火山岩壁，可沿边缘步道俯瞰全景。',
        deepDesc:'Kerið 火山口湖形成于约三千年前的一次火山喷发，是冰岛最上镜的火山口湖之一。湖水因矿物质沉淀呈现梦幻的蓝绿色，与四周红褐色的火山岩壁形成强烈对比，色彩饱和度之高，让人怀疑是否真实。环湖步道仅需15至20分钟即可走完，不同角度的光线会让湖面呈现截然不同的色调。',
        tips:'入口处需支付小额门票，环湖步道全程约 15–20 分钟。',
        parking:'600 ISK（现场机器缴费，含门票）；另有资料称 800 ISK。',
        toilet:'有。',
        map:'Kerid Crater Iceland',
        // 两段式导航链：先到 Selfoss 超市补给，再到民宿（10/4、10/5 两晚都住这间）
        nextStops:[
          { name:'Bónus超市（Selfoss）', address:'Bónus Selfoss Iceland', distanceKm:15, etaMin:15 },
          { name:'民宿（South Central，Blesastaðir 3, Brautarholt）', address:'South Central Country Apartment Iceland', distanceKm:20, etaMin:25 }
        ] }
    ]
  },
  day2: {
    num:'2', dateLabel:'10月5日（周一）', title:'追泉逐瀑·黄金圈巡礼',
    routeMapImg:'route-day2.webp',
    driveSummary: { total:'约 102 km', time:'约 1小时45分钟（不含景点停留，不含备选景点绕行）' },
    hotel:{ name:'South Central Country Apartment 民宿', note:'连住，黄金圈地区', map:'South Central Country Apartment Iceland' },
    spots: [
      { icon:'💎', name:'Brúarfoss 蓝色秘境瀑布', label:'A', images:['bruarfoss.webp','bruarfoss-alt-2.webp','bruarfoss-alt-3.webp','bruarfoss-alt-4.webp','bruarfoss-alt-5.webp','Bruarfoss-1.webp','Bruarfoss-2.webp','Bruarfoss-3.webp','Bruarfoss-4.webp','Bruarfoss-5.webp'], tags:['瀑布','秘境'],
        desc:'以水色闻名的瀑布，河水因玄武岩地质呈现梦幻蓝绿色，需徒步约 20–30 分钟抵达。',
        deepDesc:'Brúarfoss 被誉为「蓝钻石瀑布」，是冰岛黄金圈一带的隐藏版秘境。河流因流经玄武岩地质，折射出梦幻的蓝绿色调，在阳光下闪烁如碎钻般的光芒。虽然需要步行约20至30分钟才能抵达，但正是这段不长不短的徒步，过滤了大部分观光客，让你和旅伴能独享这片静谧的蓝色奇迹。对闺蜜好友来说，这里是谈心拍照的绝佳地点；对夫妻来说，水声潺潺的私密氛围，比任何高级餐厅都更适合说悄悄话。提醒：这里没有厕所，出发前记得在民宿或超市解决，并带上零食和热饮，在瀑布前来一场野餐。',
        tips:'步道路面不平整，建议穿防滑鞋，可视体力评估是否全程走完。',
        parking:'750 ISK（Parka app），停车场步行约 5 分钟。',
        toilet:'无。',
        map:'Bruarfoss Iceland',
        // 民宿→Brúarfoss 尚无实测数据，为估算值
        nextStop:{ type:'drive', text:'🚗 前往 Geysir', detail:'约 35 km · 约 35 分钟（估算）' } },
      { icon:'💦', name:'Geysir 盖锡尔地热区', label:'B', images:['geysir.webp','geysir-alt-1.webp','geysir-alt-2.webp','geysir-alt-3.webp','geysir-alt-4.webp','geysir-alt-5.webp'], tags:['地热','喷泉','花儿与少年'],
        desc:'区内的 Strokkur 间歇泉每隔数分钟便会喷发一次，水柱可高达十余米，周边还有多处地热池。',
        deepDesc:'盖锡尔间歇泉曾是世界上最壮观的间歇泉，喷发时高度可达60至80米，气势惊人。虽然因人为因素造成阻塞，目前大盖锡尔已停止喷发，但其壮阔的历史仍深植人心。一旁的斯特罗柯间歇泉（Strokkur）虽然无法与昔日大盖锡尔相比拟，但每隔5至10分钟便会规律喷发，水柱直冲天际的瞬间依然令人屏息。对第一次来冰岛的旅人来说，站在弥漫着硫磺气息的地热区，看着滚烫的水柱从地底冲出，那种「大地在呼吸」的震撼感，绝对是黄金圈最难忘的记忆之一。建议和旅伴轮流录影，才能同时捕捉到喷发的壮观与彼此惊喜的表情。',
        tips:'喷发前常有水汽随风飘散，建议站在下风处等候。',
        parking:'1000 ISK（Parka app）；部分资料亦称免费，建议现场确认。',
        toilet:'游客中心内免费，环境不错。旁边有 N1 加油站。',
        map:'Geysir Iceland',
        nextStop:{ type:'drive', text:'🚗 前往 Gullfoss', detail:'约 10 km · 约 10 分钟' } },
      { icon:'🌊', name:'Gullfoss 黄金瀑布', label:'C', images:['gullfoss.webp','gullfoss-alt-1.webp','gullfoss-alt-2.webp','gullfoss-alt-3.webp','gullfoss-alt-4.webp','gullfoss-alt-5.webp','Gullfoss-1.webp','Gullfoss-2.webp','Gullfoss-3.webp','Gullfoss-4.webp','Gullfoss-5.webp','Gullfoss-6.webp','Gullfoss-7.webp','Gullfoss-8.webp'], tags:['瀑布','必访','花儿与少年'],
        desc:'冰岛最具代表性的瀑布之一，河水分两层跌入峡谷，水量丰沛气势磅礴，晴天时常见彩虹。',
        deepDesc:'古佛斯黄金瀑布（Gullfoss）是黄金圈名称的由来，也是冰岛最具代表性的自然奇观之一。倾泻而下的瀑布溅起的水珠弥漫在天空，在阳光照射下形成道道彩虹，仿佛整个瀑布是用金子锻造成的，景象瑰丽无比，令游客流连忘返。当你站在观景台上，看着冰川融水从两层断崖奔腾而下，发出雷鸣般的轰响，那种被大自然震慑的感觉，会让你瞬间理解为什么当年有人不惜牺牲一切也要保护这座瀑布不被水力发电厂破坏。对夫妻来说，这里是「壮阔」与「浪漫」的绝佳交会点；对闺蜜来说，在彩虹前拍一张背影合照，绝对是朋友圈的点赞保证。',
        tips:'上、下两层观景台都值得走，木栈道靠近瀑布处湿滑，请留意脚下。',
        parking:'1000 ISK（Parka app）；部分资料亦称免费，建议现场确认。',
        toilet:'游客中心内。',
        map:'Gullfoss Iceland',
        nextStop:{ type:'drive', text:'🚗 前往 Faxi 瀑布（备选）', detail:'约 24 km · 约 20 分钟' } },
      { icon:'💧', name:'Faxi 瀑布', label:'D', images:['Faxi-1.webp','Faxi-2.webp'], tags:['瀑布','免健行','秘境'], isOptional:true,
        desc:'黄金圈隐藏版瀑布，河面宽阔、水流平缓，车停好走1分钟即可抵达，免健行也能拍到美照。',
        deepDesc:'Faxi 瀑布（又名 Vatnsleysufoss）是黄金圈路线上最被低估的秘境之一。不同于黄金瀑布的气势磅礴，Faxi 以宽阔的河面与多层次的阶梯状水流著称，在阳光下闪烁着柔和的光泽。最棒的是，它几乎「零门槛」——把车停好，步行不到1分钟就能站在瀑布前，完全不需要登山或徒步。对带着长辈或不想走太多路的旅人来说，这是「懒人版瀑布」的完美选择；对摄影爱好者来说，开阔的视野与平缓的水流，反而更容易捕捉到如丝绸般的长曝光画面。建议顺游，15分钟快闪即可收获一张令人惊艳的风景照。',
        tips:'瀑布边缘湿滑，拍照时请留意脚下。停留约 15 分钟。走不走这站不影响后续路线。',
        parking:'约 900 ISK（现场缴费）',
        toilet:'有（停车场附近）',
        map:'Faxi Waterfall Iceland' },
      { icon:'🍦', name:'Efstidalur II 家庭农庄', label:'E', tags:['备选','农场','冰淇淋'], isOptional:true,
        desc:'黄金圈沿线的家庭式乳品农场，招牌是农场自产的浓郁冰淇淋，还能隔着玻璃看牛棚里的乳牛。',
        deepDesc:'Efstidalur II 位于前往盖锡尔、黄金瀑布的必经道路上，几乎所有黄金圈行程都会顺路停留。招牌冰淇淋用自家牧场的鲜奶制作，口感浓郁香醇，两球约1400 ISK，想用饼干装则加50 ISK，以冰岛物价来说算是平实美食。一边吃冰、一边透过玻璃窗看乳牛在牛棚里悠闲踱步，是黄金圈自驾途中很受欢迎的休息站。农场周边草地上也常能看到悠闲吃草的冰岛马。',
        tips:'想省时间的话可以跳过，留给后面的马场体验冰岛马互动。',
        toilet:'农场内有',
        map:'Efstidalur II Iceland' },
      { icon:'🐴', name:'Bru Horsefarm 冰岛马场', label:'F', images:['BruHorsefarm-1.webp','BruHorsefarm-2.webp','BruHorsefarm-3.webp','BruHorsefarm-4.webp'], tags:['冰岛马','互动体验'],
        desc:'超可爱又亲人的冰岛马农场，自助喂食糖果，近距离感受这个千年纯种、性格温驯的国宝级动物。',
        deepDesc:'Bru Horsefarm 是黄金圈自驾途中很受欢迎的一站，农场里一群「个性十足」的冰岛马总是好奇地凑过来讨摸。自助式马糖果一盒300 ISK、五盒1000 ISK，自己拿、自己投钱，喂食时把掌心平放，让马儿轻轻舔走糖果——那一刻的温柔，会让所有寒冷都被治愈。冰岛马是世界上血统最纯正的马种之一，自9世纪由维京人引进后，冰岛便严格禁止马匹进口，出国的冰岛马终生不得再入境，造就了千年未混血的纯种血统。牠们体型矮小但肌肉扎实、毛发丰厚，性格温驯不具攻击性，还拥有独步全球的「tölt」步法——四蹄以固定节奏轮流落地，几乎感觉不到颠簸，像在滑行一样平稳。',
        tips:'喂食前记得询问工作人员是否可以喂自备的红萝卜/苹果，切勿站在马匹正后方。停留约 30 分钟。',
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
    spots: [
      { icon:'💧', name:'Seljalandsfoss', label:'A', images:['seljalandsfoss.webp','Seljalandsfoss-1.webp','Seljalandsfoss-2.webp','Seljalandsfoss-3.webp'], tags:['瀑布','可走入水帘后','花儿与少年'],
        desc:'知名度极高的瀑布，游客可沿步道走到水帘后方洞穴，从背面欣赏瀑布独特视角。',
        deepDesc:'Seljalandsfoss 是冰岛少数可以「走到水帘后方」的瀑布，也是南岸最经典的打卡点之一。当你沿着湿滑的步道绕到瀑布背面，从洞穴内向外望去，水幕如纱帘般垂挂，阳光穿透时折射出迷离的光晕，彷佛置身于精灵的居所。务必穿防水外套，手机相机也要做好防水保护。',
        tips:'水帘后方步道湿滑且水花大，建议穿防水外套并留意随身物品防水。',
        parking:'900–1000 ISK（现场机器/Parka app）。',
        toilet:'200 ISK，环境一般。',
        map:'Seljalandsfoss Iceland',
        nextStop:{ type:'drive', text:'🚗 前往 Skógafoss', detail:'约 30 km · 约 25 分钟' } },
      { icon:'🏔️', name:'Skógafoss', label:'B', images:['skogafoss.webp','Skógafoss-1.webp','Skógafoss-2.webp','Skógafoss-3.webp','Skógafoss-4.webp','Skógafoss-5.webp','Skógafoss-6.webp'], tags:['瀑布','登高观景','花儿与少年'],
        desc:'宽阔壮观的悬崖瀑布，天气晴朗时常见彩虹，瀑布一侧有阶梯可登顶俯瞰南岸海岸线。',
        deepDesc:'Skógafoss 宽约25米、高约60米，是冰岛最壮观的瀑布之一。由于水量丰沛且水雾弥漫，只要阳光角度对了，几乎保证能看到双彩虹甚至三彩虹。瀑布右侧有一条527阶的铁梯，登顶后可俯瞰南岸海岸线的辽阔景色。传说中，维京人曾在瀑布后方的洞穴中藏了宝藏，至今无人找到。',
        tips:'阶梯较长较陡，可视体力选择只在瀑布正面拍照，无需登顶。',
        parking:'1000 ISK（Parka app），部分游客称可选择不缴。',
        toilet:'停车场免费厕所，维护不错。',
        map:'Skogafoss Iceland',
        nextStop:{ type:'drive', text:'🚗 前往 Dyrhólaey', detail:'约 35 km · 约 30 分钟' } },
      { icon:'🐦', name:'Dyrhólaey 岬角', label:'C', images:['Dyrholaey-1.webp','Dyrholaey-2.webp','Dyrholaey-3.webp','Dyrholaey-4.webp'], tags:['海角','观景台','花儿与少年'],
        desc:'南岸的海角地标，视野极佳，可远眺黑沙滩与海蚀拱门，夏季亦是海鸚聚集地。',
        deepDesc:'Dyrhólaey 是南岸的最高点，也是俯瞰黑沙滩与海蚀拱门的绝佳观景台。站在岬角边缘，左手边是无尽的黑色沙滩与白色浪花，右手边是壮观的海蚀拱门（据说船只可以从拱门下穿越），远方则是瓦特纳冰川的白色轮廓。即使10月已过了海鸚季，这里的辽阔与孤绝感，依然让人感到「世界尽头」的诗意。',
        tips:'部分道路在恶劣天气或鸟类繁殖期会封闭，出发前建议查看当日开放状况。',
        parking:'750 ISK（Parka app）。',
        toilet:'下层停车场有，200 ISK。',
        map:'Dyrholaey Iceland',
        nextStop:{ type:'drive', text:'🚗 前往 Reynisfjara 黑沙滩', detail:'约 10 km · 约 10 分钟' } },
      { icon:'⚫', name:'Reynisfjara 黑沙滩', label:'D', images:['reynisfjara.webp','Reynisfjara-1.webp','Reynisfjara-2.webp','Reynisfjara-3.webp','Reynisfjara-4.webp','Reynisfjara-5.webp','Reynisfjara-6.webp','Reynisfjara-7.webp','Reynisfjara-8.webp','Reynisfjara-9.webp','Reynisfjara-10.webp'], tags:['黑沙滩','玄武岩柱','花儿与少年'],
        desc:'著名黑沙滩，拥有壮观玄武岩柱与海蚀洞，但此处海浪暗流强劲，是全岛知名危险海岸之一。',
        deepDesc:'Reynisfjara 黑沙滩被《国家地理》杂志评为世界十大最美沙滩之一，也是无数科幻电影的取景地。黑色火山沙粒在白色浪花中翻腾，岸边的玄武岩柱如同管风琴般排列。但这片美丽的背后隐藏着危险——这里的「sneaker waves」来得无声无息，曾多次将靠近海岸的游客卷入海中。',
        tips:'务必远离海浪线，不要背对大海拍照，留意现场警示牌。',
        parking:'1000 ISK（Parka app）。',
        toilet:'游客中心与餐厅内。',
        map:'Reynisfjara Black Sand Beach',
        nextStop:{ type:'drive', text:'🚗 前往维克教堂', detail:'约 10 km · 约 15 分钟' } },
      { icon:'⛪', name:'维克教堂 Vík í Mýrdal Church', label:'E', tags:['教堂','观景'],
        desc:'小巧朴实的白色教堂，坐落山坡上，可俯瞰维克小镇全景、海岸与海上巨石 Reynisdrangar。',
        deepDesc:'维克教堂小巧朴实，但无论外观或内部皆极具安静美感——教堂入口、外围墓地，以及教堂后方山坡都是拍照取景的极佳位置，能俯瞰维克小镇全景、海岸及 Reynisdrangar 海上巨石，日出日落时分光线尤其戏剧性。沿着教堂后方步道往上走，利用地势的前后景衬托，可以拍出宏伟又带点童话感的教堂全貌。有趣的是，这座教堂常被拿来和全球视力检查标准图像（红色小屋）的本尊——位于冰岛西部海德利桑德的英格亚尔德斯霍尔教堂相提并论，算是「平替款」。',
        tips:'建议傍晚时段前往，光线最有戏剧性；后方山坡步道较陡，请留意脚下。',
        map:'Vík í Mýrdal Church',
        // 两段式导航链：先到 Krónan Vík 超市补给，再到民宿（10/6、10/7 两晚都住这间）
        nextStops:[
          { name:'Krónan Vík超市', address:'Kronan Vik Iceland', distanceKm:1, etaMin:5 },
          { name:'民宿（Lakeview Cabin，近 Kirkjubæjarklaustur）', address:'Lakeview Cabin Iceland', distanceKm:72, etaMin:60 }
        ] }
    ],
    drives:[
      { from:'Seljalandsfoss', to:'Skógafoss', dist:'约 30 km', time:'约 25 分钟' },
      null,
      null,
      { from:'Dyrhólaey', to:'Reynisfjara', dist:'约 10 km', time:'约 10 分钟' },
      null
    ]
  },
  day4: {
    num:'4', dateLabel:'10月7日（周三）', title:'走进蓝冰·闪耀钻石海岸',
    driveSummary: { total:'约 30 km', time:'约 30 分钟（不含景点停留）' },
    hotel:{ name:'Lakeview Cabin 民宿', note:'连住，南岸湖景小屋', map:'Lakeview Cabin Iceland' },
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
        // 距离/时间为估算值（总表未提供），推估约等同出发时集合点距离，建议之后核实民宿实际地址
        nextStop:{ type:'drive', text:'🚗 前往民宿', detail:'约 90 km · 约 75 分钟（估算）' } }
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
    spots: [
      { icon:'🏞️', name:'Fjaðrárgljúfur 羽毛峡谷', label:'A', tags:['峡谷','世界最美峡谷'],
        desc:'冰岛南部最壮丽的自然奇观之一，狭长河谷全长约2公里、深约100米，从高空俯瞰形似一根羽毛。',
        deepDesc:'羽毛峡谷由小冰河末期的流水与冰川侵蚀而成，软质岩体被带走，坚硬岩体留下，造就了现在看到的壮丽峡谷地形。峡谷岩壁陡峭蜿蜒，从高空俯瞰时形状如同一根羽毛，因此得名「羽毛河」。沿着上方步道走一圈约需40至60分钟，不同角度都能看到河流在谷底蜿蜒的画面，是南岸公路旅行中很值得停留的一段插曲。',
        tips:'步道有些路段靠近断崖边缘，请留意脚下，不建议穿拖鞋前往。',
        parking:'下方停车场有免费简易厕所。',
        toilet:'下方停车场设有免费简易厕所。',
        map:'Fjadrargljufur Canyon Iceland',
        // 距离/时间为估算值，这一段是全天最长的一段转场车程
        nextStop:{ type:'drive', text:'🚗 前往 Blue Lagoon 蓝湖', detail:'约 295 km · 约 4 小时 15 分钟（估算，全天最长车程）' } },
      { icon:'♨️', name:'Blue Lagoon 蓝湖温泉', label:'B', img:'blue-lagoon.webp', tags:['地热温泉','SPA'],
        desc:'世界知名地热温泉 SPA，乳白蓝色温泉水富含矽土与矿物质，据说对皮肤有舒缓效果。',
        deepDesc:'蓝湖温泉是冰岛最著名的「放松仪式」。有趣的是，蓝湖并非天然温泉，而是人为地热池——邻近的 Svartsengi 地热发电厂将地下热水抽取至地表发电后，排出的高温含矿废水流入熔岩区的低洼地，经年累月积聚形成这片温泉池，多孔的玄武岩天然过滤了水中杂质。乳白色的湖水也不是色素造成，而是水中的二氧化矽与藻类让阳光散射，短波长的蓝光被反射、长波长的红光被吸收，形成从乳白到深蓝层次变化的独特色泽，与冰岛蓝冰洞的「蓝」是同样的光学原理。水温常年维持在37至39度，即使外面风雪交加，泡在温暖的蓝湖中依然舒适无比。温泉区提供矽土面膜，敷着面膜、喝着冰沙、和朋友聊天，是北欧式「慢活」的极致体验——矽土能舒缓软化肌肤，水中的硫、钙、镁等矿物质则有助于放松肌肉、促进血液循环。',
        tips:'门票分 Comfort（含门票、矽泥面膜、毛巾、一杯饮品）、Premium（加浴袍拖鞋、两款面膜、两杯饮品）、Signature（再加一套居家保养品）三个等级，建议提前在官网预订。矿物质水会让头发变得极度干涩，进池前务必涂抹大量护发素；隐形眼镜不建议佩戴，改戴眼镜或闭眼享受。冰岛温泉规定入池前需裸身淋浴。',
        parking:'温泉区停车场免费。',
        toilet:'温泉区内。务必导航「Blue Lagoon Iceland」，勿搜中文「蓝湖」以免误导至废弃地热厂区。',
        map:'Blue Lagoon Iceland',
        // 距离/时间为估算值（总表未提供），建议之后核实民宿实际地址
        nextStop:{ type:'drive', text:'🚗 前往民宿', detail:'约 20 km · 约 20 分钟（估算）' } }
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
