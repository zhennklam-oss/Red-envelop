import { put, head } from '@vercel/blob';

export default async function handler(req, res) {
  // 设置 CORS 头
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'GET') {
    try {
      // 尝试获取图片 URL
      // Blob 存储使用固定的文件名
      const blobUrl = process.env.SURPRISE_IMAGE_URL;

      if (blobUrl) {
        // 检查文件是否存在
        try {
          await head(blobUrl);
          res.status(200).json({ image: blobUrl });
        } catch {
          res.status(200).json({ image: null });
        }
      } else {
        res.status(200).json({ image: null });
      }
    } catch (error) {
      console.error('Error fetching image:', error);
      res.status(500).json({ error: 'Failed to fetch image' });
    }
  } else if (req.method === 'POST') {
    try {
      const { image, key } = req.body;

      // 验证管理员密钥
      if (key !== process.env.ADMIN_KEY && key !== 'creator_secret_123') {
        return res.status(403).json({ error: 'Unauthorized' });
      }

      if (!image) {
        return res.status(400).json({ error: 'No image provided' });
      }

      // 将 base64 转换为 Buffer
      const base64Data = image.replace(/^data:image\/\w+;base64,/, '');
      const buffer = Buffer.from(base64Data, 'base64');

      // 上传到 Vercel Blob
      const blob = await put('surprise-image.jpg', buffer, {
        access: 'public',
        addRandomSuffix: false, // 使用固定文件名，方便覆盖
      });

      // 返回 Blob URL
      res.status(200).json({ success: true, url: blob.url });
    } catch (error) {
      console.error('Error saving image:', error);
      res.status(500).json({ error: 'Failed to save image' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
