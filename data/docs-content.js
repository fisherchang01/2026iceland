// 旅行文件清單（機票、住宿、租車、活動等 PDF）
// 新增文件的方法：
// 1. 把 PDF 檔案放進 docs/ 這個資料夾（檔名請用英文/數字/減號，不要中文或空白）
// 2. 在下面的 DOCS 陣列裡加一筆資料，格式參考下方註解範例
// 3. category 目前建議用：機票／住宿／租車／活動，同一個 category 的文件會自動分在一組
//
// 範例（把最前面的 // 拿掉就會生效）：
// { category: '機票', icon: '✈️', title: '去程機票 CX635+AY132+AY991', filename: 'flight-outbound.pdf', note: '10/3 出發' },
// { category: '住宿', icon: '🏨', title: 'South Central Country Apartment', filename: 'hotel-day1.pdf', note: '10/4 入住' },

const DOCS = [
  // ───────── 機票 ─────────
  { category: '機票', icon: '✈️', title: '原始往返機票收據', filename: 'flight-outbound-receipt.pdf', note: '原始訂票收據' },
  { category: '機票', icon: '✈️', title: '原始往返機票行程單', filename: 'flight-outbound-itinerary.pdf', note: '原始行程單' },
  { category: '機票', icon: '✈️', title: '替換航班 Air India 行程單', filename: 'flight-replacement-airindia.pdf', note: '替代航班' },
  { category: '機票', icon: '✈️', title: '姓名更正確認信', filename: 'flight-name-correction.pdf', note: '2026年1月更正' },
  { category: '機票', icon: '✈️', title: '電子機票收據', filename: 'flight-electronic-ticket.pdf', note: '電子票證' },
  { category: '機票', icon: '✈️', title: '冰島機票及住宿總覽', filename: 'flight-hotel-summary.pdf', note: '機票+住宿整合' },
  { category: '機票', icon: '✈️', title: '廈門往返香港機票', filename: 'flight-xiamen-hongkong.pdf', note: '內地段' },

  // ───────── 住宿 ─────────
  { category: '住宿', icon: '🏨', title: '10/4 冰島住宿確認', filename: 'hotel-1004.pdf', note: '第一天住宿' },
  { category: '住宿', icon: '🏨', title: '10/6 冰島住宿確認', filename: 'hotel-1006.pdf', note: '第三天住宿' },
  { category: '住宿', icon: '🏨', title: '10/8 冰島住宿確認', filename: 'hotel-1008.pdf', note: '第五天住宿' },
  { category: '住宿', icon: '🏨', title: '10/9 住宿確認', filename: 'hotel-1009.pdf', note: '第六天住宿' },
  { category: '住宿', icon: '🏨', title: '希爾頓酒店確認', filename: 'hotel-hilton.pdf', note: '希爾頓訂房' },

  // ───────── 租車 ─────────
  { category: '租車', icon: '🚗', title: '租車確認單', filename: 'car-rental.pdf', note: '自駕租車' },

  // ───────── 活動 ─────────
  { category: '活動', icon: '♨️', title: '藍湖溫泉收據', filename: 'blue-lagoon-receipt.pdf', note: 'Blue Lagoon 收據' },
  { category: '活動', icon: '♨️', title: '藍湖溫泉 SPA 券', filename: 'blue-lagoon-voucher.pdf', note: 'Blue Lagoon SPA' },

  // ───────── 行前資料 ─────────
  { category: '行前資料', icon: '🌤️', title: '冰島天氣及穿著攜帶物品', filename: 'weather-packing-guide.pdf', note: '天氣與打包清單' },
  { category: '行前資料', icon: '💰', title: '物价及预算指南', filename: 'budget-guide.pdf', note: '預算參考' },
  { category: '行前資料', icon: '🛂', title: '申根簽證資料', filename: 'schengen-visa.pdf', note: '簽證相關' },
  { category: '行前資料', icon: '📍', title: '冰島行程總覽', filename: 'itinerary.pdf', note: '完整行程規劃' },
];
