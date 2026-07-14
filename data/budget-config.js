// 費用資料設定。Firebase 僅用於費用同步，其連線資料在 firebase-settings.js。
const BUDGET_CONFIG = window.BUDGET_CONFIG = {
  people: ['小良', '老板', '小翼', '秋燕'],
  defaultDate: '2026-10-04',
  baseCurrency: 'CNY',
  baseCurrencySymbol: '¥',
  storageKey: 'trip_expenses',
  currencies: [
    { code: 'ISK', rate: 0.052, step: 0.001 },
    { code: 'EUR', rate: 7.8, step: 0.01 },
    { code: 'HKD', rate: 0.92, step: 0.01 },
    { code: 'CNY', rate: 1, step: 0.01 },
    { code: 'USD', rate: 7.2, step: 0.01 },
    { code: 'TWD', rate: 0.23, step: 0.01 }
  ],
  categories: [
    { id: 'food', name: '餐饮', icon: '🍽️', color: '#e8f4f8' },
    { id: 'activity', name: '景点活动', shortName: '景点', icon: '🎫', color: '#f0e8f4' },
    { id: 'transport', name: '交通', icon: '🚗', color: '#f8f0e8' },
    { id: 'stay', name: '住宿', icon: '🏨', color: '#e8f8f0' },
    { id: 'shopping', name: '购物', icon: '🛍️', color: '#f4e8f0' },
    { id: 'other', name: '其他', icon: '📦', color: '#f0f4e8' }
  ]
};
