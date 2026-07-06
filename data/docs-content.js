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
  { category: '機票', icon: '✈️', title: '张乔岚 - 冰島機票（共三張）', filename: 'flight-zhang-qiaolan.pdf', note: '' },
  { category: '機票', icon: '✈️', title: '張秋燕 - 芬蘭航空機票', filename: 'flight-zhang-qiuyan.pdf', note: '' },
  { category: '機票', icon: '✈️', title: '張良任 - 機票（共二張）', filename: 'flight-zhang-liangren.pdf', note: '' },
  { category: '機票', icon: '✈️', title: '楊小翼 - 芬蘭航空機票', filename: 'flight-yang-xiaoyi.pdf', note: '' },
  { category: '租車', icon: '🚗', title: '租車確認單', filename: 'car-rental.pdf', note: '' },
];
