怎麼幫景點加上照片
====================

1. 找照片（推薦用這幾個免費可商用的圖庫網站）
   - Unsplash：https://unsplash.com
   - Pexels：https://www.pexels.com
   - Wikimedia Commons（公開景點特別多）：https://commons.wikimedia.org

2. 下載照片到你電腦，建議：
   - 格式：jpg 或 png
   - 方向：橫式（風景照）比較好看
   - 檔案大小：盡量壓在 500KB 以內（太大網站開啟會變慢），
     可以用 https://squoosh.app 這個免費網站線上壓縮

3. 把下載好的照片放進這個資料夾（images/spots/），並取一個簡單的英文檔名，
   例如：thingvellir.jpg、gullfoss.jpg、geysir.jpg

4. 打開 data/trip-details.js，找到對應的景點，加上一行 img 欄位，例如：

   {
     icon: '🏞️',
     name: 'Þingvellir 辛格维利尔国家公园',
     img: 'thingvellir.jpg',    ← 加這一行，檔名要跟你放的照片檔名完全一樣
     tags: [...],
     ...
   }

5. 存檔、上傳到 GitHub（連同這個 images 資料夾一起上傳），完成！

小提醒：
- 沒有設定 img、或是檔名對不起來，網站都會自動顯示插畫代替，不會壞掉，
  所以可以想到哪個景點就先加哪個，不用一次全部弄完。
- 檔名請只用英文字母、數字、減號（-）或底線（_），不要用中文或空白，
  避免上傳到 GitHub 後路徑跑掉。
