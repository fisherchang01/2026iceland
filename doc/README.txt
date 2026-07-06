怎麼幫網站加上機票／住宿／租車等 PDF 文件
================================

1. 把 PDF 檔案放進這個資料夾（docs/），檔名請用英文字母、數字、減號「-」，
   不要用中文或空白（例如：flight-outbound.pdf、hotel-day1.pdf）

2. 打開 data/docs-content.js，在 DOCS 陣列裡加一筆資料，例如：

   { category: '機票', icon: '✈️', title: '去程機票 CX635+AY132+AY991', filename: 'flight-outbound.pdf', note: '10/3 出發' },

   欄位說明：
   - category：分類名稱，機票／住宿／租車／活動，同一類會自動排在一起
   - icon：一個 emoji，隨意
   - title：顯示的標題
   - filename：剛剛放進這個資料夾的 PDF 檔名，要完全一樣
   - note：一行補充說明（可留空字串 ''）

3. 存檔，把整個 docs 資料夾 + data/docs-content.js 上傳到 GitHub 即可。

網站上會在「其他」頁籤裡，多一個「旅行文件」分類，旅伴點進去就能看到/下載這些 PDF。
