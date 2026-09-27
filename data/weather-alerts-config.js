// 今日卡的天氣警戒摘要要用的設定：冰島氣象局（IMO / Veðurstofa Íslands）官方
// 即時警戒 API，以及「這一天行程落在哪個官方預報分區」的對照表。
//
// dayRegions 的每個分區名稱必須跟 IMO 官方分區清單（英文）完全一致，可以用這支
// API 自己核對：https://api.vedur.is/cap/v1/capcreator/forecast_regions/?region_type=met-preset
// 目前全部 12 個分區：Reykjavik - Capital Region／South Iceland／
// Faxafloi - Southwest Iceland／Breidafjordur - Westnorthwest Iceland／
// Westfjords／Northwest Iceland／Northeast Iceland／East Iceland／
// Eastfjords／Southeast Iceland／Central highlands - Uninhabited part of Iceland／Iceland。
//
// 這裡的分區是依照當天行程的地理範圍手動對應（不是逐點精算），例如 day2/day3
// 都在黃金圈與南岸屬於 South Iceland；day4 冰川健行、钻石沙滩屬於 Southeast
// Iceland。之後行程路線如果大改，記得回來調整這個對照表。
// 只有冰島境內的天數才有對照（day0／day7／day8 是飛行日或芬蘭段，IMO 只涵蓋
// 冰島，這幾天不查也不會顯示警戒）。
const WEATHER_ALERT_CONFIG = {
  apiUrl: 'https://api.vedur.is/cap/v1/capbroker/active/detailed/all/',
  fetchTimeoutMs: 6000,
  dayRegions: {
    day1: ['Reykjavik - Capital Region', 'Faxafloi - Southwest Iceland', 'South Iceland'],
    day2: ['South Iceland'],
    day3: ['South Iceland'],
    day4: ['Southeast Iceland'],
    day5: ['Southeast Iceland', 'South Iceland', 'Faxafloi - Southwest Iceland', 'Reykjavik - Capital Region'],
    day6: ['Faxafloi - Southwest Iceland', 'Reykjavik - Capital Region']
  }
};
