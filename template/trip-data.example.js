// 空白模板範例：複製後只填資料，不修改 js/ 核心程式。
const EXAMPLE_TRIP_DATA = {
  config: {
    tripName: '範例旅程', siteTitle: '範例旅程 2027', countries: ['國家'],
    dateRange: { start: '2027-01-01', end: '2027-01-02', display: '2027/1/1 – 1/2' },
    timezone: 'Asia/Tokyo', primaryCurrency: 'JPY',
    theme: { primary: '#2c5f6e', accent: '#4a8fa3' },
    coverImage: 'images/banners/day1-card.jpg'
  },
  days: [
    { id: 'day1', title: '抵達', date: '2027-01-01', summary: '', routeMapImg: '', lodgingId: 'stay-1', reminders: [], spotIds: ['spot-1'] }
  ],
  spots: [
    { id: 'spot-1', dayId: 'day1', name: '範例景點', label: 'A', localName: '', time: '', duration: '', map: '', images: [], desc: '', parking: '', price: '', booking: '', tips: '' }
  ],
  transport: [
    { id: 'transport-1', dayId: 'day1', type: 'flight', provider: '', number: '', from: '', to: '', departure: '', arrival: '' }
  ],
  lodging: [
    { id: 'stay-1', dayId: 'day1', name: '範例住宿', address: '', checkIn: '', map: '', contact: '', note: '' }
  ],
  budget: {
    people: ['旅伴一'], baseCurrency: 'CNY', currencies: [{ code: 'CNY', rate: 1 }],
    categories: [{ id: 'other', name: '其他', icon: '📦' }], planned: [], paid: [], onSite: []
  },
  documents: [
    { id: 'document-1', category: '機票', title: '範例文件', filename: 'example.pdf', note: '' }
  ]
};
