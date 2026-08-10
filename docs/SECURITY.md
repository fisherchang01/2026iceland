# 安全與隱私指南

此 Repository 預設為公開，任何人都可以訪問、下載或複製其內容。因此，在使用此模板時必須注意隱私與安全。

---

## ❌ 禁止上傳的敏感檔案

以下檔案**絕對不應上傳到任何公開 Repository**：

### 旅行文件
- 機票 PDF（含姓名、座位號、預訂參考碼 PNR）
- 護照掃描檔或護照號碼
- 簽證文件
- 旅館預訂確認單（含住客名單、房號、確認碼）
- 租車合約（含駕照號、信用卡後 4 碼）
- 保險單據

### 個人資訊
- 信用卡號或銀行卡資訊
- 銀行帳戶資訊
- 住家地址或完整通訊資訊
- 電話號碼或隱私電郵

### 隱私照片
- 包含人臉的家族照
- 親屬或同行者的私人照片
- 需徵詢同意才能公開的影像

---

## ✅ 已有防護機制

### `.gitignore` 預設設定

Repository 已包含 `.gitignore` 檔案，預設排除：

```
# Sensitive personal documents
docs/*.pdf

# Personal data (if any)
data/private-*.js

# Editor & OS files
.DS_Store
.vscode/
*.swp
*~
*.bak
```

### 確認 `.gitignore` 生效

推送前，確認敏感檔案不會被上傳：

```bash
# 檢查哪些檔案會被 git 追蹤
git status

# 檢查 .gitignore 是否正確排除了敏感檔案
git check-ignore -v docs/*.pdf
```

---

## ⚠️ Git 歷史中的已刪除檔案風險

### 問題說明

即使你現在刪除了敏感檔案，**Git 歷史中仍可能保留它們**。任何有權訪問 Repository 的人都可以通過以下方式恢復：

```bash
git show <commit-hash>:docs/flight-ticket.pdf
```

### 完全清除敏感檔案

如果之前誤上傳了敏感檔案到 git history，使用 **BFG Repo-Cleaner** 完全清除：

#### 1. 安裝 BFG

```bash
# macOS
brew install bfg

# Linux (Ubuntu/Debian)
sudo apt-get install bfg

# 或從官方下載：https://rtyley.github.io/bfg-repo-cleaner/
```

#### 2. 執行清理（本地）

```bash
# 備份當前 repository
cp -r your-repo your-repo.backup

# 進入 repository 目錄
cd your-repo

# 清除所有 PDF 檔案
bfg --delete-files '*.pdf'

# 清除所有 JPG（如果也包含照片）
bfg --delete-files '*.jpg'

# 完成清理
git reflog expire --expire=now --all
git gc --aggressive --prune=now
```

#### 3. 強制推送回 GitHub

```bash
# ⚠️ 這個步驟會改寫歷史，謹慎操作
git push origin --force-with-lease

# 如果使用 --force-with-lease 失敗，改用 --force（但風險更高）
git push origin --force
```

#### 4. 通知協作者

如果有人已 clone 過舊版本，他們需要重新 clone：

```bash
# 協作者執行
cd your-repo
git fetch origin
git reset --hard origin/main
```

---

## 🔐 日常最佳實踐

### 1. 使用 `.gitignore` 預防

在添加任何新檔案前，確保在 `.gitignore` 中排除敏感目錄：

```bash
# 排除所有 PDF
docs/*.pdf

# 排除特定私人資料檔
data/private-*.js
data/budget-actual.js  # 如果包含真實消費

# 排除本地設定
.env
.env.local
```

### 2. 檢查 Commit 前

推送前執行：

```bash
# 檢查即將 commit 的檔案
git status

# 檢查分階段變更的內容
git diff --staged

# 如果不小心加入敏感檔案
git reset HEAD <sensitive-file>  # 從 staging 移除
git checkout -- <sensitive-file>  # 或直接放棄該檔案
```

### 3. 如果誤推敏感檔案

**立即執行**（不要等待）：

```bash
# 1. 刪除本地檔案
rm docs/flight-ticket.pdf

# 2. 從 git 移除
git rm --cached docs/flight-ticket.pdf

# 3. 更新 .gitignore
echo "docs/*.pdf" >> .gitignore

# 4. Commit 並推送
git add .gitignore
git commit -m "Remove sensitive files and update gitignore"
git push origin main

# 5. 後續：考慮用 BFG 清除歷史（見上節）
```

---

## 📋 檢查清單

建立新旅程時，使用此檢查清單確保隱私安全：

- [ ] 確認 `.gitignore` 存在且包含 `docs/*.pdf`
- [ ] 本地擁有敏感檔案的副本（不提交到 git）
- [ ] 在 `data/docs-content.js` 中只引用**非敏感的公開文件**（如景點介紹）
- [ ] 提交前執行 `git status` 確認無敏感檔案
- [ ] 在 README 或說明文件中提醒協作者隱私政策
- [ ] 定期檢查 git log 確認無意外 commit
- [ ] 如需共享旅行資訊，使用**私人雲端服務**（如 Google Drive、Dropbox）而非 GitHub

---

## 🆘 洩露後的應急措施

如果已不小心洩露敏感資訊：

1. **立即通知信用卡發卡機構**（如有卡號洩露）
2. **監測帳戶異常活動**
3. **更改相關密碼與 PINs**
4. **執行 BFG 清理** Repository 歷史（見上節）
5. **通知受影響的他人**（旅伴、旅館等）
6. **考慮將 Repository 設為私密** 或刪除 Repository

---

## 📞 更多資訊

- [GitHub 安全最佳實踐](https://docs.github.com/en/code-security)
- [BFG Repo-Cleaner 官方文檔](https://rtyley.github.io/bfg-repo-cleaner/)
- [Git 敏感資訊移除指南](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository)

---

**最後提醒：安全第一，方便第二。** 當有疑慮時，選擇保留敏感檔案在本地，寧可麻煩一些，也不要讓隱私冒風險。
