import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";
import { networkInterfaces } from "os";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("surprise.db");
db.exec(`
  CREATE TABLE IF NOT EXISTS images (
    id INTEGER PRIMARY KEY,
    data TEXT NOT NULL
  )
`);

// 获取本地IP地址
function getLocalIP() {
  const nets = networkInterfaces();
  for (const name of Object.keys(nets)) {
    for (const net of nets[name]!) {
      // 跳过内部地址和非IPv4地址
      if (net.family === 'IPv4' && !net.internal) {
        return net.address;
      }
    }
  }
  return 'localhost';
}

async function startServer() {
  const app = express();
  const PORT = 3000;
  const localIP = getLocalIP();

  // 优先使用环境变量中的公网地址，否则使用局域网IP
  const publicUrl = process.env.PUBLIC_URL || `http://${localIP}:${PORT}`;

  app.use(express.json({ limit: '10mb' }));

  // API to get server info (IP address and port)
  app.get("/api/server-info", (req, res) => {
    res.json({
      ip: localIP,
      port: PORT,
      shareUrl: publicUrl,
      isPublic: !!process.env.PUBLIC_URL
    });
  });

  // API to get the current surprise image
  app.get("/api/image", (req, res) => {
    const row = db.prepare("SELECT data FROM images ORDER BY id DESC LIMIT 1").get() as { data: string } | undefined;
    res.json({ image: row?.data || null });
  });

  // API to save a new surprise image (only if admin key matches)
  app.post("/api/image", (req, res) => {
    const { image, key } = req.body;
    // Simple admin key check
    if (key !== "creator_secret_123") {
      return res.status(403).json({ error: "Unauthorized" });
    }
    
    if (!image) {
      return res.status(400).json({ error: "No image provided" });
    }

    // Replace the existing image or add new one
    db.prepare("DELETE FROM images").run();
    db.prepare("INSERT INTO images (data) VALUES (?)").run(image);
    
    res.json({ success: true });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`\n========================================`);
    console.log(`🎉 红包惊喜服务器已启动！`);
    console.log(`========================================`);
    console.log(`本地访问: http://localhost:${PORT}`);
    console.log(`局域网访问: http://${localIP}:${PORT}`);

    if (process.env.PUBLIC_URL) {
      console.log(`\n🌐 公网访问: ${publicUrl}`);
      console.log(`\n创建者链接: ${publicUrl}?key=creator_secret_123`);
      console.log(`分享链接: ${publicUrl}`);
      console.log(`\n✅ 已启用公网访问模式，任何人都可以通过公网链接访问`);
    } else {
      console.log(`\n创建者链接: http://${localIP}:${PORT}?key=creator_secret_123`);
      console.log(`分享链接: http://${localIP}:${PORT}`);
      console.log(`\n💡 提示: 当前仅支持局域网访问`);
      console.log(`   如需公网访问，请配置 PUBLIC_URL 环境变量`);
      console.log(`   参考: 内网穿透配置说明.md`);
    }

    console.log(`========================================\n`);
  });
}

startServer();
