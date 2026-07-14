// ★★★ 費用同步（Firebase）設定檔 ★★★
// 這個檔案讓「費用記帳」變成旅伴之間即時同步，而不是只存在自己手機裡。
//
// 這個檔案需要用 <script type="module"> 載入（已經在 index.html 設定好），
// 新旅程的 Firebase 專案與資料路徑只需修改 data/firebase-settings.js。
//
// 設計上就算 Firebase 連不上（例如网路不稳定、专案设定错误），网站仍然会
// 正常运作，只是费用记录会退回「只存在自己手机」，不会整个网站坏掉。

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import { getDatabase, ref, push, set, remove, onValue } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-database.js";

const settings = window.FIREBASE_SETTINGS || {};
const firebaseConfig = settings.config || {};
const EXPENSES_PATH = settings.expensesPath || '';

try {
  if (!settings.enabled || !EXPENSES_PATH || !firebaseConfig.databaseURL) {
    throw new Error('Firebase 費用同步尚未設定');
  }
  const app = initializeApp(firebaseConfig);
  const db = getDatabase(app);
  const expensesRef = ref(db, EXPENSES_PATH);

  window.cloudExpenses = {
    available: true,

    // 新增一筆消費到雲端，回傳這筆資料在雲端的專屬 ID
    push: function (expense) {
      try {
        const newRef = push(expensesRef);
        set(newRef, expense).catch(function (e) {
          console.warn('雲端儲存失敗，這筆記錄暫時只存在本機：', e);
        });
        return newRef.key;
      } catch (e) {
        console.warn('雲端儲存失敗，這筆記錄暫時只存在本機：', e);
        return null;
      }
    },

    // 從雲端刪除一筆消費（用 push() 回傳的雲端 ID）
    remove: function (cloudId) {
      if (!cloudId) return;
      try {
        remove(ref(db, EXPENSES_PATH + '/' + cloudId)).catch(function (e) {
          console.warn('雲端刪除失敗：', e);
        });
      } catch (e) {
        console.warn('雲端刪除失敗：', e);
      }
    },

    // 訂閱即時更新：只要任何人（含自己）新增/刪除消費，callback 就會收到最新的完整清單
    onChange: function (callback) {
      try {
        onValue(expensesRef, function (snapshot) {
          const list = [];
          snapshot.forEach(function (child) {
            const val = child.val();
            val._cloudId = child.key;
            list.push(val);
          });
          callback(list);
        });
      } catch (e) {
        console.warn('雲端同步監聽失敗，將只使用本機記錄：', e);
      }
    }
  };

  console.log('✅ 費用同步（Firebase）已連線');
} catch (e) {
  console.warn('⚠️ Firebase 初始化失敗，費用記錄將只儲存在本機（不會同步給旅伴）：', e);
  window.cloudExpenses = {
    available: false,
    push: function () { return null; },
    remove: function () {},
    onChange: function () {}
  };
}

// 不依賴載入順序：自己準備好之後，主動去呼叫 budget.js 裡的同步訂閱函式。
// 就算這個檔案比 init.js 晚執行也沒關係。
if (typeof initCloudExpensesSync === 'function') {
  initCloudExpensesSync();
}
