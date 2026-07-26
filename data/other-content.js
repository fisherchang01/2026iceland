// 「工具」頁完整正式版：六個分類全部套用北歐旅行手札視覺。
// 外部网站与现场规定可能变动，出发前及使用当下应再核对最新资讯。
const OTHER_HTML = `
<style id="other-editorial-style">
  #page-other {
    --forest: #315f67;
    --forest-deep: #21484f;
  }
  #page-other .travel-banner.tool-hero {
    --editorial-hero-image: url('images/banners/cover-hero.webp');
    background-image:
      radial-gradient(circle at 76% 16%, rgba(120,220,194,.24) 0 4%, transparent 22%),
      radial-gradient(circle at 30% 6%, rgba(148,181,255,.22) 0 5%, transparent 27%),
      linear-gradient(180deg, rgba(8,24,34,.16) 0%, rgba(13,37,48,.40) 45%, rgba(10,25,32,.88) 100%),
      var(--editorial-hero-image);
    background-position: center;
  }
  #page-other .catalog-overview-card:first-child {
    background:
      radial-gradient(circle at 87% 20%, rgba(74,132,143,.22) 0 16%, transparent 38%),
      linear-gradient(135deg, #fdfaf3, #e3edef);
    border-color: #bdd0d3;
  }
  .tool-open-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-height: 36px;
    margin-top: 10px;
    padding: 7px 12px;
    border: 1px solid #b9cbd0;
    border-radius: 999px;
    background: #e9f1f2;
    color: #315f67;
    font-size: var(--fs-xs);
    font-weight: 800;
    cursor: pointer;
  }
  .tool-status-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0,1fr));
    gap: 8px;
    margin-top: 12px;
  }
  .tool-status {
    padding: 10px 7px;
    border: 1px solid #c8d7d9;
    border-radius: 13px;
    background: #edf4f3;
    text-align: center;
  }
  .tool-status strong {
    display: block;
    font-family: var(--font-display);
    font-size: var(--fs-lg);
    color: #315f67;
  }
  .tool-status small {
    display: block;
    margin-top: 3px;
    color: var(--muted-ink);
    font-size: var(--fs-2xs);
    line-height: 1.35;
  }
  .tool-callout {
    margin-top: 12px;
    padding: 11px 13px;
    border-left: 4px solid #4b7c84;
    border-radius: 0 12px 12px 0;
    background: #eaf1f1;
    color: #3c565c;
    font-size: var(--fs-xs);
    line-height: 1.6;
  }
  .tool-mini-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0,1fr));
    gap: 10px;
    margin: 12px 0;
  }
  .tool-mini-card {
    min-height: 118px;
    padding: 15px;
    border: 1px solid #cad7d8;
    border-radius: 17px;
    background: linear-gradient(145deg, #fffdf8, #e8f0ef);
    box-shadow: 0 6px 14px rgba(51,75,78,.08);
  }
  .tool-mini-card strong {
    display: block;
    margin: 7px 0 5px;
    font-family: var(--font-display);
    font-size: var(--fs-base);
    color: var(--ink);
  }
  .tool-mini-card p {
    margin: 0;
    color: var(--muted-ink);
    font-size: var(--fs-xs);
    line-height: 1.5;
  }
  .tool-big-icon {
    font-size: 1.65rem;
  }
  .tool-documents-live {
    min-height: 0;
    margin-top: 12px;
  }
  .tool-safety {
    border-color: #d9c4ad !important;
    background: linear-gradient(180deg, rgba(255,255,255,.65), transparent 32%), #fbf1e3 !important;
  }
  @media (max-width: 380px) {
    .tool-status-grid { grid-template-columns: 1fr; }
  }
</style>

<div class="page" id="page-other">
  <div class="page-inner">

    <section class="travel-banner editorial-hero tool-hero">
      <div class="editorial-hero-copy">
        <div class="editorial-kicker">Field Tools · Iceland</div>
        <h2>把复杂留给工具</h2>
        <p>极光、加油、厕所与旅行文件，全部改成现场可快速判断的步骤与入口。</p>
      </div>
      <div class="editorial-hero-actions">
        <button type="button" onclick="selectCatalogCategory('other',0)"><span>✦</span>今晚极光</button>
        <button type="button" onclick="selectCatalogCategory('other',3)"><span>⛽</span>沿途加油</button>
        <button type="button" onclick="selectCatalogCategory('other',5)"><span>▤</span>旅行文件</button>
      </div>
    </section>

    <!-- 1. 极光查询 -->
    <div class="travel-collapse">
      <div class="travel-collapse-header" onclick="toggleTravelCollapse(this)">
        <div class="travel-collapse-left">
          <div class="travel-collapse-emoji">🌌</div>
          <div>
            <div class="travel-collapse-title">极光查询</div>
            <div class="travel-collapse-sub">云量 · 黑暗程度 · 极光活动</div>
          </div>
        </div>
        <div class="travel-collapse-arrow">▼</div>
      </div>
      <div class="travel-collapse-body">

        <div class="souvenir-card editorial-feature-card">
          <div class="souvenir-img-wrap editorial-illustration"><div class="img-fallback">🌌</div></div>
          <div class="souvenir-info">
            <h4>今晚有没有机会看到极光？</h4>
            <div class="souvenir-shop">判断顺序：云层空隙 → 天色够暗 → 极光活动</div>
            <div class="souvenir-desc">不要只看 KP 数字。即使极光活动不错，厚云也会完全挡住天空；先找无云或少云区域，再判断是否值得外出等待。</div>
            <div class="tool-status-grid">
              <div class="tool-status"><strong>①</strong><small>先看云量</small></div>
              <div class="tool-status"><strong>②</strong><small>确认黑暗</small></div>
              <div class="tool-status"><strong>③</strong><small>再看活动</small></div>
            </div>
          </div>
          <div class="editorial-action-row"><span>☁ 云量</span><span>✦ 极光活动</span><span>⌁ 地点比较</span></div>
        </div>

        <div class="souvenir-item">
          <div class="souvenir-img-wrap small editorial-illustration"><div class="img-fallback">☁</div></div>
          <div class="souvenir-item-info">
            <h4>Icelandic Met Office</h4>
            <p>把极光活动与云量图放在同一页面查看，适合作为今晚是否出发的第一站。</p>
            <span class="souvenir-brand">重点：低云／中云／高云与无云空隙</span>
            <button class="tool-open-btn" type="button" onclick="event.stopPropagation();window.open('https://en.vedur.is/weather/forecasts/aurora/','_blank')">打开极光预报 ↗</button>
          </div>
        </div>

        <div class="souvenir-item">
          <div class="souvenir-img-wrap small editorial-illustration"><div class="img-fallback">☀</div></div>
          <div class="souvenir-item-info">
            <h4>SpaceWeatherLive</h4>
            <p>适合进一步观察太阳风、Bz 与极光活动变化；不熟悉数据时仍以云量和现场天空为主。</p>
            <span class="souvenir-brand">进阶参考：太阳风与磁场方向</span>
            <button class="tool-open-btn" type="button" onclick="event.stopPropagation();window.open('https://www.spaceweatherlive.com/en/auroral-activity/aurora-forecast.html','_blank')">打开活动资料 ↗</button>
          </div>
        </div>

        <div class="souvenir-item">
          <div class="souvenir-img-wrap small editorial-illustration"><div class="img-fallback">🌬</div></div>
          <div class="souvenir-item-info">
            <h4>Windy 云层变化</h4>
            <p>用时间轴观察住宿附近及周边区域的云层移动，判断继续等待或换地点是否合理。</p>
            <span class="souvenir-brand">重点：未来一至三小时云层移动</span>
            <button class="tool-open-btn" type="button" onclick="event.stopPropagation();window.open('https://www.windy.com/','_blank')">打开 Windy ↗</button>
          </div>
        </div>

        <div class="info-card editorial-note">
          <h4>60 秒判断法</h4>
          <ol class="editorial-steps">
            <li>先看住宿与周边一小时车程内有没有明显云层空隙</li>
            <li>确认天色已经够暗，且附近灯光不会直接照向天空</li>
            <li>再看极光活动是否有机会，不把 KP 当作唯一标准</li>
            <li>走到户外让眼睛适应黑暗，并用手机夜间模式测试天空</li>
          </ol>
          <div class="tool-callout">预报是帮助选择时间与方向，不是保证。现场云况、安全停车与天气变化永远优先。</div>
        </div>

      </div>
    </div>

    <!-- 2. 寻找极光 -->
    <div class="travel-collapse">
      <div class="travel-collapse-header" onclick="toggleTravelCollapse(this)">
        <div class="travel-collapse-left">
          <div class="travel-collapse-emoji">🧭</div>
          <div>
            <div class="travel-collapse-title">寻找极光</div>
            <div class="travel-collapse-sub">避开光害 · 找云缝 · 安全停车</div>
          </div>
        </div>
        <div class="travel-collapse-arrow">▼</div>
      </div>
      <div class="travel-collapse-body">

        <div class="souvenir-card editorial-feature-card">
          <div class="souvenir-img-wrap editorial-illustration"><div class="img-fallback">🧭</div></div>
          <div class="souvenir-info">
            <h4>从住宿出发的找光流程</h4>
            <div class="souvenir-shop">不用追得远，先找最近的黑暗与云层空隙</div>
            <div class="souvenir-desc">先在住宿外确认天空，再决定是否移动。很多时候换到附近较暗、视野较开的地点，就比长距离追逐更有效率。</div>
            <div class="souvenir-tip">夜间路况、强风、结冰与安全停车点比极光强度更重要。</div>
          </div>
          <div class="editorial-action-row"><span>◐ 光害</span><span>☁ 云缝</span><span>Ⓟ 安全停车</span></div>
        </div>

        <div class="souvenir-item">
          <div class="souvenir-img-wrap small editorial-illustration"><div class="img-fallback">◐</div></div>
          <div class="souvenir-item-info">
            <h4>Light Pollution Map</h4>
            <p>查看城市与道路周边光害，选择面向较暗区域、视野开阔的方向。</p>
            <span class="souvenir-brand">用途：比较住宿附近的黑暗程度</span>
            <button class="tool-open-btn" type="button" onclick="event.stopPropagation();window.open('https://www.lightpollutionmap.info/','_blank')">打开光害地图 ↗</button>
          </div>
        </div>

        <div class="souvenir-item">
          <div class="souvenir-img-wrap small editorial-illustration"><div class="img-fallback">✦</div></div>
          <div class="souvenir-item-info">
            <h4>Hello Aurora</h4>
            <p>可作为现场目击与社群回报的补充参考，但仍需核对回报时间、距离与当地云况。</p>
            <span class="souvenir-brand">用途：观察附近是否有人目击</span>
            <button class="tool-open-btn" type="button" onclick="event.stopPropagation();window.open('https://hello-aurora.com/','_blank')">打开目击资讯 ↗</button>
          </div>
        </div>

        <div class="souvenir-item">
          <div class="souvenir-img-wrap small editorial-illustration"><div class="img-fallback">🛡</div></div>
          <div class="souvenir-item-info">
            <h4>SafeTravel Iceland</h4>
            <p>移动前先查看天气、道路与旅行安全提醒。看到极光也不代表适合继续开往更远地点。</p>
            <span class="souvenir-brand">用途：确认是否适合夜间移动</span>
            <button class="tool-open-btn" type="button" onclick="event.stopPropagation();window.open('https://safetravel.is/','_blank')">打开安全资讯 ↗</button>
          </div>
        </div>

        <div class="info-card editorial-note tool-safety">
          <h4>安全找光 5 原则</h4>
          <ol class="editorial-steps">
            <li>先在住宿外看天空，不为追光立刻长途驾驶</li>
            <li>只停在正式停车区、观景点或足够宽阔的安全位置</li>
            <li>不要停在公路边、弯道、坡顶或看不清来车的位置</li>
            <li>下车前确认强风方向，开门时牢牢握住车门</li>
            <li>随时保留返回住宿的体力与路况余裕</li>
          </ol>
        </div>

      </div>
    </div>

    <!-- 3. 极光摄影 -->
    <div class="travel-collapse">
      <div class="travel-collapse-header" onclick="toggleTravelCollapse(this)">
        <div class="travel-collapse-left">
          <div class="travel-collapse-emoji">📷</div>
          <div>
            <div class="travel-collapse-title">极光摄影</div>
            <div class="travel-collapse-sub">iPhone 13 Pro Max · 夜间模式 · 构图</div>
          </div>
        </div>
        <div class="travel-collapse-arrow">▼</div>
      </div>
      <div class="travel-collapse-body">

        <div class="souvenir-card editorial-feature-card">
          <div class="souvenir-img-wrap editorial-illustration"><div class="img-fallback">📱</div></div>
          <div class="souvenir-info">
            <h4>iPhone 13 Pro Max 极光拍摄</h4>
            <div class="souvenir-shop">稳定手机 · 开启夜间模式 · 降低曝光亮度</div>
            <div class="souvenir-desc">最重要的是稳定。先把手机靠在固定物或脚架上，让夜间模式获得更长曝光，再用前景增加画面层次。</div>
            <div class="souvenir-tip">肉眼只看到淡淡灰白时，手机夜间模式仍可能拍出绿色；先试拍再判断。</div>
          </div>
          <div class="editorial-action-row"><span>▣ 稳定</span><span>☾ 夜间模式</span><span>⌁ 前景构图</span></div>
        </div>

        <div class="tool-mini-grid">
          <div class="tool-mini-card"><span class="tool-big-icon">🤳</span><strong>手持临时拍</strong><p>身体靠稳、双手夹紧手机，使用较短夜间曝光，连拍几张挑最清楚的一张。</p></div>
          <div class="tool-mini-card"><span class="tool-big-icon"> tripod </span><strong>脚架认真拍</strong><p>固定手机并避免触碰，可让夜间模式自动延长曝光，细节与色彩更完整。</p></div>
        </div>

        <div class="info-card editorial-note">
          <h4>拍摄前设置</h4>
          <ol class="editorial-steps">
            <li>开启相机格线，方便保持地平线与安排前景</li>
            <li>需要后期调整时，可在设置中确认 Apple ProRAW</li>
            <li>准备脚架、手机夹与可遥控快门的方式</li>
            <li>低温环境下把备用电源贴身保暖，避免电量快速下降</li>
          </ol>
        </div>

        <div class="info-card editorial-note">
          <h4>现场拍摄 6 步骤</h4>
          <ol class="editorial-steps">
            <li>使用 1× 主镜头，先不要数码变焦</li>
            <li>固定手机后等待夜间模式图标出现</li>
            <li>点按远处亮点或地平线附近，再长按锁定对焦与曝光</li>
            <li>把画面亮度稍微往下调，避免天空变灰、极光失去层次</li>
            <li>使用倒数快门，按下后不要碰手机</li>
            <li>检查星点是否清楚；若拖线明显，缩短曝光或重新固定</li>
          </ol>
          <div class="editorial-chips"><span>1× 主镜头</span><span>夜间模式</span><span>脚架</span><span>倒数快门</span><span>前景剪影</span></div>
        </div>

      </div>
    </div>

    <!-- 4. 加油工具 -->
    <div class="travel-collapse">
      <div class="travel-collapse-header" onclick="toggleTravelCollapse(this)">
        <div class="travel-collapse-left">
          <div class="travel-collapse-emoji">⛽</div>
          <div>
            <div class="travel-collapse-title">加油工具</div>
            <div class="travel-collapse-sub">找油站 · 确认油号 · 自助付款</div>
          </div>
        </div>
        <div class="travel-collapse-arrow">▼</div>
      </div>
      <div class="travel-collapse-body">

        <div class="souvenir-card editorial-feature-card">
          <div class="souvenir-img-wrap editorial-illustration"><div class="img-fallback">⛽</div></div>
          <div class="souvenir-info">
            <h4>自驾加油｜把油量、地点与付款一起看</h4>
            <div class="souvenir-shop">先确认租车油号，再选择顺路油站</div>
            <div class="souvenir-desc">不要等到油量过低才找油站。进入较偏远路段前，看到顺路且方便进出的油站即可提早补充。</div>
            <div class="souvenir-tip">部分自助设备可能需要信用卡 PIN，并可能先进行额度圈存；保留一张可用的实体卡。</div>
          </div>
          <div class="editorial-action-row"><span>⌖ 找油站</span><span>▤ 看油号</span><span>💳 付款</span></div>
        </div>

        <div class="market-grid">
          <div class="market-card">
            <span class="market-icon">N1</span>
            <h4>N1</h4>
            <span class="market-tag">沿途搜寻</span>
            <p>用地图查看路线附近分站与进出方向。</p>
            <button class="tool-open-btn" type="button" onclick="event.stopPropagation();window.open('https://www.google.com/maps/search/?api=1&query=N1+Iceland','_blank')">地图搜寻 ↗</button>
          </div>
          <div class="market-card">
            <span class="market-icon">O</span>
            <h4>Orkan</h4>
            <span class="market-tag">自助油站</span>
            <p>适合顺路补油，现场先确认油枪与付款步骤。</p>
            <button class="tool-open-btn" type="button" onclick="event.stopPropagation();window.open('https://www.google.com/maps/search/?api=1&query=Orkan+Iceland','_blank')">地图搜寻 ↗</button>
          </div>
          <div class="market-card">
            <span class="market-icon">OB</span>
            <h4>ÓB</h4>
            <span class="market-tag">快速补油</span>
            <p>以地图选择顺路地点，不为特定品牌绕远。</p>
            <button class="tool-open-btn" type="button" onclick="event.stopPropagation();window.open('https://www.google.com/maps/search/?api=1&query=OB+gas+station+Iceland','_blank')">地图搜寻 ↗</button>
          </div>
          <div class="market-card">
            <span class="market-icon">A</span>
            <h4>Atlantsolía</h4>
            <span class="market-tag">路线比较</span>
            <p>与其他油站一起比较距离、方向与进出便利性。</p>
            <button class="tool-open-btn" type="button" onclick="event.stopPropagation();window.open('https://www.google.com/maps/search/?api=1&query=Atlantsolia+Iceland','_blank')">地图搜寻 ↗</button>
          </div>
        </div>

        <div class="info-card editorial-note">
          <h4>自助加油 6 步骤</h4>
          <ol class="editorial-steps">
            <li>先查看油箱盖、租车资料或车内标签，确认正确油号</li>
            <li>停妥车辆、熄火并确认油箱盖位于哪一侧</li>
            <li>按设备指示插卡、输入 PIN，并选择金额或加满方式</li>
            <li>确认油枪标示后再开始加油，不凭颜色猜油号</li>
            <li>完成后挂回油枪、取卡并保留收据或拍照记录</li>
            <li>查看仪表油量是否更新，再离开加油区</li>
          </ol>
          <div class="tool-callout">若设备操作不确定，优先选择有人值守的油站或请现场人员协助，不要反复刷卡造成多次圈存。</div>
        </div>

      </div>
    </div>

    <!-- 5. 厕所资讯 -->
    <div class="travel-collapse">
      <div class="travel-collapse-header" onclick="toggleTravelCollapse(this)">
        <div class="travel-collapse-left">
          <div class="travel-collapse-emoji">🚻</div>
          <div>
            <div class="travel-collapse-title">厕所资讯</div>
            <div class="travel-collapse-sub">加油站 · 超市 · 游客中心 · 景区</div>
          </div>
        </div>
        <div class="travel-collapse-arrow">▼</div>
      </div>
      <div class="travel-collapse-body">

        <div class="souvenir-card editorial-feature-card">
          <div class="souvenir-img-wrap editorial-illustration"><div class="img-fallback">🚻</div></div>
          <div class="souvenir-info">
            <h4>在冰岛找厕所｜记住最可靠的地点类型</h4>
            <div class="souvenir-shop">加油站 · 超市商场 · 咖啡厅 · 游客中心 · 主要景区</div>
            <div class="souvenir-desc">看到合适地点就使用，不要等到非常紧急才开始寻找。部分设施可能收费、需要消费或只在营业时间开放。</div>
            <div class="souvenir-tip">长途移动前、离开城镇前与进入偏远路段前，固定安排一次厕所与补水。</div>
          </div>
          <div class="editorial-action-row"><span>⌖ 附近搜寻</span><span>⛽ 加油站</span><span>ⓘ 游客中心</span></div>
        </div>

        <div class="tool-mini-grid">
          <div class="tool-mini-card"><span class="tool-big-icon">⛽</span><strong>加油站</strong><p>通常最容易与加油、饮料和休息同时处理；是否开放与收费以现场为准。</p></div>
          <div class="tool-mini-card"><span class="tool-big-icon">🏬</span><strong>超市／商场</strong><p>适合在采购时一并使用，但厕所位置可能在公共区域或服务台附近。</p></div>
          <div class="tool-mini-card"><span class="tool-big-icon">☕</span><strong>咖啡厅／餐厅</strong><p>用餐或消费时顺便使用，进入前可先礼貌询问。</p></div>
          <div class="tool-mini-card"><span class="tool-big-icon">ⓘ</span><strong>游客中心／景区</strong><p>主要景点较容易找到，但偏远停车点不一定有设施。</p></div>
        </div>

        <div class="souvenir-item">
          <div class="souvenir-img-wrap small editorial-illustration"><div class="img-fallback">⌖</div></div>
          <div class="souvenir-item-info">
            <h4>Google Maps：附近公共厕所</h4>
            <p>搜寻结果可能包含营业时间错误或非公共设施，抵达前仍要查看近期评论与现场标示。</p>
            <span class="souvenir-brand">搜寻词：public toilet / restroom / WC</span>
            <button class="tool-open-btn" type="button" onclick="event.stopPropagation();window.open('https://www.google.com/maps/search/?api=1&query=public+toilet+Iceland','_blank')">打开地图搜寻 ↗</button>
          </div>
        </div>

        <div class="info-card editorial-note">
          <h4>急用寻找顺序</h4>
          <ol class="editorial-steps">
            <li>先看最近的加油站、超市或游客中心</li>
            <li>若在景区，寻找停车场、服务中心或咖啡厅标示</li>
            <li>进入店家前先礼貌询问，必要时消费使用</li>
            <li>不要进入私人土地、民宅或没有开放的设施</li>
          </ol>
          <div class="editorial-chips"><span>离城前先去</span><span>顺便补水</span><span>准备零钱或卡片</span><span>不依赖单一地点</span></div>
        </div>

      </div>
    </div>

    <!-- 6. 旅行文件 -->
    <div class="travel-collapse">
      <div class="travel-collapse-header" onclick="toggleTravelCollapse(this)">
        <div class="travel-collapse-left">
          <div class="travel-collapse-emoji">📁</div>
          <div>
            <div class="travel-collapse-title">旅行文件</div>
            <div class="travel-collapse-sub">航班 · 租车 · 住宿 · 门票 · 保险</div>
          </div>
        </div>
        <div class="travel-collapse-arrow">▼</div>
      </div>
      <div class="travel-collapse-body">

        <div class="souvenir-card editorial-feature-card">
          <div class="souvenir-img-wrap editorial-illustration"><div class="img-fallback">📁</div></div>
          <div class="souvenir-info">
            <h4>旅行文件｜现场只需要找到正确版本</h4>
            <div class="souvenir-shop">离线可看 · 分类清楚 · 关键号码可复制</div>
            <div class="souvenir-desc">文件页不追求资料越多越好，而是让机场、租车柜台、住宿入住与紧急状况下，可以在最短时间找到正确文件。</div>
            <div class="souvenir-tip">重要文件同时保留手机离线版、云端版与一份同行者可取得的备份。</div>
          </div>
          <div class="editorial-action-row"><span>✈ 航班</span><span>🚗 租车</span><span>⌂ 住宿</span></div>
        </div>

        <div class="tool-mini-grid">
          <div class="tool-mini-card"><span class="tool-big-icon">✈</span><strong>航班与转机</strong><p>电子机票、行李额度、转机路线与航空公司联络方式。</p></div>
          <div class="tool-mini-card"><span class="tool-big-icon">🚗</span><strong>租车与保险</strong><p>订单、驾驶人资料、保险范围、取还车与道路救援号码。</p></div>
          <div class="tool-mini-card"><span class="tool-big-icon">⌂</span><strong>住宿确认</strong><p>地址、入住方式、门锁密码、停车说明与房东联络方式。</p></div>
          <div class="tool-mini-card"><span class="tool-big-icon">🎟</span><strong>门票与预约</strong><p>蓝湖、活动、餐厅或其他有时段限制的预约凭证。</p></div>
          <div class="tool-mini-card"><span class="tool-big-icon">🛡</span><strong>证件与保险</strong><p>护照影本、签证、旅游保险、紧急医疗与报案资料。</p></div>
          <div class="tool-mini-card"><span class="tool-big-icon">☎</span><strong>紧急联络</strong><p>同行者、租车公司、住宿、保险与信用卡挂失资讯。</p></div>
        </div>

        <div class="info-card editorial-note">
          <h4>文件整理规则</h4>
          <ol class="editorial-steps">
            <li>档名先放日期与用途，例如「1002_香港飞新加坡」</li>
            <li>同一订单只保留最新版，旧版本移出旅行资料夹</li>
            <li>把订单编号、地址与电话写在文件首页或备注</li>
            <li>出发前开启飞航模式，确认关键文件仍可离线查看</li>
          </ol>
          <div class="editorial-chips"><span>离线可看</span><span>档名统一</span><span>同行者备份</span><span>关键号码可复制</span></div>
        </div>

        <!-- 保留旅行文件渲染挂载点，现有 docs-content.js / render-docs.js 可继续使用 -->
        <div class="tool-documents-live" id="docsList"></div>

      </div>
    </div>

  </div>
</div>
`;
