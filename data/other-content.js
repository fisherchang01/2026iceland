// 「工具」頁資料檔。這裡只放資料，不放 CSS、不放 HTML 骨架。
// 渲染邏輯在 js/render-other.js（重用 js/render-travel.js 的通用 renderCatalogPage()），
// 樣式在 css/catalog-editorial.css。
// 編輯器入口卡片（tool-editor-section）不是內容，寫死在 js/render-other.js，不在這裡。
// 本檔由 tools/other-editor-pro.html 讀寫，手動編輯時請維持相同結構。
const OTHER_CONTENT = {
  "categories": [
    {
      "key": "iceland_tax_refund",
      "emoji": "🧾",
      "title": "冰岛退税",
      "sub": "冰岛退税门槛、退税单及机场办理流程",
      "cover": "iceland_tax_refund.webp",
      "size": "2x2",
      "items": []
    },
    {
      "key": "finland_tax_refund",
      "emoji": "💶",
      "title": "芬兰退税",
      "sub": "芬兰退税门槛、Global Blue及机场流程",
      "cover": "finland_tax_refund.webp",
      "size": "2x2",
      "items": []
    },
    {
      "key": "aurora_forecast",
      "emoji": "🌌",
      "title": "极光机率",
      "sub": "查询云量、KP值与极光出现机率",
      "cover": "aurora_forecast.webp",
      "size": "2x2",
      "items": []
    },
    {
      "key": "aurora_photography",
      "emoji": "📷",
      "title": "拍摄极光",
      "sub": "手机夜间模式、脚架与曝光拍摄技巧",
      "cover": "aurora_photography.webp",
      "size": "2x2",
      "items": []
    },
    {
      "key": "iceland_fuel",
      "emoji": "⛽",
      "title": "冰岛加油",
      "sub": "介绍N1、Orkan及Olís等冰岛加油站，包含自助加油及如何付款",
      "cover": "iceland_fuel.webp",
      "size": "2x2",
      "items": []
    },
    {
      "key": "finnish_sauna",
      "emoji": "🧖",
      "title": "洗浴文化",
      "sub": "认识各国桑拿、温泉与洗浴习俗",
      "cover": "finnish_sauna.webp",
      "size": "2x2",
      "items": [
        {
          "name": "芬蘭洗浴",
          "layout": "sm",
          "blocks": [
            {
              "type": "text",
              "value": "哈哈哈阿\n哈哈哈阿哈哈哈阿哈哈哈阿哈哈哈阿哈哈哈阿哈哈哈阿哈哈哈阿哈哈哈阿哈哈哈阿哈哈哈阿哈哈哈阿哈哈哈阿哈哈哈阿哈哈哈阿哈哈哈阿哈哈哈阿哈哈哈阿哈哈哈阿哈哈哈阿\n\n\n哈哈哈阿哈哈哈阿哈哈哈阿哈哈哈阿哈哈哈阿哈哈哈阿哈哈哈阿哈哈哈阿哈哈哈阿哈哈哈阿哈哈哈阿哈哈哈阿哈哈哈阿哈哈哈阿哈哈哈阿哈哈哈阿哈哈哈阿{#ff0000}哈哈哈阿哈哈哈{/color}阿哈哈哈阿哈哈哈阿哈哈哈阿哈哈哈阿哈哈哈阿哈哈哈阿哈哈哈阿哈哈哈阿"
            },
            {
              "type": "img",
              "src": "supermarket_shopping.webp"
            }
          ]
        }
      ]
    },
    {
      "key": "測試工具11",
      "emoji": "🆕",
      "title": "A工具",
      "sub": "abc",
      "cover": "",
      "size": "2x2",
      "items": [
        {
          "name": "aaaa",
          "layout": "sm",
          "blocks": [
            {
              "type": "text",
              "value": "BBBB\nAAAA\n\n看起{#ff0000}來不錯{/color}"
            },
            {
              "type": "img",
              "src": "world_heritage.webp"
            },
            {
              "type": "text",
              "value": "啊咖\n\n怎{#ff0000}麼{/color}了"
            },
            {
              "type": "img",
              "src": "注音与拼音对照.jpg"
            }
          ]
        }
      ]
    }
  ]
};

