# 杨汉准备的惊喜红包 - 完整使用说明

## 📦 项目简介

这是一个节日主题的红包应用，允许创建者上传照片和音乐，然后通过分享链接让其他人打开"红包"查看惊喜。

### 主要功能
- 📸 上传照片
- 🎵 上传背景音乐（WAV、MP3、OGG、WEBM）
- 🎬 精美的红包打开动画
- 💥 照片爆炸特效
- 🔗 一键分享链接

---

## 🚀 快速开始

### 本地运行

1. **安装依赖**
   ```bash
   npm install
   ```

2. **启动服务器**
   ```bash
   npm run dev
   ```

3. **访问应用**
   - 本地访问: `http://localhost:3000`
   - 创建者模式: `http://localhost:3000?key=creator_secret_123`

---

## 📝 使用指南

### 创建者模式（上传内容）

1. **访问创建者链接**
   ```
   http://your-domain.com?key=creator_secret_123
   ```

2. **上传照片**
   - 点击"选择并上传照片"按钮
   - 选择一张图片
   - 等待上传完成

3. **上传音乐（可选）**
   - 点击"上传背景音乐"按钮
   - 选择音频文件（WAV、MP3、OGG、WEBM）
   - 建议文件大小 < 10MB

4. **分享链接**
   - 点击"复制分享链接"
   - 发送给朋友

### 访客模式（查看惊喜）

1. **打开分享链接**
   - 看到精美的红包界面

2. **打开红包**
   - 点击红包上的"開"按钮

3. **观看动画**
   - 照片弹出并停留 3 秒
   - 照片放大到铺满屏幕（2 秒）
   - 照片爆炸，碎片四散
   - 红包中央显示"BOOM!"文字
   - 背景音乐同时播放

---

## 🌐 部署方式

### 方式一：本地部署（局域网访问）

适合在同一 WiFi 网络下分享。

1. 启动服务器
   ```bash
   npm run dev
   ```

2. 查看局域网地址
   ```
   局域网访问: http://192.168.x.x:3000
   ```

3. 分享链接给同一网络的朋友

### 方式二：内网穿透（跨网络访问）

使用内网穿透服务让不同网络的朋友也能访问。

#### 推荐工具

| 工具 | 优点 | 适用场景 |
|------|------|----------|
| **cpolar** | 国内服务，稳定 | 国内用户 |
| **ngrok** | 速度快，功能强 | 国外用户 |
| **localtunnel** | 完全免费，无需注册 | 临时使用 |

#### 使用 cpolar（推荐国内用户）

