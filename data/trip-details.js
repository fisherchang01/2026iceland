// 每日詳細行程資料（景點、飯店、航班等）。此為主要維護檔案：
// 新增/修改/刪除景點或某一天的細節，只需編輯這裡的 TRIP 物件，不必動 index.html 或其他檔案。
//
// ★ 景點照片：
// 一張照片：img: 'thingvellir.jpg'（舊版寫法，繼續有效，不用改）
// 多張照片：images: ['thingvellir-1.jpg', 'thingvellir-2.jpg', 'thingvellir-3.jpg']
//   → 兩張以上會自動排成「瀑布流」（多欄、依每張照片原始比例排版，不裁切），
//     點擊任一張都能放大檢視，多張時可左右切換。
//   同一個景點如果兩個欄位都寫，images 優先、img 會被忽略。
// 圖片檔案都要放在 images/spots/ 這個資料夾裡，檔名要跟欄位寫的完全一樣（含副檔名）。
// 沒有寫任何照片欄位、或圖片檔案不存在，網站都會自動顯示插畫代替，不會出現「圖片壞掉」的畫面，
// 所以可以之後有照片再慢慢補上，不會影響現在的顯示。
// 照片本身不會再被裁切變形：單張依原始比例顯示、多張用瀑布流排版，直式橫式照片都適用。
// ===== TRIP DATA =====
const TRIP = {
  day0: {
    num:'0', dateLabel:'10月3日（周六）→ 10月4日（周日）', title:'去程', transit:true,
    flights:[
      { airline:'国泰航空', flightNo:'CX635', from:'香港 HKG T1', to:'新加坡樟宜 SIN T4', dep:'15:05', arr:'19:05', duration:'约4小时', date:'10月3日' },
      { airline:'芬兰航空', flightNo:'AY132', from:'新加坡樟宜 SIN T1', to:'赫尔辛基万塔 HEL', dep:'21:35', arr:'06:00+1', duration:'约12小时25分', date:'10月3日→10月4日', note:'当地10月4日抵达' },
      { airline:'芬兰航空', flightNo:'AY991', from:'赫尔辛基万塔 HEL', to:'凯夫拉维克 KEF', dep:'07:10', arr:'07:50', duration:'约3小时40分', date:'10月4日' }
    ],
    note:'10月3日从香港出发，经新加坡樟宜、赫尔辛基万塔转机，10月4日清晨抵达冰岛凯夫拉维克机场，展开黄金圈行程。'
  },
  day1: {
    num:'1', dateLabel:'10月4日（周日）', title:'初探冰岛',
    driveSummary: { total:'约 215 km', time:'约 3小时10分钟（不含景点停留）' },
    hotel:{ name:'South Central Country Apartment 民宿', note:'黄金圈地区，舒适乡村民宿环境', map:'South Central Country Apartment Iceland' },
    spots: [
      { icon:'🛬', name:'KEF 机场抵达 · 取车', tags:['机场','免税店','租车'],
        desc:'抵达凯夫拉维克国际机场，于免税店采买酒类（价格远低于市区），办理租车手续，正式展开冰岛自驾之旅。',
        deepDesc:'凯夫拉维克国际机场（KEF）是冰岛唯一的国际门户，虽然不大，但动线清晰、效率极高。落地后第一件事：冲向免税店！冰岛的酒类仅能在国营专卖店 Vínbúðin 或机场免税店购买，而免税店的价格远低于市区，是补货的最佳时机。拿到车钥匙的那一刻，北国大地的冒险才正式开始。别忘了在机场上个厕所、喝杯咖啡，因为接下来的行程，可是马不停蹄的精彩！',
        tips:'别忘了在机场上个厕所！',
        toilet:'机场内免费',
        map:'Keflavik International Airport',
        nextStop:{ type:'drive', text:'🚗 前往 Þórufoss', detail:'约 85 km · 约 70 分钟' } },
      { icon:'🌿', name:'Þórufoss 索鲁瀑布', tags:['瀑布','秘境','《权力游戏》取景地'],
        desc:'隐身于苔藓峡谷中的优雅瀑布，高约18米，因《权力游戏》第四季取景而声名大噪，是初探冰岛的第一道惊喜。',
        deepDesc:'Þórufoss 是冰岛西南部最被低估的瀑布之一，也是许多追剧迷心中的「圣地」——在《权力游戏》第四季中，这里正是「龙母」丹妮莉丝的巨龙卓耿俯冲而下、吞噬山羊的震撼场景。瀑布从约18米高的岩壁倾泻而下，落入被翠绿苔藓覆盖的幽静峡谷，水流不像黄金瀑布那般气势磅礴，却多了一份温柔与诗意。从停车场只需步行5-10分钟即可抵达上方观景台，若想更贴近瀑布，还可以沿着小径下到河边，感受水雾扑面的清凉。对摄影爱好者来说，这里几乎没有观光团的干扰，可以从容构图；对闺蜜或夫妻来说，这座「属于两个人」的瀑布，是冰岛之旅最浪漫的开场白。',
        tips:'步道未设护栏，请勿靠近峡谷边缘。若下至瀑布底部，路面松动湿滑，建议穿防滑鞋。停留约30-45分钟。',
        parking:'免费小型碎石停车场（约容纳5-6台车）。',
        toilet:'无。建议在 KEF 机场或 Mosfellsbær 小镇先解决。',
        map:'Thorufoss Iceland',
        nextStop:{ type:'drive', text:'🚗 前往 Þingvellir', detail:'约 20 km · 约 20 分钟' } },
      { icon:'🏞️', name:'Þingvellir 辛格维利尔国家公园', images:['thingvellir.jpg','thingvellir-alt-1.jpg','thingvellir-alt-2.jpg','thingvellir-alt-3.jpg','thingvellir-alt-4.jpg','thingvellir-alt-5.jpg'], tags:['世界遗产','国家公园','地质奇观'],
        desc:'冰岛最早的露天议会旧址，同时也是北美板块与欧亚板块的交界裂谷带，可沿步道走在两大板块之间。',
        deepDesc:'辛格维利尔于2004年列入世界遗产，素有「世界最古老的民主议会会址」之称——早在公元930年，维京人就曾在这里集会议事，堪称人类民主制度的摇篮。更神奇的是，你脚下踩着的正是北美板块与欧亚板块的交接裂谷，两大陆地每年仍以约2公分的速度缓缓分离。对闺蜜或夫妻来说，手牵手「横跨两大洲」的画面，是这趟旅程最浪漫的打卡姿势之一。',
        tips:'建议安排 1.5–2 小时，主步道平缓适合长辈同行，山风较大请注意保暖。',
        parking:'P1/P2/P5 停车场 1000 ISK（Parka app）；P3 停车场免费。',
        toilet:'游客中心 200 ISK。',
        map:'Thingvellir National Park Iceland',
        nextStop:{ type:'drive', text:'🚗 前往 Brúarfoss', detail:'约 50 km · 约 45 分钟' } },
      { icon:'💎', name:'Brúarfoss 蓝钻石瀑布', images:['bruarfoss.jpg','bruarfoss-alt-1.jpg','bruarfoss-alt-2.jpg','bruarfoss-alt-3.jpg','bruarfoss-alt-4.jpg','bruarfoss-alt-5.jpg'], tags:['瀑布','秘境'],
        desc:'以水色闻名的瀑布，河水因玄武岩地质呈现梦幻蓝绿色，需徒步约 20–30 分钟抵达。',
        deepDesc:'Brúarfoss 被誉为「蓝钻石瀑布」，是冰岛黄金圈一带的隐藏版秘境。河流因流经玄武岩地质，折射出梦幻的蓝绿色调，在阳光下闪烁如碎钻般的光芒。虽然需要步行约20至30分钟才能抵达，但正是这段不长不短的徒步，过滤了大部分观光客，让你和旅伴能独享这片静谧的蓝色奇迹。对闺蜜好友来说，这里是谈心拍照的绝佳地点；对夫妻来说，水声潺潺的私密氛围，比任何高级餐厅都更适合说悄悄话。提醒：这里没有厕所，出发前记得在民宿或超市解决，并带上零食和热饮，在瀑布前来一场野餐。',
        tips:'步道路面不平整，建议穿防滑鞋，可视体力评估是否全程走完。',
        parking:'750 ISK（Parka app），停车场步行约 5 分钟。',
        toilet:'无。',
        map:'Bruarfoss Iceland',
        nextStop:{ type:'drive', text:'🚗 前往 Selfoss 镇超市', detail:'约 45 km · 约 40 分钟' } },
      { icon:'🛒', name:'Selfoss 镇超市采购', tags:['超市','补给'], isShop:true,
        desc:'黄金圈沿线最大的城镇之一，拥有 Bónus、Krónan 等多家超市，是补齐当晚民宿自炊食材的最佳选择。',
        deepDesc:'Selfoss 是冰岛南部黄金圈沿线最热闹的城镇之一，这里的超市选择比偏远地区丰富许多，Bónus（小猪超市）和 Krónan 都有分店，营业时间也相对较长。经过一天的风景洗礼，傍晚时分在这里采买新鲜食材，和旅伴一起规划今晚的民宿菜单——也许是鲑鱼排配温室小番茄、也许是冰岛羊肉汤暖胃，再开一瓶从 KEF 免税店带来的酒。把购物变成旅行仪式的一部分，回到民宿后围着厨房忙进忙出，是冰岛自驾最幸福的时刻之一。',
        tips:'Bónus 营业时间通常 10:00–19:00；Krónan 较长。',
        parking:'超市停车场免费。',
        toilet:'超市内。',
        map:'Bónus Selfoss 或 Krónan Selfoss',
        nextStop:{ type:'drive', text:'🚗 前往民宿', detail:'约 15 km · 约 15 分钟' } }
    ]
  },
  day2: {
    num:'2', dateLabel:'10月5日（周一）', title:'深入黄金圈',
    driveSummary: { total:'约 107 km', time:'约 1小时40分钟（不含景点停留）' },
    hotel:{ name:'South Central Country Apartment 民宿', note:'连住，黄金圈地区', map:'South Central Country Apartment Iceland' },
    spots: [
      { icon:'🐴', name:'Sýðra-Langholt 马场', tags:['冰岛马','互动体验'],
        desc:'近距离接触可爱的冰岛马，亲手抚摸、拍照留念，感受这个国宝级动物的温驯与亲人。',
        deepDesc:'冰岛马是全世界血统最纯净的马种，千年来从未与其他品种混种，体型虽小却强壮温驯，还拥有独特的「五种步伐」——包括一般马匹不具备的「飞跑（tölt）」。Sýðra-Langholt 是黄金圈沿线的亲民马场，不需预约骑乘，也能在近距离与这些毛茸茸的小家伙互动。它们有着蓬松的鬃毛、圆滚滚的眼睛，和好奇心爆棚的个性，几乎会主动靠近你讨摸。对动物爱好者来说，这是「被疗愈」的瞬间；对闺蜜或夫妻来说，与冰岛马同框的合照，绝对是社群媒体上最吸睛的画面之一。记得蹲下来拍，更能凸显它们的萌度！',
        tips:'可自备红萝卜或苹果喂食（但请先询问马场人员），切勿站在马后方。停留约 30 分钟。',
        parking:'马场旁免费停车',
        toilet:'无',
        map:'Sýðra-Langholt Horse Farm',
        nextStop:{ type:'drive', text:'🚗 前往 Geysir', detail:'约 20 km · 约 20 分钟' } },
      { icon:'💦', name:'Geysir 盖锡尔地热区', images:['geysir.jpg','geysir-alt-1.jpg','geysir-alt-2.jpg','geysir-alt-3.jpg','geysir-alt-4.jpg','geysir-alt-5.jpg'], tags:['地热','喷泉'],
        desc:'区内的 Strokkur 间歇泉每隔数分钟便会喷发一次，水柱可高达十余米，周边还有多处地热池。',
        deepDesc:'盖锡尔间歇泉曾是世界上最壮观的间歇泉，喷发时高度可达60至80米，气势惊人。虽然因人为因素造成阻塞，目前大盖锡尔已停止喷发，但其壮阔的历史仍深植人心。一旁的斯特罗柯间歇泉（Strokkur）虽然无法与昔日大盖锡尔相比拟，但每隔5至10分钟便会规律喷发，水柱直冲天际的瞬间依然令人屏息。对第一次来冰岛的旅人来说，站在弥漫着硫磺气息的地热区，看着滚烫的水柱从地底冲出，那种「大地在呼吸」的震撼感，绝对是黄金圈最难忘的记忆之一。建议和旅伴轮流录影，才能同时捕捉到喷发的壮观与彼此惊喜的表情。',
        tips:'喷发前常有水汽随风飘散，建议站在下风处等候。',
        parking:'1000 ISK（Parka app）；部分资料亦称免费，建议现场确认。',
        toilet:'游客中心内免费，环境不错。旁边有 N1 加油站。',
        map:'Geysir Iceland',
        nextStop:{ type:'drive', text:'🚗 前往 Gullfoss', detail:'约 10 km · 约 10 分钟' } },
      { icon:'🌊', name:'Gullfoss 黄金瀑布', images:['gullfoss.jpg','gullfoss-alt-1.jpg','gullfoss-alt-2.jpg','gullfoss-alt-3.jpg','gullfoss-alt-4.jpg','gullfoss-alt-5.jpg'], tags:['瀑布','必访'],
        desc:'冰岛最具代表性的瀑布之一，河水分两层跌入峡谷，水量丰沛气势磅礴，晴天时常见彩虹。',
        deepDesc:'古佛斯黄金瀑布（Gullfoss）是黄金圈名称的由来，也是冰岛最具代表性的自然奇观之一。倾泻而下的瀑布溅起的水珠弥漫在天空，在阳光照射下形成道道彩虹，仿佛整个瀑布是用金子锻造成的，景象瑰丽无比，令游客流连忘返。当你站在观景台上，看着冰川融水从两层断崖奔腾而下，发出雷鸣般的轰响，那种被大自然震慑的感觉，会让你瞬间理解为什么当年有人不惜牺牲一切也要保护这座瀑布不被水力发电厂破坏。对夫妻来说，这里是「壮阔」与「浪漫」的绝佳交会点；对闺蜜来说，在彩虹前拍一张背影合照，绝对是朋友圈的点赞保证。',
        tips:'上、下两层观景台都值得走，木栈道靠近瀑布处湿滑，请留意脚下。',
        parking:'1000 ISK（Parka app）；部分资料亦称免费，建议现场确认。',
        toilet:'游客中心内。',
        map:'Gullfoss Iceland',
        nextStop:{ type:'drive', text:'🚗 前往 Faxi 瀑布', detail:'约 24 km · 约 20 分钟' } },
      { icon:'💧', name:'Faxi 瀑布', tags:['瀑布','免健行','秘境'],
        desc:'黄金圈隐藏版瀑布，河面宽阔、水流平缓，车停好走1分钟即可抵达，免健行也能拍到美照。',
        deepDesc:'Faxi 瀑布（又名 Vatnsleysufoss）是黄金圈路线上最被低估的秘境之一。不同于黄金瀑布的气势磅礴，Faxi 以宽阔的河面与多层次的阶梯状水流著称，在阳光下闪烁着柔和的光泽。最棒的是，它几乎「零门槛」——把车停好，步行不到1分钟就能站在瀑布前，完全不需要登山或徒步。对带着长辈或不想走太多路的旅人来说，这是「懒人版瀑布」的完美选择；对摄影爱好者来说，开阔的视野与平缓的水流，反而更容易捕捉到如丝绸般的长曝光画面。建议顺游，15分钟快闪即可收获一张令人惊艳的风景照。',
        tips:'瀑布边缘湿滑，拍照时请留意脚下。停留约 15 分钟。',
        parking:'约 900 ISK（现场缴费）',
        toilet:'有（停车场附近）',
        map:'Faxi Waterfall Iceland',
        nextStop:{ type:'drive', text:'🚗 前往 Friðheimar 番茄农场', detail:'约 10 km · 约 10 分钟' } },
      { icon:'🍅', name:'Friðheimar 番茄农场', tags:['温室农场','特色午餐','地热'],
        desc:'利用冰岛火山地热种植番茄的温室农场，享用现摘番茄制作的浓汤与现烤面包，是黄金圈最温暖的味蕾惊喜。',
        deepDesc:'Friðheimar 是冰岛黄金圈最独特的「餐桌上的温室」——在这座由火山地热供暖的巨大玻璃屋里，一年四季都种植着鲜红饱满的番茄。走进温室，空气中弥漫着番茄藤蔓的清新香气，阳光穿透玻璃洒落在绿意盎然的植株上，仿佛误闯了一座北欧版的秘密花园。这里的招牌「无限量番茄浓汤」以现摘番茄熬制，酸甜浓郁，搭配新鲜出炉的现烤面包与香草小黄瓜，简单却让人难以忘怀。更特别的是，餐厅内部被番茄植株环绕，你甚至能一边用餐、一边看蜜蜂在温室中穿梭授粉。对美食型旅人来说，这是「从产地到餐桌」的极致体验；对闺蜜或夫妻来说，在绿意与暖光中共享一顿慢午餐，是这趟旅程最温馨的记忆之一。',
        tips:'建议提前预约，用餐时间约 1.5 小时。温室内温暖，可脱外套。每日营业 11:30–16:00（建议确认）。',
        parking:'农场停车场免费',
        toilet:'农场内有',
        map:'Fridheimar Tomato Farm',
        nextStop:{ type:'drive', text:'🚗 前往 Kerið', detail:'约 28 km · 约 25 分钟' } },
      { icon:'🌀', name:'Kerið 火山口湖', images:['kerid.jpg','kerid-alt-1.jpg','kerid-alt-2.jpg','kerid-alt-3.jpg','kerid-alt-4.jpg','kerid-alt-5.jpg'], tags:['火山口','湖泊'],
        desc:'约三千年历史的火山口湖，湖水呈蓝绿色，四周是红褐色火山岩壁，可沿边缘步道俯瞰全景。',
        deepDesc:'Kerið 火山口湖形成于约三千年前的一次火山喷发，是冰岛最上镜的火山口湖之一。湖水因矿物质沉淀呈现梦幻的蓝绿色，与四周红褐色的火山岩壁形成强烈对比，色彩饱和度之高，让人怀疑是否真实。环湖步道仅需15至20分钟即可走完，不同角度的光线会让湖面呈现截然不同的色调。',
        tips:'入口处需支付小额门票，环湖步道全程约 15–20 分钟。',
        parking:'600 ISK（现场机器缴费，含门票）；另有资料称 800 ISK。',
        toilet:'有。',
        map:'Kerid Crater Iceland',
        nextStop:null }
    ]
  },
  day3: {
    num:'3', dateLabel:'10月6日（周二）', title:'南岸经典',
    driveSummary: { total:'约 100 km', time:'约 85 分钟（不含景点停留）' },
    hotel:{ name:'Lakeview Cabin 民宿', note:'南岸地区，湖景小屋，有机会观赏极光', map:'Lakeview Cabin Iceland' },
    spots: [
      { icon:'💧', name:'Seljalandsfoss', img:'seljalandsfoss.jpg', tags:['瀑布','可走入水帘后'],
        desc:'知名度极高的瀑布，游客可沿步道走到水帘后方洞穴，从背面欣赏瀑布独特视角。',
        deepDesc:'Seljalandsfoss 是冰岛少数可以「走到水帘后方」的瀑布，也是南岸最经典的打卡点之一。当你沿着湿滑的步道绕到瀑布背面，从洞穴内向外望去，水幕如纱帘般垂挂，阳光穿透时折射出迷离的光晕，彷佛置身于精灵的居所。务必穿防水外套，手机相机也要做好防水保护。',
        tips:'水帘后方步道湿滑且水花大，建议穿防水外套并留意随身物品防水。',
        parking:'900–1000 ISK（现场机器/Parka app）。',
        toilet:'200 ISK，环境一般。',
        map:'Seljalandsfoss Iceland',
        nextStop:{ type:'drive', text:'🚗 前往 Skógafoss', detail:'约 30 km · 约 25 分钟' } },
      { icon:'🏔️', name:'Skógafoss', img:'skogafoss.jpg', tags:['瀑布','登高观景'],
        desc:'宽阔壮观的悬崖瀑布，天气晴朗时常见彩虹，瀑布一侧有阶梯可登顶俯瞰南岸海岸线。',
        deepDesc:'Skógafoss 宽约25米、高约60米，是冰岛最壮观的瀑布之一。由于水量丰沛且水雾弥漫，只要阳光角度对了，几乎保证能看到双彩虹甚至三彩虹。瀑布右侧有一条527阶的铁梯，登顶后可俯瞰南岸海岸线的辽阔景色。传说中，维京人曾在瀑布后方的洞穴中藏了宝藏，至今无人找到。',
        tips:'阶梯较长较陡，可视体力选择只在瀑布正面拍照，无需登顶。',
        parking:'1000 ISK（Parka app），部分游客称可选择不缴。',
        toilet:'停车场免费厕所，维护不错。',
        map:'Skogafoss Iceland',
        nextStop:{ type:'drive', text:'🚗 前往 Vík 镇超市', detail:'约 30 km · 约 25 分钟' } },
      { icon:'🛒', name:'Vík 镇超市采购', tags:['超市','补给'], isShop:true,
        desc:'Vík 是南岸最后一个较大的补给站，建议在此采购食物与饮水，往东之后的补给点非常有限。',
        tips:'建议顺道加油，Vík 之后的加油站较少，油价也会较贵。',
        map:'Bonus Vik Iceland',
        nextStop:{ type:'drive', text:'🚗 前往 Dyrhólaey', detail:'约 5 km · 约 5 分钟' } },
      { icon:'🐦', name:'Dyrhólaey 岬角', tags:['海角','观景台'],
        desc:'南岸的海角地标，视野极佳，可远眺黑沙滩与海蚀拱门，夏季亦是海鸚聚集地。',
        deepDesc:'Dyrhólaey 是南岸的最高点，也是俯瞰黑沙滩与海蚀拱门的绝佳观景台。站在岬角边缘，左手边是无尽的黑色沙滩与白色浪花，右手边是壮观的海蚀拱门（据说船只可以从拱门下穿越），远方则是瓦特纳冰川的白色轮廓。即使10月已过了海鸚季，这里的辽阔与孤绝感，依然让人感到「世界尽头」的诗意。',
        tips:'部分道路在恶劣天气或鸟类繁殖期会封闭，出发前建议查看当日开放状况。',
        parking:'750 ISK（Parka app）。',
        toilet:'下层停车场有，200 ISK。',
        map:'Dyrholaey Iceland',
        nextStop:{ type:'drive', text:'🚗 前往 Reynisfjara 黑沙滩', detail:'约 10 km · 约 10 分钟' } },
      { icon:'⚫', name:'Reynisfjara 黑沙滩', img:'reynisfjara.jpg', tags:['黑沙滩','玄武岩柱'],
        desc:'著名黑沙滩，拥有壮观玄武岩柱与海蚀洞，但此处海浪暗流强劲，是全岛知名危险海岸之一。',
        deepDesc:'Reynisfjara 黑沙滩被《国家地理》杂志评为世界十大最美沙滩之一，也是无数科幻电影的取景地。黑色火山沙粒在白色浪花中翻腾，岸边的玄武岩柱如同管风琴般排列。但这片美丽的背后隐藏着危险——这里的「sneaker waves」来得无声无息，曾多次将靠近海岸的游客卷入海中。',
        tips:'务必远离海浪线，不要背对大海拍照，留意现场警示牌。',
        parking:'1000 ISK（Parka app）。',
        toilet:'游客中心与餐厅内。',
        map:'Reynisfjara Black Sand Beach',
        nextStop:null }
    ],
    drives:[
      { from:'Seljalandsfoss', to:'Skógafoss', dist:'约 30 km', time:'约 25 分钟' },
      null,
      null,
      { from:'Vík 镇', to:'Dyrhólaey', dist:'约 5 km', time:'约 5 分钟' },
      { from:'Dyrhólaey', to:'Reynisfjara', dist:'约 10 km', time:'约 10 分钟' }
    ]
  },
  day4: {
    num:'4', dateLabel:'10月7日（周三）', title:'冰川徒步',
    driveSummary: { total:'约 30 km', time:'约 30 分钟（不含景点停留）' },
    hotel:{ name:'Lakeview Cabin 民宿', note:'连住，南岸湖景小屋', map:'Lakeview Cabin Iceland' },
    spots: [
      { icon:'🧊', name:'Blue Ice Cave 蓝冰洞', img:'blue-ice-cave.jpg', tags:['冰洞','需向导'],
        desc:'需由专业向导带领进入的冰川冰洞，洞壁呈现罕见蓝色冰晶纹理，是冰岛独有体验之一。',
        deepDesc:'加入一场难忘的冒险，前往瓦特纳冰川——欧洲最大的冰川。行程从 Troll base（霍夫/Hof）出发，乘车15分钟前往冰川停车场，再步行15分钟抵达冰川。约2小时探索 Falljökull 冰川，穿越深裂缝，发现随季节变化的独特冰层结构，并进入天然形成的蓝冰洞。回到集合点后可享用免费热饮和糖果棒暖身。',
        tips:'请携带保暖衣物、手套与防滑鞋；需提前预订行程。',
        parking:'跟团集合点停车。',
        toilet:'无。',
        map:'Troll Expeditions Skaftafel',
        nextStop:{ type:'drive', text:'🚗 前往 Jökulsárlón', detail:'约 15 km · 约 15 分钟' } },
      { icon:'🚤', name:'Jökulsárlón 冰河湖', img:'jokulsarlon.jpg', tags:['冰河湖','可搭船'],
        desc:'冰岛最著名冰河湖，大块浮冰缓缓漂向出海口，湖光与冰山相映，可报名搭船近距离观赏。',
        deepDesc:'傑古沙龍冰河湖是冰岛最大、最著名的冰河湖，湖底深达200公尺，也是冰岛的第二大深湖。你可以报名搭乘水陆两栖船，在冰山之间穿梭，聆听导游讲解每座冰山的年龄与故事；也可以只是在岸边静静坐着，看海豹偶尔探出头来。这里是《古墓奇兵》、《蝙蝠侠：开战时刻》及007系列电影的取景地。',
        tips:'建议安排充足拍照时间，湖边风大且气温偏低，请注意保暖。',
        parking:'1000 ISK（Parka app）。',
        toilet:'游客中心或咖啡馆，200 ISK。',
        map:'Jokulsarlon Glacier Lagoon',
        nextStop:{ type:'walk', text:'🚶 步行前往 Diamond Beach', detail:'约 1 km · 约 10 分钟（过桥即达）' } },
      { icon:'💠', name:'Diamond Beach 钻石海滩', img:'diamond-beach.jpg', tags:['黑沙滩','浮冰'],
        desc:'与冰河湖相邻的黑沙滩，被海浪冲上岸的透明浮冰散落沙滩，在阳光下犹如钻石点点。',
        deepDesc:'钻石沙滩与冰河湖只隔一条马路，却呈现截然不同的梦境。瓦特纳冰川融化崩解之后，大大小小的冰块从傑古龍冰河湖中顺着水道被带到海上，再被海浪冲上岸边，放眼望去就像一颗颗镶嵌在黑沙滩上的巨大钻石。透明的冰块在黑色火山沙的衬托下，闪烁着蓝白色的光芒，日出与日落时分尤其梦幻。',
        tips:'冰块表面湿滑，不建议攀爬冰块拍照，靠近海浪处请留意安全。2025年起取消单独收费。',
        parking:'与冰河湖停车场通用，2025年起取消单独收费。',
        toilet:'无。',
        map:'Diamond Beach Iceland',
        nextStop:null }
    ],
    drives:[
      { from:'Blue Ice Cave（集合点）', to:'Jökulsárlón', dist:'约 15 km', time:'约 15 分钟' },
      null,
      null
    ]
  },
  day5: {
    num:'5', dateLabel:'10月8日（周四）', title:'雷克雅未克 + 蓝湖',
    hotel:{ name:'Garður Apartments 民宿', note:'Garður 地区公寓式民宿，邻近蓝湖与机场', map:'Gardur Apartments Iceland' },
    isHelsinki: true,
    areas: [
      {
        label:'大教堂 · Hallgrímskirkja',
        spots: [
          { icon:'⛪', name:'Hallgrímskirkja 大教堂', img:'hallgrimskirkja.jpg', tags:['地标','建筑地标'],
            desc:'雷克雅未克的地标教堂，外形仿冰岛玄武岩柱设计，是这座城市最醒目的地标建筑。',
            deepDesc:'哈尔格林姆教堂是雷克雅未克的地标，也是冰岛最大的教堂。它的外形设计灵感来自冰岛的玄武岩柱，塔身高达74.5米，从任何角度看都像是从地底生长出来的管风琴。站在教堂正门前的广场，能完整拍下教堂对称的立面与门口的莱夫·埃里克松雕像。对建筑爱好者来说，这是北欧现代主义与自然形态的完美结合；对闺蜜来说，白色阶梯前也是「City Walk 起点打卡」的绝佳位置。',
            tips:'今天会走一圈路线A、路线B再折返回这里，届时可以入内参观教堂内部；正确导航请搜「Hallgrímskirkja 主入口」，避免定位到教堂后方或侧门。',
            parking:'教堂周边。',
            toilet:'教堂内免费。',
            map:'Hallgrimskirkja Reykjavik',
            nextStop:{ type:'walk', text:'🚶 沿彩虹街下坡（路线A）', detail:'约 5 分钟' } }
        ]
      },
      {
        label:'去程路线A · 彩虹街 → 主街 → Grandi 旧港区',
        spots: [
          { icon:'🌈', name:'Skólavörðustígur 彩虹街', tags:['购物街','去程','下坡'], isShop:true,
            desc:'从教堂正门沿彩虹步道下坡，两侧设计小店、咖啡馆。',
            map:'Skolavordustigur Reykjavik',
            nextStop:{ type:'walk', text:'🚶 前往 Handknitting', detail:'约 2 分钟' } },
          { icon:'🧶', name:'Handknitting Association of Iceland', tags:['羊毛毛衣','伴手礼'], isShop:true,
            desc:'传统圆肩花纹手工毛衣，防水保暖，每件挂编织者亲笔签名，约 23,000–44,000 ISK。',
            map:'Handknitting Association of Iceland',
            nextStop:{ type:'walk', text:'🚶 前往 Geysir 服饰店', detail:'约 1 分钟' } },
          { icon:'🧣', name:'Geysir 服饰店', tags:['羊毛制品','伴手礼'], isShop:true,
            desc:'冰岛羊毛制品（帽/手套/围巾），有时尚设计款，比 Lopapeysa 毛衣平价。',
            map:'Geysir Reykjavik shop',
            nextStop:{ type:'walk', text:'🚶 前往 Laugavegur 主街', detail:'约 8 分钟' } },
          { icon:'🛍️', name:'Laugavegur 主街', tags:['购物街','去程'], isShop:true,
            desc:'雷克雅未克最热闹的购物街。',
            map:'Laugavegur Reykjavik',
            nextStop:{ type:'walk', text:'🚶 前往 Omnom 巧克力', detail:'约 2 分钟' } },
          { icon:'🍫', name:'Omnom 巧克力', tags:['巧克力','伴手礼'], isShop:true,
            desc:'冰岛精品巧克力，创意口味（海盐、甘草、焦糖）。',
            map:'Omnom Chocolate Laugavegur',
            nextStop:{ type:'walk', text:'🚶 前往 66°North / Farmers Market', detail:'约 2 分钟' } },
          { icon:'🧥', name:'66°North / Farmers Market', tags:['户外品牌','羊毛制品'], isShop:true,
            desc:'户外机能品牌、冰岛羊毛制品。',
            map:'66 North Laugavegur',
            nextStop:{ type:'walk', text:'🚶 前往 Puffin 周边店', detail:'约 2 分钟' } },
          { icon:'🐧', name:'Puffin 海鹦周边', tags:['纪念品','亲子伴手礼'], isShop:true,
            desc:'冰岛国鸟玩偶、磁铁、明信片，适合送孩童。',
            map:'Puffin Store Laugavegur',
            nextStop:{ type:'walk', text:'🚶 前往 Saltverk', detail:'约 2 分钟' } },
          { icon:'🧂', name:'Saltverk 火山岩/熔岩盐', tags:['火山盐','伴手礼'], isShop:true,
            desc:'火山地热蒸发制成，黑火山盐、烟熏盐，包装具北欧设计感。',
            map:'Saltverk Reykjavik',
            nextStop:{ type:'walk', text:'🚶 前往 Grandi 旧港区', detail:'约 10 分钟' } },
          { icon:'⚓', name:'Grandi 旧港区', tags:['旧港区','去程','海滨'], isShop:true,
            desc:'往海滨方向前进，仓库改建的文创小区。',
            map:'Grandi Reykjavik',
            nextStop:{ type:'walk', text:'🚶 前往 Omnom 工厂店', detail:'约 3 分钟' } },
          { icon:'🍫', name:'Omnom 巧克力（工厂店）', tags:['巧克力工厂店','试吃'], isShop:true,
            desc:'可试吃，创意口味（海盐、甘草、焦糖）。',
            map:'Omnom Chocolate Factory Grandi',
            nextStop:{ type:'walk', text:'🚶 前往 Farmers Market', detail:'约 3 分钟' } },
          { icon:'🧣', name:'Farmers Market（旧港分店）', tags:['羊毛制品'], isShop:true,
            desc:'冰岛羊毛制品，比 Lopapeysa 毛衣平价。',
            map:'Farmers Market Grandi',
            nextStop:{ type:'walk', text:'🚶 前往蓝湖保养品店', detail:'约 3 分钟' } },
          { icon:'🧴', name:'蓝湖保养品（Blue Lagoon Skincare）', tags:['保养品','伴手礼'], isShop:true,
            desc:'矽土面膜、身体乳等，富含地热矿物质，机场价格与市区相近。',
            map:'Blue Lagoon Skincare Grandi',
            nextStop:{ type:'walk', text:'🚶 前往 Harpa 音乐厅', detail:'约 10 分钟' } }
        ]
      },
      {
        label:'音乐厅 · Harpa',
        spots: [
          { icon:'🎭', name:'Harpa 音乐厅', img:'harpa.jpg', tags:['建筑亮点','拍照打卡'],
            desc:'外观以蜂巢状玄武岩造型玻璃幕墙为特色的音乐厅，随光线变化呈现不同色彩，是热门拍照景点。',
            deepDesc:'Harpa 音乐厅是雷克雅未克最现代的建筑地标，外观由丹麦艺术家与建筑师共同设计，蜂巢状的玻璃幕墙灵感来自冰岛的玄武岩柱。白天，阳光穿透玻璃在室内投下斑斓的光影；夜晚，建筑外墙会被点亮成不同的色彩。大厅内部免费开放，即使不听音乐会，也值得进来感受这座建筑的几何之美。对闺蜜来说，这里是「高级感大片」的产地；对夫妻来说，在音乐厅内静静坐一会，是给快节奏的行程一个温柔的喘息。记得到地下一层上个免费厕所，雷市区内的免费厕所可是稀有资源。',
            tips:'部分公共区域可免费入内参观，也可留意当日是否有音乐会。',
            parking:'地下停车库较贵，建议路边停车或步行前往。',
            toilet:'地下一层免费，宽敞明亮。',
            map:'Harpa Reykjavik',
            nextStop:{ type:'walk', text:'🚶 沿 Grandi 旧港区折返（路线B）', detail:'约 10 分钟' } }
        ]
      },
      {
        label:'回程路线B · Grandi → 主街 → 彩虹街 → 返回大教堂',
        spots: [
          { icon:'⚓', name:'Grandi 旧港区', tags:['旧港区','回程'], isShop:true,
            desc:'沿旧港区步行，回程可补买去程还没决定的商品。',
            map:'Grandi Reykjavik',
            nextStop:{ type:'walk', text:'🚶 前往 Omnom 工厂店', detail:'约 3 分钟' } },
          { icon:'🍫', name:'Omnom 巧克力（工厂店）', tags:['巧克力工厂店','回程'], isShop:true,
            desc:'可试吃，创意口味（海盐、甘草、焦糖）。',
            map:'Omnom Chocolate Factory Grandi',
            nextStop:{ type:'walk', text:'🚶 前往 Farmers Market', detail:'约 3 分钟' } },
          { icon:'🧣', name:'Farmers Market（旧港分店）', tags:['羊毛制品','回程'], isShop:true,
            desc:'冰岛羊毛制品，比 Lopapeysa 毛衣平价。',
            map:'Farmers Market Grandi',
            nextStop:{ type:'walk', text:'🚶 前往蓝湖保养品店', detail:'约 3 分钟' } },
          { icon:'🧴', name:'蓝湖保养品（Blue Lagoon Skincare）', tags:['保养品','回程'], isShop:true,
            desc:'矽土面膜、身体乳等，富含地热矿物质。',
            map:'Blue Lagoon Skincare Grandi',
            nextStop:{ type:'walk', text:'🚶 前往 Laugavegur 主街', detail:'约 8 分钟' } },
          { icon:'🛍️', name:'Laugavegur 主街', tags:['购物街','回程'], isShop:true,
            desc:'穿越雷克雅未克最热闹的购物街。',
            map:'Laugavegur Reykjavik',
            nextStop:{ type:'walk', text:'🚶 前往 Omnom 巧克力', detail:'约 2 分钟' } },
          { icon:'🍫', name:'Omnom 巧克力', tags:['巧克力','回程'], isShop:true,
            desc:'冰岛精品巧克力，创意口味（海盐、甘草、焦糖）。',
            map:'Omnom Chocolate Laugavegur',
            nextStop:{ type:'walk', text:'🚶 前往 66°North / Farmers Market', detail:'约 2 分钟' } },
          { icon:'🧥', name:'66°North / Farmers Market', tags:['户外品牌','回程'], isShop:true,
            desc:'户外机能品牌、冰岛羊毛制品。',
            map:'66 North Laugavegur',
            nextStop:{ type:'walk', text:'🚶 前往 Puffin 周边店', detail:'约 2 分钟' } },
          { icon:'🐧', name:'Puffin 海鹦周边', tags:['纪念品','回程'], isShop:true,
            desc:'冰岛国鸟玩偶、磁铁、明信片，适合送孩童。',
            map:'Puffin Store Laugavegur',
            nextStop:{ type:'walk', text:'🚶 前往 Saltverk', detail:'约 2 分钟' } },
          { icon:'🧂', name:'Saltverk 火山岩/熔岩盐', tags:['火山盐','回程'], isShop:true,
            desc:'火山地热蒸发制成，黑火山盐、烟熏盐。',
            map:'Saltverk Reykjavik',
            nextStop:{ type:'walk', text:'🚶 前往彩虹街', detail:'约 10 分钟' } },
          { icon:'🌈', name:'Skólavörðustígur 彩虹街', tags:['购物街','回程','上坡'], isShop:true,
            desc:'沿彩虹步道上坡，两侧设计小店、咖啡馆。',
            map:'Skolavordustigur Reykjavik',
            nextStop:{ type:'walk', text:'🚶 前往 Handknitting', detail:'约 2 分钟' } },
          { icon:'🧶', name:'Handknitting Association of Iceland', tags:['羊毛毛衣','回程'], isShop:true,
            desc:'传统圆肩花纹手工毛衣，防水保暖。',
            map:'Handknitting Association of Iceland',
            nextStop:{ type:'walk', text:'🚶 前往 Geysir 服饰店', detail:'约 1 分钟' } },
          { icon:'🧣', name:'Geysir 服饰店', tags:['羊毛制品','回程'], isShop:true,
            desc:'冰岛羊毛制品（帽/手套/围巾），有时尚设计款。',
            map:'Geysir Reykjavik shop',
            nextStop:{ type:'walk', text:'🚶 回到大教堂', detail:'约 5 分钟' } },
          { icon:'⛪', name:'重返 Hallgrímskirkja 大教堂', tags:['地标','终点'], isShop:true,
            desc:'路线B的终点：入内参观教堂内部、拍摄教堂外观与雕像，为这段City Walk画下句点。',
            map:'Hallgrimskirkja Reykjavik',
            nextStop:{ type:'drive', text:'🚗 前往 Blue Lagoon 蓝湖', detail:'约 50 km · 约 45 分钟' } }
        ]
      },
      {
        label:'Blue Lagoon 蓝湖温泉',
        spots: [
          { icon:'♨️', name:'Blue Lagoon 蓝湖温泉', img:'blue-lagoon.jpg', tags:['地热温泉','SPA'],
            desc:'世界知名地热温泉 SPA，乳白蓝色温泉水富含矽土与矿物质，据说对皮肤有舒缓效果。',
            deepDesc:'蓝湖温泉是冰岛最著名的「放松仪式」。有趣的是，蓝湖并非天然温泉，而是人为地热池——邻近的 Svartsengi 地热发电厂将地下热水抽取至地表发电后，排出的高温含矿废水流入熔岩区的低洼地，经年累月积聚形成这片温泉池，多孔的玄武岩天然过滤了水中杂质。乳白色的湖水也不是色素造成，而是水中的二氧化矽与藻类让阳光散射，短波长的蓝光被反射、长波长的红光被吸收，形成从乳白到深蓝层次变化的独特色泽，与冰岛蓝冰洞的「蓝」是同样的光学原理。水温常年维持在37至39度，即使外面风雪交加，泡在温暖的蓝湖中依然舒适无比。温泉区提供矽土面膜，敷着面膜、喝着冰沙、和朋友聊天，是北欧式「慢活」的极致体验——矽土能舒缓软化肌肤，水中的硫、钙、镁等矿物质则有助于放松肌肉、促进血液循环。',
            tips:'门票分 Comfort（含门票、矽泥面膜、毛巾、一杯饮品）、Premium（加浴袍拖鞋、两款面膜、两杯饮品）、Signature（再加一套居家保养品）三个等级，建议提前在官网预订。矿物质水会让头发变得极度干涩，进池前务必涂抹大量护发素；隐形眼镜不建议佩戴，改戴眼镜或闭眼享受。冰岛温泉规定入池前需裸身淋浴。',
            parking:'温泉区停车场免费。',
            toilet:'温泉区内。务必导航「Blue Lagoon Iceland」，勿搜中文「蓝湖」以免误导至废弃地热厂区。',
            map:'Blue Lagoon Iceland',
            nextStop:null }
        ]
      }
    ]
  },
  day6: {
    num:'6', dateLabel:'10月9日（周五）', title:'前往芬兰', transit:true,
    flights:[
      { airline:'芬兰航空', flightNo:'AY992', from:'凯夫拉维克 KEF', to:'赫尔辛基万塔 HEL', dep:'08:35', arr:'15:00', duration:'约3小时25分', date:'10月9日' }
    ],
    hotel:{ name:'Hilton Helsinki Airport', note:'赫尔辛基机场希尔顿酒店，抵达后入住，交通便利', map:'Hilton Helsinki Airport' }
  },
  day7: {
    num:'7', dateLabel:'10月10日（周六）', title:'芬兰人的一天',
    hotel:{ name:'飞机上', note:'当晚搭乘深夜航班返港（AY099，00:35起飞）' },
    isHelsinki: true,
    areas: [
      {
        label:'A区 · 白教堂周边',
        spots: [
          { icon:'🚉', name:'中央车站', tags:['交通枢纽','建筑'], isShop:true,
            desc:'赫尔辛基中央车站，绿色新艺术风格钟楼，门口两座巨型石像守护，是城市漫游的出发点。',
            tips:'建议在车站附近购买一日电车票，方便后续各区移动。',
            map:'Helsinki Central Station',
            nextStop:{ type:'walk', text:'🚶 步行前往白教堂', detail:'约 10 分钟' } },
          { icon:'⛪', name:'赫尔辛基大教堂（白教堂）', img:'helsinki-cathedral.jpg', tags:['地标','参议院广场'],
            desc:'矗立在参议院广场高处的白色新古典主义教堂，是赫尔辛基最具代表性的地标建筑之一。',
            deepDesc:'赫尔辛基大教堂位于市中心参议院广场上，建于1830年，属于新古典主义风格，上方有一个大绿色圆顶，周围是四个小圆顶，小圆顶是模仿圣彼得堡的圣以薩大教堂设计，上方还有12位圣徒雕像。教堂同时也是赫尔辛基大学神学院的礼堂，经常举行婚礼等特别活动。坐在白色阶梯上，看着广场上来来往往的芬兰人，这个以「沉默」闻名的民族，在这座纯白教堂前显得格外从容。',
            tips:'教堂前白色阶梯是热门拍照点，内部通常免费开放参观。',
            map:'Helsinki Cathedral',
            nextStop:{ type:'walk', text:'🚶 步行前往市集广场（B区）', detail:'约 5 分钟' } },
          { icon:'🏛️', name:'参议院广场 & Aleksanterinkatu 精品街', tags:['广场','购物'], isShop:true,
            desc:'亚历山大二世雕像与教堂对称构图，旁边 Aleksanterinkatu 精品街有 Moomin 商店、Marimekko、Iittala 设计小店。',
            tips:'Moomin 商店有丰富的芬兰姆明周边，是亲子伴手礼首选。',
            map:'Senate Square Helsinki',
            nextStop:{ type:'walk', text:'🚶 步行前往市集广场', detail:'约 5 分钟' } }
        ]
      },
      {
        label:'B区 · 市集广场周边',
        spots: [
          { icon:'🐟', name:'市集广场 Market Square', img:'market-square-helsinki.jpg', tags:['港边市集','当地美食'],
            desc:'紧邻港口码头的传统市集，可品尝当地小吃与新鲜渔获，也能选购手工艺品与纪念品。',
            deepDesc:'赫尔辛基市集广场紧邻港口，是感受芬兰人日常生活最直接的窗口。攤販们販售新鲜渔获、漿果、野菇、手工肥皂和羊毛制品，空气中弥漫着烟熏鲑鱼和肉桂卷的香气。建议和旅伴买一份「鲑鱼汤配黑麵包」站在岸边吃，看着往来的渡轮与海鸥，体验最道地的北欧市集氛围。',
            tips:'营业摊位数量依季节与天气调整，建议先查询当日是否营业。',
            map:'Market Square Helsinki',
            nextStop:{ type:'walk', text:'🚶 步行前往老农贸市场', detail:'约 2 分钟' } },
          { icon:'🏛️', name:'老农贸市场（Vanha Kauppahalli）', tags:['美食','午餐'], isShop:true,
            desc:'红砖建筑内部，建议在此享用午餐：品尝芬兰鱼汤、烟熏鲑鱼、驯鹿肉罐头等传统美食。',
            tips:'建议预留约40分钟在此用餐，鱼汤配黑麵包是招牌组合。',
            map:'Vanha Kauppahalli Helsinki',
            nextStop:{ type:'walk', text:'🚶 步行前往 Havis Amanda 喷泉', detail:'约 2 分钟' } },
          { icon:'🗿', name:'哈维斯·阿曼达喷泉', tags:['地标'], isShop:true,
            desc:'裸女青铜雕像，芬兰最著名地标之一，位于市集广场一隅，是赫尔辛基的象征性雕塑。',
            map:'Havis Amanda Helsinki',
            nextStop:{ type:'walk', text:'🚶 步行前往旧港海滨（C区）', detail:'约 3 分钟' } }
        ]
      },
      {
        label:'C区 · 海滨周边',
        spots: [
          { icon:'🌊', name:'旧港海滨步道', tags:['散步','海景'], isShop:true,
            desc:'沿南港散步，眺望波罗的海与渡轮，感受赫尔辛基的海港城市氛围。',
            map:'South Harbour Helsinki',
            nextStop:{ type:'walk', text:'🚶 步行前往乌斯佩斯基大教堂', detail:'约 5 分钟' } },
          { icon:'🔴', name:'乌斯佩斯基大教堂（红教堂）', img:'uspenski-cathedral.jpg', tags:['东正教','地标'],
            desc:'红砖绿尖塔、东正教洋葱圆顶，站在平台可眺望白教堂，是赫尔辛基「红白双教堂」同框的绝佳地点。',
            deepDesc:'乌斯佩斯基大教堂是北欧最大的东正教教堂，建于1868年。红砖外墙配上绿色洋葱圆顶，与白色的赫尔辛基大教堂形成强烈对比。站在教堂前的平台上，可以同时将白教堂与港口尽收眼底，是拍摄赫尔辛基「双教堂同框」最经典的角度。',
            tips:'教堂通常免费开放参观，请留意开放时间。',
            map:'Uspenski Cathedral Helsinki',
            nextStop:{ type:'walk', text:'🚶 步行前往爱之桥', detail:'约 5 分钟' } },
          { icon:'💕', name:'爱之桥', tags:['爱情锁','打卡'], isShop:true,
            desc:'桥栏布满爱情锁，桥上可远眺红白双教堂同框，是浪漫打卡胜地。',
            map:'Love Lock Bridge Helsinki',
            nextStop:{ type:'tram', text:'🚋 搭电车前往岩石教堂（D区）', detail:'约 15 分钟' } }
        ]
      },
      {
        label:'D区 · 岩石教堂',
        spots: [
          { icon:'🪨', name:'岩石教堂（Temppeliaukio Church）', img:'temppeliaukio-church.jpg', tags:['地标','岩洞教堂'],
            desc:'北欧唯一岩洞教堂，铜制圆顶、天然岩壁、天窗光线洒落，建筑直接从天然岩石中开凿而成。',
            deepDesc:'岩石教堂是北欧唯一一座岩洞教堂，也是赫尔辛基最具特色的建筑之一。教堂直接从天然岩石中开凿而成，内部保留原始的岩壁纹理，上方覆盖着巨大的铜制圆顶。阳光透过天窗洒落，在岩壁上形成温暖的光晕，让整个空间既庄严又亲近自然。这里也是热门的音乐会场地，绝佳的音响效果让每一场演出都成为难忘的体验。',
            tips:'门票约 5 欧元，周一休。建议上午或下午造访，避开正午团客高峰。',
            map:'Temppeliaukio Church Helsinki',
            nextStop:{ type:'tram', text:'🚋 搭电车前往 Allas Sea Pool（E区）', detail:'约 15 分钟' } }
        ]
      },
      {
        label:'E区 · Allas Sea Pool',
        spots: [
          { icon:'🏊', name:'Allas Sea Pool', img:'allas-sea-pool.jpg', tags:['海景泳池','桑拿'],
            desc:'位于港边的海景泳池综合设施，包含海水池、淡水池与传统桑拿房，可一边泡水一边眺望港湾。',
            deepDesc:'Allas Sea Pool 是赫尔辛基近年最热门的「海边生活」据点，包含温水淡水池（27°C）、海水池与传统芬兰桑拿。最经典的体验是：在桑拿房里蒸到满身大汗，然后直接冲进冰冷的海水池中——这种「冰火两重天」的冲击，是芬兰人保持身心健康的秘密。即使10月气温已低，温水池依然舒适，而且可以一边泡水一边眺望港湾与教堂，景色无敌。',
            tips:'需付费入场，建议自备泳装与毛巾，现场也提供租借服务。',
            map:'Allas Sea Pool Helsinki',
            nextStop:{ type:'walk', text:'🚶 步行前往中央车站', detail:'约 5 分钟，深夜乘机返港' } }
        ]
      }
    ]
  },
  day8: {
    num:'8', dateLabel:'10月10日（周六）深夜 → 10月11日（周日）', title:'返程', transit:true,
    flights:[
      { airline:'芬兰航空', flightNo:'AY099', from:'赫尔辛基万塔 HEL', to:'香港 HKG', dep:'00:35', arr:'17:10', duration:'约9小时35分', date:'10月11日', note:'10月10日行程结束后深夜航班' }
    ],
    note:'10月10日为「芬兰人的一天」行程，当晚无需住宿，深夜航班返港；10月11日傍晚抵达香港。'
  }
};
