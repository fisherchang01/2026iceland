// 統一資料 Schema 與相容層。
// 現有旅程資料可維持分檔維護；核心程式只透過 TRIP_DATA 讀取七大類資料。
const TRIP_SCHEMA = window.TRIP_SCHEMA = {
  'trip-config': {
    required: ['tripName', 'siteTitle', 'countries', 'dateRange.start', 'dateRange.end', 'timezone', 'primaryCurrency'],
    optional: ['theme', 'coverImage', 'bannerTitleHtml', 'badges']
  },
  'trip-days': {
    required: ['id', 'title', 'date'],
    optional: ['summary', 'sectionLabel', 'routeMapImg', 'lodgingId', 'reminders', 'spotIds']
  },
  spots: {
    required: ['id', 'dayId', 'name'],
    optional: ['label', 'localName', 'time', 'duration', 'map', 'img', 'images', 'desc', 'deepDesc', 'parking', 'toilet', 'price', 'booking', 'tips', 'tags', 'nextStop']
  },
  transport: {
    required: ['id', 'dayId', 'type'],
    optional: ['provider', 'number', 'from', 'to', 'departure', 'arrival', 'duration', 'date', 'booking', 'note']
  },
  lodging: {
    required: ['id', 'dayId', 'name'],
    optional: ['address', 'checkIn', 'checkOut', 'map', 'contact', 'note', 'booking']
  },
  budget: {
    required: ['people', 'baseCurrency', 'currencies', 'categories'],
    optional: ['defaultDate', 'baseCurrencySymbol', 'storageKey', 'planned', 'paid', 'onSite']
  },
  documents: {
    required: ['id', 'category', 'title', 'filename'],
    optional: ['icon', 'note', 'person', 'date']
  }
};

function tripHasValue(value) {
  if (value === null || typeof value === 'undefined' || value === '') return false;
  if (Array.isArray(value)) return value.length > 0;
  return true;
}

function buildTripData() {
  var days = TRIP_DAYS.map(function(meta) {
    var detail = TRIP[meta.id] || {};
    return Object.assign({}, detail, meta, {
      date: meta.isoDate || detail.date || TRIP_CONFIG.dateRange.start,
      dayOfMonth: meta.date,
      detailTitle: detail.title || meta.title
    });
  });
  var spots = [];
  var transport = [];
  var lodging = [];

  days.forEach(function(day) {
    var addSpot = function(spot, index, areaId) {
      spots.push(Object.assign({}, spot, {
        id: spot.id || day.id + (areaId ? '-' + areaId : '') + '-spot-' + (index + 1),
        dayId: day.id,
        areaId: areaId || null
      }));
    };
    (day.spots || []).forEach(function(spot, index) { addSpot(spot, index, null); });
    (day.areas || []).forEach(function(area, areaIndex) {
      (area.spots || []).forEach(function(spot, index) { addSpot(spot, index, 'area-' + (areaIndex + 1)); });
    });
    (day.flights || []).forEach(function(item, index) {
      transport.push({
        id: day.id + '-flight-' + (index + 1), dayId: day.id, type: 'flight',
        provider: item.airline, number: item.flightNo, from: item.from, to: item.to,
        departure: item.dep, arrival: item.arr, duration: item.duration,
        date: item.date, note: item.note || ''
      });
    });
    if (day.hotel && day.hotel.name) {
      lodging.push(Object.assign({ id: day.id + '-lodging', dayId: day.id }, day.hotel));
    }
  });

  return {
    config: TRIP_CONFIG,
    days: days,
    daysById: days.reduce(function(map, day) { map[day.id] = day; return map; }, {}),
    spots: spots,
    transport: transport,
    lodging: lodging,
    budget: BUDGET_CONFIG,
    documents: (typeof DOCS === 'undefined' ? [] : DOCS).map(function(doc, index) {
      return Object.assign({ id: 'document-' + (index + 1) }, doc);
    })
  };
}

function validateTripData(data) {
  var warnings = [];
  if (!tripHasValue(data.config.tripName)) warnings.push('trip-config.tripName 為必填');
  if (!tripHasValue(data.config.timezone)) warnings.push('trip-config.timezone 為必填');
  data.days.forEach(function(day) {
    if (!tripHasValue(day.id) || !tripHasValue(day.title) || !tripHasValue(day.date)) {
      warnings.push('trip-days 有缺少 id/title/date 的項目');
    }
  });
  data.spots.forEach(function(spot) {
    if (!tripHasValue(spot.name)) warnings.push(spot.id + ' 缺少景點名稱');
  });
  if (!data.budget.people.length) warnings.push('budget.people 至少需要一位同行者');
  if (warnings.length && window.console) console.warn('旅程資料檢查：\n- ' + warnings.join('\n- '));
  return warnings;
}

const TRIP_DATA = window.TRIP_DATA = buildTripData();
window.TRIP_DATA_WARNINGS = validateTripData(TRIP_DATA);
