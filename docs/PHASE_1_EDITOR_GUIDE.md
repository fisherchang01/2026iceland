# 第一阶段编辑器使用指南

## 📋 概述

第一阶段包含两个编辑器：
- **travel-editor.html** - 编辑 travel-content.js（体验分类）
- **other-editor.html** - 编辑 other-content.js（其他分类）

两个编辑器功能完全相同，只是处理不同的数据文件。

---

## 🚀 快速开始

### 1. 部署编辑器

将两个 HTML 文件上传到网站的 `tools/` 文件夹：

```
2026iceland/
├── tools/
│   ├── travel-editor.html      ← 新上传
│   ├── other-editor.html       ← 新上传
│   └── trip-editor-pro.html    ← 既存
```

### 2. 访问编辑器

- **体验编辑器**：`https://fisherchang01.github.io/2026iceland/tools/travel-editor.html`
- **其他编辑器**：`https://fisherchang01.github.io/2026iceland/tools/other-editor.html`

---

## 📖 使用流程

### 步骤 1：准备 GitHub PAT

1. 前往 GitHub Settings → Developer settings → Personal access tokens
2. 生成新 token（勾选 `repo` 权限）
3. **复制 token 值**（只能看一次！）

### 步骤 2：打开编辑器

在浏览器中打开 `travel-editor.html` 或 `other-editor.html`

### 步骤 3：认证

1. 在右上角输入框粘贴 GitHub PAT
2. 点击回车或切换焦点
3. 状态显示「已认证」✓

### 步骤 4：读取内容

点击「读取 GitHub」按钮，编辑器会：
1. 从 GitHub 获取 `travel-content.js` 或 `other-content.js`
2. 解析 HTML 字符串
3. 显示分类和项目列表

### 步骤 5：编辑内容

1. **左侧**：选择分类
2. **中间上**：选择项目
3. **中间下**：编辑标题和描述
4. **右侧**：实时预览
5. 点击「保存此项目」

### 步骤 6：上传到 GitHub

1. 所有修改都保存在浏览器本地（localStorage）
2. 点击「上傳到 GitHub」推送更改
3. 编辑器会自动更新 GitHub 上的文件

---

## 🎯 编辑器功能详解

### 左侧面板：分类列表

显示所有分类及其项目数量：

```
🍜 雷市美食 (2)
🍲 冰岛美食 (1)
🥐 芬兰美食 (3)
...
```

点击分类名称可展开该分类的项目列表。

### 中间面板：编辑表单

#### 项目标题
- 显示当前编辑的项目标题
- 支持自由编辑
- **不能为空**

#### 详细描述
- 编辑项目的完整描述文本
- 支持以下标记语法（可选）：
  - `/n` - 换行
  - `{bold}..{/bold}` - **粗体**
  - `{italic}..{/italic}` - *斜体*
  - `{#ff0000}..{/color}` - <span style="color: #ff0000;">彩色文本</span>

**示例**：
```
这是一个{bold}重点{/bold}介绍。/n
这是新的一行，用{italic}斜体{/italic}强调。
{#0066cc}蓝色{/color}文字作为补充。
```

### 右侧面板：实时预览

当编辑标题或描述时，右侧面板会 **实时更新** 显示预览效果。

---

## 💾 数据保存流程

### localStorage 草稿管理

每个编辑器在浏览器本地存储草稿，格式为：

```javascript
{
  "0_0": { title: "新标题", detail: "新描述" },  // 第0个分类、第0个项目
  "0_1": { title: "...", detail: "..." },
  "1_0": { title: "...", detail: "..." },
  ...
}
```

**关键点**：
- 草稿自动保存在浏览器本地（不需要手动点击「保存草稿」）
- 刷新页面不会丢失草稿
- 关闭浏览器也不会丢失草稿
- 「保存此项目」会立即更新草稿

### GitHub 推送

点击「上傳到 GitHub」时：
1. 编辑器读取所有草稿
2. 重新生成 HTML 字符串
3. 通过 GitHub API 更新文件
4. 清空本地草稿
5. GitHub Pages 自动部署（通常 1-2 分钟）

