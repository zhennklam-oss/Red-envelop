# Vercel 部署说明（使用 Blob 存储）

## 🚀 快速部署到 Vercel

### 方法一：通过 Vercel 网站部署（推荐）

1. **推送代码到 GitHub**
   ```bash
   git add .
   git commit -m "准备部署到 Vercel"
   git push
   ```

2. **导入到 Vercel**

   - 访问 [vercel.com](https://vercel.com)
   - 点击 "New Project"
   - 选择您的 GitHub 仓库
   - 点击 "Import"

3. **配置 Vercel Blob 存储**

   - 在 Vercel 项目页面，点击 "Storage" 标签
   - 点击 "Create Database"
   - 选择 "Blob" (文件存储)
   - 输入存储名称（如 `surprise-blob`）
   - 点击 "Create"
   - Vercel 会自动注入 Blob 环境变量到您的项目

4. **配置环境变量（可选）**

   在 Vercel 项目设置中添加以下环境变量：

   - `ADMIN_KEY`: 管理员密钥（例如：`creator_secret_123`）
   - `PUBLIC_URL`: 留空（Vercel 会自动使用部署域名）

5. **部署**
   - 点击 "Deploy"
   - 等待构建完成
   - 访问分配的域名（如 `https://your-app.vercel.app`）

---

## 📋 详细配置步骤

### 步骤 1：创建 Blob 存储

1. 进入您的 Vercel 项目
2. 点击顶部的 "Storage" 标签
3. 点击 "Create Database" 按钮
4. 选择 "Blob" 选项
5. 填写存储名称（例如：`surprise-blob`）
6. 点击 "Create" 按钮

### 步骤 2：连接 Blob 到项目

创建后，Vercel 会自动将以下环境变量注入到您的项目：

- `BLOB_READ_WRITE_TOKEN` - 读写权限令牌

这些变量会自动在部署时可用，无需手动配置。

### 步骤 3：重新部署

如果您在部署后才创建 Blob 存储：

1. 进入 "Deployments" 标签
2. 点击最新部署右侧的三个点
3. 选择 "Redeploy"
4. 确认重新部署

---

## 🌐 使用部署后的应用

### 1. 获取您的应用地址

部署成功后，Vercel 会分配一个域名，例如：
```
https://your-app.vercel.app
```

### 2. 创建者模式

访问带管理员密钥的链接：
```
https://your-app.vercel.app?key=creator_secret_123
```

### 3. 上传照片

- 点击"选择并上传照片"
- 选择图片并上传
- 照片会自动存储到 Vercel Blob
- 等待上传完成

### 4. 分享链接

- 点击"复制分享链接"
- 分享给任何人（全球可访问）
- 图片通过 Vercel CDN 加速访问

---

## 📊 Vercel Blob 说明

### 什么是 Blob？

Vercel Blob 是专为文件存储设计的服务：

- ✅ 支持任意文件类型（图片、视频、文档等）
- ✅ 自动 CDN 加速，全球快速访问
- ✅ 简单的 API，易于使用
- ✅ 按需付费，免费额度充足

### 免费额度

Vercel Blob 免费计划包括：

- **存储空间**：1GB
- **带宽**：100GB/月
- **请求次数**：无限制

对于红包应用来说，免费额度完全够用！

### 与 KV 的区别

| 特性 | Blob | KV |
|------|------|-----|
| 用途 | 文件存储 | 键值对数据 |
| 适合 | 图片、视频、文档 | 配置、缓存、简单数据 |
| 大小限制 | 500MB/文件 | 1MB/键 |
| 访问方式 | URL 直接访问 | API 读取 |
| CDN | ✅ 自动 | ❌ 需手动 |

**对于我们的红包应用，Blob 是更好的选择！**

---

## 🔧 常见问题

### Q: 为什么我的 Storage 里没有 KV 选项？

**A:** Vercel KV 可能因地区或计划限制不可用。使用 Blob 存储是更好的选择，因为：
- Blob 专为文件存储设计
- 自动 CDN 加速
- 更大的存储空间
- 更适合图片存储

### Q: 上传的图片存储在哪里？

**A:** 图片存储在 Vercel Blob 中，文件名为 `surprise-image.jpg`。每次上传新图片会自动覆盖旧图片。

### Q: 图片大小有限制吗？

**A:**
- Vercel Blob 单文件最大 500MB
- 建议上传的图片不超过 5MB
- 可以在前端添加图片压缩功能

### Q: 如何查看 Blob 中的文件？

**A:**
1. 进入 Vercel 项目页面
2. 点击 "Storage" 标签
3. 选择您的 Blob 存储
4. 可以查看所有上传的文件

### Q: 如何删除旧图片？

**A:**
- 上传新图片会自动覆盖旧图片
- 也可以在 Vercel Blob 管理界面手动删除

### Q: 部署后无法上传图片？

**A:** 检查以下几点：
1. Vercel Blob 是否已创建并连接
2. 环境变量 `BLOB_READ_WRITE_TOKEN` 是否存在
3. 重新部署项目
4. 检查浏览器控制台是否有错误

---

## 🔄 更新应用

### 自动部署

Vercel 会自动监听 GitHub 仓库的变化：

1. 修改代码
2. 提交并推送到 GitHub
   ```bash
   git add .
   git commit -m "更新功能"
   git push
   ```
3. Vercel 自动构建和部署

---

## 📁 项目结构

```
red/
├── api/                    # Vercel Serverless Functions
│   ├── image.js           # 图片上传/获取 API（使用 Blob）
│   └── server-info.js     # 服务器信息 API
├── src/                   # React 前端代码
├── dist/                  # 构建输出（自动生成）
├── vercel.json            # Vercel 配置
├── server.ts              # 本地开发服务器（Vercel 不使用）
└── package.json
```

---

## ⚠️ 重要注意事项

### 1. 数据存储

- **本地开发**：使用 SQLite 数据库（`surprise.db`）
- **Vercel 部署**：使用 Vercel Blob（云端文件存储）
- 两者数据不互通，需要分别管理

### 2. 图片访问

- Blob 存储的图片有公开 URL
- 通过 Vercel CDN 全球加速
- 访问速度快，无需额外配置

### 3. 成本控制

- 免费额度：1GB 存储 + 100GB 带宽/月
- 建议压缩图片以节省空间和带宽
- 超出免费额度会自动计费

---

## 🎯 最佳实践

### 1. 图片优化

在前端添加图片压缩：

```bash
npm install browser-image-compression
```

### 2. 错误处理

- 上传失败时显示友好提示
- 添加重试机制
- 记录错误日志

### 3. 安全性

- 保护管理员密钥
- 使用环境变量
- 定期更换密钥

---

## 📞 获取帮助

- Vercel 文档：[vercel.com/docs](https://vercel.com/docs)
- Vercel Blob 文档：[vercel.com/docs/storage/vercel-blob](https://vercel.com/docs/storage/vercel-blob)
- GitHub Issues：提交问题到您的仓库

祝您部署顺利！🎉
