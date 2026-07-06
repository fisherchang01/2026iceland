// ★★★ 景點圖示（SVG 插圖）★★★
// 這裡是一套統一風格的線條插圖，取代原本零散的 emoji 圖示。
// 每一個 emoji 對應一個手繪的 SVG 圖案，風格統一（線條粗細、圓角都一致）。
//
// 如果之後新增景點時用了一個「這裡沒有對應」的新 emoji，網站會自動改回顯示
// 原本的 emoji，不會壞掉、也不會顯示空白 —— 只是還沒有專屬插圖而已。
//
// 如果想幫某個新 emoji 也做一個專屬插圖，可以照著下面的格式，
// 在 SPOT_ICONS 物件裡新增一行：'emoji符号': `<svg 內容>`

const SPOT_ICONS = {
  // 🏞️ 国家公园／裂谷景观
  '🏞️': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="17.5" cy="6.5" r="2.2"/><path d="M2 19l6-8 4 5 3-4 7 7z"/></svg>`,

  // 💦 地热喷泉／间歇泉喷发
  '💦': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2c2 3 2 5 0 7-2-2-2-4 0-7z"/><path d="M12 22v-9"/><path d="M8 22c0-3 1.5-5 4-6 2.5 1 4 3 4 6"/></svg>`,

  // 🌊 大瀑布／黄金瀑布
  '🌊': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3v9c0 2 1.5 3.5 3 5M12 3v9c0 2 1.5 3.5 3 5M18 3v9c0 2 1 3.5 2 5"/><path d="M2 21c1.5-1.5 3-1.5 4.5 0s3 1.5 4.5 0 3-1.5 4.5 0 3 1.5 4.5 0"/></svg>`,

  // 🛒 超市／补给
  '🛒': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="20" r="1.4" fill="currentColor" stroke="none"/><circle cx="17" cy="20" r="1.4" fill="currentColor" stroke="none"/><path d="M2 3h2l2.2 11.4A2 2 0 008.2 16H17a2 2 0 002-1.6L20.5 7H5.3"/></svg>`,

  // 💎 蓝钻石瀑布
  '💎': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9l4-6h8l4 6-10 12z"/><path d="M4 9h16M9.5 3L8 9l4 12 4-12-1.5-6"/></svg>`,

  // 🌀 火山口湖（同心圆）
  '🌀': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="12" rx="9.5" ry="6.5"/><ellipse cx="12" cy="12" rx="5" ry="3.2"/></svg>`,

  // 💧 可走入水帘的瀑布
  '💧': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" stroke-linecap="round"><path d="M12 2s6 7.5 6 12a6 6 0 11-12 0c0-4.5 6-12 6-12z"/></svg>`,

  // 🏔️ 登高观景的瀑布／峡谷
  '🏔️': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M2 20L9 7l4 6 2-3 7 10z"/><path d="M6 20l3-5 2 2"/></svg>`,

  // 🐦 海鸟悬崖
  '🐦': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M2 14c3-4 6-2 6 0 0-2 3-4 6-1 3-3 6-1 8 2-3-1-5 0-6 2-1-1-3-1-4 0-1-1-3-1-4 0-1-1-3-2-6-3z"/></svg>`,

  // ⚫ 黑沙滩／玄武岩柱
  '⚫': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M2 17c2-6 4-9 5-9s2 4 3 4 2-6 3-6 2 7 3 7 2-3 3-3 2 4 3 7"/><path d="M2 20h20"/></svg>`,

  // 🧊 冰洞／冰川
  '🧊': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" stroke-linecap="round"><path d="M12 2l8.7 5v10L12 22l-8.7-5V7z"/><path d="M3.3 7L12 12l8.7-5M12 12v10"/></svg>`,

  // 🚤 冰河湖搭船
  '🚤': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3 15h18l-2.5 4a2 2 0 01-1.7 1H7.2a2 2 0 01-1.7-1z"/><path d="M6 15V9h9l3 6M9 9V4h3v5"/></svg>`,

  // 💠 钻石海滩浮冰
  '💠': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" stroke-linecap="round"><path d="M12 2l6 7-6 13-6-13z"/><path d="M6 9h12"/></svg>`,

  // ⛪ 白教堂／地标教堂
  '⛪': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v3M10.5 3.5h3"/><path d="M12 5l7 6v10H5V11z"/><path d="M9 21v-6a3 3 0 016 0v6"/></svg>`,

  // 🎭 音乐厅／建筑亮点
  '🎭': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" stroke-linecap="round"><path d="M12 2l9 5v3H3V7z"/><path d="M3 10v10h18V10M8 20v-6M16 20v-6"/></svg>`,

  // ♨️ 蓝湖温泉
  '♨️': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M9 2c1.2 1.6 1.2 2.7 0 4-1.2-1.3-1.2-2.4 0-4zM15 2c1.2 1.6 1.2 2.7 0 4-1.2-1.3-1.2-2.4 0-4z"/><ellipse cx="12" cy="17" rx="9" ry="4.5"/><path d="M3 17c0-3 2-13 9-13"/></svg>`,

  // 🚉 中央车站
  '🚉': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" stroke-linecap="round"><rect x="3" y="8" width="18" height="10" rx="2"/><path d="M3 13h18M8 3v5M16 3v5"/><circle cx="8" cy="15.5" r="1" fill="currentColor" stroke="none"/><circle cx="16" cy="15.5" r="1" fill="currentColor" stroke="none"/></svg>`,

  // 🏛️ 广场／古典建筑
  '🏛️': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M2 9l10-6 10 6"/><path d="M4 9v10M8 9v10M12 9v10M16 9v10M20 9v10"/><path d="M2 21h20"/></svg>`,

  // 🐟 市集广场／海鲜
  '🐟': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12c4-5 12-5 16 0-4 5-12 5-16 0z"/><path d="M18 12l4-3v6z"/><circle cx="7" cy="11" r=".6" fill="currentColor" stroke="none"/></svg>`,

  // 🗿 纪念雕像
  '🗿': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="6" r="3"/><path d="M8 21v-6a4 4 0 018 0v6"/><path d="M6 21h12"/></svg>`,

  // 🌊 旧港海滨 / 红教堂共用海景意象已用 🌊 上面；这里给红教堂单独设计：
  '🔴': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="4.5" r="1.6"/><path d="M12 6.1V8"/><path d="M6 8a6 6 0 0112 0v3H6z"/><path d="M5 11h14v9H5z"/></svg>`,

  // 💕 爱之桥
  '💕': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6.5c-2-2-5.2-.6-5.2 2 0 3 3 5 8.2 9.5 5.2-4.5 8.2-6.5 8.2-9.5 0-2.6-3.2-4-5.2-2L12 8z" transform="translate(0,-1) scale(0.82) translate(2.6,2.5)"/></svg>`,

  // 🪨 岩石教堂
  '🪨': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 18c-1-4 1-8 4-9 1-2 4-3 6-1 3 0 5 2 5 5 2 1 3 3 2 5z"/><path d="M4 18h16"/></svg>`,

  // 🏊 海景泳池
  '🏊': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="17" cy="4.5" r="1.6"/><path d="M4 11l3-2 3 2 3-3 3 3 3-2 3 2"/><path d="M2 20c1.5-1.5 3-1.5 4.5 0s3 1.5 4.5 0 3-1.5 4.5 0 3 1.5 4.5 0"/><path d="M2 16c1.5-1.5 3-1.5 4.5 0s3 1.5 4.5 0 3-1.5 4.5 0 3 1.5 4.5 0"/></svg>`
};

// 依 emoji 取得對應的 SVG 插圖 HTML；沒有對應的話就退回顯示原本的 emoji 文字。
function getSpotIconHtml(emoji) {
  if (SPOT_ICONS[emoji]) {
    return '<span class="spot-icon-svg">' + SPOT_ICONS[emoji] + '</span>';
  }
  return '<span class="spot-icon-emoji">' + emoji + '</span>';
}
