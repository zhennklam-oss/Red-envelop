# Vercel 部署故障排查指南

## 🔍 上传失败问题诊断

如果在 Vercel 部署后上传图片失败，请按以下步骤排查：

### 步骤 1：检查 Blob 存储是否已创建

1. 登录 [Vercel Dashboard](https://vercel.com/dashboard)
2. 进入您的项目
3. 点击 "Storage" 标签
4. 确认是否有 Blob 存储（如 `surprise-blob`）

**如果没有**：
- 点击 "Create Database"
- 选择 "Blob"
- 输入名称并创建

### 步骤 2：检查环境变量

1. 在项目页面点击 "Settings"
2. 点击 "Environment Variables"
3. 确认以下变量存在：
   - `BLOB_READ_WRITE_TOKEN` - 由 Blob 存储自动注入
   - `ADMIN_KEY`（可选）- 如果您设置了自定义密钥

**如果缺少 BLOB_READ_WRITE_TOKEN**：
- 返回 Storage 标签
- 点击您的 Blob 存储
- 点击 "Connect to Project"
- 选择您的项目并连接

### 步骤 3：重新部署

环境变量更改后需要重新部署：

1. 进入 "Deployments" 标签
2. 点击最新部署右侧的三个点 (...)
3. 选择 "Redeploy"
4. 勾选 "Use existing Build Cache"（可选）
5. 点击 "Redeploy"

### 步骤 4：使用调试 API 检查配置

访问以下 URL 检查环境配置：

```
https://your-app.vercel.app/api/debug
```

应该返回类似这样的 JSON：

```json
{
  "hasBlobToken": true,
  "hasAdminKey": false,
  "nodeVersion": "v20.x.x",
  "vercelEnv": "production"
}
```

**关键检查**：
- `hasBlobToken` 必须为 `true`
- 如果为 `false`，说明 Blob 存储未正确连接

### 步骤 5：检查浏览器控制台

1. 在浏览器中按 F12 打开开发者工具
2. 切换到 "Console" 标签
3. 尝试上传图片
4. 查看是否有错误信息

**常见错误**：

- `403 Forbidden` → 管理员密钥错误
- `500 Internal Server Error` → Blob 存储未配置
- `Network Error` → CORS 或网络问题

### 步骤 6：查看 Vercel 日志

1. 进入 "Deployments" 标签
2. 点击最新的部署
3. 点击 "Functions" 标签
4. 找到 `/api/image` 函数
5. 查看实时日志

---

## 🛠️ 常见问题解决方案

### 问题 1：上传时显示 "保存失败"

**原因**：Blob 存储未配置或环境变量缺失

**解决方案**：
1. 确认 Blob 存储已创建
2. 确认 `BLOB_READ_WRITE_TOKEN` 环境变量存在
3. 重新部署项目

### 问题 2：上传后显示 "Unauthorized"

**原因**：管理员密钥不匹配

**解决方案**：
1. 检查 URL 中的 `key` 参数是否正确
2. 如果设置了 `ADMIN_KEY` 环境变量，确保与 URL 中的一致
3. 默认密钥是 `creator_secret_123`

### 问题 3：图片上传成功但无法显示

**原因**：Blob URL 未正确返回或存储

**解决方案**：
1. 检查 Blob 存储中是否有文件
2. 访问 `/api/image` 查看返回的数据
3. 确认返回的 URL 可以直接访问

### 问题 4：本地开发正常，Vercel 部署失败

**原因**：本地使用 SQLite，Vercel 使用 Blob

**解决方案**：
1. 确保 Blob 存储已正确配置
2. 检查 `api/image.js` 文件是否正确上传
3. 确认 `package.json` 中包含 `@vercel/blob` 依赖

---

## 📋 完整检查清单

部署前请确认：

- ✅ 代码已推送到 GitHub
- ✅ Vercel 项目已创建
- ✅ Blob 存储已创建
- ✅ Blob 存储已连接到项目
- ✅ `BLOB_READ_WRITE_TOKEN` 环境变量存在
- ✅ 项目已重新部署
- ✅ `/api/debug` 返回 `hasBlobToken: true`

---

## 🔧 手动测试 API

### 测试 GET 请求

在浏览器中访问：
```
https://your-app.vercel.app/api/image
```

应该返回：
```json
{
  "image": null
}
```
或
```json
{
  "image": "https://blob-url.vercel-storage.com/..."
}
```

### 测试 POST 请求

使用 curl 或 Postman：

```bash
curl -X POST https://your-app.vercel.app/api/image \
  -H "Content-Type: application/json" \
  -d '{
    "key": "creator_secret_123",
    "image": "data:image/png;base64,iVBORw0KG..."
  }'
```

应该返回：
```json
{
  "success": true,
  "url": "https://blob-url.vercel-storage.com/..."
}
```

---

## 📞 仍然无法解决？

如果按照以上步骤仍然无法解决，请：

1. **检查 Vercel 函数日志**
   - Deployments → 最新部署 → Functions → /api/image
   - 查看详细错误信息

2. **访问调试 API**
   - `https://your-app.vercel.app/api/debug`
   - 截图配置信息

3. **检查 Blob 存储状态**
   - Storage → 您的 Blob → 查看是否有文件
   - 确认存储配额未超限

4. **联系支持**
   - Vercel 文档：[vercel.com/docs](https://vercel.com/docs)
   - Vercel 支持：[vercel.com/support](https://vercel.com/support)

---

## 💡 临时解决方案

如果急需使用，可以考虑：

1. **使用其他图床服务**
   - 修改代码使用 Imgur、Cloudinary 等
   - 或使用 GitHub Issues 作为图床

2. **本地部署**
   - 使用内网穿透（cpolar、ngrok）
   - 参考 `内网穿透配置说明.md`

3. **使用其他平台**
   - Railway、Render、Fly.io 等
   - 这些平台支持持久化存储

祝您顺利解决问题！🎉
