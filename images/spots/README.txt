怎麼幫景點加上照片（WebP 三尺寸）
=================================

1. 找照片（推薦用這幾個免費可商用的圖庫網站）
   - Unsplash：https://unsplash.com
   - Pexels：https://www.pexels.com
   - Wikimedia Commons（公開景點特別多）：https://commons.wikimedia.org

2. 每張照片需產生三個 WebP，三個資料夾的檔名必須完全一樣：
   - thumb：橫式 480×360／直式 360×480
   - medium：橫式 960×720／直式 720×960
   - large：橫式 1200×900／直式 900×1200
   - 版面只有橫式 4:3 和直式 3:4 兩種，裁切時請保留主體。

3. 將三種尺寸分別放入 images/spots/thumb、medium、large，
   例如三個資料夾內都有 thingvellir.webp。不要再把 JPG/PNG 原圖放在 images/spots 根目錄，避免重複。

4. 打開 data/trip-details.js，找到對應的景點，加上一行 img 欄位，例如：

   {
     icon: '🏞️',
     name: 'Þingvellir 辛格维利尔国家公园',
     img: 'thingvellir.webp',   ← 加這一行，檔名要跟三個資料夾內的照片完全一樣
     tags: [...],
     ...
   }

5. 在 data/image-manifest.js 新增同檔名的橫式或直式資料，再連同三種尺寸上傳。

小提醒：
- 沒有設定 img、或是檔名對不起來，網站都會自動顯示插畫代替，不會壞掉，
  所以可以想到哪個景點就先加哪個，不用一次全部弄完。
- 檔名請只用英文字母、數字、減號（-）或底線（_），不要用中文或空白，
  避免上傳到 GitHub 後路徑跑掉。