---

## ⚠️ 常见问题

### Q: 编辑后没看到网站更新？

**A**: GitHub Pages 部署需要 1-2 分钟。可以：
1. 硬刷浏览器（Ctrl+Shift+R）
2. 打开浏览器开发者工具（F12）→ 清空缓存并硬刷新

### Q: 上传时报错「401」？

**A**: GitHub PAT 可能已过期或权限不足。检查：
1. PAT 是否还有效（前往 GitHub 检查）
2. PAT 是否包含 `repo` 权限
3. 删除旧 PAT，重新生成新的

### Q: 上传时报错「422」？

**A**: 文件结构可能不匹配。确保：
1. `travel-content.js` 中确实有 `const TRAVEL_HTML = \`...\`;`
2. `other-content.js` 中确实有 `const OTHER_HTML = \`...\`;`

### Q: 编辑框为空或没有加载？

**A**: 可能是 HTML 解析失败。检查：
1. GitHub 上的文件是否正确格式化
2. 浏览器控制台是否有错误信息
3. 尝试重新点击「读取 GitHub」

### Q: 如何恢复之前的版本？

**A**: 编辑器不支持版本控制，但可以：
1. 在 GitHub 上查看文件历史
2. 或在编辑器中手动改回

### Q: 能否删除或新增项目？

**A**: 第一阶段 **不支持**。只能编辑现有项目的文本。
- 删除项目需要在 GitHub 上手动编辑 HTML
- 新增项目需要第二阶段的编辑器（计划中）

---

## 🔧 技术细节（仅供参考）

### HTML 解析逻辑

编辑器使用正则表达式提取：

```javascript
// 分类提取
/<div class="travel-collapse" data-cover="([^"]*)".*?<div class="travel-collapse-title">([^<]*)<\/div>.*?<div class="travel-collapse-body">([\s\S]*?)<\/div>/

// 项目提取
/<div class="item-card.*?<h4 class="item-card-title">([^<]*)<\/h4>.*?<div class="item-detail">([\s\S]*?)<\/div>/
```

### Base64 编码

上传到 GitHub 时，内容被转换为 Base64：

```javascript
btoa(unescape(encodeURIComponent(newContent)))
```

这是 GitHub API 的要求，确保 UTF-8 字符正确处理。

---

## ✅ 检查清单

部署前确保：

- [ ] 两个 HTML 文件已上传到 `tools/` 文件夹
- [ ] 生成了有效的 GitHub PAT（有 `repo` 权限）
- [ ] 在编辑器中成功认证
- [ ] 可以读取 GitHub 上的内容
- [ ] 能够编辑和预览
- [ ] 可以成功上传回 GitHub
- [ ] GitHub Pages 已显示新内容（1-2 分钟后）

---

## 📞 故障排查

如果遇到问题，检查以下步骤：

1. **打开浏览器控制台**（F12）
   - 查看是否有错误信息
   - 检查 Network 标签中的 API 请求

2. **验证 GitHub PAT**
   - 复制 token 值并确保没有多余空格
   - 检查 token 是否过期或被撤销

3. **检查文件格式**
   - 确保 `travel-content.js` 和 `other-content.js` 在 `data/` 文件夹
   - 确保文件包含正确的 `TRAVEL_HTML` 或 `OTHER_HTML` 定义

4. **重新加载**
   - 刷新页面（Ctrl+R）
   - 清空 localStorage：在控制台执行 `localStorage.clear()`
   - 重新开始

---

## 🎓 下一步（第二阶段计划）

第二阶段将添加：
- 🛍️ **商店购物编辑器** - 新增项目、编辑内容
- 📸 **图片上传** - 为项目添加或替换图片
- 🗑️ **删除项目** - 移除不需要的项目
- 🔄 **项目复制** - 快速复制现有项目

---

**版本**：1.0  
**最后更新**：2026年8月  
**状态**：稳定版
