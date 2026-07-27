// 「体验／工具」的分类名称与辨识图片属于旅程内容，不放在核心互动程式中。
//
// v23：总览页卡片尺寸系统。每个分类指定一种尺寸，決定它在總覽格線裡佔多大：
//   '2x4'：整行滿版、較高，需要一張封面照片（沒有照片時自動退回大 emoji 佔位）
//   '2x2'：半行方形卡，只用 emoji 圖示＋文字，不需要照片
//   '1x4'：整行滿版、較矮的長條卡，只用 emoji 圖示＋文字，不需要照片
// sizes 陣列順序跟 labels 一一對應。下面是預設分配，Fisher 可以直接改這個陣列調整。
const CATALOG_PAGE_META = window.CATALOG_PAGE_META = {
  travel: {
    overview: '体验总览', pageId: 'page-travel',
    labels: ['伴手礼（商店）', '伴手礼（超市）', '主要超市', '冰岛酒类', '芬兰伴手礼', '芬兰浴'],
    sizes:  ['2x4',        '2x2',        '1x4',      '2x2',      '2x2',        '2x2']
  },
  other: {
    overview: '工具总览', pageId: 'page-other',
    labels: ['极光查询', '寻找极光', '极光摄影', '加油工具', '厕所资讯', '旅行文件'],
    sizes:  ['2x4',      '2x2',      '2x2',      '2x2',      '1x4',      '2x2']
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
