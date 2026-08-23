// 極光頁的觀測地點。座標與住宿對應，改地點只需改這個檔案。
const AURORA_CONFIG = {
  locations: [
    { key:'reykjavik', name:'雷克雅未克', lat:63.1466, lon:-21.9426, nights:[] },
    { key:'selfoss',   name:'南部民宿 Selfoss', lat:63.93, lon:-20.85, nights:['day1','day2'] },
    { key:'lakeview',  name:'Lakeview Cabin',  lat:63.79, lon:-18.06, nights:['day3','day4'] },
    { key:'gardur',    name:'Garður',          lat:64.07, lon:-22.70, nights:['day5'] }
  ],
  sampleRadiusKm: 30,
  sampleDistances: [10, 20, 30],
  links: {
    vedur: 'https://en.vedur.is/weather/forecasts/aurora/',
    road:  'https://www.road.is/travel-info/road-conditions-and-weather/'
  }
};
