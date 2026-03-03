# Vercel 部署说明

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

3. **配置环境变量**

   在 Vercel 项目设置中添加以下环境变量：

   - `ADMIN_KEY`: 管理员密钥（例如：`creator_secret_123`）
   - `PUBLIC_URL`: 留空（Vercel 会自动使用部署域名）

4. **配置 Vercel KV 数据库**

   - 在 Vercel 项目页面，点击 "Storage" 标签
   - 点击 "Create Database"
   - 选择 "KV" (Key-Value Store)
   - 输入数据库名称（如 `surprise-db`）
   - 点击 "Create"
   - Vercel 会自动注入 KV 环境变量到您的项目

5. **部署**
   - 点击 "Deploy"
   - 等待构建完成
   - 访问分配的域名（如 `https://your-app.vercel.app`）

---

### 方法二：使用 Vercel CLI 部署

1. **安装 Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **登录 Vercel**
   ```bash
   vercel login
   ```

3. **部署**
   ```bash
   vercel
   ```

4. **配置环境变量**
   ```bash
   vercel env add ADMIN_KEY
   # 输入您的管理员密钥
   ```

5. **配置 KV 数据库**
   - 访问 Vercel 控制台
   - 按照上述方法一的步骤 4 配置

6. **重新部署**
   ```bash
   vercel --prod
   ```

---

## 📋 部署前检查清单

- ✅ 代码已推送到 GitHub
- ✅ `vercel.json` 配置文件已创建
- ✅ `api/` 目录下的 Serverless Functions 已创建
- ✅ `package.json` 中已添加 `@vercel/kv` 依赖
- ✅ 构建命令设置为 `npm run build`
- ✅ 输出目录设置为 `dist`

---

## 🔧 Vercel 配置说明

### vercel.json

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "/api/:path*"
    },
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### 环境变量

| 变量名 | 说明 | 示例 |
|--------|------|------|
| `ADMIN_KEY` | 管理员密钥 | `creator_secret_123` |
| `PUBLIC_URL` | 公网地址（可选） | 留空，Vercel 自动处理 |
| `KV_*` | Vercel KV 变量 | 自动注入 |

---

## 📁 项目结构变化

```
red/
├── api/                    # Vercel Serverless Functions
│   ├── image.js           # 图片上传/获取 API
│   └── server-info.js     # 服务器信息 API
├── src/                   # React 前端代码
├── dist/                  # 构建输出（自动生成）
├── vercel.json            # Vercel 配置
├── server.ts              # 本地开发服务器（Vercel 不使用）
└── package.json
```

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
- 等待上传完成

### 4. 分享链接

- 点击"复制分享链接"
- 分享给任何人（全球可访问）

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

### 手动部署

```bash
vercel --prod
```

---

## ⚠️ 重要注意事项

### 1. 数据存储

- **本地开发**：使用 SQLite 数据库（`surprise.db`）
- **Vercel 部署**：使用 Vercel KV（云端 Key-Value 存储）
- 两者数据不互通，需要分别管理

### 2. 文件大小限制

- Vercel Serverless Functions 有请求体大小限制（默认 4.5MB）
- 建议上传的图片不超过 2MB
- 可以在前端添加图片压缩功能

### 3. 免费额度

Vercel 免费计划包括：
- ✅ 100GB 带宽/月
- ✅ 无限部署
- ✅ 自动 HTTPS
- ✅ 全球 CDN

Vercel KV 免费计划：
- ✅ 256MB 存储
- ✅ 3000 次请求/天

### 4. 自定义域名

在 Vercel 项目设置中可以添加自定义域名：
1. 进入项目设置
2. 点击 "Domains"
3. 添加您的域名
4. 按照提示配置 DNS

---

## 🐛 常见问题

### Q: 部署后无法上传图片？

**A:** 检查以下几点：
1. Vercel KV 数据库是否已创建并连接
2. 环境变量 `ADMIN_KEY` 是否已设置
3. 图片大小是否超过限制

### Q: API 返回 404 错误？

**A:** 确保：
1. `api/` 目录下的文件存在
2. `vercel.json` 配置正确
3. 重新部署项目

### Q: 本地开发和 Vercel 部署如何切换？

**A:**
- **本地开发**：运行 `npm run dev`（使用 SQLite）
- **Vercel 部署**：自动使用 Vercel KV
- 代码会自动检测环境

### Q: 如何查看 Vercel KV 中的数据？

**A:**
1. 进入 Vercel 项目页面
2. 点击 "Storage" 标签
3. 选择您的 KV 数据库
4. 可以查看和管理存储的数据

---

## 📊 性能优化建议

1. **图片压缩**
   - 在前端添加图片压缩功能
   - 使用 `browser-image-compression` 库

2. **CDN 加速**
   - Vercel 自动提供全球 CDN
   - 静态资源自动缓存

3. **缓存策略**
   - 设置合适的缓存头
   - 减少 API 调用次数

---

## 🔐 安全建议

1. **保护管理员密钥**
   - 不要在代码中硬编码
   - 使用环境变量
   - 定期更换密钥

2. **HTTPS**
   - Vercel 自动提供 HTTPS
   - 强制使用 HTTPS 访问

3. **访问控制**
   - 考虑添加访问频率限制
   - 防止恶意上传

---

## 📞 获取帮助

- Vercel 文档：[vercel.com/docs](https://vercel.com/docs)
- Vercel KV 文档：[vercel.com/docs/storage/vercel-kv](https://vercel.com/docs/storage/vercel-kv)
- GitHub Issues：提交问题到您的仓库

祝您部署顺利！🎉
