// 「体验／工具」的分类名称与辨识图片属于旅程内容，不放在核心互动程式中。
//
// ⚠️ v1.0-stable 起：labels 與 sizes 已改為 getter，直接從 data/travel-content.js
//    的 TRAVEL_CONTENT 與 data/other-content.js 的 OTHER_CONTENT 動態推導。
//    要新增／刪除分類、調整順序或改卡片尺寸，一律改那兩個資料檔（或用編輯器），
//    這裡「不需要」也「不應該」再手動維護平行陣列。
//    前提：index.html 中本檔必須排在 travel-content.js、other-content.js 之後。
//
// 总览页卡片尺寸系统，只有兩種規格，都需要一張封面照片（寫在各分類的 cover 欄位）：
//   '2x4'：整行滿版、較高（比例 2.2:1）
//   '2x2'：半行方形卡，兩張並排（比例 1:1）
// 封面照片由 Fisher 自行指定一張能代表整個分類的情境照（跟第二層項目卡的封面來源不同，
// 第二層是自動取項目詳情第一張圖，這裡因為代表的是一整個分類、比較抽象，用手動指定的方式）。
//
// CATALOG_IMAGE_MAP 目前只剩「品牌名稱 → favicon URL」的 fallback 對應；
// 指向不存在本地檔案的舊資料已於 v1.0-stable 移除，新增前請先確認檔案真的存在。
const CATALOG_PAGE_META = window.CATALOG_PAGE_META = {
  travel: {
    overview: '体验总览', pageId: 'page-travel',
    get labels() { return TRAVEL_CONTENT.categories.map(c => c.title); },
    get sizes()  { return TRAVEL_CONTENT.categories.map(c => c.size || '2x2'); }
  },
  other: {
    overview: '工具总览', pageId: 'page-other',
    get labels() { return OTHER_CONTENT.categories.map(c => c.title); },
    get sizes()  { return OTHER_CONTENT.categories.map(c => c.size || '2x2'); }
  }
};

const CATALOG_IMAGE_MAP = window.CATALOG_IMAGE_MAP = [
  ['Lakkrís', 'https://www.google.com/s2/favicons?sz=256&domain_url=https://lakkris.is/'],
  ['Blue Lagoon', 'https://www.google.com/s2/favicons?sz=256&domain_url=https://www.bluelagoon.com/'],
  ['66°North', 'https://www.google.com/s2/favicons?sz=256&domain_url=https://www.66north.com/'],
  ['Fazer', 'https://www.google.com/s2/favicons?sz=256&domain_url=https://www.fazer.com/'],
  ['Paulig', 'https://www.google.com/s2/favicons?sz=256&domain_url=https://www.paulig.com/'],
  ['Turun Sinappi', 'https://www.google.com/s2/favicons?sz=256&domain_url=https://www.turunsinappi.fi/'],
  ['Nettó', 'https://www.google.com/s2/favicons?sz=256&domain_url=https://netto.is/'],
  ['Hagkaup', 'https://www.google.com/s2/favicons?sz=256&domain_url=https://www.hagkaup.is/'],
  ['Costco', 'https://www.google.com/s2/favicons?sz=256&domain_url=https://www.costco.is/'],
  ['Vínbúðin', 'https://www.google.com/s2/favicons?sz=256&domain_url=https://www.vinbudin.is/'],
  ['iPhone', 'https://www.google.com/s2/favicons?sz=256&domain_url=https://www.apple.com/'],
  ['旅行文件', 'https://www.google.com/s2/favicons?sz=256&domain_url=https://www.adobe.com/acrobat/pdf-reader.html']
];
