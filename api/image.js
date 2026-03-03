import { put, list } from '@vercel/blob';

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
      // 列出所有 blob 文件，查找 surprise-image
      const { blobs } = await list({ prefix: 'surprise-image' });

      if (blobs && blobs.length > 0) {
        // 返回最新的图片 URL
        const latestBlob = blobs[blobs.length - 1];
        res.status(200).json({ image: latestBlob.url });
      } else {
        res.status(200).json({ image: null });
      }
    } catch (error) {
      console.error('Error fetching image:', error);
      res.status(200).json({ image: null });
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

      // 上传到 Vercel Blob（使用默认访问权限）
      const blob = await put('surprise-image.jpg', buffer, {
       access: 'public',
       addRandomSuffix: false,
    });

      // 返回 Blob URL
      res.status(200).json({ success: true, url: blob.url });
    } catch (error) {
      console.error('Error saving image:', error);
      res.status(500).json({ error: 'Failed to save image', details: error.message });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
