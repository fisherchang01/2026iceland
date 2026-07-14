// 「體驗／工具」的分類名稱與辨識圖片屬於旅程內容，不放在核心互動程式中。
const CATALOG_PAGE_META = window.CATALOG_PAGE_META = {
  travel: {
    overview: '體驗總覽', pageId: 'page-travel',
    labels: ['伴手禮（商店）', '伴手禮（超市）', '主要超市', '冰島酒類', '芬蘭伴手禮', '芬蘭浴']
  },
  other: {
    overview: '工具總覽', pageId: 'page-other',
    labels: ['極光查詢', '尋找極光', '極光攝影', '加油工具', '廁所資訊', '旅行文件']
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