1. 访问 [cpolar.com](https://www.cpolar.com/) 注册并下载

2. 启动 cpolar
   ```bash
   cpolar http 3000
   ```

3. 获取公网地址（如 `http://abc123.cpolar.cn`）

4. 创建 `.env` 文件
   ```bash
   PUBLIC_URL="http://abc123.cpolar.cn"
   ```

5. 重启应用
   ```bash
   npm run dev
   ```

#### 使用 localtunnel（最简单）

1. 安装
   ```bash
   npm install -g localtunnel
   ```

2. 启动应用
   ```bash
   npm run dev
   ```

3. 在另一个终端启动 localtunnel
   ```bash
   lt --port 3000
   ```

4. 获取公网地址并配置 `.env`

### 方式三：Vercel 部署（推荐）

永久在线，全球访问。

#### 部署步骤

1. **推送代码到 GitHub**
   ```bash
   git add .
   git commit -m "准备部署"
   git push
   ```

2. **导入到 Vercel**
   - 访问 [vercel.com](https://vercel.com)
   - 点击 "New Project"
   - 选择您的 GitHub 仓库
   - 点击 "Import"

3. **创建 Blob 存储**
   - 在项目页面点击 "Storage" 标签
   - 点击 "Create Database"
   - 选择 "Blob"
   - 输入名称（如 `surprise-blob`）
   - **重要**：选择 "Public" 访问模式
   - 点击 "Create"

4. **连接到项目**
   - 点击创建的 Blob 存储
   - 点击 "Connect to Project"
   - 选择您的项目

5. **部署**
   - Vercel 会自动部署
   - 等待构建完成
   - 获得公网地址（如 `https://your-app.vercel.app`）

#### Vercel 故障排查

**问题：上传失败**

1. 检查 Blob 存储是否已创建
2. 确认 Blob 访问模式为 "Public"
3. 检查环境变量 `BLOB_READ_WRITE_TOKEN` 是否存在
4. 重新部署项目

**问题：显示 "access must be public" 错误**

- 删除现有 Blob 存储
- 重新创建，确保选择 "Public" 模式

**调试工具**

访问 `https://your-app.vercel.app/api/debug` 查看配置状态。

---

## 🎬 动画效果说明

### 动画流程

1. **初始显示（0-3秒）**
   - 照片从红包中弹出
   - 停留在红包上方 3 秒

2. **放大阶段（3-5秒）**
   - 照片放大到 5 倍
   - 几乎铺满整个屏幕
   - 持续 2 秒

3. **爆炸阶段（5秒后）**
   - 照片爆炸成 20 个碎片
   - 碎片向四周飞散
   - 红包中央显示"BOOM!"文字
   - 碎片逐渐消失

### 技术实现

- 使用 Framer Motion 实现流畅动画
- 碎片随机方向和旋转
- 平滑的缩放和淡出效果

---

## 🎵 音乐功能

### 支持格式

| 格式 | 优点 | 缺点 | 推荐度 |
|------|------|------|--------|
| MP3 | 兼容性好，文件小 | 有损压缩 | ⭐⭐⭐⭐⭐ |
| WAV | 无损音质 | 文件很大 | ⭐⭐ |
| OGG | 音质好，文件小 | 部分浏览器不支持 | ⭐⭐⭐⭐ |
| WEBM | 网页优化 | 较新格式 | ⭐⭐⭐⭐ |

### 使用建议

- **文件大小**：< 10MB
- **比特率**：128kbps（足够清晰）
- **时长**：30秒 - 2分钟
- **类型**：轻快、喜庆的音乐

### 压缩工具

- [Online Audio Converter](https://online-audio-converter.com/)
- [CloudConvert](https://cloudconvert.com/audio-converter)
- Audacity（桌面软件）

---

## ⚙️ 配置说明

### 环境变量

创建 `.env` 文件：

```bash
# 公网访问地址（可选）
PUBLIC_URL="https://your-public-url.com"

# 管理员密钥（可选，默认为 creator_secret_123）
ADMIN_KEY="your_custom_key"
```

### 修改管理员密钥

1. 修改 `src/App.tsx` 第 10 行
   ```typescript
   const ADMIN_KEY = "your_new_key";
   ```

2. 修改 `api/image.js` 第 45 行
   ```javascript
   if (key !== process.env.ADMIN_KEY && key !== 'your_new_key') {
   ```

3. 重启服务器

---

## 🔧 技术栈

- **前端**：React + TypeScript + Tailwind CSS + Framer Motion
- **后端**：Express + Node.js
- **数据库**：
  - 本地：SQLite
  - Vercel：Blob Storage
- **构建工具**：Vite

---

## 📁 项目结构

```
red/
├── api/                    # Vercel Serverless Functions
│   ├── image.js           # 图片和音乐 API
│   ├── server-info.js     # 服务器信息 API
│   └── debug.js           # 调试 API
├── src/                   # React 前端代码
│   ├── App.tsx            # 主组件
│   ├── main.tsx           # 入口文件
│   └── index.css          # 样式文件
├── index.html             # HTML 模板
├── server.ts              # 本地开发服务器
├── vercel.json            # Vercel 配置
├── package.json           # 依赖配置
└── README.md              # 本文档
```

---

## ⚠️ 注意事项

### 安全性

1. **保护管理员密钥**
   - 不要公开分享创建者链接
   - 定期更换密钥

2. **数据隐私**
   - 照片和音乐存储在服务器
   - 本地开发：SQLite 数据库
   - Vercel 部署：Blob 存储

### 性能

1. **文件大小限制**
   - 图片：建议 < 5MB
   - 音乐：建议 < 10MB
   - Vercel Blob 单文件最大 500MB

2. **浏览器兼容性**
   - 支持现代浏览器（Chrome、Safari、Firefox、Edge）
   - 移动端浏览器

### 免费额度

**Vercel 免费计划**：
- 100GB 带宽/月
- 无限部署
- 自动 HTTPS

**Vercel Blob 免费计划**：
- 1GB 存储
- 100GB 带宽/月

---

## 🐛 常见问题

### Q: 音乐无法播放？

**A:**
- 浏览器可能阻止了自动播放
- 确保音频格式支持（推荐 MP3）
- 检查文件是否损坏

### Q: 上传失败？

**A:**
- 检查文件大小是否超限
- 确认网络连接正常
- Vercel 部署：检查 Blob 存储配置

### Q: 动画卡顿？

**A:**
- 压缩图片和音频文件
- 检查网络速度
- 尝试更换浏览器

### Q: 如何自定义域名？

**A:**
- Vercel 项目设置 → Domains
- 添加您的域名
- 按照提示配置 DNS

---

## 🎯 自定义建议

### 调整动画时间

修改 `src/App.tsx` 中的 setTimeout 延迟：

```typescript
setTimeout(() => setAnimationStage('expand'), 3100); // 改为 5100 停留 5 秒
```

### 调整碎片数量

修改碎片生成代码：

```typescript
const newFragments = Array.from({ length: 30 }, () => ({ // 改为 30 个碎片
```

### 修改爆炸文字

修改 BOOM 文字：

```typescript
<h1 className="text-8xl font-black text-[#FFD700]">哇！</h1>
```

---

## 📞 技术支持

### 遇到问题？

1. 检查浏览器控制台错误信息
2. 查看 Vercel 函数日志
3. 访问调试 API：`/api/debug`

### 相关链接

- Vercel 文档：[vercel.com/docs](https://vercel.com/docs)
- Vercel Blob 文档：[vercel.com/docs/storage/vercel-blob](https://vercel.com/docs/storage/vercel-blob)
- Framer Motion 文档：[framer.com/motion](https://www.framer.com/motion/)

---

## 🎉 更新日志

### v2.0 - 爆炸特效版本
- ✨ 添加照片爆炸动画
- 💥 碎片飞散效果
- 🎵 背景音乐支持
- 🎨 优化视觉效果

### v1.0 - 初始版本
- 📸 基础照片上传
- 🎁 红包打开动画
- 🔗 链接分享功能

---

## 📄 许可证

Apache-2.0 License

---

祝您使用愉快！🎊
