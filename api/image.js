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
      // 列出所有 blob 文件
      const { blobs } = await list();

      let imageUrl = null;
      let musicUrl = null;

      // 查找图片和音乐文件
      for (const blob of blobs) {
        if (blob.pathname.startsWith('surprise-image')) {
          imageUrl = blob.url;
        } else if (blob.pathname.startsWith('surprise-music')) {
          musicUrl = blob.url;
        }
      }

      res.status(200).json({ image: imageUrl, music: musicUrl });
    } catch (error) {
      console.error('Error fetching data:', error);
      res.status(200).json({ image: null, music: null });
    }
  } else if (req.method === 'POST') {
    try {
      const { image, music, key } = req.body;

      // 验证管理员密钥
      if (key !== process.env.ADMIN_KEY && key !== 'creator_secret_123') {
        return res.status(403).json({ error: 'Unauthorized' });
      }

      const result = { success: true };

      // 上传图片
      if (image) {
        const base64Data = image.replace(/^data:image\/\w+;base64,/, '');
        const buffer = Buffer.from(base64Data, 'base64');

        const blob = await put('surprise-image.jpg', buffer, {
          access: 'public',
          addRandomSuffix: false,
        });

        result.imageUrl = blob.url;
      }

      // 上传音乐
      if (music) {
        const base64Data = music.replace(/^data:audio\/\w+;base64,/, '');
        const buffer = Buffer.from(base64Data, 'base64');

        // 检测音频格式
        let extension = 'mp3';
        if (music.includes('audio/wav')) extension = 'wav';
        else if (music.includes('audio/ogg')) extension = 'ogg';
        else if (music.includes('audio/webm')) extension = 'webm';

        const blob = await put(`surprise-music.${extension}`, buffer, {
          access: 'public',
          addRandomSuffix: false,
        });

        result.musicUrl = blob.url;
      }

      res.status(200).json(result);
    } catch (error) {
      console.error('Error saving data:', error);
      res.status(500).json({ error: 'Failed to save data', details: error.message });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
