// 「体验／工具」的分类名称与辨识图片属于旅程内容，不放在核心互动程式中。
//
// v24：总览页卡片尺寸系统，只有兩種規格，都需要一張封面照片：
//   '2x4'：整行滿版、較高（比例 2.2:1）
//   '2x2'：半行方形卡，兩張並排（比例 1:1）
// 封面照片統一寫在每個分類 <div class="travel-collapse" data-cover="...">，
// 由 Fisher 自行指定一張能代表整個分類的情境照（跟第二層項目卡的封面來源不同，
// 第二層是自動取項目詳情第一張圖，這裡因為代表的是一整個分類、比較抽象，用手動指定的方式）。
// sizes 陣列順序跟 labels 一一對應，Fisher 可以直接改這個陣列調整每個分類要大卡還小卡。
const CATALOG_PAGE_META = window.CATALOG_PAGE_META = {
  travel: {
    overview: '体验总览', pageId: 'page-travel',
    get labels() { return TRAVEL_CONTENT.categories.map(c => c.title); },
    get sizes()  { return TRAVEL_CONTENT.categories.map(c => c.size || '2x2'); }
  },
  other: {
    overview: '工具总览', pageId: 'page-other',
    labels: ['冰岛退税', '芬兰退税', '极光机率', '拍摄极光', '冰岛加油', '洗浴文化'],
    sizes:  ['2x2',      '2x2',      '2x2',      '2x2',      '2x2',      '2x2']
  }
};

const CATALOG_IMAGE_MAP = window.CATALOG_IMAGE_MAP = [
  ['Bónus', 'images/catalog/bonus.png'],
  ['小猪超市', 'images/catalog/bonus.png'],
  ['Krónan', 'images/catalog/kronan.jpg'],
  ['Omnom', 'images/catalog/omnom.jpg'],
  ['Nói Síríus', 'images/catalog/noi-sirius.jpg'],
  ['Freyja', 'images/catalog/freyja.jpg'],
  ['Hraun', 'images/catalog/hraun.jpg'],
  ['Lakkrís', 'https://www.google.com/s2/favicons?sz=256&domain_url=https://lakkris.is/'],
  ['Saltverk', 'images/catalog/saltverk.jpg'],
  ['Blue Lagoon', 'https://www.google.com/s2/favicons?sz=256&domain_url=https://www.bluelagoon.com/'],
  ['66°North', 'https://www.google.com/s2/favicons?sz=256&domain_url=https://www.66north.com/'],
  ['Fazer', 'https://www.google.com/s2/favicons?sz=256&domain_url=https://www.fazer.com/'],
  ['Paulig', 'https://www.google.com/s2/favicons?sz=256&domain_url=https://www.paulig.com/'],
  ['Nordqvist', 'images/catalog/nordqvist.jpg'],
  ['Turun Sinappi', 'https://www.google.com/s2/favicons?sz=256&domain_url=https://www.turunsinappi.fi/'],
  ['Nettó', 'https://www.google.com/s2/favicons?sz=256&domain_url=https://netto.is/'],
  ['Hagkaup', 'https://www.google.com/s2/favicons?sz=256&domain_url=https://www.hagkaup.is/'],
  ['Costco', 'https://www.google.com/s2/favicons?sz=256&domain_url=https://www.costco.is/'],
  ['Vínbúðin', 'https://www.google.com/s2/favicons?sz=256&domain_url=https://www.vinbudin.is/'],
  ['iPhone', 'https://www.google.com/s2/favicons?sz=256&domain_url=https://www.apple.com/'],
  ['旅行文件', 'https://www.google.com/s2/favicons?sz=256&domain_url=https://www.adobe.com/acrobat/pdf-reader.html']
];
