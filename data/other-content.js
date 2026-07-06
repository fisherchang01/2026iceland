// 「其他」頁籤的完整 HTML 內容，可直接編輯下方 HTML 標籤來調整文字、新增或刪除項目
const OTHER_HTML = `
<div class="page" id="page-other">
  <div class="page-inner">

    <!-- 5.1 冰岛极光查询 -->
    <div class="travel-collapse">
      <div class="travel-collapse-header" onclick="toggleTravelCollapse(this)">
        <div class="travel-collapse-left">
          <div class="travel-collapse-emoji">🌌</div>
          <div>
            <div class="travel-collapse-title">冰岛极光查询</div>
            <div class="travel-collapse-sub">极光季 9月–3月 · 最佳时间 22:00–03:00</div>
          </div>
        </div>
        <div class="travel-collapse-arrow">▼</div>
      </div>
      <div class="travel-collapse-body">
        <div class="tips-box"><p>📌 极光季节：9月至3月｜最佳观赏时间：22:00–03:00｜关键条件：KP指数 ≥ 2 + 天空无云（云层覆盖低）+ 远离光害</p></div>
        <a class="link-card" href="https://en.vedur.is/weather/forecasts/aurora/" target="_blank" rel="noopener">
          <div class="link-icon">🇮🇸</div>
          <div class="link-info"><h4>Vedur.is（冰岛气象局）</h4><p>官方最权威，提供极光预报 + 云层覆盖图</p></div>
        </a>
        <a class="link-card" href="https://auroraforecast.is" target="_blank" rel="noopener">
          <div class="link-icon">🌠</div>
          <div class="link-info"><h4>AuroraForecast.is</h4><p>民间极光预报，视觉化界面</p></div>
        </a>
        <a class="link-card" href="https://auroravision.net" target="_blank" rel="noopener">
          <div class="link-icon">🔭</div>
          <div class="link-info"><h4>AuroraVision.is</h4><p>即时极光能见度评分，整合 KP 指数、云量、太阳风</p></div>
        </a>
        <div class="travel-sub-collapse">
          <div class="travel-sub-header" onclick="toggleSubCollapse(this)">
            <span class="travel-sub-title">📱 更多查询工具（App / 备用网站）</span>
            <span class="travel-sub-arrow">▼</span>
          </div>
          <div class="travel-sub-body">
            <div style="font-size:0.78rem;color:var(--text);line-height:1.8;">
              <div style="padding:4px 0;border-bottom:1px solid var(--border-light);">📲 Hello Aurora（App）— App Store / Google Play，极光出现前 20–90 分钟推播提醒</div>
              <div style="padding:4px 0;border-bottom:1px solid var(--border-light);">🛰️ NOAA SWPC — swpc.noaa.gov，美国太空天气预测中心，全球极光 30 分钟预报</div>
              <div style="padding:4px 0;">🌤️ Veðrið（冰岛官方天气 App）— App Store / Google Play，风力、降雪、极端天气预警，更新频率高</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 5.2 如何找极光 -->
    <div class="travel-collapse">
      <div class="travel-collapse-header" onclick="toggleTravelCollapse(this)">
        <div class="travel-collapse-left">
          <div class="travel-collapse-emoji">🔦</div>
          <div>
            <div class="travel-collapse-title">如何找极光</div>
            <div class="travel-collapse-sub">五步骤实战指南</div>
          </div>
        </div>
        <div class="travel-collapse-arrow">▼</div>
      </div>
      <div class="travel-collapse-body">
        <div class="travel-sub-collapse">
          <div class="travel-sub-header" onclick="toggleSubCollapse(this)">
            <span class="travel-sub-title">① 确认极光季节</span>
            <span class="travel-sub-arrow">▼</span>
          </div>
          <div class="travel-sub-body">
            <p style="font-size:0.8rem;color:var(--sub);line-height:1.7;">时间范围：9月至3月。10月属于极光季初期，天气相对稳定，是适合观赏的时段。</p>
          </div>
        </div>
        <div class="travel-sub-collapse">
          <div class="travel-sub-header" onclick="toggleSubCollapse(this)">
            <span class="travel-sub-title">② 确认当日条件</span>
            <span class="travel-sub-arrow">▼</span>
          </div>
          <div class="travel-sub-body">
            <p style="font-size:0.8rem;color:var(--sub);line-height:1.7;">KP 指数 ≥ 2（冰岛位于极光带内，即使 KP 1–2 也有机会看到）；云层覆盖低（无云或薄云）；远离光害（市区灯光会大幅降低可见度）。</p>
          </div>
        </div>
        <div class="travel-sub-collapse">
          <div class="travel-sub-header" onclick="toggleSubCollapse(this)">
            <span class="travel-sub-title">③ 选择观测地点</span>
            <span class="travel-sub-arrow">▼</span>
          </div>
          <div class="travel-sub-body">
            <p style="font-size:0.8rem;color:var(--sub);line-height:1.7;">雷市市区：Grótta Island Lighthouse（约4km，海岸线开阔）；南岸住宿：Lakeview Cabin 远离市区光害，可直接于民宿外守候；黄金圈/南岸沿途：任何远离公路灯光的开阔地。</p>
          </div>
        </div>
        <div class="travel-sub-collapse">
          <div class="travel-sub-header" onclick="toggleSubCollapse(this)">
            <span class="travel-sub-title">④ 使用工具辅助</span>
            <span class="travel-sub-arrow">▼</span>
          </div>
          <div class="travel-sub-body">
            <p style="font-size:0.8rem;color:var(--sub);line-height:1.7;">预报网站：Vedur.is、AuroraForecast.is；即时推播：Hello Aurora App（极光出现前 20–90 分钟主动提醒）；天气确认：Veðrið App（风力、降雪、极端天气预警）。</p>
          </div>
        </div>
        <div class="travel-sub-collapse">
          <div class="travel-sub-header" onclick="toggleSubCollapse(this)">
            <span class="travel-sub-title">⑤ 现场等待</span>
            <span class="travel-sub-arrow">▼</span>
          </div>
          <div class="travel-sub-body">
            <p style="font-size:0.8rem;color:var(--sub);line-height:1.7;">最佳时段：22:00–03:00；准备：保暖衣物、热饮、三脚架、相机/手机；耐心：极光可能短暂出现，也可能持续数小时，需有心理准备。</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 5.3 iPhone 拍极光攻略 -->
    <div class="travel-collapse">
      <div class="travel-collapse-header" onclick="toggleTravelCollapse(this)">
        <div class="travel-collapse-left">
          <div class="travel-collapse-emoji">📷</div>
          <div>
            <div class="travel-collapse-title">iPhone 拍极光攻略</div>
            <div class="travel-collapse-sub">设定 · 拍摄 · 后期调色</div>
          </div>
        </div>
        <div class="travel-collapse-arrow">▼</div>
      </div>
      <div class="travel-collapse-body">
        <div class="tips-box"><p>📌 前置准备：三脚架（长曝光必备，手持会晃）｜充电宝（低温耗电快）</p></div>
        <div class="travel-sub-collapse">
          <div class="travel-sub-header" onclick="toggleSubCollapse(this)">
            <span class="travel-sub-title">① 相机设定</span>
            <span class="travel-sub-arrow">▼</span>
          </div>
          <div class="travel-sub-body">
            <p style="font-size:0.8rem;color:var(--sub);line-height:1.7;">设定路径：「设定」→「相机」→「格式」→ 选「高效」→ 开启「ProRAW」。</p>
          </div>
        </div>
        <div class="travel-sub-collapse">
          <div class="travel-sub-header" onclick="toggleSubCollapse(this)">
            <span class="travel-sub-title">② 拍摄模式选择</span>
            <span class="travel-sub-arrow">▼</span>
          </div>
          <div class="travel-sub-body">
            <p style="font-size:0.8rem;color:var(--sub);line-height:1.7;">开启原相机「夜间模式」（周围无光时自动出现月亮图示）；将手机固定于三脚架后，曝光时间会自动出现「30s」选项（手持最高仅3–10秒）；点击对焦后，将曝光时间拉至最长（MAX 30s）；对准极光，按下快门，静待30秒曝光完成。</p>
          </div>
        </div>
        <div class="travel-sub-collapse">
          <div class="travel-sub-header" onclick="toggleSubCollapse(this)">
            <span class="travel-sub-title">③ 手动参数调整（若支援）</span>
            <span class="travel-sub-arrow">▼</span>
          </div>
          <div class="travel-sub-body">
            <p style="font-size:0.8rem;color:var(--sub);line-height:1.7;">快门：10–30秒（极光强时可缩短至5秒）；ISO：800–1600；对焦：无限远（∞）或手动对准远方星星；白平衡：3500K（冷色调，维持极光清透感）；焦距：1倍主镜头最清晰。</p>
          </div>
        </div>
        <div class="travel-sub-collapse">
          <div class="travel-sub-header" onclick="toggleSubCollapse(this)">
            <span class="travel-sub-title">④ 拍摄技巧</span>
            <span class="travel-sub-arrow">▼</span>
          </div>
          <div class="travel-sub-body">
            <p style="font-size:0.8rem;color:var(--sub);line-height:1.7;">可同时开启「萤幕录影」记录拍摄过程；极光大爆发时，iPhone 甚至可手持拍 Live Photo / 影片；若找不到「夜间模式」图示，表示环境不够暗，请移动至更无光害处。</p>
          </div>
        </div>
        <div class="travel-sub-collapse">
          <div class="travel-sub-header" onclick="toggleSubCollapse(this)">
            <span class="travel-sub-title">⑤ 后期调色建议</span>
            <span class="travel-sub-arrow">▼</span>
          </div>
          <div class="travel-sub-body">
            <p style="font-size:0.8rem;color:var(--sub);line-height:1.7;">曝光 -15｜鲜明度 +20｜高光 -30｜阴影 +25｜对比度 +30｜色温 -10｜自然饱和度 +29</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 5.4 加油省钱 -->
    <div class="travel-collapse">
      <div class="travel-collapse-header" onclick="toggleTravelCollapse(this)">
        <div class="travel-collapse-left">
          <div class="travel-collapse-emoji">⛽</div>
          <div>
            <div class="travel-collapse-title">加油省钱</div>
            <div class="travel-collapse-sub">雷市及南部海岸线</div>
          </div>
        </div>
        <div class="travel-collapse-arrow">▼</div>
      </div>
      <div class="travel-collapse-body">
        <a class="link-card" href="https://gasvaktin.is" target="_blank" rel="noopener">
          <div class="link-icon">⛽</div>
          <div class="link-info"><h4>Gasvaktin</h4><p>冰岛即时油价比价网站</p></div>
        </a>
        <div class="tips-box"><p>📌 离开雷市前加满油，越偏远越贵｜自助加油需国际信用卡（PIN码）｜油量低于一半即补充｜N1 加油站为南部常见连锁，亦提供简易超商</p></div>
        <div class="station-grid">
          <div class="station-card"><span class="station-icon">🏬</span><h4>Costco Garðabær</h4><p>雷市郊区，需会员卡，油价最便宜</p></div>
          <div class="station-card"><span class="station-icon">🔴</span><h4>Orkan</h4><p>雷市及南部海岸线，据点多</p></div>
          <div class="station-card"><span class="station-icon">🔵</span><h4>Atlantsolía</h4><p>雷市及南部主要城镇</p></div>
          <div class="station-card"><span class="station-icon">🟡</span><h4>ÓB</h4><p>雷市及南部海岸线</p></div>
          <div class="station-card"><span class="station-icon">⛽</span><h4>N1</h4><p>南部沿途常见连锁，可顺便补给零食</p></div>
        </div>
        <div class="travel-sub-collapse">
          <div class="travel-sub-header" onclick="toggleSubCollapse(this)">
            <span class="travel-sub-title">⛽ 加油步骤</span>
            <span class="travel-sub-arrow">▼</span>
          </div>
          <div class="travel-sub-body">
            <div style="font-size:0.78rem;color:var(--text);line-height:1.8;">
              <div style="padding:4px 0;border-bottom:1px solid var(--border-light);">① 选择自助加油机，插入国际信用卡（需 PIN 码）</div>
              <div style="padding:4px 0;border-bottom:1px solid var(--border-light);">② 选择油枪（通常柴油 Dísel / 汽油 95 Octane）</div>
              <div style="padding:4px 0;border-bottom:1px solid var(--border-light);">③ 先扣预授权，加满后自动结算</div>
              <div style="padding:4px 0;">④ 若无 PIN 码，部分 N1 加油站可于柜台先预付现金</div>
            </div>
          </div>
        </div>
        <div class="travel-sub-collapse">
          <div class="travel-sub-header" onclick="toggleSubCollapse(this)">
            <span class="travel-sub-title">💰 省钱要点</span>
            <span class="travel-sub-arrow">▼</span>
          </div>
          <div class="travel-sub-body">
            <p style="font-size:0.8rem;color:var(--sub);line-height:1.7;">雷市郊区 Costco 最便宜，但需会员卡；Orkan / Atlantsolía / ÓB 价格相近，可用 gasvaktin.is 即时比价；黄金圈、南岸越往南油价越高，建议离开雷市前先加满；油量低于一半就补，避免偏远地区找不到加油站。</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 5.5 厕所总整理 -->
    <div class="travel-collapse">
      <div class="travel-collapse-header" onclick="toggleTravelCollapse(this)">
        <div class="travel-collapse-left">
          <div class="travel-collapse-emoji">🚻</div>
          <div>
            <div class="travel-collapse-title">厕所总整理</div>
            <div class="travel-collapse-sub">黄金圈 · 南岸 · 雷市及周边</div>
          </div>
        </div>
        <div class="travel-collapse-arrow">▼</div>
      </div>
      <div class="travel-collapse-body">
        <div class="travel-sub-collapse">
          <div class="travel-sub-header" onclick="toggleSubCollapse(this)">
            <span class="travel-sub-title">黄金圈</span>
            <span class="travel-sub-arrow">▼</span>
          </div>
          <div class="travel-sub-body">
            <div style="font-size:0.78rem;color:var(--text);line-height:1.8;">
              <div style="padding:4px 0;border-bottom:1px solid var(--border-light);"><strong>Þingvellir</strong> — 游客中心，200 ISK，支持扫码支付</div>
              <div style="padding:4px 0;border-bottom:1px solid var(--border-light);"><strong>Geysir</strong> — 游客中心，免费，环境不错，位于商店最深处</div>
              <div style="padding:4px 0;border-bottom:1px solid var(--border-light);"><strong>Gullfoss</strong> — 游客中心，可休息</div>
              <div style="padding:4px 0;border-bottom:1px solid var(--border-light);"><strong>Kerið</strong> — 有厕所</div>
              <div style="padding:4px 0;"><strong>Brúarfoss</strong> — 无厕所，出发前请在民宿解决</div>
            </div>
          </div>
        </div>
        <div class="travel-sub-collapse">
          <div class="travel-sub-header" onclick="toggleSubCollapse(this)">
            <span class="travel-sub-title">南岸</span>
            <span class="travel-sub-arrow">▼</span>
          </div>
          <div class="travel-sub-body">
            <div style="font-size:0.78rem;color:var(--text);line-height:1.8;">
              <div style="padding:4px 0;border-bottom:1px solid var(--border-light);"><strong>Seljalandsfoss</strong> — 有厕所，200 ISK，环境一般</div>
              <div style="padding:4px 0;border-bottom:1px solid var(--border-light);"><strong>Skógafoss</strong> — 停车场，免费，维护不错</div>
              <div style="padding:4px 0;border-bottom:1px solid var(--border-light);"><strong>Dyrhólaey</strong> — 下层停车场，200 ISK</div>
              <div style="padding:4px 0;border-bottom:1px solid var(--border-light);"><strong>Reynisfjara</strong> — 游客中心/餐厅</div>
              <div style="padding:4px 0;border-bottom:1px solid var(--border-light);"><strong>Jökulsárlón</strong> — 游客中心/咖啡馆，200 ISK，高峰略脏</div>
              <div style="padding:4px 0;"><strong>Diamond Beach</strong> — 无厕所，2025年起取消收费</div>
            </div>
          </div>
        </div>
        <div class="travel-sub-collapse">
          <div class="travel-sub-header" onclick="toggleSubCollapse(this)">
            <span class="travel-sub-title">雷市及周边</span>
            <span class="travel-sub-arrow">▼</span>
          </div>
          <div class="travel-sub-body">
            <div style="font-size:0.78rem;color:var(--text);line-height:1.8;">
              <div style="padding:4px 0;border-bottom:1px solid var(--border-light);"><strong>Hallgrímskirkja</strong> — 教堂内，免费</div>
              <div style="padding:4px 0;border-bottom:1px solid var(--border-light);"><strong>Harpa</strong> — 地下一层，免费，宽敞明亮</div>
              <div style="padding:4px 0;border-bottom:1px solid var(--border-light);"><strong>特约宁湖/市政厅</strong> — 有厕所，免费</div>
              <div style="padding:4px 0;"><strong>Blue Lagoon</strong> — 温泉区内</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 5.6 旅行文件（机票/住宿/租车/活动 PDF）-->
    <div class="travel-collapse">
      <div class="travel-collapse-header" onclick="toggleTravelCollapse(this)">
        <div class="travel-collapse-left">
          <div class="travel-collapse-emoji">📎</div>
          <div>
            <div class="travel-collapse-title">旅行文件</div>
            <div class="travel-collapse-sub">机票 · 住宿 · 租车 · 活动 PDF</div>
          </div>
        </div>
        <div class="travel-collapse-arrow">▼</div>
      </div>
      <div class="travel-collapse-body" id="docsListContainer">
        <!-- 由 js/render-docs.js 依 data/docs-content.js 的內容自動產生 -->
      </div>
    </div>

  </div>
</div>
`;
